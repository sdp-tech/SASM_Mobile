import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Dimensions, TouchableOpacity, ViewBase, Image, ImageBackground, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import CardView from '../common/CardView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurationList from '../components/Home/CurationList ';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import CurationDetail from '../components/Home/CurationDetail';
import SearchBar from '../common/SearchBar';
import ItemCard from '../components/Home/ItemCard';
import PlusButton from '../common/PlusButton';
import { useNavigation } from '@react-navigation/native';
import { TabProps } from '../../App';
import { Request } from '../common/requests';


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
export type HomeStackParams = {
  "Home": undefined;
  "List": undefined;
  "Detail": {
    id: number;
  }
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

export default function HomeScreen(): JSX.Element {
  const HomeStack = createNativeStackNavigator<HomeStackParams>();

  return (
    <HomeStack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <HomeStack.Screen name="Home" component={CurationHome} />
      <HomeStack.Screen name="List" component={CurationList} />
      <HomeStack.Screen name="Detail" component={CurationDetail} />
    </HomeStack.Navigator>
  )
}
export const item = [
  {
    text: 'hello1',
    id: 1,
  },
  {
    text: 'hello2',
    id: 2,
  },
  {
    text: 'hello3',
    id: 3,
  },
  {
    text: 'hello4',
    id: 4,
  },
  {
    text: 'hello5',
    id: 5,
  },
  {
    text: 'hello6',
    id: 6,
  }
]

function CurationHome({ navigation, route }: StackScreenProps<HomeStackParams, 'Home'>): JSX.Element {
  const navigationToMap = useNavigation<StackNavigationProp<TabProps>>();
  // 큐레이션 검색어
  const [search, setSearch] = useState<string>("");
  // 큐레이션 페이지
  const [page, setPage] = useState<number>(1);
  // 연관 스토리 검색
  const [storyData, setStoryData] = useState([]);
  const request = new Request();

  const getStory = async () => {
    const response = await request.get('/stories/story_search/',{
      page:1, 
      search:'비건',
      latest: true,
    });
    setStoryData(response.data.data.results);
  }
  useEffect(()=>{
    getStory();
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
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
          data={item}
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
            data={item}
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
          <ItemCard
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
            onPress={() => { navigation.navigate('Detail', { id: item[2].id }) }} />
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
        <SectionCuration style={{marginBottom:30}}>
          <TextBox>
            <Text style={TextStyles.Title}>"비건"과 관련된 스토리</Text>
          </TextBox>
          <CardView
            gap={10}
            data={storyData}
            offset={10}
            pageWidth={width* 0.4}
            height={height* 0.25}
            dot={false}
            renderItem={({item}:any)=>(
              <ItemCard
                style={{ width: width * 0.4, height: height * 0.25, marginHorizontal: 5 }}
                data={item}
                onPress={() => { navigation.navigate('Detail', { id: item.id }) }} />
            )}
          ></CardView>
        </SectionCuration>
      </ScrollView>
      <PlusButton onPress={() => { console.log('clicked') }} />
    </SafeAreaView>
  )
}