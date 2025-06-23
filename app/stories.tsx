
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
export default function StoriesScreen() {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const benefits = [
    "Transform difficult experiences through storytelling",
    "AI helps reframe your story in a positive light",
    "Process emotions in a safe, guided way",
    "Discover hopeful perspectives automatically",
  ];
  const savedStories = [
    {
      id: "1",
      date: "2023-06-15",
      title: "A Difficult Work Day",
      preview: "I had a challenging meeting with my boss...",
    },
    {
      id: "2",
      date: "2023-06-10",
      title: "Argument With Friend",
      preview: "My friend and I disagreed about...",
    },
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* :white_check_mark: Top bar with back and history */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.navigate("(tabs)")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("storieshistory")}
          style={styles.historyButton}
        >
          <Feather name="book-open" size={20} color="#1E293B" />
          <Text style={styles.historyText}>History</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Story Transformation Therapy</Text>
        <Text style={styles.subtitle}>Reframe Your Experiences with AI</Text>
      </View>
      <Image
        source={require("../assets/images/stories.jpg")}
        style={styles.heroImage}
      />
      <Text style={styles.description}>
        Write about a challenging experience, and our AI will help you discover
        a more hopeful perspective.
      </Text>
      {/* <Link href="./storiesstart" asChild>
        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Begin New Story</Text>
          <Feather name="plus" size={20} color="white" />
        </Pressable>
      </Link> */}
      <Link href="./newstory" asChild>
        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Begin New Story</Text>
          <Feather name="plus" size={20} color="white" />
        </Pressable>
      </Link>
      {/* :white_check_mark: Conditionally show saved stories */}
      {showHistory && savedStories.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Your Story History</Text>
          <FlatList
            data={savedStories}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.storyItem}>
                <Text style={styles.storyDate}>{item.date}</Text>
                <Text style={styles.storyTitle}>{item.title}</Text>
                <Text style={styles.storyPreview}>{item.preview}</Text>
                <View style={styles.storyActions}>
                  <Pressable style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </Pressable>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        </View>
      )}
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Feather name="check-circle" size={20} color="#4ADE80" />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F8FAFC",
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#1E293B",
    fontWeight: "600",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  heroImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    textAlign: "center",
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  startButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  historyContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  storyItem: {
    paddingVertical: 12,
  },
  storyDate: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  storyPreview: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  storyActions: {
    flexDirection: "row",
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },
  benefitsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    flex: 1,
  },
})