import React, { useEffect, useState } from "react";
import MapView, { LatLng, PROVIDER_GOOGLE, Region } from "react-native-maps";
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
} from "@gluestack-ui/themed";

interface Props {
  startingCoordinates: LatLng;
  onConfirm: (newCoordinates: LatLng) => void;
}

const LocationPicker: React.FC<Props> = ({
  startingCoordinates,
  onConfirm,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [region, setRegion] = useState<Region>({
    ...startingCoordinates,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  useEffect(() => {
    setRegion((prevRegion) => ({ ...prevRegion, ...startingCoordinates }));
  }, [startingCoordinates, showModal]);

  const markerColor = useToken("colors", "red600");

  return (
    <>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Starting location</ButtonText>
      </Button>
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
            <MapView
              style={{
                flex: 1,
              }}
              provider={PROVIDER_GOOGLE}
              onRegionChangeComplete={(region) => {
                setRegion(region);
              }}
              initialRegion={region}
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
            </MapView>
            <ModalFooter>
              <Button
                action="positive"
                w="$full"
                onPress={() => {
                  onConfirm(region);
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
