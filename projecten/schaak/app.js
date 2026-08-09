const FILES = 'abcdefgh';
const PROMOTIONS = ['q', 'r', 'b', 'n'];
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const PIECE_LETTERS = { k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N', p: '' };

const opposite = (color) => (color === 'w' ? 'b' : 'w');

function clonePiece(piece) {
  return piece ? { ...piece } : null;
}

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function cloneBoard(board) {
  return board.map((row) => row.map(clonePiece));
}

function squareToCoords(square) {
  if (!/^[a-h][1-8]$/.test(square)) throw new Error(`Invalid square: ${square}`);
  return { x: FILES.indexOf(square[0]), y: Number(square[1]) - 1 };
}

function coordsToSquare(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8 ? `${FILES[x]}${y + 1}` : null;
}

function isInside(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function cloneCastling(castling) {
  return {
    w: { k: castling.w.k, q: castling.w.q },
    b: { k: castling.b.k, q: castling.b.q },
  };
}

class ChessGame {
  constructor(fen = START_FEN) {
    this.history = [];
    this.moveHistory = [];
    this.loadFEN(fen);
  }

  loadFEN(fen) {
    const [placement, turn = 'w', castling = '-', enPassant = '-', halfmove = '0', fullmove = '1'] = fen.trim().split(/\s+/);
    this.board = emptyBoard();

    placement.split('/').forEach((rankText, rankIndex) => {
      let x = 0;
      const y = 7 - rankIndex;
      for (const symbol of rankText) {
        if (/\d/.test(symbol)) {
          x += Number(symbol);
          continue;
        }
        if (x > 7 || !/[prnbqkPRNBQK]/.test(symbol)) throw new Error(`Invalid FEN: ${fen}`);
        this.board[y][x] = {
          type: symbol.toLowerCase(),
          color: symbol === symbol.toUpperCase() ? 'w' : 'b',
        };
        x += 1;
      }
      if (x !== 8) throw new Error(`Invalid FEN rank: ${rankText}`);
    });

    this.turn = turn === 'b' ? 'b' : 'w';
    this.castling = {
      w: { k: castling.includes('K'), q: castling.includes('Q') },
      b: { k: castling.includes('k'), q: castling.includes('q') },
    };
    this.enPassant = enPassant === '-' ? null : enPassant;
    this.halfmove = Number(halfmove) || 0;
    this.fullmove = Number(fullmove) || 1;
    this.history = [];
    this.moveHistory = [];
    return this;
  }

  pieceAt(square) {
    const { x, y } = squareToCoords(square);
    return clonePiece(this.board[y][x]);
  }

  snapshot() {
    return {
      board: cloneBoard(this.board),
      turn: this.turn,
      castling: cloneCastling(this.castling),
      enPassant: this.enPassant,
      halfmove: this.halfmove,
      fullmove: this.fullmove,
    };
  }

  restore(snapshot) {
    this.board = cloneBoard(snapshot.board);
    this.turn = snapshot.turn;
    this.castling = cloneCastling(snapshot.castling);
    this.enPassant = snapshot.enPassant;
    this.halfmove = snapshot.halfmove;
    this.fullmove = snapshot.fullmove;
  }

  legalMovesFrom(square) {
    const piece = this.pieceAt(square);
    if (!piece || piece.color !== this.turn) return [];
    return this.legalMoves(this.turn).filter((move) => move.from === square);
  }

  legalMoves(color = this.turn) {
    return this.pseudoMoves(color).filter((move) => {
      const before = this.snapshot();
      this.applyMove(move);
      const safe = !this.isInCheck(color);
      this.restore(before);
      return safe;
    });
  }

  makeMove(from, to, promotion = 'q') {
    const requestedPromotion = PROMOTIONS.includes(promotion) ? promotion : 'q';
    const move = this.legalMovesFrom(from).find(
      (candidate) => candidate.to === to && (!candidate.promotion || candidate.promotion === requestedPromotion),
    );
    if (!move) return null;

    const before = this.snapshot();
    this.history.push(before);
    const moveNumber = this.fullmove;
    const applied = this.applyMove(move);
    this.moveHistory.push({
      color: move.color,
      moveNumber,
      notation: this.formatMove(move),
      from,
      to,
      captured: applied.captured,
    });
    return applied;
  }

  undo() {
    const previous = this.history.pop();
    if (!previous) return false;
    this.restore(previous);
    this.moveHistory.pop();
    return true;
  }

  status() {
    const inCheck = this.isInCheck(this.turn);
    const moves = this.legalMoves(this.turn);
    if (moves.length === 0) {
      return inCheck
        ? { phase: 'checkmate', winner: opposite(this.turn) }
        : { phase: 'stalemate', winner: null };
    }
    return { phase: inCheck ? 'check' : 'playing', winner: null };
  }

  isInCheck(color) {
    let kingSquare = null;
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const piece = this.board[y][x];
        if (piece?.type === 'k' && piece.color === color) kingSquare = coordsToSquare(x, y);
      }
    }
    return kingSquare ? this.isSquareAttacked(kingSquare, opposite(color)) : true;
  }

  isSquareAttacked(square, byColor) {
    const { x, y } = squareToCoords(square);
    const pawnY = y + (byColor === 'w' ? -1 : 1);
    for (const pawnX of [x - 1, x + 1]) {
      if (isInside(pawnX, pawnY) && this.board[pawnY][pawnX]?.color === byColor && this.board[pawnY][pawnX]?.type === 'p') {
        return true;
      }
    }

    const knightOffsets = [
      [1, 2], [2, 1], [2, -1], [1, -2],
      [-1, -2], [-2, -1], [-2, 1], [-1, 2],
    ];
    for (const [dx, dy] of knightOffsets) {
      const piece = isInside(x + dx, y + dy) ? this.board[y + dy][x + dx] : null;
      if (piece?.color === byColor && piece.type === 'n') return true;
    }

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (this.rayAttacked(x, y, dx, dy, byColor, ['r', 'q'])) return true;
    }
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      if (this.rayAttacked(x, y, dx, dy, byColor, ['b', 'q'])) return true;
    }

    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if (!dx && !dy) continue;
        const piece = isInside(x + dx, y + dy) ? this.board[y + dy][x + dx] : null;
        if (piece?.color === byColor && piece.type === 'k') return true;
      }
    }
    return false;
  }

  rayAttacked(x, y, dx, dy, byColor, types) {
    let nextX = x + dx;
    let nextY = y + dy;
    while (isInside(nextX, nextY)) {
      const piece = this.board[nextY][nextX];
      if (piece) return piece.color === byColor && types.includes(piece.type);
      nextX += dx;
      nextY += dy;
    }
    return false;
  }

  pseudoMoves(color) {
    const moves = [];
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const piece = this.board[y][x];
        if (piece?.color !== color) continue;
        const from = coordsToSquare(x, y);
        if (piece.type === 'p') this.pawnMoves(from, piece, moves);
        if (piece.type === 'n') this.knightMoves(from, piece, moves);
        if (piece.type === 'b') this.slideMoves(from, piece, moves, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
        if (piece.type === 'r') this.slideMoves(from, piece, moves, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
        if (piece.type === 'q') this.slideMoves(from, piece, moves, [
          [1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1],
        ]);
        if (piece.type === 'k') this.kingMoves(from, piece, moves);
      }
    }
    return moves;
  }

  addMove(moves, from, to, piece, extra = {}) {
    const { x, y } = squareToCoords(to);
    const target = this.board[y][x];
    if (target?.color === piece.color) return;
    moves.push({
      from,
      to,
      color: piece.color,
      pieceType: piece.type,
      capture: Boolean(target) || Boolean(extra.enPassant),
      ...extra,
    });
  }

  pawnMoves(from, piece, moves) {
    const { x, y } = squareToCoords(from);
    const direction = piece.color === 'w' ? 1 : -1;
    const startY = piece.color === 'w' ? 1 : 6;
    const lastY = piece.color === 'w' ? 7 : 0;
    const addPawnMove = (to, extra = {}) => {
      const { y: toY } = squareToCoords(to);
      if (toY === lastY) {
        PROMOTIONS.forEach((promotion) => this.addMove(moves, from, to, piece, { ...extra, promotion }));
      } else {
        this.addMove(moves, from, to, piece, extra);
      }
    };

    const oneY = y + direction;
    if (isInside(x, oneY) && !this.board[oneY][x]) {
      addPawnMove(coordsToSquare(x, oneY));
      const twoY = y + direction * 2;
      if (y === startY && !this.board[twoY][x]) addPawnMove(coordsToSquare(x, twoY));
    }

    for (const targetX of [x - 1, x + 1]) {
      if (!isInside(targetX, oneY)) continue;
      const targetSquare = coordsToSquare(targetX, oneY);
      const target = this.board[oneY][targetX];
      if (target?.color && target.color !== piece.color) addPawnMove(targetSquare);
      if (targetSquare === this.enPassant && !target) addPawnMove(targetSquare, { enPassant: true });
    }
  }

  knightMoves(from, piece, moves) {
    const { x, y } = squareToCoords(from);
    for (const [dx, dy] of [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]) {
      if (isInside(x + dx, y + dy)) this.addMove(moves, from, coordsToSquare(x + dx, y + dy), piece);
    }
  }

  slideMoves(from, piece, moves, directions) {
    const { x, y } = squareToCoords(from);
    for (const [dx, dy] of directions) {
      let nextX = x + dx;
      let nextY = y + dy;
      while (isInside(nextX, nextY)) {
        const target = this.board[nextY][nextX];
        if (!target) {
          this.addMove(moves, from, coordsToSquare(nextX, nextY), piece);
        } else {
          this.addMove(moves, from, coordsToSquare(nextX, nextY), piece);
          break;
        }
        nextX += dx;
        nextY += dy;
      }
    }
  }

  kingMoves(from, piece, moves) {
    const { x, y } = squareToCoords(from);
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        if ((!dx && !dy) || !isInside(x + dx, y + dy)) continue;
        this.addMove(moves, from, coordsToSquare(x + dx, y + dy), piece);
      }
    }

    const home = piece.color === 'w' ? 'e1' : 'e8';
    if (from !== home || this.isInCheck(piece.color)) return;
    const enemy = opposite(piece.color);
    const rights = this.castling[piece.color];
    const empty = (squares) => squares.every((square) => !this.pieceAt(square));
    if (rights.k && this.pieceAt(piece.color === 'w' ? 'h1' : 'h8')?.type === 'r' && empty([piece.color === 'w' ? 'f1' : 'f8', piece.color === 'w' ? 'g1' : 'g8'])) {
      const through = piece.color === 'w' ? 'f1' : 'f8';
      const destination = piece.color === 'w' ? 'g1' : 'g8';
      if (!this.isSquareAttacked(through, enemy) && !this.isSquareAttacked(destination, enemy)) {
        this.addMove(moves, from, destination, piece, { castle: 'k' });
      }
    }
    if (rights.q && this.pieceAt(piece.color === 'w' ? 'a1' : 'a8')?.type === 'r' && empty([piece.color === 'w' ? 'b1' : 'b8', piece.color === 'w' ? 'c1' : 'c8', piece.color === 'w' ? 'd1' : 'd8'])) {
      const through = piece.color === 'w' ? 'd1' : 'd8';
      const destination = piece.color === 'w' ? 'c1' : 'c8';
      if (!this.isSquareAttacked(through, enemy) && !this.isSquareAttacked(destination, enemy)) {
        this.addMove(moves, from, destination, piece, { castle: 'q' });
      }
    }
  }

  clearCastling(color, side) {
    this.castling[color][side] = false;
  }

  clearRookRight(square) {
    const rights = { a1: ['w', 'q'], h1: ['w', 'k'], a8: ['b', 'q'], h8: ['b', 'k'] }[square];
    if (rights) this.clearCastling(rights[0], rights[1]);
  }

  applyMove(move) {
    const { x: fromX, y: fromY } = squareToCoords(move.from);
    const { x: toX, y: toY } = squareToCoords(move.to);
    const piece = clonePiece(this.board[fromY][fromX]);
    const target = clonePiece(this.board[toY][toX]);
    const capturedSquare = move.enPassant ? coordsToSquare(toX, toY + (piece.color === 'w' ? -1 : 1)) : move.to;
    const captured = move.enPassant ? clonePiece(this.pieceAt(capturedSquare)) : target;

    this.board[fromY][fromX] = null;
    if (move.enPassant) {
      const { x: captureX, y: captureY } = squareToCoords(capturedSquare);
      this.board[captureY][captureX] = null;
    }
    this.board[toY][toX] = { type: move.promotion || piece.type, color: piece.color };

    if (move.castle) {
      const rank = piece.color === 'w' ? '1' : '8';
      const rookFrom = move.castle === 'k' ? `h${rank}` : `a${rank}`;
      const rookTo = move.castle === 'k' ? `f${rank}` : `d${rank}`;
      const { x: rookFromX, y: rookFromY } = squareToCoords(rookFrom);
      const { x: rookToX, y: rookToY } = squareToCoords(rookTo);
      this.board[rookToY][rookToX] = this.board[rookFromY][rookFromX];
      this.board[rookFromY][rookFromX] = null;
    }

    if (piece.type === 'k') {
      this.clearCastling(piece.color, 'k');
      this.clearCastling(piece.color, 'q');
    }
    if (piece.type === 'r') this.clearRookRight(move.from);
    if (captured?.type === 'r') this.clearRookRight(capturedSquare);

    this.enPassant = null;
    if (piece.type === 'p' && Math.abs(toY - fromY) === 2) {
      this.enPassant = coordsToSquare(fromX, (fromY + toY) / 2);
    }
    this.halfmove = piece.type === 'p' || captured ? 0 : this.halfmove + 1;
    if (piece.color === 'b') this.fullmove += 1;
    this.turn = opposite(piece.color);

    return { ...move, piece: clonePiece(piece), captured };
  }

  formatMove(move) {
    if (move.castle === 'k') return 'O-O';
    if (move.castle === 'q') return 'O-O-O';
    const capture = move.capture ? '×' : '·';
    const piece = PIECE_LETTERS[move.pieceType];
    const promotion = move.promotion ? `=${move.promotion.toUpperCase()}` : '';
    return `${piece}${move.from}${capture}${move.to}${promotion}`;
  }
}

