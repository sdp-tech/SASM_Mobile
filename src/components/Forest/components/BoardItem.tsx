import { useState } from 'react';
import { TouchableOpacity, ImageBackground, Dimensions, FlatList, View } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";

interface BoardItemProps {
  id: number;
  name: string;
  onPress: () => void;
  highlight?: boolean;
}

const BoardItem = ({ id, name, onPress, highlight }: BoardItemProps) => {
  const checkCategory = () => {
    // if (id)
  }
  return (
    <TouchableOpacity
      style={{ width: 96, marginHorizontal: 8, }}
      onPress={onPress}
    >
      <ImageBackground
        style={{
          width: 96,
          height: 96,
          alignItems: "center",
          justifyContent: "center",
        }}
        source={{
          uri: "https://reactnative.dev/img/logo-og.png",
        }}
        imageStyle={{
          borderRadius: 4
        }}
      >
        {highlight ? <View style={{ position: 'absolute', top: 0, left: 0, width: 96, height: 96, backgroundColor: 'black', opacity: 0.6, zIndex: 1, borderColor: '#67D393', borderWidth: highlight ? 2 : 0, borderRadius: 4}} /> : <></>}
        <Text style={{ color: highlight ? "#67D393": "white", fontWeight: '700', fontSize: 16 }}>{name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default BoardItem;