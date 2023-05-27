import React, { Dispatch, ReactElement, ReactNode, SetStateAction, useEffect, useState, useRef, RefObject } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { PhotoResultProps, PhotoSelector } from '../../../common/PhotoOptions';
import Category from '../../../common/Category';
import Postcode from '@actbase/react-daum-postcode';
import Close from "../../../assets/img/common/Close.svg";
import { ScrollView } from 'react-native-gesture-handler';
import { Request } from '../../../common/requests';
import { FinishModal } from './PlaceFormOwner';
import { SNSListProps } from './PlaceForm';
import ModalSelector from 'react-native-modal-selector';
import SNSModal from './Modals/SNSModal';
import HourModal from './Modals/HourModal';

const { width, height } = Dimensions.get('window');

const Input = styled.TextInput`
  border: 1px solid #BFBFBF;
  height: 45px;
  margin-vertical: 5px;
  padding-horizontal: 10px;
`
const InputTouch = styled.TouchableOpacity`
  border: 1px solid #BFBFBF;
  height: 45px;
  margin-vertical: 5px;
  padding-horizontal: 10px;
  display: flex;
  justify-content: center;
`
const Submit = styled.TouchableOpacity`
  width: 65%;
  margin: 40px auto;
  height: 63px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ServiceWrapper = styled.View`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
  margin-vertical: 20px;
`
const Service = styled.TouchableOpacity<{ selected: boolean | null }>`
  width: 45%;
  height: 50px;
  display: flex;
  justify-content: center;
  border: 1px solid #B7B7B7;
  margin-vertical: 5px;
  padding-horizontal: 10px;
  background-color: ${props => props.selected ? '#75E59B' : '#FFFFFF'};
