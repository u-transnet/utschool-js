'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StudentApi = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by superpchelka on 23.02.18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _bitsharesjs = require('bitsharesjs');

var _BitsharesApiExtends = require('./BitsharesApiExtends');

var _Configs = require('../common/Configs');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StudentApi = function () {
    function StudentApi(account) {
        _classCallCheck(this, StudentApi);

        this.account = account;
        this.feeAsset = 'BTS';
    }

    /**
     * @desc apply current user for the lecture
     * @param lectureAccount - name of the bitshares lecture account
     * @return serialized transaction
     */


    _createClass(StudentApi, [{
        key: 'applyForLecture',
        value: function applyForLecture(lectureAccount) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                (0, _assert2.default)(_this.account.privateKey !== null, 'You must provide private key for executing this method');

                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", lectureAccount), (0, _bitsharesjs.FetchChain)("getAccount", _this.account.name), (0, _bitsharesjs.FetchChain)("getAsset", _Configs.utSchoolTokenTicket), (0, _bitsharesjs.FetchChain)("getAsset", _this.feeAsset)]).then(function (res) {
                    var _res = _slicedToArray(res, 4),
                        cLectureAccount = _res[0],
                        cStudentAccount = _res[1],
                        sendAsset = _res[2],
                        feeAsset = _res[3];

                    (0, _assert2.default)(cLectureAccount !== null, 'Invalid lecture account ' + lectureAccount);
                    (0, _assert2.default)(cStudentAccount !== null, 'Invalid student account ' + _this.account.name);
                    (0, _assert2.default)(sendAsset !== null, 'Invalid ticket token ' + _Configs.utSchoolTokenTicket);
                    (0, _assert2.default)(feeAsset !== null, 'Invalid fee asset name ' + _this.feeAsset);

                    var tr = new _bitsharesjs.TransactionBuilder();
                    tr.add_type_operation("transfer", {
                        fee: {
                            amount: 0,
                            asset_id: feeAsset.get("id")
                        },
                        from: cLectureAccount.get("id"),
                        to: cStudentAccount.get("id"),
                        amount: { asset_id: sendAsset.get("id"), amount: 1 }
                    });

                    tr.set_required_fees().then(function () {
                        tr.propose({
                            fee_paying_account: cStudentAccount.get("id")
                        });

                        tr.set_required_fees().then(function () {
                            tr.add_signer(_this.account.privateKey, _this.account.privateKey.toPublicKey().toPublicKeyString());
                            tr.broadcast().then(function (resp) {
                                resolve(tr.serialize());
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc collect information about lecture
         * @param lectureAccount - name of the bitshares lecture account
         * @return return map of stats by tokens UTSchoolTokenTicket, UTSchoolTokenSession, UTSchoolTokenGrade
         * stat: {
         *      id - id of the token,
         *      symbol - name of the token
         *      accepted - use was accepted to lecture
         *      balance - balance of the particular token on the account
         * }
         */

    }, {
        key: 'getLectureStats',
        value: function getLectureStats(lectureAccount) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var schoolTokens = [_Configs.utSchoolTokenTicket, _Configs.utSchoolTokenSession, _Configs.utSchoolTokenGrade];
                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", lectureAccount), (0, _bitsharesjs.FetchChain)("getAccount", _this2.account.name), (0, _bitsharesjs.FetchChain)("getAsset", schoolTokens)]).then(function (res) {
                    var _res2 = _slicedToArray(res, 3),
                        cLectureAccount = _res2[0],
                        studentAccount = _res2[1],
                        assets = _res2[2];

                    assets = assets.toJS();

                    (0, _assert2.default)(cLectureAccount !== null, 'Invalid lecture account ' + cLectureAccount);
                    (0, _assert2.default)(studentAccount !== null, 'Invalid student account ' + _this2.account.name);
                    (0, _assert2.default)(assets[0] !== null, 'Invalid ticket token ' + schoolTokens[0]);
                    (0, _assert2.default)(assets[1] !== null, 'Invalid session token ' + schoolTokens[1]);
                    (0, _assert2.default)(assets[2] !== null, 'Invalid grade token ' + schoolTokens[2]);

                    var lectureAccountId = cLectureAccount.get('id');
                    var studentAccountId = studentAccount.get('id');
                    var ticketTockenId = assets[0].id;
                    var proposals = cLectureAccount.get('proposals').toJS();

                    var assetsMap = {};
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var asset = _step.value;

                            assetsMap[asset.id] = {
                                'id': asset.id,
                                'symbol': asset.symbol,
                                'accepted': false,
                                'requested': false,
                                'balance': _bitsharesjs.ChainStore.getAccountBalance(cLectureAccount, asset.id)
                            };
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    _BitsharesApiExtends.BitsharesApiExtends.fetchHistory(lectureAccountId, 100, 'transfer').then(function (operations) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = operations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var operation = _step2.value;

                                var transferData = operation.op[1];
                                if (transferData.from === lectureAccountId && transferData.to === studentAccountId && assetsMap[transferData.amount.asset_id]) {
                                    assetsMap[transferData.amount.asset_id].accepted = true;
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        (0, _bitsharesjs.FetchChain)("getObject", proposals).then(function (cProposals) {
                            cProposals = cProposals.toJS();

                            var index = -1;
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = cProposals[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var cProposal = _step3.value;

                                    index++;
                                    if (!cProposal) {
                                        console.log('Have no information about proposal ' + proposals[index]);
                                        continue;
                                    }

                                    if (Date.parse(cProposal.proposed_transaction.expiration) < new Date() / 1000) continue;

                                    var _operations = cProposal.proposed_transaction.operations;
                                    var acceptedOperation = void 0;
                                    var _iteratorNormalCompletion4 = true;
                                    var _didIteratorError4 = false;
                                    var _iteratorError4 = undefined;

                                    try {
                                        for (var _iterator4 = _operations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                            var operation = _step4.value;

                                            var operationData = operation[1];
                                            if (!operationData.amount || !operationData.from) continue;

                                            if (operationData.amount.asset_id === ticketTockenId && operationData.from === lectureAccountId && operationData.to === studentAccountId) {
                                                acceptedOperation = operationData;
                                                break;
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError4 = true;
                                        _iteratorError4 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                                _iterator4.return();
                                            }
                                        } finally {
                                            if (_didIteratorError4) {
                                                throw _iteratorError4;
                                            }
                                        }
                                    }

                                    if (acceptedOperation) {
                                        assetsMap[ticketTockenId].requested = true;
                                        break;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                        _iterator3.return();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
                                    }
                                }
                            }

                            resolve(assetsMap);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc return all available lectures for current user
         * @return list of lectures
         * lecture: {
         *      id - id of the bitshares lecture account
         *      name - name of the bitshares lecture account
         *      teacher: {
         *          id - id of the bitshares teacher account
         *          name - id of the bitshares teacher account
         *      }
         *      stats - result from getLectureStats
         * }
         */

    }, {
        key: 'getLectures',
        value: function getLectures() {
            var _this3 = this;

            var lecturesList = [];
            return new Promise(function (resolve, reject) {
                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", _Configs.utSchoolAccount), (0, _bitsharesjs.FetchChain)("getAsset", _Configs.utSchoolToken)]).then(function (res) {
                    var _res3 = _slicedToArray(res, 2),
                        cUtSchoolAccount = _res3[0],
                        cUtSchoolAsset = _res3[1];

                    (0, _assert2.default)(cUtSchoolAccount !== null, 'Invalid utSchoolAccount ' + _Configs.utSchoolAccount);
                    (0, _assert2.default)(cUtSchoolAsset !== null, 'Invalid utSchoolToken ' + _Configs.utSchoolToken);

                    cUtSchoolAccount = cUtSchoolAccount.get('id');
                    cUtSchoolAsset = cUtSchoolAsset.get('id');
                    _BitsharesApiExtends.BitsharesApiExtends.fetchHistory(cUtSchoolAccount, 100, 'transfer').then(function (operations) {
                        var lecturesAccountsList = [];
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = operations[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var operation = _step5.value;

                                var transferData = operation.op[1];

                                if (transferData.from === cUtSchoolAccount && transferData.amount.asset_id === cUtSchoolAsset) {
                                    lecturesAccountsList.push(transferData.to);
                                }
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }

                        if (lecturesAccountsList.length === 0) {
                            resolve(lecturesList);
                            return;
                        }

                        (0, _bitsharesjs.FetchChain)("getAccount", lecturesAccountsList).then(function (lectures) {
                            lectures = lectures.toJS();
                            var teachersIds = [];
                            var index = -1;
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = lectures[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var lectureData = _step6.value;

                                    index++;
                                    if (!lectureData) {
                                        console.log('Have no information about lecture with id ' + lecturesAccountsList[index]);
                                        continue;
                                    }
                                    lecturesList.push({
                                        'id': lectureData.id,
                                        'name': lectureData.name,
                                        'teacher': {
                                            'id': lectureData.active.account_auths[0][0]
                                        }
                                    });

                                    teachersIds.push(lectureData.active.account_auths[0][0]);
                                }
                            } catch (err) {
                                _didIteratorError6 = true;
                                _iteratorError6 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                        _iterator6.return();
                                    }
                                } finally {
                                    if (_didIteratorError6) {
                                        throw _iteratorError6;
                                    }
                                }
                            }

                            (0, _bitsharesjs.FetchChain)("getAccount", teachersIds).then(function (teachers) {
                                var teachersMap = {};
                                var index = -1;
                                teachers = teachers.toJS();
                                var _iteratorNormalCompletion7 = true;
                                var _didIteratorError7 = false;
                                var _iteratorError7 = undefined;

                                try {
                                    for (var _iterator7 = teachers[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                        var teacher = _step7.value;

                                        index++;
                                        if (!teacher) {
                                            console.log('Have no information about teacher with id ' + teachersIds[index]);
                                            continue;
                                        }
                                        teachersMap[teacher.id] = teacher;
                                    }
                                } catch (err) {
                                    _didIteratorError7 = true;
                                    _iteratorError7 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                            _iterator7.return();
                                        }
                                    } finally {
                                        if (_didIteratorError7) {
                                            throw _iteratorError7;
                                        }
                                    }
                                }

                                var lectureStatePromiseList = [];
                                var _iteratorNormalCompletion8 = true;
                                var _didIteratorError8 = false;
                                var _iteratorError8 = undefined;

                                try {
                                    for (var _iterator8 = lecturesList[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                        var lecture = _step8.value;

                                        var teacherData = teachersMap[lecture.teacher.id];
                                        if (teacherData) lecture.teacher.name = teacherData.name;
                                        lectureStatePromiseList.push(_this3.getLectureStats(lecture.name));
                                    }
                                } catch (err) {
                                    _didIteratorError8 = true;
                                    _iteratorError8 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                            _iterator8.return();
                                        }
                                    } finally {
                                        if (_didIteratorError8) {
                                            throw _iteratorError8;
                                        }
                                    }
                                }

                                Promise.all(lectureStatePromiseList).then(function (lecturesStates) {
                                    for (var i = 0; i < lecturesList.length; i++) {
                                        lecturesList[i].stats = lecturesStates[i];
                                    }resolve(lecturesList);
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }
    }]);

    return StudentApi;
}();

exports.StudentApi = StudentApi;