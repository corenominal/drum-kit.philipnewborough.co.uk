// intro-solo.js
// Automatically plays a short drum solo when the page first loads.
// To disable, simply remove (or comment out) the <script> tag for this file in index.html.
(function () {

    // ── Solo patterns ─────────────────────────────────────────────────────────
    // Each entry is [delay_ms, instrument]. Same instrument is always >= 150 ms
    // apart to honour the 100 ms debounce in main.js.

    // Classic intro solo — plays on load and when all 6 instruments are hit once
    const classicHits = [
        [   0, 'crash'   ],
        [   0, 'bass'    ],
        [ 300, 'hihat'   ],
        [ 600, 'hihat'   ],
        [ 600, 'snare'   ],
        [ 900, 'hihat'   ],
        [1200, 'bass'    ],
        [1200, 'hihat'   ],
        [1500, 'snare'   ],
        [1500, 'hihat'   ],
        [1800, 'hihat'   ],
        [2100, 'tom'     ],
        [2280, 'tom'     ],
        [2460, 'snare'   ],
        [2640, 'floortom'],
        [2820, 'bass'    ],
        [2950, 'snare'   ],
        [3080, 'snare'   ],
        [3300, 'crash'   ],
        [3300, 'bass'    ],
    ];

    // Per-instrument solos — triggered by 3 consecutive hits on that instrument
    const SOLOS = {
        crash: {
            duration: 4500,
            hits: [
                [   0, 'crash'],
                [ 300, 'crash'],
                [ 300, 'bass' ],
                [ 600, 'crash'],
                [ 900, 'crash'],
                [ 900, 'hihat'],
                [1200, 'crash'],
                [1200, 'bass' ],
                [1500, 'crash'],
                [1500, 'hihat'],
                [1800, 'crash'],
                [2100, 'crash'],
                [2100, 'bass' ],
                [2400, 'crash'],
                [2400, 'hihat'],
                [2700, 'crash'],
                [2700, 'snare'],
                [2900, 'crash'],
                [3100, 'crash'],
                [3100, 'bass' ],
                [3300, 'crash'],
                [3300, 'bass' ],
            ],
        },
        hihat: {
            duration: 4500,
            hits: [
                [   0, 'hihat'],
                [ 150, 'hihat'],
                [ 300, 'hihat'],
                [ 300, 'snare'],
                [ 450, 'hihat'],
                [ 600, 'hihat'],
                [ 600, 'bass' ],
                [ 750, 'hihat'],
                [ 900, 'hihat'],
                [ 900, 'snare'],
                [1050, 'hihat'],
                [1200, 'hihat'],
                [1200, 'bass' ],
                [1350, 'hihat'],
                [1500, 'hihat'],
                [1500, 'snare'],
                [1650, 'hihat'],
                [1800, 'hihat'],
                [1950, 'hihat'],
                [1950, 'bass' ],
                [2100, 'hihat'],
                [2100, 'snare'],
                [2250, 'hihat'],
                [2400, 'hihat'],
                [2550, 'hihat'],
                [2550, 'bass' ],
                [2700, 'hihat'],
                [2850, 'hihat'],
                [2850, 'snare'],
                [3000, 'hihat'],
                [3000, 'crash'],
                [3000, 'bass' ],
            ],
        },
        tom: {
            duration: 5000,
            hits: [
                [   0, 'tom'     ],
                [ 180, 'tom'     ],
                [ 360, 'floortom'],
                [ 540, 'tom'     ],
                [ 720, 'floortom'],
                [ 900, 'tom'     ],
                [1080, 'crash'   ],
                [1080, 'bass'    ],
                [1350, 'tom'     ],
                [1500, 'tom'     ],
                [1650, 'floortom'],
                [1800, 'tom'     ],
                [1950, 'floortom'],
                [2100, 'tom'     ],
                [2280, 'snare'   ],
                [2400, 'snare'   ],
                [2550, 'tom'     ],
                [2700, 'floortom'],
                [2850, 'tom'     ],
                [3000, 'tom'     ],
                [3150, 'floortom'],
                [3300, 'tom'     ],
                [3420, 'tom'     ],
                [3540, 'floortom'],
                [3660, 'crash'   ],
                [3660, 'bass'    ],
                [3660, 'tom'     ],
            ],
        },
        snare: {
            duration: 4500,
            hits: [
                [   0, 'snare'],
                [ 200, 'snare'],
                [ 400, 'snare'],
                [ 400, 'bass' ],
                [ 600, 'snare'],
                [ 750, 'snare'],
                [ 900, 'snare'],
                [ 900, 'bass' ],
                [1050, 'snare'],
                [1200, 'snare'],
                [1200, 'hihat'],
                [1350, 'snare'],
                [1500, 'snare'],
                [1500, 'bass' ],
                [1650, 'snare'],
                [1800, 'snare'],
                [1800, 'tom'  ],
                [2000, 'snare'],
                [2200, 'snare'],
                [2200, 'bass' ],
                [2400, 'snare'],
                [2550, 'snare'],
                [2700, 'snare'],
                [2700, 'hihat'],
                [2850, 'snare'],
                [3000, 'snare'],
                [3000, 'bass' ],
                [3150, 'snare'],
                [3300, 'crash'],
                [3300, 'snare'],
                [3300, 'bass' ],
            ],
        },
        bass: {
            duration: 5000,
            hits: [
                [   0, 'bass'    ],
                [ 300, 'bass'    ],
                [ 300, 'floortom'],
                [ 600, 'bass'    ],
                [ 900, 'bass'    ],
                [ 900, 'hihat'   ],
                [1200, 'bass'    ],
                [1200, 'floortom'],
                [1500, 'bass'    ],
                [1500, 'snare'   ],
                [1800, 'bass'    ],
                [2100, 'bass'    ],
                [2100, 'floortom'],
                [2400, 'bass'    ],
                [2400, 'snare'   ],
                [2600, 'bass'    ],
                [2800, 'bass'    ],
                [2800, 'floortom'],
                [3000, 'bass'    ],
                [3000, 'snare'   ],
                [3200, 'bass'    ],
                [3200, 'floortom'],
                [3400, 'crash'   ],
                [3400, 'bass'    ],
            ],
        },
        floortom: {
            duration: 5000,
            hits: [
                [   0, 'floortom'],
                [ 200, 'floortom'],
                [ 400, 'floortom'],
                [ 400, 'bass'    ],
                [ 600, 'floortom'],
                [ 800, 'floortom'],
                [ 800, 'tom'     ],
                [1000, 'floortom'],
                [1000, 'bass'    ],
                [1200, 'floortom'],
                [1400, 'floortom'],
                [1400, 'snare'   ],
                [1600, 'floortom'],
                [1600, 'bass'    ],
                [1800, 'floortom'],
                [1800, 'tom'     ],
                [2000, 'floortom'],
                [2200, 'floortom'],
                [2200, 'bass'    ],
                [2400, 'floortom'],
                [2400, 'snare'   ],
                [2600, 'floortom'],
                [2800, 'floortom'],
                [2800, 'tom'     ],
                [3000, 'floortom'],
                [3000, 'bass'    ],
                [3200, 'floortom'],
                [3300, 'crash'   ],
                [3300, 'floortom'],
                [3300, 'bass'    ],
            ],
        },
    };

    function fireHit(instrument) {
        const el = document.querySelector('[data-instrument="' + instrument + '"]');
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        el.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles:     true,
            cancelable:  true,
            clientX:     cx,
            clientY:     cy,
            pointerId:   1,
            pointerType: 'mouse'
        }));
    }

    function playHits(hitList) {
        hitList.forEach(function (hit) {
            setTimeout(function () { fireHit(hit[1]); }, hit[0]);
        });
    }

    function showCombo() {
        const existing = document.getElementById('combo-text');
        if (existing) existing.remove();
        const colors = ['#FF79C6', '#BD93F9', '#66D9EF', '#F1FA8C', '#FFB86C', '#ff5555'];
        const letters = 'COMBO!'.split('');
        const container = document.createElement('div');
        container.id = 'combo-text';
        letters.forEach(function (ch, i) {
            const span = document.createElement('span');
            span.className = 'combo-letter';
            span.textContent = ch;
            span.style.color = colors[i % colors.length];
            span.style.setProperty('--letter-delay', (i * 0.05) + 's');
            const angle = Math.random() * 2 * Math.PI;
            const dist = 150 + Math.random() * 130;
            span.style.setProperty('--ex', (Math.cos(angle) * dist).toFixed(1) + 'px');
            span.style.setProperty('--ey', (Math.sin(angle) * dist).toFixed(1) + 'px');
            span.style.setProperty('--spin', (Math.random() * 60 - 30).toFixed(1) + 'deg');
            span.style.setProperty('--er', (Math.random() * 90 - 45).toFixed(1) + 'deg');
            container.appendChild(span);
        });
        document.body.appendChild(container);
        // Remove after all letter animations complete
        setTimeout(function () { container.remove(); }, (letters.length - 1) * 50 + 1500);
    }

    // ── Combo state ───────────────────────────────────────────────────────────
    const ALL_INSTRUMENTS = new Set(['crash', 'hihat', 'tom', 'snare', 'bass', 'floortom']);
    let soloPlaying = false;
    let hitSoFar    = new Set();

    const streaks     = {};
    const resetTimers = {};
    ALL_INSTRUMENTS.forEach(function (name) {
        streaks[name]     = 0;
        resetTimers[name] = null;
    });
    const STREAK_COMBO    = 3;
    const STREAK_RESET_MS = 2000;

    function resetAllStreaks() {
        ALL_INSTRUMENTS.forEach(function (name) {
            streaks[name] = 0;
            clearTimeout(resetTimers[name]);
        });
    }

    // ── Pair combo: dynamically build a solo from two alternating instruments ──
    function generatePairSolo(instrA, instrB) {
        var hits    = [];
        var hasBass  = instrA === 'bass'  || instrB === 'bass';
        var hasCrash = instrA === 'crash' || instrB === 'crash';
        var kick     = hasBass  ? null : 'bass';
        var accent   = hasCrash ? null : 'crash';

        // Phase 1 — establish the A-B pattern (0–900 ms)
        [[0, instrA], [300, instrB], [600, instrA], [900, instrB]].forEach(function (h) { hits.push(h); });
        if (kick) hits.push([0, kick]);

        // Phase 2 — tighter interplay with kick support (1200–2100 ms)
        [[1200, instrA], [1380, instrB], [1560, instrA], [1740, instrB], [1920, instrA], [2100, instrB]].forEach(function (h) { hits.push(h); });
        if (kick) { hits.push([1200, kick]); hits.push([1920, kick]); }

        // Phase 3 — intensity build (2300–3050 ms)
        [[2300, instrA], [2450, instrB], [2600, instrA], [2750, instrB], [2900, instrA], [3050, instrB]].forEach(function (h) { hits.push(h); });
        if (kick) hits.push([2900, kick]);

        // Ending flourish
        if (accent) hits.push([3300, accent]);
        if (kick)   hits.push([3300, kick]);
        hits.push([3300, instrA]);

        return { hits: hits, duration: 4200 };
    }

    var pairBuffer     = [];
    var pairResetTimer = null;
    var PAIR_RESET_MS  = 3000;

    function resetPairBuffer() {
        pairBuffer = [];
        clearTimeout(pairResetTimer);
    }

    function setupComboListener() {
        document.querySelectorAll('[data-instrument]').forEach(function (el) {
            el.addEventListener('pointerdown', function (event) {
                if (!event.isTrusted) return;          // ignore synthetic solo events
                if (soloPlaying) return;
                if (window._drumKitActiveLoops && Object.keys(window._drumKitActiveLoops).length > 0) return;

                const instrument = el.getAttribute('data-instrument');

                // Track last 4 hits for A-B-A-B pair combo
                pairBuffer.push(instrument);
                if (pairBuffer.length > 4) pairBuffer.shift();
                clearTimeout(pairResetTimer);

                // Increment this instrument's streak; reset all others
                ALL_INSTRUMENTS.forEach(function (name) {
                    if (name !== instrument) {
                        streaks[name] = 0;
                        clearTimeout(resetTimers[name]);
                    }
                });
                streaks[instrument]++;
                clearTimeout(resetTimers[instrument]);

                // Check for 3-in-a-row combo
                if (streaks[instrument] >= STREAK_COMBO) {
                    resetAllStreaks();
                    resetPairBuffer();
                    hitSoFar    = new Set();
                    soloPlaying = true;
                    showCombo();
                    playHits(SOLOS[instrument].hits);
                    setTimeout(function () { soloPlaying = false; }, SOLOS[instrument].duration);
                    return;
                }

                // Check for A-B-A-B pair combo
                if (pairBuffer.length === 4) {
                    var pa = pairBuffer[0], pb = pairBuffer[1];
                    if (pa === pairBuffer[2] && pb === pairBuffer[3] && pa !== pb) {
                        resetAllStreaks();
                        resetPairBuffer();
                        hitSoFar    = new Set();
                        soloPlaying = true;
                        showCombo();
                        var combo = generatePairSolo(pa, pb);
                        playHits(combo.hits);
                        setTimeout(function () { soloPlaying = false; }, combo.duration);
                        return;
                    }
                }

                // Schedule streak reset if no follow-up hit arrives in time
                resetTimers[instrument] = setTimeout(function () {
                    streaks[instrument] = 0;
                }, STREAK_RESET_MS);

                // Schedule pair buffer reset if no follow-up hit arrives
                pairResetTimer = setTimeout(function () { pairBuffer = []; }, PAIR_RESET_MS);

                // All-6 combo: each instrument hit at least once
                hitSoFar.add(instrument);
                if (hitSoFar.size === ALL_INSTRUMENTS.size) {
                    resetAllStreaks();
                    resetPairBuffer();
                    hitSoFar    = new Set();
                    soloPlaying = true;
                    showCombo();
                    playHits(classicHits);
                    setTimeout(function () { soloPlaying = false; }, 4500);
                }
            }, true);  // capture so it runs before main.js's debounce check
        });
    }

    // Defer until DOMContentLoaded (safe whether the script is deferred or not),
    // then add a short pause so main.js has finished setting up its listeners.
    function init() {
        setupComboListener();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());

