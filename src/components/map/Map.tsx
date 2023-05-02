import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState, useMemo, SetStateAction, Dispatch } from 'react';
import { Text, TouchableOpacity, View, Button, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NaverMapView, { Align, Marker } from './NaverMap';
import styled from "styled-components/native";
import SearchBar from '../../common/SearchBar';
import Category from '../../common/Category';
import MapList from './SpotList';
import SpotDetail from './SpotDetail';
import { Request } from '../../common/requests';
import { MapScreenProps } from "../../pages/SpotMap";
import { Coord } from "react-native-nmap";

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
export interface placeDataProps extends Coord, DataTypes{}

// 사진 모음
interface url {
	image?: string;
}

// placeDataProps에서 추가 정보
export interface detailDataProps extends placeDataProps {
	mon_hours: string;
	tues_hours: string;
	wed_hours: string;
	thurs_hours: string;
	fri_hours: string;
	sat_hours: string;
	sun_hours: string;
	short_cur: string;
	photos: url[];
	sns: object[];
	story_id: number;
	category_statistics: string[];
}

interface MapProps {
	setSheetMode: Dispatch<SetStateAction<boolean>>;
	placeData: placeDataProps[];
	setSearchHere: Dispatch<SetStateAction<Coord>>;
	setSearch: Dispatch<SetStateAction<string>>;
	setPage: Dispatch<SetStateAction<number>>;
	checkedList: string[];
	setCheckedList: Dispatch<SetStateAction<string[]>>;
	nowCoor: Coord;
	search: string;
	setDetailData: Dispatch<SetStateAction<detailDataProps>>;
	center: Coord;
	setCenter: Dispatch<SetStateAction<Coord>>;
	target: number | undefined;
}

const Map = ({ setSheetMode, placeData, setSearchHere, setSearch, setPage, checkedList, setCheckedList, nowCoor, search, setDetailData, center, setCenter, target }: MapProps) => {
	const request = new Request();
	//tempCoor => 지도가 움직이때마다 center의 좌표
	const [tempCoor, setTempCoor] = useState(nowCoor);
	const mapView = useRef<any>(null);
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
	useEffect(() => {
		if (target) {
			getDetail(target);
		}
	}, [target]);
	return (
		<>
			<NaverMapView
				ref={mapView}
				style={{ width: '100%', height: '100%', position: 'relative' }}
				showsMyLocationButton={true}
				center={{ ...center, zoom: 13 }}
				onCameraChange={e => onChangeCenter(e)}
				scaleBar={false}
				zoomControl={true}
				zoomGesturesEnabled={true}
			>
				{
					placeData.map((data: placeDataProps, index: number) => {
						const coor: Coord = { latitude: data.latitude, longitude: data.longitude }
						return (
							<Marker
								key={index}
								coordinate={coor}
								image={require("../../assets/img/marker.png")}
								onClick={() => { getDetail(data.id) }}
								width={20} height={30}
								caption={{
									text: `${data.place_name}`, align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"
								}} />
						)
					})}
			</NaverMapView>
			<ButtonWrapper>
				<SearchBar
					search={search}
					setSearch={setSearch}
					style={{ backgroundColor: "#FFFFFF", width: '95%' }}
					placeholder="장소를 검색해주세요"
					setPage={setPage}
				/>
				<Category checkedList={checkedList} setCheckedList={setCheckedList} />
				<SearchHereButton onPress={() => { setSearchHere(tempCoor); setPage(1); }}>
					<SearchHereText>
						지금 지도에서 검색
					</SearchHereText>
				</SearchHereButton>
			</ButtonWrapper>
		</>
	)
};

interface MapContainerProps extends MapScreenProps {
	nowCoor: Coord;
}

export default function MapContainer({ nowCoor, navigation, route }: MapContainerProps): JSX.Element {
	//SpotList의 ref
	const modalRef = useRef(null);
	const [loading, setLoading] = useState<boolean>(true);
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
	});

	//BottomSheet에서 list(true)를 보일지 detail(false)을 보일지
	const [sheetMode, setSheetMode] = useState<boolean>(true);
	//DetailCard에서 좋아요 누를 시 새로 고침
	const [refresh, setRefresh] = useState<boolean>(false);
	const rerenderScreen = (): void => {
		setRefresh(!refresh);
	}
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
	const snapPoints = useMemo(() => ['3%', '70%'], []);
	//bottomSheet Content

	//좌표, 검색어, 필터를 기반으로 장소들의 데이터 검색
	const getItem = async () => {
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
		getItem();
	}, [searchHere, page, search, checkedList, refresh]);
	return (
		<SafeAreaView>
			<Map
				checkedList={checkedList}
				setCheckedList={setCheckedList}
				search={search}
				setSearch={setSearch}
				setSearchHere={setSearchHere}
				placeData={placeData}
				setPage={setPage}
				nowCoor={nowCoor}
				setDetailData={setDetailData}
				center={center}
				setSheetMode={setSheetMode}
				setCenter={setCenter}
				target={route.params?.id}
			/>
			<BottomSheet
				ref={modalRef}
				snapPoints={snapPoints}
				index={1}
				onAnimate={(fromIndex, toIndex) => {
					if (fromIndex == 1 && toIndex == 0) {
						setSheetMode(true);
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
										navigation={navigation}
										route={route}
										detailData={detailData}
										rerenderScreen={rerenderScreen} />
							}</>
				}
			</BottomSheet>
		</SafeAreaView>
	)
}