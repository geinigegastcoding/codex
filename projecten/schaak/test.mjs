import assert from 'node:assert/strict';
import { ChessGame } from './app.js';

const test = (name, fn) => {
  fn();
  console.log(`ok - ${name}`);
};

test('starts with the standard position and two pawn choices', () => {
  const game = new ChessGame();

  assert.equal(game.turn, 'w');
  assert.deepEqual(game.legalMovesFrom('e2').map((move) => move.to).sort(), ['e3', 'e4']);
  assert.equal(game.pieceAt('e1').type, 'k');
});

test('allows a pawn to capture an opposing piece', () => {
  const game = new ChessGame('4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1');

  assert.ok(game.legalMovesFrom('e4').some((move) => move.to === 'd5'));
  game.makeMove('e4', 'd5');
  assert.deepEqual(game.pieceAt('d5'), { type: 'p', color: 'w' });
});

test('moves both pieces during legal castling', () => {
  const game = new ChessGame('4k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');

  assert.ok(game.legalMovesFrom('e1').some((move) => move.to === 'g1' && move.castle));
  game.makeMove('e1', 'g1');
  assert.deepEqual(game.pieceAt('g1'), { type: 'k', color: 'w' });
  assert.deepEqual(game.pieceAt('f1'), { type: 'r', color: 'w' });
});

test('supports en passant immediately after a double pawn move', () => {
  const game = new ChessGame('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1');

  game.makeMove('d7', 'd5');
  assert.ok(game.legalMovesFrom('e5').some((move) => move.to === 'd6' && move.enPassant));
  game.makeMove('e5', 'd6');
  assert.deepEqual(game.pieceAt('d6'), { type: 'p', color: 'w' });
  assert.equal(game.pieceAt('d5'), null);
});

test('promotes a pawn to the requested piece', () => {
  const game = new ChessGame('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');

  assert.equal(game.legalMovesFrom('a7').filter((move) => move.to === 'a8').length, 4);
  game.makeMove('a7', 'a8', 'q');
  assert.deepEqual(game.pieceAt('a8'), { type: 'q', color: 'w' });
});

test('recognizes a checkmate position', () => {
  const game = new ChessGame('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');

  assert.deepEqual(game.status(), { phase: 'checkmate', winner: 'w' });
});

test('undo restores the full position and side to move', () => {
  const game = new ChessGame();

  game.makeMove('e2', 'e4');
  assert.equal(game.turn, 'b');
  assert.equal(game.undo(), true);
  assert.equal(game.turn, 'w');
  assert.deepEqual(game.pieceAt('e2'), { type: 'p', color: 'w' });
  assert.equal(game.pieceAt('e4'), null);
});

console.log('All chess rule checks passed.');
