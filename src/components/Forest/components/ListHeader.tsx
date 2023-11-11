import { View, TouchableOpacity } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Arrow from '../../../assets/img/common/Arrow.svg';
import Search from '../../../assets/img/common/Search.svg';

interface ListHeaderProps {
    board_name: string;
    board_category?: any;
    navigation: any;
    checkedList?:any;
    selectedIds?:number[];

}
const ListHeader = ({ board_name,board_category, checkedList, selectedIds, navigation }: ListHeaderProps) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E3E3E3'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("BoardList",{checkedList:checkedList,selectedIds:selectedIds});}}>
        <Arrow width={18} height={18} transform={[{rotate: '180deg'}]} color={'black'} />
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