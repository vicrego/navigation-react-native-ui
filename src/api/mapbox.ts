import axios from "axios";

//FOR MORE DATA TO FETCH ON THE API (LIKE DISTANCE, DURATION, ETC...)
// CHECK WITHIN "RESPONSE"

let publicToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const destinationDirection = async ({
  currentLocation,
  destLng,
  destLat,
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

export const startingCoordinateToAddress = async (startingCoords: any) => {
  let startingCoordsList = {
    longitude: startingCoords[0],
    latitude: startingCoords[1],
  };

  try {
    const response = await axios.get(
      `https://api.mapbox.com/search/geocode/v6/reverse`,
      {
        params: {
          longitude: startingCoordsList.longitude,
          latitude: startingCoordsList.latitude,
          access_token: publicToken,
          steps: true,
          types: "address",
          limit: 1,
        },
      },
    );
    const feature = response.data.features[0];

    const context = feature?.properties?.context;
    const number = context?.address?.address_number || "";
    const district =
      context?.locality?.name || context?.neighborhood?.name || "";
    const town = context?.place?.name || "";

    const postcode = context?.postcode?.name || "";

    const startingAddress = `${number} ${district}, ${town} ${postcode}`
      .replace(/\s+/g, " ")
      .trim();
    return startingAddress;
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

export const destinationCoordinateToAddress = async (
  destinationCoords: any,
) => {
  console.log("destinationCoords: ", destinationCoords);
  try {
    const response = await axios.get(
      `https://api.mapbox.com/search/geocode/v6/reverse`,
      {
        params: {
          longitude: destinationCoords.longitude,
          latitude: destinationCoords.latitude,
          access_token: publicToken,
          steps: true,
          types: "address",
          limit: 1,
        },
      },
    );
    const feature = response.data.features[0];

    const context = feature?.properties?.context;
    const number = context?.address?.address_number || "";
    const district =
      context?.locality?.name || context?.neighborhood?.name || "";
    const town = context?.place?.name || "";

    const postcode = context?.postcode?.name || "";

    const destinationAddress = `${number} ${district}, ${town} ${postcode}`
      .replace(/\s+/g, " ")
      .trim();

    return destinationAddress;
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
