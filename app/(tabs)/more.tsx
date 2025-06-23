import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const doctors = [
  {
    id: "1",
    name: "Dr. Zaineb Attia",
    specialty: "Psychiatrist",
    image: require("../../assets/images/chatbot.jpg"),
    phone: "tel:+21612345678",
  },
  {
    id: "2",
    name: "Dr. Islem Hattab ",
    specialty: "Sleep Specialist",
    image: require("../../assets/images/chatbot.jpg"),
    phone: "tel:+21623456789",
  },
  {
    id: "3",
    name: "Dr. Malek Chihi",
    specialty: "Clinical Psychologist",
    image: require("../../assets/images/chatbot.jpg"),
    phone: "tel:+21634567890",
  },
];
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image: any;
  phone: string;
};
const IconButton = ({
  onPress,
  icon,
  color,
}: {
  onPress: () => void;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.iconButton}>
    <Feather name={icon} size={24} color={color} />
  </TouchableOpacity>
);
const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const navigation = useNavigation();
  const handlePhoneCall = () => Linking.openURL(doctor.phone);
  const handleChat = () => navigation.navigate("chatbot" as never);
  const handleReservation = () => navigation.navigate("reservation" as never);
  return (
    <View style={styles.card}>
      <Image source={doctor.image} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.iconRow}>
          <IconButton onPress={handlePhoneCall} icon="phone" color="#2563EB" />
          <IconButton
            onPress={handleChat}
            icon="message-circle"
            color="#10B981"
          />
          <IconButton
            onPress={handleReservation}
            icon="calendar"
            color="#F59E0B"
          />
        </View>
      </View>
    </View>
  );
};
export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Specialists</Text>
      <Text style={styles.subtitle}>
        Browse our list of trusted professionals and connect by call, chat, or
        appointment.
      </Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FD", // match dashboard background
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2C3E50", // dark blue-gray, matching other pages
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#7F8C8D", // medium gray text for subtitle
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: "500",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  specialty: {
    fontSize: 14,
    color: "#6B7280",
    marginVertical: 6,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  iconButton: {
    marginRight: 24,
    padding: 6,
    borderRadius: 10,
  },
});






