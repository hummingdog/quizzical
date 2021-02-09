import React, {useState, useEffect} from 'react';
import ItemHeader from '../ItemHeader';
import ItemText from '../ItemText';
import Option from '../Option';
import DragHandle from '../DragHandle';
import {categories} from '../../static/categories';
import './item.css';
import '../../static/colorBlocks.css';

export let draggedItem = {};
export let draggedItemTarget = {};

export default function Item(props) {

    const [item, editItem] = useState({...props.item});
    const [backupItem, editBackupItem] = useState({...props.item});
    const [expanded, toggleExpanded] = useState(props.item.id === props.editingId);
    const [editingThis, toggleEditingThis] = useState(props.item.id === props.editingId);
    const [itemComplete, toggleItemComplete] = useState(true);
    const [dragging, toggleDragging] = useState('supported');

    useEffect(() => {
        editItem({...props.item});
    }, [props.item]);

    useEffect(() => {
        if (props.collapseAll) toggleExpanded(false);
    }, [props.collapseAll]);

    function checkComplete(length = 1) {
        let c = true;
        if (length === 0 || item.text.length === 0 || item.selection.length < 2) c = false;
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
        toggleEditingThis(false);
        props.onSwitchEditing(false);
        if (item.id === 0) {
            props.onDeleteItem(props.item.id);
        } else {
            editItem( {...backupItem});
        }
    }

    // function addOptionFromPanel() {
    //     let newItem = [...item];
    //     newItem.push(draggedItem.item);
    //     editItem([...newItem]);
    // }

    function addOption() {
        let newItem = {...item};
        newItem.selection.push('');
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
        newItem.correct = i;
        editItem({...newItem});
    }

    // function startDrag(event) {
    //     draggedItem = {
    //         item: event.currentTarget.id,
    //         number: +event.currentTarget.dataset.number,
    //         panel: event.currentTarget.dataset.panel,
    //         length: +event.currentTarget.dataset.length
    //     };
    // }

    // function enterDrag(event) {
    //     draggedItemTarget = {
    //         item: event.currentTarget.id,
    //         number: +event.currentTarget.dataset.number,
    //         panel: event.currentTarget.dataset.panel,
    //         length: +event.currentTarget.dataset.length
    //     };
    //     if (draggedItem.panel === 'questions' && draggedItem.length < 2) return false;
    //     if (draggedItem.number + 1 === draggedItemTarget.number) {
    //         // event.currentTarget.classList.add('drop-item');
    //         event.dataTransfer.dropEffect = 'copy';
    //     }
    // }

    // function overDrag(event) {
    //     event.preventDefault();
    //     if ((draggedItem.panel === 'questions' && draggedItem.length < 2) || (draggedItem.number + 1 !== draggedItemTarget.number)) {
    //         event.dataTransfer.dropEffect = 'none';
    //     } else {
    //         event.dataTransfer.dropEffect = 'copy';
    //     }
    // }

    // function exitDrag(event) {
    //     event.currentTarget.classList.remove('dropItem');
    // }

    // function endDrag(event) {
    //     event.currentTarget.classList.remove('dropItem');
    // }

    // function drop(event) {
    //     addOptionFromPanel();
    //     event.currentTarget.classList.remove('dropItem');
    // }

    return (
        <div
            id={item.id}
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
                    {item.selection.map((o, i) =>
                        <Option
                            key={o + i}
                            number={i}
                            option={o}
                            item={item}
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
                    {props.thisPanel === 'questions' && item.selection.length < 4 && props.editing &&
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