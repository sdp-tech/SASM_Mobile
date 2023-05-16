import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, Dimensions, ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ItemCard from "./ItemCard";
import { Request } from "../../common/requests";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { HomeStackParams } from "../../pages/Home";
import { TabProps } from "../../../App";
import styled from "styled-components/native";
import AddColor from "../../assets/img/common/AddColor.svg";
import CardView from "../../common/CardView";
import Arrow from "../../assets/img/common/Arrow.svg";
import Search from "../../assets/img/common/Search.svg";

const { width, height } = Dimensions.get('screen');

const Section = styled.View`
  width: 100%;
`
const SectionCuration = styled(Section)`
  width: 100%;
  margin-top: 50px;
`
const RecommendPlace = styled.TouchableOpacity`
  width: ${width / 5};
  height: ${width / 5};
  border-radius: ${width / 10};
`
const RecommendWrapper = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const TextBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px;
  margin-bottom: 10px;
`
const PlusButton = styled.TouchableOpacity`
  width: 45px;
  height: 45px;
  border-radius: 27.5px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`
const SearchButton = styled.TouchableOpacity`
  width: 80%;
  background-color: #F1F1F1;
  height: 35px;
  margin: 0 auto;
  margin-bottom: 20px;
  border-radius: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`
export interface CurationProps {
  title: string;
  id: number;
  is_selected: boolean;
  writer_email: string;
  rep_pic: string;
}

export default function CurationHome({ navigation, route }: StackScreenProps<HomeStackParams, 'Home'>): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCuration, setAdminCuration] = useState<CurationProps[]>([]);
  const [repCuration, setRepCuration] = useState<CurationProps[]>([]);
  const [verifedCuration, setVerifiedCuration] = useState<CurationProps[]>([]);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  // 큐레이션 검색어
  const [search, setSearch] = useState<string>("");
  // 큐레이션 페이지
  const [page, setPage] = useState<number>(1);
  // 연관 스토리 검색
  const [storyData, setStoryData] = useState([]);
  const request = new Request();

  const getStory = async () => {
    const response = await request.get('/stories/story_search/', {
      page: 1,
      search: '비건',
      latest: true,
    });
    setStoryData(response.data.data.results);
  }

  const getCurration = async () => {
    setLoading(true);
    const response_admin = await request.get('/curations/admin_curations/');
    setAdminCuration(response_admin.data.data);
    const response_rep = await request.get('/curations/rep_curations/');
    setRepCuration(response_rep.data.data)
    const response_verifed = await request.get('/curations/verified_user_curations/');
    setVerifiedCuration(response_verifed.data.data)
    setLoading(false);
  }

  let verifedList = [];
  for (let i = 0; i < Math.min(3, verifedCuration.length); i++) {
    verifedList.push(verifedCuration[i]);
  }

  useEffect(() => {
    getStory();
    getCurration();
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      {loading ? <ActivityIndicator />
        : <>
          <ScrollView>
            <SearchButton onPress={() => { navigation.navigate('List', { data: [] }) }}>
              <View style={{ width: '15%', display: 'flex', alignItems: 'center' }}>
                <Search />
              </View>
            </SearchButton>
            <CardView
              gap={0}
              offset={0}
              height={height * 0.45}
              data={repCuration}
              pageWidth={width}
              dot={true}
              renderItem={({ item }: any) => (
                <ItemCard
                  data={item}
                  style={{ width: width - 16, height: height * 0.4, margin: 8 }}
                />
              )}
            />
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>큐레이션</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List', { data: adminCuration }) }}><Text style={TextStyles.SubBlack}>모두보기 <Arrow /></Text></TouchableOpacity>
              </TextBox>
              <CardView
                gap={16}
                offset={24}
                data={adminCuration}
                pageWidth={width * 0.6}
                height={height * 0.4}
                dot={false}
                renderItem={({ item }: any) => (
                  <ItemCard
                    style={{ width: width * 0.6, height: height * 0.4, marginHorizontal: 8 }}
                    data={item}
                  />
                )}
              />
            </SectionCuration>
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>이 큐레이션은 어때요?</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List', { data: verifedCuration }) }}><Text style={TextStyles.SubBlack}>모두보기 <Arrow /></Text></TouchableOpacity>
                <Text style={TextStyles.Sub}>유저가 직접 작성한 큐레이션</Text>
              </TextBox>
              {
                verifedList.map((data, index) =>
                  <ItemCard
                    data={verifedCuration[index]}
                    style={{ width: width - 16, height: height * 0.25, margin: 8 }}
                  />)
              }
            </SectionCuration>
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>추천 장소</Text>
              </TextBox>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <RecommendWrapper>
                  <RecommendPlace
                    onPress={() => { navigationToTab.navigate('맵', { coor: { latitude: 37.544641605, longitude: 127.055896738 } }) }}>
                    <ImageBackground
                      imageStyle={{ borderRadius: width / 10 }}
                      style={{ flex: 1 }}
                      resizeMode='contain'
                      source={require('../../assets/img/Home/place_seongsu.png')}
                    />
                  </RecommendPlace>
                  <Text style={TextStyles.recommend}>성수동</Text>
                </RecommendWrapper>
                <RecommendWrapper>
                  <RecommendPlace
                    onPress={() => { navigationToTab.navigate('맵', { coor: { latitude: 37.5090846971287, longitude: 127.108220751231 } }) }}>
                    <ImageBackground
                      imageStyle={{ borderRadius: width / 10 }}
                      style={{ flex: 1 }}
                      resizeMode='contain'
                      source={require('../../assets/img/Home/place_songridan.png')}
                    />
                  </RecommendPlace>
                  <Text style={TextStyles.recommend}>송리단길</Text>
                </RecommendWrapper>
                <RecommendWrapper>
                  <RecommendPlace
                    onPress={() => { navigationToTab.navigate('맵', { coor: { latitude: 37.555833333333325, longitude: 126.89999999999999 } }) }}>
                    <ImageBackground
                      imageStyle={{ borderRadius: width / 10 }}
                      style={{ flex: 1 }}
                      resizeMode='cover'
                      source={require('../../assets/img/Home/place_mangwon.png')}
                    />
                  </RecommendPlace>
                  <Text style={TextStyles.recommend}>망원동</Text>
                </RecommendWrapper>
                <RecommendWrapper>
                  <RecommendPlace
                    onPress={() => { navigationToTab.navigate('맵', { coor: { latitude: 37.55972222222222, longitude: 126.9752777777778 } }) }}>
                    <ImageBackground
                      imageStyle={{ borderRadius: width / 10 }}
                      style={{ flex: 1 }}
                      resizeMode='cover'
                      source={require('../../assets/img/Home/place_namdaemun.png')}
                    />
                  </RecommendPlace>
                  <Text style={TextStyles.recommend}>남대문</Text>
                </RecommendWrapper>
              </View>
            </SectionCuration>
            <SectionCuration style={{ marginBottom: 30 }}>
              <TextBox>
                <Text style={TextStyles.Title}>"비건"과 관련된 스토리</Text>
              </TextBox>
              <CardView
                gap={10}
                data={storyData}
                offset={10}
                pageWidth={width * 0.4}
                height={height * 0.25}
                dot={false}
                renderItem={({ item }: any) => (
                  <ItemCard
                    style={{ width: width * 0.4, height: height * 0.25, marginHorizontal: 5 }}
                    data={item}
                    onPress={() => { navigationToTab.navigate('스토리', { id: item.id }) }}
                  />
                )}
              ></CardView>
            </SectionCuration>
          </ScrollView>
          <CurationPlusButton />
        </>
      }

    </SafeAreaView>
  )
}

export const CurationPlusButton = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>();
  return (
    <PlusButton onPress={() => { navigation.navigate('Form') }}>
      <AddColor width={25} height={25} color={'#FFFFFF'} />
    </PlusButton>
  )
}

const TextStyles = StyleSheet.create({
  Title: {
    // fontFamily:"Inter",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    widht: '70%'
  },
  Sub: {
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    color: '#595959',
    width: width,
  },
  SubBlack: {
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
  },
  recommend: {
    color: '#FFFFFF',
    backgroundColor: '#3B3B3B',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5
  }
})