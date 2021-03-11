import React from 'react';
import CategorySelect from '../CategorySelect';
import './item-header.css';

export default function ItemHeader(props) {
    return (
        <div className='item-header'>
            <div className='item-admin'>
                <button
                    className='expand'
                    onClick={!props.editingThis ? props.onToggleItem : undefined}
                >
                    &#9660;
                </button>
                <CategorySelect
                    category={props.item.category}
                    thisPanel={props.thisPanel}
                    isItem={props.item.text}
                />
                <select className='item-privacy'>
                    <option>
                        private
                    </option>
                </select>
                {props.item.id !== 0 &&
                    <button
                        className='delete'
                        data-id={props.item.id}
                        onClick={() => props.onDeleteItem(props.item.id)}
                    >
                        delete
                    </button>
                }
            </div>
            {props.editingThis ?
                <div>
                    <button
                        className='edit-item'
                        onClick={props.onCancel}
                    >
                        cancel
                    </button>
                    <button
                        className='edit-item'
                        onClick={props.onSaveItem}
                    >
                        save
                    </button>
                </div>
                :
                <button
                    className='edit-item'
                    onClick={!props.editing ? props.onStartEdit : undefined}
                >
                    edit
                </button>
            }
        </div>
    );
}
