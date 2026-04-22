import { cookies } from "next/headers";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

import { refreshTokensAction } from "@/lib/auth/auth-service";

import { isUnauthorizedError } from "./gql-utils";

export interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface FetchOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: RequestInit["next"];
  token?: string;
  cookieHeader?: string;
}

export async function gqlFetch<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  options?: FetchOptions
): Promise<T> {
  const apiUrl = process.env.GRAPHQL_URL;
  if (!apiUrl) throw new Error("GRAPHQL_URL is missing");

  const makeRequest = (accessToken?: string) =>
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options?.headers,
      },
      body: JSON.stringify({ query: print(document), variables }),
      cache: options?.cache ?? "no-store",
      next: options?.next,
    });

  const response = await makeRequest(options?.token);
  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data!;
}

export async function gqlRequestAuthed<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  options?: FetchOptions
): Promise<T> {
  const apiUrl = process.env.GRAPHQL_URL;
  if (!apiUrl) throw new Error("GRAPHQL_URL is missing");

  let token = options?.token;
  const cookieStore = token ? null : await cookies();
  if (!token) token = cookieStore!.get("access_token")?.value;

  const makeRequest = (accessToken?: string) =>
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options?.headers,
      },
      body: JSON.stringify({ query: print(document), variables }),
      cache: options?.cache ?? "no-store",
      next: options?.next,
    });

  let response = await makeRequest(token);
  let result: GraphQLResponse<T> = await response.json();

  if (isUnauthorizedError(result.errors)) {
    const newToken = await refreshTokensAction();

    if (newToken) {
      response = await makeRequest(newToken);
      result = await response.json();

      if (isUnauthorizedError(result.errors)) {
        throw new Error("Session expired. Please login again.");
      }
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data!;
}

export const gqlRequest = gqlRequestAuthed;