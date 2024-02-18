import { Map } from "@vis.gl/react-google-maps";
import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import { Coordinates } from "../types/group";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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

const NativeMap = (props: Props) => {
  const { initialLocation, readOnly, children, style } = props;

  return (
    <MapView
      style={style}
      provider={PROVIDER_GOOGLE}
      onRegionChangeComplete={(region) => {
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

const WebMap = (props: Props) => {
  return <Map />;
};

export default Platform.select({ native: NativeMap, web: WebMap }) || NativeMap;
