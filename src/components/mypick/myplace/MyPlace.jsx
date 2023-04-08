import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image,FlatList, ScrollView, Dimensions, Button } from 'react-native';
import styled from 'styled-components/native';
//import { useCookies } from "react-cookie";
import Loading from "../../../common/Loading";
import ItemCard from "./ItemCard";
import nothingIcon from "../../../assets/img/nothing.svg";
import {Request} from "../../../common/requests";
import ChangeMode from "../../../assets/img/Mypick/ChangeMode.svg"
import Category, { CATEGORY_LIST, MatchCategory } from "../../../common/Category";
import { useNavigation } from '@react-navigation/native';
import Pagination from '../../../common/Pagination';

const styles = StyleSheet.create({
  Container:{
    marginVertical: 0,
    marginHorizontal: 'auto',
    marginTop: '3%',
    width: '100%',
    //display: flex,
    flex:5,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'yellow'
  },
  MyplaceSection:{
    position: 'relative',
    //display: flex;
    flex:40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '5%',
    //grid-area: story;
    //backgroundColor:'green'
  },
  HeaderSection:{
    //display: flex;
    flex:1,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-around',
    flesDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    //backgroundColor:'blue'
  },
  FooterSection:{
    position:'relative',
    //display:'flex',
    flex:1,
    flexDirection:'column',
    //grid-area:'story',
    marginTop:5,
    //backgroundColor:'red'
  },
  CardSection:{
    position:'relative',
    //display:'flex',
    //flex:1,
    flexDirection:'column',
    overflow:'hidden',
    //girdarea:'story',
    justifyContent:'center',
    alignItems:'center',
    width: 350,
    height: 300,
    //backgroundColor:'purple'
  },
  NothingSerched:{
    position:'relative',
    //display:'flex',
    //flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  ChangeModeButton:{
    width:'30%',
    textAlign:'center',
    fontSize:25,
    Index:3,
    //backgroundColor:'brown'
  },
  FilterOptions:{
    width:'100%',
    //backgroundColor:'gray',
    //alignItems:'center',
    //justifyContent:'center'
  }
});

const Myplace = () => {
  const [info, setInfo] = useState([]);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkedList, setCheckedList] = useState('');
  const offset = (page - 1) * limit;
  //console.log("pageInfo", page, offset); 현재 page 번호를 쿼리에 붙여서 api요청하도록 변경하기!
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
  const pageMyplace = async () => {
    let newPage;
    if (page == 1) {
      newPage = null;
    } else {
      newPage = page;
    }

    setLoading(true);

    const response = await request.get("/users/like_place/", {
      page: newPage,
      filter: checkedList
    }, null);
    console.log("my place" , response);
    //setPageCount(response.data.data.count);
    setInfo(response.data.data.results);
    setLoading(false);
  };

  // 초기에 좋아요 목록 불러오기
  useEffect(() => {
    pageMyplace();
  }, [page, checkedList]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.MyplaceSection}>
            <View style={styles.HeaderSection}>
              <View style={styles.ChangeModeButton}>
                <Button onPress={()=>navigation.navigate('MyStory')} title = 'My Story'>
                  <Image src={ChangeMode} style={{ marginRight: 10 }} />
                  </Button>
              </View>
              {/* <Button style={styles.ChangeModeButton} onPress={()=>navigation.navigate('MyStory')} title = 'My Story'>
                <Image src={ChangeMode} style={{ marginRight: 10 }} />
              </Button> */}
              {/* <span ={{ fontWeight: "500", fontSize: "1.6rem" }}> */}
                <Text style={{fontSize:25, fontWeight: 600}}>My PlACE</Text>
              {/* </span> */}
              <View style={styles.FilterOptions}>
                <Category checkedList={checkedList} setCheckedList={setCheckedList} />
              </View>
            </View>
            {/* <main ={{ width: '100%' }}> */}
              <View style={styles.Container}>
                {info.length === 0 ? (
                  <View style={styles.NothingSearched}>
                    <Image
                      src={nothingIcon}
                      style={{ marginTop: '50%', paddingTop: '50%' }}
                    />
                    <Text>해당하는 장소가 없습니다</Text>
                  </View>
                ) : (
                  <FlatList
                  data ={info}
                  renderItem ={({item}) => (
                    <View style={styles.CardSection}>
                       {/* <Text>----------ItemCard Start.----------</Text> */}
                          <ItemCard
                            //key={index}
                            place_id={item.id}
                            rep_pic={item.rep_pic}
                            place_name={item.place_name}
                            place_like={item.place_like}
                            category={item.category}
                          />
                          {/* <Text>---------ItemCard Fin.---------</Text> */}
                    </View>
                  )}
                  keyExtractor = {(item, index) => index}
                  />
                )}
              </View>
            {/* </main> */}
          </View>
          <View style={styles.FooterSection}>
            {/* <Pagination
              total={pageCount}
              limit={limit}
              page={page}
              setPage={setPage}
            /> */}
          </View>
        </>
      )}
    </>
  );
};

export default Myplace;
