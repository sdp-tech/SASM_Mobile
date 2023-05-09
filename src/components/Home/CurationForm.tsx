import React, { Dispatch, SetStateAction, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Dimensions, Text, TextInput, TouchableOpacity, Image, Modal, View, ActivityIndicator, ImageBackground, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PhotoOptions, { PhotoResultProps } from '../../common/PhotoOptions';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';
import SelectStoryModal from './FomrModals/SelectStoryModal';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import AddColor from "../../assets/img/common/AddColor.svg";

const { width, height } = Dimensions.get('window');

const ReppicBox = styled.TouchableOpacity`
  position: relative;
  height: ${height / 2};
  display: flex;
  justify-content: center;
  background: #DADADA;
`
const InputTitle = styled.TextInput`
  border-color: #000000;
  border-bottom-width: 1px;
  position: absolute;
  bottom: 20px;
  width: 100%;
  height: 50px;
  color: #000000;
  font-size: 32px;
  padding-horizontal: 15px;
  font-weight: 700;
`
const Section = styled.View`
  padding: 15px;
`
const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 3px;
  background-color: #D9D9D9; 
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
`
const StoryImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 3px;
  margin: 4px;
`
const StorySection = styled.View`
  display: flex;
  flex-flow: row wrap;
  margin-vertical: 20px;
`
const InputContent = styled.TextInput`
  padding: 15px;
  height: 200px;
  font-size: 14px;
  border: 1px solid #797979;
  border-radius: 5px;
  margin-bottom: 20px;
`
const Footer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

width - 320 - 30 / 8

interface FormProps {
  title: string;
  contents: string;
  // stories: string[];
  [index: string]: any;
}

export default function CurationForm({ navigation, route }: StackScreenProps<HomeStackParams>): JSX.Element {
  const [form, setForm] = useState<FormProps>({
    title: '',
    contents: '',
    // stories: [],
  });
  const [selectedStory, setSelectedStory] = useState<any[]>([]);
  const [rep_pic, setRep_pic] = useState<any>([{
    uri: '',
    width: 1,
    height: 1,
    fileName: '',
  }])
  const [selectStoryModal, setSelectStoryModal] = useState<boolean>(false);
  const request = new Request();

  const uploadCuration = async () => {
    const formData = new FormData();
    for (let i of Object.keys(form)) {
      console.log(i, form[i]);
      formData.append(i, form[i]);
    }

    formData.append('rep_pic', {
      uri: rep_pic[0].uri,
      name: rep_pic[0].fileName,
      type: 'image/jpeg/png',
    })
    for (let i of selectedStory) {
      formData.append('stories', i.id);
      formData.append('short_curations', '.');
    }
    if(form.title.length ==0 || form.contents.length==0) {
      Alert.alert('빈 칸을 전부 채워주세요.')
      return;
    }
    if(rep_pic[0].uri=='') {
      Alert.alert('대표 사진을 설정해주세요.')
      return;
    }
    if(selectedStory.length<3) {
      Alert.alert('최소 3개의 스토리를 선택해주세요.')
      return;
    }
    const response = await request.post('/curations/curation_create/', formData, { "Content-Type": "multipart/form-data" });
    navigation.goBack();
  }

  const handleRepPic = () => {
    Alert.alert('대표 사진 선택', '', [
      {
        text: '카메라',
        onPress: () => { launchCamera({ mediaType: 'photo', maxHeight: height / 2, maxWidth: width }, response => setRep_pic(response.assets)) }
      },
      {
        text: '앨범',
        onPress: () => { launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, maxHeight: height / 2, maxWidth: width }, response => setRep_pic(response.assets)) }
      }

    ])
  }

  return (
    <ScrollView>
      <ReppicBox onPress={handleRepPic}>
        <Image style={{ width: width, height: height / 2 }}
          source={{ uri: rep_pic[0].uri }}
          alt='대표 사진'
          resizeMode='contain' />
        <InputTitle placeholder='제목을 입력해주세요 *' placeholderTextColor={'#000000'} onChangeText={(e) => { setForm({ ...form, title: e }) }} maxLength={45} />
        <Text style={{ position: 'absolute', bottom: 25, right: 0 }}>{form.title.length}/45</Text>
      </ReppicBox>
      <Section>
        <Text style={TextStyles.List}>선택된 스토리</Text>
        <StorySection>
          {
            selectedStory.map(data =>
              <StoryImage source={{ uri: data.rep_pic }} />
            )
          }
          <Button onPress={() => [setSelectStoryModal(true)]}>
            <AddColor width={36} height={36} color={'#595959'} />
          </Button>
        </StorySection>
        <View style={{ position: 'relative' }}>
          <InputContent multiline={true} textAlignVertical='top' placeholder='큐레이션 설명을 작성해보세요.' onChangeText={(e) => { setForm({ ...form, contents: e }) }} maxLength={200} />
          <Text style={{ position: 'absolute', bottom: 30, right: 15 }}>{form.contents.length}/200</Text>
        </View>
        <Footer>
          <TouchableOpacity onPress={navigation.goBack}><Text>취소</Text></TouchableOpacity>
          <TouchableOpacity onPress={uploadCuration}><Text>저장</Text></TouchableOpacity>
        </Footer>
      </Section>
      <Modal visible={selectStoryModal}>
        <SelectStoryModal setSelectStoryModal={setSelectStoryModal} setSelectedStory={setSelectedStory} selectedStory={selectedStory} />
      </Modal>
    </ScrollView>
  )
}

const TextStyles = StyleSheet.create({
  List: {
    fontSize: 16,
    fontWeight: '600'
  },
})