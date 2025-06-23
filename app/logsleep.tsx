
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// --- CONFIGURATION ---
const ANALYZE_JOURNAL_API_URL =
  "http://192.168.80.123:5000/api/journal/analyze";
const SLEEP_LOGS_STORAGE_KEY = "@sleep_logs";
// --- TYPES ---
interface AnalysisResult {
  emotional_summary?: string;
  possible_cause?: string;
  supportive_tip?: string;
  reflection_question?: string;
  error?: string;
}
// --- 2. REMOVE navigation from props interface ---
interface LogSleepScreenProps {
  // navigation is no longer needed here
}
// --- 3. REMOVE navigation from the component's arguments ---
const LogSleepScreen: React.FC<LogSleepScreenProps> = () => {
  // --- 4. GET navigation from the hook instead ---
  const navigation = useNavigation();
  // ... All other states remain the same ...
  const [sleepDate, setSleepDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeToBed, setTimeToBed] = useState("");
  const [timeWokeUp, setTimeWokeUp] = useState("");
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [showEmotionalAnalysis, setShowEmotionalAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // ... No changes needed in handleAnalyzeMood ...
  const handleAnalyzeMood = async () => {
    if (notes.trim().length < 10) {
      Alert.alert(
        "Not Enough Text",
        "Please write a little more about your feelings..."
      );
      return;
    }
    setIsAnalyzing(true);
    setShowEmotionalAnalysis(false);
    try {
      const token = await AsyncStorage.getItem("user_token");
      if (!token) {
        throw new Error("Please login again. No authentication token found.");
      }
      const response = await fetch(ANALYZE_JOURNAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entry: notes }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }
      const data = await response.json();
      setAnalysisResult(data);
      setShowEmotionalAnalysis(true);
    } catch (error: any) {
      console.error("Full error:", error);
      Alert.alert("Error", error.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSaveLog = async () => {
    if (!timeToBed || !timeWokeUp || !sleepQuality) {
      Alert.alert(
        "Missing Info",
        "Please fill in bedtime, wake-up time, and sleep quality."
      );
      return;
    }
    const newLogEntry = {
      id: Date.now().toString(),
      date: sleepDate.toISOString(),
      timeToBed,
      timeWokeUp,
      sleepQuality,
      notes,
      analysis: analysisResult,
    };
    try {
      const existingLogsJSON = await AsyncStorage.getItem(
        SLEEP_LOGS_STORAGE_KEY
      );
      const existingLogs = existingLogsJSON ? JSON.parse(existingLogsJSON) : [];
      const updatedLogs = [newLogEntry, ...existingLogs];
      await AsyncStorage.setItem(
        SLEEP_LOGS_STORAGE_KEY,
        JSON.stringify(updatedLogs)
      );
      Alert.alert("Log Saved", "Your sleep details have been logged.");
      // The navigation object from the hook will be defined here.
      navigation.goBack();
    } catch (e) {
      // Now if an error happens, it will be a true storage error.
      console.error("Failed to save log to storage", e);
      Alert.alert("Save Error", "Could not save your entry. Please try again.");
    }
  };
  // --- The rest of the component's JSX remains exactly the same ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back-outline" size={28} color="#4A44A0" />
            </TouchableOpacity>
            <Text style={styles.title}>Sleep Tracker</Text>
            <View style={{ width: 28 }} />
          </View>
          {/* Sleep Tracking Section */}
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            style={styles.dateInputContainer}
          >
            <Ionicons name="calendar-outline" size={22} color="#6C63FF" />
            <Text style={styles.dateText}>
              Date: {sleepDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bedtime</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10:30 PM"
              value={timeToBed}
              onChangeText={setTimeToBed}
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wake-up Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 6:45 AM"
              value={timeWokeUp}
              onChangeText={setTimeWokeUp}
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sleep Quality (1-5)</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    sleepQuality === rating && styles.ratingButtonSelected,
                  ]}
                  onPress={() => setSleepQuality(rating)}
                >
                  <Text
                    style={[
                      styles.ratingText,
                      sleepQuality === rating && styles.ratingTextSelected,
                    ]}
                  >
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Mood Analysis Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>How are you feeling today?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your thoughts, emotions, or anything on your mind..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                isAnalyzing && styles.disabledButton,
              ]}
              onPress={handleAnalyzeMood}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons
                  name="brain"
                  size={20}
                  color="#FFFFFF"
                />
              )}
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? "Analyzing..." : "Analyze My Mood"}
              </Text>
            </TouchableOpacity>
            {showEmotionalAnalysis && analysisResult && (
              <View style={styles.analysisContainer}>
                {analysisResult.error ? (
                  <Text style={[styles.analysisText, { color: "red" }]}>
                    {analysisResult.error}
                  </Text>
                ) : (
                  <>
                    <Text style={styles.analysisTitle}>Emotional Summary:</Text>
                    <Text style={styles.analysisText}>
                      {analysisResult.emotional_summary}
                    </Text>
                    <Text style={styles.analysisTitle}>Possible Cause:</Text>
                    <Text style={styles.analysisText}>
                      {analysisResult.possible_cause}
                    </Text>
                    <Text style={styles.analysisTitle}>Supportive Tip:</Text>
                    <Text style={styles.analysisText}>
                      {analysisResult.supportive_tip}
                    </Text>
                    {/* <Text style={styles.analysisTitle}>
                      Reflection Question:
                    </Text> */}
                    <Text style={styles.analysisText}>
                      {analysisResult.reflection_question}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLog}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F0F8" },
  scrollViewContainer: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: { padding: 5 },
  title: { fontSize: 20, fontWeight: "bold", color: "#4A44A0" },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#A3A0D8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateText: { fontSize: 16, color: "#33305B", marginLeft: 10 },
  inputGroup: { marginHorizontal: 20, marginTop: 20 },
  label: { fontSize: 15, color: "#4A44A0", marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#33305B",
    borderWidth: 1,
    borderColor: "#D0D0E0",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 3,
    backgroundColor: "#E6E6FA",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C0C0E0",
  },
  ratingButtonSelected: { backgroundColor: "#6C63FF", borderColor: "#6C63FF" },
  ratingText: { fontSize: 16, fontWeight: "bold", color: "#4A44A0" },
  ratingTextSelected: { color: "#FFFFFF" },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    gap: 8,
  },
  analyzeButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  disabledButton: { opacity: 0.7, backgroundColor: "#A9A3FF" },
  analysisContainer: {
    backgroundColor: "#F8F9FF",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#6C63FF",
  },
  analysisTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4A44A0",
    marginTop: 8,
  },
  analysisText: {
    fontSize: 14,
    color: "#33305B",
    marginBottom: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
  },
  loadingText: { marginLeft: 10, color: "#6C63FF", fontSize: 14 },
});
export default LogSleepScreen;