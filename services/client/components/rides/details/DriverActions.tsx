import React from "react";
import {
  Button,
  ButtonGroup,
  ButtonText,
  Center,
  HStack,
  Spinner,
  Text,
} from "@gluestack-ui/themed";
import { gql } from "../../../__generated__";
import { useMutation } from "@apollo/client";
import { Clients } from "../../../hooks/apollo";
import { RideStatus } from "../../../__generated__/graphql";
import { GET_RIDE_DETAILS } from "./query";

const PROGRESS_RIDE = gql(`
  mutation ProgressRide($input: ProgressRideInput!) {
    progressRide(input: $input) {
      ride {
        status
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`);

interface Props {
  id: number;
  status: RideStatus;
}

const DriverActions = ({ id, status }: Props) => {
  const [
    progressFunction,
    {
      data: progressData,
      loading: progressLoading,
      error: progressError,
      called: progressCalled,
    },
  ] = useMutation(PROGRESS_RIDE, {
    context: {
      clientName: Clients.Rides,
    },
    refetchQueries: [GET_RIDE_DETAILS],
  });

  if (progressLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (progressCalled && (progressError || progressData === undefined))
    return (
      <Center>
        <Text>Action failed</Text>
      </Center>
    );

  if (status === RideStatus.Cancelled || status === RideStatus.Done)
    return null;

  if (status === RideStatus.InProgress)
    return (
      <HStack>
        <Button
          onPress={() =>
            progressFunction({
              variables: { input: { id: id, newStatus: RideStatus.Done } },
            })
          }
        >
          <ButtonText>End</ButtonText>
        </Button>
      </HStack>
    );

  if (status === RideStatus.Upcoming)
    return (
      <ButtonGroup space="md">
        <Button
          onPress={() =>
            progressFunction({
              variables: {
                input: { id: id, newStatus: RideStatus.InProgress },
              },
            })
          }
        >
          <ButtonText>Start</ButtonText>
        </Button>
        <Button
          action="negative"
          onPress={() =>
            progressFunction({
              variables: { input: { id: id, newStatus: RideStatus.Cancelled } },
            })
          }
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
      </ButtonGroup>
    );
};

export default DriverActions;
