import React from 'react'
import DataContext from "./context";
import {
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
    deleteQuizQuery
} from '../../utils/queries';
import {useMutation, useQuery} from "@apollo/client";

export default function DataProvider({children}) {
    const getQuestions = useQuery(getQuestionsQuery);
    const questions = getQuestions.data && getQuestions.data.questions;
    const [addQuestion] = useMutation(addQuestionQuery);
    const [editQuestion] = useMutation(editQuestionQuery);
    const [deleteQuestion] = useMutation(deleteQuestionQuery);

    const getRounds = useQuery(getRoundsQuery);
    const rounds = getRounds.data && getRounds.data.rounds;
    const [addRound] = useMutation(addRoundQuery);
    const [editRound] = useMutation(editRoundQuery);
    const [deleteRound] = useMutation(deleteRoundQuery);

    const getQuizzes = useQuery(getQuizzesQuery);
    const quizzes = getQuizzes.data && getQuizzes.data.quizzes;
    const [addQuiz] = useMutation(addQuizQuery);
    const [editQuiz] = useMutation(editQuizQuery);
    const [deleteQuiz] = useMutation(deleteQuizQuery);

    const value = {
        state: {
            questions, rounds, quizzes
        },
        actions: {
            getQuestions,
            addQuestion,
            editQuestion,
            deleteQuestion,
            getRounds,
            addRound,
            editRound,
            deleteRound,
            getQuizzes,
            addQuiz,
            editQuiz,
            deleteQuiz
        }
    }

    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
}