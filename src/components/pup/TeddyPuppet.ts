import {
  PupPose,
  PupMotion,
  PUP_POSES,
  PUP_COLORS,
  lerpPose,
  computePupTransforms,
  PUP_ATTR_MAP,
} from './pupConstants';

const l = (e: number, t: number) => 1 - Math.exp(-e / t);
const clamp = (val: number, min = -1, max = 1) => Math.max(min, Math.min(max, val));

export class TeddyPuppet {
  public svg: SVGSVGElement;
  public els: Map<string, SVGElement> = new Map();
  public written: Map<string, string> = new Map();
  public pose: PupPose;
  public target: PupPose;
  public m: PupMotion;
  public facing: number;
  public facingTarget: number;
  public strideTarget: number = 0;
  public wagTarget: number = 0.35;
  public gazeTarget: { x: number; y: number } = { x: 0, y: 0 };
  public tilt: number = 0;
  public tiltTarget: number = 0;
  public earV: number = 0;
  public nextBlink: number = 1.2;
  public blinkAt: number = -1;
  public woofUntil: number = 0;
  public bounce: number = 0;
  public bounceV: number = 0;
  public offset: number = 0;
  public offsetTarget: number = 0;
  public pet: number = 0;
  public petTarget: number = 0;
  public turn: number = 0.07;
  public lean: number = 0;

  constructor(svg: SVGSVGElement, initialPose: string | PupPose = 'sit', facing = 1) {
    this.svg = svg;
    this.m = {
      phase: 0,
      stride: 0,
      time: 0,
      wag: 0,
      gazeX: 0,
      gazeY: 0,
      blink: 0,
      ear: 0,
    };
    svg.querySelectorAll('[data-p]').forEach((el) => {
      const p = (el as HTMLElement).dataset.p;
      if (p) this.els.set(p, el as SVGElement);
    });

    const basePose = typeof initialPose === 'string' ? PUP_POSES[initialPose] || PUP_POSES.sit : initialPose;
    this.pose = { ...basePose };
    this.target = { ...basePose };
    this.facing = facing;
    this.facingTarget = facing;
  }

  setPose(p: string | PupPose) {
    this.target = typeof p === 'string' ? PUP_POSES[p] || PUP_POSES.sit : p;
  }

  jump(p: string, facing?: number) {
    const poseObj = PUP_POSES[p] || PUP_POSES.sit;
    this.pose = { ...poseObj };
    this.target = poseObj;
    if (facing !== undefined) {
      this.facing = this.facingTarget = facing;
    }
  }

  face(dir: number, turn = 0.07) {
    this.facingTarget = dir;
    this.turn = turn;
  }

  get facingDir() {
    return this.facingTarget;
  }

  stride(s: number) {
    this.strideTarget = clamp(s, 0, 1);
  }

  advance(dist: number) {
    this.m.phase += (dist / 46) * Math.PI;
  }

  walkedTo(totalDist: number) {
    this.m.phase = (totalDist / 46) * Math.PI;
  }

  wag(w: number) {
    this.wagTarget = clamp(w, 0, 1);
  }

  cock(tilt: number) {
    this.tiltTarget = tilt;
  }

  lookAt(pt: { x: number; y: number } | null) {
    if (!pt) {
      this.gazeTarget = { x: 0, y: 0 };
      return;
    }
    const rect = this.svg.getBoundingClientRect();
    const pivotX = this.facingTarget > 0 ? PUP_COLORS.headCenter[0] : PUP_COLORS.W - PUP_COLORS.headCenter[0];
    const originX = rect.left + (pivotX / PUP_COLORS.W) * rect.width;
    const originY = rect.top + (PUP_COLORS.eyeY / PUP_COLORS.R) * rect.height;
    const dx = pt.x - originX;
    const dy = pt.y - originY;
    const dist = Math.hypot(dx, dy) || 1;
    const d = Math.min(1, dist / 160);
    this.gazeTarget = {
      x: (dx / dist) * d * this.facingTarget,
      y: (dy / dist) * d,
    };
  }

