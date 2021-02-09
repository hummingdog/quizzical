import React, {useState, useEffect} from 'react';
import DragHandle from '../DragHandle';
import './option.css';
import {Trash} from 'react-feather';

export default function Option(props) {

    const [option, editOption] = useState(props.option);
    const [correct, editCorrect] = useState(props.correct);
    const [dragging, toggleDragging] = useState('supported');

    // useEffect(() => {
    //     if (props.thisPanel !== 'questions') getOption();
    // }, [props.option, props.partnerData]);

    // useEffect(() => {
    //     editCorrect(props.correct);
    // }, [props.correct]);

    // function getOption() {
    //     if (props.partnerData.find(o => o.id === props.option)) {
    //         let value = props.partnerData.find(o => o.id === props.option).text;
    //         editOption([...value]);
    //     } else {
    //         props.onRemoveOptionFromItem(props.item.id, props.number);
    //     }
    // }

    // function handleChange(event) {
    //     editOption(event.target.value);
    //     props.onCheckComplete(event.target.value.length);
    // }
    //
    // function handleCorrectChange() {
    //     props.onSetCorrect(props.item.id, props.number);
    // }
    //
    // function handleRemove() {
    //     if (props.thisPanel === 'questions') {
    //         if (props.item.selection.length > 2) props.onRemoveOptionFromItem(props.item.id, props.number);
    //     } else {
    //         props.onRemoveOptionFromItem(props.item.id, props.number);
    //     }
    // }

    return (
        <label
            draggable={dragging === 'true'}
            className='item-option'
            onClick={event => event.preventDefault()}>
            {props.editing ?
                <button
                    title='remove option'
                    value={props.number}
                    data-panel={props.thisPanel}
                    data-item={props.item.id}
                    className='remove-option'
                    // onClick={handleRemove}
                >
                    <Trash
                        size={14}
                    />
                </button>
                :
                <div>
                </div>
            }
            {props.thisPanel === 'questions' && props.editing ?
                <input
                    className='item-option-input'
                    value={option}
                    placeholder='type something!'
                    // onChange={handleChange}
                    // onBlur={() => props.onEditOption(props.item.id, props.number, option)}
                />
                :
                <button
                    onClick={props.thisPanel === 'questions' ? props.onStartEdit : undefined}
                >
                    {option}
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
                        checked={correct}
                        // onChange={handleCorrectChange}
                    />
                </div>
            }
            {props.editing &&
                <DragHandle
                    description={'rearrange'}
                    dragging={dragging}
                    onToggleDragging={toggleDragging}
                />
            }
        </label>
    );
}
