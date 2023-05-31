import React, {Dispatch, SetStateAction, RefObject} from 'react';
import { TextPretendard as Text } from '../../../../common/CustomText';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SNSListProps } from '../PlaceForm';
import { InputSNSProps } from '../PlaceFormUser';
import ModalSelector from 'react-native-modal-selector';
import styled from 'styled-components/native';
import Close from "../../../../assets/img/common/Close.svg";
import { HeaderPlaceForm } from '../PlaceForm';

const Input = styled.TextInput`
  border: 1px solid #BFBFBF;
  height: 45px;
  margin-vertical: 5px;
  padding-horizontal: 10px;
`

interface SNSModalProps {
  setSNSModal: Dispatch<SetStateAction<boolean>>;
  snsType: SNSListProps[];
  selectorSNSRef: RefObject<ModalSelector>;
  setSNSList: Dispatch<SetStateAction<InputSNSProps[]>>;
  snsList: InputSNSProps[];
}

export default function SNSModal({ setSNSModal, snsType, selectorSNSRef, setSNSList, snsList }: SNSModalProps): JSX.Element{
  console.log(snsList);
  return (
    <View style={{ height: '100%' }}>
      <HeaderPlaceForm color='#75E59B'>
        <Text style={TextStyles.header}>영업시간</Text>
        <TouchableOpacity onPress={() => { setSNSModal(false) }}>
          <Close color={'#FFFFFF'} />
        </TouchableOpacity>
      </HeaderPlaceForm>
      <View style={{ padding: 35 }}>
        <ModalSelector
          data={snsType}
          ref={selectorSNSRef}
          labelExtractor={item => item.name}
          keyExtractor={item => item.id}
          cancelText='취소'
          cancelTextStyle={{ fontSize: 14 }}
          cancelContainerStyle={{ width: 300, alignSelf: 'center' }}
          optionContainerStyle={{ width: 300, alignSelf: 'center' }}
          optionTextStyle={{ color: "#000000", fontSize: 14 }}
          selectStyle={{ display: 'none' }}
          onModalClose={(option) => { setSNSList([...snsList, { type: option.name, link: '' }]) }}
        />
        <TouchableOpacity onPress={() => {
          if (selectorSNSRef.current) selectorSNSRef.current.open();
        }
        }><Text style={TextStyles.sns_add}>SNS 추가</Text></TouchableOpacity>
        <View>
          {
            snsList.map(data =>
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                <Text style={TextStyles.sns}>{data.type != undefined ? data.type : '기타'}</Text>
                <Input autoCapitalize='none' style={{ width: '70%' }} defaultValue={data.link} onChangeText={(e) => { setSNSList([...snsList.filter(el => el.type != data.type), { type: data.type, link: e }]) }} />
              </View>
            )
          }
        </View>
      </View>
      {/* <TouchableOpacity onPress={()=>{setSNSList(snsList); setSNSModal(false)}}><Text style={TextStyles.sns_add}>저장</Text></TouchableOpacity> */}
    </View>
  )
}

const TextStyles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: "700"
  },
  sns: {
    width: '30%',
    fontSize: 15,
    textAlign: 'center',
  },
  sns_add: {
    alignSelf: 'center',
    backgroundColor: '#67D393',
    color: '#FFFFFF',
    width: 100,
    height: 35,
    lineHeight: 35,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,

  }
})