/*
 * The autospawner spawn creeps needed to obtain the numbers specified in room.memory.logisticArray
 * logisticArray = [
 *      0: closest source harvesters
 *      1: second source harvesters
 *      2: minerals harvesters
 *      3: transporters
 *      4: upgraders
 *      5: builders
 *      6: repairers
 *      7: refillers
 *      8: wallers
 *  ];
 *
 */

function generateNumber() {
    return Math.floor(Math.random()*1000+1);
};

function autoSpawnCivilian(s) {
    var room = s.room;
    var tech = room.memory.phase;
    if (tech < 1) return;
    var logisticArray = room.memory.logisticArray;
    var civilianArray = [0,0,0,0,0,0,0,0,0];
    civilianArray[3] = [0,0,0,0];
    var creeps = room.find(FIND_CREEPS);
    for (var i in creeps) {
        switch (creeps[i].memory.role) {
            case "harvester":
                if (creeps[i].memory.subrole == "source0") {
                    civilianArray[0]++;
                } else {
                    if (creeps[i].memory.subrole == "source1") civilianArray[1]++;
                }
                break;
            case "mineral":
                civilianArray[2]++;
                break;
            case "transporter":
                switch (creeps[i].memory.subrole) {
                    case "spawn":
                        civilianArray[3][0]++;
                        break;
                    case "source0":
                        civilianArray[3][1]++;
                        break;
                    case "source1":
                        civilianArray[3][2]++;
                        break;
                    case "extensions":
                        civilianArray[3][3]++;
                        break;
                    default:
                        civilianArray[3][4]++;
                        break;
                }
                break;
            case "upgrader":
                civilianArray[4]++;
                break;
            case "builder":
                civilianArray[5]++;
                break;
            case "repairer":
                civilianArray[6]++;
                break;
            case "refiller":
                civilianArray[7]++;
                break;
            case "waller":
                civilianArray[8]++;
                break;
        }
    }
    
    // transporter priority
    if (civilianArray[7] < logisticArray[7]) {
        return spawn(s, "refiller", tech);
    }
    if (civilianArray[3][0] < logisticArray[3][0]) {
        return spawn(s, "transporter", tech, "spawn");
    }
    // harvesters seconds
    if (civilianArray[0] < logisticArray[0]) {
        return spawn(s, "harvester0", tech);
    }
    if (civilianArray[3][1] < logisticArray[3][1]) {
        return spawn(s, "transporter", tech, "source0");
    }
    if (civilianArray[1] < logisticArray[1]) {
        return spawn(s, "harvester1", tech);
    }
    if (civilianArray[3][2] < logisticArray[3][2]) {
        return spawn(s, "transporter", tech, "source1");
    }
    if (civilianArray[3][3] < logisticArray[3][3]) {
        return spawn(s, "transporter", tech, "extensions");
    }
    // other civilians
    if (civilianArray[5] < logisticArray[5]) {
        return spawn(s, "builder", tech);
    }
    if (civilianArray[4] < logisticArray[4]) {
        return spawn(s, "upgrader", tech);
    }
    if (civilianArray[6] < logisticArray[6]) {
        return spawn(s, "repairer", tech);
    }
    if (civilianArray[2] < logisticArray[2]) {
        return spawn(s, "mineral", tech);
    }
    if (civilianArray[8] < logisticArray[8]) {
        return spawn(s, "waller", tech);
    }
}

