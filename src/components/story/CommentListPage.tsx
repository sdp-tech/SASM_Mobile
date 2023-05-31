import { useEffect, useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { Request } from '../../common/requests';
import { StoryProps } from '../../pages/Story';
import Comment from './components/Comment';
import WriteComment from './components/WriteComment';
import Arrow from '../../assets/img/common/Arrow.svg';

const CommentListPage = ({ navigation, route }: StoryProps) => {
  const { width } = Dimensions.get('screen');
  const id = route.params.id;
  const reRenderScreen = route.params.reRenderScreen;
  const comment = route.params.comment;
  const email = route.params.email;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={() => {navigation.goBack()}}>
          <Arrow width={20} height={20} transform={[{rotateY: '180deg'}]}/>
        </TouchableOpacity>
        <Text style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 20, fontWeight: '700'}}>한줄평</Text>
      </View>
      <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1}} />
      <WriteComment id = {id} reRenderScreen = {reRenderScreen}/>
      <FlatList
        data = {comment}
        renderItem = {({item}) => { 
          return (
            <Comment data = {item} reRenderScreen = {reRenderScreen} email={email}/>
          )
      }}
      />
    </SafeAreaView>
  )
}

export default CommentListPage;