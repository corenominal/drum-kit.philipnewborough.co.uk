document.addEventListener('DOMContentLoaded', function () {
    // Set-up audio resources
    const sfxCrash = new Howl({src: ['./audio/crash.mp3']});
    const sfxHihat = new Howl({src: ['./audio/hihat.mp3']});
    const sfxTom = new Howl({src: ['./audio/tom.mp3']});
    const sfxSnare = new Howl({src: ['./audio/snare.mp3']});
    const sfxBass = new Howl({src: ['./audio/bass.mp3']});
    const sfxFloortom = new Howl({src: ['./audio/floortom.mp3']});

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

    function emitRings(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const count = 3;
        for (let i = 0; i < count; i++) {
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

    function emitSparkles(x, y) {
        const count = 16;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'sparkle';
            const angle = (i / count) * 2 * Math.PI;
            const distance = 80 + Math.random() * 120;
            el.style.left = (x - 14) + 'px';
            el.style.top = (y - 14) + 'px';
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
        ['touchstart', 'click'].forEach(function (eventType) {
            el.addEventListener(eventType, function (event) {
                event.preventDefault();
                const coords = event.touches ? event.touches[0] : event;
                emitSparkles(coords.clientX, coords.clientY);
                emitRings(this);
                addRandomClassToBody();
                const instrument = this.getAttribute('data-instrument');
                switch (instrument) {
                    case 'crash':
                        sfxCrash.play();
                        break;
                    case 'hihat':
                        sfxHihat.play();
                        break;
                    case 'tom':
                        sfxTom.play();
                        break;
                    case 'snare':
                        sfxSnare.play();
                        break;
                    case 'bass':
                        sfxBass.play();
                        break;
                    default:
                        sfxFloortom.play();
                        break;
                }
            });
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
});