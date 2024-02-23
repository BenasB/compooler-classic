import {
  Text,
  Center,
  SafeAreaView,
  VStack,
  ScrollView,
  Spinner,
  RefreshControl,
} from "@gluestack-ui/themed";
import { Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { gql } from "../../../__generated__";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Clients } from "../../../hooks/apollo";
import { usePrivateAuthContext } from "../../../hooks/auth";
import RideRow from "../../../components/rides/RideRow";

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

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

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
      <VStack space={"lg"}>
        {ridesData?.rides.map((ride) => (
          <RideRow
            key={ride.id}
            date={ride.startTime.split("T")[0].split("-").slice(1).join("-")}
            time={ride.startTime.split("T")[1].split(":").slice(0, 2).join(":")}
            id={ride.id}
            status={ride.status}
          />
        ))}
      </VStack>
    );

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "My rides" }} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Center h="$full" w="$full" p="$5">
          <VStack
            space="md"
            h="$full"
            $base-w={"100%"}
            $md-w={"60%"}
            $lg-w={550}
          >
            {body}
          </VStack>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
