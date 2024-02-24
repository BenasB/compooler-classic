import {
  Center,
  SafeAreaView,
  ScrollView,
  VStack,
  Text,
  Spinner,
  HStack,
  useToken,
  Heading,
} from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Clients } from "../../../hooks/apollo";
import { useQuery } from "@apollo/client";
import { usePrivateAuthContext } from "../../../hooks/auth";
import PassengerActions from "../../../components/rides/details/PassengerActions";
import DriverActions from "../../../components/rides/details/DriverActions";
import { GET_RIDE_DETAILS } from "../../../components/rides/details/query";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import {
  RideParticipationStatus,
  RideStatus,
} from "../../../__generated__/graphql";

const Details = () => {
  const { user } = usePrivateAuthContext();
  const { id } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const lightTextColor = useToken("colors", "textLight300");
  const darkTextColor = useToken("colors", "textLight700");
  const iconColor = colorScheme === "light" ? darkTextColor : lightTextColor;

  if (!id || isNaN(+id))
    return (
      <Center>
        <Text>Could not find this ride</Text>
      </Center>
    );

  const {
    loading: rideLoading,
    error: rideError,
    data: rideData,
  } = useQuery(GET_RIDE_DETAILS, {
    variables: { id: +id },
    context: {
      clientName: Clients.Rides,
    },
  });

  const passenger = useMemo(() => {
    if (!rideData?.rideById) return undefined;
    return rideData.rideById.passengers.find((x) => x.passengerId === user.uid);
  }, [rideData]);

  const body = rideLoading ? (
    <Spinner />
  ) : rideError || rideData === undefined ? (
    <Text>Whoops! Ran into an error when loading the ride details :/</Text>
  ) : !rideData.rideById ? (
    <Center>
      <Text>Could not find this ride</Text>
    </Center>
  ) : (
    <VStack space="xl">
      <VStack space="md">
        <HStack space="md" alignItems="center">
          <Feather name="activity" size={24} color={iconColor} />
          <Text>
            {rideData.rideById.status === RideStatus.Upcoming
              ? "Upcoming"
              : rideData.rideById.status === RideStatus.InProgress
              ? "In progress"
              : rideData.rideById.status === RideStatus.Done
              ? "Done"
              : "Cancelled"}
          </Text>
        </HStack>
        <HStack space="md" alignItems="center">
          <Feather name="calendar" size={24} color={iconColor} />
          <Text>
            {rideData.rideById.startTime.split("T")[0].split("-").join("-")}{" "}
            {rideData.rideById.startTime
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")}
          </Text>
        </HStack>
        <VStack space="md">
          <Heading size="md">Passengers</Heading>
          {rideData.rideById.passengers.map((passenger, i) => (
            <HStack space="md" alignItems="center" key={passenger.passengerId}>
              <Text>{i + 1}.</Text>
              <Feather
                name={
                  passenger.participationStatus ===
                  RideParticipationStatus.Participate
                    ? "user-check"
                    : "user-x"
                }
                size={24}
                color={iconColor}
              />
              {passenger.passengerId === user.uid && <Text>(You)</Text>}
            </HStack>
          ))}
        </VStack>
      </VStack>
      <Center>
        {passenger ? (
          <PassengerActions
            rideStatus={rideData.rideById.status}
            participationStatus={passenger.participationStatus}
            id={rideData.rideById.id}
          />
        ) : (
          <DriverActions
            status={rideData.rideById.status}
            id={rideData.rideById.id}
          />
        )}
      </Center>
    </VStack>
  );

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
