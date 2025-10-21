import * as turf from '@turf/turf';


export const calculationDistanceAndDuration = (currentLocation: any, distance: any, duration: any, route: any) => {
  // routeGeojson: { type: 'LineString', coordinates: [[lng,lat], ...] }
  // currentCoord: { latitude: ..., longitude: ... } or [lng, lat]
  console.log("route NavUtil: ", route)
  const line = turf.lineString(route.coordinates);
  //Current location point
  const pt = turf.point([currentLocation.longitude, currentLocation.latitude]);
  // Find the nearest point on the line to the current location
  const snapped = turf.nearestPointOnLine(line, pt, { units: 'miles' });
  // Slice the remaining route from snapped point to the end
  const endPoint = turf.point(route.coordinates[route.coordinates.length - 1]);
  // Takes a line, a start Point, and a stop point and returns 
  // returns a subsection of the line in-between those points. 
  // The start & stop points don't need to fall exactly on the line.
  const remainingLine = turf.lineSlice(snapped, endPoint, line); // returns LineString
  const remainingMiles = turf.length(remainingLine, { units: 'miles' });
  //const remainingKilometers = turf.length(remainingLine, { units: 'kilometers' });

  const remainingDuration = (remainingMiles / distance) * duration;
  return {
    remainingLine,
    snappedPoint: snapped.geometry.coordinates, // [lng, lat]
    remainingMiles,
    remainingDuration
  };
}

