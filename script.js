/*
	Aivoinko static template behavior
	- Lightweight i18n
	- Hash-based routing with sanitation
	- Accessible menu toggle
*/

(function () {
	'use strict';

	// Ensure the browser doesn't restore scroll on reload/back-forward
	try {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
	} catch (_) { /* ignore */ }

	/**
	 * Translations dictionary
	 * Keys: en, fi, es, nl, de, fr
	 */
	const translations = {
		en: {
			nav: { research: 'Research', contact: 'Contact', vision: 'Vision' },
			hero: { tagline: 'Machine Metaphysics for Human-Centered AI' },
			research: { title: 'Research', body: 'This is a sandbox area for research notes and experiments.' },
			vision: { title: 'Vision', body: 'This is a sandbox area to outline long-term vision and principles.' },
			contactForm: {
				heading: 'How can we help you?',
				labels: { name: 'Name', email: 'Email *', phone: 'Phone', message: 'What can Aivoinko help you with?' },
				placeholders: {
					name: 'Your full name',
					email: 'you@domain.com',
					phone: 'Optional',
					message: 'Tell us briefly about your question'
				},
				legal: 'Aivoinko uses the information you provide to contact you about relevant content, products, and services. You may unsubscribe at any time. For more information, read our Privacy Policy.',
				submit: 'Submit'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko logo' }
		},
		fi: {
			nav: { research: 'Tutkimus', contact: 'Yhteys', vision: 'Visio' },
			hero: { tagline: 'Koneen metafysiikkaa ihmiskeskeiselle tekoälylle' },
			research: { title: 'Tutkimus', body: 'Tämä on hiekkalaatikkoalue muistiinpanoille ja kokeiluille.' },
			vision: { title: 'Visio', body: 'Tämä on hiekkalaatikkoalue pitkän aikavälin periaatteille.' },
			contactForm: {
				heading: 'Kuinka voimme auttaa?',
				labels: { name: 'Nimi', email: 'Sähköposti *', phone: 'Puhelin', message: 'Missä Aivoinko voi auttaa?' },
				placeholders: {
					name: 'Koko nimesi',
					email: 'sinä@domain.com',
					phone: 'Valinnainen',
					message: 'Kerro lyhyesti tarpeestasi'
				},
				legal: 'Aivoinko käyttää antamiasi tietoja ottaakseen sinuun yhteyttä ajankohtaisesta sisällöstä, tuotteista ja palveluista. Voit perua viestinnän milloin tahansa. Lisätietoja saat tietosuojakäytännöstämme.',
				submit: 'Lähetä'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' }
		},
		es: {
			nav: { research: 'Investigación', contact: 'Contacto', vision: 'Visión' },
			hero: { tagline: 'Metafísica de la máquina para una IA centrada en el ser humano' },
			research: { title: 'Investigación', body: 'Un área de pruebas para notas y experimentos.' },
			vision: { title: 'Visión', body: 'Un área de pruebas para la visión y los principios a largo plazo.' },
			contactForm: {
				heading: '¿Cómo podemos ayudarle?',
				labels: { name: 'Nombre', email: 'Correo *', phone: 'Teléfono', message: '¿En qué puede ayudarle Aivoinko?' },
				placeholders: {
					name: 'Su nombre completo',
					email: 'usted@dominio.com',
					phone: 'Opcional',
					message: 'Cuéntenos brevemente su consulta'
				},
				legal: 'Aivoinko utiliza la información que nos proporciona para contactar con usted sobre contenido, productos y servicios relevantes. Puede darse de baja en cualquier momento.',
				submit: 'Enviar'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Logotipo de Aivoinko' }
		},
		nl: {
			nav: { research: 'Onderzoek', contact: 'Contact', vision: 'Visie' },
			hero: { tagline: 'Machine-metafysica voor mensgerichte AI' },
			research: { title: 'Onderzoek', body: 'Een sandbox voor notities en experimenten.' },
			vision: { title: 'Visie', body: 'Een sandbox om lange termijn visie en principes te schetsen.' },
			contactForm: {
				heading: 'Hoe kunnen we helpen?',
				labels: { name: 'Naam', email: 'E-mail *', phone: 'Telefoon', message: 'Waarmee kan Aivoinko helpen?' },
				placeholders: {
					name: 'Uw volledige naam',
					email: 'u@domein.com',
					phone: 'Optioneel',
					message: 'Beschrijf kort uw vraag'
				},
				legal: 'Aivoinko gebruikt de door u verstrekte informatie om contact met u op te nemen over relevante inhoud, producten en diensten. U kunt zich op elk moment afmelden.',
				submit: 'Versturen'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' }
		},
		de: {
			nav: { research: 'Forschung', contact: 'Kontakt', vision: 'Vision' },
			hero: { tagline: 'Maschinenmetaphysik für menschenzentrierte KI' },
			research: { title: 'Forschung', body: 'Ein Sandbox-Bereich für Notizen und Experimente.' },
			vision: { title: 'Vision', body: 'Ein Sandbox-Bereich für langfristige Vision und Prinzipien.' },
			contactForm: {
				heading: 'Wie können wir helfen?',
				labels: { name: 'Name', email: 'E-Mail *', phone: 'Telefon', message: 'Wobei kann Aivoinko helfen?' },
				placeholders: {
					name: 'Ihr vollständiger Name',
					email: 'sie@domain.de',
					phone: 'Optional',
					message: 'Beschreiben Sie kurz Ihr Anliegen'
				},
				legal: 'Aivoinko verwendet Ihre Angaben, um Sie zu relevanten Inhalten, Produkten und Services zu kontaktieren. Eine Abmeldung ist jederzeit möglich.',
				submit: 'Senden'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-Logo' }
		},
		fr: {
			nav: { research: 'Recherche', contact: 'Contact', vision: 'Vision' },
			hero: { tagline: 'Métaphysique de la machine pour une IA centrée sur l’humain' },
			research: { title: 'Recherche', body: 'Une zone bac à sable pour notes et expériences.' },
			vision: { title: 'Vision', body: 'Une zone bac à sable pour la vision et les principes à long terme.' },
			contactForm: {
				heading: 'Comment pouvons-nous vous aider ?',
				labels: { name: 'Nom', email: 'E-mail *', phone: 'Téléphone', message: 'En quoi Aivoinko peut-il vous aider ?' },
				placeholders: {
					name: 'Votre nom complet',
					email: 'vous@domaine.com',
					phone: 'Optionnel',
					message: 'Expliquez brièvement votre demande'
				},
				legal: "Aivoinko utilise les informations fournies pour vous contacter à propos de contenus, produits et services pertinents. Vous pouvez vous désabonner à tout moment.",
				submit: 'Envoyer'
			},
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Logo Aivoinko' }
		}
	};

	const SUPPORTED_LANGS = Object.keys(translations);
	const DEFAULT_LANG = 'en';

	/** Retrieve and sanitize a supported language code */
	function getStoredLanguage() {
		try {
			const value = localStorage.getItem('lang');
			if (value && SUPPORTED_LANGS.includes(value)) return value;
		} catch (_) { /* ignore */ }
		return DEFAULT_LANG;
	}

	function storeLanguage(lang) {
		try { localStorage.setItem('lang', lang); } catch (_) { /* ignore */ }
	}

	/** Set html[lang] and update UI strings */
	function setLanguage(lang) {
		const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
		document.documentElement.setAttribute('lang', safeLang);
		applyTranslations(safeLang);
		updateLangCardPressedState(safeLang);
		storeLanguage(safeLang);
		const logo = document.getElementById('brandLogo');
		if (logo) logo.alt = translations[safeLang].a11y.logoAlt;
	}

	/** Apply data-i18n translations to elements */
	function applyTranslations(lang) {
		const dict = translations[lang] || translations[DEFAULT_LANG];
		const elements = document.querySelectorAll('[data-i18n]');
		elements.forEach((el) => {
			const path = el.getAttribute('data-i18n');
			const text = getFromPath(dict, path);
			if (typeof text === 'string') {
				el.textContent = text;
			}
		});

		// Update placeholders where data-i18n-placeholder is set
		document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
			const key = el.getAttribute('data-i18n-placeholder');
			const value = getFromPath(dict, key);
			if (typeof value === 'string') {
				el.setAttribute('placeholder', value);
			}
		});

		// Update language card labels to localized endonyms
		document.querySelectorAll('.lang-card').forEach((btn) => {
			const code = btn.getAttribute('data-lang');
			const label = dict.languages && dict.languages[code];
			if (label) btn.textContent = label;
		});
	}

	/** Helper to safely get nested object value by a.b.c path */
	function getFromPath(obj, path) {
		return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
	}

	/** Update aria-pressed state on language cards */
	function updateLangCardPressedState(activeLang) {
		document.querySelectorAll('.lang-card').forEach((btn) => {
			btn.setAttribute('aria-pressed', String(btn.dataset.lang === activeLang));
		});
	}

	/** Hash router */
	const ROUTES = ['research', 'contact', 'vision'];

	function sanitizeHash(hashRaw) {
		// Accept only #research, #contact, #vision (case-insensitive)
		const cleaned = (hashRaw || '').toLowerCase().replace(/^#/, '');
		return ROUTES.includes(cleaned) ? cleaned : null;
	}

	function navigate(hashRaw) {
		const route = sanitizeHash(hashRaw);

		// If there is no valid route, keep all subpages closed and stay at the very top
		if (!route) {
			document.querySelectorAll('.content-section').forEach((section) => {
				section.hidden = true;
				section.setAttribute('aria-hidden', 'true');
			});
			document.querySelectorAll('.primary-nav a').forEach((a) => a.removeAttribute('aria-current'));
			// Force viewport to the very top without smooth behavior
			requestAnimationFrame(() => {
				document.documentElement.style.scrollBehavior = 'auto';
				window.scrollTo(0, 0);
				// restore author style
				document.documentElement.style.scrollBehavior = '';
			});
			return;
		}

		const target = route;
		// Toggle sections visibility
		document.querySelectorAll('.content-section').forEach((section) => {
			const isMatch = section.getAttribute('data-route') === target;
			section.hidden = !isMatch;
			section.setAttribute('aria-hidden', String(!isMatch));
		});
		// Update active nav state (optional visual hook via aria-current)
		document.querySelectorAll('.primary-nav a').forEach((a) => {
			const isActive = a.getAttribute('href') === `#${target}`;
			if (isActive) { a.setAttribute('aria-current', 'page'); }
			else { a.removeAttribute('aria-current'); }
		});
		// Focus the section heading for accessibility without scrolling the page down
		const heading = document.getElementById(`heading-${target}`);
		if (heading) { heading.focus({ preventScroll: true }); }

		// Always keep the viewport at the top after routing to avoid hiding the logo
		requestAnimationFrame(() => {
			document.documentElement.style.scrollBehavior = 'auto';
			window.scrollTo(0, 0);
			document.documentElement.style.scrollBehavior = '';
		});
	}

	function initRouter() {
		// Do not auto-open any subpage; only navigate if a valid hash is present
		navigate(window.location.hash);
		window.addEventListener('hashchange', () => navigate(window.location.hash));
	}

	function initMenuToggle() {
		const toggle = document.getElementById('menuToggle');
		const nav = document.getElementById('primaryNav');
		if (!toggle || !nav) return;
		toggle.addEventListener('click', () => {
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!expanded));
			nav.setAttribute('data-open', String(!expanded));
			if (!expanded) {
				// focus the first link when opened
				const firstLink = nav.querySelector('a');
				if (firstLink) firstLink.focus();
			}
		});
	}

	function initLanguageCards() {
		document.querySelectorAll('.lang-card').forEach((btn) => {
			btn.addEventListener('click', () => {
				const lang = btn.getAttribute('data-lang');
				setLanguage(lang);
			});
		});
	}

	function init() {
		// Set initial language from storage or default
		const initialLang = getStoredLanguage();
		setLanguage(initialLang);

		// Improve LCP heuristics: once loaded, relax fetch priority for logo on subsequent loads
		const logo = document.getElementById('brandLogo');
		if (logo) {
			// Switch to lazy on subsequent paints to save bandwidth after first visit
			try {
				if (sessionStorage.getItem('seen')) {
					logo.setAttribute('loading', 'lazy');
					logo.removeAttribute('fetchpriority');
				}
				sessionStorage.setItem('seen', '1');
			} catch (_) { /* ignore */ }
		}

		initMenuToggle();
		initLanguageCards();
		initRouter();

		// Ensure we start from the very top on first paint
		requestAnimationFrame(() => {
			document.documentElement.style.scrollBehavior = 'auto';
			window.scrollTo(0, 0);
			document.documentElement.style.scrollBehavior = '';
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();


