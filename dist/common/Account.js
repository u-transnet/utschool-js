"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Account = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by superpchelka on 23.02.18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _bitsharesjs = require("bitsharesjs");

var _bs = require("bs58");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Account = function () {
    function Account(account, privateKeyWif) {
        _classCallCheck(this, Account);

        this.name = account;
        this.setPrivateKey(privateKeyWif);
    }

    _createClass(Account, [{
        key: "setPrivateKey",
        value: function setPrivateKey(privateKeyWif) {
            this.privateKey = privateKeyWif ? _bitsharesjs.PrivateKey.fromWif(privateKeyWif) : null;
        }
    }]);

    return Account;
}();

exports.Account = Account;