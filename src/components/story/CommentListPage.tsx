import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Request } from '../../common/requests';
import { StoryProps } from '../../pages/Story';
import Comment from './components/Comment';
import WriteComment from './components/WriteComment';
import Arrow from '../../assets/img/common/Arrow.svg';

const CommentListPage = ({ navigation, route }: StoryProps) => {
  const { width } = Dimensions.get('screen');
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={() => {navigation.goBack()}}>
          <Arrow width={20} height={20} transform={[{rotateY: '180deg'}]}/>
        </TouchableOpacity>
        <Text style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 20, fontWeight: '700'}}>한줄평</Text>
      </View>
      <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1}} />
      <WriteComment id = {route.params.id} reRenderScreen = {route.params.reRenderScreen}/>
      <FlatList
        data = {route.params.comment}
        renderItem = {({item}) => { 
          return (
            <Comment data = {item} reRenderScreen = {route.params.reRenderScreen}/>
          )
      }}
      />
    </SafeAreaView>
  )
}

export default CommentListPage;