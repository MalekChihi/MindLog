import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; // ✅ useRouter for back button

const { width } = Dimensions.get('window');

const JOURNAL_BENEFITS = [
  {
    icon: 'search-outline',
    text: 'Understand your sleep issues by writing regularly.',
  },
  {
    icon: 'leaf-outline',
    text: 'Reduce stress and overthinking before bed through journaling.',
  },
  {
    icon: 'bulb-outline',
    text: 'Identify patterns: like anxiety, phone use, or late meals.',
  },
  {
    icon: 'trending-up-outline',
    text: 'Empower yourself to make small, consistent positive changes.',
  },
];

const JournalScreen = () => {
  const router = useRouter(); // ✅ hook for navigation

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* ✅ Back button in top left */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="#4A44A0" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="power-sleep" size={40} color="#A3A0D8" />
          <Text style={styles.headerTitle}>Sleep Journal</Text>
          <Text style={styles.headerSubtitle}>Unlock Better Rest, One Entry at a Time.</Text>
        </View>

        <View style={styles.benefitsList}>
          {JOURNAL_BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Ionicons name={benefit.icon as any} size={24} color="#6C63FF" />
              </View>
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </View>

        {/* ✅ Link to logscreen */}
        {/* ✅ Log sleep button */}
{/* ✅ Log sleep button */}
<View style={styles.buttonWrapper}>
  <Link href="./logsleep" asChild>
    <TouchableOpacity style={styles.logButton}>
      <Text style={styles.logButtonText}>Log Tonight's Sleep</Text>
      <Ionicons name="moon-outline" size={22} color="#FFFFFF" />
    </TouchableOpacity>
  </Link>
</View>

{/* ✅ Journal history button */}
<View style={styles.buttonWrapper}>
  <Link href="./journalhistory" asChild>
    <TouchableOpacity style={styles.logButton}>
      <Text style={styles.logButtonText}>View Journal History</Text>
      <Ionicons name="book-outline" size={22} color="#FFFFFF" />
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
    backgroundColor: '#F0F0F8',
  },
  scrollViewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonWrapper: {
  marginBottom: 15, // or adjust as needed
},
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#4A44A0',
    fontWeight: '600',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A44A0',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#7873C0',
    marginTop: 5,
    textAlign: 'center',
  },
  benefitsList: {
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#A3A0D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  benefitText: {
    flex: 1,
    fontSize: 14.5,
    color: '#33305B',
    lineHeight: 22,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default JournalScreen;
