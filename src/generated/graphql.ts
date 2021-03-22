import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateRating: Rating;
};


export type MutationUpdateRatingArgs = {
  data: RatingInput;
};

export type PostRating = {
  __typename?: 'PostRating';
  fullRating: Scalars['Float'];
  postId: Scalars['String'];
  userRating?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  postRating: Array<PostRating>;
};

export type Rating = {
  __typename?: 'Rating';
  _id: Scalars['String'];
  createdAt: Scalars['Float'];
  postId: Scalars['String'];
  updatedAt: Scalars['Float'];
  userId: Scalars['String'];
  value: Scalars['Float'];
};

export type RatingInput = {
  postId: Scalars['String'];
  value: Scalars['Float'];
};

export type UpdateRatingMutationVariables = Exact<{
  data: RatingInput;
}>;


export type UpdateRatingMutation = (
  { __typename?: 'Mutation' }
  & { updateRating: (
    { __typename?: 'Rating' }
    & Pick<Rating, 'postId' | 'value'>
  ) }
);

export type PostRatingQueryVariables = Exact<{ [key: string]: never; }>;


export type PostRatingQuery = (
  { __typename?: 'Query' }
  & { postRating: Array<(
    { __typename?: 'PostRating' }
    & Pick<PostRating, 'postId' | 'fullRating' | 'userRating'>
  )> }
);


export const UpdateRatingDocument = gql`
    mutation UpdateRating($data: RatingInput!) {
  updateRating(data: $data) {
    postId
    value
  }
}
    `;
export type UpdateRatingMutationFn = Apollo.MutationFunction<UpdateRatingMutation, UpdateRatingMutationVariables>;

/**
 * __useUpdateRatingMutation__
 *
 * To run a mutation, you first call `useUpdateRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRatingMutation, { data, loading, error }] = useUpdateRatingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRatingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRatingMutation, UpdateRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRatingMutation, UpdateRatingMutationVariables>(UpdateRatingDocument, options);
      }
export type UpdateRatingMutationHookResult = ReturnType<typeof useUpdateRatingMutation>;
export type UpdateRatingMutationResult = Apollo.MutationResult<UpdateRatingMutation>;
export type UpdateRatingMutationOptions = Apollo.BaseMutationOptions<UpdateRatingMutation, UpdateRatingMutationVariables>;
export const PostRatingDocument = gql`
    query PostRating {
  postRating {
    postId
    fullRating
    userRating
  }
}
    `;

/**
 * __usePostRatingQuery__
 *
 * To run a query within a React component, call `usePostRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostRatingQuery({
 *   variables: {
 *   },
 * });
 */
export function usePostRatingQuery(baseOptions?: Apollo.QueryHookOptions<PostRatingQuery, PostRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostRatingQuery, PostRatingQueryVariables>(PostRatingDocument, options);
      }
export function usePostRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostRatingQuery, PostRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostRatingQuery, PostRatingQueryVariables>(PostRatingDocument, options);
        }
export type PostRatingQueryHookResult = ReturnType<typeof usePostRatingQuery>;
export type PostRatingLazyQueryHookResult = ReturnType<typeof usePostRatingLazyQuery>;
export type PostRatingQueryResult = Apollo.QueryResult<PostRatingQuery, PostRatingQueryVariables>;