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
  Button,
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

  const updateRoom = async (updatedRoom) => {
    try {
      const response = await fetch(
        `http://172.20.10.2:3000/api/rooms/${updatedRoom.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRoom),
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Room updated successfully!");
        setModalVisible(false);
        fetchRooms();
      } else {
        Alert.alert("Error", "Failed to update room.");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      Alert.alert("Error", "Failed to update room.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const handleEditPress = (room) => {
    setSelectedRoom({ ...room });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!selectedRoom.name || !selectedRoom.type || !selectedRoom.price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    updateRoom(selectedRoom);
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
          {item.isBooked ? "Not Available" : "Available"}
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
          style={styles.inputField}
          placeholder="Price"
          keyboardType="numeric"
          value={selectedRoom.price === 0 ? "" : String(selectedRoom.price)}
          onChangeText={(text) => {
            const parsedPrice = parseFloat(text);
            setSelectedRoom((prev) => ({
              ...prev,
              price:
                text === "" ? 0 : isNaN(parsedPrice) ? prev.price : parsedPrice,
            }));
          }}
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
              <Text style={styles.modalHeader}>Edit Room</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Room Name"
                value={selectedRoom.name}
                onChangeText={(text) =>
                  setSelectedRoom((prev) => ({ ...prev, name: text }))
                }
              />
              <Picker
                selectedValue={selectedRoom.type}
                style={styles.picker}
                onValueChange={(value) =>
                  setSelectedRoom((prev) => ({ ...prev, type: value }))
                }
              >
                <Picker.Item label="Single" value="Single" />
                <Picker.Item label="Double" value="Double" />
                <Picker.Item label="Suite" value="Suite" />
              </Picker>
              <Picker
                selectedValue={selectedRoom.isBooked}
                style={styles.picker}
                onValueChange={(value) =>
                  setSelectedRoom((prev) => ({ ...prev, isBooked: value }))
                }
              >
                <Picker.Item label="Available" value={false} />
                <Picker.Item label="Not Available" value={true} />
              </Picker>
              <TextInput
                style={styles.inputField}
                placeholder="Price"
                keyboardType="numeric"
                value={String(selectedRoom.price)}
                onChangeText={(text) =>
                  setSelectedRoom((prev) => ({
                    ...prev,
                    price: parseFloat(text),
                  }))
                }
              />
              <View style={styles.modalButtonsContainer}>
                <View style={styles.modalButtonWrapper}>
                  <Button title="Save" onPress={handleSave} color="#1fa637" />
                </View>
                <View style={styles.modalButtonWrapper}>
                  <Button
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    color="#F44336"
                  />
                </View>
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
  available: { color: "#1fa637" },
  unavailable: { color: "#F44336" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    height: "65%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  inputField: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  picker: { height: 40, marginBottom: 15 },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  modalButtonWrapper: { width: "40%" },
});
