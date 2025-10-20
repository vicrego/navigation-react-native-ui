import * as turf from '@turf/turf';


export const calculationDistanceAndDuration = (currentLocation: any, route: any) => {
// routeGeojson: { type: 'LineString', coordinates: [[lng,lat], ...] }
  // currentCoord: { latitude: ..., longitude: ... } or [lng, lat]
  console.log("currentLocation Util: ", currentLocation)
  console.log("route: ", route)

  const line = turf.lineString(route.coordinates);
  const pt = turf.point([currentLocation.longitude, currentLocation.latitude]);

  // Find the nearest point on the line to the current location
  const snapped = turf.nearestPointOnLine(line, pt, { units: 'miles' });

  // snapped has properties { index, location, dist, etc } and geometry
  // Slice the remaining route from snapped point to the end
  const endPoint = turf.point(route.coordinates[route.coordinates.length - 1]);
  const remainingLine = turf.lineSlice(snapped, endPoint, line); // returns LineString
  console.log("remainingLine: ", remainingLine)
  // Remaining distance in meters
  const remainingMeters = turf.length(remainingLine, { units: 'miles' });
    console.log("remainingMeters: ", remainingMeters)
  return {
    remainingLine,
    snappedPoint: snapped.geometry.coordinates, // [lng, lat]
    remainingMeters,
  };
}

