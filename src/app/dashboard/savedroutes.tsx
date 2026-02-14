import { Button, Text } from "@react-navigation/elements";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const savedroutes = () => {
  const { routeData } = useLocalSearchParams();
  const parsedData = JSON.parse(routeData as string);

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
        <Text style={{ fontWeight: "bold", fontSize: 16, alignSelf: "center" }}>
          Trip to Destination
        </Text>
        {parsedData.length > 0 ? (
          <FlashList
            data={parsedData}
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
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>From</Text>{" "}
                    {item.startingAddress}
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>To</Text>{" "}
                    {item.destinationAddress}
                  </Text>
                  <Text>{formattedDate}</Text>
                  <Text>{formattedTime}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Text>{item?.destinationDistance} miles</Text>
                    <Text>{item?.destinationDuration} minutes</Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Text style={{ fontSize: 40 }}>🗺️</Text>
            </View>
            <Text style={styles.emptyTitle}>No Routes Found</Text>
            <Text style={styles.emptySubtitle}>
              Your saved trips will appear here once you've completed a journey.
            </Text>
          </View>
        )}
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
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
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
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 90,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  startBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
