import React from 'react';
import CategorySelect from '../CategorySelect';

export default function ItemHeader(props) {
    return (
        <div className='item-header'>
            <div className='item-admin'>
                <button
                    className='expand'
                    onClick={props.onToggleItem}>
                    &#9660;
                </button>
                <CategorySelect
                    category={props.type.category}
                    thisPanel={props.thisPanel}
                />
                <select className='item-privacy'>
                    <option>
                        private
                    </option>
                </select>
                <button
                    className='delete'
                    data-id={props.type.id}
                    onClick={props.onDeleteItem}
                >
                    delete
                </button>
            </div>
            {props.editing ?
                <button
                    className='edit-item'
                    onClick={props.onSave}
                >
                    save
                </button>
                :
                <button
                    className='edit-item'
                    onClick={props.onStartEdit}
                >
                    edit
                </button>
            }
        </div>
    );
}
