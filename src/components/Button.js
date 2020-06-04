import React from "react";
import PropTypes from 'prop-types';

export const cx = {
    button: 'btn',
    hidden: 'btn--hidden'
};

const TYPES = {
    LARGE_ATTENTION: 'btn--l-attention'
};

const Button = ({clickAction, type, children, hidden}) => {

    const className = [cx.button, type ? type : '', hidden ? cx.hidden : ''].join(' ');

    return (
        <h2 className={className} onClick={clickAction}>
            {children}
        </h2>
    )
};
Button.TYPES = TYPES;
Button.propTypes = {
    clickAction: PropTypes.func.isRequired
};

export default Button;