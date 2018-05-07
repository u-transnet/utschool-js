"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Api = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by superpchelka on 23.02.18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Account = require("../common/Account");

var _StudentApi = require("./StudentApi");

var _TeacherApi = require("./TeacherApi");

var _BlockchainApi = require("./BlockchainApi");

var _bitsharesjs = require("bitsharesjs");

var _Configs = require("../common/Configs");

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = function () {
    _createClass(Api, null, [{
        key: "init",


        /**
         * @desc initialize api for interacting with blockchain
         * @param nodeUrl - url of node for connection
         * @param accountName - name of bitshares account
         * @param [privateKey] - private of bitshares account (optional)
         * @return api object
         */
        value: function init(nodeUrl, accountName, privateKey) {
            var api = new Api(accountName, privateKey);
            return new Promise(function (resolved, rejected) {
                _BlockchainApi.BlockchainApi.init(nodeUrl).then(function () {
                    return resolved(api);
                }).catch(rejected);
            });
        }

        /**
         * @desc generate public keys and private keys by login and password
         * @param login - login of the bitshares account
         * @param password - password of the bitshares account
         * @return Object{
         *      pubKeys: {active, owner, memo},
         *      privKeys: {active, owner, memo}
         * }
         */

    }, {
        key: "generateKeys",
        value: function generateKeys(login, password) {
            return _bitsharesjs.Login.generateKeys(login, password);
        }
    }]);

    function Api(accountName, privateKey) {
        _classCallCheck(this, Api);

        this.account = new _Account.Account(accountName, privateKey);
        this.studentApi = new _StudentApi.StudentApi(this.account);
        this.teacherApi = new _TeacherApi.TeacherApi(this.account);
    }

    /**
     * @desc set private key of current user
     * @param privateKey - private key
     */


    _createClass(Api, [{
        key: "setPrivateKey",
        value: function setPrivateKey(privateKey) {
            this.account.setPrivateKey(privateKey);
        }

        /**
         * @desc register user by login, password
         * @param login - name of the new bitshares account
         * @param password - password for generating bitshares keys
         * @return information about created account
         */

    }, {
        key: "register",
        value: function register(login, password) {
            return new Promise(function (resolve, reject) {
                var keys = Api.generateKeys(login, password);

                (0, _requestPromise2.default)({
                    method: "POST",
                    url: _Configs.utSchoolFaucetAddress,
                    body: {
                        account: {
                            active_key: keys.pubKeys.active,
                            memo_key: keys.pubKeys.memo,
                            owner_key: keys.pubKeys.owner,
                            name: login,
                            referrer: _Configs.utSchoolFaucet
                        }
                    },
                    json: true
                }).then(function (resp) {
                    resolve(resp);
                }).catch(function (err) {
                    reject("Faucet " + _Configs.utSchoolFaucetAddress + " failed. " + err);
                });
            });
        }
    }]);

    return Api;
}();

exports.Api = Api;