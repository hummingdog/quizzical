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
    const [draggedEl, setDraggedEl] = useState({})
    const [draggedElTarget, setDraggedElTarget] = useState({})

    function startDrag(event) {
        if (!event.target.classList.contains('item-option')) {
            setDraggedEl({
                draggingItem: true,
                item: event.target.dataset.id,
                number: +event.target.dataset.number,
                panel: event.target.dataset.panel,
                length: +event.target.dataset.length
            });
        } else {
            setDraggedEl({
                item: event.target.dataset.id,
                option: +event.target.dataset.option
            });
        }
    }

    function endDrag(event) {
        // draggedEl.classList.remove('dropItem');
        setDraggedEl({});
        setDraggedElTarget({});
    }

    function enterDrag(event) {
        event.preventDefault()
        if (draggedEl.draggingItem && !event.currentTarget.classList.contains('item-option')) {
            setDraggedElTarget({
                item: event.currentTarget.dataset.id,
                number: +event.currentTarget.dataset.number,
                panel: event.currentTarget.dataset.panel,
                length: +event.currentTarget.dataset.length
            });
            if (draggedEl.panel === 'questions' && draggedEl.length < 2) return false;
            if (draggedEl.number + 1 === draggedElTarget.number) {
                // draggedEl.classList.add('dropItem');
                event.dataTransfer.dropEffect = 'copy';
            }
        } else if (!draggedEl.draggingItem && event.currentTarget.classList.contains('item-option')) {
            setDraggedElTarget({
                item: event.currentTarget.dataset.id,
                option: +event.currentTarget.dataset.option
            });
            if (draggedEl.item === draggedElTarget.item) {
                event.dataTransfer.dropEffect = 'move';
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }

    function overDrag(event) {
        event.preventDefault();
        if (draggedEl.draggingItem) {
            if ((draggedEl.panel === 'questions' && draggedEl.length < 2) || (draggedEl.number + 1 !== draggedElTarget.number)) {
                event.dataTransfer.dropEffect = 'none';
            } else {
                event.dataTransfer.dropEffect = 'copy';
            }
        } else {
            if (draggedEl.option === undefined || draggedElTarget.option === undefined) {
                event.dataTransfer.dropEffect = 'none';
            } else {
                event.dataTransfer.dropEffect = 'move';
            }
        }
    }

    function exitDrag(event) {
        // targetEl.current.classList.remove('dropItem');
    }

    function drop(event) {
        if (draggedEl.draggingItem) {
            addOptionFromPanel();
        } else {
            moveOptionInSelection(draggedEl.option, draggedElTarget.option);
        }
        // draggedEl.classList.remove('dropItem');
        setDraggedEl({});
        setDraggedElTarget({});
    }

    function addOptionFromPanel() {
        let newItem;
        let target;

        switch(draggedElTarget.panel) {
            case 'rounds':
                target = rounds.filter(round => round.id === draggedElTarget.item)[0]
                target.selection.push(draggedEl.item)
        }
        // let newItem = {...item};
        // newItem.selection.push(draggedEl.item);
        // editItem({...newItem});
    }

    function moveOptionInSelection(origin, destination) {
        // let newItem = {...item};
        // const optionToMove = newItem.selection[origin];
        // newItem.selection.splice(origin, 1);
        // newItem.selection.splice(destination, 0, optionToMove);
        // // if (newItem.correct === destination) newItem.correct = destination - 1;
        // // else if (newItem.correct === origin) newItem.correct = destination;
        // editItem({...newItem});
    }

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
                    onDragEnter={enterDrag}
                    onDragOver={overDrag}
                    onDragLeave={exitDrag}
                    onDragStart={startDrag}
                    onDragEnd={endDrag}
                    onDrop={drop}
                />
            )}
        </main>
    );
}
