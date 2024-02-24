import { gql } from "../../../__generated__";

export const GET_RIDE_DETAILS = gql(`
  query GetRideDetails($id: Int!) {
    rideById(id: $id) {
      id
      startTime
      groupId
      status
      passengers {
        passengerId
        participationStatus
      }
    }
  }
`);
