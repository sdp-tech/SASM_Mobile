import React from 'react';
import { TouchableOpacity } from 'react-native';
import FilledLike from "../assets/img/common/FilledLike.svg";
import UnFilledLike from "../assets/img/common/UnFilledLike.svg";
import WhiteLike from "../assets/img/common/WhiteLike.svg";

interface HeartProps {
  like: boolean;
  onPress: () => void;
  white?: boolean;
}

export default function Heart({ like, onPress, white }: HeartProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress}>
      {
        like ?
          white ? <FilledLike width={18} height={18} /> : <FilledLike width={25} height={25} /> 
          :
          white ? <WhiteLike width={18} height={18} /> : <UnFilledLike width={25} height={25} />
      }
    </TouchableOpacity>
  )
}
