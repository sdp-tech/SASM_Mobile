import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState, useMemo, SetStateAction, Dispatch, useCallback } from 'react';
import { Text, TouchableOpacity, View, Button, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, Modal, } from "react-native";
import NaverMapView, { Align, Marker } from './NaverMap';
import styled from "styled-components/native";
import SearchBar from '../../common/SearchBar';
import Category from '../../common/Category';
import MapList from './SpotList';
import SpotDetail from './SpotDetail';
import { Request } from '../../common/requests';
import { Coord } from "react-native-nmap";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import PlaceForm from "./PlaceForm/PlaceForm";
import AddColor from "../../assets/img/common/AddColor.svg";
import { StackScreenProps } from "@react-navigation/stack";
import { TabProps } from "../../../App";
import { useFocusEffect } from "@react-navigation/native";

const ButtonWrapper = styled.View`
	width: 100%;
	display: flex;
	position: absolute;
	top: 5%;
	align-items: center;
`
const SearchHereButton = styled.TouchableOpacity`
	width: 190px;
	text-align: center;
	border-radius: 50px;
	background-color: #01A0FC;
	box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
`
const SearchHereText = styled.Text`
	padding: 5px;
	color: #FFFFFF;
	font-weight: 500;
	text-align: center;
`
const Circle = styled.TouchableOpacity<{ width: number }>`
	width: ${props => props.width}px;
	height: ${props => props.width}px;
	border-radius: ${props => props.width / 2}px;
	background-color: #209DF5;
`
const MoveToCenterButton = styled(Circle)`
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	right: -90%;
`
const PlusButton = styled.TouchableOpacity`
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`

// 최소 단위 interface
export interface DataTypes {
  id: number;
  place_name: string;
  category: string;
  open_hours: string;
  place_review: string;
  address: string;
  rep_pic: string;
  place_like: string;
}

// DataTypes에서 Marker를 위해 좌표 추가
export interface placeDataProps extends Coord, DataTypes {
  distance: number;
  extra_pic: string[];
}

// 사진 모음
interface url {
  image?: string;
}

// placeDataProps에서 추가 정보
export interface detailDataProps extends Coord, DataTypes {
  mon_hours: string;
  tues_hours: string;
  wed_hours: string;
  thurs_hours: string;
  fri_hours: string;
  sat_hours: string;
  sun_hours: string;
  etc_hours: string;
  short_cur: string;
  photos: url[];
  sns: object[];
  story_id: number;
  category_statistics: string[];
  pet_category: boolean;
  reusable_con_category: any;
  tumblur_category: any;
  vegan_category: string;
  phone_num: string;
}

interface MapProps {
  mapView: any;
  setSheetMode: Dispatch<SetStateAction<boolean>>;
  placeData: placeDataProps[];
  nowCoor: Coord;
  setDetailData: Dispatch<SetStateAction<detailDataProps>>;
  center: Coord;
  setCenter: Dispatch<SetStateAction<Coord>>;
}

const Map = ({ mapView, setSheetMode, placeData, nowCoor, setDetailData, center, setCenter }: MapProps) => {
  const request = new Request();
  //tempCoor => 지도가 움직이때마다 center의 좌표
  const [tempCoor, setTempCoor] = useState(nowCoor);
  //지도가 이동할때마다 지도의 중심 좌표를 임시로 저장
  const onChangeCenter = (event: any) => {
    setTempCoor({
      latitude: event.latitude,
      longitude: event.longitude,
    })
  }
  const getDetail = async (id: number) => {
    const response_detail = await request.get('/places/place_detail/', { id: id });
    setDetailData(response_detail.data.data);
    setCenter({
      latitude: response_detail.data.data.latitude,
      longitude: response_detail.data.data.longitude,
    })
    setSheetMode(false);
  }

  return (
    <>
      <NaverMapView
        ref={mapView}
        style={{ width: '100%', height: '100%', position: 'relative' }}
        showsMyLocationButton={false}
        center={{ ...center, zoom: 13 }}
        onCameraChange={e => onChangeCenter(e)}
        scaleBar={false}
        zoomControl={false}
        zoomGesturesEnabled={true}
      >
        {
          placeData.map((data: placeDataProps, index: number) => {
            const coor: Coord = { latitude: data.latitude, longitude: data.longitude }
            return (
              <Marker
                key={index}
                coordinate={coor}
                image={require(`../../assets/img/marker.png`)}
                onClick={() => { getDetail(data.id) }}
                width={20} height={30}
                caption={{
                  text: `${data.place_name}`, align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"
                }} />
            )
          })}
      </NaverMapView>
    </>
  )
};

interface MapContainerProps extends StackScreenProps<TabProps, '맵'> {
  nowCoor: Coord;
}

