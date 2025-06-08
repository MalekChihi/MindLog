import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Options</Text>
      <Link href="./settings" style={styles.link}>
        <Text>Settings</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});