import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, Button, StyleSheet, SafeAreaView, Dimensions, } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NaverMapView, { Align, Marker } from './NaverMap';
import axios from "axios";
import Loading from '../../common/Loading';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import Category from '../../common/Category';
import BottomSheet from 'reanimated-bottom-sheet';
import MapList from './SpotList';
import SpotDetail from './SpotDetail';
import { Request } from '../../common/requests';

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



const Map = ({ placeData, setSearchHere, setSearch, setPage, checkedList, setCheckedList, nowCoor, detailRef, setDetailData, center, setCenter,target }) => {
	const request = new Request();
	//tempCoor => 지도가 움직이때마다 center의 좌표
	const [tempCoor, setTempCoor] = useState(nowCoor);
	const mapView = useRef(null);
	//지도가 이동할때마다 지도의 중심 좌표를 임시로 저장
	const onChangeCenter = (event) => {
		setTempCoor({
			latitude: event.latitude,
			longitude: event.longitude,
		})
	}

  const getDetail = async (_id) => {
    const response_detail = await request.get('/places/place_detail/', { id: _id });
    setDetailData(response_detail.data.data);
		setCenter({
			latitude: response_detail.data.data.latitude,
			longitude: response_detail.data.data.longitude,
		})
		detailRef.current.snapTo(0); 
  }
	useEffect(()=>{
		if(target) {
			getDetail(target);
		}
	}, [target]);
	return <>
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
				placeData.map((data, index) => {
					const coor = { latitude: data.latitude, longitude: data.longitude }
					return (
						<Marker
							key={index}
							coordinate={coor}
							image={require("../../assets/img/marker.png")}
							onClick={() => { getDetail(data.id)}}
							width={20} height={30}
							caption={{
								text: `${data.place_name}`, align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"
							}} />
					)
				})}
		</NaverMapView>
		<ButtonWrapper>
			<SearchBar setSearch={setSearch}></SearchBar>
			<Category checkedList={checkedList} setCheckedList={setCheckedList} />
			<SearchHereButton onPress={() => { setSearchHere(tempCoor); setPage(1); }}>
				<SearchHereText>
					지금 지도에서 검색
				</SearchHereText>
			</SearchHereButton>
		</ButtonWrapper>
	</>
};

export default function MapContainer({ nowCoor, navigation, route }) {
	//SpotList의 ref
	const listRef = useRef(null);
	//SpotDetail의 ref
	const detailRef = useRef(null);
	//window의 높이
	const WindowHeight = Dimensions.get('window').height
	const [loading, setLoading] = useState(true);
	const [placeData, setPlaceData] = useState([]);
	const [detailData, setDetailData] = useState({
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
    place_like: false,
    category_statistics: [],
  });
	//DetailCard에서 좋아요 누를 시 새로 고침
	const [refresh, setRefresh] = useState(false);
	const rerenderScreen = () => {
		setRefresh(!refresh);
	}
	//지도의 중심 좌표
	const [center, setCenter] = useState(nowCoor);
	//checkedList => 카테고리 체크 복수 체크 가능
	const [checkedList, setCheckedList] = useState([]);
	const [total, setTotal] = useState(0);
	//search => 검색어
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1);
	//searchHere => 특정 좌표에서 검색할때 tempCoor의 좌표를 기반으로 검색
	const [searchHere, setSearchHere] = useState({ ...nowCoor });
	const request = new Request();
	//bottomSheet Content
	const renderContent = () => {
		return (
			<MapList detailRef={detailRef} page={page} setPage={setPage} total={total} placeData={placeData} setDetailData={setDetailData} setCenter={setCenter}/>
		)
	}
	const renderDetail = () => {
		return (
			<SpotDetail navigation={navigation} route={route} detailData={detailData} rerenderScreen={rerenderScreen}/>
		)
	}
	const renderHeader = () => {
		return (
			<View style={{ height: 20, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopEndRadius: 10, borderTopStartRadius: 10 }}>
				<View style={{ width: '20%', height: 5, backgroundColor: '#535151', borderRadius: 5 }}></View>
			</View>
		)
	}

	//좌표, 검색어, 필터를 기반으로 장소들의 데이터 검색
	const getItem = async () => {
		const response = await request.get('/places/place_search/', {
			left: searchHere.latitude,
			right: searchHere.longitude,
			search: search,
			filter: checkedList,
			page: page,
		});
		setTotal(response.data.data.count);
		setPlaceData(response.data.data.results);
		setLoading(false);
		listRef.current.snapTo(1);
	}
	//searchHere, page가 변할 시 데이터 재검색
	useEffect(() => {
		getItem();
	}, [searchHere, page, search, checkedList, refresh]);
	return (
		<>
			{loading ?
				<Loading /> :
				<>
					<Map
						checkedList={checkedList}
						setCheckedList={setCheckedList}
						setSearch={setSearch}
						setSearchHere={setSearchHere}
						placeData={placeData}
						setPage={setPage}
						nowCoor={nowCoor}
						detailRef={detailRef}
						setDetailData={setDetailData}
						center={center}
						setCenter={setCenter}
						target={route.params?.id}
					/>
					<BottomSheet
						ref={listRef}
						snapPoints={[600, 155, 10]}
						renderContent={renderContent}
						initialSnap={1}
						renderHeader={renderHeader}
					/>
					<BottomSheet
						ref={detailRef}
						snapPoints={[WindowHeight - 110, 500, 0]}
						renderContent={renderDetail}
						initialSnap={2}
						renderHeader={renderHeader}
					/>
				</>
			}
		</>
	)
}