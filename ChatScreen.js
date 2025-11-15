import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Image, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChatScreen({ route }) {
  const { roomId, title } = route.params;

  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  // Load phone number
  useEffect(() => {
    AsyncStorage.getItem('tisha_phone').then((v) => setPhone(v || ''));
  }, []);

  // Load chat messages
  useEffect(() => {
    const q = query(collection(db, 'rooms', roomId, 'messages'), orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setMessages(arr);
    });

    return () => unsub();
  }, [roomId]);

  // Send text msg
  const sendText = async () => {
    if (!text) return;

    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      text,
      from: phone,
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  // Send image
  const pickImage = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) return alert("Permission needed.");

    const r = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (r.canceled) return;

    const uri = r.assets[0].uri;
    const blob = await (await fetch(uri)).blob();

    const imgName = "img_" + Date.now() + ".jpg";
    const storageRef = ref(storage, "images/" + imgName);

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'rooms', roomId, 'messages'), {
      image: url,
      from: phone,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>{title}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgBox,
              { alignSelf: item.from === phone ? 'flex-end' : 'flex-start' }
            ]}
          >
            {item.text && <Text style={styles.msgText}>{item.text}</Text>}
            {item.image && <Image source={{ uri: item.image }} style={styles.msgImg} />}
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ fontSize: 22 }}>📎</Text>
        </TouchableOpacity>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          style={styles.input}
        />

        <TouchableOpacity onPress={sendText} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 14, borderBottomWidth: 1, borderColor: '#ddd' },
  headerTxt: { fontWeight: '700' },
  msgBox: { marginBottom: 10, maxWidth: '80%' },
  msgText: { backgroundColor: '#f1f1f1', padding: 8, borderRadius: 8 },
  msgImg: { width: 200, height: 130, marginTop: 6, borderRadius: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  sendBtn: { backgroundColor: '#00B888', padding: 10, borderRadius: 8 },
});
