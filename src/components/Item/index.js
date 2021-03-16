import React, {useState, useEffect} from 'react';
import ItemHeader from '../ItemHeader';
import ItemText from '../ItemText';
import Option from '../Option';
import DragHandle from '../DragHandle';
import {categories} from '../../static/categories';
import './item.css';
import '../../static/color-blocks.css';
import {Draggable} from "react-beautiful-dnd";
import useData from "../../providers/data/use";

export default function Item(props) {

    const {
        state: {
            questions,
            rounds,
            quizzes
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
    } = useData()

    const [item, editItem] = useState(props.item);
    const [backupItem, editBackupItem] = useState(props.item);
    const [expanded, toggleExpanded] = useState(props.item.id === props.editingId);
    const [editingThis, toggleEditingThis] = useState(props.editing);
    const [itemComplete, toggleItemComplete] = useState();
    // const [dragging, toggleDragging] = useState('supported');

    useEffect(() => {
        editItem(props.item);
    }, [props.item]);

    useEffect(() => {
        if (props.collapseAll) toggleExpanded(false);
    }, [props.collapseAll]);

    function checkComplete() {
        let c = true
        if (item.text.length === 0) c = false;
        if (props.thisPanel === 0 && (item.selection.length < 2)) c = false;
        // if (item.title.length === 0 || item.selection.length < 2) c = false;
        item.selection.forEach(option => { if (option.length === 0) c = false; });
        toggleItemComplete(c);
        if (!c) toggleEditingThis(true);
    }

    const expandOrOpen = !props.panelExpanded ? ' closed' : expanded ? '' : ' closed';
    function expandItemAndPanel() {
        toggleExpanded(true);
        props.onSwitchPanel();
    }

    const categoryColor = props.thisPanel === 'questions' ? getCategoryColor() : '';
    function getCategoryColor() {
        let color;
        categories.filter(cat => {
            if (cat.name === props.item.category) color = cat.color;
        });
        return color;
    }

    function startEdit() {
        toggleEditingThis(true);
        props.onSwitchEditing(true);
    }

    function editItemText(value) {
        let newItem = {...item};
        newItem.text = value;
        editItem(newItem);
    }

    function saveItem() {
        checkComplete();
        if (itemComplete) {
            if (item.id === 0) {
                props.onAddItem({ variables: { input: item} })
                props.getData.refetch()
            } else {
                props.onEditItem({ variables: { id: item.id, input: item} })
            }
            editBackupItem(item);
            toggleEditingThis(false);
            props.onSwitchEditing(false);
        }
    }

    function deleteItem(itemId) {
        props.onDeleteItem({ variables: { id: itemId } })
        props.onRemoveItem(itemId)
        props.getData.refetch()
    }

    function cancelEdit() {
        if (item.id === 0) {
            props.onRemoveItem(props.item.id);
        } else {
            editItem(backupItem);
        }
        toggleEditingThis(false);
        props.onSwitchEditing(false);
    }

    function addOption() {
        let newSelection = [ ...item.selection ]
        let maxId = newSelection.reduce((a, b) => a.id > b.id ? a : b).id;
        newSelection.push({id: +maxId + 1, text: '', correct: false});
        let newItem = {...item, selection: newSelection};
        editItem(newItem);
    }

    function editOption(i, option) {
        let newSelection = [ ...item.selection ]
        newSelection[i] = option
        let newItem = {...item, selection: newSelection}
        editItem(newItem);
    }

    function removeOption(i) {
        let newSelection = [ ...item.selection ]
        newSelection.splice(i, 1);
        let newItem = {...item, selection: newSelection};
        editItem(newItem);
        // if (props.thisPanel === 'questions') setCorrect(0);
    }

    function setCorrect(optionId) {
        let newItem = JSON.parse(JSON.stringify(item));
        let prevCorrect = newItem.selection.filter(option => option.correct);
        !!prevCorrect.length && (prevCorrect[0].correct = false);
        newItem.selection.filter(option => option.id == optionId)[0].correct = true;
        editItem(newItem);
    }

    return (

                    <div
                        data-name={'item'}
                        data-id={item.id}
                        data-number={props.panelNumber}
                        data-panel={props.thisPanel}
                        data-length={item.selection.length}
                        className={'panel-item ' + props.thisPanel + expandOrOpen}
                        onClick={!props.panelExpanded && !props.editing ? expandItemAndPanel : undefined}
                    >
                        {!expanded && props.panelExpanded &&
                            <div className={'color-box ' + categoryColor}>
                            </div>
                        }
                        {expanded && props.panelExpanded &&
                            <ItemHeader
                                panelExpanded={props.panelExpanded}
                                item={props.item}
                                thisPanel={props.thisPanel}
                                nextPanel={props.nextPanel}
                                editing={props.editing}
                                editingThis={editingThis}
                                onToggleItem={() => toggleExpanded(!expanded)}
                                onStartEdit={startEdit}
                                onSaveItem={saveItem}
                                onCancel={cancelEdit}
                                onDeleteItem={deleteItem}
                            />
                        }
                        <ItemText
                            item={item}
                            expanded={expanded}
                            editing={props.editing && editingThis}
                            panelExpanded={props.panelExpanded}
                            onToggleItem={() => toggleExpanded(!expanded)}
                            onCheckComplete={checkComplete}
                            onStartEdit={startEdit}
                            onEditItemText={editItemText}
                        />
                        {expanded && props.panelExpanded &&
                            <div className='item-options'>
                                {item.selection.map((o, i) =>
                                    <Option
                                        key={o.id}
                                        number={i}
                                        option={o}
                                        item={item}
                                        // correct={item.correctAnswer === i}
                                        partnerData={props.partnerData}
                                        editing={props.editing && editingThis}
                                        thisPanel={props.thisPanel}
                                        group={item.text}
                                        onCheckComplete={checkComplete}
                                        onStartEdit={startEdit}
                                        onSetCorrect={setCorrect}
                                        onEditOption={editOption}
                                        onRemoveOption={removeOption}
                                    />
                                )}
                                {props.thisPanel === 'questions' && item.selection.length < 4 && editingThis &&
                                    <button
                                        title='add an option'
                                        className='add-option'
                                        onClick={addOption}
                                    >
                                        + add option
                                    </button>
                                }
                            </div>
                        }
                        {!expanded && props.panelExpanded && (props.thisPanel !== 'quizzes') &&
                            <DragHandle
                                description={'add it to a ' + (props.thisPanel === 'questions' ? 'round' : 'quiz')}
                                // dragging={dragging}
                                // onToggleDragging={toggleDragging}
                            />
                        }
                    </div>

    );
}