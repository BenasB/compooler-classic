import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Login from "./Login";

export default function App() {
  const [apiResponse, setApiResponse] = useState<string>("none");

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("http://192.168.0.105:8050/weatherforecast");
      const content = await resp.text();
      setApiResponse(content);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello to Compooler!</Text>
      <Text>{apiResponse}</Text>
      <StatusBar style="auto" />
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
