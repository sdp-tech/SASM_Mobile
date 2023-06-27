import { TouchableOpacity, ImageBackground, Dimensions, FlatList, View } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";

interface BoardItemProps {
  id?: number;
  name: string;
  onPress: any;
  isSelected?: boolean;
}

const BoardItem = ({ id, name, onPress, isSelected }: BoardItemProps) => {
  return (
    <TouchableOpacity
      style={{ width: 96, marginHorizontal: 8, }}
      onPress={id ? () => onPress(id!) : onPress}
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
        <View style={{
          backgroundColor: isSelected ? 'black' : 'transparent',
          opacity: isSelected ? 0.6 : 1, 
          borderColor: '#67D393', 
          borderWidth: isSelected ? 2 : 0, 
          width: 96, 
          height: 96,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4
          }}>
          <Text style={{ color: isSelected ? '#67D393' : "white", fontWeight: '700', fontSize: 16 }}>{name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default BoardItem;