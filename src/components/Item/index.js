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

    const [expanded, toggleItem] = useState(false);
    const [editing, toggleEditing] = useState(false);

    const expandOrOpen = !props.panelExpanded ? ' closed' : expanded ? '' : ' closed';
    function expandItemAndPanel() {
        toggleItem(true);
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

    function saveItem() {
        props.onSaveItem();
        toggleEditing(false);
    }

    function getSelection(selection) {
        let value;
        props.partnerData.filter(item => {
            if (item.id === selection) value = item.text;
        });
        return value;
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
        }
    }

    function overDrag(event) {
        event.preventDefault();
        if ((draggedItem.panel === 'questions' && draggedItem.length < 2) || (draggedItem.number + 1 !== draggedItemTarget.number)) {
            event.dataTransfer.dropEffect = 'none';
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
            draggable={!expanded || !props.panelExpanded}
            onDragStart={startDrag}
            onDragEnter={enterDrag}
            onDragOver={overDrag}
            onDragExit={exitDrag}
            onDragEnd={endDrag}
            onDrop={drop}
            className={'panel-item ' + props.thisPanel + expandOrOpen}
            style={{backgroundOpacity: '0.4'}}
            onClick={!props.panelExpanded ? expandItemAndPanel : null}
        >
            {!expanded &&
                <div
                    className={'colorBox ' + categoryColor}
                >
                </div>
            }
            <ItemHeader
                panelExpanded={props.panelExpanded}
                type={props.type}
                thisPanel={props.thisPanel}
                nextPanel={props.nextPanel}
                editing={editing}
                onToggleItem={() => toggleItem(!expanded)}
                onStartEdit={() => toggleEditing(true)}
                onSave={saveItem}
                onDeleteItem={props.onDeleteItem}
            />
            <ItemText
                type={props.type}
                expanded={expanded}
                editing={editing}
                panelExpanded={props.panelExpanded}
                onToggleItem={toggleItem}
                onStartEdit={() => toggleEditing(true)}
                onEditItemText={props.onEditItemText}
            />
            <div className='item-options'>
                {props.type.selection.map((selection, i) =>
                    <Option
                        key={selection + i}
                        number={i}
                        type={props.type}
                        editing={editing}
                        thisPanel={props.thisPanel}
                        selection={props.thisPanel === 'questions' ? selection : getSelection(selection)}
                        group={props.type.text}
                        selected={i === props.type.correct}
                        onStartEdit={() => toggleEditing(true)}
                        onEditOption={props.onEditOption}
                        onHandleSelectionChange={() => props.onSetSelection(props.type.id, i)}
                        onRemoveOptionFromItem={props.onRemoveOptionFromItem}
                    />
                )}
                {props.thisPanel === 'questions' && props.type.selection.length < 4 &&
                <button
                    className='add-option'
                    // onClick={props.onAddOption}
                >
                    + add option
                </button>
                }
            </div>
        </div>
    );
}