`
interface InputProps extends TextInputProps {
  label: string;
  onChangeText: (e: string) => void;
}

const InputWithLabel = ({ label, onChangeText, placeholder, value, ...rest }: InputProps) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Text style={TextStyles.label}>{label}</Text>
      <Input value={value} placeholder={placeholder} onChangeText={(e) => { onChangeText(e) }} {...rest} />
    </View>
  )
}


interface InputTouchProps {
  label: string;
  onPress: () => void;
  children?: ReactNode | JSX.Element | ReactElement;
}

const InputTouchWithLabel = ({ label, onPress, children }: InputTouchProps) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Text style={TextStyles.label}>{label}</Text>
      <InputTouch onPress={onPress}>
        {children}
      </InputTouch>
    </View>
  )
}

export interface InputSNSProps {
  type: string;
  link: string;
}

export interface PlaceFormProps {
  place_name: string;
  category: string;
  mon_hours: string;
  tues_hours: string;
  wed_hours: string;
  thurs_hours: string;
  fri_hours: string;
  sat_hours: string;
  sun_hours: string;
  etc_hours: string;
  place_review: string;
  address: string;
  short_cur: string;
  phone_num: string;
  vegan_category: string | null | undefined;
  tumblur_category: boolean | null;
  reusable_con_category: boolean | null;
  pet_category: boolean | null;
  [index: string]: any;
}

//영업시간 리스트
export const open_hours = [
  { name: 'mon_hours', day: '월' },
  { name: 'tues_hours', day: '화' },
  { name: 'wed_hours', day: '수' },
  { name: 'thurs_hours', day: '목' },
  { name: 'fri_hours', day: '금' },
  { name: 'sat_hours', day: '토' },
  { name: 'sun_hours', day: '일' },
]

export default function PlaceFormUser({ setPlaceformModal, snsType }: { setPlaceformModal: Dispatch<SetStateAction<boolean>>, snsType: SNSListProps[] }): JSX.Element {
  //주소 입력 Modal
  const [postModal, setPostModal] = useState<boolean>(false);
  //SNS 입력 Modal
  const [snsModal, setSNSModal] = useState<boolean>(false);
  const [finishModal, setFinishModal] = useState<boolean>(false);
  //영업시간 입력 Modal
  const [hourModal, setHourModal] = useState<boolean>(false);
  //카테고리 선택
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [form, setForm] = useState<PlaceFormProps>({
    place_name: '',
    category: '',
    mon_hours: '',
    tues_hours: '',
    wed_hours: '',
    thurs_hours: '',
    fri_hours: '',
    sat_hours: '',
    sun_hours: '',
    place_review: '',
    address: '',
    short_cur: '',
    phone_num: '',
    etc_hours: '',
    vegan_category: null,
    pet_category: null,
    reusable_con_category: null,
    tumblur_category: null,
  });
  const request = new Request();
  const [rep_pic, setRep_pic] = useState<PhotoResultProps[]>([{
    width: 1,
    height: 1,
    fileName: '',
    uri: ''
  }])
  const [photos, setPhotos] = useState<PhotoResultProps[]>([]);
  const [snsList, setSNSList] = useState<InputSNSProps[]>([]);

  const vegan_category = [
    { type: '비건', key: 0 },
    { type: '락토', key: 1 },
    { type: '오보', key: 2 },
    { type: '페스코', key: 3 },
    { type: '폴로', key: 4 },
    { type: '그 외', key: 5 },
    { type: '없음', key: 6 }
  ];
  useEffect(() => {
    if (checkedList.length > 1) {
      Alert.alert('카테고리는 최대 1개까지만 선택 가능합니다.');
      setCheckedList([]);
    }
    else {
      setForm({ ...form, category: checkedList[0] });
    }
  }, [checkedList])

  const uploadPlace = async () => {
    const formData = new FormData();
    for (let i of Object.keys(form)) {
      if(i=='snsList') continue;
      formData.append(`${i}`, `${form[i]}`);
    }
    formData.append(`rep_pic`, {
      uri: rep_pic[0].uri,
      name: rep_pic[0].fileName,
      type: 'image/jpeg/png',
    })
    for (let i = 0; i < photos.length; i++) {
      formData.append(`imageList`, {
        uri: photos[i].uri,
        name: photos[i].fileName,
        type: 'image/jpeg/png',
      })
    }
    for (let i =0; i< snsList.length; i++) {
      formData.append('snsList', `${i+1},${snsList[i].link}`)
    }
    const response = await request.post("/places/create/", formData, { "Content-Type": "multipart/form-data" });
    setFinishModal(true);
  }
  //ModalSelector
  const selectorHourRef = useRef<ModalSelector>(null);
  const selectorSNSRef = useRef<ModalSelector>(null);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Modal visible={finishModal}>
        <FinishModal setPlaceformModal={setPlaceformModal} setFinishModal={setFinishModal} />
      </Modal>
      <Text style={{ ...TextStyles.label, marginTop: 40, marginBottom: 20 }}>이미지 등록하기 *</Text>
      <Text style={TextStyles.label}>대표 사진 *</Text>
      <PhotoSelector max={1} setPhoto={setRep_pic} width={width - 70} height={width - 120}>
        <Image style={{ width: width - 70, height: ((width - 70) / rep_pic[0].width) * rep_pic[0].height, maxHeight: width - 120 }}
          source={{ uri: rep_pic[0].uri }}
          alt='대표 사진'
          resizeMode='contain' />

      </PhotoSelector>
      <Text style={TextStyles.label}>장소 사진 *</Text>
      <PhotoSelector max={3} width={width - 70} height={(width - 70) / 3} setPhoto={setPhotos}>
        {
          photos.map((data, index) => <Image source={{ uri: data.uri }} alt={`장소 사진 ${index}`} style={{ width: (width - 70) / 3, height: (width - 70) / 3 }} resizeMode='contain' />)
        }
      </PhotoSelector>
      <InputWithLabel label="장소명 *"
        onChangeText={(e) => { setForm({ ...form, place_name: e }) }} />
      <InputTouchWithLabel label='장소 등록 *'
        onPress={() => { setPostModal(true) }}>
        {
          form.address != '' && <Text>{form.address}</Text>
        }
      </InputTouchWithLabel>
      <Text style={TextStyles.label}>카테고리 선택 *</Text>
      <Category checkedList={checkedList} setCheckedList={setCheckedList} />
      <InputWithLabel label="전화번호 *" placeholder='02-0000-0000'
        onChangeText={(e) => { setForm({ ...form, phone_num: e }) }}
        inputMode='tel' />
      <InputTouchWithLabel label='영업시간 *' onPress={() => { setHourModal(true) }}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {
            open_hours.map(data => <Text>{data.day} {form[data.name]} / </Text>
            )
          }
          <Text>브레이크타임 {form.etc_hours}</Text>
        </View>
      </InputTouchWithLabel>
      <InputWithLabel label="한 줄평 *"
        onChangeText={(e) => { setForm({ ...form, place_review: e }) }} />
      <InputWithLabel style={{ height: 100 }} label="장소 리뷰 *"
        onChangeText={(e) => { setForm({ ...form, short_cur: e }) }} />
      <InputTouchWithLabel label='SNS' onPress={() => { setSNSModal(true) }}>
        {snsList.map(data => <Text>{data.type != undefined ? data.type : '기타'}:{data.link}</Text>)}
      </InputTouchWithLabel>
      <Text style={TextStyles.labelBold}>제공 서비스</Text>
      <ServiceWrapper>
        <ModalSelector
          ref={selectorHourRef}
          labelExtractor={item => item.type} data={vegan_category}
          cancelText='취소' cancelTextStyle={{ fontSize: 14 }} cancelContainerStyle={{ width: 300, alignSelf: 'center' }}
          optionContainerStyle={{ width: 300, alignSelf: 'center' }} optionTextStyle={{ color: "#000000", fontSize: 14 }}
          selectStyle={{ display: 'none' }}
          onChange={(option) => { (option.type == '없음' ? setForm({ ...form, vegan_category: null }) : setForm({ ...form, vegan_category: option.type })) }}
        />
        <Service selected={form.vegan_category != null}
          onPress={() => { if (selectorHourRef.current) selectorHourRef.current.open(); }}>
          <Text style={form.vegan_category != null && TextStyles.serviceSelected}>비건카테고리 : {form.vegan_category != null ? form.vegan_category : '없음'}</Text>
        </Service>
        <Service selected={form.reusable_con_category}
          onPress={() => { setForm({ ...form, reusable_con_category: !form.reusable_con_category }) }}>
          <Text style={form.reusable_con_category && TextStyles.serviceSelected}>용기 내</Text>
        </Service>
        <Service selected={form.pet_category}
          onPress={() => { setForm({ ...form, pet_category: !form.pet_category }) }}>
          <Text style={form.pet_category && TextStyles.serviceSelected}>반려동물 출입</Text>
        </Service>
      </ServiceWrapper>
      <Text style={TextStyles.labelBold}>이벤트</Text>
      <ServiceWrapper>
        <Service onPress={() => { setForm({ ...form, tumblur_category: !form.tumblur_category }) }} selected={form.tumblur_category}><Text style={form.tumblur_category && TextStyles.serviceSelected}>텀블러 할인</Text></Service>
      </ServiceWrapper>
      <Submit onPress={uploadPlace}>
        <Text style={TextStyles.submit}>장소 제보하기</Text>
      </Submit>
      <Modal visible={postModal}>
        <Postcode style={{ width: width, height: height - 100, marginTop: 100 }}
          onError={() => { Alert.alert('주소 검색에 실패하였습니다.') }}
          jsOptions={{ animation: true, hideMapBtn: true }}
          onSelected={data => {
            setForm({ ...form, address: data.address })
            setPostModal(false);
          }}
        />
      </Modal>
      <Modal visible={hourModal}>
        <HourModal form={form} setForm={setForm} setHourModal={setHourModal} />
      </Modal>
      <Modal visible={snsModal}>
        <SNSModal setSNSModal={setSNSModal} setSNSList={setSNSList} snsList={snsList} selectorSNSRef={selectorSNSRef} snsType={snsType} />
      </Modal>
    </ScrollView>
  )
}
const TextStyles = StyleSheet.create({
  label: {
    fontSize: 15,
    marginTop: 5,
    lineHeight: 35,
    color: '#000000'
  },
  labelBold: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "700",
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: "700"
  },
  submit: {
    fontSize: 24,
    lineHeight: 35,
    color: '#FFFFFF',
    fontWeight: "700",
  },
  serviceSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
})