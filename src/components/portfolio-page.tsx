import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Coins,
  Heart,
  Menu,
  MessageSquareMore,
  MonitorSmartphone,
  Paintbrush,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import logoAsset from "@/assets/jankech-web-logo.png.asset.json";
import stylistImage from "@/assets/project-stylist.jpg";
import painterImage from "@/assets/project-painter.jpg";

type Language = "cz" | "en";

const copy = {
  cz: {
    nav: [
      ["O mně", "about"],
      ["Co nabízím", "services"],
      ["Projekty", "projects"],
      ["Kontakt", "contact"],
    ],
    cta: "Napsat mi",
    eyebrow: "Oliver Jankech · student gymnázia",
    heroTitle: "Tvořím jednoduché weby a digitální projekty.",
    heroText: "Jsem 15letý student gymnázia. Učím se, zlepšuji se a už teď rád pomůžu s menším webem, online prezentací nebo digitálním projektem.",
    scroll: "Zjistit víc",
    heroProjects: "Zobrazit projekty",
    aboutTag: "O mně",
    aboutTitle: "Ahoj, jsem Oliver.",
    aboutText:
      "Jsem student gymnázia a baví mě weby, design, technologie a tvoření. Na stavbě webů se pořád učím — ale do každého projektu dám maximum, snažím se dělat kvalitní práci a za to, co dodám, nesu odpovědnost. Zakládám si na férovém přístupu a na tom, abych se s každým projektem posunul o kus dál.",
    aboutPoints: ["Student gymnázia", "Weby, design a technologie", "Poctivý přístup"],
    servicesTag: "Co nabízím",
    servicesTitle: "Jednoduché věci, které zvládnu poctivě.",
    services: [
      ["Jednoduché webové stránky", "Čistý moderní web, který představí vás nebo vaši činnost srozumitelně a bez zbytečností."],
      ["Landing page", "Jedna stránka s jasným účelem — pro službu, projekt nebo akci."],
      ["Redesign menšího webu", "Stávající web oživím, zpřehledním a trochu zmodernizuju."],
      ["Pomoc s online prezentací", "Pomůžu vám zorientovat se na internetu a jednoduše se představit."],
      ["Úpravy textů a struktury", "Obsah upravím tak, aby mu návštěvníci rozuměli na první pohled."],
      ["Základní design / modernizace", "Vylepším vzhled, aby působil moderně a důvěryhodně."],
    ],
    projectsTag: "Projekty",
    projectsTitle: "Vybrané školní a osobní projekty.",
    projects: [
      {
        title: "Koncept webu pro osobní stylistku",
        type: "Osobní projekt · Design",
        short: "Návrh čistého webu, kde si návštěvník hned představí, co stylistka nabízí a kam napsat.",
        long: "Cílem bylo představit službu jednoduše a důvěryhodně. Řešil jsem hlavně strukturu obsahu a jednoduchý, přehledný vzhled — aby návštěvník rychle pochopil, co stylistka dělá, a věděl, jak se ozvat.",
      },
      {
        title: "Koncept webu pro malířskou firmu",
        type: "Osobní projekt · Design",
        short: "Přehledný návrh webu, kde lidé rychle najdou služby a jednoduše si vyžádají nabídku.",
        long: "Cílem bylo ukázat práci firmy přehledně a bez složitostí. Řešil jsem, jak jednoduše představit služby a ukázky práce, aby si návštěvník udělal obrázek hned a věděl, na koho se obrátit.",
      },
    ],
    viewProject: "Zobrazit projekt",
    caseLabel: "Ukázkový koncept",
    whyTag: "Proč spolupracovat se mnou",
    whyTitle: "Nejsem agentura. Jsem člověk, který to myslí vážně.",
    benefits: [
      ["Osobní přístup", "Vše řeším sám, od první zprávy po spuštění. Víte vždy, s kým mluvíte."],
      ["Chuť se zlepšovat", "Učím se pořád a každý projekt beru jako šanci posunout se o krok dál."],
      ["Rychlá komunikace", "Ozývám se rychle a píšu srozumitelně. Žádné dlouhé e-maily ani fráze."],
      ["Férová cena", "Cenu stanovím jednoduše a poctivě podle rozsahu. Bez skrytých položek."],
      ["Jednoduchost", "Vysvětlím vše tak, abyste rozuměli. Bez technického žargonu."],
      ["Upřímnost", "Řeknu rovnou, co dokážu — a co bych raději přenechal někomu zkušenějšímu."],
    ],
    pricingTag: "Cena",
    pricingTitle: "Férová cena bez složitostí.",
    pricingRange: "Menší weby od 5 000 Kč",
    pricingText: "Konečná cena záleží na rozsahu projektu. Napište mi, co potřebujete, a dámi vám cenovou nabídku — zdarma a bez závazku.",
    contactTag: "Kontakt",
    contactTitle: "Napiš mi.",
    contactText: "Máš nápad, chceš jednoduchý web nebo pomoct s online prezentací? Napiš mi — ozvu se a domluvíme další kroky.",
    form: {
      name: "Jméno",
      email: "E-mail",
      brief: "O čem je projekt?",
      submit: "Odeslat zprávu",
      required: "Vyplňte prosím toto pole.",
      invalidEmail: "Zadejte platnou e-mailovou adresu.",
      successTitle: "Děkuji za zprávu.",
      success: "Ozvu se vám co nejdříve.",
      successNote: "Otevřel se připravený e-mail. Pokud se neotevřel, napište mi přímo na adresu níže.",
    },
    footerText: "Jednoduché weby od studenta, kterému na nich záleží.",
    rights: "Všechna práva vyhrazena.",
    close: "Zavřít",
    menu: "Otevřít menu",
  },
  en: {
    nav: [
      ["About me", "about"],
      ["What I offer", "services"],
      ["Projects", "projects"],
      ["Contact", "contact"],
    ],
    cta: "Get in touch",
    eyebrow: "Oliver Jankech · high school student",
    heroTitle: "I build simple websites and digital projects.",
    heroText: "I'm a 15-year-old high school student. I keep learning and improving — and I'm already happy to help with a smaller website, online presence, or digital project.",
    scroll: "Find out more",
    heroProjects: "View projects",
    aboutTag: "About me",
    aboutTitle: "Hi, I'm Oliver.",
    aboutText: "I'm a high school student with a passion for websites, design, technology and creating things. I'm still learning — but I put maximum effort into every project, aim for quality work, and take responsibility for what I deliver. Fairness and a willingness to improve matter a lot to me.",
    aboutPoints: ["High school student", "Websites, design & technology", "Honest approach"],
    servicesTag: "What I offer",
    servicesTitle: "Simple things done honestly.",
    services: [
      ["Simple websites", "A clean, modern website that presents you or your work clearly, without the noise."],
      ["Landing page", "A single page with a clear purpose — for a service, project, or event."],
      ["Smaller website redesign", "I'll refresh your existing site, tidy it up, and give it a modern touch."],
      ["Help with online presence", "I'll help you find your way online and present yourself simply."],
      ["Text & structure edits", "I'll shape your content so visitors understand it at first glance."],
      ["Basic design / modernization", "I'll improve the look so it feels modern and trustworthy."],
    ],
    projectsTag: "Projects",
    projectsTitle: "Selected school and personal projects.",
    projects: [
      {
        title: "Concept website for a personal stylist",
        type: "Personal project · Design",
        short: "A clean concept where visitors immediately understand the service and how to reach out.",
        long: "The goal was to present the service simply and credibly. I focused mainly on content structure and a simple, clear look — so visitors quickly understand what the stylist does and know how to get in touch.",
      },
      {
        title: "Concept website for a painting company",
        type: "Personal project · Design",
        short: "An easy-to-follow concept where people quickly find services and request a quote.",
        long: "The goal was to show the company's work clearly and without complexity. I focused on presenting services and examples simply, so visitors get the picture right away and know who to contact.",
      },
    ],
    viewProject: "View project",
    caseLabel: "Sample concept",
    whyTag: "Why work with me",
    whyTitle: "I'm not an agency. I'm a person who takes it seriously.",
    benefits: [
      ["Personal approach", "I handle everything myself, from the first message to launch. You always know who you're talking to."],
      ["Willingness to improve", "I keep learning and treat every project as a chance to get one step better."],
      ["Fast communication", "I reply quickly and write plainly. No long emails, no corporate phrases."],
      ["Fair pricing", "Simple, honest pricing based on scope. No hidden items."],
      ["Simplicity", "I explain everything so you understand. No technical jargon."],
      ["Honesty", "I'll tell you straight what I can do — and what I'd rather leave to someone more experienced."],
    ],
    pricingTag: "Pricing",
    pricingTitle: "Fair pricing, no complexity.",
    pricingRange: "Smaller websites from CZK 5,000",
    pricingText: "The final price depends on the scope. Tell me what you need and I'll send you a quote — free, with no obligation.",
    contactTag: "Contact",
    contactTitle: "Write me.",
    contactText: "Got an idea, want a simple website, or need help with your online presence? Drop me a message — I'll get back to you and we'll figure out the next steps.",
    form: {
      name: "Name",
      email: "Email",
      brief: "What's the project about?",
      submit: "Send message",
      required: "Please complete this field.",
      invalidEmail: "Enter a valid email address.",
      successTitle: "Thank you for your message.",
      success: "I'll get back to you as soon as possible.",
      successNote: "A prepared email has opened. If it didn't, email me directly using the address below.",
    },
    footerText: "Simple websites from a student who cares about them.",
    rights: "All rights reserved.",
    close: "Close",
    menu: "Open menu",
  },
} as const;

