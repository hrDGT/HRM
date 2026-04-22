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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user {\n        id\n        email\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      projects {\n        id\n        name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        responsibilities\n      }\n    }\n  }\n": typeof types.GetCvDetailsDocument,
    "\n  query GetCVPreviewDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user { id email }\n      languages { name }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment }\n    }\n  }\n": typeof types.GetCvPreviewDetailsDocument,
    "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id name education description created_at user { id email }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment responsibilities }\n    }\n  }\n": typeof types.GetCvDetailsDocument,
    "\n  query GetCVDetailsForSkills($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      user { id email }\n    }\n  }\n": typeof types.GetCvDetailsForSkillsDocument,
    "\n  query GetCVs {\n    cvs {\n      id\n      name\n      education\n      description\n      user {\n        email\n      }\n    }\n  }\n": typeof types.GetCVsDocument,
    "\n  query GetUserCVs {\n    cvs {\n      id\n      name\n      created_at\n      user {\n        id\n      }\n    }\n  }\n": typeof types.GetUserCVsDocument,
    "\n  query GetUserProfile($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": typeof types.GetUserProfileDocument,
    "\n  query GetEmployeeLanguages($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": typeof types.GetEmployeeLanguagesDocument,
    "\n  query GetEmployee($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      is_verified\n      created_at\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n      role\n      cvs {\n        id\n        created_at\n      }\n    }\n  }\n": typeof types.GetEmployeeDocument,
    "\n  query GetEmployeeSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": typeof types.GetEmployeeSkillsDocument,
    "\n  query GetEmployees {\n    users {\n      id\n      email\n      is_verified\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n    }\n  }\n": typeof types.GetEmployeesDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  query Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation Signup($auth: AuthInput!) {\n    signup(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.SignupDocument,
    "\n  mutation CreateDepartment($department: CreateDepartmentInput!) {\n    createDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n": typeof types.CreateDepartmentDocument,
    "\n  mutation DeleteDepartment($department: DeleteDepartmentInput!) {\n    deleteDepartment(department: $department) {\n      affected\n    }\n  }\n": typeof types.DeleteDepartmentDocument,
    "\n  mutation UpdateDepartment($department: UpdateDepartmentInput!) {\n    updateDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n": typeof types.UpdateDepartmentDocument,
    "\n  query GetDepartments {\n    departments {\n      id\n      name\n    }\n  }\n": typeof types.GetDepartmentsDocument,
    "\n  mutation CreateLanguage($language: CreateLanguageInput!) {\n    createLanguage(language: $language) {\n      id,\n      iso2\n      name\n      native_name\n    }\n  }\n": typeof types.CreateLanguageDocument,
    "\n  mutation DeleteLanguage($language: DeleteLanguageInput!) {\n    deleteLanguage(language: $language) {\n      affected\n    }\n  }\n": typeof types.DeleteLanguageDocument,
    "\n  mutation UpdateLanguage($language: UpdateLanguageInput!) {\n    updateLanguage(language: $language) {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n": typeof types.UpdateLanguageDocument,
    "\n  query GetLanguages {\n    languages {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n": typeof types.GetLanguagesDocument,
    "\n  mutation CreatePosition($position: CreatePositionInput!) {\n    createPosition(position: $position) {\n      id,\n      name\n    }\n  }\n": typeof types.CreatePositionDocument,
    "\n  mutation DeletePosition($position: DeletePositionInput!) {\n    deletePosition(position: $position) {\n      affected\n    }\n  }\n": typeof types.DeletePositionDocument,
    "\n  mutation UpdatePosition($position: UpdatePositionInput!) {\n    updatePosition(position: $position) {\n      id,\n      name\n    }\n  }\n": typeof types.UpdatePositionDocument,
    "\n  query GetPositions {\n    positions {\n      id\n      name\n    }\n  }\n": typeof types.GetPositionsDocument,
    "\n  mutation CreateSkill($skill: CreateSkillInput!) {\n    createSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n": typeof types.CreateSkillDocument,
    "\n  mutation DeleteSkill($skill: DeleteSkillInput!) {\n    deleteSkill(skill: $skill) {\n      affected\n    }\n  }\n": typeof types.DeleteSkillDocument,
    "\n  mutation UpdateSkill($skill: UpdateSkillInput!) {\n    updateSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n": typeof types.UpdateSkillDocument,
    "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n    }\n  }\n": typeof types.GetSkillCategoriesDocument,
    "\n  query GetSkills {\n    skills {\n      id\n      name\n      category {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetSkillsDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": typeof types.UpdateTokenDocument,
    "\n  query GetUserForStore($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n        avatar\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n": typeof types.GetUserForStoreDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      profile {\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n": typeof types.GetUserSkillsDocument,
    "\n  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.DeleteProfileSkillDocument,
    "\n  mutation AddProfileSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.AddProfileSkillDocument,
    "\n  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": typeof types.UpdateProfileSkillDocument,
};
const documents: Documents = {
    "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user {\n        id\n        email\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      projects {\n        id\n        name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        responsibilities\n      }\n    }\n  }\n": types.GetCvDetailsDocument,
    "\n  query GetCVPreviewDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user { id email }\n      languages { name }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment }\n    }\n  }\n": types.GetCvPreviewDetailsDocument,
    "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id name education description created_at user { id email }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment responsibilities }\n    }\n  }\n": types.GetCvDetailsDocument,
    "\n  query GetCVDetailsForSkills($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      user { id email }\n    }\n  }\n": types.GetCvDetailsForSkillsDocument,
    "\n  query GetCVs {\n    cvs {\n      id\n      name\n      education\n      description\n      user {\n        email\n      }\n    }\n  }\n": types.GetCVsDocument,
    "\n  query GetUserCVs {\n    cvs {\n      id\n      name\n      created_at\n      user {\n        id\n      }\n    }\n  }\n": types.GetUserCVsDocument,
    "\n  query GetUserProfile($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": types.GetUserProfileDocument,
    "\n  query GetEmployeeLanguages($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": types.GetEmployeeLanguagesDocument,
    "\n  query GetEmployee($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      is_verified\n      created_at\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n      role\n      cvs {\n        id\n        created_at\n      }\n    }\n  }\n": types.GetEmployeeDocument,
    "\n  query GetEmployeeSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n": types.GetEmployeeSkillsDocument,
    "\n  query GetEmployees {\n    users {\n      id\n      email\n      is_verified\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n    }\n  }\n": types.GetEmployeesDocument,
    "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n": types.ForgotPasswordDocument,
    "\n  query Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n": types.LoginDocument,
    "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation Signup($auth: AuthInput!) {\n    signup(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n": types.SignupDocument,
    "\n  mutation CreateDepartment($department: CreateDepartmentInput!) {\n    createDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n": types.CreateDepartmentDocument,
    "\n  mutation DeleteDepartment($department: DeleteDepartmentInput!) {\n    deleteDepartment(department: $department) {\n      affected\n    }\n  }\n": types.DeleteDepartmentDocument,
    "\n  mutation UpdateDepartment($department: UpdateDepartmentInput!) {\n    updateDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n": types.UpdateDepartmentDocument,
    "\n  query GetDepartments {\n    departments {\n      id\n      name\n    }\n  }\n": types.GetDepartmentsDocument,
    "\n  mutation CreateLanguage($language: CreateLanguageInput!) {\n    createLanguage(language: $language) {\n      id,\n      iso2\n      name\n      native_name\n    }\n  }\n": types.CreateLanguageDocument,
    "\n  mutation DeleteLanguage($language: DeleteLanguageInput!) {\n    deleteLanguage(language: $language) {\n      affected\n    }\n  }\n": types.DeleteLanguageDocument,
    "\n  mutation UpdateLanguage($language: UpdateLanguageInput!) {\n    updateLanguage(language: $language) {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n": types.UpdateLanguageDocument,
    "\n  query GetLanguages {\n    languages {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n": types.GetLanguagesDocument,
    "\n  mutation CreatePosition($position: CreatePositionInput!) {\n    createPosition(position: $position) {\n      id,\n      name\n    }\n  }\n": types.CreatePositionDocument,
    "\n  mutation DeletePosition($position: DeletePositionInput!) {\n    deletePosition(position: $position) {\n      affected\n    }\n  }\n": types.DeletePositionDocument,
    "\n  mutation UpdatePosition($position: UpdatePositionInput!) {\n    updatePosition(position: $position) {\n      id,\n      name\n    }\n  }\n": types.UpdatePositionDocument,
    "\n  query GetPositions {\n    positions {\n      id\n      name\n    }\n  }\n": types.GetPositionsDocument,
    "\n  mutation CreateSkill($skill: CreateSkillInput!) {\n    createSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n": types.CreateSkillDocument,
    "\n  mutation DeleteSkill($skill: DeleteSkillInput!) {\n    deleteSkill(skill: $skill) {\n      affected\n    }\n  }\n": types.DeleteSkillDocument,
    "\n  mutation UpdateSkill($skill: UpdateSkillInput!) {\n    updateSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n": types.UpdateSkillDocument,
    "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n    }\n  }\n": types.GetSkillCategoriesDocument,
    "\n  query GetSkills {\n    skills {\n      id\n      name\n      category {\n        id\n        name\n      }\n    }\n  }\n": types.GetSkillsDocument,
    "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n": types.UpdateTokenDocument,
    "\n  query GetUserForStore($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n        avatar\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n": types.GetUserForStoreDocument,
    "\n  query GetUserSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      profile {\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n": types.GetUserSkillsDocument,
    "\n  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.DeleteProfileSkillDocument,
    "\n  mutation AddProfileSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.AddProfileSkillDocument,
    "\n  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n": types.UpdateProfileSkillDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user {\n        id\n        email\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      projects {\n        id\n        name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        responsibilities\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user {\n        id\n        email\n      }\n      skills {\n        name\n        categoryId\n        mastery\n      }\n      projects {\n        id\n        name\n        description\n        domain\n        start_date\n        end_date\n        environment\n        responsibilities\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCVPreviewDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user { id email }\n      languages { name }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment }\n    }\n  }\n"): (typeof documents)["\n  query GetCVPreviewDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      education\n      description\n      created_at\n      user { id email }\n      languages { name }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id name education description created_at user { id email }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment responsibilities }\n    }\n  }\n"): (typeof documents)["\n  query GetCVDetails($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id name education description created_at user { id email }\n      skills { name categoryId mastery }\n      projects { id name description domain start_date end_date environment responsibilities }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCVDetailsForSkills($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      user { id email }\n    }\n  }\n"): (typeof documents)["\n  query GetCVDetailsForSkills($cvId: ID!) {\n    cv(cvId: $cvId) {\n      id\n      name\n      user { id email }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCVs {\n    cvs {\n      id\n      name\n      education\n      description\n      user {\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCVs {\n    cvs {\n      id\n      name\n      education\n      description\n      user {\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserCVs {\n    cvs {\n      id\n      name\n      created_at\n      user {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserCVs {\n    cvs {\n      id\n      name\n      created_at\n      user {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserProfile($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserProfile($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmployeeLanguages($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEmployeeLanguages($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmployee($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      is_verified\n      created_at\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n      role\n      cvs {\n        id\n        created_at\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEmployee($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      is_verified\n      created_at\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n      role\n      cvs {\n        id\n        created_at\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmployeeSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEmployeeSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEmployees {\n    users {\n      id\n      email\n      is_verified\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n    }\n  }\n"): (typeof documents)["\n  query GetEmployees {\n    users {\n      id\n      email\n      is_verified\n      profile {\n        first_name\n        last_name\n        avatar\n      }\n      department_name\n      position_name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ForgotPassword($auth: ForgotPasswordInput!) {\n    forgotPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  query Login($auth: AuthInput!) {\n    login(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"): (typeof documents)["\n  mutation ResetPassword($auth: ResetPasswordInput!) {\n    resetPassword(auth: $auth)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Signup($auth: AuthInput!) {\n    signup(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation Signup($auth: AuthInput!) {\n    signup(auth: $auth) {\n      user {\n        id\n      }\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDepartment($department: CreateDepartmentInput!) {\n    createDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDepartment($department: CreateDepartmentInput!) {\n    createDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteDepartment($department: DeleteDepartmentInput!) {\n    deleteDepartment(department: $department) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDepartment($department: DeleteDepartmentInput!) {\n    deleteDepartment(department: $department) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDepartment($department: UpdateDepartmentInput!) {\n    updateDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDepartment($department: UpdateDepartmentInput!) {\n    updateDepartment(department: $department) {\n      id,\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDepartments {\n    departments {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetDepartments {\n    departments {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateLanguage($language: CreateLanguageInput!) {\n    createLanguage(language: $language) {\n      id,\n      iso2\n      name\n      native_name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateLanguage($language: CreateLanguageInput!) {\n    createLanguage(language: $language) {\n      id,\n      iso2\n      name\n      native_name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteLanguage($language: DeleteLanguageInput!) {\n    deleteLanguage(language: $language) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteLanguage($language: DeleteLanguageInput!) {\n    deleteLanguage(language: $language) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateLanguage($language: UpdateLanguageInput!) {\n    updateLanguage(language: $language) {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateLanguage($language: UpdateLanguageInput!) {\n    updateLanguage(language: $language) {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLanguages {\n    languages {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n"): (typeof documents)["\n  query GetLanguages {\n    languages {\n      id\n      iso2\n      name\n      native_name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePosition($position: CreatePositionInput!) {\n    createPosition(position: $position) {\n      id,\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePosition($position: CreatePositionInput!) {\n    createPosition(position: $position) {\n      id,\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePosition($position: DeletePositionInput!) {\n    deletePosition(position: $position) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePosition($position: DeletePositionInput!) {\n    deletePosition(position: $position) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePosition($position: UpdatePositionInput!) {\n    updatePosition(position: $position) {\n      id,\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePosition($position: UpdatePositionInput!) {\n    updatePosition(position: $position) {\n      id,\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPositions {\n    positions {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetPositions {\n    positions {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSkill($skill: CreateSkillInput!) {\n    createSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSkill($skill: CreateSkillInput!) {\n    createSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSkill($skill: DeleteSkillInput!) {\n    deleteSkill(skill: $skill) {\n      affected\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSkill($skill: DeleteSkillInput!) {\n    deleteSkill(skill: $skill) {\n      affected\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSkill($skill: UpdateSkillInput!) {\n    updateSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSkill($skill: UpdateSkillInput!) {\n    updateSkill(skill: $skill) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n    }\n  }\n"): (typeof documents)["\n  query GetSkillCategories {\n    skillCategories {\n      id\n      name\n      order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSkills {\n    skills {\n      id\n      name\n      category {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSkills {\n    skills {\n      id\n      name\n      category {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateToken {\n    updateToken {\n      access_token\n      refresh_token\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserForStore($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n        avatar\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserForStore($userId: ID!) {\n    user(userId: $userId) {\n      id\n      email\n      role\n      profile {\n        first_name\n        last_name\n        avatar\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      profile {\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserSkills($userId: ID!) {\n    user(userId: $userId) {\n      id\n      profile {\n        skills {\n          name\n          categoryId\n          mastery\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {\n    deleteProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddProfileSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddProfileSkill($skill: AddProfileSkillInput!) {\n    addProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {\n    updateProfileSkill(skill: $skill) {\n      skills {\n        name\n        categoryId\n        mastery\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;