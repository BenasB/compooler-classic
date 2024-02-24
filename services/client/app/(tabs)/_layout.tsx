import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { usePublicAuthContext } from "../../hooks/auth";

const Layout = () => {
  const authState = usePublicAuthContext();

  if (authState.state !== "loggedIn") return <Redirect href="/login" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="rides"
        options={{
          tabBarLabel: "Rides",
          tabBarIcon: ({ color }) => (
            <Feather name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
