//Bridge between Service and UI.

import { LineString } from "geojson";
import { useState } from "react";
import { supabase } from "../api/supabase";

export const useRoutes = () => {
  const [loading, setLoading] = useState(false);

  const saveCurrentRoute = async (
    geometryRoute: LineString,
    destinationDistance: number,
    destinationDuration: number,
    destinationCoords: any,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Please login first!");

    //const test = {currentDistanceDuration.remainingLine};

    const { error } = await supabase.from("saved_routes").insert([
      {
        user_id: user.id,
        geometryRoute: geometryRoute,
        destinationDistance: destinationDistance,
        destinationDuration: destinationDuration,
        destinationCoords: destinationCoords,
      },
    ]);
    if (error) console.error("Error saving:", error.message);
    else console.log("Route saved successfully!");
  };

  return { saveCurrentRoute, loading };
};
