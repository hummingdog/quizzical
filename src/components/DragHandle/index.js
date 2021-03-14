import React, { useState } from 'react';

export default function DragHandle(props) {
    // const [grabbing, setGrabbing] = useState(false)

    return (
        <div
            title='drag me'
            className='drag-handle'
            grab={props.dragging}
            aria-roledescription={'drag this item to ' + props.description}
            // onMouseDown={() => props.onToggleDragging('true')}
            // onDragEnd={() => props.onToggleDragging('supported')}
        >
            <div>
            </div>
            <div>
            </div>
        </div>
    )
}
