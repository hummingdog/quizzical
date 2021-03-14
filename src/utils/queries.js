import React, {useContext} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

export const getQuestionsQuery = gql`
    query getQuestions {
        questions {
            id
            title
            selection
            correctAnswer
            category
        }
    }`

export const addQuestionQuery = gql`
    mutation addQuestion($input: QuestionInput!) {
        addQuestion(
            input: $input
        ) {
            id
            title
            selection
            correctAnswer
            category
        }
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
            correctAnswer
            category
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

export const addRoundQuery = gql`
    mutation addRound($input: RoundInput!) {
        addRound(
            input: $input
        ) {
            id
            title
            selection
        }
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

export const addQuizQuery = gql`
    mutation addQuiz($input: QuizInput!) {
        addQuiz(
            input: $input
        ) {
            id
            title
            selection
        }
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