var tasksCreeps = require("tasks.creeps");
var pathFollowing = require("pathFollowing");

function run(creep) {
    switch (creep.memory.state) {
        case 7:
            if (creep.pos.getRangeTo(3,22) > 0) {
                creep.moveTo(3, 22, {reusePath: 50});
            } else {
                tasksCreeps.goToNextState(creep);
            }
            break;
        case 8:
            if (pathFollowing.moveControlled(creep, Memory.paths[0]) == -2) tasksCreeps.goToNextState(creep);
            break;
        case 9:
            creep.say(creep.memory.substate);
            creep.suicide();
            tasksCreeps.goToNextState(creep);
            break;
    }
}

function runClaim(creep) {
    switch (creep.memory.state) {
        case 10:
            if (creep.pos.getRangeTo(3,22) > 0) {
                creep.moveTo(3, 22, {reusePath: 50});
            } else {
                tasksCreeps.goToNextState(creep);
            }
            break;
        case 11:
            if (pathFollowing.moveControlled(creep, Memory.paths[1]) == -2) tasksCreeps.goToNextState(creep);
            break;
        case 12:
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                return(creep.moveTo(creep.room.controller));
            }
            break;
    }
}

module.exports = {
    run: run,
    runClaim: runClaim
};
