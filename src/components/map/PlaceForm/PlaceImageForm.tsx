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
import * as ImagePicker from "react-native-image-picker";
import { CameraOptions, ImageLibraryOptions } from "react-native-image-picker";
import { PhotoResultProps, PhotoSelector } from "../../../common/PhotoOptions";
import { formDataProps } from "./PlaceForm";
import PhotoIcon from "../../../assets/img/common/PhotoIcon.svg";
import { TextPretendard as Text } from "../../../common/CustomText";

const Section = styled.View`
  height: 90%;
  width: 100%;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PhotoWrapper = styled.View<{ height: number }>`
  overflow-x: scroll;
  margin-top: 20%;
  height: ${(props) => props.height};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const PhotoItem = styled.Image`
  height: 50px;
  width: 50px;
  margin: 0;
  padding: 0;
`;

const Container = styled.View<{ width: number; height: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => props.height}px;
  display: flex;
  flex-flow: row;
  align-items: center;
`;

const SelectButton = styled.TouchableOpacity<{ width: number; height: number }>`
  position: relative;
  background: #dadada;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: auto;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
`;

interface TabProps {
  NextBtn: any;
  formData: formDataProps;
  setFormData: React.Dispatch<React.SetStateAction<formDataProps>>;
}

export default function PlaceImageForm({
  NextBtn,
  formData,
  setFormData,
}: TabProps) {
  const { width, height } = Dimensions.get("window");

  const [rep_pic, setRep_pic] = useState<PhotoResultProps[]>([
    {
      width: 1,
      height: 1,
      fileName: "",
      uri: "",
    },
  ]);

  const options: CameraOptions[] | ImageLibraryOptions[] = [
    //카메라 & 갤러리 세팅
    {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
    {
      selectionLimit: 4 - formData.imageList.length,
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
  ];

  function handleImageSelect(uri: string) {
    setFormData((prev) => {
      return { ...prev, imageList: [...prev.imageList, uri] };
    });
  }

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        {formData.place_name}
      </Text>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 0 }}>
        장소의 사진을 등록해주세요.
      </Text>
      <Text
        style={{ ...TextStyles.labelSmall, marginTop: 10, marginBottom: 70 }}
      >
        (* 최소 1장, 최대 4장)
      </Text>

      <Container width={width * 0.5} height={width * 0.5}>
        {formData.imageList.length < 4 && (
          <SelectButton
            width={width * 0.5}
            height={width * 0.5}
            onPress={() => {
              Alert.alert("사진 선택", "", [
                {
                  text: "카메라",
                  onPress: () => {
                    ImagePicker.launchCamera(options[0], (response) => {
                      if (response.didCancel) {
                        return;
                      } else if (response.errorCode) {
                        console.log("ImagePicker Error: ", response.errorCode);
                      } else if (
                        response.assets !== undefined &&
                        response.assets[0].uri !== undefined
                      ) {
                        handleImageSelect(response.assets[0].uri);
                      } else Alert.alert("첨부할 수 없는 사진");
                    });
                  },
                },
                {
                  text: "앨범",
                  onPress: () => {
                    ImagePicker.launchImageLibrary(options[1], (response) => {
                      if (response.didCancel) {
                        return;
                      } else if (response.errorCode) {
                        console.log("ImagePicker Error: ", response.errorCode);
                      } else if (response.assets !== undefined) {
                        handleImageSelect(
                          response.assets[0].uri !== undefined
                            ? response.assets[0].uri
                            : ""
                        );
                      }
                    });
                  },
                },
                { text: "취소", style: "destructive" },
              ]);
            }}
          >
            <PhotoIcon />
          </SelectButton>
        )}
      </Container>
      <PhotoWrapper height={width * 0.2}>
        {formData.imageList?.map((src, index) => (
          <TouchableOpacity
            onPress={() =>
              Alert.alert("사진 수정", "", [
                {
                  text: "삭제하기",
                  onPress: () => {
                    const newList = formData.imageList.splice(index, 0);
                    setFormData((prev) => {
                      return { ...prev, imageList: newList };
                    });
                  },
                },
                { text: "대표 사진으로 설정하기" },
                { text: "취소", style: "destructive" },
              ])
            }
          >
            <Image
              source={{ uri: src }}
              style={{ height: width * 0.2, width: width * 0.2 }}
            />
          </TouchableOpacity>
        ))}
      </PhotoWrapper>
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
