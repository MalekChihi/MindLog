import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Add this

// Placeholder data - replace with actual data fetching
const PLACEHOLDER_LOGS = [
  {
    id: '1',
    date: new Date('2023-10-26T00:00:00'),
    timeToBed: '10:30 PM',
    timeWokeUp: '06:30 AM',
    sleepQuality: 4,
    moodUponWaking: 'Refreshed',
    notesPreview: 'Felt pretty good, had a productive morning...',
  },
  {
    id: '2',
    date: new Date('2023-10-25T00:00:00'),
    timeToBed: '11:15 PM',
    timeWokeUp: '07:00 AM',
    sleepQuality: 3,
    moodUponWaking: 'Okay',
    notesPreview: 'A bit restless, but overall okay sleep. Woke up once.',
  },
  {
    id: '3',
    date: new Date('2023-10-24T00:00:00'),
    timeToBed: '09:45 PM',
    timeWokeUp: '05:30 AM',
    sleepQuality: 5,
    moodUponWaking: 'Refreshed',
    notesPreview: 'Slept like a baby! Best sleep in a while.',
  },
  {
    id: '4',
    date: new Date('2023-10-23T00:00:00'),
    timeToBed: '12:00 AM',
    timeWokeUp: '07:30 AM',
    sleepQuality: 2,
    moodUponWaking: 'Tired',
    notesPreview: 'Stayed up too late, feeling it today.',
  },
];

const MOOD_OPTIONS = [
  { label: 'Refreshed', icon: 'happy-outline', color: '#76C893' },
  { label: 'Okay', icon: 'sad-outline', color: '#F9C74F' },
  { label: 'Tired', icon: 'cloud-offline-outline', color: '#F8961E' },
  { label: 'Grogy', icon: 'moon-outline', color: '#839AA8' },
];

const getMoodDetails = (moodLabel: string | null | undefined) => {
  const mood = MOOD_OPTIONS.find(m => m.label === moodLabel);
  if (mood) {
    return { icon: mood.icon, color: mood.color };
  }
  return { icon: 'help-circle-outline', color: '#808080' }; // Default/Unknown
};

const JournalHistoryScreen = () => {
  const navigation = useNavigation(); // ✅ Safe and reliable
  const [sleepLogs, setSleepLogs] = React.useState(PLACEHOLDER_LOGS);

  const renderLogItem = ({ item }) => {
    const moodDetails = getMoodDetails(item.moodUponWaking);
    return (
      <TouchableOpacity
        style={styles.logItemContainer}
        onPress={() => {
          console.log("View log details:", item.id);
          // navigation.navigate('LogDetailScreen', { logId: item.id }); // optional
        }}
      >
        <View style={styles.logItemHeader}>
          <Text style={styles.logDate}>
            {item.date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          <View style={styles.moodIndicator}>
            <Ionicons name={moodDetails.icon as any} size={18} color={moodDetails.color} />
            <Text style={[styles.moodText, { color: moodDetails.color }]}>
              {item.moodUponWaking}
            </Text>
          </View>
        </View>

        <View style={styles.logDetailsRow}>
          <View style={styles.logDetail}>
            <MaterialCommunityIcons name="bed-clock" size={18} color="#6C63FF" />
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

        {item.notesPreview && (
          <Text style={styles.notesPreview} numberOfLines={2}>
            Notes: {item.notesPreview}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('journal')} // ✅ Fixed quote
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A44A0',
  },
  listContentContainer: {
    padding: 15,
  },
  logItemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#A3A0D8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  logItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 17,
    fontWeight: '600',
    color: '#33305B',
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#F0F0F8',
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  logDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  logDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  logDetailText: {
    fontSize: 13,
    color: '#505070',
    marginLeft: 6,
  },
  notesPreview: {
    fontSize: 13,
    color: '#606080',
    fontStyle: 'italic',
    marginTop: 5,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A44A0',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7873C0',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default JournalHistoryScreen;
