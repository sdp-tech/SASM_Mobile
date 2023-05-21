import axios from 'axios';
import { SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import Loading from '../../common/Loading';
import { Request } from '../../common/requests';
import DetailCard from './SpotDetail/DetailCard';
import { detailDataProps } from './Map';

export default function SpotDetail({ detailData }: { detailData: detailDataProps }): JSX.Element {

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <DetailCard detailData={detailData} />
    </SafeAreaView>
  )
}
