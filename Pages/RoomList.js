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
import { useUserContext } from "../Context/UserContext";
import { FontAwesome } from "@expo/vector-icons";

export default function RoomList({ navigation }) {
  const { user, loginUser, logoutUser } = useUserContext();
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("");
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/api/rooms");
      console.log("🚀 ~ fetchRooms ~ response:", response)
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, [])
  );

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://172.20.10.2:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          userType: "Customer",
        }),
      });

      const data = await response.json();
      setIsLoading(false);
      if (data.success) {
        Alert.alert("Success", "You have signed up successfully!");
        setCustomerModalVisible(false);
        clearInputs();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://172.20.10.2:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        loginUser(data.user);
        setCustomerModalVisible(false);
        clearInputs();
        Alert.alert("Success", "Login successful!");
      } else {
        Alert.alert("Error", data.message || "Invalid credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleAdminLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://172.20.10.2:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("🚀 ~ handleAdminLogin ~ response:", response)

      const data = await response.json();
      setIsLoading(false);

      if (data.success && data.user.userType === "Admin") {
        setAdminModalVisible(false);
        clearInputs();
        navigation.navigate("AdminPage");
      } else {
        Alert.alert("Error", data.message || "Invalid admin credentials.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("RoomDetails", { room: item })}
    >
      <Image
        source={{ uri: `http://172.20.10.2:3000${item.imageUrl1}` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>Type: {item.type}</Text>
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

  const filteredRooms = rooms?.filter((room) =>
    room.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.welcomeTxt}>
        {user && <Text style={styles.header}>Welcome, {user.username}</Text>}
      </View>

      <View style={styles.actionButtonsContainer}>
        {!user && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setIsLoginModal(false);
                setCustomerModalVisible(true);
              }}
            >
              <FontAwesome name="user-plus" size={20} color="white" />
              <Text style={styles.actionButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setIsLoginModal(true);
                setCustomerModalVisible(true);
              }}
            >
              <FontAwesome name="sign-in" size={20} color="white" />
              <Text style={styles.actionButtonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}

        {user && (
          <TouchableOpacity style={styles.actionButton} onPress={logoutUser}>
            <FontAwesome name="sign-out" size={20} color="white" />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        )}

        {user && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("MyBookings", { user: user })}
          >
            <FontAwesome name="calendar" size={20} color="white" />
            <Text style={styles.actionButtonText}>My Bookings</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setAdminModalVisible(true)}
        >
          <FontAwesome name="cogs" size={20} color="white" />
          <Text style={styles.actionButtonText}>Admin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleBar}>
        <Text style={[styles.header, { color: "#1fa637", fontSize: 20 }]}>
          Search by Room
        </Text>

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

      {/* Customer Login/Signup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customerModalVisible}
        onRequestClose={() => {
          setCustomerModalVisible(false);
          clearInputs();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.formTitle}>
              {isLoginModal ? "Login" : "Sign Up"}
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
              style={styles.inputField}
              secureTextEntry
            />
            {!isLoginModal && (
              <TextInput
                placeholder="Username"
                placeholderTextColor="#B0B0B0"
                value={username}
                onChangeText={setUsername}
                style={styles.inputField}
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={isLoginModal ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoginModal ? "Login" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCustomerModalVisible(false);
                clearInputs();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Login Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={adminModalVisible}
        onRequestClose={() => {
          setAdminModalVisible(false);
          clearInputs();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Title for Admin Login */}
            <Text style={styles.formTitle}>Admin Login</Text>

            <TextInput
              placeholder="Admin Email"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
              style={styles.inputField}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAdminLogin}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>Admin Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setAdminModalVisible(false);
                clearInputs();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  filterInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#1fa637",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  list: {
    paddingHorizontal: 10,
  },
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  type: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  availability: {
    fontSize: 14,
    fontWeight: "bold",
  },
  available: {
    color: "#4CAF50",
  },
  unavailable: {
    color: "#F44336",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#1fa637",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
  },
  inputField: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#1fa637",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeTxt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
