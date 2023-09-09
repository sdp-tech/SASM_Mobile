import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity } from "react-native";
import Close from '../assets/img/common/Close.svg'

const PhotoPreviewScreen = ({
  navigation,
  route,
}: {navigation: any, route: any}) => {
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', top: 50, right: 10}}>
        <Close color={'black'}/>
      </TouchableOpacity>
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
