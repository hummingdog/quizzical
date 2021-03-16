import React, {useState, useEffect} from 'react';
import Item from '../Item';
import PanelHeader from '../PanelHeader';
import './panel.css';
import {Draggable, Droppable} from 'react-beautiful-dnd';

export default function Panel(props) {

    const [data, editData] = useState(props.data);
    const [collapseAll, toggleCollapseAll] = useState(false);

    useEffect(() => {
        editData(props.data);
    }, [props.reset, props.data]);

    function addItem() {
        let newItem = {
            id: 0,
            owner: '60206483f651da53cba32a7c',
            category: 'Misc',
            public: false,
            text: '',
            selection: []
        };
        if (props.thisPanel === 'questions') {
            newItem.selection = [{id: 0, text: '', correct: false}, {id: 1, text: '', correct: false}];
        }
        let newData = [...data]
        newData.unshift(newItem)
        editData(newData);
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

    // function deleteItem(data) {
    //     props.onDeleteItem(data)
    // }

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
                    <Droppable droppableId={'droppable-' + props.panelNumber}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                // style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                                {...provided.droppableProps}
                            >
                                {data.map((item, i) =>
                                    <Draggable draggableId={'draggable-' + item.id} index={i} key={'item: ' + item.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Item
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
                                                    onDeleteItem={props.onDeleteItem}
                                                    // onSaveItem={saveItem}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
        </section>
    );
}
