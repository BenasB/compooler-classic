import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { Coordinates } from "../types/group";
import { Region } from "react-native-maps";
import MapView from "./MapView";

type Props = {
  initialLocation: Coordinates;
  children?: JSX.Element;
  style?: StyleProp<ViewStyle>;
} & (
  | {
      readOnly: true;
    }
  | {
      readOnly: false;
      onLocationChange: (newLocation: Coordinates) => void;
    }
);

// The map is a bit funky looking, because there is not much support for a react native + react native web combo

const Map = (props: Props) => {
  const { initialLocation, readOnly, children, style } = props;

  return (
    <MapView
      options={{
        disableDefaultUI: true,
      }}
      initialCamera={
        Platform.OS === "web"
          ? {
              zoom: 16,
              center: {
                latitude: initialLocation.latitude,
                longitude: initialLocation.longitude,
              },
              heading: 1,
              pitch: 0,
            }
          : undefined
      }
      googleMapsApiKey={process.env.EXPO_PUBLIC_MAPS_API_KEY || "todo-feat-21"}
      style={style}
      provider={"google"}
      onRegionChangeComplete={(region: Region) => {
        if (!readOnly) props.onLocationChange(region);
      }}
      initialRegion={
        !readOnly
          ? {
              ...initialLocation,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }
          : undefined
      }
      scrollEnabled={!readOnly}
      rotateEnabled={!readOnly}
      pitchEnabled={!readOnly}
      zoomEnabled={!readOnly}
      region={
        readOnly
          ? {
              ...initialLocation,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }
          : undefined
      }
    >
      {children}
    </MapView>
  );
};

export default Map;
