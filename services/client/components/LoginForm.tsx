import { ActivityIndicator, StyleSheet } from "react-native";
import {
  Button,
  Input,
  InputField,
  ButtonText,
  VStack,
  View,
} from "@gluestack-ui/themed";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import { useAnonymousAuthContext } from "../hooks/auth";

const Login = () => {
  const authState = useAnonymousAuthContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(authState.firebase, email, password);
      router.replace("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(authState.firebase, email, password);
      router.replace("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View my={"$5"} $base-w={"100%"} $md-w={"30%"}>
      <VStack space="md">
        <Input>
          <InputField
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="Email"
            keyboardType="email-address"
          />
        </Input>
        <Input>
          <InputField
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry={true}
          />
        </Input>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Button onPress={signIn}>
              <ButtonText>Login</ButtonText>
            </Button>
            <Button onPress={signUp}>
              <ButtonText>Register</ButtonText>
            </Button>
          </>
        )}
      </VStack>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
