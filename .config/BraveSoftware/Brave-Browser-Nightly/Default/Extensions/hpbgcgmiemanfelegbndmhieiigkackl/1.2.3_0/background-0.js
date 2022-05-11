LavaPack.loadBundle([
[37, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @typedef {Object} FirstTimeState
 * @property {Object} config Initial configuration parameters
 * @property {Object} NetworkController Network controller state
 */

/**
 * @type {FirstTimeState}
 */
const initialState = {
  config: {},
  PreferencesController: {
    frequentRpcListDetail: [{
      rpcUrl: 'http://localhost:8545',
      chainId: '0x3e8',
      ticker: 'ETH',
      nickname: 'Localhost 8545',
      rpcPrefs: {}
    }]
  }
};
var _default = initialState;
exports.default = _default;


//# sourceMappingURL=app/scripts/first-time-state.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/first-time-state.js",}],
[56, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getObjStructure;

var _lodash = require("lodash");

// This will create an object that represents the structure of the given object
// it replaces all values with the result of their type
// {
//   "data": {
//     "CurrencyController": {
//       "conversionDate": "number",
//       "conversionRate": "number",
//       "currentCurrency": "string"
//     }
// }

/**
 * Creates an object that represents the structure of the given object. It replaces all values with the result of their
 * type.
 *
 * @param {Object} obj - The object for which a 'structure' will be returned. Usually a plain object and not a class.
 * @returns {Object} The "mapped" version of a deep clone of the passed object, with each non-object property value
 * replaced with the javascript type of that value.
 *
 */
function getObjStructure(obj) {
  const structure = (0, _lodash.cloneDeep)(obj);
  return deepMap(structure, value => {
    return value === null ? 'null' : typeof value;
  });
}
/**
 * Modifies all the properties and deeply nested of a passed object. Iterates recursively over all nested objects and
 * their properties, and covers the entire depth of the object. At each property value which is not an object is modified.
 *
 * @param {Object} target - The object to modify
 * @param {Function} visit - The modifier to apply to each non-object property value
 * @returns {Object} The modified object
 */


function deepMap(target = {}, visit) {
  Object.entries(target).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      target[key] = deepMap(value, visit);
    } else {
      target[key] = visit(value);
    }
  });
  return target;
}

//# sourceMappingURL=app/scripts/lib/getObjStructure.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/getObjStructure.js",}],
[1562, {"debounce":1563,"duplexer":1623,"through":3384}, function (require, module, exports) {
var through = require('through')
  , duplexer = require('duplexer')
  , debounce = require('debounce')

module.exports = debounceStream

function debounceStream(_ms, immediate) {
  var ms = _ms || 100
    , input = through(debounce(write, ms, immediate))
    , output = through()

  return duplexer(input, output)

  function write(data) {
    output.queue(data)
  }
}

//# sourceMappingURL=node_modules/debounce-stream/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/debounce-stream/index.js",}],
[57, {"./util":78,"@babel/runtime/helpers/interopRequireDefault":186,"extensionizer":1869,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extensionizer = _interopRequireDefault(require("extensionizer"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _util = require("./util");

/**
 * A wrapper around the extension's storage local API
 */
class ExtensionStore {
  /**
   * @constructor
   */
  constructor() {
    this.isSupported = Boolean(_extensionizer.default.storage.local);

    if (!this.isSupported) {
      _loglevel.default.error('Storage local API not available.');
    }
  }
  /**
   * Returns all of the keys currently saved
   * @returns {Promise<*>}
   */


  async get() {
    if (!this.isSupported) {
      return undefined;
    }

    const result = await this._get(); // extension.storage.local always returns an obj
    // if the object is empty, treat it as undefined

    if (isEmpty(result)) {
      return undefined;
    }

    return result;
  }
  /**
   * Sets the key in local state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */


  async set(state) {
    return this._set(state);
  }
  /**
   * Returns all of the keys currently saved
   * @private
   * @returns {Object} the key-value map from local storage
   */


  _get() {
    const {
      local
    } = _extensionizer.default.storage;
    return new Promise((resolve, reject) => {
      local.get(null,
      /** @type {any} */
      result => {
        const err = (0, _util.checkForError)();

        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * Sets the key in local state
   * @param {Object} obj - The key to set
   * @returns {Promise<void>}
   * @private
   */


  _set(obj) {
    const {
      local
    } = _extensionizer.default.storage;
    return new Promise((resolve, reject) => {
      local.set(obj, () => {
        const err = (0, _util.checkForError)();

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

}
/**
 * Returns whether or not the given object contains no keys
 * @param {Object} obj - The object to check
 * @returns {boolean}
 */


exports.default = ExtensionStore;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

//# sourceMappingURL=app/scripts/lib/local-store.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/local-store.js",}],
[61, {"../../../shared/constants/time":3598,"../../../shared/modules/fetch-with-timeout":3602,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _time = require("../../../shared/constants/time");

var _fetchWithTimeout = _interopRequireDefault(require("../../../shared/modules/fetch-with-timeout"));

const fetchWithTimeout = (0, _fetchWithTimeout.default)(_time.SECOND * 30);
const FIXTURE_SERVER_HOST = 'localhost';
const FIXTURE_SERVER_PORT = 12345;
const FIXTURE_SERVER_URL = `http://${FIXTURE_SERVER_HOST}:${FIXTURE_SERVER_PORT}/state.json`;
/**
 * A read-only network-based storage wrapper
 */

class ReadOnlyNetworkStore {
  constructor() {
    (0, _defineProperty2.default)(this, "isSupported", true);
    this._initialized = false;
    this._initializing = this._init();
    this._state = undefined;
  }
  /**
   * Declares this store as compatible with the current browser
   */


  /**
   * Initializes by loading state from the network
   */
  async _init() {
    try {
      const response = await fetchWithTimeout(FIXTURE_SERVER_URL);

      if (response.ok) {
        this._state = await response.json();
      }
    } catch (error) {
      _loglevel.default.debug(`Error loading network state: '${error.message}'`);
    } finally {
      this._initialized = true;
    }
  }
  /**
   * Returns state
   * @returns {Promise<object>}
   */


  async get() {
    if (!this._initialized) {
      await this._initializing;
    }

    return this._state;
  }
  /**
   * Set state
   * @param {Object} state - The state to set
   * @returns {Promise<void>}
   */


  async set(state) {
    if (!this._initialized) {
      await this._initializing;
    }

    this._state = state;
  }

}

exports.default = ReadOnlyNetworkStore;

//# sourceMappingURL=app/scripts/lib/network-store.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/network-store.js",}],
[55, {"../../_locales/index.json":1,"@babel/runtime/helpers/interopRequireDefault":186,"extensionizer":1869,"pify":2887}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFirstPreferredLangCode;

var _extensionizer = _interopRequireDefault(require("extensionizer"));

var _pify = _interopRequireDefault(require("pify"));

var _index = _interopRequireDefault(require("../../_locales/index.json"));

const getPreferredLocales = _extensionizer.default.i18n ? (0, _pify.default)(_extensionizer.default.i18n.getAcceptLanguages, {
  errorFirst: false
}) : async () => []; // mapping some browsers return hyphen instead underscore in locale codes (e.g. zh_TW -> zh-tw)

const existingLocaleCodes = {};

_index.default.forEach(locale => {
  if (locale && locale.code) {
    existingLocaleCodes[locale.code.toLowerCase().replace('_', '-')] = locale.code;
  }
});
/**
 * Returns a preferred language code, based on settings within the user's browser. If we have no translations for the
 * users preferred locales, 'en' is returned.
 *
 * @returns {Promise<string>} Promises a locale code, either one from the user's preferred list that we have a translation for, or 'en'
 *
 */


async function getFirstPreferredLangCode() {
  let userPreferredLocaleCodes;

  try {
    userPreferredLocaleCodes = await getPreferredLocales();
  } catch (e) {
    // Brave currently throws when calling getAcceptLanguages, so this handles that.
    userPreferredLocaleCodes = [];
  } // safeguard for Brave Browser until they implement chrome.i18n.getAcceptLanguages
  // https://github.com/MetaMask/metamask-extension/issues/4270


  if (!userPreferredLocaleCodes) {
    userPreferredLocaleCodes = [];
  }

  const firstPreferredLangCode = userPreferredLocaleCodes.map(code => code.toLowerCase().replace('_', '-')).find(code => existingLocaleCodes[code] !== undefined);
  return existingLocaleCodes[firstPreferredLangCode] || 'en';
}

//# sourceMappingURL=app/scripts/lib/get-first-preferred-lang-code.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/get-first-preferred-lang-code.js",}],
[63, {"../platforms/extension":145,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extension = _interopRequireDefault(require("../platforms/extension"));

const NOTIFICATION_HEIGHT = 620;
const NOTIFICATION_WIDTH = 360;

class NotificationManager {
  /**
   * A collection of methods for controlling the showing and hiding of the notification popup.
   *
   * @typedef {Object} NotificationManager
   *
   */
  constructor() {
    this.platform = new _extension.default();
  }
  /**
   * Either brings an existing MetaMask notification window into focus, or creates a new notification window. New
   * notification windows are given a 'popup' type.
   *
   */


  async showPopup() {
    const popup = await this._getPopup(); // Bring focus to chrome popup

    if (popup) {
      // bring focus to existing chrome popup
      await this.platform.focusWindow(popup.id);
    } else {
      let left = 0;
      let top = 0;

      try {
        const lastFocused = await this.platform.getLastFocusedWindow(); // Position window in top right corner of lastFocused window.

        top = lastFocused.top;
        left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
      } catch (_) {
        // The following properties are more than likely 0, due to being
        // opened from the background chrome process for the extension that
        // has no physical dimensions
        const {
          screenX,
          screenY,
          outerWidth
        } = window;
        top = Math.max(screenY, 0);
        left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
      } // create new notification popup


      const popupWindow = await this.platform.openWindow({
        url: 'notification.html',
        type: 'popup',
        width: NOTIFICATION_WIDTH,
        height: NOTIFICATION_HEIGHT,
        left,
        top
      }); // Firefox currently ignores left/top for create, but it works for update

      if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
        await this.platform.updateWindowPosition(popupWindow.id, left, top);
      }

      this._popupId = popupWindow.id;
    }
  }
  /**
   * Checks all open MetaMask windows, and returns the first one it finds that is a notification window (i.e. has the
   * type 'popup')
   *
   * @private
   * @param {Function} cb - A node style callback that to which the found notification window will be passed.
   *
   */


  async _getPopup() {
    const windows = await this.platform.getAllWindows();
    return this._getPopupIn(windows);
  }
  /**
   * Given an array of windows, returns the 'popup' that has been opened by MetaMask, or null if no such window exists.
   *
   * @private
   * @param {Array} windows - An array of objects containing data about the open MetaMask extension windows.
   *
   */


  _getPopupIn(windows) {
    return windows ? windows.find(win => {
      // Returns notification popup
      return win && win.type === 'popup' && win.id === this._popupId;
    }) : null;
  }

}

exports.default = NotificationManager;

//# sourceMappingURL=app/scripts/lib/notification-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/notification-manager.js",}],
[60, {"@babel/runtime/helpers/interopRequireDefault":186,"events":1429}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

/**
 * @typedef {Object} Migration
 * @property {number} version - The migration version
 * @property {Function} migrate - Returns a promise of the migrated data
 */

/**
 * @typedef {Object} MigratorOptions
 * @property {Array<Migration>} [migrations] - The list of migrations to apply
 * @property {number} [defaultVersion] - The version to use in the initial state
 */
class Migrator extends _events.default {
  /**
   * @constructor
   * @param {MigratorOptions} opts
   */
  constructor(opts = {}) {
    super();
    const migrations = opts.migrations || []; // sort migrations by version

    this.migrations = migrations.sort((a, b) => a.version - b.version); // grab migration with highest version

    const lastMigration = this.migrations.slice(-1)[0]; // use specified defaultVersion or highest migration version

    this.defaultVersion = opts.defaultVersion || lastMigration && lastMigration.version || 0;
  } // run all pending migrations on meta in place


  async migrateData(versionedData = this.generateInitialState()) {
    // get all migrations that have not yet been run
    const pendingMigrations = this.migrations.filter(migrationIsPending); // perform each migration

    for (const migration of pendingMigrations) {
      try {
        // attempt migration and validate
        const migratedData = await migration.migrate(versionedData);

        if (!migratedData.data) {
          throw new Error('Migrator - migration returned empty data');
        }

        if (migratedData.version !== undefined && migratedData.meta.version !== migration.version) {
          throw new Error('Migrator - Migration did not update version number correctly');
        } // accept the migration as good
        // eslint-disable-next-line no-param-reassign


        versionedData = migratedData;
      } catch (err) {
        // rewrite error message to add context without clobbering stack
        const originalErrorMessage = err.message;
        err.message = `MonstaWalletMigration Error #${migration.version}: ${originalErrorMessage}`; // emit error instead of throw so as to not break the run (gracefully fail)

        this.emit('error', err); // stop migrating and use state as is

        return versionedData;
      }
    }

    return versionedData;
    /**
     * Returns whether or not the migration is pending
     *
     * A migration is considered "pending" if it has a higher
     * version number than the current version.
     * @param {Migration} migration
     * @returns {boolean}
     */

    function migrationIsPending(migration) {
      return migration.version > versionedData.meta.version;
    }
  }
  /**
   * Returns the initial state for the migrator
   * @param {Object} [data] - The data for the initial state
   * @returns {{meta: {version: number}, data: any}}
   */


  generateInitialState(data) {
    return {
      meta: {
        version: this.defaultVersion
      },
      data
    };
  }

}

exports.default = Migrator;

//# sourceMappingURL=app/scripts/lib/migrator/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/migrator/index.js",}],
[981, {"./ComposedStore":976,"./LocalStorageStore":977,"./MergedStore":978,"./ObservableStore":979,"./asStream":980,"./transform":982}, function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./asStream"), exports);
__exportStar(require("./ComposedStore"), exports);
__exportStar(require("./LocalStorageStore"), exports);
__exportStar(require("./MergedStore"), exports);
__exportStar(require("./ObservableStore"), exports);
__exportStar(require("./transform"), exports);
//# sourceMappingURL=index.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/index.js",}],
[46, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"promise-to-callback":2894,"readable-stream":3135}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStreamSink;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _readableStream = require("readable-stream");

var _promiseToCallback = _interopRequireDefault(require("promise-to-callback"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class AsyncWritableStream extends _readableStream.Writable {
  constructor(asyncWriteFn, _opts) {
    const opts = _objectSpread({
      objectMode: true
    }, _opts);

    super(opts);
    this._asyncWriteFn = asyncWriteFn;
  } // write from incoming stream to state


  _write(chunk, encoding, callback) {
    (0, _promiseToCallback.default)(this._asyncWriteFn(chunk, encoding))(callback);
  }

}

function createStreamSink(asyncWriteFn, _opts) {
  return new AsyncWritableStream(asyncWriteFn, _opts);
}

//# sourceMappingURL=app/scripts/lib/createStreamSink.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createStreamSink.js",}],
[144, {"./002":80,"./003":81,"./004":82,"./005":83,"./006":84,"./007":85,"./008":86,"./009":87,"./010":88,"./011":89,"./012":90,"./013":91,"./014":92,"./015":93,"./016":94,"./017":95,"./018":96,"./019":97,"./020":98,"./021":99,"./022":100,"./023":101,"./024":102,"./025":103,"./026":104,"./027":105,"./028":106,"./029":107,"./030":108,"./031":109,"./032":110,"./033":111,"./034":112,"./035":113,"./036":114,"./037":115,"./038":116,"./039":117,"./040":118,"./041":119,"./042":120,"./043":121,"./044":122,"./045":123,"./046":124,"./047":125,"./048":126,"./049":127,"./050":128,"./051":129,"./052":130,"./053":131,"./054":132,"./055":133,"./056":134,"./057":135,"./058":136,"./059":137,"./060":138,"./061":139,"./062":140,"./063":141,"./064":142,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("./002"));

var _2 = _interopRequireDefault(require("./003"));

var _3 = _interopRequireDefault(require("./004"));

var _4 = _interopRequireDefault(require("./005"));

var _5 = _interopRequireDefault(require("./006"));

var _6 = _interopRequireDefault(require("./007"));

var _7 = _interopRequireDefault(require("./008"));

var _8 = _interopRequireDefault(require("./009"));

var _9 = _interopRequireDefault(require("./010"));

var _10 = _interopRequireDefault(require("./011"));

var _11 = _interopRequireDefault(require("./012"));

var _12 = _interopRequireDefault(require("./013"));

var _13 = _interopRequireDefault(require("./014"));

var _14 = _interopRequireDefault(require("./015"));

var _15 = _interopRequireDefault(require("./016"));

var _16 = _interopRequireDefault(require("./017"));

var _17 = _interopRequireDefault(require("./018"));

var _18 = _interopRequireDefault(require("./019"));

var _19 = _interopRequireDefault(require("./020"));

var _20 = _interopRequireDefault(require("./021"));

var _21 = _interopRequireDefault(require("./022"));

var _22 = _interopRequireDefault(require("./023"));

var _23 = _interopRequireDefault(require("./024"));

var _24 = _interopRequireDefault(require("./025"));

var _25 = _interopRequireDefault(require("./026"));

var _26 = _interopRequireDefault(require("./027"));

var _27 = _interopRequireDefault(require("./028"));

var _28 = _interopRequireDefault(require("./029"));

var _29 = _interopRequireDefault(require("./030"));

var _30 = _interopRequireDefault(require("./031"));

var _31 = _interopRequireDefault(require("./032"));

var _32 = _interopRequireDefault(require("./033"));

var _33 = _interopRequireDefault(require("./034"));

var _34 = _interopRequireDefault(require("./035"));

var _35 = _interopRequireDefault(require("./036"));

var _36 = _interopRequireDefault(require("./037"));

var _37 = _interopRequireDefault(require("./038"));

var _38 = _interopRequireDefault(require("./039"));

var _39 = _interopRequireDefault(require("./040"));

var _40 = _interopRequireDefault(require("./041"));

var _41 = _interopRequireDefault(require("./042"));

var _42 = _interopRequireDefault(require("./043"));

var _43 = _interopRequireDefault(require("./044"));

var _44 = _interopRequireDefault(require("./045"));

var _45 = _interopRequireDefault(require("./046"));

var _46 = _interopRequireDefault(require("./047"));

var _47 = _interopRequireDefault(require("./048"));

var _48 = _interopRequireDefault(require("./049"));

var _49 = _interopRequireDefault(require("./050"));

var _50 = _interopRequireDefault(require("./051"));

var _51 = _interopRequireDefault(require("./052"));

var _52 = _interopRequireDefault(require("./053"));

var _53 = _interopRequireDefault(require("./054"));

var _54 = _interopRequireDefault(require("./055"));

var _55 = _interopRequireDefault(require("./056"));

var _56 = _interopRequireDefault(require("./057"));

var _57 = _interopRequireDefault(require("./058"));

var _58 = _interopRequireDefault(require("./059"));

var _59 = _interopRequireDefault(require("./060"));

var _60 = _interopRequireDefault(require("./061"));

var _61 = _interopRequireDefault(require("./062"));

var _62 = _interopRequireDefault(require("./063"));

var _63 = _interopRequireDefault(require("./064"));

// Migrations must start at version 1 or later.
// They are objects with a `version` number
// and a `migrate` function.
//
// The `migrate` function receives the previous
// config data format, and returns the new one.
const migrations = [_.default, _2.default, _3.default, _4.default, _5.default, _6.default, _7.default, _8.default, _9.default, _10.default, _11.default, _12.default, _13.default, _14.default, _15.default, _16.default, _17.default, _18.default, _19.default, _20.default, _21.default, _22.default, _23.default, _24.default, _25.default, _26.default, _27.default, _28.default, _29.default, _30.default, _31.default, _32.default, _33.default, _34.default, _35.default, _36.default, _37.default, _38.default, _39.default, _40.default, _41.default, _42.default, _43.default, _44.default, _45.default, _46.default, _47.default, _48.default, _49.default, _50.default, _51.default, _52.default, _53.default, _54.default, _55.default, _56.default, _57.default, _58.default, _59.default, _60.default, _61.default, _62.default, _63.default];
var _default = migrations;
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/index.js",}],
[53, {"../../../../shared/constants/time":3598,"../../../../shared/modules/fetch-with-timeout":3602,"./resolver":52,"@babel/runtime/helpers/interopRequireDefault":186,"base32-encode":1343,"base64-js":1346,"extensionizer":1869}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupEnsIpfsResolver;

var _base32Encode = _interopRequireDefault(require("base32-encode"));

var _base64Js = _interopRequireDefault(require("base64-js"));

var _extensionizer = _interopRequireDefault(require("extensionizer"));

var _time = require("../../../../shared/constants/time");

var _fetchWithTimeout = _interopRequireDefault(require("../../../../shared/modules/fetch-with-timeout"));

var _resolver = _interopRequireDefault(require("./resolver"));

const fetchWithTimeout = (0, _fetchWithTimeout.default)(_time.SECOND * 30);
const supportedTopLevelDomains = ['eth'];

function setupEnsIpfsResolver({
  provider,
  getCurrentChainId,
  getIpfsGateway
}) {
  // install listener
  const urlPatterns = supportedTopLevelDomains.map(tld => `*://*.${tld}/*`);

  _extensionizer.default.webRequest.onErrorOccurred.addListener(webRequestDidFail, {
    urls: urlPatterns,
    types: ['main_frame']
  }); // return api object


  return {
    // uninstall listener
    remove() {
      _extensionizer.default.webRequest.onErrorOccurred.removeListener(webRequestDidFail);
    }

  };

  async function webRequestDidFail(details) {
    const {
      tabId,
      url
    } = details; // ignore requests that are not associated with tabs
    // only attempt ENS resolution on mainnet

    if (tabId === -1 || getCurrentChainId() !== '0x1') {
      return;
    } // parse ens name


    const {
      hostname: name,
      pathname,
      search,
      hash: fragment
    } = new URL(url);
    const domainParts = name.split('.');
    const topLevelDomain = domainParts[domainParts.length - 1]; // if unsupported TLD, abort

    if (!supportedTopLevelDomains.includes(topLevelDomain)) {
      return;
    } // otherwise attempt resolve


    attemptResolve({
      tabId,
      name,
      pathname,
      search,
      fragment
    });
  }

  async function attemptResolve({
    tabId,
    name,
    pathname,
    search,
    fragment
  }) {
    const ipfsGateway = getIpfsGateway();

    _extensionizer.default.tabs.update(tabId, {
      url: `loading.html`
    });

    let url = `https://app.ens.domains/name/${name}`;

    try {
      const {
        type,
        hash
      } = await (0, _resolver.default)({
        provider,
        name
      });

      if (type === 'ipfs-ns' || type === 'ipns-ns') {
        const resolvedUrl = `https://${hash}.${type.slice(0, 4)}.${ipfsGateway}${pathname}${search || ''}${fragment || ''}`;

        try {
          // check if ipfs gateway has result
          const response = await fetchWithTimeout(resolvedUrl, {
            method: 'HEAD'
          });

          if (response.status === 200) {
            url = resolvedUrl;
          }
        } catch (err) {
          console.warn(err);
        }
      } else if (type === 'swarm-ns') {
        url = `https://swarm-gateways.net/bzz:/${hash}${pathname}${search || ''}${fragment || ''}`;
      } else if (type === 'onion' || type === 'onion3') {
        url = `http://${hash}.onion${pathname}${search || ''}${fragment || ''}`;
      } else if (type === 'zeronet') {
        url = `http://127.0.0.1:43110/${hash}${pathname}${search || ''}${fragment || ''}`;
      } else if (type === 'skynet-ns') {
        const padded = hash.padEnd(hash.length + 4 - hash.length % 4, '=');

        const decoded = _base64Js.default.toByteArray(padded);

        const options = {
          padding: false
        };
        const base32EncodedSkylink = (0, _base32Encode.default)(decoded, 'RFC4648-HEX', options).toLowerCase();
        url = `https://${base32EncodedSkylink}.siasky.net${pathname}${search || ''}${fragment || ''}`;
      }
    } catch (err) {
      console.warn(err);
    } finally {
      _extensionizer.default.tabs.update(tabId, {
        url
      });
    }
  }
}


//# sourceMappingURL=app/scripts/lib/ens-ipfs/setup.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/ens-ipfs/setup.js",}],
[79, {"../../shared/constants/app":3591,"../../shared/constants/hardware-wallets":3593,"../../shared/constants/network":3595,"../../shared/constants/swaps":3597,"../../shared/constants/time":3598,"../../shared/constants/transaction":3599,"../../shared/modules/hexstring-utils":3604,"../../shared/notifications":3610,"../../ui/helpers/utils/conversions.util":4009,"./account-import-strategies":3,"./controllers/alert":7,"./controllers/app-state":8,"./controllers/cached-balances":9,"./controllers/detect-tokens":10,"./controllers/ens":12,"./controllers/incoming-transactions":13,"./controllers/metametrics":14,"./controllers/network":18,"./controllers/onboarding":22,"./controllers/permissions":24,"./controllers/permissions/enums":23,"./controllers/permissions/restrictedMethods":27,"./controllers/preferences":28,"./controllers/swaps":29,"./controllers/threebox":30,"./controllers/transactions":31,"./lib/ComposableObservableStore":38,"./lib/account-tracker":39,"./lib/createLoggerMiddleware":42,"./lib/createMetaRPCHandler":43,"./lib/createOnboardingMiddleware":44,"./lib/createOriginMiddleware":45,"./lib/createTabIdMiddleware":47,"./lib/decrypt-message-manager":48,"./lib/encryption-public-key-manager":49,"./lib/message-manager":58,"./lib/nodeify":62,"./lib/personal-message-manager":64,"./lib/rpc-method-middleware":72,"./lib/seed-phrase-verifier":73,"./lib/segment":74,"./lib/stream-utils":76,"./lib/typed-message-manager":77,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@metamask/controllers":878,"@metamask/eth-ledger-bridge-keyring":935,"@metamask/obs-store":981,"@metamask/obs-store/dist/asStream":980,"await-semaphore":1175,"buffer":1428,"eth-json-rpc-filters":1679,"eth-json-rpc-filters/subscriptionManager":1682,"eth-json-rpc-middleware/providerAsMiddleware":1732,"eth-keyring-controller":1738,"eth-query":1744,"eth-trezor-keyring":1764,"ethereumjs-util":1810,"events":1429,"json-rpc-engine":2274,"json-rpc-middleware-stream/engineStream":2276,"lodash":2646,"loglevel":2657,"nanoid":2722,"pump":2991}, function (require, module, exports) {
(function (Buffer){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.METAMASK_CONTROLLER_EVENTS = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = _interopRequireDefault(require("events"));

var _pump = _interopRequireDefault(require("pump"));

var _obsStore = require("@metamask/obs-store");

var _asStream = require("@metamask/obs-store/dist/asStream");

var _jsonRpcEngine = require("json-rpc-engine");

var _lodash = require("lodash");

var _engineStream = _interopRequireDefault(require("json-rpc-middleware-stream/engineStream"));

var _ethJsonRpcFilters = _interopRequireDefault(require("eth-json-rpc-filters"));

var _subscriptionManager = _interopRequireDefault(require("eth-json-rpc-filters/subscriptionManager"));

var _providerAsMiddleware = _interopRequireDefault(require("eth-json-rpc-middleware/providerAsMiddleware"));

var _ethKeyringController = _interopRequireDefault(require("eth-keyring-controller"));

var _awaitSemaphore = require("await-semaphore");

var _ethereumjsUtil = require("ethereumjs-util");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _ethTrezorKeyring = _interopRequireDefault(require("eth-trezor-keyring"));

var _ethLedgerBridgeKeyring = _interopRequireDefault(require("@metamask/eth-ledger-bridge-keyring"));

var _ethQuery = _interopRequireDefault(require("eth-query"));

var _nanoid = _interopRequireDefault(require("nanoid"));

var _controllers = require("@metamask/controllers");

var _transaction = require("../../shared/constants/transaction");

var _swaps = require("../../shared/constants/swaps");

var _network = require("../../shared/constants/network");

var _hardwareWallets = require("../../shared/constants/hardware-wallets");

var _notifications = require("../../shared/notifications");

var _hexstringUtils = require("../../shared/modules/hexstring-utils");

var _time = require("../../shared/constants/time");

var _app = require("../../shared/constants/app");

var _conversions = require("../../ui/helpers/utils/conversions.util");

var _ComposableObservableStore = _interopRequireDefault(require("./lib/ComposableObservableStore"));

var _accountTracker = _interopRequireDefault(require("./lib/account-tracker"));

var _createLoggerMiddleware = _interopRequireDefault(require("./lib/createLoggerMiddleware"));

var _rpcMethodMiddleware = _interopRequireDefault(require("./lib/rpc-method-middleware"));

var _createOriginMiddleware = _interopRequireDefault(require("./lib/createOriginMiddleware"));

var _createTabIdMiddleware = _interopRequireDefault(require("./lib/createTabIdMiddleware"));

var _createOnboardingMiddleware = _interopRequireDefault(require("./lib/createOnboardingMiddleware"));

var _streamUtils = require("./lib/stream-utils");

var _ens = _interopRequireDefault(require("./controllers/ens"));

var _network2 = _interopRequireWildcard(require("./controllers/network"));

var _preferences = _interopRequireDefault(require("./controllers/preferences"));

var _appState = _interopRequireDefault(require("./controllers/app-state"));

var _cachedBalances = _interopRequireDefault(require("./controllers/cached-balances"));

var _alert = _interopRequireDefault(require("./controllers/alert"));

var _onboarding = _interopRequireDefault(require("./controllers/onboarding"));

var _threebox = _interopRequireDefault(require("./controllers/threebox"));

var _incomingTransactions = _interopRequireDefault(require("./controllers/incoming-transactions"));

var _messageManager = _interopRequireDefault(require("./lib/message-manager"));

var _decryptMessageManager = _interopRequireDefault(require("./lib/decrypt-message-manager"));

var _encryptionPublicKeyManager = _interopRequireDefault(require("./lib/encryption-public-key-manager"));

var _personalMessageManager = _interopRequireDefault(require("./lib/personal-message-manager"));

var _typedMessageManager = _interopRequireDefault(require("./lib/typed-message-manager"));

var _transactions = _interopRequireDefault(require("./controllers/transactions"));

var _detectTokens = _interopRequireDefault(require("./controllers/detect-tokens"));

var _swaps2 = _interopRequireDefault(require("./controllers/swaps"));

var _permissions = require("./controllers/permissions");

var _enums = require("./controllers/permissions/enums");

var _restrictedMethods = _interopRequireDefault(require("./controllers/permissions/restrictedMethods"));

var _nodeify = _interopRequireDefault(require("./lib/nodeify"));

var _accountImportStrategies = _interopRequireDefault(require("./account-import-strategies"));

var _seedPhraseVerifier = _interopRequireDefault(require("./lib/seed-phrase-verifier"));

var _metametrics = _interopRequireDefault(require("./controllers/metametrics"));

var _segment = require("./lib/segment");

var _createMetaRPCHandler = _interopRequireDefault(require("./lib/createMetaRPCHandler"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const METAMASK_CONTROLLER_EVENTS = {
  // Fired after state changes that impact the extension badge (unapproved msg count)
  // The process of updating the badge happens in app/scripts/background.js.
  UPDATE_BADGE: 'updateBadge',
  // TODO: Add this and similar enums to @metamask/controllers and export them
  APPROVAL_STATE_CHANGE: 'ApprovalController:stateChange'
};
exports.METAMASK_CONTROLLER_EVENTS = METAMASK_CONTROLLER_EVENTS;

class MetamaskController extends _events.default {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts) {
    var _process$env$CONF;

    super();
    this.defaultMaxListeners = 20;
    this.sendUpdate = (0, _lodash.debounce)(this.privateSendUpdate.bind(this), _time.MILLISECOND * 200);
    this.opts = opts;
    this.extension = opts.extension;
    this.platform = opts.platform;
    const initState = opts.initState || {};
    const version = this.platform.getVersion();
    this.recordFirstTimeInfo(initState); // this keeps track of how many "controllerStream" connections are open
    // the only thing that uses controller connections are open metamask UI instances

    this.activeControllerConnections = 0;
    this.getRequestAccountTabIds = opts.getRequestAccountTabIds;
    this.getOpenMetamaskTabsIds = opts.getOpenMetamaskTabsIds;
    this.controllerMessenger = new _controllers.ControllerMessenger(); // observable state store

    this.store = new _ComposableObservableStore.default({
      state: initState,
      controllerMessenger: this.controllerMessenger,
      persist: true
    }); // external connections by origin
    // Do not modify directly. Use the associated methods.

    this.connections = {}; // lock to ensure only one vault created at once

    this.createVaultMutex = new _awaitSemaphore.Mutex();
    this.extension.runtime.onInstalled.addListener(details => {
      if (details.reason === 'update' && version === '8.1.0') {
        this.platform.openExtensionInBrowser();
      }
    }); // next, we will initialize the controllers
    // controller initialization order matters

    this.approvalController = new _controllers.ApprovalController({
      messenger: this.controllerMessenger.getRestricted({
        name: 'ApprovalController'
      }),
      showApprovalRequest: opts.showUserConfirmation
    });
    this.networkController = new _network2.default(initState.NetworkController);
    this.networkController.setInfuraProjectId(opts.infuraProjectId); // now we can initialize the RPC provider, which other controllers require

    this.initializeProvider();
    this.provider = this.networkController.getProviderAndBlockTracker().provider;
    this.blockTracker = this.networkController.getProviderAndBlockTracker().blockTracker;
    this.preferencesController = new _preferences.default({
      initState: initState.PreferencesController,
      initLangCode: opts.initLangCode,
      openPopup: opts.openPopup,
      network: this.networkController,
      provider: this.provider,
      migrateAddressBookState: this.migrateAddressBookState.bind(this)
    });
    this.tokensController = new _controllers.TokensController({
      onPreferencesStateChange: this.preferencesController.store.subscribe.bind(this.preferencesController.store),
      onNetworkStateChange: this.networkController.store.subscribe.bind(this.networkController.store),
      config: {
        provider: this.provider
      },
      state: initState.TokensController
    });
    this.metaMetricsController = new _metametrics.default({
      segment: _segment.segment,
      preferencesStore: this.preferencesController.store,
      onNetworkDidChange: this.networkController.on.bind(this.networkController, _network2.NETWORK_EVENTS.NETWORK_DID_CHANGE),
      getNetworkIdentifier: this.networkController.getNetworkIdentifier.bind(this.networkController),
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      version: this.platform.getVersion(),
      environment: "other",
      initState: initState.MetaMetricsController
    });
    const gasFeeMessenger = this.controllerMessenger.getRestricted({
      name: 'GasFeeController'
    });
    const gasApiBaseUrl = false ? _swaps.GAS_DEV_API_BASE_URL : _swaps.GAS_API_BASE_URL;
    this.gasFeeController = new _controllers.GasFeeController({
      interval: 10000,
      messenger: gasFeeMessenger,
      getProvider: () => this.networkController.getProviderAndBlockTracker().provider,
      onNetworkStateChange: this.networkController.on.bind(this.networkController, _network2.NETWORK_EVENTS.NETWORK_DID_CHANGE),
      getCurrentNetworkEIP1559Compatibility: this.networkController.getEIP1559Compatibility.bind(this.networkController),
      getCurrentAccountEIP1559Compatibility: this.getCurrentAccountEIP1559Compatibility.bind(this),
      legacyAPIEndpoint: `${gasApiBaseUrl}/networks/<chain_id>/gasPrices`,
      EIP1559APIEndpoint: `${gasApiBaseUrl}/networks/<chain_id>/suggestedGasFees`,
      getCurrentNetworkLegacyGasAPICompatibility: () => {
        const chainId = this.networkController.getCurrentChainId();
        return false || chainId === _network.MAINNET_CHAIN_ID;
      },
      getChainId: () => {
        return false ? _network.MAINNET_CHAIN_ID : this.networkController.getCurrentChainId();
      }
    });
    this.appStateController = new _appState.default({
      addUnlockListener: this.on.bind(this, 'unlock'),
      isUnlocked: this.isUnlocked.bind(this),
      initState: initState.AppStateController,
      onInactiveTimeout: () => this.setLocked(),
      showUnlockRequest: opts.showUserConfirmation,
      preferencesStore: this.preferencesController.store
    });
    const currencyRateMessenger = this.controllerMessenger.getRestricted({
      name: 'CurrencyRateController'
    });
    this.currencyRateController = new _controllers.CurrencyRateController({
      includeUSDRate: true,
      messenger: currencyRateMessenger,
      state: initState.CurrencyController
    });
    const tokenListMessenger = this.controllerMessenger.getRestricted({
      name: 'TokenListController'
    });
    this.tokenListController = new _controllers.TokenListController({
      chainId: (0, _conversions.hexToDecimal)(this.networkController.getCurrentChainId()),
      useStaticTokenList: !this.preferencesController.store.getState().useTokenDetection,
      onNetworkStateChange: cb => this.networkController.store.subscribe(networkState => {
        const modifiedNetworkState = _objectSpread(_objectSpread({}, networkState), {}, {
          provider: _objectSpread(_objectSpread({}, networkState.provider), {}, {
            chainId: (0, _conversions.hexToDecimal)(networkState.provider.chainId)
          })
        });

        return cb(modifiedNetworkState);
      }),
      onPreferencesStateChange: cb => this.preferencesController.store.subscribe(preferencesState => {
        const modifiedPreferencesState = _objectSpread(_objectSpread({}, preferencesState), {}, {
          useStaticTokenList: !this.preferencesController.store.getState().useTokenDetection
        });

        return cb(modifiedPreferencesState);
      }),
      messenger: tokenListMessenger,
      state: initState.TokenListController
    });
    this.phishingController = new _controllers.PhishingController();
    this.notificationController = new _controllers.NotificationController({
      allNotifications: _notifications.UI_NOTIFICATIONS
    }, initState.NotificationController); // token exchange rate tracker

    this.tokenRatesController = new _controllers.TokenRatesController({
      onTokensStateChange: listener => this.tokensController.subscribe(listener),
      onCurrencyRateStateChange: listener => this.controllerMessenger.subscribe(`${this.currencyRateController.name}:stateChange`, listener),
      onNetworkStateChange: cb => this.networkController.store.subscribe(networkState => {
        const modifiedNetworkState = _objectSpread(_objectSpread({}, networkState), {}, {
          provider: _objectSpread(_objectSpread({}, networkState.provider), {}, {
            chainId: (0, _conversions.hexToDecimal)(networkState.provider.chainId)
          })
        });

        return cb(modifiedNetworkState);
      })
    });
    this.ensController = new _ens.default({
      provider: this.provider,
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      onNetworkDidChange: this.networkController.on.bind(this.networkController, _network2.NETWORK_EVENTS.NETWORK_DID_CHANGE)
    });
    this.incomingTransactionsController = new _incomingTransactions.default({
      blockTracker: this.blockTracker,
      onNetworkDidChange: this.networkController.on.bind(this.networkController, _network2.NETWORK_EVENTS.NETWORK_DID_CHANGE),
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      preferencesController: this.preferencesController,
      initState: initState.IncomingTransactionsController
    }); // account tracker watches balances, nonces, and any code at their address

    this.accountTracker = new _accountTracker.default({
      provider: this.provider,
      blockTracker: this.blockTracker,
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController)
    }); // start and stop polling for balances based on activeControllerConnections

    this.on('controllerConnectionChanged', activeControllerConnections => {
      if (activeControllerConnections > 0) {
        this.accountTracker.start();
        this.incomingTransactionsController.start(); // this.currencyRateController.start();

        this.tokenListController.start();
      } else {
        this.accountTracker.stop();
        this.incomingTransactionsController.stop(); // this.currencyRateController.stop();

        this.tokenListController.stop();
      }
    });
    this.cachedBalancesController = new _cachedBalances.default({
      accountTracker: this.accountTracker,
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      initState: initState.CachedBalancesController
    });
    this.onboardingController = new _onboarding.default({
      initState: initState.OnboardingController,
      preferencesController: this.preferencesController
    });
    this.tokensController.hub.on('pendingSuggestedAsset', async () => {
      await opts.openPopup();
    });
    const additionalKeyrings = [_ethTrezorKeyring.default, _ethLedgerBridgeKeyring.default];
    this.keyringController = new _ethKeyringController.default({
      keyringTypes: additionalKeyrings,
      initState: initState.KeyringController,
      encryptor: opts.encryptor || undefined
    });
    this.keyringController.memStore.subscribe(state => this._onKeyringControllerUpdate(state));
    this.keyringController.on('unlock', () => this.emit('unlock'));
    this.keyringController.on('lock', () => this._onLock());
    this.permissionsController = new _permissions.PermissionsController({
      approvals: this.approvalController,
      getKeyringAccounts: this.keyringController.getAccounts.bind(this.keyringController),
      getRestrictedMethods: _restrictedMethods.default,
      getUnlockPromise: this.appStateController.getUnlockPromise.bind(this.appStateController),
      isUnlocked: this.isUnlocked.bind(this),
      notifyDomain: this.notifyConnections.bind(this),
      notifyAllDomains: this.notifyAllConnections.bind(this),
      preferences: this.preferencesController.store
    }, initState.PermissionsController, initState.PermissionsMetadata);
    this.detectTokensController = new _detectTokens.default({
      preferences: this.preferencesController,
      tokensController: this.tokensController,
      network: this.networkController,
      keyringMemStore: this.keyringController.memStore,
      tokenList: this.tokenListController
    });
    this.addressBookController = new _controllers.AddressBookController(undefined, initState.AddressBookController);
    this.alertController = new _alert.default({
      initState: initState.AlertController,
      preferencesStore: this.preferencesController.store
    });
    this.threeBoxController = new _threebox.default({
      preferencesController: this.preferencesController,
      addressBookController: this.addressBookController,
      keyringController: this.keyringController,
      initState: initState.ThreeBoxController,
      getKeyringControllerState: this.keyringController.memStore.getState.bind(this.keyringController.memStore),
      version,
      trackMetaMetricsEvent: this.metaMetricsController.trackEvent.bind(this.metaMetricsController)
    });
    this.txController = new _transactions.default({
      initState: initState.TransactionController || initState.TransactionManager,
      getPermittedAccounts: this.permissionsController.getAccounts.bind(this.permissionsController),
      getProviderConfig: this.networkController.getProviderConfig.bind(this.networkController),
      getCurrentNetworkEIP1559Compatibility: this.networkController.getEIP1559Compatibility.bind(this.networkController),
      getCurrentAccountEIP1559Compatibility: this.getCurrentAccountEIP1559Compatibility.bind(this),
      networkStore: this.networkController.networkStore,
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      preferencesStore: this.preferencesController.store,
      txHistoryLimit: 40,
      signTransaction: this.keyringController.signTransaction.bind(this.keyringController),
      provider: this.provider,
      blockTracker: this.blockTracker,
      trackMetaMetricsEvent: this.metaMetricsController.trackEvent.bind(this.metaMetricsController),
      getParticipateInMetrics: () => this.metaMetricsController.state.participateInMetaMetrics,
      getEIP1559GasFeeEstimates: this.gasFeeController.fetchGasFeeEstimates.bind(this.gasFeeController)
    });
    this.txController.on('newUnapprovedTx', () => opts.showUserConfirmation());
    this.txController.on(`tx:status-update`, async (txId, status) => {
      if (status === _transaction.TRANSACTION_STATUSES.CONFIRMED || status === _transaction.TRANSACTION_STATUSES.FAILED) {
        const txMeta = this.txController.txStateManager.getTransaction(txId);
        const frequentRpcListDetail = this.preferencesController.getFrequentRpcListDetail();
        let rpcPrefs = {};

        if (txMeta.chainId) {
          var _rpcSettings$rpcPrefs;

          const rpcSettings = frequentRpcListDetail.find(rpc => txMeta.chainId === rpc.chainId);
          rpcPrefs = (_rpcSettings$rpcPrefs = rpcSettings === null || rpcSettings === void 0 ? void 0 : rpcSettings.rpcPrefs) !== null && _rpcSettings$rpcPrefs !== void 0 ? _rpcSettings$rpcPrefs : {};
        }

        this.platform.showTransactionNotification(txMeta, rpcPrefs);
        const {
          txReceipt
        } = txMeta;
        const metamaskState = await this.getState();

        if (txReceipt && txReceipt.status === '0x0') {
          var _txMeta$simulationFai;

          this.metaMetricsController.trackEvent({
            event: 'Tx Status Update: On-Chain Failure',
            category: 'Background',
            properties: {
              action: 'Transactions',
              errorMessage: (_txMeta$simulationFai = txMeta.simulationFails) === null || _txMeta$simulationFai === void 0 ? void 0 : _txMeta$simulationFai.reason,
              numberOfTokens: metamaskState.tokens.length,
              numberOfAccounts: Object.keys(metamaskState.accounts).length
            }
          }, {
            matomoEvent: true
          });
        }
      }
    }); // this.networkController.on(NETWORK_EVENTS.NETWORK_DID_CHANGE, async () => {
    //   const { ticker } = this.networkController.getProviderConfig();
    //   try {
    //     await this.currencyRateController.setNativeCurrency(ticker);
    //   } catch (error) {
    //     // TODO: Handle failure to get conversion rate more gracefully
    //     console.error(error);
    //   }
    // });

    this.networkController.lookupNetwork();
    this.messageManager = new _messageManager.default();
    this.personalMessageManager = new _personalMessageManager.default();
    this.decryptMessageManager = new _decryptMessageManager.default();
    this.encryptionPublicKeyManager = new _encryptionPublicKeyManager.default();
    this.typedMessageManager = new _typedMessageManager.default({
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController)
    });
    this.swapsController = new _swaps2.default({
      getBufferedGasLimit: this.txController.txGasUtil.getBufferedGasLimit.bind(this.txController.txGasUtil),
      networkController: this.networkController,
      provider: this.provider,
      getProviderConfig: this.networkController.getProviderConfig.bind(this.networkController),
      tokenRatesStore: this.tokenRatesController.state,
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      getEIP1559GasFeeEstimates: this.gasFeeController.fetchGasFeeEstimates.bind(this.gasFeeController)
    }); // ensure accountTracker updates balances after network change

    this.networkController.on(_network2.NETWORK_EVENTS.NETWORK_DID_CHANGE, () => {
      this.accountTracker._updateAccounts();
    }); // clear unapproved transactions and messages when the network will change

    this.networkController.on(_network2.NETWORK_EVENTS.NETWORK_WILL_CHANGE, () => {
      this.txController.txStateManager.clearUnapprovedTxs();
      this.encryptionPublicKeyManager.clearUnapproved();
      this.personalMessageManager.clearUnapproved();
      this.typedMessageManager.clearUnapproved();
      this.decryptMessageManager.clearUnapproved();
      this.messageManager.clearUnapproved();
    }); // ensure isClientOpenAndUnlocked is updated when memState updates

    this.on('update', memState => this._onStateUpdate(memState));
    this.store.updateStructure({
      AppStateController: this.appStateController.store,
      TransactionController: this.txController.store,
      KeyringController: this.keyringController.store,
      PreferencesController: this.preferencesController.store,
      MetaMetricsController: this.metaMetricsController.store,
      AddressBookController: this.addressBookController,
      CurrencyController: this.currencyRateController,
      NetworkController: this.networkController.store,
      CachedBalancesController: this.cachedBalancesController.store,
      AlertController: this.alertController.store,
      OnboardingController: this.onboardingController.store,
      IncomingTransactionsController: this.incomingTransactionsController.store,
      PermissionsController: this.permissionsController.permissions,
      PermissionsMetadata: this.permissionsController.store,
      ThreeBoxController: this.threeBoxController.store,
      NotificationController: this.notificationController,
      GasFeeController: this.gasFeeController,
      TokenListController: this.tokenListController,
      TokensController: this.tokensController
    });
    this.memStore = new _ComposableObservableStore.default({
      config: {
        AppStateController: this.appStateController.store,
        NetworkController: this.networkController.store,
        AccountTracker: this.accountTracker.store,
        TxController: this.txController.memStore,
        CachedBalancesController: this.cachedBalancesController.store,
        TokenRatesController: this.tokenRatesController,
        MessageManager: this.messageManager.memStore,
        PersonalMessageManager: this.personalMessageManager.memStore,
        DecryptMessageManager: this.decryptMessageManager.memStore,
        EncryptionPublicKeyManager: this.encryptionPublicKeyManager.memStore,
        TypesMessageManager: this.typedMessageManager.memStore,
        KeyringController: this.keyringController.memStore,
        PreferencesController: this.preferencesController.store,
        MetaMetricsController: this.metaMetricsController.store,
        AddressBookController: this.addressBookController,
        CurrencyController: this.currencyRateController,
        AlertController: this.alertController.store,
        OnboardingController: this.onboardingController.store,
        IncomingTransactionsController: this.incomingTransactionsController.store,
        PermissionsController: this.permissionsController.permissions,
        PermissionsMetadata: this.permissionsController.store,
        ThreeBoxController: this.threeBoxController.store,
        SwapsController: this.swapsController.store,
        EnsController: this.ensController.store,
        ApprovalController: this.approvalController,
        NotificationController: this.notificationController,
        GasFeeController: this.gasFeeController,
        TokenListController: this.tokenListController,
        TokensController: this.tokensController
      },
      controllerMessenger: this.controllerMessenger
    });
    this.memStore.subscribe(this.sendUpdate.bind(this));
    const password = (_process$env$CONF = {}) === null || _process$env$CONF === void 0 ? void 0 : _process$env$CONF.PASSWORD;

    if (password && !this.isUnlocked() && this.onboardingController.completedOnboarding) {
      this.submitPassword(password);
    } // Lazily update the store with the current extension environment


    this.extension.runtime.getPlatformInfo(({
      os
    }) => {
      this.appStateController.setBrowserEnvironment(os, // This method is presently only supported by Firefox
      this.extension.runtime.getBrowserInfo === undefined ? 'chrome' : 'firefox');
    }); // TODO:LegacyProvider: Delete

    this.publicConfigStore = this.createPublicConfigStore();
  }
  /**
   * Constructor helper: initialize a provider.
   */


  initializeProvider() {
    const version = this.platform.getVersion();
    const providerOpts = {
      static: {
        eth_syncing: false,
        web3_clientVersion: `MonstaWallet/v${version}`
      },
      version,
      // account mgmt
      getAccounts: async ({
        origin
      }) => {
        if (origin === 'metamask') {
          const selectedAddress = this.preferencesController.getSelectedAddress();
          return selectedAddress ? [selectedAddress] : [];
        } else if (this.isUnlocked()) {
          return await this.permissionsController.getAccounts(origin);
        }

        return []; // changing this is a breaking change
      },
      // tx signing
      processTransaction: this.newUnapprovedTransaction.bind(this),
      // msg signing
      processEthSignMessage: this.newUnsignedMessage.bind(this),
      processTypedMessage: this.newUnsignedTypedMessage.bind(this),
      processTypedMessageV3: this.newUnsignedTypedMessage.bind(this),
      processTypedMessageV4: this.newUnsignedTypedMessage.bind(this),
      processPersonalMessage: this.newUnsignedPersonalMessage.bind(this),
      processDecryptMessage: this.newRequestDecryptMessage.bind(this),
      processEncryptionPublicKey: this.newRequestEncryptionPublicKey.bind(this),
      getPendingNonce: this.getPendingNonce.bind(this),
      getPendingTransactionByHash: hash => this.txController.getTransactions({
        searchCriteria: {
          hash,
          status: _transaction.TRANSACTION_STATUSES.SUBMITTED
        }
      })[0]
    };
    const providerProxy = this.networkController.initializeProvider(providerOpts);
    return providerProxy;
  }
  /**
   * TODO:LegacyProvider: Delete
   * Constructor helper: initialize a public config store.
   * This store is used to make some config info available to Dapps synchronously.
   */


  createPublicConfigStore() {
    // subset of state for metamask inpage provider
    const publicConfigStore = new _obsStore.ObservableStore();
    const {
      networkController
    } = this; // setup memStore subscription hooks

    this.on('update', updatePublicConfigStore);
    updatePublicConfigStore(this.getState());

    function updatePublicConfigStore(memState) {
      const chainId = networkController.getCurrentChainId();

      if (memState.network !== 'loading') {
        publicConfigStore.putState(selectPublicState(chainId, memState));
      }
    }

    function selectPublicState(chainId, {
      isUnlocked,
      network
    }) {
      return {
        isUnlocked,
        chainId,
        networkVersion: network
      };
    }

    return publicConfigStore;
  }
  /**
   * Gets relevant state for the provider of an external origin.
   *
   * @param {string} origin - The origin to get the provider state for.
   * @returns {Promise<{
   *  isUnlocked: boolean,
   *  networkVersion: string,
   *  chainId: string,
   *  accounts: string[],
   * }>} An object with relevant state properties.
   */


  async getProviderState(origin) {
    return _objectSpread(_objectSpread({
      isUnlocked: this.isUnlocked()
    }, this.getProviderNetworkState()), {}, {
      accounts: await this.permissionsController.getAccounts(origin)
    });
  }
  /**
   * Gets network state relevant for external providers.
   *
   * @param {Object} [memState] - The MetaMask memState. If not provided,
   * this function will retrieve the most recent state.
   * @returns {Object} An object with relevant network state properties.
   */


  getProviderNetworkState(memState) {
    const {
      network
    } = memState || this.getState();
    return {
      chainId: this.networkController.getCurrentChainId(),
      networkVersion: network
    };
  } //=============================================================================
  // EXPOSED TO THE UI SUBSYSTEM
  //=============================================================================

  /**
   * The metamask-state of the various controllers, made available to the UI
   *
   * @returns {Object} status
   */


  getState() {
    const {
      vault
    } = this.keyringController.store.getState();
    const isInitialized = Boolean(vault);
    return _objectSpread({
      isInitialized
    }, this.memStore.getFlatState());
  }
  /**
   * Returns an Object containing API Callback Functions.
   * These functions are the interface for the UI.
   * The API object can be transmitted over a stream via JSON-RPC.
   *
   * @returns {Object} Object containing API functions.
   */


  getApi() {
    const {
      alertController,
      approvalController,
      keyringController,
      metaMetricsController,
      networkController,
      onboardingController,
      permissionsController,
      preferencesController,
      swapsController,
      threeBoxController,
      txController,
      tokensController
    } = this;
    return {
      // etc
      getState: cb => cb(null, this.getState()),
      setCurrentCurrency: () => {},
      // setCurrentCurrency: nodeify(
      //   this.currencyRateController.setCurrentCurrency.bind(
      //     this.currencyRateController,
      //   ),
      // ),
      setUseBlockie: this.setUseBlockie.bind(this),
      setUseNonceField: this.setUseNonceField.bind(this),
      setUsePhishDetect: this.setUsePhishDetect.bind(this),
      setUseTokenDetection: (0, _nodeify.default)(this.preferencesController.setUseTokenDetection, this.preferencesController),
      setIpfsGateway: this.setIpfsGateway.bind(this),
      setParticipateInMetaMetrics: this.setParticipateInMetaMetrics.bind(this),
      setFirstTimeFlowType: this.setFirstTimeFlowType.bind(this),
      setCurrentLocale: this.setCurrentLocale.bind(this),
      markPasswordForgotten: this.markPasswordForgotten.bind(this),
      unMarkPasswordForgotten: this.unMarkPasswordForgotten.bind(this),
      safelistPhishingDomain: this.safelistPhishingDomain.bind(this),
      getRequestAccountTabIds: cb => cb(null, this.getRequestAccountTabIds()),
      getOpenMetamaskTabsIds: cb => cb(null, this.getOpenMetamaskTabsIds()),
      // primary HD keyring management  
      addNewAccount: (0, _nodeify.default)(this.addNewAccount, this),
      verifySeedPhrase: (0, _nodeify.default)(this.verifySeedPhrase, this),
      resetAccount: (0, _nodeify.default)(this.resetAccount, this),
      removeAccount: (0, _nodeify.default)(this.removeAccount, this),
      importAccountWithStrategy: (0, _nodeify.default)(this.importAccountWithStrategy, this),
      // hardware wallets
      connectHardware: (0, _nodeify.default)(this.connectHardware, this),
      forgetDevice: (0, _nodeify.default)(this.forgetDevice, this),
      checkHardwareStatus: (0, _nodeify.default)(this.checkHardwareStatus, this),
      unlockHardwareWalletAccount: (0, _nodeify.default)(this.unlockHardwareWalletAccount, this),
      setLedgerLivePreference: (0, _nodeify.default)(this.setLedgerLivePreference, this),
      // mobile
      fetchInfoToSync: (0, _nodeify.default)(this.fetchInfoToSync, this),
      // vault management
      submitPassword: (0, _nodeify.default)(this.submitPassword, this),
      verifyPassword: (0, _nodeify.default)(this.verifyPassword, this),
      // network management
      setProviderType: (0, _nodeify.default)(networkController.setProviderType, networkController),
      rollbackToPreviousProvider: (0, _nodeify.default)(networkController.rollbackToPreviousProvider, networkController),
      setCustomRpc: (0, _nodeify.default)(this.setCustomRpc, this),
      updateAndSetCustomRpc: (0, _nodeify.default)(this.updateAndSetCustomRpc, this),
      delCustomRpc: (0, _nodeify.default)(this.delCustomRpc, this),
      // PreferencesController
      setSelectedAddress: (0, _nodeify.default)(preferencesController.setSelectedAddress, preferencesController),
      addToken: (0, _nodeify.default)(tokensController.addToken, tokensController),
      rejectWatchAsset: (0, _nodeify.default)(tokensController.rejectWatchAsset, tokensController),
      acceptWatchAsset: (0, _nodeify.default)(tokensController.acceptWatchAsset, tokensController),
      updateTokenType: (0, _nodeify.default)(tokensController.updateTokenType, tokensController),
      removeToken: (0, _nodeify.default)(tokensController.removeAndIgnoreToken, tokensController),
      setAccountLabel: (0, _nodeify.default)(preferencesController.setAccountLabel, preferencesController),
      setFeatureFlag: (0, _nodeify.default)(preferencesController.setFeatureFlag, preferencesController),
      setPreference: (0, _nodeify.default)(preferencesController.setPreference, preferencesController),
      completeOnboarding: (0, _nodeify.default)(preferencesController.completeOnboarding, preferencesController),
      addKnownMethodData: (0, _nodeify.default)(preferencesController.addKnownMethodData, preferencesController),
      setDismissSeedBackUpReminder: (0, _nodeify.default)(this.preferencesController.setDismissSeedBackUpReminder, this.preferencesController),
      // AddressController
      setAddressBook: (0, _nodeify.default)(this.addressBookController.set, this.addressBookController),
      removeFromAddressBook: (0, _nodeify.default)(this.addressBookController.delete, this.addressBookController),
      // AppStateController
      setLastActiveTime: (0, _nodeify.default)(this.appStateController.setLastActiveTime, this.appStateController),
      setDefaultHomeActiveTabName: (0, _nodeify.default)(this.appStateController.setDefaultHomeActiveTabName, this.appStateController),
      setConnectedStatusPopoverHasBeenShown: (0, _nodeify.default)(this.appStateController.setConnectedStatusPopoverHasBeenShown, this.appStateController),
      setRecoveryPhraseReminderHasBeenShown: (0, _nodeify.default)(this.appStateController.setRecoveryPhraseReminderHasBeenShown, this.appStateController),
      setRecoveryPhraseReminderLastShown: (0, _nodeify.default)(this.appStateController.setRecoveryPhraseReminderLastShown, this.appStateController),
      // EnsController
      tryReverseResolveAddress: (0, _nodeify.default)(this.ensController.reverseResolveAddress, this.ensController),
      // KeyringController
      setLocked: (0, _nodeify.default)(this.setLocked, this),
      createNewVaultAndKeychain: (0, _nodeify.default)(this.createNewVaultAndKeychain, this),
      createNewVaultAndRestore: (0, _nodeify.default)(this.createNewVaultAndRestore, this),
      exportAccount: (0, _nodeify.default)(keyringController.exportAccount, keyringController),
      // txController
      cancelTransaction: (0, _nodeify.default)(txController.cancelTransaction, txController),
      updateTransaction: (0, _nodeify.default)(txController.updateTransaction, txController),
      updateAndApproveTransaction: (0, _nodeify.default)(txController.updateAndApproveTransaction, txController),
      createCancelTransaction: (0, _nodeify.default)(this.createCancelTransaction, this),
      createSpeedUpTransaction: (0, _nodeify.default)(this.createSpeedUpTransaction, this),
      isNonceTaken: (0, _nodeify.default)(txController.isNonceTaken, txController),
      estimateGas: (0, _nodeify.default)(this.estimateGas, this),
      getPendingNonce: (0, _nodeify.default)(this.getPendingNonce, this),
      getNextNonce: (0, _nodeify.default)(this.getNextNonce, this),
      addUnapprovedTransaction: (0, _nodeify.default)(txController.addUnapprovedTransaction, txController),
      // messageManager
      signMessage: (0, _nodeify.default)(this.signMessage, this),
      cancelMessage: this.cancelMessage.bind(this),
      // personalMessageManager
      signPersonalMessage: (0, _nodeify.default)(this.signPersonalMessage, this),
      cancelPersonalMessage: this.cancelPersonalMessage.bind(this),
      // typedMessageManager
      signTypedMessage: (0, _nodeify.default)(this.signTypedMessage, this),
      cancelTypedMessage: this.cancelTypedMessage.bind(this),
      // decryptMessageManager
      decryptMessage: (0, _nodeify.default)(this.decryptMessage, this),
      decryptMessageInline: (0, _nodeify.default)(this.decryptMessageInline, this),
      cancelDecryptMessage: this.cancelDecryptMessage.bind(this),
      // EncryptionPublicKeyManager
      encryptionPublicKey: (0, _nodeify.default)(this.encryptionPublicKey, this),
      cancelEncryptionPublicKey: this.cancelEncryptionPublicKey.bind(this),
      // onboarding controller
      setSeedPhraseBackedUp: (0, _nodeify.default)(onboardingController.setSeedPhraseBackedUp, onboardingController),
      // alert controller
      setAlertEnabledness: (0, _nodeify.default)(alertController.setAlertEnabledness, alertController),
      setUnconnectedAccountAlertShown: (0, _nodeify.default)(alertController.setUnconnectedAccountAlertShown, alertController),
      setWeb3ShimUsageAlertDismissed: (0, _nodeify.default)(alertController.setWeb3ShimUsageAlertDismissed, alertController),
      // 3Box
      setThreeBoxSyncingPermission: (0, _nodeify.default)(threeBoxController.setThreeBoxSyncingPermission, threeBoxController),
      restoreFromThreeBox: (0, _nodeify.default)(threeBoxController.restoreFromThreeBox, threeBoxController),
      setShowRestorePromptToFalse: (0, _nodeify.default)(threeBoxController.setShowRestorePromptToFalse, threeBoxController),
      getThreeBoxLastUpdated: (0, _nodeify.default)(threeBoxController.getLastUpdated, threeBoxController),
      turnThreeBoxSyncingOn: (0, _nodeify.default)(threeBoxController.turnThreeBoxSyncingOn, threeBoxController),
      initializeThreeBox: (0, _nodeify.default)(this.initializeThreeBox, this),
      // permissions
      approvePermissionsRequest: (0, _nodeify.default)(permissionsController.approvePermissionsRequest, permissionsController),
      clearPermissions: permissionsController.clearPermissions.bind(permissionsController),
      getApprovedAccounts: (0, _nodeify.default)(permissionsController.getAccounts, permissionsController),
      rejectPermissionsRequest: (0, _nodeify.default)(permissionsController.rejectPermissionsRequest, permissionsController),
      removePermissionsFor: permissionsController.removePermissionsFor.bind(permissionsController),
      addPermittedAccount: (0, _nodeify.default)(permissionsController.addPermittedAccount, permissionsController),
      removePermittedAccount: (0, _nodeify.default)(permissionsController.removePermittedAccount, permissionsController),
      requestAccountsPermissionWithId: (0, _nodeify.default)(permissionsController.requestAccountsPermissionWithId, permissionsController),
      // swaps
      fetchAndSetQuotes: (0, _nodeify.default)(swapsController.fetchAndSetQuotes, swapsController),
      setSelectedQuoteAggId: (0, _nodeify.default)(swapsController.setSelectedQuoteAggId, swapsController),
      resetSwapsState: (0, _nodeify.default)(swapsController.resetSwapsState, swapsController),
      setSwapsTokens: (0, _nodeify.default)(swapsController.setSwapsTokens, swapsController),
      clearSwapsQuotes: (0, _nodeify.default)(swapsController.clearSwapsQuotes, swapsController),
      setApproveTxId: (0, _nodeify.default)(swapsController.setApproveTxId, swapsController),
      setTradeTxId: (0, _nodeify.default)(swapsController.setTradeTxId, swapsController),
      setSwapsTxGasPrice: (0, _nodeify.default)(swapsController.setSwapsTxGasPrice, swapsController),
      setSwapsTxGasLimit: (0, _nodeify.default)(swapsController.setSwapsTxGasLimit, swapsController),
      setSwapsTxMaxFeePerGas: (0, _nodeify.default)(swapsController.setSwapsTxMaxFeePerGas, swapsController),
      setSwapsTxMaxFeePriorityPerGas: (0, _nodeify.default)(swapsController.setSwapsTxMaxFeePriorityPerGas, swapsController),
      safeRefetchQuotes: (0, _nodeify.default)(swapsController.safeRefetchQuotes, swapsController),
      stopPollingForQuotes: (0, _nodeify.default)(swapsController.stopPollingForQuotes, swapsController),
      setBackgroundSwapRouteState: (0, _nodeify.default)(swapsController.setBackgroundSwapRouteState, swapsController),
      resetPostFetchState: (0, _nodeify.default)(swapsController.resetPostFetchState, swapsController),
      setSwapsErrorKey: (0, _nodeify.default)(swapsController.setSwapsErrorKey, swapsController),
      setInitialGasEstimate: (0, _nodeify.default)(swapsController.setInitialGasEstimate, swapsController),
      setCustomApproveTxData: (0, _nodeify.default)(swapsController.setCustomApproveTxData, swapsController),
      setSwapsLiveness: (0, _nodeify.default)(swapsController.setSwapsLiveness, swapsController),
      setSwapsUserFeeLevel: (0, _nodeify.default)(swapsController.setSwapsUserFeeLevel, swapsController),
      setSwapsQuotesPollingLimitEnabled: (0, _nodeify.default)(swapsController.setSwapsQuotesPollingLimitEnabled, swapsController),
      // MetaMetrics
      trackMetaMetricsEvent: (0, _nodeify.default)(metaMetricsController.trackEvent, metaMetricsController),
      trackMetaMetricsPage: (0, _nodeify.default)(metaMetricsController.trackPage, metaMetricsController),
      // approval controller
      resolvePendingApproval: (0, _nodeify.default)(approvalController.accept, approvalController),
      rejectPendingApproval: (0, _nodeify.default)(approvalController.reject, approvalController),
      // Notifications
      updateViewedNotifications: (0, _nodeify.default)(this.notificationController.updateViewed, this.notificationController),
      // GasFeeController
      getGasFeeEstimatesAndStartPolling: (0, _nodeify.default)(this.gasFeeController.getGasFeeEstimatesAndStartPolling, this.gasFeeController),
      disconnectGasFeeEstimatePoller: (0, _nodeify.default)(this.gasFeeController.disconnectPoller, this.gasFeeController),
      getGasFeeTimeEstimate: (0, _nodeify.default)(this.gasFeeController.getTimeEstimate, this.gasFeeController),
      addPollingTokenToAppState: (0, _nodeify.default)(this.appStateController.addPollingToken, this.appStateController),
      removePollingTokenFromAppState: (0, _nodeify.default)(this.appStateController.removePollingToken, this.appStateController),
      // DetectTokenController
      detectNewTokens: (0, _nodeify.default)(this.detectTokensController.detectNewTokens, this.detectTokensController)
    };
  } //=============================================================================
  // VAULT / KEYRING RELATED METHODS
  //=============================================================================

  /**
   * Creates a new Vault and create a new keychain.
   *
   * A vault, or KeyringController, is a controller that contains
   * many different account strategies, currently called Keyrings.
   * Creating it new means wiping all previous keyrings.
   *
   * A keychain, or keyring, controls many accounts with a single backup and signing strategy.
   * For example, a mnemonic phrase can generate many accounts, and is a keyring.
   *
   * @param {string} password
   * @returns {Object} vault
   */


  async createNewVaultAndKeychain(password) {
    const releaseLock = await this.createVaultMutex.acquire();

    try {
      let vault;
      const accounts = await this.keyringController.getAccounts();

      if (accounts.length > 0) {
        vault = await this.keyringController.fullUpdate();
      } else {
        vault = await this.keyringController.createNewVaultAndKeychain(password);
        const addresses = await this.keyringController.getAccounts();
        this.preferencesController.setAddresses(addresses);
        this.selectFirstIdentity();
      }

      return vault;
    } finally {
      releaseLock();
    }
  }
  /**
   * Create a new Vault and restore an existent keyring.
   * @param {string} password
   * @param {string} seed
   */


  async createNewVaultAndRestore(password, seed) {
    const releaseLock = await this.createVaultMutex.acquire();

    try {
      let accounts, lastBalance;
      const {
        keyringController
      } = this; // clear known identities

      this.preferencesController.setAddresses([]); // clear permissions

      this.permissionsController.clearPermissions(); // clear accounts in accountTracker

      this.accountTracker.clearAccounts(); // clear cachedBalances

      this.cachedBalancesController.clearCachedBalances(); // clear unapproved transactions

      this.txController.txStateManager.clearUnapprovedTxs(); // create new vault

      const vault = await keyringController.createNewVaultAndRestore(password, seed);
      const ethQuery = new _ethQuery.default(this.provider);
      accounts = await keyringController.getAccounts();
      lastBalance = await this.getBalance(accounts[accounts.length - 1], ethQuery);
      const primaryKeyring = keyringController.getKeyringsByType('HD Key Tree')[0];

      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found');
      } // seek out the first zero balance


      while (lastBalance !== '0x0') {
        await keyringController.addNewAccount(primaryKeyring);
        accounts = await keyringController.getAccounts();
        lastBalance = await this.getBalance(accounts[accounts.length - 1], ethQuery);
      } // remove extra zero balance account potentially created from seeking ahead


      if (accounts.length > 1 && lastBalance === '0x0') {
        await this.removeAccount(accounts[accounts.length - 1]);
        accounts = await keyringController.getAccounts();
      } // set new identities


      this.preferencesController.setAddresses(accounts);
      this.selectFirstIdentity();
      return vault;
    } finally {
      releaseLock();
    }
  }
  /**
   * Get an account balance from the AccountTracker or request it directly from the network.
   * @param {string} address - The account address
   * @param {EthQuery} ethQuery - The EthQuery instance to use when asking the network
   */


  getBalance(address, ethQuery) {
    return new Promise((resolve, reject) => {
      const cached = this.accountTracker.store.getState().accounts[address];

      if (cached && cached.balance) {
        resolve(cached.balance);
      } else {
        ethQuery.getBalance(address, (error, balance) => {
          if (error) {
            reject(error);

            _loglevel.default.error(error);
          } else {
            resolve(balance || '0x0');
          }
        });
      }
    });
  }
  /**
   * Collects all the information that we want to share
   * with the mobile client for syncing purposes
   * @returns {Promise<Object>} Parts of the state that we want to syncx
   */


  async fetchInfoToSync() {
    // Preferences
    const {
      currentLocale,
      frequentRpcList,
      identities,
      selectedAddress,
      useTokenDetection
    } = this.preferencesController.store.getState();
    const {
      tokenList
    } = this.tokenListController.state;
    const preferences = {
      currentLocale,
      frequentRpcList,
      identities,
      selectedAddress
    }; // Tokens

    const {
      allTokens,
      allIgnoredTokens
    } = this.tokensController.state; // Filter ERC20 tokens

    const allERC20Tokens = {};
    Object.keys(allTokens).forEach(chainId => {
      allERC20Tokens[chainId] = {};
      Object.keys(allTokens[chainId]).forEach(accountAddress => {
        const checksummedAccountAddress = (0, _hexstringUtils.toChecksumHexAddress)(accountAddress);
        allERC20Tokens[chainId][checksummedAccountAddress] = allTokens[chainId][checksummedAccountAddress].filter(asset => {
          if (asset.isERC721 === undefined) {
            // since the token.address from allTokens is checksumaddress
            // asset.address have to be changed to lowercase when we are using dynamic list
            const address = useTokenDetection ? asset.address.toLowerCase() : asset.address; // the tokenList will be holding only erc20 tokens

            if (tokenList[address] !== undefined) {
              return true;
            }
          } else if (asset.isERC721 === false) {
            return true;
          }

          return false;
        });
      });
    }); // Accounts

    const hdKeyring = this.keyringController.getKeyringsByType('HD Key Tree')[0];
    const simpleKeyPairKeyrings = this.keyringController.getKeyringsByType('Simple Key Pair');
    const hdAccounts = await hdKeyring.getAccounts();
    const simpleKeyPairKeyringAccounts = await Promise.all(simpleKeyPairKeyrings.map(keyring => keyring.getAccounts()));
    const simpleKeyPairAccounts = simpleKeyPairKeyringAccounts.reduce((acc, accounts) => [...acc, ...accounts], []);
    const accounts = {
      hd: hdAccounts.filter((item, pos) => hdAccounts.indexOf(item) === pos).map(address => (0, _hexstringUtils.toChecksumHexAddress)(address)),
      simpleKeyPair: simpleKeyPairAccounts.filter((item, pos) => simpleKeyPairAccounts.indexOf(item) === pos).map(address => (0, _hexstringUtils.toChecksumHexAddress)(address)),
      ledger: [],
      trezor: []
    }; // transactions

    let {
      transactions
    } = this.txController.store.getState(); // delete tx for other accounts that we're not importing

    transactions = Object.values(transactions).filter(tx => {
      const checksummedTxFrom = (0, _hexstringUtils.toChecksumHexAddress)(tx.txParams.from);
      return accounts.hd.includes(checksummedTxFrom);
    });
    return {
      accounts,
      preferences,
      transactions,
      tokens: {
        allTokens: allERC20Tokens,
        allIgnoredTokens
      },
      network: this.networkController.store.getState()
    };
  }
  /*
   * Submits the user's password and attempts to unlock the vault.
   * Also synchronizes the preferencesController, to ensure its schema
   * is up to date with known accounts once the vault is decrypted.
   *
   * @param {string} password - The user's password
   * @returns {Promise<object>} The keyringController update.
   */


  async submitPassword(password) {
    await this.keyringController.submitPassword(password);

    try {
      await this.blockTracker.checkForLatestBlock();
    } catch (error) {
      _loglevel.default.error('Error while unlocking extension.', error);
    }

    try {
      const threeBoxSyncingAllowed = this.threeBoxController.getThreeBoxSyncingState();

      if (threeBoxSyncingAllowed && !this.threeBoxController.box) {
        // 'await' intentionally omitted to avoid waiting for initialization
        this.threeBoxController.init();
        this.threeBoxController.turnThreeBoxSyncingOn();
      } else if (threeBoxSyncingAllowed && this.threeBoxController.box) {
        this.threeBoxController.turnThreeBoxSyncingOn();
      }
    } catch (error) {
      _loglevel.default.error('Error while unlocking extension.', error);
    } // This must be set as soon as possible to communicate to the
    // keyring's iframe and have the setting initialized properly
    // Optimistically called to not block Metamask login due to
    // Ledger Keyring GitHub downtime


    this.setLedgerLivePreference(this.preferencesController.getLedgerLivePreference());
    return this.keyringController.fullUpdate();
  }
  /**
   * Submits a user's password to check its validity.
   *
   * @param {string} password The user's password
   */


  async verifyPassword(password) {
    await this.keyringController.verifyPassword(password);
  }
  /**
   * @type Identity
   * @property {string} name - The account nickname.
   * @property {string} address - The account's ethereum address, in lower case.
   * @property {boolean} mayBeFauceting - Whether this account is currently
   * receiving funds from our automatic Ropsten faucet.
   */

  /**
   * Sets the first address in the state to the selected address
   */


  selectFirstIdentity() {
    const {
      identities
    } = this.preferencesController.store.getState();
    const address = Object.keys(identities)[0];
    this.preferencesController.setSelectedAddress(address);
  } //
  // Hardware
  //


  async getKeyringForDevice(deviceName, hdPath = null) {
    let keyringName = null;

    switch (deviceName) {
      case 'trezor':
        keyringName = _ethTrezorKeyring.default.type;
        break;

      case 'ledger':
        keyringName = _ethLedgerBridgeKeyring.default.type;
        break;

      default:
        throw new Error('MetamaskController:getKeyringForDevice - Unknown device');
    }

    let keyring = await this.keyringController.getKeyringsByType(keyringName)[0];

    if (!keyring) {
      keyring = await this.keyringController.addNewKeyring(keyringName);
    }

    if (hdPath && keyring.setHdPath) {
      keyring.setHdPath(hdPath);
    }

    keyring.network = this.networkController.getProviderConfig().type;
    return keyring;
  }
  /**
   * Fetch account list from a trezor device.
   *
   * @returns [] accounts
   */


  async connectHardware(deviceName, page, hdPath) {
    const keyring = await this.getKeyringForDevice(deviceName, hdPath);
    let accounts = [];

    switch (page) {
      case -1:
        accounts = await keyring.getPreviousPage();
        break;

      case 1:
        accounts = await keyring.getNextPage();
        break;

      default:
        accounts = await keyring.getFirstPage();
    } // Merge with existing accounts
    // and make sure addresses are not repeated


    const oldAccounts = await this.keyringController.getAccounts();
    const accountsToTrack = [...new Set(oldAccounts.concat(accounts.map(a => a.address.toLowerCase())))];
    this.accountTracker.syncWithAddresses(accountsToTrack);
    return accounts;
  }
  /**
   * Check if the device is unlocked
   *
   * @returns {Promise<boolean>}
   */


  async checkHardwareStatus(deviceName, hdPath) {
    const keyring = await this.getKeyringForDevice(deviceName, hdPath);
    return keyring.isUnlocked();
  }
  /**
   * Clear
   *
   * @returns {Promise<boolean>}
   */


  async forgetDevice(deviceName) {
    const keyring = await this.getKeyringForDevice(deviceName);
    keyring.forgetDevice();
    return true;
  }
  /**
   * Imports an account from a Trezor or Ledger device.
   *
   * @returns {} keyState
   */


  async unlockHardwareWalletAccount(index, deviceName, hdPath, hdPathDescription) {
    const keyring = await this.getKeyringForDevice(deviceName, hdPath);
    keyring.setAccountToUnlock(index);
    const oldAccounts = await this.keyringController.getAccounts();
    const keyState = await this.keyringController.addNewAccount(keyring);
    const newAccounts = await this.keyringController.getAccounts();
    this.preferencesController.setAddresses(newAccounts);
    newAccounts.forEach(address => {
      if (!oldAccounts.includes(address)) {
        const label = `${deviceName[0].toUpperCase()}${deviceName.slice(1)} ${parseInt(index, 10) + 1} ${hdPathDescription || ''}`.trim(); // Set the account label to Trezor 1 /  Ledger 1, etc

        this.preferencesController.setAccountLabel(address, label); // Select the account

        this.preferencesController.setSelectedAddress(address);
      }
    });
    const {
      identities
    } = this.preferencesController.store.getState();
    return _objectSpread(_objectSpread({}, keyState), {}, {
      identities
    });
  } //
  // Account Management
  //

  /**
   * Adds a new account to the default (first) HD seed phrase Keyring.
   *
   * @returns {} keyState
   */


  async addNewAccount() {
    const primaryKeyring = this.keyringController.getKeyringsByType('HD Key Tree')[0];

    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found');
    }

    const {
      keyringController
    } = this;
    const oldAccounts = await keyringController.getAccounts();
    const keyState = await keyringController.addNewAccount(primaryKeyring);
    const newAccounts = await keyringController.getAccounts();
    await this.verifySeedPhrase();
    this.preferencesController.setAddresses(newAccounts);
    newAccounts.forEach(address => {
      if (!oldAccounts.includes(address)) {
        this.preferencesController.setSelectedAddress(address);
      }
    });
    const {
      identities
    } = this.preferencesController.store.getState();
    return _objectSpread(_objectSpread({}, keyState), {}, {
      identities
    });
  }
  /**
   * Verifies the validity of the current vault's seed phrase.
   *
   * Validity: seed phrase restores the accounts belonging to the current vault.
   *
   * Called when the first account is created and on unlocking the vault.
   *
   * @returns {Promise<string>} Seed phrase to be confirmed by the user.
   */


  async verifySeedPhrase() {
    const primaryKeyring = this.keyringController.getKeyringsByType('HD Key Tree')[0];

    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found');
    }

    const serialized = await primaryKeyring.serialize();
    const seedWords = serialized.mnemonic;
    const accounts = await primaryKeyring.getAccounts();

    if (accounts.length < 1) {
      throw new Error('MetamaskController - No accounts found');
    }

    try {
      await _seedPhraseVerifier.default.verifyAccounts(accounts, seedWords);
      return seedWords;
    } catch (err) {
      _loglevel.default.error(err.message);

      throw err;
    }
  }
  /**
   * Clears the transaction history, to allow users to force-reset their nonces.
   * Mostly used in development environments, when networks are restarted with
   * the same network ID.
   *
   * @returns {Promise<string>} The current selected address.
   */


  async resetAccount() {
    const selectedAddress = this.preferencesController.getSelectedAddress();
    this.txController.wipeTransactions(selectedAddress);
    this.networkController.resetConnection();
    return selectedAddress;
  }
  /**
   * Removes an account from state / storage.
   *
   * @param {string[]} address - A hex address
   *
   */


  async removeAccount(address) {
    // Remove all associated permissions
    await this.permissionsController.removeAllAccountPermissions(address); // Remove account from the preferences controller

    this.preferencesController.removeAddress(address); // Remove account from the account tracker controller

    this.accountTracker.removeAccount([address]); // Remove account from the keyring

    await this.keyringController.removeAccount(address);
    return address;
  }
  /**
   * Imports an account with the specified import strategy.
   * These are defined in app/scripts/account-import-strategies
   * Each strategy represents a different way of serializing an Ethereum key pair.
   *
   * @param {string} strategy - A unique identifier for an account import strategy.
   * @param {any} args - The data required by that strategy to import an account.
   * @param {Function} cb - A callback function called with a state update on success.
   */


  async importAccountWithStrategy(strategy, args) {
    const privateKey = await _accountImportStrategies.default.importAccount(strategy, args);
    const keyring = await this.keyringController.addNewKeyring('Simple Key Pair', [privateKey]);
    const accounts = await keyring.getAccounts(); // update accounts in preferences controller

    const allAccounts = await this.keyringController.getAccounts();
    this.preferencesController.setAddresses(allAccounts); // set new account as selected

    await this.preferencesController.setSelectedAddress(accounts[0]);
  } // ---------------------------------------------------------------------------
  // Identity Management (signature operations)

  /**
   * Called when a Dapp suggests a new tx to be signed.
   * this wrapper needs to exist so we can provide a reference to
   *  "newUnapprovedTransaction" before "txController" is instantiated
   *
   * @param {Object} msgParams - The params passed to eth_sign.
   * @param {Object} req - (optional) the original request, containing the origin
   */


  async newUnapprovedTransaction(txParams, req) {
    return await this.txController.newUnapprovedTransaction(txParams, req);
  } // eth_sign methods:

  /**
   * Called when a Dapp uses the eth_sign method, to request user approval.
   * eth_sign is a pure signature of arbitrary data. It is on a deprecation
   * path, since this data can be a transaction, or can leak private key
   * information.
   *
   * @param {Object} msgParams - The params passed to eth_sign.
   * @param {Function} cb - The callback function called with the signature.
   */


  newUnsignedMessage(msgParams, req) {
    const promise = this.messageManager.addUnapprovedMessageAsync(msgParams, req);
    this.sendUpdate();
    this.opts.showUserConfirmation();
    return promise;
  }
  /**
   * Signifies user intent to complete an eth_sign method.
   *
   * @param {Object} msgParams - The params passed to eth_call.
   * @returns {Promise<Object>} Full state update.
   */


  signMessage(msgParams) {
    _loglevel.default.info('MetaMaskController - signMessage');

    const msgId = msgParams.metamaskId; // sets the status op the message to 'approved'
    // and removes the metamaskId for signing

    return this.messageManager.approveMessage(msgParams).then(cleanMsgParams => {
      // signs the message
      return this.keyringController.signMessage(cleanMsgParams);
    }).then(rawSig => {
      // tells the listener that the message has been signed
      // and can be returned to the dapp
      this.messageManager.setMsgStatusSigned(msgId, rawSig);
      return this.getState();
    });
  }
  /**
   * Used to cancel a message submitted via eth_sign.
   *
   * @param {string} msgId - The id of the message to cancel.
   */


  cancelMessage(msgId, cb) {
    const {
      messageManager
    } = this;
    messageManager.rejectMsg(msgId);

    if (!cb || typeof cb !== 'function') {
      return;
    }

    cb(null, this.getState());
  } // personal_sign methods:

  /**
   * Called when a dapp uses the personal_sign method.
   * This is identical to the Geth eth_sign method, and may eventually replace
   * eth_sign.
   *
   * We currently define our eth_sign and personal_sign mostly for legacy Dapps.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @param {Function} cb - The callback function called with the signature.
   * Passed back to the requesting Dapp.
   */


  async newUnsignedPersonalMessage(msgParams, req) {
    const promise = this.personalMessageManager.addUnapprovedMessageAsync(msgParams, req);
    this.sendUpdate();
    this.opts.showUserConfirmation();
    return promise;
  }
  /**
   * Signifies a user's approval to sign a personal_sign message in queue.
   * Triggers signing, and the callback function from newUnsignedPersonalMessage.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @returns {Promise<Object>} A full state update.
   */


  signPersonalMessage(msgParams) {
    _loglevel.default.info('MetaMaskController - signPersonalMessage');

    const msgId = msgParams.metamaskId; // sets the status op the message to 'approved'
    // and removes the metamaskId for signing

    return this.personalMessageManager.approveMessage(msgParams).then(cleanMsgParams => {
      // signs the message
      return this.keyringController.signPersonalMessage(cleanMsgParams);
    }).then(rawSig => {
      // tells the listener that the message has been signed
      // and can be returned to the dapp
      this.personalMessageManager.setMsgStatusSigned(msgId, rawSig);
      return this.getState();
    });
  }
  /**
   * Used to cancel a personal_sign type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */


  cancelPersonalMessage(msgId, cb) {
    const messageManager = this.personalMessageManager;
    messageManager.rejectMsg(msgId);

    if (!cb || typeof cb !== 'function') {
      return;
    }

    cb(null, this.getState());
  } // eth_decrypt methods

  /**
   * Called when a dapp uses the eth_decrypt method.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @param {Object} req - (optional) the original request, containing the origin
   * Passed back to the requesting Dapp.
   */


  async newRequestDecryptMessage(msgParams, req) {
    const promise = this.decryptMessageManager.addUnapprovedMessageAsync(msgParams, req);
    this.sendUpdate();
    this.opts.showUserConfirmation();
    return promise;
  }
  /**
   * Only decrypt message and don't touch transaction state
   *
   * @param {Object} msgParams - The params of the message to decrypt.
   * @returns {Promise<Object>} A full state update.
   */


  async decryptMessageInline(msgParams) {
    _loglevel.default.info('MetaMaskController - decryptMessageInline'); // decrypt the message inline


    const msgId = msgParams.metamaskId;
    const msg = this.decryptMessageManager.getMsg(msgId);

    try {
      const stripped = (0, _ethereumjsUtil.stripHexPrefix)(msgParams.data);
      const buff = Buffer.from(stripped, 'hex');
      msgParams.data = JSON.parse(buff.toString('utf8'));
      msg.rawData = await this.keyringController.decryptMessage(msgParams);
    } catch (e) {
      msg.error = e.message;
    }

    this.decryptMessageManager._updateMsg(msg);

    return this.getState();
  }
  /**
   * Signifies a user's approval to decrypt a message in queue.
   * Triggers decrypt, and the callback function from newUnsignedDecryptMessage.
   *
   * @param {Object} msgParams - The params of the message to decrypt & return to the Dapp.
   * @returns {Promise<Object>} A full state update.
   */


  async decryptMessage(msgParams) {
    _loglevel.default.info('MetaMaskController - decryptMessage');

    const msgId = msgParams.metamaskId; // sets the status op the message to 'approved'
    // and removes the metamaskId for decryption

    try {
      const cleanMsgParams = await this.decryptMessageManager.approveMessage(msgParams);
      const stripped = (0, _ethereumjsUtil.stripHexPrefix)(cleanMsgParams.data);
      const buff = Buffer.from(stripped, 'hex');
      cleanMsgParams.data = JSON.parse(buff.toString('utf8')); // decrypt the message

      const rawMess = await this.keyringController.decryptMessage(cleanMsgParams); // tells the listener that the message has been decrypted and can be returned to the dapp

      this.decryptMessageManager.setMsgStatusDecrypted(msgId, rawMess);
    } catch (error) {
      _loglevel.default.info('MetaMaskController - eth_decrypt failed.', error);

      this.decryptMessageManager.errorMessage(msgId, error);
    }

    return this.getState();
  }
  /**
   * Used to cancel a eth_decrypt type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */


  cancelDecryptMessage(msgId, cb) {
    const messageManager = this.decryptMessageManager;
    messageManager.rejectMsg(msgId);

    if (!cb || typeof cb !== 'function') {
      return;
    }

    cb(null, this.getState());
  } // eth_getEncryptionPublicKey methods

  /**
   * Called when a dapp uses the eth_getEncryptionPublicKey method.
   *
   * @param {Object} msgParams - The params of the message to sign & return to the Dapp.
   * @param {Object} req - (optional) the original request, containing the origin
   * Passed back to the requesting Dapp.
   */


  async newRequestEncryptionPublicKey(msgParams, req) {
    const address = msgParams;
    const keyring = await this.keyringController.getKeyringForAccount(address);

    switch (keyring.type) {
      case _hardwareWallets.KEYRING_TYPES.LEDGER:
        {
          return new Promise((_, reject) => {
            reject(new Error('Ledger does not support eth_getEncryptionPublicKey.'));
          });
        }

      case _hardwareWallets.KEYRING_TYPES.TREZOR:
        {
          return new Promise((_, reject) => {
            reject(new Error('Trezor does not support eth_getEncryptionPublicKey.'));
          });
        }

      default:
        {
          const promise = this.encryptionPublicKeyManager.addUnapprovedMessageAsync(msgParams, req);
          this.sendUpdate();
          this.opts.showUserConfirmation();
          return promise;
        }
    }
  }
  /**
   * Signifies a user's approval to receiving encryption public key in queue.
   * Triggers receiving, and the callback function from newUnsignedEncryptionPublicKey.
   *
   * @param {Object} msgParams - The params of the message to receive & return to the Dapp.
   * @returns {Promise<Object>} A full state update.
   */


  async encryptionPublicKey(msgParams) {
    _loglevel.default.info('MetaMaskController - encryptionPublicKey');

    const msgId = msgParams.metamaskId; // sets the status op the message to 'approved'
    // and removes the metamaskId for decryption

    try {
      const params = await this.encryptionPublicKeyManager.approveMessage(msgParams); // EncryptionPublicKey message

      const publicKey = await this.keyringController.getEncryptionPublicKey(params.data); // tells the listener that the message has been processed
      // and can be returned to the dapp

      this.encryptionPublicKeyManager.setMsgStatusReceived(msgId, publicKey);
    } catch (error) {
      _loglevel.default.info('MetaMaskController - eth_getEncryptionPublicKey failed.', error);

      this.encryptionPublicKeyManager.errorMessage(msgId, error);
    }

    return this.getState();
  }
  /**
   * Used to cancel a eth_getEncryptionPublicKey type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */


  cancelEncryptionPublicKey(msgId, cb) {
    const messageManager = this.encryptionPublicKeyManager;
    messageManager.rejectMsg(msgId);

    if (!cb || typeof cb !== 'function') {
      return;
    }

    cb(null, this.getState());
  } // eth_signTypedData methods

  /**
   * Called when a dapp uses the eth_signTypedData method, per EIP 712.
   *
   * @param {Object} msgParams - The params passed to eth_signTypedData.
   * @param {Function} cb - The callback function, called with the signature.
   */


  newUnsignedTypedMessage(msgParams, req, version) {
    const promise = this.typedMessageManager.addUnapprovedMessageAsync(msgParams, req, version);
    this.sendUpdate();
    this.opts.showUserConfirmation();
    return promise;
  }
  /**
   * The method for a user approving a call to eth_signTypedData, per EIP 712.
   * Triggers the callback in newUnsignedTypedMessage.
   *
   * @param {Object} msgParams - The params passed to eth_signTypedData.
   * @returns {Object} Full state update.
   */


  async signTypedMessage(msgParams) {
    _loglevel.default.info('MetaMaskController - eth_signTypedData');

    const msgId = msgParams.metamaskId;
    const {
      version
    } = msgParams;

    try {
      const cleanMsgParams = await this.typedMessageManager.approveMessage(msgParams); // For some reason every version after V1 used stringified params.

      if (version !== 'V1') {
        // But we don't have to require that. We can stop suggesting it now:
        if (typeof cleanMsgParams.data === 'string') {
          cleanMsgParams.data = JSON.parse(cleanMsgParams.data);
        }
      }

      const signature = await this.keyringController.signTypedMessage(cleanMsgParams, {
        version
      });
      this.typedMessageManager.setMsgStatusSigned(msgId, signature);
      return this.getState();
    } catch (error) {
      _loglevel.default.info('MetaMaskController - eth_signTypedData failed.', error);

      this.typedMessageManager.errorMessage(msgId, error);
      throw error;
    }
  }
  /**
   * Used to cancel a eth_signTypedData type message.
   * @param {string} msgId - The ID of the message to cancel.
   * @param {Function} cb - The callback function called with a full state update.
   */


  cancelTypedMessage(msgId, cb) {
    const messageManager = this.typedMessageManager;
    messageManager.rejectMsg(msgId);

    if (!cb || typeof cb !== 'function') {
      return;
    }

    cb(null, this.getState());
  }
  /**
   * Method to return a boolean if the keyring for the currently selected
   * account is a ledger or trezor keyring.
   * TODO: remove this method when Ledger and Trezor release their supported
   * client utilities for EIP-1559
   * @returns {boolean} true if the keyring type supports EIP-1559
   */


  async getCurrentAccountEIP1559Compatibility(fromAddress) {
    const address = fromAddress || this.preferencesController.getSelectedAddress();
    const keyring = await this.keyringController.getKeyringForAccount(address);
    return keyring.type !== _hardwareWallets.KEYRING_TYPES.TREZOR;
  } //=============================================================================
  // END (VAULT / KEYRING RELATED METHODS)
  //=============================================================================

  /**
   * Allows a user to attempt to cancel a previously submitted transaction
   * by creating a new transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to
   *  attempt to cancel
   * @param {import(
   *  './controllers/transactions'
   * ).CustomGasSettings} [customGasSettings] - overrides to use for gas params
   *  instead of allowing this method to generate them
   * @returns {Object} MetaMask state
   */


  async createCancelTransaction(originalTxId, customGasSettings, newTxMetaProps) {
    await this.txController.createCancelTransaction(originalTxId, customGasSettings, newTxMetaProps);
    const state = await this.getState();
    return state;
  }
  /**
   * Allows a user to attempt to speed up a previously submitted transaction
   * by creating a new transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to
   *  attempt to speed up
   * @param {import(
   *  './controllers/transactions'
   * ).CustomGasSettings} [customGasSettings] - overrides to use for gas params
   *  instead of allowing this method to generate them
   * @returns {Object} MetaMask state
   */


  async createSpeedUpTransaction(originalTxId, customGasSettings, newTxMetaProps) {
    await this.txController.createSpeedUpTransaction(originalTxId, customGasSettings, newTxMetaProps);
    const state = await this.getState();
    return state;
  }

  estimateGas(estimateGasParams) {
    return new Promise((resolve, reject) => {
      return this.txController.txGasUtil.query.estimateGas(estimateGasParams, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.toString(16));
      });
    });
  } //=============================================================================
  // PASSWORD MANAGEMENT
  //=============================================================================

  /**
   * Allows a user to begin the seed phrase recovery process.
   * @param {Function} cb - A callback function called when complete.
   */


  markPasswordForgotten(cb) {
    this.preferencesController.setPasswordForgotten(true);
    this.sendUpdate();
    cb();
  }
  /**
   * Allows a user to end the seed phrase recovery process.
   * @param {Function} cb - A callback function called when complete.
   */


  unMarkPasswordForgotten(cb) {
    this.preferencesController.setPasswordForgotten(false);
    this.sendUpdate();
    cb();
  } //=============================================================================
  // SETUP
  //=============================================================================

  /**
   * A runtime.MessageSender object, as provided by the browser:
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/MessageSender
   * @typedef {Object} MessageSender
   */

  /**
   * Used to create a multiplexed stream for connecting to an untrusted context
   * like a Dapp or other extension.
   * @param {*} connectionStream - The Duplex stream to connect to.
   * @param {MessageSender} sender - The sender of the messages on this stream
   */


  setupUntrustedCommunication(connectionStream, sender) {
    const {
      usePhishDetect
    } = this.preferencesController.store.getState();
    const {
      hostname
    } = new URL(sender.url); // Check if new connection is blocked if phishing detection is on

    if (usePhishDetect && this.phishingController.test(hostname)) {
      _loglevel.default.debug('MetaMask - sending phishing warning for', hostname);

      this.sendPhishingWarning(connectionStream, hostname);
      return;
    } // setup multiplexing


    const mux = (0, _streamUtils.setupMultiplex)(connectionStream); // messages between inpage and background

    this.setupProviderConnection(mux.createStream('monstawallet-provider'), sender); // TODO:LegacyProvider: Delete
    // legacy streams

    this.setupPublicConfig(mux.createStream('publicConfig'));
  }
  /**
   * Used to create a multiplexed stream for connecting to a trusted context,
   * like our own user interfaces, which have the provider APIs, but also
   * receive the exported API from this controller, which includes trusted
   * functions, like the ability to approve transactions or sign messages.
   *
   * @param {*} connectionStream - The duplex stream to connect to.
   * @param {MessageSender} sender - The sender of the messages on this stream
   */


  setupTrustedCommunication(connectionStream, sender) {
    // setup multiplexing
    const mux = (0, _streamUtils.setupMultiplex)(connectionStream); // connect features

    this.setupControllerConnection(mux.createStream('controller'));
    this.setupProviderConnection(mux.createStream('provider'), sender, true);
  }
  /**
   * Called when we detect a suspicious domain. Requests the browser redirects
   * to our anti-phishing page.
   *
   * @private
   * @param {*} connectionStream - The duplex stream to the per-page script,
   * for sending the reload attempt to.
   * @param {string} hostname - The hostname that triggered the suspicion.
   */


  sendPhishingWarning(connectionStream, hostname) {
    const mux = (0, _streamUtils.setupMultiplex)(connectionStream);
    const phishingStream = mux.createStream('phishing');
    phishingStream.write({
      hostname
    });
  }
  /**
   * A method for providing our API over a stream using JSON-RPC.
   * @param {*} outStream - The stream to provide our API over.
   */


  setupControllerConnection(outStream) {
    const api = this.getApi(); // report new active controller connection

    this.activeControllerConnections += 1;
    this.emit('controllerConnectionChanged', this.activeControllerConnections); // set up postStream transport

    outStream.on('data', (0, _createMetaRPCHandler.default)(api, outStream));

    const handleUpdate = update => {
      if (outStream._writableState.ended) {
        return;
      } // send notification to client-side


      outStream.write({
        jsonrpc: '2.0',
        method: 'sendUpdate',
        params: [update]
      });
    };

    this.on('update', handleUpdate);
    outStream.on('end', () => {
      this.activeControllerConnections -= 1;
      this.emit('controllerConnectionChanged', this.activeControllerConnections);
      this.removeListener('update', handleUpdate);
    });
  }
  /**
   * A method for serving our ethereum provider over a given stream.
   * @param {*} outStream - The stream to provide over.
   * @param {MessageSender} sender - The sender of the messages on this stream
   * @param {boolean} isInternal - True if this is a connection with an internal process
   */


  setupProviderConnection(outStream, sender, isInternal) {
    const origin = isInternal ? 'metamask' : new URL(sender.url).origin;
    let extensionId;

    if (sender.id !== this.extension.runtime.id) {
      extensionId = sender.id;
    }

    let tabId;

    if (sender.tab && sender.tab.id) {
      tabId = sender.tab.id;
    }

    const engine = this.setupProviderEngine({
      origin,
      location: sender.url,
      extensionId,
      tabId,
      isInternal
    }); // setup connection

    const providerStream = (0, _engineStream.default)({
      engine
    });
    const connectionId = this.addConnection(origin, {
      engine
    });
    (0, _pump.default)(outStream, providerStream, outStream, err => {
      // handle any middleware cleanup
      engine._middleware.forEach(mid => {
        if (mid.destroy && typeof mid.destroy === 'function') {
          mid.destroy();
        }
      });

      connectionId && this.removeConnection(origin, connectionId);

      if (err) {
        _loglevel.default.error(err);
      }
    });
  }
  /**
   * A method for creating a provider that is safely restricted for the requesting domain.
   * @param {Object} options - Provider engine options
   * @param {string} options.origin - The origin of the sender
   * @param {string} options.location - The full URL of the sender
   * @param {extensionId} [options.extensionId] - The extension ID of the sender, if the sender is an external extension
   * @param {tabId} [options.tabId] - The tab ID of the sender - if the sender is within a tab
   * @param {boolean} [options.isInternal] - True if called for a connection to an internal process
   **/


  setupProviderEngine({
    origin,
    location,
    extensionId,
    tabId,
    isInternal = false
  }) {
    // setup json rpc engine stack
    const engine = new _jsonRpcEngine.JsonRpcEngine();
    const {
      provider,
      blockTracker
    } = this; // create filter polyfill middleware

    const filterMiddleware = (0, _ethJsonRpcFilters.default)({
      provider,
      blockTracker
    }); // create subscription polyfill middleware

    const subscriptionManager = (0, _subscriptionManager.default)({
      provider,
      blockTracker
    });
    subscriptionManager.events.on('notification', message => engine.emit('notification', message)); // append origin to each request

    engine.push((0, _createOriginMiddleware.default)({
      origin
    })); // append tabId to each request if it exists

    if (tabId) {
      engine.push((0, _createTabIdMiddleware.default)({
        tabId
      }));
    } // logging


    engine.push((0, _createLoggerMiddleware.default)({
      origin
    }));
    engine.push((0, _createOnboardingMiddleware.default)({
      location,
      registerOnboarding: this.onboardingController.registerOnboarding
    }));
    engine.push((0, _rpcMethodMiddleware.default)({
      origin,
      getProviderState: this.getProviderState.bind(this),
      sendMetrics: this.metaMetricsController.trackEvent.bind(this.metaMetricsController),
      handleWatchAssetRequest: this.tokensController.watchAsset.bind(this.tokensController),
      getWeb3ShimUsageState: this.alertController.getWeb3ShimUsageState.bind(this.alertController),
      setWeb3ShimUsageRecorded: this.alertController.setWeb3ShimUsageRecorded.bind(this.alertController),
      findCustomRpcBy: this.findCustomRpcBy.bind(this),
      getCurrentChainId: this.networkController.getCurrentChainId.bind(this.networkController),
      requestUserApproval: this.approvalController.addAndShowApprovalRequest.bind(this.approvalController),
      updateRpcTarget: ({
        rpcUrl,
        chainId,
        ticker,
        nickname
      }) => {
        this.networkController.setRpcTarget(rpcUrl, chainId, ticker, nickname);
      },
      setProviderType: this.networkController.setProviderType.bind(this.networkController),
      addCustomRpc: async ({
        chainId,
        blockExplorerUrl,
        ticker,
        chainName,
        rpcUrl
      } = {}) => {
        await this.preferencesController.addToFrequentRpcList(rpcUrl, chainId, ticker, chainName, {
          blockExplorerUrl
        });
      }
    })); // filter and subscription polyfills

    engine.push(filterMiddleware);
    engine.push(subscriptionManager.middleware);

    if (!isInternal) {
      // permissions
      engine.push(this.permissionsController.createMiddleware({
        origin,
        extensionId
      }));
    } // forward to metamask primary provider


    engine.push((0, _providerAsMiddleware.default)(provider));
    return engine;
  }
  /**
   * TODO:LegacyProvider: Delete
   * A method for providing our public config info over a stream.
   * This includes info we like to be synchronous if possible, like
   * the current selected account, and network ID.
   *
   * Since synchronous methods have been deprecated in web3,
   * this is a good candidate for deprecation.
   *
   * @param {*} outStream - The stream to provide public config over.
   */


  setupPublicConfig(outStream) {
    const configStream = (0, _asStream.storeAsStream)(this.publicConfigStore);
    (0, _pump.default)(configStream, outStream, err => {
      configStream.destroy();

      if (err) {
        _loglevel.default.error(err);
      }
    });
  }
  /**
   * Adds a reference to a connection by origin. Ignores the 'metamask' origin.
   * Caller must ensure that the returned id is stored such that the reference
   * can be deleted later.
   *
   * @param {string} origin - The connection's origin string.
   * @param {Object} options - Data associated with the connection
   * @param {Object} options.engine - The connection's JSON Rpc Engine
   * @returns {string} The connection's id (so that it can be deleted later)
   */


  addConnection(origin, {
    engine
  }) {
    if (origin === 'metamask') {
      return null;
    }

    if (!this.connections[origin]) {
      this.connections[origin] = {};
    }

    const id = (0, _nanoid.default)();
    this.connections[origin][id] = {
      engine
    };
    return id;
  }
  /**
   * Deletes a reference to a connection, by origin and id.
   * Ignores unknown origins.
   *
   * @param {string} origin - The connection's origin string.
   * @param {string} id - The connection's id, as returned from addConnection.
   */


  removeConnection(origin, id) {
    const connections = this.connections[origin];

    if (!connections) {
      return;
    }

    delete connections[id];

    if (Object.keys(connections).length === 0) {
      delete this.connections[origin];
    }
  }
  /**
   * Causes the RPC engines associated with the connections to the given origin
   * to emit a notification event with the given payload.
   *
   * The caller is responsible for ensuring that only permitted notifications
   * are sent.
   *
   * Ignores unknown origins.
   *
   * @param {string} origin - The connection's origin string.
   * @param {any} payload - The event payload.
   */


  notifyConnections(origin, payload) {
    const connections = this.connections[origin];

    if (connections) {
      Object.values(connections).forEach(conn => {
        if (conn.engine) {
          conn.engine.emit('notification', payload);
        }
      });
    }
  }
  /**
   * Causes the RPC engines associated with all connections to emit a
   * notification event with the given payload.
   *
   * If the "payload" parameter is a function, the payload for each connection
   * will be the return value of that function called with the connection's
   * origin.
   *
   * The caller is responsible for ensuring that only permitted notifications
   * are sent.
   *
   * @param {any} payload - The event payload, or payload getter function.
   */


  notifyAllConnections(payload) {
    const getPayload = typeof payload === 'function' ? origin => payload(origin) : () => payload;
    Object.values(this.connections).forEach(origin => {
      Object.values(origin).forEach(conn => {
        if (conn.engine) {
          conn.engine.emit('notification', getPayload(origin));
        }
      });
    });
  } // handlers

  /**
   * Handle a KeyringController update
   * @param {Object} state - the KC state
   * @returns {Promise<void>}
   * @private
   */


  async _onKeyringControllerUpdate(state) {
    const {
      keyrings
    } = state;
    const addresses = keyrings.reduce((acc, {
      accounts
    }) => acc.concat(accounts), []);

    if (!addresses.length) {
      return;
    } // Ensure preferences + identities controller know about all addresses


    this.preferencesController.syncAddresses(addresses);
    this.accountTracker.syncWithAddresses(addresses);
  }
  /**
   * Handle global unlock, triggered by KeyringController unlock.
   * Notifies all connections that the extension is unlocked.
   */


  _onUnlock() {
    this.notifyAllConnections(origin => {
      return {
        method: _enums.NOTIFICATION_NAMES.unlockStateChanged,
        params: {
          isUnlocked: true,
          accounts: this.permissionsController.getAccounts(origin)
        }
      };
    });
    this.emit('unlock');
  }
  /**
   * Handle global lock, triggered by KeyringController lock.
   * Notifies all connections that the extension is locked.
   */


  _onLock() {
    this.notifyAllConnections({
      method: _enums.NOTIFICATION_NAMES.unlockStateChanged,
      params: {
        isUnlocked: false
      }
    });
    this.emit('lock');
  }
  /**
   * Handle memory state updates.
   * - Ensure isClientOpenAndUnlocked is updated
   * - Notifies all connections with the new provider network state
   *   - The external providers handle diffing the state
   */


  _onStateUpdate(newState) {
    this.isClientOpenAndUnlocked = newState.isUnlocked && this._isClientOpen;
    this.notifyAllConnections({
      method: _enums.NOTIFICATION_NAMES.chainChanged,
      params: this.getProviderNetworkState(newState)
    });
  } // misc

  /**
   * A method for emitting the full MetaMask state to all registered listeners.
   * @private
   */


  privateSendUpdate() {
    this.emit('update', this.getState());
  }
  /**
   * @returns {boolean} Whether the extension is unlocked.
   */


  isUnlocked() {
    return this.keyringController.memStore.getState().isUnlocked;
  } //=============================================================================
  // MISCELLANEOUS
  //=============================================================================

  /**
   * Returns the nonce that will be associated with a transaction once approved
   * @param {string} address - The hex string address for the transaction
   * @returns {Promise<number>}
   */


  async getPendingNonce(address) {
    const {
      nonceDetails,
      releaseLock
    } = await this.txController.nonceTracker.getNonceLock(address);
    const pendingNonce = nonceDetails.params.highestSuggested;
    releaseLock();
    return pendingNonce;
  }
  /**
   * Returns the next nonce according to the nonce-tracker
   * @param {string} address - The hex string address for the transaction
   * @returns {Promise<number>}
   */


  async getNextNonce(address) {
    const nonceLock = await this.txController.nonceTracker.getNonceLock(address);
    nonceLock.releaseLock();
    return nonceLock.nextNonce;
  }
  /**
   * Migrate address book state from old to new chainId.
   *
   * Address book state is keyed by the `networkStore` state from the network controller. This value is set to the
   * `networkId` for our built-in Infura networks, but it's set to the `chainId` for custom networks.
   * When this `chainId` value is changed for custom RPC endpoints, we need to migrate any contacts stored under the
   * old key to the new key.
   *
   * The `duplicate` parameter is used to specify that the contacts under the old key should not be removed. This is
   * useful in the case where two RPC endpoints shared the same set of contacts, and we're not sure which one each
   * contact belongs under. Duplicating the contacts under both keys is the only way to ensure they are not lost.
   *
   * @param {string} oldChainId - The old chainId
   * @param {string} newChainId - The new chainId
   * @param {boolean} [duplicate] - Whether to duplicate the addresses on both chainIds (default: false)
   */


  async migrateAddressBookState(oldChainId, newChainId, duplicate = false) {
    const {
      addressBook
    } = this.addressBookController.state;

    if (!addressBook[oldChainId]) {
      return;
    }

    for (const address of Object.keys(addressBook[oldChainId])) {
      const entry = addressBook[oldChainId][address];
      this.addressBookController.set(address, entry.name, newChainId, entry.memo);

      if (!duplicate) {
        this.addressBookController.delete(oldChainId, address);
      }
    }
  } //=============================================================================
  // CONFIG
  //=============================================================================
  // Log blocks

  /**
   * A method for selecting a custom URL for an ethereum RPC provider and updating it
   * @param {string} rpcUrl - A URL for a valid Ethereum RPC API.
   * @param {string} chainId - The chainId of the selected network.
   * @param {string} ticker - The ticker symbol of the selected network.
   * @param {string} [nickname] - Nickname of the selected network.
   * @param {Object} [rpcPrefs] - RPC preferences.
   * @param {string} [rpcPrefs.blockExplorerUrl] - URL of block explorer for the chain.
   * @returns {Promise<String>} - The RPC Target URL confirmed.
   */


  async updateAndSetCustomRpc(rpcUrl, chainId, ticker = 'xMONI', nickname, rpcPrefs) {
    this.networkController.setRpcTarget(rpcUrl, chainId, ticker, nickname, rpcPrefs);
    await this.preferencesController.updateRpc({
      rpcUrl,
      chainId,
      ticker,
      nickname,
      rpcPrefs
    });
    return rpcUrl;
  }
  /**
   * A method for selecting a custom URL for an ethereum RPC provider.
   * @param {string} rpcUrl - A URL for a valid Ethereum RPC API.
   * @param {string} chainId - The chainId of the selected network.
   * @param {string} ticker - The ticker symbol of the selected network.
   * @param {string} nickname - Optional nickname of the selected network.
   * @returns {Promise<String>} The RPC Target URL confirmed.
   */


  async setCustomRpc(rpcUrl, chainId, ticker = 'xMONI', nickname = '', rpcPrefs = {}) {
    const frequentRpcListDetail = this.preferencesController.getFrequentRpcListDetail();
    const rpcSettings = frequentRpcListDetail.find(rpc => rpcUrl === rpc.rpcUrl);

    if (rpcSettings) {
      this.networkController.setRpcTarget(rpcSettings.rpcUrl, rpcSettings.chainId, rpcSettings.ticker, rpcSettings.nickname, rpcPrefs);
    } else {
      this.networkController.setRpcTarget(rpcUrl, chainId, ticker, nickname, rpcPrefs);
      await this.preferencesController.addToFrequentRpcList(rpcUrl, chainId, ticker, nickname, rpcPrefs);
    }

    return rpcUrl;
  }
  /**
   * A method for deleting a selected custom URL.
   * @param {string} rpcUrl - A RPC URL to delete.
   */


  async delCustomRpc(rpcUrl) {
    await this.preferencesController.removeFromFrequentRpcList(rpcUrl);
  }
  /**
   * Returns the first RPC info object that matches at least one field of the
   * provided search criteria. Returns null if no match is found
   *
   * @param {Object} rpcInfo - The RPC endpoint properties and values to check.
   * @returns {Object} rpcInfo found in the frequentRpcList
   */


  findCustomRpcBy(rpcInfo) {
    const frequentRpcListDetail = this.preferencesController.getFrequentRpcListDetail();

    for (const existingRpcInfo of frequentRpcListDetail) {
      for (const key of Object.keys(rpcInfo)) {
        if (existingRpcInfo[key] === rpcInfo[key]) {
          return existingRpcInfo;
        }
      }
    }

    return null;
  }

  async initializeThreeBox() {
    await this.threeBoxController.init();
  }
  /**
   * Sets whether or not to use the blockie identicon format.
   * @param {boolean} val - True for bockie, false for jazzicon.
   * @param {Function} cb - A callback function called when complete.
   */


  setUseBlockie(val, cb) {
    try {
      this.preferencesController.setUseBlockie(val);
      cb(null);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * Sets whether or not to use the nonce field.
   * @param {boolean} val - True for nonce field, false for not nonce field.
   * @param {Function} cb - A callback function called when complete.
   */


  setUseNonceField(val, cb) {
    try {
      this.preferencesController.setUseNonceField(val);
      cb(null);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * Sets whether or not to use phishing detection.
   * @param {boolean} val
   * @param {Function} cb
   */


  setUsePhishDetect(val, cb) {
    try {
      this.preferencesController.setUsePhishDetect(val);
      cb(null);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * Sets the IPFS gateway to use for ENS content resolution.
   * @param {string} val - the host of the gateway to set
   * @param {Function} cb - A callback function called when complete.
   */


  setIpfsGateway(val, cb) {
    try {
      this.preferencesController.setIpfsGateway(val);
      cb(null);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * Sets the Ledger Live preference to use for Ledger hardware wallet support
   * @param {bool} bool - the value representing if the users wants to use Ledger Live
   */


  async setLedgerLivePreference(bool) {
    const currentValue = this.preferencesController.getLedgerLivePreference();
    this.preferencesController.setLedgerLivePreference(bool);
    const keyring = await this.getKeyringForDevice('ledger');

    if (keyring !== null && keyring !== void 0 && keyring.updateTransportMethod) {
      return keyring.updateTransportMethod(bool).catch(e => {
        // If there was an error updating the transport, we should
        // fall back to the original value
        this.preferencesController.setLedgerLivePreference(currentValue);
        throw e;
      });
    }

    return undefined;
  }
  /**
   * Sets whether or not the user will have usage data tracked with MetaMetrics
   * @param {boolean} bool - True for users that wish to opt-in, false for users that wish to remain out.
   * @param {Function} cb - A callback function called when complete.
   */


  setParticipateInMetaMetrics(bool, cb) {
    try {
      const metaMetricsId = this.metaMetricsController.setParticipateInMetaMetrics(bool);
      cb(null, metaMetricsId);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * Sets the type of first time flow the user wishes to follow: create or import
   * @param {string} type - Indicates the type of first time flow the user wishes to follow
   * @param {Function} cb - A callback function called when complete.
   */


  setFirstTimeFlowType(type, cb) {
    try {
      this.preferencesController.setFirstTimeFlowType(type);
      cb(null);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * A method for setting a user's current locale, affecting the language rendered.
   * @param {string} key - Locale identifier.
   * @param {Function} cb - A callback function called when complete.
   */


  setCurrentLocale(key, cb) {
    try {
      const direction = this.preferencesController.setCurrentLocale(key);
      cb(null, direction);
      return;
    } catch (err) {
      cb(err); // eslint-disable-next-line no-useless-return

      return;
    }
  }
  /**
   * A method for initializing storage the first time.
   * @param {Object} initState - The default state to initialize with.
   * @private
   */


  recordFirstTimeInfo(initState) {
    if (!('firstTimeInfo' in initState)) {
      const version = this.platform.getVersion();
      initState.firstTimeInfo = {
        version,
        date: Date.now()
      };
    }
  } // TODO: Replace isClientOpen methods with `controllerConnectionChanged` events.

  /* eslint-disable accessor-pairs */

  /**
   * A method for recording whether the MetaMask user interface is open or not.
   * @param {boolean} open
   */


  set isClientOpen(open) {
    this._isClientOpen = open;
    this.detectTokensController.isOpen = open;
  }
  /* eslint-enable accessor-pairs */

  /**
   * A method that is called by the background when all instances of metamask are closed.
   * Currently used to stop polling in the gasFeeController.
   */


  onClientClosed() {
    try {
      this.gasFeeController.stopPolling();
      this.appStateController.clearPollingTokens();
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * A method that is called by the background when a particular environment type is closed (fullscreen, popup, notification).
   * Currently used to stop polling in the gasFeeController for only that environement type
   */


  onEnvironmentTypeClosed(environmentType) {
    const appStatePollingTokenType = _app.POLLING_TOKEN_ENVIRONMENT_TYPES[environmentType];
    const pollingTokensToDisconnect = this.appStateController.store.getState()[appStatePollingTokenType];
    pollingTokensToDisconnect.forEach(pollingToken => {
      this.gasFeeController.disconnectPoller(pollingToken);
      this.appStateController.removePollingToken(pollingToken, appStatePollingTokenType);
    });
  }
  /**
   * Adds a domain to the PhishingController safelist
   * @param {string} hostname - the domain to safelist
   */


  safelistPhishingDomain(hostname) {
    return this.phishingController.bypass(hostname);
  }
  /**
   * Locks MetaMask
   */


  setLocked() {
    return this.keyringController.setLocked();
  }

}

exports.default = MetamaskController;


}).call(this,require("buffer").Buffer)

//# sourceMappingURL=app/scripts/metamask-controller.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/metamask-controller.js",}],
[1563, {}, function (require, module, exports) {
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

//# sourceMappingURL=node_modules/debounce/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/debounce/index.js",}],
[3384, {"_process":2892,"stream":3353}, function (require, module, exports) {
(function (process){
var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


}).call(this,require('_process'))

//# sourceMappingURL=node_modules/through/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/through/index.js",}],
[1623, {"stream":3353}, function (require, module, exports) {
var Stream = require("stream")
var writeMethods = ["write", "end", "destroy"]
var readMethods = ["resume", "pause"]
var readEvents = ["data", "close"]
var slice = Array.prototype.slice

module.exports = duplex

function forEach (arr, fn) {
    if (arr.forEach) {
        return arr.forEach(fn)
    }

    for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i)
    }
}

function duplex(writer, reader) {
    var stream = new Stream()
    var ended = false

    forEach(writeMethods, proxyWriter)

    forEach(readMethods, proxyReader)

    forEach(readEvents, proxyStream)

    reader.on("end", handleEnd)

    writer.on("drain", function() {
      stream.emit("drain")
    })

    writer.on("error", reemit)
    reader.on("error", reemit)

    stream.writable = writer.writable
    stream.readable = reader.readable

    return stream

    function proxyWriter(methodName) {
        stream[methodName] = method

        function method() {
            return writer[methodName].apply(writer, arguments)
        }
    }

    function proxyReader(methodName) {
        stream[methodName] = method

        function method() {
            stream.emit(methodName)
            var func = reader[methodName]
            if (func) {
                return func.apply(reader, arguments)
            }
            reader.emit(methodName)
        }
    }

    function proxyStream(methodName) {
        reader.on(methodName, reemit)

        function reemit() {
            var args = slice.call(arguments)
            args.unshift(methodName)
            stream.emit.apply(stream, args)
        }
    }

    function handleEnd() {
        if (ended) {
            return
        }
        ended = true
        var args = slice.call(arguments)
        args.unshift("end")
        stream.emit.apply(stream, args)
    }

    function reemit(err) {
        stream.emit("error", err)
    }
}

//# sourceMappingURL=node_modules/duplexer/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/duplexer/index.js",}],
[980, {"stream":3353}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAsStream = void 0;
const stream_1 = require("stream");
class ObservableStoreStream extends stream_1.Duplex {
    constructor(obsStore) {
        super({
            // pass values, not serializations
            objectMode: true,
        });
        // dont buffer outgoing updates
        this.resume();
        // save handler so we can unsubscribe later
        this.handler = (state) => this.push(state);
        // subscribe to obsStore changes
        this.obsStore = obsStore;
        this.obsStore.subscribe(this.handler);
    }
    // emit current state on new destination
    pipe(dest, options) {
        const result = super.pipe(dest, options);
        dest.write(this.obsStore.getState());
        return result;
    }
    // write from incoming stream to state
    _write(chunk, _encoding, callback) {
        this.obsStore.putState(chunk);
        callback();
    }
    // noop - outgoing stream is asking us if we have data we arent giving it
    _read(_size) {
        return undefined;
    }
    // unsubscribe from event emitter
    _destroy(err, callback) {
        this.obsStore.unsubscribe(this.handler);
        super._destroy(err, callback);
    }
}
function storeAsStream(obsStore) {
    return new ObservableStoreStream(obsStore);
}
exports.storeAsStream = storeAsStream;
//# sourceMappingURL=asStream.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/asStream.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/asStream.js",}],
[976, {"./ObservableStore":979}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedStore = void 0;
const ObservableStore_1 = require("./ObservableStore");
class ComposedStore extends ObservableStore_1.ObservableStore {
    constructor(children) {
        super();
        // set default state
        const state = this.getState();
        if (!state) {
            this.putState({});
        }
        // subscribe to children
        this._children = children || {};
        Object.keys(this._children).forEach((childKey) => {
            const child = this._children[childKey];
            this._addChild(childKey, child);
        });
    }
    _addChild(childKey, child) {
        const updateFromChild = (childValue) => {
            const state = this.getState();
            state[childKey] = childValue;
            this.putState(state);
        };
        child.subscribe(updateFromChild);
        updateFromChild(child.getState());
    }
}
exports.ComposedStore = ComposedStore;
//# sourceMappingURL=ComposedStore.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/ComposedStore.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/ComposedStore.js",}],
[978, {"./ObservableStore":979}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergedStore = void 0;
const ObservableStore_1 = require("./ObservableStore");
class MergedStore extends ObservableStore_1.ObservableStore {
    constructor(children = []) {
        super();
        // set default state
        const state = this.getState();
        if (!state) {
            this.putState({});
        }
        this._children = children;
        // subscribe to children
        children.forEach((child) => this._addChild(child));
        this._updateWholeState();
    }
    _addChild(child) {
        child.subscribe(() => this._updateWholeState());
    }
    _updateWholeState() {
        const childStates = this._children.map((child) => child.getState());
        // apply shallow merge over states
        const state = Object.assign({}, ...childStates);
        this.putState(state);
    }
}
exports.MergedStore = MergedStore;
//# sourceMappingURL=MergedStore.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/MergedStore.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/MergedStore.js",}],
[977, {"./ObservableStore":979}, function (require, module, exports) {
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageStore = void 0;
const ObservableStore_1 = require("./ObservableStore");
class LocalStorageStore extends ObservableStore_1.ObservableStore {
    constructor(opts = {}) {
        if (!global.localStorage) {
            throw new Error('LocalStorageStore - can\'t find localStorage.');
        }
        super();
        if (!opts.storageKey) {
            throw new Error('LocalStorageStore - no storageKey specified.');
        }
        this._storageKey = opts.storageKey;
    }
    //
    // private
    //
    // read from persistence
    _getState() {
        const serialized = global.localStorage.getItem(this._storageKey);
        return serialized ? JSON.parse(serialized) : undefined;
    }
    // write to persistence
    _putState(newState) {
        const serialized = JSON.stringify(newState);
        return global.localStorage.setItem(this._storageKey, serialized);
    }
}
exports.LocalStorageStore = LocalStorageStore;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=node_modules/@metamask/obs-store/dist/LocalStorageStore.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/LocalStorageStore.js",}],
[979, {"@metamask/safe-event-emitter":984}, function (require, module, exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableStore = void 0;
const safe_event_emitter_1 = __importDefault(require("@metamask/safe-event-emitter"));
class ObservableStore extends safe_event_emitter_1.default {
    constructor(initState = {}) {
        super();
        // set init state
        this._state = initState;
    }
    // wrapper around internal getState
    getState() {
        return this._getState();
    }
    // wrapper around internal putState
    putState(newState) {
        this._putState(newState);
        this.emit('update', newState);
    }
    updateState(partialState) {
        // if non-null object, merge
        if (partialState && typeof partialState === 'object') {
            const state = this.getState();
            const newState = Object.assign({}, state, partialState);
            this.putState(newState);
            // if not object, use new value
        }
        else {
            this.putState(partialState);
        }
    }
    // subscribe to changes
    subscribe(handler) {
        this.on('update', handler);
    }
    // unsubscribe to changes
    unsubscribe(handler) {
        this.removeListener('update', handler);
    }
    //
    // private
    //
    // read from persistence
    _getState() {
        return this._state;
    }
    // write to persistence
    _putState(newState) {
        this._state = newState;
    }
}
exports.ObservableStore = ObservableStore;
//# sourceMappingURL=ObservableStore.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/ObservableStore.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/ObservableStore.js",}],
[982, {"through2":983}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTransformStream = void 0;
const through2_1 = require("through2");
function storeTransformStream(syncTransformFn) {
    return through2_1.obj((state, _encoding, cb) => {
        try {
            const newState = syncTransformFn(state);
            cb(null, newState);
            return undefined;
        }
        catch (err) {
            cb(err);
            return undefined;
        }
    });
}
exports.storeTransformStream = storeTransformStream;
//# sourceMappingURL=transform.js.map
//# sourceMappingURL=node_modules/@metamask/obs-store/dist/transform.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/dist/transform.js",}],
[82, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 4;
var _default = {
  version,

  migrate(versionedData) {
    const safeVersionedData = (0, _lodash.cloneDeep)(versionedData);
    safeVersionedData.meta.version = version;

    try {
      if (safeVersionedData.data.config.provider.type !== 'rpc') {
        return Promise.resolve(safeVersionedData);
      }

      switch (safeVersionedData.data.config.provider.rpcTarget) {
        case 'https://testrpc.metamask.io/':
          safeVersionedData.data.config.provider = {
            type: 'testnet'
          };
          break;

        case 'https://rpc.metamask.io/':
          safeVersionedData.data.config.provider = {
            type: 'mainnet'
          };
          break;
        // No default
      }
    } catch (_) {// empty
    }

    return Promise.resolve(safeVersionedData);
  }

};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/004.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/004.js",}],
[80, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 2;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      if (versionedData.data.config.provider.type === 'etherscan') {
        versionedData.data.config.provider.type = 'rpc';
        versionedData.data.config.provider.rpcTarget = 'https://rpc.metamask.io/';
      }
    } catch (_) {// empty
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/002.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/002.js",}],
[81, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 3;
const oldTestRpc = 'https://rawtestrpc.metamask.io/';
const newTestRpc = 'https://testrpc.metamask.io/';
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      if (versionedData.data.config.provider.rpcTarget === oldTestRpc) {
        versionedData.data.config.provider.rpcTarget = newTestRpc;
      }
    } catch (_) {// empty
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/003.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/003.js",}],
[89, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration removes the discaimer state from our app, which was integrated into our notices.

*/
const version = 11;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  delete newState.TOSHash;
  delete newState.isDisclaimerConfirmed;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/011.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/011.js",}],
[87, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration breaks out the CurrencyController substate

*/
const version = 9;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = (0, _lodash.merge)({}, state, {
    CurrencyController: {
      currentCurrency: state.currentFiat || state.fiatCurrency || 'USD',
      conversionRate: state.conversionRate,
      conversionDate: state.conversionDate
    }
  });
  delete newState.currentFiat;
  delete newState.fiatCurrency;
  delete newState.conversionRate;
  delete newState.conversionDate;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/009.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/009.js",}],
[92, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration removes provider from config and moves it too NetworkController.

*/
const version = 14;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  newState.NetworkController = {};
  newState.NetworkController.provider = newState.config.provider;
  delete newState.config.provider;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/014.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/014.js",}],
[94, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration sets transactions with the 'Gave up submitting tx.' err message
to a 'failed' stated

*/
const version = 16;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      if (!txMeta.err) {
        return txMeta;
      }

      if (txMeta.err === 'transaction with the same hash was already imported.') {
        txMeta.status = _transaction.TRANSACTION_STATUSES.SUBMITTED;
        delete txMeta.err;
      }

      return txMeta;
    });
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/016.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/016.js",}],
[93, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration sets transactions with the 'Gave up submitting tx.' err message
to a 'failed' stated

*/
const version = 15;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      if (!txMeta.err) {
        return txMeta;
      } else if (txMeta.err.message === 'Gave up submitting tx.') {
        txMeta.status = _transaction.TRANSACTION_STATUSES.FAILED;
      }

      return txMeta;
    });
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/015.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/015.js",}],
[88, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration breaks out the ShapeShiftController substate

*/
const version = 10;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = (0, _lodash.merge)({}, state, {
    ShapeShiftController: {
      shapeShiftTxList: state.shapeShiftTxList || []
    }
  });
  delete newState.shapeShiftTxList;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/010.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/010.js",}],
[99, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration removes the BlackListController from disk state

*/
const version = 21;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  delete newState.BlacklistController;
  delete newState.RecentBlocks;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/021.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/021.js",}],
[95, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration sets transactions who were retried and marked as failed to submitted

*/
const version = 17;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      if (!txMeta.status === _transaction.TRANSACTION_STATUSES.FAILED) {
        return txMeta;
      }

      if (txMeta.retryCount > 0 && txMeta.retryCount < 2) {
        txMeta.status = _transaction.TRANSACTION_STATUSES.SUBMITTED;
        delete txMeta.err;
      }

      return txMeta;
    });
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/017.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/017.js",}],
[90, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration modifies our notices to delete their body after being read.

*/
const version = 12;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  newState.NoticeController.noticesList.forEach(notice => {
    if (notice.read) {
      notice.body = '';
    }
  });
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/012.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/012.js",}],
[102, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration ensures that the from address in txParams is to lower case for
all unapproved transactions

*/
const version = 24;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (!newState.TransactionController) {
    return newState;
  }

  const {
    transactions
  } = newState.TransactionController;
  newState.TransactionController.transactions = transactions.map((txMeta, _) => {
    if (txMeta.status === _transaction.TRANSACTION_STATUSES.UNAPPROVED && txMeta.txParams && txMeta.txParams.from) {
      txMeta.txParams.from = txMeta.txParams.from.toLowerCase();
    }

    return txMeta;
  });
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/024.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/024.js",}],
[101, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration removes transactions that are no longer usefull down to 40 total

*/
const version = 23;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;

    if (transactions.length <= 40) {
      return newState;
    }

    const reverseTxList = transactions.reverse();
    let stripping = true;

    while (reverseTxList.length > 40 && stripping) {
      const txIndex = reverseTxList.findIndex(txMeta => {
        return txMeta.status === _transaction.TRANSACTION_STATUSES.FAILED || txMeta.status === _transaction.TRANSACTION_STATUSES.REJECTED || txMeta.status === _transaction.TRANSACTION_STATUSES.CONFIRMED || txMeta.status === _transaction.TRANSACTION_STATUSES.DROPPED;
      });

      if (txIndex < 0) {
        stripping = false;
      } else {
        reverseTxList.splice(txIndex, 1);
      }
    }

    newState.TransactionController.transactions = reverseTxList.reverse();
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/023.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/023.js",}],
[91, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration modifies the network config from ambiguous 'testnet' to explicit 'ropsten'

*/
const version = 13;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    config
  } = newState;

  if (config && config.provider) {
    if (config.provider.type === 'testnet') {
      newState.config.provider.type = 'ropsten';
    }
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/013.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/013.js",}],
[100, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration adds submittedTime to the txMeta if it is not their

*/
const version = 22;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      if (txMeta.status !== _transaction.TRANSACTION_STATUSES.SUBMITTED || txMeta.submittedTime) {
        return txMeta;
      }

      txMeta.submittedTime = new Date().getTime();
      return txMeta;
    });
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/022.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/022.js",}],
[104, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration moves the identities stored in the KeyringController
 into the PreferencesController

*/
const version = 26;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      versionedData.data = transformState(state);
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
      return Promise.reject(err);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  if (!state.KeyringController || !state.PreferencesController) {
    return state;
  }

  if (!state.KeyringController.walletNicknames) {
    return state;
  }

  state.PreferencesController.identities = Object.keys(state.KeyringController.walletNicknames).reduce((identities, address) => {
    identities[address] = {
      name: state.KeyringController.walletNicknames[address],
      address
    };
    return identities;
  }, {});
  delete state.KeyringController.walletNicknames;
  return state;
}

//# sourceMappingURL=app/scripts/migrations/026.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/026.js",}],
[106, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

// next version number

/*

normalizes txParams on unconfirmed txs

*/
const version = 28;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (newState.PreferencesController) {
    if (newState.PreferencesController.tokens && newState.PreferencesController.identities) {
      const {
        identities,
        tokens
      } = newState.PreferencesController;
      newState.PreferencesController.accountTokens = {};
      Object.keys(identities).forEach(identity => {
        newState.PreferencesController.accountTokens[identity] = {
          mainnet: tokens
        };
      });
      newState.PreferencesController.tokens = [];
    }
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/028.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/028.js",}],
[108, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

// next version number

/*

removes invalid chaids from preferences and networkController for custom rpcs

*/
const version = 30;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (state.PreferencesController) {
    const {
      frequentRpcListDetail
    } = newState.PreferencesController;

    if (frequentRpcListDetail) {
      frequentRpcListDetail.forEach((rpc, index) => {
        // eslint-disable-next-line radix
        if (Boolean(rpc.chainId) && Number.isNaN(parseInt(rpc.chainId))) {
          delete frequentRpcListDetail[index].chainId;
        }
      });
      newState.PreferencesController.frequentRpcListDetail = frequentRpcListDetail;
    }
  }

  if (state.NetworkController) {
    if (newState.NetworkController.network && // eslint-disable-next-line radix
    Number.isNaN(parseInt(newState.NetworkController.network))) {
      delete newState.NetworkController.network;
    }

    if (newState.NetworkController.provider && newState.NetworkController.provider.chainId && // eslint-disable-next-line radix
    Number.isNaN(parseInt(newState.NetworkController.provider.chainId))) {
      delete newState.NetworkController.provider.chainId;
    }
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/030.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/030.js",}],
[110, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 32;
/**
 * The purpose of this migration is to set the {@code completedUiMigration} flag based on the user's UI preferences
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    PreferencesController
  } = state;

  if (PreferencesController) {
    const {
      betaUI
    } = PreferencesController.featureFlags || {}; // Users who have been using the "beta" UI are considered to have completed the migration
    // as they'll see no difference in this version

    PreferencesController.completedUiMigration = betaUI;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/032.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/032.js",}],
[109, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

// next version number
const version = 31;
/*
 * The purpose of this migration is to properly set the completedOnboarding flag based on the state
 * of the KeyringController.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    KeyringController,
    PreferencesController
  } = state;

  if (KeyringController && PreferencesController) {
    const {
      vault
    } = KeyringController;
    PreferencesController.completedOnboarding = Boolean(vault);
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/031.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/031.js",}],
[105, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

// next version number

/*

normalizes txParams on unconfirmed txs

*/
const version = 27;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (newState.TransactionController) {
    if (newState.TransactionController.transactions) {
      const {
        transactions
      } = newState.TransactionController;
      newState.TransactionController.transactions = transactions.filter(txMeta => txMeta.status !== _transaction.TRANSACTION_STATUSES.REJECTED);
    }
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/027.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/027.js",}],
[114, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 36;
/**
 * The purpose of this migration is to remove the {@code privacyMode} feature flag.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    PreferencesController
  } = state;

  if (PreferencesController) {
    const featureFlags = PreferencesController.featureFlags || {};

    if (typeof featureFlags.privacyMode !== 'undefined') {
      delete featureFlags.privacyMode;
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/036.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/036.js",}],
[103, {"../../../shared/constants/transaction":3599,"../lib/util":78,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _util = require("../lib/util");

var _transaction = require("../../../shared/constants/transaction");

// next version number

/*

normalizes txParams on unconfirmed txs

*/
const version = 25;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (newState.TransactionController) {
    if (newState.TransactionController.transactions) {
      const {
        transactions
      } = newState.TransactionController;
      newState.TransactionController.transactions = transactions.map(txMeta => {
        if (txMeta.status !== _transaction.TRANSACTION_STATUSES.UNAPPROVED) {
          return txMeta;
        }

        txMeta.txParams = normalizeTxParams(txMeta.txParams);
        return txMeta;
      });
    }
  }

  return newState;
}

function normalizeTxParams(txParams) {
  // functions that handle normalizing of that key in txParams
  const whiteList = {
    from: from => (0, _util.addHexPrefix)(from).toLowerCase(),
    to: () => (0, _util.addHexPrefix)(txParams.to).toLowerCase(),
    nonce: nonce => (0, _util.addHexPrefix)(nonce),
    value: value => (0, _util.addHexPrefix)(value),
    data: data => (0, _util.addHexPrefix)(data),
    gas: gas => (0, _util.addHexPrefix)(gas),
    gasPrice: gasPrice => (0, _util.addHexPrefix)(gasPrice)
  }; // apply only keys in the whiteList

  const normalizedTxParams = {};
  Object.keys(whiteList).forEach(key => {
    if (txParams[key]) {
      normalizedTxParams[key] = whiteList[key](txParams[key]);
    }
  });
  return normalizedTxParams;
}

//# sourceMappingURL=app/scripts/migrations/025.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/025.js",}],
[112, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 34;
/**
 * The purpose of this migration is to enable the {@code privacyMode} feature flag and set the user as being migrated
 * if it was {@code false}.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    PreferencesController
  } = state;

  if (PreferencesController) {
    const featureFlags = PreferencesController.featureFlags || {};

    if (!featureFlags.privacyMode && typeof PreferencesController.migratedPrivacyMode === 'undefined') {
      // Mark the state has being migrated and enable Privacy Mode
      PreferencesController.migratedPrivacyMode = true;
      featureFlags.privacyMode = true;
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/034.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/034.js",}],
[98, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/*

This migration ensures previous installations
get a `firstTimeInfo` key on the metamask state,
so that we can version notices in the future.

*/
const version = 20;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if ('metamask' in newState && !('firstTimeInfo' in newState.metamask)) {
    newState.metamask.firstTimeInfo = {
      version: '3.12.0',
      date: Date.now()
    };
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/020.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/020.js",}],
[113, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

// next version number

/*

Removes the deprecated 'seedWords' state

*/
const version = 35;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    versionedData.data = transformState(versionedData.data);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (state.PreferencesController && state.PreferencesController.seedWords !== undefined) {
    delete state.PreferencesController.seedWords;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/035.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/035.js",}],
[117, {"../../../shared/modules/hexstring-utils":3604,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _hexstringUtils = require("../../../shared/modules/hexstring-utils");

const version = 39;
const DAI_V1_CONTRACT_ADDRESS = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359';
const DAI_V1_TOKEN_SYMBOL = 'DAI';
const SAI_TOKEN_SYMBOL = 'SAI';

function isOldDai(token = {}) {
  return token && typeof token === 'object' && token.symbol === DAI_V1_TOKEN_SYMBOL && (0, _hexstringUtils.toChecksumHexAddress)(token.address) === DAI_V1_CONTRACT_ADDRESS;
}
/**
 * This migration renames the Dai token to Sai.
 *
 * As of 2019-11-18 Dai is now called Sai (refs https://git.io/JeooP) to facilitate
 * Maker's upgrade to Multi-Collateral Dai and this migration renames the token
 * at the old address.
 */


var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    PreferencesController
  } = state;

  if (PreferencesController) {
    const tokens = PreferencesController.tokens || [];

    if (Array.isArray(tokens)) {
      for (const token of tokens) {
        if (isOldDai(token)) {
          token.symbol = SAI_TOKEN_SYMBOL;
        }
      }
    }

    const accountTokens = PreferencesController.accountTokens || {};

    if (accountTokens && typeof accountTokens === 'object') {
      for (const address of Object.keys(accountTokens)) {
        const networkTokens = accountTokens[address];

        if (networkTokens && typeof networkTokens === 'object') {
          for (const network of Object.keys(networkTokens)) {
            const tokensOnNetwork = networkTokens[network];

            if (Array.isArray(tokensOnNetwork)) {
              for (const token of tokensOnNetwork) {
                if (isOldDai(token)) {
                  token.symbol = SAI_TOKEN_SYMBOL;
                }
              }
            }
          }
        }
      }
    }
  }

  return state;
}


//# sourceMappingURL=app/scripts/migrations/039.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/039.js",}],
[111, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

// next version number

/*

Cleans up notices and assocated notice controller code

*/
const version = 33;
var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state; // transform state here

  if (state.NoticeController) {
    delete newState.NoticeController;
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/033.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/033.js",}],
[118, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 40;
/**
 * Site connections are now managed by the PermissionsController, and the
 * ProviderApprovalController is removed. This migration deletes all
 * ProviderApprovalController state.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  delete state.ProviderApprovalController;
  return state;
}

//# sourceMappingURL=app/scripts/migrations/040.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/040.js",}],
[119, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 41;
/**
 * PreferencesController.autoLogoutTimeLimit -> autoLockTimeLimit
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (state.PreferencesController && state.PreferencesController.preferences) {
    state.PreferencesController.preferences.autoLockTimeLimit = state.PreferencesController.preferences.autoLogoutTimeLimit;
    delete state.PreferencesController.preferences.autoLogoutTimeLimit;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/041.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/041.js",}],
[123, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 45;
/**
 * Replaces {@code PreferencesController.ipfsGateway} with 'dweb.link' if set
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;
const outdatedGateways = ['ipfs.io', 'ipfs.dweb.link'];

function transformState(state) {
  var _state$PreferencesCon;

  if (outdatedGateways.includes(state === null || state === void 0 ? void 0 : (_state$PreferencesCon = state.PreferencesController) === null || _state$PreferencesCon === void 0 ? void 0 : _state$PreferencesCon.ipfsGateway)) {
    state.PreferencesController.ipfsGateway = 'dweb.link';
  }

  return state;
}


//# sourceMappingURL=app/scripts/migrations/045.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/045.js",}],
[127, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 49;
/**
 * Migrate metaMetrics state to the new MetaMetrics controller
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state = {}) {
  if (state.PreferencesController) {
    var _state$MetaMetricsCon;

    const {
      metaMetricsId,
      participateInMetaMetrics,
      metaMetricsSendCount
    } = state.PreferencesController;
    state.MetaMetricsController = (_state$MetaMetricsCon = state.MetaMetricsController) !== null && _state$MetaMetricsCon !== void 0 ? _state$MetaMetricsCon : {};

    if (metaMetricsId !== undefined) {
      state.MetaMetricsController.metaMetricsId = metaMetricsId;
      delete state.PreferencesController.metaMetricsId;
    }

    if (participateInMetaMetrics !== undefined) {
      state.MetaMetricsController.participateInMetaMetrics = participateInMetaMetrics;
      delete state.PreferencesController.participateInMetaMetrics;
    }

    if (metaMetricsSendCount !== undefined) {
      state.MetaMetricsController.metaMetricsSendCount = metaMetricsSendCount;
      delete state.PreferencesController.metaMetricsSendCount;
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/049.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/049.js",}],
[121, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 43;
/**
 * Remove unused 'currentAccountTab' state
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$PreferencesCon;

  if (state !== null && state !== void 0 && (_state$PreferencesCon = state.PreferencesController) !== null && _state$PreferencesCon !== void 0 && _state$PreferencesCon.currentAccountTab) {
    delete state.PreferencesController.currentAccountTab;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/043.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/043.js",}],
[120, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 42;
/**
 * Initialize `connectedStatusPopoverHasBeenShown` to `false` if it hasn't yet been set,
 * so that existing users are introduced to the new connected status indicator
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (state.AppStateController) {
    state.AppStateController.connectedStatusPopoverHasBeenShown = false;
  } else {
    state.AppStateController = {
      connectedStatusPopoverHasBeenShown: false
    };
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/042.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/042.js",}],
[129, {"../../../shared/constants/network":3595,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _network = require("../../../shared/constants/network");

const version = 51;
/**
 * Set the chainId in the Network Controller provider data for all infura networks
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$NetworkControl, _NETWORK_TYPE_TO_ID_M;

  const {
    chainId,
    type
  } = (state === null || state === void 0 ? void 0 : (_state$NetworkControl = state.NetworkController) === null || _state$NetworkControl === void 0 ? void 0 : _state$NetworkControl.provider) || {};
  const enumChainId = (_NETWORK_TYPE_TO_ID_M = _network.NETWORK_TYPE_TO_ID_MAP[type]) === null || _NETWORK_TYPE_TO_ID_M === void 0 ? void 0 : _NETWORK_TYPE_TO_ID_M.chainId;

  if (enumChainId && chainId !== enumChainId) {
    state.NetworkController.provider.chainId = enumChainId;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/051.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/051.js",}],
[122, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 44;
/**
 * Remove unused 'mkrMigrationReminderTimestamp' state from the `AppStateController`
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$AppStateContro;

  if (typeof (state === null || state === void 0 ? void 0 : (_state$AppStateContro = state.AppStateController) === null || _state$AppStateContro === void 0 ? void 0 : _state$AppStateContro.mkrMigrationReminderTimestamp) !== 'undefined') {
    delete state.AppStateController.mkrMigrationReminderTimestamp;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/044.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/044.js",}],
[124, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 46;
/**
 * Delete {@code ABTestController} state
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (typeof (state === null || state === void 0 ? void 0 : state.ABTestController) !== 'undefined') {
    delete state.ABTestController;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/046.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/046.js",}],
[125, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 47;
/**
 * Stringify the `metamaskNetworkId` property of all transactions
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$TransactionCon;

  const transactions = state === null || state === void 0 ? void 0 : (_state$TransactionCon = state.TransactionController) === null || _state$TransactionCon === void 0 ? void 0 : _state$TransactionCon.transactions;

  if (Array.isArray(transactions)) {
    transactions.forEach(transaction => {
      if (typeof transaction.metamaskNetworkId === 'number') {
        transaction.metamaskNetworkId = transaction.metamaskNetworkId.toString();
      }
    });
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/047.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/047.js",}],
[136, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 58;
/**
 * Deletes the swapsWelcomeMessageHasBeenShown property from state
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$AppStateContro;

  (_state$AppStateContro = state.AppStateController) === null || _state$AppStateContro === void 0 ? true : delete _state$AppStateContro.swapsWelcomeMessageHasBeenShown;
  return state;
}

//# sourceMappingURL=app/scripts/migrations/058.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/058.js",}],
[128, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 50;
const LEGACY_LOCAL_STORAGE_KEYS = ['METASWAP_GAS_PRICE_ESTIMATES_LAST_RETRIEVED', 'METASWAP_GAS_PRICE_ESTIMATES', 'cachedFetch', 'BASIC_PRICE_ESTIMATES_LAST_RETRIEVED', 'BASIC_PRICE_ESTIMATES', 'BASIC_GAS_AND_TIME_API_ESTIMATES', 'BASIC_GAS_AND_TIME_API_ESTIMATES_LAST_RETRIEVED', 'GAS_API_ESTIMATES_LAST_RETRIEVED', 'GAS_API_ESTIMATES'];
/**
 * Migrate metaMetrics state to the new MetaMetrics controller
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    LEGACY_LOCAL_STORAGE_KEYS.forEach(key => {
      var _window$localStorage;

      return (_window$localStorage = window.localStorage) === null || _window$localStorage === void 0 ? void 0 : _window$localStorage.removeItem(key);
    });
    return versionedData;
  }

};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/050.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/050.js",}],
[133, {"../../../shared/constants/network":3595,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _network = require("../../../shared/constants/network");

const version = 55;
/**
 * replace 'incomingTxLastFetchedBlocksByNetwork' with 'incomingTxLastFetchedBlockByChainId'
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;
const UNKNOWN_CHAIN_ID_KEY = 'UNKNOWN';

function transformState(state) {
  var _state$IncomingTransa;

  if (state !== null && state !== void 0 && (_state$IncomingTransa = state.IncomingTransactionsController) !== null && _state$IncomingTransa !== void 0 && _state$IncomingTransa.incomingTxLastFetchedBlocksByNetwork) {
    state.IncomingTransactionsController.incomingTxLastFetchedBlockByChainId = (0, _lodash.mapKeys)(state.IncomingTransactionsController.incomingTxLastFetchedBlocksByNetwork, // using optional chaining in case user's state has fetched blocks for
    // RPC network types (which don't map to a single chainId). This should
    // not be possible, but it's safer
    (_, key) => {
      var _NETWORK_TYPE_TO_ID_M, _NETWORK_TYPE_TO_ID_M2;

      return (_NETWORK_TYPE_TO_ID_M = (_NETWORK_TYPE_TO_ID_M2 = _network.NETWORK_TYPE_TO_ID_MAP[key]) === null || _NETWORK_TYPE_TO_ID_M2 === void 0 ? void 0 : _NETWORK_TYPE_TO_ID_M2.chainId) !== null && _NETWORK_TYPE_TO_ID_M !== void 0 ? _NETWORK_TYPE_TO_ID_M : UNKNOWN_CHAIN_ID_KEY;
    }); // Now that mainnet and test net last fetched blocks are keyed by their
    // respective chainIds, we can safely delete anything we had for custom
    // networks. Any custom network that shares a chainId with one of the
    // aforementioned networks will use the value stored by chainId.

    delete state.IncomingTransactionsController.incomingTxLastFetchedBlockByChainId[UNKNOWN_CHAIN_ID_KEY];
    delete state.IncomingTransactionsController.incomingTxLastFetchedBlocksByNetwork;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/055.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/055.js",}],
[134, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 56;
/**
 * Remove tokens that don't have an address due to
 * lack of previous addToken validation.  Also removes
 * an unwanted, undefined image property
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const {
      PreferencesController
    } = versionedData.data;

    if (Array.isArray(PreferencesController === null || PreferencesController === void 0 ? void 0 : PreferencesController.tokens)) {
      PreferencesController.tokens = PreferencesController.tokens.filter(({
        address
      }) => address);
    }

    if (PreferencesController !== null && PreferencesController !== void 0 && PreferencesController.accountTokens && typeof PreferencesController.accountTokens === 'object') {
      Object.keys(PreferencesController.accountTokens).forEach(account => {
        const chains = Object.keys(PreferencesController.accountTokens[account]);
        chains.forEach(chain => {
          PreferencesController.accountTokens[account][chain] = PreferencesController.accountTokens[account][chain].filter(({
            address
          }) => address);
        });
      });
    }

    if (PreferencesController !== null && PreferencesController !== void 0 && PreferencesController.assetImages && 'undefined' in PreferencesController.assetImages) {
      delete PreferencesController.assetImages.undefined;
    }

    return versionedData;
  }

};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/056.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/056.js",}],
[130, {"../../../shared/constants/network":3595,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _network = require("../../../shared/constants/network");

const version = 52;
/**
 * Migrate tokens in Preferences to be keyed by chainId instead of
 * providerType. To prevent breaking user's MetaMask and selected
 * tokens, this migration copies the RPC entry into *every* custom RPC
 * chainId.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state = {}) {
  if (state.PreferencesController) {
    const {
      accountTokens,
      accountHiddenTokens,
      frequentRpcListDetail
    } = state.PreferencesController;
    const newAccountTokens = {};
    const newAccountHiddenTokens = {};

    if (accountTokens && Object.keys(accountTokens).length > 0) {
      for (const address of Object.keys(accountTokens)) {
        newAccountTokens[address] = {};

        if (accountTokens[address][_network.NETWORK_TYPE_RPC]) {
          frequentRpcListDetail.forEach(detail => {
            newAccountTokens[address][detail.chainId] = accountTokens[address][_network.NETWORK_TYPE_RPC];
          });
        }

        for (const providerType of Object.keys(accountTokens[address])) {
          switch (providerType) {
            case _network.MAINNET:
              newAccountTokens[address][_network.MAINNET_CHAIN_ID] = accountTokens[address][_network.MAINNET];
              break;

            case _network.ROPSTEN:
              newAccountTokens[address][_network.ROPSTEN_CHAIN_ID] = accountTokens[address][_network.ROPSTEN];
              break;

            case _network.RINKEBY:
              newAccountTokens[address][_network.RINKEBY_CHAIN_ID] = accountTokens[address][_network.RINKEBY];
              break;

            case _network.GOERLI:
              newAccountTokens[address][_network.GOERLI_CHAIN_ID] = accountTokens[address][_network.GOERLI];
              break;

            case _network.KOVAN:
              newAccountTokens[address][_network.KOVAN_CHAIN_ID] = accountTokens[address][_network.KOVAN];
              break;

            case _network.MONSTA:
              newAccountTokens[address][_network.MONSTA_CHAIN_ID] = accountTokens[address][_network.MONSTA];
              break;

            default:
              break;
          }
        }
      }

      state.PreferencesController.accountTokens = newAccountTokens;
    }

    if (accountHiddenTokens && Object.keys(accountHiddenTokens).length > 0) {
      for (const address of Object.keys(accountHiddenTokens)) {
        newAccountHiddenTokens[address] = {};

        if (accountHiddenTokens[address][_network.NETWORK_TYPE_RPC]) {
          frequentRpcListDetail.forEach(detail => {
            newAccountHiddenTokens[address][detail.chainId] = accountHiddenTokens[address][_network.NETWORK_TYPE_RPC];
          });
        }

        for (const providerType of Object.keys(accountHiddenTokens[address])) {
          switch (providerType) {
            case _network.MAINNET:
              newAccountHiddenTokens[address][_network.MAINNET_CHAIN_ID] = accountHiddenTokens[address][_network.MAINNET];
              break;

            case _network.ROPSTEN:
              newAccountHiddenTokens[address][_network.ROPSTEN_CHAIN_ID] = accountHiddenTokens[address][_network.ROPSTEN];
              break;

            case _network.RINKEBY:
              newAccountHiddenTokens[address][_network.RINKEBY_CHAIN_ID] = accountHiddenTokens[address][_network.RINKEBY];
              break;

            case _network.GOERLI:
              newAccountHiddenTokens[address][_network.GOERLI_CHAIN_ID] = accountHiddenTokens[address][_network.GOERLI];
              break;

            case _network.KOVAN:
              newAccountHiddenTokens[address][_network.KOVAN_CHAIN_ID] = accountHiddenTokens[address][_network.KOVAN];
              break;

            case _network.MONSTA:
              newAccountHiddenTokens[address][_network.MONSTA_CHAIN_ID] = accountHiddenTokens[address][_network.MONSTA];
              break;

            default:
              break;
          }
        }
      }

      state.PreferencesController.accountHiddenTokens = newAccountHiddenTokens;
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/052.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/052.js",}],
[139, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 61;
/**
 * Initialize attributes related to recovery seed phrase reminder
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const currentTime = new Date().getTime();

  if (state.AppStateController) {
    state.AppStateController.recoveryPhraseReminderHasBeenShown = false;
    state.AppStateController.recoveryPhraseReminderLastShown = currentTime;
  } else {
    state.AppStateController = {
      recoveryPhraseReminderHasBeenShown: false,
      recoveryPhraseReminderLastShown: currentTime
    };
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/061.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/061.js",}],
[138, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 60;
const SUPPORT_NOTIFICATION_KEY = 2;
const SUPPORT_NOTIFICATION_DATE = '2020-08-31';
/**
 * Removes the support survey notification
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$NotificationCo;

  const notifications = state === null || state === void 0 ? void 0 : (_state$NotificationCo = state.NotificationController) === null || _state$NotificationCo === void 0 ? void 0 : _state$NotificationCo.notifications;

  if ((0, _lodash.isPlainObject)(notifications)) {
    var _notifications$SUPPOR;

    if (((_notifications$SUPPOR = notifications[SUPPORT_NOTIFICATION_KEY]) === null || _notifications$SUPPOR === void 0 ? void 0 : _notifications$SUPPOR.date) === SUPPORT_NOTIFICATION_DATE) {
      delete state.NotificationController.notifications[SUPPORT_NOTIFICATION_KEY];
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/060.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/060.js",}],
[132, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 54;

function isValidDecimals(decimals) {
  return typeof decimals === 'number' || typeof decimals === 'string' && decimals.match(/^(0x)?\d+$/u);
}
/**
 * Migrates preference tokens with decimals typed as string to number.
 * It also removes any tokens with corrupted or inconvertible decimal values.
 */


var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;

  if (!newState.PreferencesController) {
    return newState;
  }

  const tokens = newState.PreferencesController.tokens || []; // Filter out any tokens with corrupted decimal values

  const validTokens = tokens.filter(({
    decimals
  }) => isValidDecimals(decimals));

  for (const token of validTokens) {
    // In the case of a decimal value type string, convert to a number.
    if (typeof token.decimals === 'string') {
      // eslint-disable-next-line radix
      token.decimals = parseInt(token.decimals);
    }
  }

  newState.PreferencesController.tokens = validTokens;
  const {
    accountTokens
  } = newState.PreferencesController;

  if (accountTokens && typeof accountTokens === 'object') {
    for (const address of Object.keys(accountTokens)) {
      const networkTokens = accountTokens[address];

      if (networkTokens && typeof networkTokens === 'object') {
        for (const network of Object.keys(networkTokens)) {
          const tokensOnNetwork = networkTokens[network] || []; // Filter out any tokens with corrupted decimal values

          const validTokensOnNetwork = tokensOnNetwork.filter(({
            decimals
          }) => isValidDecimals(decimals)); // In the case of a decimal value type string, convert to a number.

          for (const token of validTokensOnNetwork) {
            if (typeof token.decimals === 'string') {
              // eslint-disable-next-line radix
              token.decimals = parseInt(token.decimals);
            }
          }

          networkTokens[network] = validTokensOnNetwork;
        }
      }
    }
  }

  newState.PreferencesController.accountTokens = accountTokens;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/054.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/054.js",}],
[97, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

/*

This migration sets transactions as failed
whos nonce is too high

*/
const version = 19;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;
    newState.TransactionController.transactions = transactions.map((txMeta, _, txList) => {
      if (txMeta.status !== _transaction.TRANSACTION_STATUSES.SUBMITTED) {
        return txMeta;
      }

      const confirmedTxs = txList.filter(tx => tx.status === _transaction.TRANSACTION_STATUSES.CONFIRMED).filter(tx => tx.txParams.from === txMeta.txParams.from).filter(tx => tx.metamaskNetworkId.from === txMeta.metamaskNetworkId.from);
      const highestConfirmedNonce = getHighestNonce(confirmedTxs);
      const pendingTxs = txList.filter(tx => tx.status === _transaction.TRANSACTION_STATUSES.SUBMITTED).filter(tx => tx.txParams.from === txMeta.txParams.from).filter(tx => tx.metamaskNetworkId.from === txMeta.metamaskNetworkId.from);
      const highestContinuousNonce = getHighestContinuousFrom(pendingTxs, highestConfirmedNonce);
      const maxNonce = Math.max(highestContinuousNonce, highestConfirmedNonce);

      if (parseInt(txMeta.txParams.nonce, 16) > maxNonce + 1) {
        txMeta.status = _transaction.TRANSACTION_STATUSES.FAILED;
        txMeta.err = {
          message: 'nonce too high',
          note: 'migration 019 custom error'
        };
      }

      return txMeta;
    });
  }

  return newState;
}

function getHighestContinuousFrom(txList, startPoint) {
  const nonces = txList.map(txMeta => {
    const {
      nonce
    } = txMeta.txParams;
    return parseInt(nonce, 16);
  });
  let highest = startPoint;

  while (nonces.includes(highest)) {
    highest += 1;
  }

  return highest;
}

function getHighestNonce(txList) {
  const nonces = txList.map(txMeta => {
    const {
      nonce
    } = txMeta.txParams;
    return parseInt(nonce || '0x0', 16);
  });
  const highestNonce = Math.max.apply(null, nonces);
  return highestNonce;
}

//# sourceMappingURL=app/scripts/migrations/019.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/019.js",}],
[142, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

const version = 64;
const SENT_ETHER = 'sentEther'; // the legacy transaction type being replaced in this migration with TRANSACTION_TYPES.SIMPLE_SEND

/**
 * Removes metaMetricsSendCount from MetaMetrics controller
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$TransactionCon;

  const transactions = state === null || state === void 0 ? void 0 : (_state$TransactionCon = state.TransactionController) === null || _state$TransactionCon === void 0 ? void 0 : _state$TransactionCon.transactions;

  if ((0, _lodash.isPlainObject)(transactions)) {
    for (const tx of Object.values(transactions)) {
      if (tx.type === SENT_ETHER) {
        tx.type = _transaction.TRANSACTION_TYPES.SIMPLE_SEND;
      }

      if (tx.history) {
        tx.history.map(txEvent => {
          if (txEvent.type && txEvent.type === SENT_ETHER) {
            txEvent.type = _transaction.TRANSACTION_TYPES.SIMPLE_SEND;
          }

          return txEvent;
        });
      }
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/064.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/064.js",}],
[137, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

const version = 59;
/**
 * Removes orphaned cancel and retry transactions that no longer have the
 * original transaction in state, which results in bugs.
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$TransactionCon;

  const transactions = state === null || state === void 0 ? void 0 : (_state$TransactionCon = state.TransactionController) === null || _state$TransactionCon === void 0 ? void 0 : _state$TransactionCon.transactions;

  if ((0, _lodash.isPlainObject)(transactions)) {
    const nonceNetworkGroupedObject = (0, _lodash.groupBy)(Object.values(transactions), tx => {
      var _tx$txParams, _tx$chainId;

      return `${(_tx$txParams = tx.txParams) === null || _tx$txParams === void 0 ? void 0 : _tx$txParams.nonce}-${(_tx$chainId = tx.chainId) !== null && _tx$chainId !== void 0 ? _tx$chainId : tx.metamaskNetworkId}`;
    });
    const withoutOrphans = (0, _lodash.pickBy)(nonceNetworkGroupedObject, group => {
      return group.some(tx => tx.type !== _transaction.TRANSACTION_TYPES.CANCEL && tx.type !== _transaction.TRANSACTION_TYPES.RETRY);
    });
    state.TransactionController.transactions = (0, _lodash.keyBy)((0, _lodash.concat)(...Object.values(withoutOrphans)), tx => tx.id);
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/059.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/059.js",}],
[140, {"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

const version = 62;
/**
 * Removes metaMetricsSendCount from MetaMetrics controller
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (state.MetaMetricsController) {
    const {
      metaMetricsSendCount
    } = state.MetaMetricsController;

    if (metaMetricsSendCount !== undefined) {
      delete state.MetaMetricsController.metaMetricsSendCount;
    }
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/062.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/062.js",}],
[115, {"@metamask/controllers":878,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _controllers = require("@metamask/controllers");

const version = 37;
/**
 * The purpose of this migration is to update the address book state
 * to the new schema with chainId as a key.
 * and to add the isEns flag to all entries
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  if (state.AddressBookController) {
    const ab = state.AddressBookController.addressBook;
    const chainIds = new Set();
    const newAddressBook = {}; // add all of the chainIds to a set

    Object.values(ab).forEach(v => {
      chainIds.add(v.chainId);
    }); // fill the chainId object with the entries with the matching chainId

    for (const id of chainIds.values()) {
      // make an empty object entry for each chainId
      newAddressBook[id] = {};

      for (const address in ab) {
        if (ab[address].chainId === id) {
          ab[address].isEns = false;

          if (_controllers.util.normalizeEnsName(ab[address].name)) {
            ab[address].isEns = true;
          }

          newAddressBook[id][address] = ab[address];
        }
      }
    }

    state.AddressBookController.addressBook = newAddressBook;
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/037.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/037.js",}],
[84, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 6;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = migrateState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function migrateState(state) {
  const keyringSubstate = state.KeyringController; // add new state

  const newState = _objectSpread(_objectSpread({}, state), {}, {
    PreferencesController: {
      selectedAddress: keyringSubstate.selectedAccount
    }
  }); // rm old state


  delete newState.KeyringController.selectedAccount;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/006.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/006.js",}],
[86, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 8;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = _objectSpread(_objectSpread({}, state), {}, {
    NoticeController: {
      noticesList: state.noticesList || []
    }
  });

  delete newState.noticesList;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/008.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/008.js",}],
[83, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 5;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = selectSubstateForKeyringController(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #5${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function selectSubstateForKeyringController(state) {
  const {
    config
  } = state;

  const newState = _objectSpread(_objectSpread({}, state), {}, {
    KeyringController: {
      vault: state.vault,
      selectedAccount: config.selectedAccount,
      walletNicknames: state.walletNicknames
    }
  });

  delete newState.vault;
  delete newState.walletNicknames;
  delete newState.config.selectedAccount;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/005.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/005.js",}],
[116, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 38;
/**
 * The purpose of this migration is to assign all users to a test group for the fullScreenVsPopup a/b test
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  const {
    ABTestController: ABTestControllerState = {}
  } = state;
  const {
    abTests = {}
  } = ABTestControllerState;

  if (abTests.fullScreenVsPopup) {
    return state;
  }

  return _objectSpread(_objectSpread({}, state), {}, {
    ABTestController: _objectSpread(_objectSpread({}, ABTestControllerState), {}, {
      abTests: _objectSpread(_objectSpread({}, abTests), {}, {
        fullScreenVsPopup: 'control'
      })
    })
  });
}

//# sourceMappingURL=app/scripts/migrations/038.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/038.js",}],
[107, {"../../../shared/constants/transaction":3599,"./fail-tx":143,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _transaction = require("../../../shared/constants/transaction");

var _failTx = _interopRequireDefault(require("./fail-tx"));

// next version number
const version = 29; // time

const seconds = 1000;
const minutes = 60 * seconds;
const hours = 60 * minutes;
const unacceptableDelay = 12 * hours;
/*

normalizes txParams on unconfirmed txs

*/

var _default = {
  version,
  migrate: (0, _failTx.default)(version, 'Stuck in approved state for too long.', txMeta => {
    const isApproved = txMeta.status === _transaction.TRANSACTION_STATUSES.APPROVED;
    const createdTime = txMeta.submittedTime;
    const now = Date.now();
    return isApproved && now - createdTime > unacceptableDelay;
  })
};
exports.default = _default;

//# sourceMappingURL=app/scripts/migrations/029.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/029.js",}],
[131, {"../../../shared/constants/transaction":3599,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 53;
/**
 * Deprecate transactionCategory and consolidate on 'type'
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$TransactionCon, _state$IncomingTransa;

  const transactions = state === null || state === void 0 ? void 0 : (_state$TransactionCon = state.TransactionController) === null || _state$TransactionCon === void 0 ? void 0 : _state$TransactionCon.transactions;
  const incomingTransactions = state === null || state === void 0 ? void 0 : (_state$IncomingTransa = state.IncomingTransactionsController) === null || _state$IncomingTransa === void 0 ? void 0 : _state$IncomingTransa.incomingTransactions;

  if (Array.isArray(transactions)) {
    transactions.forEach(transaction => {
      if (transaction) {
        if (transaction.type !== _transaction.TRANSACTION_TYPES.RETRY && transaction.type !== _transaction.TRANSACTION_TYPES.CANCEL) {
          transaction.type = transaction.transactionCategory;
        }

        delete transaction.transactionCategory;
      }
    });
  }

  if (incomingTransactions) {
    const incomingTransactionsEntries = Object.entries(incomingTransactions);
    incomingTransactionsEntries.forEach(([key, transaction]) => {
      if (transaction) {
        delete transaction.transactionCategory;
        state.IncomingTransactionsController.incomingTransactions[key] = _objectSpread(_objectSpread({}, transaction), {}, {
          type: _transaction.TRANSACTION_TYPES.INCOMING
        });
      }
    });
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/053.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/053.js",}],
[126, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 48;
/**
 * 1.  Delete NetworkController.settings
 * 2a. Migrate NetworkController.provider to Rinkeby if set to type 'rpc' or
 *     'localhost'.
 * 2b. Re-key provider.rpcTarget to provider.rpcUrl
 * 3.  Add localhost network to frequentRpcListDetail.
 * 4.  Delete CachedBalancesController.cachedBalances
 * 5.  Convert transactions metamaskNetworkId to decimal if they are hex
 * 6.  Convert address book keys from decimal to hex
 * 7.  Delete localhost key in IncomingTransactionsController
 * 8.  Merge 'localhost' tokens into 'rpc' tokens
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;
const hexRegEx = /^0x[0-9a-f]+$/iu;
const chainIdRegEx = /^0x[1-9a-f]+[0-9a-f]*$/iu;

function transformState(state = {}) {
  var _state$NetworkControl, _state$NetworkControl2, _state$NetworkControl3, _state$CachedBalances, _state$TransactionCon, _state$AddressBookCon, _state$IncomingTransa, _state$IncomingTransa2, _state$PreferencesCon;

  // 1. Delete NetworkController.settings
  (_state$NetworkControl = state.NetworkController) === null || _state$NetworkControl === void 0 ? true : delete _state$NetworkControl.settings; // 2. Migrate NetworkController.provider to Rinkeby or rename rpcTarget key

  const provider = ((_state$NetworkControl2 = state.NetworkController) === null || _state$NetworkControl2 === void 0 ? void 0 : _state$NetworkControl2.provider) || {};
  const isCustomRpcWithInvalidChainId = provider.type === 'rpc' && (typeof provider.chainId !== 'string' || !chainIdRegEx.test(provider.chainId));

  if (isCustomRpcWithInvalidChainId || provider.type === 'localhost') {
    state.NetworkController.provider = {
      type: 'rinkeby',
      rpcUrl: '',
      chainId: '0x4',
      nickname: '',
      rpcPrefs: {},
      ticker: 'ETH'
    };
  } else if ((_state$NetworkControl3 = state.NetworkController) !== null && _state$NetworkControl3 !== void 0 && _state$NetworkControl3.provider) {
    var _state$NetworkControl4, _state$NetworkControl5;

    if ('rpcTarget' in state.NetworkController.provider) {
      const rpcUrl = state.NetworkController.provider.rpcTarget;
      state.NetworkController.provider.rpcUrl = rpcUrl;
    }

    (_state$NetworkControl4 = state.NetworkController) === null || _state$NetworkControl4 === void 0 ? true : (_state$NetworkControl5 = _state$NetworkControl4.provider) === null || _state$NetworkControl5 === void 0 ? true : delete _state$NetworkControl5.rpcTarget;
  } // 3.  Add localhost network to frequentRpcListDetail.


  if (!state.PreferencesController) {
    state.PreferencesController = {};
  }

  if (!state.PreferencesController.frequentRpcListDetail) {
    state.PreferencesController.frequentRpcListDetail = [];
  }

  state.PreferencesController.frequentRpcListDetail.unshift({
    rpcUrl: 'http://localhost:8545',
    chainId: '0x539',
    ticker: 'ETH',
    nickname: 'Localhost 8545',
    rpcPrefs: {}
  }); // 4.  Delete CachedBalancesController.cachedBalances

  (_state$CachedBalances = state.CachedBalancesController) === null || _state$CachedBalances === void 0 ? true : delete _state$CachedBalances.cachedBalances; // 5.  Convert transactions metamaskNetworkId to decimal if they are hex

  const transactions = (_state$TransactionCon = state.TransactionController) === null || _state$TransactionCon === void 0 ? void 0 : _state$TransactionCon.transactions;

  if (Array.isArray(transactions)) {
    transactions.forEach(transaction => {
      const metamaskNetworkId = transaction === null || transaction === void 0 ? void 0 : transaction.metamaskNetworkId;

      if (typeof metamaskNetworkId === 'string' && hexRegEx.test(metamaskNetworkId)) {
        transaction.metamaskNetworkId = parseInt(metamaskNetworkId, 16).toString(10);
      }
    });
  } // 6.  Convert address book keys from decimal to hex


  const addressBook = ((_state$AddressBookCon = state.AddressBookController) === null || _state$AddressBookCon === void 0 ? void 0 : _state$AddressBookCon.addressBook) || {};
  Object.keys(addressBook).forEach(networkKey => {
    if (/^\d+$/iu.test(networkKey)) {
      const chainId = `0x${parseInt(networkKey, 10).toString(16)}`;
      updateChainIds(addressBook[networkKey], chainId);

      if (addressBook[chainId]) {
        mergeAddressBookKeys(addressBook, networkKey, chainId);
      } else {
        addressBook[chainId] = addressBook[networkKey];
      }

      delete addressBook[networkKey];
    }
  }); // 7.  Delete localhost key in IncomingTransactionsController

  (_state$IncomingTransa = state.IncomingTransactionsController) === null || _state$IncomingTransa === void 0 ? true : (_state$IncomingTransa2 = _state$IncomingTransa.incomingTxLastFetchedBlocksByNetwork) === null || _state$IncomingTransa2 === void 0 ? true : delete _state$IncomingTransa2.localhost; // 8.  Merge 'localhost' tokens into 'rpc' tokens

  const accountTokens = (_state$PreferencesCon = state.PreferencesController) === null || _state$PreferencesCon === void 0 ? void 0 : _state$PreferencesCon.accountTokens;

  if (accountTokens) {
    Object.keys(accountTokens).forEach(account => {
      var _accountTokens$accoun, _accountTokens$accoun2;

      const localhostTokens = ((_accountTokens$accoun = accountTokens[account]) === null || _accountTokens$accoun === void 0 ? void 0 : _accountTokens$accoun.localhost) || [];

      if (localhostTokens.length > 0) {
        const rpcTokens = accountTokens[account].rpc || [];

        if (rpcTokens.length > 0) {
          accountTokens[account].rpc = mergeTokenArrays(localhostTokens, rpcTokens);
        } else {
          accountTokens[account].rpc = localhostTokens;
        }
      }

      (_accountTokens$accoun2 = accountTokens[account]) === null || _accountTokens$accoun2 === void 0 ? true : delete _accountTokens$accoun2.localhost;
    });
  }

  return state;
}
/**
 * Merges the two given keys for the given address book in place.
 *
 * @returns {void}
 */


function mergeAddressBookKeys(addressBook, networkKey, chainIdKey) {
  const networkKeyEntries = addressBook[networkKey] || {}; // For the new entries, start by copying the existing entries for the chainId

  const newEntries = _objectSpread({}, addressBook[chainIdKey]); // For each address of the old/networkId key entries


  Object.keys(networkKeyEntries).forEach(address => {
    if (newEntries[address] && typeof newEntries[address] === 'object') {
      const mergedEntry = {}; // Collect all keys from both entries and merge the corresponding chainId
      // entry with the networkId entry

      new Set([...Object.keys(newEntries[address]), ...Object.keys(networkKeyEntries[address] || {})]).forEach(key => {
        var _networkKeyEntries$ad;

        // Use non-empty value for the current key, if any
        mergedEntry[key] = newEntries[address][key] || ((_networkKeyEntries$ad = networkKeyEntries[address]) === null || _networkKeyEntries$ad === void 0 ? void 0 : _networkKeyEntries$ad[key]) || '';
      });
      newEntries[address] = mergedEntry;
    } else if (networkKeyEntries[address] && typeof networkKeyEntries[address] === 'object') {
      // If there is no corresponding chainId entry, just use the networkId entry
      // directly
      newEntries[address] = networkKeyEntries[address];
    }
  });
  addressBook[chainIdKey] = newEntries;
}
/**
 * Updates the chainId key values to the given chainId in place for all values
 * of the given networkEntries object.
 *
 * @returns {void}
 */


function updateChainIds(networkEntries, chainId) {
  Object.values(networkEntries).forEach(entry => {
    if (entry && typeof entry === 'object') {
      entry.chainId = chainId;
    }
  });
}
/**
 * Merges the two given, non-empty arrays of token objects and returns a new
 * array.
 *
 * @returns {Array<Object>}
 */


function mergeTokenArrays(localhostTokens, rpcTokens) {
  const localhostTokensMap = tokenArrayToMap(localhostTokens);
  const rpcTokensMap = tokenArrayToMap(rpcTokens);
  const mergedTokens = [];
  new Set([...Object.keys(localhostTokensMap), ...Object.keys(rpcTokensMap)]).forEach(tokenAddress => {
    mergedTokens.push(_objectSpread(_objectSpread({}, localhostTokensMap[tokenAddress]), rpcTokensMap[tokenAddress]));
  });
  return mergedTokens;

  function tokenArrayToMap(array) {
    return array.reduce((map, token) => {
      if (token !== null && token !== void 0 && token.address && typeof (token === null || token === void 0 ? void 0 : token.address) === 'string') {
        map[token.address] = token;
      }

      return map;
    }, {});
  }
}


//# sourceMappingURL=app/scripts/migrations/048.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/048.js",}],
[85, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 7;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = _objectSpread(_objectSpread({}, state), {}, {
    TransactionManager: {
      transactions: state.transactions || [],
      gasMultiplier: state.gasMultiplier || 1
    }
  });

  delete newState.transactions;
  delete newState.gasMultiplier;
  return newState;
}

//# sourceMappingURL=app/scripts/migrations/007.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/007.js",}],
[135, {"../../../shared/modules/random-id":3606,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

const version = 57;
/**
 * replace 'incomingTxLastFetchedBlocksByNetwork' with 'incomingTxLastFetchedBlockByChainId'
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$TransactionCon;

  if (state !== null && state !== void 0 && (_state$TransactionCon = state.TransactionController) !== null && _state$TransactionCon !== void 0 && _state$TransactionCon.transactions && Array.isArray(state.TransactionController.transactions) && !state.TransactionController.transactions.some(item => typeof item !== 'object' || typeof item.txParams === 'undefined')) {
    state.TransactionController.transactions = (0, _lodash.keyBy)(state.TransactionController.transactions, // In case for some reason any of a user's transactions do not have an id
    // generate a new one for the transaction.
    tx => {
      if (typeof tx.id === 'undefined' || tx.id === null) {
        // This mutates the item in the array, so will result in a change to
        // the state.
        tx.id = (0, _randomId.default)();
      }

      return tx.id;
    });
  }

  return state;
}

//# sourceMappingURL=app/scripts/migrations/057.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/057.js",}],
[141, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const version = 63;
/**
 * Moves token state from preferences controller to TokensController
 */

var _default = {
  version,

  async migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  }

};
exports.default = _default;

function transformState(state) {
  var _state$PreferencesCon, _state$PreferencesCon2, _state$PreferencesCon3, _state$PreferencesCon4, _state$PreferencesCon5, _state$PreferencesCon6, _state$PreferencesCon7, _state$PreferencesCon8;

  const accountTokens = state === null || state === void 0 ? void 0 : (_state$PreferencesCon = state.PreferencesController) === null || _state$PreferencesCon === void 0 ? void 0 : _state$PreferencesCon.accountTokens;
  const accountHiddenTokens = state === null || state === void 0 ? void 0 : (_state$PreferencesCon2 = state.PreferencesController) === null || _state$PreferencesCon2 === void 0 ? void 0 : _state$PreferencesCon2.accountHiddenTokens;
  const newAllTokens = {};

  if (accountTokens) {
    Object.keys(accountTokens).forEach(accountAddress => {
      Object.keys(accountTokens[accountAddress]).forEach(chainId => {
        const tokensArray = accountTokens[accountAddress][chainId];

        if (newAllTokens[chainId] === undefined) {
          newAllTokens[chainId] = {
            [accountAddress]: tokensArray
          };
        } else {
          newAllTokens[chainId] = _objectSpread(_objectSpread({}, newAllTokens[chainId]), {}, {
            [accountAddress]: tokensArray
          });
        }
      });
    });
  }

  const newAllIgnoredTokens = {};

  if (accountHiddenTokens) {
    Object.keys(accountHiddenTokens).forEach(accountAddress => {
      Object.keys(accountHiddenTokens[accountAddress]).forEach(chainId => {
        const ignoredTokensArray = accountHiddenTokens[accountAddress][chainId];

        if (newAllIgnoredTokens[chainId] === undefined) {
          newAllIgnoredTokens[chainId] = {
            [accountAddress]: ignoredTokensArray
          };
        } else {
          newAllIgnoredTokens[chainId] = _objectSpread(_objectSpread({}, newAllIgnoredTokens[chainId]), {}, {
            [accountAddress]: ignoredTokensArray
          });
        }
      });
    });
  }

  if (state.TokensController) {
    state.TokensController.allTokens = newAllTokens;
    state.TokensController.allIgnoredTokens = newAllIgnoredTokens;
  } else {
    state.TokensController = {
      allTokens: newAllTokens,
      allIgnoredTokens: newAllIgnoredTokens
    };
  }

  state === null || state === void 0 ? true : (_state$PreferencesCon3 = state.PreferencesController) === null || _state$PreferencesCon3 === void 0 ? true : delete _state$PreferencesCon3.accountHiddenTokens;
  state === null || state === void 0 ? true : (_state$PreferencesCon4 = state.PreferencesController) === null || _state$PreferencesCon4 === void 0 ? true : delete _state$PreferencesCon4.accountTokens;
  state === null || state === void 0 ? true : (_state$PreferencesCon5 = state.PreferencesController) === null || _state$PreferencesCon5 === void 0 ? true : delete _state$PreferencesCon5.assetImages;
  state === null || state === void 0 ? true : (_state$PreferencesCon6 = state.PreferencesController) === null || _state$PreferencesCon6 === void 0 ? true : delete _state$PreferencesCon6.hiddenTokens;
  state === null || state === void 0 ? true : (_state$PreferencesCon7 = state.PreferencesController) === null || _state$PreferencesCon7 === void 0 ? true : delete _state$PreferencesCon7.tokens;
  state === null || state === void 0 ? true : (_state$PreferencesCon8 = state.PreferencesController) === null || _state$PreferencesCon8 === void 0 ? true : delete _state$PreferencesCon8.suggestedTokens;
  return state;
}

//# sourceMappingURL=app/scripts/migrations/063.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/063.js",}],
[96, {"../controllers/transactions/lib/tx-state-history-helpers":32,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _txStateHistoryHelpers = require("../controllers/transactions/lib/tx-state-history-helpers");

/*

This migration updates "transaction state history" to diffs style

*/
const version = 18;
var _default = {
  version,

  migrate(originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  }

};
exports.default = _default;

function transformState(state) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = newState.TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      // no history: initialize
      if (!txMeta.history || txMeta.history.length === 0) {
        const snapshot = (0, _txStateHistoryHelpers.snapshotFromTxMeta)(txMeta);
        txMeta.history = [snapshot];
        return txMeta;
      } // has history: migrate


      const newHistory = (0, _txStateHistoryHelpers.migrateFromSnapshotsToDiffs)(txMeta.history) // remove empty diffs
      .filter(entry => {
        return !Array.isArray(entry) || entry.length > 0;
      });
      txMeta.history = newHistory;
      return txMeta;
    });
  }

  return newState;
}


//# sourceMappingURL=app/scripts/migrations/018.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/018.js",}],
[1343, {"to-data-view":3391}, function (require, module, exports) {
var toDataView = require('to-data-view')

var RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
var RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
var CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

module.exports = function base32Encode (data, variant, options) {
  options = options || {}
  var alphabet, defaultPadding

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648
      defaultPadding = true
      break
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX
      defaultPadding = true
      break
    case 'Crockford':
      alphabet = CROCKFORD
      defaultPadding = false
      break
    default:
      throw new Error('Unknown base32 variant: ' + variant)
  }

  var padding = (options.padding !== undefined ? options.padding : defaultPadding)
  var view = toDataView(data)

  var bits = 0
  var value = 0
  var output = ''

  for (var i = 0; i < view.byteLength; i++) {
    value = (value << 8) | view.getUint8(i)
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  if (padding) {
    while ((output.length % 8) !== 0) {
      output += '='
    }
  }

  return output
}

//# sourceMappingURL=node_modules/base32-encode/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/base32-encode/index.js",}],
[52, {"./contracts/registry":50,"./contracts/resolver":51,"@babel/runtime/helpers/interopRequireDefault":186,"@ensdomains/content-hash":259,"eth-ens-namehash":1667,"ethjs-contract":1839,"ethjs-query":1854}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveEnsToIpfsContentId;

var _ethEnsNamehash = _interopRequireDefault(require("eth-ens-namehash"));

var _ethjsQuery = _interopRequireDefault(require("ethjs-query"));

var _ethjsContract = _interopRequireDefault(require("ethjs-contract"));

var _contentHash = _interopRequireDefault(require("@ensdomains/content-hash"));

var _registry = _interopRequireDefault(require("./contracts/registry"));

var _resolver = _interopRequireDefault(require("./contracts/resolver"));

async function resolveEnsToIpfsContentId({
  provider,
  name
}) {
  const eth = new _ethjsQuery.default(provider);

  const hash = _ethEnsNamehash.default.hash(name);

  const contract = new _ethjsContract.default(eth); // lookup registry

  const chainId = Number.parseInt(await eth.net_version(), 10);
  const registryAddress = getRegistryForChainId(chainId);

  if (!registryAddress) {
    throw new Error(`EnsIpfsResolver - no known ens-ipfs registry for chainId "${chainId}"`);
  }

  const Registry = contract(_registry.default).at(registryAddress); // lookup resolver

  const resolverLookupResult = await Registry.resolver(hash);
  const resolverAddress = resolverLookupResult[0];

  if (hexValueIsEmpty(resolverAddress)) {
    throw new Error(`EnsIpfsResolver - no resolver found for name "${name}"`);
  }

  const Resolver = contract(_resolver.default).at(resolverAddress);
  const isEIP1577Compliant = await Resolver.supportsInterface('0xbc1c58d1');
  const isLegacyResolver = await Resolver.supportsInterface('0xd8389dc5');

  if (isEIP1577Compliant[0]) {
    const contentLookupResult = await Resolver.contenthash(hash);
    const rawContentHash = contentLookupResult[0];

    let decodedContentHash = _contentHash.default.decode(rawContentHash);

    const type = _contentHash.default.getCodec(rawContentHash);

    if (type === 'ipfs-ns' || type === 'ipns-ns') {
      decodedContentHash = _contentHash.default.helpers.cidV0ToV1Base32(decodedContentHash);
    }

    return {
      type,
      hash: decodedContentHash
    };
  }

  if (isLegacyResolver[0]) {
    // lookup content id
    const contentLookupResult = await Resolver.content(hash);
    const content = contentLookupResult[0];

    if (hexValueIsEmpty(content)) {
      throw new Error(`EnsIpfsResolver - no content ID found for name "${name}"`);
    }

    return {
      type: 'swarm-ns',
      hash: content.slice(2)
    };
  }

  throw new Error(`EnsIpfsResolver - the resolver for name "${name}" is not standard, it should either supports contenthash() or content()`);
}

function hexValueIsEmpty(value) {
  return [undefined, null, '0x', '0x0', '0x0000000000000000000000000000000000000000000000000000000000000000'].includes(value);
}
/**
 * Returns the registry address for the given chain ID
 * @param {number} chainId - the chain ID
 * @returns {string|null} the registry address if known, null otherwise
 */


function getRegistryForChainId(chainId) {
  switch (chainId) {
    case 1:
    case 3:
    case 4:
    case 5:
      // Mainnet, Ropsten, Rinkeby, and Goerli, respectively, use the same address
      return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

    default:
      return null;
  }
}


//# sourceMappingURL=app/scripts/lib/ens-ipfs/resolver.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/ens-ipfs/resolver.js",}],
[45, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createOriginMiddleware;

/**
 * Returns a middleware that appends the DApp origin to request
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
function createOriginMiddleware(opts) {
  return function originMiddleware(
  /** @type {any} */
  req,
  /** @type {any} */
  _,
  /** @type {Function} */
  next) {
    req.origin = opts.origin;
    next();
  };
}

//# sourceMappingURL=app/scripts/lib/createOriginMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createOriginMiddleware.js",}],
[47, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTabIdMiddleware;

/**
 * Returns a middleware that appends the DApp TabId to the request
 * @param {{ tabId: number }} opts - The middleware options
 * @returns {Function}
 */
function createTabIdMiddleware(opts) {
  return function tabIdMiddleware(
  /** @type {any} */
  req,
  /** @type {any} */
  _,
  /** @type {Function} */
  next) {
    req.tabId = opts.tabId;
    next();
  };
}

//# sourceMappingURL=app/scripts/lib/createTabIdMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createTabIdMiddleware.js",}],
[27, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRestrictedMethods;

function getRestrictedMethods({
  getIdentities,
  getKeyringAccounts
}) {
  return {
    eth_accounts: {
      method: async (_, res, __, end) => {
        try {
          const accounts = await getKeyringAccounts();
          const identities = getIdentities();
          res.result = accounts.sort((firstAddress, secondAddress) => {
            if (!identities[firstAddress]) {
              throw new Error(`Missing identity for address ${firstAddress}`);
            } else if (!identities[secondAddress]) {
              throw new Error(`Missing identity for address ${secondAddress}`);
            } else if (identities[firstAddress].lastSelected === identities[secondAddress].lastSelected) {
              return 0;
            } else if (identities[firstAddress].lastSelected === undefined) {
              return 1;
            } else if (identities[secondAddress].lastSelected === undefined) {
              return -1;
            }

            return identities[secondAddress].lastSelected - identities[firstAddress].lastSelected;
          });
          end();
        } catch (err) {
          res.error = err;
          end(err);
        }
      }
    }
  };
}

//# sourceMappingURL=app/scripts/controllers/permissions/restrictedMethods.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/permissions/restrictedMethods.js",}],
[23, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SAFE_METHODS = exports.LOG_LIMIT = exports.LOG_METHOD_TYPES = exports.LOG_IGNORE_METHODS = exports.NOTIFICATION_NAMES = exports.CAVEAT_TYPES = exports.METADATA_CACHE_MAX_SIZE = exports.METADATA_STORE_KEY = exports.LOG_STORE_KEY = exports.HISTORY_STORE_KEY = exports.WALLET_PREFIX = exports.APPROVAL_TYPE = void 0;
const APPROVAL_TYPE = 'wallet_requestPermissions';
exports.APPROVAL_TYPE = APPROVAL_TYPE;
const WALLET_PREFIX = 'wallet_';
exports.WALLET_PREFIX = WALLET_PREFIX;
const HISTORY_STORE_KEY = 'permissionsHistory';
exports.HISTORY_STORE_KEY = HISTORY_STORE_KEY;
const LOG_STORE_KEY = 'permissionsLog';
exports.LOG_STORE_KEY = LOG_STORE_KEY;
const METADATA_STORE_KEY = 'domainMetadata';
exports.METADATA_STORE_KEY = METADATA_STORE_KEY;
const METADATA_CACHE_MAX_SIZE = 100;
exports.METADATA_CACHE_MAX_SIZE = METADATA_CACHE_MAX_SIZE;
const CAVEAT_TYPES = {
  limitResponseLength: 'limitResponseLength',
  filterResponse: 'filterResponse'
};
exports.CAVEAT_TYPES = CAVEAT_TYPES;
const NOTIFICATION_NAMES = {
  accountsChanged: 'metamask_accountsChanged',
  unlockStateChanged: 'metamask_unlockStateChanged',
  chainChanged: 'metamask_chainChanged'
};
exports.NOTIFICATION_NAMES = NOTIFICATION_NAMES;
const LOG_IGNORE_METHODS = ['wallet_registerOnboarding', 'wallet_watchAsset'];
exports.LOG_IGNORE_METHODS = LOG_IGNORE_METHODS;
const LOG_METHOD_TYPES = {
  restricted: 'restricted',
  internal: 'internal'
};
exports.LOG_METHOD_TYPES = LOG_METHOD_TYPES;
const LOG_LIMIT = 100;
exports.LOG_LIMIT = LOG_LIMIT;
const SAFE_METHODS = ['eth_blockNumber', 'eth_call', 'eth_chainId', 'eth_coinbase', 'eth_decrypt', 'eth_estimateGas', 'eth_feeHistory', 'eth_gasPrice', 'eth_getBalance', 'eth_getBlockByHash', 'eth_getBlockByNumber', 'eth_getBlockTransactionCountByHash', 'eth_getBlockTransactionCountByNumber', 'eth_getCode', 'eth_getEncryptionPublicKey', 'eth_getFilterChanges', 'eth_getFilterLogs', 'eth_getLogs', 'eth_getProof', 'eth_getStorageAt', 'eth_getTransactionByBlockHashAndIndex', 'eth_getTransactionByBlockNumberAndIndex', 'eth_getTransactionByHash', 'eth_getTransactionCount', 'eth_getTransactionReceipt', 'eth_getUncleByBlockHashAndIndex', 'eth_getUncleByBlockNumberAndIndex', 'eth_getUncleCountByBlockHash', 'eth_getUncleCountByBlockNumber', 'eth_getWork', 'eth_hashrate', 'eth_mining', 'eth_newBlockFilter', 'eth_newFilter', 'eth_newPendingTransactionFilter', 'eth_protocolVersion', 'eth_sendRawTransaction', 'eth_sendTransaction', 'eth_sign', 'eth_signTypedData', 'eth_signTypedData_v1', 'eth_signTypedData_v3', 'eth_signTypedData_v4', 'eth_submitHashrate', 'eth_submitWork', 'eth_syncing', 'eth_uninstallFilter', 'metamask_getProviderState', 'metamask_watchAsset', 'net_listening', 'net_peerCount', 'net_version', 'personal_ecRecover', 'personal_sign', 'wallet_watchAsset', 'web3_clientVersion', 'web3_sha3'];
exports.SAFE_METHODS = SAFE_METHODS;

//# sourceMappingURL=app/scripts/controllers/permissions/enums.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/permissions/enums.js",}],
[2722, {}, function (require, module, exports) {
// This file replaces `index.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

if ("production" !== 'production') {
  // All bundlers will remove this block in production bundle
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    throw new Error(
      'React Native does not have a built-in secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use `nanoid/non-secure`. ' +
      'For secure ID install `expo-random` locally and use `nanoid/async`.'
    )
  }
  if (typeof self === 'undefined' || (!self.crypto && !self.msCrypto)) {
    throw new Error(
      'Your browser does not have secure random generator. ' +
      'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
    )
  }
}

var crypto = self.crypto || self.msCrypto

// This alphabet uses a-z A-Z 0-9 _- symbols.
// Symbols are generated for smaller size.
// -_zyxwvutsrqponmlkjihgfedcba9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA
var url = '-_'
// Loop from 36 to 0 (from z to a and 9 to 0 in Base36).
var i = 36
while (i--) {
  // 36 is radix. Number.prototype.toString(36) returns number
  // in Base36 representation. Base36 is like hex, but it uses 0–9 and a-z.
  url += i.toString(36)
}
// Loop from 36 to 10 (from Z to A in Base36).
i = 36
while (i-- - 10) {
  url += i.toString(36).toUpperCase()
}

module.exports = function (size) {
  var id = ''
  var bytes = crypto.getRandomValues(new Uint8Array(size || 21))
  i = size || 21

  // Compact alternative for `for (var i = 0; i < size; i++)`
  while (i--) {
    // We can’t use bytes bigger than the alphabet. 63 is 00111111 bitmask.
    // This mask reduces random byte 0-255 to 0-63 values.
    // There is no need in `|| ''` and `* 1.6` hacks in here,
    // because bitmask trim bytes exact to alphabet size.
    id += url[bytes[i] & 63]
  }
  return id
}

//# sourceMappingURL=node_modules/nanoid/index.browser.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/nanoid/index.browser.js",}],
[1732, {}, function (require, module, exports) {
module.exports = providerAsMiddleware

function providerAsMiddleware (provider) {
  return (req, res, next, end) => {
    // send request to provider
    provider.sendAsync(req, (err, providerRes) => {
      // forward any error
      if (err) return end(err)
      // copy provider response onto original response
      Object.assign(res, providerRes)
      end()
    })
  }
}

//# sourceMappingURL=node_modules/eth-json-rpc-middleware/providerAsMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/eth-json-rpc-middleware/providerAsMiddleware.js",}],
[43, {"eth-rpc-errors":1748}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethRpcErrors = require("eth-rpc-errors");

const createMetaRPCHandler = (api, outStream) => {
  return data => {
    if (outStream._writableState.ended) {
      return;
    }

    if (!api[data.method]) {
      outStream.write({
        jsonrpc: '2.0',
        error: _ethRpcErrors.ethErrors.rpc.methodNotFound({
          message: `${data.method} not found`
        }),
        id: data.id
      });
      return;
    }

    api[data.method](...data.params, (err, result) => {
      if (outStream._writableState.ended) {
        return;
      }

      if (err) {
        outStream.write({
          jsonrpc: '2.0',
          error: (0, _ethRpcErrors.serializeError)(err, {
            shouldIncludeStack: true
          }),
          id: data.id
        });
      } else {
        outStream.write({
          jsonrpc: '2.0',
          result,
          id: data.id
        });
      }
    });
  };
};

var _default = createMetaRPCHandler;
exports.default = _default;

//# sourceMappingURL=app/scripts/lib/createMetaRPCHandler.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createMetaRPCHandler.js",}],
[2276, {"readable-stream":3135}, function (require, module, exports) {
const DuplexStream = require('readable-stream').Duplex

module.exports = createEngineStream

function createEngineStream({ engine }) {
  if (!engine) throw new Error('Missing engine parameter!')
  const stream = new DuplexStream({ objectMode: true, read, write })
  // forward notifications
  if (engine.on) {
    engine.on('notification', (message) => {
      stream.push(message)
    })
  }
  return stream

  function read () {
    return false
  }
  function write (req, encoding, cb) {
    engine.handle(req, (err, res) => {
      this.push(res)
    })
    cb()
  }
}

//# sourceMappingURL=node_modules/json-rpc-middleware-stream/engineStream.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-middleware-stream/engineStream.js",}],
[42, {"@babel/runtime/helpers/interopRequireDefault":186,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoggerMiddleware;

var _loglevel = _interopRequireDefault(require("loglevel"));

/**
 * Returns a middleware that logs RPC activity
 * @param {{ origin: string }} opts - The middleware options
 * @returns {Function}
 */
function createLoggerMiddleware(opts) {
  return function loggerMiddleware(
  /** @type {any} */
  req,
  /** @type {any} */
  res,
  /** @type {Function} */
  next) {
    next(
    /** @type {Function} */
    cb => {
      if (res.error) {
        _loglevel.default.error('Error in RPC response:\n', res);
      }

      if (req.isMetamaskInternal) {
        return;
      }

      _loglevel.default.info(`RPC (${opts.origin}):`, req, '->', res);

      cb();
    });
  };
}

//# sourceMappingURL=app/scripts/lib/createLoggerMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createLoggerMiddleware.js",}],
[44, {"@babel/runtime/helpers/interopRequireDefault":186,"extensionizer":1869,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createOnboardingMiddleware;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _extensionizer = _interopRequireDefault(require("extensionizer"));

/**
 * Returns a middleware that intercepts `wallet_registerOnboarding` messages
 * @param {{ location: string, registerOnboarding: Function }} opts - The middleware options
 * @returns {(req: any, res: any, next: Function, end: Function) => void}
 */
function createOnboardingMiddleware({
  location,
  registerOnboarding
}) {
  return async function originMiddleware(req, res, next, end) {
    try {
      if (req.method !== 'wallet_registerOnboarding') {
        next();
        return;
      }

      if (req.tabId && req.tabId !== _extensionizer.default.tabs.TAB_ID_NONE) {
        await registerOnboarding(location, req.tabId);
      } else {
        _loglevel.default.debug(`'wallet_registerOnboarding' message from ${location} ignored due to missing tabId`);
      }

      res.result = true;
      end();
    } catch (error) {
      end(error);
    }
  };
}

//# sourceMappingURL=app/scripts/lib/createOnboardingMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/createOnboardingMiddleware.js",}],
[8, {"../../../shared/constants/time":3598,"../metamask-controller":79,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"events":1429}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = _interopRequireDefault(require("events"));

var _obsStore = require("@metamask/obs-store");

var _metamaskController = require("../metamask-controller");

var _time = require("../../../shared/constants/time");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class AppStateController extends _events.default {
  /**
   * @constructor
   * @param {Object} opts
   */
  constructor(opts = {}) {
    const {
      addUnlockListener,
      isUnlocked,
      initState,
      onInactiveTimeout,
      showUnlockRequest,
      preferencesStore
    } = opts;
    super();

    this.onInactiveTimeout = onInactiveTimeout || (() => undefined);

    this.store = new _obsStore.ObservableStore(_objectSpread({
      timeoutMinutes: 0,
      connectedStatusPopoverHasBeenShown: true,
      defaultHomeActiveTabName: null,
      browserEnvironment: {},
      popupGasPollTokens: [],
      notificationGasPollTokens: [],
      fullScreenGasPollTokens: [],
      recoveryPhraseReminderHasBeenShown: false,
      recoveryPhraseReminderLastShown: new Date().getTime()
    }, initState));
    this.timer = null;
    this.isUnlocked = isUnlocked;
    this.waitingForUnlock = [];
    addUnlockListener(this.handleUnlock.bind(this));
    this._showUnlockRequest = showUnlockRequest;
    preferencesStore.subscribe(({
      preferences
    }) => {
      const currentState = this.store.getState();

      if (currentState.timeoutMinutes !== preferences.autoLockTimeLimit) {
        this._setInactiveTimeout(preferences.autoLockTimeLimit);
      }
    });
    const {
      preferences
    } = preferencesStore.getState();

    this._setInactiveTimeout(preferences.autoLockTimeLimit);
  }
  /**
   * Get a Promise that resolves when the extension is unlocked.
   * This Promise will never reject.
   *
   * @param {boolean} shouldShowUnlockRequest - Whether the extension notification
   * popup should be opened.
   * @returns {Promise<void>} A promise that resolves when the extension is
   * unlocked, or immediately if the extension is already unlocked.
   */


  getUnlockPromise(shouldShowUnlockRequest) {
    return new Promise(resolve => {
      if (this.isUnlocked()) {
        resolve();
      } else {
        this.waitForUnlock(resolve, shouldShowUnlockRequest);
      }
    });
  }
  /**
   * Adds a Promise's resolve function to the waitingForUnlock queue.
   * Also opens the extension popup if specified.
   *
   * @param {Promise.resolve} resolve - A Promise's resolve function that will
   * be called when the extension is unlocked.
   * @param {boolean} shouldShowUnlockRequest - Whether the extension notification
   * popup should be opened.
   */


  waitForUnlock(resolve, shouldShowUnlockRequest) {
    this.waitingForUnlock.push({
      resolve
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);

    if (shouldShowUnlockRequest) {
      this._showUnlockRequest();
    }
  }
  /**
   * Drains the waitingForUnlock queue, resolving all the related Promises.
   */


  handleUnlock() {
    if (this.waitingForUnlock.length > 0) {
      while (this.waitingForUnlock.length > 0) {
        this.waitingForUnlock.shift().resolve();
      }

      this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
    }
  }
  /**
   * Sets the default home tab
   * @param {string} [defaultHomeActiveTabName] - the tab name
   */


  setDefaultHomeActiveTabName(defaultHomeActiveTabName) {
    this.store.updateState({
      defaultHomeActiveTabName
    });
  }
  /**
   * Record that the user has seen the connected status info popover
   */


  setConnectedStatusPopoverHasBeenShown() {
    this.store.updateState({
      connectedStatusPopoverHasBeenShown: true
    });
  }
  /**
   * Record that the user has been shown the recovery phrase reminder
   * @returns {void}
   */


  setRecoveryPhraseReminderHasBeenShown() {
    this.store.updateState({
      recoveryPhraseReminderHasBeenShown: true
    });
  }
  /**
   * Record the timestamp of the last time the user has seen the recovery phrase reminder
   * @param {number} lastShown - timestamp when user was last shown the reminder
   * @returns {void}
   */


  setRecoveryPhraseReminderLastShown(lastShown) {
    this.store.updateState({
      recoveryPhraseReminderLastShown: lastShown
    });
  }
  /**
   * Sets the last active time to the current time
   * @returns {void}
   */


  setLastActiveTime() {
    this._resetTimer();
  }
  /**
   * Sets the inactive timeout for the app
   * @param {number} timeoutMinutes - the inactive timeout in minutes
   * @returns {void}
   * @private
   */


  _setInactiveTimeout(timeoutMinutes) {
    this.store.updateState({
      timeoutMinutes
    });

    this._resetTimer();
  }
  /**
   * Resets the internal inactive timer
   *
   * If the {@code timeoutMinutes} state is falsy (i.e., zero) then a new
   * timer will not be created.
   *
   * @returns {void}
   * @private
   */


  _resetTimer() {
    const {
      timeoutMinutes
    } = this.store.getState();

    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (!timeoutMinutes) {
      return;
    }

    this.timer = setTimeout(() => this.onInactiveTimeout(), timeoutMinutes * _time.MINUTE);
  }
  /**
   * Sets the current browser and OS environment
   * @returns {void}
   */


  setBrowserEnvironment(os, browser) {
    this.store.updateState({
      browserEnvironment: {
        os,
        browser
      }
    });
  }
  /**
   * Adds a pollingToken for a given environmentType
   * @returns {void}
   */


  addPollingToken(pollingToken, pollingTokenType) {
    const prevState = this.store.getState()[pollingTokenType];
    this.store.updateState({
      [pollingTokenType]: [...prevState, pollingToken]
    });
  }
  /**
   * removes a pollingToken for a given environmentType
   * @returns {void}
   */


  removePollingToken(pollingToken, pollingTokenType) {
    const prevState = this.store.getState()[pollingTokenType];
    this.store.updateState({
      [pollingTokenType]: prevState.filter(token => token !== pollingToken)
    });
  }
  /**
   * clears all pollingTokens
   * @returns {void}
   */


  clearPollingTokens() {
    this.store.updateState({
      popupGasPollTokens: [],
      notificationGasPollTokens: [],
      fullScreenGasPollTokens: []
    });
  }

}

exports.default = AppStateController;

//# sourceMappingURL=app/scripts/controllers/app-state.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/app-state.js",}],
[22, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {Object} InitState
 * @property {Boolean} seedPhraseBackedUp Indicates whether the user has completed the seed phrase backup challenge
 */

/**
 * @typedef {Object} OnboardingOptions
 * @property {InitState} initState The initial controller state
 * @property {PreferencesController} preferencesController Controller for managing user perferences
 */

/**
 * Controller responsible for maintaining
 * state related to onboarding
 */
class OnboardingController {
  /**
   * Creates a new controller instance
   *
   * @param {OnboardingOptions} [opts] Controller configuration parameters
   */
  constructor(opts = {}) {
    (0, _defineProperty2.default)(this, "registerOnboarding", async (location, tabId) => {
      if (this.completedOnboarding) {
        _loglevel.default.debug('Ignoring registerOnboarding; user already onboarded');

        return;
      }

      const onboardingTabs = _objectSpread({}, this.store.getState().onboardingTabs);

      if (!onboardingTabs[location] || onboardingTabs[location] !== tabId) {
        _loglevel.default.debug(`Registering onboarding tab at location '${location}' with tabId '${tabId}'`);

        onboardingTabs[location] = tabId;
        this.store.updateState({
          onboardingTabs
        });
      }
    });
    const initialTransientState = {
      onboardingTabs: {}
    };

    const initState = _objectSpread(_objectSpread({
      seedPhraseBackedUp: null
    }, opts.initState), initialTransientState);

    this.store = new _obsStore.ObservableStore(initState);
    this.preferencesController = opts.preferencesController;
    this.completedOnboarding = this.preferencesController.store.getState().completedOnboarding;
    this.preferencesController.store.subscribe(({
      completedOnboarding
    }) => {
      if (completedOnboarding !== this.completedOnboarding) {
        this.completedOnboarding = completedOnboarding;

        if (completedOnboarding) {
          this.store.updateState(initialTransientState);
        }
      }
    });
  }

  setSeedPhraseBackedUp(newSeedPhraseBackUpState) {
    this.store.updateState({
      seedPhraseBackedUp: newSeedPhraseBackUpState
    });
  }
  /**
   * Registering a site as having initiated onboarding
   *
   * @param {string} location - The location of the site registering
   * @param {string} tabId - The id of the tab registering
   */


}

exports.default = OnboardingController;

//# sourceMappingURL=app/scripts/controllers/onboarding.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/onboarding.js",}],
[58, {"../../../shared/constants/app":3591,"../../../shared/modules/random-id":3606,"../metamask-controller":79,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"buffer":1428,"eth-rpc-errors":1748,"ethereumjs-util":1810,"events":1429}, function (require, module, exports) {
(function (Buffer){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _obsStore = require("@metamask/obs-store");

var _ethereumjsUtil = require("ethereumjs-util");

var _ethRpcErrors = require("eth-rpc-errors");

var _app = require("../../../shared/constants/app");

var _metamaskController = require("../metamask-controller");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

/**
 * Represents, and contains data about, an 'eth_sign' type signature request. These are created when a signature for
 * an eth_sign call is requested.
 *
 * @see {@link https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign}
 *
 * @typedef {Object} Message
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the eth_sign method once the signature request is approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed' or 'rejected'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' with
 * always have a 'eth_sign' type.
 *
 */
class MessageManager extends _events.default {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - Messages.
   *
   * @typedef {Object} MessageManager
   * @property {Object} memStore The observable store where Messages are saved.
   * @property {Object} memStore.unapprovedMsgs A collection of all Messages in the 'unapproved' state
   * @property {number} memStore.unapprovedMsgCount The count of all Messages in this.memStore.unapprovedMsgs
   * @property {Array} messages Holds all messages that have been created by this MessageManager
   *
   */
  constructor() {
    super();
    this.memStore = new _obsStore.ObservableStore({
      unapprovedMsgs: {},
      unapprovedMsgCount: 0
    });
    this.messages = [];
  }
  /**
   * A getter for the number of 'unapproved' Messages in this.messages
   *
   * @returns {number} The number of 'unapproved' Messages in this.messages
   *
   */


  get unapprovedMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }
  /**
   * A getter for the 'unapproved' Messages in this.messages
   *
   * @returns {Object} An index of Message ids to Messages, for all 'unapproved' Messages in this.messages
   *
   */


  getUnapprovedMsgs() {
    return this.messages.filter(msg => msg.status === 'unapproved').reduce((result, msg) => {
      result[msg.id] = msg;
      return result;
    }, {});
  }
  /**
   * Creates a new Message with an 'unapproved' status using the passed msgParams. this.addMsg is called to add the
   * new Message to this.messages, and to save the unapproved Messages from that list to this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {promise} after signature has been
   *
   */


  addUnapprovedMessageAsync(msgParams, req) {
    return new Promise((resolve, reject) => {
      const msgId = this.addUnapprovedMessage(msgParams, req); // await finished

      this.once(`${msgId}:finished`, data => {
        switch (data.status) {
          case 'signed':
            return resolve(data.rawSig);

          case 'rejected':
            return reject(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask Message Signature: User denied message signature.'));

          default:
            return reject(new Error(`MonstaWalletMessage Signature: Unknown problem: ${JSON.stringify(msgParams)}`));
        }
      });
    });
  }
  /**
   * Creates a new Message with an 'unapproved' status using the passed msgParams. this.addMsg is called to add the
   * new Message to this.messages, and to save the unapproved Messages from that list to this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object where the origin may be specified
   * @returns {number} The id of the newly created message.
   *
   */


  addUnapprovedMessage(msgParams, req) {
    // add origin from request
    if (req) {
      msgParams.origin = req.origin;
    }

    msgParams.data = normalizeMsgData(msgParams.data); // create txData obj with parameters and meta data

    const time = new Date().getTime();
    const msgId = (0, _randomId.default)();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: _app.MESSAGE_TYPE.ETH_SIGN
    };
    this.addMsg(msgData); // signal update

    this.emit('update');
    return msgId;
  }
  /**
   * Adds a passed Message to this.messages, and calls this._saveMsgList() to save the unapproved Messages from that
   * list to this.memStore.
   *
   * @param {Message} msg - The Message to add to this.messages
   *
   */


  addMsg(msg) {
    this.messages.push(msg);

    this._saveMsgList();
  }
  /**
   * Returns a specified Message.
   *
   * @param {number} msgId - The id of the Message to get
   * @returns {Message|undefined} The Message with the id that matches the passed msgId, or undefined if no Message has that id.
   *
   */


  getMsg(msgId) {
    return this.messages.find(msg => msg.id === msgId);
  }
  /**
   * Approves a Message. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise with
   * any the message params modified for proper signing.
   *
   * @param {Object} msgParams - The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */


  approveMessage(msgParams) {
    this.setMsgStatusApproved(msgParams.metamaskId);
    return this.prepMsgForSigning(msgParams);
  }
  /**
   * Sets a Message status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the Message to approve.
   *
   */


  setMsgStatusApproved(msgId) {
    this._setMsgStatus(msgId, 'approved');
  }
  /**
   * Sets a Message status to 'signed' via a call to this._setMsgStatus and updates that Message in this.messages by
   * adding the raw signature data of the signature request to the Message
   *
   * @param {number} msgId - The id of the Message to sign.
   * @param {buffer} rawSig - The raw data of the signature request
   *
   */


  setMsgStatusSigned(msgId, rawSig) {
    const msg = this.getMsg(msgId);
    msg.rawSig = rawSig;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'signed');
  }
  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams - The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */


  prepMsgForSigning(msgParams) {
    delete msgParams.metamaskId;
    return Promise.resolve(msgParams);
  }
  /**
   * Sets a Message status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the Message to reject.
   *
   */


  rejectMsg(msgId) {
    this._setMsgStatus(msgId, 'rejected');
  }
  /**
   * Clears all unapproved messages from memory.
   */


  clearUnapproved() {
    this.messages = this.messages.filter(msg => msg.status !== 'unapproved');

    this._saveMsgList();
  }
  /**
   * Updates the status of a Message in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId - The id of the Message to update.
   * @param {string} status - The new status of the Message.
   * @throws A 'MessageManager - Message not found for id: "${msgId}".' if there is no Message in this.messages with an
   * id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The Message is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along with the message
   *
   */


  _setMsgStatus(msgId, status) {
    const msg = this.getMsg(msgId);

    if (!msg) {
      throw new Error(`MessageManager - Message not found for id: "${msgId}".`);
    }

    msg.status = status;

    this._updateMsg(msg);

    this.emit(`${msgId}:${status}`, msg);

    if (status === 'rejected' || status === 'signed') {
      this.emit(`${msgId}:finished`, msg);
    }
  }
  /**
   * Sets a Message in this.messages to the passed Message if the ids are equal. Then saves the unapprovedMsg list to
   * storage via this._saveMsgList
   *
   * @private
   * @param {msg} Message - A Message that will replace an existing Message (with the same id) in this.messages
   *
   */


  _updateMsg(msg) {
    const index = this.messages.findIndex(message => message.id === msg.id);

    if (index !== -1) {
      this.messages[index] = msg;
    }

    this._saveMsgList();
  }
  /**
   * Saves the unapproved messages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */


  _saveMsgList() {
    const unapprovedMsgs = this.getUnapprovedMsgs();
    const unapprovedMsgCount = Object.keys(unapprovedMsgs).length;
    this.memStore.updateState({
      unapprovedMsgs,
      unapprovedMsgCount
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
  }

}
/**
 * A helper function that converts raw buffer data to a hex, or just returns the data if it is already formatted as a hex.
 *
 * @param {any} data - The buffer data to convert to a hex
 * @returns {string} A hex string conversion of the buffer data
 *
 */


exports.default = MessageManager;

function normalizeMsgData(data) {
  if (data.slice(0, 2) === '0x') {
    // data is already hex
    return data;
  } // data is unicode, convert to hex


  return (0, _ethereumjsUtil.bufferToHex)(Buffer.from(data, 'utf8'));
}

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=app/scripts/lib/message-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/message-manager.js",}],
[48, {"../../../shared/constants/app":3591,"../../../shared/modules/random-id":3606,"../metamask-controller":79,"./util":78,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"buffer":1428,"eth-rpc-errors":1748,"ethereumjs-util":1810,"events":1429,"loglevel":2657}, function (require, module, exports) {
(function (Buffer){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _obsStore = require("@metamask/obs-store");

var _ethereumjsUtil = require("ethereumjs-util");

var _ethRpcErrors = require("eth-rpc-errors");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _app = require("../../../shared/constants/app");

var _metamaskController = require("../metamask-controller");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

var _util = require("./util");

const hexRe = /^[0-9A-Fa-f]+$/gu;
/**
 * Represents, and contains data about, an 'eth_decrypt' type decryption request. These are created when a
 * decryption for an eth_decrypt call is requested.
 *
 * @typedef {Object} DecryptMessage
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the decryptMessage method once the decryption request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the decryption request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the decryption request is 'unapproved', 'approved', 'decrypted' or 'rejected'
 * @property {string} type The json-prc decryption method for which a decryption request has been made. A 'Message' will
 * always have a 'eth_decrypt' type.
 *
 */

class DecryptMessageManager extends _events.default {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - DecryptMessage.
   *
   * @typedef {Object} DecryptMessageManager
   * @property {Object} memStore The observable store where DecryptMessage are saved.
   * @property {Object} memStore.unapprovedDecryptMsgs A collection of all DecryptMessages in the 'unapproved' state
   * @property {number} memStore.unapprovedDecryptMsgCount The count of all DecryptMessages in this.memStore.unapprovedDecryptMsgs
   * @property {Array} messages Holds all messages that have been created by this DecryptMessageManager
   *
   */
  constructor() {
    super();
    this.memStore = new _obsStore.ObservableStore({
      unapprovedDecryptMsgs: {},
      unapprovedDecryptMsgCount: 0
    });
    this.messages = [];
  }
  /**
   * A getter for the number of 'unapproved' DecryptMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' DecryptMessages in this.messages
   *
   */


  get unapprovedDecryptMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }
  /**
   * A getter for the 'unapproved' DecryptMessages in this.messages
   *
   * @returns {Object} An index of DecryptMessage ids to DecryptMessages, for all 'unapproved' DecryptMessages in
   * this.messages
   *
   */


  getUnapprovedMsgs() {
    return this.messages.filter(msg => msg.status === 'unapproved').reduce((result, msg) => {
      result[msg.id] = msg;
      return result;
    }, {});
  }
  /**
   * Creates a new DecryptMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new DecryptMessage to this.messages, and to save the unapproved DecryptMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_decrypt call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {Promise<Buffer>} The raw decrypted message contents
   *
   */


  addUnapprovedMessageAsync(msgParams, req) {
    return new Promise((resolve, reject) => {
      if (!msgParams.from) {
        reject(new Error('MetaMask Decryption: from field is required.'));
        return;
      }

      const msgId = this.addUnapprovedMessage(msgParams, req);
      this.once(`${msgId}:finished`, data => {
        switch (data.status) {
          case 'decrypted':
            resolve(data.rawData);
            return;

          case 'rejected':
            reject(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask Decryption: User denied message decryption.'));
            return;

          case 'errored':
            reject(new Error('This message cannot be decrypted'));
            return;

          default:
            reject(new Error(`MonstaWalletDecryption: Unknown problem: ${JSON.stringify(msgParams)}`));
        }
      });
    });
  }
  /**
   * Creates a new DecryptMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new DecryptMessage to this.messages, and to save the unapproved DecryptMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_decryptMsg call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created DecryptMessage.
   *
   */


  addUnapprovedMessage(msgParams, req) {
    _loglevel.default.debug(`DecryptMessageManager addUnapprovedMessage: ${JSON.stringify(msgParams)}`); // add origin from request


    if (req) {
      msgParams.origin = req.origin;
    }

    msgParams.data = this.normalizeMsgData(msgParams.data); // create txData obj with parameters and meta data

    const time = new Date().getTime();
    const msgId = (0, _randomId.default)();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: _app.MESSAGE_TYPE.ETH_DECRYPT
    };
    this.addMsg(msgData); // signal update

    this.emit('update');
    return msgId;
  }
  /**
   * Adds a passed DecryptMessage to this.messages, and calls this._saveMsgList() to save the unapproved DecryptMessages from that
   * list to this.memStore.
   *
   * @param {Message} msg The DecryptMessage to add to this.messages
   *
   */


  addMsg(msg) {
    this.messages.push(msg);

    this._saveMsgList();
  }
  /**
   * Returns a specified DecryptMessage.
   *
   * @param {number} msgId The id of the DecryptMessage to get
   * @returns {DecryptMessage|undefined} The DecryptMessage with the id that matches the passed msgId, or undefined
   * if no DecryptMessage has that id.
   *
   */


  getMsg(msgId) {
    return this.messages.find(msg => msg.id === msgId);
  }
  /**
   * Approves a DecryptMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with the message params modified for proper decryption.
   *
   * @param {Object} msgParams The msgParams to be used when eth_decryptMsg is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */


  approveMessage(msgParams) {
    this.setMsgStatusApproved(msgParams.metamaskId);
    return this.prepMsgForDecryption(msgParams);
  }
  /**
   * Sets a DecryptMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the DecryptMessage to approve.
   *
   */


  setMsgStatusApproved(msgId) {
    this._setMsgStatus(msgId, 'approved');
  }
  /**
   * Sets a DecryptMessage status to 'decrypted' via a call to this._setMsgStatus and updates that DecryptMessage in
   * this.messages by adding the raw decryption data of the decryption request to the DecryptMessage
   *
   * @param {number} msgId The id of the DecryptMessage to decrypt.
   * @param {buffer} rawData The raw data of the message request
   *
   */


  setMsgStatusDecrypted(msgId, rawData) {
    const msg = this.getMsg(msgId);
    msg.rawData = rawData;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'decrypted');
  }
  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */


  prepMsgForDecryption(msgParams) {
    delete msgParams.metamaskId;
    return Promise.resolve(msgParams);
  }
  /**
   * Sets a DecryptMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the DecryptMessage to reject.
   *
   */


  rejectMsg(msgId) {
    this._setMsgStatus(msgId, 'rejected');
  }
  /**
   * Sets a TypedMessage status to 'errored' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the TypedMessage to error
   *
   */


  errorMessage(msgId, error) {
    const msg = this.getMsg(msgId);
    msg.error = error;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'errored');
  }
  /**
   * Clears all unapproved messages from memory.
   */


  clearUnapproved() {
    this.messages = this.messages.filter(msg => msg.status !== 'unapproved');

    this._saveMsgList();
  }
  /**
   * Updates the status of a DecryptMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId The id of the DecryptMessage to update.
   * @param {string} status The new status of the DecryptMessage.
   * @throws A 'DecryptMessageManager - DecryptMessage not found for id: "${msgId}".' if there is no DecryptMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The DecryptMessage is also fired.
   * @fires If status is 'rejected' or 'decrypted', an event with a name equal to `${msgId}:finished` is fired along
   * with the DecryptMessage
   *
   */


  _setMsgStatus(msgId, status) {
    const msg = this.getMsg(msgId);

    if (!msg) {
      throw new Error(`DecryptMessageManager - Message not found for id: "${msgId}".`);
    }

    msg.status = status;

    this._updateMsg(msg);

    this.emit(`${msgId}:${status}`, msg);

    if (status === 'rejected' || status === 'decrypted' || status === 'errored') {
      this.emit(`${msgId}:finished`, msg);
    }
  }
  /**
   * Sets a DecryptMessage in this.messages to the passed DecryptMessage if the ids are equal. Then saves the
   * unapprovedDecryptMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {DecryptMessage} msg - A DecryptMessage that will replace an existing DecryptMessage (with the same
   * id) in this.messages
   *
   */


  _updateMsg(msg) {
    const index = this.messages.findIndex(message => message.id === msg.id);

    if (index !== -1) {
      this.messages[index] = msg;
    }

    this._saveMsgList();
  }
  /**
   * Saves the unapproved DecryptMessages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */


  _saveMsgList() {
    const unapprovedDecryptMsgs = this.getUnapprovedMsgs();
    const unapprovedDecryptMsgCount = Object.keys(unapprovedDecryptMsgs).length;
    this.memStore.updateState({
      unapprovedDecryptMsgs,
      unapprovedDecryptMsgCount
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
  }
  /**
   * A helper function that converts raw buffer data to a hex, or just returns the data if it is already formatted as a hex.
   *
   * @param {any} data The buffer data to convert to a hex
   * @returns {string} A hex string conversion of the buffer data
   *
   */


  normalizeMsgData(data) {
    try {
      const stripped = (0, _ethereumjsUtil.stripHexPrefix)(data);

      if (stripped.match(hexRe)) {
        return (0, _util.addHexPrefix)(stripped);
      }
    } catch (e) {
      _loglevel.default.debug(`Message was not hex encoded, interpreting as utf8.`);
    }

    return (0, _ethereumjsUtil.bufferToHex)(Buffer.from(data, 'utf8'));
  }

}

exports.default = DecryptMessageManager;

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=app/scripts/lib/decrypt-message-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/decrypt-message-manager.js",}],
[9, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {Object} CachedBalancesOptions
 * @property {Object} accountTracker An {@code AccountTracker} reference
 * @property {Function} getCurrentChainId A function to get the current chain id
 * @property {Object} initState The initial controller state
 */

/**
 * Background controller responsible for maintaining
 * a cache of account balances in local storage
 */
class CachedBalancesController {
  /**
   * Creates a new controller instance
   *
   * @param {CachedBalancesOptions} [opts] - Controller configuration parameters
   */
  constructor(opts = {}) {
    const {
      accountTracker,
      getCurrentChainId
    } = opts;
    this.accountTracker = accountTracker;
    this.getCurrentChainId = getCurrentChainId;

    const initState = _objectSpread({
      cachedBalances: {}
    }, opts.initState);

    this.store = new _obsStore.ObservableStore(initState);

    this._registerUpdates();
  }
  /**
   * Updates the cachedBalances property for the current chain. Cached balances will be updated to those in the passed accounts
   * if balances in the passed accounts are truthy.
   *
   * @param {Object} obj - The the recently updated accounts object for the current chain
   * @returns {Promise<void>}
   */


  async updateCachedBalances({
    accounts
  }) {
    const chainId = this.getCurrentChainId();
    const balancesToCache = await this._generateBalancesToCache(accounts, chainId);
    this.store.updateState({
      cachedBalances: balancesToCache
    });
  }

  _generateBalancesToCache(newAccounts, chainId) {
    const {
      cachedBalances
    } = this.store.getState();

    const currentChainBalancesToCache = _objectSpread({}, cachedBalances[chainId]);

    Object.keys(newAccounts).forEach(accountID => {
      const account = newAccounts[accountID];

      if (account.balance) {
        currentChainBalancesToCache[accountID] = account.balance;
      }
    });

    const balancesToCache = _objectSpread(_objectSpread({}, cachedBalances), {}, {
      [chainId]: currentChainBalancesToCache
    });

    return balancesToCache;
  }
  /**
   * Removes cachedBalances
   */


  clearCachedBalances() {
    this.store.updateState({
      cachedBalances: {}
    });
  }
  /**
   * Sets up listeners and subscriptions which should trigger an update of cached balances. These updates will
   * happen when the current account changes. Which happens on block updates, as well as on network and account
   * selections.
   *
   * @private
   *
   */


  _registerUpdates() {
    const update = this.updateCachedBalances.bind(this);
    this.accountTracker.store.subscribe(update);
  }

}

exports.default = CachedBalancesController;

//# sourceMappingURL=app/scripts/controllers/cached-balances.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/cached-balances.js",}],
[38, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/controllers":878,"@metamask/obs-store":981}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

var _controllers = require("@metamask/controllers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {import('@metamask/controllers').ControllerMessenger} ControllerMessenger
 */

/**
 * An ObservableStore that can composes a flat
 * structure of child stores based on configuration
 */
class ComposableObservableStore extends _obsStore.ObservableStore {
  /**
   * Describes which stores are being composed. The key is the name of the
   * store, and the value is either an ObserableStore, or a controller that
   * extends one of the two base controllers in the `@metamask/controllers`
   * package.
   * @type {Record<string, Object>}
   */

  /**
   * Create a new store
   *
   * @param {Object} options
   * @param {Object} [options.config] - Map of internal state keys to child stores
   * @param {ControllerMessenger} options.controllerMessenger - The controller
   *   messenger, used for subscribing to events from BaseControllerV2-based
   *   controllers.
   * @param {Object} [options.state] - The initial store state
   * @param {boolean} [options.persist] - Wether or not to apply the persistence for v2 controllers
   */
  constructor({
    config,
    controllerMessenger,
    state,
    persist
  }) {
    super(state);
    (0, _defineProperty2.default)(this, "config", {});
    this.persist = persist;
    this.controllerMessenger = controllerMessenger;

    if (config) {
      this.updateStructure(config);
    }
  }
  /**
   * Composes a new internal store subscription structure
   *
   * @param {Record<string, Object>} config - Describes which stores are being
   *   composed. The key is the name of the store, and the value is either an
   *   ObserableStore, or a controller that extends one of the two base
   *   controllers in the `@metamask/controllers` package.
   */


  updateStructure(config) {
    this.config = config;
    this.removeAllListeners();

    for (const key of Object.keys(config)) {
      if (!config[key]) {
        throw new Error(`Undefined '${key}'`);
      }

      const store = config[key];

      if (store.subscribe) {
        config[key].subscribe(state => {
          this.updateState({
            [key]: state
          });
        });
      } else {
        this.controllerMessenger.subscribe(`${store.name}:stateChange`, state => {
          let updatedState = state;

          if (this.persist) {
            updatedState = (0, _controllers.getPersistentState)(state, config[key].metadata);
          }

          this.updateState({
            [key]: updatedState
          });
        });
      }
    }
  }
  /**
   * Merges all child store state into a single object rather than
   * returning an object keyed by child store class name
   *
   * @returns {Object} Object containing merged child store state
   */


  getFlatState() {
    if (!this.config) {
      return {};
    }

    let flatState = {};

    for (const key of Object.keys(this.config)) {
      const controller = this.config[key];
      const state = controller.getState ? controller.getState() : controller.state;
      flatState = _objectSpread(_objectSpread({}, flatState), state);
    }

    return flatState;
  }

}

exports.default = ComposableObservableStore;

//# sourceMappingURL=app/scripts/lib/ComposableObservableStore.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/ComposableObservableStore.js",}],
[13, {"../../../shared/constants/network":3595,"../../../shared/constants/time":3598,"../../../shared/constants/transaction":3599,"../../../shared/modules/fetch-with-timeout":3602,"../../../shared/modules/random-id":3606,"../lib/util":78,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"bn.js":1385,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _bn = _interopRequireDefault(require("bn.js"));

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

var _util = require("../lib/util");

var _fetchWithTimeout = _interopRequireDefault(require("../../../shared/modules/fetch-with-timeout"));

var _transaction = require("../../../shared/constants/transaction");

var _network = require("../../../shared/constants/network");

var _time = require("../../../shared/constants/time");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const fetchWithTimeout = (0, _fetchWithTimeout.default)(_time.SECOND * 30);
/**
 * @typedef {import('../../../shared/constants/transaction').TransactionMeta} TransactionMeta
 */

/**
 * A transaction object in the format returned by the Etherscan API.
 *
 * Note that this is not an exhaustive type definiton; only the properties we use are defined
 *
 * @typedef {Object} EtherscanTransaction
 * @property {string} blockNumber - The number of the block this transaction was found in, in decimal
 * @property {string} from - The hex-prefixed address of the sender
 * @property {string} gas - The gas limit, in decimal GWEI
 * @property {string} [gasPrice] - The gas price, in decimal WEI
 * @property {string} [maxFeePerGas] - The maximum fee per gas, inclusive of tip, in decimal WEI
 * @property {string} [maxPriorityFeePerGas] - The maximum tip per gas in decimal WEI
 * @property {string} hash - The hex-prefixed transaction hash
 * @property {string} isError - Whether the transaction was confirmed or failed (0 for confirmed, 1 for failed)
 * @property {string} nonce - The transaction nonce, in decimal
 * @property {string} timeStamp - The timestamp for the transaction, in seconds
 * @property {string} to - The hex-prefixed address of the recipient
 * @property {string} value - The amount of ETH sent in this transaction, in decimal WEI
 */

/**
 * This controller is responsible for retrieving incoming transactions. Etherscan is polled once every block to check
 * for new incoming transactions for the current selected account on the current network
 *
 * Note that only the built-in Infura networks are supported (i.e. anything in `INFURA_PROVIDER_TYPES`). We will not
 * attempt to retrieve incoming transactions on any custom RPC endpoints.
 */

const etherscanSupportedNetworks = [_network.GOERLI_CHAIN_ID, _network.KOVAN_CHAIN_ID, _network.MAINNET_CHAIN_ID, _network.RINKEBY_CHAIN_ID, _network.ROPSTEN_CHAIN_ID, _network.MONSTA_CHAIN_ID];

class IncomingTransactionsController {
  constructor(opts = {}) {
    const {
      blockTracker,
      onNetworkDidChange,
      getCurrentChainId,
      preferencesController
    } = opts;
    this.blockTracker = blockTracker;
    this.getCurrentChainId = getCurrentChainId;
    this.preferencesController = preferencesController;

    this._onLatestBlock = async newBlockNumberHex => {
      const selectedAddress = this.preferencesController.getSelectedAddress();
      const newBlockNumberDec = parseInt(newBlockNumberHex, 16);
      await this._update(selectedAddress, newBlockNumberDec);
    };

    const initState = _objectSpread({
      incomingTransactions: {},
      incomingTxLastFetchedBlockByChainId: {
        [_network.GOERLI_CHAIN_ID]: null,
        [_network.KOVAN_CHAIN_ID]: null,
        [_network.MAINNET_CHAIN_ID]: null,
        [_network.RINKEBY_CHAIN_ID]: null,
        [_network.ROPSTEN_CHAIN_ID]: null,
        [_network.MONSTA_CHAIN_ID]: null
      }
    }, opts.initState);

    this.store = new _obsStore.ObservableStore(initState);
    this.preferencesController.store.subscribe(previousValueComparator((prevState, currState) => {
      const {
        featureFlags: {
          showIncomingTransactions: prevShowIncomingTransactions
        } = {}
      } = prevState;
      const {
        featureFlags: {
          showIncomingTransactions: currShowIncomingTransactions
        } = {}
      } = currState;

      if (currShowIncomingTransactions === prevShowIncomingTransactions) {
        return;
      }

      if (prevShowIncomingTransactions && !currShowIncomingTransactions) {
        this.stop();
        return;
      }

      this.start();
    }, this.preferencesController.store.getState()));
    this.preferencesController.store.subscribe(previousValueComparator(async (prevState, currState) => {
      const {
        selectedAddress: prevSelectedAddress
      } = prevState;
      const {
        selectedAddress: currSelectedAddress
      } = currState;

      if (currSelectedAddress === prevSelectedAddress) {
        return;
      }

      await this._update(currSelectedAddress);
    }, this.preferencesController.store.getState()));
    onNetworkDidChange(async () => {
      const address = this.preferencesController.getSelectedAddress();
      await this._update(address);
    });
  }

  start() {
    const {
      featureFlags = {}
    } = this.preferencesController.store.getState();
    const {
      showIncomingTransactions
    } = featureFlags;

    if (!showIncomingTransactions) {
      return;
    }

    this.blockTracker.removeListener('latest', this._onLatestBlock);
    this.blockTracker.addListener('latest', this._onLatestBlock);
  }

  stop() {
    this.blockTracker.removeListener('latest', this._onLatestBlock);
  }
  /**
   * Determines the correct block number to begin looking for new transactions
   * from, fetches the transactions and then saves them and the next block
   * number to begin fetching from in state. Block numbers and transactions are
   * stored per chainId.
   * @private
   * @param {string} address - address to lookup transactions for
   * @param {number} [newBlockNumberDec] - block number to begin fetching from
   * @returns {void}
   */


  async _update(address, newBlockNumberDec) {
    const chainId = this.getCurrentChainId();

    if (!etherscanSupportedNetworks.includes(chainId) || !address) {
      return;
    }

    try {
      var _ref;

      const currentState = this.store.getState();
      const currentBlock = parseInt(this.blockTracker.getCurrentBlock(), 16);
      const mostRecentlyFetchedBlock = currentState.incomingTxLastFetchedBlockByChainId[chainId];
      const blockToFetchFrom = (_ref = mostRecentlyFetchedBlock !== null && mostRecentlyFetchedBlock !== void 0 ? mostRecentlyFetchedBlock : newBlockNumberDec) !== null && _ref !== void 0 ? _ref : currentBlock;
      const newIncomingTxs = await this._getNewIncomingTransactions(address, blockToFetchFrom, chainId);
      let newMostRecentlyFetchedBlock = blockToFetchFrom;
      newIncomingTxs.forEach(tx => {
        if (tx.blockNumber && parseInt(newMostRecentlyFetchedBlock, 10) < parseInt(tx.blockNumber, 10)) {
          newMostRecentlyFetchedBlock = parseInt(tx.blockNumber, 10);
        }
      });
      this.store.updateState({
        incomingTxLastFetchedBlockByChainId: _objectSpread(_objectSpread({}, currentState.incomingTxLastFetchedBlockByChainId), {}, {
          [chainId]: newMostRecentlyFetchedBlock + 1
        }),
        incomingTransactions: newIncomingTxs.reduce((transactions, tx) => {
          transactions[tx.hash] = tx;
          return transactions;
        }, _objectSpread({}, currentState.incomingTransactions))
      });
    } catch (err) {
      _loglevel.default.error(err);
    }
  }
  /**
   * fetches transactions for the given address and chain, via etherscan, then
   * processes the data into the necessary shape for usage in this controller.
   *
   * @private
   * @param {string} [address] - Address to fetch transactions for
   * @param {number} [fromBlock] - Block to look for transactions at
   * @param {string} [chainId] - The chainId for the current network
   * @returns {TransactionMeta[]}
   */


  async _getNewIncomingTransactions(address, fromBlock, chainId) {
    const etherscanSubdomain = chainId === _network.MAINNET_CHAIN_ID ? 'api' : `api-${_network.CHAIN_ID_TO_TYPE_MAP[chainId]}`;
    const apiUrl = `https://${etherscanSubdomain}.etherscan.io`;
    let url = `${apiUrl}/api?module=account&action=txlist&address=${address}&tag=latest&page=1`;

    if (fromBlock) {
      url += `&startBlock=${parseInt(fromBlock, 10)}`;
    }

    const response = await fetchWithTimeout(url);
    const {
      status,
      result
    } = await response.json();
    let newIncomingTxs = [];

    if (status === '1' && Array.isArray(result) && result.length > 0) {
      const remoteTxList = {};
      const remoteTxs = [];
      result.forEach(tx => {
        if (!remoteTxList[tx.hash]) {
          remoteTxs.push(this._normalizeTxFromEtherscan(tx, chainId));
          remoteTxList[tx.hash] = 1;
        }
      });
      newIncomingTxs = remoteTxs.filter(tx => {
        var _tx$txParams, _tx$txParams$to;

        return ((_tx$txParams = tx.txParams) === null || _tx$txParams === void 0 ? void 0 : (_tx$txParams$to = _tx$txParams.to) === null || _tx$txParams$to === void 0 ? void 0 : _tx$txParams$to.toLowerCase()) === address.toLowerCase();
      });
      newIncomingTxs.sort((a, b) => a.time < b.time ? -1 : 1);
    }

    return newIncomingTxs;
  }
  /**
   * Transmutes a EtherscanTransaction into a TransactionMeta
   * @param {EtherscanTransaction} etherscanTransaction - the transaction to normalize
   * @param {string} chainId - The chainId of the current network
   * @returns {TransactionMeta}
   */


  _normalizeTxFromEtherscan(etherscanTransaction, chainId) {
    const time = parseInt(etherscanTransaction.timeStamp, 10) * 1000;
    const status = etherscanTransaction.isError === '0' ? _transaction.TRANSACTION_STATUSES.CONFIRMED : _transaction.TRANSACTION_STATUSES.FAILED;
    const txParams = {
      from: etherscanTransaction.from,
      gas: (0, _util.bnToHex)(new _bn.default(etherscanTransaction.gas)),
      nonce: (0, _util.bnToHex)(new _bn.default(etherscanTransaction.nonce)),
      to: etherscanTransaction.to,
      value: (0, _util.bnToHex)(new _bn.default(etherscanTransaction.value))
    };

    if (etherscanTransaction.gasPrice) {
      txParams.gasPrice = (0, _util.bnToHex)(new _bn.default(etherscanTransaction.gasPrice));
    } else if (etherscanTransaction.maxFeePerGas) {
      txParams.maxFeePerGas = (0, _util.bnToHex)(new _bn.default(etherscanTransaction.maxFeePerGas));
      txParams.maxPriorityFeePerGas = (0, _util.bnToHex)(new _bn.default(etherscanTransaction.maxPriorityFeePerGas));
    }

    return {
      blockNumber: etherscanTransaction.blockNumber,
      id: (0, _randomId.default)(),
      chainId,
      metamaskNetworkId: _network.CHAIN_ID_TO_NETWORK_ID_MAP[chainId],
      status,
      time,
      txParams,
      hash: etherscanTransaction.hash,
      type: _transaction.TRANSACTION_TYPES.INCOMING
    };
  }

}
/**
 * Returns a function with arity 1 that caches the argument that the function
 * is called with and invokes the comparator with both the cached, previous,
 * value and the current value. If specified, the initialValue will be passed
 * in as the previous value on the first invocation of the returned method.
 * @template A
 * @params {A=} type of compared value
 * @param {(prevValue: A, nextValue: A) => void} comparator - method to compare
 *  previous and next values.
 * @param {A} [initialValue] - initial value to supply to prevValue
 *  on first call of the method.
 * @returns {void}
 */


exports.default = IncomingTransactionsController;

function previousValueComparator(comparator, initialValue) {
  let first = true;
  let cache;
  return value => {
    try {
      if (first) {
        first = false;
        return comparator(initialValue !== null && initialValue !== void 0 ? initialValue : value, value);
      }

      return comparator(cache, value);
    } finally {
      cache = value;
    }
  };
}

//# sourceMappingURL=app/scripts/controllers/incoming-transactions.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/incoming-transactions.js",}],
[62, {"@babel/runtime/helpers/interopRequireDefault":186,"promise-to-callback":2894}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodeify;

var _promiseToCallback = _interopRequireDefault(require("promise-to-callback"));

const callbackNoop = function (err) {
  if (err) {
    throw err;
  }
};
/**
 * A generator that returns a function which, when passed a promise, can treat that promise as a node style callback.
 * The prime advantage being that callbacks are better for error handling.
 *
 * @param {Function} fn - The function to handle as a callback
 * @param {Object} context - The context in which the fn is to be called, most often a this reference
 *
 */


function nodeify(fn, context) {
  return function (...args) {
    const lastArg = args[args.length - 1];
    const lastArgIsCallback = typeof lastArg === 'function';
    let callback;

    if (lastArgIsCallback) {
      callback = lastArg;
      args.pop();
    } else {
      callback = callbackNoop;
    } // call the provided function and ensure result is a promise


    let result;

    try {
      result = Promise.resolve(fn.apply(context, args));
    } catch (err) {
      result = Promise.reject(err);
    } // wire up promise resolution to callback


    (0, _promiseToCallback.default)(result)(callback);
  };
}

//# sourceMappingURL=app/scripts/lib/nodeify.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/nodeify.js",}],
[73, {"@babel/runtime/helpers/interopRequireDefault":186,"eth-keyring-controller":1738,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethKeyringController = _interopRequireDefault(require("eth-keyring-controller"));

var _loglevel = _interopRequireDefault(require("loglevel"));

const seedPhraseVerifier = {
  /**
   * Verifies if the seed words can restore the accounts.
   *
   * Key notes:
   * - The seed words can recreate the primary keyring and the accounts belonging to it.
   * - The created accounts in the primary keyring are always the same.
   * - The keyring always creates the accounts in the same sequence.
   *
   * @param {Array} createdAccounts - The accounts to restore
   * @param {string} seedWords - The seed words to verify
   * @returns {Promise<void>} Promises undefined
   *
   */
  async verifyAccounts(createdAccounts, seedWords) {
    if (!createdAccounts || createdAccounts.length < 1) {
      throw new Error('No created accounts defined.');
    }

    const keyringController = new _ethKeyringController.default({});
    const Keyring = keyringController.getKeyringClassForType('HD Key Tree');
    const opts = {
      mnemonic: seedWords,
      numberOfAccounts: createdAccounts.length
    };
    const keyring = new Keyring(opts);
    const restoredAccounts = await keyring.getAccounts();

    _loglevel.default.debug(`Created accounts: ${JSON.stringify(createdAccounts)}`);

    _loglevel.default.debug(`Restored accounts: ${JSON.stringify(restoredAccounts)}`);

    if (restoredAccounts.length !== createdAccounts.length) {
      // this should not happen...
      throw new Error('Wrong number of accounts');
    }

    for (let i = 0; i < restoredAccounts.length; i++) {
      if (restoredAccounts[i].toLowerCase() !== createdAccounts[i].toLowerCase()) {
        throw new Error(`Not identical accounts! Original: ${createdAccounts[i]}, Restored: ${restoredAccounts[i]}`);
      }
    }
  }

};
var _default = seedPhraseVerifier;
exports.default = _default;

//# sourceMappingURL=app/scripts/lib/seed-phrase-verifier.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/seed-phrase-verifier.js",}],
[49, {"../../../shared/constants/app":3591,"../../../shared/modules/random-id":3606,"../metamask-controller":79,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"eth-rpc-errors":1748,"events":1429,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _obsStore = require("@metamask/obs-store");

var _ethRpcErrors = require("eth-rpc-errors");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _app = require("../../../shared/constants/app");

var _metamaskController = require("../metamask-controller");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

/**
 * Represents, and contains data about, an 'eth_getEncryptionPublicKey' type request. These are created when
 * an eth_getEncryptionPublicKey call is requested.
 *
 * @typedef {Object} EncryptionPublicKey
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the encryptionPublicKey method once the request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the request is 'unapproved', 'approved', 'received' or 'rejected'
 * @property {string} type The json-prc method for which a request has been made. A 'Message' will
 * always have a 'eth_getEncryptionPublicKey' type.
 *
 */
class EncryptionPublicKeyManager extends _events.default {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - EncryptionPublicKey.
   *
   * @typedef {Object} EncryptionPublicKeyManager
   * @property {Object} memStore The observable store where EncryptionPublicKey are saved with persistance.
   * @property {Object} memStore.unapprovedEncryptionPublicKeyMsgs A collection of all EncryptionPublicKeys in the 'unapproved' state
   * @property {number} memStore.unapprovedEncryptionPublicKeyMsgCount The count of all EncryptionPublicKeys in this.memStore.unapprobedMsgs
   * @property {Array} messages Holds all messages that have been created by this EncryptionPublicKeyManager
   *
   */
  constructor() {
    super();
    this.memStore = new _obsStore.ObservableStore({
      unapprovedEncryptionPublicKeyMsgs: {},
      unapprovedEncryptionPublicKeyMsgCount: 0
    });
    this.messages = [];
  }
  /**
   * A getter for the number of 'unapproved' EncryptionPublicKeys in this.messages
   *
   * @returns {number} The number of 'unapproved' EncryptionPublicKeys in this.messages
   *
   */


  get unapprovedEncryptionPublicKeyMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }
  /**
   * A getter for the 'unapproved' EncryptionPublicKeys in this.messages
   *
   * @returns {Object} An index of EncryptionPublicKey ids to EncryptionPublicKeys, for all 'unapproved' EncryptionPublicKeys in
   * this.messages
   *
   */


  getUnapprovedMsgs() {
    return this.messages.filter(msg => msg.status === 'unapproved').reduce((result, msg) => {
      result[msg.id] = msg;
      return result;
    }, {});
  }
  /**
   * Creates a new EncryptionPublicKey with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new EncryptionPublicKey to this.messages, and to save the unapproved EncryptionPublicKeys from that list to
   * this.memStore.
   *
   * @param {Object} address - The param for the eth_getEncryptionPublicKey call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {Promise<Buffer>} The raw public key contents
   *
   */


  addUnapprovedMessageAsync(address, req) {
    return new Promise((resolve, reject) => {
      if (!address) {
        reject(new Error('MetaMask Message: address field is required.'));
        return;
      }

      const msgId = this.addUnapprovedMessage(address, req);
      this.once(`${msgId}:finished`, data => {
        switch (data.status) {
          case 'received':
            resolve(data.rawData);
            return;

          case 'rejected':
            reject(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask EncryptionPublicKey: User denied message EncryptionPublicKey.'));
            return;

          default:
            reject(new Error(`MonstaWalletEncryptionPublicKey: Unknown problem: ${JSON.stringify(address)}`));
        }
      });
    });
  }
  /**
   * Creates a new EncryptionPublicKey with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new EncryptionPublicKey to this.messages, and to save the unapproved EncryptionPublicKeys from that list to
   * this.memStore.
   *
   * @param {Object} address - The param for the eth_getEncryptionPublicKey call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created EncryptionPublicKey.
   *
   */


  addUnapprovedMessage(address, req) {
    _loglevel.default.debug(`EncryptionPublicKeyManager addUnapprovedMessage: address`); // create txData obj with parameters and meta data


    const time = new Date().getTime();
    const msgId = (0, _randomId.default)();
    const msgData = {
      id: msgId,
      msgParams: address,
      time,
      status: 'unapproved',
      type: _app.MESSAGE_TYPE.ETH_GET_ENCRYPTION_PUBLIC_KEY
    };

    if (req) {
      msgData.origin = req.origin;
    }

    this.addMsg(msgData); // signal update

    this.emit('update');
    return msgId;
  }
  /**
   * Adds a passed EncryptionPublicKey to this.messages, and calls this._saveMsgList() to save the unapproved EncryptionPublicKeys from that
   * list to this.memStore.
   *
   * @param {Message} msg The EncryptionPublicKey to add to this.messages
   *
   */


  addMsg(msg) {
    this.messages.push(msg);

    this._saveMsgList();
  }
  /**
   * Returns a specified EncryptionPublicKey.
   *
   * @param {number} msgId The id of the EncryptionPublicKey to get
   * @returns {EncryptionPublicKey|undefined} The EncryptionPublicKey with the id that matches the passed msgId, or undefined
   * if no EncryptionPublicKey has that id.
   *
   */


  getMsg(msgId) {
    return this.messages.find(msg => msg.id === msgId);
  }
  /**
   * Approves a EncryptionPublicKey. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper providing.
   *
   * @param {Object} msgParams The msgParams to be used when eth_getEncryptionPublicKey is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */


  approveMessage(msgParams) {
    this.setMsgStatusApproved(msgParams.metamaskId);
    return this.prepMsgForEncryptionPublicKey(msgParams);
  }
  /**
   * Sets a EncryptionPublicKey status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the EncryptionPublicKey to approve.
   *
   */


  setMsgStatusApproved(msgId) {
    this._setMsgStatus(msgId, 'approved');
  }
  /**
   * Sets a EncryptionPublicKey status to 'received' via a call to this._setMsgStatus and updates that EncryptionPublicKey in
   * this.messages by adding the raw data of request to the EncryptionPublicKey
   *
   * @param {number} msgId The id of the EncryptionPublicKey.
   * @param {buffer} rawData The raw data of the message request
   *
   */


  setMsgStatusReceived(msgId, rawData) {
    const msg = this.getMsg(msgId);
    msg.rawData = rawData;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'received');
  }
  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */


  prepMsgForEncryptionPublicKey(msgParams) {
    delete msgParams.metamaskId;
    return Promise.resolve(msgParams);
  }
  /**
   * Sets a EncryptionPublicKey status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the EncryptionPublicKey to reject.
   *
   */


  rejectMsg(msgId) {
    this._setMsgStatus(msgId, 'rejected');
  }
  /**
   * Sets a TypedMessage status to 'errored' via a call to this._setMsgStatus.
   *
   * @param {number} msgId The id of the TypedMessage to error
   *
   */


  errorMessage(msgId, error) {
    const msg = this.getMsg(msgId);
    msg.error = error;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'errored');
  }
  /**
   * Clears all unapproved messages from memory.
   */


  clearUnapproved() {
    this.messages = this.messages.filter(msg => msg.status !== 'unapproved');

    this._saveMsgList();
  }
  /**
   * Updates the status of a EncryptionPublicKey in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId The id of the EncryptionPublicKey to update.
   * @param {string} status The new status of the EncryptionPublicKey.
   * @throws A 'EncryptionPublicKeyManager - EncryptionPublicKey not found for id: "${msgId}".' if there is no EncryptionPublicKey
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The EncryptionPublicKey is also fired.
   * @fires If status is 'rejected' or 'received', an event with a name equal to `${msgId}:finished` is fired along
   * with the EncryptionPublicKey
   *
   */


  _setMsgStatus(msgId, status) {
    const msg = this.getMsg(msgId);

    if (!msg) {
      throw new Error(`EncryptionPublicKeyManager - Message not found for id: "${msgId}".`);
    }

    msg.status = status;

    this._updateMsg(msg);

    this.emit(`${msgId}:${status}`, msg);

    if (status === 'rejected' || status === 'received') {
      this.emit(`${msgId}:finished`, msg);
    }
  }
  /**
   * Sets a EncryptionPublicKey in this.messages to the passed EncryptionPublicKey if the ids are equal. Then saves the
   * unapprovedEncryptionPublicKeyMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {EncryptionPublicKey} msg - A EncryptionPublicKey that will replace an existing EncryptionPublicKey (with the same
   * id) in this.messages
   *
   */


  _updateMsg(msg) {
    const index = this.messages.findIndex(message => message.id === msg.id);

    if (index !== -1) {
      this.messages[index] = msg;
    }

    this._saveMsgList();
  }
  /**
   * Saves the unapproved EncryptionPublicKeys, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */


  _saveMsgList() {
    const unapprovedEncryptionPublicKeyMsgs = this.getUnapprovedMsgs();
    const unapprovedEncryptionPublicKeyMsgCount = Object.keys(unapprovedEncryptionPublicKeyMsgs).length;
    this.memStore.updateState({
      unapprovedEncryptionPublicKeyMsgs,
      unapprovedEncryptionPublicKeyMsgCount
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
  }

}

exports.default = EncryptionPublicKeyManager;

//# sourceMappingURL=app/scripts/lib/encryption-public-key-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/encryption-public-key-manager.js",}],
[7, {"../../../shared/constants/alerts":3590,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

var _alerts = require("../../../shared/constants/alerts");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {Object} AlertControllerInitState
 * @property {Object} alertEnabledness - A map of alerts IDs to booleans, where
 * `true` indicates that the alert is enabled and shown, and `false` the opposite.
 * @property {Object} unconnectedAccountAlertShownOrigins - A map of origin
 * strings to booleans indicating whether the "switch to connected" alert has
 * been shown (`true`) or otherwise (`false`).
 */

/**
 * @typedef {Object} AlertControllerOptions
 * @property {AlertControllerInitState} initState - The initial controller state
 */
const defaultState = {
  alertEnabledness: _alerts.TOGGLEABLE_ALERT_TYPES.reduce((alertEnabledness, alertType) => {
    alertEnabledness[alertType] = true;
    return alertEnabledness;
  }, {}),
  unconnectedAccountAlertShownOrigins: {},
  web3ShimUsageOrigins: {}
};
/**
 * Controller responsible for maintaining alert-related state.
 */

class AlertController {
  /**
   * @constructor
   * @param {AlertControllerOptions} [opts] - Controller configuration parameters
   */
  constructor(opts = {}) {
    const {
      initState = {},
      preferencesStore
    } = opts;

    const state = _objectSpread(_objectSpread({}, defaultState), {}, {
      alertEnabledness: _objectSpread(_objectSpread({}, defaultState.alertEnabledness), initState.alertEnabledness)
    });

    this.store = new _obsStore.ObservableStore(state);
    this.selectedAddress = preferencesStore.getState().selectedAddress;
    preferencesStore.subscribe(({
      selectedAddress
    }) => {
      const currentState = this.store.getState();

      if (currentState.unconnectedAccountAlertShownOrigins && this.selectedAddress !== selectedAddress) {
        this.selectedAddress = selectedAddress;
        this.store.updateState({
          unconnectedAccountAlertShownOrigins: {}
        });
      }
    });
  }

  setAlertEnabledness(alertId, enabledness) {
    let {
      alertEnabledness
    } = this.store.getState();
    alertEnabledness = _objectSpread({}, alertEnabledness);
    alertEnabledness[alertId] = enabledness;
    this.store.updateState({
      alertEnabledness
    });
  }
  /**
   * Sets the "switch to connected" alert as shown for the given origin
   * @param {string} origin - The origin the alert has been shown for
   */


  setUnconnectedAccountAlertShown(origin) {
    let {
      unconnectedAccountAlertShownOrigins
    } = this.store.getState();
    unconnectedAccountAlertShownOrigins = _objectSpread({}, unconnectedAccountAlertShownOrigins);
    unconnectedAccountAlertShownOrigins[origin] = true;
    this.store.updateState({
      unconnectedAccountAlertShownOrigins
    });
  }
  /**
   * Gets the web3 shim usage state for the given origin.
   *
   * @param {string} origin - The origin to get the web3 shim usage state for.
   * @returns {undefined | 1 | 2} The web3 shim usage state for the given
   * origin, or undefined.
   */


  getWeb3ShimUsageState(origin) {
    return this.store.getState().web3ShimUsageOrigins[origin];
  }
  /**
   * Sets the web3 shim usage state for the given origin to RECORDED.
   *
   * @param {string} origin - The origin the that used the web3 shim.
   */


  setWeb3ShimUsageRecorded(origin) {
    this._setWeb3ShimUsageState(origin, _alerts.WEB3_SHIM_USAGE_ALERT_STATES.RECORDED);
  }
  /**
   * Sets the web3 shim usage state for the given origin to DISMISSED.
   *
   * @param {string} origin - The origin that the web3 shim notification was
   * dismissed for.
   */


  setWeb3ShimUsageAlertDismissed(origin) {
    this._setWeb3ShimUsageState(origin, _alerts.WEB3_SHIM_USAGE_ALERT_STATES.DISMISSED);
  }
  /**
   * @private
   * @param {string} origin - The origin to set the state for.
   * @param {number} value - The state value to set.
   */


  _setWeb3ShimUsageState(origin, value) {
    let {
      web3ShimUsageOrigins
    } = this.store.getState();
    web3ShimUsageOrigins = _objectSpread({}, web3ShimUsageOrigins);
    web3ShimUsageOrigins[origin] = value;
    this.store.updateState({
      web3ShimUsageOrigins
    });
  }

}

exports.default = AlertController;

//# sourceMappingURL=app/scripts/controllers/alert.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/alert.js",}],
[14, {"../../../shared/constants/app":3591,"../../../shared/constants/metametrics":3594,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"buffer":1428,"ethereumjs-util":1810,"lodash":2646}, function (require, module, exports) {
(function (Buffer){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _obsStore = require("@metamask/obs-store");

var _ethereumjsUtil = require("ethereumjs-util");

var _app = require("../../../shared/constants/app");

var _metametrics = require("../../../shared/constants/metametrics");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * @typedef {import('../../../shared/constants/metametrics').MetaMetricsContext} MetaMetricsContext
 * @typedef {import('../../../shared/constants/metametrics').MetaMetricsEventPayload} MetaMetricsEventPayload
 * @typedef {import('../../../shared/constants/metametrics').MetaMetricsEventOptions} MetaMetricsEventOptions
 * @typedef {import('../../../shared/constants/metametrics').SegmentEventPayload} SegmentEventPayload
 * @typedef {import('../../../shared/constants/metametrics').SegmentInterface} SegmentInterface
 * @typedef {import('../../../shared/constants/metametrics').MetaMetricsPagePayload} MetaMetricsPagePayload
 * @typedef {import('../../../shared/constants/metametrics').MetaMetricsPageOptions} MetaMetricsPageOptions
 */

/**
 * @typedef {Object} MetaMetricsControllerState
 * @property {?string} metaMetricsId - The user's metaMetricsId that will be
 *  attached to all non-anonymized event payloads
 * @property {?boolean} participateInMetaMetrics - The user's preference for
 *  participating in the MetaMetrics analytics program. This setting controls
 *  whether or not events are tracked
 */
class MetaMetricsController {
  /**
   * @param {Object} segment - an instance of analytics-node for tracking
   *  events that conform to the new MetaMetrics tracking plan.
   * @param {Object} preferencesStore - The preferences controller store, used
   *  to access and subscribe to preferences that will be attached to events
   * @param {function} onNetworkDidChange - Used to attach a listener to the
   *  networkDidChange event emitted by the networkController
   * @param {function} getCurrentChainId - Gets the current chain id from the
   *  network controller
   * @param {function} getNetworkIdentifier - Gets the current network
   *  identifier from the network controller
   * @param {string} version - The version of the extension
   * @param {string} environment - The environment the extension is running in
   * @param {MetaMetricsControllerState} initState - State to initialized with
   */
  constructor({
    segment,
    preferencesStore,
    onNetworkDidChange,
    getCurrentChainId,
    getNetworkIdentifier,
    version,
    environment,
    initState
  }) {
    const prefState = preferencesStore.getState();
    this.chainId = getCurrentChainId();
    this.network = getNetworkIdentifier();
    this.locale = prefState.currentLocale.replace('_', '-');
    this.version = environment === 'production' ? version : `${version}-${environment}`;
    this.store = new _obsStore.ObservableStore(_objectSpread({
      participateInMetaMetrics: null,
      metaMetricsId: null
    }, initState));
    preferencesStore.subscribe(({
      currentLocale
    }) => {
      this.locale = currentLocale.replace('_', '-');
    });
    onNetworkDidChange(() => {
      this.chainId = getCurrentChainId();
      this.network = getNetworkIdentifier();
    });
    this.segment = segment;
  }

  generateMetaMetricsId() {
    return (0, _ethereumjsUtil.bufferToHex)((0, _ethereumjsUtil.keccak)(Buffer.from(String(Date.now()) + String(Math.round(Math.random() * Number.MAX_SAFE_INTEGER)))));
  }
  /**
   * Setter for the `participateInMetaMetrics` property
   *
   * @param {boolean} participateInMetaMetrics - Whether or not the user wants
   *  to participate in MetaMetrics
   * @returns {string|null} the string of the new metametrics id, or null
   *  if not set
   */


  setParticipateInMetaMetrics(participateInMetaMetrics) {
    let {
      metaMetricsId
    } = this.state;

    if (participateInMetaMetrics && !metaMetricsId) {
      metaMetricsId = this.generateMetaMetricsId();
    } else if (participateInMetaMetrics === false) {
      metaMetricsId = null;
    }

    this.store.updateState({
      participateInMetaMetrics,
      metaMetricsId
    });
    return metaMetricsId;
  }

  get state() {
    return this.store.getState();
  }
  /**
   * Build the context object to attach to page and track events.
   * @private
   * @param {Pick<MetaMetricsContext, 'referrer'>} [referrer] - dapp origin that initialized
   *  the notification window.
   * @param {Pick<MetaMetricsContext, 'page'>} [page] - page object describing the current
   *  view of the extension. Defaults to the background-process object.
   * @returns {MetaMetricsContext}
   */


  _buildContext(referrer, page = _metametrics.METAMETRICS_BACKGROUND_PAGE_OBJECT) {
    return {
      app: {
        name: 'MetaMask Extension',
        version: this.version
      },
      userAgent: window.navigator.userAgent,
      page,
      referrer
    };
  }
  /**
   * Build's the event payload, processing all fields into a format that can be
   * fed to Segment's track method
   * @private
   * @param {
   *  Omit<MetaMetricsEventPayload, 'sensitiveProperties'>
   * } rawPayload - raw payload provided to trackEvent
   * @returns {SegmentEventPayload} - formatted event payload for segment
   */


  _buildEventPayload(rawPayload) {
    var _properties$network, _properties$chain_id;

    const {
      event,
      properties,
      revenue,
      value,
      currency,
      category,
      page,
      referrer,
      environmentType = _app.ENVIRONMENT_TYPE_BACKGROUND
    } = rawPayload;
    return {
      event,
      properties: _objectSpread(_objectSpread({}, (0, _lodash.omit)(properties, ['revenue', 'locale', 'currency', 'value'])), {}, {
        revenue,
        value,
        currency,
        category,
        network: (_properties$network = properties === null || properties === void 0 ? void 0 : properties.network) !== null && _properties$network !== void 0 ? _properties$network : this.network,
        locale: this.locale,
        chain_id: (_properties$chain_id = properties === null || properties === void 0 ? void 0 : properties.chain_id) !== null && _properties$chain_id !== void 0 ? _properties$chain_id : this.chainId,
        environment_type: environmentType
      }),
      context: this._buildContext(referrer, page)
    };
  }
  /**
   * Perform validation on the payload and update the id type to use before
   * sending to Segment. Also examines the options to route and handle the
   * event appropriately.
   * @private
   * @param {SegmentEventPayload} payload - properties to attach to event
   * @param {MetaMetricsEventOptions} [options] - options for routing and
   *  handling the event
   * @returns {Promise<void>}
   */


  _track(payload, options) {
    var _options$excludeMetaM;

    const {
      isOptIn,
      metaMetricsId: metaMetricsIdOverride,
      matomoEvent,
      flushImmediately
    } = options || {};
    let idType = 'userId';
    let idValue = this.state.metaMetricsId;
    let excludeMetaMetricsId = (_options$excludeMetaM = options === null || options === void 0 ? void 0 : options.excludeMetaMetricsId) !== null && _options$excludeMetaM !== void 0 ? _options$excludeMetaM : false; // This is carried over from the old implementation, and will likely need
    // to be updated to work with the new tracking plan. I think we should use
    // a config setting for this instead of trying to match the event name

    const isSendFlow = Boolean(payload.event.match(/^send|^confirm/iu));

    if (isSendFlow) {
      excludeMetaMetricsId = true;
    } // If we are tracking sensitive data we will always use the anonymousId
    // property as well as our METAMETRICS_ANONYMOUS_ID. This prevents us from
    // associating potentially identifiable information with a specific id.
    // During the opt in flow we will track all events, but do so with the
    // anonymous id. The one exception to that rule is after the user opts in
    // to MetaMetrics. When that happens we receive back the user's new
    // MetaMetrics id before it is fully persisted to state. To avoid a race
    // condition we explicitly pass the new id to the track method. In that
    // case we will track the opt in event to the user's id. In all other cases
    // we use the metaMetricsId from state.


    if (excludeMetaMetricsId || isOptIn && !metaMetricsIdOverride) {
      idType = 'anonymousId';
      idValue = _metametrics.METAMETRICS_ANONYMOUS_ID;
    } else if (isOptIn && metaMetricsIdOverride) {
      idValue = metaMetricsIdOverride;
    }

    payload[idType] = idValue; // If this is an event on the old matomo schema, add a key to the payload
    // to designate it as such

    if (matomoEvent === true) {
      payload.properties.legacy_event = true;
    } // Promises will only resolve when the event is sent to segment. For any
    // event that relies on this promise being fulfilled before performing UI
    // updates, or otherwise delaying user interaction, supply the
    // 'flushImmediately' flag to the trackEvent method.


    return new Promise((resolve, reject) => {
      const callback = err => {
        if (err) {
          // The error that segment gives us has some manipulation done to it
          // that seemingly breaks with lockdown enabled. Creating a new error
          // here prevents the system from freezing when the network request to
          // segment fails for any reason.
          const safeError = new Error(err.message);
          safeError.stack = err.stack;
          return reject(safeError);
        }

        return resolve();
      };

      this.segment.track(payload, callback);

      if (flushImmediately) {
        this.segment.flush();
      }
    });
  }
  /**
   * track a page view with Segment
   * @param {MetaMetricsPagePayload} payload - details of the page viewed
   * @param {MetaMetricsPageOptions} [options] - options for handling the page
   *  view
   */


  trackPage({
    name,
    params,
    environmentType,
    page,
    referrer
  }, options) {
    if (this.state.participateInMetaMetrics === false) {
      return;
    }

    if (this.state.participateInMetaMetrics === null && !(options !== null && options !== void 0 && options.isOptInPath)) {
      return;
    }

    const {
      metaMetricsId
    } = this.state;
    const idTrait = metaMetricsId ? 'userId' : 'anonymousId';
    const idValue = metaMetricsId !== null && metaMetricsId !== void 0 ? metaMetricsId : _metametrics.METAMETRICS_ANONYMOUS_ID;
    this.segment.page({
      [idTrait]: idValue,
      name,
      properties: {
        params,
        locale: this.locale,
        network: this.network,
        chain_id: this.chainId,
        environment_type: environmentType
      },
      context: this._buildContext(referrer, page)
    });
  }
  /**
   * track a metametrics event, performing necessary payload manipulation and
   * routing the event to the appropriate segment source. Will split events
   * with sensitiveProperties into two events, tracking the sensitiveProperties
   * with the anonymousId only.
   * @param {MetaMetricsEventPayload} payload - details of the event
   * @param {MetaMetricsEventOptions} [options] - options for handling/routing the event
   * @returns {Promise<void>}
   */


  async trackEvent(payload, options) {
    // event and category are required fields for all payloads
    if (!payload.event || !payload.category) {
      throw new Error(`Must specify event and category. Event was: ${payload.event}. Category was: ${payload.category}. Payload keys were: ${Object.keys(payload)}. ${typeof payload.properties === 'object' ? `Payload property keys were: ${Object.keys(payload.properties)}` : ''}`);
    }

    if (!this.state.participateInMetaMetrics && !(options !== null && options !== void 0 && options.isOptIn)) {
      return;
    } // We might track multiple events if sensitiveProperties is included, this array will hold
    // the promises returned from this._track.


    const events = [];

    if (payload.sensitiveProperties) {
      // sensitiveProperties will only be tracked using the anonymousId property and generic id
      // If the event options already specify to exclude the metaMetricsId we throw an error as
      // a signal to the developer that the event was implemented incorrectly
      if ((options === null || options === void 0 ? void 0 : options.excludeMetaMetricsId) === true) {
        throw new Error('sensitiveProperties was specified in an event payload that also set the excludeMetaMetricsId flag');
      }

      const combinedProperties = (0, _lodash.merge)(payload.sensitiveProperties, payload.properties);
      events.push(this._track(this._buildEventPayload(_objectSpread(_objectSpread({}, payload), {}, {
        properties: combinedProperties
      })), _objectSpread(_objectSpread({}, options), {}, {
        excludeMetaMetricsId: true
      })));
    }

    events.push(this._track(this._buildEventPayload(payload), options));
    await Promise.all(events);
  }

}

exports.default = MetaMetricsController;

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=app/scripts/controllers/metametrics.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/metametrics.js",}],
[64, {"../../../shared/constants/app":3591,"../../../shared/modules/random-id":3606,"../metamask-controller":79,"./util":78,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"buffer":1428,"eth-rpc-errors":1748,"ethereumjs-util":1810,"events":1429,"loglevel":2657}, function (require, module, exports) {
(function (Buffer){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _obsStore = require("@metamask/obs-store");

var _ethereumjsUtil = require("ethereumjs-util");

var _ethRpcErrors = require("eth-rpc-errors");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _app = require("../../../shared/constants/app");

var _metamaskController = require("../metamask-controller");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

var _util = require("./util");

const hexRe = /^[0-9A-Fa-f]+$/gu;
/**
 * Represents, and contains data about, an 'personal_sign' type signature request. These are created when a
 * signature for an personal_sign call is requested.
 *
 * @see {@link https://web3js.readthedocs.io/en/1.0/web3-eth-personal.html#sign}
 *
 * @typedef {Object} PersonalMessage
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the personal_sign method once the signature request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed' or 'rejected'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' will
 * always have a 'personal_sign' type.
 *
 */

class PersonalMessageManager extends _events.default {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - PersonalMessage.
   *
   * @typedef {Object} PersonalMessageManager
   * @property {Object} memStore The observable store where PersonalMessage are saved.
   * @property {Object} memStore.unapprovedPersonalMsgs A collection of all PersonalMessages in the 'unapproved' state
   * @property {number} memStore.unapprovedPersonalMsgCount The count of all PersonalMessages in this.memStore.unapprobedMsgs
   * @property {Array} messages Holds all messages that have been created by this PersonalMessageManager
   *
   */
  constructor() {
    super();
    this.memStore = new _obsStore.ObservableStore({
      unapprovedPersonalMsgs: {},
      unapprovedPersonalMsgCount: 0
    });
    this.messages = [];
  }
  /**
   * A getter for the number of 'unapproved' PersonalMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' PersonalMessages in this.messages
   *
   */


  get unapprovedPersonalMsgCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }
  /**
   * A getter for the 'unapproved' PersonalMessages in this.messages
   *
   * @returns {Object} An index of PersonalMessage ids to PersonalMessages, for all 'unapproved' PersonalMessages in
   * this.messages
   *
   */


  getUnapprovedMsgs() {
    return this.messages.filter(msg => msg.status === 'unapproved').reduce((result, msg) => {
      result[msg.id] = msg;
      return result;
    }, {});
  }
  /**
   * Creates a new PersonalMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new PersonalMessage to this.messages, and to save the unapproved PersonalMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {promise} When the message has been signed or rejected
   *
   */


  addUnapprovedMessageAsync(msgParams, req) {
    return new Promise((resolve, reject) => {
      if (!msgParams.from) {
        reject(new Error('MetaMask Message Signature: from field is required.'));
        return;
      }

      const msgId = this.addUnapprovedMessage(msgParams, req);
      this.once(`${msgId}:finished`, data => {
        switch (data.status) {
          case 'signed':
            resolve(data.rawSig);
            return;

          case 'rejected':
            reject(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask Message Signature: User denied message signature.'));
            return;

          default:
            reject(new Error(`MonstaWalletMessage Signature: Unknown problem: ${JSON.stringify(msgParams)}`));
        }
      });
    });
  }
  /**
   * Creates a new PersonalMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new PersonalMessage to this.messages, and to save the unapproved PersonalMessages from that list to
   * this.memStore.
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created PersonalMessage.
   *
   */


  addUnapprovedMessage(msgParams, req) {
    _loglevel.default.debug(`PersonalMessageManager addUnapprovedMessage: ${JSON.stringify(msgParams)}`); // add origin from request


    if (req) {
      msgParams.origin = req.origin;
    }

    msgParams.data = this.normalizeMsgData(msgParams.data); // create txData obj with parameters and meta data

    const time = new Date().getTime();
    const msgId = (0, _randomId.default)();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: _app.MESSAGE_TYPE.PERSONAL_SIGN
    };
    this.addMsg(msgData); // signal update

    this.emit('update');
    return msgId;
  }
  /**
   * Adds a passed PersonalMessage to this.messages, and calls this._saveMsgList() to save the unapproved PersonalMessages from that
   * list to this.memStore.
   *
   * @param {Message} msg - The PersonalMessage to add to this.messages
   *
   */


  addMsg(msg) {
    this.messages.push(msg);

    this._saveMsgList();
  }
  /**
   * Returns a specified PersonalMessage.
   *
   * @param {number} msgId - The id of the PersonalMessage to get
   * @returns {PersonalMessage|undefined} The PersonalMessage with the id that matches the passed msgId, or undefined
   * if no PersonalMessage has that id.
   *
   */


  getMsg(msgId) {
    return this.messages.find(msg => msg.id === msgId);
  }
  /**
   * Approves a PersonalMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper signing.
   *
   * @param {Object} msgParams - The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */


  approveMessage(msgParams) {
    this.setMsgStatusApproved(msgParams.metamaskId);
    return this.prepMsgForSigning(msgParams);
  }
  /**
   * Sets a PersonalMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the PersonalMessage to approve.
   *
   */


  setMsgStatusApproved(msgId) {
    this._setMsgStatus(msgId, 'approved');
  }
  /**
   * Sets a PersonalMessage status to 'signed' via a call to this._setMsgStatus and updates that PersonalMessage in
   * this.messages by adding the raw signature data of the signature request to the PersonalMessage
   *
   * @param {number} msgId - The id of the PersonalMessage to sign.
   * @param {buffer} rawSig - The raw data of the signature request
   *
   */


  setMsgStatusSigned(msgId, rawSig) {
    const msg = this.getMsg(msgId);
    msg.rawSig = rawSig;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'signed');
  }
  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams - The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */


  prepMsgForSigning(msgParams) {
    delete msgParams.metamaskId;
    return Promise.resolve(msgParams);
  }
  /**
   * Sets a PersonalMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the PersonalMessage to reject.
   *
   */


  rejectMsg(msgId) {
    this._setMsgStatus(msgId, 'rejected');
  }
  /**
   * Clears all unapproved messages from memory.
   */


  clearUnapproved() {
    this.messages = this.messages.filter(msg => msg.status !== 'unapproved');

    this._saveMsgList();
  }
  /**
   * Updates the status of a PersonalMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId - The id of the PersonalMessage to update.
   * @param {string} status - The new status of the PersonalMessage.
   * @throws A 'PersonalMessageManager - PersonalMessage not found for id: "${msgId}".' if there is no PersonalMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The PersonalMessage is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along
   * with the PersonalMessage
   *
   */


  _setMsgStatus(msgId, status) {
    const msg = this.getMsg(msgId);

    if (!msg) {
      throw new Error(`PersonalMessageManager - Message not found for id: "${msgId}".`);
    }

    msg.status = status;

    this._updateMsg(msg);

    this.emit(`${msgId}:${status}`, msg);

    if (status === 'rejected' || status === 'signed') {
      this.emit(`${msgId}:finished`, msg);
    }
  }
  /**
   * Sets a PersonalMessage in this.messages to the passed PersonalMessage if the ids are equal. Then saves the
   * unapprovedPersonalMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {msg} PersonalMessage - A PersonalMessage that will replace an existing PersonalMessage (with the same
   * id) in this.messages
   *
   */


  _updateMsg(msg) {
    const index = this.messages.findIndex(message => message.id === msg.id);

    if (index !== -1) {
      this.messages[index] = msg;
    }

    this._saveMsgList();
  }
  /**
   * Saves the unapproved PersonalMessages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */


  _saveMsgList() {
    const unapprovedPersonalMsgs = this.getUnapprovedMsgs();
    const unapprovedPersonalMsgCount = Object.keys(unapprovedPersonalMsgs).length;
    this.memStore.updateState({
      unapprovedPersonalMsgs,
      unapprovedPersonalMsgCount
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
  }
  /**
   * A helper function that converts raw buffer data to a hex, or just returns the data if it is already formatted as a hex.
   *
   * @param {any} data - The buffer data to convert to a hex
   * @returns {string} A hex string conversion of the buffer data
   *
   */


  normalizeMsgData(data) {
    try {
      const stripped = (0, _ethereumjsUtil.stripHexPrefix)(data);

      if (stripped.match(hexRe)) {
        return (0, _util.addHexPrefix)(stripped);
      }
    } catch (e) {
      _loglevel.default.debug(`Message was not hex encoded, interpreting as utf8.`);
    }

    return (0, _ethereumjsUtil.bufferToHex)(Buffer.from(data, 'utf8'));
  }

}

exports.default = PersonalMessageManager;

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=app/scripts/lib/personal-message-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/personal-message-manager.js",}],
[2274, {"./JsonRpcEngine":2269,"./createAsyncMiddleware":2270,"./createScaffoldMiddleware":2271,"./getUniqueId":2272,"./idRemapMiddleware":2273,"./mergeMiddleware":2275}, function (require, module, exports) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./idRemapMiddleware"), exports);
__exportStar(require("./createAsyncMiddleware"), exports);
__exportStar(require("./createScaffoldMiddleware"), exports);
__exportStar(require("./getUniqueId"), exports);
__exportStar(require("./JsonRpcEngine"), exports);
__exportStar(require("./mergeMiddleware"), exports);

//# sourceMappingURL=node_modules/json-rpc-engine/dist/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/index.js",}],
[10, {"../../../shared/constants/time":3598,"../../../ui/helpers/utils/util":4020,"../constants/contracts":5,"@babel/runtime/helpers/interopRequireDefault":186,"loglevel":2657,"single-call-balance-checker-abi":3305,"web3":3525}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _web = _interopRequireDefault(require("web3"));

var _loglevel = require("loglevel");

var _singleCallBalanceCheckerAbi = _interopRequireDefault(require("single-call-balance-checker-abi"));

var _contracts = require("../constants/contracts");

var _time = require("../../../shared/constants/time");

var _util = require("../../../ui/helpers/utils/util");

// By default, poll every 3 minutes
const DEFAULT_INTERVAL = _time.MINUTE * 3;
/**
 * A controller that polls for token exchange
 * rates based on a user's current token list
 */

class DetectTokensController {
  /**
   * Creates a DetectTokensController
   *
   * @param {Object} [config] - Options to configure controller
   */
  constructor({
    interval = DEFAULT_INTERVAL,
    preferences,
    network,
    keyringMemStore,
    tokenList,
    tokensController
  } = {}) {
    var _this$preferences, _this$tokensControlle, _this$tokensControlle2;

    this.tokensController = tokensController;
    this.preferences = preferences;
    this.interval = interval;
    this.network = network;
    this.keyringMemStore = keyringMemStore;
    this.tokenList = tokenList;
    this.selectedAddress = (_this$preferences = this.preferences) === null || _this$preferences === void 0 ? void 0 : _this$preferences.store.getState().selectedAddress;
    this.tokenAddresses = (_this$tokensControlle = this.tokensController) === null || _this$tokensControlle === void 0 ? void 0 : _this$tokensControlle.state.tokens.map(token => {
      return token.address;
    });
    this.hiddenTokens = (_this$tokensControlle2 = this.tokensController) === null || _this$tokensControlle2 === void 0 ? void 0 : _this$tokensControlle2.state.ignoredTokens;
    preferences === null || preferences === void 0 ? void 0 : preferences.store.subscribe(({
      selectedAddress,
      useTokenDetection
    }) => {
      if (this.selectedAddress !== selectedAddress || this.useTokenDetection !== useTokenDetection) {
        this.selectedAddress = selectedAddress;
        this.useTokenDetection = useTokenDetection;
        this.restartTokenDetection();
      }
    });
    tokensController === null || tokensController === void 0 ? void 0 : tokensController.subscribe(({
      tokens = [],
      ignoredTokens = []
    }) => {
      this.tokenAddresses = tokens.map(token => {
        return token.address;
      });
      this.hiddenTokens = ignoredTokens;
    });
  }

  async _getTokenBalances(tokens) {
    const ethContract = this.web3.eth.contract(_singleCallBalanceCheckerAbi.default).at(_contracts.SINGLE_CALL_BALANCES_ADDRESS);
    return new Promise((resolve, reject) => {
      ethContract.balances([this.selectedAddress], tokens, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
  /**
   * For each token in the tokenlist provided by the TokenListController, check selectedAddress balance.
   */


  async detectNewTokens() {
    if (!this.isActive) {
      return;
    }

    const {
      tokenList
    } = this._tokenList.state;

    if (Object.keys(tokenList).length === 0) {
      return;
    }

    const tokensToDetect = [];
    this.web3.setProvider(this._network._provider);

    for (const tokenAddress in tokenList) {
      if (!this.tokenAddresses.find(address => (0, _util.isEqualCaseInsensitive)(address, tokenAddress)) && !this.hiddenTokens.find(address => (0, _util.isEqualCaseInsensitive)(address, tokenAddress))) {
        tokensToDetect.push(tokenAddress);
      }
    }

    const sliceOfTokensToDetect = [tokensToDetect.slice(0, 1000), tokensToDetect.slice(1000, tokensToDetect.length - 1)];

    for (const tokensSlice of sliceOfTokensToDetect) {
      let result;

      try {
        result = await this._getTokenBalances(tokensSlice);
      } catch (error) {
        (0, _loglevel.warn)(`MonstaWallet - DetectTokensController single call balance fetch failed`, error);
        return;
      }

      const tokensWithBalance = tokensSlice.filter((_, index) => {
        const balance = result[index];
        return balance && !balance.isZero();
      });
      await Promise.all(tokensWithBalance.map(tokenAddress => {
        return this.tokensController.addToken(tokenAddress, tokenList[tokenAddress].symbol, tokenList[tokenAddress].decimals);
      }));
    }
  }
  /**
   * Restart token detection polling period and call detectNewTokens
   * in case of address change or user session initialization.
   *
   */


  restartTokenDetection() {
    if (!(this.isActive && this.selectedAddress)) {
      return;
    }

    this.detectNewTokens();
    this.interval = DEFAULT_INTERVAL;
  }
  /* eslint-disable accessor-pairs */

  /**
   * @type {Number}
   */


  set interval(interval) {
    this._handle && clearInterval(this._handle);

    if (!interval) {
      return;
    }

    this._handle = setInterval(() => {
      this.detectNewTokens();
    }, interval);
  }
  /**
   * @type {Object}
   */


  set network(network) {
    if (!network) {
      return;
    }

    this._network = network;
    this.web3 = new _web.default(network._provider);
  }
  /**
   * In setter when isUnlocked is updated to true, detectNewTokens and restart polling
   * @type {Object}
   */


  set keyringMemStore(keyringMemStore) {
    if (!keyringMemStore) {
      return;
    }

    this._keyringMemStore = keyringMemStore;

    this._keyringMemStore.subscribe(({
      isUnlocked
    }) => {
      if (this.isUnlocked !== isUnlocked) {
        this.isUnlocked = isUnlocked;

        if (isUnlocked) {
          this.restartTokenDetection();
        }
      }
    });
  }
  /**
   * @type {Object}
   */


  set tokenList(tokenList) {
    if (!tokenList) {
      return;
    }

    this._tokenList = tokenList;
  }
  /**
   * Internal isActive state
   * @type {Object}
   */


  get isActive() {
    return this.isOpen && this.isUnlocked;
  }
  /* eslint-enable accessor-pairs */


}

exports.default = DetectTokensController;

//# sourceMappingURL=app/scripts/controllers/detect-tokens.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/detect-tokens.js",}],
[77, {"../../../shared/constants/app":3591,"../../../shared/modules/hexstring-utils":3604,"../../../shared/modules/random-id":3606,"../metamask-controller":79,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"assert":1095,"eth-rpc-errors":1748,"eth-sig-util":1750,"events":1429,"jsonschema":2287,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _assert = require("assert");

var _obsStore = require("@metamask/obs-store");

var _ethRpcErrors = require("eth-rpc-errors");

var _ethSigUtil = require("eth-sig-util");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _jsonschema = _interopRequireDefault(require("jsonschema"));

var _app = require("../../../shared/constants/app");

var _metamaskController = require("../metamask-controller");

var _randomId = _interopRequireDefault(require("../../../shared/modules/random-id"));

var _hexstringUtils = require("../../../shared/modules/hexstring-utils");

/**
 * Represents, and contains data about, an 'eth_signTypedData' type signature request. These are created when a
 * signature for an eth_signTypedData call is requested.
 *
 * @typedef {Object} TypedMessage
 * @property {number} id An id to track and identify the message object
 * @property {Object} msgParams The parameters to pass to the eth_signTypedData method once the signature request is
 * approved.
 * @property {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
 * @property {Object} msgParams.from The address that is making the signature request.
 * @property {string} msgParams.data A hex string conversion of the raw buffer data of the signature request
 * @property {number} time The epoch time at which the this message was created
 * @property {string} status Indicates whether the signature request is 'unapproved', 'approved', 'signed', 'rejected', or 'errored'
 * @property {string} type The json-prc signing method for which a signature request has been made. A 'Message' will
 * always have a 'eth_signTypedData' type.
 *
 */
class TypedMessageManager extends _events.default {
  /**
   * Controller in charge of managing - storing, adding, removing, updating - TypedMessage.
   */
  constructor({
    getCurrentChainId
  }) {
    super();
    this._getCurrentChainId = getCurrentChainId;
    this.memStore = new _obsStore.ObservableStore({
      unapprovedTypedMessages: {},
      unapprovedTypedMessagesCount: 0
    });
    this.messages = [];
  }
  /**
   * A getter for the number of 'unapproved' TypedMessages in this.messages
   *
   * @returns {number} The number of 'unapproved' TypedMessages in this.messages
   *
   */


  get unapprovedTypedMessagesCount() {
    return Object.keys(this.getUnapprovedMsgs()).length;
  }
  /**
   * A getter for the 'unapproved' TypedMessages in this.messages
   *
   * @returns {Object} An index of TypedMessage ids to TypedMessages, for all 'unapproved' TypedMessages in
   * this.messages
   *
   */


  getUnapprovedMsgs() {
    return this.messages.filter(msg => msg.status === 'unapproved').reduce((result, msg) => {
      result[msg.id] = msg;
      return result;
    }, {});
  }
  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.memStore. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {promise} When the message has been signed or rejected
   *
   */


  addUnapprovedMessageAsync(msgParams, req, version) {
    return new Promise((resolve, reject) => {
      const msgId = this.addUnapprovedMessage(msgParams, req, version);
      this.once(`${msgId}:finished`, data => {
        switch (data.status) {
          case 'signed':
            return resolve(data.rawSig);

          case 'rejected':
            return reject(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask Message Signature: User denied message signature.'));

          case 'errored':
            return reject(new Error(`MonstaWalletMessage Signature: ${data.error}`));

          default:
            return reject(new Error(`MonstaWalletMessage Signature: Unknown problem: ${JSON.stringify(msgParams)}`));
        }
      });
    });
  }
  /**
   * Creates a new TypedMessage with an 'unapproved' status using the passed msgParams. this.addMsg is called to add
   * the new TypedMessage to this.messages, and to save the unapproved TypedMessages from that list to
   * this.memStore. Before any of this is done, msgParams are validated
   *
   * @param {Object} msgParams - The params for the eth_sign call to be made after the message is approved.
   * @param {Object} [req] - The original request object possibly containing the origin
   * @returns {number} The id of the newly created TypedMessage.
   *
   */


  addUnapprovedMessage(msgParams, req, version) {
    msgParams.version = version;

    if (req) {
      msgParams.origin = req.origin;
    }

    this.validateParams(msgParams);

    _loglevel.default.debug(`TypedMessageManager addUnapprovedMessage: ${JSON.stringify(msgParams)}`); // create txData obj with parameters and meta data


    const time = new Date().getTime();
    const msgId = (0, _randomId.default)();
    const msgData = {
      id: msgId,
      msgParams,
      time,
      status: 'unapproved',
      type: _app.MESSAGE_TYPE.ETH_SIGN_TYPED_DATA
    };
    this.addMsg(msgData); // signal update

    this.emit('update');
    return msgId;
  }
  /**
   * Helper method for this.addUnapprovedMessage. Validates that the passed params have the required properties.
   *
   * @param {Object} params - The params to validate
   *
   */


  validateParams(params) {
    _assert.strict.ok(params && typeof params === 'object', 'Params must be an object.');

    _assert.strict.ok('data' in params, 'Params must include a "data" field.');

    _assert.strict.ok('from' in params, 'Params must include a "from" field.');

    _assert.strict.ok(typeof params.from === 'string' && (0, _hexstringUtils.isValidHexAddress)(params.from, {
      allowNonPrefixed: false
    }), '"from" field must be a valid, lowercase, hexadecimal Ethereum address string.');

    switch (params.version) {
      case 'V1':
        _assert.strict.ok(Array.isArray(params.data), '"params.data" must be an array.');

        _assert.strict.doesNotThrow(() => {
          (0, _ethSigUtil.typedSignatureHash)(params.data);
        }, 'Signing data must be valid EIP-712 typed data.');

        break;

      case 'V3':
      case 'V4':
        {
          _assert.strict.equal(typeof params.data, 'string', '"params.data" must be a string.');

          let data;

          _assert.strict.doesNotThrow(() => {
            data = JSON.parse(params.data);
          }, '"data" must be a valid JSON string.');

          const validation = _jsonschema.default.validate(data, _ethSigUtil.TYPED_MESSAGE_SCHEMA);

          _assert.strict.ok(data.primaryType in data.types, `Primary type of "${data.primaryType}" has no type definition.`);

          _assert.strict.equal(validation.errors.length, 0, 'Signing data must conform to EIP-712 schema. See https://git.io/fNtcx.');

          let {
            chainId
          } = data.domain;

          if (chainId) {
            const activeChainId = parseInt(this._getCurrentChainId(), 16);

            _assert.strict.ok(!Number.isNaN(activeChainId), `Cannot sign messages for chainId "${chainId}", because MetaMask is switching networks.`);

            if (typeof chainId === 'string') {
              chainId = parseInt(chainId, chainId.startsWith('0x') ? 16 : 10);
            }

            _assert.strict.equal(chainId, activeChainId, `Provided chainId "${chainId}" must match the active chainId "${activeChainId}"`);
          }

          break;
        }

      default:
        _assert.strict.fail(`Unknown typed data version "${params.version}"`);

    }
  }
  /**
   * Adds a passed TypedMessage to this.messages, and calls this._saveMsgList() to save the unapproved TypedMessages from that
   * list to this.memStore.
   *
   * @param {Message} msg - The TypedMessage to add to this.messages
   *
   */


  addMsg(msg) {
    this.messages.push(msg);

    this._saveMsgList();
  }
  /**
   * Returns a specified TypedMessage.
   *
   * @param {number} msgId - The id of the TypedMessage to get
   * @returns {TypedMessage|undefined} The TypedMessage with the id that matches the passed msgId, or undefined
   * if no TypedMessage has that id.
   *
   */


  getMsg(msgId) {
    return this.messages.find(msg => msg.id === msgId);
  }
  /**
   * Approves a TypedMessage. Sets the message status via a call to this.setMsgStatusApproved, and returns a promise
   * with any the message params modified for proper signing.
   *
   * @param {Object} msgParams - The msgParams to be used when eth_sign is called, plus data added by MetaMask.
   * @param {Object} msgParams.metamaskId Added to msgParams for tracking and identification within MetaMask.
   * @returns {Promise<object>} Promises the msgParams object with metamaskId removed.
   *
   */


  approveMessage(msgParams) {
    this.setMsgStatusApproved(msgParams.metamaskId);
    return this.prepMsgForSigning(msgParams);
  }
  /**
   * Sets a TypedMessage status to 'approved' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to approve.
   *
   */


  setMsgStatusApproved(msgId) {
    this._setMsgStatus(msgId, 'approved');
  }
  /**
   * Sets a TypedMessage status to 'signed' via a call to this._setMsgStatus and updates that TypedMessage in
   * this.messages by adding the raw signature data of the signature request to the TypedMessage
   *
   * @param {number} msgId - The id of the TypedMessage to sign.
   * @param {buffer} rawSig - The raw data of the signature request
   *
   */


  setMsgStatusSigned(msgId, rawSig) {
    const msg = this.getMsg(msgId);
    msg.rawSig = rawSig;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'signed');
  }
  /**
   * Removes the metamaskId property from passed msgParams and returns a promise which resolves the updated msgParams
   *
   * @param {Object} msgParams - The msgParams to modify
   * @returns {Promise<object>} Promises the msgParams with the metamaskId property removed
   *
   */


  prepMsgForSigning(msgParams) {
    delete msgParams.metamaskId;
    delete msgParams.version;
    return Promise.resolve(msgParams);
  }
  /**
   * Sets a TypedMessage status to 'rejected' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to reject.
   *
   */


  rejectMsg(msgId) {
    this._setMsgStatus(msgId, 'rejected');
  }
  /**
   * Sets a TypedMessage status to 'errored' via a call to this._setMsgStatus.
   *
   * @param {number} msgId - The id of the TypedMessage to error
   *
   */


  errorMessage(msgId, error) {
    const msg = this.getMsg(msgId);
    msg.error = error;

    this._updateMsg(msg);

    this._setMsgStatus(msgId, 'errored');
  }
  /**
   * Clears all unapproved messages from memory.
   */


  clearUnapproved() {
    this.messages = this.messages.filter(msg => msg.status !== 'unapproved');

    this._saveMsgList();
  } //
  // PRIVATE METHODS
  //

  /**
   * Updates the status of a TypedMessage in this.messages via a call to this._updateMsg
   *
   * @private
   * @param {number} msgId - The id of the TypedMessage to update.
   * @param {string} status - The new status of the TypedMessage.
   * @throws A 'TypedMessageManager - TypedMessage not found for id: "${msgId}".' if there is no TypedMessage
   * in this.messages with an id equal to the passed msgId
   * @fires An event with a name equal to `${msgId}:${status}`. The TypedMessage is also fired.
   * @fires If status is 'rejected' or 'signed', an event with a name equal to `${msgId}:finished` is fired along
   * with the TypedMessage
   *
   */


  _setMsgStatus(msgId, status) {
    const msg = this.getMsg(msgId);

    if (!msg) {
      throw new Error(`TypedMessageManager - Message not found for id: "${msgId}".`);
    }

    msg.status = status;

    this._updateMsg(msg);

    this.emit(`${msgId}:${status}`, msg);

    if (status === 'rejected' || status === 'signed' || status === 'errored') {
      this.emit(`${msgId}:finished`, msg);
    }
  }
  /**
   * Sets a TypedMessage in this.messages to the passed TypedMessage if the ids are equal. Then saves the
   * unapprovedTypedMsgs index to storage via this._saveMsgList
   *
   * @private
   * @param {msg} TypedMessage - A TypedMessage that will replace an existing TypedMessage (with the same
   * id) in this.messages
   *
   */


  _updateMsg(msg) {
    const index = this.messages.findIndex(message => message.id === msg.id);

    if (index !== -1) {
      this.messages[index] = msg;
    }

    this._saveMsgList();
  }
  /**
   * Saves the unapproved TypedMessages, and their count, to this.memStore
   *
   * @private
   * @fires 'updateBadge'
   *
   */


  _saveMsgList() {
    const unapprovedTypedMessages = this.getUnapprovedMsgs();
    const unapprovedTypedMessagesCount = Object.keys(unapprovedTypedMessages).length;
    this.memStore.updateState({
      unapprovedTypedMessages,
      unapprovedTypedMessagesCount
    });
    this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE);
  }

}

exports.default = TypedMessageManager;

//# sourceMappingURL=app/scripts/lib/typed-message-manager.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/typed-message-manager.js",}],
[31, {"../../../../shared/constants/gas":3592,"../../../../shared/constants/network":3595,"../../../../shared/constants/transaction":3599,"../../../../shared/modules/conversion.utils":3601,"../../../../shared/modules/transaction.utils":3609,"../../../../ui/helpers/constants/error-keys":3993,"../../../../ui/helpers/utils/conversions.util":4009,"../../../../ui/pages/swaps/swaps.util":4316,"../../lib/cleanErrorStack":41,"../../lib/util":78,"../../metamask-controller":79,"./lib/util":33,"./pending-tx-tracker":34,"./tx-gas-utils":35,"./tx-state-manager":36,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@babel/runtime/helpers/interopRequireWildcard":187,"@ethereumjs/common":293,"@ethereumjs/tx":297,"@metamask/obs-store":981,"bignumber.js":1351,"eth-rpc-errors":1748,"ethereumjs-util":1810,"ethers":1832,"ethjs-query":1854,"human-standard-token-abi":1928,"loglevel":2657,"nonce-tracker":2756,"safe-event-emitter":3238}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TRANSACTION_EVENTS = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safeEventEmitter = _interopRequireDefault(require("safe-event-emitter"));

var _obsStore = require("@metamask/obs-store");

var _ethereumjsUtil = require("ethereumjs-util");

var _ethjsQuery = _interopRequireDefault(require("ethjs-query"));

var _ethRpcErrors = require("eth-rpc-errors");

var _humanStandardTokenAbi = _interopRequireDefault(require("human-standard-token-abi"));

var _common = _interopRequireDefault(require("@ethereumjs/common"));

var _tx = require("@ethereumjs/tx");

var _ethers = require("ethers");

var _nonceTracker = _interopRequireDefault(require("nonce-tracker"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _cleanErrorStack = _interopRequireDefault(require("../../lib/cleanErrorStack"));

var _util = require("../../lib/util");

var _errorKeys = require("../../../../ui/helpers/constants/error-keys");

var _swaps = require("../../../../ui/pages/swaps/swaps.util");

var _conversions = require("../../../../ui/helpers/utils/conversions.util");

var _transaction = require("../../../../shared/constants/transaction");

var _metamaskController = require("../../metamask-controller");

var _gas = require("../../../../shared/constants/gas");

var _conversion = require("../../../../shared/modules/conversion.utils");

var _network = require("../../../../shared/constants/network");

var _transaction2 = require("../../../../shared/modules/transaction.utils");

var _txStateManager = _interopRequireDefault(require("./tx-state-manager"));

var _txGasUtils = _interopRequireDefault(require("./tx-gas-utils"));

var _pendingTxTracker = _interopRequireDefault(require("./pending-tx-tracker"));

var txUtils = _interopRequireWildcard(require("./lib/util"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const hstInterface = new _ethers.ethers.utils.Interface(_humanStandardTokenAbi.default);
/* eslint-disable prefer-destructuring */
// Destructuring breaks the inlining of the environment variables

const METAMASK_ENVIRONMENT = "other";
const MAX_MEMSTORE_TX_LIST_SIZE = 100; // Number of transactions (by unique nonces) to keep in memory

const TRANSACTION_EVENTS = {
  ADDED: 'Transaction Added',
  APPROVED: 'Transaction Approved',
  FINALIZED: 'Transaction Finalized',
  REJECTED: 'Transaction Rejected',
  SUBMITTED: 'Transaction Submitted'
};
/**
 * @typedef {Object} CustomGasSettings
 * @property {string} [gas] - The gas limit to use for the transaction
 * @property {string} [gasPrice] - The gasPrice to use for a legacy transaction
 * @property {string} [maxFeePerGas] - The maximum amount to pay per gas on a
 *  EIP-1559 transaction
 * @property {string} [maxPriorityFeePerGas] - The maximum amount of paid fee
 *  to be distributed to miner in an EIP-1559 transaction
 */

/**
  Transaction Controller is an aggregate of sub-controllers and trackers
  composing them in a way to be exposed to the metamask controller
    <br>- txStateManager
      responsible for the state of a transaction and
      storing the transaction
    <br>- pendingTxTracker
      watching blocks for transactions to be include
      and emitting confirmed events
    <br>- txGasUtil
      gas calculations and safety buffering
    <br>- nonceTracker
      calculating nonces

  @class
  @param {Object} opts
  @param {Object} opts.initState - initial transaction list default is an empty array
  @param {Object} opts.networkStore - an observable store for network number
  @param {Object} opts.blockTracker - An instance of eth-blocktracker
  @param {Object} opts.provider - A network provider.
  @param {Function} opts.signTransaction - function the signs an @ethereumjs/tx
  @param {Object} opts.getPermittedAccounts - get accounts that an origin has permissions for
  @param {Function} opts.signTransaction - ethTx signer that returns a rawTx
  @param {number} [opts.txHistoryLimit] - number *optional* for limiting how many transactions are in state
  @param {Object} opts.preferencesStore
*/

exports.TRANSACTION_EVENTS = TRANSACTION_EVENTS;

class TransactionController extends _safeEventEmitter.default {
  constructor(opts) {
    super();
    this.networkStore = opts.networkStore || new _obsStore.ObservableStore({});
    this._getCurrentChainId = opts.getCurrentChainId;
    this.getProviderConfig = opts.getProviderConfig;
    this._getCurrentNetworkEIP1559Compatibility = opts.getCurrentNetworkEIP1559Compatibility;
    this._getCurrentAccountEIP1559Compatibility = opts.getCurrentAccountEIP1559Compatibility;
    this.preferencesStore = opts.preferencesStore || new _obsStore.ObservableStore({});
    this.provider = opts.provider;
    this.getPermittedAccounts = opts.getPermittedAccounts;
    this.blockTracker = opts.blockTracker;
    this.signEthTx = opts.signTransaction;
    this.inProcessOfSigning = new Set();
    this._trackMetaMetricsEvent = opts.trackMetaMetricsEvent;
    this._getParticipateInMetrics = opts.getParticipateInMetrics;
    this._getEIP1559GasFeeEstimates = opts.getEIP1559GasFeeEstimates;
    this.memStore = new _obsStore.ObservableStore({});
    this.query = new _ethjsQuery.default(this.provider);
    this.txGasUtil = new _txGasUtils.default(this.provider);

    this._mapMethods();

    this.txStateManager = new _txStateManager.default({
      initState: opts.initState,
      txHistoryLimit: opts.txHistoryLimit,
      getNetwork: this.getNetwork.bind(this),
      getCurrentChainId: opts.getCurrentChainId
    });

    this._onBootCleanUp();

    this.store = this.txStateManager.store;
    this.nonceTracker = new _nonceTracker.default({
      provider: this.provider,
      blockTracker: this.blockTracker,
      getPendingTransactions: this.txStateManager.getPendingTransactions.bind(this.txStateManager),
      getConfirmedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager)
    });
    this.pendingTxTracker = new _pendingTxTracker.default({
      provider: this.provider,
      nonceTracker: this.nonceTracker,
      publishTransaction: rawTx => this.query.sendRawTransaction(rawTx),
      getPendingTransactions: () => {
        const pending = this.txStateManager.getPendingTransactions();
        const approved = this.txStateManager.getApprovedTransactions();
        return [...pending, ...approved];
      },
      approveTransaction: this.approveTransaction.bind(this),
      getCompletedTransactions: this.txStateManager.getConfirmedTransactions.bind(this.txStateManager)
    });
    this.txStateManager.store.subscribe(() => this.emit(_metamaskController.METAMASK_CONTROLLER_EVENTS.UPDATE_BADGE));

    this._setupListeners(); // memstore is computed from a few different stores


    this._updateMemstore();

    this.txStateManager.store.subscribe(() => this._updateMemstore());
    this.networkStore.subscribe(() => {
      this._onBootCleanUp();

      this._updateMemstore();
    }); // request state update to finalize initialization

    this._updatePendingTxsAfterFirstBlock();
  }
  /**
   * Gets the current chainId in the network store as a number, returning 0 if
   * the chainId parses to NaN.
   *
   * @returns {number} The numerical chainId.
   */


  getChainId() {
    const networkState = this.networkStore.getState();

    const chainId = this._getCurrentChainId();

    const integerChainId = parseInt(chainId, 16);

    if (networkState === 'loading' || Number.isNaN(integerChainId)) {
      return 0;
    }

    return integerChainId;
  }

  async getEIP1559Compatibility(fromAddress) {
    const currentNetworkIsCompatible = await this._getCurrentNetworkEIP1559Compatibility();
    const fromAccountIsCompatible = await this._getCurrentAccountEIP1559Compatibility(fromAddress);
    return currentNetworkIsCompatible && fromAccountIsCompatible;
  }
  /**
   * @ethereumjs/tx uses @ethereumjs/common as a configuration tool for
   * specifying which chain, network, hardfork and EIPs to support for
   * a transaction. By referencing this configuration, and analyzing the fields
   * specified in txParams, @ethereumjs/tx is able to determine which EIP-2718
   * transaction type to use.
   * @returns {Common} common configuration object
   */


  async getCommonConfiguration(fromAddress) {
    const {
      type,
      nickname: name
    } = this.getProviderConfig();
    const supportsEIP1559 = await this.getEIP1559Compatibility(fromAddress); // This logic below will have to be updated each time a hardfork happens
    // that carries with it a new Transaction type. It is inconsequential for
    // hardforks that do not include new types.

    const hardfork = supportsEIP1559 ? _network.HARDFORKS.LONDON : _network.HARDFORKS.BERLIN; // type will be one of our default network names or 'rpc'. the default
    // network names are sufficient configuration, simply pass the name as the
    // chain argument in the constructor.

    if (type !== _network.NETWORK_TYPE_RPC) {
      return new _common.default({
        chain: type,
        hardfork
      });
    } // For 'rpc' we need to use the same basic configuration as mainnet,
    // since we only support EVM compatible chains, and then override the
    // name, chainId and networkId properties. This is done using the
    // `forCustomChain` static method on the Common class.


    const chainId = parseInt(this._getCurrentChainId(), 16);
    const networkId = this.networkStore.getState();
    const customChainParams = {
      name,
      chainId,
      // It is improbable for a transaction to be signed while the network
      // is loading for two reasons.
      // 1. Pending, unconfirmed transactions are wiped on network change
      // 2. The UI is unusable (loading indicator) when network is loading.
      // setting the networkId to 0 is for type safety and to explicity lead
      // the transaction to failing if a user is able to get to this branch
      // on a custom network that requires valid network id. I have not ran
      // into this limitation on any network I have attempted, even when
      // hardcoding networkId to 'loading'.
      networkId: networkId === 'loading' ? 0 : parseInt(networkId, 10)
    };
    return _common.default.forCustomChain(_network.MAINNET, customChainParams, hardfork);
  }
  /**
  Adds a tx to the txlist
  @emits ${txMeta.id}:unapproved
  */


  addTransaction(txMeta) {
    this.txStateManager.addTransaction(txMeta);
    this.emit(`${txMeta.id}:unapproved`, txMeta);

    this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.ADDED);
  }
  /**
  Wipes the transactions for a given account
  @param {string} address - hex string of the from address for txs being removed
  */


  wipeTransactions(address) {
    this.txStateManager.wipeTransactions(address);
  }
  /**
   * Add a new unapproved transaction to the pipeline
   *
   * @returns {Promise<string>} the hash of the transaction after being submitted to the network
   * @param {Object} txParams - txParams for the transaction
   * @param {Object} opts - with the key origin to put the origin on the txMeta
   */


  async newUnapprovedTransaction(txParams, opts = {}) {
    _loglevel.default.debug(`MetaMaskController newUnapprovedTransaction ${JSON.stringify(txParams)}`);

    const initialTxMeta = await this.addUnapprovedTransaction(txParams, opts.origin); // listen for tx completion (success, fail)

    return new Promise((resolve, reject) => {
      this.txStateManager.once(`${initialTxMeta.id}:finished`, finishedTxMeta => {
        switch (finishedTxMeta.status) {
          case _transaction.TRANSACTION_STATUSES.SUBMITTED:
            return resolve(finishedTxMeta.hash);

          case _transaction.TRANSACTION_STATUSES.REJECTED:
            return reject((0, _cleanErrorStack.default)(_ethRpcErrors.ethErrors.provider.userRejectedRequest('MetaMask Tx Signature: User denied transaction signature.')));

          case _transaction.TRANSACTION_STATUSES.FAILED:
            return reject((0, _cleanErrorStack.default)(_ethRpcErrors.ethErrors.rpc.internal(finishedTxMeta.err.message)));

          default:
            return reject((0, _cleanErrorStack.default)(_ethRpcErrors.ethErrors.rpc.internal(`MonstaWalletTx Signature: Unknown problem: ${JSON.stringify(finishedTxMeta.txParams)}`)));
        }
      });
    });
  }
  /**
   * Validates and generates a txMeta with defaults and puts it in txStateManager
   * store.
   *
   * @returns {txMeta}
   */


  async addUnapprovedTransaction(txParams, origin) {
    // validate
    const normalizedTxParams = txUtils.normalizeTxParams(txParams);
    const eip1559Compatibility = await this.getEIP1559Compatibility();
    txUtils.validateTxParams(normalizedTxParams, eip1559Compatibility);
    /**
    `generateTxMeta` adds the default txMeta properties to the passed object.
    These include the tx's `id`. As we use the id for determining order of
    txes in the tx-state-manager, it is necessary to call the asynchronous
    method `this._determineTransactionType` after `generateTxMeta`.
    */

    let txMeta = this.txStateManager.generateTxMeta({
      txParams: normalizedTxParams,
      origin
    });

    if (origin === 'metamask') {
      // Assert the from address is the selected address
      if (normalizedTxParams.from !== this.getSelectedAddress()) {
        throw _ethRpcErrors.ethErrors.rpc.internal({
          message: `Internally initiated transaction is using invalid account.`,
          data: {
            origin,
            fromAddress: normalizedTxParams.from,
            selectedAddress: this.getSelectedAddress()
          }
        });
      }
    } else {
      // Assert that the origin has permissions to initiate transactions from
      // the specified address
      const permittedAddresses = await this.getPermittedAccounts(origin);

      if (!permittedAddresses.includes(normalizedTxParams.from)) {
        throw _ethRpcErrors.ethErrors.provider.unauthorized({
          data: {
            origin
          }
        });
      }
    }

    const {
      type,
      getCodeResponse
    } = await this._determineTransactionType(txParams);
    txMeta.type = type; // ensure value

    txMeta.txParams.value = txMeta.txParams.value ? (0, _util.addHexPrefix)(txMeta.txParams.value) : '0x0';
    this.addTransaction(txMeta);
    this.emit('newUnapprovedTx', txMeta);

    try {
      txMeta = await this.addTxGasDefaults(txMeta, getCodeResponse);
    } catch (error) {
      _loglevel.default.warn(error);

      txMeta = this.txStateManager.getTransaction(txMeta.id);
      txMeta.loadingDefaults = false;
      this.txStateManager.updateTransaction(txMeta, 'Failed to calculate gas defaults.');
      throw error;
    }

    txMeta.loadingDefaults = false; // save txMeta

    this.txStateManager.updateTransaction(txMeta, 'Added new unapproved transaction.');
    return txMeta;
  }
  /**
   * Adds the tx gas defaults: gas && gasPrice
   * @param {Object} txMeta - the txMeta object
   * @returns {Promise<object>} resolves with txMeta
   */


  async addTxGasDefaults(txMeta, getCodeResponse) {
    const eip1559Compatibility = await this.getEIP1559Compatibility();
    const {
      gasPrice: defaultGasPrice,
      maxFeePerGas: defaultMaxFeePerGas,
      maxPriorityFeePerGas: defaultMaxPriorityFeePerGas
    } = await this._getDefaultGasFees(txMeta, eip1559Compatibility);
    const {
      gasLimit: defaultGasLimit,
      simulationFails
    } = await this._getDefaultGasLimit(txMeta, getCodeResponse); // eslint-disable-next-line no-param-reassign

    txMeta = this.txStateManager.getTransaction(txMeta.id);

    if (simulationFails) {
      txMeta.simulationFails = simulationFails;
    }

    if (eip1559Compatibility) {
      // If the dapp has suggested a gas price, but no maxFeePerGas or maxPriorityFeePerGas
      //  then we set maxFeePerGas and maxPriorityFeePerGas to the suggested gasPrice.
      if (txMeta.txParams.gasPrice && !txMeta.txParams.maxFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
        txMeta.txParams.maxFeePerGas = txMeta.txParams.gasPrice;
        txMeta.txParams.maxPriorityFeePerGas = txMeta.txParams.gasPrice;
        txMeta.userFeeLevel = 'custom';
      } else {
        if (defaultMaxFeePerGas && defaultMaxPriorityFeePerGas && !txMeta.txParams.maxFeePerGas && !txMeta.txParams.maxPriorityFeePerGas || txMeta.origin === 'metamask') {
          txMeta.userFeeLevel = 'medium';
        } else {
          txMeta.userFeeLevel = 'custom';
        }

        if (defaultMaxFeePerGas && !txMeta.txParams.maxFeePerGas) {
          // If the dapp has not set the gasPrice or the maxFeePerGas, then we set maxFeePerGas
          // with the one returned by the gasFeeController, if that is available.
          txMeta.txParams.maxFeePerGas = defaultMaxFeePerGas;
        }

        if (defaultMaxPriorityFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
          // If the dapp has not set the gasPrice or the maxPriorityFeePerGas, then we set maxPriorityFeePerGas
          // with the one returned by the gasFeeController, if that is available.
          txMeta.txParams.maxPriorityFeePerGas = defaultMaxPriorityFeePerGas;
        }

        if (defaultGasPrice && !txMeta.txParams.maxFeePerGas) {
          // If the dapp has not set the gasPrice or the maxFeePerGas, and no maxFeePerGas is available
          // from the gasFeeController, then we set maxFeePerGas to the defaultGasPrice, assuming it is
          // available.
          txMeta.txParams.maxFeePerGas = defaultGasPrice;
        }

        if (txMeta.txParams.maxFeePerGas && !txMeta.txParams.maxPriorityFeePerGas) {
          // If the dapp has not set the gasPrice or the maxPriorityFeePerGas, and no maxPriorityFeePerGas is
          // available from the gasFeeController, then we set maxPriorityFeePerGas to
          // txMeta.txParams.maxFeePerGas, which will either be the gasPrice from the controller, the maxFeePerGas
          // set by the dapp, or the maxFeePerGas from the controller.
          txMeta.txParams.maxPriorityFeePerGas = txMeta.txParams.maxFeePerGas;
        }
      } // We remove the gasPrice param entirely when on an eip1559 compatible network


      delete txMeta.txParams.gasPrice;
    } else {
      // We ensure that maxFeePerGas and maxPriorityFeePerGas are not in the transaction params
      // when not on a EIP1559 compatible network
      delete txMeta.txParams.maxPriorityFeePerGas;
      delete txMeta.txParams.maxFeePerGas;
    } // If we have gotten to this point, and none of gasPrice, maxPriorityFeePerGas or maxFeePerGas are
    // set on txParams, it means that either we are on a non-EIP1559 network and the dapp didn't suggest
    // a gas price, or we are on an EIP1559 network, and none of gasPrice, maxPriorityFeePerGas or maxFeePerGas
    // were available from either the dapp or the network.


    if (defaultGasPrice && !txMeta.txParams.gasPrice && !txMeta.txParams.maxPriorityFeePerGas && !txMeta.txParams.maxFeePerGas) {
      txMeta.txParams.gasPrice = defaultGasPrice;
    }

    if (defaultGasLimit && !txMeta.txParams.gas) {
      txMeta.txParams.gas = defaultGasLimit;
    }

    return txMeta;
  }
  /**
   * Gets default gas fees, or returns `undefined` if gas fees are already set
   * @param {Object} txMeta - The txMeta object
   * @returns {Promise<string|undefined>} The default gas price
   */


  async _getDefaultGasFees(txMeta, eip1559Compatibility) {
    if (!eip1559Compatibility && txMeta.txParams.gasPrice || eip1559Compatibility && txMeta.txParams.maxFeePerGas && txMeta.txParams.maxPriorityFeePerGas) {
      return {};
    }

    try {
      const {
        gasFeeEstimates,
        gasEstimateType
      } = await this._getEIP1559GasFeeEstimates();

      if (eip1559Compatibility && gasEstimateType === _gas.GAS_ESTIMATE_TYPES.FEE_MARKET) {
        const {
          medium: {
            suggestedMaxPriorityFeePerGas,
            suggestedMaxFeePerGas
          } = {}
        } = gasFeeEstimates;

        if (suggestedMaxPriorityFeePerGas && suggestedMaxFeePerGas) {
          return {
            maxFeePerGas: (0, _conversion.decGWEIToHexWEI)(suggestedMaxFeePerGas),
            maxPriorityFeePerGas: (0, _conversion.decGWEIToHexWEI)(suggestedMaxPriorityFeePerGas)
          };
        }
      } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.LEGACY) {
        // The LEGACY type includes low, medium and high estimates of
        // gas price values.
        return {
          gasPrice: (0, _conversion.decGWEIToHexWEI)(gasFeeEstimates.medium)
        };
      } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
        // The ETH_GASPRICE type just includes a single gas price property,
        // which we can assume was retrieved from eth_gasPrice
        return {
          gasPrice: (0, _conversion.decGWEIToHexWEI)(gasFeeEstimates.gasPrice)
        };
      }
    } catch (e) {
      console.error(e);
    }

    const gasPrice = await this.query.gasPrice();
    return {
      gasPrice: gasPrice && (0, _util.addHexPrefix)(gasPrice.toString(16))
    };
  }
  /**
   * Gets default gas limit, or debug information about why gas estimate failed.
   * @param {Object} txMeta - The txMeta object
   * @param {string} getCodeResponse - The transaction category code response, used for debugging purposes
   * @returns {Promise<Object>} Object containing the default gas limit, or the simulation failure object
   */


  async _getDefaultGasLimit(txMeta, getCodeResponse) {
    const chainId = this._getCurrentChainId();

    const customNetworkGasBuffer = _network.CHAIN_ID_TO_GAS_LIMIT_BUFFER_MAP[chainId];
    const chainType = (0, _util.getChainType)(chainId);

    if (txMeta.txParams.gas) {
      return {};
    } else if (txMeta.txParams.to && txMeta.type === _transaction.TRANSACTION_TYPES.SIMPLE_SEND && chainType !== 'custom') {
      // if there's data in the params, but there's no contract code, it's not a valid transaction
      if (txMeta.txParams.data) {
        const err = new Error('TxGasUtil - Trying to call a function on a non-contract address'); // set error key so ui can display localized error message

        err.errorKey = _errorKeys.TRANSACTION_NO_CONTRACT_ERROR_KEY; // set the response on the error so that we can see in logs what the actual response was

        err.getCodeResponse = getCodeResponse;
        throw err;
      } // This is a standard ether simple send, gas requirement is exactly 21k


      return {
        gasLimit: _gas.GAS_LIMITS.SIMPLE
      };
    }

    const {
      blockGasLimit,
      estimatedGasHex,
      simulationFails
    } = await this.txGasUtil.analyzeGasUsage(txMeta); // add additional gas buffer to our estimation for safety

    const gasLimit = this.txGasUtil.addGasBuffer((0, _util.addHexPrefix)(estimatedGasHex), blockGasLimit, customNetworkGasBuffer);
    return {
      gasLimit,
      simulationFails
    };
  }
  /**
   * Given a TransactionMeta object, generate new gas params such that if the
   * transaction was an EIP1559 transaction, it only has EIP1559 gas fields,
   * otherwise it only has gasPrice. Will use whatever custom values are
   * specified in customGasSettings, or falls back to incrementing by a percent
   * which is defined by specifying a numerator. 11 is a 10% bump, 12 would be
   * a 20% bump, and so on.
   * @param {import(
   *  '../../../../shared/constants/transaction'
   * ).TransactionMeta} originalTxMeta - Original transaction to use as base
   * @param {CustomGasSettings} [customGasSettings] - overrides for the gas
   *  fields to use instead of the multiplier
   * @param {number} [incrementNumerator] - Numerator from which to generate a
   *  percentage bump of gas price. E.g 11 would be a 10% bump over base.
   * @returns {{ newGasParams: CustomGasSettings, previousGasParams: CustomGasSettings }}
   */


  generateNewGasParams(originalTxMeta, customGasSettings = {}, incrementNumerator = 11) {
    const {
      txParams
    } = originalTxMeta;
    const previousGasParams = {};
    const newGasParams = {};

    if (customGasSettings.gasLimit) {
      var _customGasSettings$ga;

      newGasParams.gas = (_customGasSettings$ga = customGasSettings === null || customGasSettings === void 0 ? void 0 : customGasSettings.gas) !== null && _customGasSettings$ga !== void 0 ? _customGasSettings$ga : _gas.GAS_LIMITS.SIMPLE;
    }

    if ((0, _transaction2.isEIP1559Transaction)(originalTxMeta)) {
      previousGasParams.maxFeePerGas = txParams.maxFeePerGas;
      previousGasParams.maxPriorityFeePerGas = txParams.maxPriorityFeePerGas;
      newGasParams.maxFeePerGas = (customGasSettings === null || customGasSettings === void 0 ? void 0 : customGasSettings.maxFeePerGas) || (0, _util.bnToHex)((0, _util.BnMultiplyByFraction)((0, _util.hexToBn)(txParams.maxFeePerGas), incrementNumerator, 10));
      newGasParams.maxPriorityFeePerGas = (customGasSettings === null || customGasSettings === void 0 ? void 0 : customGasSettings.maxPriorityFeePerGas) || (0, _util.bnToHex)((0, _util.BnMultiplyByFraction)((0, _util.hexToBn)(txParams.maxPriorityFeePerGas), incrementNumerator, 10));
    } else {
      previousGasParams.gasPrice = txParams.gasPrice;
      newGasParams.gasPrice = (customGasSettings === null || customGasSettings === void 0 ? void 0 : customGasSettings.gasPrice) || (0, _util.bnToHex)((0, _util.BnMultiplyByFraction)((0, _util.hexToBn)(txParams.gasPrice), incrementNumerator, 10));
    }

    return {
      previousGasParams,
      newGasParams
    };
  }
  /**
   * Creates a new approved transaction to attempt to cancel a previously submitted transaction. The
   * new transaction contains the same nonce as the previous, is a basic ETH transfer of 0x value to
   * the sender's address, and has a higher gasPrice than that of the previous transaction.
   * @param {number} originalTxId - the id of the txMeta that you want to attempt to cancel
   * @param {CustomGasSettings} [customGasSettings] - overrides to use for gas
   *  params instead of allowing this method to generate them
   * @returns {txMeta}
   */


  async createCancelTransaction(originalTxId, customGasSettings, {
    estimatedBaseFee
  } = {}) {
    const originalTxMeta = this.txStateManager.getTransaction(originalTxId);
    const {
      txParams
    } = originalTxMeta;
    const {
      from,
      nonce
    } = txParams;
    const {
      previousGasParams,
      newGasParams
    } = this.generateNewGasParams(originalTxMeta, _objectSpread(_objectSpread({}, customGasSettings), {}, {
      // We want to override the previous transactions gasLimit because it
      // will now be a simple send instead of whatever it was before such
      // as a token transfer or contract call.
      gasLimit: customGasSettings.gasLimit || _gas.GAS_LIMITS.SIMPLE
    }));
    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: _objectSpread({
        from,
        to: from,
        nonce,
        value: '0x0'
      }, newGasParams),
      previousGasParams,
      loadingDefaults: false,
      status: _transaction.TRANSACTION_STATUSES.APPROVED,
      type: _transaction.TRANSACTION_TYPES.CANCEL
    });

    if (estimatedBaseFee) {
      newTxMeta.estimatedBaseFee = estimatedBaseFee;
    }

    this.addTransaction(newTxMeta);
    await this.approveTransaction(newTxMeta.id);
    return newTxMeta;
  }
  /**
   * Creates a new approved transaction to attempt to speed up a previously submitted transaction. The
   * new transaction contains the same nonce as the previous. By default, the new transaction will use
   * the same gas limit and a 10% higher gas price, though it is possible to set a custom value for
   * each instead.
   * @param {number} originalTxId - the id of the txMeta that you want to speed up
   * @param {CustomGasSettings} [customGasSettings] - overrides to use for gas
   *  params instead of allowing this method to generate them
   * @returns {txMeta}
   */


  async createSpeedUpTransaction(originalTxId, customGasSettings, {
    estimatedBaseFee
  } = {}) {
    const originalTxMeta = this.txStateManager.getTransaction(originalTxId);
    const {
      txParams
    } = originalTxMeta;
    const {
      previousGasParams,
      newGasParams
    } = this.generateNewGasParams(originalTxMeta, customGasSettings);
    const newTxMeta = this.txStateManager.generateTxMeta({
      txParams: _objectSpread(_objectSpread({}, txParams), newGasParams),
      previousGasParams,
      loadingDefaults: false,
      status: _transaction.TRANSACTION_STATUSES.APPROVED,
      type: _transaction.TRANSACTION_TYPES.RETRY
    });

    if (estimatedBaseFee) {
      newTxMeta.estimatedBaseFee = estimatedBaseFee;
    }

    this.addTransaction(newTxMeta);
    await this.approveTransaction(newTxMeta.id);
    return newTxMeta;
  }
  /**
  updates the txMeta in the txStateManager
  @param {Object} txMeta - the updated txMeta
  */


  async updateTransaction(txMeta) {
    this.txStateManager.updateTransaction(txMeta, 'confTx: user updated transaction');
  }
  /**
  updates and approves the transaction
  @param {Object} txMeta
  */


  async updateAndApproveTransaction(txMeta) {
    this.txStateManager.updateTransaction(txMeta, 'confTx: user approved transaction');
    await this.approveTransaction(txMeta.id);
  }
  /**
  sets the tx status to approved
  auto fills the nonce
  signs the transaction
  publishes the transaction
  if any of these steps fails the tx status will be set to failed
    @param {number} txId - the tx's Id
  */


  async approveTransaction(txId) {
    // TODO: Move this safety out of this function.
    // Since this transaction is async,
    // we need to keep track of what is currently being signed,
    // So that we do not increment nonce + resubmit something
    // that is already being incremented & signed.
    if (this.inProcessOfSigning.has(txId)) {
      return;
    }

    this.inProcessOfSigning.add(txId);
    let nonceLock;

    try {
      // approve
      this.txStateManager.setTxStatusApproved(txId); // get next nonce

      const txMeta = this.txStateManager.getTransaction(txId);
      const fromAddress = txMeta.txParams.from; // wait for a nonce

      let {
        customNonceValue
      } = txMeta;
      customNonceValue = Number(customNonceValue);
      nonceLock = await this.nonceTracker.getNonceLock(fromAddress); // add nonce to txParams
      // if txMeta has previousGasParams then it is a retry at same nonce with
      // higher gas settings and therefor the nonce should not be recalculated

      const nonce = txMeta.previousGasParams ? txMeta.txParams.nonce : nonceLock.nextNonce;
      const customOrNonce = customNonceValue === 0 ? customNonceValue : customNonceValue || nonce;
      txMeta.txParams.nonce = (0, _util.addHexPrefix)(customOrNonce.toString(16)); // add nonce debugging information to txMeta

      txMeta.nonceDetails = nonceLock.nonceDetails;

      if (customNonceValue) {
        txMeta.nonceDetails.customNonceValue = customNonceValue;
      }

      this.txStateManager.updateTransaction(txMeta, 'transactions#approveTransaction'); // sign transaction

      const rawTx = await this.signTransaction(txId);
      await this.publishTransaction(txId, rawTx);

      this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.APPROVED); // must set transaction to submitted/failed before releasing lock


      nonceLock.releaseLock();
    } catch (err) {
      // this is try-catch wrapped so that we can guarantee that the nonceLock is released
      try {
        this._failTransaction(txId, err);
      } catch (err2) {
        _loglevel.default.error(err2);
      } // must set transaction to submitted/failed before releasing lock


      if (nonceLock) {
        nonceLock.releaseLock();
      } // continue with error chain


      throw err;
    } finally {
      this.inProcessOfSigning.delete(txId);
    }
  }
  /**
    adds the chain id and signs the transaction and set the status to signed
    @param {number} txId - the tx's Id
    @returns {string} rawTx
  */


  async signTransaction(txId) {
    const txMeta = this.txStateManager.getTransaction(txId); // add network/chain id

    const chainId = this.getChainId();
    const type = (0, _transaction2.isEIP1559Transaction)(txMeta) ? _transaction.TRANSACTION_ENVELOPE_TYPES.FEE_MARKET : _transaction.TRANSACTION_ENVELOPE_TYPES.LEGACY;

    const txParams = _objectSpread(_objectSpread({}, txMeta.txParams), {}, {
      type,
      chainId,
      gasLimit: txMeta.txParams.gas
    }); // sign tx


    const fromAddress = txParams.from;
    const common = await this.getCommonConfiguration(txParams.from);

    const unsignedEthTx = _tx.TransactionFactory.fromTxData(txParams, {
      common
    });

    const signedEthTx = await this.signEthTx(unsignedEthTx, fromAddress); // add r,s,v values for provider request purposes see createMetamaskMiddleware
    // and JSON rpc standard for further explanation

    txMeta.r = (0, _ethereumjsUtil.bufferToHex)(signedEthTx.r);
    txMeta.s = (0, _ethereumjsUtil.bufferToHex)(signedEthTx.s);
    txMeta.v = (0, _ethereumjsUtil.bufferToHex)(signedEthTx.v);
    this.txStateManager.updateTransaction(txMeta, 'transactions#signTransaction: add r, s, v values'); // set state to signed

    this.txStateManager.setTxStatusSigned(txMeta.id);
    const rawTx = (0, _ethereumjsUtil.bufferToHex)(signedEthTx.serialize());
    return rawTx;
  }
  /**
    publishes the raw tx and sets the txMeta to submitted
    @param {number} txId - the tx's Id
    @param {string} rawTx - the hex string of the serialized signed transaction
    @returns {Promise<void>}
  */


  async publishTransaction(txId, rawTx) {
    const txMeta = this.txStateManager.getTransaction(txId);
    txMeta.rawTx = rawTx;

    if (txMeta.type === _transaction.TRANSACTION_TYPES.SWAP) {
      const preTxBalance = await this.query.getBalance(txMeta.txParams.from);
      txMeta.preTxBalance = preTxBalance.toString(16);
    }

    this.txStateManager.updateTransaction(txMeta, 'transactions#publishTransaction');
    let txHash;

    try {
      txHash = await this.query.sendRawTransaction(rawTx);
    } catch (error) {
      if (error.message.toLowerCase().includes('known transaction')) {
        txHash = (0, _ethereumjsUtil.keccak)((0, _ethereumjsUtil.toBuffer)((0, _util.addHexPrefix)(rawTx), 'hex')).toString('hex');
        txHash = (0, _util.addHexPrefix)(txHash);
      } else {
        throw error;
      }
    }

    this.setTxHash(txId, txHash);
    this.txStateManager.setTxStatusSubmitted(txId);

    this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.SUBMITTED);
  }
  /**
   * Sets the status of the transaction to confirmed and sets the status of nonce duplicates as
   * dropped if the txParams have data it will fetch the txReceipt
   * @param {number} txId - The tx's ID
   * @returns {Promise<void>}
   */


  async confirmTransaction(txId, txReceipt, baseFeePerGas) {
    // get the txReceipt before marking the transaction confirmed
    // to ensure the receipt is gotten before the ui revives the tx
    const txMeta = this.txStateManager.getTransaction(txId);

    if (!txMeta) {
      return;
    }

    try {
      // It seems that sometimes the numerical values being returned from
      // this.query.getTransactionReceipt are BN instances and not strings.
      const gasUsed = typeof txReceipt.gasUsed === 'string' ? txReceipt.gasUsed : txReceipt.gasUsed.toString(16);
      txMeta.txReceipt = _objectSpread(_objectSpread({}, txReceipt), {}, {
        gasUsed
      });

      if (baseFeePerGas) {
        txMeta.baseFeePerGas = baseFeePerGas;
      }

      this.txStateManager.setTxStatusConfirmed(txId);

      this._markNonceDuplicatesDropped(txId);

      const {
        submittedTime
      } = txMeta;
      const metricsParams = {
        gas_used: gasUsed
      };

      if (submittedTime) {
        metricsParams.completion_time = this._getTransactionCompletionTime(submittedTime);
      }

      if (txReceipt.status === '0x0') {
        metricsParams.status = 'failed on-chain'; // metricsParams.error = TODO: figure out a way to get the on-chain failure reason
      }

      this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.FINALIZED, metricsParams);

      this.txStateManager.updateTransaction(txMeta, 'transactions#confirmTransaction - add txReceipt');

      if (txMeta.type === _transaction.TRANSACTION_TYPES.SWAP) {
        const postTxBalance = await this.query.getBalance(txMeta.txParams.from);
        const latestTxMeta = this.txStateManager.getTransaction(txId);
        const approvalTxMeta = latestTxMeta.approvalTxId ? this.txStateManager.getTransaction(latestTxMeta.approvalTxId) : null;
        latestTxMeta.postTxBalance = postTxBalance.toString(16);
        this.txStateManager.updateTransaction(latestTxMeta, 'transactions#confirmTransaction - add postTxBalance');

        this._trackSwapsMetrics(latestTxMeta, approvalTxMeta);
      }
    } catch (err) {
      _loglevel.default.error(err);
    }
  }
  /**
    Convenience method for the ui thats sets the transaction to rejected
    @param {number} txId - the tx's Id
    @returns {Promise<void>}
  */


  async cancelTransaction(txId) {
    const txMeta = this.txStateManager.getTransaction(txId);
    this.txStateManager.setTxStatusRejected(txId);

    this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.REJECTED);
  }
  /**
    Sets the txHas on the txMeta
    @param {number} txId - the tx's Id
    @param {string} txHash - the hash for the txMeta
  */


  setTxHash(txId, txHash) {
    // Add the tx hash to the persisted meta-tx object
    const txMeta = this.txStateManager.getTransaction(txId);
    txMeta.hash = txHash;
    this.txStateManager.updateTransaction(txMeta, 'transactions#setTxHash');
  } //
  //           PRIVATE METHODS
  //

  /** maps methods for convenience*/


  _mapMethods() {
    /** @returns {Object} the state in transaction controller */
    this.getState = () => this.memStore.getState();
    /** @returns {string|number} the network number stored in networkStore */


    this.getNetwork = () => this.networkStore.getState();
    /** @returns {string} the user selected address */


    this.getSelectedAddress = () => this.preferencesStore.getState().selectedAddress;
    /** @returns {Array} transactions whos status is unapproved */


    this.getUnapprovedTxCount = () => Object.keys(this.txStateManager.getUnapprovedTxList()).length;
    /**
      @returns {number} number of transactions that have the status submitted
      @param {string} account - hex prefixed account
    */


    this.getPendingTxCount = account => this.txStateManager.getPendingTransactions(account).length;
    /** see txStateManager */


    this.getTransactions = opts => this.txStateManager.getTransactions(opts);
  } // called once on startup


  async _updatePendingTxsAfterFirstBlock() {
    // wait for first block so we know we're ready
    await this.blockTracker.getLatestBlock(); // get status update for all pending transactions (for the current network)

    await this.pendingTxTracker.updatePendingTxs();
  }
  /**
    If transaction controller was rebooted with transactions that are uncompleted
    in steps of the transaction signing or user confirmation process it will either
    transition txMetas to a failed state or try to redo those tasks.
  */


  _onBootCleanUp() {
    this.txStateManager.getTransactions({
      searchCriteria: {
        status: _transaction.TRANSACTION_STATUSES.UNAPPROVED,
        loadingDefaults: true
      }
    }).forEach(tx => {
      this.addTxGasDefaults(tx).then(txMeta => {
        txMeta.loadingDefaults = false;
        this.txStateManager.updateTransaction(txMeta, 'transactions: gas estimation for tx on boot');
      }).catch(error => {
        const txMeta = this.txStateManager.getTransaction(tx.id);
        txMeta.loadingDefaults = false;
        this.txStateManager.updateTransaction(txMeta, 'failed to estimate gas during boot cleanup.');

        this._failTransaction(txMeta.id, error);
      });
    });
    this.txStateManager.getTransactions({
      searchCriteria: {
        status: _transaction.TRANSACTION_STATUSES.APPROVED
      }
    }).forEach(txMeta => {
      const txSignError = new Error('Transaction found as "approved" during boot - possibly stuck during signing');

      this._failTransaction(txMeta.id, txSignError);
    });
  }
  /**
    is called in constructor applies the listeners for pendingTxTracker txStateManager
    and blockTracker
  */


  _setupListeners() {
    this.txStateManager.on('tx:status-update', this.emit.bind(this, 'tx:status-update'));

    this._setupBlockTrackerListener();

    this.pendingTxTracker.on('tx:warning', txMeta => {
      this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:warning');
    });
    this.pendingTxTracker.on('tx:failed', (txId, error) => {
      this._failTransaction(txId, error);
    });
    this.pendingTxTracker.on('tx:confirmed', (txId, transactionReceipt, baseFeePerGas) => this.confirmTransaction(txId, transactionReceipt, baseFeePerGas));
    this.pendingTxTracker.on('tx:dropped', txId => {
      this._dropTransaction(txId);
    });
    this.pendingTxTracker.on('tx:block-update', (txMeta, latestBlockNumber) => {
      if (!txMeta.firstRetryBlockNumber) {
        txMeta.firstRetryBlockNumber = latestBlockNumber;
        this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:block-update');
      }
    });
    this.pendingTxTracker.on('tx:retry', txMeta => {
      if (!('retryCount' in txMeta)) {
        txMeta.retryCount = 0;
      }

      txMeta.retryCount += 1;
      this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:retry');
    });
  }
  /**
   * @typedef { 'transfer' | 'approve' | 'transferfrom' | 'contractInteraction'| 'simpleSend' } InferrableTransactionTypes
   */

  /**
   * @typedef {Object} InferTransactionTypeResult
   * @property {InferrableTransactionTypes} type - The type of transaction
   * @property {string} getCodeResponse - The contract code, in hex format if
   *  it exists. '0x0' or '0x' are also indicators of non-existent contract
   *  code
   */

  /**
   * Determines the type of the transaction by analyzing the txParams.
   * This method will return one of the types defined in shared/constants/transactions
   * It will never return TRANSACTION_TYPE_CANCEL or TRANSACTION_TYPE_RETRY as these
   * represent specific events that we control from the extension and are added manually
   * at transaction creation.
   * @param {Object} txParams - Parameters for the transaction
   * @returns {InferTransactionTypeResult}
   */


  async _determineTransactionType(txParams) {
    const {
      data,
      to
    } = txParams;
    let name;

    try {
      name = data && hstInterface.parseTransaction({
        data
      }).name;
    } catch (error) {
      _loglevel.default.debug('Failed to parse transaction data.', error, data);
    }

    const tokenMethodName = [_transaction.TRANSACTION_TYPES.TOKEN_METHOD_APPROVE, _transaction.TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER, _transaction.TRANSACTION_TYPES.TOKEN_METHOD_TRANSFER_FROM].find(methodName => methodName === name && name.toLowerCase());
    let result;

    if (data && tokenMethodName) {
      result = tokenMethodName;
    } else if (data && !to) {
      result = _transaction.TRANSACTION_TYPES.DEPLOY_CONTRACT;
    }

    let code;

    if (!result) {
      try {
        code = await this.query.getCode(to);
      } catch (e) {
        code = null;

        _loglevel.default.warn(e);
      }

      const codeIsEmpty = !code || code === '0x' || code === '0x0';
      result = codeIsEmpty ? _transaction.TRANSACTION_TYPES.SIMPLE_SEND : _transaction.TRANSACTION_TYPES.CONTRACT_INTERACTION;
    }

    return {
      type: result,
      getCodeResponse: code
    };
  }
  /**
    Sets other txMeta statuses to dropped if the txMeta that has been confirmed has other transactions
    in the list have the same nonce
     @param {number} txId - the txId of the transaction that has been confirmed in a block
  */


  _markNonceDuplicatesDropped(txId) {
    // get the confirmed transactions nonce and from address
    const txMeta = this.txStateManager.getTransaction(txId);
    const {
      nonce,
      from
    } = txMeta.txParams;
    const sameNonceTxs = this.txStateManager.getTransactions({
      searchCriteria: {
        nonce,
        from
      }
    });

    if (!sameNonceTxs.length) {
      return;
    } // mark all same nonce transactions as dropped and give i a replacedBy hash


    sameNonceTxs.forEach(otherTxMeta => {
      if (otherTxMeta.id === txId) {
        return;
      }

      otherTxMeta.replacedBy = txMeta.hash;
      this.txStateManager.updateTransaction(txMeta, 'transactions/pending-tx-tracker#event: tx:confirmed reference to confirmed txHash with same nonce');

      this._dropTransaction(otherTxMeta.id);
    });
  }

  _setupBlockTrackerListener() {
    let listenersAreActive = false;

    const latestBlockHandler = this._onLatestBlock.bind(this);

    const {
      blockTracker,
      txStateManager
    } = this;
    txStateManager.on('tx:status-update', updateSubscription);
    updateSubscription();

    function updateSubscription() {
      const pendingTxs = txStateManager.getPendingTransactions();

      if (!listenersAreActive && pendingTxs.length > 0) {
        blockTracker.on('latest', latestBlockHandler);
        listenersAreActive = true;
      } else if (listenersAreActive && !pendingTxs.length) {
        blockTracker.removeListener('latest', latestBlockHandler);
        listenersAreActive = false;
      }
    }
  }

  async _onLatestBlock(blockNumber) {
    try {
      await this.pendingTxTracker.updatePendingTxs();
    } catch (err) {
      _loglevel.default.error(err);
    }

    try {
      await this.pendingTxTracker.resubmitPendingTxs(blockNumber);
    } catch (err) {
      _loglevel.default.error(err);
    }
  }
  /**
    Updates the memStore in transaction controller
  */


  _updateMemstore() {
    const unapprovedTxs = this.txStateManager.getUnapprovedTxList();
    const currentNetworkTxList = this.txStateManager.getTransactions({
      limit: MAX_MEMSTORE_TX_LIST_SIZE
    });
    this.memStore.updateState({
      unapprovedTxs,
      currentNetworkTxList
    });
  }

  _trackSwapsMetrics(txMeta, approvalTxMeta) {
    if (this._getParticipateInMetrics() && txMeta.swapMetaData) {
      if (txMeta.txReceipt.status === '0x0') {
        this._trackMetaMetricsEvent({
          event: 'Swap Failed',
          sensitiveProperties: _objectSpread({}, txMeta.swapMetaData),
          category: 'swaps'
        });
      } else {
        const tokensReceived = (0, _swaps.getSwapsTokensReceivedFromTxMeta)(txMeta.destinationTokenSymbol, txMeta, txMeta.destinationTokenAddress, txMeta.txParams.from, txMeta.destinationTokenDecimals, approvalTxMeta, txMeta.chainId);
        const quoteVsExecutionRatio = tokensReceived ? `${new _bignumber.default(tokensReceived, 10).div(txMeta.swapMetaData.token_to_amount, 10).times(100).round(2)}%` : null;
        const estimatedVsUsedGasRatio = `${new _bignumber.default(txMeta.txReceipt.gasUsed, 16).div(txMeta.swapMetaData.estimated_gas, 10).times(100).round(2)}%`;

        this._trackMetaMetricsEvent({
          event: 'Swap Completed',
          category: 'swaps',
          sensitiveProperties: _objectSpread(_objectSpread({}, txMeta.swapMetaData), {}, {
            token_to_amount_received: tokensReceived,
            quote_vs_executionRatio: quoteVsExecutionRatio,
            estimated_vs_used_gasRatio: estimatedVsUsedGasRatio
          })
        });
      }
    }
  }
  /**
   * Extracts relevant properties from a transaction meta
   * object and uses them to create and send metrics for various transaction
   * events.
   * @param {Object} txMeta - the txMeta object
   * @param {string} event - the name of the transaction event
   * @param {Object} extraParams - optional props and values to include in sensitiveProperties
   */


  _trackTransactionMetricsEvent(txMeta, event, extraParams = {}) {
    if (!txMeta) {
      return;
    }

    const {
      type,
      time,
      status,
      chainId,
      origin: referrer,
      txParams: {
        gasPrice,
        gas: gasLimit,
        maxFeePerGas,
        maxPriorityFeePerGas
      },
      metamaskNetworkId: network
    } = txMeta;
    const source = referrer === 'metamask' ? 'user' : 'dapp';
    const gasParams = {};

    if ((0, _transaction2.isEIP1559Transaction)(txMeta)) {
      gasParams.max_fee_per_gas = maxFeePerGas;
      gasParams.max_priority_fee_per_gas = maxPriorityFeePerGas;
    } else {
      gasParams.gas_price = gasPrice;
    }

    const gasParamsInGwei = this._getGasValuesInGWEI(gasParams);

    this._trackMetaMetricsEvent({
      event,
      category: 'Transactions',
      properties: {
        chain_id: chainId,
        referrer,
        source,
        network,
        type
      },
      sensitiveProperties: _objectSpread(_objectSpread({
        status,
        transaction_envelope_type: (0, _transaction2.isEIP1559Transaction)(txMeta) ? 'fee-market' : 'legacy',
        first_seen: time,
        gas_limit: gasLimit
      }, gasParamsInGwei), extraParams)
    });
  }

  _getTransactionCompletionTime(submittedTime) {
    return Math.round((Date.now() - submittedTime) / 1000).toString();
  }

  _getGasValuesInGWEI(gasParams) {
    const gasValuesInGwei = {};

    for (const param in gasParams) {
      if ((0, _ethereumjsUtil.isHexString)(gasParams[param])) {
        gasValuesInGwei[param] = (0, _conversions.hexWEIToDecGWEI)(gasParams[param]);
      }
    }

    return gasValuesInGwei;
  }

  _failTransaction(txId, error) {
    this.txStateManager.setTxStatusFailed(txId, error);
    const txMeta = this.txStateManager.getTransaction(txId);

    this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.FINALIZED, {
      error: error.message
    });
  }

  _dropTransaction(txId) {
    this.txStateManager.setTxStatusDropped(txId);
    const txMeta = this.txStateManager.getTransaction(txId);

    this._trackTransactionMetricsEvent(txMeta, TRANSACTION_EVENTS.FINALIZED);
  }

}

exports.default = TransactionController;

//# sourceMappingURL=app/scripts/controllers/transactions/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/transactions/index.js",}],
[12, {"../../../../shared/constants/network":3595,"../../../../shared/modules/hexstring-utils":3604,"./ens":11,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"loglevel":2657,"punycode/punycode":2992}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _punycode = _interopRequireDefault(require("punycode/punycode"));

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _network = require("../../../../shared/constants/network");

var _hexstringUtils = require("../../../../shared/modules/hexstring-utils");

var _ens = _interopRequireDefault(require("./ens"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_X_ERROR_ADDRESS = '0x';

class EnsController {
  constructor({
    ens,
    provider,
    onNetworkDidChange,
    getCurrentChainId
  } = {}) {
    const initState = {
      ensResolutionsByAddress: {}
    };
    this._ens = ens;

    if (!this._ens) {
      const chainId = getCurrentChainId();
      const network = _network.CHAIN_ID_TO_NETWORK_ID_MAP[chainId];

      if (_ens.default.getNetworkEnsSupport(network)) {
        this._ens = new _ens.default({
          network,
          provider
        });
      }
    }

    this.store = new _obsStore.ObservableStore(initState);
    onNetworkDidChange(() => {
      this.store.putState(initState);
      const chainId = getCurrentChainId();
      const network = _network.CHAIN_ID_TO_NETWORK_ID_MAP[chainId];

      if (_ens.default.getNetworkEnsSupport(network)) {
        this._ens = new _ens.default({
          network,
          provider
        });
      } else {
        delete this._ens;
      }
    });
  }

  reverseResolveAddress(address) {
    return this._reverseResolveAddress((0, _hexstringUtils.toChecksumHexAddress)(address));
  }

  async _reverseResolveAddress(address) {
    if (!this._ens) {
      return undefined;
    }

    const state = this.store.getState();

    if (state.ensResolutionsByAddress[address]) {
      return state.ensResolutionsByAddress[address];
    }

    let domain;

    try {
      domain = await this._ens.reverse(address);
    } catch (error) {
      _loglevel.default.debug(error);

      return undefined;
    }

    let registeredAddress;

    try {
      registeredAddress = await this._ens.lookup(domain);
    } catch (error) {
      _loglevel.default.debug(error);

      return undefined;
    }

    if (registeredAddress === ZERO_ADDRESS || registeredAddress === ZERO_X_ERROR_ADDRESS) {
      return undefined;
    }

    if ((0, _hexstringUtils.toChecksumHexAddress)(registeredAddress) !== address) {
      return undefined;
    }

    this._updateResolutionsByAddress(address, _punycode.default.toASCII(domain));

    return domain;
  }

  _updateResolutionsByAddress(address, domain) {
    const oldState = this.store.getState();
    this.store.putState({
      ensResolutionsByAddress: _objectSpread(_objectSpread({}, oldState.ensResolutionsByAddress), {}, {
        [address]: domain
      })
    });
  }

}

exports.default = EnsController;

//# sourceMappingURL=app/scripts/controllers/ens/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/ens/index.js",}],
[74, {"../../../shared/constants/time":3598,"@babel/runtime/helpers/interopRequireDefault":186,"_process":2892,"analytics-node":1075}, function (require, module, exports) {
(function (process){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.segment = exports.createSegmentMock = void 0;

var _analyticsNode = _interopRequireDefault(require("analytics-node"));

var _time = require("../../../shared/constants/time");

var _process$env$SEGMENT_, _process$env$SEGMENT_2;

const isDevOrTestEnvironment = Boolean(process.env.METAMASK_DEBUG || false);
const SEGMENT_WRITE_KEY = (_process$env$SEGMENT_ = "") !== null && _process$env$SEGMENT_ !== void 0 ? _process$env$SEGMENT_ : null;
const SEGMENT_HOST = (_process$env$SEGMENT_2 = process.env.SEGMENT_HOST) !== null && _process$env$SEGMENT_2 !== void 0 ? _process$env$SEGMENT_2 : null; // flushAt controls how many events are sent to segment at once. Segment will
// hold onto a queue of events until it hits this number, then it sends them as
// a batch. This setting defaults to 20, but in development we likely want to
// see events in real time for debugging, so this is set to 1 to disable the
// queueing mechanism.

const SEGMENT_FLUSH_AT = "other" === 'production' ? undefined : 1; // flushInterval controls how frequently the queue is flushed to segment.
// This happens regardless of the size of the queue. The default setting is
// 10,000ms (10 seconds). This default is rather high, though thankfully
// using the background process as our event handler means we don't have to
// deal with short lived sessions that happen faster than the interval
// e.g confirmations. This is set to 5,000ms (5 seconds) arbitrarily with the
// intent of having a value less than 10 seconds.

const SEGMENT_FLUSH_INTERVAL = _time.SECOND * 5;
/**
 * Creates a mock segment module for usage in test environments. This is used
 * when building the application in test mode to catch event calls and prevent
 * them from being sent to segment. It is also used in unit tests to mock and
 * spy on the methods to ensure proper behavior
 * @param {number} flushAt - number of events to queue before sending to segment
 * @param {number} flushInterval - ms interval to flush queue and send to segment
 * @returns {SegmentInterface}
 */

const createSegmentMock = (flushAt = SEGMENT_FLUSH_AT, flushInterval = SEGMENT_FLUSH_INTERVAL) => {
  const segmentMock = {
    // Internal queue to keep track of events and properly mimic segment's
    // queueing behavior.
    queue: [],

    /**
     * Used to immediately send all queued events and reset the queue to zero.
     * For our purposes this simply triggers the callback method registered with
     * the event.
     */
    flush() {
      segmentMock.queue.forEach(([_, callback]) => {
        callback();
      });
      segmentMock.queue = [];
    },

    /**
     * Track an event and add it to the queue. If the queue size reaches the
     * flushAt threshold, flush the queue.
     */
    track(payload, callback = () => undefined) {
      segmentMock.queue.push([payload, callback]);

      if (segmentMock.queue.length >= flushAt) {
        segmentMock.flush();
      }
    },

    /**
     * A true NOOP, these methods are either not used or do not await callback
     * and therefore require no functionality.
     */
    page() {// noop
    },

    identify() {// noop
    }

  }; // Mimic the flushInterval behavior with an interval

  setInterval(segmentMock.flush, flushInterval);
  return segmentMock;
};

exports.createSegmentMock = createSegmentMock;
const segment = !SEGMENT_WRITE_KEY || isDevOrTestEnvironment && !SEGMENT_HOST ? createSegmentMock(SEGMENT_FLUSH_AT, SEGMENT_FLUSH_INTERVAL) : new _analyticsNode.default(SEGMENT_WRITE_KEY, {
  host: SEGMENT_HOST,
  flushAt: SEGMENT_FLUSH_AT,
  flushInterval: SEGMENT_FLUSH_INTERVAL
});
exports.segment = segment;

}).call(this,require('_process'))

//# sourceMappingURL=app/scripts/lib/segment.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/segment.js",}],
[3, {"../lib/util":78,"@babel/runtime/helpers/interopRequireDefault":186,"ethereumjs-util":1810,"ethereumjs-wallet":1816,"ethereumjs-wallet/thirdparty":1829,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loglevel = _interopRequireDefault(require("loglevel"));

var _ethereumjsWallet = _interopRequireDefault(require("ethereumjs-wallet"));

var _thirdparty = _interopRequireDefault(require("ethereumjs-wallet/thirdparty"));

var _ethereumjsUtil = require("ethereumjs-util");

var _util = require("../lib/util");

const accountImporter = {
  importAccount(strategy, args) {
    try {
      const importer = this.strategies[strategy];
      const privateKeyHex = importer(...args);
      return Promise.resolve(privateKeyHex);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  strategies: {
    'Private Key': privateKey => {
      if (!privateKey) {
        throw new Error('Cannot import an empty key.');
      }

      const prefixed = (0, _util.addHexPrefix)(privateKey);
      const buffer = (0, _ethereumjsUtil.toBuffer)(prefixed);

      if (!(0, _ethereumjsUtil.isValidPrivate)(buffer)) {
        throw new Error('Cannot import invalid private key.');
      }

      const stripped = (0, _ethereumjsUtil.stripHexPrefix)(prefixed);
      return stripped;
    },
    'JSON File': (input, password) => {
      let wallet;

      try {
        wallet = _thirdparty.default.fromEtherWallet(input, password);
      } catch (e) {
        _loglevel.default.debug('Attempt to import as EtherWallet format failed, trying V3');

        wallet = _ethereumjsWallet.default.fromV3(input, password, true);
      }

      return walletToPrivateKey(wallet);
    }
  }
};

function walletToPrivateKey(wallet) {
  const privateKeyBuffer = wallet.getPrivateKey();
  return (0, _ethereumjsUtil.bufferToHex)(privateKeyBuffer);
}

var _default = accountImporter;
exports.default = _default;

//# sourceMappingURL=app/scripts/account-import-strategies/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/account-import-strategies/index.js",}],
[29, {"../../../shared/constants/gas":3592,"../../../shared/constants/swaps":3597,"../../../shared/constants/time":3598,"../../../shared/modules/conversion.utils":3601,"../../../shared/modules/swaps.utils":3608,"../../../ui/helpers/utils/fetch-with-cache":4010,"../../../ui/helpers/utils/token-util":4017,"../../../ui/pages/send/send.utils":4228,"../../../ui/pages/swaps/swaps.util":4316,"./network":18,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"bignumber.js":1351,"ethers":1832,"human-standard-token-abi":1928,"lodash":2646,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ethers = require("ethers");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _obsStore = require("@metamask/obs-store");

var _lodash = require("lodash");

var _humanStandardTokenAbi = _interopRequireDefault(require("human-standard-token-abi"));

var _tokenUtil = require("../../../ui/helpers/utils/token-util");

var _send = require("../../../ui/pages/send/send.utils");

var _conversion = require("../../../shared/modules/conversion.utils");

var _swaps = require("../../../shared/constants/swaps");

var _gas = require("../../../shared/constants/gas");

var _swaps2 = require("../../../shared/modules/swaps.utils");

var _swaps3 = require("../../../ui/pages/swaps/swaps.util");

var _fetchWithCache = _interopRequireDefault(require("../../../ui/helpers/utils/fetch-with-cache"));

var _time = require("../../../shared/constants/time");

var _network = require("./network");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// The MAX_GAS_LIMIT is a number that is higher than the maximum gas costs we have observed on any aggregator
const MAX_GAS_LIMIT = 2500000; // To ensure that our serves are not spammed if MetaMask is left idle, we limit the number of fetches for quotes that are made on timed intervals.
// 3 seems to be an appropriate balance of giving users the time they need when MetaMask is not left idle, and turning polling off when it is.

const POLL_COUNT_LIMIT = 3; // If for any reason the MetaSwap API fails to provide a refresh time,
// provide a reasonable fallback to avoid further errors

const FALLBACK_QUOTE_REFRESH_TIME = _time.MINUTE;

function calculateGasEstimateWithRefund(maxGas = MAX_GAS_LIMIT, estimatedRefund = 0, estimatedGas = 0) {
  const maxGasMinusRefund = new _bignumber.default(maxGas, 10).minus(estimatedRefund, 10);
  const gasEstimateWithRefund = maxGasMinusRefund.lt(estimatedGas, 16) ? maxGasMinusRefund.toString(16) : estimatedGas;
  return gasEstimateWithRefund;
}

const initialState = {
  swapsState: {
    quotes: {},
    quotesPollingLimitEnabled: false,
    fetchParams: null,
    tokens: null,
    tradeTxId: null,
    approveTxId: null,
    quotesLastFetched: null,
    customMaxGas: '',
    customGasPrice: null,
    customMaxFeePerGas: null,
    customMaxPriorityFeePerGas: null,
    swapsUserFeeLevel: '',
    selectedAggId: null,
    customApproveTxData: '',
    errorKey: '',
    topAggId: null,
    routeState: '',
    swapsFeatureIsLive: true,
    useNewSwapsApi: false,
    swapsQuoteRefreshTime: FALLBACK_QUOTE_REFRESH_TIME,
    swapsQuotePrefetchingRefreshTime: FALLBACK_QUOTE_REFRESH_TIME
  }
};

class SwapsController {
  constructor({
    getBufferedGasLimit,
    networkController,
    provider,
    getProviderConfig,
    tokenRatesStore,
    fetchTradesInfo = _swaps3.fetchTradesInfo,
    getCurrentChainId,
    getEIP1559GasFeeEstimates
  }) {
    this.store = new _obsStore.ObservableStore({
      swapsState: _objectSpread({}, initialState.swapsState)
    });
    this._fetchTradesInfo = fetchTradesInfo;
    this._getCurrentChainId = getCurrentChainId;
    this._getEIP1559GasFeeEstimates = getEIP1559GasFeeEstimates;
    this.getBufferedGasLimit = getBufferedGasLimit;
    this.tokenRatesStore = tokenRatesStore;
    this.pollCount = 0;
    this.getProviderConfig = getProviderConfig;
    this.indexOfNewestCallInFlight = 0;
    this.ethersProvider = new _ethers.ethers.providers.Web3Provider(provider);
    this._currentNetwork = networkController.store.getState().network;
    networkController.on(_network.NETWORK_EVENTS.NETWORK_DID_CHANGE, network => {
      if (network !== 'loading' && network !== this._currentNetwork) {
        this._currentNetwork = network;
        this.ethersProvider = new _ethers.ethers.providers.Web3Provider(provider);
      }
    });
  }

  async fetchSwapsRefreshRates(chainId, useNewSwapsApi) {
    const response = await (0, _fetchWithCache.default)((0, _swaps3.getBaseApi)('network', chainId, useNewSwapsApi), {
      method: 'GET'
    }, {
      cacheRefreshTime: 600000
    });
    const {
      refreshRates
    } = response || {};

    if (!refreshRates || typeof refreshRates.quotes !== 'number' || typeof refreshRates.quotesPrefetching !== 'number') {
      throw new Error(`MonstaWallet- invalid response for refreshRates: ${response}`);
    } // We presently use milliseconds in the UI.


    return {
      quotes: refreshRates.quotes * 1000,
      quotesPrefetching: refreshRates.quotesPrefetching * 1000
    };
  } // Sets the refresh rate for quote updates from the MetaSwap API


  async _setSwapsRefreshRates() {
    var _swapsRefreshRates, _swapsRefreshRates2;

    const chainId = this._getCurrentChainId();

    const {
      swapsState
    } = this.store.getState();
    let swapsRefreshRates;

    try {
      swapsRefreshRates = await this.fetchSwapsRefreshRates(chainId, swapsState.useNewSwapsApi);
    } catch (e) {
      console.error('Request for swaps quote refresh time failed: ', e);
    }

    const {
      swapsState: latestSwapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, latestSwapsState), {}, {
        swapsQuoteRefreshTime: ((_swapsRefreshRates = swapsRefreshRates) === null || _swapsRefreshRates === void 0 ? void 0 : _swapsRefreshRates.quotes) || FALLBACK_QUOTE_REFRESH_TIME,
        swapsQuotePrefetchingRefreshTime: ((_swapsRefreshRates2 = swapsRefreshRates) === null || _swapsRefreshRates2 === void 0 ? void 0 : _swapsRefreshRates2.quotesPrefetching) || FALLBACK_QUOTE_REFRESH_TIME
      })
    });
  } // Once quotes are fetched, we poll for new ones to keep the quotes up to date. Market and aggregator contract conditions can change fast enough
  // that quotes will no longer be available after 1 or 2 minutes. When fetchAndSetQuotes is first called, it receives fetch parameters that are stored in
  // state. These stored parameters are used on subsequent calls made during polling.
  // Note: we stop polling after 3 requests, until new quotes are explicitly asked for. The logic that enforces that maximum is in the body of fetchAndSetQuotes


  pollForNewQuotes() {
    const {
      swapsState: {
        swapsQuoteRefreshTime,
        swapsQuotePrefetchingRefreshTime,
        quotesPollingLimitEnabled
      }
    } = this.store.getState(); // swapsQuoteRefreshTime is used on the View Quote page, swapsQuotePrefetchingRefreshTime is used on the Build Quote page.

    const quotesRefreshRateInMs = quotesPollingLimitEnabled ? swapsQuoteRefreshTime : swapsQuotePrefetchingRefreshTime;
    this.pollingTimeout = setTimeout(() => {
      var _swapsState$fetchPara;

      const {
        swapsState
      } = this.store.getState();
      this.fetchAndSetQuotes(swapsState.fetchParams, (_swapsState$fetchPara = swapsState.fetchParams) === null || _swapsState$fetchPara === void 0 ? void 0 : _swapsState$fetchPara.metaData, true);
    }, quotesRefreshRateInMs);
  }

  stopPollingForQuotes() {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
    }
  }

  async fetchAndSetQuotes(fetchParams, fetchParamsMetaData = {}, isPolledRequest) {
    const {
      chainId
    } = fetchParamsMetaData;
    const {
      swapsState: {
        useNewSwapsApi,
        quotesPollingLimitEnabled
      }
    } = this.store.getState();

    if (!fetchParams) {
      return null;
    } // Every time we get a new request that is not from the polling, we reset the poll count so we can poll for up to three more sets of quotes with these new params.


    if (!isPolledRequest) {
      this.pollCount = 0;
    } // If there are any pending poll requests, clear them so that they don't get call while this new fetch is in process


    clearTimeout(this.pollingTimeout);

    if (!isPolledRequest) {
      this.setSwapsErrorKey('');
    }

    const indexOfCurrentCall = this.indexOfNewestCallInFlight + 1;
    this.indexOfNewestCallInFlight = indexOfCurrentCall;
    let [newQuotes] = await Promise.all([this._fetchTradesInfo(fetchParams, _objectSpread(_objectSpread({}, fetchParamsMetaData), {}, {
      useNewSwapsApi
    })), this._setSwapsRefreshRates()]);
    newQuotes = (0, _lodash.mapValues)(newQuotes, quote => _objectSpread(_objectSpread({}, quote), {}, {
      sourceTokenInfo: fetchParamsMetaData.sourceTokenInfo,
      destinationTokenInfo: fetchParamsMetaData.destinationTokenInfo
    }));
    const quotesLastFetched = Date.now();
    let approvalRequired = false;

    if (!(0, _swaps2.isSwapsDefaultTokenAddress)(fetchParams.sourceToken, chainId) && Object.values(newQuotes).length) {
      const allowance = await this._getERC20Allowance(fetchParams.sourceToken, fetchParams.fromAddress, chainId); // For a user to be able to swap a token, they need to have approved the MetaSwap contract to withdraw that token.
      // _getERC20Allowance() returns the amount of the token they have approved for withdrawal. If that amount is greater
      // than 0, it means that approval has already occured and is not needed. Otherwise, for tokens to be swapped, a new
      // call of the ERC-20 approve method is required.

      approvalRequired = allowance.eq(0);

      if (!approvalRequired) {
        newQuotes = (0, _lodash.mapValues)(newQuotes, quote => _objectSpread(_objectSpread({}, quote), {}, {
          approvalNeeded: null
        }));
      } else if (!isPolledRequest) {
        const {
          gasLimit: approvalGas
        } = await this.timedoutGasReturn(Object.values(newQuotes)[0].approvalNeeded);
        newQuotes = (0, _lodash.mapValues)(newQuotes, quote => _objectSpread(_objectSpread({}, quote), {}, {
          approvalNeeded: _objectSpread(_objectSpread({}, quote.approvalNeeded), {}, {
            gas: approvalGas || _swaps.DEFAULT_ERC20_APPROVE_GAS
          })
        }));
      }
    }

    let topAggId = null; // We can reduce time on the loading screen by only doing this after the
    // loading screen and best quote have rendered.

    if (!approvalRequired && !(fetchParams !== null && fetchParams !== void 0 && fetchParams.balanceError)) {
      newQuotes = await this.getAllQuotesWithGasEstimates(newQuotes);
    }

    if (Object.values(newQuotes).length === 0) {
      this.setSwapsErrorKey(_swaps.QUOTES_NOT_AVAILABLE_ERROR);
    } else {
      const [_topAggId, quotesWithSavingsAndFeeData] = await this._findTopQuoteAndCalculateSavings(newQuotes);
      topAggId = _topAggId;
      newQuotes = quotesWithSavingsAndFeeData;
    } // If a newer call has been made, don't update state with old information
    // Prevents timing conflicts between fetches


    if (this.indexOfNewestCallInFlight !== indexOfCurrentCall) {
      throw new Error(_swaps.SWAPS_FETCH_ORDER_CONFLICT);
    }

    const {
      swapsState
    } = this.store.getState();
    let {
      selectedAggId
    } = swapsState;

    if (!newQuotes[selectedAggId]) {
      selectedAggId = null;
    }

    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        quotes: newQuotes,
        fetchParams: _objectSpread(_objectSpread({}, fetchParams), {}, {
          metaData: fetchParamsMetaData
        }),
        quotesLastFetched,
        selectedAggId,
        topAggId
      })
    });

    if (quotesPollingLimitEnabled) {
      // We only want to do up to a maximum of three requests from polling if polling limit is enabled.
      // Otherwise we won't increase pollCount, so polling will run without a limit.
      this.pollCount += 1;
    }

    if (!quotesPollingLimitEnabled || this.pollCount < POLL_COUNT_LIMIT + 1) {
      this.pollForNewQuotes();
    } else {
      this.resetPostFetchState();
      this.setSwapsErrorKey(_swaps.QUOTES_EXPIRED_ERROR);
      return null;
    }

    return [newQuotes, topAggId];
  }

  safeRefetchQuotes() {
    const {
      swapsState
    } = this.store.getState();

    if (!this.pollingTimeout && swapsState.fetchParams) {
      this.fetchAndSetQuotes(swapsState.fetchParams);
    }
  }

  setSelectedQuoteAggId(selectedAggId) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        selectedAggId
      })
    });
  }

  setSwapsTokens(tokens) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        tokens
      })
    });
  }

  clearSwapsQuotes() {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        quotes: {}
      })
    });
  }

  setSwapsErrorKey(errorKey) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        errorKey
      })
    });
  }

  async getAllQuotesWithGasEstimates(quotes) {
    const quoteGasData = await Promise.all(Object.values(quotes).map(async quote => {
      const {
        gasLimit,
        simulationFails
      } = await this.timedoutGasReturn(quote.trade);
      return [gasLimit, simulationFails, quote.aggregator];
    }));
    const newQuotes = {};
    quoteGasData.forEach(([gasLimit, simulationFails, aggId]) => {
      if (gasLimit && !simulationFails) {
        const gasEstimateWithRefund = calculateGasEstimateWithRefund(quotes[aggId].maxGas, quotes[aggId].estimatedRefund, gasLimit);
        newQuotes[aggId] = _objectSpread(_objectSpread({}, quotes[aggId]), {}, {
          gasEstimate: gasLimit,
          gasEstimateWithRefund
        });
      } else if (quotes[aggId].approvalNeeded) {
        // If gas estimation fails, but an ERC-20 approve is needed, then we do not add any estimate property to the quote object
        // Such quotes will rely on the maxGas and averageGas properties from the api
        newQuotes[aggId] = quotes[aggId];
      } // If gas estimation fails and no approval is needed, then we filter that quote out, so that it is not shown to the user

    });
    return newQuotes;
  }

  timedoutGasReturn(tradeTxParams) {
    return new Promise(resolve => {
      let gasTimedOut = false;
      const gasTimeout = setTimeout(() => {
        gasTimedOut = true;
        resolve({
          gasLimit: null,
          simulationFails: true
        });
      }, _time.SECOND * 5); // Remove gas from params that will be passed to the `estimateGas` call
      // Including it can cause the estimate to fail if the actual gas needed
      // exceeds the passed gas

      const tradeTxParamsForGasEstimate = {
        data: tradeTxParams.data,
        from: tradeTxParams.from,
        to: tradeTxParams.to,
        value: tradeTxParams.value
      };
      this.getBufferedGasLimit({
        txParams: tradeTxParamsForGasEstimate
      }, 1).then(({
        gasLimit,
        simulationFails
      }) => {
        if (!gasTimedOut) {
          clearTimeout(gasTimeout);
          resolve({
            gasLimit,
            simulationFails
          });
        }
      }).catch(e => {
        _loglevel.default.error(e);

        if (!gasTimedOut) {
          clearTimeout(gasTimeout);
          resolve({
            gasLimit: null,
            simulationFails: true
          });
        }
      });
    });
  }

  async setInitialGasEstimate(initialAggId) {
    const {
      swapsState
    } = this.store.getState();

    const quoteToUpdate = _objectSpread({}, swapsState.quotes[initialAggId]);

    const {
      gasLimit: newGasEstimate,
      simulationFails
    } = await this.timedoutGasReturn(quoteToUpdate.trade);

    if (newGasEstimate && !simulationFails) {
      const gasEstimateWithRefund = calculateGasEstimateWithRefund(quoteToUpdate.maxGas, quoteToUpdate.estimatedRefund, newGasEstimate);
      quoteToUpdate.gasEstimate = newGasEstimate;
      quoteToUpdate.gasEstimateWithRefund = gasEstimateWithRefund;
    }

    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        quotes: _objectSpread(_objectSpread({}, swapsState.quotes), {}, {
          [initialAggId]: quoteToUpdate
        })
      })
    });
  }

  setApproveTxId(approveTxId) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        approveTxId
      })
    });
  }

  setTradeTxId(tradeTxId) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        tradeTxId
      })
    });
  }

  setQuotesLastFetched(quotesLastFetched) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        quotesLastFetched
      })
    });
  }

  setSwapsTxGasPrice(gasPrice) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        customGasPrice: gasPrice
      })
    });
  }

  setSwapsTxMaxFeePerGas(maxFeePerGas) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        customMaxFeePerGas: maxFeePerGas
      })
    });
  }

  setSwapsUserFeeLevel(swapsUserFeeLevel) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        swapsUserFeeLevel
      })
    });
  }

  setSwapsQuotesPollingLimitEnabled(quotesPollingLimitEnabled) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        quotesPollingLimitEnabled
      })
    });
  }

  setSwapsTxMaxFeePriorityPerGas(maxPriorityFeePerGas) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        customMaxPriorityFeePerGas: maxPriorityFeePerGas
      })
    });
  }

  setSwapsTxGasLimit(gasLimit) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        customMaxGas: gasLimit
      })
    });
  }

  setCustomApproveTxData(data) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        customApproveTxData: data
      })
    });
  }

  setBackgroundSwapRouteState(routeState) {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        routeState
      })
    });
  }

  setSwapsLiveness(swapsLiveness) {
    const {
      swapsState
    } = this.store.getState();
    const {
      swapsFeatureIsLive,
      useNewSwapsApi
    } = swapsLiveness;
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, swapsState), {}, {
        swapsFeatureIsLive,
        useNewSwapsApi
      })
    });
  }

  resetPostFetchState() {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, initialState.swapsState), {}, {
        tokens: swapsState.tokens,
        fetchParams: swapsState.fetchParams,
        swapsFeatureIsLive: swapsState.swapsFeatureIsLive,
        useNewSwapsApi: swapsState.useNewSwapsApi,
        swapsQuoteRefreshTime: swapsState.swapsQuoteRefreshTime,
        swapsQuotePrefetchingRefreshTime: swapsState.swapsQuotePrefetchingRefreshTime
      })
    });
    clearTimeout(this.pollingTimeout);
  }

  resetSwapsState() {
    const {
      swapsState
    } = this.store.getState();
    this.store.updateState({
      swapsState: _objectSpread(_objectSpread({}, initialState.swapsState), {}, {
        tokens: swapsState.tokens,
        swapsQuoteRefreshTime: swapsState.swapsQuoteRefreshTime,
        swapsQuotePrefetchingRefreshTime: swapsState.swapsQuotePrefetchingRefreshTime
      })
    });
    clearTimeout(this.pollingTimeout);
  }

  async _findTopQuoteAndCalculateSavings(quotes = {}) {
    var _newQuotes$topAggId;

    const tokenConversionRates = this.tokenRatesStore.contractExchangeRates;
    const {
      swapsState: {
        customGasPrice,
        customMaxPriorityFeePerGas
      }
    } = this.store.getState();

    const chainId = this._getCurrentChainId();

    const numQuotes = Object.keys(quotes).length;

    if (!numQuotes) {
      return {};
    }

    const newQuotes = (0, _lodash.cloneDeep)(quotes);
    const {
      gasFeeEstimates,
      gasEstimateType
    } = await this._getEIP1559GasFeeEstimates();
    let usedGasPrice = '0x0';

    if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.FEE_MARKET) {
      const {
        high: {
          suggestedMaxPriorityFeePerGas
        },
        estimatedBaseFee
      } = gasFeeEstimates;
      usedGasPrice = (0, _conversion.addCurrencies)(customMaxPriorityFeePerGas || // Is already in hex WEI.
      (0, _conversion.decGWEIToHexWEI)(suggestedMaxPriorityFeePerGas), (0, _conversion.decGWEIToHexWEI)(estimatedBaseFee), {
        aBase: 16,
        bBase: 16,
        toNumericBase: 'hex',
        numberOfDecimals: 6
      });
    } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.LEGACY) {
      usedGasPrice = customGasPrice || (0, _conversion.decGWEIToHexWEI)(gasFeeEstimates.high);
    } else if (gasEstimateType === _gas.GAS_ESTIMATE_TYPES.ETH_GASPRICE) {
      usedGasPrice = customGasPrice || (0, _conversion.decGWEIToHexWEI)(gasFeeEstimates.gasPrice);
    }

    let topAggId = null;
    let overallValueOfBestQuoteForSorting = null;
    Object.values(newQuotes).forEach(quote => {
      const {
        aggregator,
        approvalNeeded,
        averageGas,
        destinationAmount = 0,
        destinationToken,
        destinationTokenInfo,
        gasEstimate,
        sourceAmount,
        sourceToken,
        trade,
        fee: metaMaskFee
      } = quote;
      const tradeGasLimitForCalculation = gasEstimate ? new _bignumber.default(gasEstimate, 16) : new _bignumber.default(averageGas || MAX_GAS_LIMIT, 10);
      const totalGasLimitForCalculation = tradeGasLimitForCalculation.plus((approvalNeeded === null || approvalNeeded === void 0 ? void 0 : approvalNeeded.gas) || '0x0', 16).toString(16);
      const gasTotalInWeiHex = (0, _send.calcGasTotal)(totalGasLimitForCalculation, usedGasPrice); // trade.value is a sum of different values depending on the transaction.
      // It always includes any external fees charged by the quote source. In
      // addition, if the source asset is the selected chain's default token, trade.value
      // includes the amount of that token.

      const totalWeiCost = new _bignumber.default(gasTotalInWeiHex, 16).plus(trade.value, 16);
      const totalEthCost = (0, _conversion.conversionUtil)(totalWeiCost, {
        fromCurrency: 'ETH',
        fromDenomination: 'WEI',
        toDenomination: 'ETH',
        fromNumericBase: 'BN',
        numberOfDecimals: 6
      }); // The total fee is aggregator/exchange fees plus gas fees.
      // If the swap is from the selected chain's default token, subtract
      // the sourceAmount from the total cost. Otherwise, the total fee
      // is simply trade.value plus gas fees.

      const ethFee = (0, _swaps2.isSwapsDefaultTokenAddress)(sourceToken, chainId) ? (0, _conversion.conversionUtil)(totalWeiCost.minus(sourceAmount, 10), // sourceAmount is in wei
      {
        fromCurrency: 'ETH',
        fromDenomination: 'WEI',
        toDenomination: 'ETH',
        fromNumericBase: 'BN',
        numberOfDecimals: 6
      }) : totalEthCost;
      const decimalAdjustedDestinationAmount = (0, _tokenUtil.calcTokenAmount)(destinationAmount, destinationTokenInfo.decimals);
      const tokenPercentageOfPreFeeDestAmount = new _bignumber.default(100, 10).minus(metaMaskFee, 10).div(100);
      const destinationAmountBeforeMetaMaskFee = decimalAdjustedDestinationAmount.div(tokenPercentageOfPreFeeDestAmount);
      const metaMaskFeeInTokens = destinationAmountBeforeMetaMaskFee.minus(decimalAdjustedDestinationAmount);
      const tokenConversionRate = tokenConversionRates[destinationToken];
      const conversionRateForSorting = tokenConversionRate || 1;
      const ethValueOfTokens = decimalAdjustedDestinationAmount.times(conversionRateForSorting, 10);
      const conversionRateForCalculations = (0, _swaps2.isSwapsDefaultTokenAddress)(destinationToken, chainId) ? 1 : tokenConversionRate;
      const overallValueOfQuoteForSorting = conversionRateForCalculations === undefined ? ethValueOfTokens : ethValueOfTokens.minus(ethFee, 10);
      quote.ethFee = ethFee.toString(10);

      if (conversionRateForCalculations !== undefined) {
        quote.ethValueOfTokens = ethValueOfTokens.toString(10);
        quote.overallValueOfQuote = overallValueOfQuoteForSorting.toString(10);
        quote.metaMaskFeeInEth = metaMaskFeeInTokens.times(conversionRateForCalculations).toString(10);
      }

      if (overallValueOfBestQuoteForSorting === null || overallValueOfQuoteForSorting.gt(overallValueOfBestQuoteForSorting)) {
        topAggId = aggregator;
        overallValueOfBestQuoteForSorting = overallValueOfQuoteForSorting;
      }
    });
    const isBest = (0, _swaps2.isSwapsDefaultTokenAddress)(newQuotes[topAggId].destinationToken, chainId) || Boolean(tokenConversionRates[(_newQuotes$topAggId = newQuotes[topAggId]) === null || _newQuotes$topAggId === void 0 ? void 0 : _newQuotes$topAggId.destinationToken]);
    let savings = null;

    if (isBest) {
      const bestQuote = newQuotes[topAggId];
      savings = {};
      const {
        ethFee: medianEthFee,
        metaMaskFeeInEth: medianMetaMaskFee,
        ethValueOfTokens: medianEthValueOfTokens
      } = getMedianEthValueQuote(Object.values(newQuotes)); // Performance savings are calculated as:
      //   (ethValueOfTokens for the best trade) - (ethValueOfTokens for the media trade)

      savings.performance = new _bignumber.default(bestQuote.ethValueOfTokens, 10).minus(medianEthValueOfTokens, 10); // Fee savings are calculated as:
      //   (fee for the median trade) - (fee for the best trade)

      savings.fee = new _bignumber.default(medianEthFee).minus(bestQuote.ethFee, 10);
      savings.metaMaskFee = bestQuote.metaMaskFeeInEth; // Total savings are calculated as:
      //   performance savings + fee savings - metamask fee

      savings.total = savings.performance.plus(savings.fee).minus(savings.metaMaskFee).toString(10);
      savings.performance = savings.performance.toString(10);
      savings.fee = savings.fee.toString(10);
      savings.medianMetaMaskFee = medianMetaMaskFee;
      newQuotes[topAggId].isBestQuote = true;
      newQuotes[topAggId].savings = savings;
    }

    return [topAggId, newQuotes];
  }

  async _getERC20Allowance(contractAddress, walletAddress, chainId) {
    const contract = new _ethers.ethers.Contract(contractAddress, _humanStandardTokenAbi.default, this.ethersProvider);
    return await contract.allowance(walletAddress, _swaps.SWAPS_CHAINID_CONTRACT_ADDRESS_MAP[chainId]);
  }

}
/**
 * Calculates the median overallValueOfQuote of a sample of quotes.
 *
 * @param {Array} quotes - A sample of quote objects with overallValueOfQuote, ethFee, metaMaskFeeInEth, and ethValueOfTokens properties
 * @returns {Object} An object with the ethValueOfTokens, ethFee, and metaMaskFeeInEth of the quote with the median overallValueOfQuote
 */


exports.default = SwapsController;

function getMedianEthValueQuote(_quotes) {
  if (!Array.isArray(_quotes) || _quotes.length === 0) {
    throw new Error('Expected non-empty array param.');
  }

  const quotes = [..._quotes];
  quotes.sort((quoteA, quoteB) => {
    const overallValueOfQuoteA = new _bignumber.default(quoteA.overallValueOfQuote, 10);
    const overallValueOfQuoteB = new _bignumber.default(quoteB.overallValueOfQuote, 10);

    if (overallValueOfQuoteA.equals(overallValueOfQuoteB)) {
      return 0;
    }

    return overallValueOfQuoteA.lessThan(overallValueOfQuoteB) ? -1 : 1;
  });

  if (quotes.length % 2 === 1) {
    // return middle values
    const medianOverallValue = quotes[(quotes.length - 1) / 2].overallValueOfQuote;
    const quotesMatchingMedianQuoteValue = quotes.filter(quote => medianOverallValue === quote.overallValueOfQuote);
    return meansOfQuotesFeesAndValue(quotesMatchingMedianQuoteValue);
  } // return mean of middle two values


  const upperIndex = quotes.length / 2;
  const lowerIndex = upperIndex - 1;
  const overallValueAtUpperIndex = quotes[upperIndex].overallValueOfQuote;
  const overallValueAtLowerIndex = quotes[lowerIndex].overallValueOfQuote;
  const quotesMatchingUpperIndexValue = quotes.filter(quote => overallValueAtUpperIndex === quote.overallValueOfQuote);
  const quotesMatchingLowerIndexValue = quotes.filter(quote => overallValueAtLowerIndex === quote.overallValueOfQuote);
  const feesAndValueAtUpperIndex = meansOfQuotesFeesAndValue(quotesMatchingUpperIndexValue);
  const feesAndValueAtLowerIndex = meansOfQuotesFeesAndValue(quotesMatchingLowerIndexValue);
  return {
    ethFee: new _bignumber.default(feesAndValueAtUpperIndex.ethFee, 10).plus(feesAndValueAtLowerIndex.ethFee, 10).dividedBy(2).toString(10),
    metaMaskFeeInEth: new _bignumber.default(feesAndValueAtUpperIndex.metaMaskFeeInEth, 10).plus(feesAndValueAtLowerIndex.metaMaskFeeInEth, 10).dividedBy(2).toString(10),
    ethValueOfTokens: new _bignumber.default(feesAndValueAtUpperIndex.ethValueOfTokens, 10).plus(feesAndValueAtLowerIndex.ethValueOfTokens, 10).dividedBy(2).toString(10)
  };
}
/**
 * Calculates the arithmetic mean for each of three properties - ethFee, metaMaskFeeInEth and ethValueOfTokens - across
 * an array of objects containing those properties.
 *
 * @param {Array} quotes - A sample of quote objects with overallValueOfQuote, ethFee, metaMaskFeeInEth and
 * ethValueOfTokens properties
 * @returns {Object} An object with the arithmetic mean each of the ethFee, metaMaskFeeInEth and ethValueOfTokens of
 * the passed quote objects
 */


function meansOfQuotesFeesAndValue(quotes) {
  const feeAndValueSumsAsBigNumbers = quotes.reduce((feeAndValueSums, quote) => ({
    ethFee: feeAndValueSums.ethFee.plus(quote.ethFee, 10),
    metaMaskFeeInEth: feeAndValueSums.metaMaskFeeInEth.plus(quote.metaMaskFeeInEth, 10),
    ethValueOfTokens: feeAndValueSums.ethValueOfTokens.plus(quote.ethValueOfTokens, 10)
  }), {
    ethFee: new _bignumber.default(0, 10),
    metaMaskFeeInEth: new _bignumber.default(0, 10),
    ethValueOfTokens: new _bignumber.default(0, 10)
  });
  return {
    ethFee: feeAndValueSumsAsBigNumbers.ethFee.div(quotes.length, 10).toString(10),
    metaMaskFeeInEth: feeAndValueSumsAsBigNumbers.metaMaskFeeInEth.div(quotes.length, 10).toString(10),
    ethValueOfTokens: feeAndValueSumsAsBigNumbers.ethValueOfTokens.div(quotes.length, 10).toString(10)
  };
}

const utils = {
  getMedianEthValueQuote,
  meansOfQuotesFeesAndValue
};
exports.utils = utils;

//# sourceMappingURL=app/scripts/controllers/swaps.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/swaps.js",}],
[18, {"./network":20,"@babel/runtime/helpers/interopRequireWildcard":187}, function (require, module, exports) {
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _network.default;
  }
});
Object.defineProperty(exports, "NETWORK_EVENTS", {
  enumerable: true,
  get: function () {
    return _network.NETWORK_EVENTS;
  }
});

var _network = _interopRequireWildcard(require("./network"));

//# sourceMappingURL=app/scripts/controllers/network/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/network/index.js",}],
[72, {"./createMethodMiddleware":65,"@babel/runtime/helpers/interopRequireDefault":186}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _createMethodMiddleware.default;
  }
});

var _createMethodMiddleware = _interopRequireDefault(require("./createMethodMiddleware"));

//# sourceMappingURL=app/scripts/lib/rpc-method-middleware/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/rpc-method-middleware/index.js",}],
[935, {"@ethereumjs/tx":297,"buffer":1428,"eth-sig-util":936,"ethereumjs-util":1810,"events":1429,"hdkey":1919}, function (require, module, exports) {
(function (Buffer){
const { EventEmitter } = require('events')
const HDKey = require('hdkey')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const { TransactionFactory } = require('@ethereumjs/tx')

const pathBase = 'm'
const hdPathString = `${pathBase}/44'/60'/0'`
const type = 'Ledger Hardware'

const BRIDGE_URL = 'https://metamask.github.io/eth-ledger-bridge-keyring'

const MAX_INDEX = 1000
const NETWORK_API_URLS = {
  ropsten: 'http://api-ropsten.etherscan.io',
  kovan: 'http://api-kovan.etherscan.io',
  rinkeby: 'https://api-rinkeby.etherscan.io',
  mainnet: 'https://api.etherscan.io',
}

class LedgerBridgeKeyring extends EventEmitter {
  constructor (opts = {}) {
    super()
    this.accountDetails = {}
    this.bridgeUrl = null
    this.type = type
    this.page = 0
    this.perPage = 5
    this.unlockedAccount = 0
    this.hdk = new HDKey()
    this.paths = {}
    this.iframe = null
    this.network = 'mainnet'
    this.implementFullBIP44 = false
    this.deserialize(opts)

    this.iframeLoaded = false
    this._setupIframe()
  }

  serialize () {
    return Promise.resolve({
      hdPath: this.hdPath,
      accounts: this.accounts,
      accountDetails: this.accountDetails,
      bridgeUrl: this.bridgeUrl,
      implementFullBIP44: false,
    })
  }

  deserialize (opts = {}) {
    this.hdPath = opts.hdPath || hdPathString
    this.bridgeUrl = opts.bridgeUrl || BRIDGE_URL
    this.accounts = opts.accounts || []
    this.accountDetails = opts.accountDetails || {}
    if (!opts.accountDetails) {
      this._migrateAccountDetails(opts)
    }

    this.implementFullBIP44 = opts.implementFullBIP44 || false

    // Remove accounts that don't have corresponding account details
    this.accounts = this.accounts
      .filter((account) => Object.keys(this.accountDetails).includes(ethUtil.toChecksumAddress(account)))

    return Promise.resolve()
  }

  _migrateAccountDetails (opts) {
    if (this._isLedgerLiveHdPath() && opts.accountIndexes) {
      for (const account of Object.keys(opts.accountIndexes)) {
        this.accountDetails[account] = {
          bip44: true,
          hdPath: this._getPathForIndex(opts.accountIndexes[account]),
        }
      }
    }

    // try to migrate non-LedgerLive accounts too
    if (!this._isLedgerLiveHdPath()) {
      this.accounts
        .filter((account) => !Object.keys(this.accountDetails).includes(ethUtil.toChecksumAddress(account)))
        .forEach((account) => {
          try {
            this.accountDetails[ethUtil.toChecksumAddress(account)] = {
              bip44: false,
              hdPath: this._pathFromAddress(account),
            }
          } catch (e) {
            console.log(`failed to migrate account ${account}`)
          }
        })
    }
  }

  isUnlocked () {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  setAccountToUnlock (index) {
    this.unlockedAccount = parseInt(index, 10)
  }

  setHdPath (hdPath) {
    // Reset HDKey if the path changes
    if (this.hdPath !== hdPath) {
      this.hdk = new HDKey()
    }
    this.hdPath = hdPath
  }

  unlock (hdPath) {
    if (this.isUnlocked() && !hdPath) {
      return Promise.resolve('already unlocked')
    }
    const path = hdPath ? this._toLedgerPath(hdPath) : this.hdPath
    return new Promise((resolve, reject) => {
      this._sendMessage({
        action: 'ledger-unlock',
        params: {
          hdPath: path,
        },
      },
      ({ success, payload }) => {
        if (success) {
          this.hdk.publicKey = Buffer.from(payload.publicKey, 'hex')
          this.hdk.chainCode = Buffer.from(payload.chainCode, 'hex')
          resolve(payload.address)
        } else {
          reject(payload.error || 'Unknown error')
        }
      })
    })
  }

  addAccounts (n = 1) {

    return new Promise((resolve, reject) => {
      this.unlock()
        .then(async (_) => {
          const from = this.unlockedAccount
          const to = from + n
          for (let i = from; i < to; i++) {
            const path = this._getPathForIndex(i)
            let address
            if (this._isLedgerLiveHdPath()) {
              address = await this.unlock(path)
            } else {
              address = this._addressFromIndex(pathBase, i)
            }
            this.accountDetails[ethUtil.toChecksumAddress(address)] = {
              // TODO: consider renaming this property, as the current name is misleading
              // It's currently used to represent whether an account uses the Ledger Live path.
              bip44: this._isLedgerLiveHdPath(),
              hdPath: path,
            }

            if (!this.accounts.includes(address)) {
              this.accounts.push(address)
            }
            this.page = 0
          }
          resolve(this.accounts)
        })
        .catch(reject)
    })
  }

  getFirstPage () {
    this.page = 0
    return this.__getPage(1)
  }

  getNextPage () {
    return this.__getPage(1)
  }

  getPreviousPage () {
    return this.__getPage(-1)
  }

  getAccounts () {
    return Promise.resolve(this.accounts.slice())
  }

  removeAccount (address) {
    if (!this.accounts.map((a) => a.toLowerCase()).includes(address.toLowerCase())) {
      throw new Error(`Address ${address} not found in this keyring`)
    }
    this.accounts = this.accounts.filter((a) => a.toLowerCase() !== address.toLowerCase())
    delete this.accountDetails[ethUtil.toChecksumAddress(address)]
  }

  updateTransportMethod (useLedgerLive = false) {
    return new Promise((resolve, reject) => {
      // If the iframe isn't loaded yet, let's store the desired useLedgerLive value and
      // optimistically return a successful promise
      if (!this.iframeLoaded) {
        this.delayedPromise = {
          resolve,
          reject,
          useLedgerLive,
        }
        return
      }

      this._sendMessage({
        action: 'ledger-update-transport',
        params: { useLedgerLive },
      }, ({ success }) => {
        if (success) {
          resolve(true)
        } else {
          reject(new Error('Ledger transport could not be updated'))
        }
      })
    })
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction (address, tx) {
    let rawTxHex
    // transactions built with older versions of ethereumjs-tx have a
    // getChainId method that newer versions do not. Older versions are mutable
    // while newer versions default to being immutable. Expected shape and type
    // of data for v, r and s differ (Buffer (old) vs BN (new))
    if (typeof tx.getChainId === 'function') {
      // In this version of ethereumjs-tx we must add the chainId in hex format
      // to the initial v value. The chainId must be included in the serialized
      // transaction which is only communicated to ethereumjs-tx in this
      // value. In newer versions the chainId is communicated via the 'Common'
      // object.
      tx.v = ethUtil.bufferToHex(tx.getChainId())
      tx.r = '0x00'
      tx.s = '0x00'

      rawTxHex = tx.serialize().toString('hex')

      return this._signTransaction(address, rawTxHex, (payload) => {
        tx.v = Buffer.from(payload.v, 'hex')
        tx.r = Buffer.from(payload.r, 'hex')
        tx.s = Buffer.from(payload.s, 'hex')
        return tx
      })
    }

    // The below `encode` call is only necessary for legacy transactions, as `getMessageToSign`
    // calls `rlp.encode` internally for non-legacy transactions. As per the "Transaction Execution"
    // section of the ethereum yellow paper, transactions need to be "well-formed RLP, with no additional
    // trailing bytes".

    // Note also that `getMessageToSign` will return valid RLP for all transaction types, whereas the
    // `serialize` method will not for any transaction type except legacy. This is because `serialize` includes
    // empty r, s and v values in the encoded rlp. This is why we use `getMessageToSign` here instead of `serialize`.
    const messageToSign = tx.getMessageToSign(false)

    rawTxHex = Buffer.isBuffer(messageToSign)
      ? messageToSign.toString('hex')
      : ethUtil.rlp.encode(messageToSign).toString('hex')

    return this._signTransaction(address, rawTxHex, (payload) => {
      // Because tx will be immutable, first get a plain javascript object that
      // represents the transaction. Using txData here as it aligns with the
      // nomenclature of ethereumjs/tx.
      const txData = tx.toJSON()
      // The fromTxData utility expects a type to support transactions with a type other than 0
      txData.type = tx.type
      // The fromTxData utility expects v,r and s to be hex prefixed
      txData.v = ethUtil.addHexPrefix(payload.v)
      txData.r = ethUtil.addHexPrefix(payload.r)
      txData.s = ethUtil.addHexPrefix(payload.s)
      // Adopt the 'common' option from the original transaction and set the
      // returned object to be frozen if the original is frozen.
      return TransactionFactory.fromTxData(txData, { common: tx.common, freeze: Object.isFrozen(tx) })
    })
  }

  _signTransaction (address, rawTxHex, handleSigning) {
    return new Promise((resolve, reject) => {
      this.unlockAccountByAddress(address)
        .then((hdPath) => {
          this._sendMessage({
            action: 'ledger-sign-transaction',
            params: {
              tx: rawTxHex,
              hdPath,
            },
          },
          ({ success, payload }) => {
            if (success) {

              const newOrMutatedTx = handleSigning(payload)
              const valid = newOrMutatedTx.verifySignature()
              if (valid) {
                resolve(newOrMutatedTx)
              } else {
                reject(new Error('Ledger: The transaction signature is not valid'))
              }
            } else {
              reject(new Error(payload.error || 'Ledger: Unknown error while signing transaction'))
            }
          })
        })
        .catch(reject)
    })
  }

  signMessage (withAccount, data) {
    return this.signPersonalMessage(withAccount, data)
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage (withAccount, message) {
    return new Promise((resolve, reject) => {
      this.unlockAccountByAddress(withAccount)
        .then((hdPath) => {
          this._sendMessage({
            action: 'ledger-sign-personal-message',
            params: {
              hdPath,
              message: ethUtil.stripHexPrefix(message),
            },
          },
          ({ success, payload }) => {
            if (success) {
              let v = payload.v - 27
              v = v.toString(16)
              if (v.length < 2) {
                v = `0${v}`
              }
              const signature = `0x${payload.r}${payload.s}${v}`
              const addressSignedWith = sigUtil.recoverPersonalSignature({ data: message, sig: signature })
              if (ethUtil.toChecksumAddress(addressSignedWith) !== ethUtil.toChecksumAddress(withAccount)) {
                reject(new Error('Ledger: The signature doesnt match the right address'))
              }
              resolve(signature)
            } else {
              reject(new Error(payload.error || 'Ledger: Unknown error while signing message'))
            }
          })
        })
        .catch(reject)
    })
  }

  async unlockAccountByAddress (address) {
    const checksummedAddress = ethUtil.toChecksumAddress(address)
    if (!Object.keys(this.accountDetails).includes(checksummedAddress)) {
      throw new Error(`Ledger: Account for address '${checksummedAddress}' not found`)
    }
    const { hdPath } = this.accountDetails[checksummedAddress]
    const unlockedAddress = await this.unlock(hdPath)

    // unlock resolves to the address for the given hdPath as reported by the ledger device
    // if that address is not the requested address, then this account belongs to a different device or seed
    if (unlockedAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error(`Ledger: Account ${address} does not belong to the connected device`)
    }
    return hdPath
  }

  async signTypedData (withAccount, data, options = {}) {
    const isV4 = options.version === 'V4'
    if (!isV4) {
      throw new Error('Ledger: Only version 4 of typed data signing is supported')
    }

    const {
      domain,
      types,
      primaryType,
      message,
    } = sigUtil.TypedDataUtils.sanitizeData(data)
    const domainSeparatorHex = sigUtil.TypedDataUtils.hashStruct('EIP712Domain', domain, types, isV4).toString('hex')
    const hashStructMessageHex = sigUtil.TypedDataUtils.hashStruct(primaryType, message, types, isV4).toString('hex')

    const hdPath = await this.unlockAccountByAddress(withAccount)
    const { success, payload } = await new Promise((resolve) => {
      this._sendMessage({
        action: 'ledger-sign-typed-data',
        params: {
          hdPath,
          domainSeparatorHex,
          hashStructMessageHex,
        },
      },
      (result) => resolve(result))
    })

    if (success) {
      let v = payload.v - 27
      v = v.toString(16)
      if (v.length < 2) {
        v = `0${v}`
      }
      const signature = `0x${payload.r}${payload.s}${v}`
      const addressSignedWith = sigUtil.recoverTypedSignature_v4({
        data,
        sig: signature,
      })
      if (ethUtil.toChecksumAddress(addressSignedWith) !== ethUtil.toChecksumAddress(withAccount)) {
        throw new Error('Ledger: The signature doesnt match the right address')
      }
      return signature
    }
    throw new Error(payload.error || 'Ledger: Unknown error while signing message')

  }

  exportAccount () {
    throw new Error('Not supported on this device')
  }

  forgetDevice () {
    this.accounts = []
    this.page = 0
    this.unlockedAccount = 0
    this.paths = {}
    this.accountDetails = {}
    this.hdk = new HDKey()
  }

  /* PRIVATE METHODS */

  _setupIframe () {
    this.iframe = document.createElement('iframe')
    this.iframe.src = this.bridgeUrl
    this.iframe.onload = async () => {
      // If the ledger live preference was set before the iframe is loaded,
      // set it after the iframe has loaded
      this.iframeLoaded = true
      if (this.delayedPromise) {
        try {
          const result = await this.updateTransportMethod(
            this.delayedPromise.useLedgerLive,
          )
          this.delayedPromise.resolve(result)
        } catch (e) {
          this.delayedPromise.reject(e)
        } finally {
          delete this.delayedPromise
        }
      }
    }
    document.head.appendChild(this.iframe)
  }

  _getOrigin () {
    const tmp = this.bridgeUrl.split('/')
    tmp.splice(-1, 1)
    return tmp.join('/')
  }

  _sendMessage (msg, cb) {
    msg.target = 'LEDGER-IFRAME'
    this.iframe.contentWindow.postMessage(msg, '*')
    const eventListener = ({ origin, data }) => {
      if (origin !== this._getOrigin()) {
        return false
      }

      if (data && data.action && data.action === `${msg.action}-reply` && cb) {
        cb(data)
        return undefined
      }

      window.removeEventListener('message', eventListener)
      return undefined
    }
    window.addEventListener('message', eventListener)
  }

  async __getPage (increment) {

    this.page += increment

    if (this.page <= 0) {
      this.page = 1
    }
    const from = (this.page - 1) * this.perPage
    const to = from + this.perPage

    await this.unlock()
    let accounts
    if (this._isLedgerLiveHdPath()) {
      accounts = await this._getAccountsBIP44(from, to)
    } else {
      accounts = this._getAccountsLegacy(from, to)
    }
    return accounts
  }

  async _getAccountsBIP44 (from, to) {
    const accounts = []

    for (let i = from; i < to; i++) {
      const path = this._getPathForIndex(i)
      const address = await this.unlock(path)
      const valid = this.implementFullBIP44 ? await this._hasPreviousTransactions(address) : true
      accounts.push({
        address,
        balance: null,
        index: i,
      })
      // PER BIP44
      // "Software should prevent a creation of an account if
      // a previous account does not have a transaction history
      // (meaning none of its addresses have been used before)."
      if (!valid) {
        break
      }
    }
    return accounts
  }

  _getAccountsLegacy (from, to) {
    const accounts = []

    for (let i = from; i < to; i++) {
      const address = this._addressFromIndex(pathBase, i)
      accounts.push({
        address,
        balance: null,
        index: i,
      })
      this.paths[ethUtil.toChecksumAddress(address)] = i
    }
    return accounts
  }

  _padLeftEven (hex) {
    return hex.length % 2 === 0 ? hex : `0${hex}`
  }

  _normalize (buf) {
    return this._padLeftEven(ethUtil.bufferToHex(buf).toLowerCase())
  }

  // eslint-disable-next-line no-shadow
  _addressFromIndex (pathBase, i) {
    const dkey = this.hdk.derive(`${pathBase}/${i}`)
    const address = ethUtil
      .publicToAddress(dkey.publicKey, true)
      .toString('hex')
    return ethUtil.toChecksumAddress(`0x${address}`)
  }

  _pathFromAddress (address) {
    const checksummedAddress = ethUtil.toChecksumAddress(address)
    let index = this.paths[checksummedAddress]
    if (typeof index === 'undefined') {
      for (let i = 0; i < MAX_INDEX; i++) {
        if (checksummedAddress === this._addressFromIndex(pathBase, i)) {
          index = i
          break
        }
      }
    }

    if (typeof index === 'undefined') {
      throw new Error('Unknown address')
    }
    return this._getPathForIndex(index)
  }

  _toAscii (hex) {
    let str = ''
    let i = 0
    const l = hex.length
    if (hex.substring(0, 2) === '0x') {
      i = 2
    }
    for (; i < l; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16)
      str += String.fromCharCode(code)
    }

    return str
  }

  _getPathForIndex (index) {
    // Check if the path is BIP 44 (Ledger Live)
    return this._isLedgerLiveHdPath() ? `m/44'/60'/${index}'/0/0` : `${this.hdPath}/${index}`
  }

  _isLedgerLiveHdPath () {
    return this.hdPath === `m/44'/60'/0'/0/0`
  }

  _toLedgerPath (path) {
    return path.toString().replace('m/', '')
  }

  async _hasPreviousTransactions (address) {
    const apiUrl = this._getApiUrl()
    const response = await window.fetch(`${apiUrl}/api?module=account&action=txlist&address=${address}&tag=latest&page=1&offset=1`)
    const parsedResponse = await response.json()
    if (parsedResponse.status !== '0' && parsedResponse.result.length > 0) {
      return true
    }
    return false
  }

  _getApiUrl () {
    return NETWORK_API_URLS[this.network] || NETWORK_API_URLS.mainnet
  }

}

LedgerBridgeKeyring.type = type
module.exports = LedgerBridgeKeyring

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/@metamask/eth-ledger-bridge-keyring/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/eth-ledger-bridge-keyring/index.js",}],
[28, {"../../../shared/constants/network":3595,"../../../shared/modules/network.utils":3605,"./network":18,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"assert":1095,"eth-sig-util":1750,"ethers":1832,"loglevel":2657}, function (require, module, exports) {
(function (global){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _assert = require("assert");

var _obsStore = require("@metamask/obs-store");

var _ethSigUtil = require("eth-sig-util");

var _ethers = require("ethers");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _network = require("../../../shared/constants/network");

var _network2 = require("../../../shared/modules/network.utils");

var _network3 = require("./network");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class PreferencesController {
  /**
   *
   * @typedef {Object} PreferencesController
   * @param {Object} opts - Overrides the defaults for the initial state of this.store
   * @property {Object} store The stored object containing a users preferences, stored in local storage
   * @property {Array} store.frequentRpcList A list of custom rpcs to provide the user
   * @property {boolean} store.useBlockie The users preference for blockie identicons within the UI
   * @property {boolean} store.useNonceField The users preference for nonce field within the UI
   * @property {Object} store.featureFlags A key-boolean map, where keys refer to features and booleans to whether the
   * user wishes to see that feature.
   *
   * Feature flags can be set by the global function `setPreference(feature, enabled)`, and so should not expose any sensitive behavior.
   * @property {Object} store.knownMethodData Contains all data methods known by the user
   * @property {string} store.currentLocale The preferred language locale key
   * @property {string} store.selectedAddress A hex string that matches the currently selected address in the app
   *
   */
  constructor(opts = {}) {
    const initState = _objectSpread({
      frequentRpcListDetail: [],
      useBlockie: false,
      useNonceField: false,
      usePhishDetect: true,
      dismissSeedBackUpReminder: false,
      // set to true means the dynamic list from the API is being used
      // set to false will be using the static list from contract-metadata
      useTokenDetection: false,
      // WARNING: Do not use feature flags for security-sensitive things.
      // Feature flag toggling is available in the global namespace
      // for convenient testing of pre-release features, and should never
      // perform sensitive operations.
      featureFlags: {
        showIncomingTransactions: false
      },
      knownMethodData: {},
      firstTimeFlowType: null,
      currentLocale: opts.initLangCode,
      identities: {},
      lostIdentities: {},
      forgottenPassword: false,
      preferences: {
        autoLockTimeLimit: undefined,
        showFiatInTestnets: false,
        useNativeCurrencyAsPrimaryCurrency: true,
        hideZeroBalanceTokens: false
      },
      completedOnboarding: false,
      // ENS decentralized website resolution
      ipfsGateway: 'dweb.link',
      infuraBlocked: null,
      useLedgerLive: false
    }, opts.initState);

    this.network = opts.network;
    this.ethersProvider = new _ethers.ethers.providers.Web3Provider(opts.provider);
    this.store = new _obsStore.ObservableStore(initState);
    this.store.setMaxListeners(12);
    this.openPopup = opts.openPopup;
    this.migrateAddressBookState = opts.migrateAddressBookState;

    this._subscribeToInfuraAvailability();

    global.setPreference = (key, value) => {
      return this.setFeatureFlag(key, value);
    };
  } // PUBLIC METHODS

  /**
   * Sets the {@code forgottenPassword} state property
   * @param {boolean} forgottenPassword - whether or not the user has forgotten their password
   */


  setPasswordForgotten(forgottenPassword) {
    this.store.updateState({
      forgottenPassword
    });
  }
  /**
   * Setter for the `useBlockie` property
   *
   * @param {boolean} val - Whether or not the user prefers blockie indicators
   *
   */


  setUseBlockie(val) {
    this.store.updateState({
      useBlockie: val
    });
  }
  /**
   * Setter for the `useNonceField` property
   *
   * @param {boolean} val - Whether or not the user prefers to set nonce
   *
   */


  setUseNonceField(val) {
    this.store.updateState({
      useNonceField: val
    });
  }
  /**
   * Setter for the `usePhishDetect` property
   *
   * @param {boolean} val - Whether or not the user prefers phishing domain protection
   *
   */


  setUsePhishDetect(val) {
    this.store.updateState({
      usePhishDetect: val
    });
  }
  /**
   * Setter for the `useTokenDetection` property
   *
   * @param {boolean} val - Whether or not the user prefers to use the static token list or dynamic token list from the API
   *
   */


  setUseTokenDetection(val) {
    this.store.updateState({
      useTokenDetection: val
    });
  }
  /**
   * Setter for the `firstTimeFlowType` property
   *
   * @param {string} type - Indicates the type of first time flow - create or import - the user wishes to follow
   *
   */


  setFirstTimeFlowType(type) {
    this.store.updateState({
      firstTimeFlowType: type
    });
  }
  /**
   * Add new methodData to state, to avoid requesting this information again through Infura
   *
   * @param {string} fourBytePrefix - Four-byte method signature
   * @param {string} methodData - Corresponding data method
   */


  addKnownMethodData(fourBytePrefix, methodData) {
    const {
      knownMethodData
    } = this.store.getState();
    knownMethodData[fourBytePrefix] = methodData;
    this.store.updateState({
      knownMethodData
    });
  }
  /**
   * Setter for the `currentLocale` property
   *
   * @param {string} key - he preferred language locale key
   *
   */


  setCurrentLocale(key) {
    const textDirection = ['ar', 'dv', 'fa', 'he', 'ku'].includes(key) ? 'rtl' : 'auto';
    this.store.updateState({
      currentLocale: key,
      textDirection
    });
    return textDirection;
  }
  /**
   * Updates identities to only include specified addresses. Removes identities
   * not included in addresses array
   *
   * @param {string[]} addresses - An array of hex addresses
   *
   */


  setAddresses(addresses) {
    const oldIdentities = this.store.getState().identities;
    const identities = addresses.reduce((ids, address, index) => {
      const oldId = oldIdentities[address] || {};
      ids[address] = _objectSpread({
        name: `Account ${index + 1}`,
        address
      }, oldId);
      return ids;
    }, {});
    this.store.updateState({
      identities
    });
  }
  /**
   * Removes an address from state
   *
   * @param {string} address - A hex address
   * @returns {string} the address that was removed
   */


  removeAddress(address) {
    const {
      identities
    } = this.store.getState();

    if (!identities[address]) {
      throw new Error(`${address} can't be deleted cause it was not found`);
    }

    delete identities[address];
    this.store.updateState({
      identities
    }); // If the selected account is no longer valid,
    // select an arbitrary other account:

    if (address === this.getSelectedAddress()) {
      const selected = Object.keys(identities)[0];
      this.setSelectedAddress(selected);
    }

    return address;
  }
  /**
   * Adds addresses to the identities object without removing identities
   *
   * @param {string[]} addresses - An array of hex addresses
   *
   */


  addAddresses(addresses) {
    const {
      identities
    } = this.store.getState();
    addresses.forEach(address => {
      // skip if already exists
      if (identities[address]) {
        return;
      } // add missing identity


      const identityCount = Object.keys(identities).length;
      identities[address] = {
        name: `Account ${identityCount + 1}`,
        address
      };
    });
    this.store.updateState({
      identities
    });
  }
  /**
   * Synchronizes identity entries with known accounts.
   * Removes any unknown identities, and returns the resulting selected address.
   *
   * @param {Array<string>} addresses - known to the vault.
   * @returns {Promise<string>} selectedAddress the selected address.
   */


  syncAddresses(addresses) {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error('Expected non-empty array of addresses. Error #11201');
    }

    const {
      identities,
      lostIdentities
    } = this.store.getState();
    const newlyLost = {};
    Object.keys(identities).forEach(identity => {
      if (!addresses.includes(identity)) {
        newlyLost[identity] = identities[identity];
        delete identities[identity];
      }
    }); // Identities are no longer present.

    if (Object.keys(newlyLost).length > 0) {
      // store lost accounts
      Object.keys(newlyLost).forEach(key => {
        lostIdentities[key] = newlyLost[key];
      });
    }

    this.store.updateState({
      identities,
      lostIdentities
    });
    this.addAddresses(addresses); // If the selected account is no longer valid,
    // select an arbitrary other account:

    let selected = this.getSelectedAddress();

    if (!addresses.includes(selected)) {
      selected = addresses[0];
      this.setSelectedAddress(selected);
    }

    return selected;
  }
  /**
   * Setter for the `selectedAddress` property
   *
   * @param {string} _address - A new hex address for an account
   *
   */


  setSelectedAddress(_address) {
    const address = (0, _ethSigUtil.normalize)(_address);
    const {
      identities
    } = this.store.getState();
    const selectedIdentity = identities[address];

    if (!selectedIdentity) {
      throw new Error(`Identity for '${address} not found`);
    }

    selectedIdentity.lastSelected = Date.now();
    this.store.updateState({
      identities,
      selectedAddress: address
    });
  }
  /**
   * Getter for the `selectedAddress` property
   *
   * @returns {string} The hex address for the currently selected account
   *
   */


  getSelectedAddress() {
    return this.store.getState().selectedAddress;
  }
  /**
   * Sets a custom label for an account
   * @param {string} account - the account to set a label for
   * @param {string} label - the custom label for the account
   * @returns {Promise<string>}
   */


  setAccountLabel(account, label) {
    if (!account) {
      throw new Error(`setAccountLabel requires a valid address, got ${String(account)}`);
    }

    const address = (0, _ethSigUtil.normalize)(account);
    const {
      identities
    } = this.store.getState();
    identities[address] = identities[address] || {};
    identities[address].name = label;
    this.store.updateState({
      identities
    });
    return Promise.resolve(label);
  }
  /**
   * updates custom RPC details
   *
   * @param {Object} newRpcDetails - Options bag.
   * @param {string} newRpcDetails.rpcUrl - The RPC url to add to frequentRpcList.
   * @param {string} newRpcDetails.chainId - The chainId of the selected network.
   * @param {string} [newRpcDetails.ticker] - Optional ticker symbol of the selected network.
   * @param {string} [newRpcDetails.nickname] - Optional nickname of the selected network.
   * @param {Object} [newRpcDetails.rpcPrefs] - Optional RPC preferences, such as the block explorer URL
   *
   */


  async updateRpc(newRpcDetails) {
    const rpcList = this.getFrequentRpcListDetail();
    const index = rpcList.findIndex(element => {
      return element.rpcUrl === newRpcDetails.rpcUrl;
    });

    if (index > -1) {
      const rpcDetail = rpcList[index];

      const updatedRpc = _objectSpread(_objectSpread({}, rpcDetail), newRpcDetails);

      if (rpcDetail.chainId !== updatedRpc.chainId) {
        // When the chainId is changed, associated address book entries should
        // also be migrated. The address book entries are keyed by the `network` state,
        // which for custom networks is the chainId with a fallback to the networkId
        // if the chainId is not set.
        let addressBookKey = rpcDetail.chainId;

        if (!addressBookKey) {
          // We need to find the networkId to determine what these addresses were keyed by
          try {
            addressBookKey = await this.ethersProvider.send('net_version');
            (0, _assert.strict)(typeof addressBookKey === 'string');
          } catch (error) {
            _loglevel.default.debug(error);

            _loglevel.default.warn(`Failed to get networkId from ${rpcDetail.rpcUrl}; skipping address book migration`);
          }
        } // There is an edge case where two separate RPC endpoints are keyed by the same
        // value. In this case, the contact book entries are duplicated so that they remain
        // on both networks, since we don't know which network each contact is intended for.


        let duplicate = false;
        const builtInProviderNetworkIds = Object.values(_network.NETWORK_TYPE_TO_ID_MAP).map(ids => ids.networkId);
        const otherRpcEntries = rpcList.filter(entry => entry.rpcUrl !== newRpcDetails.rpcUrl);

        if (builtInProviderNetworkIds.includes(addressBookKey) || otherRpcEntries.some(entry => entry.chainId === addressBookKey)) {
          duplicate = true;
        }

        this.migrateAddressBookState(addressBookKey, updatedRpc.chainId, duplicate);
      }

      rpcList[index] = updatedRpc;
      this.store.updateState({
        frequentRpcListDetail: rpcList
      });
    } else {
      const {
        rpcUrl,
        chainId,
        ticker,
        nickname,
        rpcPrefs = {}
      } = newRpcDetails;
      this.addToFrequentRpcList(rpcUrl, chainId, ticker, nickname, rpcPrefs);
    }
  }
  /**
   * Adds custom RPC url to state.
   *
   * @param {string} rpcUrl - The RPC url to add to frequentRpcList.
   * @param {string} chainId - The chainId of the selected network.
   * @param {string} [ticker] - Ticker symbol of the selected network.
   * @param {string} [nickname] - Nickname of the selected network.
   * @param {Object} [rpcPrefs] - Optional RPC preferences, such as the block explorer URL
   *
   */


  addToFrequentRpcList(rpcUrl, chainId, ticker = 'ETH', nickname = '', rpcPrefs = {}) {
    const rpcList = this.getFrequentRpcListDetail();
    const index = rpcList.findIndex(element => {
      return element.rpcUrl === rpcUrl;
    });

    if (index !== -1) {
      rpcList.splice(index, 1);
    }

    if (!(0, _network2.isPrefixedFormattedHexString)(chainId)) {
      throw new Error(`Invalid chainId: "${chainId}"`);
    }

    rpcList.push({
      rpcUrl,
      chainId,
      ticker,
      nickname,
      rpcPrefs
    });
    this.store.updateState({
      frequentRpcListDetail: rpcList
    });
  }
  /**
   * Removes custom RPC url from state.
   *
   * @param {string} url - The RPC url to remove from frequentRpcList.
   * @returns {Promise<array>} Promise resolving to updated frequentRpcList.
   *
   */


  removeFromFrequentRpcList(url) {
    const rpcList = this.getFrequentRpcListDetail();
    const index = rpcList.findIndex(element => {
      return element.rpcUrl === url;
    });

    if (index !== -1) {
      rpcList.splice(index, 1);
    }

    this.store.updateState({
      frequentRpcListDetail: rpcList
    });
    return Promise.resolve(rpcList);
  }
  /**
   * Getter for the `frequentRpcListDetail` property.
   *
   * @returns {array<array>} An array of rpc urls.
   *
   */


  getFrequentRpcListDetail() {
    return this.store.getState().frequentRpcListDetail;
  }
  /**
   * Updates the `featureFlags` property, which is an object. One property within that object will be set to a boolean.
   *
   * @param {string} feature - A key that corresponds to a UI feature.
   * @param {boolean} activated - Indicates whether or not the UI feature should be displayed
   * @returns {Promise<object>} Promises a new object; the updated featureFlags object.
   *
   */


  setFeatureFlag(feature, activated) {
    const currentFeatureFlags = this.store.getState().featureFlags;

    const updatedFeatureFlags = _objectSpread(_objectSpread({}, currentFeatureFlags), {}, {
      [feature]: activated
    });

    this.store.updateState({
      featureFlags: updatedFeatureFlags
    });
    return Promise.resolve(updatedFeatureFlags);
  }
  /**
   * Updates the `preferences` property, which is an object. These are user-controlled features
   * found in the settings page.
   * @param {string} preference - The preference to enable or disable.
   * @param {boolean} value - Indicates whether or not the preference should be enabled or disabled.
   * @returns {Promise<object>} Promises a new object; the updated preferences object.
   */


  setPreference(preference, value) {
    const currentPreferences = this.getPreferences();

    const updatedPreferences = _objectSpread(_objectSpread({}, currentPreferences), {}, {
      [preference]: value
    });

    this.store.updateState({
      preferences: updatedPreferences
    });
    return Promise.resolve(updatedPreferences);
  }
  /**
   * A getter for the `preferences` property
   * @returns {Object} A key-boolean map of user-selected preferences.
   */


  getPreferences() {
    return this.store.getState().preferences;
  }
  /**
   * Sets the completedOnboarding state to true, indicating that the user has completed the
   * onboarding process.
   */


  completeOnboarding() {
    this.store.updateState({
      completedOnboarding: true
    });
    return Promise.resolve(true);
  }
  /**
   * A getter for the `ipfsGateway` property
   * @returns {string} The current IPFS gateway domain
   */


  getIpfsGateway() {
    return this.store.getState().ipfsGateway;
  }
  /**
   * A setter for the `ipfsGateway` property
   * @param {string} domain - The new IPFS gateway domain
   * @returns {Promise<string>} A promise of the update IPFS gateway domain
   */


  setIpfsGateway(domain) {
    this.store.updateState({
      ipfsGateway: domain
    });
    return Promise.resolve(domain);
  }
  /**
   * A setter for the `useLedgerLive` property
   * @param {bool} useLedgerLive - Value for ledger live support
   * @returns {Promise<string>} A promise of the update to useLedgerLive
   */


  async setLedgerLivePreference(useLedgerLive) {
    this.store.updateState({
      useLedgerLive
    });
    return useLedgerLive;
  }
  /**
   * A getter for the `useLedgerLive` property
   * @returns {boolean} User preference of using Ledger Live
   */


  getLedgerLivePreference() {
    return this.store.getState().useLedgerLive;
  }
  /**
   * A setter for the user preference to dismiss the seed phrase backup reminder
   * @param {bool} dismissBackupReminder- User preference for dismissing the back up reminder
   * @returns {void}
   */


  async setDismissSeedBackUpReminder(dismissSeedBackUpReminder) {
    await this.store.updateState({
      dismissSeedBackUpReminder
    });
  } //
  // PRIVATE METHODS
  //


  _subscribeToInfuraAvailability() {
    this.network.on(_network3.NETWORK_EVENTS.INFURA_IS_BLOCKED, () => {
      this._setInfuraBlocked(true);
    });
    this.network.on(_network3.NETWORK_EVENTS.INFURA_IS_UNBLOCKED, () => {
      this._setInfuraBlocked(false);
    });
  }
  /**
   *
   * A setter for the `infuraBlocked` property
   * @param {boolean} isBlocked - Bool indicating whether Infura is blocked
   *
   */


  _setInfuraBlocked(isBlocked) {
    const {
      infuraBlocked
    } = this.store.getState();

    if (infuraBlocked === isBlocked) {
      return;
    }

    this.store.updateState({
      infuraBlocked: isBlocked
    });
  }

}

exports.default = PreferencesController;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

//# sourceMappingURL=app/scripts/controllers/preferences.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/preferences.js",}],
[1764, {"@ethereumjs/tx":297,"buffer":1428,"ethereumjs-util":1810,"events":1429,"hdkey":1919,"trezor-connect":3408}, function (require, module, exports) {
(function (Buffer){
const { EventEmitter } = require('events');
const ethUtil = require('ethereumjs-util');
const HDKey = require('hdkey');
const TrezorConnect = require('trezor-connect').default;
const { TransactionFactory } = require('@ethereumjs/tx');

const hdPathString = `m/44'/60'/0'/0`;
const keyringType = 'Trezor Hardware';
const pathBase = 'm';
const MAX_INDEX = 1000;
const DELAY_BETWEEN_POPUPS = 1000;
const TREZOR_CONNECT_MANIFEST = {
  email: 'support@metamask.io',
  appUrl: 'https://metamask.io',
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class TrezorKeyring extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.type = keyringType;
    this.accounts = [];
    this.hdk = new HDKey();
    this.page = 0;
    this.perPage = 5;
    this.unlockedAccount = 0;
    this.paths = {};
    this.deserialize(opts);
    TrezorConnect.manifest(TREZOR_CONNECT_MANIFEST);
  }

  serialize() {
    return Promise.resolve({
      hdPath: this.hdPath,
      accounts: this.accounts,
      page: this.page,
      paths: this.paths,
      perPage: this.perPage,
      unlockedAccount: this.unlockedAccount,
    });
  }

  deserialize(opts = {}) {
    this.hdPath = opts.hdPath || hdPathString;
    this.accounts = opts.accounts || [];
    this.page = opts.page || 0;
    this.perPage = opts.perPage || 5;
    return Promise.resolve();
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey);
  }

  unlock() {
    if (this.isUnlocked()) {
      return Promise.resolve('already unlocked');
    }
    return new Promise((resolve, reject) => {
      TrezorConnect.getPublicKey({
        path: this.hdPath,
        coin: 'ETH',
      })
        .then((response) => {
          if (response.success) {
            this.hdk.publicKey = Buffer.from(response.payload.publicKey, 'hex');
            this.hdk.chainCode = Buffer.from(response.payload.chainCode, 'hex');
            resolve('just unlocked');
          } else {
            reject(
              new Error(
                (response.payload && response.payload.error) || 'Unknown error',
              ),
            );
          }
        })
        .catch((e) => {
          reject(new Error((e && e.toString()) || 'Unknown error'));
        });
    });
  }

  setAccountToUnlock(index) {
    this.unlockedAccount = parseInt(index, 10);
  }

  addAccounts(n = 1) {
    return new Promise((resolve, reject) => {
      this.unlock()
        .then((_) => {
          const from = this.unlockedAccount;
          const to = from + n;

          for (let i = from; i < to; i++) {
            const address = this._addressFromIndex(pathBase, i);
            if (!this.accounts.includes(address)) {
              this.accounts.push(address);
            }
            this.page = 0;
          }
          resolve(this.accounts);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getFirstPage() {
    this.page = 0;
    return this.__getPage(1);
  }

  getNextPage() {
    return this.__getPage(1);
  }

  getPreviousPage() {
    return this.__getPage(-1);
  }

  __getPage(increment) {
    this.page += increment;

    if (this.page <= 0) {
      this.page = 1;
    }

    return new Promise((resolve, reject) => {
      this.unlock()
        .then((_) => {
          const from = (this.page - 1) * this.perPage;
          const to = from + this.perPage;

          const accounts = [];

          for (let i = from; i < to; i++) {
            const address = this._addressFromIndex(pathBase, i);
            accounts.push({
              address,
              balance: null,
              index: i,
            });
            this.paths[ethUtil.toChecksumAddress(address)] = i;
          }
          resolve(accounts);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getAccounts() {
    return Promise.resolve(this.accounts.slice());
  }

  removeAccount(address) {
    if (
      !this.accounts.map((a) => a.toLowerCase()).includes(address.toLowerCase())
    ) {
      throw new Error(`Address ${address} not found in this keyring`);
    }
    this.accounts = this.accounts.filter(
      (a) => a.toLowerCase() !== address.toLowerCase(),
    );
  }

  // tx is an instance of the ethereumjs-transaction class.
  signTransaction(address, tx) {
    // transactions built with older versions of ethereumjs-tx have a
    // getChainId method that newer versions do not. Older versions are mutable
    // while newer versions default to being immutable. Expected shape and type
    // of data for v, r and s differ (Buffer (old) vs BN (new))
    if (typeof tx.getChainId === 'function') {
      // In this version of ethereumjs-tx we must add the chainId in hex format
      // to the initial v value. The chainId must be included in the serialized
      // transaction which is only communicated to ethereumjs-tx in this
      // value. In newer versions the chainId is communicated via the 'Common'
      // object.
      return this._signTransaction(address, tx.getChainId(), tx, (payload) => {
        tx.v = Buffer.from(payload.v, 'hex');
        tx.r = Buffer.from(payload.r, 'hex');
        tx.s = Buffer.from(payload.s, 'hex');
        return tx;
      });
    }
    // For transactions created by newer versions of @ethereumjs/tx
    // Note: https://github.com/ethereumjs/ethereumjs-monorepo/issues/1188
    // It is not strictly necessary to do this additional setting of the v
    // value. We should be able to get the correct v value in serialization
    // if the above issue is resolved. Until then this must be set before
    // calling .serialize(). Note we are creating a temporarily mutable object
    // forfeiting the benefit of immutability until this happens. We do still
    // return a Transaction that is frozen if the originally provided
    // transaction was also frozen.
    const unfrozenTx = TransactionFactory.fromTxData(tx.toJSON(), {
      common: tx.common,
      freeze: false,
    });
    unfrozenTx.v = new ethUtil.BN(
      ethUtil.addHexPrefix(tx.common.chainId()),
      'hex',
    );
    return this._signTransaction(
      address,
      tx.common.chainIdBN().toNumber(),
      unfrozenTx,
      (payload) => {
        // Because tx will be immutable, first get a plain javascript object that
        // represents the transaction. Using txData here as it aligns with the
        // nomenclature of ethereumjs/tx.
        const txData = tx.toJSON();
        // The fromTxData utility expects v,r and s to be hex prefixed
        txData.v = ethUtil.addHexPrefix(payload.v);
        txData.r = ethUtil.addHexPrefix(payload.r);
        txData.s = ethUtil.addHexPrefix(payload.s);
        // Adopt the 'common' option from the original transaction and set the
        // returned object to be frozen if the original is frozen.
        return TransactionFactory.fromTxData(txData, {
          common: tx.common,
          freeze: Object.isFrozen(tx),
        });
      },
    );
  }

  // tx is an instance of the ethereumjs-transaction class.
  async _signTransaction(address, chainId, tx, handleSigning) {
    try {
      const status = await this.unlock();
      await wait(status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0);
      const response = await TrezorConnect.ethereumSignTransaction({
        path: this._pathFromAddress(address),
        transaction: {
          to: this._normalize(tx.to),
          value: this._normalize(tx.value),
          data: this._normalize(tx.data),
          chainId,
          nonce: this._normalize(tx.nonce),
          gasLimit: this._normalize(tx.gasLimit),
          gasPrice: this._normalize(tx.gasPrice),
        },
      });
      if (response.success) {
        const newOrMutatedTx = handleSigning(response.payload);

        const addressSignedWith = ethUtil.toChecksumAddress(
          ethUtil.addHexPrefix(
            newOrMutatedTx.getSenderAddress().toString('hex'),
          ),
        );
        const correctAddress = ethUtil.toChecksumAddress(address);
        if (addressSignedWith !== correctAddress) {
          throw new Error("signature doesn't match the right address");
        }

        return newOrMutatedTx;
      }
      throw new Error(
        (response.payload && response.payload.error) || 'Unknown error',
      );
    } catch (e) {
      throw new Error((e && e.toString()) || 'Unknown error');
    }
  }

  signMessage(withAccount, data) {
    return this.signPersonalMessage(withAccount, data);
  }

  // For personal_sign, we need to prefix the message:
  signPersonalMessage(withAccount, message) {
    return new Promise((resolve, reject) => {
      this.unlock()
        .then((status) => {
          setTimeout(
            (_) => {
              TrezorConnect.ethereumSignMessage({
                path: this._pathFromAddress(withAccount),
                message: ethUtil.stripHexPrefix(message),
                hex: true,
              })
                .then((response) => {
                  if (response.success) {
                    if (
                      response.payload.address !==
                      ethUtil.toChecksumAddress(withAccount)
                    ) {
                      reject(
                        new Error('signature doesnt match the right address'),
                      );
                    }
                    const signature = `0x${response.payload.signature}`;
                    resolve(signature);
                  } else {
                    reject(
                      new Error(
                        (response.payload && response.payload.error) ||
                          'Unknown error',
                      ),
                    );
                  }
                })
                .catch((e) => {
                  reject(new Error((e && e.toString()) || 'Unknown error'));
                });
              // This is necessary to avoid popup collision
              // between the unlock & sign trezor popups
            },
            status === 'just unlocked' ? DELAY_BETWEEN_POPUPS : 0,
          );
        })
        .catch((e) => {
          reject(new Error((e && e.toString()) || 'Unknown error'));
        });
    });
  }

  signTypedData() {
    // Waiting on trezor to enable this
    return Promise.reject(new Error('Not supported on this device'));
  }

  exportAccount() {
    return Promise.reject(new Error('Not supported on this device'));
  }

  forgetDevice() {
    this.accounts = [];
    this.hdk = new HDKey();
    this.page = 0;
    this.unlockedAccount = 0;
    this.paths = {};
  }

  /* PRIVATE METHODS */

  _normalize(buf) {
    return ethUtil.bufferToHex(buf).toString();
  }

  // eslint-disable-next-line no-shadow
  _addressFromIndex(pathBase, i) {
    const dkey = this.hdk.derive(`${pathBase}/${i}`);
    const address = ethUtil
      .publicToAddress(dkey.publicKey, true)
      .toString('hex');
    return ethUtil.toChecksumAddress(`0x${address}`);
  }

  _pathFromAddress(address) {
    const checksummedAddress = ethUtil.toChecksumAddress(address);
    let index = this.paths[checksummedAddress];
    if (typeof index === 'undefined') {
      for (let i = 0; i < MAX_INDEX; i++) {
        if (checksummedAddress === this._addressFromIndex(pathBase, i)) {
          index = i;
          break;
        }
      }
    }

    if (typeof index === 'undefined') {
      throw new Error('Unknown address');
    }
    return `${this.hdPath}/${index}`;
  }
}

TrezorKeyring.type = keyringType;
module.exports = TrezorKeyring;

}).call(this,require("buffer").Buffer)

//# sourceMappingURL=node_modules/eth-trezor-keyring/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/eth-trezor-keyring/index.js",}],
[39, {"../../../shared/constants/network":3595,"../constants/contracts":5,"./util":78,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"eth-query":1744,"loglevel":2657,"pify":2887,"single-call-balance-checker-abi":3305,"web3":3525}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethQuery = _interopRequireDefault(require("eth-query"));

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _pify = _interopRequireDefault(require("pify"));

var _web = _interopRequireDefault(require("web3"));

var _singleCallBalanceCheckerAbi = _interopRequireDefault(require("single-call-balance-checker-abi"));

var _network = require("../../../shared/constants/network");

var _contracts = require("../constants/contracts");

var _util = require("./util");

/* Account Tracker
 *
 * This module is responsible for tracking any number of accounts
 * and caching their current balances & transaction counts.
 *
 * It also tracks transaction hashes, and checks their inclusion status
 * on each new block.
 */

/**
 * This module is responsible for tracking any number of accounts and caching their current balances & transaction
 * counts.
 *
 * It also tracks transaction hashes, and checks their inclusion status on each new block.
 *
 * @typedef {Object} AccountTracker
 * @property {Object} store The stored object containing all accounts to track, as well as the current block's gas limit.
 * @property {Object} store.accounts The accounts currently stored in this AccountTracker
 * @property {string} store.currentBlockGasLimit A hex string indicating the gas limit of the current block
 * @property {Object} _provider A provider needed to create the EthQuery instance used within this AccountTracker.
 * @property {EthQuery} _query An EthQuery instance used to access account information from the blockchain
 * @property {BlockTracker} _blockTracker A BlockTracker instance. Needed to ensure that accounts and their info updates
 * when a new block is created.
 * @property {Object} _currentBlockNumber Reference to a property on the _blockTracker: the number (i.e. an id) of the the current block
 *
 */
class AccountTracker {
  /**
   * @param {Object} opts - Options for initializing the controller
   * @param {Object} opts.provider - An EIP-1193 provider instance that uses the current global network
   * @param {Object} opts.blockTracker - A block tracker, which emits events for each new block
   * @param {Function} opts.getCurrentChainId - A function that returns the `chainId` for the current global network
   */
  constructor(opts = {}) {
    const initState = {
      accounts: {},
      currentBlockGasLimit: ''
    };
    this.store = new _obsStore.ObservableStore(initState);
    this._provider = opts.provider;
    this._query = (0, _pify.default)(new _ethQuery.default(this._provider));
    this._blockTracker = opts.blockTracker; // blockTracker.currentBlock may be null

    this._currentBlockNumber = this._blockTracker.getCurrentBlock();

    this._blockTracker.once('latest', blockNumber => {
      this._currentBlockNumber = blockNumber;
    }); // bind function for easier listener syntax


    this._updateForBlock = this._updateForBlock.bind(this);
    this.getCurrentChainId = opts.getCurrentChainId;
    this.web3 = new _web.default(this._provider);
  }

  start() {
    // remove first to avoid double add
    this._blockTracker.removeListener('latest', this._updateForBlock); // add listener


    this._blockTracker.addListener('latest', this._updateForBlock); // fetch account balances


    this._updateAccounts();
  }

  stop() {
    // remove listener
    this._blockTracker.removeListener('latest', this._updateForBlock);
  }
  /**
   * Ensures that the locally stored accounts are in sync with a set of accounts stored externally to this
   * AccountTracker.
   *
   * Once this AccountTracker's accounts are up to date with those referenced by the passed addresses, each
   * of these accounts are given an updated balance via EthQuery.
   *
   * @param {Array} address - The array of hex addresses for accounts with which this AccountTracker's accounts should be
   * in sync
   *
   */


  syncWithAddresses(addresses) {
    const {
      accounts
    } = this.store.getState();
    const locals = Object.keys(accounts);
    const accountsToAdd = [];
    addresses.forEach(upstream => {
      if (!locals.includes(upstream)) {
        accountsToAdd.push(upstream);
      }
    });
    const accountsToRemove = [];
    locals.forEach(local => {
      if (!addresses.includes(local)) {
        accountsToRemove.push(local);
      }
    });
    this.addAccounts(accountsToAdd);
    this.removeAccount(accountsToRemove);
  }
  /**
   * Adds new addresses to track the balances of
   * given a balance as long this._currentBlockNumber is defined.
   *
   * @param {Array} addresses - An array of hex addresses of new accounts to track
   *
   */


  addAccounts(addresses) {
    const {
      accounts
    } = this.store.getState(); // add initial state for addresses

    addresses.forEach(address => {
      accounts[address] = {};
    }); // save accounts state

    this.store.updateState({
      accounts
    }); // fetch balances for the accounts if there is block number ready

    if (!this._currentBlockNumber) {
      return;
    }

    this._updateAccounts();
  }
  /**
   * Removes accounts from being tracked
   *
   * @param {Array} an - array of hex addresses to stop tracking
   *
   */


  removeAccount(addresses) {
    const {
      accounts
    } = this.store.getState(); // remove each state object

    addresses.forEach(address => {
      delete accounts[address];
    }); // save accounts state

    this.store.updateState({
      accounts
    });
  }
  /**
   * Removes all addresses and associated balances
   */


  clearAccounts() {
    this.store.updateState({
      accounts: {}
    });
  }
  /**
   * Given a block, updates this AccountTracker's currentBlockGasLimit, and then updates each local account's balance
   * via EthQuery
   *
   * @private
   * @param {number} blockNumber - the block number to update to.
   * @fires 'block' The updated state, if all account updates are successful
   *
   */


  async _updateForBlock(blockNumber) {
    this._currentBlockNumber = blockNumber; // block gasLimit polling shouldn't be in account-tracker shouldn't be here...

    const currentBlock = await this._query.getBlockByNumber(blockNumber, false);

    if (!currentBlock) {
      return;
    }

    const currentBlockGasLimit = currentBlock.gasLimit;
    this.store.updateState({
      currentBlockGasLimit
    });

    try {
      await this._updateAccounts();
    } catch (err) {
      _loglevel.default.error(err);
    }
  }
  /**
   * balanceChecker is deployed on main eth (test)nets and requires a single call
   * for all other networks, calls this._updateAccount for each account in this.store
   *
   * @returns {Promise} after all account balances updated
   *
   */


  async _updateAccounts() {
    const {
      accounts
    } = this.store.getState();
    const addresses = Object.keys(accounts);
    const chainId = this.getCurrentChainId();

    switch (chainId) {
      case _network.MAINNET_CHAIN_ID:
        await this._updateAccountsViaBalanceChecker(addresses, _contracts.SINGLE_CALL_BALANCES_ADDRESS);
        break;

      case _network.RINKEBY_CHAIN_ID:
        await this._updateAccountsViaBalanceChecker(addresses, _contracts.SINGLE_CALL_BALANCES_ADDRESS_RINKEBY);
        break;

      case _network.ROPSTEN_CHAIN_ID:
        await this._updateAccountsViaBalanceChecker(addresses, _contracts.SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN);
        break;

      case _network.KOVAN_CHAIN_ID:
        await this._updateAccountsViaBalanceChecker(addresses, _contracts.SINGLE_CALL_BALANCES_ADDRESS_KOVAN);
        break;

      case _network.MONSTA_CHAIN_ID:
        await this._updateAccountsViaBalanceChecker(addresses, _contracts.SINGLE_CALL_BALANCES_ADDRESS_MONSTA);
        break;

      default:
        await Promise.all(addresses.map(this._updateAccount.bind(this)));
    }
  }
  /**
   * Updates the current balance of an account.
   *
   * @private
   * @param {string} address - A hex address of a the account to be updated
   * @returns {Promise} after the account balance is updated
   *
   */


  async _updateAccount(address) {
    // query balance
    const balance = await this._query.getBalance(address); // TODO: here to get balance

    const result = {
      address,
      balance
    }; // update accounts state

    const {
      accounts
    } = this.store.getState(); // only populate if the entry is still present

    if (!accounts[address]) {
      return;
    }

    accounts[address] = result;
    this.store.updateState({
      accounts
    });
  }
  /**
   * Updates current address balances from balanceChecker deployed contract instance
   * @param {*} addresses
   * @param {*} deployedContractAddress
   */


  async _updateAccountsViaBalanceChecker(addresses, deployedContractAddress) {
    const {
      accounts
    } = this.store.getState();
    this.web3.setProvider(this._provider);
    const ethContract = this.web3.eth.contract(_singleCallBalanceCheckerAbi.default).at(deployedContractAddress);
    const ethBalance = ['0x0'];
    ethContract.balances(addresses, ethBalance, (error, result) => {
      if (error) {
        _loglevel.default.warn(`MonstaWallet- Account Tracker single call balance fetch failed`, error);

        Promise.all(addresses.map(this._updateAccount.bind(this)));
        return;
      }

      addresses.forEach((address, index) => {
        const balance = result[index] ? (0, _util.bnToHex)(result[index]) : '0x0';
        accounts[address] = {
          address,
          balance
        };
      });
      this.store.updateState({
        accounts
      });
    });
  }

}

exports.default = AccountTracker;

//# sourceMappingURL=app/scripts/lib/account-tracker.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/account-tracker.js",}],
[24, {"../../../../shared/constants/permissions":3596,"./enums":23,"./permissionsLog":25,"./permissionsMethodMiddleware":26,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"eth-rpc-errors":1748,"json-rpc-engine":2274,"lodash":2646,"loglevel":2657,"nanoid":2722,"rpc-cap":3168}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermissionsController = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _nanoid = _interopRequireDefault(require("nanoid"));

var _jsonRpcEngine = require("json-rpc-engine");

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _rpcCap = require("rpc-cap");

var _ethRpcErrors = require("eth-rpc-errors");

var _lodash = require("lodash");

var _permissions = require("../../../../shared/constants/permissions");

var _enums = require("./enums");

var _permissionsMethodMiddleware = _interopRequireDefault(require("./permissionsMethodMiddleware"));

var _permissionsLog = _interopRequireDefault(require("./permissionsLog"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// instanbul ignore next
const noop = () => undefined;

class PermissionsController {
  constructor({
    approvals,
    getKeyringAccounts,
    getRestrictedMethods,
    getUnlockPromise,
    isUnlocked,
    notifyDomain,
    notifyAllDomains,
    preferences
  } = {}, restoredPermissions = {}, restoredState = {}) {
    // additional top-level store key set in _initializeMetadataStore
    this.store = new _obsStore.ObservableStore({
      [_enums.LOG_STORE_KEY]: restoredState[_enums.LOG_STORE_KEY] || [],
      [_enums.HISTORY_STORE_KEY]: restoredState[_enums.HISTORY_STORE_KEY] || {}
    });
    this.getKeyringAccounts = getKeyringAccounts;
    this._getUnlockPromise = getUnlockPromise;
    this._notifyDomain = notifyDomain;
    this._notifyAllDomains = notifyAllDomains;
    this._isUnlocked = isUnlocked;
    this._restrictedMethods = getRestrictedMethods({
      getKeyringAccounts: this.getKeyringAccounts.bind(this),
      getIdentities: this._getIdentities.bind(this)
    });
    this.permissionsLog = new _permissionsLog.default({
      restrictedMethods: Object.keys(this._restrictedMethods),
      store: this.store
    });
    /**
     * @type {import('@metamask/controllers').ApprovalController}
     * @public
     */

    this.approvals = approvals;

    this._initializePermissions(restoredPermissions);

    this._lastSelectedAddress = preferences.getState().selectedAddress;
    this.preferences = preferences;

    this._initializeMetadataStore(restoredState);

    preferences.subscribe(async ({
      selectedAddress
    }) => {
      if (selectedAddress && selectedAddress !== this._lastSelectedAddress) {
        this._lastSelectedAddress = selectedAddress;
        await this._handleAccountSelected(selectedAddress);
      }
    });
  }

  createMiddleware({
    origin,
    extensionId
  }) {
    var _metadataState$origin;

    if (typeof origin !== 'string' || !origin.length) {
      throw new Error('Must provide non-empty string origin.');
    }

    const metadataState = this.store.getState()[_enums.METADATA_STORE_KEY];

    if (extensionId && ((_metadataState$origin = metadataState[origin]) === null || _metadataState$origin === void 0 ? void 0 : _metadataState$origin.extensionId) !== extensionId) {
      this.addDomainMetadata(origin, {
        extensionId
      });
    }

    const engine = new _jsonRpcEngine.JsonRpcEngine();
    engine.push(this.permissionsLog.createMiddleware());
    engine.push((0, _permissionsMethodMiddleware.default)({
      addDomainMetadata: this.addDomainMetadata.bind(this),
      getAccounts: this.getAccounts.bind(this, origin),
      getUnlockPromise: () => this._getUnlockPromise(true),
      hasPermission: this.hasPermission.bind(this, origin),
      notifyAccountsChanged: this.notifyAccountsChanged.bind(this, origin),
      requestAccountsPermission: this._requestPermissions.bind(this, {
        origin
      }, {
        eth_accounts: {}
      })
    }));
    engine.push(this.permissions.providerMiddlewareFunction.bind(this.permissions, {
      origin
    }));
    return engine.asMiddleware();
  }
  /**
   * Request {@code eth_accounts} permissions
   * @param {string} origin - The requesting origin
   * @returns {Promise<string>} The permissions request ID
   */


  async requestAccountsPermissionWithId(origin) {
    const id = (0, _nanoid.default)();

    this._requestPermissions({
      origin
    }, {
      eth_accounts: {}
    }, id).then(async () => {
      const permittedAccounts = await this.getAccounts(origin);
      this.notifyAccountsChanged(origin, permittedAccounts);
    });

    return id;
  }
  /**
   * Returns the accounts that should be exposed for the given origin domain,
   * if any. This method exists for when a trusted context needs to know
   * which accounts are exposed to a given domain.
   *
   * @param {string} origin - The origin string.
   */


  getAccounts(origin) {
    return new Promise((resolve, _) => {
      const req = {
        method: 'eth_accounts'
      };
      const res = {};
      this.permissions.providerMiddlewareFunction({
        origin
      }, req, res, noop, _end);

      function _end() {
        if (res.error || !Array.isArray(res.result)) {
          resolve([]);
        } else {
          resolve(res.result);
        }
      }
    });
  }
  /**
   * Returns whether the given origin has the given permission.
   *
   * @param {string} origin - The origin to check.
   * @param {string} permission - The permission to check for.
   * @returns {boolean} Whether the origin has the permission.
   */


  hasPermission(origin, permission) {
    return Boolean(this.permissions.getPermission(origin, permission));
  }
  /**
   * Gets the identities from the preferences controller store
   *
   * @returns {Object} identities
   */


  _getIdentities() {
    return this.preferences.getState().identities;
  }
  /**
   * Submits a permissions request to rpc-cap. Internal, background use only.
   *
   * @param {IOriginMetadata} domain - The external domain metadata.
   * @param {IRequestedPermissions} permissions - The requested permissions.
   * @param {string} [id] - The desired id of the permissions request, if any.
   * @returns {Promise<IOcapLdCapability[]>} A Promise that resolves with the
   * approved permissions, or rejects with an error.
   */


  _requestPermissions(domain, permissions, id) {
    return new Promise((resolve, reject) => {
      // rpc-cap assigns an id to the request if there is none, as expected by
      // requestUserApproval below
      const req = {
        id,
        method: 'wallet_requestPermissions',
        params: [permissions]
      };
      const res = {};
      this.permissions.providerMiddlewareFunction(domain, req, res, noop, _end);

      function _end(_err) {
        const err = _err || res.error;

        if (err) {
          reject(err);
        } else {
          resolve(res.result);
        }
      }
    });
  }
  /**
   * User approval callback. Resolves the Promise for the permissions request
   * waited upon by rpc-cap, see requestUserApproval in _initializePermissions.
   * The request will be rejected if finalizePermissionsRequest fails.
   * Idempotent for a given request id.
   *
   * @param {Object} approved - The request object approved by the user
   * @param {Array} accounts - The accounts to expose, if any
   */


  async approvePermissionsRequest(approved, accounts) {
    const {
      id
    } = approved.metadata;

    if (!this.approvals.has({
      id
    })) {
      _loglevel.default.debug(`Permissions request with id '${id}' not found.`);

      return;
    }

    try {
      if (Object.keys(approved.permissions).length === 0) {
        this.approvals.reject(id, _ethRpcErrors.ethErrors.rpc.invalidRequest({
          message: 'Must request at least one permission.'
        }));
      } else {
        // attempt to finalize the request and resolve it,
        // settings caveats as necessary
        approved.permissions = await this.finalizePermissionsRequest(approved.permissions, accounts);
        this.approvals.accept(id, approved.permissions);
      }
    } catch (err) {
      // if finalization fails, reject the request
      this.approvals.reject(id, _ethRpcErrors.ethErrors.rpc.invalidRequest({
        message: err.message,
        data: err
      }));
    }
  }
  /**
   * User rejection callback. Rejects the Promise for the permissions request
   * waited upon by rpc-cap, see requestUserApproval in _initializePermissions.
   * Idempotent for a given id.
   *
   * @param {string} id - The id of the request rejected by the user
   */


  async rejectPermissionsRequest(id) {
    if (!this.approvals.has({
      id
    })) {
      _loglevel.default.debug(`Permissions request with id '${id}' not found.`);

      return;
    }

    this.approvals.reject(id, _ethRpcErrors.ethErrors.provider.userRejectedRequest());
  }
  /**
   * Expose an account to the given origin. Changes the eth_accounts
   * permissions and emits accountsChanged.
   *
   * Throws error if the origin or account is invalid, or if the update fails.
   *
   * @param {string} origin - The origin to expose the account to.
   * @param {string} account - The new account to expose.
   */


  async addPermittedAccount(origin, account) {
    const domains = this.permissions.getDomains();

    if (!domains[origin]) {
      throw new Error('Unrecognized domain');
    }

    this.validatePermittedAccounts([account]);

    const oldPermittedAccounts = this._getPermittedAccounts(origin);

    if (oldPermittedAccounts.length === 0) {
      throw new Error(`Origin does not have 'eth_accounts' permission`);
    } else if (oldPermittedAccounts.includes(account)) {
      throw new Error('Account is already permitted for origin');
    }

    this.permissions.updateCaveatFor(origin, 'eth_accounts', _permissions.CAVEAT_NAMES.exposedAccounts, [...oldPermittedAccounts, account]);
    const permittedAccounts = await this.getAccounts(origin);
    this.notifyAccountsChanged(origin, permittedAccounts);
  }
  /**
   * Removes an exposed account from the given origin. Changes the eth_accounts
   * permission and emits accountsChanged.
   * If origin only has a single permitted account, removes the eth_accounts
   * permission from the origin.
   *
   * Throws error if the origin or account is invalid, or if the update fails.
   *
   * @param {string} origin - The origin to remove the account from.
   * @param {string} account - The account to remove.
   */


  async removePermittedAccount(origin, account) {
    const domains = this.permissions.getDomains();

    if (!domains[origin]) {
      throw new Error('Unrecognized domain');
    }

    this.validatePermittedAccounts([account]);

    const oldPermittedAccounts = this._getPermittedAccounts(origin);

    if (oldPermittedAccounts.length === 0) {
      throw new Error(`Origin does not have 'eth_accounts' permission`);
    } else if (!oldPermittedAccounts.includes(account)) {
      throw new Error('Account is not permitted for origin');
    }

    let newPermittedAccounts = oldPermittedAccounts.filter(acc => acc !== account);

    if (newPermittedAccounts.length === 0) {
      this.removePermissionsFor({
        [origin]: ['eth_accounts']
      });
    } else {
      this.permissions.updateCaveatFor(origin, 'eth_accounts', _permissions.CAVEAT_NAMES.exposedAccounts, newPermittedAccounts);
      newPermittedAccounts = await this.getAccounts(origin);
    }

    this.notifyAccountsChanged(origin, newPermittedAccounts);
  }
  /**
   * Remove all permissions associated with a particular account. Any eth_accounts
   * permissions left with no permitted accounts will be removed as well.
   *
   * Throws error if the account is invalid, or if the update fails.
   *
   * @param {string} account - The account to remove.
   */


  async removeAllAccountPermissions(account) {
    this.validatePermittedAccounts([account]);
    const domains = this.permissions.getDomains();
    const connectedOrigins = Object.keys(domains).filter(origin => this._getPermittedAccounts(origin).includes(account));
    await Promise.all(connectedOrigins.map(origin => this.removePermittedAccount(origin, account)));
  }
  /**
   * Finalizes a permissions request. Throws if request validation fails.
   * Clones the passed-in parameters to prevent inadvertent modification.
   * Sets (adds or replaces) caveats for the following permissions:
   * - eth_accounts: the permitted accounts caveat
   *
   * @param {Object} requestedPermissions - The requested permissions.
   * @param {string[]} requestedAccounts - The accounts to expose, if any.
   * @returns {Object} The finalized permissions request object.
   */


  async finalizePermissionsRequest(requestedPermissions, requestedAccounts) {
    const finalizedPermissions = (0, _lodash.cloneDeep)(requestedPermissions);
    const finalizedAccounts = (0, _lodash.cloneDeep)(requestedAccounts);
    const {
      eth_accounts: ethAccounts
    } = finalizedPermissions;

    if (ethAccounts) {
      this.validatePermittedAccounts(finalizedAccounts);

      if (!ethAccounts.caveats) {
        ethAccounts.caveats = [];
      } // caveat names are unique, and we will only construct this caveat here


      ethAccounts.caveats = ethAccounts.caveats.filter(c => c.name !== _permissions.CAVEAT_NAMES.exposedAccounts && c.name !== _permissions.CAVEAT_NAMES.primaryAccountOnly);
      ethAccounts.caveats.push({
        type: _enums.CAVEAT_TYPES.limitResponseLength,
        value: 1,
        name: _permissions.CAVEAT_NAMES.primaryAccountOnly
      });
      ethAccounts.caveats.push({
        type: _enums.CAVEAT_TYPES.filterResponse,
        value: finalizedAccounts,
        name: _permissions.CAVEAT_NAMES.exposedAccounts
      });
    }

    return finalizedPermissions;
  }
  /**
   * Validate an array of accounts representing accounts to be exposed
   * to a domain. Throws error if validation fails.
   *
   * @param {string[]} accounts - An array of addresses.
   */


  validatePermittedAccounts(accounts) {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('Must provide non-empty array of account(s).');
    } // assert accounts exist


    const allIdentities = this._getIdentities();

    accounts.forEach(acc => {
      if (!allIdentities[acc]) {
        throw new Error(`Unknown account: ${acc}`);
      }
    });
  }
  /**
   * Notify a domain that its permitted accounts have changed.
   * Also updates the accounts history log.
   *
   * @param {string} origin - The origin of the domain to notify.
   * @param {Array<string>} newAccounts - The currently permitted accounts.
   */


  notifyAccountsChanged(origin, newAccounts) {
    if (typeof origin !== 'string' || !origin) {
      throw new Error(`Invalid origin: '${origin}'`);
    }

    if (!Array.isArray(newAccounts)) {
      throw new Error('Invalid accounts', newAccounts);
    } // We do not share accounts when the extension is locked.


    if (this._isUnlocked()) {
      this._notifyDomain(origin, {
        method: _enums.NOTIFICATION_NAMES.accountsChanged,
        params: newAccounts
      });

      this.permissionsLog.updateAccountsHistory(origin, newAccounts);
    } // NOTE:
    // We don't check for accounts changing in the notifyAllDomains case,
    // because the log only records when accounts were last seen, and the
    // the accounts only change for all domains at once when permissions are
    // removed.

  }
  /**
   * Removes the given permissions for the given domain.
   * Should only be called after confirming that the permissions exist, to
   * avoid sending unnecessary notifications.
   *
   * @param {Object} domains - The map of domain origins to permissions to remove.
   *                           e.g. { origin: [permissions] }
   */


  removePermissionsFor(domains) {
    Object.entries(domains).forEach(([origin, perms]) => {
      this.permissions.removePermissionsFor(origin, perms.map(methodName => {
        if (methodName === 'eth_accounts') {
          this.notifyAccountsChanged(origin, []);
        }

        return {
          parentCapability: methodName
        };
      }));
    });
  }
  /**
   * Removes all known domains and their related permissions.
   */


  clearPermissions() {
    this.permissions.clearDomains(); // It's safe to notify that no accounts are available, regardless of
    // extension lock state

    this._notifyAllDomains({
      method: _enums.NOTIFICATION_NAMES.accountsChanged,
      params: []
    });
  }
  /**
   * Stores domain metadata for the given origin (domain).
   * Deletes metadata for domains without permissions in a FIFO manner, once
   * more than 100 distinct origins have been added since boot.
   * Metadata is never deleted for domains with permissions, to prevent a
   * degraded user experience, since metadata cannot yet be requested on demand.
   *
   * @param {string} origin - The origin whose domain metadata to store.
   * @param {Object} metadata - The domain's metadata that will be stored.
   */


  addDomainMetadata(origin, metadata) {
    const oldMetadataState = this.store.getState()[_enums.METADATA_STORE_KEY];

    const newMetadataState = _objectSpread({}, oldMetadataState); // delete pending metadata origin from queue, and delete its metadata if
    // it doesn't have any permissions


    if (this._pendingSiteMetadata.size >= _enums.METADATA_CACHE_MAX_SIZE) {
      const permissionsDomains = this.permissions.getDomains();

      const oldOrigin = this._pendingSiteMetadata.values().next().value;

      this._pendingSiteMetadata.delete(oldOrigin);

      if (!permissionsDomains[oldOrigin]) {
        delete newMetadataState[oldOrigin];
      }
    } // add new metadata to store after popping


    newMetadataState[origin] = _objectSpread(_objectSpread(_objectSpread({}, oldMetadataState[origin]), metadata), {}, {
      lastUpdated: Date.now()
    });

    if (!newMetadataState[origin].extensionId && !newMetadataState[origin].host) {
      newMetadataState[origin].host = new URL(origin).host;
    }

    this._pendingSiteMetadata.add(origin);

    this._setDomainMetadata(newMetadataState);
  }
  /**
   * Removes all domains without permissions from the restored metadata state,
   * and rehydrates the metadata store.
   *
   * Requires PermissionsController._initializePermissions to have been called first.
   *
   * @param {Object} restoredState - The restored permissions controller state.
   */


  _initializeMetadataStore(restoredState) {
    const metadataState = restoredState[_enums.METADATA_STORE_KEY] || {};

    const newMetadataState = this._trimDomainMetadata(metadataState);

    this._pendingSiteMetadata = new Set();

    this._setDomainMetadata(newMetadataState);
  }
  /**
   * Trims the given metadataState object by removing metadata for all origins
   * without permissions.
   * Returns a new object; does not mutate the argument.
   *
   * @param {Object} metadataState - The metadata store state object to trim.
   * @returns {Object} The new metadata state object.
   */


  _trimDomainMetadata(metadataState) {
    const newMetadataState = _objectSpread({}, metadataState);

    const origins = Object.keys(metadataState);
    const permissionsDomains = this.permissions.getDomains();
    origins.forEach(origin => {
      if (!permissionsDomains[origin]) {
        delete newMetadataState[origin];
      }
    });
    return newMetadataState;
  }
  /**
   * Replaces the existing domain metadata with the passed-in object.
   * @param {Object} newMetadataState - The new metadata to set.
   */


  _setDomainMetadata(newMetadataState) {
    this.store.updateState({
      [_enums.METADATA_STORE_KEY]: newMetadataState
    });
  }
  /**
   * Get current set of permitted accounts for the given origin
   *
   * @param {string} origin - The origin to obtain permitted accounts for
   * @returns {Array<string>} The list of permitted accounts
   */


  _getPermittedAccounts(origin) {
    var _this$permissions$get, _this$permissions$get2, _this$permissions$get3;

    const permittedAccounts = (_this$permissions$get = this.permissions.getPermission(origin, 'eth_accounts')) === null || _this$permissions$get === void 0 ? void 0 : (_this$permissions$get2 = _this$permissions$get.caveats) === null || _this$permissions$get2 === void 0 ? void 0 : (_this$permissions$get3 = _this$permissions$get2.find(caveat => caveat.name === _permissions.CAVEAT_NAMES.exposedAccounts)) === null || _this$permissions$get3 === void 0 ? void 0 : _this$permissions$get3.value;
    return permittedAccounts || [];
  }
  /**
   * When a new account is selected in the UI, emit accountsChanged to each origin
   * where the selected account is exposed.
   *
   * Note: This will emit "false positive" accountsChanged events, but they are
   * handled by the inpage provider.
   *
   * @param {string} account - The newly selected account's address.
   */


  async _handleAccountSelected(account) {
    if (typeof account !== 'string') {
      throw new Error('Selected account should be a non-empty string.');
    }

    const domains = this.permissions.getDomains() || {};
    const connectedDomains = Object.entries(domains).filter(([_, {
      permissions
    }]) => {
      var _ethAccounts$caveats$;

      const ethAccounts = permissions.find(permission => permission.parentCapability === 'eth_accounts');
      const exposedAccounts = ethAccounts === null || ethAccounts === void 0 ? void 0 : (_ethAccounts$caveats$ = ethAccounts.caveats.find(caveat => caveat.name === 'exposedAccounts')) === null || _ethAccounts$caveats$ === void 0 ? void 0 : _ethAccounts$caveats$.value;
      return exposedAccounts === null || exposedAccounts === void 0 ? void 0 : exposedAccounts.includes(account);
    }).map(([domain]) => domain);
    await Promise.all(connectedDomains.map(origin => this._handleConnectedAccountSelected(origin)));
  }
  /**
   * When a new account is selected in the UI, emit accountsChanged to 'origin'
   *
   * Note: This will emit "false positive" accountsChanged events, but they are
   * handled by the inpage provider.
   *
   * @param {string} origin - The origin
   */


  async _handleConnectedAccountSelected(origin) {
    const permittedAccounts = await this.getAccounts(origin);
    this.notifyAccountsChanged(origin, permittedAccounts);
  }
  /**
   * A convenience method for retrieving a login object
   * or creating a new one if needed.
   *
   * @param {string} origin - The origin string representing the domain.
   */


  _initializePermissions(restoredState) {
    // these permission requests are almost certainly stale
    const initState = _objectSpread(_objectSpread({}, restoredState), {}, {
      permissionsRequests: []
    });

    this.permissions = new _rpcCap.CapabilitiesController({
      // Supports passthrough methods:
      safeMethods: _enums.SAFE_METHODS,
      // optional prefix for internal methods
      methodPrefix: _enums.WALLET_PREFIX,
      restrictedMethods: this._restrictedMethods,

      /**
       * A promise-returning callback used to determine whether to approve
       * permissions requests or not.
       *
       * Currently only returns a boolean, but eventually should return any
       * specific parameters or amendments to the permissions.
       *
       * @param {string} req - The internal rpc-cap user request object.
       */
      requestUserApproval: async req => {
        const {
          metadata: {
            id,
            origin
          }
        } = req;
        return this.approvals.addAndShowApprovalRequest({
          id,
          origin,
          type: _enums.APPROVAL_TYPE
        });
      }
    }, initState);
  }

}

exports.PermissionsController = PermissionsController;

//# sourceMappingURL=app/scripts/controllers/permissions/index.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/permissions/index.js",}],
[30, {"../../../development/mock-3box":148,"../lib/createOriginMiddleware":45,"../lib/migrator":60,"../migrations":144,"./network/createMetamaskMiddleware":17,"3box":154,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"@metamask/obs-store":981,"eth-json-rpc-middleware/providerFromEngine":1733,"json-rpc-engine":2274,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _obsStore = require("@metamask/obs-store");

var _loglevel = _interopRequireDefault(require("loglevel"));

var _jsonRpcEngine = require("json-rpc-engine");

var _providerFromEngine = _interopRequireDefault(require("eth-json-rpc-middleware/providerFromEngine"));

var _migrator = _interopRequireDefault(require("../lib/migrator"));

var _migrations = _interopRequireDefault(require("../migrations"));

var _createOriginMiddleware = _interopRequireDefault(require("../lib/createOriginMiddleware"));

var _createMetamaskMiddleware = _interopRequireDefault(require("./network/createMetamaskMiddleware"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* eslint-disable import/first,import/order */
const Box = false ? require('../../../development/mock-3box') : require('3box');
/* eslint-enable import/order */

/* eslint-enable import/first */
const SYNC_TIMEOUT = 60 * 1000; // one minute

class ThreeBoxController {
  constructor(opts = {}) {
    const {
      preferencesController,
      keyringController,
      addressBookController,
      version,
      getKeyringControllerState,
      trackMetaMetricsEvent
    } = opts;
    this.preferencesController = preferencesController;
    this.addressBookController = addressBookController;
    this.keyringController = keyringController;
    this.provider = this._createProvider({
      version,
      getAccounts: async ({
        origin
      }) => {
        if (origin !== '3Box') {
          return [];
        }

        const {
          isUnlocked
        } = getKeyringControllerState();
        const accounts = await this.keyringController.getAccounts();

        if (isUnlocked && accounts[0]) {
          const appKeyAddress = await this.keyringController.getAppKeyAddress(accounts[0], 'wallet://3box.metamask.io');
          return [appKeyAddress];
        }

        return [];
      },
      processPersonalMessage: async msgParams => {
        const accounts = await this.keyringController.getAccounts();
        return keyringController.signPersonalMessage(_objectSpread(_objectSpread({}, msgParams), {}, {
          from: accounts[0]
        }), {
          withAppKeyOrigin: 'wallet://3box.metamask.io'
        });
      }
    });
    this._trackMetaMetricsEvent = trackMetaMetricsEvent;

    const initState = _objectSpread(_objectSpread({
      threeBoxSyncingAllowed: false,
      showRestorePrompt: true,
      threeBoxLastUpdated: 0
    }, opts.initState), {}, {
      threeBoxAddress: null,
      threeBoxSynced: false,
      threeBoxDisabled: false
    });

    this.store = new _obsStore.ObservableStore(initState);
    this.registeringUpdates = false;
    this.lastMigration = _migrations.default.sort((a, b) => a.version - b.version).slice(-1)[0];

    if (initState.threeBoxSyncingAllowed) {
      this.init();
    }
  }

  async init() {
    const accounts = await this.keyringController.getAccounts();
    this.address = accounts[0];

    this._trackMetaMetricsEvent({
      event: '3Box Initiated',
      category: '3Box'
    });

    if (this.address && !(this.box && this.store.getState().threeBoxSynced)) {
      await this.new3Box();
    }
  }

  async _update3Box() {
    try {
      const {
        threeBoxSyncingAllowed,
        threeBoxSynced
      } = this.store.getState();

      if (threeBoxSyncingAllowed && threeBoxSynced) {
        const newState = {
          preferences: this.preferencesController.store.getState(),
          addressBook: this.addressBookController.state,
          lastUpdated: Date.now(),
          lastMigration: this.lastMigration
        };
        await this.space.private.set('metamaskBackup', JSON.stringify(newState));
        await this.setShowRestorePromptToFalse();
      }
    } catch (error) {
      console.error(error);
    }
  }

  _createProvider(providerOpts) {
    const metamaskMiddleware = (0, _createMetamaskMiddleware.default)(providerOpts);
    const engine = new _jsonRpcEngine.JsonRpcEngine();
    engine.push((0, _createOriginMiddleware.default)({
      origin: '3Box'
    }));
    engine.push(metamaskMiddleware);
    const provider = (0, _providerFromEngine.default)(engine);
    return provider;
  }

  _waitForOnSyncDone() {
    return new Promise(resolve => {
      this.box.onSyncDone(() => {
        _loglevel.default.debug('3Box box sync done');

        return resolve();
      });
    });
  }

  async new3Box() {
    const accounts = await this.keyringController.getAccounts();
    this.address = await this.keyringController.getAppKeyAddress(accounts[0], 'wallet://3box.metamask.io');
    let backupExists;

    try {
      const threeBoxConfig = await Box.getConfig(this.address);
      backupExists = threeBoxConfig.spaces && threeBoxConfig.spaces.metamask;
    } catch (e) {
      if (e.message.match(/^Error: Invalid response \(404\)/u)) {
        this._trackMetaMetricsEvent({
          event: '3Box Backup does not exist',
          category: '3Box'
        });

        backupExists = false;
      } else {
        this._trackMetaMetricsEvent({
          event: '3Box Config Error',
          category: '3Box'
        });

        throw e;
      }
    }

    if (this.getThreeBoxSyncingState() || backupExists) {
      this.store.updateState({
        threeBoxSynced: false
      });
      let timedOut = false;
      const syncTimeout = setTimeout(() => {
        _loglevel.default.error(`3Box sync timed out after ${SYNC_TIMEOUT} ms`);

        timedOut = true;
        this.store.updateState({
          threeBoxDisabled: true,
          threeBoxSyncingAllowed: false
        });
      }, SYNC_TIMEOUT);

      try {
        this.box = await Box.openBox(this.address, this.provider);
        await this._waitForOnSyncDone();
        this.space = await this.box.openSpace('metamask', {
          onSyncDone: async () => {
            const stateUpdate = {
              threeBoxSynced: true,
              threeBoxAddress: this.address
            };

            if (timedOut) {
              _loglevel.default.info(`3Box sync completed after timeout; no longer disabled`);

              stateUpdate.threeBoxDisabled = false;
            }

            clearTimeout(syncTimeout);
            this.store.updateState(stateUpdate);

            _loglevel.default.debug('3Box space sync done');

            this._trackMetaMetricsEvent({
              event: '3Box Synced',
              category: '3Box'
            });
          }
        });
      } catch (e) {
        this._trackMetaMetricsEvent({
          event: '3Box Initiation Error',
          category: '3Box'
        });

        console.error(e);
        throw e;
      }
    }
  }

  async getLastUpdated() {
    const res = await this.space.private.get('metamaskBackup');
    const parsedRes = JSON.parse(res || '{}');
    return parsedRes.lastUpdated;
  }

  async migrateBackedUpState(backedUpState) {
    const migrator = new _migrator.default({
      migrations: _migrations.default
    });
    const {
      preferences,
      addressBook
    } = JSON.parse(backedUpState);
    const formattedStateBackup = {
      PreferencesController: preferences,
      AddressBookController: addressBook
    };
    const initialMigrationState = migrator.generateInitialState(formattedStateBackup);
    const migratedState = await migrator.migrateData(initialMigrationState);
    return {
      preferences: migratedState.data.PreferencesController,
      addressBook: migratedState.data.AddressBookController
    };
  }

  async restoreFromThreeBox() {
    const backedUpState = await this.space.private.get('metamaskBackup');
    const {
      preferences,
      addressBook
    } = await this.migrateBackedUpState(backedUpState);
    this.store.updateState({
      threeBoxLastUpdated: backedUpState.lastUpdated
    });
    preferences && this.preferencesController.store.updateState(preferences);
    addressBook && this.addressBookController.update(addressBook, true);
    this.setShowRestorePromptToFalse();

    this._trackMetaMetricsEvent({
      event: '3Box Restored Data',
      category: '3Box'
    });
  }

  turnThreeBoxSyncingOn() {
    this._trackMetaMetricsEvent({
      event: '3Box Sync Turned On',
      category: '3Box'
    });

    this._registerUpdates();
  }

  turnThreeBoxSyncingOff() {
    this._trackMetaMetricsEvent({
      event: '3Box Sync Turned Off',
      category: '3Box'
    });

    this.box.logout();
  }

  setShowRestorePromptToFalse() {
    this.store.updateState({
      showRestorePrompt: false
    });
  }

  setThreeBoxSyncingPermission(newThreeboxSyncingState) {
    if (this.store.getState().threeBoxDisabled) {
      return;
    }

    this.store.updateState({
      threeBoxSyncingAllowed: newThreeboxSyncingState
    });

    if (newThreeboxSyncingState && this.box) {
      this.turnThreeBoxSyncingOn();
    }

    if (!newThreeboxSyncingState && this.box) {
      this.turnThreeBoxSyncingOff();
    }
  }

  getThreeBoxSyncingState() {
    return this.store.getState().threeBoxSyncingAllowed;
  }

  _registerUpdates() {
    if (!this.registeringUpdates) {
      const updatePreferences = this._update3Box.bind(this);

      this.preferencesController.store.subscribe(updatePreferences);

      const updateAddressBook = this._update3Box.bind(this);

      this.addressBookController.subscribe(updateAddressBook);
      this.registeringUpdates = true;
    }
  }

}

exports.default = ThreeBoxController;

//# sourceMappingURL=app/scripts/controllers/threebox.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/threebox.js",}],
[984, {"events":1429}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        // Throw error after timeout so as not to interrupt the stack
        setTimeout(() => {
            throw err;
        });
    }
}
function arrayClone(arr) {
    const n = arr.length;
    const copy = new Array(n);
    for (let i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
class SafeEventEmitter extends events_1.EventEmitter {
    emit(type, ...args) {
        let doError = type === 'error';
        const events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        // If there is no 'error' event listener then throw.
        if (doError) {
            let er;
            if (args.length > 0) {
                [er] = args;
            }
            if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
            }
            // At least give some kind of context to the user
            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);
            err.context = er;
            throw err; // Unhandled 'error' event
        }
        const handler = events[type];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            const len = handler.length;
            const listeners = arrayClone(handler);
            for (let i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    }
}
exports.default = SafeEventEmitter;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=node_modules/@metamask/safe-event-emitter/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/safe-event-emitter/index.js",}],
[983, {"_process":2892,"readable-stream":3135,"util":3459,"xtend":3588}, function (require, module, exports) {
(function (process){
var Transform = require('readable-stream').Transform
  , inherits  = require('util').inherits
  , xtend     = require('xtend')

function DestroyableTransform(opts) {
  Transform.call(this, opts)
  this._destroyed = false
}

inherits(DestroyableTransform, Transform)

DestroyableTransform.prototype.destroy = function(err) {
  if (this._destroyed) return
  this._destroyed = true
  
  var self = this
  process.nextTick(function() {
    if (err)
      self.emit('error', err)
    self.emit('close')
  })
}

// a noop _transform function
function noop (chunk, enc, callback) {
  callback(null, chunk)
}


// create a new export function, used by both the main export and
// the .ctor export, contains common logic for dealing with arguments
function through2 (construct) {
  return function (options, transform, flush) {
    if (typeof options == 'function') {
      flush     = transform
      transform = options
      options   = {}
    }

    if (typeof transform != 'function')
      transform = noop

    if (typeof flush != 'function')
      flush = null

    return construct(options, transform, flush)
  }
}


// main export, just make me a transform stream!
module.exports = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(options)

  t2._transform = transform

  if (flush)
    t2._flush = flush

  return t2
})


// make me a reusable prototype that I can `new`, or implicitly `new`
// with a constructor call
module.exports.ctor = through2(function (options, transform, flush) {
  function Through2 (override) {
    if (!(this instanceof Through2))
      return new Through2(override)

    this.options = xtend(options, override)

    DestroyableTransform.call(this, this.options)
  }

  inherits(Through2, DestroyableTransform)

  Through2.prototype._transform = transform

  if (flush)
    Through2.prototype._flush = flush

  return Through2
})


module.exports.obj = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(xtend({ objectMode: true, highWaterMark: 16 }, options))

  t2._transform = transform

  if (flush)
    t2._flush = flush

  return t2
})

}).call(this,require('_process'))

//# sourceMappingURL=node_modules/@metamask/obs-store/node_modules/through2/through2.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@metamask/obs-store/node_modules/through2/through2.js",}],
[143, {"../../../shared/constants/transaction":3599,"lodash":2646}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = failTxsThat;

var _lodash = require("lodash");

var _transaction = require("../../../shared/constants/transaction");

function failTxsThat(version, reason, condition) {
  return function (originalVersionedData) {
    const versionedData = (0, _lodash.cloneDeep)(originalVersionedData);
    versionedData.meta.version = version;

    try {
      const state = versionedData.data;
      const newState = transformState(state, condition, reason);
      versionedData.data = newState;
    } catch (err) {
      console.warn(`MonstaWalletMigration #${version}${err.stack}`);
    }

    return Promise.resolve(versionedData);
  };
}

function transformState(state, condition, reason) {
  const newState = state;
  const {
    TransactionController
  } = newState;

  if (TransactionController && TransactionController.transactions) {
    const {
      transactions
    } = TransactionController;
    newState.TransactionController.transactions = transactions.map(txMeta => {
      if (!condition(txMeta)) {
        return txMeta;
      }

      txMeta.status = _transaction.TRANSACTION_STATUSES.FAILED;
      txMeta.err = {
        message: reason,
        note: `Tx automatically failed by migration because ${reason}`
      };
      return txMeta;
    });
  }

  return newState;
}

//# sourceMappingURL=app/scripts/migrations/fail-tx.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/migrations/fail-tx.js",}],
[32, {"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"fast-json-patch":1871,"lodash":2646}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateFromSnapshotsToDiffs = migrateFromSnapshotsToDiffs;
exports.generateHistoryEntry = generateHistoryEntry;
exports.replayHistory = replayHistory;
exports.snapshotFromTxMeta = snapshotFromTxMeta;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fastJsonPatch = _interopRequireDefault(require("fast-json-patch"));

var _lodash = require("lodash");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
  converts non-initial history entries into diffs
  @param {Array} longHistory
  @returns {Array}
*/
function migrateFromSnapshotsToDiffs(longHistory) {
  return longHistory // convert non-initial history entries into diffs
  .map((entry, index) => {
    if (index === 0) {
      return entry;
    }

    return generateHistoryEntry(longHistory[index - 1], entry);
  });
}
/**
  Generates an array of history objects sense the previous state.
  The object has the keys
    op (the operation performed),
    path (the key and if a nested object then each key will be separated with a `/`)
    value
  with the first entry having the note and a timestamp when the change took place
  @param {Object} previousState - the previous state of the object
  @param {Object} newState - the update object
  @param {string} [note] - a optional note for the state change
  @returns {Array}
*/


function generateHistoryEntry(previousState, newState, note) {
  const entry = _fastJsonPatch.default.compare(previousState, newState); // Add a note to the first op, since it breaks if we append it to the entry


  if (entry[0]) {
    if (note) {
      entry[0].note = note;
    }

    entry[0].timestamp = Date.now();
  }

  return entry;
}
/**
  Recovers previous txMeta state obj
  @returns {Object}
*/


function replayHistory(_shortHistory) {
  const shortHistory = (0, _lodash.cloneDeep)(_shortHistory);
  return shortHistory.reduce((val, entry) => _fastJsonPatch.default.applyPatch(val, entry).newDocument);
}
/**
 * Snapshot {@code txMeta}
 * @param {Object} txMeta - the tx metadata object
 * @returns {Object} a deep clone without history
 */


function snapshotFromTxMeta(txMeta) {
  const shallow = _objectSpread({}, txMeta);

  delete shallow.history;
  return (0, _lodash.cloneDeep)(shallow);
}


//# sourceMappingURL=app/scripts/controllers/transactions/lib/tx-state-history-helpers.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/transactions/lib/tx-state-history-helpers.js",}],
[3391, {}, function (require, module, exports) {
module.exports = function toDataView (data) {
  if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
    return new DataView(data.buffer, data.byteOffset, data.byteLength)
  }

  if (data instanceof ArrayBuffer) {
    return new DataView(data)
  }

  throw new TypeError('Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray')
}

//# sourceMappingURL=node_modules/to-data-view/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/to-data-view/index.js",}],
[51, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const abi = [{
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'hash',
    type: 'bytes32'
  }],
  name: 'setContent',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'content',
  outputs: [{
    name: '',
    type: 'bytes32'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'interfaceID',
    type: 'bytes4'
  }],
  name: 'supportsInterface',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'pure',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'key',
    type: 'string'
  }, {
    name: 'value',
    type: 'string'
  }],
  name: 'setText',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'contentTypes',
    type: 'uint256'
  }],
  name: 'ABI',
  outputs: [{
    name: 'contentType',
    type: 'uint256'
  }, {
    name: 'data',
    type: 'bytes'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'x',
    type: 'bytes32'
  }, {
    name: 'y',
    type: 'bytes32'
  }],
  name: 'setPubkey',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'hash',
    type: 'bytes'
  }],
  name: 'setContenthash',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'addr',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'key',
    type: 'string'
  }],
  name: 'text',
  outputs: [{
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'contentType',
    type: 'uint256'
  }, {
    name: 'data',
    type: 'bytes'
  }],
  name: 'setABI',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'name',
  outputs: [{
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'name',
    type: 'string'
  }],
  name: 'setName',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'contenthash',
  outputs: [{
    name: '',
    type: 'bytes'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'pubkey',
  outputs: [{
    name: 'x',
    type: 'bytes32'
  }, {
    name: 'y',
    type: 'bytes32'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'addr',
    type: 'address'
  }],
  name: 'setAddr',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  inputs: [{
    name: 'ensAddr',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'a',
    type: 'address'
  }],
  name: 'AddrChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'name',
    type: 'string'
  }],
  name: 'NameChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'contentType',
    type: 'uint256'
  }],
  name: 'ABIChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'x',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'y',
    type: 'bytes32'
  }],
  name: 'PubkeyChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'indexedKey',
    type: 'string'
  }, {
    indexed: false,
    name: 'key',
    type: 'string'
  }],
  name: 'TextChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'hash',
    type: 'bytes'
  }],
  name: 'ContenthashChanged',
  type: 'event'
}];
var _default = abi;
exports.default = _default;

//# sourceMappingURL=app/scripts/lib/ens-ipfs/contracts/resolver.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/ens-ipfs/contracts/resolver.js",}],
[50, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const abi = [{
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'resolver',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'owner',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'label',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'setSubnodeOwner',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'ttl',
    type: 'uint64'
  }],
  name: 'setTTL',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'ttl',
  outputs: [{
    name: '',
    type: 'uint64'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'resolver',
    type: 'address'
  }],
  name: 'setResolver',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'setOwner',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'owner',
    type: 'address'
  }],
  name: 'Transfer',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'label',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'owner',
    type: 'address'
  }],
  name: 'NewOwner',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'resolver',
    type: 'address'
  }],
  name: 'NewResolver',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'ttl',
    type: 'uint64'
  }],
  name: 'NewTTL',
  type: 'event'
}];
var _default = abi;
exports.default = _default;

//# sourceMappingURL=app/scripts/lib/ens-ipfs/contracts/registry.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/ens-ipfs/contracts/registry.js",}],
[259, {"./helpers":258,"./profiles":260,"multicodec":244,"multihashes":250}, function (require, module, exports) {
/*
	ISC License

	Copyright (c) 2019, Pierre-Louis Despaigne

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted, provided that the above
	copyright notice and this permission notice appear in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
	WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
	MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
	ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
	WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
	ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
	OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

const multiC = require('multicodec');
const multiH = require('multihashes');

const { hexStringToBuffer, profiles } = require('./profiles');
const { cidForWeb, cidV0ToV1Base32 } = require('./helpers');

module.exports = {

	//export some helpers functions
	helpers: {
		cidForWeb,
		cidV0ToV1Base32,
	},

	/**
	* Decode a Content Hash.
	* @param {string} hash an hex string containing a content hash
	* @return {string} the decoded content
	*/
	decode: function (contentHash) {
		const buffer = hexStringToBuffer(contentHash);
		const codec = multiC.getCodec(buffer);
		const value = multiC.rmPrefix(buffer);
		let profile = profiles[codec];
		if (!profile) profile = profiles['default'];
		return profile.decode(value);
	},

	/**
	* Encode an IPFS address into a content hash
	* @param {string} ipfsHash string containing an IPFS address
	* @return {string} the resulting content hash
	*/
	fromIpfs: function (ipfsHash) {
		return this.encode('ipfs-ns', ipfsHash);
	},

	/**
	* Encode a Skylink into a content hash
	* @param {string} skylink string containing a Skylink
	* @return {string} the resulting content hash
	*/
	fromSkylink: function (skylink) {
		return this.encode('skynet-ns', skylink);
	},

	/**
	* Encode a Swarm address into a content hash
	* @param {string} swarmHash string containing a Swarm address
	* @return {string} the resulting content hash
	*/
	fromSwarm: function (swarmHash) {
		return this.encode('swarm-ns', swarmHash);
	},

	/**
	* General purpose encoding function
  * @param {string} codec 
  * @param {string} value 
  */
	encode: function (codec, value) {
		let profile = profiles[codec];
		if (!profile) profile = profiles['default'];
		const encodedValue = profile.encode(value);
		return multiH.toHexString(multiC.addPrefix(codec, encodedValue))
	},

	/**
	* Extract the codec of a content hash
	* @param {string} hash hex string containing a content hash
	* @return {string} the extracted codec
	*/
	getCodec: function (hash) {
		let buffer = hexStringToBuffer(hash);
		return multiC.getCodec(buffer);
	},
}

//# sourceMappingURL=node_modules/@ensdomains/content-hash/src/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/@ensdomains/content-hash/src/index.js",}],
[3594, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METAMETRICS_BACKGROUND_PAGE_OBJECT = exports.METAMETRICS_ANONYMOUS_ID = void 0;
// Type Imports

/**
 * @typedef {import('../../shared/constants/app').EnvironmentType} EnvironmentType
 */
// Type Declarations

/**
 * Used to attach context of where the user was at in the application when the
 * event was triggered. Also included as full details of the current page in
 * page events.
 * @typedef {Object} MetaMetricsPageObject
 * @property {string} [path] - the path of the current page (e.g /home)
 * @property {string} [title] - the title of the current page (e.g 'home')
 * @property {string} [url] - the fully qualified url of the current page
 */

/**
 * For metamask, this is the dapp that triggered an interaction
 * @typedef {Object} MetaMetricsReferrerObject
 * @property {string} [url] - the origin of the dapp issuing the
 *  notification
 */

/**
 * We attach context to every meta metrics event that help to qualify our
 * analytics. This type has all optional values because it represents a
 * returned object from a method call. Ideally app and userAgent are
 * defined on every event. This is confirmed in the getTrackMetaMetricsEvent
 * function, but still provides the consumer a way to override these values if
 * necessary.
 * @typedef {Object} MetaMetricsContext
 * @property {Object} app
 * @property {string} app.name - the name of the application tracking the event
 * @property {string} app.version - the version of the application
 * @property {string} userAgent - the useragent string of the user
 * @property {MetaMetricsPageObject} [page] - an object representing details of
 *  the current page
 * @property {MetaMetricsReferrerObject} [referrer] - for metamask, this is the
 *  dapp that triggered an interaction
 */

/**
 * @typedef {Object} MetaMetricsEventPayload
 * @property {string}  event - event name to track
 * @property {string}  category - category to associate event to
 * @property {string} [environmentType] - The type of environment this event
 *  occurred in. Defaults to the background process type
 * @property {object}  [properties] - object of custom values to track, keys
 *  in this object must be in snake_case
 * @property {object}  [sensitiveProperties] - Object of sensitive values to
 *  track. Keys in this object must be in snake_case. These properties will be
 *  sent in an additional event that excludes the user's metaMetricsId
 * @property {number}  [revenue] - amount of currency that event creates in
 *  revenue for MetaMask
 * @property {string}  [currency] - ISO 4127 format currency for events with
 *  revenue, defaults to US dollars
 * @property {number}  [value] - Abstract business "value" attributable to
 *  customers who trigger this event
 * @property {MetaMetricsPageObject} [page] - the page/route that the event
 *  occurred on
 * @property {MetaMetricsReferrerObject} [referrer] - the origin of the dapp
 *  that triggered the event
 */

/**
 * @typedef {Object} MetaMetricsEventOptions
 * @property {boolean} [isOptIn] - happened during opt in/out workflow
 * @property {boolean} [flushImmediately] - When true will automatically flush
 *  the segment queue after tracking the event. Recommended if the result of
 *  tracking the event must be known before UI transition or update
 * @property {boolean} [excludeMetaMetricsId] - whether to exclude the user's
 *  metametrics id for anonymity
 * @property {string}  [metaMetricsId] - an override for the metaMetricsId in
 *  the event one is created as part of an asynchronous workflow, such as
 *  awaiting the result of the metametrics opt-in function that generates the
 *  user's metametrics id
 * @property {boolean} [matomoEvent] - is this event a holdover from matomo
 *  that needs further migration? when true, sends the data to a special
 *  segment source that marks the event data as not conforming to our schema
 */

/**
 * Represents the shape of data sent to the segment.track method.
 * @typedef {Object} SegmentEventPayload
 * @property {string} [userId] - The metametrics id for the user
 * @property {string} [anonymousId] - An anonymousId that is used to track
 *  sensitive data while preserving anonymity.
 * @property {string} event - name of the event to track
 * @property {Object} properties - properties to attach to the event
 * @property {MetaMetricsContext} context - the context the event occurred in
 */

/**
 * @typedef {Object} MetaMetricsPagePayload
 * @property {string} name - The name of the page that was viewed
 * @property {Object} [params] - The variadic parts of the page url
 *  example (route: `/asset/:asset`, path: `/asset/ETH`)
 *  params: { asset: 'ETH' }
 * @property {EnvironmentType} environmentType - the environment type that the
 *  page was viewed in
 * @property {MetaMetricsPageObject} [page] - the details of the page
 * @property {MetaMetricsReferrerObject} [referrer] - dapp that triggered the page
 *  view
 */

/**
 * @typedef {Object} MetaMetricsPageOptions
 * @property {boolean} [isOptInPath] - is the current path one of the pages in
 *  the onboarding workflow? If true and participateInMetaMetrics is null track
 *  the page view
 */
// An empty string "" is a, currently undocumented, way of telling mixpanel
// that these events are meant to be anonymous and not identified to any user
const METAMETRICS_ANONYMOUS_ID = '""';
/**
 * This object is used to identify events that are triggered by the background
 * process.
 * @type {MetaMetricsPageObject}
 */

exports.METAMETRICS_ANONYMOUS_ID = METAMETRICS_ANONYMOUS_ID;
const METAMETRICS_BACKGROUND_PAGE_OBJECT = {
  path: '/background-process',
  title: 'Background Process',
  url: '/background-process'
};
/**
 * @typedef {Object} SegmentInterface
 * @property {SegmentEventPayload[]} queue - A queue of events to be sent when
 *  the flushAt limit has been reached, or flushInterval occurs
 * @property {() => void} flush - Immediately flush the queue, resetting it to
 *  an empty array and sending the pending events to Segment
 * @property {(
 *  payload: SegmentEventPayload,
 *  callback: (err?: Error) => void
 * ) => void} track - Track an event with Segment, using the internal batching
 *  mechanism to optimize network requests
 * @property {(payload: Object) => void} page - Track a page view with Segment
 * @property {() => void} identify - Identify an anonymous user. We do not
 *  currently use this method.
 */

exports.METAMETRICS_BACKGROUND_PAGE_OBJECT = METAMETRICS_BACKGROUND_PAGE_OBJECT;

//# sourceMappingURL=shared/constants/metametrics.js
}, {file:"/Users/jack/projects/monsta-wallet/shared/constants/metametrics.js",}],
[2272, {}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueId = void 0;
// uint32 (two's complement) max
// more conservative than Number.MAX_SAFE_INTEGER
const MAX = 4294967295;
let idCounter = Math.floor(Math.random() * MAX);
function getUniqueId() {
    idCounter = (idCounter + 1) % MAX;
    return idCounter;
}
exports.getUniqueId = getUniqueId;

//# sourceMappingURL=node_modules/json-rpc-engine/dist/getUniqueId.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/getUniqueId.js",}],
[2270, {}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncMiddleware = void 0;
/**
 * JsonRpcEngine only accepts callback-based middleware directly.
 * createAsyncMiddleware exists to enable consumers to pass in async middleware
 * functions.
 *
 * Async middleware have no "end" function. Instead, they "end" if they return
 * without calling "next". Rather than passing in explicit return handlers,
 * async middleware can simply await "next", and perform operations on the
 * response object when execution resumes.
 *
 * To accomplish this, createAsyncMiddleware passes the async middleware a
 * wrapped "next" function. That function calls the internal JsonRpcEngine
 * "next" function with a return handler that resolves a promise when called.
 *
 * The return handler will always be called. Its resolution of the promise
 * enables the control flow described above.
 */
function createAsyncMiddleware(asyncMiddleware) {
    return async (req, res, next, end) => {
        // nextPromise is the key to the implementation
        // it is resolved by the return handler passed to the
        // "next" function
        let resolveNextPromise;
        const nextPromise = new Promise((resolve) => {
            resolveNextPromise = resolve;
        });
        let returnHandlerCallback = null;
        let nextWasCalled = false;
        // This will be called by the consumer's async middleware.
        const asyncNext = async () => {
            nextWasCalled = true;
            // We pass a return handler to next(). When it is called by the engine,
            // the consumer's async middleware will resume executing.
            // eslint-disable-next-line node/callback-return
            next((runReturnHandlersCallback) => {
                // This callback comes from JsonRpcEngine._runReturnHandlers
                returnHandlerCallback = runReturnHandlersCallback;
                resolveNextPromise();
            });
            await nextPromise;
        };
        try {
            await asyncMiddleware(req, res, asyncNext);
            if (nextWasCalled) {
                await nextPromise; // we must wait until the return handler is called
                returnHandlerCallback(null);
            }
            else {
                end(null);
            }
        }
        catch (error) {
            if (returnHandlerCallback) {
                returnHandlerCallback(error);
            }
            else {
                end(error);
            }
        }
    };
}
exports.createAsyncMiddleware = createAsyncMiddleware;

//# sourceMappingURL=node_modules/json-rpc-engine/dist/createAsyncMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/createAsyncMiddleware.js",}],
[2271, {}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScaffoldMiddleware = void 0;
function createScaffoldMiddleware(handlers) {
    return (req, res, next, end) => {
        const handler = handlers[req.method];
        // if no handler, return
        if (handler === undefined) {
            return next();
        }
        // if handler is fn, call as middleware
        if (typeof handler === 'function') {
            return handler(req, res, next, end);
        }
        // if handler is some other value, use as result
        res.result = handler;
        return end();
    };
}
exports.createScaffoldMiddleware = createScaffoldMiddleware;

//# sourceMappingURL=node_modules/json-rpc-engine/dist/createScaffoldMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/createScaffoldMiddleware.js",}],
[2273, {"./getUniqueId":2272}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdRemapMiddleware = void 0;
const getUniqueId_1 = require("./getUniqueId");
function createIdRemapMiddleware() {
    return (req, res, next, _end) => {
        const originalId = req.id;
        const newId = getUniqueId_1.getUniqueId();
        req.id = newId;
        res.id = newId;
        next((done) => {
            req.id = originalId;
            res.id = originalId;
            done();
        });
    };
}
exports.createIdRemapMiddleware = createIdRemapMiddleware;

//# sourceMappingURL=node_modules/json-rpc-engine/dist/idRemapMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/idRemapMiddleware.js",}],
[2275, {"./JsonRpcEngine":2269}, function (require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeMiddleware = void 0;
const JsonRpcEngine_1 = require("./JsonRpcEngine");
function mergeMiddleware(middlewareStack) {
    const engine = new JsonRpcEngine_1.JsonRpcEngine();
    middlewareStack.forEach((middleware) => engine.push(middleware));
    return engine.asMiddleware();
}
exports.mergeMiddleware = mergeMiddleware;

//# sourceMappingURL=node_modules/json-rpc-engine/dist/mergeMiddleware.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/mergeMiddleware.js",}],
[2269, {"@metamask/safe-event-emitter":984,"eth-rpc-errors":1748}, function (require, module, exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcEngine = void 0;
const safe_event_emitter_1 = __importDefault(require("@metamask/safe-event-emitter"));
const eth_rpc_errors_1 = require("eth-rpc-errors");
/**
 * A JSON-RPC request and response processor.
 * Give it a stack of middleware, pass it requests, and get back responses.
 */
class JsonRpcEngine extends safe_event_emitter_1.default {
    constructor() {
        super();
        this._middleware = [];
    }
    /**
     * Add a middleware function to the engine's middleware stack.
     *
     * @param middleware - The middleware function to add.
     */
    push(middleware) {
        this._middleware.push(middleware);
    }
    handle(req, cb) {
        if (cb && typeof cb !== 'function') {
            throw new Error('"callback" must be a function if provided.');
        }
        if (Array.isArray(req)) {
            if (cb) {
                return this._handleBatch(req, cb);
            }
            return this._handleBatch(req);
        }
        if (cb) {
            return this._handle(req, cb);
        }
        return this._promiseHandle(req);
    }
    /**
     * Returns this engine as a middleware function that can be pushed to other
     * engines.
     *
     * @returns This engine as a middleware function.
     */
    asMiddleware() {
        return async (req, res, next, end) => {
            try {
                const [middlewareError, isComplete, returnHandlers,] = await JsonRpcEngine._runAllMiddleware(req, res, this._middleware);
                if (isComplete) {
                    await JsonRpcEngine._runReturnHandlers(returnHandlers);
                    return end(middlewareError);
                }
                return next(async (handlerCallback) => {
                    try {
                        await JsonRpcEngine._runReturnHandlers(returnHandlers);
                    }
                    catch (error) {
                        return handlerCallback(error);
                    }
                    return handlerCallback();
                });
            }
            catch (error) {
                return end(error);
            }
        };
    }
    async _handleBatch(reqs, cb) {
        // The order here is important
        try {
            // 2. Wait for all requests to finish, or throw on some kind of fatal
            // error
            const responses = await Promise.all(
            // 1. Begin executing each request in the order received
            reqs.map(this._promiseHandle.bind(this)));
            // 3. Return batch response
            if (cb) {
                return cb(null, responses);
            }
            return responses;
        }
        catch (error) {
            if (cb) {
                return cb(error);
            }
            throw error;
        }
    }
    /**
     * A promise-wrapped _handle.
     */
    _promiseHandle(req) {
        return new Promise((resolve) => {
            this._handle(req, (_err, res) => {
                // There will always be a response, and it will always have any error
                // that is caught and propagated.
                resolve(res);
            });
        });
    }
    /**
     * Ensures that the request object is valid, processes it, and passes any
     * error and the response object to the given callback.
     *
     * Does not reject.
     */
    async _handle(callerReq, cb) {
        if (!callerReq ||
            Array.isArray(callerReq) ||
            typeof callerReq !== 'object') {
            const error = new eth_rpc_errors_1.EthereumRpcError(eth_rpc_errors_1.errorCodes.rpc.invalidRequest, `Requests must be plain objects. Received: ${typeof callerReq}`, { request: callerReq });
            return cb(error, { id: undefined, jsonrpc: '2.0', error });
        }
        if (typeof callerReq.method !== 'string') {
            const error = new eth_rpc_errors_1.EthereumRpcError(eth_rpc_errors_1.errorCodes.rpc.invalidRequest, `Must specify a string method. Received: ${typeof callerReq.method}`, { request: callerReq });
            return cb(error, { id: callerReq.id, jsonrpc: '2.0', error });
        }
        const req = Object.assign({}, callerReq);
        const res = {
            id: req.id,
            jsonrpc: req.jsonrpc,
        };
        let error = null;
        try {
            await this._processRequest(req, res);
        }
        catch (_error) {
            // A request handler error, a re-thrown middleware error, or something
            // unexpected.
            error = _error;
        }
        if (error) {
            // Ensure no result is present on an errored response
            delete res.result;
            if (!res.error) {
                res.error = eth_rpc_errors_1.serializeError(error);
            }
        }
        return cb(error, res);
    }
    /**
     * For the given request and response, runs all middleware and their return
     * handlers, if any, and ensures that internal request processing semantics
     * are satisfied.
     */
    async _processRequest(req, res) {
        const [error, isComplete, returnHandlers,] = await JsonRpcEngine._runAllMiddleware(req, res, this._middleware);
        // Throw if "end" was not called, or if the response has neither a result
        // nor an error.
        JsonRpcEngine._checkForCompletion(req, res, isComplete);
        // The return handlers should run even if an error was encountered during
        // middleware processing.
        await JsonRpcEngine._runReturnHandlers(returnHandlers);
        // Now we re-throw the middleware processing error, if any, to catch it
        // further up the call chain.
        if (error) {
            throw error;
        }
    }
    /**
     * Serially executes the given stack of middleware.
     *
     * @returns An array of any error encountered during middleware execution,
     * a boolean indicating whether the request was completed, and an array of
     * middleware-defined return handlers.
     */
    static async _runAllMiddleware(req, res, middlewareStack) {
        const returnHandlers = [];
        let error = null;
        let isComplete = false;
        // Go down stack of middleware, call and collect optional returnHandlers
        for (const middleware of middlewareStack) {
            [error, isComplete] = await JsonRpcEngine._runMiddleware(req, res, middleware, returnHandlers);
            if (isComplete) {
                break;
            }
        }
        return [error, isComplete, returnHandlers.reverse()];
    }
    /**
     * Runs an individual middleware.
     *
     * @returns An array of any error encountered during middleware exection,
     * and a boolean indicating whether the request should end.
     */
    static _runMiddleware(req, res, middleware, returnHandlers) {
        return new Promise((resolve) => {
            const end = (err) => {
                const error = err || res.error;
                if (error) {
                    res.error = eth_rpc_errors_1.serializeError(error);
                }
                // True indicates that the request should end
                resolve([error, true]);
            };
            const next = (returnHandler) => {
                if (res.error) {
                    end(res.error);
                }
                else {
                    if (returnHandler) {
                        if (typeof returnHandler !== 'function') {
                            end(new eth_rpc_errors_1.EthereumRpcError(eth_rpc_errors_1.errorCodes.rpc.internal, `JsonRpcEngine: "next" return handlers must be functions. ` +
                                `Received "${typeof returnHandler}" for request:\n${jsonify(req)}`, { request: req }));
                        }
                        returnHandlers.push(returnHandler);
                    }
                    // False indicates that the request should not end
                    resolve([null, false]);
                }
            };
            try {
                middleware(req, res, next, end);
            }
            catch (error) {
                end(error);
            }
        });
    }
    /**
     * Serially executes array of return handlers. The request and response are
     * assumed to be in their scope.
     */
    static async _runReturnHandlers(handlers) {
        for (const handler of handlers) {
            await new Promise((resolve, reject) => {
                handler((err) => (err ? reject(err) : resolve()));
            });
        }
    }
    /**
     * Throws an error if the response has neither a result nor an error, or if
     * the "isComplete" flag is falsy.
     */
    static _checkForCompletion(req, res, isComplete) {
        if (!('result' in res) && !('error' in res)) {
            throw new eth_rpc_errors_1.EthereumRpcError(eth_rpc_errors_1.errorCodes.rpc.internal, `JsonRpcEngine: Response has no error or result for request:\n${jsonify(req)}`, { request: req });
        }
        if (!isComplete) {
            throw new eth_rpc_errors_1.EthereumRpcError(eth_rpc_errors_1.errorCodes.rpc.internal, `JsonRpcEngine: Nothing ended request:\n${jsonify(req)}`, { request: req });
        }
    }
}
exports.JsonRpcEngine = JsonRpcEngine;
function jsonify(request) {
    return JSON.stringify(request, null, 2);
}

//# sourceMappingURL=node_modules/json-rpc-engine/dist/JsonRpcEngine.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/json-rpc-engine/dist/JsonRpcEngine.js",}],
[5, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SINGLE_CALL_BALANCES_ADDRESS_MONSTA = exports.SINGLE_CALL_BALANCES_ADDRESS_KOVAN = exports.SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN = exports.SINGLE_CALL_BALANCES_ADDRESS_RINKEBY = exports.SINGLE_CALL_BALANCES_ADDRESS = void 0;
const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39';
exports.SINGLE_CALL_BALANCES_ADDRESS = SINGLE_CALL_BALANCES_ADDRESS;
const SINGLE_CALL_BALANCES_ADDRESS_RINKEBY = '0x9f510b19f1ad66f0dcf6e45559fab0d6752c1db7';
exports.SINGLE_CALL_BALANCES_ADDRESS_RINKEBY = SINGLE_CALL_BALANCES_ADDRESS_RINKEBY;
const SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN = '0xb8e671734ce5c8d7dfbbea5574fa4cf39f7a54a4';
exports.SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN = SINGLE_CALL_BALANCES_ADDRESS_ROPSTEN;
const SINGLE_CALL_BALANCES_ADDRESS_KOVAN = '0xb1d3fbb2f83aecd196f474c16ca5d9cffa0d0ffc';
exports.SINGLE_CALL_BALANCES_ADDRESS_KOVAN = SINGLE_CALL_BALANCES_ADDRESS_KOVAN;
const SINGLE_CALL_BALANCES_ADDRESS_MONSTA = '0xC62b963F28c90e5c98FDEBFd4cdce0711D054529';
exports.SINGLE_CALL_BALANCES_ADDRESS_MONSTA = SINGLE_CALL_BALANCES_ADDRESS_MONSTA;

//# sourceMappingURL=app/scripts/constants/contracts.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/constants/contracts.js",}],
[41, {}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cleanErrorStack;

/**
 * Returns error without stack trace for better UI display
 * @param {Error} err - error
 * @returns {Error} Error with clean stack trace.
 */
function cleanErrorStack(err) {
  let {
    name
  } = err;
  name = name === undefined ? 'Error' : String(name);
  let msg = err.message;
  msg = msg === undefined ? '' : String(msg);

  if (name === '') {
    err.stack = err.message;
  } else if (msg === '') {
    err.stack = err.name;
  } else if (!err.stack) {
    err.stack = `${err.name}: ${err.message}`;
  }

  return err;
}

//# sourceMappingURL=app/scripts/lib/cleanErrorStack.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/lib/cleanErrorStack.js",}],
[2756, {"assert":1095,"await-semaphore":1175,"ethjs-query":1854}, function (require, module, exports) {
const EthQuery = require('ethjs-query')
const assert = require('assert')
const Mutex = require('await-semaphore').Mutex
/**
  @param opts {Object}
    @param {Object} opts.provider a ethereum provider
    @param {Function} opts.getPendingTransactions a function that returns an array of txMeta
    whosee status is `submitted`
    @param {Function} opts.getConfirmedTransactions a function that returns an array of txMeta
    whose status is `confirmed`
  @class
*/
class NonceTracker {

  constructor ({ provider, blockTracker, getPendingTransactions, getConfirmedTransactions }) {
    this.provider = provider
    this.blockTracker = blockTracker
    this.ethQuery = new EthQuery(provider)
    this.getPendingTransactions = getPendingTransactions
    this.getConfirmedTransactions = getConfirmedTransactions
    this.lockMap = {}
  }

  /**
    @returns {Promise<Object>} with the key releaseLock (the gloabl mutex)
  */
  async getGlobalLock () {
    const globalMutex = this._lookupMutex('global')
    // await global mutex free
    const releaseLock = await globalMutex.acquire()
    return { releaseLock }
  }

  /**
   * @typedef NonceDetails
   * @property {number} highestLocallyConfirmed - A hex string of the highest nonce on a confirmed transaction.
   * @property {number} nextNetworkNonce - The next nonce suggested by the eth_getTransactionCount method.
   * @property {number} highestSuggested - The maximum between the other two, the number returned.
   */

  /**
  this will return an object with the `nextNonce` `nonceDetails`, and the releaseLock
  Note: releaseLock must be called after adding a signed tx to pending transactions (or discarding).

  @param address {string} the hex string for the address whose nonce we are calculating
  @returns {Promise<NonceDetails>}
  */
  async getNonceLock (address) {
    // await global mutex free
    await this._globalMutexFree()
    // await lock free, then take lock
    const releaseLock = await this._takeMutex(address)
    try {
      // evaluate multiple nextNonce strategies
      const nonceDetails = {}
      const networkNonceResult = await this._getNetworkNextNonce(address)
      const highestLocallyConfirmed = this._getHighestLocallyConfirmed(address)
      const nextNetworkNonce = networkNonceResult.nonce
      const highestSuggested = Math.max(nextNetworkNonce, highestLocallyConfirmed)

      const pendingTxs = this.getPendingTransactions(address)
      const localNonceResult = this._getHighestContinuousFrom(pendingTxs, highestSuggested) || 0

      nonceDetails.params = {
        highestLocallyConfirmed,
        highestSuggested,
        nextNetworkNonce,
      }
      nonceDetails.local = localNonceResult
      nonceDetails.network = networkNonceResult

      const nextNonce = Math.max(networkNonceResult.nonce, localNonceResult.nonce)
      assert(Number.isInteger(nextNonce), `nonce-tracker - nextNonce is not an integer - got: (${typeof nextNonce}) "${nextNonce}"`)

      // return nonce and release cb
      return { nextNonce, nonceDetails, releaseLock }
    } catch (err) {
      // release lock if we encounter an error
      releaseLock()
      throw err
    }
  }

  async _globalMutexFree () {
    const globalMutex = this._lookupMutex('global')
    const releaseLock = await globalMutex.acquire()
    releaseLock()
  }

  async _takeMutex (lockId) {
    const mutex = this._lookupMutex(lockId)
    const releaseLock = await mutex.acquire()
    return releaseLock
  }

  _lookupMutex (lockId) {
    let mutex = this.lockMap[lockId]
    if (!mutex) {
      mutex = new Mutex()
      this.lockMap[lockId] = mutex
    }
    return mutex
  }

  async _getNetworkNextNonce (address) {
    // calculate next nonce
    // we need to make sure our base count
    // and pending count are from the same block
    const blockNumber = await this.blockTracker.getLatestBlock()
    const baseCountBN = await this.ethQuery.getTransactionCount(address, blockNumber)
    const baseCount = baseCountBN.toNumber()
    assert(Number.isInteger(baseCount), `nonce-tracker - baseCount is not an integer - got: (${typeof baseCount}) "${baseCount}"`)
    const nonceDetails = { blockNumber, baseCount }
    return { name: 'network', nonce: baseCount, details: nonceDetails }
  }

  _getHighestLocallyConfirmed (address) {
    const confirmedTransactions = this.getConfirmedTransactions(address)
    const highest = this._getHighestNonce(confirmedTransactions)
    return Number.isInteger(highest) ? highest + 1 : 0
  }

  _getHighestNonce (txList) {
    const nonces = txList.map((txMeta) => {
      const nonce = txMeta.txParams.nonce
      assert(typeof nonce, 'string', 'nonces should be hex strings')
      return parseInt(nonce, 16)
    })
    const highestNonce = Math.max.apply(null, nonces)
    return highestNonce
  }

  /**
    @typedef {object} highestContinuousFrom
    @property {string} - name the name for how the nonce was calculated based on the data used
    @property {number} - nonce the next suggested nonce
    @property {object} - details the provided starting nonce that was used (for debugging)
  */
  /**
    @param txList {array} - list of txMeta's
    @param startPoint {number} - the highest known locally confirmed nonce
    @returns {highestContinuousFrom}
  */
  _getHighestContinuousFrom (txList, startPoint) {
    const nonces = txList.map((txMeta) => {
      const nonce = txMeta.txParams.nonce
      assert(typeof nonce, 'string', 'nonces should be hex strings')
      return parseInt(nonce, 16)
    })

    let highest = startPoint
    while (nonces.includes(highest)) {
      highest++
    }

    return { name: 'local', nonce: highest, details: { startPoint, highest } }
  }

}

module.exports = NonceTracker

//# sourceMappingURL=node_modules/nonce-tracker/index.js
}, {file:"/Users/jack/projects/monsta-wallet/node_modules/nonce-tracker/index.js",}],
[33, {"../../../../../shared/constants/transaction":3599,"../../../../../shared/modules/hexstring-utils":3604,"../../../../../shared/modules/transaction.utils":3609,"../../../lib/util":78,"eth-rpc-errors":1748}, function (require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeAndValidateTxParams = normalizeAndValidateTxParams;
exports.normalizeTxParams = normalizeTxParams;
exports.validateTxParams = validateTxParams;
exports.validateFrom = validateFrom;
exports.validateRecipient = validateRecipient;
exports.getFinalStates = getFinalStates;

var _ethRpcErrors = require("eth-rpc-errors");

var _util = require("../../../lib/util");

var _transaction = require("../../../../../shared/constants/transaction");

var _transaction2 = require("../../../../../shared/modules/transaction.utils");

var _hexstringUtils = require("../../../../../shared/modules/hexstring-utils");

const normalizers = {
  from: _util.addHexPrefix,
  to: (to, lowerCase) => lowerCase ? (0, _util.addHexPrefix)(to).toLowerCase() : (0, _util.addHexPrefix)(to),
  nonce: _util.addHexPrefix,
  value: _util.addHexPrefix,
  data: _util.addHexPrefix,
  gas: _util.addHexPrefix,
  gasPrice: _util.addHexPrefix,
  maxFeePerGas: _util.addHexPrefix,
  maxPriorityFeePerGas: _util.addHexPrefix,
  type: _util.addHexPrefix
};

function normalizeAndValidateTxParams(txParams, lowerCase = true) {
  const normalizedTxParams = normalizeTxParams(txParams, lowerCase);
  validateTxParams(normalizedTxParams);
  return normalizedTxParams;
}
/**
 * Normalizes the given txParams
 * @param {Object} txParams - The transaction params
 * @param {boolean} [lowerCase] - Whether to lowercase the 'to' address.
 * Default: true
 * @returns {Object} the normalized tx params
 */


function normalizeTxParams(txParams, lowerCase = true) {
  // apply only keys in the normalizers
  const normalizedTxParams = {};

  for (const key in normalizers) {
    if (txParams[key]) {
      normalizedTxParams[key] = normalizers[key](txParams[key], lowerCase);
    }
  }

  return normalizedTxParams;
}
/**
 * Given two fields, ensure that the second field is not included in txParams,
 * and if it is throw an invalidParams error.
 * @param {Object} txParams - the transaction parameters object
 * @param {string} fieldBeingValidated - the current field being validated
 * @param {string} mutuallyExclusiveField - the field to ensure is not provided
 * @throws {ethErrors.rpc.invalidParams} - throws if mutuallyExclusiveField is
 *  present in txParams.
 */


function ensureMutuallyExclusiveFieldsNotProvided(txParams, fieldBeingValidated, mutuallyExclusiveField) {
  if (typeof txParams[mutuallyExclusiveField] !== 'undefined') {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction params: specified ${fieldBeingValidated} but also included ${mutuallyExclusiveField}, these cannot be mixed`);
  }
}
/**
 * Ensures that the provided value for field is a string, throws an
 * invalidParams error if field is not a string.
 * @param {Object} txParams - the transaction parameters object
 * @param {string} field - the current field being validated
 * @throws {ethErrors.rpc.invalidParams} - throws if field is not a string
 */


function ensureFieldIsString(txParams, field) {
  if (typeof txParams[field] !== 'string') {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction params: ${field} is not a string. got: (${txParams[field]})`);
  }
}
/**
 * Ensures that the provided txParams has the proper 'type' specified for the
 * given field, if it is provided. If types do not match throws an
 * invalidParams error.
 * @param {Object} txParams - the transaction parameters object
 * @param {'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'} field - the
 *  current field being validated
 * @throws {ethErrors.rpc.invalidParams} - throws if type does not match the
 *  expectations for provided field.
 */


function ensureProperTransactionEnvelopeTypeProvided(txParams, field) {
  switch (field) {
    case 'maxFeePerGas':
    case 'maxPriorityFeePerGas':
      if (txParams.type && txParams.type !== _transaction.TRANSACTION_ENVELOPE_TYPES.FEE_MARKET) {
        throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction envelope type: specified type "${txParams.type}" but including maxFeePerGas and maxPriorityFeePerGas requires type: "${_transaction.TRANSACTION_ENVELOPE_TYPES.FEE_MARKET}"`);
      }

      break;

    case 'gasPrice':
    default:
      if (txParams.type && txParams.type === _transaction.TRANSACTION_ENVELOPE_TYPES.FEE_MARKET) {
        throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction envelope type: specified type "${txParams.type}" but included a gasPrice instead of maxFeePerGas and maxPriorityFeePerGas`);
      }

  }
}
/**
 * Validates the given tx parameters
 * @param {Object} txParams - the tx params
 * @param {boolean} eip1559Compatibility - whether or not the current network supports EIP-1559 transactions
 * @throws {Error} if the tx params contains invalid fields
 */


function validateTxParams(txParams, eip1559Compatibility = true) {
  if (!txParams || typeof txParams !== 'object' || Array.isArray(txParams)) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid transaction params: must be an object.');
  }

  if (!txParams.to && !txParams.data) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid transaction params: must specify "data" for contract deployments, or "to" (and optionally "data") for all other types of transactions.');
  }

  if ((0, _transaction2.isEIP1559Transaction)({
    txParams
  }) && !eip1559Compatibility) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid transaction params: params specify an EIP-1559 transaction but the current network does not support EIP-1559');
  }

  Object.entries(txParams).forEach(([key, value]) => {
    // validate types
    switch (key) {
      case 'from':
        validateFrom(txParams);
        break;

      case 'to':
        validateRecipient(txParams);
        break;

      case 'gasPrice':
        ensureProperTransactionEnvelopeTypeProvided(txParams, 'gasPrice');
        ensureMutuallyExclusiveFieldsNotProvided(txParams, 'gasPrice', 'maxFeePerGas');
        ensureMutuallyExclusiveFieldsNotProvided(txParams, 'gasPrice', 'maxPriorityFeePerGas');
        ensureFieldIsString(txParams, 'gasPrice');
        break;

      case 'maxFeePerGas':
        ensureProperTransactionEnvelopeTypeProvided(txParams, 'maxFeePerGas');
        ensureMutuallyExclusiveFieldsNotProvided(txParams, 'maxFeePerGas', 'gasPrice');
        ensureFieldIsString(txParams, 'maxFeePerGas');
        break;

      case 'maxPriorityFeePerGas':
        ensureProperTransactionEnvelopeTypeProvided(txParams, 'maxPriorityFeePerGas');
        ensureMutuallyExclusiveFieldsNotProvided(txParams, 'maxPriorityFeePerGas', 'gasPrice');
        ensureFieldIsString(txParams, 'maxPriorityFeePerGas');
        break;

      case 'value':
        ensureFieldIsString(txParams, 'value');

        if (value.toString().includes('-')) {
          throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction value "${value}": not a positive number.`);
        }

        if (value.toString().includes('.')) {
          throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction value of "${value}": number must be in wei.`);
        }

        break;

      case 'chainId':
        if (typeof value !== 'number' && typeof value !== 'string') {
          throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid transaction params: ${key} is not a Number or hex string. got: (${value})`);
        }

        break;

      default:
        ensureFieldIsString(txParams, key);
    }
  });
}
/**
 * Validates the {@code from} field in the given tx params
 * @param {Object} txParams
 * @throws {Error} if the from address isn't valid
 */


function validateFrom(txParams) {
  if (!(typeof txParams.from === 'string')) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams(`Invalid "from" address "${txParams.from}": not a string.`);
  }

  if (!(0, _hexstringUtils.isValidHexAddress)(txParams.from, {
    allowNonPrefixed: false
  })) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid "from" address.');
  }
}
/**
 * Validates the {@code to} field in the given tx params
 * @param {Object} txParams - the tx params
 * @returns {Object} the tx params
 * @throws {Error} if the recipient is invalid OR there isn't tx data
 */


function validateRecipient(txParams) {
  if (txParams.to === '0x' || txParams.to === null) {
    if (txParams.data) {
      delete txParams.to;
    } else {
      throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid "to" address.');
    }
  } else if (txParams.to !== undefined && !(0, _hexstringUtils.isValidHexAddress)(txParams.to, {
    allowNonPrefixed: false
  })) {
    throw _ethRpcErrors.ethErrors.rpc.invalidParams('Invalid "to" address.');
  }

  return txParams;
}
/**
 * Returns a list of final states
 * @returns {string[]} the states that can be considered final states
 */


function getFinalStates() {
  return [_transaction.TRANSACTION_STATUSES.REJECTED, // the user has responded no!
  _transaction.TRANSACTION_STATUSES.CONFIRMED, // the tx has been included in a block.
  _transaction.TRANSACTION_STATUSES.FAILED, // the tx failed for some reason, included on tx data.
  _transaction.TRANSACTION_STATUSES.DROPPED // the tx nonce was already used
  ];
}

//# sourceMappingURL=app/scripts/controllers/transactions/lib/util.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/transactions/lib/util.js",}],
[34, {"../../../../shared/constants/transaction":3599,"@babel/runtime/helpers/defineProperty":180,"@babel/runtime/helpers/interopRequireDefault":186,"ethjs-query":1854,"loglevel":2657,"safe-event-emitter":3238}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safeEventEmitter = _interopRequireDefault(require("safe-event-emitter"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _ethjsQuery = _interopRequireDefault(require("ethjs-query"));

var _transaction = require("../../../../shared/constants/transaction");

/**

  Event emitter utility class for tracking the transactions as they<br>
  go from a pending state to a confirmed (mined in a block) state<br>
<br>
  As well as continues broadcast while in the pending state
<br>
@param {Object} config - non optional configuration object consists of:
    @param {Object} config.provider - A network provider.
    @param {Object} config.nonceTracker - see nonce tracker
    @param {Function} config.getPendingTransactions - a function for getting an array of transactions,
    @param {Function} config.publishTransaction - a async function for publishing raw transactions,

@class
*/
class PendingTransactionTracker extends _safeEventEmitter.default {
  /**
   * We wait this many blocks before emitting a 'tx:dropped' event
   *
   * This is because we could be talking to a node that is out of sync.
   *
   * @type {number}
   */

  /**
   * A map of transaction hashes to the number of blocks we've seen
   * since first considering it dropped
   *
   * @type {Map<String, number>}
   */
  constructor(config) {
    super();
    (0, _defineProperty2.default)(this, "DROPPED_BUFFER_COUNT", 3);
    (0, _defineProperty2.default)(this, "droppedBlocksBufferByHash", new Map());
    this.query = config.query || new _ethjsQuery.default(config.provider);
    this.nonceTracker = config.nonceTracker;
    this.getPendingTransactions = config.getPendingTransactions;
    this.getCompletedTransactions = config.getCompletedTransactions;
    this.publishTransaction = config.publishTransaction;
    this.approveTransaction = config.approveTransaction;
    this.confirmTransaction = config.confirmTransaction;
  }
  /**
    checks the network for signed txs and releases the nonce global lock if it is
  */


  async updatePendingTxs() {
    // in order to keep the nonceTracker accurate we block it while updating pending transactions
    const nonceGlobalLock = await this.nonceTracker.getGlobalLock();

    try {
      const pendingTxs = this.getPendingTransactions();
      await Promise.all(pendingTxs.map(txMeta => this._checkPendingTx(txMeta)));
    } catch (err) {
      _loglevel.default.error('PendingTransactionTracker - Error updating pending transactions');

      _loglevel.default.error(err);
    }

    nonceGlobalLock.releaseLock();
  }
  /**
   * Resubmits each pending transaction
   * @param {string} blockNumber - the latest block number in hex
   * @emits tx:warning
   * @returns {Promise<void>}
   */


  async resubmitPendingTxs(blockNumber) {
    const pending = this.getPendingTransactions();

    if (!pending.length) {
      return;
    }

    for (const txMeta of pending) {
      try {
        await this._resubmitTx(txMeta, blockNumber);
      } catch (err) {
        var _err$value, _err$value$message;

        const errorMessage = ((_err$value = err.value) === null || _err$value === void 0 ? void 0 : (_err$value$message = _err$value.message) === null || _err$value$message === void 0 ? void 0 : _err$value$message.toLowerCase()) || err.message.toLowerCase();
        const isKnownTx = // geth
        errorMessage.includes('replacement transaction underpriced') || errorMessage.includes('known transaction') || // parity
        errorMessage.includes('gas price too low to replace') || errorMessage.includes('transaction with the same hash was already imported') || // other
        errorMessage.includes('gateway timeout') || errorMessage.includes('nonce too low'); // ignore resubmit warnings, return early

        if (isKnownTx) {
          return;
        } // encountered real error - transition to error state


        txMeta.warning = {
          error: errorMessage,
          message: 'There was an error when resubmitting this transaction.'
        };
        this.emit('tx:warning', txMeta, err);
      }
    }
  }
  /**
   * Attempts to resubmit the given transaction with exponential backoff
   *
   * Will only attempt to retry the given tx every {@code 2**(txMeta.retryCount)} blocks.
   *
   * @param {Object} txMeta - the transaction metadata
   * @param {string} latestBlockNumber - the latest block number in hex
   * @returns {Promise<string|undefined>} the tx hash if retried
   * @emits tx:block-update
   * @emits tx:retry
   * @private
   */


  async _resubmitTx(txMeta, latestBlockNumber) {
    if (!txMeta.firstRetryBlockNumber) {
      this.emit('tx:block-update', txMeta, latestBlockNumber);
    }

    const firstRetryBlockNumber = txMeta.firstRetryBlockNumber || latestBlockNumber;
    const txBlockDistance = Number.parseInt(latestBlockNumber, 16) - Number.parseInt(firstRetryBlockNumber, 16);
    const retryCount = txMeta.retryCount || 0; // Exponential backoff to limit retries at publishing (capped at ~15 minutes between retries)

    if (txBlockDistance < Math.min(50, Math.pow(2, retryCount))) {
      return undefined;
    } // Only auto-submit already-signed txs:


    if (!('rawTx' in txMeta)) {
      return this.approveTransaction(txMeta.id);
    }

    const {
      rawTx
    } = txMeta;
    const txHash = await this.publishTransaction(rawTx); // Increment successful tries:

    this.emit('tx:retry', txMeta);
    return txHash;
  }
  /**
   * Query the network to see if the given {@code txMeta} has been included in a block
   * @param {Object} txMeta - the transaction metadata
   * @returns {Promise<void>}
   * @emits tx:confirmed
   * @emits tx:dropped
   * @emits tx:failed
   * @emits tx:warning
   * @private
   */


  async _checkPendingTx(txMeta) {
    const txHash = txMeta.hash;
    const txId = txMeta.id; // Only check submitted txs

    if (txMeta.status !== _transaction.TRANSACTION_STATUSES.SUBMITTED) {
      return;
    } // extra check in case there was an uncaught error during the
    // signature and submission process


    if (!txHash) {
      const noTxHashErr = new Error('We had an error while submitting this transaction, please try again.');
      noTxHashErr.name = 'NoTxHashError';
      this.emit('tx:failed', txId, noTxHashErr);
      return;
    }

    if (await this._checkIfNonceIsTaken(txMeta)) {
      this.emit('tx:dropped', txId);
      return;
    }

    try {
      const transactionReceipt = await this.query.getTransactionReceipt(txHash);

      if (transactionReceipt !== null && transactionReceipt !== void 0 && transactionReceipt.blockNumber) {
        const {
          baseFeePerGas
        } = await this.query.getBlockByHash(transactionReceipt === null || transactionReceipt === void 0 ? void 0 : transactionReceipt.blockHash, false);
        this.emit('tx:confirmed', txId, transactionReceipt, baseFeePerGas);
        return;
      }
    } catch (err) {
      txMeta.warning = {
        error: err.message,
        message: 'There was a problem loading this transaction.'
      };
      this.emit('tx:warning', txMeta, err);
      return;
    }

    if (await this._checkIfTxWasDropped(txMeta)) {
      this.emit('tx:dropped', txId);
    }
  }
  /**
   * Checks whether the nonce in the given {@code txMeta} is behind the network nonce
   *
   * @param {Object} txMeta - the transaction metadata
   * @returns {Promise<boolean>}
   * @private
   */


  async _checkIfTxWasDropped(txMeta) {
    const {
      hash: txHash,
      txParams: {
        nonce,
        from
      }
    } = txMeta;
    const networkNextNonce = await this.query.getTransactionCount(from);

    if (parseInt(nonce, 16) >= networkNextNonce.toNumber()) {
      return false;
    }

    if (!this.droppedBlocksBufferByHash.has(txHash)) {
      this.droppedBlocksBufferByHash.set(txHash, 0);
    }

    const currentBlockBuffer = this.droppedBlocksBufferByHash.get(txHash);

    if (currentBlockBuffer < this.DROPPED_BUFFER_COUNT) {
      this.droppedBlocksBufferByHash.set(txHash, currentBlockBuffer + 1);
      return false;
    }

    this.droppedBlocksBufferByHash.delete(txHash);
    return true;
  }
  /**
   * Checks whether the nonce in the given {@code txMeta} is correct against the local set of transactions
   * @param {Object} txMeta - the transaction metadata
   * @returns {Promise<boolean>}
   * @private
   */


  async _checkIfNonceIsTaken(txMeta) {
    const address = txMeta.txParams.from;
    const completed = this.getCompletedTransactions(address);
    return completed.some( // This is called while the transaction is in-flight, so it is possible that the
    // list of completed transactions now includes the transaction we were looking at
    // and if that is the case, don't consider the transaction to have taken its own nonce
    other => !(other.id === txMeta.id) && other.txParams.nonce === txMeta.txParams.nonce);
  }

}

exports.default = PendingTransactionTracker;

//# sourceMappingURL=app/scripts/controllers/transactions/pending-tx-tracker.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/transactions/pending-tx-tracker.js",}],
[35, {"../../lib/util":78,"@babel/runtime/helpers/interopRequireDefault":186,"ethereumjs-util":1810,"ethjs-query":1854,"lodash":2646,"loglevel":2657}, function (require, module, exports) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethjsQuery = _interopRequireDefault(require("ethjs-query"));

var _loglevel = _interopRequireDefault(require("loglevel"));

var _ethereumjsUtil = require("ethereumjs-util");

var _lodash = require("lodash");

var _util = require("../../lib/util");

/**
 * Result of gas analysis, including either a gas estimate for a successful analysis, or
 * debug information for a failed analysis.
 * @typedef {Object} GasAnalysisResult
 * @property {string} blockGasLimit - The gas limit of the block used for the analysis
 * @property {string} estimatedGasHex - The estimated gas, in hexadecimal
 * @property {Object} simulationFails - Debug information about why an analysis failed
 */

/**
tx-gas-utils are gas utility methods for Transaction manager
its passed ethquery
and used to do things like calculate gas of a tx.
@param {Object} provider - A network provider.
*/
class TxGasUtil {
  constructor(provider) {
    this.query = new _ethjsQuery.default(provider);
  }
  /**
    @param {Object} txMeta - the txMeta object
    @returns {GasAnalysisResult} The result of the gas analysis
  */


  async analyzeGasUsage(txMeta) {
    const block = await this.query.getBlockByNumber('latest', false); // fallback to block gasLimit

    const blockGasLimitBN = (0, _util.hexToBn)(block.gasLimit);
    const saferGasLimitBN = (0, _util.BnMultiplyByFraction)(blockGasLimitBN, 19, 20);
    let estimatedGasHex = (0, _util.bnToHex)(saferGasLimitBN);
    let simulationFails;

    try {
      estimatedGasHex = await this.estimateTxGas(txMeta);
    } catch (error) {
      _loglevel.default.warn(error);

      simulationFails = {
        reason: error.message,
        errorKey: error.errorKey,
        debug: {
          blockNumber: block.number,
          blockGasLimit: block.gasLimit
        }
      };
    }

    return {
      blockGasLimit: block.gasLimit,
      estimatedGasHex,
      simulationFails
    };
  }
  /**
    Estimates the tx's gas usage
    @param {Object} txMeta - the txMeta object
    @returns {string} the estimated gas limit as a hex string
  */


  async estimateTxGas(txMeta) {
    const txParams = (0, _lodash.cloneDeep)(txMeta.txParams); // `eth_estimateGas` can fail if the user has insufficient balance for the
    // value being sent, or for the gas cost. We don't want to check their
    // balance here, we just want the gas estimate. The gas price is removed
    // to skip those balance checks. We check balance elsewhere. We also delete
    // maxFeePerGas and maxPriorityFeePerGas to support EIP-1559 txs.

    delete txParams.gasPrice;
    delete txParams.maxFeePerGas;
    delete txParams.maxPriorityFeePerGas; // estimate tx gas requirements

    return await this.query.estimateGas(txParams);
  }
  /**
    Adds a gas buffer with out exceeding the block gas limit
     @param {string} initialGasLimitHex - the initial gas limit to add the buffer too
    @param {string} blockGasLimitHex - the block gas limit
    @returns {string} the buffered gas limit as a hex string
  */


  addGasBuffer(initialGasLimitHex, blockGasLimitHex, multiplier = 1.5) {
    const initialGasLimitBn = (0, _util.hexToBn)(initialGasLimitHex);
    const blockGasLimitBn = (0, _util.hexToBn)(blockGasLimitHex);
    const upperGasLimitBn = blockGasLimitBn.muln(0.9);
    const bufferedGasLimitBn = initialGasLimitBn.muln(multiplier); // if initialGasLimit is above blockGasLimit, dont modify it

    if (initialGasLimitBn.gt(upperGasLimitBn)) {
      return (0, _util.bnToHex)(initialGasLimitBn);
    } // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit


    if (bufferedGasLimitBn.lt(upperGasLimitBn)) {
      return (0, _util.bnToHex)(bufferedGasLimitBn);
    } // otherwise use blockGasLimit


    return (0, _util.bnToHex)(upperGasLimitBn);
  }

  async getBufferedGasLimit(txMeta, multiplier) {
    const {
      blockGasLimit,
      estimatedGasHex,
      simulationFails
    } = await this.analyzeGasUsage(txMeta); // add additional gas buffer to our estimation for safety

    const gasLimit = this.addGasBuffer((0, _ethereumjsUtil.addHexPrefix)(estimatedGasHex), blockGasLimit, multiplier);
    return {
      gasLimit,
      simulationFails
    };
  }

}

exports.default = TxGasUtil;

//# sourceMappingURL=app/scripts/controllers/transactions/tx-gas-utils.js
}, {file:"/Users/jack/projects/monsta-wallet/app/scripts/controllers/transactions/tx-gas-utils.js",}]],[],{})

