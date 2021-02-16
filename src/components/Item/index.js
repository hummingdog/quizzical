import React, {useState, useEffect, useRef} from 'react';
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
    // const targetEl = useRef(null)

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

    return (
        <div
            data-name={'item'}
            data-id={item.id}
            data-number={props.panelNumber}
            data-panel={props.thisPanel}
            data-length={item.selection.length}
            draggable={itemComplete && !editingThis}
            onDragEnter={props.onDragEnter}
            onDragOver={props.onDragOver}
            onDragLeave={props.onDragLeave}
            onDragStart={props.onDragStart}
            onDragEnd={props.onDragEnd}
            onDrop={props.onDrop}
            // ref={targetEl}
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
                                onDragEnter={props.onDragEnter}
                                onDragOver={props.onDragOver}
                                onDragLeave={props.onDragLeave}
                                onDragStart={props.onDragStart}
                                onDragEnd={props.onDragEnd}
                                onDrop={props.onDrop}
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