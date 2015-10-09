import Ember from 'ember';
import BaseStore from './base';
import objectsAreEqual from '../utils/objects-are-equal';

const { on } = Ember;

/**
  Session store that persists data in the browser's `localStorage`.

  __This is the default store that Ember Simple Auth will use when the
  application doesn't define a custom store.__

  __`localStorage` is not available in Safari when running  in private mode. If
  the application needs to support Safari's private mode, it should use the
  cookie store instead or change the configuration dynamically to only use the
  cookie store when `localStorage` is not available.__

  @class LocalStorageStore
  @module ember-simple-auth/session-stores/local-storage
  @extends BaseStore
  @public
*/
export default BaseStore.extend({
  /**
    The `localStorage` key the store persists data in.

    @property key
    @type String
    @default 'ember_simple_auth:session'
    @public
  */
  key: 'ember_simple_auth:session',

  _setup: on('init', function() {
    this._bindToStorageEvents();
  }),

  /**
    Persists the `data` in the `localStorage`.

    @method persist
    @param {Object} data The data to persist
    @public
  */
  persist(data) {
    data = JSON.stringify(data || {});
    localStorage.setItem(this.key, data);
    this._lastData = this.restore();
  },

  /**
    Returns all data currently stored in the `localStorage` as a plain object.

    @method restore
    @return {Object} The data currently persisted in the `localStorage`.
    @public
  */
  restore() {
    let data = localStorage.getItem(this.key);
    return JSON.parse(data) || {};
  },

  /**
    Clears the store by deleting the
    {{#crossLink "LocalStorageStore/key:property"}}{{/crossLink}} from
    `localStorage`.

    @method clear
    @public
  */
  clear() {
    localStorage.removeItem(this.key);
    this._lastData = {};
  },

  _bindToStorageEvents() {
    Ember.$(window).bind('storage', () => {
      let data = this.restore();
      if (!objectsAreEqual(data, this._lastData)) {
        this._lastData = data;
        this.trigger('sessionDataUpdated', data);
      }
    });
  }
});
