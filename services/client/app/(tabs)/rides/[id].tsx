import {
  Center,
  SafeAreaView,
  ScrollView,
  VStack,
  Text,
  Spinner,
} from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Clients } from "../../../hooks/apollo";
import { useQuery } from "@apollo/client";
import { usePrivateAuthContext } from "../../../hooks/auth";
import PassengerActions from "../../../components/rides/details/PassengerActions";
import DriverActions from "../../../components/rides/details/DriverActions";
import { GET_RIDE_DETAILS } from "../../../components/rides/details/query";

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
    <>
      <Text>Ride #{rideData.rideById.id}</Text>
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
