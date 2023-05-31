import React, { ReactElement, ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

export function CustomText({style, children, props}:{style?:TextStyle, children: ReactElement|ReactNode|JSX.Element, props?: TextProps}):JSX.Element {
  return (
    <Text style={{fontFamily:'Pretendard Variable', ...style}} {...props}>{children}</Text>
  )
}
