import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const renderComplaint = ({ item }) => {
    console.log("🚀 ~ renderComplaint ~ item:", item);
    const formattedDate = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "Unknown Date";

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.roomNumber}>Room: {item.roomNumber}</Text>
          <Text style={styles.userName}>By: {item.userName}</Text>
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
        <Text style={styles.timestamp}>Created At: {formattedDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All Complaints</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1fa637" />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComplaint}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  comment: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});
