import React from "react";
import {
  Button,
  ButtonText,
  Center,
  HStack,
  Spinner,
  Text,
} from "@gluestack-ui/themed";
import {
  RideParticipationStatus,
  RideStatus,
} from "../../../__generated__/graphql";
import { gql } from "../../../__generated__";
import { useMutation } from "@apollo/client";
import { Clients } from "../../../hooks/apollo";
import { GET_RIDE_DETAILS } from "./query";

interface Props {
  id: number;
  rideStatus: RideStatus;
  participationStatus: RideParticipationStatus;
}

const CHANGE_PARTICIPATION_STATUS = gql(`
  mutation ChangeParticipationStatus($input: ChangeRideParticipationStatusInput!) {
    changeRideParticipationStatus(input: $input) {
      ridePassenger{
        participationStatus
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`);

const PassengerActions = ({ id, rideStatus, participationStatus }: Props) => {
  const [
    participationFunction,
    {
      data: participationData,
      loading: participationLoading,
      error: participationError,
      called: participationCalled,
    },
  ] = useMutation(CHANGE_PARTICIPATION_STATUS, {
    context: {
      clientName: Clients.Rides,
    },
    refetchQueries: [GET_RIDE_DETAILS],
  });

  if (participationLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (
    participationCalled &&
    (participationError || participationData === undefined)
  )
    return (
      <Center>
        <Text>Action failed</Text>
      </Center>
    );

  return (
    <HStack>
      <Button
        isDisabled={rideStatus !== RideStatus.Upcoming}
        onPress={async () =>
          participationFunction({
            variables: {
              input: {
                rideId: id,
                status:
                  participationStatus === RideParticipationStatus.Participate
                    ? RideParticipationStatus.Skip
                    : RideParticipationStatus.Participate,
              },
            },
          })
        }
      >
        <ButtonText>
          {participationStatus === RideParticipationStatus.Participate
            ? "Skip"
            : "Join"}
        </ButtonText>
      </Button>
    </HStack>
  );
};

export default PassengerActions;
