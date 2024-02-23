import { ScrollView, Spinner } from "@gluestack-ui/themed";
import { Text, Center, SafeAreaView, VStack } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
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
    rides(where: { groupId: { in: $groupIds } }) {
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
    variables: {
      currentUserId: user.uid,
    },
  });

  const [
    getAllRides,
    { loading: ridesLoading, error: ridesError, data: ridesData },
  ] = useLazyQuery(GET_ALL_USER_RIDES, {
    context: {
      clientName: Clients.Rides,
    },
  });

  useEffect(() => {
    if (groupsData && groupsData.groups.length > 0) {
      getAllRides({
        variables: { groupIds: groupsData.groups.map((g) => g.id) },
      });
    }
  }, [groupsData]);

  const body =
    groupsLoading || ridesLoading ? (
      <Spinner />
    ) : groupsError ||
      groupsData === undefined ||
      ridesError ||
      ridesData === undefined ? (
      <Text>Whoops! Ran into an error :/</Text>
    ) : groupsData.groups.length === 0 ? (
      <Text color="$secondary400" textAlign="center">
        Seems like you don't have any rides yet! Join a group first.
      </Text>
    ) : (
      ridesData.rides.map((ride) => (
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
