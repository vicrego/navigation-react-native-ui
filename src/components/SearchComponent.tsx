import { Text } from '@react-navigation/elements';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { destinationDirection } from '../api/mapbox';


  
const SearchComponent = ({publicToken, onSelect, destinationCoords, currentLocation, setRoute, setDistance, setDuration, setDestinationCoords, setPlaceName, setShortName}: any) => {

  const [query, setQuery] = useState("");
  const [searchList, setSearchList] = useState([])

  //SearchComponent, when triggered, updates every state that's based on the user's destination
  const handleSearch = async (destLng: any, destLat: any) => {
    if (!query) return;
    const {routeGeometry, distanceInMiles, durationInMinutes}: any = await destinationDirection({currentLocation, destLng, destLat, publicToken});
    setDistance(distanceInMiles);
    setDuration(durationInMinutes);
    setRoute(routeGeometry);
  };
  

  useEffect(() => {
    if(query){
      const OnChangeText = async () =>  {
        const res = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
          { params: { access_token: publicToken, autocomplete: true, limit: 5 } }
        );    
        setSearchList(res.data.features);
      }
      OnChangeText();
    }
  }, [query]);

  return (
    <View>
      <View style={styles.outerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Where to?"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {(searchList[0] !== undefined) && (query != "") && (
        <View style={styles.innerContainer}>
          {searchList.map((x: any, i: number)=> 
            <View key={i}>
              <Pressable onPress={() => {
                console.log("x Coords", x.center[0])
                setPlaceName(x.place_name);
                setShortName(x.text);
                setDestinationCoords({
                  longitude: x.center[0], latitude: x.center[1]
                });
                handleSearch(x.center[0], x.center[1]);
              }}
              >
                <Text>{x.place_name}</Text>
              </Pressable>
            </View>
          )}
        </View>
        )
      }
    </View> 
  )
}

const styles = ({
  outerContainer: {
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
  innerContainer: {
    position: "absolute",
    top: 100,
    left: 10,
    right: 10,
    height: 100,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 8,
    zIndex: 9,
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