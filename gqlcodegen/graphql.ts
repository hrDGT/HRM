/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
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
  /** The `Void` scalar type represents a null variable. */
  Void: { input: any; output: any; }
};

export type AddCvProjectInput = {
  cvId: Scalars['ID']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  responsibilities: Array<Scalars['String']['input']>;
  roles: Array<Scalars['String']['input']>;
  start_date: Scalars['String']['input'];
};

export type AddCvSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  cvId: Scalars['ID']['input'];
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type AddProfileLanguageInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
  userId: Scalars['ID']['input'];
};

export type AddProfileSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type AuthInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type AuthResult = {
  __typename?: 'AuthResult';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
  user: User;
};

export type CreateCvInput = {
  description: Scalars['String']['input'];
  education?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateDepartmentInput = {
  name: Scalars['String']['input'];
};

export type CreateLanguageInput = {
  iso2: Scalars['String']['input'];
  name: Scalars['String']['input'];
  native_name?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePositionInput = {
  name: Scalars['String']['input'];
};

export type CreateProfileInput = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  description: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  environment: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  start_date: Scalars['String']['input'];
};

export type CreateSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  auth: AuthInput;
  cvsIds: Array<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  positionId?: InputMaybe<Scalars['ID']['input']>;
  profile: CreateProfileInput;
  role: UserRole;
};

export type Cv = {
  __typename?: 'Cv';
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  education?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  languages: Array<LanguageProficiency>;
  name: Scalars['String']['output'];
  projects?: Maybe<Array<CvProject>>;
  skills: Array<SkillMastery>;
  user?: Maybe<User>;
};

export type CvProject = {
  __typename?: 'CvProject';
  description: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  end_date?: Maybe<Scalars['String']['output']>;
  environment: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internal_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  project: Project;
  responsibilities: Array<Scalars['String']['output']>;
  roles: Array<Scalars['String']['output']>;
  start_date: Scalars['String']['output'];
};

export type DeleteAvatarInput = {
  userId: Scalars['ID']['input'];
};

export type DeleteCvInput = {
  cvId: Scalars['ID']['input'];
};

export type DeleteCvSkillInput = {
  cvId: Scalars['ID']['input'];
  name: Array<Scalars['String']['input']>;
};

export type DeleteDepartmentInput = {
  departmentId: Scalars['ID']['input'];
};

export type DeleteLanguageInput = {
  languageId: Scalars['ID']['input'];
};

export type DeletePositionInput = {
  positionId: Scalars['ID']['input'];
};

export type DeleteProfileInput = {
  userId: Scalars['ID']['input'];
};

