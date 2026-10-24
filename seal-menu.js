(function () {
    var GALLERY_REALMS = [
        { label: 'Physical Arts', href: 'physicalus.html' },
        { label: 'Artificial Arts', href: 'gallery.html' },
        { label: 'Cartomancy', href: 'cartomancy.html' },
        { label: 'Musical Theatre' },
        { label: 'Mineralogy' }
    ];

    var LIBRARY_REALMS = [
        { label: 'Liber / Ready', href: 'gate_left.html' },
        { label: 'Manuscript / Foul Papers', href: 'gate_right.html' },
        { label: 'Metalog', href: 'diy_realities.html' }
    ];

    var SECTION_REALMS = [
        { label: 'Section 1' },
        { label: 'Section 2' },
        { label: 'Section 3' },
        { label: 'Section 4' }
    ];

    var SERVICE_REALMS = [
        { label: 'Branding', href: 'branding.html' },
        { label: 'Business Strategy', href: 'business_strategy.html' },
        { label: 'Pricing', href: 'pricing.html' },
        { label: 'Contact', href: 'contact.html' }
    ];

    function pageStem() {
        var path = window.location.pathname.replace(/\\/g, '/');
        var parts = path.split('/').filter(Boolean);
        var file = parts.length ? parts[parts.length - 1] : '';
        return file.replace(/\.html$/, '');
    }

    var stem = pageStem();
    var REALMS = (stem === 'gallery' || stem === 'physicalus' || stem === 'cartomancy')
        ? GALLERY_REALMS
        : (stem === 'diy_realities' || stem === 'gate_left' || stem === 'gate_right')
            ? LIBRARY_REALMS
            : (stem === 'services' || stem === 'branding' || stem === 'business_strategy' || stem === 'pricing' || stem === 'contact')
                ? SERVICE_REALMS
                : SECTION_REALMS;

    var img = document.querySelector('header img');
    if (!img) return;

    var header = img.closest('header');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var open = false;
    var frameTimer = 0;

    var anchor = document.createElement('div');
    anchor.className = 'seal-anchor';
    img.parentNode.insertBefore(anchor, img);

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'seal-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'seal-menu');
    trigger.setAttribute('aria-label', 'Menu');
    anchor.appendChild(trigger);
    trigger.appendChild(img);

    var menu = document.createElement('div');
    menu.id = 'seal-menu';
    menu.className = 'seal-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');
    trigger.id = 'seal-trigger';
    menu.setAttribute('aria-labelledby', 'seal-trigger');
    anchor.appendChild(menu);

    var scroll = document.createElement('div');
    scroll.className = 'seal-scroll';
    scroll.setAttribute('aria-hidden', 'true');
    scroll.innerHTML = ''
        + '<img class="seal-scroll-top" src="art/seal-scroll-top.png" alt="" width="1161" height="194" decoding="async">'
        + '<i class="seal-scroll-rail seal-scroll-rail--left"></i>'
        + '<i class="seal-scroll-rail seal-scroll-rail--right"></i>'
        + '<img class="seal-scroll-bottom" src="art/seal-scroll-bottom.png" alt="" width="1149" height="217" decoding="async">';
    menu.appendChild(scroll);

    var meridian = document.createElement('span');
    meridian.className = 'seal-meridian';
    meridian.setAttribute('aria-hidden', 'true');
    menu.appendChild(meridian);

    var items = [];
    var step = 0;

    function addRule() {
        var rule = document.createElement('span');
        rule.className = 'seal-rule';
        rule.setAttribute('aria-hidden', 'true');
        rule.style.setProperty('--i', String(step));
        step += 1;
        var gem = document.createElement('i');
        rule.appendChild(gem);
        menu.appendChild(rule);
    }

    function addItem(label, kind, action, href) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'seal-item seal-item--' + kind;
        button.setAttribute('role', 'menuitem');
        button.style.setProperty('--i', String(step));
        step += 1;
        if (action) button.setAttribute('data-seal-action', action);
        if (href) {
            button.setAttribute('data-href', href);
            if (isHere(href)) {
                button.classList.add('is-here');
                button.setAttribute('aria-current', 'page');
            }
        } else if (kind === 'realm') {
            button.setAttribute('aria-disabled', 'true');
        }
        var gem = document.createElement('i');
        gem.className = 'seal-gem';
        gem.setAttribute('aria-hidden', 'true');
        var text = document.createElement('span');
        text.className = 'seal-label';
        text.textContent = label;
        button.appendChild(gem);
        button.appendChild(text);
        menu.appendChild(button);
        items.push(button);
        return button;
    }

    addItem('Return', 'meta', 'return');
    addRule();
    REALMS.forEach(function (realm) {
        addItem(realm.label, 'realm', '', realm.href || '');
    });
    addRule();
    addItem('Close Menu', 'meta', 'close');

    if ('inert' in menu) menu.inert = true;

    function hang() {
        var height = trigger.offsetHeight || img.offsetHeight || img.height || 0;
        if (height) menu.style.top = height + 'px';
    }

    function scrollers() {
        var roots = [];
        var hall = document.getElementById('hall');
        var nave = document.getElementById('nave');
        if (hall) roots.push(hall);
        if (nave) roots.push(nave);
        document.querySelectorAll('.floating-container, .terminal-container').forEach(function (el) {
            roots.push(el);
        });
        var doc = document.scrollingElement || document.documentElement;
        if (doc) roots.push(doc);
        return roots;
    }

    function scrollTop() {
        var behavior = reduced ? 'auto' : 'smooth';
        menu.scrollTop = 0;
        scrollers().forEach(function (el) {
            if (typeof el.scrollTo === 'function') {
                el.scrollTo({ top: 0, behavior: behavior });
            } else {
                el.scrollTop = 0;
            }
        });
    }

    function close(options) {
        if (!open) return;
        open = false;
        clearTimeout(frameTimer);
        header.classList.remove('is-seal-open');
        menu.classList.remove('is-open');
        menu.classList.remove('is-framed');
        menu.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        if ('inert' in menu) menu.inert = true;
        if (options && options.scroll) scrollTop();
        if (options && options.focus) trigger.focus();
    }

    function show() {
        hang();
        open = true;
        header.classList.add('is-seal-open');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        if ('inert' in menu) menu.inert = false;
        clearTimeout(frameTimer);
        if (reduced) {
            menu.classList.add('is-framed');
            return;
        }
        frameTimer = setTimeout(function () {
            if (open) menu.classList.add('is-framed');
        }, 700);
    }

    function toggle() {
        if (open) close({ scroll: false, focus: false });
        else show();
    }

    function goHome() {
        close({ scroll: false, focus: false });
        var exit = window.__aivoinkoSealExit;
        if (typeof exit === 'function') {
            exit();
            return;
        }
        window.location.href = 'index.html';
    }

    function isHere(href) {
        var path = window.location.pathname.replace(/\\/g, '/');
        var file = String(href).split('/').pop();
        var stem = file.replace(/\.html$/, '');
        return path.endsWith('/' + file) || path.endsWith('/' + stem);
    }

    function onItem(item) {
        var action = item.getAttribute('data-seal-action');
        if (action === 'return') {
            goHome();
            return;
        }
        if (action === 'close') {
            close({ scroll: true, focus: true });
            return;
        }
        var href = item.getAttribute('data-href');
        if (!href) return;
        if (isHere(href)) {
            close({ scroll: true, focus: true });
            return;
        }
        window.location.href = href;
    }

    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    });

    trigger.addEventListener('keydown', function (event) {
        if (!open) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close({ scroll: false, focus: true });
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            items[0].focus();
        }
    });

    menu.addEventListener('click', function (event) {
        var item = event.target.closest('[role="menuitem"]');
        if (!item || !menu.contains(item)) return;
        event.preventDefault();
        event.stopPropagation();
        onItem(item);
    });

    menu.addEventListener('keydown', function (event) {
        var index = items.indexOf(document.activeElement);
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            items[(index + 1 + items.length) % items.length].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (index <= 0) trigger.focus();
            else items[index - 1].focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            items[0].focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            items[items.length - 1].focus();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close({ scroll: false, focus: true });
        }
    });

    document.addEventListener('pointerdown', function (event) {
        if (!open) return;
        if (anchor.contains(event.target)) return;
        close({ scroll: false, focus: false });
    });

    document.addEventListener('keydown', function (event) {
        if (!open || event.key !== 'Escape') return;
        if (anchor.contains(document.activeElement)) return;
        close({ scroll: false, focus: true });
    });

    window.addEventListener('pageshow', function () {
        close({ scroll: false, focus: false });
    });

    window.addEventListener('resize', hang);
    if (img.complete) hang();
    else img.addEventListener('load', hang);
    requestAnimationFrame(hang);
})();
