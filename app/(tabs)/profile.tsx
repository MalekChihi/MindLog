import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MOCK_USER_INITIAL = {};

const DEFAULT_PROFILE_PIC =
  'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

const MOCK_BADGES = [
  { id: '1', name: 'Mindful Starter', icon: 'brain', color: '#FFD700', dateEarned: 'Oct 10' },
  { id: '2', name: '7-Day Streak', icon: 'calendar-check', color: '#4CAF50', dateEarned: 'Oct 17' },
  { id: '3', name: 'Journal Pro', icon: 'pencil-alt', color: '#2196F3', dateEarned: 'Oct 20' },
  { id: '4', name: 'Zen Master', icon: 'spa', color: '#9C27B0', dateEarned: 'Nov 01' },
  { id: '5', name: 'Early Riser', icon: 'sun', color: '#FF9800', dateEarned: 'Nov 05' },
];

const MOCK_SLEEP_AIDS = [
  { id: '1', name: 'Guided Sleep Meditation', icon: 'moon', type: 'audio', action: 'navigate_meditation' },
  { id: '2', name: 'Limit Blue Light Exposure', icon: 'tablet-android', type: 'tip', action: 'show_blue_light_tip' },
  { id: '3', name: 'Consistent Sleep Schedule', icon: 'clock-outline', type: 'habit', action: 'navigate_schedule_info' },
  { id: '4', name: 'Avoid Caffeine Before Bed', icon: 'coffee-off', type: 'tip', action: 'show_caffeine_tip' },
];

const moodMap: { [key: string]: { emoji: string; label: string } } = {
  happy: { emoji: '😄', label: 'Happy' },
  good: { emoji: '😊', label: 'Good' },
  okay: { emoji: '😐', label: 'Okay' },
  sad: { emoji: '😟', label: 'Sad' },
  awful: { emoji: '😢', label: 'Awful' },
};

export default function ProfileScreen() {
  const [user, setUser] = useState(MOCK_USER_INITIAL);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [badges, setBadges] = useState(MOCK_BADGES);
  const [sleepAids, setSleepAids] = useState(MOCK_SLEEP_AIDS);
  const [currentMood, setCurrentMood] = useState<{ emoji: string; label: string } | null>(null);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser((prev) => ({ ...prev, name: parsedUser.name || prev.name }));
        if (parsedUser.profilePicUrl) {
          setProfileImageUri(parsedUser.profilePicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  fetchUserData();
}, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (galleryStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
        Alert.alert('Permissions required', 'Sorry, we need camera and gallery permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const imageUri = result.assets[0].uri;
      setProfileImageUri(imageUri);
      console.log('Image picked from gallery:', imageUri);
    }
  };

  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const imageUri = result.assets[0].uri;
      setProfileImageUri(imageUri);
      console.log('Photo taken:', imageUri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Change Profile Picture', 'Choose an option', [
      { text: 'Choose from Gallery', onPress: pickImageFromGallery },
      { text: 'Take Photo', onPress: takePhotoWithCamera },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSleepAidPress = (action: string, name: string) => {
    if (action === 'show_blue_light_tip') {
      Alert.alert('Limit Blue Light Exposure', 'Tips to reduce blue light before sleep...');
    } else if (action === 'navigate_meditation') {
      Alert.alert('Guided Meditation', `Opening meditation for: ${name}`);
    } else {
      Alert.alert('Sleep Tip', `Information about: ${name}`);
    }
  };

  const renderBadgeItem = ({ item }: { item: typeof MOCK_BADGES[0] }) => (
    <View style={styles.badgeItemContainer}>
      <View style={[styles.badgeIconCircle, { backgroundColor: `${item.color}30` }]}>
        <FontAwesome5 name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.badgeName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.badgeDate}>{item.dateEarned}</Text>
    </View>
  );

  const renderSleepAidItem = ({ item }: { item: typeof MOCK_SLEEP_AIDS[0] }) => (
    <TouchableOpacity style={styles.sleepAidItem} onPress={() => handleSleepAidPress(item.action, item.name)}>
      <View style={styles.sleepAidIconContainer}>
        <MaterialCommunityIcons name={item.icon as any} size={22} color="#58A6FF" />
      </View>
      <Text style={styles.sleepAidName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={showImagePickerOptions} style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageUri || DEFAULT_PROFILE_PIC }} style={styles.profileImage} />
          <View style={styles.editIconOverlay}>
            <Feather name="edit-2" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user.name || 'User'}</Text>
        {currentMood ? (
          <View style={styles.moodDisplay}>
            <Text style={styles.moodEmoji}>{currentMood.emoji}</Text>
            <Text style={styles.moodText}>Feeling {currentMood.label} Today</Text>
          </View>
        ) : (
          <Text style={styles.moodNotSetText}>Mood not logged today</Text>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Wellness Journey</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Weekly Goals</Text>
            <Text style={styles.progressPercentage}>75%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity onPress={() => console.log('See all badges')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={badges}
          renderItem={renderBadgeItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeListContainer}
        />
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sleep Support</Text>
        </View>
        {sleepAids.slice(0, 3).map((item) => renderSleepAidItem({ item }))}
        {sleepAids.length > 3 && (
          <TouchableOpacity style={styles.seeMoreSleepAids} onPress={() => console.log('See all sleep aids')}>
            <Text style={styles.seeMoreSleepAidsText}>View All Sleep Resources</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('./more')}>
          <Feather name="settings" size={20} color="#4A5568" style={styles.actionButtonIcon} />
          <Text style={styles.actionButtonText}>App Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', onPress: () => router.replace('/sign-in') },
            ]);
          }}
        >
          <Feather name="log-out" size={20} color="#EF4444" style={styles.actionButtonIcon} />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Styles remain largely the same as your previous complete code
// ... (Paste the full styles from the previous complete code here)
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#60A5FA',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E0E0E0', // Placeholder color while image loads or if none
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 15,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  moodNotSetText: {
    fontSize: 14,
    color: '#E0F2FE',
    fontStyle: 'italic',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionHeader: {
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
    color: '#3B82F6',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 5,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E0E7FF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#60A5FA',
    borderRadius: 5,
  },
  badgeListContainer: {
    paddingVertical: 5,
  },
  badgeItemContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  badgeIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeDate: {
    fontSize: 10,
    color: '#718096',
  },
  sleepAidItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sleepAidIconContainer: {
    backgroundColor: '#E0F2FE',
    padding: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  sleepAidName: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
  },
  seeMoreSleepAids: {
    marginTop: 15,
    alignItems: 'center',
  },
  seeMoreSleepAidsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  footerActions: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 12,
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonIcon: {
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  logoutButton: {
    borderColor: '#FCA5A5',
  },
  logoutButtonText: {
    color: '#EF4444',
  },
});