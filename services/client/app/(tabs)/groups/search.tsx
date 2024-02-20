import React, { useState } from "react";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  VStack,
  Text,
  Button,
  ButtonText,
  Center,
  SafeAreaView,
  ScrollView,
} from "@gluestack-ui/themed";
import LocationPicker from "../../../components/LocationPicker";
import { Coordinates } from "../../../types/group";
import { Stack, useRouter } from "expo-router";

const Search = () => {
  const router = useRouter();

  // TODO: Get user location here
  const [startLocation, setStartLocation] = useState<Coordinates>({
    latitude: 54.72090502968378,
    longitude: 25.28279660188754,
  });

  const [endLocation, setEndLocation] = useState<Coordinates>({
    latitude: 54.68550466692954,
    longitude: 25.26002211532131,
  });

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "Search" }} />
      <ScrollView>
        <Center h="$full" p="$5">
          <VStack
            space="md"
            h="$full"
            $base-w={"100%"}
            $md-w={"60%"}
            $lg-w={550}
          >
            <FormControl>
              <FormControlLabel mb="$1">
                <FormControlLabelText>Start location</FormControlLabelText>
              </FormControlLabel>
              <Text>
                {startLocation.latitude}, {startLocation.longitude}
              </Text>
              <LocationPicker
                startingCoordinates={startLocation}
                onConfirm={(newLocation) => setStartLocation(newLocation)}
              />
              <FormControlHelper>
                <FormControlHelperText>
                  Select where you want to leave
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <FormControl>
              <FormControlLabel mb="$1">
                <FormControlLabelText>End location</FormControlLabelText>
              </FormControlLabel>
              <Text>
                {endLocation.latitude}, {endLocation.longitude}
              </Text>
              <LocationPicker
                startingCoordinates={endLocation}
                onConfirm={(newLocation) => setEndLocation(newLocation)}
              />
              <FormControlHelper>
                <FormControlHelperText>
                  Select where you want to end up
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <Button
              onPress={() => {
                router.push({
                  pathname: "groups/result",
                  params: {
                    startLatitude: startLocation.latitude,
                    startLongitude: startLocation.longitude,
                    endLatitude: endLocation.latitude,
                    endLongitude: endLocation.longitude,
                  },
                });
              }}
            >
              <ButtonText>Search</ButtonText>
            </Button>
          </VStack>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
