import React from "react";
import * as Phase from "./logic/game-phase";
const PhaseContext = React.createContext(Phase.GAME_SETUP);
export default PhaseContext