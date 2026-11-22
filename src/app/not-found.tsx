import { getContactPage, getHomePage, getNotFoundPage, getSettings } from '@/content';
import { NotFoundCrash } from '@/components/NotFoundCrash';
import { SiteHeader } from '@/components/SiteHeader';

/** 404: the number in dots, the horse crashes into it (design G "404", reworked). */
export default async function NotFound() {
  const [p, settings, home, contact] = await Promise.all([getNotFoundPage(), getSettings(), getHomePage(), getContactPage()]);
  return (
    <div className="section-shell">
      <SiteHeader nav={settings.nav} links={contact.links} ui={settings.ui} name={home.intro.name} nameZh={home.intro.nameZh} availability={home.intro.availability} strips={[]} />
      <main className="notfound">
        <div className="notfound__stage"><NotFoundCrash label={p.canvasLabel} /></div>
        <section className="notfound__text">
          <div className="notfound__copy">
            <h1 className="notfound__title">{p.title}</h1>
            <p className="notfound__body">{p.body}</p>
          </div>
          <div className="notfound__ctas">
            <a href={p.back.href} className="btn btn--ink">{p.back.label}</a>
            <a href={p.lab.href} className="btn btn--signal">{p.lab.label}</a>
          </div>
        </section>
      </main>
    </div>
  );
}
