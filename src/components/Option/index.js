import React, {useState} from 'react';
import './option.css';

export default function Option(props) {

    const [selection, editSelection] = useState(props.selection);

    function handleChange(event) {
        editSelection(event.target.value);
        event.target.value.length === 0 ? props.onToggleItemComplete(false) : props.onToggleItemComplete(true);
    }

    function handleSelectedChange(event) {
        props.onSetSelected(props.type.id, event.target.value);
    }

    return (
        <label
            className='item-option'
            onClick={event => event.preventDefault()}>
            {props.editing ?
                <button
                    title='remove'
                    value={props.number}
                    data-panel={props.thisPanel}
                    data-item={props.type.id}
                    onClick={props.onRemoveOptionFromItem}
                >
                    -
                </button>
                :
                <div></div>
            }
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
            {props.thisPanel === 'questions' && props.editing &&
                <div className='correct-option'>
                    <div>
                    </div>
                    <input
                        type='radio'
                        name={props.group}
                        value={props.number}
                        checked={props.selected}
                        onChange={handleSelectedChange}
                    />
                </div>
            }
        </label>
    );
}
