const fs = require('fs');

let code = fs.readFileSync('src/pages/HappyFamiliesPage.tsx', 'utf8');

// Normalize line endings to \n for replacement
code = code.replace(/\r\n/g, '\n');

// replace imports
const oldImports = `import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';`;

const newImports = `import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullScreenImageViewer } from '../components/FullScreenImageViewer';
import happyFamiliesPhotos from '../data/happyFamiliesPhotos.json';`;

if (code.includes(oldImports)) {
  code = code.replace(oldImports, newImports);
  console.log('Imports replaced successfully');
} else {
  console.log('Imports already updated or mismatch');
}

// replace export const HappyFamiliesPage
const oldComponent = `export const HappyFamiliesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/cdn-cgi')) {
        e.preventDefault();
        navigate(href);
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: RAW_HTML }} />
  );
};`;

const newComponent = `export const HappyFamiliesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const printBtn = (e.target as HTMLElement).closest('.tp-wall__print');
      if (printBtn) {
        e.preventDefault();
        const ariaLabel = printBtn.getAttribute('aria-label') || '';
        const match = ariaLabel.match(/photo\\s+(\\d+)\\s+of/i);
        if (match) {
          setSelectedPhotoIndex(parseInt(match[1], 10) - 1);
        } else {
          const allPrints = Array.from(el.querySelectorAll('.tp-wall__print'));
          const idx = allPrints.indexOf(printBtn);
          if (idx >= 0) {
            setSelectedPhotoIndex(idx);
          }
        }
        return;
      }

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/cdn-cgi')) {
        e.preventDefault();
        navigate(href);
      }
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: RAW_HTML }} />
      {selectedPhotoIndex !== null && (
        <FullScreenImageViewer
          photos={happyFamiliesPhotos}
          initialIndex={selectedPhotoIndex}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </>
  );
};`;

if (code.includes(oldComponent)) {
  code = code.replace(oldComponent, newComponent);
  fs.writeFileSync('src/pages/HappyFamiliesPage.tsx', code, 'utf8');
  console.log('Successfully updated HappyFamiliesPage.tsx');
} else {
  console.error('Could not find oldComponent block to replace');
}
