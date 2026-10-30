import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TeddyPuppetSVG } from '../pup/TeddyPuppetSVG';
import { FullScreenImageViewer } from '../FullScreenImageViewer';

interface FamilyPhoto {
  id: string;
  src: string;
  caption: string;
  tilt: string;
  tapeColor: string;
}

const FAMILY_PHOTOS: FamilyPhoto[] = [
  {
    id: 'f1',
    src: '/images/27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg',
    caption: 'Lulu 🧸 with her new mummy ❤️',
    tilt: '-2.2deg',
    tapeColor: '#f6d79a',
  },
  {
    id: 'f2',
    src: '/images/27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg',
    caption: 'Mochi settled in Dubai Marina 🐾',
    tilt: '1.8deg',
    tapeColor: '#f9cdbf',
  },
  {
    id: 'f3',
    src: '/images/27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg',
    caption: 'Teddy meeting his human sister 🥰',
    tilt: '-1.4deg',
    tapeColor: '#bfddf5',
  },
  {
    id: 'f4',
    src: '/images/27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg',
    caption: 'First day home in Downtown Dubai ✨',
    tilt: '2.5deg',
    tapeColor: '#f6d79a',
  },
  {
    id: 'f5',
    src: '/images/27b888_f7f4966e59e94db591784d4ec546682f-mv2.jpg',
    caption: 'Coco enjoying the balcony breeze 🌸',
    tilt: '-2.8deg',
    tapeColor: '#f9cdbf',
  },
  {
    id: 'f6',
    src: '/images/27b888_b073c5815f7c4f92ad9a57741a653663-mv2.jpg',
    caption: 'Little Bella stealing everyone’s heart 💕',
    tilt: '1.2deg',
    tapeColor: '#bfddf5',
  },
  {
    id: 'f7',
    src: '/images/27b888_cfe895dbcc2d4bff85f890be9b496543-mv2.jpg',
    caption: 'Nugget’s first park visit 🌿',
    tilt: '-1.9deg',
    tapeColor: '#f6d79a',
  },
  {
    id: 'f8',
    src: '/images/27b888_a7e7ab6a931e4c79a798bab9927d396e-mv2.jpg',
    caption: 'Our tiny angel with her family 🤍',
    tilt: '2.1deg',
    tapeColor: '#f9cdbf',
  },
];

export const HomeFamiliesSection: React.FC = () => {
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);

  const viewerPhotos = FAMILY_PHOTOS.map((p) => ({
    id: p.id,
    src: p.src,
    alt: p.caption,
  }));

  return (
    <div data-section="families">
      <section
        aria-labelledby="dusk-title"
        className="tp-scene tp-dusk"
        data-pup-scene="true"
        data-tone="dark"
        style={
          {
            '--sky-top': '#a65a30',
            '--sky-bottom': '#4d2b19',
          } as React.CSSProperties
        }
      >
        <div className="tp-dusk__sky gutter">
          <div className="tp-dusk__head">
            <h2 className="font-plush text-huge" id="dusk-title">
              Happy families &amp; puppies
            </h2>
            <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
              We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </div>
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">
              “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
            </blockquote>
            <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
          </figure>
        </div>

        <div className="tp-photowall">
          <div className="tp-photowall__wall">
            <ul aria-label="Photos from TeddyPups families" className="tp-photowall__prints">
              {FAMILY_PHOTOS.map((photo, idx) => (
                <li
                  key={photo.id}
                  data-reveal="true"
                  style={{ '--d': `${110 * [3, 0, 5, 1, 6, 2, 7, 4][idx]}ms` } as React.CSSProperties}
                >
                  <button
                    aria-label={`Open photo ${idx + 1} of 64: ${photo.caption}`}
                    className="tp-photowall__print"
                    type="button"
                    onClick={() => setViewerIdx(idx)}
                  >
                    <span
                      className="tp-polaroid"
                      style={
                        {
                          '--tilt': photo.tilt,
                          '--tape': photo.tapeColor,
                          '--i': idx,
                        } as React.CSSProperties
                      }
                    >
                      <span aria-hidden="true" className="tp-tape tp-tape--center" />
                      <span className="tp-polaroid__photo">
                        <img
                          alt={photo.caption}
                          decoding="async"
                          height={433}
                          loading="lazy"
                          src={photo.src}
                          style={{
                            color: 'transparent',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                          width={433}
                        />
                      </span>
                      <span className="tp-polaroid__caption font-scrawl">{photo.caption}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Facade Ground */}
            <div className="tp-facade__ground">
              <span aria-hidden="true" className="tp-facade__door" />
              <span aria-hidden="true" className="tp-lamp">
                <span className="tp-lamp__light" />
              </span>
              <Link className="btn btn-primary tp-facade__cta" to="/happy-families">
                See all happy families
              </Link>
              {/* Puppy Stop 5 */}
              <div
                className="pup-stop tp-dusk__teddy"
                data-facing="right"
                data-pose="sit"
                data-pup-stop="true"
              >
                <div className="pup-buddy" data-facing="right">
                  <TeddyPuppetSVG pose="sit" />
                  <span aria-hidden="true" className="pup-bubble" data-show="false" />
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tp-street__pavement" />
        </div>

        {/* Full-screen Photo Viewer */}
        {viewerIdx !== null && (
          <FullScreenImageViewer
            initialIndex={viewerIdx}
            photos={viewerPhotos}
            onClose={() => setViewerIdx(null)}
          />
        )}
      </section>
    </div>
  );
};
