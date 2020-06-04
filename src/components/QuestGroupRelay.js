import React from "react";
import PropTypes from 'prop-types';
import {cx} from "./Quest";
import {gcx} from "../logic/globals";
import Challenge from "../logic/Challenge";
import PlayerPicker from "./PlayerPicker";
import Verdict from "./Verdict";
import Player from "../logic/Player";

const QuestGroupRelay = ({challenge, actions, players}) => {
    const [pickedId, setPickedId] = React.useState(null);
    const [verdictPhase, setVerdictPhase] = React.useState(false);

    const onPickedPlayerConfirmed = (pickedPlayers) => {
        if (verdictPhase)
            return;
        if (pickedPlayers && pickedPlayers.length) {
            actions.onIncorrect(pickedPlayers);
            setPickedId(pickedPlayers[0].id);
        }
        setVerdictPhase(true);
    };

    const pickedPlayer = verdictPhase ? players.filter(p => p.id === pickedId)[0] : {};
    const introText = verdictPhase ? [`${pickedPlayer.name} couldn't name `, ' and deserves to be punished.'] :
        ['Select the first person who couldn\'t name '];

    return (
        <>
            <div className={cx.body}>
                <p className={cx.type}>{challenge.type}</p>
                <p className={`${cx.task} ${cx.taskLarge} ${verdictPhase ? gcx.appearAnim : ''}`}>{introText[0]}<span
                    className={cx.accent}>{challenge.task}</span>
                    {introText[1]}
                </p>
            </div>
            {!verdictPhase && <PlayerPicker players={players} single={true} mustPickOne={true} onConfirm={pls => {
                onPickedPlayerConfirmed(pls)
            }}/>}
            {verdictPhase &&
            <Verdict players={[pickedPlayer]} challenge={challenge}/>}
            {verdictPhase && <button onClick={actions.onFulfill} className={cx.fulfillBtn}>✓</button>}
        </>
    )
};

QuestGroupRelay.propTypes = {
    challenge: PropTypes.instanceOf(Challenge).isRequired,
    actions: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.instanceOf(Player)).isRequired
};

export default QuestGroupRelay