'use strict';

var _Api = require('./cli/Api');

var _Api2 = _interopRequireDefault(_Api);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by superpchelka on 24.02.18.
                                                                                                                                                                                                     */

_commander2.default.version('1.0.0').option('-l, --login <login>', 'login of your bitshares account').option('-p, --password  [password]', 'password of your bitshares account').option('-k, --privateKey [privateKey]', 'private key of your bitshares account').option('-u, --url <nodeUrl>', 'url of node to connect').parse(process.argv);

if (!_commander2.default.password && !_commander2.default.privateKey) {
    console.log("Error: you must provide password or privateKey for accessing to your bitshares account");
    process.exit();
}

var rl = _readline2.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
var prefix = '>';
var onResult = function onResult(commandName, resp, isError) {
    console.log(_util2.default.inspect(resp, false, null));
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
};

_Api2.default.getPrograms(_commander2.default.url, _commander2.default.login, _commander2.default.password, _commander2.default.privateKey, onResult).then(function (programs) {

    programs.push(new _commander2.default.Command('help').action(function (commandName) {
        if (commandName !== 'help') return;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = programs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var program = _step.value;

                program.outputHelp();
                console.log("\n--------------------------\n");
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

        onResult(commandName, '', false);
    }));

    programs.push(new _commander2.default.Command('exit').action(function (commandName) {
        if (commandName !== 'exit') return;
        rl.close();
    }));

    function callCommand(programs, inputStr) {
        var params = inputStr.split(' ');
        var commandName = params[0];
        var pArgs = ['', ''].concat(_toConsumableArray(params));

        var processed = false;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = programs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var program = _step2.value;

                try {
                    if (commandName === program.name()) processed = true;
                    program.parse(pArgs);
                } catch (e) {
                    console.log(e);
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

        if (!processed) onResult(null, 'Unknown command ' + commandName, true);
    }

    rl.on('line', function (line) {
        callCommand(programs, line.trim());
    }).on('close', function () {
        process.exit(0);
    });

    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
}).catch(function (error) {
    console.log(error);
});