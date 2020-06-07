import React, {useState} from "react";
import PropTypes from 'prop-types';
import Spinner from "./Spinner";
import Challenge from "../logic/Challenge";
import * as Phase from '../logic/game-phase';
import sage from "../logic/challenge-factory";
import * as Consts from "../logic/consts";

const cx = {
    container: 'loading-screen'
};

const getLoadablePic = src => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
        console.log('loaded ' + src);
        resolve(true)
    };
    img.onerror = () => reject(new Error(src + ' not found.'));
    img.src = src;
});

const loadIntro = () => {
    const basePath = Consts.ASSET_PATH + 'img/';
    let toLoad = ['intropic.jpg', 'bg.jpg', 'rainbow-strip.png'];
    toLoad = toLoad
        .map(i => basePath + i)
        .map(i => getLoadablePic(i));
    try {
        toLoad = toLoad.concat([document.fonts.ready]);
    } catch (err) {
    }
    return Promise.allSettled(toLoad)
};

const loadBoard = () => {
    const toLoad = Object.values(Challenge.IMGS).map(i => getLoadablePic(i)).concat([sage.init()]);
    return Promise.allSettled(toLoad)
};

const LoadingScreen = ({phase, onLoadComplete}) => {
    const [begunLoading, setBegunLoading] = useState(false);
    if (!begunLoading) {
        setBegunLoading(true);
        let loadFunc;
        if (phase === Phase.GAME_LOADING_BOARD) {
            loadFunc = loadBoard;
        }
        if (phase === Phase.GAME_LOADING_SETUP) {
            loadFunc = loadIntro;
        }
        if (!loadFunc)
            throw new Error('Loading screen at wrong phase');
        loadFunc().then(() => {
                onLoadComplete();
            }
        ).catch(err => {
            throw err // just rethrow
        });
    }
    return (
        <div className={cx.container}>
            <Spinner/>
        </div>
    )
};

LoadingScreen.propTypes = {
    phase: PropTypes.number.isRequired,
    onLoadComplete: PropTypes.func.isRequired
};

export default LoadingScreen
