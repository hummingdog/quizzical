import React, {useState, useEffect} from 'react';
import ItemHeader from '../ItemHeader';
import ItemText from '../ItemText';
import Option from '../Option';
import {categories} from '../../static/categories';
import './item.css';
import '../../static/colorBlocks.css';

export let draggedItem = {};
export let draggedItemTarget = {};

export default function Item(props) {

    const [expanded, toggleExpanded] = useState(props.type.id === props.editingId);
    const [editingThis, toggleEditingThis] = useState(props.type.id === props.editingId);
    const [itemComplete, toggleItemComplete] = useState(true);
    const [selected, editSelected] = useState(props.type.correct);
    const [dragging, toggleDragging] = useState('supported');

    useEffect(() => {
        checkComplete();
    }, [props.type]);

    useEffect(() => {
        editSelected(props.type.correct);
    }, [props.type.correct]);

    useEffect(() => {
        if (props.collapseAll) toggleExpanded(false);
    }, [props.collapseAll]);

    function checkComplete(length = 1) {
        let c = true;
        if (length === 0 || props.type.text.length === 0) c = false;
        props.type.selection.forEach(option => { if (option.length === 0) c = false; });
        toggleItemComplete(c);
        if (!c) {
            toggleEditingThis(true);
        }
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
            if (cat.name === props.type.category) color = cat.color;
        });
        return color;
    }

    function startEdit() {
        toggleEditingThis(true);
        props.onSwitchEditing(true);
    }

    function saveItem() {
        checkComplete();
        if (itemComplete) {
            props.onSaveItem();
            toggleEditingThis(false);
            props.onSwitchEditing(false);
        }
    }

    function startDrag(event) {
        draggedItem = {
            item: event.currentTarget.id,
            number: +event.currentTarget.dataset.number,
            panel: event.currentTarget.dataset.panel,
            length: +event.currentTarget.dataset.length
        };
    }

    function enterDrag(event) {
        draggedItemTarget = {
            item: event.currentTarget.id,
            number: +event.currentTarget.dataset.number,
            panel: event.currentTarget.dataset.panel,
            length: +event.currentTarget.dataset.length
        };
        if (draggedItem.panel === 'questions' && draggedItem.length < 2) return false;
        if (draggedItem.number + 1 === draggedItemTarget.number) {
            event.currentTarget.classList.add('dropItem');
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    function overDrag(event) {
        event.preventDefault();
        if ((draggedItem.panel === 'questions' && draggedItem.length < 2) || (draggedItem.number + 1 !== draggedItemTarget.number)) {
            event.dataTransfer.dropEffect = 'none';
        } else {
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    function exitDrag(event) {
        event.currentTarget.classList.remove('dropItem');
    }

    function endDrag(event) {
        event.currentTarget.classList.remove('dropItem');
    }

    function drop(event) {
        props.onAddOptionFromPanel();
        event.currentTarget.classList.remove('dropItem');
    }

    return (
        <div
            id={props.type.id}
            data-number={props.panelNumber}
            data-panel={props.thisPanel}
            data-length={props.type.selection.length}
            draggable={itemComplete && !editingThis}
            onDragStart={startDrag}
            onDragEnter={enterDrag}
            onDragOver={overDrag}
            onDragExit={exitDrag}
            onDragEnd={endDrag}
            onDrop={drop}
            className={'panel-item ' + props.thisPanel + expandOrOpen}
            onClick={!props.panelExpanded && !props.editing ? expandItemAndPanel : undefined}
        >
            {!expanded && props.panelExpanded &&
                <div className={'colorBox ' + categoryColor}>
                </div>
            }
            {expanded && props.panelExpanded &&
                <ItemHeader
                    panelExpanded={props.panelExpanded}
                    type={props.type}
                    thisPanel={props.thisPanel}
                    nextPanel={props.nextPanel}
                    editing={props.editing}
                    editingThis={editingThis}
                    onToggleItem={() => toggleExpanded(!expanded)}
                    onStartEdit={startEdit}
                    onSave={saveItem}
                    onDeleteItem={props.onDeleteItem}
                />
            }
            <ItemText
                type={props.type}
                expanded={expanded}
                editing={props.editing && editingThis}
                panelExpanded={props.panelExpanded}
                onToggleItem={toggleExpanded}
                onCheckComplete={checkComplete}
                onStartEdit={startEdit}
                onEditItemText={props.onEditItemText}
            />
            {expanded && props.panelExpanded &&
                <div className='item-options'>
                    {props.type.selection.map((s, i) =>
                        <Option
                            key={s + i}
                            number={i}
                            selected={i === selected}
                            selection={s}
                            type={props.type}
                            partnerData={props.partnerData}
                            editing={props.editing && editingThis}
                            thisPanel={props.thisPanel}
                            group={props.type.text}
                            onCheckComplete={checkComplete}
                            onStartEdit={startEdit}
                            onSetSelected={props.onSetSelected}
                            onEditOption={props.onEditOption}
                            onRemoveOptionFromItem={props.onRemoveOptionFromItem}
                        />
                    )}
                    {props.thisPanel === 'questions' && props.type.selection.length < 4 && props.editing &&
                    <button
                        title='add an option'
                        className='add-option'
                        // onClick={props.onAddOption}
                    >
                        + add option
                    </button>
                    }
                </div>
            }
            {!expanded && props.panelExpanded && (props.thisPanel !== 'quizzes') &&
                <div
                    aria-roledescription={'drag this item to add it to a ' + (props.thisPanel === 'questions' ? 'round' : 'quiz')}
                    title='drag me'
                    className='dragHandle'
                    grab={dragging}
                    onMouseDown={() => toggleDragging('true')}
                    onMouseUp={() => toggleDragging('supported')}
                >
                    <div>
                    </div>
                    <div>
                    </div>
                </div>
            }
        </div>
    );
}