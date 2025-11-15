import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAMPLE = [
  { id: 'global', name: 'Global Chat' },
  { id: '+8801712345678', name: 'Sami Ahmed' },
  { id: '+8801812345678', name: 'Rina Khan' },
];

export default function HomeScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('tisha_phone').then((v) => setPhone(v || ''));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('Chat', { roomId: item.id, title: item.name })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Video', { room: item.id })}>
        <Text style={styles.call}>Call</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Chats</Text>
        <Text>{phone}</Text>
      </View>

      <FlatList data={SAMPLE} renderItem={renderItem} keyExtractor={(i) => i.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTxt: { fontSize: 20, fontWeight: '700' },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '700' },
  call: { color: '#06f' },
});
