import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const updateRoomStatus = async (roomId, isBooked) => {
    try {
      const response = await fetch(
        `http://172.20.10.2:3000/api/rooms/${roomId}/status`,
        {
          method: "PATCH", // Partial update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isBooked }), // Send isBooked as a boolean
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Room status updated successfully!");
        fetchRooms();
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to update room status.");
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      Alert.alert("Error", "Failed to update room status.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const handleEditPress = (room) => {
    setSelectedRoom({ ...room }); // Create a copy for editing
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleEditPress(item)}>
      <Image
        source={{ uri: `http://172.20.10.2:3000${item.imageUrl1}` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
        <Text style={styles.price}>£{item.price}</Text>
        <Text
          style={[
            styles.availability,
            item.isBooked ? styles.unavailable : styles.available,
          ]}
        >
          {item.isBooked ? "Unavailable" : "Available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.header}>Rooms</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by name..."
          value={filter}
          onChangeText={setFilter}
        />
      </View>

      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      {selectedRoom && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalHeader}>Edit Room Status</Text>
              <Picker
                selectedValue={
                  selectedRoom.isBooked ? "Unavailable" : "Available"
                }
                style={styles.picker}
                onValueChange={(value) => {
                  const isBooked = value === "Unavailable"; // Determine the boolean value
                  updateRoomStatus(selectedRoom.id, isBooked); // Pass only the boolean
                }}
              >
                <Picker.Item label="Available" value="Available" />
                <Picker.Item label="Unavailable" value="Unavailable" />
              </Picker>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  },
  image: { width: 100, height: 100, borderRadius: 8 },
  info: { flex: 1, paddingLeft: 10, justifyContent: "center" },
  name: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 },
  type: { fontSize: 14, color: "#666", marginBottom: 5 },
  price: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5 },
  availability: { fontSize: 14, fontWeight: "bold" },
  available: { color: "#4CAF50" },
  unavailable: { color: "#F44336" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  picker: { height: 50, marginBottom: 20 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  saveButton: { backgroundColor: "#4CAF50" },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
