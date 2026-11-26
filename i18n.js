(function () {
    var KEY = 'taikoi.lang';
    var ORIGIN = 'https://taikoi.netlify.app';
    var LANGS = { fi: true, en: true };
    var root = document.documentElement;
    var stay = root.hasAttribute('data-i18n-stay');
    var dict = null;
    var cache = {};
    var lang = 'fi';
    var prefixed = false;
    var domReady = document.readyState !== 'loading';
    var applied = false;
    var loadSeq = 0;

    var pendingStyle = document.createElement('style');
    pendingStyle.textContent = 'html.i18n-pending{background:#000}html.i18n-pending body{visibility:hidden}';
    document.head.appendChild(pendingStyle);

    function storageGet() {
        try {
            return localStorage.getItem(KEY) || '';
        } catch (err) {
            return '';
        }
    }

    function storageSet(value) {
        try {
            localStorage.setItem(KEY, value);
        } catch (err) {
            /* private mode */
        }
    }

    function guess() {
        var stored = storageGet();
        if (stored === 'fi' || stored === 'en') return stored;
        var nav = (navigator.language || 'fi').toLowerCase();
        return nav.indexOf('en') === 0 ? 'en' : 'fi';
    }

    function pathname() {
        return (location.pathname || '/').replace(/\\/g, '/');
    }

    function publicPath() {
        var path = pathname().replace(/^\/(fi|en)(?=\/|$)/, '') || '/';
        if (path === '/index.html') return '/';
        return path;
    }

    function langPath(code) {
        var path = publicPath();
        if (path === '/' || path === '') return '/' + code + '/';
        return '/' + code + path;
    }

    function absoluteLang(code) {
        return ORIGIN + langPath(code) + location.search + location.hash;
    }

    function show() {
        root.classList.remove('i18n-pending');
    }

    function lookup(source, key) {
        if (!source || !key) return undefined;
        var parts = key.split('.');
        var node = source;
        for (var i = 0; i < parts.length; i++) {
            if (!node || typeof node !== 'object') return undefined;
            node = node[parts[i]];
        }
        return typeof node === 'string' ? node : undefined;
    }

    function t(key) {
        var value = lookup(dict, key);
        return value === undefined ? '' : value;
    }

    function setAttr(el, name, key) {
        var value = t(key);
        if (!value) return;
        if (name === 'content') el.setAttribute('content', value);
        else el.setAttribute(name, value);
    }

    function applyAttrs(el) {
        var spec = el.getAttribute('data-i18n-attr');
        if (!spec) return;
        spec.split(';').forEach(function (pair) {
            var cut = pair.indexOf(':');
            if (cut < 1) return;
            setAttr(el, pair.slice(0, cut).trim(), pair.slice(cut + 1).trim());
        });
    }

    function apply(source) {
        dict = source;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var value = t(el.getAttribute('data-i18n'));
            if (!value) return;
            el.textContent = value;
        });
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var value = t(el.getAttribute('data-i18n-html'));
            if (!value) return;
            el.innerHTML = value;
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(applyAttrs);
        document.querySelectorAll('[data-i18n-lang]').forEach(function (el) {
            el.lang = lang;
        });
        var titleEl = document.querySelector('title[data-i18n]');
        if (titleEl && titleEl.textContent) document.title = titleEl.textContent;
        var canonical = document.querySelector('link[rel="canonical"]');
        var pageUrl = absoluteLang(lang).split('#')[0];
        if (canonical) canonical.href = pageUrl;
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', pageUrl);
        mountSwitch();
        applied = true;
        show();
        try {
            document.dispatchEvent(new CustomEvent('aivoinko:lang', { detail: { lang: lang } }));
        } catch (err) {
            /* IE-less environment; CustomEvent exists in supported browsers */
        }
    }

    function tryApply() {
        if (!dict || !domReady || applied) return;
        apply(dict);
    }

    var FI_FLAG = '<svg viewBox="0 0 18 11" aria-hidden="true" focusable="false"><rect width="18" height="11" fill="#fff"/><rect width="18" height="3" y="4" fill="#003580"/><rect width="3" height="11" x="5" fill="#003580"/></svg>';
    var EN_FLAG = '<svg viewBox="0 0 60 30" aria-hidden="true" focusable="false"><path fill="#012169" d="M0 0h60v30H0z"/><path stroke="#fff" stroke-width="6" d="M0 0l60 30m0-30L0 30"/><path stroke="#C8102E" stroke-width="4" d="M0 0l60 30m0-30L0 30"/><path stroke="#fff" stroke-width="10" d="M30 0v30M0 15h60"/><path stroke="#C8102E" stroke-width="6" d="M30 0v30M0 15h60"/></svg>';

    function switchHref(code) {
        if (prefixed) return langPath(code) + location.search + location.hash;
        return location.pathname + location.search + location.hash;
    }

    function fillLink(link, code, flag, label) {
        link.href = switchHref(code);
        link.hreflang = code;
        link.lang = code;
        link.setAttribute('data-lang', code);
        link.setAttribute('aria-label', label);
        if (!link.querySelector('svg')) {
            link.innerHTML = flag + '<span aria-hidden="true">' + (code === 'fi' ? 'FI' : 'EN') + '</span>';
        }
        if (code === lang) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        link.onclick = onSwitch;
    }

    function mountSwitch() {
        var nav = document.querySelector('.lang-switch');
        if (!nav) {
            nav = document.createElement('nav');
            nav.className = 'lang-switch';
            if (!document.querySelector('header.glass')) nav.classList.add('lang-switch--fixed');
            var header = document.querySelector('header.glass');
            if (header) header.appendChild(nav);
            else document.body.appendChild(nav);
        }
        nav.setAttribute('aria-label', t('lang.label') || 'Kieli');
        var fi = nav.querySelector('[data-lang="fi"]') || document.createElement('a');
        var en = nav.querySelector('[data-lang="en"]') || document.createElement('a');
        if (!fi.parentNode) nav.appendChild(fi);
        if (!en.parentNode) nav.appendChild(en);
        fillLink(fi, 'fi', FI_FLAG, t('lang.fi') || 'Suomi');
        fillLink(en, 'en', EN_FLAG, t('lang.en') || 'English');
    }

    function isModifiedClick(event) {
        return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.which > 1 || event.button > 0;
    }

    function pageHref(code) {
        return langPath(code) + location.search + location.hash;
    }

    function syncHistory(code) {
        if (!prefixed) return;
        var next = pageHref(code);
        var now = location.pathname + location.search + location.hash;
        if (now === next) return;
        try {
            history.pushState({ lang: code }, '', next);
        } catch (err) {
            /* file: or sandboxed history */
        }
    }

    function switchTo(code) {
        lang = code;
        root.lang = code;
        root.setAttribute('data-lang', code);
        applied = false;
        load(code);
    }

    function onSwitch(event) {
        var code = event.currentTarget.getAttribute('data-lang');
        if (!LANGS[code] || code === lang) {
            event.preventDefault();
            return;
        }
        storageSet(code);
        if (isModifiedClick(event)) return;
        event.preventDefault();
        syncHistory(code);
        switchTo(code);
    }

    function load(code) {
        var seq = ++loadSeq;
        if (cache[code]) {
            dict = cache[code];
            tryApply();
            return;
        }
        var url = new URL('/locales/' + code + '.json', location.origin);
        fetch(url.href, { credentials: 'same-origin' })
            .then(function (res) {
                if (!res.ok) throw new Error(String(res.status));
                return res.json();
            })
            .then(function (json) {
                cache[code] = json;
                if (seq !== loadSeq) return;
                dict = json;
                tryApply();
            })
            .catch(function () {
                if (seq !== loadSeq) return;
                show();
            });
    }

    function boot(code, isPrefixed) {
        lang = code;
        prefixed = isPrefixed;
        storageSet(code);
        root.lang = code;
        root.setAttribute('data-lang', code);
        if (code === 'en') root.classList.add('i18n-pending');
        setTimeout(show, 1500);
        load(code);
    }

    function redirectTo(code) {
        storageSet(code);
        location.replace(langPath(code) + location.search + location.hash);
    }

    window.__aivoinkoI18n = {
        get lang() { return lang; },
        t: t,
        prefixed: function () { return prefixed; }
    };

    document.addEventListener('DOMContentLoaded', function () {
        domReady = true;
        mountSwitch();
        tryApply();
    });

    window.addEventListener('popstate', function () {
        var match = pathname().match(/^\/(fi|en)(?=\/|$)/);
        var code = match ? match[1] : '';
        if (!LANGS[code] || code === lang) return;
        storageSet(code);
        switchTo(code);
    });

    if (location.protocol === 'file:') {
        boot(guess(), false);
        return;
    }

    var match = pathname().match(/^\/(fi|en)(?=\/|$)/);
    if (match) {
        boot(match[1], true);
        return;
    }

    if (stay) {
        boot(guess(), false);
        return;
    }

    root.classList.add('i18n-pending');
    var chosen = guess();
    var settled = false;
    function settle(redirect) {
        if (settled) return;
        settled = true;
        if (redirect) redirectTo(chosen);
        else boot(chosen, false);
    }
    setTimeout(function () { settle(false); }, 1500);
    fetch(langPath(chosen), { method: 'HEAD', credentials: 'same-origin' })
        .then(function (res) { settle(!!res.ok); })
        .catch(function () { settle(false); });
})();
