import React, { Dispatch, SetStateAction, useEffect, useState, useMemo, useRef, useCallback } from "react";
import styled from "styled-components/native";
import { Request } from "../../../common/requests";
import { StoryListProps } from "../../story/StoryMainPage";
import { Dimensions, TouchableOpacity, View, FlatList, StyleSheet, SafeAreaView, Image, ActivityIndicator, Platform } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import { BottomSheetModalProvider, BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Arrow from "../../../assets/img/common/Arrow.svg";
import StoryDetailModal from "./StoryDetailModal";
import DropDown from "../../../common/DropDown";
import FormHeader from "../../../common/FormHeader";

const { width, height } = Dimensions.get('window');

const ItemCard = styled.TouchableOpacity<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 15px;
  background-color: ${props => props.selected ? `rgba(181, 181, 181, 0.2)` : '#FFFFFF'};
  border-color:rgba(112, 112, 112, 0.15);
  border-bottom-width: 1px;
`
const TextBox = styled.View`
  display: flex;
  height: 100px;
  width: ${width - 145}px;
  justify-content: space-around;
`

interface StoryListModalProps {
  target: any;
  setStoryListModal: Dispatch<SetStateAction<boolean>>;
  selectedStory: any[];
  setSelectedStory: Dispatch<SetStateAction<any[]>>;
  setSelectedPlace: Dispatch<SetStateAction<string[]>>;
  selectedPlace: string[]
}

export default function StoryListModal({ target, setStoryListModal, selectedStory, setSelectedStory, selectedPlace, setSelectedPlace}: StoryListModalProps): JSX.Element {
  const request = new Request();
  const [storyId, setStoryId] = useState<number>(0);
  const [storyList, setStoryList] = useState<StoryListProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropValue, setDropValue] = useState<number>(1);

  const getStoryList = async (set: boolean) => {
    setLoading(true);
    const response_story_list = await request.get('/stories/story_search/', {
      search: target.place_name,
      latest: dropValue == 1 ? true : false
    })
    if (set) {
      //page가 바뀔 경우, data 추가
      setStoryList([...storyList, ...response_story_list.data.data.results]);
    }
    else {
      //dropValue가 바뀔 경우, data 설정
      setStoryList(response_story_list.data.data.results);
    }
    setTotal(response_story_list.data.data.count);
    setLoading(false);
  }

  useEffect(() => {
    getStoryList(true);
  }, [page])

  useEffect(() => {
    getStoryList(false);
  }, [dropValue])

  const handleSelectedStory = (id: number, rep_pic: string, place_name:string) => {
    if (selectedStory.filter(el => el.id == id).length > 0) {
      setSelectedStory(selectedStory.filter(el => el.id != id));
      setSelectedPlace(selectedPlace.filter(el => el != place_name))
    }
    else {
      setSelectedStory([...selectedStory, { id: id, rep_pic: rep_pic, place_name: place_name }]);
      setSelectedPlace([...selectedPlace, place_name]);
    }
  }

  //dropValue
  const toggleItems = [
    { label: '최신순', value: 1 },
    { label: '오래된순', value: 2 },
  ]
  //BottomSheet 중단점
  const snapPoints = useMemo(() => [500], []);
  const storyRef = useRef<BottomSheetModal>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <FormHeader onLeft={() => setStoryListModal(false)} title="장소 검색" onRight={null} />
        <View style={{ paddingHorizontal: 15, marginTop: 10, zIndex: 2 }}>
          <Text style={{ ...ListTextStyles.title, fontSize: 20, lineHeight: 26 }}>{target.place_name}</Text>
          <Text style={{ ...ListTextStyles.address, fontSize: 12, marginVertical: 5 }}>{target.address}</Text>
          <View style={{ width: 100, marginVertical: 10, alignSelf: 'flex-end' }}>
            <DropDown value={dropValue} setValue={setDropValue} isBorder={false} items={toggleItems} />
          </View>
        </View>
        <FlatList
          data={storyList}
          renderItem={({ item }) =>
            <ItemCard selected={selectedStory.filter(el => el.id == item.id).length > 0} onPress={() => { handleSelectedStory(item.id, item.rep_pic, item.place_name) }}>
              <Image source={{ uri: item.rep_pic }} style={{ height: 100, width: 100, marginRight: 15, borderRadius: 3 }} />
              <TextBox>
                <Text style={ListTextStyles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={ListTextStyles.place_name} numberOfLines={1}>{item.place_name}</Text>
                {/* <Text style={ListTextStyles.detail}>{item.semi_category}</Text> */}
                <Text style={ListTextStyles.detail} numberOfLines={3} ellipsizeMode='tail'>{item.preview}</Text>
                <TouchableOpacity style={{marginTop: 3}} onPress={() => {
                  storyRef.current?.present();
                  setStoryId(item.id);
                }}><Text style={ListTextStyles.detail}>더보기</Text></TouchableOpacity>
              </TextBox>
            </ItemCard>
          }
          onEndReached={() => {
            if (page < Math.ceil(total / 20)) {
              setPage(page + 1)
            }
          }}
          ListHeaderComponent={<>{storyList.length == 0 && <Text style={{ ...ListTextStyles.place_name, margin: 15 }}>스토리가 존재하지 않습니다.</Text>}</>}
          ListFooterComponent={<>{loading && <ActivityIndicator style={{flex:1}} />}</>}
        />
        <BottomSheetModalProvider>
          <BottomSheetModal
            snapPoints={snapPoints}
            ref={storyRef}
            backdropComponent={props =>
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.6} enableTouchThrough={true} />}
          >
            <StoryDetailModal id={storyId} />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
  )
}

const ListTextStyles = StyleSheet.create({
  place_name: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22
  },
  address: {
    color: '#7B7B7B',
    fontSize: 12
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20
  },
  detail: {
    fontSize: 12,
  },
})