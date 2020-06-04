import React from "react";
import PropTypes from 'prop-types';

const cx = {
    playerAdder: 'player-adder'
};
const InputPlayerAdd = ({onPlayerAdd}) => {
    return (
        <div className={cx.playerAdder}>
            <input type="text" placeholder="Enter player name..."
                   onKeyDown={e => {
                       if (e.key.toLowerCase() === 'enter') {
                           onPlayerAdd(e.target.value);
                           e.stopPropagation();
                           e.target.value = ''
                       }
                   }}
            />
        </div>
    )
};
InputPlayerAdd.propTypes = {
    onPlayerAdd: PropTypes.func.isRequired
};
export default InputPlayerAdd;