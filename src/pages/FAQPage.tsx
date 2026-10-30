import React, { useState, useMemo } from 'react';
import { PupBuddy } from '../components/pup/PupBuddy';

interface FAQItem {
  id: string;
  qId: string;
  aId: string;
  question: string;
  answer: string;
  style: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'vaccinated',
    style: '--tilt:-1.6deg;--pin:var(--color-toffee);--i:0',
    qId: 'q-2bcfc70e-8c06-475d-aa8a-2b64932d30cc',
    question: 'Are your puppies vaccinated and health-checked?',
    aId: 'a-2bcfc70e-8c06-475d-aa8a-2b64932d30cc',
    answer: 'Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.',
  },
  {
    id: 'meet-puppy',
    style: '--tilt:1.2deg;--pin:var(--color-sky-deep);--i:1',
    qId: 'q-45fb5252-c038-41c7-afae-c8478b8f4f76',
    question: 'Can I meet a puppy before I decide?',
    aId: 'a-45fb5252-c038-41c7-afae-c8478b8f4f76',
    answer: 'Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision.',
  },
  {
    id: 'same-day',
    style: '--tilt:-0.8deg;--pin:#d9a13c;--i:2',
    qId: 'q-9585fb34-9d0d-4ee3-a903-38442633135d',
    question: 'Can I take my puppy home the same day?',
    aId: 'a-9585fb34-9d0d-4ee3-a903-38442633135d',
    answer: 'Local puppies are available immediately, so you can take your puppy home the same day.',
  },
  {
    id: 'import-abroad',
    style: '--tilt:1.8deg;--pin:#c45a6a;--i:3',
    qId: 'q-bd85389d-2116-4c4b-8500-0a5a82cae22c',
    question: 'Do you import puppies from abroad?',
    aId: 'a-bd85389d-2116-4c4b-8500-0a5a82cae22c',
    answer: 'Yes. Through our Order Upon Request service we source rare and premium teacup breeds from the most reputable, certified breeders across Europe, Korea, and beyond — and we handle the import for you.',
  },
  {
    id: 'how-travel',
    style: '--tilt:-1.2deg;--pin:var(--color-toffee);--i:4',
    qId: 'q-9c865c5e-bd1e-4bd3-9c09-cf193923123e',
    question: 'How does an imported puppy travel to Dubai?',
    aId: 'a-9c865c5e-bd1e-4bd3-9c09-cf193923123e',
    answer: 'We manage every part of the import process, including health checks, travel arrangements, and the necessary documentation, so your puppy arrives happy, healthy, and stress-free.',
  },
  {
    id: 'photos-details',
    style: '--tilt:0.7deg;--pin:var(--color-sky-deep);--i:5',
    qId: 'q-18483536-4415-4cc9-8ef8-913421f9da89',
    question: 'Will I see photos and health details first?',
    aId: 'a-18483536-4415-4cc9-8ef8-913421f9da89',
    answer: 'Yes. Photos, videos, and health certificates are shared before your puppy travels, and our team sends real photos and health details directly on WhatsApp.',
  },
  {
    id: 'delivery',
    style: '--tilt:-1.9deg;--pin:#d9a13c;--i:6',
    qId: 'q-653f64ec-6e3a-4e3a-b4ab-8862b96fd123',
    question: 'Do you deliver?',
    aId: 'a-653f64ec-6e3a-4e3a-b4ab-8862b96fd123',
    answer: 'Yes. We deliver within Dubai, and our trusted international cargo partners deliver puppies safely to loving homes all around the world.',
  },
  {
    id: 'breeds',
    style: '--tilt:1.4deg;--pin:#c45a6a;--i:7',
    qId: 'q-c7990450-8c87-47f5-9ebe-1490c7f47ffa',
    question: 'Which breeds do you usually have?',
    aId: 'a-c7990450-8c87-47f5-9ebe-1490c7f47ffa',
    answer: 'Breeds we regularly have include Maltipoo, Pomeranian, Poodle and Bichon, plus rare teacup lines such as Korean teacup poodles, Maltese, Pom and Yorkie.',
  },
  {
    id: 'help-after',
    style: '--tilt:-1.6deg;--pin:var(--color-toffee);--i:8',
    qId: 'q-67b95211-ac7c-4582-a684-90fcd4e00812',
    question: 'Is there help after my puppy comes home?',
    aId: 'a-67b95211-ac7c-4582-a684-90fcd4e00812',
    answer: 'Yes. Our team is available 24/7 and offers advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.',
  },
];

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const query = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!query) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)
    );
  }, [query]);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="relative pt-[var(--header-h)] outline-none" id="main" tabIndex={-1}>
      <div className="tp-page" data-page="faq">
        <section
          aria-labelledby="faq-title"
          className="tp-scene tp-faqroom overflow-hidden"
          data-pup-scene="true"
          data-tone="dark"
          style={{ '--sky-top': '#a95e32', '--sky-bottom': '#331c11' } as React.CSSProperties}
        >
          <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
            <header className="max-w-4xl">
              <h1 className="font-plush text-giant" id="faq-title">
                Questions &amp; answers
              </h1>
              <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
                Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.
              </p>
            </header>

            <div className="mt-12 md:mt-16">
              <div className="tp-notes" data-open={openId || query ? '' : undefined}>
                <aside aria-label="Find a question" className="tp-notes__side">
                  <label className="font-scrawl tp-notes__label" htmlFor="faq-search-input">
                    sniff out a question
                  </label>
                  <div className="tp-notes__search">
                    <svg aria-hidden="true" className="tp-notes__lens" viewBox="0 0 24 24">
                      <circle cx="10.5" cy="10.5" r="6.5" />
                      <path d="m15.5 15.5 5 5" />
                    </svg>
                    <input
                      autoComplete="off"
                      id="faq-search-input"
                      placeholder="delivery, Korea, vaccinated…"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <p aria-live="polite" className="tp-notes__count">
                    {search.trim()
                      ? `${filteredItems.length} ${filteredItems.length === 1 ? 'note' : 'notes'} found`
                      : `${FAQ_ITEMS.length} notes on the board`}
                  </p>
                  <div className="tp-notes__teddy">
                    <span aria-hidden="true" className="tp-notes__bubble font-plush">
                      <span className="tp-notes__q">?</span>
                      <span className="tp-notes__a">!</span>
                    </span>
                    <PupBuddy
                      pose="sit"
                      facing="right"
                      act="tilt"
                      label="Teddy, reading the notes"
                    />
                  </div>
                  <a
                    className="btn btn-whatsapp tp-notes__ask"
                    href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%20have%20a%20question%3A"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Ask your own question
                  </a>
                </aside>

                <div className="tp-notes__board">
                  <ul className="tp-notes__list">
                    {filteredItems.map((item) => {
                      const isUnfolded =
                        openId === item.id ||
                        (!!query && item.answer.toLowerCase().includes(query));
                      return (
                        <li
                          key={item.id}
                          className="tp-note"
                          data-reveal="true"
                          data-unfolded={isUnfolded ? 'true' : undefined}
                          style={
                            item.style
                              .split(';')
                              .filter(Boolean)
                              .reduce((acc, rule) => {
                                const [k, v] = rule.split(':');
                                if (k && v) (acc as Record<string, string>)[k.trim()] = v.trim();
                                return acc;
                              }, {} as React.CSSProperties)
                          }
                        >
                          <span aria-hidden="true" className="tp-note__pin" />
                          <h2 className="tp-note__q">
                            <button
                              aria-controls={item.aId}
                              aria-expanded={isUnfolded}
                              id={item.qId}
                              type="button"
                              onClick={() => toggleOpen(item.id)}
                            >
                              <span className="font-plush-text">{item.question}</span>
                              <span aria-hidden="true" className="tp-note__chevron" />
                            </button>
                          </h2>
                          <div
                            aria-labelledby={item.qId}
                            className="tp-note__answer"
                            id={item.aId}
                            role="region"
                            inert={!isUnfolded ? '' : undefined}
                          >
                            <div className="tp-note__flap">
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {!filteredItems.length && (
                    <div className="tp-note tp-note--empty">
                      <span aria-hidden="true" className="tp-note__pin" />
                      <p className="font-plush-text text-[1.2rem] font-bold">
                        No note about &ldquo;{search.trim()}&rdquo; yet.
                      </p>
                      <p className="mt-2">
                        <a
                          className="link-ink"
                          href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%20have%20a%20question%3A"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Ask us on WhatsApp
                        </a>{' '}
                        and we&apos;ll answer.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
