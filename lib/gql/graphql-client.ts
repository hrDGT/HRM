import { cookies } from "next/headers";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

import { refreshTokensAction } from "../auth/auth-service";

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
}

export async function gqlFetch<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  options?: FetchOptions
): Promise<T> {
  const apiUrl = process.env.GRAPHQL_URL;
  if (!apiUrl) throw new Error("GRAPHQL_URL is missing");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify({ query: print(document), variables }),
    cache: options?.cache ?? "no-store",
    next: options?.next,
  });

  const responseText = await response.text();
  let result: GraphQLResponse<T> = {};

  try {
    result = responseText ? (JSON.parse(responseText) as GraphQLResponse<T>) : {};
  } catch {
    result = {};
  }

  if (response.status === 401 || isUnauthorizedError(result.errors)) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok && !result.errors) {
    throw new Error(`HTTP Error ${response.status}: ${responseText || "Unknown error"}`);
  }

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data as T;
}

export async function gqlRequestAuthed<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  options?: FetchOptions
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const headers = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    return await gqlFetch(document, variables, { ...options, headers });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));

    if (error.message === "UNAUTHORIZED") {
      const newToken = await refreshTokensAction();

      if (newToken) {
        const newHeaders = { ...options?.headers, Authorization: `Bearer ${newToken}` };
        return await gqlFetch(document, variables, { ...options, headers: newHeaders });
      } else {
        throw new Error("Session expired. Please login again.");
      }
    }

    throw error;
  }
}