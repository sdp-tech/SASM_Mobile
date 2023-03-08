import React from 'react';
import { TouchableOpacity } from 'react-native';
import FilledLike from "../assets/img/common/FilledLike.svg";
import UnFilledLike from "../assets/img/common/UnFilledLike.svg";

interface HeartProps {
  like: boolean;
  onPress: () => void;
}

export default function Heart({ like, onPress }: HeartProps): JSX.Element {
  return (
    <TouchableOpacity onPress={onPress}>
      {
        like ?
          <FilledLike width={25} height={25} />
          :
          <UnFilledLike width={25} height={25} />
      }
    </TouchableOpacity>
  )
}
