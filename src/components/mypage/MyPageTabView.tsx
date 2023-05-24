import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, useWindowDimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Request } from '../../common/requests';
import MyPlace from './components/myplace/MyPlace';
import MyStory from './components/mystory/MyStory';
import { MyPageParams } from '../../pages/MyPage';
import Profile from '../../assets/img/MyPage/Profile.svg';
import Settings from '../../assets/img/MyPage/Settings.svg';

const MyCuration = () => {
  return (
    <View>
      <Text>큐레이션</Text>
    </View>
  )
}

const MyCommunity = () => {
  return (
    <View>
      <Text>정보글</Text>
    </View>
  )
}

const MyPageTabView = ({ navigation, route }: MyPageParams) => {
  const [nickname, setNickname] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [follow, setFollow] = useState({
    follower: 0,
    following: 0
  })
  const [img, setImg] = useState<string>("");
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "place", title: "장소" },
    { key: "story", title: "스토리" },
    { key: "curation", title: "큐레이션"},
    { key: "community", title: "정보글"}
  ]);
  const request = new Request();

  const renderScene = SceneMap({
    place: MyPlace,
    story: MyStory,
    curation: MyCuration,
    community: MyCommunity,
  })

  const getProfile = async () => {
    const response = await request.get(`/users/me/`,{},{});
    setNickname(response.data.data.nickname);
    setImg(response.data.data.profile_image);
  }

  useEffect(() => {
    getProfile();
  })

  const ProfileSection = () => {
    return (
      <View style={{flexDirection: "row", marginLeft: 15}}>
        <Image source={{uri: img}} style={{width: 80, height: 80, borderRadius: 60}} />
        <View style={{paddingVertical: 10, marginLeft: 10}}>
          <Text style={{fontWeight: "700", fontSize: 16}}>{nickname}</Text>
          <Text style={{fontWeight: "400", fontSize: 12, marginTop: 10}}>자기소개</Text>
          <Text style={{fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10}}>팔로워 {follow.follower} | 팔로잉 {follow.following}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={{flexDirection: "row", paddingHorizontal: 20, paddingVertical: 10}}>
        <TouchableOpacity style={{}} onPress={() => {navigation.navigate('user')}}>
          <Profile />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 300, justifyContent: 'center'}}>
          <Settings />
        </TouchableOpacity>
      </View>
      <ProfileSection />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: "#67D393",
            }}
            style={{
              backgroundColor: "white",
              shadowOffset: { height: 0, width: 0 },
              shadowColor: "transparent",
            }}
            labelStyle={{
              color: '#202020'
            }}
            pressColor={"transparent"}
          />
        )}
    />
    </SafeAreaView>
  )
}

export default MyPageTabView;