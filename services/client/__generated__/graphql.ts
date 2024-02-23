/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: string; output: string; }
  /** The `TimeSpan` scalar represents an ISO-8601 compliant duration type. */
  TimeSpan: { input: string; output: string; }
};

export type AbandonGroupError = ArgumentError | AuthenticationError;

export type AbandonGroupInput = {
  id: Scalars['Int']['input'];
};

export type AbandonGroupPayload = {
  __typename?: 'AbandonGroupPayload';
  errors?: Maybe<Array<AbandonGroupError>>;
  group?: Maybe<Group>;
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

export type ArgumentError = Error & {
  __typename?: 'ArgumentError';
  message: Scalars['String']['output'];
  paramName?: Maybe<Scalars['String']['output']>;
};

export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  message: Scalars['String']['output'];
};

export type ChangeRideParticipationStatusError = ArgumentError | AuthenticationError | InvalidOperationError;

export type ChangeRideParticipationStatusInput = {
  rideId: Scalars['Int']['input'];
  status: RideParticipationStatus;
};

export type ChangeRideParticipationStatusPayload = {
  __typename?: 'ChangeRideParticipationStatusPayload';
  errors?: Maybe<Array<ChangeRideParticipationStatusError>>;
  ridePassenger?: Maybe<Array<RidePassenger>>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  distance: Scalars['Float']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};


export type CoordinatesDistanceArgs = {
  to: CoordinatesInput;
};

