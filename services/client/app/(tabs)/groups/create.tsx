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
  Spinner,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed";
import React, { useMemo, useState } from "react";
import TimePicker from "../../../components/TimePicker";
import { Stack, useRouter } from "expo-router";
import { Coordinates, Days } from "../../../types/group";
import LocationPicker from "../../../components/LocationPicker";
import { gql } from "../../../__generated__";
import { useMutation } from "@apollo/client";
import { Clients } from "../../../hooks/apollo";

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

const CREATE_GROUP = gql(`
  mutation CreateGroup($input: CreateGroupInput!){
    createGroup(input: $input){
      group {
        id
      }
      errors {
        ... on Error{
          message
        }
      }
    } 
  }
`);

const CREATE_INITIAL_RIDES = gql(`
  mutation CreateInitialRides($input: CreateNextRidesInput!) {
    createNextRides(input: $input) {
      ride {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`);

const Create = () => {
  const router = useRouter();

  const [
    groupMutateFunction,
    {
      data: groupMutationData,
      loading: groupMutationLoading,
      error: groupMutationError,
      called: groupMutationCalled,
    },
  ] = useMutation(CREATE_GROUP, {
    context: {
      clientName: Clients.GroupMaker,
    },
    onCompleted: (data) => {
      if (data.createGroup.errors || !data.createGroup.group) return;

      const groupId = data.createGroup.group.id;
      const initialRideCount =
        (days.value.toString(2).match(/1/g)?.length ?? 3) * 2; // Two weeks of rides

      // TODO: Data inconsistency can arise here

      // Create some initial rides to start off
      ridesMutateFunction({
        variables: {
          input: {
            groupId: groupId,
            count: initialRideCount,
          },
        },
      });
    },
  });

  const [
    ridesMutateFunction,
    {
      data: ridesMutationData,
      loading: ridesMutationLoading,
      error: ridesMutationError,
      called: ridesMutationCalled,
    },
  ] = useMutation(CREATE_INITIAL_RIDES, {
    context: {
      clientName: Clients.Rides,
    },
    onCompleted: () => {
      router.navigate("/groups");
    },
  });

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

  const dayInfo = useMemo(() => {
    const enumArray = Object.values(Days);
    const keys = enumArray.slice(0, enumArray.length / 2) as string[];
    const values = enumArray.slice(enumArray.length / 2) as (Days | 0)[];

    return keys.map((k, i) => ({ name: k, value: values[i] }));
  }, []);

  const setValidatedDays = (value: Days | 0) => {
    if (value === 0)
      setDays({
        validation: "failure",
        value: value,
        error: "There must be at least one week day in the schedule",
      });
    else
      setDays({
        validation: "success",
        value: value,
      });
  };

  const onSubmit = async () => {
    setValidatedDays(days.value);
    if (days.validation !== "success") return;

    const input = {
      days: days.value,
      startLocation: {
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
      },
      endLocation: {
        latitude: endLocation.latitude,
        longitude: endLocation.longitude,
      },
      startTime: `PT${time.getHours()}H${time.getMinutes()}M`,
      totalSeats: emptySeats + 1,
    };

    await groupMutateFunction({
      variables: {
        input: input,
      },
    });
  };

  const body =
    groupMutationLoading || ridesMutationLoading ? (
      <Spinner />
    ) : groupMutationCalled &&
      (groupMutationError || groupMutationData === undefined) ? (
      <Text>Whoops! Ran into an error when creating a group :/</Text>
    ) : ridesMutationCalled &&
      (ridesMutationError || ridesMutationData === undefined) ? (
      <Text>Whoops! Ran into an error when creating initial rides :/</Text>
    ) : (
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
            {dayInfo.map(({ name, value }) => (
              <Checkbox
                value={name}
                aria-label={name}
                key={name}
                onChange={(_) => {
                  setValidatedDays(days.value ^ value);
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
                {Array.from({ length: 7 }, (_, index) => index + 1).map((i) => (
                  <SelectItem
                    label={i.toString()}
                    value={i.toString()}
                    key={i}
                  />
                ))}
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
        <Button
          action="positive"
          onPress={() => onSubmit()}
          isDisabled={days.validation === "failure"}
        >
          <ButtonText>Create</ButtonText>
        </Button>
      </VStack>
    );

  return (
    <SafeAreaView flex={1}>
      <Stack.Screen options={{ title: "Create a new group" }} />
      <ScrollView px="$5" my="$5">
        <Center>
          <View $base-w={"100%"} $md-w={"60%"} $lg-w={550}>
            {body}
          </View>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
