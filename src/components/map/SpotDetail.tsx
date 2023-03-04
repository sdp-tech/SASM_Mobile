import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import { Request } from '../../common/requests';

interface DetailProps {
  id: number
}



interface detailDataProps {
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
}

export default function SpotDetail({ id }: DetailProps): JSX.Element {
  const request = new Request();
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
  });
  const WindowHeight = Dimensions.get('window').height;
  const WindowWidth = Dimensions.get('window').width;
  const getItem = async () => {
    const response = await request.get('/places/place_detail/', { id: id });
    setDetailData(response.data.data);
  }
  useEffect(() => {
    if (id != 0) getItem();
  }, [id])
  return (
    <View style={{ width: WindowWidth, height: WindowHeight - 110, backgroundColor: '#FFFFFF' }}>
      <Text>
        {detailData.place_name} - {detailData.address}
      </Text>
    </View>
  )
}
