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

export const GET_USER_GROUPS = gql(`
  query GetUserGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {
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

export const LEAVE_GROUP = gql(`
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

const Groups = () => {
  const { user } = usePrivateAuthContext();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
    refetch,
  } = useQuery(GET_USER_GROUPS, {
    variables: {
      userLocation: {
        latitude: 54.72090502968378,
        longitude: 25.28279660188754,
      },
      currentUserId: user.uid,
    },
    notifyOnNetworkStatusChange: true, // Makes `loading` update when refetching
  });

  const [
    mutateFunction,
    {
      data: mutationData,
      loading: mutationLoading,
      error: mutationError,
      called: mutationCalled,
    },
  ] = useMutation(LEAVE_GROUP);

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
    queryLoading || mutationLoading ? (
      <Spinner />
    ) : queryError || queryData === undefined ? (
      <Text>Whoops! Ran into an error :/</Text>
    ) : mutationCalled && (mutationError || mutationData === undefined) ? (
      <Text>Whoops! Ran into an error when leaving a group :/</Text>
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
                action="negative"
                onPress={() => {
                  mutateFunction({ variables: { groupId: group.id } });
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
        <VStack
          space="md"
          h="$full"
          $base-w={"100%"}
          $md-w={"60%"}
          $lg-w={"550px"}
        >
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {body}
          </ScrollView>
          <Link href={"/groups/join"} asChild>
            <Button action="positive">
              <ButtonText>Join a new group</ButtonText>
            </Button>
          </Link>
        </VStack>
      </Center>
    </SafeAreaView>
  );
};

export default Groups;
