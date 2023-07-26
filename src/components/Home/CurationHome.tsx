import React, { useState, useEffect, useCallback, useContext } from "react";
import { SafeAreaView, View, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, ImageBackground, Alert } from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import CurationItemCard, { SearchItemCard } from "./CurationItemCard"
import { Request } from "../../common/requests";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HomeStackParams } from "../../pages/Home";
import { TabProps } from "../../../App";
import styled from "styled-components/native";
import AddColor from "../../assets/img/common/AddColor.svg";
import CardView from "../../common/CardView";
import Arrow from "../../assets/img/common/Arrow.svg";
import CustomHeader from "../../common/CustomHeader";
import PlusButton from "../../common/PlusButton";
import { LoginContext } from "../../common/Context";

const { width, height } = Dimensions.get('screen');

const Section = styled.View`
  width: 100%;
`
const SectionCuration = styled(Section)`
  width: 100%;
  margin-top: 20px;
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
  margin: 0 15px;
  margin-bottom: 10px;
`

export interface CurationProps {
  title: string;
  id: number;
  is_selected: boolean;
  writer_email: string;
  rep_pic: string;
}

export default function CurationHome({ navigation, route }: StackScreenProps<HomeStackParams, 'Home'>): JSX.Element {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCuration, setAdminCuration] = useState<CurationProps[]>([]);
  const [repCuration, setRepCuration] = useState<CurationProps[]>([]);
  const [verifedCuration, setVerifiedCuration] = useState<CurationProps[]>([]);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
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
    setAdminCuration(response_admin.data.data.results);
    const response_rep = await request.get('/curations/rep_curations/');
    setRepCuration(response_rep.data.data.results);
    const response_verifed = await request.get('/curations/verified_user_curations/');
    setVerifiedCuration(response_verifed.data.data.results)
    setLoading(false);
  }

  let verifedList = [];
  for (let i = 0; i < Math.min(3, verifedCuration.length); i++) {
    verifedList.push(verifedCuration[i]);
  }

  useFocusEffect(useCallback(() => {
    getStory();
    getCurration();
  }, []))

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      {loading ? <ActivityIndicator />
        : <>
          <ScrollView>
            <CustomHeader
              onSearch={() => { navigation.navigate('List', { from: 'search' }) }}
              onAlarm={() => { }}
            />
            <CardView
              gap={0}
              offset={0}
              data={repCuration}
              pageWidth={width}
              dot={true}
              renderItem={({ item }: any) => (
                <CurationItemCard
                  rep={true}
                  data={item}
                  style={{ width: width, height: height * 0.4 }}
                />
              )}
            />
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>큐레이션</Text>
                <Text style={TextStyles.Sub}>장소를 모아 놓은 코스를 추천받아보세요.</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List', { from: 'admin' }) }}><Text style={TextStyles.SubBlack}>모두보기 <Arrow /></Text></TouchableOpacity>
              </TextBox>
              <CardView
                gap={15}
                offset={0}
                data={adminCuration}
                pageWidth={width * 0.6}
                dot={false}
                renderItem={({ item }: any) => (
                  <CurationItemCard
                    style={{ width: width * 0.6, height: height * 0.4, marginHorizontal: 7.5 }}
                    data={item}
                  />
                )}
              />
            </SectionCuration>
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>이 큐레이션은 어때요?</Text>
                <Text style={TextStyles.Sub}>유저가 직접 작성한 큐레이션</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List', { from: 'verify' }) }}><Text style={TextStyles.SubBlack}>모두보기 <Arrow /></Text></TouchableOpacity>
              </TextBox>
              {
                verifedList.map((data, index) =>
                  <CurationItemCard
                    data={verifedCuration[index]}
                    style={{ width: width - 30, height: height * 0.2, marginHorizontal: 15, marginVertical: 7.5 }}
                  />)
              }
            </SectionCuration>
            <SectionCuration>
              <View style={{ backgroundColor: '#EDF8F2', paddingVertical: 25 }}>
                <TextBox>
                  <Text style={TextStyles.Title}>장소 추천</Text>
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
                dot={false}
                renderItem={({ item }: any) => (
                  <SearchItemCard
                    style={{ width: width * 0.4, height: height * 0.25, marginHorizontal: 5 }}
                    data={item}
                    onPress={() => { navigationToTab.navigate('스토리', { id: item.id }) }}
                  />
                )}
              ></CardView>
            </SectionCuration>
          </ScrollView>
          <PlusButton
            onPress={() => {
              if (!isLogin) {
                Alert.alert('로그인이 필요합니다', "",
                  [
                    {
                      text: "로그인",
                      onPress: () => navigationToTab.navigate('마이페이지'),
                      style: "cancel"
                    },
                    {
                      text: "ok",
                      style: "cancel"
                    },
                  ])
                return;
              }
              navigation.navigate('Form')
            }}
            position='rightbottom'
          />
        </>
      }
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  Title: {
    // fontFamily:"Inter",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    width: '100%'
  },
  Sub: {
    width: '70%',
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    color: '#595959',
  },
  SubBlack: {
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
  },
  recommend: {
    color: '#FFFFFF',
    backgroundColor: '#67D393',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5
  }
})