import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUserContext } from "../Context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function MyBookings({ navigation }) {
  const { user } = useUserContext();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");
  const [complaintModal, setComplaintModal] = useState({
    visible: false,
    roomNumber: "",
    roomName: "",
  });
  const [complaintText, setComplaintText] = useState("");

  const fetchBookings = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(
        `http://172.20.10.2:3000/bookings?userId=${user.id}`
      );
      const data = await response.json();
      const formattedData = data.map((booking) => ({
        id: booking.id,
        name: booking.roomName,
        type: booking.roomType,
        bookingDate: booking.bookingDate,
      }));
      setBookings(formattedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [user])
  );

  const handleAddComplaint = (roomNumber, roomName) => {
    setComplaintModal({ visible: true, roomNumber, roomName });
  };

  const handleSaveComplaint = async () => {
    if (!complaintText) return;

    try {
      const response = await fetch("http://172.20.10.2:3000/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.username,
          roomNumber: complaintModal.roomNumber,
          comment: complaintText,
        }),
      });

      if (response.ok) {
        alert("Complaint saved successfully");
      } else {
        alert("Failed to save complaint");
      }

      setComplaintModal({ visible: false, roomNumber: "", roomName: "" });
      setComplaintText("");
    } catch (error) {
      console.error("Error saving complaint:", error);
    }
  };

  const renderItem = ({ item }) => {
    const formattedDate = item.bookingDate
      ? new Date(item.bookingDate).toLocaleDateString()
      : "Date not available";

    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>Type: {item.type}</Text>
          <Text style={styles.bookingDate}>Booking Date: {formattedDate}</Text>
        </View>

        {/* Add Complaint Button */}
        <TouchableOpacity
          style={styles.complaintButton}
          onPress={() => handleAddComplaint(item.id, item.name)}
        >
          <MaterialIcons name="report-problem" size={24} color="#fff" />
          <Text style={styles.complaintText}>Add Complaint</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.header}>My Bookings</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by name..."
          value={filter}
          onChangeText={setFilter}
        />
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={complaintModal.visible}
        onRequestClose={() =>
          setComplaintModal({ visible: false, roomNumber: "", roomName: "" })
        }
        transparent
        animationType="slide"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              Add Complaint for {complaintModal.roomName}
            </Text>

            {/* Styled Input */}
            <TextInput
              style={styles.largeTextInput}
              placeholder="Enter your complaint here..."
              multiline
              value={complaintText}
              onChangeText={setComplaintText}
            />

            {/* Styled Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveComplaint}
            >
              <Text style={styles.saveButtonText}>Save Complaint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 20 },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: { fontSize: 24, fontWeight: "bold", color: "#333" },
  filterInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  list: { paddingHorizontal: 10 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: { flex: 1, paddingLeft: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  type: { fontSize: 14, color: "#666", marginBottom: 5 },
  bookingDate: { fontSize: 14, color: "#666" },
  complaintButton: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  complaintText: { color: "#fff", fontSize: 14, marginLeft: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  textInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  largeTextInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top", // Ensure the text starts at the top for multiline input
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },

  // Save button styles
  saveButton: {
    backgroundColor: "#1fa637",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
