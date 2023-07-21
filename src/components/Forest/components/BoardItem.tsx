import { TouchableOpacity, ImageBackground, Dimensions, FlatList, View } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";

interface BoardItemProps {
  id?: number;
  data: any;
  onPress: any;
  isSelected?: boolean;
}

const BoardItem = ({ id, data, onPress, isSelected }: BoardItemProps) => {
  const images = [
    require('../../../assets/img/Forest/Category01.png'),
    require('../../../assets/img/Forest/Category02.png'),
    require('../../../assets/img/Forest/Category03.png'),
    require('../../../assets/img/Forest/Category04.png'),
    require('../../../assets/img/Forest/Category05.png'),
    require('../../../assets/img/Forest/Category06.png'),
  ]
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
        source={images[data.id-1]}
        imageStyle={{
          borderRadius: 4
        }}
      >
        <View style={{
          backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.60)' : 'transparent', 
          borderColor: '#67D393', 
          borderWidth: isSelected ? 2 : 0, 
          width: 96, 
          height: 96,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4
          }}>
          <Text style={{ color: isSelected ? '#67D393' : "white", fontWeight: '700', fontSize: 16 }}>{data.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default BoardItem;