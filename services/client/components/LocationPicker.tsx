import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useToken } from "@gluestack-style/react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  Icon,
  CloseIcon,
  ModalFooter,
  ButtonText,
  SafeAreaView,
  Pressable,
  View,
} from "@gluestack-ui/themed";
import { Coordinates } from "../types/group";
import Map from "./Map";

interface Props {
  startingCoordinates: Coordinates;
  onConfirm: (newCoordinates: Coordinates) => void;
}

const LocationPicker = ({ startingCoordinates, onConfirm }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [location, setLocation] = useState<Coordinates>(startingCoordinates);

  useEffect(() => {
    setLocation(startingCoordinates);
  }, [startingCoordinates, showModal]);

  const markerColor = useToken("colors", "red600");

  return (
    <>
      <Pressable onPress={() => setShowModal(true)}>
        <Map
          style={{
            width: "100%",
            height: 200,
            borderRadius: 5,
          }}
          initialLocation={location}
          readOnly={true}
        >
          <MaterialIcons
            name="location-pin"
            size={36}
            color={markerColor}
            style={{
              left: "50%",
              marginLeft: -18,
              marginTop: -36,
              position: "absolute",
              top: "50%",
            }}
          />
        </Map>
      </Pressable>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size={"full"}
      >
        <SafeAreaView>
          <ModalContent flex={1}>
            <ModalHeader w="$full">
              <Heading size="lg">Select a location</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </ModalHeader>
            <Map
              style={{
                flex: 1,
              }}
              readOnly={false}
              onLocationChange={(newLoc) => {
                setLocation(newLoc);
              }}
              initialLocation={location}
            >
              <View flex={1} pointerEvents="none">
                <MaterialIcons
                  name="location-pin"
                  size={36}
                  color={markerColor}
                  style={{
                    left: "50%",
                    marginLeft: -18,
                    marginTop: -36,
                    position: "absolute",
                    top: "50%",
                  }}
                />
              </View>
            </Map>
            <ModalFooter>
              <Button
                action="positive"
                w="$full"
                onPress={() => {
                  onConfirm(location);
                  setShowModal(false);
                }}
              >
                <ButtonText>Confirm</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default LocationPicker;
