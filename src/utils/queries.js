import React, {useContext} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

export const getQuestionsQuery = gql`
    query getQuestions {
        questions {
            id
            title
            selection
        }
    }`

export const addQuestionQuery = gql `
    mutation addQuestion($id: ID!, $input: QuestionInput!) {
        addQuestion(
            id: $id,
            input: $input
        )
    } {
        id
        title
        selection
    }
`

export const editQuestionQuery = gql`
    mutation editQuestion($id: ID!, $input: QuestionInput!) {
        editQuestion(
            id: $id,
            input: $input
        ) {
            id
            title
            selection
        }
    }
`

export const deleteQuestionQuery = gql`
    mutation deleteQuestion($id: ID!) {
        deleteQuestion(
            id: $id
        ) {
            id
        }
    }
`

export const getRoundsQuery = gql`
    query getRounds {
        rounds {
            id
            title
            selection
        }
    }`

export const addRoundQuery = gql `
    mutation addRound($id: ID!, $input: RoundInput!) {
        addRound(
            id: $id,
            input: $input
        )
    } {
        id
        title
        selection
    }
`

export const editRoundQuery = gql`
    mutation editRound($id: ID!, $input: RoundInput!) {
        editRound(
            id: $id,
            input: $input
        ) {
            id
            title
            selection
        }
    }
`

export const deleteRoundQuery = gql`
    mutation deleteRound($id: ID!) {
        deleteRound(
            id: $id
        ) {
            id
        }
    }
`

export const getQuizzesQuery = gql`
    query getQuizzes {
        quizzes {
            id
            title
            selection
        }
    }`

export const addQuizQuery = gql `
    mutation addQuiz($id: ID!, $input: QuizInput!) {
        addQuiz(
            id: $id,
            input: $input
        )
    } {
        id
        title
        selection
    }
`

export const editQuizQuery = gql`
    mutation editQuiz($id: ID!, $input: QuizInput!) {
        editQuiz(
            id: $id,
            input: $input
        ) {
            id
            title
            selection
        }
    }
`

export const deleteQuizQuery = gql`
    mutation deleteQuiz($id: ID!) {
        deleteQuiz(
            id: $id
        ) {
            id
        }
    }
`