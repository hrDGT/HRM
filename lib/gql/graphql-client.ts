import { cookies } from "next/headers";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

import { isUnauthorizedError } from "./gql-utils";

export async function gqlRequest<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V,
  customHeaders?: Record<string, string>
): Promise<T> {
  const apiUrl = process.env.GRAPHQL_URL;
  if (!apiUrl) throw new Error("GRAPHQL_URL is missing");

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const makeRequest = async (currentToken: string | undefined) => {
    return fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...customHeaders,
      },
      body: JSON.stringify({ query: print(document), variables }),
      cache: "no-store",
    });
  };

  let response = await makeRequest(token);
  let result = await response.json();

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
