import React from 'react'
import DataContext from "./context";
import {
    getUserQuestionsQuery,
    getQuestionsQuery,
    addQuestionQuery,
    editQuestionQuery,
    deleteQuestionQuery,
    getRoundsQuery,
    addRoundQuery,
    editRoundQuery,
    deleteRoundQuery,
    getQuizzesQuery,
    addQuizQuery,
    editQuizQuery,
    deleteQuizQuery, getUserQuery
} from '../../utils/queries';
import {useMutation, useQuery} from "@apollo/client";

export default function DataProvider({children}) {
    const getUser = useQuery(getUserQuery, {
        variables: { id: '60206483f651da53cba32a7c' },
    })

    const questions = getUser.data && getUser.data.user.questions;
    const [addQuestion] = useMutation(addQuestionQuery);
    const [editQuestion] = useMutation(editQuestionQuery);
    const [deleteQuestion] = useMutation(deleteQuestionQuery);

    const rounds = getUser.data && getUser.data.user.rounds;
    const [addRound] = useMutation(addRoundQuery);
    const [editRound] = useMutation(editRoundQuery);
    const [deleteRound] = useMutation(deleteRoundQuery);

    const quizzes = getUser.data && getUser.data.user.quizzes;
    const [addQuiz] = useMutation(addQuizQuery);
    const [editQuiz] = useMutation(editQuizQuery);
    const [deleteQuiz] = useMutation(deleteQuizQuery);

    const value = {
        state: {
            questions, rounds, quizzes
        },
        actions: {
            getUser,
            // getQuestions,
            addQuestion,
            editQuestion,
            deleteQuestion,
            // getRounds,
            addRound,
            editRound,
            deleteRound,
            // getQuizzes,
            addQuiz,
            editQuiz,
            deleteQuiz
        }
    }

    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
}