import React, {useState} from 'react';
import CategorySelect from '../CategorySelect';
import './panel.css';

export default function PanelHeader(props) {
    const [searchText, editSearch] = useState('');
    const handleChange = (event) => {
        editSearch(event.target.value);
    }
    return (
        <div className='panel-header'>
            <div className='panel-search'>
                <input
                    type='text'
                    value={searchText}
                    placeholder='search'
                    onChange={handleChange}
                />
            </div>
            <h2 onClick={props.onSwitchPanel}>
                {props.panelTitle}
            </h2>
            <div className='panel-filter'>
                <CategorySelect
                    panelHeader={true}
                    thisPanel={props.thisPanel}
                />
            </div>
        </div>
    );
}
