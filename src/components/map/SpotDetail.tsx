import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import Loading from '../../common/Loading';
import { Request } from '../../common/requests';
import { MapScreenProps } from '../../pages/SpotMap';
import DetailCard from './SpotDetail/DetailCard';

interface DetailProps extends MapScreenProps {
  detailData: detailDataProps;
  id: number;
  rerenderScreen: ()=>void;
}

interface url {
  image?: string;
}

export interface detailDataProps {
  id: number;
  place_name: string;
  category: string;
  open_hours: string;
  mon_hours: string;
  tues_hours: string;
  wed_hours: string;
  thurs_hours: string;
  fri_hours: string;
  sat_hours: string;
  sun_hours: string;
  place_review: string;
  address: string;
  rep_pic: string;
  short_cur: string;
  latitude: number;
  longitude: number;
  photos: url[];
  sns: object[];
  story_id: number;
  place_like: string;
  category_statistics: string[];
}

export default function SpotDetail({ id, navigation, route, detailData, rerenderScreen }: DetailProps): JSX.Element {
  const WindowHeight = Dimensions.get('window').height;
  const WindowWidth = Dimensions.get('window').width;

  return (
    <View style={{ width: WindowWidth, height: WindowHeight - 100, backgroundColor: '#FFFFFF' }}>
      <DetailCard detailData={detailData} navigation={navigation} route={route} rerenderScreen={rerenderScreen}/>
    </View>
  )
}
