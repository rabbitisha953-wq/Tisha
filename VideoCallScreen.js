import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
export default function VideoCallScreen({route}){
  const room = route.params?.room || ('tisha-room-'+Math.floor(Math.random()*10000));
  const url = 'https://meet.jit.si/' + room;
  return (
    <View style={{flex:1}}>
      <WebView source={{uri: url}} style={{flex:1}} />
    </View>
  );
}
