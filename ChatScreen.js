import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChatScreen({route}) {
  const { roomId, title } = route.params;
  const [phone,setPhone] = useState('');
  const [text,setText] = useState('');
  const [messages,setMessages] = useState([]);
  useEffect(()=>{ AsyncStorage.getItem('tisha_phone').then(v=>setPhone(v||'')); },[]);
  useEffect(()=>{
    const q = query(collection(db,'rooms',roomId,'messages'), orderBy('createdAt','asc'));
    const unsub = onSnapshot(q, snap=>{ const arr=[]; snap.forEach(doc=>arr.push({id:doc.id, ...doc.data()})); setMessages(arr); });
    return ()=>unsub();
  },[roomId]);
  const sendText = async ()=>{
    if(!text) return;
    await addDoc(collection(db,'rooms',roomId,'messages'),{ text, from:phone, createdAt: serverTimestamp() });
    setText('');
  };
  const pickImage = async ()=>{
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!p.granted) return alert('Permission needed');
    const r = await ImagePicker.launchImageLibraryAsync({ quality:0.6, base64:false });
    if(r.cancelled) return;
    const blob = await (await fetch(r.uri)).blob();
    const name = 'img_'+Date.now()+'.jpg';
    const storageRef = ref(storage, 'images/'+name);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db,'rooms',roomId,'messages'),{ image:url, from:phone, createdAt: serverTimestamp() });
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <View style={{padding:12,backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#eee'}}><Text style={{fontWeight:'700'}}>{title}</Text></View>
      <FlatList data={messages} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={{padding:8,alignSelf: item.from===phone?'flex-end':'flex-start',maxWidth:'80%'}}>
          {item.text? <Text style={{backgroundColor:'#f1f1f1',padding:8,borderRadius:8}}>{item.text}</Text> : null}
          {item.image? <Image source={{uri:item.image}} style={{width:200,height:120,marginTop:6,borderRadius:8}} /> : null}
        </View>
      )} style={{padding:12,flex:1}} />
      <View style={{flexDirection:'row',padding:8,alignItems:'center'}}>
        <TouchableOpacity onPress={pickImage}><Text style={{marginRight:8}}>📎</Text></TouchableOpacity>
        <TextInput value={text} onChangeText={setText} placeholder='Message' style={{flex:1,borderWidth:1,borderColor:'#eee',padding:8,borderRadius:8}} />
        <TouchableOpacity onPress={sendText} style={{marginLeft:8,backgroundColor:'#00B888',padding:10,borderRadius:8}}><Text style={{color:'#fff'}}>Send</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
