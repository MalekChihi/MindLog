import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReservationScreen() {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleReservation = () => {
    if (!name) {
      Alert.alert('Please enter your name');
      return;
    }
    Alert.alert('Reservation Confirmed', `For ${name} on ${date.toLocaleString()}`);
    setName('');
    setNote('');
    setDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make a Reservation</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Full Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>📅 {date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Additional Notes (optional)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <Button title="Confirm Reservation" onPress={handleReservation} color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E293B',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
  },
});