  woof(time: number) {
    this.woofUntil = time + 0.34;
    this.bounceV = -150;
    this.earV += 260;
  }

  jolt(mult = 1) {
    this.earV += 220 * mult;
  }

  hop(mult = 1) {
    this.bounceV = -230 * mult;
    this.earV += 200 * mult;
  }

  yawn(time: number, dur = 0.9) {
    this.woofUntil = time + dur;
  }

  dash(offset: number) {
    this.offsetTarget = offset;
  }

  petting(isPet: boolean) {
    this.petTarget = isPet ? 1 : 0;
  }

  reset() {
    this.offsetTarget = 0;
    this.tiltTarget = 0;
    this.petTarget = 0;
  }

  tick(delta: number, time: number) {
    const dt = Math.min(delta, 0.05);
    const m = this.m;
    m.time = time;

    // Animate the idle motion cycle so the tail/body keep moving naturally.
    m.phase += dt * (0.9 + 0.8 * Math.max(m.wag, this.wagTarget));

    // Smooth lerp pose toward target
    this.pose = lerpPose(this.pose, this.target, l(dt, 0.16));

    // Smooth turning towards facingTarget
    this.facing += (this.facingTarget - this.facing) * l(dt, this.turn);

    // Stride lerp
    m.stride += (this.strideTarget - m.stride) * l(dt, 0.12);
    if (m.stride < 0.012 && this.strideTarget === 0) {
      m.stride = 0;
    }

    // Wag lerp
    m.wag += (this.wagTarget - m.wag) * l(dt, 0.4);

    // Gaze tracking lerp
    m.gazeX += (this.gazeTarget.x - m.gazeX) * l(dt, 0.07);
    m.gazeY += (this.gazeTarget.y - m.gazeY) * l(dt, 0.07);

    // Tilt lerp
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * l(dt, 0.18);

    // Ear spring physics
    this.earV += (-150 * m.ear - 10 * this.earV) * dt;
    m.ear = clamp(m.ear + this.earV * dt, -28, 28);

    // Bounce spring physics
    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt;
    this.bounce += this.bounceV * dt;

    // Horizontal offset lerp
    const prevOffset = this.offset;
    this.offset += (this.offsetTarget - this.offset) * l(dt, 0.2);
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) {
      this.offset = this.offsetTarget;
    }
    const offsetDiff = Math.abs(this.offset - prevOffset);
    if (offsetDiff) this.advance(offsetDiff);
    const n = dt > 0 ? Math.min(1, offsetDiff / dt / 180) : 0;

    // Petting / happy transition
    this.pet += (this.petTarget - this.pet) * l(dt, 0.15);

    // Blinking logic
    if (time > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = time;
      this.nextBlink = time + 2.2 + 3.8 * Math.random();
      if (Math.random() < 0.18) {
        this.nextBlink = time + 0.32;
      }
    }
    const blinkPhase = (time - this.blinkAt) / 0.15;
    m.blink = blinkPhase >= 0 && blinkPhase <= 1 ? Math.sin(blinkPhase * Math.PI) : 0;

    // Build effective pose
    const effectivePose: PupPose = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: time < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet),
    };

    const effectiveMotion: PupMotion = n > m.stride ? { ...m, stride: n } : m;
    const transforms = computePupTransforms(effectivePose, effectiveMotion);

    // Smooth horizontal turning around center
    const u = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing;
    const rootTransform = `translate(${this.offset.toFixed(1)} 0) translate(${PUP_COLORS.W / 2} 0) scale(${u.toFixed(3)} 1) translate(${-PUP_COLORS.W / 2} 0)`;

    // Write attributes directly to cached SVG elements
    for (const [part, attr, prop] of PUP_ATTR_MAP) {
      const el = this.els.get(part);
      if (!el) continue;
      const val = prop === 'root' ? rootTransform : String(transforms[prop] ?? '');
      const key = `${part}:${attr}`;
      if (this.written.get(key) !== val) {
        el.setAttribute(attr, val);
        this.written.set(key, val);
      }
    }
  }
}

