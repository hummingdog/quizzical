import React, {useState, useEffect} from 'react';
import Panel from '../Panel';
import {questions as staticQuestions, rounds as staticRounds, quizzes as staticQuizzes} from '../../static/dataMock';
import '../../app.css';
import useQuestions from "../../providers/questions/use";
import {quotaErrorCallbacks} from "workbox-core/models/quotaErrorCallbacks";
import {useQuery} from "@apollo/client";
import {getQuestionsQuery} from "../../utils/queries";

export default function Build() {

    // const questionsContext = useQuestions()
    //
    // questionsContext.actions.getQuestions
    //     .then(res => console.log(res))
    //
    // questionsContext.actions.getRounds
    //     .then(res => console.log(res))

    const questions = useQuery(getQuestionsQuery)
    // console.log(questions.data)


    const [editing, switchEditing] = useState(false);
    const [editingId, switchEditingId] = useState('');
    // const [questions, editQuestions] = useState(staticQuestions);
    const [rounds, editRounds] = useState(staticRounds);
    const [quizzes, editQuizzes] = useState(staticQuizzes);
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
                item: {id: event.target.dataset.id},
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
                let targetPos = rounds.indexOf(target)
                let newRound = {...target}
                newRound.selection.push(draggedEl.item)
                let newRounds = [...rounds]
                newRounds.splice(targetPos, 1, newRound)
                editRounds(newRounds)
        }
        // let newItem = {...item};
        // newItem.selection.push(draggedEl.item);
        // editItem({...newItem});
    }

    function moveOptionInSelection(origin, destination) {
        let target;
        target = questions.filter(question => question.id === draggedElTarget.item)[0]
        let newQuestions = [...questions];
        let newItem = {...target}
        const optionToMove = newItem.selection[origin];
        newItem.selection.splice(origin, 1);
        newItem.selection.splice(destination, 0, optionToMove);
        let targetPos = newQuestions.indexOf(target)
        newQuestions.splice(targetPos, 1, newItem)
        // editQuestions(newQuestions)
        // if (newItem.correct === destination) newItem.correct = destination - 1;
        // else if (newItem.correct === origin) newItem.correct = destination;
        // editItem({...newItem});
    }

    function switchPanel(i) {
        if (!editing) {
            let changeExpanded = [...panels];
            changeExpanded.forEach((panel, j) => panel.expanded = i === j);
            editPanels(changeExpanded);
        }
    }

    return (
        <main>
            {questions.data &&
                <Panel
                    // key={'panel' + i}
                    data={questions.data.questions}
                    partnerData={[]}
                    expanded={true}
                    editing={editing}
                    editingId={editingId}
                    panelNumber={0}
                    thisPanel='questions'
                    panelTitle='Questions'
                    onSaveData={false}
                    onSwitchEditing={switchEditing}
                    onSwitchEditingId={switchEditingId}
                    onSwitchPanel={() => switchPanel(0)}
                    onDragEnter={enterDrag}
                    onDragOver={overDrag}
                    onDragLeave={exitDrag}
                    onDragStart={startDrag}
                    onDragEnd={endDrag}
                    onDrop={drop}
                />
            }
            <Panel
                // key={'panel' + i}
                data={rounds}
                partnerData={questions.data ?? []}
                expanded={false}
                editing={editing}
                editingId={editingId}
                panelNumber={1}
                thisPanel='rounds'
                panelTitle='Rounds'
                onSaveData={editRounds}
                onSwitchEditing={switchEditing}
                onSwitchEditingId={switchEditingId}
                onSwitchPanel={() => switchPanel(1)}
                onDragEnter={enterDrag}
                onDragOver={overDrag}
                onDragLeave={exitDrag}
                onDragStart={startDrag}
                onDragEnd={endDrag}
                onDrop={drop}
            />
            <Panel
                // key={'panel' + i}
                data={quizzes}
                partnerData={rounds}
                expanded={false}
                editing={editing}
                editingId={editingId}
                panelNumber={2}
                thisPanel='quizzes'
                panelTitle='Quizzes'
                onSaveData={editQuizzes}
                onSwitchEditing={switchEditing}
                onSwitchEditingId={switchEditingId}
                onSwitchPanel={() => switchPanel(2)}
                onDragEnter={enterDrag}
                onDragOver={overDrag}
                onDragLeave={exitDrag}
                onDragStart={startDrag}
                onDragEnd={endDrag}
                onDrop={drop}
            />
        </main>
    );
}