export type DeleteProfileLanguageInput = {
  name: Array<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type DeleteProfileSkillInput = {
  name: Array<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type DeleteProjectInput = {
  projectId: Scalars['ID']['input'];
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  affected: Scalars['Int']['output'];
};

export type DeleteSkillInput = {
  skillId: Scalars['ID']['input'];
};

export type Department = {
  __typename?: 'Department';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ExportPdfInput = {
  html: Scalars['String']['input'];
  margin?: InputMaybe<MarginInput>;
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type Language = {
  __typename?: 'Language';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  iso2: Scalars['String']['output'];
  name: Scalars['String']['output'];
  native_name?: Maybe<Scalars['String']['output']>;
};

export type LanguageProficiency = {
  __typename?: 'LanguageProficiency';
  name: Scalars['String']['output'];
  proficiency: Proficiency;
};

export type LanguageProficiencyInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
};

export type Mail = {
  __typename?: 'Mail';
  created_at: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  otp: Scalars['String']['output'];
};

export type MarginInput = {
  bottom: Scalars['String']['input'];
  left: Scalars['String']['input'];
  right: Scalars['String']['input'];
  top: Scalars['String']['input'];
};

export enum Mastery {
  Advanced = 'Advanced',
  Competent = 'Competent',
  Expert = 'Expert',
  Novice = 'Novice',
  Proficient = 'Proficient'
}

export type Mutation = {
  __typename?: 'Mutation';
  addCvProject: Cv;
  addCvSkill: Cv;
  addProfileLanguage: Profile;
  addProfileSkill: Profile;
  createCv: Cv;
  createDepartment: Department;
  createLanguage: Language;
  createPosition: Position;
  createProject: Project;
  createSkill: Skill;
  createUser: User;
  deleteAvatar?: Maybe<Scalars['Void']['output']>;
  deleteCv: DeleteResult;
  deleteCvSkill: Cv;
  deleteDepartment: DeleteResult;
  deleteLanguage: DeleteResult;
  deletePosition: DeleteResult;
  deleteProfileLanguage: Profile;
  deleteProfileSkill: Profile;
  deleteProject: DeleteResult;
  deleteSkill: DeleteResult;
  deleteUser: DeleteResult;
  exportPdf: Scalars['String']['output'];
  forgotPassword?: Maybe<Scalars['Void']['output']>;
  removeCvProject: Cv;
  resetPassword?: Maybe<Scalars['Void']['output']>;
  signup: AuthResult;
  updateCv: Cv;
  updateCvProject: Cv;
  updateCvSkill: Cv;
  updateDepartment: Department;
  updateLanguage: Language;
  updatePosition: Position;
  updateProfile: Profile;
  updateProfileLanguage: Profile;
  updateProfileSkill: Profile;
  updateProject: Project;
  updateSkill: Skill;
  updateToken: UpdateTokenResult;
  updateUser: User;
  uploadAvatar: Scalars['String']['output'];
  verifyMail?: Maybe<Scalars['Void']['output']>;
};


export type MutationAddCvProjectArgs = {
  project: AddCvProjectInput;
};


export type MutationAddCvSkillArgs = {
  skill: AddCvSkillInput;
};


export type MutationAddProfileLanguageArgs = {
  language: AddProfileLanguageInput;
};


export type MutationAddProfileSkillArgs = {
  skill: AddProfileSkillInput;
};


export type MutationCreateCvArgs = {
  cv: CreateCvInput;
};


export type MutationCreateDepartmentArgs = {
  department: CreateDepartmentInput;
};


export type MutationCreateLanguageArgs = {
  language: CreateLanguageInput;
};


export type MutationCreatePositionArgs = {
  position: CreatePositionInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateSkillArgs = {
  skill: CreateSkillInput;
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationDeleteAvatarArgs = {
  avatar: DeleteAvatarInput;
};


export type MutationDeleteCvArgs = {
  cv: DeleteCvInput;
};


export type MutationDeleteCvSkillArgs = {
  skill: DeleteCvSkillInput;
};


export type MutationDeleteDepartmentArgs = {
  department: DeleteDepartmentInput;
};


export type MutationDeleteLanguageArgs = {
  language: DeleteLanguageInput;
};


export type MutationDeletePositionArgs = {
  position: DeletePositionInput;
};


export type MutationDeleteProfileLanguageArgs = {
  language: DeleteProfileLanguageInput;
};


export type MutationDeleteProfileSkillArgs = {
  skill: DeleteProfileSkillInput;
};


export type MutationDeleteProjectArgs = {
  project: DeleteProjectInput;
};


export type MutationDeleteSkillArgs = {
  skill: DeleteSkillInput;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationExportPdfArgs = {
  pdf: ExportPdfInput;
};


export type MutationForgotPasswordArgs = {
  auth: ForgotPasswordInput;
};


export type MutationRemoveCvProjectArgs = {
  project: RemoveCvProjectInput;
};


export type MutationResetPasswordArgs = {
  auth: ResetPasswordInput;
};


export type MutationSignupArgs = {
  auth: AuthInput;
};


export type MutationUpdateCvArgs = {
  cv: UpdateCvInput;
};


export type MutationUpdateCvProjectArgs = {
  project: UpdateCvProjectInput;
};


export type MutationUpdateCvSkillArgs = {
  skill: UpdateCvSkillInput;
};


export type MutationUpdateDepartmentArgs = {
  department: UpdateDepartmentInput;
};


export type MutationUpdateLanguageArgs = {
  language: UpdateLanguageInput;
};


export type MutationUpdatePositionArgs = {
  position: UpdatePositionInput;
};


export type MutationUpdateProfileArgs = {
  profile: UpdateProfileInput;
};


export type MutationUpdateProfileLanguageArgs = {
  language: UpdateProfileLanguageInput;
};


export type MutationUpdateProfileSkillArgs = {
  skill: UpdateProfileSkillInput;
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
};


export type MutationUpdateSkillArgs = {
  skill: UpdateSkillInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput;
};


export type MutationUploadAvatarArgs = {
  avatar: UploadAvatarInput;
};


export type MutationVerifyMailArgs = {
  mail: VerifyMailInput;
};

export type Position = {
  __typename?: 'Position';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export enum Proficiency {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
  Native = 'Native'
}

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  full_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  languages: Array<LanguageProficiency>;
  last_name?: Maybe<Scalars['String']['output']>;
  skills: Array<SkillMastery>;
};

export type Project = {
  __typename?: 'Project';
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  end_date?: Maybe<Scalars['String']['output']>;
  environment: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internal_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  start_date: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  cv: Cv;
  cvs: Array<Cv>;
  departments: Array<Department>;
  languages: Array<Maybe<Language>>;
  login: AuthResult;
  position: Position;
  positions: Array<Position>;
  profile: Profile;
  project: Project;
  projects: Array<Project>;
  skillCategories: Array<SkillCategory>;
  skills: Array<Skill>;
  user: User;
  users: Array<User>;
};


export type QueryCvArgs = {
  cvId: Scalars['ID']['input'];
};


export type QueryLoginArgs = {
  auth: AuthInput;
};


export type QueryPositionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProfileArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};

export type RemoveCvProjectInput = {
  cvId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
};

export type Skill = {
  __typename?: 'Skill';
  category?: Maybe<SkillCategory>;
  category_name?: Maybe<Scalars['String']['output']>;
  category_parent_name?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SkillCategory = {
  __typename?: 'SkillCategory';
  children: Array<SkillCategory>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parent?: Maybe<SkillCategory>;
};

export type SkillMastery = {
  __typename?: 'SkillMastery';
  categoryId?: Maybe<Scalars['ID']['output']>;
  mastery: Mastery;
  name: Scalars['String']['output'];
};

export type SkillMasteryInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type UpdateCvInput = {
  cvId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  education?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateCvProjectInput = {
  cvId: Scalars['ID']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  responsibilities: Array<Scalars['String']['input']>;
  roles: Array<Scalars['String']['input']>;
  start_date: Scalars['String']['input'];
};

export type UpdateCvSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  cvId: Scalars['ID']['input'];
  mastery: Mastery;
  name: Scalars['String']['input'];
};

export type UpdateDepartmentInput = {
  departmentId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateLanguageInput = {
  iso2: Scalars['String']['input'];
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  native_name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePositionInput = {
  name: Scalars['String']['input'];
  positionId: Scalars['ID']['input'];
};

export type UpdateProfileInput = {
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type UpdateProfileLanguageInput = {
  name: Scalars['String']['input'];
  proficiency: Proficiency;
  userId: Scalars['ID']['input'];
};

export type UpdateProfileSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  mastery: Mastery;
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type UpdateProjectInput = {
  description: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  end_date?: InputMaybe<Scalars['String']['input']>;
  environment: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  start_date: Scalars['String']['input'];
};

export type UpdateSkillInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  skillId: Scalars['ID']['input'];
};

export type UpdateTokenResult = {
  __typename?: 'UpdateTokenResult';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
};

export type UpdateUserInput = {
  cvsIds?: InputMaybe<Array<Scalars['String']['input']>>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  positionId?: InputMaybe<Scalars['ID']['input']>;
  role?: InputMaybe<UserRole>;
  userId: Scalars['ID']['input'];
};

export type UploadAvatarInput = {
  base64: Scalars['String']['input'];
  size: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['String']['output'];
  cvs?: Maybe<Array<Cv>>;
  department?: Maybe<Department>;
  department_name?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_verified: Scalars['Boolean']['output'];
  position?: Maybe<Position>;
  position_name?: Maybe<Scalars['String']['output']>;
  profile: Profile;
  role: UserRole;
};

export enum UserRole {
  Admin = 'Admin',
  Employee = 'Employee'
}

export type VerifyMailInput = {
  otp: Scalars['String']['input'];
};

export type GetEmployeeQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetEmployeeQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, is_verified: boolean, created_at: string, department_name?: string | null, position_name?: string | null, role: UserRole, profile: { __typename?: 'Profile', first_name?: string | null, last_name?: string | null, avatar?: string | null }, cvs?: Array<{ __typename?: 'Cv', id: string, created_at: string }> | null } };

export type GetEmployeesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEmployeesQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, is_verified: boolean, department_name?: string | null, position_name?: string | null, profile: { __typename?: 'Profile', first_name?: string | null, last_name?: string | null, avatar?: string | null } }> };

export type ForgotPasswordMutationVariables = Exact<{
  auth: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword?: any | null };

export type LoginQueryVariables = Exact<{
  auth: AuthInput;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'AuthResult', access_token: string, refresh_token: string, user: { __typename?: 'User', id: string } } };

export type ResetPasswordMutationVariables = Exact<{
  auth: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword?: any | null };

export type SignupMutationVariables = Exact<{
  auth: AuthInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthResult', access_token: string, refresh_token: string, user: { __typename?: 'User', id: string } } };

export type CreateDepartmentMutationVariables = Exact<{
  department: CreateDepartmentInput;
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'Department', id: string, name: string } };

export type DeleteDepartmentMutationVariables = Exact<{
  department: DeleteDepartmentInput;
}>;


export type DeleteDepartmentMutation = { __typename?: 'Mutation', deleteDepartment: { __typename?: 'DeleteResult', affected: number } };

export type UpdateDepartmentMutationVariables = Exact<{
  department: UpdateDepartmentInput;
}>;


export type UpdateDepartmentMutation = { __typename?: 'Mutation', updateDepartment: { __typename?: 'Department', id: string, name: string } };

export type GetDepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'Department', id: string, name: string }> };

export type CreateLanguageMutationVariables = Exact<{
  language: CreateLanguageInput;
}>;


export type CreateLanguageMutation = { __typename?: 'Mutation', createLanguage: { __typename?: 'Language', id: string, iso2: string, name: string, native_name?: string | null } };

export type DeleteLanguageMutationVariables = Exact<{
  language: DeleteLanguageInput;
}>;


export type DeleteLanguageMutation = { __typename?: 'Mutation', deleteLanguage: { __typename?: 'DeleteResult', affected: number } };

export type UpdateLanguageMutationVariables = Exact<{
  language: UpdateLanguageInput;
}>;


export type UpdateLanguageMutation = { __typename?: 'Mutation', updateLanguage: { __typename?: 'Language', id: string, iso2: string, name: string, native_name?: string | null } };

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = { __typename?: 'Query', languages: Array<{ __typename?: 'Language', id: string, iso2: string, name: string, native_name?: string | null } | null> };

export type CreatePositionMutationVariables = Exact<{
  position: CreatePositionInput;
}>;


export type CreatePositionMutation = { __typename?: 'Mutation', createPosition: { __typename?: 'Position', id: string, name: string } };

export type DeletePositionMutationVariables = Exact<{
  position: DeletePositionInput;
}>;


export type DeletePositionMutation = { __typename?: 'Mutation', deletePosition: { __typename?: 'DeleteResult', affected: number } };

export type UpdatePositionMutationVariables = Exact<{
  position: UpdatePositionInput;
}>;


export type UpdatePositionMutation = { __typename?: 'Mutation', updatePosition: { __typename?: 'Position', id: string, name: string } };

export type GetPositionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPositionsQuery = { __typename?: 'Query', positions: Array<{ __typename?: 'Position', id: string, name: string }> };

export type CreateSkillMutationVariables = Exact<{
  skill: CreateSkillInput;
}>;


export type CreateSkillMutation = { __typename?: 'Mutation', createSkill: { __typename?: 'Skill', id: string, name: string } };

export type DeleteSkillMutationVariables = Exact<{
  skill: DeleteSkillInput;
}>;


export type DeleteSkillMutation = { __typename?: 'Mutation', deleteSkill: { __typename?: 'DeleteResult', affected: number } };

export type UpdateSkillMutationVariables = Exact<{
  skill: UpdateSkillInput;
}>;


export type UpdateSkillMutation = { __typename?: 'Mutation', updateSkill: { __typename?: 'Skill', id: string, name: string } };

export type GetSkillCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillCategoriesQuery = { __typename?: 'Query', skillCategories: Array<{ __typename?: 'SkillCategory', id: string, name: string, order: number }> };

export type GetSkillsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillsQuery = { __typename?: 'Query', skills: Array<{ __typename?: 'Skill', id: string, name: string, category?: { __typename?: 'SkillCategory', id: string, name: string } | null }> };

export type UpdateTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateTokenMutation = { __typename?: 'Mutation', updateToken: { __typename?: 'UpdateTokenResult', access_token: string, refresh_token: string } };

export type GetUserForStoreQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserForStoreQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, role: UserRole, profile: { __typename?: 'Profile', first_name?: string | null, last_name?: string | null, avatar?: string | null } } };


