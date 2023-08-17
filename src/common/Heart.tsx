import React from 'react';
import { TouchableOpacity } from 'react-native';
import FilledLike from "../assets/img/common/FilledLike.svg";
import UnFilledLike from "../assets/img/common/UnFilledLike.svg";

interface HeartProps {
  like: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function Heart({ like, onPress, size, color }: HeartProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} style={{display:'flex', alignItems:'center'}}>
      {
        like ?
          <FilledLike width={size? size : 25} height={size? size : 25} /> 
          :
          <UnFilledLike color={color ? color : "#686868"} width={size? size : 25} height={size? size : 25} />
      }
    </TouchableOpacity>
  )
}
