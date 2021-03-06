import React, {useContext} from 'react';
import QuestionsContext from "./context";
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
});

const getQuestionsQuery = gql`
    query getQuestions {
        questions {
            id,
            questionText
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

const getRoundsQuery = gql`
    query getRounds {
        rounds {
            id,
            roundTitle,
            selection
        }
    }`

export default function QuestionsProvider ({children}) {

    const getQuestions = client.query({query: getQuestionsQuery});
    const getRounds = client.query({query: getRoundsQuery});

    const value = {
        actions: { getQuestions, getRounds }
    }

    return <QuestionsContext.Provider value={value}>
        {children}
    </QuestionsContext.Provider>
}