import styled from "styled-components/native";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import { useState } from "react";
import InputWithLabel from "../../../common/InputWithLabel";
import { TextPretendard as Text } from "../../../common/CustomText";

const Section = styled.View`
  height: 90%;
  width: 100%;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputStyle = {
  width: "100%",
  marginVertical: 15,
};

interface TabProps {
  NextBtn: any;
}

export default function PlaceAddinfoForm({ NextBtn }: TabProps) {
  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        공간 이름
      </Text>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 60 }}>
        추가 정보를 입력해주세요.
      </Text>
      <InputWithLabel
        label="전화번호"
        isRequired={true}
        placeholder="전화번호를 입력해주세요."
        containerStyle={InputStyle}
        // onChangeText={(e) => { setForm({ ...form, place_name: e }) }}
      />
      <InputWithLabel
        label="링크"
        isRequired={false}
        placeholder="장소와 관련된 링크를 입력해주세요."
        containerStyle={InputStyle}
      />
      <InputWithLabel
        label="덧붙이는 말"
        isRequired={false}
        placeholder="하고 싶은 말이 있으시다면 적어주세요."
        containerStyle={InputStyle}
      />

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
