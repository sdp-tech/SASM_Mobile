import { View, TouchableOpacity } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Arrow from '../../../assets/img/common/Arrow.svg';
import Search from '../../../assets/img/common/Search.svg';

interface ListHeaderProps {
    board_name: string;
    board_category?: any;
    navigation: any;
}
const ListHeader = ({ board_name,board_category,navigation }: ListHeaderProps) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
      <TouchableOpacity onPress={()=>{navigation.goBack();}}>
        <Arrow width={18} height={18} transform={[{rotate: '180deg'}]} />
      </TouchableOpacity>
      <Text style={{ flex: 1, fontSize: 20, fontWeight: "700", textAlign: 'center' }}>
        {board_category ? board_category.name + " / " : ""}
        {board_name}
      </Text>
      <TouchableOpacity style={{marginRight: 5}} onPress={() => {navigation.navigate('PostSearch')}}>
        <Search width={18} height={18} />
      </TouchableOpacity>
    </View>
  )
}

export default ListHeader;