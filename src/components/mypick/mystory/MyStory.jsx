import { useState, useEffect, useCallback } from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Button} from 'react-native';
import styled from "styled-components/native";
import Pagination from "../../../common/Pagination";
//import { useCookies } from "react-cookie";
import Loading from "../../../common/Loading";
import ItemCard from "./ItemCard";
import nothingIcon from "../../../assets/img/nothing.svg";
import { useNavigation } from '@react-navigation/native';
import {Request} from "../../../common/requests";
import ChangeMode from "../../../assets/img/Mypick/ChangeMode.svg"
import Category, { CATEGORY_LIST, MatchCategory } from "../../../common/Category";

const styles = StyleSheet.create({
  Container:{
    marginVertical: 0,
    marginHorizontal: 'auto',
    marginTop: '3%',
    width: '80%',
    //display: flex,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  MyplaceSection:{
    position: 'relative',
    //display: flex;
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '5%'
    //grid-area: story;
  },
  HeaderSection:{
    //display: flex;
    flex:1,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-around',
    flesDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  //   @media screen and (max-width: 768) {
  //     ≤   flex-direction: column;
  //     align-items: center;
  //   justify-content: center;
  // }
  },
  FooterSection:{
    position:'relative',
    //display:'flex',
    flex:1,
    flexDirection:'column',
    //grid-area:'story',
    height:12
  },
  CardSection:{
    position:'relative',
    //display:'flex',
    flex:1,
    flexDirection:'column',
    overflow:'hidden',
    //girdarea:'story',
    justifyContent:'center',
    alignItems:'center',
    width:'100%'
  },
  NothingSerched:{
    position:'relative',
    //display:'flex',
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  ChangeModeButton:{
    width:'30%',
    textAlign:'center',
    fontSize:25,
    zIndex:3
    // @media screen and (max-width: 768px) {
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    // }
  },
  FilterOptions:{
    width:'100%'
    // @media screen and (max-width: 768px) {
    //   width: 100%;
    // }
  }
});


const Mystory = () => {
  const [checkedList, setCheckedList] = useState('');
  const [info, setInfo] = useState([]);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const offset = (page - 1) * limit;
   //const token = cookies.name; // 쿠키에서 id 를 꺼내기
  //const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기
  const navigation = useNavigation();
  const request = new Request();
  // onChange함수를 사용하여 이벤트 감지, 필요한 값 받아오기
  
  const onCheckedElement = (checked, item) => {
    if (checked) {
      setCheckedList([...checkedList, item]);
    } else if (!checked) {
      setCheckedList(checkedList.filter((el) => el !== item));
    }
  };
  const pageMystory = async () => {
    let newPage;
    if (page === 1) {
      newPage = null;
    } else {
      newPage = page;
    }

    setLoading(true);

    const response = await request.get("/users/like_story/", {
      page: newPage,
      filter: checkedList
    }, null);
    console.log("my story", response);
    //setPageCount(response.data.data.count);
    setInfo(response.data.data.results);
    setLoading(false);
  };

  // 초기에 좋아요 목록 불러오기
  useEffect(() => {
    pageMystory();
  }, [page, checkedList]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.MyplaceSection}>
            <View style={styles.HeaderSection}>
            <Button style={styles.ChangeModeButton} onPress={()=>navigation.navigate('MyPlace')} title = 'My Place'>
                <Image src={ChangeMode} style={{ marginRight: 10 }} />
              </Button>
              {/* <span style={{ fontWeight: "500", fontSize: "1.6rem" }}> */}
                <Text>MY STORY</Text>
              {/* </span> */}
              <View style={styles.FilterOptions}>
                <Category checkedList={checkedList} setCheckedList={setCheckedList} />
              </View>
            </View>
            {/* <main style={{ width: '100%' }}> */}
              <View style={styles.Container}
                // sx={{
                //   marginTop: "3%",
                //   display: "flex",
                //   flexDirection: "row",
                //   justifyContent: "center",
                //   alignItems: "center",
                //   width: "100%"
                // }}
              >
                <>
                  {info.length === 0 ? (
                    <View style={styles.NothingSearched}>
                      <Image
                        src={nothingIcon}
                        style={{ marginTop: '50%', paddingTop: '50%' }}
                        // alt="no data"
                      />
                      <Text>해당하는 스토리가 없습니다</Text>
                    </View>
                  ) : (
                    <FlatList 
                    data ={info}
                    renderItem = {({item}) => (
                      <View style={styles.CardSection}>
                            <ItemCard
                              category={item.category}
                              //key={index}
                              story_id={item.id}
                              rep_pic={item.rep_pic}
                              title={item.title}
                              place_name={item.place_name}
                              story_like={item.story_like}
                              preview={item.preview}
                            />
                          </View>
                    )}
                    keyExtractor = {(item, index) => index}
                    />
                  )}
                </>
              </View>
            {/* </main> */}
          </View>
          <View style={styles.FooterSection}>
            <Pagination
              total={pageCount}
              limit={limit}
              page={page}
              setPage={setPage}
            />
          </View>
        </>
      )}
    </>
  );
};

export default Mystory;
