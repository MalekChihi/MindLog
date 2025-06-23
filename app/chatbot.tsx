import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// --- Types for Messages ---
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// --- API URL ---
// 🔴 VERY IMPORTANT: Replace this with your computer's actual local IP address.
// The URL must point to your backend's chat route.
const API_URL = 'http://192.168.80.35:5000/api/chat'; // <-- REPLACE THIS IP
// const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`;

// --- Bot Avatar ---
const botAvatar = require('../assets/images/chatbot.jpg');

// --- Your existing AnimatedMessageBubble and BreathingCircle components (unchanged) ---
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
const BreathingCircle = () => {
    // This component is unchanged and fine as is.
    return <View />; // Placeholder to shorten the code block, your original is fine.
};


export default function ChatbotScreen() {
  const [messageText, setMessageText] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const scrollViewRef = useRef<ScrollView>(null);
  const animGradient = useRef(new Animated.Value(0)).current;

  // --- Background Animation (Unchanged) ---
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animGradient, { toValue: 1, duration: 18000, useNativeDriver: false }),
        Animated.timing(animGradient, { toValue: 0, duration: 18000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  // --- MODIFIED handleSend function with API call and debugging logs 

  const handleSend = async () => {
    if (messageText.trim() === '' || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    console.log("1. User message created:", userMessage.text);
    
    // Add user message to UI immediately and set loading state
    setConversation(prev => [...prev, userMessage]);
    const messageToSend = messageText.trim(); // Store message before clearing
    setMessageText('');
    setIsLoading(true);

    try {
      console.log("2. Sending fetch request to:", API_URL);
      const token = await AsyncStorage.getItem('access_token'); // 

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageToSend }),
      });
      console.log("3. Got response from server. Status:", response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Server responded with an error:", response.status, errorBody);
        throw new Error(`Server error: ${response.status}. ${errorBody}`);
      }
      if (!response.ok) {
  const errorBody = await response.text();
  console.error("Erreur 422:", errorBody);
  throw new Error(`Server error: ${response.status}. ${errorBody}`);
}


      const data = await response.json();
      console.log("4. Parsed JSON data:", data);

      if (!data.response) {
          throw new Error("API response is missing the 'response' field.");
      }

      const botResponse: Message = {
        id: Date.now().toString() + '_bot',
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      console.log("5. Adding bot response to conversation.");
      setConversation(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("6. CATCH BLOCK TRIGGERED. Error:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: "I'm having a little trouble connecting right now. Please check your connection or try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      console.log("7. FINALLY BLOCK TRIGGERED. Setting isLoading to false.");
      setIsLoading(false);
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.replace('./(tabs)')}
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
          {conversation.length === 0 && !isLoading && (
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
              <View style={[ styles.messageRow, msg.sender === 'user' ? styles.userMessageRow : styles.botMessageRow ]}>
                {msg.sender === 'bot' && (<Image source={botAvatar} style={styles.messageAvatar} />)}
                <View style={[ styles.messageBubble, msg.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble ]}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              </View>
            </AnimatedMessageBubble>
          ))}

          {isLoading && (
            <View style={[styles.messageRow, styles.botMessageRow]}>
              <Image source={botAvatar} style={styles.messageAvatar} />
              <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingIndicator]}>
                <ActivityIndicator size="small" color="#64748B" />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder={isLoading ? "Waiting for a reply..." : "Gently share your thoughts..."}
            placeholderTextColor="#A0AEC0"
            multiline
            editable={!isLoading}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
              (isLoading || !messageText.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={isLoading || !messageText.trim()}
          >
            <Feather name="send" size={20} color={(isLoading || !messageText.trim()) ? "#A0AEC0" : "#FFFFFF"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  // Adding the new typingIndicator style
  typingIndicator: {
    paddingVertical: 14,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // All your other beautiful styles remain here
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
// import { Feather } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: Date;
// }

// const API_URL = 'http://192.168.80.35:5000/api/chat';
// const botAvatar = require('../assets/images/chatbot.jpg');

// const AnimatedMessageBubble = ({ msg, children }: { msg: Message, children: React.ReactNode }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(msg.sender === 'user' ? 15 : -15)).current;
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
//     ]).start();
//   }, []);
//   return (
//     <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
//       {children}
//     </Animated.View>
//   );
// };

// const BreathingCircle = () => {
//   return <View />; // Your original breathing circle goes here
// };

// export default function ChatbotScreen() {
//   const [messageText, setMessageText] = useState('');
//   const [conversation, setConversation] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const animGradient = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(animGradient, { toValue: 1, duration: 18000, useNativeDriver: false }),
//         Animated.timing(animGradient, { toValue: 0, duration: 18000, useNativeDriver: false }),
//       ])
//     ).start();
//   }, []);

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollToEnd({ animated: true });
//     }
//   }, [conversation]);

//   const handleSend = async () => {
//     if (messageText.trim() === '' || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString() + '_user',
//       text: messageText.trim(),
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setConversation(prev => [...prev, userMessage]);
//     const messageToSend = messageText.trim();
//     setMessageText('');
//     setIsLoading(true);

//     try {
//       const token = await AsyncStorage.getItem('access_token');

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ message: messageToSend }),
//       });

//       if (!response.ok) {
//         const errorBody = await response.text();
//         throw new Error(`Server error: ${response.status}. ${errorBody}`);
//       }

//       const data = await response.json();

//       if (!data.response) {
//         throw new Error("API response is missing the 'response' field.");
//       }

//       const botResponse: Message = {
//         id: Date.now().toString() + '_bot',
//         text: data.response,
//         sender: 'bot',
//         timestamp: new Date(),
//       };

//       setConversation(prev => [...prev, botResponse]);

//     } catch (error) {
//       console.error("Chat error:", error);
//       const errorMessage: Message = {
//         id: Date.now().toString() + '_bot',
//         text: "I'm having trouble connecting. Please try again later.",
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setConversation(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const backgroundColor = animGradient.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['#E9EFF5', '#F0F4F8'],
//   });

//   return (
//     <Animated.View style={[styles.outerContainer, { backgroundColor }]}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
//       >
//         {/* --- HEADER WITH BACK AND HISTORY BUTTONS --- */}
//         <View style={styles.headerContainer}>
//           <Pressable style={styles.backButton} onPress={() => router.replace('./(tabs)')}>
//             <Feather name="arrow-left-circle" size={26} color="#64748B" />
//             <Text style={styles.backButtonText}>Back</Text>
//           </Pressable>

//           <Pressable style={styles.historyButton} onPress={() => router.push('./chatbothistory')}>
//             <Feather name="clock" size={24} color="#64748B" />
//           </Pressable>
//         </View>

//         {/* --- CHAT AREA --- */}
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.chatArea}
//           contentContainerStyle={styles.chatAreaContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {conversation.length === 0 && !isLoading && (
//             <View style={styles.emptyChatContainer}>
//               <BreathingCircle />
//               <Text style={styles.emptyChatMessage}>
//                 Take a moment to center yourself.
//                 {'\n'}When you're ready, share what's on your mind.
//               </Text>
//             </View>
//           )}

//           {conversation.map((msg) => (
//             <AnimatedMessageBubble key={msg.id} msg={msg}>
//               <View style={[
//                 styles.messageRow,
//                 msg.sender === 'user' ? styles.userMessageRow : styles.botMessageRow
//               ]}>
//                 {msg.sender === 'bot' && (<Image source={botAvatar} style={styles.messageAvatar} />)}
//                 <View style={[
//                   styles.messageBubble,
//                   msg.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble
//                 ]}>
//                   <Text style={styles.messageText}>{msg.text}</Text>
//                 </View>
//               </View>
//             </AnimatedMessageBubble>
//           ))}

//           {isLoading && (
//             <View style={[styles.messageRow, styles.botMessageRow]}>
//               <Image source={botAvatar} style={styles.messageAvatar} />
//               <View style={[styles.messageBubble, styles.botMessageBubble, styles.typingIndicator]}>
//                 <ActivityIndicator size="small" color="#64748B" />
//               </View>
//             </View>
//           )}
//         </ScrollView>

//         {/* --- INPUT AREA --- */}
//         <View style={styles.inputWrapper}>
//           <TextInput
//             style={styles.textInput}
//             value={messageText}
//             onChangeText={setMessageText}
//             placeholder={isLoading ? "Waiting for a reply..." : "Gently share your thoughts..."}
//             placeholderTextColor="#A0AEC0"
//             multiline
//             editable={!isLoading}
//           />
//           <Pressable
//             style={({ pressed }) => [
//               styles.sendButton,
//               pressed && styles.sendButtonPressed,
//               (isLoading || !messageText.trim()) && styles.sendButtonDisabled,
//             ]}
//             onPress={handleSend}
//             disabled={isLoading || !messageText.trim()}
//           >
//             <Feather
//               name="send"
//               size={20}
//               color={(isLoading || !messageText.trim()) ? "#A0AEC0" : "#FFFFFF"}
//             />
//           </Pressable>
//         </View>
//       </KeyboardAvoidingView>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   outerContainer: { flex: 1 },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 12 : 16,
//     paddingBottom: 8,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButtonText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: '#64748B',
//     fontWeight: '500',
//   },
//   historyButton: {
//     padding: 6,
//   },
//   chatArea: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   chatAreaContent: {
//     paddingBottom: 16,
//     paddingHorizontal: 12,
//     flexGrow: 1,
//   },
//   emptyChatContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     opacity: 0.8,
//   },
//   emptyChatMessage: {
//     fontSize: 16,
//     color: '#64748B',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginTop: 30,
//   },
//   messageRow: { flexDirection: 'row', marginBottom: 12, maxWidth: '85%' },
//   userMessageRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
//   botMessageRow: { alignSelf: 'flex-start', alignItems: 'flex-end' },
//   messageAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
//   messageBubble: {
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 18,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 1,
//   },
//   userMessageBubble: { backgroundColor: '#D1E4FF', borderBottomRightRadius: 6 },
//   botMessageBubble: { backgroundColor: '#E9E7F5', borderBottomLeftRadius: 6, flexShrink: 1 },
//   messageText: { fontSize: 15, color: '#2D3748', lineHeight: 21 },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#E8EDF2',
//   },
//   textInput: {
//     flex: 1,
//     minHeight: 42,
//     maxHeight: 110,
//     backgroundColor: '#F7F8FA',
//     borderRadius: 21,
//     paddingHorizontal: 16,
//     paddingVertical: Platform.OS === 'ios' ? 10 : 8,
//     fontSize: 16,
//     color: '#2D3748',
//     marginRight: 8,
//   },
//   sendButton: {
//     backgroundColor: '#ADC8F0',
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonPressed: { backgroundColor: '#9AB8E0' },
//   sendButtonDisabled: { backgroundColor: '#E8EDF2' },
//   typingIndicator: {
//     paddingVertical: 14,
//     width: 60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
