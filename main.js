// Comment this first require after initilization
var initializer = require("config.initialize");

var phaseManager = require("manager.phase");
var autospawner = require("autospawner");
var typeCivilian = require("type.civilian");

var fighter = require("fighter.scout");
var configBehavior = require("config.behavior");
var pathFollowing = require("pathFollowing");
var tasksCreeps = require("tasks.creeps");

var repairing = require("repairing");

var typeFighter = require("fighter.operation");

module.exports.loop = function () {
    if (Memory.phase == undefined) {
        configBehavior.init();
        initializer.initializeMemory(Game.rooms[Object.keys(Game.rooms)[0]]);
        return;
    } else {
        phaseManager.checkAndChange(Game.rooms[Object.keys(Game.rooms)[0]]);
        if (Memory.phase == 0) return;
    }
    
    // Reparation
    if (Game.time % 100 == 0) {
        repairing.refreshRepairList(Game.rooms["W18S27"]);
    }
    
    if (Game.time % 300 == 0) {
        autospawner.spawnClaim(Game.spawns["Spawn1"]);
    }
    
    // Defense
    var tower = Game.getObjectById('58593518e11a7e960c2eaabb');
    if (Game.time % 10 == 0) {
        repairing.assignRepairers(Game.rooms["W18S27"], tower);
        repairing.assignWallers(Game.rooms["W18S27"]);
    }
    
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } else {
            var targetID = tower.room.memory.towers['58593518e11a7e960c2eaabb'].healTarget;
            var target = Game.getObjectById(targetID);
            if (target) {
                tower.repair(target);
                if (target.hits == target.hitsMax) tower.room.memory.towers['58593518e11a7e960c2eaabb'].healTarget = undefined;
            }
        }
    }
    
    var spawns = Game.spawns;
    var keys = Object.keys(spawns);
    for (var i in keys) {
        autospawner.autoSpawnCivilian(spawns[keys[i]]);
    }
    
    if (Memory.test == undefined) {
        if (autospawner.spawnScout(spawns["Spawn1"]) == 0) Memory.test = 1;
    } else {
        var scout = Game.creeps["Scout"];
        if (scout) fighter.run(scout);
    }
    var claims = _.filter(Game.creeps, (creep) => {return creep.memory.role == "claim"});
    claims.forEach(function(creep) {fighter.runClaim(creep)});


    // Gestion à l'ancienne des creeps de la fleet "basic"
    Memory.fleets["basic"].elements = {};
    for (var name in Memory.creeps) {
        var creep = Game.creeps[name];
        if (!creep) delete Memory.creeps[name];
        if (creep.memory.fleet == "basic") {
            Memory.fleets["basic"].elements[creep.id] = creep.name;
        }
    }
    
    // Move all the fleets
    for (var i in Memory.fleets) {
        var fleet = Memory.fleets[i];
        switch (fleet.name) {
            case "basic":
                for (var creepID in fleet.elements) {
                    var creep = Game.getObjectById(creepID);
                    // Removing for fleet memory if creep is dead
                    if (!creep) {
                        delete fleet.elements[creepID];
                        continue;
                    }
                    typeCivilian.run(creep);
                }
                break;
            case "building":
                break;
        }
    }
    
    // 
}
