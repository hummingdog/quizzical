import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            quizzical
            <nav>
                <NavLink to='/build'>
                    build
                </NavLink>
            </nav>
        </header>
    );
}
