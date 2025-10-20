import axios from "axios";


//FOR MORE DATA TO FETCH ON THE API (LIKE DISTANCE, DURATION, ETC...)
// CHECK WITHIN "RESPONSE"
export const destinationLatLng = async ({query, publicToken}: any) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
            {
                params: {
                access_token: publicToken,
                limit: 1,
                },
            }
        );
        if (response.data.features.length === 0) {
            console.warn("No results found for query:", query);
            return null;
        }

        const feature = response.data.features[0];
        const {coordinates}  = feature.geometry;
        const placeName = feature.place_name; 
        const shortName = feature.text; // Short name

        return { coordinates, placeName, shortName };

    } catch (error) {
        console.error("Error fetching destination coordinates:", error);
        return null;
  } 
};


export const destinationDirection = async ({currentLocation, destLng, destLat, publicToken}: any) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${currentLocation.longitude},${currentLocation.latitude};${destLng},${destLat}`,
            {
                params: {
                    geometries: "geojson",
                    access_token: publicToken,
                },
            }
        );
        const routeGeometry = response.data.routes[0].geometry;
        const distanceInMiles = (response.data.routes[0].distance / 1609.34).toFixed(2);
        const durationInMinutes = (response.data.routes[0].duration / 60).toFixed(1);
        //console.log("distance Mapbox:", response.data.routes[0].legs)
        console.log("distanceInMiles:", distanceInMiles)
        if (!routeGeometry) {
            console.warn("Nenhuma rota encontrada para o destino.");
            return null;
        }
        return {routeGeometry, distanceInMiles, durationInMinutes}; // Retorna o objeto de rota
        
    } catch (error) {
        console.error("Error fetching destination route:", error);
        return null;
    }
};