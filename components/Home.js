import { useEffect } from "react";
import { View, Image } from "react-native";


export default function Home() {

  return (
    <View style={{height: '100%', backgroundColor: '#282634'}}>
      <Image
        style={{ height: 400, width: '100%', marginTop: 100, }}
        source={require('../assets/2023-sandbagger-invitational-high-resolution-color-logo.png')}
      ></Image>
    </View>
  );
}
