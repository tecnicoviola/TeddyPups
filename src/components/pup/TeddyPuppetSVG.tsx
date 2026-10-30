import React from 'react';
import {
  PUP_COLORS,
  PUP_PATHS,
  PUP_LEGS,
  PUP_POSES,
  computePupTransforms,
  PupPose,
  PupMotion,
} from './pupConstants';

interface LegProps {
  part: string;
  d: string;
  len: number;
  fill: string;
  transform?: string;
  opacity?: number;
}

const strokeBase = {
  stroke: PUP_COLORS.ink,
  strokeWidth: 3.4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

const strokeNone = {
  ...strokeBase,
  fill: 'none',
};

function LegPart({ part, d, len, fill, transform, opacity }: LegProps) {
  const toePath = `M-3.5 ${len - 7} v5 M4.5 ${len - 7} v5`;
  return (
    <g data-p={part} transform={transform} opacity={opacity}>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} {...strokeNone} />
      <path d={toePath} {...strokeNone} strokeWidth={2.4} />
    </g>
  );
}

function OpenEyes() {
  return (
    <>
      <ellipse cx={194} cy={PUP_COLORS.eyeY} rx={7.4} ry={8.6} fill={PUP_COLORS.ink} />
      <ellipse cx={230} cy={PUP_COLORS.eyeY} rx={7.4} ry={8.6} fill={PUP_COLORS.ink} />
      <circle cx={196.6} cy={PUP_COLORS.eyeY - 3.4} r={2.7} fill="#fff" />
      <circle cx={232.6} cy={PUP_COLORS.eyeY - 3.4} r={2.7} fill="#fff" />
      <circle cx={192} cy={PUP_COLORS.eyeY + 3.2} r={1.2} fill="#fff" />
      <circle cx={228} cy={PUP_COLORS.eyeY + 3.2} r={1.2} fill="#fff" />
    </>
  );
}

interface TeddyPuppetSVGProps {
  pose?: string | PupPose;
  facing?: 'left' | 'right' | number;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
  motion?: PupMotion;
}

