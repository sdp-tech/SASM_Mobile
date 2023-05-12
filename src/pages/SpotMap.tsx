import React, { useState, useEffect } from "react";
import { getCurrentPosition } from "react-native-geolocation-service";
import Geolocation from 'react-native-geolocation-service';
import { requestPermission } from "../common/Permission";
import MapContainer from "../components/map/Map";
import { StackScreenProps } from "@react-navigation/stack";
import { TabProps } from "../../App";
import { Coord } from "react-native-nmap";
import { ActivityIndicator } from "react-native";

export type MapScreenProps = StackScreenProps<TabProps, '맵'>;

export default function MapScreen({ navigation, route }: MapScreenProps): JSX.Element {
	const [nowCoor, setNowCoor] = useState<Coord>({
		latitude: 37.5, longitude: 127.5,
	})
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		requestPermission().then(result => {
			if (result === "granted") {
				Geolocation.getCurrentPosition(
					pos => {
						setNowCoor({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
						console.log(pos)
						setLoading(false);
					},
					error => {
						console.log(error);
					},
					{
						enableHighAccuracy: true,
						timeout: 3600,
						maximumAge: 3600,
					},
				);
			}
		});
	}, []);
	return (
		<>
			{
				loading ?
					<ActivityIndicator /> :
					<MapContainer nowCoor={nowCoor} navigation={navigation} route={route} />
			}
		</>
	)
}