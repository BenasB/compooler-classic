import {
  Center,
  RefreshControl,
  ScrollView,
  Spinner,
  Text,
  VStack,
  SafeAreaView,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import React, { useCallback, useState } from "react";
import GroupInformation from "../../../components/groups/GroupInformation";
import { useMutation, useQuery } from "@apollo/client";
import { usePrivateAuthContext } from "../../../hooks/auth";
import { Link, Stack, useFocusEffect } from "expo-router";
import { gql } from "../../../__generated__";
import { Clients } from "../../../hooks/apollo";

const GET_USER_GROUPS = gql(`
  query GetUserGroups($currentUserId: String!) {
    groups(
      where: {
        or: [
          { driver: { id: { eq: $currentUserId } } }
          { passengers: { some: { id: { eq: $currentUserId } } } }
        ]
      }
    ) {
      id
      startTime
      days
      driver {
        id
      }
      startLocation {
        latitude
        longitude
      }
      endLocation {
        latitude
        longitude
      }
      totalSeats
      passengers {
        id
      }
    }
  }
`);

const LEAVE_GROUP = gql(`
  mutation LeaveGroup($groupId: Int!){
    abandonGroup(input: {id: $groupId}){
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

const LEAVE_UPCOMING_RIDES = gql(`
  mutation LEAVE_UPCOMING_RIDES($groupId: Int!){
    leaveUpcomingRides(input: { groupId: $groupId }) {
      ids
      errors {
        ... on Error {
          message
        }
      }
    } 
  }
`);

const Groups = () => {
  const { user } = usePrivateAuthContext();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
    refetch,
  } = useQuery(GET_USER_GROUPS, {
    variables: {
      currentUserId: user.uid,
    },
    notifyOnNetworkStatusChange: true, // Makes `loading` update when refetching
    context: {
      clientName: Clients.GroupMaker,
    },
  });

  const [
    leaveGroupFunction,
    {
      data: leaveGroupData,
      loading: leaveGroupLoading,
      error: leaveGroupError,
      called: leaveGroupCalled,
    },
  ] = useMutation(LEAVE_GROUP, {
    context: {
      clientName: Clients.GroupMaker,
    },
    onCompleted: (data) => {
      if (data.abandonGroup.errors || !data.abandonGroup.group) return;

      leaveRidesFunction({
        variables: { groupId: data.abandonGroup.group.id },
      });
    },
  });

  const [
    leaveRidesFunction,
    {
      data: leaveRidesData,
      loading: leaveRidesLoading,
      error: leaveRidesError,
      called: leaveRidesCalled,
    },
  ] = useMutation(LEAVE_UPCOMING_RIDES, {
    refetchQueries: [GET_USER_GROUPS],
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
    queryLoading || leaveGroupLoading || leaveRidesLoading ? (
      <Spinner />
    ) : queryError || queryData === undefined ? (
      <Text>Whoops! Ran into an error :/</Text>
    ) : leaveGroupCalled &&
      (leaveGroupError || leaveGroupData === undefined) ? (
      <Text>Whoops! Ran into an error when leaving a group :/</Text>
    ) : leaveRidesCalled &&
      (leaveRidesError || leaveRidesData === undefined) ? (
      <Text>
        Whoops! Ran into an error when leaving the group's upcoming rides :/
      </Text>
    ) : queryData.groups.length === 0 ? (
      <Text color="$secondary400" textAlign="center">
        Seems like you don't have any groups yet!
      </Text>
    ) : (
      <VStack space="md">
        {queryData.groups.map((group) => (
          <GroupInformation
            key={group.id}
            group={{
              startTime: group.startTime
                .replace(/[PTM]/g, "")
                .split("H")
                .map((x) => x.padStart(2, "0"))
                .join(":"),
              days: group.days,
              startLocation: group.startLocation,
              endLocation: group.endLocation,
              seats: {
                total: group.totalSeats,
                occupied: group.passengers.length + 1,
              },
            }}
            button={
              <Button
                variant="outline"
                action="negative"
                onPress={() => {
                  // TODO: Allow group delete/disband for drivers
                  leaveGroupFunction({ variables: { groupId: group.id } });
                }}
              >
                <ButtonText>
                  {group.driver.id === user.uid ? "Disband" : "Leave"}
                </ButtonText>
              </Button>
            }
          />
        ))}
      </VStack>
    );

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "My groups" }} />
      <Center h="$full" p="$5">
        <VStack space="md" h="$full" $base-w={"100%"} $md-w={"60%"} $lg-w={550}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {body}
          </ScrollView>
          <Link href={"/groups/search"} asChild>
            <Button action="positive">
              <ButtonText>Join a group</ButtonText>
            </Button>
          </Link>
          <Link href={"/groups/create"} asChild>
            <Button action="secondary" variant="solid">
              <ButtonText>Create a new group</ButtonText>
            </Button>
          </Link>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Groups;
