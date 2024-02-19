import {
  AlertCircleIcon,
  Button,
  ButtonText,
  Center,
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  SafeAreaView,
  ScrollView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import React, { useMemo, useState } from "react";
import TimePicker from "../../../components/TimePicker";
import { Stack } from "expo-router";
import { Coordinates, Days } from "../../../types/group";
import LocationPicker from "../../../components/LocationPicker";

type ValidatableInput<T> = { value: T } & (
  | {
      validation: "success";
    }
  | {
      validation: "failure";
      error: string;
    }
  | {
      validation: "pending";
    }
);

const Create = () => {
  const [time, setTime] = useState(new Date());
  const [days, setDays] = useState<ValidatableInput<Days | 0>>({
    validation: "pending",
    value: 0,
  });
  const [emptySeats, setEmptySeats] = useState<number>(1);
  const [startLocation, setStartLocation] = useState<Coordinates>({
    latitude: 54.72090502968378,
    longitude: 25.28279660188754,
  });

  const [endLocation, setEndLocation] = useState<Coordinates>({
    latitude: 54.68550466692954,
    longitude: 25.26002211532131,
  });

  console.log({ time, days, emptySeats, startLocation, endLocation });

  const dayInfo = useMemo(() => {
    const enumArray = Object.values(Days);
    const keys = enumArray.slice(0, enumArray.length / 2) as string[];
    const values = enumArray.slice(enumArray.length / 2) as (Days | 0)[];

    return keys.map((k, i) => ({ name: k, value: values[i] }));
  }, []);

  return (
    <SafeAreaView flex={1}>
      <Stack.Screen options={{ title: "Create a new group" }} />
      <ScrollView px="$5" my="$5">
        <Center>
          <View $base-w={"100%"} $md-w={"60%"} $lg-w={"550px"}>
            <VStack space="lg">
              <FormControl>
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
              <FormControl
                isRequired={true}
                isInvalid={days.validation === "failure"}
              >
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
                        var newValue = days.value ^ value;
                        if (newValue === 0)
                          setDays({
                            validation: "failure",
                            value: newValue,
                            error:
                              "There must be at least one week day in the schedule",
                          });
                        else
                          setDays({
                            validation: "success",
                            value: newValue,
                          });
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
                {days.validation === "failure" && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>{days.error}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Empty seats</FormControlLabelText>
                </FormControlLabel>
                <Select
                  selectedValue={emptySeats.toString()}
                  onValueChange={(val) => setEmptySeats(+val)}
                >
                  <SelectTrigger>
                    <SelectInput />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {Array.from({ length: 7 }, (_, index) => index + 1).map(
                        (i) => (
                          <SelectItem
                            label={i.toString()}
                            value={i.toString()}
                            key={i}
                          />
                        )
                      )}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>
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
                    Select the starting location of the group
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
                    Select the end location of the group
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
              <Button action="positive">
                <ButtonText>Create</ButtonText>
              </Button>
            </VStack>
          </View>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