export const GetEmployeeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployee"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"is_verified"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"department_name"}},{"kind":"Field","name":{"kind":"Name","value":"position_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"cvs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetEmployeeQuery, GetEmployeeQueryVariables>;
export const GetEmployeesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEmployees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"is_verified"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"department_name"}},{"kind":"Field","name":{"kind":"Name","value":"position_name"}}]}}]}}]} as unknown as DocumentNode<GetEmployeesQuery, GetEmployeesQueryVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForgotPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"auth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auth"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"auth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auth"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"access_token"}},{"kind":"Field","name":{"kind":"Name","value":"refresh_token"}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"auth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auth"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"auth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"auth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"auth"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"access_token"}},{"kind":"Field","name":{"kind":"Name","value":"refresh_token"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const CreateDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"department"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"department"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
export const DeleteDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"department"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"department"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected"}}]}}]}}]} as unknown as DocumentNode<DeleteDepartmentMutation, DeleteDepartmentMutationVariables>;
export const UpdateDepartmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDepartment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"department"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDepartmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDepartment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"department"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateDepartmentMutation, UpdateDepartmentMutationVariables>;
export const GetDepartmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDepartments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"departments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetDepartmentsQuery, GetDepartmentsQueryVariables>;
export const CreateLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"native_name"}}]}}]}}]} as unknown as DocumentNode<CreateLanguageMutation, CreateLanguageMutationVariables>;
export const DeleteLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected"}}]}}]}}]} as unknown as DocumentNode<DeleteLanguageMutation, DeleteLanguageMutationVariables>;
export const UpdateLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"native_name"}}]}}]}}]} as unknown as DocumentNode<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const GetLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iso2"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"native_name"}}]}}]}}]} as unknown as DocumentNode<GetLanguagesQuery, GetLanguagesQueryVariables>;
export const CreatePositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreatePositionMutation, CreatePositionMutationVariables>;
export const DeletePositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected"}}]}}]}}]} as unknown as DocumentNode<DeletePositionMutation, DeletePositionMutationVariables>;
export const UpdatePositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdatePositionMutation, UpdatePositionMutationVariables>;
export const GetPositionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPositionsQuery, GetPositionsQueryVariables>;
export const CreateSkillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSkill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skill"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSkillInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSkill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skill"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skill"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateSkillMutation, CreateSkillMutationVariables>;
export const DeleteSkillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSkill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skill"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSkillInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSkill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skill"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skill"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected"}}]}}]}}]} as unknown as DocumentNode<DeleteSkillMutation, DeleteSkillMutationVariables>;
export const UpdateSkillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSkill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skill"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSkillInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSkill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skill"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skill"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateSkillMutation, UpdateSkillMutationVariables>;
export const GetSkillCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkillCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skillCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]} as unknown as DocumentNode<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>;
export const GetSkillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkills"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skills"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSkillsQuery, GetSkillsQueryVariables>;
export const UpdateTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"access_token"}},{"kind":"Field","name":{"kind":"Name","value":"refresh_token"}}]}}]}}]} as unknown as DocumentNode<UpdateTokenMutation, UpdateTokenMutationVariables>;
export const GetUserForStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserForStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserForStoreQuery, GetUserForStoreQueryVariables>;