export type CoordinatesFilterInput = {
  and?: InputMaybe<Array<CoordinatesFilterInput>>;
  latitude?: InputMaybe<FloatOperationFilterInput>;
  longitude?: InputMaybe<FloatOperationFilterInput>;
  or?: InputMaybe<Array<CoordinatesFilterInput>>;
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CoordinatesSortInput = {
  latitude?: InputMaybe<SortEnumType>;
  longitude?: InputMaybe<SortEnumType>;
};

export type CreateGroupError = AuthenticationError;

export type CreateGroupInput = {
  days: Scalars['Int']['input'];
  endLocation: CoordinatesInput;
  startLocation: CoordinatesInput;
  startTime: Scalars['TimeSpan']['input'];
  totalSeats: Scalars['Int']['input'];
};

export type CreateGroupPayload = {
  __typename?: 'CreateGroupPayload';
  errors?: Maybe<Array<CreateGroupError>>;
  group?: Maybe<Group>;
};

export type CreateNextRidesError = ArgumentError | AuthenticationError;

export type CreateNextRidesInput = {
  count?: InputMaybe<Scalars['Int']['input']>;
  groupId: Scalars['Int']['input'];
};

export type CreateNextRidesPayload = {
  __typename?: 'CreateNextRidesPayload';
  errors?: Maybe<Array<CreateNextRidesError>>;
  ride?: Maybe<Array<Ride>>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DaysOfWeekOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type DeleteGroupError = ArgumentError | AuthenticationError;

export type DeleteGroupInput = {
  id: Scalars['Int']['input'];
};

export type DeleteGroupPayload = {
  __typename?: 'DeleteGroupPayload';
  errors?: Maybe<Array<DeleteGroupError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type Error = {
  message: Scalars['String']['output'];
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

export type Group = {
  __typename?: 'Group';
  days: Scalars['Int']['output'];
  driver: User;
  endLocation: Coordinates;
  id: Scalars['Int']['output'];
  passengers: Array<User>;
  startLocation: Coordinates;
  startTime: Scalars['TimeSpan']['output'];
  totalSeats: Scalars['Int']['output'];
};

export type GroupFilterInput = {
  and?: InputMaybe<Array<GroupFilterInput>>;
  days?: InputMaybe<DaysOfWeekOperationFilterInput>;
  driver?: InputMaybe<UserFilterInput>;
  endLocation?: InputMaybe<CoordinatesFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<GroupFilterInput>>;
  passengers?: InputMaybe<ListFilterInputTypeOfUserFilterInput>;
  startLocation?: InputMaybe<CoordinatesFilterInput>;
  startTime?: InputMaybe<TimeSpanOperationFilterInput>;
  totalSeats?: InputMaybe<IntOperationFilterInput>;
};

export type GroupSortInput = {
  days?: InputMaybe<SortEnumType>;
  driver?: InputMaybe<UserSortInput>;
  endLocation?: InputMaybe<CoordinatesSortInput>;
  id?: InputMaybe<SortEnumType>;
  startLocation?: InputMaybe<CoordinatesSortInput>;
  startTime?: InputMaybe<SortEnumType>;
  totalSeats?: InputMaybe<SortEnumType>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type InvalidOperationError = Error & {
  __typename?: 'InvalidOperationError';
  message: Scalars['String']['output'];
};

export type JoinGroupError = ArgumentError | AuthenticationError;

export type JoinGroupInput = {
  id: Scalars['Int']['input'];
};

export type JoinGroupPayload = {
  __typename?: 'JoinGroupPayload';
  errors?: Maybe<Array<JoinGroupError>>;
  group?: Maybe<Group>;
};

export type JoinUpcomingRidesError = ArgumentError | AuthenticationError;

export type JoinUpcomingRidesInput = {
  groupId: Scalars['Int']['input'];
};

export type JoinUpcomingRidesPayload = {
  __typename?: 'JoinUpcomingRidesPayload';
  errors?: Maybe<Array<JoinUpcomingRidesError>>;
  ride?: Maybe<Array<Ride>>;
};

export type LeaveUpcomingRidesError = ArgumentError | AuthenticationError;

export type LeaveUpcomingRidesInput = {
  groupId: Scalars['Int']['input'];
};

export type LeaveUpcomingRidesPayload = {
  __typename?: 'LeaveUpcomingRidesPayload';
  errors?: Maybe<Array<LeaveUpcomingRidesError>>;
  ids?: Maybe<Array<Scalars['Int']['output']>>;
};

export type ListFilterInputTypeOfGroupFilterInput = {
  all?: InputMaybe<GroupFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<GroupFilterInput>;
  some?: InputMaybe<GroupFilterInput>;
};

export type ListFilterInputTypeOfRidePassengerFilterInput = {
  all?: InputMaybe<RidePassengerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RidePassengerFilterInput>;
  some?: InputMaybe<RidePassengerFilterInput>;
};

export type ListFilterInputTypeOfUserFilterInput = {
  all?: InputMaybe<UserFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<UserFilterInput>;
  some?: InputMaybe<UserFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  abandonGroup: AbandonGroupPayload;
  changeRideParticipationStatus: ChangeRideParticipationStatusPayload;
  createGroup: CreateGroupPayload;
  createNextRides: CreateNextRidesPayload;
  deleteGroup: DeleteGroupPayload;
  joinGroup: JoinGroupPayload;
  joinUpcomingRides: JoinUpcomingRidesPayload;
  leaveUpcomingRides: LeaveUpcomingRidesPayload;
  progressRide: ProgressRidePayload;
};


export type MutationAbandonGroupArgs = {
  input: AbandonGroupInput;
};


export type MutationChangeRideParticipationStatusArgs = {
  input: ChangeRideParticipationStatusInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateNextRidesArgs = {
  input: CreateNextRidesInput;
};


export type MutationDeleteGroupArgs = {
  input: DeleteGroupInput;
};


export type MutationJoinGroupArgs = {
  input: JoinGroupInput;
};


export type MutationJoinUpcomingRidesArgs = {
  input: JoinUpcomingRidesInput;
};


export type MutationLeaveUpcomingRidesArgs = {
  input: LeaveUpcomingRidesInput;
};


export type MutationProgressRideArgs = {
  input: ProgressRideInput;
};

export type ProgressRideError = ArgumentError | AuthenticationError | InvalidOperationError;

export type ProgressRideInput = {
  id: Scalars['Int']['input'];
  newStatus: RideStatus;
};

export type ProgressRidePayload = {
  __typename?: 'ProgressRidePayload';
  errors?: Maybe<Array<ProgressRideError>>;
  ride?: Maybe<Ride>;
};

export type Query = {
  __typename?: 'Query';
  groupById?: Maybe<Group>;
  groups: Array<Group>;
  nearestGroups: Array<Group>;
  rideById?: Maybe<Ride>;
  rides: Array<Ride>;
  ridesById: Array<Ride>;
};


export type QueryGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGroupsArgs = {
  order?: InputMaybe<Array<GroupSortInput>>;
  where?: InputMaybe<GroupFilterInput>;
};


export type QueryNearestGroupsArgs = {
  userEndLocation: CoordinatesInput;
  userStartLocation: CoordinatesInput;
  where?: InputMaybe<GroupFilterInput>;
};


export type QueryRideByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRidesArgs = {
  order?: InputMaybe<Array<RideSortInput>>;
  where?: InputMaybe<RideFilterInput>;
};


export type QueryRidesByIdArgs = {
  ids: Array<Scalars['Int']['input']>;
};

export type Ride = {
  __typename?: 'Ride';
  groupId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  passengers: Array<RidePassenger>;
  /** This datetime will always be represented as UTC+0 but treat it as local (to the group's location) when consuming */
  startTime: Scalars['DateTime']['output'];
  status: RideStatus;
};

export type RideFilterInput = {
  and?: InputMaybe<Array<RideFilterInput>>;
  groupId?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<RideFilterInput>>;
  passengers?: InputMaybe<ListFilterInputTypeOfRidePassengerFilterInput>;
  startTime?: InputMaybe<DateTimeOperationFilterInput>;
  status?: InputMaybe<RideStatusOperationFilterInput>;
};

export enum RideParticipationStatus {
  Participate = 'PARTICIPATE',
  Skip = 'SKIP'
}

export type RideParticipationStatusOperationFilterInput = {
  eq?: InputMaybe<RideParticipationStatus>;
  in?: InputMaybe<Array<RideParticipationStatus>>;
  neq?: InputMaybe<RideParticipationStatus>;
  nin?: InputMaybe<Array<RideParticipationStatus>>;
};

export type RidePassenger = {
  __typename?: 'RidePassenger';
  id: Scalars['Int']['output'];
  participationStatus: RideParticipationStatus;
  passengerId: Scalars['String']['output'];
};

export type RidePassengerFilterInput = {
  and?: InputMaybe<Array<RidePassengerFilterInput>>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<RidePassengerFilterInput>>;
  participationStatus?: InputMaybe<RideParticipationStatusOperationFilterInput>;
  passengerId?: InputMaybe<StringOperationFilterInput>;
};

export type RideSortInput = {
  groupId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  startTime?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export enum RideStatus {
  Cancelled = 'CANCELLED',
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Upcoming = 'UPCOMING'
}

export type RideStatusOperationFilterInput = {
  eq?: InputMaybe<RideStatus>;
  in?: InputMaybe<Array<RideStatus>>;
  neq?: InputMaybe<RideStatus>;
  nin?: InputMaybe<Array<RideStatus>>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type TimeSpanOperationFilterInput = {
  eq?: InputMaybe<Scalars['TimeSpan']['input']>;
  gt?: InputMaybe<Scalars['TimeSpan']['input']>;
  gte?: InputMaybe<Scalars['TimeSpan']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['TimeSpan']['input']>>>;
  lt?: InputMaybe<Scalars['TimeSpan']['input']>;
  lte?: InputMaybe<Scalars['TimeSpan']['input']>;
  neq?: InputMaybe<Scalars['TimeSpan']['input']>;
  ngt?: InputMaybe<Scalars['TimeSpan']['input']>;
  ngte?: InputMaybe<Scalars['TimeSpan']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['TimeSpan']['input']>>>;
  nlt?: InputMaybe<Scalars['TimeSpan']['input']>;
  nlte?: InputMaybe<Scalars['TimeSpan']['input']>;
};

export type User = {
  __typename?: 'User';
  driving: Array<Group>;
  id: Scalars['String']['output'];
  passengering: Array<Group>;
};

export type UserFilterInput = {
  and?: InputMaybe<Array<UserFilterInput>>;
  driving?: InputMaybe<ListFilterInputTypeOfGroupFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  passengering?: InputMaybe<ListFilterInputTypeOfGroupFilterInput>;
};

export type UserSortInput = {
  id?: InputMaybe<SortEnumType>;
};

export type CreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupPayload', group?: { __typename?: 'Group', id: number } | null, errors?: Array<{ __typename?: 'AuthenticationError', message: string }> | null } };

export type CreateInitialRidesMutationVariables = Exact<{
  input: CreateNextRidesInput;
}>;


export type CreateInitialRidesMutation = { __typename?: 'Mutation', createNextRides: { __typename?: 'CreateNextRidesPayload', ride?: Array<{ __typename?: 'Ride', id: number }> | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string }> | null } };

export type GetUserGroupsQueryVariables = Exact<{
  userLocation: CoordinatesInput;
  currentUserId: Scalars['String']['input'];
}>;


export type GetUserGroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: number, startTime: string, days: number, totalSeats: number, driver: { __typename?: 'User', id: string }, startLocation: { __typename?: 'Coordinates', latitude: number, longitude: number, distance: number }, endLocation: { __typename?: 'Coordinates', latitude: number, longitude: number }, passengers: Array<{ __typename?: 'User', id: string }> }> };

export type LeaveGroupMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', abandonGroup: { __typename?: 'AbandonGroupPayload', group?: { __typename?: 'Group', id: number } | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string }> | null } };

export type Leave_Upcoming_RidesMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type Leave_Upcoming_RidesMutation = { __typename?: 'Mutation', leaveUpcomingRides: { __typename?: 'LeaveUpcomingRidesPayload', ids?: Array<number> | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string }> | null } };

export type GetNearestJoinableGroupsQueryVariables = Exact<{
  userStartLocation: CoordinatesInput;
  userEndLocation: CoordinatesInput;
  currentUserId: Scalars['String']['input'];
}>;


export type GetNearestJoinableGroupsQuery = { __typename?: 'Query', nearestGroups: Array<{ __typename?: 'Group', id: number, startTime: string, days: number, totalSeats: number, startLocation: { __typename?: 'Coordinates', latitude: number, longitude: number, distance: number }, endLocation: { __typename?: 'Coordinates', latitude: number, longitude: number }, passengers: Array<{ __typename?: 'User', id: string }> }> };

export type JoinGroupMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type JoinGroupMutation = { __typename?: 'Mutation', joinGroup: { __typename?: 'JoinGroupPayload', group?: { __typename?: 'Group', id: number } | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string }> | null } };

export type JoinUpcomingRidesMutationVariables = Exact<{
  groupId: Scalars['Int']['input'];
}>;


export type JoinUpcomingRidesMutation = { __typename?: 'Mutation', joinUpcomingRides: { __typename?: 'JoinUpcomingRidesPayload', ride?: Array<{ __typename?: 'Ride', id: number }> | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string }> | null } };

export type GetRideDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetRideDetailsQuery = { __typename?: 'Query', rideById?: { __typename?: 'Ride', id: number, startTime: string, groupId: number, status: RideStatus, passengers: Array<{ __typename?: 'RidePassenger', passengerId: string, participationStatus: RideParticipationStatus }> } | null };

export type GetUserGroupsIdsForRidesQueryVariables = Exact<{
  currentUserId: Scalars['String']['input'];
}>;


export type GetUserGroupsIdsForRidesQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: number, driver: { __typename?: 'User', id: string }, passengers: Array<{ __typename?: 'User', id: string }> }> };

