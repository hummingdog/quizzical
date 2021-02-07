import React, {useState, useEffect} from 'react';
import Item from '../Item';
import PanelHeader from '../PanelHeader';
import {draggedItem, draggedItemTarget} from '../Item';
import './panel.css';

export default function Panel(props) {

    const [data, editData] = useState([...props.data]);

    function addItem() {
        props.onSwitchPanel();
        let newData = [...props.data];
        let addition = {
            id: (~~Math.random() * 500),
            category: 'Misc',
            private: true,
            text: '',
            selection: []
        };
        if (props.thisPanel === 'questions') {
            addition.selection = ['', ''];
            addition.correct = 0;
        }
        newData.unshift(addition);
        console.log(addition);
        editData([...newData]);
    }

    function deleteItem(event) {
        let newData = [...data];
        let index = newData.findIndex(item => item.id === event.target.dataset.id);
        newData.splice(index, 1);
        editData([...newData]);
    }

    function editItemText(itemId, text) {
        let newData = [...data];
        newData.find(item => item.id === itemId).text = text;
        editData([...newData]);
    }

    function addOptionFromPanel() {
        let newData = [...data];
        newData.find(item => item.id === draggedItemTarget.item).selection.push(draggedItem.item);
        editData([...newData]);
    }

    function editOption(itemId, i, text) {
        let newData = [...data];
        newData.find(item => item.id === itemId).selection[i] = text;
        editData([...newData]);
    }

    function removeOptionFromItem(event) {
        let newData = [...data];
        newData.find(item => item.id === event.target.dataset.item).selection.splice(event.target.value, 1);
        editData([...newData]);
        if (props.thisPanel === 'questions') setSelected(event.target.dataset.item, 0);
    }

    function setSelected(itemId, i) {
        let newData = [...data];
        newData.find(item => item.id === itemId).correct = i;
        editData([...newData]);
    }

    function saveItem() {
        props.onSaveData([...data]);
    }

    return (
        <section
            className={('my-' + props.thisPanel) + (props.expanded ? ' open' : '')}
        >
            <PanelHeader
                onSwitchPanel={props.onSwitchPanel}
                panelTitle={props.panelTitle}
            />
            <button
                className='add-item'
                onClick={!props.editing ? addItem : undefined}
            >
                +
            </button>
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
                        editing={props.editing}
                        onSwitchEditing={props.onSwitchEditing}
                        onSwitchPanel={props.onSwitchPanel}
                        onEditItemText={editItemText}
                        onDeleteItem={deleteItem}
                        onSaveItem={saveItem}
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
