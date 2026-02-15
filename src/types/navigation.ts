import { Feature, LineString, Position } from "geojson";

export interface NavigationState {
  remainingDuration: number;
  remainingMiles: number;
  // SnappedPoint is a coordinate array: [longitude, latitude]
  snappedPoint: Position;
  remainingLine: Feature<LineString>;
}

export type RootStackParamList = {
  Map: undefined;
  Dashboard: { refresh?: boolean };
};
