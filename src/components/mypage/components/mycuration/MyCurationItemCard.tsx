import { useState, useEffect, useCallback } from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParams } from '../../../../pages/Home';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Heart from '../../../../common/Heart';
import { Request } from '../../../../common/requests';

export interface MyCurationItemCardProps {
  id: number;
  rep_pic: string;
  writer_nickname: string;
  title: string;
}

const MyCurationItemCard = ({ props, edit, rerender }: { props: MyCurationItemCardProps, edit: boolean, rerender: ()=>void }) => {
  const request = new Request();
  const { width, height } = Dimensions.get("window");
  const navigationHome = useNavigation<StackNavigationProp<HomeStackParams>>();
  const [like, setLike] = useState<boolean>(true);

  const handleLike = async () => {
    const response = await request.post(`/curations/curation_like/${props.id}/`);
    setLike(!like);
    rerender();
  }

  return (
    <View style={{ position: 'relative' }} >
      <TouchableWithoutFeedback onPress={() => { navigationHome.navigate('Detail', { id: props.id }) }}>
        <ImageBackground source={{ uri: props.rep_pic }} style={{ width: width / 2, height: 240 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: width / 2, height: 240, padding: 10, justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: "row" }}>
              {/* <Text style={[textStyles.writer, { color: props.verified ? '#209DF5' : '#89C77F' }]}>{props.verified ? ('Editor') : ('User')}</Text> */}
              <Text style={textStyles.writer}>{props.writer_nickname}</Text>
            </View>
            <Text style={textStyles.title}>{props.title}</Text>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <Heart
            like={like}
            onPress={handleLike}
            white={true}
            size={20}
          />
        </View>
      }
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
    lineHeight: 22,
  },
  writer: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
    lineHeight: 18
  }
})

export default MyCurationItemCard;