const benefitIcons = [User, TrendingUp, Zap, Coins, MessageSquareMore, Heart];
const serviceIcons = [MonitorSmartphone, Target, Paintbrush, MessageSquareMore, Wrench, Sparkles];
const projectImages = [stylistImage, painterImage];

function SectionHeading({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="section-heading reveal">
      <p className="eyebrow">{tag}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function OrganicBackground() {
  return (
    <div className="organic-background" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-180 175 C180 10 330 360 690 188 C1030 28 1190 315 1620 95" />
        <path d="M-200 360 C170 155 420 520 760 322 C1090 132 1310 505 1640 270" />
        <path d="M-190 590 C190 350 430 740 820 510 C1120 330 1360 705 1630 480" />
        <path d="M-170 790 C210 565 505 930 860 720 C1190 525 1400 880 1620 690" />
      </svg>
    </div>
  );
}

export function PortfolioPage() {
  const [language, setLanguage] = useState<Language>("cz");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "cz" ? "cs" : "en";
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);

  const mailSubject = useMemo(() => language === "cz" ? "Nová zpráva z webu" : "New message from the website", [language]);
  const activeProject = selectedProject === null ? null : t.projects[selectedProject];
  const activeProjectImage = selectedProject === null ? null : projectImages[selectedProject];

  const runLogoTransition = (action: () => void) => {
    if (transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      action();
      window.setTimeout(() => setTransitioning(false), 320);
    }, 360);
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    runLogoTransition(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
  };

  const scrollToContact = () => scrollTo("contact");

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Record<string, string> = {};
    ["name", "email", "brief"].forEach((field) => {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = t.form.required;
    });
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors["email"] = t.form.invalidEmail;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const body = [
      `${t.form.name}: ${data.get("name")}`,
      `${t.form.email}: ${email}`,
      "",
      String(data.get("brief")),
    ].join("\n");
    setSubmitted(true);
    runLogoTransition(() => {
      window.location.href = `mailto:jankechbusiness@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
    });
  };

  return (
    <main className="relative isolate overflow-hidden bg-background text-foreground">
      <OrganicBackground />
      <div className={`logo-transition ${transitioning ? "is-active" : ""}`} aria-hidden={!transitioning}>
        <img src={logoAsset.url} alt="" width={120} height={120} />
      </div>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="site-container grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
          <a href="#top" onClick={(event) => { event.preventDefault(); scrollTo("top"); }} className="flex min-w-0 items-center gap-3" aria-label="Oliver Jankech">
            <img src={logoAsset.url} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" width={44} height={44} />
            <span className="truncate text-base font-bold">Oliver <span className="text-primary">Jankech</span></span>
          </a>
          <nav className="hidden items-center justify-center gap-7 lg:flex" aria-label="Primary navigation">
            {t.nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }} className="nav-link">{label}</a>)}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <div className="language-switch" aria-label="Language">
              {(["cz", "en"] as const).map((lang) => (
                <Button key={lang} type="button" variant="ghost" size="sm" onClick={() => setLanguage(lang)} aria-pressed={language === lang} className={language === lang ? "language-active" : "language-idle"}>{lang.toUpperCase()}</Button>
              ))}
            </div>
            <Button onClick={scrollToContact} className="hidden h-11 rounded-full px-5 lg:inline-flex">{t.cta}<ArrowDownRight /></Button>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-full lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={t.menu}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-6 lg:hidden">
            <nav className="flex flex-col gap-1">
              {t.nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }} className="mobile-nav-link">{label}<ChevronRight /></a>)}
              <Button onClick={scrollToContact} className="mt-4 h-12 rounded-full">{t.cta}<ArrowDownRight /></Button>
            </nav>
          </div>
        )}
      </header>

      <section id="top" className="hero-section">
        <div className="site-container flex min-h-[min(900px,100svh)] items-center justify-center pb-20 pt-32 text-center">
          <div className="relative z-10 mx-auto max-w-5xl">
            <p className="eyebrow mb-7">{t.eyebrow}</p>
            <h1 className="hero-title mx-auto">{t.heroTitle}</h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{t.heroText}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <Button onClick={scrollToContact} size="lg" className="h-14 rounded-full px-7 text-base">{t.cta}<ArrowDownRight /></Button>
              <a href="#projects" onClick={(event) => { event.preventDefault(); scrollTo("projects"); }} className="text-link">{t.heroProjects}<ArrowUpRight /></a>
            </div>
          </div>
        </div>
        <a href="#about" onClick={(event) => { event.preventDefault(); scrollTo("about"); }} className="scroll-cue"><span>{t.scroll}</span><ArrowDownRight /></a>
      </section>

      <section id="about" className="section-pad border-y border-border">
        <div className="site-container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <p className="eyebrow reveal">{t.aboutTag}</p>
          <div className="reveal">
            <h2 className="display-copy">{t.aboutTitle}</h2>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">{t.aboutText}</p>
            <div className="mt-9 flex flex-wrap gap-3">{t.aboutPoints.map((point) => <span key={point} className="about-pill"><Check />{point}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="services" className="section-pad">
        <div className="site-container">
          <SectionHeading tag={t.servicesTag} title={t.servicesTitle} />
          <div className="mt-14 border-t border-border">
            {t.services.map(([title, description], index) => {
              const Icon = serviceIcons[index] ?? MonitorSmartphone;
              return <article key={title} className="service-row reveal"><span className="service-number">0{index + 1}</span><Icon className="service-icon" /><h3>{title}</h3><p>{description}</p><ArrowUpRight className="service-arrow" /></article>;
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="section-pad">
        <div className="site-container">
          <SectionHeading tag={t.projectsTag} title={t.projectsTitle} />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {t.projects.map((project, index) => (
              <article key={project.title} className="project-card reveal">
                <button type="button" className="project-image-button" onClick={() => setSelectedProject(index)} aria-label={`${t.viewProject}: ${project.title}`}>
                  <img src={projectImages[index]} alt={project.title} loading="lazy" className="project-image" width={1408} height={1008} />
                  <span className="project-badge">{t.caseLabel}</span>
                </button>
                <div className="pt-6">
                  <p className="mb-3 text-xs font-bold uppercase text-primary">{project.type}</p>
                  <h3 className="text-2xl font-bold md:text-3xl">{project.title}</h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{project.short}</p>
                  <Button variant="link" onClick={() => setSelectedProject(index)} className="mt-4 h-auto p-0 text-base font-bold no-underline">{t.viewProject}<ArrowUpRight /></Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <SectionHeading tag={t.whyTag} title={t.whyTitle} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
            {t.benefits.map(([title, description], index) => {
              const Icon = benefitIcons[index] ?? User;
              return <article key={title} className="benefit-card reveal"><span className="icon-tile"><Icon /></span><span className="card-index">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="section-pad">
        <div className="site-container">
          <div className="pricing-panel reveal">
            <div>
              <p className="eyebrow">{t.pricingTag}</p>
              <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{t.pricingTitle}</h2>
            </div>
            <div className="pricing-side">
              <p className="pricing-range">{t.pricingRange}</p>
              <p>{t.pricingText}</p>
              <Button onClick={scrollToContact} className="mt-7 h-12 rounded-full px-6">{t.cta}<ArrowDownRight /></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-pad border-t border-border">
        <div className="site-container grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div className="reveal lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">{t.contactTag}</p>
            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">{t.contactTitle}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.contactText}</p>
            <div className="mt-10 space-y-4">
              <a href="mailto:jankechbusiness@gmail.com" onClick={(event) => { event.preventDefault(); runLogoTransition(() => { window.location.href = "mailto:jankechbusiness@gmail.com"; }); }} className="contact-link"><MessageSquareMore />jankechbusiness@gmail.com</a>
            </div>
          </div>
          <div className="contact-form-wrap reveal">
            {submitted ? (
              <div className="success-state" role="status">
                <span className="success-icon"><Check /></span>
                <h3>{t.form.successTitle}</h3>
                <p>{t.form.success}</p>
                <p className="success-note">{t.form.successNote}</p>
                <Button type="button" onClick={() => setSubmitted(false)} className="mt-7 h-12 rounded-full bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90">{language === "cz" ? "Odeslat další" : "Send another"}</Button>
              </div>
            ) : (
              <form onSubmit={submitForm} noValidate className="grid gap-6 sm:grid-cols-2">
                <Field label={t.form.name} name="name" required error={errors["name"]} />
                <Field label={t.form.email} name="email" type="email" required error={errors["email"]} />
                <label className="form-field sm:col-span-2"><span>{t.form.brief} *</span><textarea name="brief" rows={5} aria-invalid={Boolean(errors["brief"])} />{errors["brief"] && <small>{errors["brief"]}</small>}</label>
                <div className="sm:col-span-2"><Button type="submit" className="h-14 w-full rounded-full text-base">{t.form.submit}<ArrowUpRight /></Button></div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="site-container grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8">
          <div><div className="flex items-center gap-3"><img src={logoAsset.url} alt="" className="h-10 w-10 rounded-full" width={40} height={40} /><span className="font-bold">Oliver Jankech</span></div><p className="mt-4 text-sm text-muted-foreground">{t.footerText}</p></div>
          <p className="text-right text-xs text-muted-foreground">© 2026 Oliver Jankech<br />{t.rights}</p>
        </div>
      </footer>

      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {activeProject && activeProjectImage && (
          <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-0 p-0">
            <img src={activeProjectImage} alt={activeProject.title} className="aspect-[7/4] w-full object-cover" width={1408} height={1008} />
            <DialogHeader className="p-7 pr-12 md:p-10 md:pr-14">
              <p className="eyebrow">{t.caseLabel}</p>
              <DialogTitle className="mt-3 text-left text-3xl md:text-5xl">{activeProject.title}</DialogTitle>
              <DialogDescription className="pt-4 text-left text-base leading-relaxed md:text-lg">{activeProject.long}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}

function Field({ label, name, type = "text", required, error, className = "", placeholder }: { label: string; name: string; type?: string; required?: boolean; error?: string | undefined; className?: string; placeholder?: string }) {
  return <label className={`form-field ${className}`}><span>{label}{required ? " *" : ""}</span><input name={name} type={type} aria-invalid={Boolean(error)} placeholder={placeholder} />{error && <small>{error}</small>}</label>;
}
