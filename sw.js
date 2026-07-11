// Mini-Game Hub service worker — precaches every game for full offline play.
// Bump the version whenever any file changes so clients pick up the update.
const CACHE = 'mini-game-hub-v2';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    './2048.html',
    './aim-trainer.html',
    './air-hockey.html',
    './asteroids.html',
    './battleship.html',
    './breakout.html',
    './bubble-shooter.html',
    './checkers.html',
    './connect-four.html',
    './dino-runner.html',
    './doodle-jump.html',
    './flappy-bird.html',
    './frogger.html',
    './hangman.html',
    './lights-out.html',
    './memory-match.html',
    './minesweeper.html',
    './nonogram.html',
    './pacman.html',
    './pong.html',
    './reaction-time.html',
    './rock-paper-scissors.html',
    './simon-says.html',
    './snake.html',
    './solitaire.html',
    './space-invaders.html',
    './sudoku.html',
    './tetris.html',
    './tic-tac-toe.html',
    './trivia.html',
    './typing-test.html',
    './whack-a-mole.html',
    './wordle.html',
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Cache-first, then network; successful same-origin GETs are cached for next time.
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(hit => {
            if (hit) return hit;
            return fetch(e.request).then(res => {
                if (res.ok && new URL(e.request.url).origin === location.origin) {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, copy));
                }
                return res;
            });
        })
    );
});
