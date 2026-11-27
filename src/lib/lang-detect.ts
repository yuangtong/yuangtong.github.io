import { defaultLocale, locales } from '@/content/locale';

/** Where the visitor's own choice of language is kept (local storage, not a cookie). */
export const LANG_KEY = 'lang';

/**
 * Picks the language on the first visit (owner, 2026-11-27). Runs in the head
 * of English pages, before the first paint, and only on a full page load:
 *
 * - A language the visitor chose in the selector wins and is kept on this device.
 * - Otherwise the browser's preferred languages are read in order and the first
 *   one the site speaks is used ("es-PE" -> es); with no match, English stays.
 * - Crawlers and automated browsers are left alone, and the server answers
 *   every address as it is, so each language keeps its own URL for search engines.
 *
 * It reads the browser's language, not the country: a Spanish speaker abroad
 * still gets Spanish, an English speaker in Lima still gets English.
 */
export function langDetectScript(): string {
  const others = JSON.stringify(locales.filter((l) => l !== defaultLocale));
  return `(function(){try{
var n=navigator;if(n.webdriver||/bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(n.userAgent))return;
var o=${others},d=${JSON.stringify(defaultLocale)},pick=null,saved=null;
try{saved=localStorage.getItem(${JSON.stringify(LANG_KEY)});}catch(e){}
if(saved){pick=saved;}else{var ls=n.languages&&n.languages.length?n.languages:[n.language||''];
for(var i=0;i<ls.length;i++){var b=String(ls[i]).toLowerCase().split('-')[0];if(b===d||o.indexOf(b)>-1){pick=b;break;}}}
if(!pick||pick===d||o.indexOf(pick)<0)return;
var p=location.pathname;location.replace('/'+pick+(p==='/'?'':p)+location.search+location.hash);
}catch(e){}})();`;
}
