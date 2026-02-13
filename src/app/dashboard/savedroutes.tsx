import { Button, Text } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const savedroutes = () => {
  //const navigation = useNavigation();
  const { routeData } = useLocalSearchParams();
  const parsedData = JSON.parse(routeData as string);
  console.log("nav: ", parsedData);
  //const { params } = routes.params;
  //console.log("params: ", params);
  return (
    <View style={styles.container}>
      <Button
        //title="Go to Dashboard"
        style={{ position: "absolute", top: 30, left: 2, zIndex: 2 }}
        onPress={() => router.push("/dashboard/dashboardscreen")}
      >
        Back
      </Button>
      <View style={styles.gridContainer}>
        <FlashList
          data={parsedData}
          //estimatedItemSize={100}
          renderItem={({ item }: any) => {
            console.log("item1: ", item.startingAddress);
            console.log("item2: ", item.destinationAddress);

            const date = new Date(item?.created_at);
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const formattedTime = date.toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <View style={styles.routeCard}>
                <Text style={styles.title}>Trip to Destination</Text>
                <Text>From {item.startingAddress}</Text>
                <Text>To {item.destinationAddress}</Text>
                <Text>{formattedDate}</Text>
                <Text>{formattedTime}</Text>
                <Text>{item?.destinationDistance} miles traveled</Text>
                <Text>{item?.destinationDuration} minutes traveled</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default savedroutes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 80,
  },
  gridContainer: {
    flex: 1,
    //top: 80,
  },
  routeCard: {
    padding: 20,
    margin: 10,
    backgroundColor: "red",
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonLogout: {
    backgroundColor: "blue",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
  },
});
