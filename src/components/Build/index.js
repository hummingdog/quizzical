import React, {useState} from 'react';
import Panel from '../Panel';
import {questions as staticQuestions, rounds as staticRounds, quizzes as staticQuizzes} from '../../static/dataMock';
import '../../app.css';

export default function Build() {

    const [editing, switchEditing] = useState(false);
    const [editingId, switchEditingId] = useState('');
    const [questions, editQuestions] = useState([...staticQuestions]);
    const [rounds, editRounds] = useState([...staticRounds]);
    const [quizzes, editQuizzes] = useState([...staticQuizzes]);
    const [panels, editPanels] = useState([
        {
            name: 'questions',
            title: 'Questions',
            expanded: true
        },{
            name: 'rounds',
            title: 'Rounds',
            expanded: false
        },{
            name: 'quizzes',
            title: 'Quizzes',
            expanded: false
        }
    ]);

    function switchPanel(i) {
        if (!editing) {
            let changeExpanded = [...panels];
            changeExpanded.forEach((panel, j) => panel.expanded = i === j);
            editPanels([...changeExpanded]);
        }
    }

    return (
        <main>
            {panels.map((panel, i) =>
                <Panel
                    key={'panel' + i}
                    data={i === 0 ? questions : i === 1 ? rounds : quizzes}
                    partnerData={i === 1 ? questions : i === 2 ? rounds : []}
                    expanded={panel.expanded}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={i}
                    thisPanel={panel.name}
                    panelTitle={panel.title}
                    onSaveData={i === 0 ? editQuestions : i === 1 ? editRounds : editQuizzes}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(i)}
                />
            )}
        </main>
    );
}
