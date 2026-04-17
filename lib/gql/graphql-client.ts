import { cookies } from "next/headers";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

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

  if (isUnauthorizedError(result.errors)) {
    const appUrl = `http://localhost:${process.env.PORT || 3000}`;
    const allCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

    const refreshResponse = await fetch(`${appUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: allCookies,
      },
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newToken = refreshData.access_token;

      if (newToken) {
        response = await makeRequest(newToken);
        result = await response.json();
      } else {
        throw new Error("Session expired. Please login again.");
      }
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}
