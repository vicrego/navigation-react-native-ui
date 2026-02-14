//Bridge between Service and UI.

import { LineString } from "geojson";
import { useEffect, useState } from "react";
import {
  destinationCoordinateToAddress,
  startingCoordinateToAddress,
} from "../api/mapbox";
import { supabase } from "../api/supabase";

export const useRoutes = (
  currentDistanceDuration: any,
  isFollowingRoute: any,
  destinationDistance: any,
  destinationDuration: any,
  destinationCoords: any,
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isArriving =
      currentDistanceDuration !== null &&
      currentDistanceDuration.remainingMiles <= 0.03;
    if (isFollowingRoute && isArriving) {
      saveCurrentRoute(
        currentDistanceDuration.remainingLine.geometry,
        destinationDistance,
        destinationDuration,
        destinationCoords,
      );
    }
  }, [currentDistanceDuration?.remainingMiles]);

  const saveCurrentRoute = async (
    geometryRoute: LineString,
    destinationDistance: number,
    destinationDuration: number,
    destinationCoords: any,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("destinationCoords: ", destinationCoords);
    if (!user) return alert("Please login first!");

    //LOGIC FOR COORDINATES TO ADDRESS
    const startingAddress = await startingCoordinateToAddress(
      currentDistanceDuration?.remainingLine.geometry.coordinates[0],
    );
    const destinationAddress =
      await destinationCoordinateToAddress(destinationCoords);

    const { error } = await supabase.from("saved_routes").insert([
      {
        user_id: user.id,
        geometryRoute: geometryRoute,
        destinationDistance: destinationDistance,
        destinationDuration: destinationDuration,
        destinationCoords: destinationCoords,
        startingAddress: startingAddress,
        destinationAddress: destinationAddress,
      },
    ]);
    if (error) console.error("Error saving:", error.message);
    else console.log("Route saved successfully!");
  };

  return { saveCurrentRoute, loading };
};
