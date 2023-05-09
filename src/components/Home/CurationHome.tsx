import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, Dimensions, ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchBar from "../../common/SearchBar";
import ItemCard from "./ItemCard";
import { Request } from "../../common/requests";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { HomeStackParams } from "../../pages/Home";
import { TabProps } from "../../../App";
import styled from "styled-components/native";
import AddColor from "../../assets/img/common/AddColor.svg";
import CardView from "../../common/CardView";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";

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
const TextBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px;
  margin-bottom: 10px;
`
const PlusButton = styled.TouchableOpacity`
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`

export interface CurationProps {
  title: string;
  id: number;
  is_selected: boolean;
  writer: string;
  rep_pic: string;
}

export default function CurationHome({ navigation, route }: StackScreenProps<HomeStackParams, 'Home'>): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [adminCuration, setAdminCuration] = useState<CurationProps[]>([]);
  const [repCuration, setRepCuration] = useState<CurationProps[]>([]);
  const [verifedCuration, setVerifiedCuration] = useState<CurationProps[]>([]);
  const navigationToMap = useNavigation<StackNavigationProp<TabProps>>();
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
    console.error('admin : ', response_admin.data.data);
    const response_rep = await request.get('/curations/rep_curations/');
    setRepCuration(response_rep.data.data)
    const response_verifed = await request.get('/curations/verified_user_curations/');
    setVerifiedCuration(response_verifed.data.data)
    console.log(response_verifed.data.data);
    setLoading(false);
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
            <SearchBar
              style={{ width: '80%', backgroundColor: '#F1F1F1', marginBottom: 10 }}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
            />
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
                  onPress={() => { navigation.navigate('Detail', { id: item.id }) }} />
              )}
            />

            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>큐레이션</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List') }}><Text style={TextStyles.SubBlack}>모두보기 &gt;</Text></TouchableOpacity>
              </TextBox>
              <CardView
                gap={16}
                offset={24}
                data={verifedCuration}
                pageWidth={width * 0.6}
                height={height * 0.4}
                dot={false}
                renderItem={({ item }: any) => (
                  <ItemCard
                    style={{ width: width * 0.6, height: height * 0.4, marginHorizontal: 8 }}
                    data={item}
                    onPress={() => { navigation.navigate('Detail', { id: item.id }) }} />
                )}
              />
            </SectionCuration>
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>이 큐레이션은 어때요?</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('List') }}><Text style={TextStyles.SubBlack}>모두보기 &gt;</Text></TouchableOpacity>
                <Text style={TextStyles.Sub}>유저가 직접 작성한 큐레이션</Text>
              </TextBox>
              {/* <ItemCard
                data={item[0]}
                style={{ width: width - 16, height: height * 0.25, margin: 8 }}
                onPress={() => { navigation.navigate('Detail', { id: item[0].id }) }} />
              <ItemCard
                data={item[1]}
                style={{ width: width - 16, height: height * 0.25, margin: 8 }}
                onPress={() => { navigation.navigate('Detail', { id: item[1].id }) }} />
              <ItemCard
                data={item[2]}
                style={{ width: width - 16, height: height * 0.25, margin: 8 }}
                onPress={() => { navigation.navigate('Detail', { id: item[2].id }) }} /> */}
            </SectionCuration>
            <SectionCuration>
              <TextBox>
                <Text style={TextStyles.Title}>추천 장소</Text>
              </TextBox>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <RecommendPlace
                  onPress={() => { navigationToMap.navigate('맵', { id: 0 }) }}>
                  <ImageBackground
                    imageStyle={{ borderRadius: width / 10 }}
                    style={{ flex: 1 }}
                    resizeMode='contain'
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </RecommendPlace>
                <RecommendPlace
                  onPress={() => { navigationToMap.navigate('맵', { id: 0 }) }}>
                  <ImageBackground
                    imageStyle={{ borderRadius: width / 10 }}
                    style={{ flex: 1 }}
                    resizeMode='cover'
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </RecommendPlace>
                <RecommendPlace
                  onPress={() => { navigationToMap.navigate('맵', { id: 0 }) }}>
                  <ImageBackground
                    imageStyle={{ borderRadius: width / 10 }}
                    style={{ flex: 1 }}
                    resizeMode='cover'
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </RecommendPlace>
                <RecommendPlace
                  onPress={() => { navigationToMap.navigate('맵', { id: 0 }) }}>
                  <ImageBackground
                    imageStyle={{ borderRadius: width / 10 }}
                    style={{ flex: 1 }}
                    resizeMode='cover'
                    source={{
                      uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                  />
                </RecommendPlace>
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
                    onPress={() => { navigation.navigate('Detail', { id: item.id }) }} />
                )}
              ></CardView>
            </SectionCuration>
          </ScrollView>
          <PlusButton onPress={() => { navigation.navigate('Form') }}>
            <AddColor color={'#FFFFFF'} />
          </PlusButton>
        </>
      }
      
    </SafeAreaView>
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
  }
})