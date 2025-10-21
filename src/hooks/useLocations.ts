//Gets permission and sets coordinates based on user's location

import * as Location from 'expo-location';
import { useEffect, useState } from "react";
  
function useLocations() {
    const [currentLocation, setCurrentLocation] = useState<any>();
    useEffect(() => {
        let subscription: any;
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
            
            subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 1 },
                (loc) => 
                {
                    setCurrentLocation(loc.coords);
                }
            );
        })();
        return () => {
            if (subscription) subscription.remove();
        };
    }, []);
    return currentLocation;
}

export default useLocations;