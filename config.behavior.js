function init() {
    console.log("init memory state");
    Memory.states = [];
    var i = 0;
    // Died
    Memory.states[i] = ({nextState:0, nextSubstate:0, description:"free memory"}); // Entirely die
    Memory.states[i+1] = ({nextState:0, nextSubstate:0, description:"renew"}); // Renew the creep
    
    // Civilian behavior
    i = 2;
    Memory.states[i+0] = ({nextState:i+1, nextSubstate:0, description:"first move"}); // State first load
    Memory.states[i+1] = ({nextState:i+2, nextSubstate:0, description:"loading"}); // State load
    Memory.states[i+2] = ({nextState:i+3, nextSubstate:0, description:"go to deliver"}); // State go to deliver
    Memory.states[i+3] = ({nextState:i+4, nextSubstate:0, description:"delivering"}); // State deliver
    Memory.states[i+4] = ({nextState:i+1, nextSubstate:0, description:"do to loading"}); // State go to load
    
    // Scout behavior
    i = 7;
    Memory.states[i+0] = ({nextState:i+1, nextSubstate:0, description:"move to path begin"});
    Memory.states[i+1] = ({nextState:i+2, nextSubstate:0, description:"move"});
    Memory.states[i+2] = ({nextState:0, nextSubstate:0, description:"suicide"});
    
    // Scout behavior
    i = 10;
    Memory.states[i+0] = ({nextState:i+1, nextSubstate:0, description:"move out of the room"});
    Memory.states[i+1] = ({nextState:i+2, nextSubstate:0, description:"move to the left"});
    Memory.states[i+2] = ({nextState:0, nextSubstate:0, description:"go to claim"});
}

module.exports = {
    init: init
};
