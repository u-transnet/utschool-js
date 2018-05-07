'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TeacherApi = undefined;

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

var TeacherApi = function () {
    function TeacherApi(account) {
        _classCallCheck(this, TeacherApi);

        this.account = account;
        this.feeAsset = 'BTS';
    }

    /**
     * @desc send education token from lecture account to particular student
     * @param lectureAccount - name of the bitshares lecture account
     * @param studentAccount - name of the bitshares student account
     * @param educationToken - name of the bitshares education token
     * @return serialized transaction
     */


    _createClass(TeacherApi, [{
        key: '_sendToken',
        value: function _sendToken(lectureAccount, studentAccount, educationToken) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                (0, _assert2.default)(_this.account.privateKey !== null, 'You must provide private key for executing this method');

                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", lectureAccount), (0, _bitsharesjs.FetchChain)("getAccount", studentAccount), (0, _bitsharesjs.FetchChain)("getAsset", educationToken), (0, _bitsharesjs.FetchChain)("getAsset", _this.feeAsset)]).then(function (res) {
                    var _res = _slicedToArray(res, 4),
                        cLectureAccount = _res[0],
                        cStudentAccount = _res[1],
                        cEducationToken = _res[2],
                        cFeeAsset = _res[3];

                    (0, _assert2.default)(cLectureAccount !== null, 'Invalid lecture account ' + lectureAccount);
                    (0, _assert2.default)(cStudentAccount !== null, 'Invalid student account ' + studentAccount);
                    (0, _assert2.default)(cEducationToken !== null, 'Invalid education token ' + educationToken);
                    (0, _assert2.default)(cFeeAsset !== null, 'Invalid fee asset ' + _this.feeAsset);

                    var tr = new _bitsharesjs.TransactionBuilder();

                    tr.add_type_operation("transfer", {
                        fee: {
                            amount: 0,
                            asset_id: cFeeAsset.get("id")
                        },
                        from: cLectureAccount.get("id"),
                        to: cStudentAccount.get("id"),
                        amount: { asset_id: cEducationToken.get("id"), amount: 1 }
                    });

                    tr.set_required_fees().then(function () {
                        tr.add_signer(_this.account.privateKey, _this.account.privateKey.toPublicKey().toPublicKeyString());
                        tr.broadcast().then(function (resp) {
                            resolve(tr.serialize());
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc send session token from lecture account to particular student
         * @param lectureAccount - name of the bitshares lecture account
         * @param studentAccount - name of the bitshares student account
         * @return serialized transaction
         */

    }, {
        key: 'sendSessionToken',
        value: function sendSessionToken(lectureAccount, studentAccount) {
            return this._sendToken(lectureAccount, studentAccount, _Configs.utSchoolTokenSession);
        }

        /**
         * @desc send grade token from lecture account to particular student
         * @param lectureAccount - name of the bitshares lecture account
         * @param studentAccount - name of the bitshares student account
         * @return serialized transaction
         */

    }, {
        key: 'sendGradeToken',
        value: function sendGradeToken(lectureAccount, studentAccount) {
            return this._sendToken(lectureAccount, studentAccount, _Configs.utSchoolTokenGrade);
        }

        /**
         * @desc fetch from blockchain information about participants of the lecture
         * @param lectureAccount - name of the bitshares lecture account
         * @return list of participants
         * participant: {
         *      id,
         *      name
         * }
         */

    }, {
        key: 'getLectureParticipants',
        value: function getLectureParticipants(lectureAccount) {
            return new Promise(function (resolve, reject) {
                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", lectureAccount), (0, _bitsharesjs.FetchChain)("getAsset", _Configs.utSchoolTokenTicket)]).then(function (res) {
                    var _res2 = _slicedToArray(res, 2),
                        cLectureAccount = _res2[0],
                        cTicketToken = _res2[1];

                    (0, _assert2.default)(cLectureAccount !== null, 'Invalid lecture account ' + lectureAccount);
                    (0, _assert2.default)(cTicketToken !== null, 'Invalid ticket token ' + _Configs.utSchoolTokenTicket);

                    cLectureAccount = cLectureAccount.get('id');
                    cTicketToken = cTicketToken.get('id');

                    _BitsharesApiExtends.BitsharesApiExtends.fetchHistory(cLectureAccount, 100, 'transfer').then(function (operations) {
                        var lectureParticipantsIds = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = operations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var operation = _step.value;

                                var transferData = operation.op[1];
                                if (transferData.from == cLectureAccount && transferData.amount.asset_id == cTicketToken) {
                                    lectureParticipantsIds.push(transferData.to);
                                }
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

                        (0, _bitsharesjs.FetchChain)('getAccount', lectureParticipantsIds).then(function (accounts) {
                            accounts = accounts.toJS();
                            var accountsMap = {};

                            var index = -1;
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = accounts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var account = _step2.value;

                                    index++;
                                    if (!account) {
                                        console.log('Have no information about account ' + lectureParticipants[index]);
                                        continue;
                                    }
                                    accountsMap[account.id] = account;
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

                            var lectureParticipants = [];
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = lectureParticipantsIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var participant = _step3.value;

                                    var accountData = accountsMap[participant];
                                    if (!accountData) continue;
                                    lectureParticipants.push({
                                        'id': accountData.id,
                                        'name': accountData.name
                                    });
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

                            resolve(lectureParticipants);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc fetch from blockchain information about applications for the lecture
         * @param lectureAccount - name of the bitshares lecture account
         * @return list of applications
         * application: {
         *      id, - id of proposal
         *      account: { - information about student account requested application
         *          id,
         *          name
         *      }
         * }
         */

    }, {
        key: 'getLectureApplications',
        value: function getLectureApplications(lectureAccount) {
            return new Promise(function (resolve, reject) {
                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", lectureAccount), (0, _bitsharesjs.FetchChain)("getAsset", _Configs.utSchoolTokenTicket)]).then(function (res) {
                    var _res3 = _slicedToArray(res, 2),
                        cLectureAccount = _res3[0],
                        cTicketToken = _res3[1];

                    (0, _assert2.default)(cLectureAccount !== null, 'Invalid lecture account ' + lectureAccount);
                    (0, _assert2.default)(cTicketToken !== null, 'Invalid ticket token ' + _Configs.utSchoolTokenTicket);

                    var lectureAccountId = cLectureAccount.get('id');
                    cTicketToken = cTicketToken.get('id');

                    var proposals = cLectureAccount.toJS().proposals;
                    if (proposals.length == 0) {
                        resolve([]);
                        return;
                    }

                    var applications = [];
                    (0, _bitsharesjs.FetchChain)("getObject", proposals).then(function (cProposals) {
                        cProposals = cProposals.toJS();

                        var accountIds = [];
                        var index = -1;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = cProposals[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var cProposal = _step4.value;

                                index++;
                                if (!cProposal) {
                                    console.log('Have no information about proposal ' + proposals[index]);
                                    continue;
                                }

                                if (Date.parse(cProposal.proposed_transaction.expiration) < new Date() / 1000) continue;
                                var operations = cProposal.proposed_transaction.operations;
                                var acceptedOperation = void 0;
                                var _iteratorNormalCompletion7 = true;
                                var _didIteratorError7 = false;
                                var _iteratorError7 = undefined;

                                try {
                                    for (var _iterator7 = operations[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                        var operation = _step7.value;

                                        var operationData = operation[1];
                                        if (operationData.amount.asset_id == cTicketToken && operationData.from == lectureAccountId) {
                                            acceptedOperation = operationData;
                                            break;
                                        }
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

                                if (!acceptedOperation) continue;

                                accountIds.push(acceptedOperation.to);
                                applications.push({
                                    'id': cProposal.id,
                                    'operation': acceptedOperation
                                });
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

                        if (applications.length == 0) {
                            resolve([]);
                            return;
                        }
                        (0, _bitsharesjs.FetchChain)('getAccount', accountIds).then(function (accounts) {
                            accounts = accounts.toJS();
                            var accountsMap = {};

                            var index = -1;
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                                for (var _iterator5 = accounts[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                    var account = _step5.value;

                                    index++;
                                    var accountId = accountIds[index];
                                    if (!account) {
                                        console.log('Have no information about account ' + accountId);
                                        account = { id: accountId };
                                    }
                                    accountsMap[accountId] = account;
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

                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = applications[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var application = _step6.value;

                                    var accountData = accountsMap[application.operation.to];
                                    delete application.operation;
                                    application.account = {
                                        'id': accountData.id,
                                        'name': accountData.name
                                    };
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

                            resolve(applications);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc accept proposal for application for the lecture
         * @param lectureApplicationId - id of the proposal for application for the lecture
         * @return serialized transaction
         */

    }, {
        key: 'acceptApplication',
        value: function acceptApplication(lectureApplicationId) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                (0, _assert2.default)(_this2.account.privateKey !== null, 'You must provide private key for executing this method');

                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", _this2.account.name), (0, _bitsharesjs.FetchChain)("getAsset", _this2.feeAsset)]).then(function (res) {
                    var _res4 = _slicedToArray(res, 3),
                        cTeacherAccount = _res4[0],
                        cFeeAsset = _res4[1],
                        cProposal = _res4[2];

                    (0, _assert2.default)(cTeacherAccount !== null, 'Invalid teacher account ' + _this2.account.name);
                    (0, _assert2.default)(cFeeAsset !== null, 'Invalid fee asset ' + _this2.feeAsset);

                    var tr = new _bitsharesjs.TransactionBuilder();

                    tr.add_type_operation("proposal_update", {
                        fee: {
                            amount: 0,
                            asset_id: cFeeAsset.get("id")
                        },
                        fee_paying_account: cTeacherAccount.get('id'),
                        proposal: lectureApplicationId,
                        active_approvals_to_add: [cTeacherAccount.get('id')]
                    });

                    tr.set_required_fees().then(function () {
                        tr.add_signer(_this2.account.privateKey, _this2.account.privateKey.toPublicKey().toPublicKeyString());
                        tr.broadcast().then(function (resp) {
                            resolve(tr.serialize());
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }

        /**
         * @desc return statistics about particular lecture
         * @param lectureAccount - name of the bitshares lecture accout
         * @return pair of results from getLectureParticipants and getLectureApplications
         */

    }, {
        key: 'getLectureStats',
        value: function getLectureStats(lectureAccount) {
            return Promise.all([this.getLectureParticipants(lectureAccount), this.getLectureApplications(lectureAccount)]);
        }

        /**
         * @desc internal method for iterating through lectures and gathering stats
         * @param lectures - list of account objects fetched from blockchain with bitsharesjs
         * @param index - current index in list
         * @param onFinish - finish callback
         * @private
         */

    }, {
        key: '__processLectureQueue',
        value: function __processLectureQueue(lectures, index, onFinish) {
            var _this3 = this;

            if (index >= lectures.length) {
                onFinish(lectures);
                return;
            }
            this.getLectureStats(lectures[index].name).then(function (res) {
                var _res5 = _slicedToArray(res, 2),
                    participants = _res5[0],
                    applications = _res5[1];

                lectures[index].participants = participants;
                lectures[index].applications = applications;

                _this3.__processLectureQueue(lectures, index + 1, onFinish);
            });
        }

        /**
         * @desc collect all lectures of the current user
         * @return list of lectures
         * lecture: {
         *      id,
         *      name,
         *      participants - result of getLectureParticipants
         *      applications - result of getLectureApplications
         * }
         */

    }, {
        key: 'getLectures',
        value: function getLectures() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                Promise.all([(0, _bitsharesjs.FetchChain)("getAccount", _Configs.utSchoolAccount), (0, _bitsharesjs.FetchChain)("getAccount", _this4.account.name), (0, _bitsharesjs.FetchChain)("getAsset", _Configs.utSchoolToken)]).then(function (res) {
                    var _res6 = _slicedToArray(res, 3),
                        cUtSchoolAccount = _res6[0],
                        cTeacherAccount = _res6[1],
                        cUtSchoolToken = _res6[2];

                    (0, _assert2.default)(cUtSchoolAccount !== null, 'Invalid utSchoolAccount ' + _Configs.utSchoolAccount);
                    (0, _assert2.default)(cTeacherAccount !== null, 'Invalid teacher account ' + _this4.account.name);
                    (0, _assert2.default)(cUtSchoolToken !== null, 'Invalid utSchoolToken ' + _Configs.utSchoolToken);

                    cUtSchoolAccount = cUtSchoolAccount.get('id');
                    cTeacherAccount = cTeacherAccount.get('id');
                    cUtSchoolToken = cUtSchoolToken.get('id');

                    _BitsharesApiExtends.BitsharesApiExtends.fetchHistory(cUtSchoolAccount, 100, 'transfer').then(function (operations) {
                        var lecturesIdsList = [];
                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = operations[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var operation = _step8.value;

                                var transferData = operation.op[1];
                                if (transferData.from === cUtSchoolAccount && transferData.amount.asset_id === cUtSchoolToken) lecturesIdsList.push(transferData.to);
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

                        if (lecturesIdsList.length === 0) {
                            resolve([]);
                            return;
                        }

                        (0, _bitsharesjs.FetchChain)("getAccount", lecturesIdsList).then(function (lectures) {
                            lectures = lectures.toJS();

                            var teachersLecturesList = [];

                            var index = -1;
                            var _iteratorNormalCompletion9 = true;
                            var _didIteratorError9 = false;
                            var _iteratorError9 = undefined;

                            try {
                                for (var _iterator9 = lectures[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                    var lecture = _step9.value;

                                    index++;
                                    if (!lecture) {
                                        console.log('Have no information about lecture ' + lecturesIdsList[index]);
                                        continue;
                                    }

                                    var account_auths = lecture.active.account_auths;
                                    if (account_auths.length === 0 || account_auths[0].length === 0) continue;

                                    var potentialTeacherIds = account_auths[0];
                                    var _iteratorNormalCompletion10 = true;
                                    var _didIteratorError10 = false;
                                    var _iteratorError10 = undefined;

                                    try {
                                        for (var _iterator10 = potentialTeacherIds[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                            var currentTeacherId = _step10.value;

                                            if (currentTeacherId === cTeacherAccount) {
                                                teachersLecturesList.push({
                                                    'id': lecture.id,
                                                    'name': lecture.name
                                                });
                                                break;
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError10 = true;
                                        _iteratorError10 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                                _iterator10.return();
                                            }
                                        } finally {
                                            if (_didIteratorError10) {
                                                throw _iteratorError10;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                _didIteratorError9 = true;
                                _iteratorError9 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                        _iterator9.return();
                                    }
                                } finally {
                                    if (_didIteratorError9) {
                                        throw _iteratorError9;
                                    }
                                }
                            }

                            if (teachersLecturesList.length === 0) {
                                resolve([]);
                                return;
                            }

                            _this4.__processLectureQueue(teachersLecturesList, 0, resolve);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            });
        }
    }]);

    return TeacherApi;
}();

exports.TeacherApi = TeacherApi;