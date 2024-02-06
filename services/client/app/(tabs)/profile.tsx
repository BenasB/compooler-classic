import { Text, Button, ButtonText } from "@gluestack-ui/themed";
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
        onPress={async () => {
          await signOut(authState.firebase);
          router.replace("/");
        }}
      >
        <ButtonText>Log out</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
