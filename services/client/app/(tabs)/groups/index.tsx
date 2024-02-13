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
import { useQuery } from "@apollo/client";
import { gql } from "../../../__generated__/gql";
import { usePrivateAuthContext } from "../../../hooks/auth";
import { Link, Stack } from "expo-router";

const GET_USER_GROUPS = gql(`
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

const Groups = () => {
  const { user } = usePrivateAuthContext();

  const { loading, error, data, refetch } = useQuery(GET_USER_GROUPS, {
    variables: {
      userLocation: {
        latitude: 54.72090502968378,
        longitude: 25.28279660188754,
      },
      currentUserId: user.uid,
    },
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const body = loading ? (
    <Spinner />
  ) : error || data === undefined ? (
    <Text>Whoops! Ran into an error :/</Text>
  ) : data.groups.length === 0 ? (
    <Text color="$secondary400" textAlign="center">
      Seems like you don't have any groups yet!
    </Text>
  ) : (
    <VStack space="md">
      {data.groups.map((group) => (
        <GroupInformation
          key={group.id}
          group={{
            startTime: group.startTime.replace(/[PTM]/g, "").replace("H", ":"),
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
            <Button variant="outline" action="negative">
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