export { ChessGame, FILES, PIECE_VALUES, START_FEN, coordsToSquare, opposite, squareToCoords };

const PIECE_PROFILES = {
  w: {
    k: { name: 'Koharu', role: 'Moon Empress', seed: 'koharu-moon' },
    q: { name: 'Akari', role: 'Rose Oracle', seed: 'akari-rose' },
    r: { name: 'Sena', role: 'Sky Sentinel', seed: 'sena-sky' },
    b: { name: 'Yuna', role: 'Lantern Mystic', seed: 'yuna-lantern' },
    n: { name: 'Rin', role: 'Cloud Rider', seed: 'rin-cloud' },
    p: { name: 'Mika', role: 'Dawn Adept', seed: 'mika-dawn' },
  },
  b: {
    k: { name: 'Tsukiko', role: 'Night Empress', seed: 'tsukiko-night' },
    q: { name: 'Rei', role: 'Ink Oracle', seed: 'rei-ink' },
    r: { name: 'Nami', role: 'Obsidian Sentinel', seed: 'nami-obsidian' },
    b: { name: 'Ayame', role: 'Velvet Mystic', seed: 'ayame-velvet' },
    n: { name: 'Noa', role: 'Storm Rider', seed: 'noa-storm' },
    p: { name: 'Kuroha', role: 'Dusk Adept', seed: 'kuroha-dusk' },
  },
};

