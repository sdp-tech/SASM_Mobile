import React, { ReactElement, ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  style?: TextStyle
}

export function TextPretendard({children, style, ...rest}:CustomTextProps):JSX.Element {
  return (
    <Text style={{fontFamily:'Pretendard Variable', ...style}} {...rest}>{children}</Text>
  )
}
