import styled from "styled-components/native";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import { useState } from "react";
import { PhotoResultProps, PhotoSelector } from "../../../common/PhotoOptions";
import { TextPretendard as Text } from "../../../common/CustomText";

const Section = styled.View`
  height: 90%;
  width: 100%;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface TabProps {
  NextBtn: any;
}

export default function PlaceProfileScreen({ NextBtn }: TabProps) {
  const { width, height } = Dimensions.get("window");

  const [rep_pic, setRep_pic] = useState<PhotoResultProps[]>([
    {
      width: 1,
      height: 1,
      fileName: "",
      uri: "",
    },
  ]);

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        공간 이름
      </Text>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 100 }}>
        장소의 사진을 등록해주세요.
      </Text>
      <PhotoSelector
        max={1}
        setPhoto={setRep_pic}
        width={width * 0.5}
        height={width * 0.5}
      >
        <Image
          style={{
            width: width - 70,
            height: ((width - 70) / rep_pic[0].width) * rep_pic[0].height,
            maxHeight: width - 120,
          }}
          source={{ uri: rep_pic[0].uri }}
          alt="대표 사진"
          resizeMode="contain"
        />
      </PhotoSelector>
      {NextBtn}
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 24,
    letterSpacing: -0.6,
  },
  labelSmall: {
    fontSize: 14,
    letterSpacing: -0.6,
  },
  labelBold: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "700",
    width: "85%",
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  submit: {
    fontSize: 24,
    lineHeight: 35,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  serviceSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
