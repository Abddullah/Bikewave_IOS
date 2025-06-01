import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { platform } from '../utilities/constants/index';

export const checkLocationPermission = async () => {
    return new Promise(async (resolve, reject) => {
        if (platform === 'ios') {
            await Geolocation.requestAuthorization('always');
            startWatchingLocation(resolve, reject);
        } else {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                startWatchingLocation(resolve, reject);
            } else {
                reject(new Error("Location permission denied!"));
            }
        }
    });
};

export const startWatchingLocation = (resolve, reject) => {
    const watchId = Geolocation.watchPosition(
        position => {
            // Real-time location updates
            resolve(position);
        },
        error => {
            // Handle error
            reject(new Error("Location services are disabled"));
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 200, // The minimum change (in meters) required to trigger a location update.
            interval: 10000, // The desired interval for location updates (in milliseconds).
            fastestInterval: 5000, // The fastest rate in milliseconds at which your app can handle location updates.
        }
    );

    // Store watchId so that it can be cleared later
    return watchId;
};

// To stop watching the location when no longer needed
export const stopWatchingLocation = (watchId) => {
    if (watchId !== null) {
        Geolocation.clearWatch(watchId);
    }
};
