import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { AuthContext } from "../../hooks/auth";

const Profile = () => {
  const authState = useContext(AuthContext);
  const router = useRouter();

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
