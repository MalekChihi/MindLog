// ChatHistory.tsx (Corrected and Refactored)

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {  Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// --- DEFINE YOUR HARDCODED IP ADDRESS HERE ---
const API_BASE_URL = 'http://192.168.80.35:5000';  

// --- Define the type for a single chat history item from our backend ---
interface ChatItem {
  id: number;
  message: string;
  response: string;
  timestamp: string;
}

export default function ChatHistoryScreen() {
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const fetchChatHistory = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // 1. Get the auth token from AsyncStorage (the same method as other screens)
      const token = await AsyncStorage.getItem('user_token');
      
      // 2. If no token, the user is not logged in.
      if (!token) {
        throw new Error("User not authenticated");
      }

      // 3. Call the correct API endpoint that we built in Flask
      const response = await fetch(`${API_BASE_URL}/api/chat/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch chat history. Server responded with ${response.status}`);
      }

      const data: ChatItem[] = await response.json();
      setHistory(data);

    } catch (err: any) {
      console.error("Error fetching chat history:", err.message);
      setError(err.message); // Set the error message to display to the user
    } finally {
      setLoading(false);
    }
  };

  // Fetch data every time the screen comes into view
  useEffect(() => {
    if (isFocused) {
      fetchChatHistory();
    }
  }, [isFocused]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading chat history...</Text>
      </View>
    );
  }

  // If there was an error (e.g., user not logged in), show the error message.
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.emptyTitle}>An Error Occurred</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Link href="./signin" asChild>
          <Pressable style={styles.startWritingButton}>
            <Text style={styles.startWritingButtonText}>Go to Sign In</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="chat" size={48} color="#d4d4d8" />
        <Text style={styles.emptyTitle}>No Chat History</Text>
        <Text style={styles.emptyText}>Your conversations with the bot will appear here.</Text>
        <Link href="./chatbot" asChild>
          <Pressable style={styles.startWritingButton}>
            <Text style={styles.startWritingButtonText}>Start Chatting</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Chat History</Text>
        <Text style={styles.subtitle}>Review your past conversations</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.chatCard}>
            <Text style={styles.chatTimestamp}>{formatDate(item.timestamp)}</Text>
            <View style={styles.messageBubbleUser}>
              <Text style={styles.messageTextUser}>{item.message}</Text>
            </View>
            <View style={styles.messageBubbleBot}>
              <Text style={styles.messageTextBot}>{item.response}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
}

// Reusing consistent styles from your other screens
const styles = StyleSheet.create({
  container: {
     flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 16, color: '#64748b' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#3f3f46' },
  emptyText: { fontSize: 16, color: '#71717a', textAlign: 'center', marginBottom: 24 },
  startWritingButton: { backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  startWritingButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24 },
  chatCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  chatTimestamp: { fontSize: 12, color: '#94a3b8', marginBottom: 12, textAlign: 'center' },
  messageBubbleUser: { alignSelf: 'flex-end', backgroundColor: '#dbeafe', padding: 10, borderRadius: 12, maxWidth: '80%', marginBottom: 8, borderBottomRightRadius: 4 },
  messageTextUser: { color: '#1e3a8a' },
  messageBubbleBot: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9', padding: 10, borderRadius: 12, maxWidth: '80%', borderBottomLeftRadius: 4 },
  messageTextBot: { color: '#334155' },
  divider: { height: 16 },
});