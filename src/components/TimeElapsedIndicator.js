import React from "react";
import PropTypes from 'prop-types';

const cx = {
    container: 'time-elapsed-indicator',
    paused: 'time-elapsed-indicator--paused'
};

const TimeElapsedIndicator = ({duration, paused}) => {
    const progStyle = {animationDuration: (duration / 1000) + 's'};
    return (
        <div className={`${cx.container} ${paused ? cx.paused : ''}`} style={progStyle}/>
    )
};

TimeElapsedIndicator.propTypes = {
    duration: PropTypes.number.isRequired,
    paused: PropTypes.bool
};

export default TimeElapsedIndicator