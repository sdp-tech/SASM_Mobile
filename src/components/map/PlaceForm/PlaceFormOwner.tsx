import React, { Dispatch, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import styled from 'styled-components/native';
import PhotoOptions from '../../../common/PhotoOptions';
import Category from '../../../common/Category';
import Postcode from '@actbase/react-daum-postcode';
import { ScrollView } from 'react-native-gesture-handler';
import { Request } from '../../../common/requests';
import { PlaceFormProps } from './PlaceFormUser';
import { PhotoResultProps } from '../../../common/PhotoOptions';
import Check from "../../../assets/img/common/Check.svg";

const { width, height } = Dimensions.get('window');
const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const HeaderBox = styled.View<{ current: boolean }>`
  width: 33%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: ${props => props.current ? '#75E59B' : '#FFFFFF'};
`
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
const Next = styled.TouchableOpacity`
  width: 50%;
  margin: 40px auto;
  height: 50px;
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
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
const Section = styled.View`
  height: 75%;
  display: flex;
  flex-direction: row;
`
const SectionHalf = styled.View`
  width: 50%;
  padding-vertical: 40px;
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

const InputWithLabel = ({ label, onChangeText, placeholder, value, ...rest }: InputProps): JSX.Element => {
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

const InputTouchWithLabel = ({ label, onPress, children }: InputTouchProps): JSX.Element => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Text style={TextStyles.label}>{label}</Text>
      <InputTouch onPress={onPress}>
        {children}
      </InputTouch>
    </View>
  )
}

export const FinishModal = ({ setFinishModal, setPlaceformModal }: { setFinishModal: Dispatch<SetStateAction<boolean>>, setPlaceformModal: Dispatch<SetStateAction<boolean>> }): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      setFinishModal(false);
      setPlaceformModal(false);
    }, 3000)
  }, [])
  return (
    <SafeAreaView style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Check color={"#75E59B"} />
      <Text style={TextStyles.finish_title}>제보 완료 !</Text>
      <Text style={TextStyles.finish_content}>제보해주신 장소는</Text>
      <Text style={TextStyles.finish_content}>SASM에서 검토한 후</Text>
      <Text style={TextStyles.finish_content}>최종 등록됩니다</Text>
    </SafeAreaView>
  )
}

