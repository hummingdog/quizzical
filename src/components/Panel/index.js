import React, {useState, useEffect} from 'react';
import Item from '../Item';
import PanelHeader from '../PanelHeader';
import './panel.css';

export default function Panel(props) {

    const [data, editData] = useState(props.data);
    const [collapseAll, toggleCollapseAll] = useState(false);

    useEffect(() => {
        editData(props.data);
    }, [props.reset, props.data]);

    function addItem() {
        let newItem = {
            id: 0,
            category: 'Misc',
            public: false,
            title: '',
            selection: []
        };
        if (props.thisPanel === 'questions') {
            newItem.selection = ['', ''];
            newItem.correctAnswer = 0;
        }
        editData(data => [newItem, ...data]);
        // props.onSwitchPanel();
        props.onSwitchEditing(true);
        props.onSwitchEditingId(newItem.id);
    }

    function removeItem(itemId) {
        let newData = [...data];
        let index = newData.findIndex(item => item.id === itemId);
        newData.splice(index, 1);
        editData([...newData]);
    }

    function deleteItem(itemId) {
        props.onDeleteItem(itemId)
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
                        editData={editData}
                        getData={props.getData}
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
                        onAddItem={props.onAddItem}
                        onEditItem={props.onEditItem}
                        onRemoveItem={removeItem}
                        onDeleteItem={deleteItem}
                        // onSaveItem={saveItem}
                    />
                )}
            </div>
        </section>
    );
}
