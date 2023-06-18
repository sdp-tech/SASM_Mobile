import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Image, Dimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";

import { CommunityStackParams } from "../../pages/Forest";

const PhotoPreviewScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<CommunityStackParams, "PhotoPreview">) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const photoUri = route.params.photoUri;

  useEffect(() => {
    const windowWidth = Dimensions.get("window").width;

    Image.getSize(photoUri, (width, height) => {
      setWidth(windowWidth);
      setHeight(height * (windowWidth / width));
    });
  }, [photoUri]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={{ width: width, height: height }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PhotoPreviewScreen;
