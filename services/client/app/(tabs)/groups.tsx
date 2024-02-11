import {
  Center,
  RefreshControl,
  ScrollView,
  Spinner,
  Text,
  VStack,
  SafeAreaView,
} from "@gluestack-ui/themed";
import React, { useCallback, useState } from "react";
import GroupInformation, { Days } from "../../components/GroupInformation";
import { useQuery } from "@apollo/client";
import { gql } from "../../__generated__/gql";

const GET_GROUPS = gql(`
  query GetGroups {
    groups {
      id
      startTime
      days
      startLocation {
        latitude
        longitude
      }
      endLocation {
        latitude
        longitude
      }
      totalSeats
    }
  }
`);

const Groups = () => {
  const { loading, error, data, refetch } = useQuery(GET_GROUPS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

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
            {data.groups.map((group) => (
              <GroupInformation
                startTime={group.startTime
                  .replace(/[PTM]/g, "")
                  .replace("H", ":")}
                days={group.days}
                startLocation={group.startLocation}
                endLocation={group.endLocation}
                distanceFrom={42}
                seats={{ total: group.totalSeats, occupied: 1 }}
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
