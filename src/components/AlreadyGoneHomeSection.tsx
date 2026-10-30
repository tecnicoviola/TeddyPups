import React from 'react';
import goneHomeData from '../data/alreadyGoneHomeHtml.json';
import { sanitizeGeneratedHtml } from '../utils/mediaAssets';

export const AlreadyGoneHomeSection: React.FC = () => {
  const safeHtml = sanitizeGeneratedHtml(goneHomeData.innerHtml);

  return (
    <section
      aria-labelledby="gone-title"
      className="tp-gone-strip"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default AlreadyGoneHomeSection;