export default function MapContainer({ nowCoor, navigation, route }: MapContainerProps): JSX.Element {
  //지도의 Ref
  const mapView = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  //const [likePlaceData, setLikePlaceData] = useState<placeDataProps[]>([]);
  //Marker와 List에 보일 data 및 개수
  const [placeData, setPlaceData] = useState<placeDataProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [detailData, setDetailData] = useState<detailDataProps>({
    id: 0,
    place_name: '',
    category: '',
    open_hours: '',
    mon_hours: '',
    tues_hours: '',
    wed_hours: '',
    thurs_hours: '',
    fri_hours: '',
    sat_hours: '',
    sun_hours: '',
    etc_hours: '',
    place_review: '',
    address: '',
    rep_pic: '',
    short_cur: '',
    latitude: 0,
    longitude: 0,
    photos: [{}],
    sns: [{}],
    story_id: 0,
    place_like: '',
    category_statistics: [],
    vegan_category: '',
    tumblur_category: null,
    reusable_con_category: null,
    pet_category: false,
    phone_num: '',
  });

  //장소 작성 모달
  const [placeformModal, setPlaceformModal] = useState<boolean>(false);
  //지도의 중심 좌표
  const [center, setCenter] = useState<Coord>(nowCoor);
  //checkedList => 카테고리 체크 복수 체크 가능
  const [checkedList, setCheckedList] = useState<string[]>([]);
  //search => 검색어
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1);
  //searchHere => 특정 좌표에서 검색할때 tempCoor의 좌표를 기반으로 검색
  const [searchHere, setSearchHere] = useState<Coord>({ ...nowCoor });
  const request = new Request();
  //좌표, 검색어, 필터를 기반으로 장소들의 데이터 검색
  const getPlaces = async () => {
    setLoading(true);
    const response = await request.get('/places/place_search/', {
      left: searchHere.latitude,
      right: searchHere.longitude,
      search: search,
      filter: checkedList,
      page: page,
    });
    setPlaceData(response.data.data.results);
    setTotal(response.data.data.count);
    setLoading(false);
  }
  //searchHere, page가 변할 시 데이터 재검색
  useEffect(() => {
    getPlaces();
  }, [searchHere, page, search, checkedList]);

  // myPlaces는 page가 존재한다 흐음 20개씩 나타낼순 없을가
  // const getLikePlaces = async () => {
  // 	setLoading(true);
  // 	const response_like_places = await request.get('/users/like_place/', {page:1, checkedList:''});
  // 	console.error(response_like_places.data.data);
  // 	setLoading(false);
  // }
  // useEffect(()=>{
  // 	getLikePlaces();
  // }, [])

  useFocusEffect(useCallback(() => {
    if (route.params.coor) {
      mapView?.current.animateToCoordinate(route.params.coor)
    }
    else {
      mapView?.current.animateToCoordinate(nowCoor);
    }
  }, [route.params]))

  /////////////////////////////////////////////////////// BottomSheet
  //BottomSheet에서 list(true)를 보일지 detail(false)을 보일지
  const [sheetMode, setSheetMode] = useState<boolean>(true);
  //modal의 ref
  const modalRef = useRef(null);
  //BottomSheet 중단점
  const snapPoints = useMemo(() => [20, 500], []);
  //BottomSheet를 움직일 때마다 버튼들 같이 움직이기
  const buttonAnimatedPosition = useSharedValue(45);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      bottom: withTiming(buttonAnimatedPosition.value, { duration: 350 }),
    };
  })

  //현재 위치로 돌아가기 버튼
  const handleToCenter = (): void => {
    mapView?.current.animateToCoordinate(nowCoor);
  }

  return (
    <View>
      <Map
        mapView={mapView}
        placeData={placeData}
        nowCoor={nowCoor}
        setDetailData={setDetailData}
        center={center}
        setSheetMode={setSheetMode}
        setCenter={setCenter}
      />
      <BottomSheet
        ref={modalRef}
        snapPoints={snapPoints}
        index={1}
        onAnimate={(fromIndex, toIndex) => {
          if (fromIndex == 1 && toIndex == 0) {
            if (!sheetMode) setSheetMode(true);
            else buttonAnimatedPosition.value = 45;
          }
          else {
            buttonAnimatedPosition.value = 520;
          }
        }}
      >
        {
          loading ?
            <ActivityIndicator /> :
            <>
              {
                sheetMode ?
                  <MapList
                    page={page}
                    setPage={setPage}
                    total={total}
                    placeData={placeData}
                    setDetailData={setDetailData}
                    setSheetMode={setSheetMode}
                    setCenter={setCenter} />
                  :
                  <SpotDetail
                    detailData={detailData} />
              }</>
        }
      </BottomSheet>
      <Animated.View style={buttonAnimatedStyle}>
        <SearchBar
          search={search}
          setSearch={setSearch}
          style={{ backgroundColor: "#FFFFFF", width: '95%' }}
          placeholder="장소를 검색해주세요"
          setPage={setPage}
        />
        <Category checkedList={checkedList} setCheckedList={setCheckedList} />
        <MoveToCenterButton width={30}
          onPress={handleToCenter}>
          <Circle width={15}
            onPress={handleToCenter} />
        </MoveToCenterButton>
      </Animated.View>
      <PlusButton onPress={() => { setPlaceformModal(true) }}>
        <AddColor color={'#FFFFFF'} />
      </PlusButton>
      {/* <SearchHereButton onPress={() => { setSearchHere(tempCoor); setPage(1); }}>
					<SearchHereText>
						지금 지도에서 검색
					</SearchHereText>
				</SearchHereButton> */}
      <Modal visible={placeformModal}>
        <PlaceForm setPlaceformModal={setPlaceformModal} />
      </Modal>
    </View>
  )
}