import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";
import { CreditCardInput } from "react-native-credit-card-input";

export default function RoomDetails({ route }) {
  const { room } = route.params;
  const { user } = useUserContext();

  const [bookingDate, setBookingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Add a state to show the payment form

  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [csvNumber, setCsvNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || bookingDate;
    setShowDatePicker(false);
    setBookingDate(currentDate);
  };

  const handleReservation = async () => {
    try {
      setIsLoading(true);
      const formattedDate = bookingDate.toISOString().split("T")[0];

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

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        console.log("Reservation successful:", response.data);
        setShowPaymentForm(false); // Hide payment form on success
      } else {
        Alert.alert("Error", response.data.message || "Reservation failed.");
      }
    } catch (error) {
      console.error("Error reserving room:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Reservation failed."
      );
    } finally {
      setIsLoading(false);
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
        <Text style={styles.price}>Price: £{room.price}</Text>

        {/* Booking Date Picker */}
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
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Reserve Button */}
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => setShowPaymentForm(true)} // Show the payment form
        >
          <Text style={styles.reserveButtonText}>Reserve Room</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Form (Displayed instead of Modal) */}
      {showPaymentForm && (
        <View style={styles.paymentFormContainer}>
          <Text style={styles.modalHeader}>Payment Details</Text>
          <Text style={styles.modalDescription}>
            Please enter your credit card details to proceed with the booking.
          </Text>

          {/* Credit Card Input */}
          <Text style={styles.label}>Credit Card Details</Text>
          <CreditCardInput
            requiresName
            labelStyle={styles.inputLabel}
            inputStyle={styles.inputField}
            onChange={(formData) => {
              setCreditCardNumber(formData.values.number);
              setExpiryDate(formData.values.expiry);
              setCsvNumber(formData.values.cvc);
            }}
          />

          {/* Pay Button */}
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleReservation}
            disabled={isLoading}
          >
            <Text style={styles.payButtonText}>
              {isLoading ? "Processing..." : "Pay"}
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowPaymentForm(false)} // Hide the payment form
          >
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
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
  // Payment Form Styles
  paymentFormContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  inputField: {
    width: "100%", // Ensure the input takes up full width available in the container
    maxWidth: 350, // Add a maxWidth to prevent overflow
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputLabel: {
    color: "#333",
    fontSize: 14,
    marginBottom: 5,
  },
  payButton: {
    backgroundColor: "#1fa637",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
