import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { router } from "expo-router";
import { AuthContext } from "../../hooks/auth";

const Profile = () => {
  const authState = useContext(AuthContext);

  return (
    <View>
      <Text>My profile</Text>
      <Button
        title="Log out"
        onPress={async () => {
          await signOut(authState.firebase);
          router.replace("/");
        }}
      />
    </View>
  );
};

export default Profile;
