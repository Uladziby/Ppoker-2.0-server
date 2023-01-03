"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var ws_1 = __importDefault(require("ws"));
var express_1 = __importDefault(require("./express"));
var c = __importStar(require("./consts"));
var port = process.env.PORT || 4000;
var server = http.createServer(express_1.default);
var webSocketServer = new ws_1.default.Server({ server: server });
var sessions = new Set();
var rooms = new Map();
var players = new Map();
var sessionPlayers = new Map();
var currentStatistic = new Map();
var allStatistic = new Map();
var currentScore = new Map();
function sendDataToPlayers(data, currentSession) {
    if (rooms.has(currentSession) && rooms.get(currentSession).length)
        rooms.get(currentSession).forEach(function (socket) {
            socket.send(JSON.stringify(data));
        });
}
function closeSockets(currentSession) {
    if (rooms.has(currentSession) && rooms.get(currentSession).length)
        rooms.get(currentSession).forEach(function (socket) {
            socket.close(1000, 'Scrum master leaved this session...');
            sessions.delete(currentSession);
            rooms.delete(currentSession);
            players.delete(currentSession);
            sessionPlayers.delete(currentSession);
            currentStatistic.delete(currentSession);
            allStatistic.delete(currentSession);
            currentScore.delete(currentSession);
        });
}
function deletePlayer(id, mes, currentSession, ws) {
    var _a;
    if (ws === void 0) { ws = null; }
    var findPlayerIndex = function (arr) {
        if (arr)
            return arr.findIndex(function (item) { return (item === null || item === void 0 ? void 0 : item.id) === id; });
        return -1;
    };
    var sessionPlayerIndex = findPlayerIndex(rooms.get(currentSession));
    if (sessionPlayerIndex >= 0) {
        rooms.get(currentSession)[sessionPlayerIndex].close(1000, mes);
        rooms.get(currentSession).splice(sessionPlayerIndex, 1);
        sessionPlayers.get(currentSession).splice(sessionPlayerIndex, 1);
        var playerIndex = findPlayerIndex(players.get(currentSession));
        if (playerIndex >= 0)
            players.get(currentSession).splice(playerIndex, 1);
    }
    if (ws) {
        var findIndexWS = function () {
            return rooms.get(currentSession).findIndex(function (item) { return item === ws; });
        };
        var indexWS = findIndexWS();
        rooms.get(currentSession).splice(indexWS, 1);
        if (sessionPlayers.get(currentSession)) {
            var idPlayer_1 = (_a = sessionPlayers.get(currentSession)[indexWS]) === null || _a === void 0 ? void 0 : _a.id;
            if (players
                .get(currentSession)
                .findIndex(function (item) { return (item === null || item === void 0 ? void 0 : item.id) === idPlayer_1; }) >= 0)
                players.get(currentSession).splice(players
                    .get(currentSession)
                    .findIndex(function (item) { return (item === null || item === void 0 ? void 0 : item.id) === idPlayer_1; }), 1);
            sessionPlayers.get(currentSession).splice(indexWS, 1);
        }
    }
    sendDataToPlayers({ type: c.SET_PLAYERS, players: players.get(currentSession) }, currentSession);
}
function countResult(currentSession, issue, arrCards) {
    return __awaiter(this, void 0, void 0, function () {
        var arrIdVoteCards, resultArr, _loop_1, i;
        return __generator(this, function (_a) {
            arrIdVoteCards = __spreadArray([], currentStatistic.get(currentSession), true);
            resultArr = [];
            _loop_1 = function (i) {
                resultArr.push(Number(((100 * arrIdVoteCards.filter(function (item) { return item === i; }).length) /
                    arrIdVoteCards.length).toFixed(1)));
            };
            for (i = 0; i < arrCards.length; i += 1) {
                _loop_1(i);
            }
            return [2 /*return*/, resultArr];
        });
    });
}
var setResults = function (currentSession, playerId, card, masterIsPlayer) {
    if (masterIsPlayer) {
        currentStatistic.get(currentSession).push(card);
        currentScore.get(currentSession)[playerId] = card;
    }
    if (!masterIsPlayer && players.get(currentSession)[0].id !== playerId) {
        currentStatistic.get(currentSession).push(card);
        currentScore.get(currentSession)[playerId] = card;
    }
};
webSocketServer.on('connection', function (ws) {
    console.dir('connection');
    var currentSession;
    ws.on('message', function (m) {
        var _a, _b;
        var _c = JSON.parse(m), type = _c.type, player = _c.player, playerId = _c.playerId, location = _c.location, idSession = _c.idSession, issues = _c.issues, settings = _c.settings, issue = _c.issue, card = _c.card;
        switch (type) {
            case c.SET_SESSION:
                sessions.add(idSession);
                rooms.set(idSession, [ws]);
                currentSession = idSession;
                players.set(currentSession, []);
                sessionPlayers.set(currentSession, []);
                break;
            case c.CHECK_ID_SESSION:
                console.log('idSession', idSession);
                console.log('sessions', sessions);
                if (sessions.has(idSession)) {
                    rooms.get(idSession).push(ws);
                    currentSession = idSession;
                }
                else
                    ws.close(1000, ' Access denied... ');
                break;
            case c.PUT_PLAYER:
                players.get(currentSession).push(player);
                sessionPlayers.get(currentSession).push(player);
                sendDataToPlayers({ type: c.SET_PLAYERS, players: sessionPlayers.get(currentSession) }, currentSession);
                break;
            case c.DEL_PLAYER:
                if (rooms.get(currentSession)[0] === ws) {
                    console.log('deletePlayer');
                    deletePlayer(playerId, 'scrum master deleted you from session', currentSession);
                }
                break;
            case c.PUT_OBSERVER:
                sessionPlayers.get(currentSession).push(player);
                sendDataToPlayers({ type: c.SET_PLAYERS, players: sessionPlayers.get(currentSession) }, currentSession);
                break;
            case c.SET_LOCATION:
                ws.send(JSON.stringify({ type: c.SET_LOCATION, location: location }));
                break;
            case c.CLOSE_SESSION:
                if (playerId === players.get(currentSession)[0].id)
                    closeSockets(currentSession);
                else
                    deletePlayer(playerId, 'Session closed...', currentSession);
                break;
            case c.START_GAME:
                allStatistic.set(currentSession, []);
                sendDataToPlayers({ type: c.SET_PLAYERS, players: players.get(currentSession) }, currentSession);
                sendDataToPlayers({ type: c.SET_SETTINGS, issues: issues, settings: settings }, currentSession);
                sendDataToPlayers({ type: c.SET_LOCATION, location: '/game' }, currentSession);
                break;
            case c.SET_ROUND_START:
                currentStatistic.set(currentSession, []);
                currentScore.set(currentSession, {});
                sendDataToPlayers({ type: c.SET_ROUND_START, issue: issue }, currentSession);
                break;
            case c.RESTART_ROUND:
                currentStatistic.set(currentSession, []);
                currentScore.set(currentSession, {});
                allStatistic.get(currentSession).pop();
                sendDataToPlayers({ type: c.RESTART_TIMER, issue: issue }, currentSession);
                sendDataToPlayers({ type: c.SET_ROUND_START }, currentSession);
                break;
            case c.RESTART_TIMER:
                sendDataToPlayers({ type: c.RESTART_TIMER, issue: issue }, currentSession);
                break;
            case c.SET_ROUND_RESULT:
                setResults(currentSession, playerId, card, settings.scramMasterAsPlayer);
                if (((_a = players.get(currentSession)) === null || _a === void 0 ? void 0 : _a.length) ===
                    ((_b = currentStatistic.get(currentSession)) === null || _b === void 0 ? void 0 : _b.length) +
                        Number(!settings.scramMasterAsPlayer)) {
                    countResult(currentSession, issue, settings.cardStorage).then(function (res) {
                        if (res) {
                            allStatistic
                                .get(currentSession)
                                .push({ resultsVote: res, idIssue: issue });
                            console.log('allStatistic', allStatistic);
                            sendDataToPlayers({
                                type: c.SET_ROUND_RESULT,
                                issue: issue,
                                statistic: allStatistic.get(currentSession),
                                score: currentScore.get(currentSession),
                            }, currentSession);
                        }
                    });
                }
                break;
            default:
                break;
        }
    });
    ws.on('close', function () {
        if (rooms.get(currentSession) && ws === rooms.get(currentSession)[0])
            closeSockets(currentSession);
        if (rooms.get(currentSession) && ws !== rooms.get(currentSession)[0])
            deletePlayer(0, '', currentSession, ws);
    });
});
server.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
