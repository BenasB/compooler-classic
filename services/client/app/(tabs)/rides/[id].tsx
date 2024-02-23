import {
  Center,
  SafeAreaView,
  ScrollView,
  VStack,
  Text,
} from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const Details = () => {
  const { id } = useLocalSearchParams();

  // TODO: render body/actions based on if the user is a passenger or a driver
  const body = <Text>Hi {id}</Text>;

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: `Ride #${id}` }} />
      <Center h="$full" p="$5">
        <VStack space="md" h="$full" $base-w={"100%"} $md-w={"60%"} $lg-w={550}>
          <ScrollView>{body}</ScrollView>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Details;
