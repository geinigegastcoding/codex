const KEY_BINDINGS = {
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
  ArrowUp: 'jump',
  w: 'jump',
  W: 'jump',
  ' ': 'jump',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  Shift: 'ability',
  x: 'ability',
  X: 'ability',
};

const CONTROL_KEYS = new Set(Object.keys(KEY_BINDINGS));

export function createInput(target = window, buttonRoot = document) {
  const pressed = { left: false, right: false, down: false, jump: false, ability: false };
  const edges = { jumpPressed: false, abilityPressed: false };
  const cleanups = [];

  const setKey = (event, value) => {
    const action = KEY_BINDINGS[event.key];
    if (!action) {
      return;
    }
    event.preventDefault();
    if (value && !pressed[action] && action === 'jump') {
      edges.jumpPressed = true;
    }
    if (value && !pressed[action] && action === 'ability') {
      edges.abilityPressed = true;
    }
    pressed[action] = value;
  };

  const keydown = (event) => setKey(event, true);
  const keyup = (event) => setKey(event, false);
  const blur = () => {
    Object.keys(pressed).forEach((key) => { pressed[key] = false; });
    edges.jumpPressed = false;
    edges.abilityPressed = false;
  };
  target.addEventListener('keydown', keydown);
  target.addEventListener('keyup', keyup);
  target.addEventListener('blur', blur);
  cleanups.push(() => target.removeEventListener('keydown', keydown));
  cleanups.push(() => target.removeEventListener('keyup', keyup));
  cleanups.push(() => target.removeEventListener('blur', blur));

  for (const button of buttonRoot.querySelectorAll('[data-input]')) {
    const action = button.dataset.input;
    if (!['left', 'right', 'down', 'jump', 'ability'].includes(action)) {
      continue;
    }
    const press = (event) => {
      event.preventDefault();
      if (!pressed[action] && action === 'jump') {
        edges.jumpPressed = true;
      }
      if (!pressed[action] && action === 'ability') {
        edges.abilityPressed = true;
      }
      pressed[action] = true;
      button.classList.add('is-pressed');
    };
    const release = (event) => {
      event.preventDefault();
      pressed[action] = false;
      button.classList.remove('is-pressed');
    };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    cleanups.push(() => button.removeEventListener('pointerdown', press));
    cleanups.push(() => button.removeEventListener('pointerup', release));
    cleanups.push(() => button.removeEventListener('pointercancel', release));
    cleanups.push(() => button.removeEventListener('pointerleave', release));
  }

  return {
    snapshot() {
      const snapshot = { ...pressed, ...edges };
      edges.jumpPressed = false;
      edges.abilityPressed = false;
      return snapshot;
    },
    isControlKey(key) {
      return CONTROL_KEYS.has(key);
    },
    destroy() {
      cleanups.forEach((cleanup) => cleanup());
    },
  };
}
