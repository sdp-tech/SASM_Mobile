import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Modal, Dimensions, Alert, Image } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Request } from '../../common/requests';
import styled from 'styled-components/native';
import PhotoOptions from '../../common/PhotoOptions';
import ModalSelector from 'react-native-modal-selector';
import Check from '../../assets/img/Story/Check.svg';
import { StoryProps } from '../../pages/Story';

const { width, height } = Dimensions.get('window');
const ReppicBox = styled.TouchableOpacity`
  position: relative;
  height: 30;
  display: flex;
  justify-content: center;
  background: #FFFFFF;
`

export default function WriteStoryPage({ navigation, route }: StoryProps) {
  const editor = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const request = new Request();
  const id = route.params?.id;
  const [places, setPlaces] = useState([] as any);
  const [repPic, setRepPic] = useState([] as any);
  const [story, setStory] = useState({ title: "", tag: "", preview: "", place: 0, story_review: "", html_content: "", photoList: [], rep_pic: "" });
  const [photoList, setPhotoList] = useState([] as any);
  const [modalVisible, setModalVisible] = useState(false);

  const options: ImageLibraryOptions = {
    mediaType: "photo",
    maxWidth: 300,
  };

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const response_places = await request.get(`/sdp_admin/places/`, null, null);
    setPlaces(response_places.data.data);
    if (!id) return;
    else {
      const response_story = await request.get(`/stories/story_detail/${id}/`);
      console.log(response_story.data.data)
      let _place = 0;
      const { title, tag, preview, story_review, html_content, rep_pic, place_name } = response_story.data.data;
      for (const place of response_places.data.data) {
        if (place_name === place.place_name){
          _place = place.id
        }
      }
      setStory({
        ...story,
        title: title, tag: tag, preview: preview, story_review: story_review, place: _place,
        html_content: html_content, rep_pic: rep_pic
      });
    }
  }

  const pickImage = () => {
    launchImageLibrary(options, (response: any) => {
      uploadImage(response.assets[0]);
    });
  }

  const handleRepPic = () => {
    Alert.alert('대표 사진 선택', '', [
      {
        text: '카메라',
        onPress: () => { launchCamera({ mediaType: 'photo', maxHeight: height / 2, maxWidth: width }, response => setRepPic(response.assets)) }
      },
      {
        text: '앨범',
        onPress: () => { launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, maxHeight: height / 2, maxWidth: width }, response => setRepPic(response.assets)) }
      }
    ])
  }

  const uploadImage = async (image: any) => {
    const formData = new FormData();
    for (const place of places) {
      if (story.place === place.id) {
        formData.append('place_id', place.id);
        formData.append('caption', place.place_name);
        break;
      }
    }
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: 'image/jpeg/png',
    });
    const response = await request.post("/stories/story_photos/create/", formData, { "Content-Type": "multipart/form-data" });
    editor.current?.insertImage(response.data.data.location, 'width: 100%; height: auto;');
    setPhotoList([...photoList, response.data.data.location]);
  };

  const saveStory = async () => {
    const formData = new FormData();
    for (const photo of photoList){
      formData.append('photoList', photo);
    }
    for (let [key, value] of Object.entries(story)) {
      if (key === "rep_pic") {
        formData.append(`${key}`, {
          uri: repPic[0].uri,
          name: repPic[0].fileName,
          type: 'image/jpeg/png',
        });
      } else {
        //문자열의 경우 변환
        formData.append(`${key}`, `${value}`);
      }
    }
    const response = await request.post("/stories/create/", formData, { "Content-Type": "multipart/form-data" });
    showModal(response.data.data.id);
  };

  const updateStory = async () => {
    const formData = new FormData();
    for (const photo of photoList){
      formData.append('photoList', photo);
    }
    for (let [key, value] of Object.entries(story)) {
      if (key === "rep_pic") {
        formData.append(`${key}`, {
          uri: repPic.uri,
          name: repPic.fileName,
          type: 'image/jpeg/png',
        });
      } else {
        //문자열의 경우 변환
        formData.append(`${key}`, `${value}`);
      }
    }
    const response = await request.put(`/stories/${id}/update/`, formData, { "Content-Type": "multipart/form-data" });
    showModal(id);
  }

  const showModal = (id: number) => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.replace('StoryDetail', {id: id})
    }, 3000)
  }

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({y: scrollY - 30, animated: true});
  }, []);
  
  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={modalVisible}>
        <View style={{width: width, height: height, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Check />
          <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 10}}>{ id ? '수정 완료 !' : '작성 완료 !'}</Text>
          <Text>작성한 스토리는</Text>
          <Text>마이페이지 {'>'} 스토리 {'>'} 내가 쓴 스토리</Text>
          <Text>에서 확인할 수 있어요</Text>
        </View>
      </Modal>
      <View style={{flexDirection: 'row', borderBottomColor: '#D9D9D9', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20, fontWeight: '700', textAlign: 'center', marginLeft: 150, marginBottom: 10}}>스토리 작성</Text>
        <TouchableOpacity style={{marginLeft: 100, marginTop: 5}} onPress={id ? updateStory : saveStory}>
          <Text>{ id ? '수정' : '등록'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TextInput
          value={story.title}
          onChangeText={(title) => { setStory({ ...story, title: title }) }}
          placeholder='제목 *'
          style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, padding: 10}}
        />
        <TextInput
          value={story.story_review}
          onChangeText={(story_review) => { setStory({ ...story, story_review: story_review }) }}
          placeholder='소제목'
          style={{padding: 10}}
        />
        <ModalSelector
          data={places}
          selectedKey={id ? story.place : 0}
          keyExtractor={item => item.id}
          labelExtractor={item => item.place_name}
          onChange={(option) => { setStory({ ...story, place: option.id }) }}
          initValue='장소 선택 *'
          initValueTextStyle={{textAlign: 'left', fontSize: 14, color: '#bcbcbe'}}
          selectStyle={{borderRadius: 0, borderTopColor: '#D9D9D9', borderBottomColor: '#D9D9D9', borderLeftWidth:0, borderRightWidth:0, borderBottomWidth: 1, alignItems: 'flex-start', padding: 10}}
          selectTextStyle={{fontSize: 14, color: 'black'}}
        />
        {
          story.place != 0 &&
          <>
            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 10, color: (story.rep_pic == '' && repPic.length == 0) ? '#bcbcbe' : 'black'}}>대표 사진</Text>
              <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} onPress={handleRepPic}>
                { story.rep_pic == '' && repPic.length == 0 ? (
                  <Text style={{color: '#bcbcbe'}}>업로드</Text>
                ) : (
                  <Image source={{uri: repPic.length > 0 ? repPic[0].uri : story.rep_pic}} style={{width: 30, height: 30}} />
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              value={story.preview}
              onChangeText={(preview) => { setStory({ ...story, preview: preview }) }}
              placeholder='프리뷰'
              style={{padding: 10, borderTopColor: '#D9D9D9', borderBottomColor: '#D9D9D9', borderTopWidth: 1, borderBottomWidth: 1}}
            />
            <TextInput
              value={story.tag}
              onChangeText={(tag) => { setStory({ ...story, tag: tag }) }}
              placeholder='해시태그를 입력해주세요'
              style={{padding: 10, borderBottomColor: '#D9D9D9', borderBottomWidth: 1}}
            />
            <RichToolbar
              editor={editor}
              actions={[
                actions.insertImage,
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              onPressAddImage={pickImage}
            />
            <ScrollView ref={scrollRef} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              <RichEditor
                ref={editor} // from useRef()
                initialContentHTML={story.html_content}
                onChange={(html_content) => { setStory({ ...story, html_content: html_content }) }}
                placeholder="내용"
                initialHeight={450}
                useContainer={true}
                onCursorPosition={handleCursorPosition}
              />
            </ScrollView>
          </>
        }
      </ScrollView>
    </SafeAreaView>
  )
}