import { TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import Arrow from '../assets/img/common/ArrowWhite.svg';

interface FormHeaderProps {
  title: string;
  onLeft: () => void;
  onRight: () => void;
}

const FormHeader = ({ title, onLeft, onRight }: FormHeaderProps) => {
  return (
    <View style={{height: 100, backgroundColor: '#67D393', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 15, paddingHorizontal: 20}}>
      <TouchableOpacity onPress={onLeft}>
        <Arrow width={18} height={18} strokeWidth={5} />
      </TouchableOpacity>
      <Text style={{flex: 1, fontWeight: '700', color: 'white', fontSize: 20, textAlign: 'center'}}>{title}</Text>
      <TouchableOpacity onPress={onRight}>
        <Arrow width={18} height={18} strokeWidth={5} transform={[{rotate: '180deg'}]}/>
      </TouchableOpacity>
    </View>
  )
}

export default FormHeader;