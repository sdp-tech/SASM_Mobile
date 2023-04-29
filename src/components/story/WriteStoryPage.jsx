import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { Request } from '../../common/requests';
import ModalSelector from 'react-native-modal-selector';
import PhotoOptions from '../../common/PhotoOptions';

export default function WriteStoryPage() {
  const editor = useRef(null);
  const request = new Request();
  const [places, setPlaces] = useState([]);
  const [repPic, setRepPic] = useState();
  const [story, setStory] = useState({ title: "", tag: "", preview: "", address: 0, story_review: "", html_content: "", rep_pic: "" });
  const options = {
    mediaType: "photo",
    maxWidth: 300,
  };

  const loadPlaces = async () => {
    const response = await request.get(`/sdp_admin/places/`, null, null);
    setPlaces(response.data.data);
  };
  const pickImage = () => {
    launchImageLibrary(options, (response) => { uploadImage(response.assets[0]) });
  }
  const uploadImage = async (image) => {
    const formData = new FormData();
    for (place of places) {
      if (story.address === place.id) {
        formData.append('place_name', place.place_name);
        formData.append('caption', place.place_name);
        break;
      }
    }
    console.log(image.uri, image.fileName);
    formData.append('file', {
      uri: image.uri,
      name: image.fileName,
      type: 'image/jpeg/png',
    });

    const response = await request.post("/sdp_admin/stories/photos/", formData, { "Content-Type": "multipart/form-data" });
    editor.current?.insertImage(response.data.data.location, 'width: 100%; height: auto;');
  };

  const saveStory = async () => {
    const formData = new FormData();
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
    const response = await request.post("/sdp_admin/stories/", formData, { "Content-Type": "multipart/form-data" });
  };
  useEffect(() => {
    loadPlaces();
  }, [])
  return (
    <SafeAreaView>
      <ScrollView>
        <ModalSelector
          data={places}
          keyExtractor={item => item.id}
          labelExtractor={item => item.place_name}
          onChange={(option) => { setStory({ ...story, address: option.id }) }}
        />
        <TextInput
          onChangeText={(title) => { setStory({ ...story, title: title }) }}
          placeholder='제목'
        />
        <TextInput
          onChangeText={(story_review) => { setStory({ ...story, story_review: story_review }) }}
          placeholder='한줄평'
        />
        <TextInput
          onChangeText={(tag) => { setStory({ ...story, tag: tag }) }}
          placeholder='태그'
        />
        <TextInput
          onChangeText={(preview) => { setStory({ ...story, preview: preview }) }}
          placeholder='프리뷰'
        />
        <PhotoOptions max={1} setPhoto={setRepPic} />
        {
          story.address != 0 &&
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
            <ScrollView style={{maxHeight:450}} nestedScrollEnabled={true}>
              <RichEditor
                ref={editor} // from useRef()
                onChange={(html_content) => { setStory({ ...story, html_content: html_content }) }}
                placeholder="Write your cool content here :)"
                initialHeight={450}
              />
            </ScrollView>
          </>
        }
        <TouchableOpacity onPress={saveStory}>
          <Text>제출</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
