import React, { ReactElement, ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
}

export function TextPretendard({children, ...rest}:CustomTextProps):JSX.Element {
  return (
    <Text style={{fontFamily:'Pretendard Variable'}} {...rest}>{children}</Text>
  )
}
