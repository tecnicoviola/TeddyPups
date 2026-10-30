import React from 'react';
import goneHomeData from '../data/alreadyGoneHomeHtml.json';

export const AlreadyGoneHomeSection: React.FC = () => {
  return (
    <section
      aria-labelledby="gone-title"
      className="tp-gone-strip"
      dangerouslySetInnerHTML={{ __html: goneHomeData.innerHtml }}
    />
  );
};

export default AlreadyGoneHomeSection;

