import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function LoginScreen({navigation}){
  const [phone, setPhone] = useState('');
  const onContinue = async ()=>{
    if(phone.length < 6) return alert('Enter valid phone with country code, e.g. +8801...');
    await AsyncStorage.setItem('tisha_phone', phone);
    await setDoc(doc(db,'users',phone),{ phone, createdAt: serverTimestamp() }, { merge:true });
    navigation.replace('Home');
  };
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon-512.png')} style={{width:120,height:120,marginBottom:20}} />
      <Text style={styles.title}>Tisha Chat</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder="+8801..." style={styles.input} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.btn} onPress={onContinue}><Text style={{color:'#fff'}}>Continue</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center',padding:20,backgroundColor:'#fff'},
  title:{fontSize:28,fontWeight:'800',marginBottom:6},
  input:{width:'100%',padding:12,borderWidth:1,borderColor:'#eee',borderRadius:8,marginBottom:12},
  btn:{backgroundColor:'#00B888',padding:14,borderRadius:8,width:'100%',alignItems:'center'},
});
