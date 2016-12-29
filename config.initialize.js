var initializer = {
    initializeMemory: initializeMemory
};

function initializeMemory(currentRoom) {
    // Global memory
    if (Memory.debug == undefined) Memory.debug = {};
    
    // Searching room controller
    var controlPoint = currentRoom.controller;
    if (controlPoint == undefined) {
        currentRoom.memory.type = "not buildable";
    } else {
        currentRoom.memory.type = "basic";
        currentRoom.memory.controller = {
            "id": controlPoint.id,
            "level": controlPoint.level
        };
    }
    
    // Searching sources and order by distance to mainSpawn
    var sources = currentRoom.find(FIND_SOURCES);
    currentRoom.memory.sources = [];
    sources.forEach(function(source) {
        currentRoom.memory.sources.push({
            "id": source.id
        });
        console.log("Choose a construction site for container of source in " + source.pos + " to go to phase 1");
    });
    
    // Searching mineral
    var minerals = currentRoom.find(FIND_MINERALS);
    currentRoom.memory.minerals = [];
    minerals.forEach(function(mineral) {
        currentRoom.memory.minerals.push({
            "id": mineral.id
        });
        console.log("Choose a construction site for container of mineral in " + mineral.pos + " to go to phase 1");
    });
    
    // Searching mainSpawn
    if (currentRoom.memory.type != "not buildable") {
        var spawns = _.filter(currentRoom.find(FIND_STRUCTURES), (struct) => {return struct.structureType == STRUCTURE_SPAWN});
        if (spawns.length == 0) {
            console.log("Place your spawn to go to phase 1");
            return;
        }
        console.log("Choose a construction site for container of room controller to go to phase 1");
        console.log("Choose a construction site for container of main Storage to go to phase 1");
        var mainSpawn = spawns[0];
        var spawnPos = mainSpawn.pos;
        
        // Order sources
        sources = sources.sort(function(a,b) {return spawnPos.findPathTo(a.pos).length - spawnPos.findPathTo(b.pos).length;})
        
        // Memory
        currentRoom.memory.mainSpawn = mainSpawn.id;
        currentRoom.memory.mainStorage = {};
        currentRoom.memory.mainStorage.id = mainSpawn.id;
        currentRoom.memory.sources = [];
        sources.forEach(function (source) {
            currentRoom.memory.sources.push({
                "id": source.id,
                "storageDistance": spawnPos.findPathTo(source.pos).length
            });
        });
        currentRoom.memory.minerals = [];
        minerals.forEach(function (mineral) {
            currentRoom.memory.minerals.push({
                "id": mineral.id,
                "storageDistance": spawnPos.findPathTo(mineral.pos).length
            });
        });
        currentRoom.memory.controller.storageDistance = spawnPos.findPathTo(controlPoint.pos).length;
    }
    
    currentRoom.memory.phase = 0;
    if (Memory.phase == undefined) Memory.phase = 0;
    delete Memory.initializing;
}

module.exports = initializer;
