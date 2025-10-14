import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { destinationDirection, destinationLatLng } from '../api/mapbox';

  
const SearchComponent = ({publicToken, onSelect, currentLocation, setRoute, setDistance, setDuration, setPlaceName, setShortName}: any) => {

  const [query, setQuery] = useState("");
  const [distanceInMiles, setDistanceInMiles] = useState();

  const handleSearch = async () => {
    if (!query) return;
      const destinationReverse = await destinationLatLng({query, publicToken});
      const [destLng, destLat] = destinationReverse?.coordinates;
      console.log("destinationReverse: ", destinationReverse)
      const {routeGeometry, distanceInMiles, durationInMinutes}: any = await destinationDirection({currentLocation, destLng, destLat, publicToken});
      //const {routeGeometry, distanceInMiles, durationInMinutes}: any = destinationForward;
      console.log("routeGeometry: ", routeGeometry)
      setPlaceName(destinationReverse?.placeName);
      setShortName(destinationReverse?.shortName);
      setDistance(distanceInMiles);
      setDuration(durationInMinutes);
      setRoute(routeGeometry);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Where to?"
        value={query}
        onChangeText={setQuery}
      />
      <Pressable style={styles.button} title="Go" onPress={handleSearch} >
        <FontAwesomeIcon icon={faPlay} />
      </Pressable>
    </View> 
  )
}

const styles = ({
  container: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    zIndex: 1,
    padding: 5,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2180e59c',
    borderRadius: 8,
    padding: 10,
    //backgroundColor: "blue"
  }
});

export default SearchComponent