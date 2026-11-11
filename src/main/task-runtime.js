function createTaskRuntime() {
    let states = {};
    // 每次 start/stop 都会生成新的运行代号，旧运行实例（队列、重试循环）据此自行退出。
    let runs = {};
    let seq = 0;

    function has(id) {
        return Object.prototype.hasOwnProperty.call(states, id);
    }

    function isActive(id) {
        return states[id] === true;
    }

    function start(id) {
        states[id] = true;
        runs[id] = ++seq;
        return runs[id];
    }

    function stop(id) {
        states[id] = false;
        runs[id] = ++seq;
        return runs[id];
    }

    function remove(id) {
        stop(id);
        delete states[id];
        delete runs[id];
    }

    function isRunActive(id, token) {
        return states[id] === true && token != null && runs[id] === token;
    }

    function resetFromTasks(tasks, active = false) {
        states = {};
        runs = {};
        (tasks || []).forEach(item => {
            states[item.id] = active;
            runs[item.id] = ++seq;
        });
    }

    function snapshot() {
        return { ...states };
    }

    return {
        has,
        isActive,
        start,
        stop,
        remove,
        isRunActive,
        resetFromTasks,
        snapshot
    };
}

module.exports = {
    createTaskRuntime
};
