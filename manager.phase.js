var phaseManager = {
    checkAndChange: checkAndChange
};

function numberOfWorkerOnPath(distance, workingTime, numberOfSlots) {
    if (distance == undefined) return 0;
    var numberOfTicks = distance * 3 + workingTime;
    return Math.ceil(numberOfTicks*numberOfSlots/workingTime);
}

function isPosition() {
    return false;
}

function getClosestObject(position) {
    var currentRoom = Game.rooms[position.roomName];
    var sources = currentRoom.find(FIND_SOURCES);
    var minerals = currentRoom.find(FIND_MINERALS);
    var controller = currentRoom.controller;
    
    for (var i in sources) {
       if (position.findPathTo(sources[i].pos).length <= 2) return {type: "source", content: sources[i]};
    };
    for (var i in minerals) {
       if (position.findPathTo(minerals[i].pos).length <= 2) return {type: "mineral", content: minerals[i]};
    };
    if (position.findPathTo(controller.pos).length <= 4) return {type: "controller", content: controller};
    if (currentRoom.memory.mainStorage.containerPos == undefined) return {type: "storage", content: ""};
    return {type: "error", content: ""};
}

function checkPhase1(room, phase) {
    var sites = room.find(FIND_CONSTRUCTION_SITES);
    // Filling the container position depending of the position
    sites.forEach(function(site) {
        var pos = site.pos;
        site.remove();
        var target = getClosestObject(pos);
        if (target.type == "error") return;
        if (target.type == "storage") {
            room.memory.mainStorage = {containerPos: pos};
            console.log("Container for storage placed");
            return;
        }
        if (target.type == "controller") {
            room.memory.controller.containerPos = pos;
            console.log("Container for controller placed");
            return;
        }
        if (target.type == "source") {
            for (var i in room.memory.sources) {
                if (room.memory.sources[i].id == target.content.id) {
                    room.memory.sources[i].containerPos = pos;
                    console.log("Container for source at position " + target.content.pos + " placed");
                    return;
                }
            }
        }
        if (target.type == "mineral") {
            for (var i in room.memory.minerals) {
                if (room.memory.minerals[i].id == target.content.id) {
                    room.memory.minerals[i].containerPos = pos;
                    console.log("Container for mineral at position " + target.content.pos + " placed");
                    return;
                }
            }
        }
    });
    
    /*
     * To go to phase 1 you need to specify the position of :
     *    - all sources
     *    - room controller
     *    - main storage
     */
     
    // Position of sources containers
    var sources = room.memory.sources;
    for (var i in sources) {
        if (sources[i].containerPos == undefined) {
            if (Memory.debug.init == 1) {
                console.log("No container for source at position " + Game.getObjectById(sources[i].id).pos);
            }
            return false;
        }
    }
    // Position of room Controller container
    if (!room.memory.controller.containerPos) {
        if (Memory.debug.init == 1) {
            console.log("No container for controller");
        }
        return false;
    }
    // Position of mineral container
    var minerals = room.memory.minerals;
    for (var i in minerals) {
        if (minerals[i].containerPos == undefined) {
            if (Memory.debug.init == 1) {
                console.log("No container for mineral at position " + Game.getObjectById(minerals[i].id).pos);
            }
            return false;
        }
    }
    // Position of main Storage
    if (!room.memory.mainStorage.containerPos) {
        if (Memory.debug.init == 1) {
            console.log("No container for storage");
        }
        return false;
    }
    return true;
}


function checkAndChange(room) {
    var mem = room.memory;
    if (mem.phase == 0) {
        if (checkPhase1(room, 0)) {
            mem.phase = 1;
            console.log("Room " + room.name + " going to phase 1");
            mem.logisticArray = [
                // Sources 0 and 1
                numberOfWorkerOnPath(mem.sources[0].storageDistance, 25, 2),
                numberOfWorkerOnPath(mem.sources[1].storageDistance, 25, 2),
                // Mineral
                0,
                // Transporters
                0,
                // Upgraders
                0,
                // Builders
                0,
                // Repairers
                0
            ];
            room.memory = mem;
            if (Memory.phase < 1) Memory.phase = 1;
        }
    }
    
}

module.exports = phaseManager;
