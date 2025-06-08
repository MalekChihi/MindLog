import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// If you use a date picker, you'll need to install one, e.g., @react-native-community/datetimepicker
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// For Firestore integration (add your actual Firebase config and imports)
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db, auth } from './firebaseConfig'; // Your Firebase config file

const MOOD_OPTIONS = [
  { label: 'Refreshed', icon: 'happy-outline', color: '#76C893' },
  { label: 'Okay', icon: 'sad-outline', color: '#F9C74F' }, // Using sad for neutral/okay
  { label: 'Tired', icon: 'cloud-offline-outline', color: '#F8961E' },
  { label: 'Grogy', icon: 'moon-outline', color: '#839AA8' }, // Using moon as a placeholder
];

const LogSleepScreen = ({ navigation }) => {
  const [sleepDate, setSleepDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [timeToBed, setTimeToBed] = useState(''); // e.g., "10:30 PM"
  const [timeWokeUp, setTimeWokeUp] = useState(''); // e.g., "06:45 AM"
  const [sleepQuality, setSleepQuality] = useState<number | null>(null); // 1-5 scale
  const [dreams, setDreams] = useState('');
  const [moodUponWaking, setMoodUponWaking] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // --- Date Picker Logic (Example using react-native-modal-datetime-picker) ---
  // You'd need to install and import this library: npm install react-native-modal-datetime-picker
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date: Date) => {
    setSleepDate(date);
    hideDatePicker();
  };
  // --- End Date Picker Logic ---

  const handleSaveLog = async () => {
    if (!timeToBed || !timeWokeUp || !sleepQuality) {
      Alert.alert("Missing Info", "Please fill in bedtime, wake-up time, and sleep quality.");
      return;
    }

    console.log({
      date: sleepDate.toISOString().split('T')[0], // YYYY-MM-DD
      timeToBed,
      timeWokeUp,
      sleepQuality,
      dreams,
      moodUponWaking,
      notes,
    });


    Alert.alert("Log Saved (Locally)", "Your sleep details have been logged (console).");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate(journal)} style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={28} color="#4A44A0" />
            </TouchableOpacity>
            <Text style={styles.title}>Log Tonight's Sleep</Text>
            <View style={{width: 28}} /> {/* Spacer for centering title */}
          </View>

          {/* Date Picker - Replace with a proper component */}
          <TouchableOpacity onPress={showDatePicker} style={styles.dateInputContainer}>
            <Ionicons name="calendar-outline" size={22} color="#6C63FF" />
            <Text style={styles.dateText}>
              Date: {sleepDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {/*
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            date={sleepDate} // Initial date
          />
          */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time to Bed</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10:30 PM"
              value={timeToBed}
              onChangeText={setTimeToBed}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time Woke Up</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 06:45 AM"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mood Upon Waking</Text>
            <View style={styles.moodSelectionContainer}>
                {MOOD_OPTIONS.map(mood => (
                    <TouchableOpacity
                        key={mood.label}
                        style={[
                            styles.moodButton,
                            moodUponWaking === mood.label && { backgroundColor: mood.color, borderColor: mood.color }
                        ]}
                        onPress={() => setMoodUponWaking(mood.label)}
                    >
                        <Ionicons
                            name={mood.icon as any}
                            size={20}
                            color={moodUponWaking === mood.label ? '#fff' : mood.color}
                            style={{marginRight: 5}}
                        />
                        <Text style={[styles.moodButtonText, moodUponWaking === mood.label && {color: '#fff'}]}>
                            {mood.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dreams (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any notable dreams?"
              value={dreams}
              onChangeText={setDreams}
              multiline
              numberOfLines={3}
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Factors affecting sleep, feelings, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholderTextColor="#aaa"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveLog}>
            <Text style={styles.saveButtonText}>Save Sleep Log</Text>
            <MaterialCommunityIcons name="content-save-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F8', // Same as JournalScreen for consistency
  },
  scrollViewContainer: {
    paddingBottom: 40, // Space for the save button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A44A0',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#A3A0D8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#33305B',
    marginLeft: 10,
  },
  inputGroup: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 15,
    color: '#4A44A0',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#33305B',
    borderWidth: 1,
    borderColor: '#D0D0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top', // For Android
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 3,
    backgroundColor: '#E6E6FA', // Lavender blush
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C0C0E0',
  },
  ratingButtonSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A44A0',
  },
  ratingTextSelected: {
    color: '#FFFFFF',
  },
  moodSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows moods to wrap to next line if needed
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // More rounded
    borderWidth: 1,
    borderColor: '#C0C0E0',
    marginRight: 10,
    marginBottom: 10, // For wrapping
  },
  moodButtonText: {
    fontSize: 13,
    color: '#4A44A0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5CB85C', // A success green
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default LogSleepScreen;