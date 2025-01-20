import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/api/bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://172.20.10.2:3000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Booking deleted successfully!");
        fetchBookings();
      } else {
        Alert.alert("Error", "Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      Alert.alert("Error", "Failed to delete booking.");
    }
  };

  const confirmDelete = (bookingId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBooking(bookingId),
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.roomName}</Text>
        <Text style={styles.type}>Type: {item.roomType}</Text>
        <Text style={styles.date}>Booking Date: {item.bookingDate}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <MaterialIcons name="delete" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookings</Text>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  list: { paddingBottom: 10 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  type: { fontSize: 14, color: "#666", marginVertical: 5 },
  date: { fontSize: 14, color: "#333" },
});
