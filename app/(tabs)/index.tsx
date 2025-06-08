import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Data for Cards ---
const workOnTodayData = [
  {
    id: '1',
    title: 'Journal',
    image: require('../../assets/images/journal.jpg'),
    bgColor: '#D6E4FF',
    textColor: '#3A506B',
    route: '/journal',
  },
  {
    id: '2',
    title: 'Chatbot',
    image: require('../../assets/images/chatbot.jpg'),
    bgColor: '#FFE9D6',
    textColor: '#6B4F3A',
    route: '/chatbot',
  },
  {
    id: '3',
    title: 'Stories',
    image: require('../../assets/images/stories.jpg'),
    bgColor: '#D6FFD6',
    textColor: '#3A6B3A',
    route: '/stories',
  },
];

const moodEmojis = [
  { id: 'happy', emoji: '😄', label: 'Happy' },
  { id: 'good', emoji: '😊', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '😟', label: 'Sad' },
  { id: 'awful', emoji: '😢', label: 'Awful' },
];

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function DashboardScreen() {
  const [userName, setUserName] = useState('Malek');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const openDrawer = () => {
    console.log('Open Drawer');
    // router.push('/menu');
  };

  const viewProfile = () => {
    console.log('View Profile');
    router.push('/(tabs)/profile');
  };

  const seeAllWorkOn = () => {
    console.log('See All Work On');
    // router.push('/work-on-categories');
  };

  const handleCardPress = (item: typeof workOnTodayData[0]) => {
    console.log('Pressed:', item.title);
    if (item.route) {
      router.push(item.route);
    } else {
      console.warn('No route defined for', item.title);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    console.log('Mood selected:', moodId);
  };

  const renderWorkOnItem = ({ item }: { item: typeof workOnTodayData[0] }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.bgColor, width: CARD_WIDTH }]}
      onPress={() => handleCardPress(item)}
    >
      <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
      <Text style={[styles.cardTitle, { color: item.textColor }]}>{item.title}</Text>
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
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.greetingHeader}>Hello {userName}</Text>
        <Text style={styles.greetingSubheader}>How are you feeling today?</Text>

        <View style={styles.moodTrackerContainer}>
          {moodEmojis.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodEmojiButton,
                selectedMood === mood.id && styles.moodEmojiSelected,
              ]}
              onPress={() => handleMoodSelect(mood.id)}
            >
              <Text style={styles.moodEmojiText}>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>What do you want to work on today?</Text>
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
    backgroundColor: '#F4F7FD',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  greetingSubheader: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 25,
  },
  moodTrackerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  moodEmojiButton: {
    padding: 8,
    borderRadius: 20,
  },
  moodEmojiSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  moodEmojiText: {
    fontSize: 28,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
