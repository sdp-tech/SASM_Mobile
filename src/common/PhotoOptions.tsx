import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Text } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import styled from 'styled-components/native';

const PhotosInput = styled.View`
  display: flex; 
  flex-flow: row wrap;
  border: 1px black solid;
`
const PhotoButton = styled.TouchableOpacity`
  width: 50%;
  padding: 10px;
`

interface Action {
  title: string;
  type: 'capture' | 'library';
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

export default function PhotoOptions({setPhoto, max}:PhotoProps): JSX.Element {
  
  const CameraActions: Action[] = [
    //카메라 & 갤러리 세팅
    {
      title: '카메라',
      type: 'capture',
      options: {
        selectionLimit: max,
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 300,
        maxWidth: 300,
      },
    },
    {
      title: '앨범',
      type: 'library',
      options: {
        selectionLimit: max,
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 300,
        maxWidth: 300,
      },
    }
  ];
  const onButtonPress = useCallback((type: string, options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions) => {
    //카메라 & 갤러리 열기
    if (type === 'capture') {
      ImagePicker.launchCamera(options, response => setPhoto(response.assets))
    } else {
      ImagePicker.launchImageLibrary(options, response => setPhoto(response.assets))
    }
  }, []);
  return (
    <PhotosInput>
      {
        CameraActions.map(({ title, type, options }) => {
          return (
            <PhotoButton
              key={title}
              onPress={() => onButtonPress(type, options)}>
              <Text style={{ textAlign: 'center' }}>{title}</Text>
            </PhotoButton>
          );
        })
      }
    </PhotosInput>
  )
}
