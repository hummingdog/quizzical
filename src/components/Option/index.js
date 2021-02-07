import React, {useState, useEffect} from 'react';
import './option.css';

export default function Option(props) {

    const [selection, editSelection] = useState(props.selection);

    useEffect(() => {
        if (props.thisPanel !== 'questions') getSelection();
    }, [props.selection, props.partnerData]);

    function getSelection() {
        let value = (props.partnerData.find(o => o.id === props.selection).text);
        editSelection([...value]);
    }

    function handleChange(event) {
        editSelection(event.target.value);
        props.onCheckComplete(event.target.value.length);
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
                        onChange={event => props.onSetSelected(props.type.id, event.target.value)}
                    />
                </div>
            }
        </label>
    );
}
