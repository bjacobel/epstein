import { gql } from '@apollo/client';

export const PASSENGERS = gql`
  query {
    passengers(includeUnverified: false) {
      edges {
        ... on VerifiedPassenger {
          id
          slug
          name
          biography
          wikipedia_link
          image
          literals
        }
      }
    }
  }
`;

export const CREATE_OR_UPDATE_PASSENGER = gql`
  mutation(
    $slug: String!
    $name: String
    $biography: String
    $wikipedia_link: AWSURL
    $image: AWSURL
  ) {
    createOrUpdatePassenger(
      slug: $slug
      name: $name
      biography: $biography
      wikipedia_link: $wikipedia_link
      image: $image
    ) {
      id
      slug
      name
      biography
      wikipedia_link
      image
      literals
    }
  }
`;

export const UPDATE_LITERALS = gql`
  mutation($slug: String!, $literals: [String]!) {
    updateLiterals(slug: $slug, literals: $literals) {
      id
      slug
      literals
    }
  }
`;