(function () {
    // ── Solo 1: classic kit — triggered on page load or all-6-instruments combo ──
    const hits = [
        // Downbeat
        [  0,   'crash'   ],
        [  0,   'bass'    ],
        // Hi-hat groove — bar 1
        [300,   'hihat'   ],
        [600,   'hihat'   ],
        [600,   'snare'   ],
        [900,   'hihat'   ],
        [1200,  'bass'    ],
        [1200,  'hihat'   ],
        [1500,  'snare'   ],
        [1500,  'hihat'   ],
        [1800,  'hihat'   ],
        // Tom fill
        [2100,  'tom'     ],
        [2280,  'tom'     ],
        [2460,  'snare'   ],
        [2640,  'floortom'],
        // Snare build
        [2820,  'bass'    ],
        [2950,  'snare'   ],
        [3080,  'snare'   ],
        // Final crash
        [3300,  'crash'   ],
        [3300,  'bass'    ],
    ];

    // ── Solo 2: monkey solo — triggered by 3 tom hits in a row ───────────────
    const monkeyHits = [
        // Opening tom barrage
        [   0,  'tom'     ],
        [ 180,  'tom'     ],
        [ 360,  'floortom'],
        [ 540,  'tom'     ],
        [ 720,  'floortom'],
        [ 900,  'tom'     ],
        // Crash accent
        [1080,  'crash'   ],
        [1080,  'bass'    ],
        // Tom triplets
        [1350,  'tom'     ],
        [1500,  'tom'     ],
        [1650,  'floortom'],
        [1800,  'tom'     ],
        [1950,  'floortom'],
        [2100,  'tom'     ],
        // Snare interruption
        [2280,  'snare'   ],
        [2400,  'snare'   ],
        // Back to toms
        [2550,  'tom'     ],
        [2700,  'floortom'],
        [2850,  'tom'     ],
        [3000,  'tom'     ],
        [3150,  'floortom'],
        // Big finish
        [3300,  'tom'     ],
        [3420,  'tom'     ],
        [3540,  'floortom'],
        [3660,  'crash'   ],
        [3660,  'bass'    ],
        [3660,  'tom'     ],
    ];

    function fireHit(instrument) {
        const el = document.querySelector('[data-instrument="' + instrument + '"]');
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        el.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles:     true,
            cancelable:  true,
            clientX:     cx,
            clientY:     cy,
            pointerId:   1,
            pointerType: 'mouse'
        }));
    }

    function playSolo() {
        hits.forEach(function (hit) {
            setTimeout(function () { fireHit(hit[1]); }, hit[0]);
        });
    }

    function playMonkeySolo() {
        monkeyHits.forEach(function (hit) {
            setTimeout(function () { fireHit(hit[1]); }, hit[0]);
        });
    }

    // ── Secret combo: hit all 6 instruments to trigger the solo ──────────────
    const ALL_INSTRUMENTS = new Set(['crash', 'hihat', 'tom', 'snare', 'bass', 'floortom']);
    let soloPlaying = false;
    let hitSoFar    = new Set();

    // ── Monkey combo: hit tom 3 times in a row ────────────────────────────────
    let tomStreak       = 0;
    const TOM_COMBO     = 3;
    const TOM_RESET_MS  = 2000; // streak resets if no tom hit within this window
    let tomResetTimer   = null;

    function setupComboListener() {
        document.querySelectorAll('[data-instrument]').forEach(function (el) {
            el.addEventListener('pointerdown', function (event) {
                if (!event.isTrusted) return;      // ignore synthetic solo events
                if (soloPlaying) return;           // ignore hits fired by the solo itself
                if (window._drumKitActiveLoops && Object.keys(window._drumKitActiveLoops).length > 0) return;

                const instrument = el.getAttribute('data-instrument');

                // Monkey combo tracking
                if (instrument === 'tom') {
                    tomStreak++;
                    clearTimeout(tomResetTimer);
                    if (tomStreak >= TOM_COMBO) {
                        tomStreak   = 0;
                        soloPlaying = true;
                        playMonkeySolo();
                        // longest monkey hit offset is 3660 ms; clear with a safe margin
                        setTimeout(function () { soloPlaying = false; }, 5000);
                        return;
                    }
                    tomResetTimer = setTimeout(function () { tomStreak = 0; }, TOM_RESET_MS);
                } else {
                    // Any non-tom hit resets the tom streak
                    tomStreak = 0;
                    clearTimeout(tomResetTimer);
                }

                // All-6 combo tracking
                hitSoFar.add(instrument);
                if (hitSoFar.size === ALL_INSTRUMENTS.size) {
                    hitSoFar = new Set();
                    soloPlaying = true;
                    playSolo();
                    // longest hit offset is 3300 ms; clear the flag with a safe margin
                    setTimeout(function () { soloPlaying = false; }, 4500);
                }
            }, true);  // capture so it runs before main.js's debounce check
        });
    }

    window.playSplashSolo = function () {
        if (soloPlaying) return;
        soloPlaying = true;
        playSolo();
        setTimeout(function () { soloPlaying = false; }, 4500);
    };

    // Defer until DOMContentLoaded (safe whether the script is deferred or not),
    // then add a short pause so main.js has finished setting up its listeners.
    function init() {
        setupComboListener();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
