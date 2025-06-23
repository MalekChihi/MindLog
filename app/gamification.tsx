import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, FlatList, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://192.168.80.35:5000'; // <-- REPLACE WITH YOUR CURRENT IP
const DETECT_MOOD_API_URL = `${API_BASE_URL}/api/gamification/detect-mood`;

export default function GamificationScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<string[]>(['Welcome! Press "Detect My Mood" to begin.']);
  const cameraRef = useRef<CameraView>(null);

  const addMessage = (message: string) => {
    // Add new messages to the top for a log-style view
    setMessages(prev => [message, ...prev]);
  };

  const detectMood = async () => {
    if (!cameraRef.current) {
      addMessage("Camera is not ready. Please wait.");
      return;
    }

    setIsProcessing(true);
    addMessage("Taking picture...");

    try {
      const token = await AsyncStorage.getItem("user_token");
      if (!token) throw new Error("You are not logged in. Please sign in first.");

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) throw new Error("Failed to capture image.");

      addMessage("Compressing and processing image...");
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 600 } }], // Resize for faster upload
        // --- THIS IS THE FIX: Generate the Base64 string here ---
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      // --- VALIDATE that we have the base64 data before sending ---
      if (!manipulatedImage.base64) {
        throw new Error("Failed to process image data.");
      }
      
      addMessage("Analyzing mood with AI...");

      // --- THIS IS THE FIX: Send a JSON payload, not FormData ---
      const response = await fetch(DETECT_MOOD_API_URL, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // We are sending JSON
        },
        body: JSON.stringify({
          image_data: manipulatedImage.base64, // Send the base64 string
        }),
      });
      
      const responseData = await response.json();
      if (!response.ok) {
        // Use the error message from the backend if available
        throw new Error(responseData.error || `Server returned status ${response.status}`);
      }

      const { mood, activity_suggestion } = responseData;

      addMessage(`Detected Mood: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`);
      addMessage(`Suggestion: ${activity_suggestion}`);

    } catch (error: any) {
      console.error("Mood detection failed:", error.message);
      addMessage(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER LOGIC ---

  if (!permission) {
    // Permissions are still loading
    return <View style={styles.container}><ActivityIndicator size="large" color="#333" /></View>;
  }

  if (!permission.granted) {
    // Permissions have been denied
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to use the camera for mood detection.</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.settingsButton]} onPress={() => Linking.openSettings()}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mood Detection Game</Text>
      
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, styles.detectButton, isProcessing && styles.disabledButton]}
        onPress={detectMood}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Feather name="camera" size={20} color="white" />
        )}
        <Text style={styles.buttonText}>Detect My Mood</Text>
      </TouchableOpacity>

      <View style={styles.outputContainer}>
        <Text style={styles.outputTitle}>Log:</Text>
        <FlatList
          data={messages}
          renderItem={({item}) => <Text style={styles.messageText}>- {item}</Text>}
          keyExtractor={(item, index) => `${index}`}
          inverted
          style={styles.logList}
        />
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: '#4338ca',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    // Shadow for depth
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  settingsButton: {
    backgroundColor: '#64748b',
    shadowColor: '#64748b',
  },
  detectButton: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outputContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#334155',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  logList: {
    flex: 1,
  },
  messageText: {
    paddingVertical: 4,
    fontSize: 14,
    color: '#475569',
  },
});