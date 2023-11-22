import { View, Text, Button } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { usePrivateAuthContext } from "../../hooks/auth";

const Profile = () => {
  const authState = usePrivateAuthContext();
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
