import React, {useState} from 'react';
import Panel from '../Panel';
import '../../app.css';
import useData from "../../providers/data/use";

export default function Build() {

    const {
        state: {
            questions,
            rounds,
            quizzes
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
                    getData={getQuestions}
                    partnerData={[]}
                    expanded={currentPanel === 0}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={0}
                    thisPanel='questions'
                    panelTitle='Questions'
                    onAddItem={addQuestion}
                    onEditItem={editQuestion}
                    onDeleteItem={deleteQuestion}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(0)}
                />
            }
            {rounds && questions &&
                <Panel
                    data={rounds}
                    getData={getRounds}
                    partnerData={questions ?? []}
                    expanded={currentPanel === 1}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={1}
                    thisPanel='rounds'
                    panelTitle='Rounds'
                    onSwitchEditing={switchEditing}
                    onAddItem={addRound}
                    onEditItem={editRound}
                    onDeleteItem={deleteRound}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(1)}
                />
            }
            {quizzes && rounds &&
                <Panel
                    data={quizzes}
                    getData={getQuizzes}
                    partnerData={rounds}
                    expanded={currentPanel === 2}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={2}
                    thisPanel='quizzes'
                    panelTitle='Quizzes'
                    onAddItem={addQuiz}
                    onEditItem={editQuiz}
                    onDeleteItem={deleteQuiz}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(2)}
                />
            }
        </main>
    );
}
