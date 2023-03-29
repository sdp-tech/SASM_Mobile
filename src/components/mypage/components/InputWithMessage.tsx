import React, { Dispatch, SetStateAction } from 'react'
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';

const InputWrapper = styled.View`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  padding: 0 5%;
  `

const StyledInput = styled.TextInput`
  height: 35px;
  margin: 12px auto;
  padding: 5px;
  borderWidth: 1px;
  background: #FFFFFF;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`
const SubmitButton = styled.TouchableOpacity`
  width: 30%;
  height: 35px;
  margin: 12px auto;
  border-color: #000000;
  border-width: 1px;
  padding: 5px;
  background-color: #44ADF7;
  display: flex;
  justify-content: center;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`
interface InputProps extends TextInputProps {
  label: string;
  message?: string;
  buttonText?: string;
  buttonView?: boolean;
  onPress?: () => void | Promise<void>;
}

export default function InputWithMessage({ buttonText, label, message, buttonView, onPress, ...rest }: InputProps): JSX.Element {
  return (
    <InputWrapper>
      <Text style={TextStyles.label}>{label}</Text>
      <StyledInput
        {...rest}
        autoCapitalize="none"
        spellCheck={false}
      />
      {
        onPress && buttonView &&
        <SubmitButton onPress={onPress}>
          <Text style={TextStyles.submit}>{buttonText}</Text>
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