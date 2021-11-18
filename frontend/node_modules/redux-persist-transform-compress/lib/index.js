"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createTransformCompress;

var _reduxPersist = require("redux-persist");

var _lzString = require("lz-string");

var _lzString2 = _interopRequireDefault(_lzString);

var _jsonStringifySafe = require("json-stringify-safe");

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NODE_ENV = typeof process !== "undefined" ? process.env.NODE_ENV : "production";

function createTransformCompress(config) {
    return (0, _reduxPersist.createTransform)(function (state) {
        return _lzString2.default.compressToUTF16((0, _jsonStringifySafe2.default)(state));
    }, function (state) {
        if (typeof state !== "string") {
            if (NODE_ENV !== "production") {
                console.error("redux-persist-transform-compress: expected outbound state to be a string");
            }
            return state;
        }

        try {
            return JSON.parse(_lzString2.default.decompressFromUTF16(state));
        } catch (err) {
            if (NODE_ENV !== "production") {
                console.error("redux-persist-transform-compress: error while decompressing state", err);
            }
            return null;
        }
    }, config);
}