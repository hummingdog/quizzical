import React, {useState, useEffect} from 'react';
import './option.css';

export default function Option(props) {

    const [selection, editSelection] = useState(props.selection);
    const [selected, editSelected] = useState(props.selected);

    useEffect(() => {
        if (props.thisPanel !== 'questions') getSelection();
    }, [props.selection, props.partnerData]);

    useEffect(() => {
        editSelected(props.selected);
    }, [props.selected]);

    function getSelection() {
        if (props.partnerData.find(o => o.id === props.selection)) {
            let value = props.partnerData.find(o => o.id === props.selection).text;
            editSelection([...value]);
        } else {
            props.onRemoveOptionFromItem(props.type.id, props.number);
        }
    }

    function handleChange(event) {
        editSelection(event.target.value);
        props.onCheckComplete(event.target.value.length);
    }

    function handleSelectedChange() {
        props.onSetSelected(props.type.id, props.number);
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
                    onClick={() => props.onRemoveOptionFromItem(props.type.id, props.number)}
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
                    checked={selected}
                    onChange={handleSelectedChange}
                />
            </div>
            }
        </label>
    );
}