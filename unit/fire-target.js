// before

const moke = require('./mokes'), should = moke.should, assert = moke.assert;

// main

console.info("\x1b[32m", "fire-target…", "\x1b[0m");

const Event = require('../event');
const EventTarget = require('../event-target');

(async function () {

    let et = new EventTarget();

    et.on('test', function (ev, no_arg) {
        assert(ev instanceof Event, "should receive instance of Event");
        should(no_arg, undefined, "should have no second parameter");
    });
    et.dispatch('test', [], function (ev) {
        should(ev.type, 'test', "should recieve the end");
    });
    et.detach('test');

    et.on('test', function (ev, arg1, arg2) {
        should(arg1, "phrase", "should have set second parameter");
        should(arg2, 3.14159, "should have set second parameter");
    });
    await et.dispatchSync('test', ["phrase", 3.14159]);

})();
