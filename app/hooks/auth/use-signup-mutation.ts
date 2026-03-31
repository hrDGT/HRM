import { gql, } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import type { AuthInput, AuthResult } from "cv-graphql";

export type SignupVariables = {
  auth: AuthInput;
};

export type SignupData = {
  signup: AuthResult;
};

export const SIGNUP_MUTATION = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
        email
      }
      access_token
    }
  }
`;

export const useSignupMutation = (
  options?: useMutation.Options<SignupData, SignupVariables>
) => {
  return useMutation<SignupData, SignupVariables>(SIGNUP_MUTATION, options);
};