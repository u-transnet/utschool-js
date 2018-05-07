'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by superpchelka on 24.02.18.
 */

var StudentApi = (_temp = _class = function StudentApi() {
    _classCallCheck(this, StudentApi);
}, _class.programs = [{
    command: {
        name: 'studentApi.applyForLecture',
        description: 'apply current user for the lecture'
    },
    options: [{
        key: 'lectureAccount',
        name: '-l, --lectureAccount <lectureAccount>',
        description: 'name of the bitshares lecture account',
        required: true
    }],
    exec: 'applyForLecture'
}, {
    command: {
        name: 'studentApi.getLectureStats',
        description: 'collect information about lecture'
    },
    options: [{
        key: 'lectureAccount',
        name: '-l, --lectureAccount <lectureAccount>',
        description: 'name of the bitshares lecture account',
        required: true
    }],
    exec: 'getLectureStats'
}, {
    command: {
        name: 'studentApi.getLectures',
        description: 'return all available lectures for current user'
    },
    options: [],
    exec: 'getLectures'
}], _temp);
exports.default = StudentApi;