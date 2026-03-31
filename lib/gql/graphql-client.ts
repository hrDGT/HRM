import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

export async function gqlRequest<T, V>(
  document: TypedDocumentNode<T, V>,
  variables?: V
): Promise<T> {
  const apiUrl = process.env.GRAPHQL_URL;
  if (!apiUrl) throw new Error("GRAPHQL_URL is missing");

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
    cache: "no-store",
  });

  const { data, errors } = (await response.json())

  if (errors) throw new Error(errors[0].message);

  return data;
}