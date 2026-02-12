//Logic for interacting with the database

import { LineString } from "geojson";
import { supabase } from "../api/supabase";
import { NavigationState } from "../types/navigation";

export const routeService = {
  async saveUserRoute(
    userId: string,
    geometryRoute: LineString,
    destinationDistance: number,
    destinationDuration: number,
    destinationCoords: NavigationState,
  ) {
    const { data, error } = await supabase.from("routes").insert([
      {
        user_id: userId,
        geometryRoute: geometryRoute,
        destinationDistance: destinationDistance,
        destinationDuration: destinationDuration,
        destinationCoords: destinationCoords,
      },
    ]);

    if (error) throw error;
    return data;
  },
};
