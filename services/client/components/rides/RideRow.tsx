import React from "react";
import { RideStatus } from "../../__generated__/graphql";
import { Box, HStack, Text, useToken } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

interface Props {
  id: number;
  date: string;
  time: string;
  status: RideStatus;
}

const RideRow = ({ id, date, time, status }: Props) => {
  const colorScheme = useColorScheme();
  const lightTextColor = useToken("colors", "textLight300");
  const darkTextColor = useToken("colors", "textLight700");
  const iconColor = colorScheme === "light" ? darkTextColor : lightTextColor;

  return (
    <Link href={`/rides/${id}`}>
      <Box
        borderColor="$borderLight200"
        borderRadius="$lg"
        borderWidth="$1"
        p="$7"
        bg="$backgroundLight200"
        $dark-bg="$backgroundDark900"
        $dark-borderColor="$borderDark800"
        w="$full"
      >
        <HStack
          space="md"
          w="$full"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text>#{id}</Text>
          <HStack space="lg">
            <Text>{date}</Text>
            <Text>{time}</Text>
          </HStack>
          {status === RideStatus.Upcoming ? (
            <Feather name="clock" size={24} color={iconColor} />
          ) : status === RideStatus.InProgress ? (
            <Feather name="navigation" size={24} color={iconColor} />
          ) : status === RideStatus.Done ? (
            <Feather name="check-circle" size={24} color={iconColor} />
          ) : (
            <Feather name="x-circle" size={24} color={iconColor} />
          )}
        </HStack>
      </Box>
    </Link>
  );
};

export default RideRow;
