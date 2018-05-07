"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account = undefined;

var _bitsharesjs = require("bitsharesjs");

var _bs = require("bs58");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by superpchelka on 23.02.18.
                                                                                                                                                           */

var Account = function Account(account, privateKeyWif) {
    _classCallCheck(this, Account);

    this.name = account;
    this.privateKey = privateKeyWif ? _bitsharesjs.PrivateKey.fromWif(privateKeyWif) : null;
};

exports.Account = Account;