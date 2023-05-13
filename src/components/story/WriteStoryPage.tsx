import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Modal, Dimensions, Alert } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Request } from '../../common/requests';
import ModalSelector from 'react-native-modal-selector';
import Check from '../../assets/img/Story/Check.svg';
import { StoryProps } from '../../pages/Story';

export default function WriteStoryPage({ navigation, route }: StoryProps) {
  const editor = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const request = new Request();
  const id = route.params?.id;
  const [places, setPlaces] = useState([] as any);
  const [repPic, setRepPic] = useState([] as any);
  const [story, setStory] = useState({ title: "", tag: "", preview: "", place: 0, story_review: "", html_content: "", photoList: [], rep_pic: "" });
  const [photo, setPhoto] = useState([] as any);
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = Dimensions.get('screen');

  const options: ImageLibraryOptions = {
    mediaType: "photo",
    maxWidth: 300,
  };

  const loadPlaces = async () => {
    const response = await request.get(`/sdp_admin/places/`, null, null);
    setPlaces(response.data.data);
  };

  const pickImage = () => {
    launchImageLibrary(options, (response: any) => {
      uploadImage(response.assets[0]);
    });
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
    setRepPic(image);
    const response = await request.post("/stories/story_photos/create/", formData, { "Content-Type": "multipart/form-data" });
    editor.current?.insertImage(response.data.data.location, 'width: 100%; height: auto;');
    setPhoto([...photo, response.data.data.location]);
  };

  const saveStory = async () => {
    const formData = new FormData();
    setStory({ ...story, photoList: photo});
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
    const response = await request.post("/stories/create/", formData, { "Content-Type": "multipart/form-data" });
    showModal(response.data.data.id);
  };

  const showModal = (id: number) => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('StoryDetail', {id: id})
    }, 3000)
  }

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({y: scrollY - 30, animated: true});
  }, []);

  useEffect(() => {
    loadPlaces();
    console.log('id', id)
  }, []);
  
  return (
    <SafeAreaView>
      <Modal animationType='slide' visible={modalVisible}>
        <View style={{width: width, height: height, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Check />
          <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 10}}>작성 완료 !</Text>
          <Text>작성한 스토리는</Text>
          <Text>마이페이지 {'>'} 스토리 {'>'} 내가 쓴 스토리</Text>
          <Text>에서 확인할 수 있어요</Text>
        </View>
      </Modal>
      <View style={{flexDirection: 'row', borderBottomColor: '#D9D9D9', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20, fontWeight: '700', textAlign: 'center', marginLeft: 150, marginBottom: 10}}>스토리 작성</Text>
        <TouchableOpacity style={{marginLeft: 100, marginTop: 5}} onPress={saveStory}>
          <Text>등록</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <TextInput
          onChangeText={(title) => { setStory({ ...story, title: title }) }}
          placeholder='제목 *'
          style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, padding: 10}}
        />
        <TextInput
          onChangeText={(story_review) => { setStory({ ...story, story_review: story_review }) }}
          placeholder='소제목'
          style={{padding: 10}}
        />
        <ModalSelector
          data={places}
          keyExtractor={item => item.id}
          labelExtractor={item => item.place_name}
          onChange={(option) => { setStory({ ...story, place: option.id }) }}
          initValue='장소 선택 *'
          initValueTextStyle={{textAlign: 'left', fontSize: 14, color: '#bcbcbe'}}
          selectStyle={{borderRadius: 0, borderTopColor: '#D9D9D9', borderBottomColor: '#D9D9D9', borderLeftWidth:0, borderRightWidth:0, borderBottomWidth: 1, alignItems: 'flex-start', padding: 10}}
        />
        <TextInput
          onChangeText={(preview) => { setStory({ ...story, preview: preview }) }}
          placeholder='프리뷰'
          style={{padding: 10, borderBottomColor: '#D9D9D9', borderBottomWidth: 1}}
        />
        {
          story.place != 0 &&
          <>
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
      <TextInput
          onChangeText={(tag) => { setStory({ ...story, tag: tag }) }}
          placeholder='해시태그를 입력해주세요'
          style={{padding: 10, position: 'absolute', top: 730}}
        />
    </SafeAreaView>
  )
}