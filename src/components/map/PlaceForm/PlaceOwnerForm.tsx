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

const Btn = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12;
  background-color: #d7d7d7;
  width: 80%;
  height: 50px;
`;

interface TabProps {
  NextBtn: any;
}

export default function PlaceProfileScreen({ NextBtn }: TabProps) {
  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 85, marginBottom: 100 }}>
        사업자 등록증을 업로드해주세요.
      </Text>
      <Btn style={{ marginTop: 75 }}>
        <Text
          style={{
            ...TextStyles.label,
            color: "#202020",
            width: "100%",
            textAlign: "center",
          }}
        >
          업로드하기
        </Text>
      </Btn>
      {NextBtn}
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  label: {
    fontSize: 16,
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
