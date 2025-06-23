import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const { width } = Dimensions.get("window");
const JOURNAL_BENEFITS = [
  {
    icon: "search-outline",
    text: "Understand your sleep issues by writing regularly.",
  },
  {
    icon: "leaf-outline",
    text: "Reduce stress and overthinking before bed through journaling.",
  },
  {
    icon: "bulb-outline",
    text: "Identify patterns: like anxiety, phone use, or late meals.",
  },
  {
    icon: "trending-up-outline",
    text: "Empower yourself to make small, consistent positive changes.",
  },
];
const JournalScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Back button */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.back()}
          android_ripple={{ color: "#D3D1F9" }}
        >
          {/* <Ionicons name="arrow-back" size={26} color="#4A44A0" /> */}
          <Link href="/(tabs)" asChild>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={26} color="#4A44A0" />
            </TouchableOpacity>
          </Link>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        {/* Header */}
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons
            name="power-sleep"
            size={44}
            color="#A3A0D8"
          />
          <Text style={styles.headerTitle}>Sleep Journal</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.headerSubtitle}>
            Unlock Better Rest, One Entry at a Time.
          </Text>
        </View>
        {/* Benefits */}
        <View style={styles.benefitsList}>
          {JOURNAL_BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons
                  name={benefit.icon as any}
                  size={28}
                  color="#6C63FF"
                />
              </View>
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </View>
        {/* Buttons */}
        <View style={styles.buttonWrapper}>
          <Link href="./logsleep" asChild>
            <TouchableOpacity style={styles.logButton}>
              <Text style={styles.logButtonText}>Log Tonight's Sleep</Text>
              <Ionicons name="moon-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.buttonWrapper}>
          <Link href="./journalhistory" asChild>
            <TouchableOpacity style={styles.logButton}>
              <Text style={styles.logButtonText}>View Journal History</Text>
              <Ionicons name="book-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FD",
  },
  scrollViewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  backButtonPressed: {
    backgroundColor: "#D3D1F9",
  },
  backText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#4A44A0",
    fontWeight: "600",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A44A0",
    marginTop: 12,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    backgroundColor: "#6C63FF",
    borderRadius: 3,
    marginVertical: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7873C0",
    marginTop: 6,
    textAlign: "center",
    maxWidth: width * 0.8,
    lineHeight: 22,
  },
  benefitsList: {
    marginBottom: 35,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#A3A0D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6E6FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: "#33305B",
    lineHeight: 24,
    fontWeight: "500",
  },
  buttonWrapper: {
    marginBottom: 18,
  },
  logButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: 18,
    borderRadius: 35,
    elevation: 4,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginRight: 12,
  },
});
export default JournalScreen;