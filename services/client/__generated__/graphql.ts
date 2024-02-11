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
  /** The `TimeSpan` scalar represents an ISO-8601 compliant duration type. */
  TimeSpan: { input: string; output: string; }
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

export type CreateGroupInput = {
  days: Scalars['Int']['input'];
  endLocation: CoordinatesInput;
  startLocation: CoordinatesInput;
  startTime: Scalars['TimeSpan']['input'];
  totalSeats: Scalars['Int']['input'];
};

export type CreateGroupPayload = {
  __typename?: 'CreateGroupPayload';
  group?: Maybe<Group>;
};

export type DaysOfWeekOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type DeleteGroupError = ArgumentError;

export type DeleteGroupInput = {
  id: Scalars['Int']['input'];
};

export type DeleteGroupPayload = {
  __typename?: 'DeleteGroupPayload';
  errors?: Maybe<Array<DeleteGroupError>>;
  group?: Maybe<Group>;
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
  endLocation: Coordinates;
  id: Scalars['Int']['output'];
  startLocation: Coordinates;
  startTime: Scalars['TimeSpan']['output'];
  totalSeats: Scalars['Int']['output'];
};

export type GroupFilterInput = {
  and?: InputMaybe<Array<GroupFilterInput>>;
  days?: InputMaybe<DaysOfWeekOperationFilterInput>;
  endLocation?: InputMaybe<CoordinatesFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<GroupFilterInput>>;
  startLocation?: InputMaybe<CoordinatesFilterInput>;
  startTime?: InputMaybe<TimeSpanOperationFilterInput>;
  totalSeats?: InputMaybe<IntOperationFilterInput>;
};

export type GroupSortInput = {
  days?: InputMaybe<SortEnumType>;
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

export type Mutation = {
  __typename?: 'Mutation';
  createGroup: CreateGroupPayload;
  deleteGroup: DeleteGroupPayload;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationDeleteGroupArgs = {
  input: DeleteGroupInput;
};

export type Query = {
  __typename?: 'Query';
  groupById?: Maybe<Group>;
  groups: Array<Group>;
  me?: Maybe<Scalars['String']['output']>;
};


export type QueryGroupByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGroupsArgs = {
  order?: InputMaybe<Array<GroupSortInput>>;
  where?: InputMaybe<GroupFilterInput>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type GetGroupsQueryVariables = Exact<{
  userLocation: CoordinatesInput;
}>;


export type GetGroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'Group', id: number, startTime: string, days: number, totalSeats: number, startLocation: { __typename?: 'Coordinates', latitude: number, longitude: number, distance: number }, endLocation: { __typename?: 'Coordinates', latitude: number, longitude: number } }> };


export const GetGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userLocation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoordinatesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"startLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"distance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userLocation"}}}]}]}},{"kind":"Field","name":{"kind":"Name","value":"endLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalSeats"}}]}}]}}]} as unknown as DocumentNode<GetGroupsQuery, GetGroupsQueryVariables>;