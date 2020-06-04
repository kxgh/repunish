import React from "react";
import PropTypes from "prop-types";
import {gcx} from "../logic/globals";
import Challenge from "../logic/Challenge";

const cx = {
    container: 'board-help',
    type: 'board-help__type',
    content: 'board-help__content',
    image: 'board-help__image',
    btnDismiss: 'board-help__dismiss-btn'
};

const getHelpFor = type => {
    const t = Challenge.TYPES;
    switch (type) {
        case t.FINISH:
            return `Your goal is to get here! Players standing on this tile finished the game and can no longer ` +
                `get punished.`;
        case t.PORTAL:
            return `Teleports the entering player to a random tile (mostly) nearby.` +
                ``;
        case t.DRAGON:
            return `Dragon's mission is to find a specific player and send him back to start. Other players visiting ` +
                `the dragon are safe from his wrath.`;
        case t.REST:
            return `Players can safely step here.`;
        case t.GROUP_RELAY:
            return `Players take turns in game direction. They name things until someone is unable to do so or ` +
                `makes a mistake. The player then gets punished`;
        case t.MULTI_COND:
            return `Every player meeting a specified condition gets punished!`;
        case t.TIMED_MATH:
            return `Player has to solve a math problem within short time period. If they cannot do so, they get punished.`;
        case t.TIMED_EMBLEM:
            return `Player will be presented an emblem and has to match the emblem with one of 4 countries ` +
                'within short time period. If they cannot do so, they get punished.';
        case t.TIMED_FLAG:
            return `Player will be presented a flag and has to match the flag with one of 4 countries ` +
                'within short time period. If they cannot do so, they get punished.';
        case t.TIMED_CAPITAL:
            return `Player will be presented a country and has to match the country to one of 4 capitals ` +
                'within short time period. If they cannot do so, they get punished.';
        case t.START:
            return 'You start here.';
        default:
            return `` +
                ``;
    }
};

const BoardHelp = ({type, onDismiss}) => {
    const title = type ? type : 'Help';
    const content = type ? getHelpFor(type) : 'Click on any tile to display help.';
    const bgStyle = type ? {backgroundImage: `url('${Challenge.IMGS[type]}')`} : {};
    return (
        <div className={`${cx.container} ${gcx.appearAnim}`}>
            <div className={cx.image} style={bgStyle}/>
            <p className={cx.type}>{title}</p>
            <p className={cx.content}>{content}</p>
            <button className={cx.btnDismiss} onClick={onDismiss}>✓</button>
        </div>
    )
};

BoardHelp.propTypes = {
    type: PropTypes.string,
    onDismiss: PropTypes.func.isRequired
};
export default BoardHelp;