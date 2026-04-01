interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export const isUnauthorizedError = (errors: readonly GraphQLError[] | undefined): boolean => {
  if (!errors) return false;
  return errors.some(
    (err) =>
      err.message === "Unauthorized" ||
      err.extensions?.code === "UNAUTHENTICATED"
  );
};