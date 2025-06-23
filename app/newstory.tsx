import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Audio, Video } from "expo-av";
// ---- NEW IMPORT ----
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// ---- CONSTANT FOR STORAGE KEY ----
const STORIES_STORAGE_KEY = "saved_sleep_stories";
export default function NewStory() {
  const [userStory, setUserStory] = useState("");
  const [completedStory, setCompletedStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("Insomnia");
  const handleCompleteStory = async () => {
    setIsLoading(true);
    setIsSaved(false);
    setAudioUri(null);
    setVideoUri(null);
    setCompletedStory(""); // Clear previous story
    const GENERATE_STORY_API_URL =
      "http://192.168.80.123:5000/api/generate-story";
    try {
      const response = await fetch(GENERATE_STORY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          theme: selectedTheme,
          user_words: userStory,
        }),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      if (data.error) {
        Alert.alert("Error", data.error);
        return;
      }
      setCompletedStory(data.story);
      if (data.audio_url) {
        setAudioUri(`http://192.168.80.123:5000${data.audio_url}`);
      }
      if (data.video_url) {
        setVideoUri(`http://192.168.80.123:5000${data.video_url}`);
      }
    } catch (error: any) {
      Alert.alert(
        "Connection Error",
        error.message ||
          "Failed to connect to the server. Please check your network connection."
      );
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // ---- MODIFIED handleSaveStory FUNCTION ----
  const handleSaveStory = async () => {
    if (isSaved) return;
    try {
      // 1. Create the new story object with all necessary data
      const newStory = {
        id: new Date().toISOString(), // Unique ID
        title: userStory.length > 30 ? `${userStory.substring(0, 30)}...` : userStory, // Use intention as title
        originalText: userStory,
        transformedText: completedStory,
        theme: selectedTheme, // e.g., 'Insomnia'
        createdAt: new Date().toISOString(),
        audioUrl: audioUri,
        videoUrl: videoUri,
      };
      // 2. Get existing stories from AsyncStorage
      const existingStoriesJSON = await AsyncStorage.getItem(STORIES_STORAGE_KEY);
      const existingStories = existingStoriesJSON ? JSON.parse(existingStoriesJSON) : [];
      // 3. Add the new story to the beginning of the list
      const updatedStories = [newStory, ...existingStories];
      // 4. Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
      // 5. Update UI state
      setIsSaved(true);
      Alert.alert(
        "Story Saved",
        "Your story has been saved successfully!"
      );
    } catch (error) {
      console.error("Failed to save the story.", error);
      Alert.alert("Save Error", "Could not save the story. Please try again.");
    }
  };
  const playSound = async () => {
    if (!audioUri) return;
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  };
  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... The rest of your JSX remains the same ... */}
       <Text style={styles.title}>Start Your Sleep Story</Text>
      <View style={styles.themeContainer}>
        <Text style={styles.themeLabel}>Sleep Issue:</Text>
        <View style={styles.themeButtons}>
          {["Insomnia", "Nightmares", "Sleep Anxiety"].map((theme) => (
            <Pressable
              key={theme}
              style={[
                styles.themeButton,
                selectedTheme === theme && styles.selectedThemeButton,
              ]}
              onPress={() => setSelectedTheme(theme)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  selectedTheme === theme && styles.selectedThemeButtonText,
                ]}
              >
                {theme}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <TextInput
        style={styles.storyInput}
        placeholder="Type your positive intention (e.g., 'My mind is calm and ready for sleep')"
        placeholderTextColor="#94A3B8"
        multiline
        value={userStory}
        onChangeText={setUserStory}
      />
      <Pressable
        style={[
          styles.completeButton,
          userStory.trim().length === 0 && styles.disabledButton,
        ]}
        onPress={handleCompleteStory}
        disabled={userStory.trim().length === 0 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Feather name="zap" size={20} color="white" />
            <Text style={styles.completeButtonText}>Generate Sleep Story</Text>
          </>
        )}
      </Pressable>
      {completedStory !== "" && (
        <Pressable
          style={[styles.saveButton, isSaved && styles.savedButton]}
          onPress={handleSaveStory}
          disabled={isSaved}
        >
          <MaterialIcons
            name={isSaved ? "bookmark-added" : "bookmark-add"}
            size={20}
            color={isSaved ? "#0284C7" : "white"}
          />
          <Text
            style={[styles.saveButtonText, isSaved && { color: "#0284C7" }]}
          >
            {isSaved ? "Story Saved" : "Save Story"}
          </Text>
        </Pressable>
      )}
      {completedStory !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>:sparkles: Your Sleep Story</Text>
          <Text style={styles.resultText}>{completedStory}</Text>
          <View style={styles.mediaSection}>
            <Text style={styles.mediaLabel}>:loud_sound: Listen</Text>
            {audioUri && (
              <Pressable style={styles.audioButton} onPress={playSound}>
                <Feather name="play" size={24} color="#0EA5E9" />
                <Text style={styles.audioButtonText}>Play Audio</Text>
              </Pressable>
            )}
            <Text style={styles.mediaLabel}>:movie_camera: Watch</Text>
            {videoUri && (
              <Video
                source={{ uri: videoUri }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                style={styles.videoPlayer}
                useNativeControls
              />
            )}
          </View>
          <Pressable
            style={styles.newStoryButton}
            onPress={() => {
              setUserStory("");
              setCompletedStory("");
              setIsSaved(false);
              setAudioUri(null);
              setVideoUri(null);
            }}
          >
            <Text style={styles.newStoryButtonText}>Create Another Story</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
// ---- Styles remain the same ----
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  themeContainer: {
    marginBottom: 20,
  },
  themeLabel: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 8,
  },
  themeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  themeButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedThemeButton: {
    backgroundColor: "#0EA5E9",
  },
  themeButtonText: {
    color: "#475569",
    fontWeight: "500",
  },
  selectedThemeButtonText: {
    color: "white",
  },
  storyInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#334155",
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: "#0EA5E9",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButton: {
    backgroundColor: "#0284C7",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  savedButton: {
    backgroundColor: "#E0F2FE",
    borderColor: "#0284C7",
    borderWidth: 1,
  },
  saveButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#ECFEFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 20,
  },
  mediaSection: {
    gap: 16,
  },
  mediaLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#475569",
    marginBottom: 6,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  audioButtonText: {
    color: "#0EA5E9",
    fontWeight: "600",
  },
  videoPlayer: {
    height: 200,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  newStoryButton: {
    marginTop: 20,
    backgroundColor: "#CBD5E1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  newStoryButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
});