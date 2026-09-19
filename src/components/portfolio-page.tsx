import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Globe2,
  Menu,
  MessageSquareMore,
  MonitorSmartphone,
  Paintbrush,
  Paperclip,
  Search,
  Sparkles,
  Target,
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
      ["Služby", "services"],
      ["Projekty", "projects"],
      ["Proces", "process"],
      ["Ceník", "pricing"],
      ["Kontakt", "contact"],
    ],
    cta: "Nezávazně poptat web",
    eyebrow: "AI web design pro lokální firmy",
    heroTitle: "Z návštěv na poptávky.",
    heroText: "Jsem Jankech, mladý AI web designer. Pomáhám malým lokálním firmám působit profesionálně, být lépe vidět a získávat kvalitnější poptávky.",
    scroll: "Objevte, jak spolupráce funguje",
    introTag: "Web, který má smysl",
    introTitle: "Nestačí jen dobře vypadat.",
    introText:
      "Váš web má během několika vteřin vzbudit důvěru, srozumitelně ukázat hodnotu vaší firmy a dovést návštěvníka ke kontaktu. ",
    whyTag: "Proč spolupracovat",
    whyTitle: "Méně překážek. Více výsledků.",
    benefits: [
      ["Více kvalitních poptávek", "Jasná struktura a chytré výzvy k akci vedou správné návštěvníky ke kontaktu."],
      ["Moderní první dojem", "Profesionální prezentace ukáže kvalitu vaší práce ještě před prvním hovorem."],
      ["Méně ruční práce", "Automatizace formulářů a rezervací vám vrátí čas na vlastní podnikání."],
      ["Lepší dohledatelnost", "SEO a Google Business Profile pomohou lidem najít vás právě ve chvíli, kdy vás potřebují."],
    ],
    servicesTag: "Služby",
    servicesTitle: "Vše, co vaše online prezentace potřebuje.",
    services: [
      ["Tvorba a redesign webů", "Moderní web na míru, který dobře vypadá a hlavně plní obchodní cíle."],
      ["SEO", "Srozumitelný obsah a technické základy pro lepší viditelnost ve vyhledávání."],
      ["Správa a údržba webu", "Pravidelné úpravy, kontrola a péče, aby váš web zůstal rychlý a aktuální."],
      ["Automatizace", "Propojení formulářů, kalendářů a dalších nástrojů bez zbytečné ruční práce."],
      ["Google Business Profile", "Vyladěný firemní profil pro lepší lokální dosah a důvěryhodnost."],
    ],
    projectsTag: "Vybrané projekty",
     projectsTitle: "Design, který upoutá pozornost.",
    projects: [
      {
        title: "Web pro osobní stylistku",
        type: "Strategie · Web design · Vývoj",
        short: "Elegantní prezentace, která proměňuje osobní styl v jasnou a prémiovou službu.",
        long: "Koncept webu pro osobní stylistku staví na důvěře, vytříbené typografii a jednoduché cestě k rezervaci konzultace. Obsah vede návštěvnici od inspirace k rozhodnutí bez zbytečného zahlcení.",
      },
      {
        title: "Web pro malířskou firmu",
        type: "Web design · Lokální SEO · Poptávky",
        short: "Důvěryhodný web zaměřený na lokální vyhledávání a rychlé získání cenové nabídky.",
        long: "Koncept pro malířskou firmu ukazuje služby a výsledky práce přehledně a bez složitostí. Silné reference, lokální SEO a krátký poptávkový proces pomáhají proměnit návštěvníky v nové zákazníky.",
      },
    ],
    viewProject: "Zobrazit projekt",
    caseLabel: "Ukázkový koncept",
    processTag: "Proces spolupráce",
    processTitle: "Od první zprávy k webu, který roste s vámi.",
    processSteps: [
      ["Odešlete poptávku", "Napíšete pár informací o svém podnikání a cílech."],
      ["Projdeme možnosti", "Ozvu se vám; domluvíme hovor nebo vám pošlu otázky."],
      ["Vznikne návrh", "Připravím moderní návrh webu podle vašeho byznysu."],
      ["Doladíme detaily", "Společně upravíme vše, aby web seděl vaší značce."],
      ["Spustíme web", "Dodám funkční web připravený přivádět poptávky."],
      ["Rosteme dál", "Zůstáváme ve spojení pro správu, úpravy a další růst."],
    ],
    pricingTag: "Orientační cena",
    pricingTitle: "Investice do webu, který pracuje za vás.",
    pricingRange: "5 000 — 20 000 Kč",
    pricingText: "Každý projekt je jiný. Konečná cena se odvíjí od rozsahu, funkcí a vašich konkrétních cílů.",
    refsTag: "Reference",
    refsTitle: "Spolupráce, která dává smysl.",
    placeholder: "Ukázkový obsah",
    refs: [
      ["„Jankech rychle pochopil, co potřebujeme sdělit, a převedl to do čistého webu, kterému klienti rozumí.“", "Martin K.", "Lokální služby"],
      ["„Oceňuji především lidský přístup, rychlost a to, že každý prvek webu má jasný účel.“", "Petra N.", "Osobní značka"],
      ["„Nový web působí profesionálně a poptávky jsou konečně konkrétní. Přesně to jsme potřebovali.“", "Tomáš V.", "Malá firma"],
    ],
    aboutTag: "O mně",
    aboutTitle: "Designuji moderně. Přemýšlím prakticky.",
    aboutText:
      "Jsem Jankech mladý 15letý student který se ve svém volném času věnuje AI web designu. Pomáhám lokáním firmám jejich byznys zviditelnit nebo zautomatizovat. Každý projekt řeším individuálně a unikátně. Zakládám si na přátelském a férovém přístupu. Vše vám rád jednoduše vysvětlím a společně najdeme řešení, které bude dávat smysl pro váš byznys.",
    aboutPoints: ["Strategie před efektem", "Moderní technologie", "Osobní spolupráce"],
    contactTag: "Pojďme začít",
    contactTitle: "Máte projekt v hlavě? Pojďme mu dát tvar.",
    contactText: "Popište mi stručně, co potřebujete. Ozvu se a navrhnu nejvhodnější další krok.",
    form: {
      name: "Jméno",
      email: "E-mail",
      phone: "Telefon",
      industry: "Obor firmy",
      brief: "Co potřebujete?",
      website: "Odkaz na současný web",
      file: "Přiložit soubor",
      fileHint: "PDF, DOCX, PNG nebo JPG do 10 MB",
      submit: "Odeslat poptávku",
      required: "Vyplňte prosím toto pole.",
      invalidEmail: "Zadejte platnou e-mailovou adresu.",
      invalidUrl: "Zadejte platný odkaz včetně https://",
      successTitle: "Děkuji za poptávku.",
      success: "Ozvu se vám co nejdříve.",
      successNote: "Otevřel se připravený e-mail. Pokud se neotevřel, napište mi přímo na adresu níže.",
    },
    footerText: "Moderní weby pro firmy, které chtějí růst.",
    rights: "Všechna práva vyhrazena.",
    close: "Zavřít",
    menu: "Otevřít menu",
  },
  en: {
    nav: [["Services", "services"], ["Projects", "projects"], ["Process", "process"], ["Pricing", "pricing"], ["Contact", "contact"]],
    cta: "Request a website",
    eyebrow: "AI web design for local businesses",
    heroTitle: "Turn visits into enquiries.",
    heroText: "I'm Jankech, helping small local businesses turn their website into a tool that builds trust and attracts new customers.",
    scroll: "Discover how we work together",
    introTag: "A website with purpose",
    introTitle: "Looking good isn't enough.",
    introText: "Within seconds, your website should build trust, clearly show your value, and guide visitors toward getting in touch. That's exactly what I create.",
    whyTag: "Why work together",
    whyTitle: "Less friction. Better results.",
    benefits: [
      ["More qualified enquiries", "Clear structure and smart calls to action guide the right visitors toward contact."],
      ["A modern first impression", "A professional presence shows the quality of your work before the first call."],
      ["Less manual work", "Form and booking automation gives you more time for your actual business."],
      ["Better discoverability", "SEO and Google Business Profile help people find you exactly when they need you."],
    ],
    servicesTag: "Services",
    servicesTitle: "Everything your online presence needs.",
    services: [
      ["Website design & redesign", "A custom modern website that looks sharp and delivers on business goals."],
      ["SEO", "Clear content and strong technical foundations for better search visibility."],
      ["Website care", "Regular updates and maintenance to keep your website fast and current."],
      ["Automation", "Connected forms, calendars, and tools without repetitive manual work."],
      ["Google Business Profile", "An optimized profile for stronger local reach and credibility."],
    ],
    projectsTag: "Selected projects",
    projectsTitle: "Design that works for business.",
    projects: [
      { title: "Website for a personal stylist", type: "Strategy · Web design · Development", short: "An elegant presence turning personal style into a clear, premium service.", long: "This concept for a personal stylist builds on trust, refined typography, and a simple path to booking a consultation. The content moves visitors from inspiration to decision without unnecessary noise." },
      { title: "Website for a painting company", type: "Web design · Local SEO · Enquiries", short: "A trustworthy website focused on local search and quick quote requests.", long: "This painting company concept presents services and work clearly, without complexity. Strong proof, local SEO, and a short enquiry path help turn visitors into customers." },
    ],
    viewProject: "View project",
    caseLabel: "Sample concept",
    processTag: "Our process",
    processTitle: "From the first message to a website that grows with you.",
    processSteps: [
      ["Send an enquiry", "Share a few details about your business and goals."],
      ["Explore the options", "I'll get in touch; we'll arrange a call or continue with a few questions."],
      ["Shape the concept", "I'll prepare a modern direction tailored to your business."],
      ["Refine the details", "Together, we'll make sure every detail fits your brand."],
      ["Launch the website", "You receive a complete website ready to attract enquiries."],
      ["Keep growing", "We stay connected for care, updates, and your next stage of growth."],
    ],
    pricingTag: "Indicative pricing",
    pricingTitle: "An investment in a website that works for you.",
    pricingRange: "CZK 5,000 — 20,000",
    pricingText: "Every project is different. The final price depends on scope, functionality, and your specific goals.",
    refsTag: "Testimonials",
    refsTitle: "Collaboration that makes sense.",
    placeholder: "Sample content",
    refs: [
      ["“Jankech quickly understood what we needed to say and turned it into a clean website our clients understand.”", "Martin K.", "Local services"],
      ["“I especially value the human approach, speed, and the fact that every element has a clear purpose.”", "Petra N.", "Personal brand"],
      ["“The new website feels professional and our enquiries are finally specific. Exactly what we needed.”", "Tomáš V.", "Small business"],
    ],
    aboutTag: "About me",
    aboutTitle: "Modern design. Practical thinking.",
    aboutText: "I'm Jankech, an AI web designer. I combine clean design with new technology and a focus on results. I help small local businesses look professional, get discovered, and generate better enquiries — without unnecessary complexity.",
    aboutPoints: ["Strategy before effects", "Modern technology", "Personal collaboration"],
    contactTag: "Let's begin",
    contactTitle: "Have a project in mind? Let's give it shape.",
    contactText: "Tell me briefly what you need. I'll get back to you with the best next step.",
    form: { name: "Name", email: "Email", phone: "Phone", industry: "Business type", brief: "What do you need?", website: "Current website URL", file: "Attach a file", fileHint: "PDF, DOCX, PNG or JPG up to 10 MB", submit: "Send enquiry", required: "Please complete this field.", invalidEmail: "Enter a valid email address.", invalidUrl: "Enter a valid URL including https://", successTitle: "Thank you for your enquiry.", success: "I'll get back to you as soon as possible.", successNote: "A prepared email has opened. If it didn't, email me directly using the address below." },
    footerText: "Modern websites for businesses ready to grow.",
    rights: "All rights reserved.",
    close: "Close",
    menu: "Open menu",
  },
} as const;

