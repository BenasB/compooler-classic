import {
  Center,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { loading, error, data } = useQuery(GET_GROUPS);

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
    <ScrollView>
      <SafeAreaView>
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
      </SafeAreaView>
    </ScrollView>
  );
};

export default Groups;
