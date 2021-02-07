import React, {useState} from 'react';

export default function ItemText(props) {

    const [text, editText] = useState(props.type.text);

    const truncateText = (str) => {
        return !props.panelExpanded && str.length > 65 ? str.substring(0,62) + '...' : str;
    }

    const handleChange = (event) => {
        editText(event.target.value);
        props.onEditItemText(props.type.id, event.target.value);
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
                    {truncateText(text)}
                    <div className='selection-length'>
                        {props.type.selection.length}
                    </div>
                </button>
            }
        </>
    );
}
