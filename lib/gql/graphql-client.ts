import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import { cookies } from "next/headers";
import { refreshTokensAction } from "../auth/auth-service";
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
    const newToken = await refreshTokensAction();

    if (newToken) {
      response = await makeRequest(newToken);
      result = await response.json();
    } else {
      throw new Error("Session expired. Please login again.");
    }
  }

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}