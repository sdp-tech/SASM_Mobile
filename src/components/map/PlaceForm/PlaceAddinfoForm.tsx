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
import { formDataProps, NextBtn } from "./PlaceForm";

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
  setTab: React.Dispatch<React.SetStateAction<number>>;
  formData: formDataProps;
  setFormData: React.Dispatch<React.SetStateAction<formDataProps>>;
}

export default function PlaceAddinfoForm({
  setTab,
  formData,
  setFormData,
}: TabProps) {
  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        {formData.place_name}
      </Text>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 60 }}>
        추가 정보를 입력해주세요.
      </Text>
      <InputWithLabel
        label="전화번호"
        isRequired={true}
        placeholder="전화번호를 입력해주세요."
        containerStyle={InputStyle}
        value={formData.phone_num}
        onChangeText={(e) => {
          setFormData({ ...formData, phone_num: e });
        }}
      />
      <InputWithLabel
        label="리뷰"
        isRequired={true}
        placeholder="장소의 리뷰를 작성해주세요."
        containerStyle={InputStyle}
        value={formData.place_review}
        onChangeText={(e) => {
          setFormData((prev) => {
            return { ...prev, place_review: e };
          });
        }}
      />
      <InputWithLabel
        label="한줄평"
        isRequired={false}
        placeholder="하고 싶은 말이 있으시다면 적어주세요."
        containerStyle={InputStyle}
        value={formData.short_cur}
        onChangeText={(e) => {
          setFormData((prev) => {
            return { ...prev, short_cur: e };
          });
        }}
      />

      <NextBtn
        onPress={() =>
          setTab((prev) => {
            return prev + 1;
          })
        }
        disability={formData.phone_num === "" || formData.place_review === ""}
      />
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