function spawn(s, role, tech, subrole) {
    var type = "";
    var subtype = "";
    var memory = {};
    if (true) {
        type = "civilian";
        memory.type = "civilian";
        subtype = "worker";
        memory.subtype = "worker";
        switch (role) {
            case "harvester0":
                memory.role = "harvester";
                memory.subrole = "source0";
                memory.state = "load";
                memory.load = s.room.memory.sources[0].id;
                if (tech == 1) {
                    memory.deliver = s.room.memory.mainStorage.id;
                }
                if (tech == 2) {
                    memory.deliver = s.room.memory.sources[0].containerID;
                }
                break;
            case "harvester1":
                memory.role = "harvester";
                memory.subrole = "source1";
                memory.state = "load";
                memory.load = s.room.memory.sources[1].id;
                if (tech == 1) {
                    memory.deliver = s.room.memory.mainStorage.id;
                }
                if (tech == 2) {
                    memory.deliver = s.room.memory.sources[1].containerID;
                }
                break;
            case "upgrader":
                memory.role = "upgrader";
                memory.state = "load";
                memory.load = s.room.memory.mainStorage.id;
                memory.deliver = s.room.memory.controller.id;
                break;
            case "builder":
                memory.role = "builder";
                memory.subrole = "free";
                memory.state = "load";
                memory.load = s.room.memory.mainStorage.id;
                break;
            case "transporter":
                memory.role = "transporter";
                memory.deliver = s.room.memory.mainStorage.id;
                switch (subrole) {
                    case "spawn":
                        memory.deliver = s.id;
                        memory.load = s.room.memory.mainStorage.id;
                        break;
                    case "source0":
                        memory.load = s.room.memory.sources[0].containerID;
                        break;
                    case "source1":
                        memory.load = s.room.memory.sources[1].containerID;
                        break;
                    case "extensions":
                        memory.load = s.room.memory.extensions.containerID;
                        break;
                }
                memory.subrole = subrole;
                memory.state = "load";
                break;
            case "repairer":
                memory.role = "repairer";
                memory.state = "load";
                memory.load = s.room.memory.mainStorage.id;
                break;
            case "refiller":
                memory.role = "refiller";
                memory.state = "load";
                memory.load = s.room.memory.mainStorage.id;
                break;
            case "waller":
                memory.role = "waller";
                memory.state = "load";
                memory.load = s.room.memory.mainStorage.id;
                break;
        }
        return spawnType(s, type, tech, subtype, memory);
    }
}


function spawnType(s, type, tech, subtype, memory) {
    var parts = [];
    var name = "";
    
    if (type == "civilian") {
        switch (memory.role) {
            case "transporter":
                if (tech == 1) {
                    parts = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
                }
                if (tech == 2) {
                    parts = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
                }
                name = "Transporter";
                break;
            case "refiller":
                parts = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
                name = "Refiller";
                break;
            case "repairer":
                parts = [WORK, CARRY, MOVE, CARRY, MOVE];
                name = "Repairer";
                break;
            case "waller":
                parts = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                name = "Waller";
                break;
            case "harvester":
                if (tech == 1) {
                    parts = [WORK, CARRY, MOVE];
                    name = "Worker";
                    break;
                }
                if (tech == 2) {
                    parts = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                    name = "Harvester";
                    break;
                }
                break;
            case "upgrader":
                if (tech == 1) {
                    parts = [WORK, CARRY, MOVE];
                    name = "Upgrader";
                    break;
                }
                if (tech == 2) {
                    parts = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
                    name = "Upgrader";
                    break;
                }
                break;
            default:
                parts = [WORK, WORK, CARRY, MOVE];
                name = "Worker";
        }
    }
    
    // Try 3 times in case of already existing name
    memory.fleet = "basic";
    for (i = 0; i < 3; i++) {
        name = name + generateNumber();
        var ret = s.createCreep(parts, name, memory);
        if (ret != ERR_NAME_EXISTS) return ret;
    }
}

function spawnScout(spawn) {
    spawn.createCreep([MOVE], "Scout", {
        type: "scout",
        fleet: "basic",
        subtype: "simple",
        role: "scout",
        state: 7,
        substate: 0
    });
}

function spawnClaim(spawn) {
    var number = generateNumber();
    return (spawn.createCreep([MOVE, CLAIM], "safeClaim"+number, {
        type: "claim",
        fleet: "basic",
        subtype: "simple",
        role: "claim",
        state: 10,
        substate: 0
    }));
}

module.exports = {
    autoSpawnCivilian: autoSpawnCivilian,
    spawn: spawn,
    spawnScout: spawnScout,
    spawnClaim: spawnClaim
};
