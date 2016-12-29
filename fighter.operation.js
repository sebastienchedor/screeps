var tasksCreeps = require("tasks.creeps");
var pathFollowing = require("pathFollowing");

function run(creep) {
    switch (creep.memory.state) {
        // Go to output
        case 13:
            if (creep.pos.getRangeTo(3,22) > 0) {
                creep.moveTo(3, 22);
            } else {
                tasksCreeps.goToNextState(creep);
            }
            break;
        // Go to room near
        case 14:
            if (pathFollowing.moveControlled(creep, Memory.paths[2]) == -2) tasksCreeps.goToNextState(creep);
            break;
        // Wait the signal
        case 15:
            if (Memory.signal == 1) {
                tasksCreeps.goToNextState(creep);
            }
            var posi = new RoomPosition(creep.memory.placement.x, creep.memory.placement.y, creep.memory.placement.roomName);
            if (creep.pos.getRangeTo(posi) > 0) {
                creep.moveTo(posi);
            }
            break;
        // Change room
        case 16:
            if (Memory.signal == 2) tasksCreeps.goToNextState(creep);
            if (creep.room.name == "W18S26" && creep.pos.x > 5) {
                tasksCreeps.goToNextState(creep);
            } else {
                creep.move(RIGHT);
            }
            break;
        // Attack
        case 17:
            var target = Game.getObjectById(Memory.target);
            switch (creep.memory.role) {
                case "cover":
                    creep.moveTo(target);
                    break;
                case "unbuild":
                    var ret = creep.dismantle(target);
                    if (ret == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    break;
                case "attack":
                    if (!target) tasksCreeps.goToNextState(creep);
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    break;
            }
            break;
        // Annhilate
        case 18:
            //var targets = creep.room.find(FIND_HOSTILE_CREEPS);
            var targets = _.filter(creep.room.find(FIND_HOSTILE_STRUCTURES), (str) => {return str.structureType == STRUCTURE_EXTENSION});
            if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            break;
    }
}

module.exports = {
    run: run
};
