import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import * as Consts from "../logic/consts";
import PlayerAvatar from "./PlayerAvatar";

const cx = {
    container: 'player-list',
    hidden: 'player-list--hidden',
    list: 'player-list__list',
    cell: 'player-list__cell',
    cellAdd: 'player-list__cell-add',
    intro: 'player-list__intro',
    introInvalid: 'player-list__intro__invalid'
};

const HomePlayerList = React.forwardRef((props, ref) => {
    const {players, onPlayerAdd, onPlayerEdit, hidden, invalid} = props;
    const containerClassName = [cx.container, hidden ? cx.hidden : ''].join(' ');
    return (
        <div className={containerClassName}>
            <p ref={ref} className={cx.intro}>Add players:</p>
            {invalid && <p className={cx.introInvalid}>At least 2 players are required!</p>}
            <ul className={cx.list}>
                {players.map(p =>
                    <li key={p.id} onClick={e => onPlayerEdit(p)} className={cx.cell}>
                        <PlayerAvatar imgSrc={p.avatar}/>
                        <span>{p.name}</span>
                    </li>)}
                {players.length < Consts.MAX_PLAYERS &&
                <li key={Number.MAX_SAFE_INTEGER} onClick={e => onPlayerAdd()}
                    className={cx.cell + ' ' + cx.cellAdd}>
                    <p>Add new player <i className={'ra ra-health'}/></p>
                </li>}
            </ul>
        </div>
    )
});

HomePlayerList.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    onPlayerAdd: PropTypes.func.isRequired,
    onPlayerEdit: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    invalid: PropTypes.bool
};

export default HomePlayerList;