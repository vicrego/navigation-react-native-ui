import { useEffect } from "react";

export const useCurrentRoute = (
  destinationCoords: any,
  destinationReached: any,
  setIsFollowingRoute: any,
  destinationDistance: any,
  setCurrentDistanceDuration: any,
  calculationDistanceAndDuration: any,
  currentLocation: any,
  destinationDuration: any,
  destinationRoute: any,
  currentDistanceDuration: any,
  setDestinationReached: any,
  setDestinationDuration: any,
  setDestinationDistance: any,
  setDestinationCoords: any,
) => {
  // FollowingRoute Logic
  useEffect(() => {
    if (
      destinationCoords?.latitude &&
      destinationCoords?.longitude &&
      !destinationReached
    ) {
      setIsFollowingRoute(true);
    } else {
      setIsFollowingRoute(false);
    }
  }, [
    destinationCoords?.latitude,
    destinationCoords?.longitude,
    destinationReached,
  ]);

  //Resets destination State
  useEffect(() => {
    !!destinationDistance &&
      setCurrentDistanceDuration(
        calculationDistanceAndDuration(
          currentLocation,
          destinationDistance,
          destinationDuration,
          destinationRoute,
        ),
      );
    if (currentDistanceDuration?.remainingMiles !== undefined) {
      if (currentDistanceDuration.remainingMiles <= 0.03) {
        setDestinationReached(true);
        setCurrentDistanceDuration(null);
        setDestinationDuration(0);
        setDestinationDistance(0);
        setDestinationCoords(undefined);
      }
    }
  }, [destinationDistance, currentLocation, destinationRoute]);
};
