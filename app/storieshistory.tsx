import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
// ---- NEW IMPORTS ----
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react"; // Import React and useCallback
// --- END NEW IMPORTS ---
import { Feather, MaterialIcons } from "@expo/vector-icons";
// --- CONSTANT FOR STORAGE KEY (should match NewStory.js) ---
const STORIES_STORAGE_KEY = "saved_sleep_stories";
// ---- UPDATED Story TYPE ----
type Story = {
  id: string;
  title: string;
  originalText: string;
  transformedText: string;
  createdAt: string;
  theme?: string; // Changed from mood to theme
  audioUrl?: string | null;
  videoUrl?: string | null;
};
export default function StoryHistoryScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // ---- REPLACED useEffect with useFocusEffect to load real data ----
  useFocusEffect(
    useCallback(() => {
      const loadStories = async () => {
        setLoading(true);
        try {
          const storiesJSON = await AsyncStorage.getItem(STORIES_STORAGE_KEY);
          if (storiesJSON !== null) {
            setStories(JSON.parse(storiesJSON));
          } else {
            setStories([]); // No stories found
          }
        } catch (error) {
          console.error("Failed to load stories from storage", error);
          Alert.alert("Error", "Could not load saved stories.");
        } finally {
          setLoading(false);
        }
      };
      loadStories();
    }, [])
  );
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // ---- RENAMED and UPDATED getMoodIcon to getThemeIcon ----
  const getThemeIcon = (theme?: string) => {
    switch (theme) {
      case "Insomnia":
        return <Feather name="moon" size={16} color="#FBBF24" />;
      case "Nightmares":
        return <Feather name="zap" size={16} color="#F87171" />;
      case "Sleep Anxiety":
        return <Feather name="alert-circle" size={16} color="#60A5FA" />;
      default:
        return <Feather name="bookmark" size={16} color="#A1A1AA" />;
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading your stories...</Text>
      </View>
    );
  }
  if (stories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="history" size={48} color="#D4D4D8" />
        <Text style={styles.emptyTitle}>No Stories Yet</Text>
        <Text style={styles.emptyText}>
          Your saved sleep stories will appear here.
        </Text>
        {/* This link should point to your "New Story" screen's route */}
        <Link href="/" asChild>
          <Pressable style={styles.startWritingButton}>
            <Text style={styles.startWritingButtonText}>Create a Story</Text>
          </Pressable>
        </Link>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Story History</Text>
        <Text style={styles.subtitle}>Reflect on your saved sleep stories</Text>
      </View>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.storyCard}
            onPress={() =>
              router.push({
                pathname: "./storiesdetail", // Assuming this is your detail screen route
                params: {
                  id: item.id,
                  title: item.title,
                  originalText: item.originalText,
                  transformedText: item.transformedText,
                  createdAt: item.createdAt,
                  // You can also pass media URLs to the detail screen if needed
                  audioUrl: item.audioUrl,
                  videoUrl: item.videoUrl,
                },
              })
            }
          >
            <View style={styles.storyHeader}>
              <Text style={styles.storyTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {/* ---- UPDATED ICON FUNCTION CALL ---- */}
              {getThemeIcon(item.theme)}
            </View>
            <Text style={styles.storyDate}>{formatDate(item.createdAt)}</Text>
            <Text
              style={styles.storyPreview}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.transformedText}
            </Text>
            <View style={styles.viewContainer}>
              <Text style={styles.viewText}>View Details</Text>
              <Feather name="chevron-right" size={16} color="#0EA5E9" />
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}
// ---- Styles updated for better consistency ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748B",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3F3F46",
  },
  emptyText: {
    fontSize: 16,
    color: "#71717A",
    textAlign: "center",
    marginBottom: 24,
  },
  startWritingButton: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWritingButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  storyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  storyDate: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  storyPreview: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 16,
  },
});