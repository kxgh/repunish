import React from "react";
import PropTypes from 'prop-types';
import {random} from "../logic/globals";

const cx = {
    wrapper: 'dice',
    hidden: 'dice--hidden'
};

const getDiceIcon = num => {
    num = '' + num;
    const getNumWord = () => {
        switch (num) {
            case '1':
                return 'one';
            case '2':
                return 'two';
            case '3':
                return 'three';
            case '4':
                return 'four';
            case '5':
                return 'five';
            default:
                return 'six'
        }
    };
    return <i className={'ra ra-lg ra-dice-' + getNumWord()}/>
};

const Dice = ({num, rolling, hidden}) => {
    const [currNum, setter] = React.useState(1);
    React.useEffect(() => {
        let t;
        if (rolling)
            t = setInterval(() => {
                setter(random.randomInRange(1, 6));
            }, 100)
        return () => {
            t && clearInterval(t);
        }
    });
    const className = [cx.wrapper, hidden ? cx.hidden : ''].join(' ');
    return (
        <span className={className}>
            {getDiceIcon(rolling ? currNum : num)}
        </span>

    )
};

Dice.propTypes = {
    num: PropTypes.number.isRequired,
    rolling: PropTypes.bool
};
export default Dice