// before

const moke = require('./mokes'), should = moke.should, assert = moke.assert;

// main

console.info("\x1b[32m", "event-instance…", "\x1b[0m");

const Event = require('../event');

(function () { // simple

    let detail = {"bubbles": false, "arg1": 3.14159},
        ev = new Event('any', detail);

    assert(ev instanceof Event, "should be instancied");
    should(ev.defaultPrevented, false, "should not be prevented yet");
    should(ev.propagationStopped, false, "should not be stopped yet");
    should(ev.type, 'any', "should set type");
    should(ev.detail, detail, "should set detail as same object");
    should(ev.parent, null, "should have no parent");
    should(ev.target, null, "should have no target");
    should(ev.value, null, "should have no current target (into value)");
    should(ev.originalTarget, null, "should have no original target");
    should(ev.currentTarget, null, "should have no current target");
    assert(ev.timestamp > Date.now() - 200, "should have timestamp below 200ms elapsed");

    ev.preventDefault();
    ev.stopPropagation();

    should(ev.defaultPrevented, true, "should be prevented now");
    should(ev.propagationStopped, true, "should be stopped now");

})();

(function () { // with parent

    let detail = {"id": 3, "name": "John"},
        first_target = {"table": "foo", "datamodel": "user"},
        first_ev = new Event('any', detail, first_target);

    let second_target = {"table": "bar", "datamodel": "user"},
        ev = new Event(first_ev, null, second_target);

    assert(ev instanceof Event, "should be instancied");
    should(ev.defaultPrevented, false, "should not be prevented yet");
    should(ev.propagationStopped, false, "should not be stopped yet");
    should(ev.type, 'any', "should set type");
    should(ev.detail, detail, "should set detail as same object");
    should(ev.parent, first_ev, "should have no parent");
    should(ev.target, first_target, "should have no target");
    should(ev.value, first_target, "should have no current target (into value)");
    should(ev.originalTarget, first_target, "should have no original target");
    should(ev.currentTarget, second_target, "should have no current target");
    assert(ev.timestamp > Date.now() - 200, "should have timestamp below 200ms elapsed");

    first_ev.preventDefault();
    first_ev.stopPropagation();

    should(ev.defaultPrevented, true, "should be prevented now");
    should(ev.propagationStopped, true, "should be stopped now");

})();


// after

