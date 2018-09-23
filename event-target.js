const Event = require('./event');


function is_string(el) {
    return (typeof el === 'string');
}

function is_list(el) {
    return el && (el instanceof Array);
}

function is_function(el) {
    return (typeof el === 'function');
}


/**
 * @class EventTarget allows you to use the event paradigm, synchronous and asynchronous.
 */

class EventTarget {

    constructor() {

        Object.defineProperty(this, "__events__", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: {}
        });
    }

    /**
     * @function on is used to record a function ${fn} to call when ${event} is dispatched.
     * @param event string|array
     * @param fn function|array
     * @returns {EventTarget}
     */

    on(event, fn) {

        if (is_string(event)) {
            event = event.toLowerCase();
            let split = event.split(/[, ]+/g);
            if (split.length >= 2) {
                EventTarget.prototype.on.call(this, split, fn);
                return this;
            }
        }
        if (is_list(event)) {
            for (let ev of event)
                EventTarget.prototype.on.call(this, ev, fn);
            return this;
        }
        if (is_list(fn)) {
            for (let f of fn)
                EventTarget.prototype.on.call(this, event, f);
            return this;
        }

        let self = this;
        if (is_string(event) && is_function(fn)) {


            if (this.addEventListener && !this.__events__[event]) {
                this.addEventListener(event, function () {
                    arguments[0] = new Event(arguments[0].type, null, self);
                    dispatch.apply(self, arguments)
                });
            }

            if (this.attachEvent && !this.__events__[event]) {
                this.attachEvent(event, function () {
                    arguments[0] = new Event(arguments[0].type, null, self);
                    dispatch.apply(self, arguments)
                });
            }

            if (!is_list(this.__events__[event]))
                this.__events__[event] = [];

            this.__events__[event].push(fn);

        }
        return this;
    }

    /**
     * @function detach is used to revoke a function ${fn} or every functions if undefined, to call $when ${event} is
     * dispatched.
     * @param event string|array
     * @param fn function|array|undefined
     * @returns {EventTarget}
     */

    detach(event, fn) {

        if (is_string(event)) {
            event = event.toLowerCase();
            let split = event.split(/[, ]+/g);
            if (split.length >= 2) {
                EventTarget.prototype.detach.call(this, split, fn);
                return this;
            }
        }
        if (is_list(event)) {
            for (let ev of event)
                EventTarget.prototype.detach.call(this, ev, fn);
            return this;
        }
        if (is_list(fn)) {
            for (let f of fn)
                EventTarget.prototype.detach.call(this, event, f);
            return this;
        }

        if (is_string(event) && is_list(this.__events__[event])) {
            if (is_function(fn)) {
                let res = [], t;
                while (t = this.__events__[event].shift()) {
                    if (t !== fn)
                        res.push(t);
                }
                this.__events__[event] = res;
            }
            else {
                this.__events__[event] = [];
            }
        }
        return this;
    }

    /**
     * @function dispatch is used to call every functions of ${event} asynchronously after a short timeout, with
     * arguments ${args}.
     * @param event {Event|string|Array}
     * @param args {Array|void}
     * @param then {function({Event})|void}
     * @returns {EventTarget}
     */

    dispatch(event, args, then) {

        if (is_string(event)) {
            event = event.toLowerCase();
            let split = event.split(/[, ]+/g);
            if (split.length >= 2) {
                EventTarget.prototype.dispatch.call(this, split, args);
                return this;
            }
        }
        if (is_list(event)) {
            for (let ev of event)
                EventTarget.prototype.dispatch.call(this, ev, args);
            return this;
        }

        let obj;
        if (event instanceof Event)
            obj = new Event(event, this);
        else if (is_string(event))
            obj = new Event(event, {}, this);
        else
            obj = new Event("", {}, this);

        if (!is_list(args)) {
            if (args === undefined) args = [];
            else args = [args];
        }
        args.unshift(obj);

        let self = this;
        if (is_list(this.__events__[event])) {

            let len = this.__events__[event].length, count = 0;
            for (let fn of this.__events__[event]) {
                setTimeout(async function () {
                    await fn.apply(self, args);
                    count++;
                    if (count >= len && (typeof then === 'function')) {
                        let then_args = args.slice();
                        then_args.unshift(1);
                        then_args.unshift(then);
                        setTimeout.apply(this, then_args);
                    }
                }, 1);
            }
        }
        else if (typeof then === 'function') {
            let then_args = args.slice();
            then_args.unshift(1);
            then_args.unshift(then);
            setTimeout.apply(this, then_args);
        }
        return this;
    }


    /**
     * @function dispatchSync is used to call every functions of ${event} synchronously, with arguments ${arg}.
     * @param event string|array
     * @param args list|array|undefined
     * @returns {Promise}
     */

    async dispatchSync(event, args) {

        if (is_string(event)) {
            event = event.toLowerCase();
            let split = event.split(/[, ]+/g);
            if (split.length >= 2) {
                await EventTarget.prototype.dispatchSync.call(this, split, args);
                return this;
            }
        }
        if (is_list(event)) {
            for (let ev of event)
                await EventTarget.prototype.dispatchSync.call(this, ev, args);
            return this;
        }

        let obj;
        if (event instanceof Event)
            obj = new Event(event, this);
        else if (is_string(event))
            obj = new Event(event, {}, this);
        else
            obj = new Event("", {}, this);

        if (is_list(this.__events__[event])) {

            if (!is_list(args)) {
                if (args === undefined) args = [];
                else args = [args];
            }
            args.unshift(obj);

            for (let fn of this.__events__[event]) {
                await fn.apply(this, args);
            }
        }
        return this;
    }

    /**
     * @function count recorded functions of an event ${event} name.
     * @param event string
     * @returns null|number
     */

    count(event) {
        return is_string(event) && is_list(this.__events__[event]) ?
            this.__events__[event].length :
            null;
    }
}

module.exports = EventTarget;
