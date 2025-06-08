import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/signin.jpg')} // 🧠 illustration image
        style={styles.topImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to MindLog</Text>
      <Text style={styles.subtitle}>Take a step towards better sleep.</Text>
      <Text style={styles.description}>We are here to support you on your</Text>
      <Text style={styles.description}>journey to emotional well-being</Text>

      <View style={styles.buttonContainer}>
        <Link href="/sign-in" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
        </Link>

        <Link href="/sign-up" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 24,
  },
  topImage: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#475569',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#3b82f6',
  },
});
