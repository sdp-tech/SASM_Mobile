import { TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import Arrow from '../assets/img/common/ArrowWhite.svg';
import Close from "../assets/img/common/Close.svg";

interface FormHeaderProps {
  title: string;
  onLeft: () => void;
  onRight: () => void;
  begin?: boolean;
  end?: boolean;
}

const FormHeader = ({ title, onLeft, onRight, begin, end }: FormHeaderProps) => {
  const { height } = Dimensions.get('window');
  return (
    <View style={{height: Platform.OS === 'ios' ? height * 0.12 : height * 0.08, backgroundColor: '#67D393', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 15, paddingHorizontal: 20}}>
      <TouchableOpacity onPress={onLeft}>
        {begin ? <Close width={18} height={18} color={'white'} strokeWidth={2} /> : <Arrow width={18} height={18} strokeWidth={5} />}
      </TouchableOpacity>
      <Text style={{flex: 1, fontWeight: '700', color: 'white', fontSize: 20, textAlign: 'center'}}>{title}</Text>
      <TouchableOpacity onPress={onRight}>
        {end ? <Text style={{color: 'white', fontWeight: '500', lineHeight: 20}}>등록</Text> : <Arrow width={18} height={18} strokeWidth={5} transform={[{rotate: '180deg'}]}/>}
      </TouchableOpacity>
    </View>
  )
}

export default FormHeader;