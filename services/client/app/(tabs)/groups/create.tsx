import {
  Button,
  ButtonText,
  Center,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  SafeAreaView,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import React, { useMemo, useState } from "react";
import TimePicker from "../../../components/TimePicker";
import { Stack } from "expo-router";
import { Days } from "../../../types/group";
import LocationPicker from "../../../components/LocationPicker";
import { LatLng } from "react-native-maps";

const Create = () => {
  const [time, setTime] = useState(new Date());
  const [days, setDays] = useState<Days | 0>(0);
  const [startLocation, setStartLocation] = useState<LatLng>({
    latitude: 54.72090502968378,
    longitude: 25.28279660188754,
  });

  const dayInfo = useMemo(() => {
    const enumArray = Object.values(Days);
    const keys = enumArray.slice(0, enumArray.length / 2) as string[];
    const values = enumArray.slice(enumArray.length / 2) as Days[];

    return keys.map((k, i) => ({ name: k, value: values[i] }));
  }, []);

  return (
    <SafeAreaView m="$5">
      <Stack.Screen options={{ title: "Create a new group" }} />
      <Center>
        <View $base-w={"100%"} $md-w={"60%"} $lg-w={"550px"}>
          <VStack space="lg">
            <FormControl isRequired={true}>
              <HStack justifyContent="space-between">
                <FormControlLabel mb="$1">
                  <FormControlLabelText>Start time</FormControlLabelText>
                </FormControlLabel>
                <TimePicker time={time} onChange={setTime} />
              </HStack>
              <FormControlHelper>
                <FormControlHelperText>
                  Select the time the group leaves the starting point
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <FormControl isRequired={true}>
              <FormControlLabel mb="$1">
                <FormControlLabelText>Schedule</FormControlLabelText>
              </FormControlLabel>
              <VStack space="sm">
                {dayInfo.map(({ name, value }, i) => (
                  <Checkbox
                    value={name}
                    aria-label={name}
                    key={name}
                    onChange={(_) => {
                      setDays(days ^ value);
                    }}
                  >
                    <CheckboxIndicator mr="$2">
                      <CheckboxIcon>
                        <CheckIcon />
                      </CheckboxIcon>
                    </CheckboxIndicator>
                    <CheckboxLabel>{name}</CheckboxLabel>
                  </Checkbox>
                ))}
              </VStack>
              <FormControlHelper>
                <FormControlHelperText>
                  Select the days this group will be commuting
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            <FormControl>
              <FormControlLabel mb="$1">
                <FormControlLabelText>Start location</FormControlLabelText>
              </FormControlLabel>
              <LocationPicker
                startingCoordinates={startLocation}
                onConfirm={(newLocation) => setStartLocation(newLocation)}
              />
              <Text>
                {startLocation.latitude}, {startLocation.longitude}
              </Text>
              <FormControlHelper>
                <FormControlHelperText>
                  Select the starting point of the group
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
          </VStack>
        </View>
      </Center>
    </SafeAreaView>
  );
};

export default Create;
