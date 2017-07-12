import _ from 'lodash';

class PubSub {

    constructor() {
        this.publish = this.publish.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unSubscribe = this.unSubscribe.bind(this);
        this.listeners = {};
    }

    subscribe(trigger, callback) {
        if (!_.isArray(this.listeners[trigger])) {
            this.listeners[trigger] = [];
        }

        this.listeners[trigger].push(callback);
    }

    unSubscribe(trigger, callback) {
        if (_.isArray(this.listeners[trigger])) {
            _.pull(this.listeners[trigger], callback);
        }
    }

    publish(trigger, params) {
        _.each(this.listeners[trigger], callback => {
            callback(params);
        });
    }
}

export default new PubSub();