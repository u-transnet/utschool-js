"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generatePrograms = undefined;

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generatePrograms(programsList, api, onResult) {
    var programs = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var programData = _step.value;

            var program = new _commander2.default.Command(programData.command.name);
            program.description(programData.command.description);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = programData.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var option = _step2.value;

                    program.option(option.name, option.description);
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

            program.action(function (commandName, command) {
                if (commandName !== programData.command.name) return;

                var apiArgs = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = programData.options[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var option = _step3.value;

                        var optionValue = command[option.key];
                        if ((typeof optionValue === 'undefined' || optionValue === null) && option.required) {
                            onResult(commandName, "Option " + option.name + " is required for method " + commandName, true);
                            return;
                        }
                        apiArgs.push(optionValue);
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

                api[programData.exec].apply(api, apiArgs).then(function (resp) {
                    onResult(commandName, resp, false);
                }).catch(function (error) {
                    onResult(commandName, error, true);
                });
            });

            programs.push(program);
        };

        for (var _iterator = programsList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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

    return programs;
} /**
   * Created by superpchelka on 25.02.18.
   */

exports.generatePrograms = generatePrograms;