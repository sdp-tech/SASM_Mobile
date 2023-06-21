import React, { Dispatch, SetStateAction } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from './CustomText';

const { width, height } = Dimensions.get('window')

interface PopupProps {
  //팝업 보이기
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  //모달 보이기
  setModal: Dispatch<SetStateAction<boolean>>;
}

export default function Popup({ visible, setVisible, setModal }: PopupProps): JSX.Element {
  return (
    <>
      {
        visible &&
        <View style={{ position: 'absolute',width:'100%', height: height, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ position: 'absolute', top: 350, alignSelf: 'center', width: 284, height: 178, backgroundColor: '#FFFFFF', justifyContent:'center', alignItems:'center' }}>
            <Text style={TextStyles.title}>나가시겠습니까?</Text>
            <Text style={TextStyles.subtitle}>입력하신 정보는 저장되지 않습니다.</Text>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', width:'80%'}}>
              <TouchableOpacity onPress={() => { setVisible(false);}}><Text style={{ ...TextStyles.button, backgroundColor: '#000000', color: '#FFFFFF' }}>머무르기</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setVisible(false); setModal(false); }}><Text style={TextStyles.button}>나가기</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      }
    </>
  )
}

const TextStyles = StyleSheet.create({
  button: {
    width: 85,
    height: 30,
    lineHeight: 30,
    fontSize: 15,
    borderColor: '#000000',
    borderWidth: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight:'700',
    marginBottom:15
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 30
  }
})