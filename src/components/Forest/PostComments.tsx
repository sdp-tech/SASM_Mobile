import { useEffect, useState } from 'react';
import { TextPretendard as Text } from '../../common/CustomText';
import { SafeAreaView, View, TouchableOpacity, Dimensions, FlatList, Modal, Pressable } from 'react-native';
import { Request } from '../../common/requests';
import Comment from './components/Comment';
import WriteComment from './components/WriteComment';
import Arrow from '../../assets/img/common/Arrow.svg';
import Loading from '../../common/Loading';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForestStackParams } from '../../pages/Forest';

const PostCommentsScreen = ({ navigation, route }: NativeStackScreenProps<ForestStackParams, "PostComments">) => {
  const { width, height } = Dimensions.get('screen');
  const id = route.params.id;
  const email = route.params.email;
  const [comment, setComment] = useState([] as any);
  const [updateText, setUpdateText] = useState<string>('');
  const [commentId, setCommentId] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const request = new Request();

  const callback = (text: string, id: number) => {
    setUpdateText(text);
    setCommentId(id);
  }

  const loadComment = async () => {
    setLoading(true);
    const response= await request.get(`/forest/${id}/comments/`, {}, {});
    setComment(response.data.data.results);
    setLoading(false);
  }

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  }

  const onRefresh = async () => {
    if(!refreshing){
      setRefreshing(true);
      await loadComment();
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadComment();
  }, [refreshing])

  return (
    <>{loading ? (
      <Loading />
    ) : (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={comment}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={<>
          <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={() => {navigation.goBack()}}>
              <Arrow width={20} height={20} transform={[{rotateY: '180deg'}]}/>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 20, fontWeight: '700'}}>한줄평</Text>
          </View>
          <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginBottom: 20}} />
          <WriteComment id={id} reRenderScreen={reRenderScreen} data={updateText} commentId={commentId} />
        </>}
        renderItem={({item}) => { 
          return (
            <Comment data={item} reRenderScreen={reRenderScreen} post_id={id} email={email} callback={callback}/>
          )
        }}
        keyExtractor={(item: any)=>item.id}
      />
    </SafeAreaView>
  )}</>
  )
}

export default PostCommentsScreen;