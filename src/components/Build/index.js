import React, {useState} from 'react';
import {useMutation, useQuery} from '@apollo/client';
import Panel from '../Panel';
import '../../app.css';
import {
    editQuestionQuery,
    editQuizQuery,
    editRoundQuery,
    getQuestionsQuery,
    getQuizzesQuery,
    getRoundsQuery
} from '../../utils/queries';
import useData from "../../providers/data/use";

export default function Build() {

    // const getQuestions = useQuery(getQuestionsQuery);
    // const questions = getQuestions.data && getQuestions.data.questions;
    // const [editQuestion] = useMutation(editQuestionQuery);
    //
    // const getRounds = useQuery(getRoundsQuery);
    // const rounds = getRounds.data && getRounds.data.rounds;
    // const [editRound] = useMutation(editRoundQuery);
    //
    // const getQuizzes = useQuery(getQuizzesQuery);
    // const quizzes = getQuizzes.data && getQuizzes.data.quizzes;
    // const [editQuiz] = useMutation(editQuizQuery);

    const {
        state: {
            questions,
            rounds,
            quizzes
        },
        actions: {
            addQuestion,
            editQuestion,
            deleteQuestion,
            addRound,
            editRound,
            deleteRound,
            addQuiz,
            editQuiz,
            deleteQuiz
        }
    } = useData()

    const [editing, switchEditing] = useState(false);
    const [editingId, switchEditingId] = useState('');
    const [currentPanel, setCurrentPanel] = useState(0);

    function switchPanel(i) {
        if (!editing) setCurrentPanel(i);
    }

    return (
        <main>
            {questions &&
                <Panel
                    data={questions}
                    partnerData={[]}
                    expanded={currentPanel === 0}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={0}
                    thisPanel='questions'
                    panelTitle='Questions'
                    onSaveData={editQuestion}
                    onAddItem={addQuestion}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(0)}
                />
            }
            {rounds && questions &&
                <Panel
                    data={rounds}
                    partnerData={questions ?? []}
                    expanded={currentPanel === 1}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={1}
                    thisPanel='rounds'
                    panelTitle='Rounds'
                    onSaveData={editRound}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(1)}
                />
            }
            {quizzes && rounds &&
                <Panel
                    data={quizzes}
                    partnerData={rounds}
                    expanded={currentPanel === 2}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={2}
                    thisPanel='quizzes'
                    panelTitle='Quizzes'
                    onSaveData={editQuiz}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(2)}
                />
            }
        </main>
    );
}
