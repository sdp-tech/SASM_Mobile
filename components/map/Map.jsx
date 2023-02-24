import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, PermissionsAndroid, Button, StyleSheet, SafeAreaView, } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NaverMapView, { Align, Marker } from './NaverMap';
import { TrackingMode } from './NaverMap';
import axios from "axios";
import { Request } from '../../common/requests';
import MapList from './components/MapList';
import Drawer from "react-native-draggable-view";

const P0 = { latitude: 37.564362, longitude: 126.977011 };
const P1 = { latitude: 37.565051, longitude: 126.978567 };
const P2 = { latitude: 37.565383, longitude: 126.976292 };
const P4 = { latitude: 37.564834, longitude: 126.977218 };
const P5 = { latitude: 37.562834, longitude: 126.976218 };

const Map = ({ navigation, placeData, setTempCoor, setSearchHere }) => {
    const mapView = useRef(null);
    //지도가 이동할때마다 지도의 중심 좌표를 임시로 저장
    const onChangeCenter = (event) => {
        setTempCoor({
            center: {
                latitude: event.latitude,
                longitude: event.longitude,
            },
            zoom: 13,
        })
    }
    useEffect(() => {
        requestLocationPermission();
    }, []);

    const [enableLayerGroup, setEnableLayerGroup] = useState(true);

    return <>
        <NaverMapView
            ref={mapView}
            style={{ width: '100%', height: '100%', position: 'relative' }}
            showsMyLocationButton={false}
            center={{ ...P0, zoom: 13 }}
            onCameraChange={e => onChangeCenter(e)}
            scaleBar={false}
            zoomControl={true}
        >
            {
                placeData.map((data, index) => {
                    const coor = { latitude: data.latitude, longitude: data.longitude }
                    return (
                        <Marker key={index} coordinate={coor} image={require("../../assets/marker.png")} width={30} height={48} caption={{
                            text: `${data.place_name}`, align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"

                        }}></Marker>
                    )
                })}
        </NaverMapView>
        <TouchableOpacity style={styles.SearchHere} onPress={() => { setSearchHere(tempCoor) }}>
            <Text style={styles.SearchHereText}>
                지금 지도에서 검색
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', bottom: '10%', right: 8 }} onPress={() => navigation.navigate('stack')}>
            <View style={{ backgroundColor: 'gray', padding: 4 }}>
                <Text style={{ color: 'white' }}>open stack</Text>
            </View>
        </TouchableOpacity>
        {/* <Text style={{ position: 'absolute', bottom: '3%', width: '100%', textAlign: 'center' }}>SASM Map에 오신 것을 환영합니다.</Text> */}
    </>
};

export default function MapViewScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [placeData, setPlaceData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    //tempCoor => 지도가 움직이때마다 center의 좌표
    const [tempCoor, setTempCoor] = useState({
        center: {
            latitude: 37.551229,
            longitude: 126.988205,
        },
        zoom: 13,
    })
    //searchHere => 특정 좌표에서 검색할때 tempCoor의 좌표를 기반으로 검색
    const [searchHere, setSearchHere] = useState(tempCoor);
    //좌표, 검색어, 필터를 기반으로 장소들의 데이터 검색
    const getItem = async () => {
        try {
            const response = await axios.get('https://api.sasmbe.com/places/place_search/', {
                params: {
                    left: searchHere.center.latitude,
                    right: searchHere.center.longitude,
                    search: '',
                    filter: '',
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
    }, [searchHere, page]);

    return (
        <>
            {loading ? <View><Text>loading</Text></View> :
                <Drawer
                    initialDrawerSize={0.2}
                    autoDrawerUp={1} // 1 to auto up, 0 to auto down
                    renderContainerView={() => (
                        <Map navigation={navigation} setTempCoor={setTempCoor} setSearchHere={searchHere} placeData={placeData} />
                    )}
                    renderDrawerView={() => (
                        <MapList page={page} setPage={setPage} total={total} placeData={placeData} />
                    )}
                    renderInitDrawerView={() => (
                        <View style={{ backgroundColor: 'black', height: 10 }}>
                        </View>
                    )}
                    finalDrawerHeight={400}
                />}
        </>
    )
}


async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
            console.warn(result);
        });
        check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.warn('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.warn('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.warn('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.warn('The permission is granted');
                        break;
                    case RESULTS.BLOCKED:
                        console.warn('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    else {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
            console.warn(result);
        });
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.warn('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.warn('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.warn('The permission is limited: some actions are possible');
                        break;
                    case RESULTS.GRANTED:
                        console.warn('The permission is granted');
                        break;
                    case RESULTS.BLOCKED:
                        console.warn('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                console.warn(error);
            });
    }
}


const styles = StyleSheet.create({
    SearchHere: {
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#44ADF7',
        borderRadius: 10,
    },
    SearchHereText: {
        padding: 5,
        color: '#FFFFFF',
        borderRadius: 10,
    }
})
