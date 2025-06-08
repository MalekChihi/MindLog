import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router'; // useRouter is not used, useLocalSearchParams will be removed
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function StoryWriteScreen() {
  // const { prompt } = useLocalSearchParams(); // REMOVED: No longer fetching the prompt
  const [userStory, setUserStory] = useState('');
  const [transformedStory, setTransformedStory] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  // const router = useRouter(); // REMOVED: Not used in the provided code snippet

  const handleTransformStory = async () => {
    setIsTransforming(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, this would call your AI API
    const aiResponse = transformStoryWithAI(userStory);
    setTransformedStory(aiResponse);
    setIsTransforming(false);
  };

  // Mock AI transformation function
  const transformStoryWithAI = (story: string) => {
    return `While the situation you described was challenging, I can see many strengths in how you handled it. ${story.replace(/difficult|hard|sad/gi, matched => {
      return {
        'difficult': 'growth opportunity',
        'hard': 'valuable experience',
        'sad': 'moment of reflection'
      }[matched.toLowerCase()] || matched;
    })}. This shows your resilience and ability to learn from life's experiences.`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Story</Text>
        {/* <Text style={styles.promptText}>"{prompt}"</Text> */} {/* REMOVED: No longer displaying the prompt */}
      </View>

      <TextInput
        style={styles.storyInput}
        placeholder="Write your experience here..."
        placeholderTextColor="#94a3b8"
        multiline
        value={userStory}
        onChangeText={setUserStory}
      />

      {!transformedStory ? (
        <Pressable
          style={[
            styles.transformButton,
            userStory.trim().length === 0 && styles.disabledButton
          ]}
          onPress={handleTransformStory}
          disabled={userStory.trim().length === 0 || isTransforming}
        >
          {isTransforming ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Feather name="wand" size={20} color="white" />
              <Text style={styles.transformButtonText}>Transform My Story</Text>
            </>
          )}
        </Pressable>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <MaterialIcons name="auto-awesome" size={24} color="#f59e0b" />
            <Text style={styles.resultTitle}>Hopeful Perspective</Text>
          </View>
          <Text style={styles.resultText}>{transformedStory}</Text>

          <Pressable
            style={styles.newStoryButton}
            onPress={() => {
              setUserStory('');
              setTransformedStory('');
            }}
          >
            <Text style={styles.newStoryButtonText}>Write Another Story</Text>
          </Pressable>
        </View>
      )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    // marginBottom: 8, // Adjusted slightly as prompt is removed, or keep as is
  },
  // promptText style is no longer needed unless used elsewhere
  // promptText: {
  //   fontSize: 16,
  //   color: '#64748b',
  //   fontStyle: 'italic',
  // },
  storyInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#334155',
    marginBottom: 20,
  },
  transformButton: {
    backgroundColor: '#8b5cf6',
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
  transformButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  resultContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15803d',
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
    marginBottom: 16,
  },
  newStoryButton: {
    backgroundColor: '#e2e8f0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  newStoryButtonText: {
    color: '#334155',
    fontWeight: '600',
  },
});