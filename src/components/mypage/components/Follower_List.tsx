import React, { useState, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, View, StyleSheet, SafeAreaView, Platform } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests'
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../pages/MyPage';
import SearchBar from '../../../common/SearchBar';
import Arrow from '../../../assets/img/common/Arrow.svg';

const Follower = ({ navigation, route }: StackScreenProps<MyPageProps, 'follower'>) => {
  const request = new Request();
  const [followerList, setFollowerList] = useState<{ email: string, profile_image: string, nickname: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const GetFollower = async () => {
    const response = await request.get('/mypage/follower/', {
      email: route.params.email,
      search_email: searchQuery
    });
    setFollowerList(response.data.data.results)
  }


  useFocusEffect(
    useCallback(() => {
      GetFollower();
    }, [searchQuery]))


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 10 }}>
      <TouchableOpacity style={{ left: 10, marginBottom: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 5 : 0 }} onPress={() => { navigation.goBack() }}>
        <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} style={{ marginRight: 16 }} color={'black'}/>
        <Text style={{ fontSize: 16, lineHeight: 24, letteringSpace: -0.6 }} >팔로워</Text>
      </TouchableOpacity>
      <SearchBar
        search={searchQuery}
        setSearch={setSearchQuery}
        style={{ width: '90%', backgroundColor: "#F4F4F4" }}
        placeholder='궁금한 프로필을 검색해보세요'
        keyboardType='email-address'
      />
      <ScrollView contentContainerStyle={styles.container}>
        {
          followerList.length == 0 ? 
            <View>
              <Text style={styles.alert}>당신을 팔로잉 중인 유저가 없습니다</Text>
            </View> :
            <>
            {
              followerList.map((user) => (
                <View style={styles.userContainer}>
                  <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.nickname}</Text>
                    {/* <Text style={styles.useremail}>{user.email}</Text> */}
                  </View>
                  <TouchableOpacity onPress={()=>{}}></TouchableOpacity>
                </View>
              ))
            }
            </>
        }
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

  text: {
    fontSize: 8,
    fontWeight: "bold"
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 6,
    bottom: 8,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  userContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  username: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.6
  },
  useremail: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6
  },
  searchStyle: {
    width: 390,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    fontSize: 12,

  },
  profileImage: {
    width: 40,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  alert: {
    fontWeight: '700',
    marginLeft: 20,
  }
});



export default Follower;
