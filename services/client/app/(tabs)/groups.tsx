import { Center, ScrollView, Text, VStack } from "@gluestack-ui/themed";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupInformation, { Days } from "../../components/GroupInformation";

const Groups = () => {
  return (
    <ScrollView>
      <SafeAreaView>
        <Center m="$5">
          <VStack space="md">
            <GroupInformation
              startTime={"8:45"}
              days={Days.Monday | Days.Tuesday | Days.Friday}
              distanceFrom={230}
              seats={{
                total: 3,
                occupied: 1,
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
            />
            <GroupInformation
              startTime={"9:10"}
              days={Days.Wednesday | Days.Thursday | Days.Friday}
              distanceFrom={170}
              seats={{
                total: 2,
                occupied: 0,
              }}
            />
          </VStack>
        </Center>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Groups;
