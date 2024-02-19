import React from "react";
import { StyleProp, ViewStyle } from "react-native";
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

const Map = (props: Props) => {
  const { initialLocation, readOnly, children, style } = props;

  return (
    <MapView
      //@ts-ignore only present in the web package
      options={{
        disableDefaultUI: true,
      }}
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
