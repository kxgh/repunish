import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";

const cx = {
    container: 'board-turn-info',
};

const BoardTurnInfo = ({turnPlayer, onImgClick}) => {
    const {avatar, name, items} = turnPlayer;
    return (
        <div className={cx.container}>
            <img alt="Player's avatar" src={avatar} onClick={onImgClick}/>
            <h1>{name}'s turn</h1>
            {items.map(i => <p key={i.id}>{i.name} {i.charges}</p>)}
        </div>
    )
};

BoardTurnInfo.propTypes = {
    turnPlayer: PropTypes.instanceOf(Player).isRequired,
    onImgClick: PropTypes.func
};

export default BoardTurnInfo