import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RoomList from "./Pages/RoomList";
import RoomDetails from "./Pages/RoomDetails";
import AdminPage from "./Pages/AdminPage";
import CreateRoom from "./Pages/CreateRoom";
import MyBookings from "./Pages/MyBookings";
import ManageComplains from "./Pages/ManageComplains";
import ManageRooms from "./Pages/ManageRooms";
import { UserProvider } from "./Context/UserContext";

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>Bookify</Text>
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="RoomList"
          screenOptions={{
            headerStyle: {
              backgroundColor: "#1fa637",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 24,
            },
          }}
        >
          <Stack.Screen
            name="RoomList"
            component={RoomList}
            options={{ title: "BOOKIFY" }}
          />
          <Stack.Screen
            name="RoomDetails"
            component={RoomDetails}
            options={{ title: "Room Details" }}
          />
          <Stack.Screen
            name="AdminPage"
            component={AdminPage}
            options={{ title: "Admin Page" }}
          />
          <Stack.Screen
            name="RoomCreate"
            component={CreateRoom}
            options={{ title: "Add Room" }}
          />
          <Stack.Screen
            name="MyBookings"
            component={MyBookings}
            options={{ title: "My Bookings" }}
          />
          <Stack.Screen
            name="ComplaintsPage"
            component={ManageComplains}
            options={{ title: "Manage Complains" }}
          />
          <Stack.Screen
            name="ManageRooms"
            component={ManageRooms}
            options={{ title: "Manage Rooms" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1fa637",
  },
  splashText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
