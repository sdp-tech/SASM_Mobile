import { useState, useEffect, useNavigate } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { useCookies } from "react-cookie";
import Loading from "../../../common/Loading";
import ItemCard from "./ItemCard";
import nothingIcon from "../../../assets/img/nothing.svg";
import {Request} from "../../../common/requests";
import ChangeMode from "../../../assets/img/Mypick/ChangeMode.svg"
import Category, { CATEGORY_LIST, MatchCategory } from "../../../common/Category";
import { useNavigation } from '@react-navigation/native';
import Pagination from '../../../common/Pagination';

const Container = styled.View`
  margin: 0 auto;
  margin-top: 3%;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const MyplaceSection = styled.View`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 5%;
  grid-area: story;
`;
const HeaderSection = styled.View`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: space-around;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`
const FooterSection = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  grid-area: story;
  height: 12%;
`;
const CardSection = styled.View`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-area: story;
  justify-content: center;
  align-items: center;
`;
const NothingSearched = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ChangeModeButton = styled.View`
  width: 30%;
  text-align: center;
  font-size: 1.25rem;
  z-index: 3;
  @media screen and (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
  }
`
const FilterOptions = styled.View`
  width: 30%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const Myplace = (props) => {
  const [info, setInfo] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkedList, setCheckedList] = useState('');
  const offset = (page - 1) * limit;
  //console.log("pageInfo", page, offset); 현재 page 번호를 쿼리에 붙여서 api요청하도록 변경하기!
   const token = cookies.name; // 쿠키에서 id 를 꺼내기
  
  //const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기
  //const navigate = useNavigate();
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
    //setInfo(response.data.data.results);
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
          <MyplaceSection>
            <HeaderSection>
              <ChangeModeButton onClick={props.handleMode}>
                <Image src={ChangeMode} style={{ marginRight: 10 }} />
                <Text>STORY</Text>
              </ChangeModeButton>
              {/* <span style={{ fontWeight: "500", fontSize: "1.6rem" }}> */}
                <Text>My PlACE</Text>
              {/* </span> */}
              <FilterOptions>
                <Category checkedList={checkedList} setCheckedList={setCheckedList} />
              </FilterOptions>
            </HeaderSection>
            {/* <main style={{ width: '100%' }}> */}
              <Container>
                {info.length === 0 ? (
                  <NothingSearched>
                    <Image
                      src={nothingIcon}
                      style={{ marginTop: "50%", paddingTop: "50%" }}
                    />
                    <Text>해당하는 장소가 없습니다</Text>
                  </NothingSearched>
                ) : (
                  <Grid container spacing={3} style={{ width: '100%' }}>
                    {info.map((info, index) => (
                      <Grid item key={info.id} xs={12} sm={12} md={6} lg={4}>
                        <CardSection>
                          <ItemCard
                            key={index}
                            id={info.id}
                            rep_pic={info.rep_pic}
                            place_name={info.place_name}
                            place_like={info.place_like}
                            category={info.category}
                          />
                        </CardSection>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Container>
            {/* </main> */}
          </MyplaceSection>
          <FooterSection>
            <Pagination
              total={pageCount}
              limit={limit}
              page={page}
              setPage={setPage}
            />
          </FooterSection>
        </>
      )}
    </>
  );
};

export default Myplace;
