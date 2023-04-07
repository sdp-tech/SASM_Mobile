import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { HomeStackParams } from '../../pages/Home'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

export default function CurationDetail({ navigation, route }: StackScreenProps<HomeStackParams, 'Detail'>): JSX.Element {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={navigation.goBack}><Text>&lt;</Text></TouchableOpacity>
      <View>
        <Text>{route.params.id}</Text>
      </View>
    </SafeAreaView>
  )
}
