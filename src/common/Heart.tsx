import React from 'react';
import { TouchableOpacity } from 'react-native';
import FilledLike from "../assets/img/common/FilledLike.svg";
import UnFilledLike from "../assets/img/common/UnFilledLike.svg";
import WhiteLike from "../assets/img/common/WhiteLike.svg";

interface HeartProps {
  like: boolean;
  onPress: () => void;
  white?: boolean;
  size?: number;
  color?: string;
}

export default function Heart({ like, onPress, white, size, color }: HeartProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} style={{display:'flex', alignItems:'center'}}>
      {
        like ?
          white ? <FilledLike width={size? size : 18} height={size? size : 18} /> : <FilledLike width={size? size : 25} height={size? size : 25} /> 
          :
          white ? <WhiteLike width={size? size : 18} height={size? size : 18} /> : <UnFilledLike color={color ? color : "#686868"} width={size? size : 25} height={size? size : 25} />
      }
    </TouchableOpacity>
  )
}
