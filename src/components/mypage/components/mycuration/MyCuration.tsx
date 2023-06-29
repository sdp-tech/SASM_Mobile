import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Pressable } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import ItemCard from "./ItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import Search from "../../../../assets/img/common/Search.svg";
import { Request } from "../../../../common/requests";
import SearchBar from '../../../../common/SearchBar';
import { useFocusEffect } from '@react-navigation/native';
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import { MyPageParams } from '../../../../pages/MyPage';

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  Title: {
    height: 50,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    flexDirection: 'row'
  },
  Searchbox: {
    height: 50,
    justifyContent: "flex-end",
    paddingRight: 15,
    alignItems: "center",
    flexDirection: 'row',
    zIndex: 1
  },
  Curation: {
    alignItems: 'center',
    flex: 1
  },
});

interface CurationItemCard {
  id: number;
  rep_pic: string;
  writer_nickname: string;
  title: string;
}

const MyStory = ({ navigation, route }: MyPageParams) => {
  const { width, height } = Dimensions.get("window");
  const [info, setInfo] = useState([] as any);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const request = new Request();
  const [written, setWritten] = useState<CurationItemCard[]>([]);
  //true일 경우, 좋아요한 큐레이션 false일 경우, 작성한 큐레이션
  const [type, setType] = useState<boolean>(true);

  const data = [
    { id: 1, writer_nickname: '김사슴', rep_pic: 'https://images.velog.io/images/offdutybyblo/post/55e6994d-1767-4f76-bd5d-58974dc1ed14/react-native.png', title: '서울 어쩌구 저쩌구 비건 카페 5곳' },
    { id: 2, writer_nickname: '김사슴', rep_pic: 'https://images.velog.io/images/offdutybyblo/post/55e6994d-1767-4f76-bd5d-58974dc1ed14/react-native.png', title: '서울 어쩌구 저쩌구 비건 카페 5곳' },
    { id: 3, writer_nickname: '김사슴', rep_pic: 'https://images.velog.io/images/offdutybyblo/post/55e6994d-1767-4f76-bd5d-58974dc1ed14/react-native.png', title: '서울 어쩌구 저쩌구 비건 카페 5곳' },
    { id: 4, writer_nickname: '김사슴', rep_pic: 'https://images.velog.io/images/offdutybyblo/post/55e6994d-1767-4f76-bd5d-58974dc1ed14/react-native.png', title: '서울 어쩌구 저쩌구 비건 카페 5곳' }
  ]

  const getCuration = async () => {
    const response = await request.get("/mypage/my_liked_curation/", {
      search: search,
    }, null);
    setInfo(response.data.data);
  };

  const getWrittenCuration = async () => {
    const response = await request.get('/mypage/my_curation/');
    setWritten(response.data.data);
  }

  useFocusEffect(useCallback(() => {
    getCuration();
  }, [search]));

  useEffect(() => {
    if (!type) getWrittenCuration();
  }, [type])

  return (
    <View style={styles.Container}>
      <View style={styles.Searchbox}>
        {isSearch &&
          <SearchBar
            setPage={setPage}
            search={search}
            setSearch={setSearch}
            style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, width: 320, position: "absolute", right: 50, zIndex: 1 }}
            placeholder="내용 입력 전"
            placeholderTextColor={"#848484"}
          />
        }
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setIsSearch(!isSearch); setIsMenu(false); }}>
          <Search width={18} height={18} />
        </TouchableOpacity>
        {!isMenu &&
          <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setIsSearch(false); setIsMenu(!isMenu) }}>
            <Menu width={18} height={18} />
          </TouchableOpacity>
        }
        {isMenu &&
          <>
            <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginHorizontal: 10, paddingHorizontal: 5, height: 25 }}>
              <Text style={{ fontSize: 12 }}>편집</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 15, paddingHorizontal: 5, height: 25 }}
              onPress={() => { setType(!type) }}>
              <Text style={{ fontSize: 12 }}>내 큐레이션</Text>
            </TouchableOpacity>
          </>
        }
      </View>
      <View style={styles.Curation}>
        {(type ? info : written).length === 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <NothingIcon />
            <Text style={{ marginTop: 20 }}>해당하는 큐레이션이 없습니다</Text>
          </View>
        ) : (
          <FlatList
            data={type ? data : written}
            renderItem={({ item }: any) => (
              <ItemCard
                props={item}
                navigation={navigation}
              />
            )}
            numColumns={2}
          // style={{alignContent:'space-between'}}
          />
        )}
      </View>
    </View>
  );
};

export default MyStory;
