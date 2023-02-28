import { Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermission = async () => {
  if (Platform.OS === "ios") {
    return await Geolocation.requestAuthorization("always");
  }
}

// export async function requestLocationPermission() {
// 	if (Platform.OS === 'ios') {
// 		request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
// 			console.warn(result);
// 		});
// 		check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
// 			.then((result) => {
// 				switch (result) {
// 					case RESULTS.UNAVAILABLE:
// 						console.warn('This feature is not available (on this device / in this context)');
// 						break;
// 					case RESULTS.DENIED:
// 						console.warn('The permission has not been requested / is denied but requestable');
// 						break;
// 					case RESULTS.LIMITED:
// 						console.warn('The permission is limited: some actions are possible');
// 						break;
// 					case RESULTS.GRANTED:
// 						console.warn('The permission is granted');
// 						break;
// 					case RESULTS.BLOCKED:
// 						console.warn('The permission is denied and not requestable anymore');
// 						break;
// 				}
// 			})
// 			.catch((error) => {
// 				console.warn(error);
// 			});
// 	}
// 	else {
// 		request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
// 			console.warn(result);
// 		});
// 		check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
// 			.then((result) => {
// 				switch (result) {
// 					case RESULTS.UNAVAILABLE:
// 						console.warn('This feature is not available (on this device / in this context)');
// 						break;
// 					case RESULTS.DENIED:
// 						console.warn('The permission has not been requested / is denied but requestable');
// 						break;
// 					case RESULTS.LIMITED:
// 						console.warn('The permission is limited: some actions are possible');
// 						break;
// 					case RESULTS.GRANTED:
// 						console.warn('The permission is granted');
// 						break;
// 					case RESULTS.BLOCKED:
// 						console.warn('The permission is denied and not requestable anymore');
// 						break;
// 				}
// 			})
// 			.catch((error) => {
// 				console.warn(error);
// 			});
// 	}
// }