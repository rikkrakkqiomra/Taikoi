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
			hero: { tagline: 'Timeless, boundless mind as revelation is compelling, in carbon as in silicon. Let\'s master them at once. I am a Finnish multi‑tool, focused mainly on biomedical engineering and human–AI interaction. So far I love most experimental AI systems and brand cults. "Aivoinko Machine Metaphysics" is the all‑in‑one choice to benefit efficiently from the crown jewel of modern science. Aivoinko teaches how to work with AI holistically. Aivoinko ends the bullshit.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Follow us' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko logo' }
		},
		fi: {
			nav: { research: 'Tutkimus', contact: 'Yhteys', vision: 'Visio' },
			hero: { tagline: 'Ajaton, rajaton mieli ilmestyksenä kiinnostaa, hiilessä kuin piissä. Otetaan ne haltuun kerralla. Olen suomalainen monitoimikone, keskittynyt pääosin biolääketieteen tekniikkaan ja ihmis–AI‑interaktioon. Rakastan tähän mennessä eniten kokeellisia tekoälyjärjestelmiä ja brändikultteja. "Aivoinko Machine Metaphysics" on all‑in‑one valinta hyötyä tehokkaasti modernin tieteen kruunjalokivestä. Aivoinko opettaa, miten tekoälyn kanssa toimitaan kokonaisvaltaisesti. Aivoinko lopettaa paskanjauhannan.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Seuraa meitä' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' }
		},
		es: {
			nav: { research: 'Investigación', contact: 'Contacto', vision: 'Visión' },
			hero: { tagline: 'La mente intemporal y sin límites como revelación fascina, en carbono como en silicio. Tomémoslas bajo control de una vez. Soy una multiherramienta finlandesa, centrada principalmente en la ingeniería biomédica y la interacción humano‑IA. Hasta ahora me encantan sobre todo los sistemas de IA experimentales y los cultos de marca. «Aivoinko Machine Metaphysics» es la opción todo‑en‑uno para beneficiarse con eficacia de la joya de la corona de la ciencia moderna. Aivoinko enseña a trabajar con la IA de forma holística. Aivoinko pone fin a las tonterías.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Síguenos' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Logotipo de Aivoinko' }
		},
		nl: {
			nav: { research: 'Onderzoek', contact: 'Contact', vision: 'Visie' },
			hero: { tagline: 'Tijdeloze, grenzeloze geest als openbaring boeit, in koolstof én in silicium. Laten we ze in één keer beheersen. Ik ben een Finse multitool, vooral gericht op biomedische techniek en mens‑AI‑interactie. Tot nu toe houd ik het meest van experimentele AI‑systemen en merkcultussen. ‘Aivoinko Machine Metaphysics’ is de alles‑in‑één keuze om efficiënt te profiteren van het kroonjuweel van de moderne wetenschap. Aivoinko leert hoe je holistisch met AI werkt. Aivoinko maakt een einde aan de onzin.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Volg ons' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' }
		},
		de: {
			nav: { research: 'Forschung', contact: 'Kontakt', vision: 'Vision' },
			hero: { tagline: 'Zeitloser, grenzenloser Geist als Offenbarung fasziniert – in Kohlenstoff wie in Silizium. Nehmen wir beides auf einmal in die Hand. Ich bin ein finnisches Multitool, hauptsächlich fokussiert auf Biomedizintechnik und Mensch‑KI‑Interaktion. Am meisten liebe ich bislang experimentelle KI‑Systeme und Markenkulte. „Aivoinko Machine Metaphysics“ ist die All‑in‑One‑Wahl, um effizient vom Kronjuwel der modernen Wissenschaft zu profitieren. Aivoinko lehrt, wie man ganzheitlich mit KI arbeitet. Aivoinko beendet den Bullshit.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Folgen Sie uns' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-Logo' }
		},
		fr: {
			nav: { research: 'Recherche', contact: 'Contact', vision: 'Vision' },
			hero: { tagline: 'Un esprit intemporel et sans limites, comme une révélation, fascine – dans le carbone comme dans le silicium. Prenons‑les en main d’un seul coup. Je suis un outil polyvalent finlandais, principalement axé sur le génie biomédical et l’interaction humain‑IA. Jusqu’ici, j’aime surtout les systèmes d’IA expérimentaux et les cultes de marque. « Aivoinko Machine Metaphysics » est le choix tout‑en‑un pour profiter efficacement du joyau de la science moderne. Aivoinko enseigne comment travailler avec l’IA de manière holistique. Aivoinko met fin aux conneries.' },
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
			footer: { copyright: '(c) Aivoinko Machine Metaphysics', follow: 'Suivez-nous' },
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
			// Return to the very top, smoothly when allowed
			requestAnimationFrame(() => {
				const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
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

		// Smoothly scroll to the start of the selected content section
		requestAnimationFrame(() => {
			const section = document.querySelector(`section[data-route="${target}"]`);
			if (!section) return;
			const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const offset = 12; // small visual breathing room
			const top = Math.max(0, section.getBoundingClientRect().top + window.pageYOffset - offset);
			window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
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

		// Close the mobile menu when a navigation link is activated
		nav.addEventListener('click', (event) => {
			const link = event.target && event.target.closest && event.target.closest('a');
			if (!link) return;
			toggle.setAttribute('aria-expanded', 'false');
			nav.setAttribute('data-open', 'false');
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

		// Ensure we start from the very top on first paint only when no route is active
		const hasInitialRoute = !!sanitizeHash(window.location.hash);
		if (!hasInitialRoute) {
			requestAnimationFrame(() => {
				const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();


