import React, { ReactElement, ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import styled from 'styled-components/native';

const StyledText = styled.Text`
  font-family: Pretendard Variable;
`

interface CustomTextProps extends TextProps {
  style?: any;
}

export function TextPretendard({children, style, ...rest}:CustomTextProps):JSX.Element {
  return (
    <StyledText style={style} {...rest}>{children}</StyledText>
  )
}