export const TeddyPuppetSVG: React.FC<TeddyPuppetSVGProps> = ({
  pose = 'sit',
  facing = 'right',
  className = '',
  label,
  style,
  motion,
}) => {
  const poseObj: PupPose = typeof pose === 'string' ? PUP_POSES[pose] || PUP_POSES.sit : pose;
  const initialMotion: PupMotion = motion || {
    phase: 0,
    stride: 0,
    time: 0,
    wag: 0,
    gazeX: 0,
    gazeY: 0,
    blink: 0,
    ear: 0,
  };
  const f = computePupTransforms(poseObj, initialMotion);

  let rootTransform: string | undefined = undefined;
  if (facing === 'left' || facing === -1) {
    rootTransform = `translate(${PUP_COLORS.W} 0) scale(-1 1)`;
  } else if (typeof facing === 'number' && facing !== 1) {
    rootTransform = `translate(${PUP_COLORS.W / 2} 0) scale(${facing.toFixed(3)} 1) translate(${-PUP_COLORS.W / 2} 0)`;
  }

  return (
    <svg
      viewBox={`0 0 ${PUP_COLORS.W} ${PUP_COLORS.R}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
      focusable="false"
    >
      <g data-p="root" transform={rootTransform}>
        {/* Soft ground shadow */}
        <ellipse
          data-p="shadow"
          cx={PUP_PATHS.shadow.cx}
          cy={PUP_PATHS.shadow.cy}
          rx={PUP_PATHS.shadow.rx}
          ry={PUP_PATHS.shadow.ry}
          fill={PUP_COLORS.ink}
          opacity={f.shadowOpacity as number}
          transform={f.shadow as string}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Side-facing / walking full body (opacity controlled by 1 - front) */}
        <g data-p="body" transform={f.body as string} opacity={f.side as number}>
          <LegPart
            part="bf"
            d={PUP_LEGS.backFar}
            len={PUP_COLORS.groundY - 192}
            fill={PUP_COLORS.furShade}
            transform={f.bf as string}
            opacity={f.backLegs as number}
          />
          <LegPart
            part="ff"
            d={PUP_LEGS.frontFar}
            len={PUP_COLORS.groundY - 192}
            fill={PUP_COLORS.furShade}
            transform={f.ff as string}
          />

          {/* Wagging tail */}
          <g data-p="tail" transform={f.tail as string}>
            <path d={PUP_PATHS.tailStem} {...strokeNone} strokeWidth={9} />
            <path
              d={PUP_PATHS.tailStem}
              stroke={PUP_COLORS.fur}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
            <path d={PUP_PATHS.tail} fill={PUP_COLORS.fur} {...strokeBase} />
          </g>

          <LegPart
            part="bn"
            d={PUP_LEGS.back}
            len={PUP_COLORS.groundY - 194}
            fill={PUP_COLORS.fur}
            transform={f.bn as string}
            opacity={f.backLegs as number}
          />
          <path d={PUP_PATHS.body} fill={PUP_COLORS.fur} {...strokeBase} />
          <path d={PUP_PATHS.chest} fill={PUP_COLORS.fur} {...strokeBase} />
          <LegPart
            part="fn"
            d={PUP_LEGS.front}
            len={PUP_COLORS.groundY - 194}
            fill={PUP_COLORS.fur}
            transform={f.fn as string}
          />
        </g>

        {/* Haunch (sitting hip) */}
        <g data-p="haunch" opacity={f.haunchOpacity as number} transform={f.haunch as string}>
          <path d={PUP_PATHS.haunch} fill={PUP_COLORS.fur} {...strokeBase} />
          <path d={PUP_PATHS.haunchPaw} fill={PUP_COLORS.fur} {...strokeBase} />
          <path d="M132 222v5M139 222v5" {...strokeNone} strokeWidth={2.4} />
        </g>

        {/* Head with collar, ears, muzzle, eyes, nose, mouth */}
        <g data-p="head" transform={f.head as string}>
          <path d={PUP_PATHS.collar} fill={PUP_COLORS.collar} {...strokeBase} strokeWidth={3} />
          <path d={PUP_PATHS.tag} fill={PUP_COLORS.cream} {...strokeBase} strokeWidth={2.4} />
          <path
            data-p="earL"
            d={PUP_PATHS.earL}
            fill={PUP_COLORS.furShade}
            {...strokeBase}
            transform={f.earL as string}
          />
          <path
            data-p="earR"
            d={PUP_PATHS.earR}
            fill={PUP_COLORS.furShade}
            {...strokeBase}
            transform={f.earR as string}
          />
          <path d={PUP_PATHS.head} fill={PUP_COLORS.fur} {...strokeBase} />
          <path d={PUP_PATHS.topknot} fill={PUP_COLORS.fur} {...strokeBase} strokeWidth={3} />
          <path d={PUP_PATHS.muzzle} fill={PUP_COLORS.cream} />

          {/* Blush circles */}
          <circle cx={181} cy={116} r={7} fill={PUP_COLORS.blush} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={PUP_COLORS.blush} opacity={0.85} />

          {/* Eyes: tracking + blinking */}
          <g data-p="eyes" transform={f.eyes as string}>
            <g data-p="open" opacity={f.openEyes as number}>
              <g data-p="blink" transform={f.blink as string}>
                <OpenEyes />
              </g>
            </g>
          </g>

          {/* Happy closed eyes (^ ^) */}
          <path
            data-p="happy"
            d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
            {...strokeNone}
            opacity={f.happyEyes as number}
          />

          {/* Shut sleeping eyes */}
          <path
            data-p="shut"
            d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
            {...strokeNone}
            opacity={f.shutEyes as number}
          />

          {/* Nose */}
          <path d={PUP_PATHS.nose} fill={PUP_COLORS.ink} />

          {/* Mouth */}
          <path d={PUP_PATHS.mouth} {...strokeNone} strokeWidth={3} />

          {/* Tongue */}
          <path
            data-p="tongue"
            d={PUP_PATHS.tongue}
            fill="#e98c8c"
            stroke={PUP_COLORS.ink}
            strokeWidth={2.2}
            strokeLinejoin="round"
            opacity={f.tongue as number}
          />

          {/* Open mouth */}
          <g data-p="mouth" opacity={f.mouth as number}>
            <path d={PUP_PATHS.mouthOpen} fill="#6b2a1c" {...strokeBase} strokeWidth={2.6} />
            <path
              d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z"
              fill="#e98c8c"
            />
          </g>
        </g>

        {/* Ledge front paws (resting over scalloped cloud/quilt edge when peeking) */}
        <g data-p="ledge" opacity={f.ledge as number}>
          <path d={PUP_PATHS.ledgePaws} fill={PUP_COLORS.fur} {...strokeBase} />
          <path d={PUP_PATHS.ledgeToes} {...strokeNone} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  );
};

