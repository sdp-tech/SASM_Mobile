import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import Loading from '../../common/Loading';
import { Request } from '../../common/requests';
import { MapScreenProps } from '../../pages/SpotMap';
import DetailCard from './SpotDetail/DetailCard';

interface DetailProps extends MapScreenProps {
  id: number;
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

export default function SpotDetail({ id, navigation, route }: DetailProps): JSX.Element {
  const request = new Request();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailData, setDetailData] = useState<detailDataProps>({
    id: 0,
    place_name: '',
    category: '',
    open_hours: '',
    mon_hours: '',
    tues_hours: '',
    wed_hours: '',
    thurs_hours: '',
    fri_hours: '',
    sat_hours: '',
    sun_hours: '',
    place_review: '',
    address: '',
    rep_pic: '',
    short_cur: '',
    latitude: 0,
    longitude: 0,
    photos: [{}],
    sns: [{}],
    story_id: 0,
    place_like: '',
    category_statistics: [],
  });
  const WindowHeight = Dimensions.get('window').height;
  const WindowWidth = Dimensions.get('window').width;
  const getDetail = async () => {
    const response_detail = await request.get('/places/place_detail/', { id: id });
    setDetailData(response_detail.data.data);
    setLoading(false);
  }
  useEffect(() => {
    if (id != 0) getDetail();
  }, [id])
  return (
    <View style={{ width: WindowWidth, height: WindowHeight - 100, backgroundColor: '#FFFFFF' }}>
      {loading ? <Loading /> :
        <DetailCard detailData={detailData} navigation={navigation} route={route}/>}
    </View>
  )
}