export default function PlaceFormOwner({ setPlaceformModal }: { setPlaceformModal: Dispatch<SetStateAction<boolean>> }): JSX.Element {
  const [tab, setTab] = useState<number>(0);
  //제보 후 완료 창
  const [finishModal, setFinishModal] = useState<boolean>(false);
  const request = new Request();
  //주소 입력 Modal
  const [postModal, setPostModal] = useState<boolean>(false);
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
    snsList: []
  });

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
    //const response = await request.post("/sdp_admin/places/save_place/", formData, { "Content-Type": "multipart/form-data" });
    setFinishModal(true);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Modal visible={finishModal}>
        <FinishModal setPlaceformModal={setPlaceformModal} setFinishModal={setFinishModal} />
      </Modal>
      <Header>
        <HeaderBox current={tab == 0}><Text style={tab == 0 ? TextStyles.headerWhite : TextStyles.header}>기본정보</Text></HeaderBox>
        <HeaderBox current={tab == 1}><Text style={tab == 1 ? TextStyles.headerWhite : TextStyles.header}>영업시간</Text></HeaderBox>
        <HeaderBox current={tab == 2}><Text style={tab == 2 ? TextStyles.headerWhite : TextStyles.header}>부가정보</Text></HeaderBox>
      </Header>
      {{
        0:
          <>
            <Text style={{ ...TextStyles.label, marginTop: 40, marginVertical: 20 }}>이미지 등록하기 *</Text>
            <Text style={TextStyles.label}>사업자 등록증</Text>
            <ReppicBox>
              <Image style={{ width: width - 70, height: ((width - 70) / rep_pic[0].width) * rep_pic[0].height, maxHeight: width - 70 }}
                source={{ uri: rep_pic[0].uri }}
                alt='사업자 등록증'
                resizeMode='contain' />
            </ReppicBox>
            <PhotoOptions
              max={1}
              setPhoto={(e) => { console.log(e) }} />
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
                photos.map((data, index) =>
                  <Image source={{ uri: data.uri }} alt={`장소 사진 ${index}`} style={{ width: (width - 70) / 3, height: (width - 70) / 3 }} resizeMode='contain' />
                )
              }
            </PhotoBox>
            <PhotoOptions
              max={3}
              setPhoto={setPhotos} />
            <InputWithLabel label="업체명 *"
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
            <InputWithLabel label="한 줄평"
              onChangeText={(e) => { setForm({ ...form, place_review: e }) }} />
            <InputWithLabel style={{ height: 100 }} label="장소 리뷰"
              onChangeText={(e) => { setForm({ ...form, short_cur: e }) }} />
            <Next onPress={() => { setTab(1) }}>
              <Text style={TextStyles.next}>다음단계</Text>
            </Next>
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
          </>,
        1: <>
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
          <Next onPress={() => { setTab(2) }}>
            <Text style={TextStyles.next}>다음단계</Text>
          </Next>
        </>,
        2: <>
          <Text style={TextStyles.labelBold}>제공 서비스</Text>
          <ServiceWrapper>
            <Service onPress={() => {
              Alert.alert('비건 카테고리', '',
                [
                  {
                    text: '비건',
                    onPress: () => setForm({ ...form, vegan_category: '비건' }),
                  },
                  {
                    text: '락토',
                    onPress: () => setForm({ ...form, vegan_category: '락토' }),
                  },
                  {
                    text: '오보',
                    onPress: () => setForm({ ...form, vegan_category: '오보' }),
                  },
                  {
                    text: '페스코',
                    onPress: () => setForm({ ...form, vegan_category: '페스토' }),
                  },
                  {
                    text: '폴로',
                    onPress: () => setForm({ ...form, vegan_category: '폴로' }),
                  },
                  {
                    text: '그 외',
                    onPress: () => setForm({ ...form, vegan_category: '그 외' }),
                  },
                  {
                    text: '없음',
                    onPress: () => setForm({ ...form, vegan_category: null }),
                    style: 'cancel'
                  },
                ]
              )
            }} selected={form.vegan_category != null}><Text style={form.vegan_category != null && TextStyles.serviceSelected}>비건카테고리 : {form.vegan_category != null ? form.vegan_category : '없음'}</Text></Service>
            <Service onPress={() => { setForm({ ...form, reusable_con_category: !form.reusable_con_category }) }} selected={form.reusable_con_category}><Text style={form.reusable_con_category && TextStyles.serviceSelected}>용기 내</Text></Service>
            <Service onPress={() => { setForm({ ...form, pet_category: !form.pet_category }) }} selected={form.pet_category}><Text style={form.pet_category && TextStyles.serviceSelected}>반려동물 출입</Text></Service>
          </ServiceWrapper>
          <Text style={TextStyles.labelBold}>이벤트</Text>
          <ServiceWrapper>
            <Service onPress={() => { setForm({ ...form, tumblur_category: !form.tumblur_category }) }} selected={form.tumblur_category}><Text style={form.tumblur_category && TextStyles.serviceSelected}>텀블러 할인</Text></Service>
          </ServiceWrapper>
          <Submit onPress={uploadPlace}>
            <Text style={TextStyles.next}>장소 제보하기</Text>
          </Submit>
        </>
      }[tab]}
    </ScrollView>
  )
}

const TextStyles = StyleSheet.create({
  headerWhite: {
    fontSize: 16,
    fontWeight: "700",
    color: '#FFFFFF'
  },
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
    fontSize: 15,
    marginTop: 5,
    color:'#000000'
  },
  labelBold: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "700",
  },
  header: {
    fontSize: 16,
    fontWeight: "700"
  },
  next: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "700",
  },
  serviceSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  finish_title: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 21,
    color:'#000000'
  },
  finish_content: {
    fontSize: 14,
    fontWeight: '300',
    color: '#777777',
    lineHeight: 20,
  }
})