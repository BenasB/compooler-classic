import { Feather } from "@expo/vector-icons";
import {
  View,
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
  const colorMode = useColorScheme();

  return (
    <Accordion type="single">
      <AccordionItem value="a">
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => {
              return (
                <>
                  <HStack mr="$1">
                    {[...Array(7).keys()].map((i) =>
                      (group.days & (1 << i)) > 0 ? (
                        <Feather
                          name="calendar"
                          size={24}
                          color={colorMode === "light" ? "black" : "white"}
                          key={i}
                        />
                      ) : (
                        <Feather
                          name="calendar"
                          size={24}
                          color="gray"
                          key={i}
                        />
                      )
                    )}
                  </HStack>
                  <AccordionTitleText>
                    <Text>{group.startTime}</Text>
                  </AccordionTitleText>
                  <Text>{group.distanceFrom}</Text>
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

export default GroupInformation;
