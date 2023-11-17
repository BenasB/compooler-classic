import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Profile = () => {
  return (
    <View>
      <Text>My profile</Text>
      <Link href={"/login"}>Login</Link>
    </View>
  );
};

export default Profile;
