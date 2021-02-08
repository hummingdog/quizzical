import React from 'react';

export default function DragHandle(props) {
    return (
        <div
            aria-roledescription={'drag this item to ' + props.description}
            title='drag me'
            className='drag-handle'
            grab={props.dragging}
            onMouseDown={() => props.onToggleDragging('true')}
            onMouseUp={() => props.onToggleDragging('supported')}
        >
            <div>
            </div>
            <div>
            </div>
        </div>
    )
}
