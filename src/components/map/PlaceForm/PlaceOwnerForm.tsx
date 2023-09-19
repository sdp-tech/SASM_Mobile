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

const InputWrapper = styled.View`
  width: 85%;
  display: flex;
  align-items: flex-start;
  margin: 10px auto;
`;

const InputStyle = {
  width: "100%",
  marginVertical: 20,
};

interface TabProps {
  NextBtn: any;
}

export default function PlaceProfileScreen({ NextBtn }: TabProps) {
  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 100 }}>
        사업자 등록증을 업로드해주세요.
      </Text>
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
