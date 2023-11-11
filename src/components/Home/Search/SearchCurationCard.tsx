import { useState, useEffect, useCallback } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { TabProps } from "../../../../App";
import { TextPretendard as Text } from "../../../common/CustomText";

export default function SearchCurationCard({ data }: any) {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation<StackNavigationProp<TabProps>>();

  const onPress = (id: number) => {
    navigation.navigate("홈", { id: id });
  };

  return (
    <FastImage
      source={{ uri: "data_uri", priority: FastImage.priority.normal }}
      style={{
        margin: 5,
        width: (width - 45) / 3,
        height: 150,
        backgroundColor: "grey",
      }}
    >
      <View style={{ height: "100%", justifyContent: "flex-end", padding: 8 }}>
        <Text style={textStyles.writer}>작성자</Text>
        <Text style={textStyles.title} numberOfLines={2}>
          큐레이션 제목
        </Text>
      </View>
    </FastImage>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.6,
    lineHeight: 18,
    color: "#FFFFFF",
  },
  writer: {
    fontSize: 12,
    fontWeight: "400",
    color: "#FFFFFF",
    width: "90%",
    marginVertical: 3,
  },
});
