function refreshRepairList(room) {
    room.memory.repair = {normal:[], emergency:[], walls:[]};
    var structs = room.find(FIND_STRUCTURES);
    var noWall = _.filter(structs, (struct) => {return (struct.structureType != STRUCTURE_WALL) && (struct.structureType != STRUCTURE_RAMPART)});
    var toRepair = _.filter(noWall, (struct) => {return struct.hits/struct.hitsMax < 0.8});
    toRepair = toRepair.sort(function(a, b) {return (a.hits < b.hits)});
    for (var i in toRepair) {
        var struct = toRepair[i];
        if (struct.hits/struct.hitsMax < 0.2) {
            room.memory.repair.emergency.push(struct.id);
        } else {
            room.memory.repair.normal.push(struct.id);
        }
    }
    var walls = _.filter(structs, (struct) => {return (struct.structureType == STRUCTURE_WALL) || (struct.structureType == STRUCTURE_RAMPART)});
    var toUpgrade = _.filter(walls, (struct) => {return struct.hits < room.memory.wallHits});
    if (toUpgrade.length == 0) {
        room.memory.wallHits = room.memory.wallHits + 50000;
        toUpgrade = _.filter(walls, (struct) => {return struct.hits < room.memory.wallHits});
    }
    for (var i in toUpgrade) {
        var struct = toUpgrade[i];
        room.memory.repair.walls.push(struct.id);
    }
}

function assignRepairers(room, repairTower) {
    var repairers = _.filter(room.find(FIND_CREEPS), (creep) => {return (creep.memory.role == "repairer") && (creep.memory.deliver == undefined)});
    var repairList = room.memory.repair;
    if (repairList.emergency.length != 0) {
        for (var i in repairList.emergency) {
            if (repairers[i]) {
                repairers[i].memory.deliver = repairList.emergency[i];
                repairList.emergency.pop();
                room.memory.repair.emergency = repairList.emergency;
                room.memory.towers[repairTower.id].healTarget = repairList.emergency[i];
            } else {
                room.memory.towers[repairTower.id].healTarget = repairList.emergency[i];
                return;
            }
        }
        repairers = _.filter(room.find(FIND_CREEPS), (creep) => {return (creep.memory.role == "repairer") && (creep.memory.deliver == undefined)});
    }
    var l = repairList.normal.length;
    if (l != 0) {
        for (var i in repairList.normal) {
            if (repairers[i]) {
                repairers[i].memory.deliver = repairList.normal[l-i-1];
                repairList.normal.pop();
                room.memory.repair.normal = repairList.normal;
            } else {
                return;
            }
        }
    }
}

function assignWallers(room) {
    var repairList = room.memory.repair;
    var wallers = _.filter(room.find(FIND_CREEPS), (creep) => {return (creep.memory.role == "waller") && (creep.memory.deliver == undefined)});
    var l = repairList.walls.length;
    if (l != 0) {
        for (var i in repairList.walls) {
            if (wallers[i]) {
                wallers[i].memory.deliver = repairList.walls.pop();
                room.memory.repair.walls = repairList.walls;
            } else {
                return;
            }
        }
    }
}

module.exports = {
    refreshRepairList: refreshRepairList,
    assignRepairers: assignRepairers,
    assignWallers: assignWallers
};
