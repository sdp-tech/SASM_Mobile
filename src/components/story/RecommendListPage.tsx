import { useEffect, useState, useContext } from 'react';
import { TextPretendard as Text } from '../../common/CustomText';
import { SafeAreaView, View, TouchableOpacity, Dimensions, FlatList, Modal, Pressable } from 'react-native';
import { Request } from '../../common/requests';
import { StoryProps } from '../../pages/Story';
import { SearchItemCard } from '../Home/CurationItemCard';
import SearchCard from './components/SearchCard';
import Arrow from '../../assets/img/common/Arrow.svg';
import { LoginContext } from '../../common/Context';

const RecommendListPage = ({ navigation, route }: StoryProps) => {
  const data = route.params.data;
  const type = route.params.type;
  const {isLogin, setLogin} = useContext(LoginContext);
  const { width, height } = Dimensions.get('window');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const storyItem = ({item}: any) => {
    return (
      <SearchCard
        id = {item.id}
        rep_pic = {item.rep_pic}
        extra_pics = {item.extra_pics}
        place_name = {item.place_name}
        title = {item.title}
        story_like = {item.story_like}
        category = {item.category}
        preview = {item.preview}
        writer = {item.writer}
        nickname = {item.nickname}
        created = {item.created}
        writer_is_verified = {item.writer_is_verified}
        isLogin = {isLogin}
        navigation = {navigation}
      />
    )
  }

  const curationItem = ({item}: any) => {
    return (
      <SearchItemCard data={item} style={{ width: width / 2 - 15, height: height / 3, margin: 5 }}  />
    )
  }

  const onRefresh = () => {
    setRefreshing(false);
    setRefreshing(true);
  }

  useEffect(() => {console.log(data)})

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={data}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{padding: 10}}
        numColumns={type ? 1 : 2}
        ListHeaderComponent={<>
          <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{position: 'absolute', left: 10}} onPress={() => {navigation.goBack()}}>
              <Arrow width={20} height={20} transform={[{rotateY: '180deg'}]}/>
            </TouchableOpacity>
            <Text style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 20, fontWeight: '700'}}>{type ? `이 장소의 다른 스토리`: `스토리가 포함된 큐레이션`}</Text>
          </View>
          <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginBottom: 20}} />
        </>}
        renderItem={type ? storyItem : curationItem}
        keyExtractor={(item: any)=>item.id}
      />
    </SafeAreaView>
  )
}

export default RecommendListPage;