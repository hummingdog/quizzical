import React, {useContext} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

export const getQuestionsQuery = gql`
    query getQuestions {
        questions {
            id,
            questionText,
            selection
        }
    }`

export const editQuestionQuery = gql`
    mutation editQuestion($id: String!, $input: Question!) {
        editQuestion(
            id: $id,
            input: $input
        ) {
            id,
            questionText,
            selection
        }
    }
`

export const getRoundsQuery = gql`
    query getRounds {
        rounds {
            id,
            roundTitle,
            selection
        }
    }`