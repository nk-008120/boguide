(function () {
  'use strict';

  var app = document.getElementById('bio-ludo-app');
  if (!app) return;

  var setupEl = document.getElementById('bio-ludo-setup');
  var setupBtns = document.querySelectorAll('.bio-ludo-setup-btn');
  var gameEl = document.getElementById('bio-ludo-game');
  var boardEl = document.getElementById('bio-ludo-board');
  var piecesLayer = document.getElementById('bio-ludo-pieces');
  var turnIndicator = document.getElementById('bio-ludo-turn-indicator');
  var rollBtn = document.getElementById('bio-ludo-roll-btn');
  var tokensEl = document.getElementById('bio-ludo-tokens');
  var endTurnBtn = document.getElementById('bio-ludo-end-turn-btn');
  var hintEl = document.getElementById('bio-ludo-hint');
  var highlightsLayer = document.getElementById('bio-ludo-highlights');
  var flagbearersLayer = document.getElementById('bio-ludo-flagbearers');
  var unsafeStatusEl = document.getElementById('bio-ludo-unsafe-status');
  var dieEl = document.getElementById('bio-ludo-die');
  var duelEl = document.getElementById('bio-ludo-duel');
  var duelCardEl = document.getElementById('bio-ludo-duel-card');
  var revivePanelEl = document.getElementById('bio-ludo-revive-panel');
  var gameOverEl = document.getElementById('bio-ludo-gameover');
  var gameOverCardEl = document.getElementById('bio-ludo-gameover-card');

  var botSetupEl = document.getElementById('bio-ludo-bot-setup');
  var botDifficultyBtns = document.querySelectorAll('.bio-ludo-setup-btn[data-bot-difficulty]');

  var questionBank = [];
  var questionDataEl = document.getElementById('bio-ludo-questions');
  if (questionDataEl) {
    try {
      questionBank = JSON.parse(questionDataEl.textContent || '[]');
    } catch (err) {
      questionBank = [];
    }
  }

  var gradableQuestionBank = [];
  var gradableDataEl = document.getElementById('bio-ludo-gradable-questions');
  if (gradableDataEl) {
    try {
      gradableQuestionBank = JSON.parse(gradableDataEl.textContent || '[]');
    } catch (err) {
      gradableQuestionBank = [];
    }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var RING = [
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 7], [0, 8],
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [7, 14], [8, 14],
    [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [14, 7], [14, 6],
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]
  ];

  var HOME_COLUMNS = {
    red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
    green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
    yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
    blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]
  };

  var TEAM_DEFS = {
    red: { key: 'red', label: 'Red', startOffset: 0 },
    green: { key: 'green', label: 'Green', startOffset: 13 },
    yellow: { key: 'yellow', label: 'Yellow', startOffset: 26 },
    blue: { key: 'blue', label: 'Blue', startOffset: 39 }
  };

  var TEAM_ORDER_BY_COUNT = {
    2: ['red', 'yellow'],
    3: ['red', 'green', 'yellow'],
    4: ['red', 'green', 'yellow', 'blue']
  };

  var CLASS_DEFS = [
    { key: 'sniper', label: 'Sniper', badge: 'S', rangeLabel: '5-6' },
    { key: 'assaulter', label: 'Assaulter', badge: 'A', rangeLabel: '3-4' },
    { key: 'trooper', label: 'Trooper', badge: 'T', rangeLabel: '1-2' },
    { key: 'handcombat', label: 'Hand Combat', badge: 'H', rangeLabel: 'Melee' }
  ];

  var YARD_SLOT_OFFSETS = [[1, 1], [1, 3], [3, 1], [3, 3]];

  var YARD_ORIGIN = {
    red: [0, 0],
    green: [0, 9],
    yellow: [9, 9],
    blue: [9, 0]
  };

  var HOME = -1000;
  var FINISHED = 57;
  var BACK_LIMIT = -51;

  var CROSS_CLASS_KILL_CHANCE = [0.25, 0.5, 0.75, 0.95];
  var BOT_ACCURACY = { easy: 0.35, medium: 0.6, hard: 0.85 };
  var BOT_STEP_DELAY = 700;
  var SAFE_RING_INDICES = { 0: true, 8: true, 13: true, 21: true, 26: true, 34: true, 39: true, 47: true };

  var game = null;
  var preGame = null;

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function isOnRing(localStep) {
    return localStep !== HOME && localStep <= 50;
  }

  function globalRingIndex(team, localStep) {
    return ((team.startOffset + localStep) % 52 + 52) % 52;
  }

  function ringDistance(a, b) {
    var raw = Math.abs(a - b);
    return Math.min(raw, 52 - raw);
  }

  function isInClassRange(classIndex, distance) {
    if (classIndex === 0) return distance === 5 || distance === 6;
    if (classIndex === 1) return distance === 3 || distance === 4;
    if (classIndex === 2) return distance === 1 || distance === 2;
    return distance === 0;
  }

  function findAttackTargets(attackerTeam, attackerCharIndex) {
    var attacker = attackerTeam.characters[attackerCharIndex];
    if (!isOnRing(attacker.localStep)) return [];
    var attackerGlobal = globalRingIndex(attackerTeam, attacker.localStep);
    var targets = [];
    game.teams.forEach(function (team) {
      if (team === attackerTeam) return;
      team.characters.forEach(function (character, idx) {
        if (character.dead || character.knockedOut) return;
        if (!isOnRing(character.localStep)) return;
        var defenderGlobal = globalRingIndex(team, character.localStep);
        if (SAFE_RING_INDICES[defenderGlobal]) return;
        var distance = ringDistance(attackerGlobal, defenderGlobal);
        if (isInClassRange(attackerCharIndex, distance)) {
          targets.push({ team: team, charIndex: idx });
        }
      });
    });
    return targets;
  }

  function computeReviveOpportunities(team) {
    var opportunities = [];
    team.characters.forEach(function (character, charIndex) {
      if (!character.knockedOut) return;
      var targetGlobal = globalRingIndex(team, character.localStep);
      var hasReviver = team.characters.some(function (other, otherIndex) {
        if (otherIndex === charIndex) return false;
        if (other.dead || other.knockedOut) return false;
        if (!isOnRing(other.localStep)) return false;
        var otherGlobal = globalRingIndex(team, other.localStep);
        return ringDistance(targetGlobal, otherGlobal) <= 1;
      });
      if (hasReviver) opportunities.push({ charIndex: charIndex });
    });
    return opportunities;
  }

  function teamKeyForOffset(offset) {
    var norm = ((offset % 52) + 52) % 52;
    var keys = Object.keys(TEAM_DEFS);
    for (var i = 0; i < keys.length; i++) {
      if (TEAM_DEFS[keys[i]].startOffset === norm) return keys[i];
    }
    return null;
  }

  function setupUnsafeZone(safeKey) {
    if (game.teams.length !== 4) {
      game.unsafeZone = null;
      return;
    }
    var safeOffset = TEAM_DEFS[safeKey].startOffset;
    var oppositeOffset = (safeOffset + 26) % 52;
    var secondSafeOffset = ((oppositeOffset - 5) % 52 + 52) % 52;
    var cwStart = ((oppositeOffset - 1) % 52 + 52) % 52;
    var ccwStart = ((secondSafeOffset - 2) % 52 + 52) % 52;
    var cwLateralOffset = (oppositeOffset + 13) % 52;
    var ccwLateralOffset = ((oppositeOffset - 13) % 52 + 52) % 52;
    game.unsafeZone = {
      active: true,
      safeKey: safeKey,
      oppositeKey: teamKeyForOffset(oppositeOffset),
      cwLateralKey: teamKeyForOffset(cwLateralOffset),
      ccwLateralKey: teamKeyForOffset(ccwLateralOffset),
      exitGlobal: oppositeOffset,
      cwStart: cwStart,
      ccwStart: ccwStart,
      homeStepsRemaining: 6,
      ringSteps: 0,
      done: false,
      passedKeys: {}
    };
  }

  function computeUnsafeZoneProgress(elapsed) {
    if (elapsed < 0) return { homeStepsRemaining: 6, ringSteps: 0, done: false };
    if (elapsed < 6) return { homeStepsRemaining: 6 - (elapsed + 1), ringSteps: 0, done: false };
    var ringElapsed = elapsed - 6;
    if (ringElapsed < 5) return { homeStepsRemaining: 0, ringSteps: ringElapsed + 1, done: false };
    if (ringElapsed < 9) return { homeStepsRemaining: 0, ringSteps: 5 + 2 * (ringElapsed - 4), done: false };
    if (ringElapsed < 22) return { homeStepsRemaining: 0, ringSteps: 13 + (ringElapsed - 8), done: false };
    return { homeStepsRemaining: 0, ringSteps: 26, done: true };
  }

  function unsafeZoneFlagbearerGlobals() {
    var uz = game.unsafeZone;
    if (!uz || !uz.active || uz.homeStepsRemaining > 0) return null;
    var cw = ((uz.cwStart + uz.ringSteps) % 52 + 52) % 52;
    var ccw = ((uz.ccwStart - uz.ringSteps) % 52 + 52) % 52;
    return { cw: cw, ccw: ccw };
  }

  function isInDeadZone(globalIdx) {
    var uz = game.unsafeZone;
    if (!uz || !uz.active || uz.done || uz.homeStepsRemaining > 0) return false;
    var cw = ((uz.cwStart + uz.ringSteps) % 52 + 52) % 52;
    var ccw = ((uz.ccwStart - uz.ringSteps) % 52 + 52) % 52;
    var span = ((cw - ccw) % 52 + 52) % 52;
    var offset = ((globalIdx - ccw) % 52 + 52) % 52;
    return offset <= span;
  }

  function checkDeadZoneKills() {
    var uz = game.unsafeZone;
    if (!uz || !uz.active) return;
    game.teams.forEach(function (team) {
      team.characters.forEach(function (character) {
        if (character.dead || character.knockedOut) return;
        if (!isOnRing(character.localStep)) {
          character.inDeadZone = false;
          return;
        }
        var g = globalRingIndex(team, character.localStep);
        var inZone = isInDeadZone(g);
        if (inZone && character.inDeadZone) {
          character.dead = true;
        }
        character.inDeadZone = inZone;
      });
    });
  }

  function checkUnsafeZonePassedTeams() {
    var uz = game.unsafeZone;
    if (!uz || !uz.active || uz.homeStepsRemaining > 0) return;
    game.teams.forEach(function (team) {
      if (team.key === uz.safeKey) return;
      if (uz.passedKeys[team.key]) return;
      var allInYard = team.characters.every(function (c) {
        return c.localStep === HOME && !c.dead;
      });
      if (!allInYard) return;
      var distCw = ((team.startOffset - uz.cwStart) % 52 + 52) % 52;
      var distCcw = ((uz.ccwStart - team.startOffset) % 52 + 52) % 52;
      if (uz.ringSteps > distCw || uz.ringSteps > distCcw) {
        uz.passedKeys[team.key] = true;
        team.characters.forEach(function (c) {
          c.dead = true;
        });
      }
    });
  }

  function tickUnsafeZone() {
    var uz = game.unsafeZone;
    if (!uz || !uz.active || uz.done) return;
    var completedRounds = Math.floor(game.turnCounter / game.teams.length);
    var elapsed = completedRounds - 1;
    var progress = computeUnsafeZoneProgress(elapsed);
    uz.homeStepsRemaining = progress.homeStepsRemaining;
    uz.ringSteps = progress.ringSteps;
    uz.done = progress.done;
    checkUnsafeZonePassedTeams();
    checkDeadZoneKills();
  }

  function ringCoord(idx) {
    return RING[((idx % 52) + 52) % 52];
  }

  function cellForCharacter(team, localStep) {
    if (localStep === HOME) return null;
    if (localStep <= 50) return ringCoord(team.startOffset + localStep);
    if (localStep <= 56) return HOME_COLUMNS[team.key][localStep - 51];
    return null;
  }

  function makeTeams(colorKeys, botKeys, botDifficulty) {
    return colorKeys.map(function (key) {
      var def = TEAM_DEFS[key];
      var isBot = (botKeys || []).indexOf(key) !== -1;
      return {
        key: def.key,
        label: def.label,
        startOffset: def.startOffset,
        isBot: isBot,
        botDifficulty: isBot ? botDifficulty : null,
        characters: CLASS_DEFS.map(function (c) {
          return { classKey: c.key, localStep: HOME, knockedOut: false, knockedOutTurnId: -1, dead: false, inDeadZone: false };
        })
      };
    });
  }

  function startSetup(colorKeys, botKeys, botDifficulty) {
    var pool = shuffle(gradableQuestionBank);
    var quizQuestions = {};
    var results = {};
    var cursor = 0;
    colorKeys.forEach(function (key) {
      quizQuestions[key] = pool.slice(cursor, cursor + 10);
      cursor += 10;
      results[key] = 0;
    });
    preGame = {
      colorKeys: colorKeys,
      botKeys: botKeys || [],
      botDifficulty: botDifficulty || 'medium',
      currentTeamCursor: 0,
      currentQuestionIndex: 0,
      results: results,
      quizQuestions: quizQuestions,
      selectedKey: null,
      awaitingAdvance: false,
      advanceMessage: '',
      announcement: null,
      safeTeamKey: null
    };
    setupEl.hidden = true;
    botSetupEl.hidden = true;
    startPreGameTeamTurn();
  }

  function startPreGameTeamTurn() {
    var teamKey = preGame.colorKeys[preGame.currentTeamCursor];
    var isBot = preGame.botKeys.indexOf(teamKey) !== -1;
    if (isBot) {
      var accuracy = BOT_ACCURACY[preGame.botDifficulty];
      var correct = 0;
      for (var i = 0; i < 10; i++) {
        if (Math.random() < accuracy) correct += 1;
      }
      preGame.results[teamKey] = correct;
      preGame.awaitingAdvance = true;
      preGame.advanceMessage = TEAM_DEFS[teamKey].label + ' (bot) answered ' + correct + ' / 10 correctly.';
      renderPreGameQuiz();
      return;
    }
    renderPreGameQuiz();
  }

  function answerPreGameQuestion(key) {
    var teamKey = preGame.colorKeys[preGame.currentTeamCursor];
    var q = preGame.quizQuestions[teamKey][preGame.currentQuestionIndex];
    preGame.selectedKey = key;
    if (key === q.answer) preGame.results[teamKey] += 1;
    renderPreGameQuiz();
  }

  function advancePreGameQuestion() {
    preGame.selectedKey = null;
    preGame.currentQuestionIndex += 1;
    if (preGame.currentQuestionIndex >= 10) {
      finishTeamAndAdvance();
      return;
    }
    renderPreGameQuiz();
  }

  function finishTeamAndAdvance() {
    preGame.currentTeamCursor += 1;
    preGame.currentQuestionIndex = 0;
    preGame.selectedKey = null;
    preGame.awaitingAdvance = false;
    if (preGame.currentTeamCursor >= preGame.colorKeys.length) {
      finishPreGameQuiz();
      return;
    }
    startPreGameTeamTurn();
  }

  function finishPreGameQuiz() {
    var tickets = [];
    var total = 0;
    preGame.colorKeys.forEach(function (key) {
      var weight = preGame.results[key] + 1;
      tickets.push({ key: key, weight: weight });
      total += weight;
    });
    var roll = Math.random() * total;
    var acc = 0;
    var safeKey = tickets[tickets.length - 1].key;
    for (var i = 0; i < tickets.length; i++) {
      acc += tickets[i].weight;
      if (roll < acc) {
        safeKey = tickets[i].key;
        break;
      }
    }
    preGame.safeTeamKey = safeKey;
    preGame.announcement = TEAM_DEFS[safeKey].label + ' is the Safe Team for this match. ' +
      'Once every team has had a first turn, two Unsafe Zone flagbearers will emerge and sweep toward their zone.';
    renderPreGameQuiz();
  }

  function handlePreGameClick(e) {
    var optBtn = e.target.closest('.bio-ludo-gradable-option');
    if (optBtn) {
      answerPreGameQuestion(optBtn.getAttribute('data-option-key'));
      return;
    }
    if (e.target.id === 'bio-ludo-gradable-next-btn') {
      advancePreGameQuestion();
      return;
    }
    if (e.target.id === 'bio-ludo-pregame-continue-btn') {
      finishTeamAndAdvance();
      return;
    }
    if (e.target.id === 'bio-ludo-pregame-start-btn') {
      launchBoard();
    }
  }

  function renderPreGameQuiz() {
    duelEl.hidden = false;

    if (preGame.announcement) {
      duelCardEl.innerHTML = '<p class="bio-ludo-duel-heading">' + escapeHtml(preGame.announcement) + '</p>' +
        '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-pregame-start-btn">Start match</button>';
      return;
    }

    if (preGame.awaitingAdvance) {
      duelCardEl.innerHTML = '<p class="bio-ludo-duel-heading">' + escapeHtml(preGame.advanceMessage) + '</p>' +
        '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-pregame-continue-btn">Continue</button>';
      return;
    }

    var teamKey = preGame.colorKeys[preGame.currentTeamCursor];
    var teamLabel = TEAM_DEFS[teamKey].label;
    var q = preGame.quizQuestions[teamKey][preGame.currentQuestionIndex];
    var html = '<p class="bio-ludo-duel-heading">' + teamLabel + ' safe-team quiz: question ' +
      (preGame.currentQuestionIndex + 1) + ' / 10</p>';
    html += '<div class="bio-ludo-duel-question">' + escapeHtml(q.text) + '</div>';
    html += gradableOptionsHtml(q, preGame.selectedKey);
    if (preGame.selectedKey) {
      html += '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-gradable-next-btn">Next</button>';
    }
    duelCardEl.innerHTML = html;
  }

  function launchBoard() {
    var colorKeys = preGame.colorKeys;
    var botKeys = preGame.botKeys;
    var botDifficulty = preGame.botDifficulty;
    var safeTeamKey = preGame.safeTeamKey;
    preGame = null;
    duelEl.hidden = true;
    duelCardEl.innerHTML = '';
    game = {
      teams: makeTeams(colorKeys, botKeys, botDifficulty),
      hasBots: botKeys.length > 0,
      safeTeamKey: safeTeamKey,
      currentTeamIndex: 0,
      tokens: [],
      selectedTokenIndex: -1,
      selectedCharacter: null,
      moveOptions: [],
      phase: 'rolling',
      duel: null,
      pendingAttacker: null,
      pendingTargets: null,
      turnCounter: 0,
      botActionScheduled: false,
      unsafeZone: null,
      winner: null,
      winReason: null
    };
    setupUnsafeZone(safeTeamKey);
    setupEl.hidden = true;
    botSetupEl.hidden = true;
    gameEl.hidden = false;
    renderBoardShell();
    renderAll();
    maybeContinueBot();
  }

  function currentTeam() {
    return game.teams[game.currentTeamIndex];
  }

  function rollTurnTokens() {
    var tokens = [];
    var safety = 0;
    var value;
    do {
      value = 1 + Math.floor(Math.random() * 6);
      tokens.push(value);
      safety += 1;
    } while (value === 6 && safety < 20);
    return tokens;
  }

  function characterHasLegalMove(team, character, tokenValue) {
    if (character.dead || character.knockedOut) return false;
    if (character.localStep === FINISHED) return false;
    if (character.localStep === HOME) return tokenValue === 1 || tokenValue === 6;
    return true;
  }

  function teamHasAnyLegalMove(team, tokenValue) {
    return team.characters.some(function (c) {
      return characterHasLegalMove(team, c, tokenValue);
    });
  }

  function anyTokenUsable() {
    var team = currentTeam();
    return game.tokens.some(function (v) {
      return teamHasAnyLegalMove(team, v);
    });
  }

  function expireKnockedOut(team) {
    team.characters.forEach(function (character) {
      if (character.knockedOut && character.knockedOutTurnId < game.turnCounter) {
        character.knockedOut = false;
        character.dead = true;
      }
    });
  }

  function endTurn() {
    expireKnockedOut(currentTeam());
    game.tokens = [];
    game.selectedTokenIndex = -1;
    game.selectedCharacter = null;
    game.moveOptions = [];
    game.currentTeamIndex = (game.currentTeamIndex + 1) % game.teams.length;
    game.turnCounter += 1;
    game.phase = 'rolling';
    hintEl.textContent = '';
    tickUnsafeZone();
    renderAll();
    maybeContinueBot();
  }

  function turnHasNothingLeft() {
    return game.tokens.length === 0 || !anyTokenUsable();
  }

  function clampStep(step) {
    if (step < BACK_LIMIT) return BACK_LIMIT;
    if (step > FINISHED) return FINISHED;
    return step;
  }

  function animateRoll(tokens, onDone) {
    var i = 0;

    function rollOne() {
      var flickersLeft = 6;
      var flickerTimer = setInterval(function () {
        dieEl.textContent = String(1 + Math.floor(Math.random() * 6));
        flickersLeft -= 1;
        if (flickersLeft <= 0) {
          clearInterval(flickerTimer);
          dieEl.classList.remove('is-rolling');
          dieEl.textContent = String(tokens[i]);
          game.tokens = tokens.slice(0, i + 1);
          renderHud();
          i += 1;
          if (i < tokens.length) {
            setTimeout(function () {
              dieEl.classList.add('is-rolling');
              rollOne();
            }, 250);
          } else {
            setTimeout(onDone, 350);
          }
        }
      }, 70);
    }

    dieEl.classList.add('is-rolling');
    rollOne();
  }

  function onRoll() {
    if (game.winner || game.phase !== 'rolling') return;
    var tokens = rollTurnTokens();
    game.phase = 'assigning';
    game.tokens = [];
    rollBtn.disabled = true;
    renderHud();
    animateRoll(tokens, function () {
      game.tokens = tokens;
      renderAll();
      if (!anyTokenUsable()) {
        hintEl.textContent = 'Rolled ' + tokens.join(', ') + ': no legal moves. End your turn when ready.';
      }
      maybeContinueBot();
    });
  }

  function selectToken(index) {
    if (game.winner || game.duel || game.pendingTargets) return;
    if (game.selectedTokenIndex === index) {
      game.selectedTokenIndex = -1;
    } else {
      game.selectedTokenIndex = index;
    }
    game.selectedCharacter = null;
    game.moveOptions = [];
    renderAll();
  }

  function computeMoveOptions(character, tokenValue) {
    var options = [];
    var forwardStep = clampStep(character.localStep + tokenValue);
    var backwardStep = clampStep(character.localStep - tokenValue);
    if (forwardStep !== character.localStep) {
      options.push({ step: forwardStep });
    }
    if (backwardStep !== character.localStep && backwardStep !== forwardStep) {
      options.push({ step: backwardStep });
    }
    return options;
  }

  function selectCharacter(teamKey, charIndex) {
    if (game.winner || game.duel || game.pendingTargets) return;
    var team = currentTeam();
    if (teamKey !== team.key) return;
    if (game.selectedTokenIndex === -1) return;
    var tokenValue = game.tokens[game.selectedTokenIndex];
    var character = team.characters[charIndex];
    if (!characterHasLegalMove(team, character, tokenValue)) {
      hintEl.textContent = 'That character cannot use a ' + tokenValue + ' right now.';
      return;
    }
    if (character.localStep === HOME) {
      character.localStep = 0;
      if (!startCombatCheck(team, charIndex)) {
        consumeSelectedToken();
      }
      return;
    }
    game.selectedCharacter = charIndex;
    game.moveOptions = computeMoveOptions(character, tokenValue);
    hintEl.textContent = 'Tap a highlighted square to move ' + CLASS_DEFS[charIndex].label + '.';
    renderAll();
  }

  function moveCharacterTo(targetStep) {
    var team = currentTeam();
    var charIndex = game.selectedCharacter;
    if (charIndex === null) return;
    team.characters[charIndex].localStep = targetStep;
    game.selectedCharacter = null;
    game.moveOptions = [];
    if (!startCombatCheck(team, charIndex)) {
      consumeSelectedToken();
    }
  }

  function startCombatCheck(team, charIndex) {
    var targets = findAttackTargets(team, charIndex);
    if (targets.length === 0) return false;
    if (targets.length === 1) {
      beginDuel(team, charIndex, targets[0].team, targets[0].charIndex);
    } else {
      game.pendingAttacker = { team: team, charIndex: charIndex };
      game.pendingTargets = targets;
      renderAll();
    }
    return true;
  }

  function botAnswerCount(team, n) {
    var accuracy = BOT_ACCURACY[team.botDifficulty] || BOT_ACCURACY.medium;
    var correct = 0;
    for (var i = 0; i < n; i++) {
      if (Math.random() < accuracy) correct += 1;
    }
    return correct;
  }

  function beginDuel(attackerTeam, attackerCharIndex, defenderTeam, defenderCharIndex) {
    var mode = attackerCharIndex === defenderCharIndex ? 'same' : 'cross';
    var questionType = (attackerTeam.isBot || defenderTeam.isBot) ? 'gradable' : 'freeform';
    var pool = questionType === 'gradable' ? gradableQuestionBank : questionBank;
    var questions = shuffle(pool).slice(0, 3);
    game.duel = {
      mode: mode,
      questionType: questionType,
      attackerTeam: attackerTeam,
      attackerCharIndex: attackerCharIndex,
      attackerIsBot: !!attackerTeam.isBot,
      defenderTeam: defenderTeam,
      defenderCharIndex: defenderCharIndex,
      defenderIsBot: !!defenderTeam.isBot,
      questions: questions,
      round: 0,
      revealed: false,
      attackerCorrect: 0,
      defenderCorrect: 0,
      thisRoundAttacker: null,
      thisRoundDefender: null,
      selectedKey: null,
      outcome: null
    };
    if (attackerTeam.isBot) game.duel.attackerCorrect = botAnswerCount(attackerTeam, questions.length);
    if (mode === 'same' && defenderTeam.isBot) game.duel.defenderCorrect = botAnswerCount(defenderTeam, questions.length);
    if (attackerTeam.isBot && (mode !== 'same' || defenderTeam.isBot)) {
      game.duel.round = questions.length;
      game.duel.outcome = resolveDuel(game.duel);
    }
    renderAll();
  }

  function beginRevive(team, charIndex) {
    var questionType = game.hasBots ? 'gradable' : 'freeform';
    var pool = questionType === 'gradable' ? gradableQuestionBank : questionBank;
    var questions = shuffle(pool).slice(0, 3);
    game.duel = {
      mode: 'revive',
      questionType: questionType,
      reviveTeam: team,
      reviveCharIndex: charIndex,
      attackerIsBot: false,
      questions: questions,
      round: 0,
      revealed: false,
      attackerCorrect: 0,
      thisRoundAttacker: null,
      selectedKey: null,
      outcome: null
    };
    renderAll();
  }

  function knockOut(character) {
    character.knockedOut = true;
    character.knockedOutTurnId = game.turnCounter;
  }

  function resolveDuel(d) {
    if (d.mode === 'revive') {
      var character = d.reviveTeam.characters[d.reviveCharIndex];
      var label = d.reviveTeam.label + ' ' + CLASS_DEFS[d.reviveCharIndex].label;
      var reviveChance = CROSS_CLASS_KILL_CHANCE[d.attackerCorrect];
      character.knockedOut = false;
      if (Math.random() < reviveChance) {
        return label + ' is revived and back in the fight.';
      }
      character.dead = true;
      return label + ' could not be revived and is gone for good.';
    }

    var attackerChar = d.attackerTeam.characters[d.attackerCharIndex];
    var defenderChar = d.defenderTeam.characters[d.defenderCharIndex];
    var attackerLabel = d.attackerTeam.label + ' ' + CLASS_DEFS[d.attackerCharIndex].label;
    var defenderLabel = d.defenderTeam.label + ' ' + CLASS_DEFS[d.defenderCharIndex].label;

    if (d.mode === 'same') {
      if (d.attackerCorrect > d.defenderCorrect) {
        knockOut(defenderChar);
        return defenderLabel + ' is knocked out (' + d.attackerCorrect + '-' + d.defenderCorrect +
          '). A teammate within 1 block can revive it before ' + d.defenderTeam.label + "'s next turn ends, or it's gone for good.";
      }
      if (d.defenderCorrect > d.attackerCorrect) {
        knockOut(attackerChar);
        return attackerLabel + ' is knocked out (' + d.defenderCorrect + '-' + d.attackerCorrect +
          '). A teammate within 1 block can revive it before ' + d.attackerTeam.label + "'s next turn ends, or it's gone for good.";
      }
      return 'Tied ' + d.attackerCorrect + '-' + d.defenderCorrect + '. Both characters survive.';
    }

    var chance = CROSS_CLASS_KILL_CHANCE[d.attackerCorrect];
    if (Math.random() < chance) {
      knockOut(defenderChar);
      return defenderLabel + ' is knocked out. A teammate within 1 block can revive it before ' +
        d.defenderTeam.label + "'s next turn ends, or it's gone for good.";
    }
    return defenderLabel + ' survives the attack.';
  }

  function handleDuelReveal() {
    game.duel.revealed = true;
    renderAll();
  }

  function handleDuelScore(role, value) {
    if (role === 'attacker') game.duel.thisRoundAttacker = value;
    if (role === 'defender') game.duel.thisRoundDefender = value;
    renderAll();
  }

  function handleGradableAnswer(key) {
    var d = game.duel;
    var q = d.questions[d.round];
    var isCorrect = key === q.answer;
    d.selectedKey = key;
    if (!d.attackerIsBot) {
      d.thisRoundAttacker = isCorrect;
    } else {
      d.thisRoundDefender = isCorrect;
    }
    renderAll();
  }

  function handleDuelNext() {
    var d = game.duel;
    if (!d.attackerIsBot && d.thisRoundAttacker) d.attackerCorrect += 1;
    if (d.mode === 'same' && !d.defenderIsBot && d.thisRoundDefender) d.defenderCorrect += 1;
    d.round += 1;
    d.revealed = false;
    d.thisRoundAttacker = null;
    d.thisRoundDefender = null;
    d.selectedKey = null;
    if (d.round >= d.questions.length) {
      d.outcome = resolveDuel(d);
    }
    renderAll();
  }

  function handleDuelContinue() {
    var wasRevive = game.duel.mode === 'revive';
    game.duel = null;
    if (wasRevive) {
      renderAll();
      return;
    }
    consumeSelectedToken();
  }

  function chooseTarget(index) {
    var attacker = game.pendingAttacker;
    var target = game.pendingTargets[index];
    game.pendingAttacker = null;
    game.pendingTargets = null;
    beginDuel(attacker.team, attacker.charIndex, target.team, target.charIndex);
  }

  function scheduleBotStep(fn) {
    if (game.botActionScheduled) return;
    game.botActionScheduled = true;
    setTimeout(function () {
      game.botActionScheduled = false;
      fn();
    }, BOT_STEP_DELAY);
  }

  function botChooseCharacterForToken(team, tokenValue) {
    var yardChar = null;
    var activeChar = null;
    team.characters.forEach(function (c, idx) {
      if (!characterHasLegalMove(team, c, tokenValue)) return;
      if (c.localStep === HOME) {
        if (yardChar === null) yardChar = idx;
        return;
      }
      if (activeChar === null || c.localStep < team.characters[activeChar].localStep) {
        activeChar = idx;
      }
    });
    if ((tokenValue === 1 || tokenValue === 6) && yardChar !== null) {
      return { charIndex: yardChar, release: true };
    }
    if (activeChar !== null) return { charIndex: activeChar, release: false };
    return null;
  }

  function botPlayToken() {
    var team = currentTeam();
    var tokenIndex = -1;
    for (var i = 0; i < game.tokens.length; i++) {
      if (teamHasAnyLegalMove(team, game.tokens[i])) {
        tokenIndex = i;
        break;
      }
    }
    if (tokenIndex === -1) return;
    var tokenValue = game.tokens[tokenIndex];
    var choice = botChooseCharacterForToken(team, tokenValue);
    if (!choice) return;
    game.selectedTokenIndex = tokenIndex;
    selectCharacter(team.key, choice.charIndex);
    if (choice.release) return;
    var character = team.characters[choice.charIndex];
    var forwardStep = clampStep(character.localStep + tokenValue);
    moveCharacterTo(forwardStep);
  }

  function botAttemptRevive() {
    var team = currentTeam();
    var opportunities = computeReviveOpportunities(team);
    if (!opportunities.length) return false;
    var charIndex = opportunities[0].charIndex;
    var correct = botAnswerCount(team, 3);
    var chance = CROSS_CLASS_KILL_CHANCE[correct];
    var character = team.characters[charIndex];
    character.knockedOut = false;
    if (Math.random() >= chance) character.dead = true;
    renderAll();
    return true;
  }

  function botTakeAction() {
    if (!game || game.winner) return;
    var team = currentTeam();
    if (!team.isBot) return;

    if (game.duel) {
      if (game.duel.round >= game.duel.questions.length) {
        scheduleBotStep(handleDuelContinue);
      }
      return;
    }
    if (game.pendingTargets) {
      scheduleBotStep(function () { chooseTarget(0); });
      return;
    }
    if (computeReviveOpportunities(team).length) {
      scheduleBotStep(function () {
        botAttemptRevive();
        maybeContinueBot();
      });
      return;
    }
    if (game.phase === 'rolling') {
      scheduleBotStep(onRoll);
      return;
    }
    if (turnHasNothingLeft()) {
      scheduleBotStep(endTurn);
      return;
    }
    scheduleBotStep(function () {
      botPlayToken();
      maybeContinueBot();
    });
  }

  function maybeContinueBot() {
    if (!game || game.winner) return;
    if (!currentTeam().isBot) return;
    botTakeAction();
  }

  function consumeSelectedToken() {
    game.tokens.splice(game.selectedTokenIndex, 1);
    game.selectedTokenIndex = -1;
    hintEl.textContent = '';
    if (game.tokens.length > 0 && !anyTokenUsable()) {
      hintEl.textContent = 'Remaining rolls (' + game.tokens.join(', ') + ') have no legal moves. End your turn when ready.';
    }
    renderAll();
    maybeContinueBot();
  }

  function gridStyle(row, col, rowSpan, colSpan) {
    var r = row + 1;
    var c = col + 1;
    return 'grid-row:' + r + ' / span ' + (rowSpan || 1) + ';grid-column:' + c + ' / span ' + (colSpan || 1) + ';';
  }

  function renderBoardShell() {
    var html = '';

    Object.keys(YARD_ORIGIN).forEach(function (key) {
      var origin = YARD_ORIGIN[key];
      html += '<div class="bio-ludo-yard bio-ludo-yard--' + key + '" style="' + gridStyle(origin[0], origin[1], 6, 6) + '">' +
        '<div class="bio-ludo-yard-slots" data-yard="' + key + '"></div>' +
        '</div>';
    });

    html += '<div class="bio-ludo-center" style="' + gridStyle(6, 6, 3, 3) + '"></div>';

    for (var i = 0; i < 52; i++) {
      var rc = RING[i];
      var isSafe = !!SAFE_RING_INDICES[i];
      html += '<div class="bio-ludo-cell bio-ludo-cell--path' + (isSafe ? ' bio-ludo-cell--safe' : '') +
        '" data-ring-index="' + i + '" style="' + gridStyle(rc[0], rc[1], 1, 1) + '">' +
        (isSafe ? '<span class="bio-ludo-safe-star">&#9733;</span>' : '') + '</div>';
    }

    Object.keys(HOME_COLUMNS).forEach(function (key) {
      HOME_COLUMNS[key].forEach(function (rc) {
        html += '<div class="bio-ludo-cell bio-ludo-cell--home bio-ludo-cell--home-' + key +
          '" style="' + gridStyle(rc[0], rc[1], 1, 1) + '"></div>';
      });
    });

    boardEl.innerHTML = html;

    Object.keys(YARD_ORIGIN).forEach(function (key) {
      var slotsEl = boardEl.querySelector('.bio-ludo-yard-slots[data-yard="' + key + '"]');
      var slotHtml = '';
      for (var s = 0; s < 4; s++) {
        slotHtml += '<div class="bio-ludo-yard-slot" data-team="' + key + '" data-char="' + s + '"></div>';
      }
      slotsEl.innerHTML = slotHtml;
    });
  }

  function pieceHtml(team, charIndex) {
    var def = CLASS_DEFS[charIndex];
    var character = team.characters[charIndex];
    var cls = 'bio-ludo-piece bio-ludo-piece--' + team.key + (character.knockedOut ? ' is-knocked-out' : '');
    var title = team.label + ' ' + def.label + (character.knockedOut ? ' (knocked out)' : '');
    return '<div class="' + cls + '" data-team="' + team.key +
      '" data-char="' + charIndex + '" title="' + title + '">' + def.badge + '</div>';
  }

  function renderPieces() {
    var byYard = {};
    var ringOccupants = {};

    boardEl.querySelectorAll('.bio-ludo-yard-slot').forEach(function (el) {
      el.innerHTML = '';
    });
    if (piecesLayer) piecesLayer.innerHTML = '';

    game.teams.forEach(function (team) {
      team.characters.forEach(function (character, charIndex) {
        if (character.dead) return;
        if (character.localStep === HOME) {
          var slot = boardEl.querySelector('.bio-ludo-yard-slot[data-team="' + team.key + '"][data-char="' + charIndex + '"]');
          if (slot) slot.innerHTML = pieceHtml(team, charIndex);
          return;
        }
        if (character.localStep === FINISHED) return;
        var rc = cellForCharacter(team, character.localStep);
        if (!rc) return;
        var key = rc[0] + ',' + rc[1];
        ringOccupants[key] = ringOccupants[key] || [];
        ringOccupants[key].push({ team: team, charIndex: charIndex });
      });
    });

    Object.keys(ringOccupants).forEach(function (key) {
      var parts = key.split(',');
      var row = parseInt(parts[0], 10);
      var col = parseInt(parts[1], 10);
      var wrap = document.createElement('div');
      wrap.className = 'bio-ludo-piece-stack';
      wrap.style.cssText = gridStyle(row, col, 1, 1);
      ringOccupants[key].forEach(function (occ) {
        wrap.insertAdjacentHTML('beforeend', pieceHtml(occ.team, occ.charIndex));
      });
      piecesLayer.appendChild(wrap);
    });
  }

  function renderHighlights() {
    if (!highlightsLayer) return;
    highlightsLayer.innerHTML = '';
    if (!game.moveOptions.length) return;
    var team = currentTeam();
    game.moveOptions.forEach(function (opt) {
      var rc = cellForCharacter(team, opt.step);
      if (!rc) return;
      var el = document.createElement('div');
      el.className = 'bio-ludo-highlight';
      el.style.cssText = gridStyle(rc[0], rc[1], 1, 1);
      el.setAttribute('data-target-step', opt.step);
      highlightsLayer.appendChild(el);
    });
  }

  function renderUnsafeZoneStatus() {
    if (!unsafeStatusEl) return;
    var uz = game.unsafeZone;
    if (!uz || !uz.active) {
      unsafeStatusEl.hidden = true;
      return;
    }
    unsafeStatusEl.hidden = false;
    var safeLabel = TEAM_DEFS[uz.safeKey].label;
    if (uz.done) {
      unsafeStatusEl.textContent = 'Unsafe Zone: the flagbearers have reached ' + safeLabel + "'s zone. The dead zone is gone.";
      return;
    }
    if (game.turnCounter < 4) {
      unsafeStatusEl.textContent = 'Unsafe Zone: flagbearers wake up once every team has had a first turn. Safe Team: ' + safeLabel + '.';
      return;
    }
    if (uz.homeStepsRemaining > 0) {
      unsafeStatusEl.textContent = 'Unsafe Zone: flagbearers emerging from ' + TEAM_DEFS[uz.oppositeKey].label + "'s home path. Safe Team: " + safeLabel + '.';
      return;
    }
    unsafeStatusEl.textContent = 'Unsafe Zone: flagbearers ' + uz.ringSteps + ' / 26 blocks toward ' + safeLabel + "'s zone. Dead zone growing behind them, near " + TEAM_DEFS[uz.oppositeKey].label + "'s corner.";
  }

  function renderUnsafeZone() {
    renderUnsafeZoneStatus();
    boardEl.querySelectorAll('[data-ring-index]').forEach(function (el) {
      var idx = parseInt(el.getAttribute('data-ring-index'), 10);
      el.classList.toggle('is-dead-zone', isInDeadZone(idx));
    });
    if (!flagbearersLayer) return;
    flagbearersLayer.innerHTML = '';
    var uz = game.unsafeZone;
    if (!uz || !uz.active) return;
    if (uz.homeStepsRemaining > 0) {
      var rc = HOME_COLUMNS[uz.oppositeKey][uz.homeStepsRemaining - 1];
      var el = document.createElement('div');
      el.className = 'bio-ludo-flagbearer';
      el.style.cssText = gridStyle(rc[0], rc[1], 1, 1);
      el.title = 'Unsafe Zone flagbearers';
      el.textContent = '🚩🚩';
      flagbearersLayer.appendChild(el);
      return;
    }
    var globals = unsafeZoneFlagbearerGlobals();
    if (!globals) return;
    [globals.cw, globals.ccw].forEach(function (g) {
      var gc = ringCoord(g);
      var fEl = document.createElement('div');
      fEl.className = 'bio-ludo-flagbearer';
      fEl.style.cssText = gridStyle(gc[0], gc[1], 1, 1);
      fEl.title = 'Unsafe Zone flagbearer';
      fEl.textContent = '🚩';
      flagbearersLayer.appendChild(fEl);
    });
  }

  function targetChoiceHtml() {
    var html = '<p class="bio-ludo-duel-heading">Choose a target</p><div class="bio-ludo-duel-target-list">';
    game.pendingTargets.forEach(function (t, i) {
      var def = CLASS_DEFS[t.charIndex];
      html += '<button type="button" class="bio-ludo-duel-target-btn" data-target-index="' + i + '">' +
        t.team.label + ' ' + def.label + '</button>';
    });
    html += '</div>';
    return html;
  }

  function duelScoreRowHtml(role, label, value) {
    return '<div class="bio-ludo-duel-score-row"><span>' + label + ' correct?</span>' +
      '<button type="button" class="bio-ludo-duel-yn' + (value === true ? ' is-selected' : '') +
      '" data-role="' + role + '" data-value="true">Yes</button>' +
      '<button type="button" class="bio-ludo-duel-yn' + (value === false ? ' is-selected' : '') +
      '" data-role="' + role + '" data-value="false">No</button></div>';
  }

  function gradableOptionsHtml(q, selectedKey) {
    var html = '<div class="bio-ludo-gradable-options">';
    q.options.forEach(function (opt) {
      var cls = 'bio-ludo-gradable-option';
      if (selectedKey) {
        if (opt.key === q.answer) cls += ' is-correct';
        else if (opt.key === selectedKey) cls += ' is-incorrect';
      }
      html += '<button type="button" class="' + cls + '" data-option-key="' + escapeHtml(opt.key) + '"' +
        (selectedKey ? ' disabled' : '') + '>' + escapeHtml(opt.key) + '. ' + escapeHtml(opt.text) + '</button>';
    });
    html += '</div>';
    if (selectedKey) {
      html += '<div class="bio-ludo-duel-solution">' + escapeHtml(q.explanation || '') + '</div>';
    }
    return html;
  }

  function duelQuestionHtml(d) {
    var q = d.questions[d.round];
    var headingText;
    var attackerLabel;
    var defenderLabel;
    if (d.mode === 'revive') {
      attackerLabel = d.reviveTeam.label + ' ' + CLASS_DEFS[d.reviveCharIndex].label;
      headingText = 'Reviving ' + attackerLabel + ': attempt ' + (d.round + 1) + ' / ' + d.questions.length;
    } else {
      attackerLabel = d.attackerTeam.label + ' ' + CLASS_DEFS[d.attackerCharIndex].label;
      defenderLabel = d.defenderTeam.label + ' ' + CLASS_DEFS[d.defenderCharIndex].label;
      headingText = attackerLabel + ' vs ' + defenderLabel + ': duel ' + (d.round + 1) + ' / ' + d.questions.length;
    }
    var html = '<p class="bio-ludo-duel-heading">' + headingText + '</p>';

    if (d.questionType === 'gradable') {
      html += '<div class="bio-ludo-duel-question">' + escapeHtml(q.text) + '</div>';
      html += gradableOptionsHtml(q, d.selectedKey);
      if (d.selectedKey) {
        html += '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-duel-next-btn">Next</button>';
      }
      return html;
    }

    html += '<div class="bio-ludo-duel-question">' + q.questionHtml + '</div>';
    if (!d.revealed) {
      html += '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-duel-reveal-btn">Reveal answer</button>';
      return html;
    }
    html += '<div class="bio-ludo-duel-solution">' + q.solutionHtml + '</div>';
    html += '<div class="bio-ludo-duel-score">';
    html += duelScoreRowHtml('attacker', attackerLabel, d.thisRoundAttacker);
    if (d.mode === 'same') {
      html += duelScoreRowHtml('defender', defenderLabel, d.thisRoundDefender);
    }
    var ready = d.thisRoundAttacker !== null && (d.mode !== 'same' || d.thisRoundDefender !== null);
    html += '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-duel-next-btn"' + (ready ? '' : ' disabled') + '>Next</button>';
    html += '</div>';
    return html;
  }

  function duelResultHtml(d) {
    return '<p class="bio-ludo-duel-heading">' + d.outcome + '</p>' +
      '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-duel-continue-btn">Continue</button>';
  }

  function renderDuel() {
    if (game.pendingTargets) {
      duelEl.hidden = false;
      duelCardEl.innerHTML = targetChoiceHtml();
      return;
    }
    if (!game.duel) {
      duelEl.hidden = true;
      duelCardEl.innerHTML = '';
      return;
    }
    duelEl.hidden = false;
    var d = game.duel;
    duelCardEl.innerHTML = d.round >= d.questions.length ? duelResultHtml(d) : duelQuestionHtml(d);
  }

  function renderRevivePanel() {
    if (game.duel || game.pendingTargets) {
      revivePanelEl.hidden = true;
      return;
    }
    var opportunities = computeReviveOpportunities(currentTeam());
    if (!opportunities.length) {
      revivePanelEl.hidden = true;
      revivePanelEl.innerHTML = '';
      return;
    }
    revivePanelEl.hidden = false;
    revivePanelEl.innerHTML = '<p class="bio-ludo-revive-heading">Knocked-out teammate in reach:</p>' +
      opportunities.map(function (o) {
        var def = CLASS_DEFS[o.charIndex];
        return '<button type="button" class="bio-ludo-revive-btn" data-char-index="' + o.charIndex + '">Revive ' + def.label + '</button>';
      }).join('');
  }

  function renderHud() {
    var team = currentTeam();
    turnIndicator.textContent = team.label + "'s turn";
    turnIndicator.className = 'bio-ludo-turn-indicator bio-ludo-turn-indicator--' + team.key;

    rollBtn.disabled = game.phase !== 'rolling' || !!(game.duel || game.pendingTargets);

    tokensEl.innerHTML = game.tokens.map(function (v, i) {
      var usable = teamHasAnyLegalMove(team, v);
      var cls = 'bio-ludo-token' + (i === game.selectedTokenIndex ? ' is-selected' : '') + (usable ? '' : ' is-dead');
      return '<button type="button" class="' + cls + '" data-token-index="' + i + '"' + (usable ? '' : ' disabled') + '>' + v + '</button>';
    }).join('');

    endTurnBtn.disabled = !!(game.duel || game.pendingTargets) || !(game.phase === 'assigning' && turnHasNothingLeft());
  }

  function checkWinCondition() {
    if (game.winner) return;
    var finishedTeam = game.teams.filter(function (t) {
      return t.characters.every(function (c) { return c.localStep === FINISHED; });
    })[0];
    if (finishedTeam) {
      game.winner = finishedTeam.key;
      game.winReason = 'finished';
      return;
    }
    if (game.teams.length > 1) {
      var alive = game.teams.filter(function (t) {
        return t.characters.some(function (c) { return !c.dead; });
      });
      if (alive.length === 1) {
        game.winner = alive[0].key;
        game.winReason = 'lastStanding';
      }
    }
  }

  function renderGameOver() {
    if (!gameOverEl) return;
    if (!game.winner) {
      gameOverEl.hidden = true;
      return;
    }
    gameOverEl.hidden = false;
    var winnerTeam = game.teams.filter(function (t) { return t.key === game.winner; })[0];
    var reasonText = game.winReason === 'finished'
      ? 'brought all four characters home first.'
      : 'is the last team standing.';
    gameOverCardEl.innerHTML = '<p class="bio-ludo-duel-heading">' + escapeHtml(winnerTeam.label) +
      ' wins!</p><p class="bio-ludo-duel-question">' + escapeHtml(winnerTeam.label) + ' ' + reasonText + '</p>' +
      '<button type="button" class="bio-ludo-duel-btn" id="bio-ludo-gameover-restart-btn">Play again</button>';
  }

  function renderAll() {
    checkWinCondition();
    renderPieces();
    renderHighlights();
    renderUnsafeZone();
    renderHud();
    renderDuel();
    renderRevivePanel();
    renderGameOver();
  }

  setupBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.hasAttribute('data-teams')) {
        var count = parseInt(btn.getAttribute('data-teams'), 10);
        startSetup(TEAM_ORDER_BY_COUNT[count], []);
        return;
      }
      if (btn.getAttribute('data-bot-mode') === '1v3') {
        setupEl.hidden = true;
        botSetupEl.hidden = false;
      }
    });
  });

  botDifficultyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var difficulty = btn.getAttribute('data-bot-difficulty');
      startSetup(['red', 'green', 'yellow', 'blue'], ['green', 'yellow', 'blue'], difficulty);
    });
  });

  rollBtn.addEventListener('click', onRoll);
  endTurnBtn.addEventListener('click', function () {
    if (!endTurnBtn.disabled) endTurn();
  });

  tokensEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.bio-ludo-token');
    if (!btn) return;
    selectToken(parseInt(btn.getAttribute('data-token-index'), 10));
  });

  highlightsLayer.addEventListener('click', function (e) {
    var el = e.target.closest('.bio-ludo-highlight');
    if (!el) return;
    moveCharacterTo(parseInt(el.getAttribute('data-target-step'), 10));
  });

  duelEl.addEventListener('click', function (e) {
    if (preGame) {
      handlePreGameClick(e);
      return;
    }
    var targetBtn = e.target.closest('.bio-ludo-duel-target-btn');
    if (targetBtn) {
      chooseTarget(parseInt(targetBtn.getAttribute('data-target-index'), 10));
      return;
    }
    if (e.target.id === 'bio-ludo-duel-reveal-btn') {
      handleDuelReveal();
      return;
    }
    var ynBtn = e.target.closest('.bio-ludo-duel-yn');
    if (ynBtn) {
      handleDuelScore(ynBtn.getAttribute('data-role'), ynBtn.getAttribute('data-value') === 'true');
      return;
    }
    var optBtn = e.target.closest('.bio-ludo-gradable-option');
    if (optBtn) {
      handleGradableAnswer(optBtn.getAttribute('data-option-key'));
      return;
    }
    if (e.target.id === 'bio-ludo-duel-next-btn') {
      if (!e.target.disabled) handleDuelNext();
      return;
    }
    if (e.target.id === 'bio-ludo-duel-continue-btn') {
      handleDuelContinue();
    }
  });

  revivePanelEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.bio-ludo-revive-btn');
    if (!btn) return;
    beginRevive(currentTeam(), parseInt(btn.getAttribute('data-char-index'), 10));
  });

  app.addEventListener('click', function (e) {
    var pieceEl = e.target.closest('.bio-ludo-piece');
    var slotEl = e.target.closest('.bio-ludo-yard-slot');
    var target = pieceEl || slotEl;
    if (!target || !game) return;
    var teamKey = target.getAttribute('data-team');
    var charIndex = parseInt(target.getAttribute('data-char'), 10);
    selectCharacter(teamKey, charIndex);
  });

  gameOverEl.addEventListener('click', function (e) {
    if (e.target.id !== 'bio-ludo-gameover-restart-btn') return;
    game = null;
    gameEl.hidden = true;
    gameOverEl.hidden = true;
    gameOverCardEl.innerHTML = '';
    botSetupEl.hidden = true;
    setupEl.hidden = false;
  });
})();
