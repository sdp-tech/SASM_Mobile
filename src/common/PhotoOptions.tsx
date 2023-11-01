import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
} from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { TextPretendard as Text } from "./CustomText";
import * as ImagePicker from "react-native-image-picker";
import styled from "styled-components/native";
import PlaceUser from "../assets/img/Map/PlaceUser.svg";
import PhotoIcon from "../assets/img/common/PhotoIcon.svg";
import { CameraOptions } from "react-native-image-picker";
import { ImageLibraryOptions } from "react-native-image-picker";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

const PhotosInput = styled.View`
  display: flex;
  flex-flow: row wrap;
  border: 1px black solid;
`;
const PhotoButton = styled.TouchableOpacity`
  width: 50%;
  padding: 10px;
`;

interface Action {
  title: string;
  type: "capture" | "library";
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

interface PhotoProps {
  setPhoto: Dispatch<SetStateAction<any>>;
  max: number;
}

export interface PhotoResultProps {
  fileName: string;
  width: number;
  height: number;
  uri: string;
}

export default function PhotoOptions({
  setPhoto,
  max,
}: PhotoProps): JSX.Element {
  const CameraActions: Action[] = [
    //카메라 & 갤러리 세팅
    {
      title: "카메라",
      type: "capture",
      options: {
        selectionLimit: max,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 300,
        maxWidth: 300,
      },
    },
    {
      title: "앨범",
      type: "library",
      options: {
        selectionLimit: max,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 300,
        maxWidth: 300,
      },
    },
  ];
  const onButtonPress = useCallback(
    (
      type: string,
      options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions
    ) => {
      //카메라 & 갤러리 열기
      if (type === "capture") {
        ImagePicker.launchCamera(options, (response) =>
          setPhoto(response.assets)
        );
      } else {
        ImagePicker.launchImageLibrary(options, (response) =>
          setPhoto(response.assets)
        );
      }
    },
    []
  );
  return (
    <PhotosInput>
      {CameraActions.map(({ title, type, options }) => {
        return (
          <PhotoButton key={title} onPress={() => onButtonPress(type, options)}>
            <Text style={{ textAlign: "center" }}>{title}</Text>
          </PhotoButton>
        );
      })}
    </PhotosInput>
  );
}

const Container = styled.View<{ width: number; height: number, align: string }>`
  position: relative;
  width: ${(props) => props.height}px;
  height: ${(props) => props.height}px;
  display: flex;
  flex-direction: row;
  align-self: ${(props) => props.align};
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
interface PhotoSelectorProps extends PhotoProps {
  width: number;
  height: number;
  children?: ReactNode | JSX.Element | ReactElement;
  alignContainer?: string;
}
export const PhotoSelector = ({
  width,
  height,
  children,
  max,
  setPhoto,
  alignContainer,
}: PhotoSelectorProps): JSX.Element => {
  const options: CameraOptions[] | ImageLibraryOptions[] = [
    //카메라 & 갤러리 세팅
    {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
    {
      selectionLimit: max,
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
  ];
  return (
    <Container width={width} height={height} align={alignContainer ? alignContainer : 'center'}>
      <SelectButton
        width={width}
        height={height}
        onPress={() => {
          Alert.alert("사진 선택", "", [
            {
              text: "카메라",
              onPress: () => {
                ImagePicker.launchCamera(
                  options[0],
                  (response) => !response.didCancel && setPhoto(response.assets)
                );
              },
            },
            {
              text: "앨범",
              onPress: () => {
                ImagePicker.launchImageLibrary(
                  options[1],
                  (response) => !response.didCancel && setPhoto(response.assets)
                );
              },
            },
            { text: "취소", style: "destructive" },
          ]);
        }}
      >
        <PhotoIcon />
      </SelectButton>
      {children}
    </Container>
  );
};

export const CameraSelector = (
  callback: (res: ImagePicker.Asset[]) => void,
  max: number
): void => {
  const options: CameraOptions[] | ImageLibraryOptions[] = [
    //카메라 & 갤러리 세팅
    {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
    {
      selectionLimit: max,
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 300,
      maxWidth: 300,
    },
  ];

  return Alert.alert("사진 선택", "", [
    {
      text: "카메라",
      onPress: () => {
        ImagePicker.launchCamera(options[0], (response) => {
          if (!response.didCancel && response.assets) {
            callback(response.assets);
          }
        });
      },
    },
    {
      text: "앨범",
      onPress: () => {
        ImagePicker.launchImageLibrary(options[1], (response) => {
          if (!response.didCancel && response.assets) {
            callback(response.assets);
          }
        });
      },
    },
    { text: "취소", style: "destructive" },
  ]);
};
