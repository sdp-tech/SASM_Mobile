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
import { useState, useEffect } from "react";
import InputWithLabel from "../../../common/InputWithLabel";
import Close from "../../../assets/img/common/Close.svg";
import Category from "../../../common/Category";
import { TextPretendard as Text } from "../../../common/CustomText";
import Postcode from "@actbase/react-daum-postcode";
import { formDataProps, NextBtn } from "./PlaceForm";

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
  setTab: React.Dispatch<React.SetStateAction<number>>;
  formData: formDataProps;
  setFormData: React.Dispatch<React.SetStateAction<formDataProps>>;
}

export default function PlaceProfileForm({
  setTab,
  formData,
  setFormData,
}: TabProps) {
  const [postModal, setPostModal] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>(
    formData.category === "" ? [] : [formData.category]
  );

  useEffect(() => {
    if (checkedList.length > 1) {
      Alert.alert("카테고리는 최대 1개까지만 선택 가능합니다.");
      setCheckedList([]);
      setFormData((prev) => {
        return { ...prev, category: "" };
      });
    } else if (checkedList.length < 1) {
      setFormData((prev) => {
        return { ...prev, category: "" };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, category: checkedList[0] };
      });
    }
  }, [checkedList]);

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 85, marginBottom: 50 }}>
        어떤 장소인지 알려주세요.
      </Text>
      <InputWithLabel
        label="장소명"
        isRequired={true}
        placeholder="장소명을 입력해주세요."
        containerStyle={InputStyle}
        value={formData.place_name}
        onChangeText={(e) => {
          setFormData((prev) => {
            return { ...prev, place_name: e };
          });
        }}
      />
      <InputWithLabel
        label="주소등록"
        value={formData.address}
        isRequired={true}
        placeholder="주소를 검색해주세요."
        containerStyle={InputStyle}
        editable={false}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
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
        <Text style={{ ...TextStyles.labelSmall }}>
          카테고리 선택
          <Text style={{ color: "#FF4D00", lineHeight: 18 }}> *</Text>
        </Text>
        <Category
          story={true}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          style={{ marginTop: 20, width: "100%" }}
        />
      </InputWrapper>
      <NextBtn
        onPress={() =>
          setTab((prev) => {
            return prev + 1;
          })
        }
        disability={
          formData.address === "" ||
          formData.place_name === "" ||
          formData.category === ""
        }
      />
      <Modal visible={postModal}>
        <TouchableOpacity
          onPress={() => setPostModal(false)}
        ></TouchableOpacity>
        <View
          style={{
            paddingVertical: "40%",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              height: 40,
            }}
          >
            <Text
              style={{
                ...TextStyles.label,
              }}
            >
              우편번호 검색
            </Text>
            <TouchableOpacity
              onPress={() => {
                setPostModal(false);
              }}
            >
              <Close width={20} height={20} color="#000000" />
            </TouchableOpacity>
          </View>
          <Postcode
            style={{
              width: "100%",
              height: "100%",
            }}
            onError={() => {
              Alert.alert("주소 검색에 실패하였습니다.");
            }}
            jsOptions={{ animation: true, hideMapBtn: true }}
            onSelected={(data) => {
              setFormData({ ...formData, address: data.address });
              setPostModal(false);
            }}
          />
        </View>
      </Modal>
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  label: {
    fontSize: 16,
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
