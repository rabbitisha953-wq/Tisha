import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SAMPLE = [
  { id:'global', name:'Global Chat' },
  { id:'+8801712345678', name:'Sami Ahmed' },
  { id:'+8801812345678', name:'Rina Khan' }
];
export default function HomeScreen({navigation}){
  const [phone,setPhone] = useState('');
  useEffect(()=>{ AsyncStorage.getItem('tisha_phone').then(v=>setPhone(v||'')); },[]);
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{padding:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{fontSize:20,fontWeight:'700'}}>Chats</Text>
        <Text>{phone}</Text>
      </View>
      <FlatList data={SAMPLE} keyExtractor={i=>i.id} renderItem={({item})=>(
        <TouchableOpacity style={styles.row} onPress={()=>navigation.navigate('Chat',{roomId:item.id, title:item.name})}>
          <Text style={{fontWeight:'700'}}>{item.name}</Text>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('Video',{room:item.id})}><Text style={{color:'#06f',marginRight:10}}>Call</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      )} />
    </View>
  );
}
const styles = StyleSheet.create({
  row:{padding:12,borderBottomWidth:1,borderColor:'#f3f3f3',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}
});
