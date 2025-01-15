import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useUserContext } from "../Context/UserContext"; // Import the UserContext
import { Alert } from "react-native";

export default function RoomDetails({ route }) {
  const { room } = route.params;
  const { user, loginUser, logoutUser } = useUserContext();
  console.log("🚀 ~ RoomDetails ~ user:", user);

  console.log("🚀 ~ RoomDetails ~ room:", room);

  const [bookingDate, setBookingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookingDate;
    setShowDatePicker(false);
    setBookingDate(currentDate);
  };

  const handleReservation = async () => {
    try {
      setIsLoading(true); // Show a loader if necessary
      const formattedDate = bookingDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      console.log("🚀🚀🚀 ~ RoomDetails ~ room:", room);

      const response = await axios.post(
        "http://172.20.10.2:3000/api/reserve-room",
        {
          roomId: room.id,
          roomName: room.name,
          roomType: room.type,
          description: room.description,
          userId: user.id,
          bookedUserName: user.name,
          bookingDate: formattedDate,
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        console.log("Reservation successful:", response.data); // Debug
      } else {
        Alert.alert("Error", response.data.message || "Reservation failed.");
        console.error("Reservation error:", response.data); // Debug
      }
    } catch (error) {
      console.error("Error reserving room:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Reservation failed."
      );
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  if (!room) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Room details are not available.</Text>
      </View>
    );
  }

  const roomImages = [room.imageUrl1, room.imageUrl2, room.imageUrl3];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Room Images */}
      <FlatList
        horizontal
        data={roomImages}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: `http://172.20.10.2:3000${item}` }}
              style={styles.image}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />

      {/* Room Info */}
      <View style={styles.infoCard}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomType}>Type: {room.type}</Text>
        <Text
          style={[
            styles.availability,
            room.status === "Available" ? styles.available : styles.unavailable,
          ]}
        >
          {room.status === "Available" ? "Available" : "Not Available"}
        </Text>
        <Text style={styles.description}>{room.description}</Text>

        {/* Room Price */}
        <Text style={styles.price}>Price: £{room.price}</Text>

        {/*  Booking Date Picker */}
        <View style={styles.datePickerWrapper}>
          <Text style={styles.label}>Select Booking Date:</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {bookingDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={bookingDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()} // Prevent past dates
            />
          )}
        </View>

        {/* Reserve Button */}
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleReservation}
        >
          <Text style={styles.reserveButtonText}>Reserve Room</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  imageWrapper: {
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: 320,
    height: 200,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  roomName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  roomType: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  availability: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  available: {
    color: "#1fa637",
  },
  unavailable: {
    color: "#F44336",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  datePickerWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: "#1fa637",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: "#fff",
  },
  reserveButton: {
    backgroundColor: "#1fa637",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
  },
});
