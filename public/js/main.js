document.addEventListener('DOMContentLoaded', function () {
    // Set-up audio resources
    const sfxCrash = new Howl({src: ['./audio/crash.mp3']});
    const sfxHihat = new Howl({src: ['./audio/hihat.mp3']});
    const sfxTom = new Howl({src: ['./audio/tom.mp3']});
    const sfxSnare = new Howl({src: ['./audio/snare.mp3']});
    const sfxBass = new Howl({src: ['./audio/bass.mp3']});
    const sfxFloortom = new Howl({src: ['./audio/floortom.mp3']});

    // Loop repeat intervals (ms) per instrument – different timings let you layer a beat
    const loopConfig = {
        crash:    2000,   // ~whole note at 120 BPM
        hihat:    250,    // ~8th note at 120 BPM
        tom:      750,    // ~dotted quarter at 120 BPM
        snare:    1000,   // ~half note / backbeat at 120 BPM
        bass:     500,    // ~quarter note at 120 BPM
        floortom: 1500,   // ~dotted half at 120 BPM
    };

    // Tracks active loops: instrument name → setInterval ID
    const activeLoops = {};
    window._drumKitActiveLoops = activeLoops;

    function playSound(instrument) {
        switch (instrument) {
            case 'crash':    sfxCrash.play();    break;
            case 'hihat':    sfxHihat.play();    break;
            case 'tom':      sfxTom.play();      break;
            case 'snare':    sfxSnare.play();    break;
            case 'bass':     sfxBass.play();     break;
            default:         sfxFloortom.play(); break;
        }
    }

    // Function to change background colour
    function addRandomClassToBody() {
        const classes = ['purple', 'blue', 'pink', 'yellow'];
        let randomIndex = Math.floor(Math.random() * classes.length);
        let randomClass = classes[randomIndex];
        const currentClass = document.body.className;
        while (currentClass === randomClass) {
            randomIndex = Math.floor(Math.random() * classes.length);
            randomClass = classes[randomIndex];
        }
        // Add the random class to the body element
        document.body.className = randomClass;
    }

    // Sparkle colours
    const sparkleColors = ['#BD93F9', '#66D9EF', '#FF79C6', '#F1FA8C', '#ffffff', '#FFB86C'];

    function emitRings(el, ringCount) {
        ringCount = ringCount !== undefined ? ringCount : 3;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        for (let i = 0; i < ringCount; i++) {
            const ring = document.createElement('span');
            ring.className = 'ring';
            ring.style.left = cx + 'px';
            ring.style.top = cy + 'px';
            ring.style.animationDelay = (i * 0.15) + 's';
            ring.style.setProperty('--ring-color', sparkleColors[Math.floor(Math.random() * sparkleColors.length)]);
            document.body.appendChild(ring);
            ring.addEventListener('animationend', function () { ring.remove(); }, {once: true});
        }
    }

    const sparkleShapes = ['sparkle-circle', 'sparkle-diamond', 'sparkle-triangle', 'sparkle-star'];

    function emitSparkles(x, y, count) {
        count = count !== undefined ? count : 16;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            const shape = sparkleShapes[Math.floor(Math.random() * sparkleShapes.length)];
            el.className = 'sparkle ' + shape;
            const angle = (i / count) * 2 * Math.PI;
            const distance = 80 + Math.random() * 120;
            el.style.left = (x - 24) + 'px';
            el.style.top = (y - 24) + 'px';
            el.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            el.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            el.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            document.body.appendChild(el);
            el.addEventListener('animationend', function () { el.remove(); }, {once: true});
        }
    }

    function fadeOut(el) {
        el.style.transition = 'opacity 0.4s';
        el.style.opacity = '0';
        el.addEventListener('transitionend', function () {
            el.style.display = 'none';
        }, {once: true});
    }

    // Instrument touch/click event
    document.querySelectorAll('.instrument').forEach(function (el) {
        el.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });

        const instrument = el.getAttribute('data-instrument');
        let lastPlayTime = 0;
        let holdTimer = null;

        function triggerPlay(x, y, trusted) {
            emitSparkles(x, y, trusted ? 16 : 4);
            emitRings(el, trusted ? 3 : 1);
            if (trusted) addRandomClassToBody();
            playSound(instrument);
        }

        el.addEventListener('pointerdown', function (event) {
            event.preventDefault();

            // Immediate single hit on press (debounced)
            const now = Date.now();
            if (now - lastPlayTime >= 100) {
                lastPlayTime = now;
                triggerPlay(event.clientX, event.clientY, event.isTrusted);
            }

            // Hold 500ms → toggle loop on/off (skip for synthetic combo events)
            if (!event.isTrusted) return;
            holdTimer = setTimeout(function () {
                if (activeLoops[instrument]) {
                    clearInterval(activeLoops[instrument]);
                    delete activeLoops[instrument];
                    el.classList.remove('looping');
                } else {
                    el.classList.add('looping');
                    const interval = loopConfig[instrument] ?? 1000;
                    activeLoops[instrument] = setInterval(function () {
                        const r = el.getBoundingClientRect();
                        triggerPlay(r.left + r.width / 2, r.top + r.height / 2, true);
                    }, interval);
                }
            }, 500);
        });

        el.addEventListener('pointerup', function () {
            clearTimeout(holdTimer);
        });

        el.addEventListener('pointercancel', function () {
            clearTimeout(holdTimer);
        });

        el.addEventListener('pointerleave', function () {
            clearTimeout(holdTimer);
        });
    });

    // Hide demo controls
    const hideBtn = document.getElementById('hide-democontrols');
    if (hideBtn) {
        hideBtn.addEventListener('click', function (event) {
            event.preventDefault();
            fadeOut(this);
            fadeOut(document.getElementById('demobar'));
            fadeOut(document.getElementById('demolinks'));
        });
    }

    // Display cache version
    if ('caches' in window) {
        caches.keys().then(function (keys) {
            const key = keys.find(function (k) { return k.startsWith('drum-kit'); });
            if (key) {
                const el = document.getElementById('cache-version');
                if (el) el.textContent = key;
            }
        });
    }
});