import { useState, useEffect, useCallback, useContext } from 'react';
import { View, SafeAreaView, useWindowDimensions, Image } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Request } from '../../common/requests';
import MyPlace from './components/myplace/MyPlace';
import MyStory from './components/mystory/MyStory';
import MyCuration from './components/mycuration/MyCuration';
import { MyPageParams, MyPageProps } from '../../pages/MyPage';
import Profile from '../../assets/img/MyPage/Profile.svg';
import Settings from '../../assets/img/MyPage/Settings.svg';
import { getAccessToken } from '../../common/storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginContext } from '../../common/Context';

const MyCommunity = () => {
  return (
    <View>
      <Text>정보글</Text>
    </View>
  )
}

export interface IUserInfo {
  id: number;
  gender: string;
  nickname: string;
  birthdate: string;
  email: string;
  profile_image: string;
  address: string;
  is_sdp_admin: boolean;
  is_verifed: boolean;
}

const MyPageTabView = ({ navigation }: StackScreenProps<MyPageProps, 'mypage'>) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [info, setInfo] = useState<IUserInfo>({
    id: 0,
    gender: '',
    nickname: '',
    birthdate: '',
    email: '',
    profile_image: '',
    address: '',
    is_sdp_admin: false,
    is_verifed: false,
  });
  const [follower, setFollower] = useState<{ num: number, list: any[] }>({ num: 0, list: [] });
  const [following, setFollowing] = useState<{ num: number, list: any[] }>({ num: 0, list: [] });

  const getUserinfo = async () => {
    const response_info = await request.get(`/mypage/me/`);
    setInfo(response_info.data.data)

    const response_following = await request.get('/mypage/following/', {
      email: response_info.data.data.email,
      search_email: '',
    })
    const response_follower = await request.get('/mypage/follower/', {
      email: response_info.data.data.email,
      search_email: '',
    })

    setFollower({ num: response_follower.data.data.count, list: response_follower.data.data.results })
    setFollowing({ num: response_following.data.data.count, list: response_following.data.data.results })

  }

  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: "place", title: "장소" },
    { key: "story", title: "스토리" },
    { key: "curation", title: "큐레이션" },
    { key: "community", title: "정보글" }
  ]);
  const request = new Request();

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "place":
        return <MyPlace navigation={navigation} />;
      case "story":
        return <MyStory navigation={navigation} />;
      case "curation":
        return <MyCuration navigation={navigation} />;
      case "community":
        return <MyCommunity />;
    }
  }

  const checkIsLogin = async () => {
    const token = await getAccessToken();
    if (!token) navigation.navigate('login');
    else getUserinfo();
  }

  useFocusEffect(useCallback(() => {
    // checkIsLogin();
    if (isLogin) getUserinfo();
  }, [isLogin]))

  const ProfileSection = () => {
    return (
      <View style={{ flexDirection: "row", marginLeft: 15 }}>
        {
          isLogin ?
            <View>
              <Image source={{ uri: info?.profile_image }} style={{ width: 80, height: 80, borderRadius: 60 }} />
              <View style={{ paddingVertical: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>{info?.nickname}</Text>
                <Text style={{ fontWeight: "400", fontSize: 12, marginTop: 10 }}>자기소개</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { navigation.navigate('follower', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로워 {follower.num}  |  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('following', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로잉 {following.num}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <View>
              <View style={{borderColor:'#4DB1F7', borderWidth: 1,width: 80, height: 80, borderRadius: 60, display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Profile />
              </View>
              <View style={{ paddingVertical: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>SASM</Text>
                <Text style={{ fontWeight: "400", fontSize: 12, marginTop: 10 }}>로그인해서 다른 사람들의 장소를 탐색해보세요</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { navigation.navigate('follower', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로워 {follower.num}  |  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('following', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로잉 {following.num}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        }
      </View>
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: 10 }}>
        <TouchableOpacity onPress={() => { navigation.navigate('user', { info: info, follower: follower.num, following: following.num }) }}>
          <Profile />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 300 }} onPress={() => { navigation.navigate('options') }}>
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
            indicatorContainerStyle={{
              borderBottomColor: "#848484",
              borderBottomWidth: 0.25
            }}
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