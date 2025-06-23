import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Data for Cards ---
const workOnTodayData = [
  {
    id: "1",
    title: "Journal",
    image: require("../../assets/images/journal.jpg"),
    bgColor: "#FFFFFF", // white background for all except Play with me!
    textColor: "#3A506B",
    route: "/journal",
  },
  {
    id: "2",
    title: "Chatbot",
    image: require("../../assets/images/chatbot.jpg"),
    bgColor: "#FFFFFF",
    textColor: "#3A506B",
    route: "/chatbot",
  },
  {
    id: "3",
    title: "Stories",
    image: require("../../assets/images/stories.jpg"),
    bgColor: "#FFFFFF",
    textColor: "#3A506B",
    route: "/stories",
  },
  {
    id: "4",
    title: "Play with me!",
    image: require("../../assets/images/game.jpg"),
    bgColor: "#FFFFFF", // blue background for Play with me!
    textColor: "#3A506B", // white text for contrast
    route: "/gamification",
  },
];

// const moodEmojis = [
//   { id: "happy", emoji: "😄", label: "Happy" },
//   { id: "good", emoji: "😊", label: "Good" },
//   { id: "okay", emoji: "😐", label: "Okay" },
//   { id: "sad", emoji: "😟", label: "Sad" },
//   { id: "awful", emoji: "😢", label: "Awful" },
// ];

const { width } = Dimensions.get("window");
const CARD_MARGIN = 20; // increased margin for spacing
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function DashboardScreen() {
  // const [userName, setUserName] = useState("Malek");
  // const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const openDrawer = () => {
    console.log("Open Drawer");
    // router.push('/menu');
  };

  const viewProfile = () => {
    console.log("View Profile");
    router.push("/(tabs)/profile");
  };

  const seeAllWorkOn = () => {
    console.log("See All Work On");
    // router.push('/work-on-categories');
  };

  const handleCardPress = (item: (typeof workOnTodayData)[0]) => {
    console.log("Pressed:", item.title);
    if (item.route) {
      router.push(item.route);
    } else {
      console.warn("No route defined for", item.title);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    console.log("Mood selected:", moodId);
  };

  const renderWorkOnItem = ({
    item,
  }: {
    item: (typeof workOnTodayData)[0];
  }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.bgColor, width: CARD_WIDTH },
      ]}
      onPress={() => handleCardPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={item.image}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={[styles.cardTitle, { color: item.textColor }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={openDrawer}>
            <Feather name="menu" size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={viewProfile}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.greetingHeader}>Welcome to MindLog</Text>
        <Text style={styles.greetingSubheader}>
          Counting sheep? Let’s chat and help your mind drift to dreamland! 💤{" "}
        </Text>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>
            What do you want to work on today?
          </Text>
          <TouchableOpacity onPress={seeAllWorkOn}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={workOnTodayData}
          renderItem={renderWorkOnItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FD",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 25,
    marginBottom: 20,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#3498DB", // subtle accent border for profile
  },
  greetingHeader: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 6,
  },
  greetingSubheader: {
    fontSize: 17,
    color: "#7F8C8D",
    marginBottom: 30,
    lineHeight: 24,
    fontWeight: "500",
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  seeAllText: {
    fontSize: 15,
    color: "#3498DB",
    fontWeight: "600",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 30, // increased spacing between rows
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: CARD_MARGIN,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 5,
  },
  cardImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});