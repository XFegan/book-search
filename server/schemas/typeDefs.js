const { gql } = require("apollo-server-express");

// typeDefs
const typeDefs = gql`
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }
  input BookInput {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }
  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookBody: BookInput!): User
    removeBook(bookId: String!): User
  }
`;


module.exports = typeDefs;