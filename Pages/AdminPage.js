import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AdminPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Create Room Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("RoomCreate")}
      >
        <Text style={styles.cardText}>Create Room</Text>
      </TouchableOpacity>

      {/* Manage Rooms Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ManageRooms")}
      >
        <Text style={styles.cardText}>Manage</Text>
      </TouchableOpacity>

      {/* Customer Complaints Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ComplaintsPage")}
      >
        <Text style={styles.cardText}>Customer Complaints</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#1fa637",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
