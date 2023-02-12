import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Circle, Marker, Path, Polygon, Polyline } from "./map";
import { Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, StyleSheet, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayerGroup } from './map/index';

import VectorImage from 'react-native-vector-image';
import * as Keychain from 'react-native-keychain';


const P0 = { latitude: 37.564362, longitude: 126.977011 };
const P1 = { latitude: 37.565051, longitude: 126.978567 };
const P2 = { latitude: 37.565383, longitude: 126.976292 };
const P4 = { latitude: 37.564834, longitude: 126.977218 };
const P5 = { latitude: 37.562834, longitude: 126.976218 };

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const setSecureValue = (key, value) =>
    Keychain.setInternetCredentials(key, key /* <- can be a random string */, value)

const getSecureValue = async (key) => {
    const result = await Keychain.getInternetCredentials(key)
    if (result) {
        return result.password
    }
    return false
}

const removeSecureValue = (key) =>
    Keychain.resetInternetCredentials(key)

const App = () => {
    return <NavigationContainer>
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                headerTitle: 'SASM',
                headerTitleAlign: 'center',
                headerTintColor: '#000000',
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <View style={{}}>
                            <Text style={{ color: '#000000' }}>로그인</Text>
                        </View>
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    </NavigationContainer >
}

const HomeScreen = () =>
    <Tab.Navigator
        initialRouteName='Map'
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                // height: 90,
                // paddingHorizontal: 5,
                // paddingTop: 5,
                // paddingBottom: 30,
                backgroundColor: '#000000',
                // position: 'absolute',
                // borderTopWidth: 0,
            },
        })}
    >
        <Tab.Screen
            name={"map"}
            component={MapViewScreen}
            options={{
                tabBarLabel: '맵',
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#808080',
                tabBarIcon: ({ color, size }) => (
                    <VectorImage
                        source={require('./assets/navbar/map.svg')}
                        style={{
                            tintColor: color,
                            resizeMode: 'center'
                        }}
                    />
                )
            }}
        />
        <Tab.Screen name={"마이페이지"} component={MyPageScreen} />
    </Tab.Navigator>

const TextScreen = () => {
    return <Text>text</Text>
}

const MapViewScreen = ({ navigation }) => {
    const mapView = useRef(null);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const [enableLayerGroup, setEnableLayerGroup] = useState(true);

    return <>
        <NaverMapView ref={mapView}
            style={{ width: '100%', height: '100%' }}
            showsMyLocationButton={true}
            center={{ ...P0, zoom: 16 }}
            onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
            onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
            onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
            useTextureView>
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
            <Marker coordinate={P4} onClick={() => console.warn('onClick! p4')} image={require("./assets/marker.png")} width={48} height={48}
                caption={{
                    text: "test caption", align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"

                }}
                subCaption={{
                    text: "test caption2", align: Align.Bottom, textSize: 15, color: "black", haloColor: "white"

                }}
            />
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
        <TouchableOpacity style={{ position: 'absolute', bottom: '10%', right: 8 }} onPress={() => navigation.navigate('stack')}>
            <View style={{ backgroundColor: 'gray', padding: 4 }}>
                <Text style={{ color: 'white' }}>open stack</Text>
            </View>
        </TouchableOpacity>
        <Text style={{ position: 'absolute', top: '95%', width: '100%', textAlign: 'center' }}>SASM Map에 오신 것을 환영합니다.</Text>
    </>
};

const MapViewScreen2 = ({ navigation }) => {
    return <View>
        <TouchableOpacity onPress={navigation.goBack}>
            <View style={{ backgroundColor: 'gray', padding: 4 }}>
                <Text style={{ color: 'white' }}>goBack</Text>
            </View>
        </TouchableOpacity>
        <ScrollView style={{ width: '100%', height: '100%' }}>
            <Text>scrollGesturesEnabled: default</Text>
            <NaverMapView style={{ width: '100%', height: 200 }}
                center={{ ...P0, zoom: 15 }}
                useTextureView
                liteModeEnabled>
                <Marker coordinate={P0} />
            </NaverMapView>
            {Array.from({ length: 10 }, (_, i) => i).map(i => <Text key={i}></Text>)}
            <Text>scrollGesturesEnabled</Text>
            <NaverMapView style={{ width: '100%', height: 200 }}
                center={{ ...P0, zoom: 15 }}
                scrollGesturesEnabled
                useTextureView
                liteModeEnabled>
                <Marker coordinate={P0} />
            </NaverMapView>
            {Array.from({ length: 10 }, (_, i) => i).map(i => <Text key={i}></Text>)}
            <Text>scrollGesturesEnabled: false</Text>
            <NaverMapView style={{ width: '100%', height: 200 }}
                center={{ ...P0, zoom: 15 }}
                scrollGesturesEnabled={false}
                useTextureView
                liteModeEnabled>
                <Marker coordinate={P0} />
            </NaverMapView>
            {Array.from({ length: 10 }, (_, i) => i).map(i => <Text key={i}></Text>)}
        </ScrollView>
    </View>
}

