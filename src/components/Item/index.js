import React, {useState, useEffect} from 'react';
import ItemHeader from '../ItemHeader';
import ItemText from '../ItemText';
import Option from '../Option';
import DragHandle from '../DragHandle';
import {categories} from '../../static/categories';
import './item.css';
import '../../static/colorBlocks.css';

export default function Item(props) {

    const [item, editItem] = useState({...props.item});
    const [backupItem, editBackupItem] = useState({...props.item});
    const [expanded, toggleExpanded] = useState(props.item.id === props.editingId);
    const [editingThis, toggleEditingThis] = useState(props.item.id === props.editingId);
    const [itemComplete, toggleItemComplete] = useState(true);
    const [dragging, toggleDragging] = useState('supported');
    const [draggedEl, setDraggedEl] = useState({})
    const [draggedElTarget, setDraggedElTarget] = useState({})

    useEffect(() => {
        editItem({...props.item});
    }, [props.item]);

    useEffect(() => {
        if (props.collapseAll) toggleExpanded(false);
    }, [props.collapseAll]);

    function checkComplete(length = 1) {
        let c = true;
        if (length === 0 || item.text.length === 0 || item.selection.length < 2) c = false;
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

    function moveOptionInSelection(origin, destination) {
        let newItem = {...item};
        const optionToMove = newItem.selection[origin];
        newItem.selection.splice(origin, 1);
        newItem.selection.splice(destination, 0, optionToMove);
        // if (newItem.correct === destination) newItem.correct = destination - 1;
        // else if (newItem.correct === origin) newItem.correct = destination;
        editItem({...newItem});
    }

    function addOption() {
        let newItem = {...item};
        newItem.selection.push({});
        editItem({...newItem});
    }

    function editOption(i, option) {
        let newItem = {...item};
        newItem.selection[i].text = option;
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
        // event.currentTarget.classList.remove('dropItem');
        setDraggedEl({});
        setDraggedElTarget({});
    }

    function enterDrag(event) {
        event.preventDefault()
        if (draggedEl.draggingItem && !event.target.classList.contains('item-option')) {
            setDraggedElTarget({
                item: event.currentTarget.dataset.id,
                number: +event.currentTarget.dataset.number,
                panel: event.currentTarget.dataset.panel,
                length: +event.currentTarget.dataset.length
            });
            if (draggedEl.panel === 'questions' && draggedEl.length < 2) return false;
            if (draggedEl.number + 1 === draggedElTarget.number) {
                // event.currentTarget.classList.add('drop-item');
                event.dataTransfer.dropEffect = 'copy';
            }
        } else {
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
        // event.currentTarget.classList.remove('dropItem');
    }

    function drop(event) {
        if (draggedEl.draggingItem) {
            addOptionFromPanel();
        } else {
            moveOptionInSelection(draggedEl.option, draggedElTarget.option);
        }
        // event.currentTarget.classList.remove('dropItem');
        setDraggedEl({});
        setDraggedElTarget({});
    }

    return (
        <div
            data-name={'item'}
            data-id={item.id}
            data-number={props.panelNumber}
            data-panel={props.thisPanel}
            data-length={item.selection.length}
            draggable={itemComplete && !editingThis}
            // onDragEnter={enterDrag}
            // onDragOver={overDrag}
            // onDragLeave={exitDrag}
            onDragStart={startDrag}
            onDragEnd={endDrag}
            onDrop={drop}
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
                    {item.selection.map((o, i) =>
                        <div
                            key={o.id}
                        >
                            <Option
                                number={i}
                                option={o.text}
                                item={item}
                                correct={item.correct === o.id}
                                partnerData={props.partnerData}
                                editing={props.editing && editingThis}
                                thisPanel={props.thisPanel}
                                group={item.text}
                                onCheckComplete={checkComplete}
                                onStartEdit={startEdit}
                                onSetCorrect={setCorrect}
                                onEditOption={editOption}
                                onRemoveOption={removeOption}
                                onDragStart={startDrag}
                                onDragEnd={endDrag}
                                onDragEnter={enterDrag}
                                onDragOver={overDrag}
                                onDragLeave={exitDrag}
                            />
                        </div>
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
                    dragging={dragging}
                    onToggleDragging={toggleDragging}
                />
            }
        </div>
    );
}