import React from "react";
import { Tabs } from "expo-router";

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="list" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default Layout;
