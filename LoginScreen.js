import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  const onContinue = async () => {
    if (phone.length < 6)
      return alert('Enter valid phone with country code, e.g. +8801...');

    await AsyncStorage.setItem('tisha_phone', phone);

    await setDoc(
      doc(db, 'users', phone),
      { phone, createdAt: serverTimestamp() },
      { merge: true }
    );

    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
      <Text style={styles.title}>Tisha Chat</Text>

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="+8801..."
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={onContinue}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 10 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: '#00B888', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});
