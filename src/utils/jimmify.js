import urlJoin from 'url-join';
import { STORE_KEYS, JIMMIFY_API_URL } from './constants'
import store from './store';

export function setJimmyUrl(server) {
  store.save({
    key: STORE_KEYS.server,
    data: {
      server
    }
  });
}

export function getJimmyUrl() {

    return new Promise(resolve => {
      store.load({ key: STORE_KEYS.server })
        .then(({ server }) => {
          resolve(server)
        }).catch(error => {
        if (error.name === 'NotFoundError' || error.name === 'ExpiredError') {
          setJimmyUrl(JIMMIFY_API_URL);
        }
        resolve(JIMMIFY_API_URL);
      });
    });
}

class Jimmify {

    constructor() {
        // Bind all the things
        this.request = this.request.bind(this);
        this.attemptConnection = this.attemptConnection.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.renewToken = this.renewToken.bind(this);
        this.getQueue = this.getQueue.bind(this);
        this.getRecent = this.getRecent.bind(this);
        this.answer = this.answer.bind(this);
    }

    request({route, method, body}) {
        return getJimmyUrl().then((url) => {
          return fetch(urlJoin(url, route), {
            method,
            body: JSON.stringify(body)
          }).then((response) => response.json());
        });
    }

    attemptConnection() {
        return this.request({ route: '', method: 'GET' });
    }

    authenticate(body) {
        return this.request({ route: 'login', method: 'POST', body });
    }

    renewToken(body) {
        return this.request({ route: 'renew', method: 'POST', body });
    }

    search(query) {
        return this.request({ route: 'query', method: 'POST', body: { type: 'search', text: query }});
    }

    getQueue() {
        return this.request({ route: 'queue', method: 'GET' });
    }

    getRecent() {
        return this.request({ route: 'recent', method: 'GET' });
    }

    answer(body) {
        return this.request({ route: 'answer', method: 'POST', body });
    }

    addPushToken(body) {
        return this.request({ route: 'expo/add', method: 'POST', body });
    }

    removePushToken(body) {
        return this.request({ route: 'expo/del', method: 'POST', body });
    }
}

export default new Jimmify();
