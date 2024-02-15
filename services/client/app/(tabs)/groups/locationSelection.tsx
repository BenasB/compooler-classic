import {
  View,
  Button,
  ButtonText,
  VStack,
  SafeAreaView,
  Center,
} from "@gluestack-ui/themed";
import React, { useState } from "react";
import LocationPicker from "../../../components/LocationPicker";
import { Region } from "react-native-maps";
import { router, useNavigation } from "expo-router";

const locationSelection = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 54.72090502968378,
    longitude: 25.28279660188754,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const nav = useNavigation();

  console.log(region);

  return (
    <SafeAreaView>
      <View h="$full">
        <LocationPicker
          region={region}
          onRegionChange={(newLoc) => setRegion(newLoc)}
        />
      </View>
      <Center position="absolute" bottom={80} w="$full">
        <Button
          action="positive"
          w="$80"
          size="lg"
          onPress={() => {
            router.replace({ pathname: "../", params: { lol: "hello world" } });
          }}
        >
          <ButtonText>Confirm</ButtonText>
        </Button>
      </Center>
    </SafeAreaView>
  );
};

export default locationSelection;
