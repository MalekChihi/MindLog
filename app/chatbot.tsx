import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router'; // Make sure this is imported

// --- Types for Messages ---
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// --- Bot Avatar ---
const botAvatar = require('../assets/images/chatbot.jpg'); // Ensure path is correct

// --- Animated Message Component ---
const AnimatedMessageBubble = ({ msg, children }: { msg: Message, children: React.ReactNode }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(msg.sender === 'user' ? 15 : -15)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
      {children}
    </Animated.View>
  );
};

// --- Breathing Circle Component ---
const BreathingCircle = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const breathTextAnim = useRef(new Animated.Value(0)).current;
  const [breathState, setBreathState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const breathInDuration = 4000;
    const breathOutDuration = 6000;
    const holdDuration = 1000;

    const animateBreath = () => {
      setBreathState('in');
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: breathInDuration, useNativeDriver: true }),
        Animated.timing(breathTextAnim, { toValue: 1, duration: breathInDuration / 2, useNativeDriver: true })
      ]).start(() => {
        setTimeout(() => {
          setBreathState('out');
          Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 1, duration: breathOutDuration, useNativeDriver: true }),
            Animated.timing(breathTextAnim, { toValue: 0, duration: breathOutDuration / 2, useNativeDriver: true })
          ]).start(() => {
            setTimeout(animateBreath, holdDuration);
          });
        }, holdDuration);
      });
    };
    animateBreath();
    return () => {
      scaleAnim.stopAnimation();
      breathTextAnim.stopAnimation();
    };
  }, []);

  const breathTextStyle = {
      opacity: breathTextAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
      transform: [{ translateY: breathTextAnim.interpolate({ inputRange: [0,1], outputRange: [5,0] }) }]
  };

  return (
    <View style={styles.breathingCircleContainer}>
      <Animated.View style={[styles.breathingCircle, { transform: [{ scale: scaleAnim }] }]} />
      <Animated.Text style={[styles.breathingText, breathTextStyle]}>
        {breathState === 'in' ? 'Breathe In' : 'Breathe Out'}
      </Animated.Text>
    </View>
  );
};


export default function ChatbotScreen() {
  const [messageText, setMessageText] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]); // Starts empty
  const scrollViewRef = useRef<ScrollView>(null);
  const animGradient = useRef(new Animated.Value(0)).current;

  // --- Background Animation ---
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animGradient, { toValue: 1, duration: 18000, useNativeDriver: false }),
        Animated.timing(animGradient, { toValue: 0, duration: 18000, useNativeDriver: false }),
      ])
    ).start();
  }, []); 


  useEffect(() => {
    if (conversation.length > 0) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const handleSend = () => {
    if (messageText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString() + '_user',
        text: messageText.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, userMessage]);
      const currentSentMessage = messageText.trim();
      setMessageText('');

      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now().toString() + '_bot',
          text: `I understand you mentioned: "${currentSentMessage}". It's good to acknowledge our feelings. What else is on your mind, or how can I support you further with this?`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setConversation(prev => [...prev, botResponse]);
      }, 1000 + Math.random() * 500);
    }
  };

  const backgroundColor = animGradient.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E9EFF5', '#F0F4F8'],
  });

  return (
    <Animated.View style={[styles.outerContainer, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? ( 80 ) : 0} // Adjust based on your header height
      >
        {/* --- Back to Dashboard Button --- */}
        {/* This button is an alternative if your stack navigator doesn't provide a back button */}
        {/* or if you want an explicit button to go to a specific dashboard route. */}
        {/* If your Stack.Screen options for 'chatbot' in _layout.tsx provide a header with a back button, */}
        {/* that header's back button will use router.back() by default. */}
        <Pressable 
          style={styles.backButton} 
          onPress={() => {
            // Choose the most appropriate navigation:
            // router.back(); // If chatbot was pushed onto the stack from dashboard
            router.replace('./(tabs)'); // If you want to go to dashboard and clear chatbot from history
            // router.push('/dashboard'); // If you want to go to dashboard and keep chatbot in history
          }}
        >
          <Feather name="arrow-left-circle" size={26} color="#64748B" />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatAreaContent}
          showsVerticalScrollIndicator={false}
        >
          {conversation.length === 0 && (
            <View style={styles.emptyChatContainer}>
              <BreathingCircle />
              <Text style={styles.emptyChatMessage}>
                Take a moment to center yourself.
                {'\n'}When you're ready, share what's on your mind.
              </Text>
            </View>
          )}
          {conversation.map((msg) => (
            <AnimatedMessageBubble key={msg.id} msg={msg}>
              <View
                style={[ styles.messageRow, msg.sender === 'user' ? styles.userMessageRow : styles.botMessageRow ]}
              >
                {msg.sender === 'bot' && (<Image source={botAvatar} style={styles.messageAvatar} />)}
                <View style={[ styles.messageBubble, msg.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble ]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              </View>
            </AnimatedMessageBubble>
          ))}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Gently share your thoughts..."
            placeholderTextColor="#A0AEC0"
            multiline
          />
          <Pressable
            style={({ pressed }) => [ styles.sendButton, pressed && styles.sendButtonPressed, !messageText.trim() && styles.sendButtonDisabled ]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Feather name="send" size={20} color={!messageText.trim() ? "#A0AEC0" : "#FFFFFF"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  backButton: { // Styles for the new "Back to Dashboard" button
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16, // Adjust for potential status bar if no native header
    paddingBottom: 8,
    // backgroundColor: '#FFFFFF', // Optional: give it a light background
    // borderBottomWidth: 1,
    // borderBottomColor: '#E8EDF2',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  chatAreaContent: {
    // paddingTop: 16, // If no custom back button, this might be okay.
                      // If custom back button is present, paddingTop might be less or on ScrollView itself.
    paddingBottom: 16,
    paddingHorizontal: 12,
    flexGrow: 1, 
  },
  emptyChatContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity: 0.8,
  },
  emptyChatMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 30, 
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, 
    height: 150, 
  },
  breathingCircle: {
    width: 100, 
    height: 100,
    borderRadius: 50, 
    backgroundColor: 'rgba(173, 216, 230, 0.5)', 
    position: 'absolute', 
  },
  breathingText: {
    fontSize: 16,
    color: '#4A5568', 
    fontWeight: '500',
    textAlign: 'center',
  },
  messageRow: { flexDirection: 'row', marginBottom: 12, maxWidth: '85%' },
  userMessageRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  botMessageRow: { alignSelf: 'flex-start', alignItems: 'flex-end' },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  userMessageBubble: { backgroundColor: '#D1E4FF', borderBottomRightRadius: 6 },
  botMessageBubble: { backgroundColor: '#E9E7F5', borderBottomLeftRadius: 6, flexShrink: 1 },
  messageText: { fontSize: 15, color: '#2D3748', lineHeight: 21 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EDF2',
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: '#F7F8FA',
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    color: '#2D3748',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#ADC8F0',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonPressed: { backgroundColor: '#9AB8E0' },
  sendButtonDisabled: { backgroundColor: '#E8EDF2' },
});