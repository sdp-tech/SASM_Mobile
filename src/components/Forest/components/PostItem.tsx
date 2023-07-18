import { useState, useEffect } from 'react';
import { TextPretendard as Text } from "../../../common/CustomText";
import { View, ImageBackground, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import Arrow from "../../../assets/img/common/Arrow.svg";
import CommentIcon from '../../../assets/img/Story/Comment.svg';
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';

interface PostItemProps {
  post_id: number;
  title: string;
  preview: string;
  writer: any;
  photos: any;
  rep_pic: string;
  comment_cnt: number;
  like_cnt: number;
  user_likes: boolean;
  onRefresh: any;
  isLogin: boolean;
  navigation: any;
}

const { width, height } = Dimensions.get("window");

const PostItem = ({
  post_id,
  title,
  preview,
  writer,
  photos,
  rep_pic,
  comment_cnt,
  like_cnt,
  user_likes,
  onRefresh,
  isLogin,
  navigation,
}: PostItemProps) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();
  useEffect(() => {
    user_likes && setLike(true);
  }, [user_likes])

  const toggleLike = async () => {
    if(isLogin){
      const response = await request.post(`/forest/${post_id}/like/`);
      setLike(!like);
      onRefresh();
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
            {
                text: "이동",
                onPress: () => navigation.navigate('Login'),

            },
            {
                text: "취소",
                onPress: () => { },
                style: "cancel"
            },
        ],
        { cancelable: false }
      );
    }
  };
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PostDetail", {
          post_id: post_id,
        });
      }}
    >
      <View
        style={{
          width: width - 30,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#373737",
          flexDirection: "row",
          marginHorizontal: 15,
        }}
      >
        {pressed ? (
          <>
            <View style={{ flex: 1, paddingTop: 10}}>
              <View style={{flex: 1}}>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}
                  numberOfLines={2}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "200",
                    color: '#373737',
                    opacity: 0.6,
                    marginBottom: 15,
                  }}
                  numberOfLines={12}
                >
                  {preview}
                </Text>
              </View>
              <View style={{flexDirection: 'row', }}>
                <Text style={{ color: '#67D393', fontSize: 12, fontWeight: "600", opacity: 0.6, lineHeight: 18, flex: 1 }}>{writer.nickname}</Text>
                <Heart like={like} onPress={toggleLike} />
                <Text style={{color: '#209DF5', fontSize: 12, lineHeight: 18}}>{like_cnt}</Text>
                <CommentIcon width={15} height={15} />
                <Text style={{color: '#209DF5', fontSize: 12, lineHeight: 18}}>{comment_cnt}</Text>
              </View>
              <TouchableOpacity onPress={() => setPressed(false)}
                style={{ marginLeft: (width-30) / 2 }}
              >
                <Arrow transform={[{ rotate: "270deg" }]} width={15} height={15} />
              </TouchableOpacity>
            </View>
            <View>
              <ImageBackground
                style={{
                  width: 90,
                  height: 90,
                  padding: 5,
                }}
                source={{ uri: rep_pic }}
              />
              {photos.map((uri: string, index: number) => {
                return (
                  <Image style={{width: 90, height: 90}} key={index} source={{uri: uri}} />
                )
              })}
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1, paddingTop: 10}}>
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "200",
                  opacity: 0.6,
                  marginBottom: 8,
                }}
                numberOfLines={2}
              >
                {preview}
              </Text>
              <Text style={{ color: '#67D393', fontSize: 12, fontWeight: "600", opacity: 0.6 }}>
                {writer.nickname}
              </Text>
            </View>
            <ImageBackground
              style={{
                width: 90,
                height: 90,
                padding: 5,
              }}
              source={{ uri: rep_pic }}
            />
            <TouchableOpacity onPress={() => setPressed(true)}
              style={{ position: "absolute", top: 110, left: (width-30) / 2 }}
            >
              <Arrow transform={[{ rotate: "90deg" }]} width={10} height={10} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const HotPostItem = ({
  post_id,
  title,
  preview,
  writer,
  photos,
  rep_pic,
  comment_cnt,
  like_cnt,
  user_likes,
  onRefresh,
  isLogin,
  navigation,
}: PostItemProps) => {
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();

  useEffect(() => {
    user_likes && setLike(true);
  }, [user_likes])

  const toggleLike = async () => {
    if(isLogin){
      const response = await request.post(`/forest/${post_id}/like/`);
      setLike(!like);
      onRefresh();
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
            {
                text: "이동",
                onPress: () => navigation.navigate('Login'),

            },
            {
                text: "취소",
                onPress: () => { },
                style: "cancel"
            },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={{width: width}}>
      <TouchableOpacity style={{ marginBottom: 8, marginLeft: 20 }} 
        onPress={() => {
          navigation.navigate("PostDetail", {
            post_id: post_id,
          });
        }}
      >
        <ImageBackground source={{ uri: rep_pic }}
          style={{ width: width - 40, height: 100 }} imageStyle={{ borderRadius: 4 }}>
          <View style={{ alignItems: "center", flex: 1, marginTop: 40 }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700"}}>{title}</Text>
          </View>
          <View style={{flexDirection: "row", padding: 10}}>
            <View style={{flexDirection: "row", alignSelf: "flex-start", flex: 1}}>
              <Heart like={like} onPress={toggleLike} white={true} />
              <Text style={{ color: "white", lineHeight: 18, marginLeft: 3 }}>{like_cnt}</Text>
            </View>
            <Text style={{ color: "#67D393", fontWeight: "600", marginRight: 5}}>{writer.nickname}</Text>
          </View>
          <TouchableOpacity
            style={{ position: "absolute", top: 85, left: (width-40) / 2 }}
          >
            <Arrow width={10} height={10} color={"#FFFFFF"} transform={[{ rotate: "90deg" }]} />
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default PostItem;