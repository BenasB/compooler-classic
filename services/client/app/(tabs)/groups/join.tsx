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
import React, { useCallback, useMemo, useState } from "react";
import GroupInformation from "../../../components/groups/GroupInformation";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "../../../__generated__/gql";
import { usePrivateAuthContext } from "../../../hooks/auth";
import { Stack, router } from "expo-router";
import { GET_USER_GROUPS } from ".";

const GET_JOINABLE_GROUPS = gql(`
  query GetJoinableGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {
    groups(
      where: {
        and: [
          { driver: { id: { neq: $currentUserId } } }
          { passengers: { none: { id: { eq: $currentUserId } } } }
        ]
      }
    ) {
      id
      startTime
      days
      startLocation {
        latitude
        longitude
        distance(to: $userLocation)
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

const JOIN_GROUP = gql(`
  mutation JoinGroup($groupId: Int!){
    joinGroup(input: {id: $groupId}){
      group{
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

const Join = () => {
  const { user } = usePrivateAuthContext();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
    refetch,
  } = useQuery(GET_JOINABLE_GROUPS, {
    variables: {
      userLocation: {
        latitude: 54.72090502968378,
        longitude: 25.28279660188754,
      },
      currentUserId: user.uid,
    },
  });

  const [
    mutateFunction,
    {
      data: mutationData,
      loading: mutationLoading,
      error: mutationError,
      called: mutationCalled,
    },
  ] = useMutation(JOIN_GROUP, {
    refetchQueries: [GET_JOINABLE_GROUPS, GET_USER_GROUPS],
  });

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  // TODO: Do not sort on the client :/
  const sortedGroups = useMemo(() => {
    if (queryData === undefined) return [];

    return [...queryData.groups].sort((a, b) => {
      if (a.startLocation.distance < b.startLocation.distance) {
        return -1;
      }
      if (a.startLocation.distance > b.startLocation.distance) {
        return 1;
      }
      return 0;
    });
  }, [queryData]);

  const body =
    queryLoading || mutationLoading ? (
      <Spinner />
    ) : queryError || queryData === undefined ? (
      <Text>Whoops! Ran into an error :/</Text>
    ) : mutationCalled && (mutationError || mutationData === undefined) ? (
      <Text>Whoops! Ran into an error when joining a group :/</Text>
    ) : queryData.groups.length === 0 ? (
      <Text color="$secondary400" textAlign="center">
        Seems like there are no new groups you can join :/
      </Text>
    ) : (
      <VStack space="md">
        {sortedGroups.map((group) => (
          <GroupInformation
            key={group.id}
            group={{
              startTime: group.startTime
                .replace(/[PTM]/g, "")
                .replace("H", ":"),
              days: group.days,
              startLocation: group.startLocation,
              endLocation: group.endLocation,
              distanceFrom: group.startLocation.distance,
              seats: {
                total: group.totalSeats,
                occupied: group.passengers.length,
              },
            }}
            button={
              <Button
                variant="outline"
                action="positive"
                onPress={async () => {
                  await mutateFunction({
                    variables: {
                      groupId: group.id,
                    },
                  });
                  router.replace("/groups");
                }}
              >
                <ButtonText>Join</ButtonText>
              </Button>
            }
          />
        ))}
      </VStack>
    );

  return (
    <SafeAreaView h="$full">
      <Stack.Screen options={{ title: "Join a new group" }} />
      <Center h="$full" p="$5">
        <VStack space="md" h="$full">
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            $base-w={"100%"}
            $md-w={"60%"}
            $lg-w={"550px"}
          >
            {body}
          </ScrollView>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Join;
