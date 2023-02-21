import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, PermissionsAndroid, Button, StyleSheet, } from "react-native";
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import NaverMapView, { Align, Marker } from './NaverMap';
import { TrackingMode } from './NaverMap';
import axios from "axios";
import { Request } from '../../common/requests';

const P0 = { latitude: 37.564362, longitude: 126.977011 };
const P1 = { latitude: 37.565051, longitude: 126.978567 };
const P2 = { latitude: 37.565383, longitude: 126.976292 };
const P4 = { latitude: 37.564834, longitude: 126.977218 };
const P5 = { latitude: 37.562834, longitude: 126.976218 };

const MapViewScreen = ({ navigation }) => {
    const [placeData, setPlaceData] = useState([]);
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
    const getItem = async () => {
        try {
            const response = await axios.get('https://api.sasmbe.com/places/place_search/', {
                params: {
                    left: searchHere.center.latitude,
                    right: searchHere.center.longitude,
                    search: '',
                    filter: '',
                    page: 1,
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: "No Auth",
                },
            });
            // const response = await Request.get(`/places/place_search`, {
            //     left: 37.564362,
            //     right: 126.977011,
            //     search: '',
            //     filter: '',
            //     page: 1,
            // })
            setPlaceData(response.data.data.results);
        }
        catch (error) {
            console.error(error);
        }
    }
    const mapView = useRef(null);
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
        getItem();
    }, [searchHere])
    useEffect(() => {
        requestLocationPermission();
    }, []);

    const [enableLayerGroup, setEnableLayerGroup] = useState(true);

    return <>
        <NaverMapView
            ref={mapView}
            style={{ width: '100%', height: '100%' }}
            showsMyLocationButton={true}
            center={{ ...P0, zoom: 13 }}
            // onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
            onCameraChange={e => onChangeCenter(e)}
            // onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
            // useTextureView
            // setLocationTrackingMode={TrackingMode.Follow}
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
            {/* <Marker coordinate={P0}
                onClick={() => {
                    console.warn('onClick! p0')
                    mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_BICYCLE, enableLayerGroup);
                    mapView.current.setLayerGroupEnabled(LayerGroup.LAYER_GROUP_TRANSIT, enableLayerGroup);
                    setEnableLayerGroup(!enableLayerGroup)
                }}
                caption={{ text: "test caption", align: Align.Left }}
            /> */}
            {/* <Marker coordinate={P1} pinColor="blue" zIndex={1000} onClick={() => console.warn('onClick! p1')} /> */}
            {/* <Marker coordinate={P2} pinColor="red" zIndex={100} alpha={0.5} onClick={() => console.warn('onClick! p2')} /> */}
            {/* <Marker coordinate={P4} onClick={() => console.warn('onClick! p4')} image={require("../../assets/marker.png")} width={48} height={48}
                caption={{
                    text: "test caption", align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"

                }}
                subCaption={{
                    text: "test caption2", align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"

                }}
            /> */}
            {/* <Path coordinates={[P0, P1]} onClick={() => console.warn('onClick! path')} width={10} /> */}
            {/* <Polyline coordinates={[P1, P2]} onClick={() => console.warn('onClick! polyline')} /> */}
            {/* <Circle coordinate={P0} color={"rgba(255,0,0,0.3)"} radius={200} onClick={() => console.warn('onClick! circle')} /> */}
            {/* <Polygon coordinates={[P0, P1, P2]} color={`rgba(0, 0, 0, 0.5)`} onClick={() => console.warn('onClick! polygon')} /> */}
            {/* <Marker coordinate={P5} onClick={() => console.warn('onClick! p0')} width={96} height={96}>
                <View style={{ backgroundColor: 'rgba(255,0,0,0.2)', borderRadius: 80 }}>
                    <View style={{ backgroundColor: 'rgba(0,0,255,0.3)', borderWidth: 2, borderColor: 'black', flexDirection: 'row' }}>
                        <Image source={require("./assets/marker.png")} style={{
                            width: 32, height: 32,
                            backgroundColor: 'rgba(0,0,0,0.2)', resizeMode: 'stretch',
                            borderWidth: 2, borderColor: 'black'
                        }} fadeDuration={0} />
                        <Text>Image</Text>
                    </View>
                    <ImageBackground source={require("./assets/marker.png")} style={{ width: 64, height: 64 }}>
                        <Text>image background</Text>
                    </ImageBackground>
                </View>
            </Marker> */}
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
        <Text style={{ position: 'absolute', top: '95%', width: '100%', textAlign: 'center' }}>SASM Map에 오신 것을 환영합니다.</Text>
    </>
};


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
        borderRadius:10,
    },
    SearchHereText: {
        padding: 5,
        color: '#FFFFFF',
        borderRadius: 10,
    }
})

export default MapViewScreen;