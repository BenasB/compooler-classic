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
import { gql, useQuery } from "@apollo/client";

const GET_GROUPS = gql`
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
`;

const Groups = () => {
  const { loading, error, data } = useQuery(GET_GROUPS);

  if (loading)
    return (
      <Center h="$full">
        <Spinner />
      </Center>
    );

  if (error) {
    console.log(error);
    return (
      <Center h="$full">
        <Spinner color="red" />
      </Center>
    );
  }

  console.log(data);

  return (
    <ScrollView>
      <SafeAreaView>
        <Center m="$5">
          <VStack space="md" $base-w={"100%"} $md-w={"60%"} $lg-w={"550px"}>
            <GroupInformation
              startTime={"8:45"}
              days={Days.Monday | Days.Tuesday | Days.Friday}
              distanceFrom={230}
              seats={{
                total: 3,
                occupied: 1,
              }}
              startLocation={{
                latitude: 54.68684135799622,
                longitude: 25.291279064916015,
              }}
              endLocation={{
                latitude: 54.68964071691106,
                longitude: 25.270779836883182,
              }}
            />
            <GroupInformation
              startTime={"8:15"}
              days={Days.Thursday | Days.Friday}
              distanceFrom={120}
              seats={{
                total: 3,
                occupied: 2,
              }}
              startLocation={{
                latitude: 54.71918753513158,
                longitude: 25.279961402373566,
              }}
              endLocation={{
                latitude: 54.70195005724908,
                longitude: 25.259333670765923,
              }}
            />
            <GroupInformation
              startTime={"9:10"}
              days={Days.Wednesday | Days.Thursday | Days.Friday}
              distanceFrom={170}
              seats={{
                total: 2,
                occupied: 0,
              }}
              startLocation={{
                latitude: 54.69854326973004,
                longitude: 25.223188899216552,
              }}
              endLocation={{
                latitude: 54.685909310459834,
                longitude: 25.260080299307223,
              }}
            />
          </VStack>
        </Center>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Groups;
