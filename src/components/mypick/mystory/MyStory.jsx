import { useState, useEffect, useCallback } from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Grid from "@mui/material/Grid";
import styled from "styled-components/native";
import Pagination from "../../../common/Pagination";
import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../common/Loading";
import ItemCard from "./ItemCard";
import nothingIcon from "../../../assets/img/nothing.svg";
//import { useNavigate } from "react-router-dom";
import { useNavigation } from '@react-navigation/native';
import {Request} from "../../../common/requests";
import ChangeMode from "../../../assets/img/Mypick/ChangeMode.svg"
import CategorySelector, { CATEGORY_LIST, MatchCategory } from "../../../common/Category"

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
    justify-content: center;
    align-items: center;
  }
`
const FooterSection = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  grid-area: story;
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
const Mystory = (props) => {
  const [checkedList, setCheckedList] = useState('');
  const [info, setInfo] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const offset = (page - 1) * limit;
  // const token = cookies.name; // 쿠키에서 id 를 꺼내기
  //const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기
  //const navigate = useNavigate();
  const request = new Request(cookies, localStorage, navigate);
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
    setPageCount(response.data.data.count);
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
          <MyplaceSection>
            <HeaderSection>
              <ChangeModeButton onClick={props.handleMode}>
                <Image src={ChangeMode} style={{ marginRight: 10 }} />
                <Text>PLACE</Text>
              </ChangeModeButton>
              {/* <span style={{ fontWeight: "500", fontSize: "1.6rem" }}> */}
                <Text>MY STORY</Text>
              {/* </span> */}
              <FilterOptions>
                <CategorySelector checkedList={checkedList} setCheckedList={setCheckedList} />
              </FilterOptions>
            </HeaderSection>
            {/* <main style={{ width: '100%' }}> */}
              <Container
                sx={{
                  marginTop: "3%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <>
                  {info.length === 0 ? (
                    <NothingSearched>
                      <Image
                        src={nothingIcon}
                        style={{ marginTop: "50%", paddingTop: "50%" }}
                        alt="no data"
                      />
                      <Text>해당하는 스토리가 없습니다</Text>
                    </NothingSearched>
                  ) : (
                    <Grid container spacing={5}>
                      {info.map((info, index) => (
                        <Grid item key={info.id} xs={12} sm={12} md={6} lg={6}>
                          <CardSection>
                            <ItemCard
                              category={info.category}
                              key={index}
                              story_id={info.id}
                              rep_pic={info.rep_pic}
                              title={info.title}
                              place_name={info.place_name}
                              place_like={info.place_like}
                              preview={info.preview}
                            />
                          </CardSection>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
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

export default Mystory;
