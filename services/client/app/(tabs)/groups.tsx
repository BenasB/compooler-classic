import {
  Center,
  RefreshControl,
  ScrollView,
  Spinner,
  Text,
  VStack,
  SafeAreaView,
} from "@gluestack-ui/themed";
import React, { useCallback, useMemo, useState } from "react";
import GroupInformation from "../../components/groups/GroupInformation";
import { useQuery } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import { usePrivateAuthContext } from "../../hooks/auth";

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

const Groups = () => {
  const { user } = usePrivateAuthContext();

  const { loading, error, data, refetch } = useQuery(GET_JOINABLE_GROUPS, {
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

  // TODO: Do not sort on the client :/
  const sortedGroups = useMemo(() => {
    if (data === undefined) return [];

    return [...data.groups].sort((a, b) => {
      if (a.startLocation.distance < b.startLocation.distance) {
        return -1;
      }
      if (a.startLocation.distance > b.startLocation.distance) {
        return 1;
      }
      return 0;
    });
  }, [data]);

  if (loading)
    return (
      <Center h="$full">
        <Spinner />
      </Center>
    );

  if (error || data === undefined) {
    return (
      <Center h="$full">
        <Text>Whoops! Ran into an error :/</Text>
      </Center>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView
        h="$full"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Center m="$5">
          <VStack space="md" $base-w={"100%"} $md-w={"60%"} $lg-w={"550px"}>
            {sortedGroups.map((group) => (
              <GroupInformation
                startTime={group.startTime
                  .replace(/[PTM]/g, "")
                  .replace("H", ":")}
                days={group.days}
                startLocation={group.startLocation}
                endLocation={group.endLocation}
                distanceFrom={group.startLocation.distance}
                seats={{
                  total: group.totalSeats,
                  occupied: group.passengers.length,
                }}
                key={group.id}
              />
            ))}
          </VStack>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Groups;
