/* 
 * Civilian is a main type which represent the all the logistic creeps
 * all the civilian have a CARRY piece and move from a point to another.
 * 
 *
 * They always make moves between to point, one for loading energy, and the other for delivering it
 *
 * Harvesters have a special loading function, to gain one instruction,
 * the harvesters comes after the other creeps in the loading block
 *
 * They can't be reprogrammed by the civilian manager
 */

/*
 * Memory :
 *   - type : "civilian"
 *   - subtype : not used
 *   - role : string, used to know the loading or deliver operations
 *   - state : "load" or "deliver"
 *   - load : id of the object to load
 *   - deliver : id of the object to deliver
 */
 
function run(creep) {
    // Possible changing state
    if (creep.memory.state == "load" && creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = "deliver";
    }
    if (creep.memory.state == "deliver" && creep.carry.energy == 0) {
        creep.memory.state = "load";
    }
    
    if (creep.memory.state == "load") {
        var loadObject = Game.getObjectById(creep.memory.load);
        // Special operation for harvester -> go second
        if (creep.memory.role != "harvester") {
            if(creep.withdraw(loadObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(loadObject);
            }
        } else {
            if(creep.harvest(loadObject) == ERR_NOT_IN_RANGE) {
                creep.moveTo(loadObject);
            }
            var deliverObject = Game.getObjectById(creep.memory.deliver);
            creep.transfer(deliverObject, RESOURCE_ENERGY);
        }
        return;
    }
    if (creep.memory.state == "deliver") {
        var deliverObject = Game.getObjectById(creep.memory.deliver);
        // Special operation for not harvester or transporter -> go second
        if (creep.memory.role == "harvester" || creep.memory.role == "transporter") {
            if(creep.transfer(deliverObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(deliverObject);
            }
        } else {
            if (creep.memory.role == "upgrader") {
                if(creep.upgradeController(deliverObject) == ERR_NOT_IN_RANGE) {
                    return(creep.moveTo(deliverObject));
                }
            }
            if (creep.memory.role == "repairer") {
                if (deliverObject == undefined) return;
                var ret = creep.repair(deliverObject);
                if (ret == ERR_NOT_IN_RANGE) {
                    return(creep.moveTo(deliverObject));
                }
                if (deliverObject.hits == deliverObject.hitsMax) {
                    creep.memory.deliver = undefined;
                }
                return ret;
            }
            if (creep.memory.role == "builder") {
                if (creep.memory.subrole == "free") {
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                } else {
                    if(creep.build(deliverObject) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(deliverObject);
                    }
                }
            }
            if (creep.memory.role == "refiller") {
                var targets = _.filter(creep.room.find(FIND_STRUCTURES), (struct) => {return (struct.structureType == STRUCTURE_EXTENSION) && (struct.energy < struct.energyCapacity);});
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            if (creep.memory.role == "waller") {
                if (deliverObject == undefined) return;
                var ret = creep.repair(deliverObject);
                if (ret == ERR_NOT_IN_RANGE) {
                    return(creep.moveTo(deliverObject));
                }
                if (deliverObject.hits > creep.room.memory.wallHits) {
                    creep.memory.deliver = undefined;
                }
                return ret;
            }
        }
        return;
    }
};

module.exports = {
    run: run
}
