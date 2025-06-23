import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const SLEEP_LOGS_STORAGE_KEY = "@sleep_logs"; // Use the same key
const JournalHistoryScreen = () => {
  const navigation = useNavigation();
  const [sleepLogs, setSleepLogs] = React.useState([]);
  // useFocusEffect runs every time the screen comes into view
  useFocusEffect(
    React.useCallback(() => {
      const loadLogs = async () => {
        try {
          const logsJSON = await AsyncStorage.getItem(SLEEP_LOGS_STORAGE_KEY);
          if (logsJSON !== null) {
            const parsedLogs = JSON.parse(logsJSON);
            // Convert date strings from storage back into Date objects for display
            const logsWithDateObjects = parsedLogs.map((log) => ({
              ...log,
              date: new Date(log.date),
            }));
            setSleepLogs(logsWithDateObjects);
          }
        } catch (e) {
          console.error("Failed to load logs from storage", e);
        }
      };
      loadLogs();
    }, []) // The callback itself doesn't change, so the dependency array is empty
  );
  const renderLogItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.logItemContainer}
        onPress={() => {
          // You could navigate to a detailed view here if you want
          // navigation.navigate('LogDetailScreen', { log: item });
        }}
      >
        <View style={styles.logItemHeader}>
          <Text style={styles.logDate}>
            {item.date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
          {/* Display emotional summary if analysis exists */}
          {item.analysis?.emotional_summary && (
            <View style={styles.moodIndicator}>
              <Ionicons name="sparkles-outline" size={16} color="#4A44A0" />
              <Text style={styles.moodText} numberOfLines={1}>
                {item.analysis.emotional_summary}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.logDetailsRow}>
          <View style={styles.logDetail}>
            <MaterialCommunityIcons
              name="bed-clock"
              size={18}
              color="#6C63FF"
            />
            <Text style={styles.logDetailText}>
              {item.timeToBed} - {item.timeWokeUp}
            </Text>
          </View>
          <View style={styles.logDetail}>
            <Ionicons name="star-outline" size={18} color="#FFD700" />
            <Text style={styles.logDetailText}>
              Quality: {item.sleepQuality}/5
            </Text>
          </View>
        </View>
        {item.notes && (
          <Text style={styles.notesPreview} numberOfLines={2}>
            <Text style={{ fontWeight: "bold" }}>Notes: </Text>
            {item.notes}
          </Text>
        )}
        {/* Display the rest of the analysis if it exists */}
        {item.analysis && !item.analysis.error && (
          <View style={styles.analysisSection}>
            <Text style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Possible Cause: </Text>
              {item.analysis.possible_cause}
            </Text>
            <Text style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Supportive Tip: </Text>
              {item.analysis.supportive_tip}
            </Text>
            <Text style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>For Reflection: </Text>
              {item.analysis.reflection_question}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Simple goBack is fine
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={28} color="#4A44A0" />
        </TouchableOpacity>
        <Text style={styles.title}>Sleep Journal History</Text>
        <View style={{ width: 28 }} />
      </View>
      {sleepLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="sleep-off" size={60} color="#B0B0E0" />
          <Text style={styles.emptyText}>No sleep logs yet.</Text>
          <Text style={styles.emptySubText}>
            Start logging your sleep to see your history here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={sleepLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F0F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  backButton: { padding: 5 },
  title: { fontSize: 20, fontWeight: "bold", color: "#4A44A0" },
  listContentContainer: { padding: 15 },
  logItemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#A3A0D8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  logItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logDate: { fontSize: 17, fontWeight: "600", color: "#33305B" },
  moodIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: "#E6E6FA",
    flexShrink: 1,
  },
  moodText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 5,
    color: "#4A44A0",
  },
  logDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  logDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  logDetailText: { fontSize: 13, color: "#505070", marginLeft: 6 },
  notesPreview: {
    fontSize: 13,
    color: "#606080",
    fontStyle: "italic",
    marginTop: 5,
    lineHeight: 18,
  },
  separator: { height: 12 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A44A0",
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: "#7873C0",
    textAlign: "center",
    marginTop: 8,
  },
  // --- New Styles for Analysis Section ---
  analysisSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F8",
  },
  analysisItem: {
    fontSize: 12,
    color: "#33305B",
    marginBottom: 4,
    lineHeight: 16,
  },
  analysisLabel: {
    fontWeight: "bold",
    color: "#6C63FF",
  },
});
export default JournalHistoryScreen;