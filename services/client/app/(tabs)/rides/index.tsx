import { ScrollView } from "@gluestack-ui/themed";
import { Text, Center, SafeAreaView, VStack } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import React from "react";

const Index = () => {
  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "My rides" }} />
      <Center h="$full" p="$5">
        <VStack space="md" h="$full" $base-w={"100%"} $md-w={"60%"} $lg-w={550}>
          <ScrollView>
            <Text>Index</Text>
          </ScrollView>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Index;
