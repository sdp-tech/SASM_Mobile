import { View, FlatList } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import SearchCard from './SearchCard';
import ListCard from './ListCard';

interface SearchListProps {
  info: any;
  onEndReached?: any;
  onRefresh?: any;
  refreshing?: boolean;
  navigation: any;
  card: boolean;
}

const SearchList = ({ info, onEndReached, onRefresh, refreshing, navigation, card }: SearchListProps) => {
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
        navigation = {navigation}
      />
    )
  }
  const listItem = ({item}: any) => {
    return (
      <ListCard
        id = {item.id}
        rep_pic = {item.rep_pic}
        place_name = {item.place_name}
        title = {item.title}
        story_like = {item.story_like}
        category = {item.category}
        preview = {item.preview}
        writer = {item.writer}
        nickname = {item.nickname}
        writer_is_verified = {item.writer_is_verified}
        navigation = {navigation}
      />
    )
  }

  return (
    <FlatList
      data={info}
      renderItem={card ? cardItem : listItem}
      keyExtractor = {(item, index) => String(index)}
      onRefresh = {onRefresh}
      refreshing = {refreshing}
      onEndReached = {onEndReached}
      showsVerticalScrollIndicator = {false}
      contentContainerStyle={{flexGrow: 1}}
      ListEmptyComponent = {<Text style = {{ marginTop: 15}}>해당하는 스토리가 없습니다</Text>}
    />
  )
}

export default SearchList;