/*
 * We consider a creep have a state an a substate
 * The state is the action it is doing (here move)
 * The substate is the position in this path
 */
function moveControlled(creep, path) {
    // get position
    var position = creep.memory.substate;
    // get the direction
    var direction = path[position];
    // move
    var ret = creep.move(direction);
    if (ret == 0) {
        position = position + 1;
        // check if it is the end of the path
        if (position == path.length) {
            return -2;
        } else {
            creep.memory.substate = position;
        }
    }
    if (direction == undefined) return -2;
    return ret;
}

module.exports = {
    moveControlled: moveControlled
};
