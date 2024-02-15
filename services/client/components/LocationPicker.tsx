import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { useToken } from "@gluestack-style/react";

interface Props {
  region: Region;
  onRegionChange: (newRegion: Region) => void;
}

const LocationPicker: React.FC<Props> = ({ region, onRegionChange }) => {
  const markerColor = useToken("colors", "red600");

  return (
    <MapView
      style={{ width: "100%", height: "100%" }}
      provider={PROVIDER_GOOGLE}
      onRegionChangeComplete={(region) => {
        onRegionChange(region);
      }}
      region={region}
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
  );
};

export default LocationPicker;