const benefitIcons = [Target, Sparkles, Zap, Search];
const serviceIcons = [MonitorSmartphone, Search, Wrench, Bot, Globe2];
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
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    const steps = document.querySelectorAll<HTMLElement>("[data-process-step]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveStep(Number((entry.target as HTMLElement).dataset["processStep"] ?? 0));
      }),
      { rootMargin: "-35% 0px -45%", threshold: 0 },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [language]);

  const mailSubject = useMemo(() => language === "cz" ? "Nová poptávka webu" : "New website enquiry", [language]);
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
    ["name", "email", "industry", "brief"].forEach((field) => {
      if (!String(data.get(field) ?? "").trim()) nextErrors[field] = t.form.required;
    });
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors["email"] = t.form.invalidEmail;
    const website = String(data.get("website") ?? "").trim();
    if (website && !/^https?:\/\/.+/i.test(website)) nextErrors["website"] = t.form.invalidUrl;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const body = [
      `${t.form.name}: ${data.get("name")}`,
      `${t.form.email}: ${email}`,
      `${t.form.phone}: ${data.get("phone") || "—"}`,
      `${t.form.industry}: ${data.get("industry")}`,
      `${t.form.website}: ${website || "—"}`,
      "",
      `${t.form.brief}:`,
      String(data.get("brief")),
      "",
      `${t.form.file}: ${(data.get("file") as File | null)?.name || "—"}`,
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
          <a href="#top" onClick={(event) => { event.preventDefault(); scrollTo("top"); }} className="flex min-w-0 items-center gap-3" aria-label="Jankech Web">
            <img src={logoAsset.url} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" width={44} height={44} />
            <span className="truncate text-base font-bold">Jankech <span className="text-primary">Web</span></span>
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
              <a href="#projects" onClick={(event) => { event.preventDefault(); scrollTo("projects"); }} className="text-link">{language === "cz" ? "Prohlédnout projekty" : "View projects"}<ArrowUpRight /></a>
            </div>
          </div>
        </div>
        <a href="#intro" onClick={(event) => { event.preventDefault(); scrollTo("intro"); }} className="scroll-cue"><span>{t.scroll}</span><ArrowDownRight /></a>
      </section>

      <section id="intro" className="section-pad border-y border-border">
        <div className="site-container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
          <p className="eyebrow reveal">{t.introTag}</p>
          <div className="reveal">
            <h2 className="display-copy">{t.introTitle}</h2>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">{t.introText}</p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <SectionHeading tag={t.whyTag} title={t.whyTitle} />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
            {t.benefits.map(([title, description], index) => {
              const Icon = benefitIcons[index] ?? Target;
              return <article key={title} className="benefit-card reveal"><span className="icon-tile"><Icon /></span><span className="card-index">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>;
            })}
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

      <section id="process" className="process-section">
        <div className="site-container relative z-10">
          <SectionHeading tag={t.processTag} title={t.processTitle} />
          <div className={`process-line process-line-${activeStep}`} aria-hidden="true">
            <svg viewBox="0 0 900 1500" preserveAspectRatio="none"><path d="M110 20 C720 100 760 280 190 340 C-70 370 40 620 620 610 C1010 605 920 880 300 930 C-50 960 100 1210 700 1190 C900 1185 900 1380 500 1470" /></svg>
          </div>
          <ol className="relative mt-20 space-y-28 md:space-y-36">
            {t.processSteps.map(([title, description], index) => (
              <li key={title} data-process-step={index} className={`process-step ${activeStep === index ? "active" : ""} ${index % 2 ? "md:ml-auto" : ""}`}>
                <span className="process-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
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

      <section className="section-pad border-y border-border">
        <div className="site-container">
          <SectionHeading tag={t.refsTag} title={t.refsTitle} />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {t.refs.map(([quote, name, role], index) => (
              <article key={name} className="testimonial reveal">
                <span className="sample-badge">{t.placeholder}</span>
                <p className="quote">{quote}</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className={`avatar avatar-${index + 1}`}>{name.charAt(0)}</div>
                  <div><p className="font-bold">{name}</p><p className="text-sm text-muted-foreground">{role}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div className="about-mark reveal"><img src={logoAsset.url} alt="Jankech Web" loading="lazy" width={768} height={768} /></div>
          <div className="reveal">
            <p className="eyebrow">{t.aboutTag}</p>
            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">{t.aboutTitle}</h2>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground md:text-xl">{t.aboutText}</p>
            <div className="mt-8 flex flex-wrap gap-3">{t.aboutPoints.map((point) => <span key={point} className="about-pill"><Check />{point}</span>)}</div>
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
              <a href="tel:+420608543556" className="contact-link"><BriefcaseBusiness />+420 608 543 556</a>
            </div>
          </div>
          <div className="contact-form-wrap reveal">
            {submitted ? (
              <div className="success-state" role="status">
                <span className="success-icon"><Check /></span>
                <h3>{t.form.successTitle}</h3>
                <p>{t.form.success}</p>
                <p className="success-note">{t.form.successNote}</p>
                <Button type="button" variant="outline" onClick={() => setSubmitted(false)} className="mt-7 rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">{language === "cz" ? "Odeslat další" : "Send another"}</Button>
              </div>
            ) : (
              <form onSubmit={submitForm} noValidate className="grid gap-6 sm:grid-cols-2">
                <Field label={t.form.name} name="name" required error={errors["name"]} />
                <Field label={t.form.email} name="email" type="email" required error={errors["email"]} />
                <Field label={t.form.phone} name="phone" type="tel" />
                <Field label={t.form.industry} name="industry" required error={errors["industry"]} />
                <Field label={t.form.website} name="website" type="url" error={errors["website"]} className="sm:col-span-2" placeholder="https://" />
                <label className="form-field sm:col-span-2"><span>{t.form.brief} *</span><textarea name="brief" rows={5} aria-invalid={Boolean(errors["brief"])} />{errors["brief"] && <small>{errors["brief"]}</small>}</label>
                <label className="file-field sm:col-span-2"><Paperclip /><span><strong>{t.form.file}</strong><small>{t.form.fileHint}</small></span><input type="file" name="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" /></label>
                <div className="sm:col-span-2"><Button type="submit" className="h-14 w-full rounded-full bg-primary-foreground text-base text-primary hover:bg-primary-foreground/90">{t.form.submit}<ArrowUpRight /></Button></div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="site-container grid grid-cols-[minmax(0,1fr)_auto] items-end gap-8">
          <div><div className="flex items-center gap-3"><img src={logoAsset.url} alt="" className="h-10 w-10 rounded-full" width={40} height={40} /><span className="font-bold">Jankech Web</span></div><p className="mt-4 text-sm text-muted-foreground">{t.footerText}</p></div>
          <p className="text-right text-xs text-muted-foreground">© 2026 Jankech Web<br />{t.rights}</p>
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