import React from "react";
import {DURATIONS} from "../logic/globals";

export const TQ_PHASES = {
    INTRO: 1,
    LOADING: 1.5,
    SOLVING: 2,
    SOLVED: 3,
    TIMEDOUT: 4,
    CORRECT: 5,
    INCORRECT: 6
};

const withTimedQuiz = (WrappedQuiz) => {
    class WithTimedQuiz extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                tqPhase: TQ_PHASES.INTRO,
                timeLimit: props.timeLimit || DURATIONS.QUIZ_DEF,
                timeout: null
            };
            this.answer = this.answer.bind(this);
            this.revealOpts = this.revealOpts.bind(this);
            this.timeLimitReached = this.timeLimitReached.bind(this);
            this.setOnCorrect = this.setOnCorrect.bind(this);
            this.setOnIncorrect = this.setOnIncorrect.bind(this);

            this.onCorrect = _ => _;
            this.onIncorrect = _ => _;
        }

        setOnCorrect(f) {
            this.onCorrect = f || this.onCorrect;
        }

        setOnIncorrect(f) {
            this.onIncorrect = f || this.onIncorrect;
        }

        timeLimitReached() {
            this.setState(prevState => {
                const ns = {};
                if (prevState.tqPhase === TQ_PHASES.SOLVING) {
                    ns.tqPhase = TQ_PHASES.TIMEDOUT;
                    this.onIncorrect();
                }
                return ns
            })
        }

        revealOpts(imgSrc) {
            const beginSolving = () => {
                this.setState(prevState => {
                    const ns = {};
                    if (prevState.tqPhase === TQ_PHASES.INTRO || prevState.tqPhase === TQ_PHASES.LOADING) {
                        ns.tqPhase = TQ_PHASES.SOLVING;
                        ns.timeout = setTimeout(() => {
                            this.timeLimitReached();
                        }, prevState.timeLimit);
                    }
                    return ns
                });
            };
            if (!imgSrc)
                beginSolving();
            else {
                this.setState(prevState => {
                    const ns = {};
                    if (prevState.tqPhase === TQ_PHASES.INTRO)
                        ns.tqPhase = TQ_PHASES.LOADING;
                    return ns
                });
                const img = new Image();
                img.onload = beginSolving;
                img.src = imgSrc;
            }
        }

        componentWillUnmount() {
            this.state.timeout && clearTimeout(this.state.timeout)
        }

        answer(correct) {
            this.setState(prevState => {
                const ns = {};
                if (correct)
                    this.onCorrect();
                else this.onIncorrect()
                if (prevState.tqPhase < TQ_PHASES.SOLVED)
                    ns.tqPhase = correct ? TQ_PHASES.CORRECT : TQ_PHASES.INCORRECT;
                return ns
            });
        }

        render() {
            const {answer, revealOpts, setOnCorrect, setOnIncorrect} = this;
            const {tqPhase, timeLimit} = this.state;
            return (
                <>
                    <WrappedQuiz answer={answer}
                                 revealOpts={revealOpts}
                                 timeLimit={timeLimit}
                                 tqPhase={tqPhase}
                                 setOnCorrect={setOnCorrect}
                                 setOnIncorrect={setOnIncorrect}
                                 {...this.props} />
                </>
            )
        }
    }

    return WithTimedQuiz
};

export default withTimedQuiz
