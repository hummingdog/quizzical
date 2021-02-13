import React, {useState, useEffect} from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ItemHeader from '../ItemHeader';
import ItemText from '../ItemText';
import Option from '../Option';
import DragHandle from '../DragHandle';
import {categories} from '../../static/categories';
import './item.css';
import '../../static/colorBlocks.css';
import {generateUniqueID} from "web-vitals/dist/lib/generateUniqueID";

export let draggedEl = {};
export let draggedElTarget = {};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    if (destClone.length > 2) {
        const [last] = destClone.splice(2,1)
        sourceClone.splice(0, 0, last)
    }

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

export default function Item(props) {

    const [item, editItem] = useState({...props.item});
    const [backupItem, editBackupItem] = useState({...props.item});
    const [expanded, toggleExpanded] = useState(props.item.id === props.editingId);
    const [editingThis, toggleEditingThis] = useState(props.item.id === props.editingId);
    const [itemComplete, toggleItemComplete] = useState(true);
    const [dragging, toggleDragging] = useState('supported');
    const [answers, setAnswers] = useState(
        [[props.item.selection[0], props.item.selection[1]],
            [props.item.selection[2], props.item.selection[3]]]
    );


    useEffect(() => {
        editItem({...props.item});
    }, [props.item]);

    useEffect(() => {
        if (props.collapseAll) toggleExpanded(false);
    }, [props.collapseAll]);

    function checkComplete(length = 1) {
        let c = true;
        if (length === 0 || item.text.length === 0 || item.selection.text.length < 2) c = false;
        item.selection.forEach(option => { if (option.text.length === 0) c = false; });
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
        editItem( {...newItem});
    }

    function saveItem() {
        checkComplete();
        if (itemComplete) {
            props.onSaveItem({...item});
            editBackupItem({...item});
            toggleEditingThis(false);
            props.onSwitchEditing(false);
        }
    }

    function cancelItem() {
        if (item.id === 0) {
            props.onDeleteItem(props.item.id);
        } else {
            editItem( {...backupItem});
        }
        toggleEditingThis(false);
        props.onSwitchEditing(false);
    }

    function addOptionFromPanel() {
        let newItem = {...item};
        newItem.selection.push(draggedEl.item);
        editItem({...newItem});
    }

    // function moveOptionInSelection(origin, destination) {
    //     let newItem = {...item};
    //     const optionToMove = newItem.selection[origin];
    //     newItem.selection.splice(origin, 1);
    //     newItem.selection.splice(destination, 0, optionToMove);
    //     if (newItem.correct === origin) newItem.correct = destination;
    //     editItem({...newItem});
    // }

    function addOption() {
        let newItem = {...item};
        newItem.selection.push({id: generateUniqueID(), text: ''});
        editItem({...newItem});
    }

    function editOption(i, option) {
        let newItem = {...item};
        newItem.selection[i] = option;
        editItem({...newItem});
    }

    function removeOption(i) {
        let newItem = {...item};
        newItem.selection.splice(i, 1);
        editItem({...newItem});
        if (props.thisPanel === 'questions') setCorrect(0);
    }

    function setCorrect(i) {
        let newItem = {...item};
        newItem.correct = +i;
        editItem({...newItem});
    }

    // function startDrag(event) {
    //     if (!event.target.classList.contains('item-option')) {
    //         draggedEl = {
    //             draggingItem: true,
    //             item: event.currentTarget.dataset.id,
    //             number: +event.currentTarget.dataset.number,
    //             panel: event.currentTarget.dataset.panel,
    //             length: +event.currentTarget.dataset.length
    //         };
    //     } else {
    //         draggedEl = {
    //             item: event.target.dataset.id,
    //             option: +event.target.dataset.option
    //         };
    //     }
    // }

    // function enterDrag(event) {
    //     if (draggedEl.draggingItem && !event.target.classList.contains('item-option')) {
    //         draggedElTarget = {
    //             item: event.currentTarget.dataset.id,
    //             number: +event.currentTarget.dataset.number,
    //             panel: event.currentTarget.dataset.panel,
    //             length: +event.currentTarget.dataset.length
    //         };
    //         if (draggedEl.panel === 'questions' && draggedEl.length < 2) return false;
    //         if (draggedEl.number + 1 === draggedElTarget.number) {
    //             // event.currentTarget.classList.add('drop-item');
    //             event.dataTransfer.dropEffect = 'copy';
    //         }
    //     } else {
    //         draggedElTarget = {
    //             item: event.target.dataset.id,
    //             option: +event.target.dataset.option
    //         };
    //         if (draggedEl.item === draggedElTarget.item) {
    //             event.dataTransfer.dropEffect = 'move';
    //         } else {
    //             event.dataTransfer.dropEffect = 'none';
    //         }
    //     }
    // }

    // function overDrag(event) {
    //     event.preventDefault();
    //     if (draggedEl.draggingItem) {
    //         if ((draggedEl.panel === 'questions' && draggedEl.length < 2) || (draggedEl.number + 1 !== draggedElTarget.number)) {
    //             event.dataTransfer.dropEffect = 'none';
    //         } else {
    //             event.dataTransfer.dropEffect = 'copy';
    //         }
    //     } else {
    //         if (draggedEl.option === undefined || draggedElTarget.option === undefined) {
    //             event.dataTransfer.dropEffect = 'none';
    //         } else {
    //             event.dataTransfer.dropEffect = 'move';
    //         }
    //     }
    // }
    //
    // function exitDrag(event) {
    //     event.currentTarget.classList.remove('dropItem');
    // }
    //
    // function endDrag(event) {
    //     event.currentTarget.classList.remove('dropItem');
    //     draggedEl = {};
    //     draggedElTarget = {};
    // }

    // function drop(event) {
    //     if (draggedEl.draggingItem) {
    //         addOptionFromPanel();
    //     } else {
    //         moveOptionInSelection(draggedEl.option, draggedElTarget.option);
    //         console.log(draggedEl.option, draggedElTarget.option);
    //     }
    //     event.currentTarget.classList.remove('dropItem');
    //     draggedEl = {};
    //     draggedElTarget = {};
    // }



    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(answers[sInd], source.index, destination.index);
            const newAnswers = [...answers];
            newAnswers[sInd] = items;
            setAnswers(newAnswers);
        } else {
            const result = move(answers[sInd], answers[dInd], source, destination);
            const newAnswers = [...answers];
            newAnswers[sInd] = result[sInd];
            newAnswers[dInd] = result[dInd];

            setAnswers(newAnswers.filter(group => group.length));
        }
    }

    return (
        <div
            data-id={item.id}
            data-number={props.panelNumber}
            data-panel={props.thisPanel}
            data-length={item.selection.length}
            draggable={itemComplete && !editingThis}
            // onDragStart={startDrag}
            // onDragEnter={enterDrag}
            // onDragOver={overDrag}
            // onDragExit={exitDrag}
            // onDragEnd={endDrag}
            // onDrop={drop}
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
                    onCancel={cancelItem}
                    onDeleteItem={props.onDeleteItem}
                />
            }
            <ItemText
                item={item}
                expanded={expanded}
                editing={props.editing && editingThis}
                panelExpanded={props.panelExpanded}
                onToggleItem={toggleExpanded}
                onCheckComplete={checkComplete}
                onStartEdit={startEdit}
                onEditItemText={editItemText}
            />
            {expanded && props.panelExpanded &&
                <div className='item-options'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {answers.map((el, ind) => (
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {el.map((item, index) => (
                                            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        // style={provided.draggableProps.style}
                                                    >
                                                        <Option
                                                            key={item + index}
                                                            number={index}
                                                            option={item}
                                                            item={item}
                                                            correct={item.correct}
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                        ))}
                    </DragDropContext>
                    {props.thisPanel === 'questions' && props.item.length < 4 && editingThis &&
                    <button
                        title='add an option'
                        className='add-option'
                        onClick={addOption}
                    >
                        + add option
                    </button>
                    }
                    {/*<DragDropContext onDragEnd={onDragEnd}>*/}
                    {/*    {answers.map((el, ind) => (*/}
                    {/*        <Droppable key={ind} droppableId={`${ind}`}>*/}
                    {/*            {(provided, snapshot) => (*/}
                    {/*                <div className='item-options'*/}
                    {/*                     ref={provided.innerRef}*/}
                    {/*                     {...provided.droppableProps}*/}
                    {/*                >*/}
                    {/*                    {el.map((o, i) => (*/}
                    {/*                        <Draggable*/}
                    {/*                            key={o.id}*/}
                    {/*                            draggableId={`${o.id}`}*/}
                    {/*                            index={i}*/}
                    {/*                        >*/}
                    {/*                            {(provided, snapshot) => (*/}
                    {/*                                <div*/}
                    {/*                                    ref={provided.innerRef}*/}
                    {/*                                    {...provided.draggableProps}*/}
                    {/*                                    {...provided.dragHandleProps}*/}
                    {/*                                >*/}
                    {/*                                    <Option*/}
                    {/*                                        key={o + i}*/}
                    {/*                                        number={i}*/}
                    {/*                                        option={o}*/}
                    {/*                                        item={item}*/}
                    {/*                                        correct={item.correct}*/}
                    {/*                                        partnerData={props.partnerData}*/}
                    {/*                                        editing={props.editing && editingThis}*/}
                    {/*                                        thisPanel={props.thisPanel}*/}
                    {/*                                        group={item.text}*/}
                    {/*                                        onCheckComplete={checkComplete}*/}
                    {/*                                        onStartEdit={startEdit}*/}
                    {/*                                        onSetCorrect={setCorrect}*/}
                    {/*                                        onEditOption={editOption}*/}
                    {/*                                        onRemoveOption={removeOption}*/}
                    {/*                                    />*/}
                    {/*                                    {props.thisPanel === 'questions' && item.selection.length < 4 && editingThis &&*/}
                    {/*                                        <button*/}
                    {/*                                            title='add an option'*/}
                    {/*                                            className='add-option'*/}
                    {/*                                            onClick={addOption}*/}
                    {/*                                        >*/}
                    {/*                                            + add option*/}
                    {/*                                        </button>*/}
                    {/*                                    }*/}
                    {/*                                </div>*/}
                    {/*                            )}*/}
                    {/*                        </Draggable>*/}
                    {/*                    ))}*/}
                    {/*                    {provided.placeholder}*/}
                    {/*                </div>*/}
                    {/*            )}*/}
                    {/*        </Droppable>*/}
                    {/*    ))}*/}
                    {/*</DragDropContext>*/}
                </div>
            }
            {!expanded && props.panelExpanded && (props.thisPanel !== 'quizzes') &&
                <DragHandle
                    description={'add it to a ' + (props.thisPanel === 'questions' ? 'round' : 'quiz')}
                    dragging={dragging}
                    onToggleDragging={toggleDragging}
                />
            }
        </div>
    );
}