import { View, TouchableOpacity } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import Search from '../assets/img/common/Search.svg';
import Logo from '../assets/img/common/Logo.svg';
import Alarm from '../assets/img/common/Alarm.svg';
import Header from '../assets/img/common/Header.svg';

interface CustomHeaderProps {
  onSearch: () => void;
  onAlarm?: () => void;
}
const CustomHeader = ({ onSearch, onAlarm }: CustomHeaderProps) => {
  return (
    <View style={{ flexDirection: 'row', padding: 15, display:'flex', justifyContent:'space-between' }}>
      <Header />
      <View style={{display:'flex', flexDirection:'row'}}>
        <TouchableOpacity onPress={onSearch} style={{ marginRight: 10 }}>
          <Search width={18} height={18} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onAlarm}>
          <Alarm width={19} height={19} />
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

export default CustomHeader;