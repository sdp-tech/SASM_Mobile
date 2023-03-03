import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, PermissionsAndroid, Button, StyleSheet, SafeAreaView, } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NaverMapView, { Align, Marker } from './NaverMap';
import axios from "axios";
import SpotList from "./SpotList";
import Drawer from "react-native-draggable-view";
import Loading from '../../common/Loading';
import styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';
import SearchBar from '../../common/SearchBar';
import Category from '../../common/Category';
import { requestPermission } from '../../common/Permission';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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


const Map = ({placeData, setSearchHere, setSearch, setPage, checkedList, setCheckedList, nowCoor }) => {
	//tempCoor => 지도가 움직이때마다 center의 좌표
	const [tempCoor, setTempCoor] = useState(nowCoor);
	//지도의 중심 좌표
	const [center, setCenter] = useState(nowCoor);
	const mapView = useRef(null);
	//지도가 이동할때마다 지도의 중심 좌표를 임시로 저장
	const onChangeCenter = (event) => {
		setTempCoor({
				latitude: event.latitude,
				longitude: event.longitude,
		})
	}

	return <>
		<NaverMapView
			ref={mapView}
			style={{ width: '100%', height: '100%', position: 'relative' }}
			showsMyLocationButton={false}
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

export default function MapContainer({ nowCoor }) {
	const [loading, setLoading] = useState(true);
	const [placeData, setPlaceData] = useState([]);
	//checkedList => 카테고리 체크 복수 체크 가능
	const [checkedList, setCheckedList] = useState([]);
	const [total, setTotal] = useState(0);
	//search => 검색어
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1);
	//searchHere => 특정 좌표에서 검색할때 tempCoor의 좌표를 기반으로 검색
	const [searchHere, setSearchHere] = useState({...nowCoor});
	//좌표, 검색어, 필터를 기반으로 장소들의 데이터 검색
	const getItem = async () => {
		try {
			const response = await axios.get('https://api.sasmbe.com/places/place_search/', {
				params: {
					left: searchHere.latitude,
					right: searchHere.longitude,
					search: search,
					filter: checkedList,
					page: page,
				},
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					Authorization: "No Auth",
				},
			});
			setTotal(response.data.data.count);
			setPlaceData(response.data.data.results);
			setLoading(false);
		}
		catch (error) {
			console.error(error);
		}
	}
	//searchHere, page가 변할 시 데이터 재검색
	useEffect(() => {
		getItem();
	}, [searchHere, page, search, checkedList]);

	return (
		<>
			{loading ? <Loading /> :
				<Drawer
					initialDrawerSize={0.2}
					autoDrawerUp={1} // 1 to auto up, 0 to auto down
					renderContainerView={() => (
						<Map
							checkedList={checkedList}
							setCheckedList={setCheckedList}
							setSearch={setSearch}
							setSearchHere={setSearchHere}
							placeData={placeData}
							setPage={setPage}
							nowCoor={nowCoor} />
					)}
					renderDrawerView={() => (
						<SpotList page={page} setPage={setPage} total={total} placeData={placeData} />
					)}
					renderInitDrawerView={() => (
						<View style={{
							backgroundColor: '#FFFFFF',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: 10
						}}>
							<View style={{ backgroundColor: '#535351', height: 5, width: '10%', borderRadius: 5 }} />
						</View>
					)}
					finalDrawerHeight={400}
				/>}
		</>
	)
}