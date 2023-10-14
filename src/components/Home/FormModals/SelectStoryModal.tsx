import React, { SetStateAction, Dispatch, useEffect, useState, useRef, useMemo, RefObject } from "react";
import styled from "styled-components/native";
import { Request } from "../../../common/requests";
import { Dimensions, FlatList, TouchableOpacity, View, SafeAreaView, Image, Modal, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import { placeDataProps } from "../../map/Map";
import SearchBar from "../../../common/SearchBar";
import Arrow from "../../../assets/img/common/Arrow.svg";
import StoryListModal from "./StoryListModal";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CATEGORY_LIST } from "../../../common/Category";
import Filter from "../../../assets/img/common/Filter.svg";
import FormHeader from "../../../common/FormHeader";
import FastImage from "react-native-fast-image";

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
  height: 50px;
  width: ${width - 95}px;
  justify-content: space-around;
`
const FilterButton = styled.TouchableOpacity`
  width: 60px;
  border: 1px black solid;
  padding: 5px;
  border-radius: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
interface selectStoryModalProps {
  setSelectStoryModal: Dispatch<SetStateAction<boolean>>;
  selectedStory: any[];
  setSelectedStory: Dispatch<SetStateAction<any[]>>;
}

export default function SelectStoryModal({ setSelectStoryModal, selectedStory, setSelectedStory }: selectStoryModalProps): JSX.Element {
  const request = new Request();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [placeList, setPlaceList] = useState<placeDataProps[]>([]);
  const [storyListModal, setStoryListModal] = useState<boolean>(false);
  const [target, setTarget] = useState<any>();
  const [selectedPlace, setSelectedPlace] = useState<string[]>([]);
  const listRef = useRef<FlatList>(null);
  const getPlaceList = async () => {
    setLoading(true);
    const response_place_list = await request.get('/places/place_search/', {
      left: 37.5,
      right: 127.5,
      search: search,
      filter: checkedList,
      page: page,
    });
    if (page == 1) {
      setPlaceList(response_place_list.data.data.results);
    }
    else {
      setPlaceList([...placeList, ...response_place_list.data.data.results]);
    }
    setTotal(response_place_list.data.data.count);
    setLoading(false);
  }

  useEffect(() => {
    getPlaceList();
  }, [page, search, checkedList])
  //BottomSheet
  const filterRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [500], []);

  const closeModal = () => {
    filterRef.current?.close();
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <FormHeader onLeft={() => setSelectStoryModal(false)} title="장소 검색" begin onRight={null} />
        <View style={{ paddingHorizontal: 15, marginVertical: 10 }}>
          <SearchBar style={{ width: '100%', backgroundColor: '#F1F1F1' }} placeholder="장소 검색" search={search} setSearch={setSearch} setPage={setPage} />
          <FilterButton onPress={() => { filterRef.current?.present() }}>
            <Text>필터</Text>
            <Filter />
          </FilterButton>
        </View>
        <FlatList
          data={placeList}
          renderItem={({ item }) =>
            <ItemCard selected={selectedPlace.includes(item.place_name)} onPress={() => { setStoryListModal(true); setTarget({ place_name: item.place_name, address: item.address }); }}>
              <FastImage source={{ uri: item.rep_pic, priority: FastImage.priority.normal }} style={{ height: 50, width: 50, marginRight: 15, borderRadius: 3 }} />
              <TextBox>
                <Text style={TextStyles.place_name}>{item.place_name}</Text>
                <Text style={TextStyles.address}>{item.address}</Text>
              </TextBox>
            </ItemCard>
          }
          onEndReached={() => {
            if (page < Math.ceil(total / 20)) {
              setPage(page + 1)
            }
          }}
          ListFooterComponent={<>{loading && <ActivityIndicator style={{flex:1}}/>}</>}
        />
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={filterRef}
            snapPoints={snapPoints}
            backdropComponent={props =>
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.6} enableTouchThrough={true} />}
          >
            <FilterScreen close={closeModal} checkedList={checkedList} setCheckedList={setCheckedList} setPage={setPage} />
          </BottomSheetModal>
        </BottomSheetModalProvider>
        <Modal visible={storyListModal}>
          <StoryListModal setSelectedPlace={setSelectedPlace} selectedPlace={selectedPlace} target={target} setStoryListModal={setStoryListModal} selectedStory={selectedStory} setSelectedStory={setSelectedStory} />
        </Modal>
    </GestureHandlerRootView>
  )
}

const FilterSection = styled.View`
  padding: 20px;
`
const SubSection = styled.View`
  border-color: #BDBDBD;
  border-top-width: 1px;
  border-bottom-width: 1px;
  padding: 15px;
`
const CenterSection = styled.View`
  display: flex;
  flex-flow: row wrap;
  width: 80%;
  margin: 10px auto;
  justify-content: center;
`
const Selector = styled.TouchableOpacity<{ isSelected: boolean }>`
  border-radius: 30px;
  border: 1px #000000 solid;
  background-color: ${props => props.isSelected ? '#000000' : '#FFFFFF'}
  display: flex;
  padding: 5px 10px;
  margin: 10px;
`
const Button = styled(Selector)`
  align-items: center;
  width: 100px;
`
const SelectorText = styled.Text<{ isSelected: boolean }>`
  font-size: 12px;
  color: ${props => props.isSelected ? '#FFFFFF' : '#000000'}
`

interface FilterProps {
  close: () => void;
  checkedList: string[];
  setCheckedList: Dispatch<SetStateAction<string[]>>;
  setPage: Dispatch<SetStateAction<number>>;
}

const FilterScreen = ({ close, checkedList, setCheckedList, setPage }: FilterProps): JSX.Element => {
  const handleCheckedList = (data: string): void => {
    if (checkedList.includes(data)) {
      setCheckedList(checkedList.filter(element => element != data));
    }
    else {
      setCheckedList([...checkedList, data]);
    }
    setPage(1);
  }
  return (
    <FilterSection>
      <Text style={{ ...TextStyles.place_name, marginBottom: 20 }}>필터</Text>
      <SubSection>
        <Text>카테고리</Text>
        <CenterSection>
          {
            CATEGORY_LIST.map(data =>
              <Selector
                isSelected={checkedList.includes(data.data)}
                onPress={() => { handleCheckedList(data.data) }}>
                <SelectorText isSelected={checkedList.includes(data.data)}>{data.name}</SelectorText>
              </Selector>)
          }
        </CenterSection>
      </SubSection>
      <CenterSection>
        <Button onPress={() => { setCheckedList([]) }} isSelected={false}><SelectorText style={{ fontSize: 14, fontWeight: '600' }} isSelected={false}>초기화</SelectorText></Button>
        <Button onPress={close} isSelected={true}><SelectorText style={{ fontSize: 14, fontWeight: '600' }} isSelected={true}>완료</SelectorText></Button>
      </CenterSection>
    </FilterSection>
  )
}

const TextStyles = StyleSheet.create({
  place_name: {
    fontSize: 18,
    fontWeight: '600',
  },
  address: {
    color: '#7B7B7B',
    fontSize: 12
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  detail: {
    fontSize: 10,
  },
})