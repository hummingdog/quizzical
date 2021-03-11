import React, {useEffect, useState} from 'react';

export default function ItemText(props) {

    const [text, editText] = useState(props.item.title);

    useEffect(() => {
        editText(props.item.title);
    }, [props.item.title]);

    const truncateText = (str) => {
        return !props.panelExpanded && str.length > 65 ? str.substring(0,62) + '...' : str;
    }

    const handleChange = (event) => {
        editText(event.target.value);
        props.onEditItemText(event.target.value);
        props.onCheckComplete(event.target.value.length);
    }

    return (
        <>
            {props.expanded && props.editing ?
                <input
                    draggable={false}
                    className='item-text-box'
                    value={text}
                    placeholder='type something!'
                    onChange={handleChange}
                />
                :
                <button
                    className='item-text-box'
                    onClick={props.panelExpanded && props.expanded ? props.onStartEdit : props.onToggleItem}
                >
                    {text && truncateText(text)}
                    <div className='selection-length'>
                        {props.item.selection.length}
                    </div>
                </button>
            }
        </>
    );
}
