import { A } from "@expo/html-elements";
import { Feather } from "@expo/vector-icons";
import {
  Text,
  Accordion,
  AccordionContent,
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
  useToken,
  Image,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { useColorScheme } from "react-native";
import { Days } from "../../types/group";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Group {
  startTime: string;
  days: Days;
  distanceFrom: number;
  startLocation: Coordinates;
  endLocation: Coordinates;
  seats: {
    total: number;
    occupied: number;
  };
}

interface Props {
  group: Group;
  button?: React.JSX.Element;
}

const GroupInformation: React.FC<Props> = ({ group, button }) => {
  const colorMode = useColorScheme();
  const color = useToken(
    "colors",
    colorMode === "light" ? "textLight700" : "textLight0"
  );

  return (
    <>
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
                    <Text>~ {group.distanceFrom.toFixed()} m</Text>
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
            <VStack space="md">
              <A
                href={`https://www.google.com/maps/dir/?api=1&origin=${group.startLocation.latitude}%2C${group.startLocation.longitude}&destination=${group.endLocation.latitude}%2C${group.endLocation.longitude}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  alt="The start location and end location of this commute group"
                  w={"$full"}
                  h={undefined}
                  aspectRatio={640 / 320}
                  borderRadius={5}
                  source={`https://maps.googleapis.com/maps/api/staticmap?size=640x320&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}&markers=color:green%7Clabel%3AS%7C${group.startLocation.latitude}%2C${group.startLocation.longitude}&markers=color:red%7Clabel%3AF%7C${group.endLocation.latitude}%2C${group.endLocation.longitude}`}
                />
              </A>
              <HStack space="md">
                <Feather name="user" size={24} color={color} />
                <Text>
                  {group.seats.occupied + 1}/{group.seats.total + 1}
                </Text>
              </HStack>
              <Center>{button}</Center>
            </VStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
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
