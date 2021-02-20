import React, {useState, useEffect} from 'react';
import Item from '../Item';
import PanelHeader from '../PanelHeader';
import {draggedEl, draggedElTarget} from '../Item';
import './panel.css';

export default function Panel(props) {

    const [data, editData] = useState(props.data);
    const [collapseAll, toggleCollapseAll] = useState(false);

    useEffect(() => {
        editData(props.data);
    }, [props.reset, props.data]);

    function addItem() {
        let newData = {
            id: 0,
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

    function deleteItem(itemId) {
        let newData = [...data];
        let index = newData.findIndex(item => item.id === itemId);
        newData.splice(index, 1);
        editData([...newData]);
        savePanel(newData);
    }

    function saveItem(newItem) {
        let newData = [...data];
        let index = newData.findIndex(item => item.id === newItem.id);
        newData[index] = newItem;
        editData([...newData]);
        savePanel(newData);
    }

    function savePanel(newData) {
        props.onSaveData([...newData]);
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
                        onClick={!props.editing ? doCollapseAll : undefined}
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
                {data.map((item, i) =>
                    <Item
                        key={'item: ' + item.id}
                        item={item}
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
                        // onEditItemText={editItemText}
                        // onUpdateItem={updateItem}
                        onDeleteItem={deleteItem}
                        onSaveItem={saveItem}
                        onDragEnter={props.onDragEnter}
                        onDragOver={props.onDragOver}
                        onDragLeave={props.onDragLeave}
                        onDragStart={props.onDragStart}
                        onDragEnd={props.onDragEnd}
                        onDrop={props.onDrop}
                    />
                )}
            </div>
        </section>
    );
}
