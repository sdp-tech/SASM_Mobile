import React, { Dispatch, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import PhotoOptions, { PhotoResultProps } from '../../../common/PhotoOptions';
import Category from '../../../common/Category';
import Postcode from '@actbase/react-daum-postcode';
import Close from "../../../assets/img/common/Close.svg";
import { ScrollView } from 'react-native-gesture-handler';
import { Request } from '../../../common/requests';

const { width, height } = Dimensions.get('window');

const ReppicBox = styled.View`
  height: ${width - 70};
  display: flex;
  justify-content: center;
  margin-vertical: 10px;
  background: #DADADA;
`
const PhotoBox = styled.View`
  height: ${(width - 70) / 3};
  background: #DADADA;
  margin-vertical: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
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
  width: 50%;
  margin: 40px auto;
  height: 50px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Header = styled.View<{ color: string }>`
  background-color: ${props => props.color};
  height: 12.5%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  padding: 10%;
`

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  z-index: 2;
`
const Section = styled.View`
  height: 87.5%;
  display: flex;
  flex-direction: row;
`
const SectionHalf = styled.View`
  height: 100%;
  width: 50%;
  padding-vertical: 40px;
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
  vegan_category: string | null;
  tumblur_category: boolean ;
  reusable_con_category: boolean ;
  pet_category: boolean ;
  longitude: number;
  latitude: number;
  snscount: number;
  [index: string]: any;
}

export default function PlaceFormUser({setPlaceformModal}:{setPlaceformModal: Dispatch<SetStateAction<boolean>>}): JSX.Element {
  //주소 입력 Modal
  const [postModal, setPostModal] = useState<boolean>(false);
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
    pet_category: false,
    reusable_con_category: false,
    tumblur_category: false,
    longitude: 0,
    latitude: 0,
    snscount: 0,
  });

  const request = new Request();
  const [rep_pic, setRep_pic] = useState<PhotoResultProps[]>([{
    width: 1,
    height: 1,
    fileName: '',
    uri: ''
  }])
  const [photos, setPhotos] = useState<PhotoResultProps[]>([]);
  //영업시간 리스트
  const open_hours = [
    { name: 'mon_hours', day: '월' },
    { name: 'tues_hours', day: '화' },
    { name: 'wed_hours', day: '수' },
    { name: 'thurs_hours', day: '목' },
    { name: 'fri_hours', day: '금' },
    { name: 'sat_hours', day: '토' },
    { name: 'sun_hours', day: '일' },
  ]
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
      formData.append(`${i}`, `${form[i]}`);
    }
    formData.append(`rep_pic`, {
      uri: rep_pic[0].uri,
      name: rep_pic[0].fileName,
      type: 'image/jpeg/png',
    })
    for (let i = 0; i < photos.length; i++) {
      formData.append(`placephoto${i + 1}`, {
        uri: photos[i].uri,
        name: photos[i].fileName,
        type: 'image/jpeg/png',
      })
    }
    formData.append('0', ',,')
    const response = await request.post("/sdp_admin/places/save_place/", formData, { "Content-Type": "multipart/form-data" });
    setPlaceformModal(false);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ ...TextStyles.label, marginTop: 40, marginVertical: 20 }}>이미지 등록하기 *</Text>
      <Text style={TextStyles.label}>대표 사진</Text>
      <ReppicBox>
        <Image style={{ width: width - 70, height: ((width - 70) / rep_pic[0].width) * rep_pic[0].height, maxHeight: width - 70 }}
          source={{ uri: rep_pic[0].uri }}
          alt='대표 사진'
          resizeMode='contain' />
      </ReppicBox>
      <PhotoOptions
        max={1}
        setPhoto={setRep_pic} />
      <Text style={TextStyles.label}>장소 사진</Text>
      <PhotoBox>
        {
          photos.map((data, index) => <Image source={{ uri: data.uri }} alt={`장소 사진 ${index}`} style={{ width: (width - 70) / 3, height: (width - 70) / 3 }} resizeMode='contain' />)
        }
      </PhotoBox>
      <PhotoOptions
        max={3}
        setPhoto={setPhotos} />
      <InputWithLabel label="장소명 *"
        onChangeText={(e) => { setForm({ ...form, place_name: e }) }} />
      <InputTouchWithLabel label='장소 등록 *'
        onPress={() => { setPostModal(true) }}>
        {
          form.address != '' && <Text>{form.address}</Text>
        }
      </InputTouchWithLabel>
      <Text style={TextStyles.label}>카테고리 선택</Text>
      <Category checkedList={checkedList} setCheckedList={setCheckedList} />
      <InputWithLabel label="전화번호" placeholder='02-0000-0000'
        onChangeText={(e) => { setForm({ ...form, phone_num: e }) }}
        inputMode='tel' />
      <InputTouchWithLabel label='영업시간' onPress={() => { setHourModal(true) }}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          {
            open_hours.map(data => <Text>{data.day} {form[data.name]} / </Text>
            )
          }
          <Text>브레이크타임 {form.etc_hours}</Text>
        </View>
      </InputTouchWithLabel>
      <InputWithLabel label="한 줄평"
        onChangeText={(e) => { setForm({ ...form, place_review: e }) }} />
      <InputWithLabel style={{ height: 100 }} label="장소 리뷰"
        onChangeText={(e) => { setForm({ ...form, short_cur: e }) }} />
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
        <View style={{ height: '100%' }}>
          <Header color='#75E59B'>
            <Text style={TextStyles.header}>영업시간</Text>
            <CloseButton onPress={() => { setHourModal(false) }}>
              <Close color={'#FFFFFF'} />
            </CloseButton>
          </Header>
          <Section>
            <SectionHalf>
              <Text style={TextStyles.hourtitle}>영업시간</Text>
              {
                open_hours.map((data) =>
                  <View style={{ display: "flex", flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={TextStyles.hour}>{data.day}</Text>
                    <TextInput style={{ width: '75%', height: 45, textAlign: 'center' }}
                      inputMode='numeric'
                      onChangeText={(e) => { setForm({ ...form, [data.name]: e }) }}
                      placeholder='00:00 ~ 00:00' value={form[data.name]}
                    />
                  </View>
                )
              }
            </SectionHalf>
            <SectionHalf>
              <Text style={TextStyles.hourtitle}>브레이크타임</Text>
              <TextInput style={{ width: '100%', height: 45, textAlign: 'center', marginVertical: 10 }}
                onChangeText={(e) => { setForm({ ...form, etc_hours: e }) }}
                inputMode='numeric'
                placeholder='00:00 ~ 00:00' />
            </SectionHalf>
          </Section>
        </View>
      </Modal>
    </ScrollView>
  )
}

const TextStyles = StyleSheet.create({
  hourtitle: {
    fontWeight: "700",
    textAlign: 'center'
  },
  hour: {
    fontSize: 16,
    width: '25%',
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginTop: 5,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: "700"
  },
  submit: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "700",
  },
})