import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/signin.jpg')}
        style={styles.topImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to MindLog</Text>
      <Text style={styles.subtitle}>Breathe. Sleep. Heal.</Text>
      <Text style={styles.description}>We're here to support your</Text>
      <Text style={styles.description}>emotional and sleep well-being.</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  topImage: {
    width: 240,
    height: 240,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2C3E50', // deep blue-gray
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#6C7B95', // muted lavender-blue
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D', // soft gray
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 50,
  },
  primaryButton: {
    backgroundColor: '#A29BFE', // soft lavender
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A29BFE',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#6C5CE7',
  },
});