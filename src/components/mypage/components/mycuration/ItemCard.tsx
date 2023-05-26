import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { MyPageParams } from '../../../../pages/MyPage';

interface ItemCardProps extends MyPageParams {
  props: any;
}

const ItemCard = ({ props, navigation }:ItemCardProps) => {
  const { width, height } = Dimensions.get("window");
  return (
    <TouchableOpacity>
      <ImageBackground source={{uri: props.rep_pic}} style={{width: width/2, height: 240}}>
        <View style={{backgroundColor: 'rgba(0,0,0,0.3)', width: width/2, height: 240, padding: 10}}>
          <View style={{flexDirection: "row", marginTop: 150}}>
            <Text style={[textStyles.writer, {color: props.verified ? '#209DF5' : '#89C77F'}]}>{props.verified ? ('Editor') : ('User')}</Text>
            <Text style={textStyles.writer}> {props.writer_nickname}</Text>
          </View>
          <Text style={textStyles.title}>{props.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
    lineHeight: 22,
  },
  writer: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
    lineHeight: 18
  }
})

export default ItemCard;