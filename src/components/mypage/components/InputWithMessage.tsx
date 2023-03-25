import React, { Dispatch, SetStateAction } from 'react'
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';

const InputWrapper = styled.View`
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  padding: 0 5%;
`

const StyledInput = styled.TextInput`
  width: 70%;
  height: 30px;
  border-color: #000000;
  border-width: 1px;
  margin: 0;
`
const SubmitButton = styled.TouchableOpacity`
  width: 20%;
  border-color: #000000;
  border-width: 1px;
  background-color: #44ADF7;
  display: flex;
  justify-content: center;
`
interface InputProps extends TextInputProps {
  label: string;
  message?: string;
  buttonView?: boolean;
  onPress?: () => void | Promise<void>;
}

export default function InputWithMessage({ label, message, buttonView, onPress, ...rest }: InputProps): JSX.Element {
  return (
    <InputWrapper>
      <Text style={TextStyles.label}>{label}</Text>
      <StyledInput {...rest} />
      {
        onPress && buttonView &&
        <SubmitButton onPress={onPress}>
          <Text style={TextStyles.submit}>중복확인</Text>
        </SubmitButton>
      }
      <Text style={TextStyles.message}>{message}</Text>
    </InputWrapper>
  )
}

const TextStyles = StyleSheet.create({
  label: {
    width: '100%',
    fontSize: 16,
    marginBottom: 5,
  },
  submit: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center'
  },
  message: {
    fontSize: 12,
    width: '100%',
    marginTop: 5,
    color: 'red',
  }
})