export type GetAllUserRidesQueryVariables = Exact<{
  groupIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type GetAllUserRidesQuery = { __typename?: 'Query', rides: Array<{ __typename?: 'Ride', id: number, startTime: string, status: RideStatus }> };

export type ProgressRideMutationVariables = Exact<{
  input: ProgressRideInput;
}>;


export type ProgressRideMutation = { __typename?: 'Mutation', progressRide: { __typename?: 'ProgressRidePayload', ride?: { __typename?: 'Ride', status: RideStatus } | null, errors?: Array<{ __typename?: 'ArgumentError', message: string } | { __typename?: 'AuthenticationError', message: string } | { __typename?: 'InvalidOperationError', message: string }> | null } };


export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const CreateInitialRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInitialRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNextRidesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNextRides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateInitialRidesMutation, CreateInitialRidesMutationVariables>;
export const GetUserGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userLocation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"driver"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"passengers"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"some"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"distance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userLocation"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"endLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalSeats"}},{"kind":"Field","name":{"kind":"Name","value":"passengers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserGroupsQuery, GetUserGroupsQueryVariables>;
export const LeaveGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abandonGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LeaveGroupMutation, LeaveGroupMutationVariables>;
export const Leave_Upcoming_RidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LEAVE_UPCOMING_RIDES"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveUpcomingRides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ids"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Leave_Upcoming_RidesMutation, Leave_Upcoming_RidesMutationVariables>;
export const GetNearestJoinableGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNearestJoinableGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStartLocation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEndLocation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nearestGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userStartLocation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStartLocation"}}},{"kind":"Argument","name":{"kind":"Name","value":"userEndLocation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEndLocation"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"driver"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"neq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"passengers"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"none"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"startLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"distance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStartLocation"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"endLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalSeats"}},{"kind":"Field","name":{"kind":"Name","value":"passengers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetNearestJoinableGroupsQuery, GetNearestJoinableGroupsQueryVariables>;
export const JoinGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinGroupMutation, JoinGroupMutationVariables>;
export const JoinUpcomingRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinUpcomingRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinUpcomingRides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<JoinUpcomingRidesMutation, JoinUpcomingRidesMutationVariables>;
export const GetRideDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRideDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rideById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"passengers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passengerId"}},{"kind":"Field","name":{"kind":"Name","value":"participationStatus"}}]}}]}}]}}]} as unknown as DocumentNode<GetRideDetailsQuery, GetRideDetailsQueryVariables>;
export const GetUserGroupsIdsForRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserGroupsIdsForRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"driver"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"passengers"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"some"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentUserId"}}}]}}]}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"driver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passengers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserGroupsIdsForRidesQuery, GetUserGroupsIdsForRidesQueryVariables>;
export const GetAllUserRidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUserRides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"groupId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupIds"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startTime"},"value":{"kind":"EnumValue","value":"ASC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetAllUserRidesQuery, GetAllUserRidesQueryVariables>;
export const ProgressRideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ProgressRide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressRideInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"progressRide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProgressRideMutation, ProgressRideMutationVariables>;