import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Button, Text } from "@react-navigation/elements";
import { router } from "expo-router";
import { supabase } from "../api/supabase";
import { NavigationState } from "../types/navigation";

export default function DashBoard() {
  const [routes, setRoutes] = useState<NavigationState[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from("saved_routes")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setRoutes(data);
    };
    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello There</Text>
      <Button
        //title="Go to Dashboard"
        style={{ position: "absolute", top: 300, zIndex: 2 }}
        onPress={() => router.push("/")}
      >
        Go to Details
      </Button>

      {/*
      <FlashList
        data={routes}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <View style={styles.routeCard}>
            <Text style={styles.title}>Trip to Destination</Text>
            <Text>{item.remainingMiles.toFixed(2)} miles traveled</Text>
          </View>
        )}
      />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  routeCard: {
    padding: 20,
    margin: 10,
    backgroundColor: "red",
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16 },
});
