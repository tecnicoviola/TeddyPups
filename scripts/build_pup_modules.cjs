const fs = require('fs');
const path = require('path');

function t(e, a, r, s, i, n, o = -Math.PI / 2, l = 0) {
  let d = (l * Math.PI) / 180;
  let c = (t, i) => {
    let n = Math.cos(t) * (r + i);
    let o = Math.sin(t) * (s + (s / r) * i);
    return (
      (e + n * Math.cos(d) - o * Math.sin(d)).toFixed(1) +
      ' ' +
      (a + n * Math.sin(d) + o * Math.cos(d)).toFixed(1)
    );
  };
  let h = '';
  for (let k = 0; k < i; k++) {
    let st = o + (k / i) * Math.PI * 2;
    let end = o + ((k + 1) / i) * Math.PI * 2;
    let mid = (st + end) / 2;
    h += (0 === k ? 'M' + c(st, 0) : '') + 'Q' + c(mid, 2.1 * n) + ' ' + c(end, 0);
  }
  return h + 'Z';
}

function f(e, t) {
  let a = e / 2;
  return (
    'M' +
    -a +
    ' -14 C' +
    -a +
    ' 4 -12 ' +
    (t - 18) +
    ' -12 ' +
    (t - 9) +
    ' C-12 ' +
    (t - 2) +
    ' -7 ' +
    t +
    ' 0 ' +
    t +
    ' C9 ' +
    t +
    ' 13 ' +
    (t - 3) +
    ' 13 ' +
    (t - 9) +
    ' C13 ' +
    (t - 18) +
    ' ' +
    a +
    ' 4 ' +
    a +
    ' -14'
  );
}

const s = [186, 194];
const i = [168, 192];
const n = [110, 194];
const o = [94, 192];
const a_pt = [196, 206];
const r_pt = [212, 100];
const l_pt = [84, 150];
const d_pt = [174, 82];
const c_pt = [250, 82];

