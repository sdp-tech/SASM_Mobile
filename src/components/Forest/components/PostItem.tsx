import { useState } from 'react';
import { TextPretendard as Text } from "../../../common/CustomText";
import { View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import Scrap from "../../../assets/img/Forest/Scrap.svg";
import Arrow from "../../../assets/img/common/Arrow.svg";
import Heart from '../../../common/Heart';

interface PostItemProps {
  board_id: number;
  post_id: number;
  board_name: string;
  title: string;
  preview: string;
  nickname: string;
  rep_pic: string;
  created: string;
  commentCount: number;
  likeCount: number;
  navigation: any;
}

const { width, height } = Dimensions.get("window");

const PostItem = ({
  board_id,
  post_id,
  board_name,
  title,
  preview,
  nickname,
  rep_pic,
  created,
  commentCount,
  likeCount,
  navigation,
}: PostItemProps) => {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PostDetail", {
          board_id: board_id,
          post_id: post_id,
          board_name: board_name,
        });
      }}
    >
      <View
        style={{
          width: width - 30,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#373737",
          flexDirection: "row",
          marginHorizontal: 15,
        }}
      >
        {pressed ? (
          <>
            <View style={{ flex: 1, paddingTop: 10}}>
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
                  opacity: 0.6,
                  marginBottom: 8,
                }}
                numberOfLines={12}
              >
                {preview}
              </Text>
              <Text style={{ color: '#67D393', fontSize: 12, fontWeight: "600", opacity: 0.6 }}>
                {nickname}
              </Text>
            </View>
            <ImageBackground
              style={{
                width: 90,
                height: 90,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: 5,
              }}
              source={{ uri: rep_pic }}
            >
              <TouchableOpacity onPress={() => console.log("저장")}>
                <Scrap />
              </TouchableOpacity>
            </ImageBackground>
            <TouchableOpacity onPress={() => setPressed(false)}
              style={{ position: "absolute", top: 110, left: (width-30) / 2 }}
            >
              <Arrow transform={[{ rotate: "270deg" }]} width={15} height={15} />
            </TouchableOpacity>
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
                {nickname}
              </Text>
            </View>
            <ImageBackground
              style={{
                width: 90,
                height: 90,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                padding: 5,
              }}
              source={{ uri: rep_pic }}
            >
              <TouchableOpacity onPress={() => console.log("저장")}>
                <Scrap />
              </TouchableOpacity>
            </ImageBackground>
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
  board_id,
  post_id,
  board_name,
  title,
  preview,
  nickname,
  rep_pic,
  created,
  commentCount,
  likeCount,
  navigation,
}: PostItemProps) => {
  return (
    <View style={{width: width}}>
      <TouchableOpacity style={{ marginBottom: 8, marginLeft: 20 }} 
        onPress={() => {
          navigation.navigate("PostDetail", {
            board_id: board_id,
            post_id: post_id,
            board_name: board_name,
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
              <Heart white={true}/>
              <Text style={{ color: "white", lineHeight: 18 }}>{likeCount}</Text>
            </View>
            <View style={{flexDirection: "row", alignSelf: "flex-end"}}>
              <Text style={{ color: "#67D393", fontWeight: "600", lineHeight: 18 }}>{nickname}</Text>
              <Scrap width={16} height={16} />
            </View>
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