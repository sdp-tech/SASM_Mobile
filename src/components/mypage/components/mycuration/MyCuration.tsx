import { useState, useEffect, useCallback, useContext } from 'react';
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
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { SearchNoCategory } from '../common/SearchNCategory';

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
  const { isLogin, setLogin } = useContext(LoginContext);
  const [curationList, setCurationList] = useState([] as any);
  const [search, setSearch] = useState<string>("");
  const request = new Request();
  const [written, setWritten] = useState<CurationItemCard[]>([]);
  //true일 경우, 좋아요한 큐레이션 false일 경우, 작성한 큐레이션
  const [type, setType] = useState<boolean>(true);

  const getCuration = async () => {
    const response = await request.get("/mypage/my_liked_curation/", {
      search: search,
    });
    console.error(response.data)
    setCurationList(response.data.data);
  };

  const getWrittenCuration = async () => {
    const response = await request.get('/mypage/my_curation/');
    setWritten(response.data.data);
  }

  useFocusEffect(useCallback(()=>{
    if(isLogin) {
      if(type) getCuration();
      else getWrittenCuration();
    }
  },[type, search]))

  return (
    <View style={styles.Container}>
      {
        isLogin ?
          <>
            <SearchNoCategory setSearch={setSearch} search={search} setType={setType} type={type} label='내 큐레이션' />
            <View style={styles.Curation}>
              {(type ? curationList : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>해당하는 큐레이션이 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? curationList : written}
                  renderItem={({ item }: any) => (
                    <ItemCard
                      props={item}
                      navigation={navigation}
                    />
                  )}
                  
                  numColumns={2}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={2} />
      }
    </View>
  );
};

export default MyStory;
