import React from "react";
import PropTypes from 'prop-types';
import Player from "../logic/Player";
import PlayerAvatar from "./PlayerAvatar";

const cx = {
    container: 'player-picker',
    record: 'player-picker__listitem',
    recordPicked: 'player-picker__listitem--picked',
    confirmBtn: 'player-picker__confirm-btn'
};

const PlayerPickerRecord = ({player, isPicked, onClick}) => {
    const p = player;
    return (
        <li className={`${cx.record} ${isPicked ? cx.recordPicked : ''}`} onClick={onClick}>
            <PlayerAvatar imgSrc={p.avatar}/>
            <p>{isPicked ? '✓' : ''} {p.name}</p>
        </li>
    )
};

class PlayerPicker extends React.Component {
    constructor(props) {
        super(props);
        this.single = !!props.single;
        this.state = {
            players: props.players,
            picked: props.single ? null : Array(props.players.length).fill(!!props.all)
        };
        this.pickToggle = this.pickToggle.bind(this);
    }

    pickToggle(i) {
        this.setState(prevState => {
            if (this.single)
                return {
                    picked: i
                };
            return {
                picked: prevState.picked.map((b, j) => i === j ? !b : b)
            }
        });
    }

    render() {
        const {players, picked} = this.state;
        const {onConfirm, mustPickOne} = this.props;
        const {pickToggle} = this;

        const playerIsPicked = i => {
            if (this.single)
                return picked === i;
            return picked[i]
        };

        const didPick = () => picked !== null;

        return (
            <>
                <ul className={cx.container}>
                    {players.map((p, i) => <PlayerPickerRecord player={p} isPicked={playerIsPicked(i)} key={p.id}
                                                               onClick={e => {
                                                                   pickToggle(i);
                                                               }}/>)}
                </ul>
                {(!mustPickOne || didPick()) && <button className={cx.confirmBtn} onClick={e => {
                    onConfirm(players.filter((p, i) => playerIsPicked(i)))
                }}>
                    ✓ Proceed
                </button>}
            </>
        )
    }
}

PlayerPicker.propTypes = {
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired,
    all: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    single: PropTypes.bool,
    mustPickOne: PropTypes.bool
};

export default PlayerPicker
