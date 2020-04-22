import App from './App.svelte';
import { addMessages, init, locale } from 'svelte-i18n'

import enGB from './lang/en-GB.json'
import enUS from './lang/en-US.json'
import nl from './lang/nl.json'

addMessages('en-GB', enGB)
addMessages('en-US', enUS)
addMessages('nl', nl)

const lang = localStorage.getItem('lang');
locale.subscribe(value => {
	localStorage.setItem('lang', value);
});

init({
	fallbackLocale: 'en-US',
	initialLocale: lang,
})

if (lang) {
	locale.set(lang)
}

const app = new App({
	target: document.body
});
export default app;