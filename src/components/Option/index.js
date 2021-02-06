import React, {useState} from 'react';
import './option.css';

export default function Option(props) {

    const [selection, editSelection] = useState(props.selection);

    const handleChange = (event) => {
        editSelection(event.target.value);
    }

    return (
        <label
            className='item-option'
            onClick={event => event.preventDefault()}>
            <button
                title='remove'
                value={props.number}
                data-panel={props.thisPanel}
                data-item={props.type.id}
                onClick={props.onRemoveOptionFromItem}
            >
                -
            </button>
            {props.thisPanel === 'questions' && props.editing ?
                <input
                    className='item-option-input'
                    value={selection}
                    placeholder='type something!'
                    onChange={handleChange}
                    onBlur={() => props.onEditOption(props.type.id, props.number, selection)}
                />
                :
                <button
                    onClick={props.thisPanel === 'questions' ? props.onStartEdit : undefined}
                >
                    {selection}
                </button>
            }
            {props.thisPanel === 'questions' &&
            <div className='correct-option'>
                <div>
                </div>
                <input
                    type='radio'
                    name={props.group}
                    checked={props.selected}
                    onChange={props.onHandleSelectionChange}
                />
            </div>
            }
        </label>
    );
}
