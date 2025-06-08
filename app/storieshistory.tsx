import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

type Story = {
  id: string;
  title: string;
  originalText: string;
  transformedText: string;
  createdAt: string;
  mood?: string;
};

export default function StoryHistoryScreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulate loading stories from database
  useEffect(() => {
    const loadStories = async () => {
      // In a real app, this would fetch from your database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStories([
        {
          id: '1',
          title: 'Difficult Work Day',
          originalText: 'I had a terrible meeting with my boss today...',
          transformedText: 'While the meeting with my boss was challenging, it showed me areas where I can grow...',
          createdAt: '2023-06-15T14:30:00',
          mood: 'anxious'
        },
        {
          id: '2',
          title: 'Argument With Friend',
          originalText: 'My friend and I had a big fight about...',
          transformedText: 'The disagreement with my friend helped us understand each other better...',
          createdAt: '2023-06-10T09:15:00',
          mood: 'sad'
        },
        {
          id: '3',
          title: 'Missed Opportunity',
          originalText: 'I failed to get the promotion I wanted...',
          transformedText: 'Not getting this promotion opens new doors I hadn\'t considered...',
          createdAt: '2023-06-05T18:45:00',
          mood: 'disappointed'
        }
      ]);
      setLoading(false);
    };

    loadStories();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMoodIcon = (mood?: string) => {
    switch(mood) {
      case 'happy': return <Feather name="smile" size={16} color="#4ade80" />;
      case 'sad': return <Feather name="frown" size={16} color="#60a5fa" />;
      case 'anxious': return <Feather name="alert-circle" size={16} color="#fbbf24" />;
      case 'angry': return <Feather name="zap" size={16} color="#f87171" />;
      case 'disappointed': return <Feather name="cloud" size={16} color="#a1a1aa" />;
      default: return <Feather name="meh" size={16} color="#a1a1aa" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading your stories...</Text>
      </View>
    );
  }

  if (stories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="history" size={48} color="#d4d4d8" />
        <Text style={styles.emptyTitle}>No Stories Yet</Text>
        <Text style={styles.emptyText}>Your transformed stories will appear here</Text>
        <Link href="/storiesstart" asChild>
          <Pressable style={styles.startWritingButton}>
            <Text style={styles.startWritingButtonText}>Start Writing</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Story History</Text>
        <Text style={styles.subtitle}>Reflect on your journey</Text>
      </View>

      <FlatList
        data={stories}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.storyCard}
            onPress={() => router.push({
              pathname: './storiesdetail',
              params: { 
                id: item.id,
                title: item.title,
                originalText: item.originalText,
                transformedText: item.transformedText,
                createdAt: item.createdAt
              }
            })}
          >
            <View style={styles.storyHeader}>
              <Text style={styles.storyTitle}>{item.title}</Text>
              {getMoodIcon(item.mood)}
            </View>
            <Text style={styles.storyDate}>{formatDate(item.createdAt)}</Text>
            <Text 
              style={styles.storyPreview}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.transformedText}
            </Text>
            <View style={styles.viewContainer}>
              <Text style={styles.viewText}>View Story</Text>
              <Feather name="chevron-right" size={16} color="#3b82f6" />
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3f3f46',
  },
  emptyText: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 24,
  },
  startWritingButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWritingButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  storyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  storyDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  storyPreview: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 16,
  },
});