const PIECE_SYMBOLS = { k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N', p: 'P' };
const PIECE_TITLES = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

function profileFor(piece, square) {
  const base = PIECE_PROFILES[piece.color][piece.type];
  return { ...base, seed: `${base.seed}-${square}` };
}

function avatarUrl(piece, square) {
  const profile = profileFor(piece, square);
  const backdrop = piece.color === 'w' ? 'f8e8df' : '242a45';
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(profile.seed)}&backgroundType=solid&backgroundColor=${backdrop}&radius=50`;
}

function fallbackAvatar(piece, square) {
  const dark = piece.color === 'b';
  const skin = dark ? '#f0b9a9' : '#ffd6c8';
  const hair = dark ? '#24213a' : '#4b2940';
  const accent = dark ? '#d7a4c9' : '#e8877c';
  const eye = dark ? '#f6d5ef' : '#56324c';
  const mark = PIECE_SYMBOLS[piece.type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${dark ? '#17182d' : '#fff6ee'}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><circle cx="80" cy="80" r="78" fill="url(#g)"/><path d="M25 75c0-38 22-58 55-58s55 20 55 58v44H25Z" fill="${hair}"/><ellipse cx="80" cy="82" rx="35" ry="43" fill="${skin}"/><path d="M46 60c8-25 26-37 53-28 9 3 18 12 20 25-17-8-31-14-52-9-7 2-14 7-21 12Z" fill="${hair}"/><path d="M42 76c10-12 15-20 17-35M118 75c-10-12-15-20-17-35" fill="none" stroke="${hair}" stroke-width="12" stroke-linecap="round"/><circle cx="67" cy="82" r="5" fill="${eye}"/><circle cx="93" cy="82" r="5" fill="${eye}"/><path d="M70 104c7 5 13 5 20 0" fill="none" stroke="${eye}" stroke-width="3" stroke-linecap="round"/><circle cx="132" cy="128" r="20" fill="${dark ? '#f0ccd9' : '#f3b3a5'}"/><text x="132" y="136" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="${dark ? '#2b1b39' : '#602d42'}">${mark}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function pieceLabel(piece, square) {
  const profile = profileFor(piece, square);
  return `${profile.name}, ${profile.role}, ${PIECE_TITLES[piece.type]} ${square}`;
}

function boardPieceElement(piece, square) {
  const wrapper = document.createElement('span');
  wrapper.className = `board-piece piece-${piece.type}`;
  const image = document.createElement('img');
  image.className = 'piece-avatar';
  image.src = avatarUrl(piece, square);
  image.alt = pieceLabel(piece, square);
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.src = fallbackAvatar(piece, square);
    image.classList.add('is-fallback');
  }, { once: true });
  wrapper.append(image);
  return wrapper;
}

function mountChessApp(root = document) {
  const board = root.querySelector('#board');
  if (!board) return;

  let game = new ChessGame();
  let selectedSquare = null;
  let flipped = false;
  let pendingPromotion = null;

  const els = {
    gameMessage: root.querySelector('#game-message'),
    phaseChip: root.querySelector('#phase-chip'),
    turnLabel: root.querySelector('#turn-label'),
    activeAvatar: root.querySelector('#active-avatar'),
    activeName: root.querySelector('#active-name'),
    activeRole: root.querySelector('#active-role'),
    moveList: root.querySelector('#move-list'),
    moveCount: root.querySelector('#move-count'),
    capturedList: root.querySelector('#captured-list'),
    undo: root.querySelector('#undo-btn'),
    promotion: root.querySelector('#promotion-modal'),
    promotionButtons: root.querySelectorAll('[data-promotion]'),
  };

  const colorName = (color) => (color === 'w' ? 'Wit' : 'Zwart');
  const currentStatus = () => game.status();

  function findKing(color) {
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        if (game.board[y][x]?.type === 'k' && game.board[y][x]?.color === color) return coordsToSquare(x, y);
      }
    }
    return null;
  }

  function renderBoard() {
    const visibleRanks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
    const visibleFiles = flipped ? [...FILES].reverse() : [...FILES];
    const selectedMoves = selectedSquare ? game.legalMovesFrom(selectedSquare) : [];
    const status = currentStatus();
    const checkedKing = status.phase === 'check' ? findKing(game.turn) : null;
    const lastMove = game.moveHistory.at(-1);
    board.replaceChildren();

    visibleRanks.forEach((rank) => {
      visibleFiles.forEach((file) => {
        const square = `${file}${rank}`;
        const piece = game.pieceAt(square);
        const cell = document.createElement('button');
        const targetMove = selectedMoves.find((move) => move.to === square);
        cell.type = 'button';
        cell.className = `board-square ${((FILES.indexOf(file) + rank) % 2 === 0) ? 'square-light' : 'square-dark'}`;
        cell.dataset.square = square;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', piece ? pieceLabel(piece, square) : `Leeg veld ${square}`);
        if (selectedSquare === square) cell.classList.add('is-selected');
        if (targetMove) cell.classList.add(targetMove.capture ? 'is-capture-target' : 'is-legal-target');
        if (lastMove && (lastMove.from === square || lastMove.to === square)) cell.classList.add('is-last-move');
        if (checkedKing === square) cell.classList.add('is-check');
        if (piece) cell.append(boardPieceElement(piece, square));
        if (file === (flipped ? 'h' : 'a')) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coordinate coordinate-rank';
          rankLabel.textContent = rank;
          cell.append(rankLabel);
        }
        if (rank === (flipped ? 8 : 1)) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coordinate coordinate-file';
          fileLabel.textContent = file;
          cell.append(fileLabel);
        }
        cell.addEventListener('click', () => handleSquareClick(square));
        board.append(cell);
      });
    });
  }

  function renderPanel() {
    const status = currentStatus();
    const profilePiece = { type: status.winner ? 'q' : 'k', color: status.winner || game.turn };
    const profile = profileFor(profilePiece, status.winner ? 'g7' : 'e1');
    const image = els.activeAvatar;
    image.src = avatarUrl(profilePiece, status.winner ? 'g7' : 'e1');
    image.alt = profile.name;
    image.onerror = () => {
      image.src = fallbackAvatar(profilePiece, status.winner ? 'g7' : 'e1');
    };
    els.activeName.textContent = profile.name;
    els.activeRole.textContent = profile.role;
    els.turnLabel.textContent = status.winner ? `${colorName(status.winner)} wint` : `${colorName(game.turn)} aan zet`;
    els.phaseChip.textContent = status.phase === 'playing' ? 'LIVE DUEL' : status.phase.toUpperCase();
    els.phaseChip.dataset.phase = status.phase;

    const messages = {
      playing: `${colorName(game.turn)} is aan zet. Kies een stuk om de lijnen te zien.`,
      check: `Schaak — ${colorName(game.turn)} moet reageren.`,
      checkmate: `Schaakmat — ${colorName(status.winner)} wint deze duelronde.`,
      stalemate: 'Pat — geen legale zetten meer, de ronde eindigt gelijk.',
    };
    els.gameMessage.textContent = messages[status.phase];
    els.moveCount.textContent = `${game.moveHistory.length} ${game.moveHistory.length === 1 ? 'zet' : 'zetten'}`;
    els.undo.disabled = game.history.length === 0;

    els.moveList.replaceChildren();
    if (!game.moveHistory.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'De eerste zet wacht op jou.';
      els.moveList.append(empty);
    } else {
      for (let index = 0; index < game.moveHistory.length; index += 2) {
        const row = document.createElement('div');
        const whiteMove = game.moveHistory[index];
        const blackMove = game.moveHistory[index + 1];
        row.className = 'move-row';
        row.innerHTML = `<span class="move-number">${whiteMove.moveNumber}.</span><span>${whiteMove.notation}</span><span>${blackMove?.notation || '—'}</span>`;
        els.moveList.append(row);
      }
      els.moveList.lastElementChild?.scrollIntoView({ block: 'nearest' });
    }

    els.capturedList.replaceChildren();
    const captured = game.moveHistory.flatMap((move) => move.captured ? [{ ...move.captured, by: opposite(move.color) }] : []);
    if (!captured.length) {
      const empty = document.createElement('span');
      empty.className = 'captured-empty';
      empty.textContent = 'Nog geen stukken uitgeschakeld';
      els.capturedList.append(empty);
    } else {
      captured.forEach((piece, index) => {
        const token = document.createElement('span');
        token.className = 'captured-token';
        token.title = `${PIECE_TITLES[piece.type]} uitgeschakeld`;
        token.append(boardPieceElement(piece, `a${index + 1}`));
        els.capturedList.append(token);
      });
    }
  }

  function closePromotion() {
    pendingPromotion = null;
    els.promotion.hidden = true;
  }

  function commitMove(from, to, promotion = 'q') {
    const result = game.makeMove(from, to, promotion);
    if (!result) return;
    selectedSquare = null;
    closePromotion();
    render();
  }

  function openPromotion(from, to) {
    pendingPromotion = { from, to };
    els.promotion.hidden = false;
    els.promotion.querySelector('[data-promotion="q"]')?.focus();
  }

  function handleSquareClick(square) {
    const piece = game.pieceAt(square);
    if (selectedSquare) {
      const candidates = game.legalMovesFrom(selectedSquare).filter((move) => move.to === square);
      if (candidates.length) {
        if (candidates.some((move) => move.promotion)) openPromotion(selectedSquare, square);
        else commitMove(selectedSquare, square);
        return;
      }
      selectedSquare = piece?.color === game.turn ? square : null;
    } else if (piece?.color === game.turn) {
      selectedSquare = square;
    }
    renderBoard();
  }

  function render() {
    renderBoard();
    renderPanel();
  }

  root.querySelector('#new-game')?.addEventListener('click', () => {
    game = new ChessGame();
    selectedSquare = null;
    closePromotion();
    render();
  });
  els.undo?.addEventListener('click', () => {
    if (game.undo()) {
      selectedSquare = null;
      render();
    }
  });
  root.querySelector('#flip-board')?.addEventListener('click', () => {
    flipped = !flipped;
    root.querySelector('#flip-board').setAttribute('aria-pressed', String(flipped));
    renderBoard();
  });
  root.querySelector('#close-promotion')?.addEventListener('click', closePromotion);
  els.promotionButtons.forEach((button) => button.addEventListener('click', () => {
    if (pendingPromotion) commitMove(pendingPromotion.from, pendingPromotion.to, button.dataset.promotion);
  }));

  render();
}

if (typeof document !== 'undefined') {
  const boot = () => mountChessApp(document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}
