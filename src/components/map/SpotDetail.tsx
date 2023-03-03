import React, { useEffect } from 'react'
import { Dimensions, View, Text } from 'react-native'

interface DetailProps {
  id:number
}

export default function SpotDetail({id}:DetailProps):JSX.Element {
  const WindowHeight = Dimensions.get('window').height;
  const WindowWidth = Dimensions.get('window').width;
  useEffect(()=>{
    console.log(id);
  }, [id])
  return (
    <View style={{width:WindowWidth ,height:WindowHeight-110, backgroundColor:'#FFFFFF'}}>
      <Text>
        {id}
      </Text>
    </View>
  )
}
