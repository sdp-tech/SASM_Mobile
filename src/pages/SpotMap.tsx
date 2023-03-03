import React, {useState, useEffect} from "react";
import { getCurrentPosition } from "react-native-geolocation-service";
import Geolocation from 'react-native-geolocation-service';
import { requestPermission } from "../common/Permission";
import Loading from "../common/Loading";
import MapContainer from "../components/map/Map";

export interface Coordinate {
  latitude: number;
  longitude: number
}

export default function MapScreen():JSX.Element {
	const [nowCoor, setNowCoor] = useState<Coordinate>({
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
					<Loading /> :
					<MapContainer nowCoor={nowCoor} />
			}
		</>
	)
}