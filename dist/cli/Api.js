'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; /**
                    * Created by superpchelka on 24.02.18.
                    */

var _StudentApi = require('./StudentApi');

var _StudentApi2 = _interopRequireDefault(_StudentApi);

var _TeacherApi = require('./TeacherApi');

var _TeacherApi2 = _interopRequireDefault(_TeacherApi);

var _Api = require('../api/Api');

var _ProgramsGenerator = require('./ProgramsGenerator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = (_temp = _class = function () {
    function Api() {
        _classCallCheck(this, Api);
    }

    _createClass(Api, null, [{
        key: 'getPrograms',
        value: function getPrograms(nodeUrl, login, password, privateKey, onResult) {
            return _Api.Api.init(nodeUrl, login, privateKey).then(function (api) {
                if (!privateKey) {
                    privateKey = _Api.Api.generateKeys(login, password).privKeys.active;
                    api.account.privateKey = privateKey;
                }

                return [].concat(_toConsumableArray((0, _ProgramsGenerator.generatePrograms)(Api.programs, api, onResult)), _toConsumableArray((0, _ProgramsGenerator.generatePrograms)(_StudentApi2.default.programs, api.studentApi, onResult)), _toConsumableArray((0, _ProgramsGenerator.generatePrograms)(_TeacherApi2.default.programs, api.teacherApi, onResult)));
            });
        }
    }]);

    return Api;
}(), _class.programs = [{
    command: {
        name: 'setPrivateKey',
        description: 'set private key of current user'
    },
    options: [{
        key: 'privateKey',
        name: '-p, --privateKey <privateKey>',
        description: 'private key',
        required: true
    }],
    exec: 'setPrivateKey'
}, {
    command: {
        name: 'register',
        description: 'register user by login, password'
    },
    options: [{
        key: 'login',
        name: '-l, --login <login>',
        description: 'name of the new bitshares account',
        required: true
    }, {
        key: 'password',
        name: '-p, --password <password>',
        description: 'password for generating bitshares keys',
        required: true
    }],
    exec: 'register'
}], _temp);
exports.default = Api;