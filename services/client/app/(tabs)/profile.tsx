import { Text, Button } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { usePrivateAuthContext } from "../../hooks/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const authState = usePrivateAuthContext();
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>My profile</Text>
      <Button
        title="Log out"
        onPress={async () => {
          await signOut(authState.firebase);
          router.replace("/");
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
