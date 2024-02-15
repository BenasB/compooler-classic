import { Stack } from "expo-router/stack";

const Layout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="locationSelection"
        options={{ presentation: "modal", title: "Choose a location" }}
      />
    </Stack>
  );
};

export default Layout;
