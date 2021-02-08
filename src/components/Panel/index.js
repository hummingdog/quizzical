import React, {useState, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import Item from '../Item';
import PanelHeader from '../PanelHeader';
import {draggedItem, draggedItemTarget} from '../Item';
import './panel.css';

export default function Panel(props) {

    const [data, editData] = useState([...props.data]);
    const [collapseAll, toggleCollapseAll] = useState(false);

    function addItem() {
        let newData = {
            id: uuidv4(),
            newItem: true,
            category: 'Misc',
            private: true,
            text: '',
            selection: []
        };
        if (props.thisPanel === 'questions') {
            newData.selection = ['', ''];
            newData.correct = 0;
        }
        editData(oldData => [newData, ...oldData]);
        props.onSwitchPanel();
        props.onSwitchEditing(true);
        props.onSwitchEditingId(newData.id);
    }

    function deleteItem(event) {
        let newData = [...data];
        let index = newData.findIndex(item => item.id === event.target.dataset.id);
        newData.splice(index, 1);
        editData([...newData]);
        save();
        //
        // DB MUTATION FOR ITEM/DOC
    }

    function editItemText(itemId, text) {
        let newData = [...data];
        newData.find(item => item.id === itemId).text = text;
        editData([...newData]);
        //
        // DB MUTATION FOR ITEM/DOC
    }

    function addOptionFromPanel() {
        let newData = [...data];
        newData.find(item => item.id === draggedItemTarget.item).selection.push(draggedItem.item);
        editData([...newData]);
        //
        // DB MUTATION FOR DRAG TARGET ITEM/DOC
    }

    function editOption(itemId, i, text) {
        let newData = [...data];
        newData.find(item => item.id === itemId).selection[i] = text;
        editData([...newData]);
        //
        // DB MUTATION FOR ITEM/DOC
    }

    function removeOptionFromItem(itemId, value) {
        let newData = [...data];
        newData.find(item => item.id === itemId).selection.splice(value, 1);
        editData([...newData]);
        if (props.thisPanel === 'questions') setSelected(itemId, 0);
        save();
        //
        // DB MUTATION FOR ITEM/DOC
    }

    function setSelected(itemId, i) {
        let newData = [...data];
        newData.find(item => item.id === itemId).correct = i;
        editData([...newData]);
        //
        // DB MUTATION FOR ITEM/DOC
    }

    function save() {
        //
        // DB MUTATION FOR ANY NEW ITEM (any item with no id? or with property newItem: true?)
        // UPDATE STATE WITH RETURNED OBJECT_ID
        //
        props.onSaveData([...data]);
    }

    function doCollapseAll() {
        toggleCollapseAll(true);
        setTimeout(() => toggleCollapseAll(false), 10);
    }

    return (
        <section
            className={('my-' + props.thisPanel) + (props.expanded ? ' open' : '')}
        >
            <PanelHeader
                onSwitchPanel={props.onSwitchPanel}
                panelTitle={props.panelTitle}
            />
            {props.expanded &&
                <div className='panel-actions'>
                    <button
                        title='collapse all'
                        className='collapse-all'
                        onClick={doCollapseAll}
                    >
                        &#9650;
                    </button>
                    <button
                        title='add item'
                        className='add-item'
                        onClick={!props.editing ? addItem : undefined}
                    >
                        +
                    </button>
                </div>
            }
            <div
                className='panel-content'
            >
                {data.map(type =>
                    <Item
                        key={'item' + type.id}
                        type={type}
                        partnerData={props.partnerData}
                        panelNumber={props.panelNumber}
                        thisPanel={props.thisPanel}
                        panelExpanded={props.expanded}
                        collapseAll={collapseAll}
                        editing={props.editing}
                        editingId={props.editingId}
                        onSwitchEditing={props.onSwitchEditing}
                        onSwitchEditingId={props.onSwitchEditingId}
                        onSwitchPanel={props.onSwitchPanel}
                        onEditItemText={editItemText}
                        onDeleteItem={deleteItem}
                        onSaveItem={save}
                        onAddOptionFromPanel={addOptionFromPanel}
                        onRemoveOptionFromItem={removeOptionFromItem}
                        onEditOption={editOption}
                        onSetSelected={setSelected}
                    />
                )}
            </div>
        </section>
    );
}
