import { ScrollView, Spinner } from "@gluestack-ui/themed";
import { Text, Center, SafeAreaView, VStack } from "@gluestack-ui/themed";
import { Stack, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { gql } from "../../../__generated__";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Clients } from "../../../hooks/apollo";
import { usePrivateAuthContext } from "../../../hooks/auth";

const GET_USER_GROUPS_IDS_FOR_RIDES = gql(`
  query GetUserGroupsIdsForRides($currentUserId: String!) {
    groups(
      where: {
        or: [
          { driver: { id: { eq: $currentUserId } } }
          { passengers: { some: { id: { eq: $currentUserId } } } }
        ]
      }
    ) {
      id
      driver {
        id
      }
      passengers {
        id
      }
    }
  }
`);

const GET_ALL_USER_RIDES = gql(`
  query GetAllUserRides($groupIds: [Int!]!) {
    rides(where: { groupId: { in: $groupIds } }, order: { startTime: ASC }) {
        id
        startTime
        status
    }
  }
`);

const Index = () => {
  const { user } = usePrivateAuthContext();

  const {
    loading: groupsLoading,
    error: groupsError,
    data: groupsData,
    refetch,
  } = useQuery(GET_USER_GROUPS_IDS_FOR_RIDES, {
    context: {
      clientName: Clients.GroupMaker,
    },
    notifyOnNetworkStatusChange: true,
    variables: {
      currentUserId: user.uid,
    },
    onCompleted: (data) => {
      if (data.groups.length === 0) return;

      getAllRides({ variables: { groupIds: data.groups.map((g) => g.id) } });
    },
  });

  const [
    getAllRides,
    {
      loading: ridesLoading,
      error: ridesError,
      data: ridesData,
      called: ridesCalled,
    },
  ] = useLazyQuery(GET_ALL_USER_RIDES, {
    context: {
      clientName: Clients.Rides,
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const body =
    groupsLoading || ridesLoading ? (
      <Spinner />
    ) : groupsError || groupsData === undefined ? (
      <Text>Whoops! Ran into an error the groups for your rides :/</Text>
    ) : ridesCalled && (ridesError || ridesData === undefined) ? (
      <Text>Whoops! Ran into an error when loading your rides :/</Text>
    ) : groupsData.groups.length === 0 ? (
      <Text color="$secondary400" textAlign="center">
        Seems like you don't have any rides yet! Join a group first.
      </Text>
    ) : (
      ridesData?.rides.map((ride) => (
        <Text key={ride.id}>
          Ride {ride.id} {ride.startTime} {ride.status}
        </Text>
      ))
    );

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "My rides" }} />
      <Center h="$full" p="$5">
        <VStack space="md" h="$full" $base-w={"100%"} $md-w={"60%"} $lg-w={550}>
          <ScrollView>{body}</ScrollView>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Index;
