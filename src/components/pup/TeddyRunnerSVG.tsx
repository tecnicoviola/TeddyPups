import React from 'react';
import { PUP_COLORS, PUP_PATHS, PUP_LEGS } from './pupConstants';

const strokeProps = {
  stroke: PUP_COLORS.ink,
  strokeWidth: 3.4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

const strokeOutline = {
  ...strokeProps,
  fill: 'none',
};

interface LegProps {
  cls: string;
  at: [number, number];
  d: string;
  len: number;
  fill: string;
}

const RunnerLeg: React.FC<LegProps> = ({ cls, at, d, len, fill }) => {
  return (
    <g
      className={`tp-runner__leg ${cls}`}
      style={{ transformOrigin: `${at[0]}px ${at[1]}px` }}
    >
      <g transform={`translate(${at[0]} ${at[1]})`}>
        <path d={`${d}Z`} fill={fill} />
        <path d={d} {...strokeOutline} />
        <path d={`M-3.5 ${len - 7} v5 M4.5 ${len - 7} v5`} {...strokeOutline} strokeWidth={2.4} />
      </g>
    </g>
  );
};

export const TeddyRunnerSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox={`0 0 ${PUP_COLORS.W} ${PUP_COLORS.R}`}
      className={`tp-runner ${className}`}
      aria-hidden={true}
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <ellipse
        cx={150}
        cy={PUP_COLORS.groundY + 2}
        rx={86}
        ry={7}
        fill={PUP_COLORS.ink}
        opacity={0.12}
        className="tp-runner__shadow"
      />
      <g className="tp-runner__body">
        {/* Back legs far */}
        <RunnerLeg
          cls="tp-runner__leg--bf"
          at={PUP_COLORS.hipF}
          d={PUP_LEGS.backFar}
          len={PUP_COLORS.groundY - 192}
          fill={PUP_COLORS.furShade}
        />
        {/* Front legs far */}
        <RunnerLeg
          cls="tp-runner__leg--ff"
          at={PUP_COLORS.shoulderF}
          d={PUP_LEGS.frontFar}
          len={PUP_COLORS.groundY - 192}
          fill={PUP_COLORS.furShade}
        />

        {/* Tail */}
        <g
          className="tp-runner__tail"
          style={{ transformOrigin: `${PUP_COLORS.tailBase[0]}px ${PUP_COLORS.tailBase[1]}px` }}
        >
          <path d={PUP_PATHS.tailStem} {...strokeOutline} strokeWidth={9} />
          <path d={PUP_PATHS.tailStem} stroke={PUP_COLORS.fur} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={PUP_PATHS.tail} fill={PUP_COLORS.fur} {...strokeProps} />
        </g>

        {/* Back legs near */}
        <RunnerLeg
          cls="tp-runner__leg--bn"
          at={PUP_COLORS.hipN}
          d={PUP_LEGS.back}
          len={PUP_COLORS.groundY - 194}
          fill={PUP_COLORS.fur}
        />

        {/* Torso & Chest */}
        <path d={PUP_PATHS.body} fill={PUP_COLORS.fur} {...strokeProps} />
        <path d={PUP_PATHS.chest} fill={PUP_COLORS.fur} {...strokeProps} />

        {/* Front legs near */}
        <RunnerLeg
          cls="tp-runner__leg--fn"
          at={PUP_COLORS.shoulderN}
          d={PUP_LEGS.front}
          len={PUP_COLORS.groundY - 194}
          fill={PUP_COLORS.fur}
        />

        {/* Head and features */}
        <g className="tp-runner__head">
          <path d={PUP_PATHS.collar} fill={PUP_COLORS.collar} {...strokeProps} strokeWidth={3} />
          <path d={PUP_PATHS.tag} fill={PUP_COLORS.cream} {...strokeProps} strokeWidth={2.4} />
          <path
            d={PUP_PATHS.earL}
            fill={PUP_COLORS.furShade}
            {...strokeProps}
            className="tp-runner__ear"
            style={{ transformOrigin: `${PUP_COLORS.earL[0]}px ${PUP_COLORS.earL[1]}px` }}
          />
          <path
            d={PUP_PATHS.earR}
            fill={PUP_COLORS.furShade}
            {...strokeProps}
            className="tp-runner__ear tp-runner__ear--r"
            style={{ transformOrigin: `${PUP_COLORS.earR[0]}px ${PUP_COLORS.earR[1]}px` }}
          />
          <path d={PUP_PATHS.head} fill={PUP_COLORS.fur} {...strokeProps} />
          <path d={PUP_PATHS.topknot} fill={PUP_COLORS.fur} {...strokeProps} strokeWidth={3} />
          <path d={PUP_PATHS.muzzle} fill={PUP_COLORS.cream} />
          <circle cx={181} cy={116} r={7} fill={PUP_COLORS.blush} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={PUP_COLORS.blush} opacity={0.85} />
          <path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" {...strokeOutline} />
          <path d={PUP_PATHS.nose} fill={PUP_COLORS.ink} />
          <path d={PUP_PATHS.mouth} {...strokeOutline} strokeWidth={3} />
          <path d={PUP_PATHS.tongue} fill="#e98c8c" stroke={PUP_COLORS.ink} strokeWidth={2.2} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

export default TeddyRunnerSVG;

