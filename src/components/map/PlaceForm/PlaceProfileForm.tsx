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
import InputWithLabel, {
  InputTouchWithLabel,
} from "../../../common/InputWithLabel";
import Category from "../../../common/Category";
import { TextPretendard as Text } from "../../../common/CustomText";
import Postcode from "@actbase/react-daum-postcode";

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

interface BtnProps {
  setPostModal: any;
}

interface TabProps {
  NextBtn: any;
}

function ModalBtn({ setPostModal }: BtnProps) {
  return (
    <TouchableOpacity
      style={{
        width: 70,
        height: 35,
        borderRadius: 10,
        backgroundColor: "#C0C0C0",
        alignSelf: "flex-end",
      }}
      onPress={() => setPostModal(true)}
    >
      <Text
        style={{
          ...TextStyles.label,
          width: "100%",
          alignSelf: "center",
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        주소검색
      </Text>
    </TouchableOpacity>
  );
}

export default function PlaceProfileScreen({ NextBtn }: TabProps) {
  const [postModal, setPostModal] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 80, marginBottom: 50 }}>
        어떤 장소인지 알려주세요.
      </Text>
      <InputWithLabel
        label="장소명"
        isRequired={true}
        placeholder="장소명을 입력해주세요."
        containerStyle={InputStyle}
        // onChangeText={(e) => { setForm({ ...form, place_name: e }) }}
      />
      <InputWithLabel
        label="주소등록"
        isRequired={true}
        placeholder="주소를 검색해주세요."
        containerStyle={InputStyle}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            width: 70,
            height: 35,
            borderRadius: 10,
            backgroundColor: "#C0C0C0",
          }}
          onPress={() => setPostModal(true)}
        >
          <Text
            style={{
              ...TextStyles.label,
              width: "100%",
              alignSelf: "center",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            주소검색
          </Text>
        </TouchableOpacity>
      </InputWithLabel>
      <InputWrapper>
        <Text style={TextStyles.labelSmall}>카테고리 선택</Text>
        <Category
          story={true}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          style={{ marginTop: 20 }}
        />
      </InputWrapper>
      {NextBtn}
      <Modal visible={postModal}>
        <Postcode
          style={{ width: "100%", height: "100%", marginTop: 50 }}
          onError={() => {
            Alert.alert("주소 검색에 실패하였습니다.");
          }}
          jsOptions={{ animation: true, hideMapBtn: true }}
          onSelected={(data) => {
            // setForm({ ...form, address: data.address })
            setPostModal(false);
          }}
        />
      </Modal>
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
