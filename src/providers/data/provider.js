import React from 'react'
import DataContext from "./context";
import {
    addQuestionQuery,
    editQuestionQuery,
    editQuizQuery,
    editRoundQuery,
    getQuestionsQuery,
    getQuizzesQuery,
    getRoundsQuery
} from '../../utils/queries';
import {useMutation, useQuery} from "@apollo/client";

export default function DataProvider({children}) {
    const getQuestions = useQuery(getQuestionsQuery);
    const questions = getQuestions.data && getQuestions.data.questions;
    const [editQuestion] = useMutation(editQuestionQuery);
    const [addQuestion] = useMutation(addQuestionQuery);

    const getRounds = useQuery(getRoundsQuery);
    const rounds = getRounds.data && getRounds.data.rounds;
    const [editRound] = useMutation(editRoundQuery);

    const getQuizzes = useQuery(getQuizzesQuery);
    const quizzes = getQuizzes.data && getQuizzes.data.quizzes;
    const [editQuiz] = useMutation(editQuizQuery);

    const value = {
        state: {
            questions, rounds, quizzes
        },
        actions: {
            addQuestion, editQuestion, editRound, editQuiz
        }
    }

    return <DataContext.Provider value={value}>
        {children}
    </DataContext.Provider>
}