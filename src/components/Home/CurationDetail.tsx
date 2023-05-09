import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { HomeStackParams } from '../../pages/Home'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Request } from '../../common/requests'

export default function CurationDetail({ navigation, route }: StackScreenProps<HomeStackParams, 'Detail'>): JSX.Element {
  const request = new Request();
  const [storyDetail, setStoryDetail] = useState();
  const getCurationDetail = async () => {
    const response_detail = await request.get(`/curations/curation_detail/${route.params.id}/`);
    console.error(response_detail.data.data);
  }
  const getCurationStoryDetail =async () => {
    const reponse_story_detail = await request.get(`/curations/curated_story_detail/${route.params.id}/`);
    console.error(reponse_story_detail.data.data);
  }

  useEffect(()=>{
    //console.error(route.params.id);
    getCurationDetail();
    getCurationStoryDetail();
  }, [])

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={navigation.goBack}><Text>&lt;</Text></TouchableOpacity>
      <View>
        <Text>{route.params.id}</Text>
      </View>
    </SafeAreaView>
  )
}