const paths = {
  body: t(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: t(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: t(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: t(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw:
    'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: t(212, 100, 51, 46, 16, 3.6),
  topknot: t(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: t(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: t(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle:
    'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth:
    'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws:
    'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  shadow: { cx: 150, cy: 230, rx: 92, ry: 7 }
};

const legs = {
  front: f(24, 228 - s[1]),
  frontFar: f(22, 228 - i[1]),
  back: f(30, 228 - n[1]),
  backFar: f(28, 228 - o[1])
};

const outDir = path.join(__dirname, '..', 'src', 'components', 'pup');
fs.mkdirSync(outDir, { recursive: true });

const content = `// Re-engineered directly from module 1063 and 55334 of original Next.js bundle

export interface PupPose {
  bodyRot: number;
  bodyX: number;
  bodyY: number;
  stretch: number;
  headX: number;
  headY: number;
  headRot: number;
  earL: number;
  earR: number;
  tail: number;
  fn: number;
  ff: number;
  bn: number;
  bf: number;
  sit: number;
  eyes: number;
  happy: number;
  tongue: number;
  mouth: number;
  front: number;
}

export interface PupMotion {
  phase: number;
  stride: number;
  time: number;
  wag: number;
  gazeX: number;
  gazeY: number;
  blink: number;
  ear: number;
}

export const PUP_COLORS = {
  blush: '#f9b9a6',
  collar: '#a24a1a',
  eyeY: 98,
  fur: '#f2be6b',
  cream: '#fbe3b4',
  furShade: '#e4a352',
  groundY: 228,
  headCenter: [212, 100] as [number, number],
  ink: '#2a170e',
  W: 300,
  R: 240,
  pivotA: ${JSON.stringify(a_pt)} as [number, number],
  pivotR: ${JSON.stringify(r_pt)} as [number, number],
  shoulderN: ${JSON.stringify(s)} as [number, number],
  shoulderF: ${JSON.stringify(i)} as [number, number],
  hipN: ${JSON.stringify(n)} as [number, number],
  hipF: ${JSON.stringify(o)} as [number, number],
  tailBase: ${JSON.stringify(l_pt)} as [number, number],
  earL: ${JSON.stringify(d_pt)} as [number, number],
  earR: ${JSON.stringify(c_pt)} as [number, number],
};

export const PUP_PATHS = ${JSON.stringify(paths, null, 2)};

export const PUP_LEGS = ${JSON.stringify(legs, null, 2)};

export const PUP_DEFAULT_POSE: PupPose = {
  bodyRot: 0,
  bodyX: 0,
  bodyY: 0,
  stretch: 1,
  headX: 0,
  headY: 0,
  headRot: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  fn: 0,
  ff: 0,
  bn: 0,
  bf: 0,
  sit: 0,
  eyes: 1,
  happy: 0,
  tongue: 0,
  mouth: 0,
  front: 0,
};

export const PUP_POSES: Record<string, PupPose> = {
  stand: PUP_DEFAULT_POSE,
  walk: {
    ...PUP_DEFAULT_POSE,
    tail: -6,
    tongue: 1,
  },
  sit: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -24,
    bodyY: -2,
    headX: -10,
    headY: -6,
    tail: 34,
    sit: 1,
    tongue: 1,
  },
  peek: {
    ...PUP_DEFAULT_POSE,
    headY: 4,
    earL: -6,
    earR: 6,
    tail: -20,
    front: 1,
    tongue: 1,
  },
  snug: {
    ...PUP_DEFAULT_POSE,
    headY: 9,
    headRot: 4,
    earL: 3,
    earR: -3,
    tail: -20,
    front: 1,
    tongue: 0,
  },
  lie: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 12,
    headY: 40,
    headRot: 3,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 58,
    tongue: 0,
  },
  sleep: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 14,
    headY: 44,
    headRot: -8,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 64,
    eyes: 0,
    earL: 4,
    earR: -4,
  },
  settle: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -5,
    bodyY: 22,
    headX: 10,
    headY: 16,
    fn: -84,
    ff: -80,
    sit: 1,
    tail: 40,
    tongue: 1,
  },
  hop: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -9,
    stretch: 1.06,
    headY: -6,
    fn: -42,
    ff: -32,
    bn: 40,
    bf: 30,
    earL: -26,
    earR: 26,
    tail: -24,
    tongue: 1,
  },
  sniff: {
    ...PUP_DEFAULT_POSE,
    bodyRot: 7,
    headX: 16,
    headY: 32,
    headRot: 9,
    tail: -14,
    fn: 6,
    ff: 4,
  },
  bow: {
    ...PUP_DEFAULT_POSE,
    bodyRot: 15,
    bodyY: 2,
    headX: 14,
    headY: 30,
    fn: -58,
    ff: -52,
    tail: -32,
    happy: 1,
    tongue: 1,
  },
  beg: {
    ...PUP_DEFAULT_POSE,
    bodyRot: -36,
    bodyY: -6,
    headX: -18,
    headY: -18,
    sit: 1,
    fn: -70,
    ff: -64,
    tail: 30,
    happy: 1,
    tongue: 1,
  },
};

const x = (v: number) => Math.round(100 * v) / 100;
const b = (e: number, [t, a]: [number, number]) => \`rotate(\${x(e)} \${t} \${a})\`;

export function lerpPose(from: PupPose, to: PupPose, alpha: number): PupPose {
  const res = { ...from };
  const keys = Object.keys(from) as (keyof PupPose)[];
  for (const k of keys) {
    res[k] = from[k] + (to[k] - from[k]) * alpha;
  }
  return res;
}

export function computePupTransforms(e: PupPose, t: PupMotion): Record<string, string | number> {
  const h = Math.sin(t.phase);
  const f = Math.sin(t.phase + Math.PI);
  const u = 20 + 10 * t.stride;
  const p = (1 - Math.cos(2 * t.phase)) / 2;
  const g = +(t.stride > 0.01);
  const m = Math.sin(2.4 * t.time) * (1 - g);
  const w = e.bodyY - p * (2.5 + 4 * t.stride) * g + 0.6 * m;
  const v = e.bodyRot + 1.6 * Math.sin(t.phase) * g;
  const j = -e.bodyRot;
  const M = 5 + 17 * t.wag;
  const k = 1.2 + 2.6 * t.wag;
  const $ = e.tail + Math.sin(t.time * k * Math.PI * 2) * M;
  const _ = -((1 - Math.cos(2 * t.phase - 0.7)) / 2) * (2 + 3 * t.stride) * g + 0.9 * m;

  return {
    body: \`translate(\${x(e.bodyX)} \${x(w)}) \${b(v, PUP_COLORS.pivotA)} translate(\${PUP_COLORS.pivotA[0]} 0) scale(\${x(e.stretch)} 1) translate(\${-PUP_COLORS.pivotA[0]} 0)\`,
    fn: \`translate(\${PUP_COLORS.shoulderN[0]} \${PUP_COLORS.shoulderN[1]}) rotate(\${x(e.fn + j + h * u * g)})\`,
    ff: \`translate(\${PUP_COLORS.shoulderF[0]} \${PUP_COLORS.shoulderF[1]}) rotate(\${x(e.ff + j + f * u * g)})\`,
    bn: \`translate(\${PUP_COLORS.hipN[0]} \${PUP_COLORS.hipN[1]}) rotate(\${x(e.bn + f * u * g)})\`,
    bf: \`translate(\${PUP_COLORS.hipF[0]} \${PUP_COLORS.hipF[1]}) rotate(\${x(e.bf + h * u * g)})\`,
    tail: b($, PUP_COLORS.tailBase),
    haunch: \`translate(0 \${x(-0.06 * e.bodyRot)})\`,
    head: \`translate(\${x(e.headX)} \${x(e.headY + _)})\ \${b(e.headRot + 1.4 * Math.sin(t.phase) * g, PUP_COLORS.pivotR)}\`,
    earL: b(e.earL + t.ear + 4 * Math.sin(2 * t.phase) * g, PUP_COLORS.earL),
    earR: b(e.earR - t.ear - 4 * Math.sin(2 * t.phase) * g, PUP_COLORS.earR),
    eyes: \`translate(\${x(3.4 * t.gazeX)} \${x(2.6 * t.gazeY)})\`,
    blink: \`translate(0 \${x(98 * t.blink * 0.92)}) scale(1 \${x(1 - 0.92 * t.blink)})\`,
    openEyes: x(Math.max(0, e.eyes - e.happy)),
    happyEyes: x(Math.min(e.happy, e.eyes)),
    shutEyes: x(1 - e.eyes),
    tongue: x(e.tongue * (1 - e.mouth)),
    mouth: x(e.mouth),
    backLegs: x(1 - e.sit),
    haunchOpacity: x(e.sit * (1 - e.front)),
    side: x(1 - e.front),
    ledge: x(e.front),
    shadow: \`translate(\${x(0.6 * e.bodyX)} 0) scale(\${x(1 - 0.05 * p * g)} 1)\`,
    shadowOpacity: x(0.12 * (1 - e.front)),
  };
}

export const PUP_ATTR_MAP: [string, string, string][] = [
  ['root', 'transform', 'root'],
  ['shadow', 'transform', 'shadow'],
  ['shadow', 'opacity', 'shadowOpacity'],
  ['body', 'transform', 'body'],
  ['body', 'opacity', 'side'],
  ['bf', 'transform', 'bf'],
  ['bf', 'opacity', 'backLegs'],
  ['bn', 'transform', 'bn'],
  ['bn', 'opacity', 'backLegs'],
  ['ff', 'transform', 'ff'],
  ['fn', 'transform', 'fn'],
  ['tail', 'transform', 'tail'],
  ['haunch', 'transform', 'haunch'],
  ['haunch', 'opacity', 'haunchOpacity'],
  ['head', 'transform', 'head'],
  ['earL', 'transform', 'earL'],
  ['earR', 'transform', 'earR'],
  ['eyes', 'transform', 'eyes'],
  ['open', 'opacity', 'openEyes'],
  ['blink', 'transform', 'blink'],
  ['happy', 'opacity', 'happyEyes'],
  ['shut', 'opacity', 'shutEyes'],
  ['tongue', 'opacity', 'tongue'],
  ['mouth', 'opacity', 'mouth'],
  ['ledge', 'opacity', 'ledge'],
];
`;

fs.writeFileSync(path.join(outDir, 'pupConstants.ts'), content, 'utf8');
console.log('Successfully created pupConstants.ts');
