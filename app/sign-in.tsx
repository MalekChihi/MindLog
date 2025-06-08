import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user database (just for demo)
  const mockUsers = [
    { email: 'user@example.com', password: 'password123' },
    // add more mock users here if needed
  ];

  const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:5000/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        Alert.alert('Invalid Credentials', data.error || 'Incorrect email or password');
      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
      return;
    }

    console.log('Login successful:', data);

    // Optional: Save token to secure storage (recommended)
    // await SecureStore.setItemAsync('access_token', data.access_token);

    router.replace('/(tabs)');
  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Network Error', 'Unable to connect. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/signin.jpg')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Continue your calmness journey</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
        </View>

        <Pressable
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </Pressable>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 210,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});
