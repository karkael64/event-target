/**
 * class Event is used to override Event class, which is easier to use. For example, building it looks like :
 * first = new Event( 'name', {'any':'data'}, this );
 * bind = new Event( first, null, this );
 */

function def(field, value) {
    Object.defineProperty(this, field, {
        "enumerable": true,
        "writable": false,
        "value": value
    });
}

function deff(obj) {
    for (let field in obj)
        if (obj.hasOwnProperty(field))
            def.call(this, field, obj[field]);
}

class Event {

    constructor(type, params, target) {

        if (!(this instanceof Event))
            return new Event(type, params, target);

        let parent = null;
        if (type instanceof Event) {
            parent = type;
            type = parent.type;
        }

        let defs = {};
        defs['type'] = type;
        defs['parent'] = parent;
        defs['currentTarget'] = target || null;
        defs['timestamp'] = Date.now();

        if (!parent) {
            parent = {};
            this.defaultPrevented = false;
            this.propagationStopped = false;
        }
        else {
            let self = this;
            Object.defineProperty(this, 'defaultPrevented', {
                "get": function () {
                    return self.parent.defaultPrevented;
                },
                "set": function (value) {
                    return self.parent.defaultPrevented = value;
                }
            });
            Object.defineProperty(this, 'propagationStopped', {
                "get": function () {
                    return self.parent.propagationStopped;
                },
                "set": function (value) {
                    return self.parent.propagationStopped = value;
                }
            });
        }

        defs['detail'] = params || parent.detail || null;
        defs['value'] = parent.originalTarget || target || null;
        defs['originalTarget'] = parent.originalTarget || target || null;
        defs['target'] = parent.originalTarget || target || null;

        deff.call(this, defs);
    }

    preventDefault() {
        this.defaultPrevented = true;
        return this;
    }

    stopPropagation() {
        this.propagationStopped = true;
        return this;
    }
}


module.exports = Event;