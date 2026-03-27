// intro-solo.js
// Automatically plays a short drum solo when the page first loads.
// To disable, simply remove (or comment out) the <script> tag for this file in index.html.
(function () {
    // Beat pattern: [delay_ms, instrument_name]
    // Spaced so that the same instrument is never hit within 100 ms of itself
    // (honouring the debounce in main.js).
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

    // ── Secret combo: hit all 6 instruments to trigger the solo ──────────────
    const ALL_INSTRUMENTS = new Set(['crash', 'hihat', 'tom', 'snare', 'bass', 'floortom']);
    let soloPlaying = false;
    let hitSoFar    = new Set();

    function setupComboListener() {
        document.querySelectorAll('[data-instrument]').forEach(function (el) {
            el.addEventListener('pointerdown', function () {
                if (soloPlaying) return;           // ignore hits fired by the solo itself
                hitSoFar.add(el.getAttribute('data-instrument'));
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

    // Defer until DOMContentLoaded (safe whether the script is deferred or not),
    // then add a short pause so main.js has finished setting up its listeners.
    function init() {
        setupComboListener();
        setTimeout(playSolo, 600);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
