import React from 'react';
import {categories} from '../../static/categories';

export default function CategorySelect(props) {
    return (
        <select
            className='item-category'
            defaultValue={props.category ? props.category : ''}
        >
            {props.panelHeader &&
            <option>
                All
            </option>
            }
            {categories.map(category =>
                <option
                    key={props.thisPanel + category}
                >
                    {category.name}
                </option>
            )}
        </select>
    );
}
