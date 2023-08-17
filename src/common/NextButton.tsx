import { Text, TouchableOpacity } from 'react-native';

export default function NextButton ({ style, onPress, label }: {style?: any, onPress: () => void, label: string}): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress}
      style={[style, {backgroundColor: '#67D393', width: 176, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }]}  
    >
      <Text style={{fontWeight: '400', fontSize: 16, color: 'white', lineHeight: 24, letterSpacing: -0.6}}>{label}</Text>
    </TouchableOpacity>
  )
}