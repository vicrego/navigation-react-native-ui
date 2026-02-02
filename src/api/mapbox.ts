import axios from "axios";

//FOR MORE DATA TO FETCH ON THE API (LIKE DISTANCE, DURATION, ETC...)
// CHECK WITHIN "RESPONSE"

export const destinationDirection = async ({
  currentLocation,
  destLng,
  destLat,
  publicToken,
}: any) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${currentLocation.longitude},${currentLocation.latitude};${destLng},${destLat}`,
      {
        params: {
          geometries: "geojson",
          access_token: publicToken,
          steps: true,
          overview: "full",
        },
      },
    );
    const routeGeometry = response.data.routes[0].geometry;
    const distanceInMiles = (
      response.data.routes[0].distance / 1609.34
    ).toFixed(2);
    const durationInMinutes = (response.data.routes[0].duration / 60).toFixed(
      1,
    );
    if (!routeGeometry) {
      console.warn("Nenhuma rota encontrada para o destino.");
      return null;
    }
    return { routeGeometry, distanceInMiles, durationInMinutes }; // Retorna o objeto de rota
  } catch (error: any) {
    console.error("Error fetching destination route:", error);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Message:", error.message);
    }
    return null;
  }
};
