import {
  Center,
  SafeAreaView,
  ScrollView,
  VStack,
  Text,
  Spinner,
} from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { gql } from "../../../__generated__";
import { Clients } from "../../../hooks/apollo";
import { useQuery } from "@apollo/client";
import { usePrivateAuthContext } from "../../../hooks/auth";
import PassengerActions from "../../../components/rides/PassengerActions";
import DriverActions from "../../../components/rides/DriverActions";

const GET_RIDE_DETAILS = gql(`
  query GetRideDetails($id: Int!) {
    rideById(id: $id) {
      id
      startTime
      groupId
      status
      passengers {
        passengerId
        participationStatus
      }
    }
  }
`);

const Details = () => {
  const { user } = usePrivateAuthContext();
  const { id } = useLocalSearchParams();

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
    refetch,
  } = useQuery(GET_RIDE_DETAILS, {
    variables: { id: +id },
    context: {
      clientName: Clients.Rides,
    },
  });

  // TODO: render body/actions based on if the user is a passenger or a driver
  const body = rideLoading ? (
    <Spinner />
  ) : rideError || rideData === undefined ? (
    <Text>Whoops! Ran into an error when loading the ride details :/</Text>
  ) : !rideData.rideById ? (
    <Center>
      <Text>Could not find this ride</Text>
    </Center>
  ) : (
    <>
      <Text>Ride #{rideData.rideById.id}</Text>
      <Center>
        {rideData.rideById.passengers.some((x) => x.passengerId == user.uid) ? (
          <PassengerActions />
        ) : (
          <DriverActions
            initialStatus={rideData.rideById.status}
            id={rideData.rideById.id}
          />
        )}
      </Center>
    </>
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
