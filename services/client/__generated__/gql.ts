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
    "\n  query GetUserGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n": types.GetUserGroupsDocument,
    "\n    query GetJoinableGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n      groups(\n        where: {\n          and: [\n            { driver: { id: { neq: $currentUserId } } }\n            { passengers: { none: { id: { eq: $currentUserId } } } }\n          ]\n        }\n      ) {\n        id\n        startTime\n        days\n        startLocation {\n          latitude\n          longitude\n          distance(to: $userLocation)\n        }\n        endLocation {\n          latitude\n          longitude\n        }\n        totalSeats\n        passengers {\n          id\n        }\n      }\n    }\n  ": types.GetJoinableGroupsDocument,
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
export function gql(source: "\n  query GetUserGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n    groups(\n      where: {\n        or: [\n          { driver: { id: { eq: $currentUserId } } }\n          { passengers: { some: { id: { eq: $currentUserId } } } }\n        ]\n      }\n    ) {\n      id\n      startTime\n      days\n      driver {\n        id\n      }\n      startLocation {\n        latitude\n        longitude\n        distance(to: $userLocation)\n      }\n      endLocation {\n        latitude\n        longitude\n      }\n      totalSeats\n      passengers {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetJoinableGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n      groups(\n        where: {\n          and: [\n            { driver: { id: { neq: $currentUserId } } }\n            { passengers: { none: { id: { eq: $currentUserId } } } }\n          ]\n        }\n      ) {\n        id\n        startTime\n        days\n        startLocation {\n          latitude\n          longitude\n          distance(to: $userLocation)\n        }\n        endLocation {\n          latitude\n          longitude\n        }\n        totalSeats\n        passengers {\n          id\n        }\n      }\n    }\n  "): (typeof documents)["\n    query GetJoinableGroups($userLocation: CoordinatesInput!, $currentUserId: String!) {\n      groups(\n        where: {\n          and: [\n            { driver: { id: { neq: $currentUserId } } }\n            { passengers: { none: { id: { eq: $currentUserId } } } }\n          ]\n        }\n      ) {\n        id\n        startTime\n        days\n        startLocation {\n          latitude\n          longitude\n          distance(to: $userLocation)\n        }\n        endLocation {\n          latitude\n          longitude\n        }\n        totalSeats\n        passengers {\n          id\n        }\n      }\n    }\n  "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;