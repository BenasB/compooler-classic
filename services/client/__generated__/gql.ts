/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation CreateGroup($input: CreateGroupInput!){\n    createGroup(input: $input){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n": types.CreateGroupDocument,
    "\n  mutation CreateInitialRides($input: CreateNextRidesInput!) {\n    createNextRides(input: $input) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n": types.CreateInitialRidesDocument,
    "\n  query GetUserGroups($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n": types.GetUserGroupsDocument,
    "\n  mutation LeaveGroup($groupId: Int!){\n    abandonGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n": types.LeaveGroupDocument,
    "\n  mutation LEAVE_UPCOMING_RIDES($groupId: Int!){\n    leaveUpcomingRides(input: { groupId: $groupId }) {\n      ids\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    } \n  }\n": types.Leave_Upcoming_RidesDocument,
    "\n  query GetNearestJoinableGroups(\n    $userStartLocation: CoordinatesInput!\n    $userEndLocation: CoordinatesInput!\n    $currentUserId: String!\n  ) {\n    nearestGroups(\n      userStartLocation: $userStartLocation\n      userEndLocation: $userEndLocation\n      where: {\n        and: [\n          { driver: { id: { neq: $currentUserId } } }\n          { passengers: { none: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userStartLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n        distance(to: $userEndLocation)\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n": types.GetNearestJoinableGroupsDocument,
    "\n  mutation JoinGroup($groupId: Int!){\n    joinGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n": types.JoinGroupDocument,
    "\n  mutation JoinUpcomingRides($groupId: Int!){\n    joinUpcomingRides(input: { groupId: $groupId }) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n": types.JoinUpcomingRidesDocument,
    "\n  query GetRideGroup($groupId: Int!) {\n    groupById(id: $groupId) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n": types.GetRideGroupDocument,
    "\n  query GetUserGroupsIdsForRides($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      driver {\n        id\n      }\n      passengers {\n        id\n      }\n    }\n  }\n": types.GetUserGroupsIdsForRidesDocument,
    "\n  query GetAllUserRides($groupIds: [Int!]!, $currentDateTime: DateTime!) {\n    upcoming: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: {gte: $currentDateTime }}\n        ]\n      }\n      order: { startTime: ASC }\n    ) {\n      id\n      startTime\n      status\n    }\n    history: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: { lt: $currentDateTime } }\n        ]\n      }\n      order: { startTime: DESC }\n    ) {\n      id\n      startTime\n      status\n    }\n  }\n": types.GetAllUserRidesDocument,
    "\n  mutation ProgressRide($input: ProgressRideInput!) {\n    progressRide(input: $input) {\n      ride {\n        status\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n": types.ProgressRideDocument,
    "\n  mutation ChangeParticipationStatus($input: ChangeRideParticipationStatusInput!) {\n    changeRideParticipationStatus(input: $input) {\n      ridePassenger{\n        participationStatus\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n": types.ChangeParticipationStatusDocument,
    "\n  query GetRideDetails($id: Int!) {\n    rideById(id: $id) {\n      id\n      startTime\n      groupId\n      status\n      passengers {\n        passengerId\n        participationStatus\n      }\n    }\n  }\n": types.GetRideDetailsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateGroup($input: CreateGroupInput!){\n    createGroup(input: $input){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"): (typeof documents)["\n  mutation CreateGroup($input: CreateGroupInput!){\n    createGroup(input: $input){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateInitialRides($input: CreateNextRidesInput!) {\n    createNextRides(input: $input) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateInitialRides($input: CreateNextRidesInput!) {\n    createNextRides(input: $input) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserGroups($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserGroups($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LeaveGroup($groupId: Int!){\n    abandonGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"): (typeof documents)["\n  mutation LeaveGroup($groupId: Int!){\n    abandonGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LEAVE_UPCOMING_RIDES($groupId: Int!){\n    leaveUpcomingRides(input: { groupId: $groupId }) {\n      ids\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    } \n  }\n"): (typeof documents)["\n  mutation LEAVE_UPCOMING_RIDES($groupId: Int!){\n    leaveUpcomingRides(input: { groupId: $groupId }) {\n      ids\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    } \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetNearestJoinableGroups(\n    $userStartLocation: CoordinatesInput!\n    $userEndLocation: CoordinatesInput!\n    $currentUserId: String!\n  ) {\n    nearestGroups(\n      userStartLocation: $userStartLocation\n      userEndLocation: $userEndLocation\n      where: {\n        and: [\n          { driver: { id: { neq: $currentUserId } } }\n          { passengers: { none: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userStartLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n        distance(to: $userEndLocation)\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetNearestJoinableGroups(\n    $userStartLocation: CoordinatesInput!\n    $userEndLocation: CoordinatesInput!\n    $currentUserId: String!\n  ) {\n    nearestGroups(\n      userStartLocation: $userStartLocation\n      userEndLocation: $userEndLocation\n      where: {\n        and: [\n          { driver: { id: { neq: $currentUserId } } }\n          { passengers: { none: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userStartLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n        distance(to: $userEndLocation)\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation JoinGroup($groupId: Int!){\n    joinGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"): (typeof documents)["\n  mutation JoinGroup($groupId: Int!){\n    joinGroup(input: {id: $groupId}){\n      group {\n        id\n      }\n      errors {\n        ... on Error{\n          message\n        }\n      }\n    } \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation JoinUpcomingRides($groupId: Int!){\n    joinUpcomingRides(input: { groupId: $groupId }) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation JoinUpcomingRides($groupId: Int!){\n    joinUpcomingRides(input: { groupId: $groupId }) {\n      ride {\n        id\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRideGroup($groupId: Int!) {\n    groupById(id: $groupId) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRideGroup($groupId: Int!) {\n    groupById(id: $groupId) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserGroupsIdsForRides($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      driver {\n        id\n      }\n      passengers {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserGroupsIdsForRides($currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      driver {\n        id\n      }\n      passengers {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAllUserRides($groupIds: [Int!]!, $currentDateTime: DateTime!) {\n    upcoming: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: {gte: $currentDateTime }}\n        ]\n      }\n      order: { startTime: ASC }\n    ) {\n      id\n      startTime\n      status\n    }\n    history: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: { lt: $currentDateTime } }\n        ]\n      }\n      order: { startTime: DESC }\n    ) {\n      id\n      startTime\n      status\n    }\n  }\n"): (typeof documents)["\n  query GetAllUserRides($groupIds: [Int!]!, $currentDateTime: DateTime!) {\n    upcoming: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: {gte: $currentDateTime }}\n        ]\n      }\n      order: { startTime: ASC }\n    ) {\n      id\n      startTime\n      status\n    }\n    history: rides(\n      where: {\n        and: [\n          { groupId: { in: $groupIds } }\n          { startTime: { lt: $currentDateTime } }\n        ]\n      }\n      order: { startTime: DESC }\n    ) {\n      id\n      startTime\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ProgressRide($input: ProgressRideInput!) {\n    progressRide(input: $input) {\n      ride {\n        status\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ProgressRide($input: ProgressRideInput!) {\n    progressRide(input: $input) {\n      ride {\n        status\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ChangeParticipationStatus($input: ChangeRideParticipationStatusInput!) {\n    changeRideParticipationStatus(input: $input) {\n      ridePassenger{\n        participationStatus\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ChangeParticipationStatus($input: ChangeRideParticipationStatusInput!) {\n    changeRideParticipationStatus(input: $input) {\n      ridePassenger{\n        participationStatus\n      }\n      errors {\n        ... on Error {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRideDetails($id: Int!) {\n    rideById(id: $id) {\n      id\n      startTime\n      groupId\n      status\n      passengers {\n        passengerId\n        participationStatus\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRideDetails($id: Int!) {\n    rideById(id: $id) {\n      id\n      startTime\n      groupId\n      status\n      passengers {\n        passengerId\n        participationStatus\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;