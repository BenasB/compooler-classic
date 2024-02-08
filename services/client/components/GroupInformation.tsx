import { Feather } from "@expo/vector-icons";
import {
  Text,
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  ChevronDownIcon,
  ChevronUpIcon,
  HStack,
  View,
  Center,
  Box,
  useToken,
} from "@gluestack-ui/themed";
import React from "react";
import { useColorScheme } from "react-native";

export enum Days {
  Monday = 1 << 0,
  Tuesday = 1 << 1,
  Wednesday = 1 << 2,
  Thursday = 1 << 3,
  Friday = 1 << 4,
  Saturday = 1 << 5,
  Sunday = 1 << 6,
}

interface Group {
  startTime: string;
  days: Days;
  distanceFrom: number;
  seats: {
    total: number;
    occupied: number;
  };
}

const GroupInformation: React.FC<Group> = (group) => {
  return (
    <Accordion type="single">
      <AccordionItem value="a">
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => {
              return (
                <>
                  <HStack mr="$1">
                    {[...Array(7).keys()].map((i) => (
                      <DayIcon
                        key={i}
                        active={(group.days & (1 << i)) > 0}
                        dayIndex={i}
                      />
                    ))}
                  </HStack>
                  <AccordionTitleText>
                    <Text>{group.startTime}</Text>
                  </AccordionTitleText>
                  <Text>~ {group.distanceFrom} m</Text>
                  {isExpanded ? (
                    <AccordionIcon as={ChevronUpIcon} />
                  ) : (
                    <AccordionIcon as={ChevronDownIcon} />
                  )}
                </>
              );
            }}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <AccordionContentText>
            Description of the commute group
          </AccordionContentText>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const DayIcon: React.FC<{ dayIndex: number; active: boolean }> = ({
  dayIndex,
  active,
}) => {
  const colorMode = useColorScheme();
  const color = useToken(
    "colors",
    !active
      ? colorMode === "light"
        ? "textLight200"
        : "textLight700"
      : colorMode === "light"
      ? "textLight700"
      : "textLight0"
  );

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <View>
      <Feather name="calendar" size={24} color={color}></Feather>
      <Center position="absolute" width={"$full"} height={"$4/5"} bottom={0}>
        <Text fontSize="$2xs" color={color}>
          {days[dayIndex]}
        </Text>
      </Center>
    </View>
  );
};

export default GroupInformation;
