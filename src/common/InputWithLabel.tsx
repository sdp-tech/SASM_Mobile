import React from 'react';
import { View, TextInputProps, ViewStyle, Text } from 'react-native';
import styled from 'styled-components/native';

const Input = styled.TextInput<{ isAlert: boolean | undefined }>`
    width: 85%;
    border-bottom-width: 1px;
    border-color: ${props => props.isAlert ? '#FF4D00' : '#C0C0C0'};
    font-size: 16px;
    padding-vertical: 10px;
`;

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  //필수 입력 사항 * 추가
  isRequired?: boolean;
  //잘못 입력되거나 잘못된 양식일 경우 보여주는 빨간 텍스트
  alertLabel?: string;
  isAlert?: boolean;
}


export default function InputWithLabel({ isAlert, alertLabel, isRequired, containerStyle, label, onChangeText, placeholder, value, ...rest }: InputProps): JSX.Element {
  return (
    <View style={{ ...containerStyle, height: 80, display: 'flex', alignItems: 'center' }}>
      <Text style={{ width: '85%', textAlign: 'left', fontSize: 12, lineHeight: 18, letterSpacing: -0.6 }}>
        {label}
        <Text style={{ color: '#FF4D00', lineHeight: 18 }}>{isRequired && '*'}</Text>
      </Text>
      <Input
        placeholderTextColor={'#848484'}
        isAlert={isAlert}
        value={value}
        placeholder={placeholder}
        autoCapitalize={'none'}
        spellCheck={false}
        onChangeText={onChangeText} {...rest} />
      <Text style={{ width: '85%', fontSize: 10, lineHeight: 18, color: '#FF4D00' }}>{isAlert && alertLabel}</Text>
    </View>
  )
}