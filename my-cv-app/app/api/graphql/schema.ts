import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql';

const SkillType = new GraphQLObjectType({
  name: 'Skill',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    categoryId: { type: GraphQLID },
    categoryName: { type: GraphQLString },
  },
});

const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    iso2: { type: GraphQLString },
  },
});

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    internalName: { type: GraphQLString },
    description: { type: GraphQLString },
    domain: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    environment: { type: new GraphQLList(GraphQLString) },
  },
});

const CvProjectType = new GraphQLObjectType({
  name: 'CvProject',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    responsibilities: { type: new GraphQLList(GraphQLString) },
    project: { type: ProjectType },
  },
});

const CVType = new GraphQLObjectType({
  name: 'CV',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    fullname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: GraphQLString },
    description: { type: GraphQLString },
    skills: { type: new GraphQLList(SkillType) },
    languages: { type: new GraphQLList(LanguageType) },
    projects: { type: new GraphQLList(CvProjectType) },
    userId: { type: GraphQLID },
  },
});

const CVInputType = new GraphQLInputObjectType({
  name: 'CVInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    fullname: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: GraphQLString },
    description: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const CVUpdateInputType = new GraphQLInputObjectType({
  name: 'CVUpdateInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    fullname: { type: GraphQLString },
    education: { type: GraphQLString },
    description: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const SkillInputType = new GraphQLInputObjectType({
  name: 'SkillInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    categoryId: { type: GraphQLID },
    mastery: { type: GraphQLString },
  },
});

const ProjectInputType = new GraphQLInputObjectType({
  name: 'ProjectInput',
  fields: {
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    domain: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    description: { type: GraphQLString },
    responsibilities: { type: new GraphQLList(GraphQLString) },
    environment: { type: new GraphQLList(GraphQLString) },
  },
});