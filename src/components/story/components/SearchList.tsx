import { View, FlatList, TouchableOpacity } from 'react-native';
import { useRef, useContext } from 'react';
import { TextPretendard as Text } from '../../../common/CustomText';
import Arrow from "../../../assets/img/common/Arrow.svg";
import SearchCard from './SearchCard';
import ListCard from './ListCard';
import { LoginContext } from '../../../common/Context';

interface SearchListProps {
  info: any;
  onEndReached?: any;
  onRefresh?: any;
  refreshing?: boolean;
  navigation: any;
  card: boolean;
}

const SearchList = ({ info, onEndReached, onRefresh, refreshing, navigation, card }: SearchListProps) => {
  const {isLogin, setLogin} = useContext(LoginContext);
  const scrollRef = useRef<FlatList>(null);
  const cardItem = ({item}: any) => {
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
  const listItem = ({item}: any) => {
    return (
      <ListCard
        id = {item.id}
        rep_pic = {item.rep_pic}
        extra_pics = {item.extra_pics}
        place_name = {item.place_name}
        title = {item.title}
        story_like = {item.story_like}
        created = {item.created}
        preview = {item.preview}
        writer = {item.writer}
        nickname = {item.nickname}
        writer_is_verified = {item.writer_is_verified}
        isLogin = {isLogin}
        navigation = {navigation}
      />
    )
  }

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
      console.log('작동함')
    }
  };

  return (
    <FlatList
      ref={scrollRef}
      data={info}
      renderItem={card ? cardItem : listItem}
      keyExtractor = {(item, index) => String(index)}
      onRefresh = {onRefresh}
      refreshing = {refreshing}
      onEndReached = {onEndReached}
      showsVerticalScrollIndicator = {false}
      contentContainerStyle={{flexGrow: 1}}
      ListFooterComponent={
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <TouchableOpacity onPress={scrollToTop} style={{ flexDirection: 'row' }}>
            <Arrow width={18} height={18} transform={[{rotate: '270deg'}]} />
            <Text style={{color: '#666666', fontWeight: '600', marginTop: 3}}>맨 위로 이동</Text>
          </TouchableOpacity>
        </View>
      }
    />
  )
}

export default SearchList;