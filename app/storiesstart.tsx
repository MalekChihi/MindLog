import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const writingPrompts = [
  {
    id: '1',
    title: 'A Difficult Day',
    description: 'Write about a challenging day you experienced',
    prompt: 'Describe what made this day difficult...'
  },
  {
    id: '2',
    title: 'Relationship Challenge',
    description: 'Reflect on a tough interaction with someone',
    prompt: 'What happened and how did it make you feel...'
  },
  {
    id: '3',
    title: 'Personal Struggle',
    description: 'Share something you find hard to deal with',
    prompt: 'Begin by describing the situation...'
  },
  {
    id: 'continue',
    title: 'Continue Your Story',
    description: 'Keep working on a story you started before',
    prompt: 'Continue from where you left off...',
    isContinue: true
  }
];

export default function StoryStartScreen() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const router = useRouter();

  const handleStartWriting = () => {
    if (selectedPrompt) {
      if (selectedPrompt === 'continue') {
        router.push('./storieshistory');
      } else {
        router.push({
          pathname: './storieswrite',
          params: { prompt: selectedPrompt }
        });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="robot-happy" size={32} color="#3b82f6" />
        <Text style={styles.title}>Share Your Experience</Text>
        <Text style={styles.subtitle}>We'll help you find the positive</Text>
      </View>

      <View style={styles.promptsContainer}>
        {writingPrompts.map(item => (
          <Pressable
            key={item.id}
            style={[
              styles.promptCard,
              selectedPrompt === item.id && styles.selectedPrompt,
              item.isContinue && styles.continuePrompt
            ]}
            onPress={() => setSelectedPrompt(item.id)}
          >
            {item.isContinue && (
              <MaterialCommunityIcons 
                name="book-open" 
                size={24} 
                color="#8b5cf6" 
                style={styles.continueIcon}
              />
            )}
            <Text style={styles.promptTitle}>{item.title}</Text>
            <Text style={styles.promptDescription}>{item.description}</Text>
            {!item.isContinue && <Text style={styles.promptText}>"{item.prompt}"</Text>}
            {selectedPrompt === item.id && (
              <Feather name="check-circle" size={24} color="#3b82f6" style={styles.checkIcon} />
            )}
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[
          styles.startButton,
          !selectedPrompt && styles.disabledButton
        ]}
        onPress={handleStartWriting}
        disabled={!selectedPrompt}
      >
        <Text style={styles.startButtonText}>
          {selectedPrompt === 'continue' ? 'View Your Stories' : 'Continue to Writing'}
        </Text>
        <Feather name="arrow-right" size={20} color="white" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  promptsContainer: {
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  continuePrompt: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f5f3ff',
  },
  selectedPrompt: {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f7ff',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  promptDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  promptText: {
    fontStyle: 'italic',
    color: '#3b82f6',
    fontSize: 15,
  },
  continueIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  startButton: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});