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
			contact: { 
				title: 'Contact', 
				intro: 'Get in touch with us – let\'s discuss AI, regulatory-ready infrastructure, and partnerships.' 
			},
			vision: { title: 'Vision', body: 'This is a sandbox area to outline long-term vision and principles.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko logo' },
			form_name: 'Name',
			form_email: 'Email *',
			form_phone: 'Phone',
			form_message: 'What can Aivoinko help you with?',
			form_submit: 'Submit',
			privacy_text: 'We use the information you provide to contact you about our relevant content, products, and services. You can unsubscribe at any time. For more information, see our',
			privacy_link: 'Privacy Policy'
		},
		fi: {
			nav: { research: 'Tutkimus', contact: 'Yhteys', vision: 'Visio' },
			hero: { tagline: 'Koneen metafysiikkaa ihmiskeskeiselle tekoälylle' },
			research: { title: 'Tutkimus', body: 'Tämä on hiekkalaatikkoalue muistiinpanoille ja kokeiluille.' },
			contact: { 
				title: 'Yhteys', 
				intro: 'Ota yhteyttä – keskustellaan tekoälystä, sääntelyvalmiista infrastruktuurista ja kumppanuuksista.' 
			},
			vision: { title: 'Visio', body: 'Tämä on hiekkalaatikkoalue pitkän aikavälin periaatteille.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' },
			form_name: 'Nimi',
			form_email: 'Sähköposti *',
			form_phone: 'Puhelin',
			form_message: 'Miten Aivoinko voi auttaa sinua?',
			form_submit: 'Lähetä',
			privacy_text: 'Käytämme antamiasi tietoja ottaaksemme yhteyttä sinuun olennaisesta sisällöstämme, tuotteistamme ja palveluistamme. Voit perua tilauksen milloin tahansa. Lisätietoja löytyy',
			privacy_link: 'Tietosuojakäytännöstä'
		},
		es: {
			nav: { research: 'Investigación', contact: 'Contacto', vision: 'Visión' },
			hero: { tagline: 'Metafísica de la máquina para una IA centrada en el ser humano' },
			research: { title: 'Investigación', body: 'Un área de pruebas para notas y experimentos.' },
			contact: { 
				title: 'Contacto', 
				intro: 'Ponte en contacto con nosotros: hablemos sobre IA, infraestructura regulatoria y alianzas.' 
			},
			vision: { title: 'Visión', body: 'Un área de pruebas para la visión y los principios a largo plazo.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Logotipo de Aivoinko' },
			form_name: 'Nombre',
			form_email: 'Email *',
			form_phone: 'Teléfono',
			form_message: '¿Cómo puede ayudarte Aivoinko?',
			form_submit: 'Enviar',
			privacy_text: 'Utilizamos la información que proporcionas para contactarte sobre nuestro contenido, productos y servicios relevantes. Puedes cancelar la suscripción en cualquier momento. Para más información, consulta nuestra',
			privacy_link: 'Política de Privacidad'
		},
		nl: {
			nav: { research: 'Onderzoek', contact: 'Contact', vision: 'Visie' },
			hero: { tagline: 'Machine-metafysica voor mensgerichte AI' },
			research: { title: 'Onderzoek', body: 'Een sandbox voor notities en experimenten.' },
			contact: { 
				title: 'Contact', 
				intro: 'Neem contact met ons op – laten we praten over AI, regulatoire infrastructuur en partnerschappen.' 
			},
			vision: { title: 'Visie', body: 'Een sandbox om lange termijn visie en principes te schetsen.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-logo' },
			form_name: 'Naam',
			form_email: 'Email *',
			form_phone: 'Telefoon',
			form_message: 'Hoe kan Aivoinko je helpen?',
			form_submit: 'Versturen',
			privacy_text: 'We gebruiken de informatie die je verstrekt om contact met je op te nemen over onze relevante content, producten en diensten. Je kunt je op elk moment uitschrijven. Voor meer informatie, zie ons',
			privacy_link: 'Privacybeleid'
		},
		de: {
			nav: { research: 'Forschung', contact: 'Kontakt', vision: 'Vision' },
			hero: { tagline: 'Maschinenmetaphysik für menschenzentrierte KI' },
			research: { title: 'Forschung', body: 'Ein Sandbox-Bereich für Notizen und Experimente.' },
			contact: { 
				title: 'Kontakt', 
				intro: 'Kontaktieren Sie uns – sprechen wir über KI, regulierungsgerechte Infrastruktur und Partnerschaften.' 
			},
			vision: { title: 'Vision', body: 'Ein Sandbox-Bereich für langfristige Vision und Prinzipien.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Aivoinko-Logo' },
			form_name: 'Name',
			form_email: 'E-Mail *',
			form_phone: 'Telefon',
			form_message: 'Wie kann Aivoinko Ihnen helfen?',
			form_submit: 'Senden',
			privacy_text: 'Wir verwenden die von Ihnen bereitgestellten Informationen, um Sie über unsere relevanten Inhalte, Produkte und Dienstleistungen zu kontaktieren. Sie können sich jederzeit abmelden. Weitere Informationen finden Sie in unserer',
			privacy_link: 'Datenschutzrichtlinie'
		},
		fr: {
			nav: { research: 'Recherche', contact: 'Contact', vision: 'Vision' },
			hero: { tagline: 'Métaphysique de la machine pour une IA centrée sur l'humain' },
			research: { title: 'Recherche', body: 'Une zone bac à sable pour notes et expériences.' },
			contact: { 
				title: 'Contact', 
				intro: 'Contactez-nous – parlons d\'IA, d\'infrastructure réglementaire et de partenariats.' 
			},
			vision: { title: 'Vision', body: 'Une zone bac à sable pour la vision et les principes à long terme.' },
			footer: { copyright: '(c) Aivoinko Machine Metaphysics' },
			languages: { fi: 'Suomi', es: 'Español', nl: 'Nederlands', en: 'English', de: 'Deutsch', fr: 'Français' },
			a11y: { logoAlt: 'Logo Aivoinko' },
			form_name: 'Nom',
			form_email: 'Email *',
			form_phone: 'Téléphone',
			form_message: 'Comment Aivoinko peut-il vous aider ?',
			form_submit: 'Envoyer',
			privacy_text: 'Nous utilisons les informations que vous fournissez pour vous contacter au sujet de notre contenu, de nos produits et services pertinents. Vous pouvez vous désabonner à tout moment. Pour plus d\'informations, consultez notre',
			privacy_link: 'Politique de confidentialité'
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
		
		// Smooth scroll to the section and focus the heading
		const targetSection = document.getElementById(`section-${target}`);
		const heading = document.getElementById(`heading-${target}`);
		
		if (targetSection && heading) {
			// Ensure smooth scrolling is enabled
			document.documentElement.style.scrollBehavior = 'smooth';
			
			// Scroll to the section with a small offset to account for header
			const sectionTop = targetSection.offsetTop - 20;
			window.scrollTo({
				top: sectionTop,
				behavior: 'smooth'
			});
			
			// Focus the heading after scroll completes
			setTimeout(() => {
				heading.focus({ preventScroll: true });
			}, 600);
		}
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


