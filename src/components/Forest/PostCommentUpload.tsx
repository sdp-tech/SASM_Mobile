import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import styled from "styled-components/native";
import * as ImagePicker from "react-native-image-picker";

import { BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";

interface Action {
  title: string;
  type: "capture" | "library";
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

interface PrevComment {
  content: string;
  photoList: string[];
}

interface PostCommentUploadSectionProps {
  comment_id?: number;
  post_id: number;
  board_id: number;
  boardFormat: BoardFormat;
  isParent: boolean;
  parentId?: number;
  navigation: any;
  reRenderScreen: any;
  // 댓글 수정 시 사용
  prevComment?: PrevComment;
}

const PostCommentUploadSection = ({
  comment_id,
  post_id,
  board_id,
  boardFormat,
  isParent,
  parentId,
  navigation,
  reRenderScreen,
  prevComment,
}: PostCommentUploadSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [photos, setPhotos] = useState<any[]>([]);

  const request = new Request();

  const actions: Action[] = [
    {
      title: "카메라",
      type: "capture",
      options: {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 150,
        maxWidth: 150,
      },
    },
    {
      title: "앨범",
      type: "library",
      options: {
        selectionLimit: 3,
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 150,
        maxWidth: 150,
      },
    },
  ];

  const uploadPostComment = async () => {
    const formData = new FormData();
    formData.append("post", post_id);
    formData.append("content", content);
    if (isParent) {
      formData.append("isParent", "True");
    } else {
      formData.append("isParent", "False");
      formData.append("parent", parentId);
    }
    if (boardFormat.supportsPostCommentPhotos && photos) {
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].uri) {
          // 업로드가 되지 않은 이미지일 경우 imageList에 추가
          formData.append("imageList", {
            uri: photos[i].uri,
            type: "image/jpeg/jpg",
            name: photos[i].fileName,
          });
        } else {
          // 아닐 경우, photoList에 추가
          formData.append("photoList", photos[i]);
        }
      }
    }
    if (boardFormat.supportsPostPhotos && photos) {
    }
    console.warn(formData);

    if (comment_id) {
      // 수정
      await request.put(
        `/community/post_comments/${comment_id}/update`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );
    } else {
      // 생성
      await request.post("/community/post_comments/create/", formData, {
        "Content-Type": "multipart/form-data",
      });
    }
    setContent("");
    setPhotos([]);
    reRenderScreen();
  };

  const onPhotoButtonPress = useCallback(
    (
      type: string,
      options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions
    ) => {
      const addToPhotos = (_photos: any[]) => {
        if (!_photos) return;
        if (photos.length + _photos.length > 1) {
          Alert.alert("사진은 최대 1개까지 첨부할 수 있습니다.");
          return;
        }
        setPhotos([...photos, ..._photos]);
      };
      if (type === "capture") {
        ImagePicker.launchCamera(options, (response) =>
          addToPhotos(response.assets as any[])
        );
      } else {
        ImagePicker.launchImageLibrary(options, (response) =>
          addToPhotos(response.assets as any[])
        );
      }
    },
    [photos]
  ); // photos 값 변경 시 새로운 callback 설정되도록

  useEffect(() => {
    async function _getData() {
      try {
        setLoading(true);
        if (comment_id && prevComment) {
          setContent(prevComment.content);
          if (prevComment.photoList) setPhotos(prevComment.photoList);
        }
        setLoading(false);
      } catch (err) {
        console.warn(err);
      }
    }
    _getData();
  }, []);

  return (
    <View style={styles.container}>
      {loading || boardFormat == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PostCommentInput
              placeholder="내용을 입력해주세요."
              multiline={false}
              onChangeText={(value) => setContent(value)}
              value={content}
            />
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={async () => await uploadPostComment()}
            >
              <View
                style={{
                  backgroundColor: "#D3D3D3",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 50,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600" }}>작성</Text>
              </View>
            </TouchableOpacity>
          </View>
          {boardFormat.supportsPostCommentPhotos ? (
            <>
              <PhotosInput>
                {actions.map(({ title, type, options }, index) => {
                  return (
                    <PhotoButton
                      key={index}
                      onPress={() => onPhotoButtonPress(type, options)}
                    >
                      <Text key={index} style={{ textAlign: "center" }}>
                        {title}
                      </Text>
                    </PhotoButton>
                  );
                })}
              </PhotosInput>
              <PhotoBox>
                {photos.map((data, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setPhotos(
                          photos.filter((_photo, _idx) => {
                            return _idx !== index;
                          })
                        );
                      }}
                    >
                      <Image
                        key={index}
                        source={{ uri: data.uri ? data.uri : data }}
                        style={{ width: 100, height: 100, margin: 5 }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </PhotoBox>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});

const PostCommentInput = styled.TextInput`
  width: 80%;
  height: 32px;
  marginright: 10px;
  padding: 5px;
  borderwidth: 1px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const PhotosInput = styled.View`
  display: flex;
  flex-flow: row wrap;
  border: 1px black solid;
`;
const PhotoButton = styled.TouchableOpacity`
  width: 50%;
  padding: 10px;
`;
const PhotoBox = styled.View`
  display: flex;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`;

export default PostCommentUploadSection;
