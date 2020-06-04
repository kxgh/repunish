import React, {useState} from "react";
import PropTypes from 'prop-types';

const avatarLoadingPic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAQMAAACQp+OdAAAABlBMVEVXBv/7/PvOX' +
    'mvFAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QGBA4yEyJzqWYAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQ' +
    'gd2l0aCBHSU1QZC5lBwAAAEBJREFUKM9jYBh2gP0BlMH/AcqQ/0EOA64dbiAeANdl/wfKqP8HZfz/D6EZ//9vADOY//8/ADH4//8HOBhDBQAAzYM' +
    'eE2I1yDgAAAAASUVORK5CYII=';

const loadSrc = (src, setter) => {
    const img = new Image();
    img.onload = () => setter(src);
    img.src = src;
};

const cx = {
    container: 'player-avatar'
};

const PlayerAvatar = ({imgSrc, onClick}) => {
    const [src, setSrc] = useState(avatarLoadingPic);
    loadSrc(imgSrc, setSrc);
    return (
        <img className={cx.container} src={src} alt={"Player's avatar"} onClick={onClick ? onClick : _ => _}/>
    )
};

PlayerAvatar.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default PlayerAvatar
