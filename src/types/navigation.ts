import { Feature, LineString, Position } from "geojson";

export interface NavigationState {
  remainingDuration: number;
  remainingMiles: number;
  // SnappedPoint is a coordinate array: [longitude, latitude]
  snappedPoint: Position;
  remainingLine: Feature<LineString>;
}

export type RootStackParamList = {
  Map: undefined; // No params needed for the main map
  Dashboard: { refresh?: boolean }; // Optional param to trigger a reload
};
