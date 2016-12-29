function goToNextState(creep) {
    var stateID = creep.memory.state;
    var state = Memory.states[stateID];
    creep.memory.state = state.nextState;
    creep.memory.substate = state.nextSubstate;
}

module.exports = {
    goToNextState: goToNextState
};
