import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { usePublicAuthContext } from "../../hooks/auth";

const Layout = () => {
  const authState = usePublicAuthContext();

  if (authState.state !== "loggedIn") return <Redirect href="/login" />;

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: () => <Feather name="users" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Feather name="user" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
};

export default Layout;