const MyPageScreen = ({ navigation }) => {
    const [accessToken, setAccessToken] = useState('')
    const [refreshToken, setRefreshToken] = useState('')

    useEffect(() => {
        // const  = await fetchUser(userId);
        // // getSecureValue('accessToken')
        async function getTokens() {
            setAccessToken(await getSecureValue('accessToken'));
            setRefreshToken(await getSecureValue('refreshToken'));
        }
        getTokens();
    }, []);


    return (
        <View>
            <Text>{accessToken}</Text>
            <Text>{refreshToken}</Text>
        </View>
    )
}

const LoginScreen = ({ navigation }) => {
    const styles = StyleSheet.create({
        input: {
            width: 294,
            height: 32,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            shadowOffset: {
                width: 2,
                height: 4,
            },
            shadowOpacity: 0.1,
            //             box- shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        },
        errorContainer: {
            marginBottom: 10,
            marginTop: 30,
            padding: 20,
            backgroundColor: '#ee3344',
        },
        errorLabel: {
            color: '#fff',
            fontSize: 15,
            fontWeight: 'bold',
            textAlignVertical: 'center',
            textAlign: 'center',
        },
        loginButton: {
            width: 150,
            height: 40,
            borderWidth: 2,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            fontSize: 12,
            fontWeight: 500,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#44ADF7',
            ...Platform.select({
                ios: {
                    marginTop: 15,
                },
                android: {
                    marginTop: 15,
                    marginBottom: 10,
                },
            }),
        },
        signUpButton: {
            width: 300,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#44ADF7',
            fontSize: 16,
            fontWeight: 600,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#44ADF7',
            ...Platform.select({
                ios: {
                    marginTop: 15,
                },
                android: {
                    marginTop: 15,
                    marginBottom: 10,
                },
            }),
        }
    });
    const [form, setForm] = useState({
        email: {
            value: '',
            type: 'textInput',
            rules: {},
            valid: false,
        },
        password: {
            value: '',
            type: 'textInput',
            rules: {},
            valid: false,
        },
    });

    updateInput = (name, value) => {
        let formCopy = form;
        formCopy[name].value = value;
        setForm(form => {
            return { ...formCopy };
        });
    };

    login = () => {
        fetch('http://127.0.0.1:8000/users/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: form['email'].value,
                password: form['password'].value,
            }),
        }).then(async (response) => {
            if (response.status == 200) {
                const responseData = await response.json()
                const accessToken = responseData.data.access
                const refreshToken = responseData.data.access
                setSecureValue('accessToken', accessToken)
                setSecureValue('refreshToken', refreshToken)
                navigation.navigate('home')
            } else {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        });
    }

    return (
        <View
            style={
                {
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center'
                }
            }
        >
            <View style={{ marginTop: 100 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 600,
                    }}
                >LOG IN</Text>
            </View>
            <View style={{ marginTop: 40 }}>
                <TextInput
                    style={styles.input}
                    value={form.email.value}
                    type={form.email.type}
                    autoCapitalize={'none'}
                    keyboardType={'email-address'}
                    placeholder="E-mail"
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onChangeText={value => updateInput('email', value)}
                />
                <TextInput
                    style={styles.input}
                    value={form.password.value}
                    type={form.password.type}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onChangeText={value => updateInput('password', value)}
                />
            </View>
            <View style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={() => login()}>
                    <View style={styles.loginButton}>
                        <Text>로그인하기</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 40 }}>
                <View style={styles.signUpButton}>
                    <Text style={{ color: '#FFFFFF' }}>회원가입하기</Text>
                </View>
            </View>
        </View >)
}


async function requestLocationPermission() {
    if (Platform.OS !== 'android') return;
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'show my location need Location permission',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
        } else {
            console.log('Location permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}


export default App;