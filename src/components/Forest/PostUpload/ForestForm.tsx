import { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Dimensions, ImageBackground, TextInput, ScrollView, Modal, Alert } from 'react-native';
// import { TextPretendard as Text } from '../../../common/CustomText';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FormHeader from '../../../common/FormHeader';
import Check from '../../../assets/img/common/Check.svg';
import Camera from '../../../assets/img/Forest/Camera.svg';

import { Request } from '../../../common/requests';
import { PostUploadStackParams } from '../../../pages/Forest';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

const ForestForm = ({ navigation, route }: NativeStackScreenProps<PostUploadStackParams, "ForestForm">) => {
  const category = route.params.category;
  const semi_categories = route.params.semi_categories;
  const id = route.params?.id;
  const editor = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { width, height } = Dimensions.get('window');
  const [nickname, setNickname] = useState<string>('');
  const [forest, setForest] = useState({ title: "", subtitle: "", content: "", category: category.id, semi_categories: [], hashtags: "", photos: [] });
  const [photoList, setPhotoList] = useState([] as any);
  const [modalVisible, setModalVisible] = useState(false);
  const request = new Request();

  const loadInfo = async () => {
    const response = await request.get('/mypage/me/', {}, {});
    setNickname(response.data.data.nickname);
  }

  useEffect(() => {
    loadInfo();
  }, [id])

  const options: ImageLibraryOptions = {
    mediaType: "photo",
    maxWidth: 300,
  };

  const pickImage = () => {
    launchImageLibrary(options, (response: any) => {
      uploadImage(response.assets[0]);
    });
  }

  const uploadImage = async (image: any) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: 'image/jpeg/png',
    });
    const response = await request.post("/forest/photos/create/", formData, { "Content-Type": "multipart/form-data" });
    editor.current?.insertImage(response.data.data.location, 'width: 100%; height: auto;');
    setPhotoList([...photoList, response.data.data.location]);
  };

  const saveForest = async () => {
    const formData = new FormData();
    for (const photo of photoList){
      formData.append('photos', "add,"+photo);
    }
    for (const semi_category of semi_categories){
      formData.append('semi_categories', "add,"+semi_category.id.toString());
    }
    for (let [key, value] of Object.entries(forest)) {
      // if (key === "rep_pic") {
      //   formData.append(`${key}`, {
      //     uri: repPic[0].uri,
      //     name: repPic[0].fileName,
      //     type: 'image/jpeg/png',
      //   });
      // } else {
      //   //문자열의 경우 변환
      //   formData.append(`${key}`, `${value}`);
      // }
      if (key === 'hashtags') {
        let hashtags = value.split('#');
        hashtags = hashtags.splice(1);
        for (const hashtag of hashtags){
          formData.append('hashtags', "add,"+hashtag.trim());
        }
      } else if (key === 'photos' || key === 'semi_categories') {
        continue;
      } else {
        formData.append(`${key}`, `${value}`);
      }
    }
    console.log(formData);
    const response = await request.post("/forest/create/", formData, { "Content-Type": "multipart/form-data" });
    showModal();
  }

  // const updateForest = async () => {
  //   const formData = new FormData();
  //   for (const photo of photoList){
  //     formData.append('photoList', photo);
  //   }
  //   for (let [key, value] of Object.entries(forest)) {
  //     // if (key === "rep_pic") {
  //     //   formData.append(`${key}`, {
  //     //     uri: repPic.uri,
  //     //     name: repPic.fileName,
  //     //     type: 'image/jpeg/png',
  //     //   });
  //     // } else {
  //     //   //문자열의 경우 변환
  //     //   formData.append(`${key}`, `${value}`);
  //     // }
  //   }
  //   const response = await request.patch(`/forest/${id}/update/`, formData, { "Content-Type": "multipart/form-data" });
  //   showModal(response.data.data.id);
  // }

  const showModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      // navigation.replace('Forest', {id: id})
    }, 3000)
  }

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({y: scrollY - 30, animated: true});
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Modal animationType='slide' visible={modalVisible}>
        <View style={{width: width, height: height, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
          <Check color={"#75E59B"}/>
          <Text style={{fontSize: 20, fontWeight: '700', marginVertical: 10}}>{ id ? '수정 완료 !' : '작성 완료 !'}</Text>
          <Text>작성한 포레스트는</Text>
          <Text>마이페이지 {'>'} 포레스트 {'>'} 내가 쓴 포레스트</Text>
          <Text>에서 확인할 수 있어요</Text>
        </View>
      </Modal>
      <FormHeader title='포레스트 작성' onLeft={() => navigation.goBack()} onRight={saveForest} />
      <ImageBackground source={{ uri: "https://reactnative.dev/img/logo-og.png" }} style={{width: width, height: width}}>
        <Text style={{fontSize: 20, fontWeight: '700', marginLeft: 10, marginTop: 10}}>{category.name}</Text>
        <FlatList data={semi_categories} renderItem={({item}: any) => { return (
            <View style={{borderRadius: 16, backgroundColor: '#67D393', paddingVertical: 4, paddingHorizontal: 16, marginHorizontal: 8}}>
              <Text style={{color: 'white', fontSize: 14}}># {item.name}</Text>
            </View>
          )}}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            margin: 10,
          }}
          numColumns={3}
          scrollEnabled={false}
        />
        <TextInput
          value={forest.title}
          onChangeText={(title) => { setForest({ ...forest, title: title }) }}
          placeholder='제목을 작성해 주세요.*'
          placeholderTextColor={'white'}
          style={{width: width-20, marginLeft: 10, marginBottom: 40, borderBottomColor: 'white', borderBottomWidth: 1, color: 'white', fontSize: 20, fontWeight: '700'}}
          maxLength={24}
        />
        <TextInput
          value={forest.subtitle}
          onChangeText={(subtitle) => { setForest({ ...forest, subtitle: subtitle }) }}
          placeholder='소제목을 작성해 주세요.*'
          placeholderTextColor={'white'}
          style={{width: width-20, marginLeft: 10, marginBottom: 30, borderBottomColor: 'white', borderBottomWidth: 1, color: 'white', fontSize: 12}}
          maxLength={40}
        />
        <View style={{flexDirection: 'row', padding: 10, marginLeft: 10}}>
          <TouchableOpacity>
            <Camera />
          </TouchableOpacity>
          <Text style={{color: '#209DF5', lineHeight: 20, marginLeft: width-150}}>Editor </Text>
          <Text style={{color: 'white', lineHeight: 20}}>{nickname}님</Text>
        </View>
        <Text style={{ position: 'absolute', bottom: 130, right: 10, color: 'white', fontSize: 12 }}>{forest.title.length}/24</Text>
        <Text style={{ position: 'absolute', bottom: 75, right: 10, color: 'white', fontSize: 12 }}>{forest.subtitle.length}/40</Text>
      </ImageBackground>
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
          initialContentHTML={forest.content}
          onChange={(content) => { setForest({ ...forest, content: content }) }}
          placeholder="내용"
          initialHeight={450}
          useContainer={true}
          onCursorPosition={handleCursorPosition}
        />
      </ScrollView>
      <View style={{flexDirection: 'row', borderBottomColor: '#D9D9D9', borderTopColor: '#D9D9D9', borderBottomWidth: 1, borderTopWidth: 1, padding: 10}}>
        <Text style={{color: '#848484', lineHeight: 20}}>해시태그</Text>
        <TextInput
          value={forest.hashtags}
          onChangeText={(hashtags) => { setForest({ ...forest, hashtags: hashtags }) }}
          placeholder=' 추가'
          placeholderTextColor={'#848484'}
          style={{lineHeight: 20}}
        />
      </View>
    </View>
  )
}

export default ForestForm;