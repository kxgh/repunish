import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import Challenge from "../logic/Challenge";
import PlayerAvatar from "./PlayerAvatar";

const cx = {
    container: 'quest-verdict',
    title: 'quest-verdict__title',
    list: 'quest-verdict__list',
    listItem: 'quest-verdict__listitem'
};

const VerdictRecord = ({player}) => {
    const p = player;
    return (
        <li className={cx.listItem}>
            <PlayerAvatar imgSrc={p.avatar}/>
            <p>
                <i className={p.punishment.className}/>
                &nbsp;{p.name} {p.punishment.text}
            </p>
        </li>
    )
};

const Verdict = ({players, challenge}) => {
    if (!Array.isArray(players))
        players = [players];
    players = players.filter(p => p.punishment);

    if (!players.length)
        return null;
    return (
        <>
            <div className={cx.container}>
                <p className={cx.title}>Verdict:</p>
                <ul className={cx.list}>
                    {players.map(p => <VerdictRecord key={p.id} player={p}/>)}
                </ul>
            </div>
        </>
    )
};

Verdict.propTypes = {
    players: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.instanceOf(Player)),
        PropTypes.instanceOf(Player)
    ]).isRequired,
    challenge: PropTypes.instanceOf(Challenge)
};
export default Verdict
