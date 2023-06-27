import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import Check from '../assets/img/common/Check.svg';

interface FinishModal {
  setModal: Dispatch<SetStateAction<boolean>>;
  navigation?: () => void;
  title: string;
  subtitle: string[];
  color?: string;
  timeout?: ()=>void;
}

export default function FinishModal({ setModal, navigation, title, subtitle, color, timeout }: FinishModal): JSX.Element {

  useEffect(() => {
    setTimeout(() => {
      if(timeout) timeout();
      setModal(false);
      if(navigation) navigation();
    }, 3000)
  }, [])

  return (
    <SafeAreaView style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Check color={color ? color : "#75E59B"} />
      <Text style={TextStyles.finish_title}>{title}</Text>
      {
        subtitle.map(data => <Text style={TextStyles.finish_subtitle}>{data}</Text>)
      }
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  finish_title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    marginVertical: 21,
  },
  finish_subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#777777',
    fontWeight: '300'
  }
})