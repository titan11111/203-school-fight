/* スクールクエスト combat feel kit — 既存ゲームへ後付けする戦闘層 */
(function (global) {
    const RANKS = [
        { name: 'D', need: 0, color: '#94a3b8', mult: 1, bpm: 120 },
        { name: 'C', need: 5, color: '#38bdf8', mult: 1.08, bpm: 128 },
        { name: 'B', need: 12, color: '#a78bfa', mult: 1.18, bpm: 136 },
        { name: 'A', need: 20, color: '#f472b6', mult: 1.32, bpm: 148 },
        { name: 'S', need: 32, color: '#facc15', mult: 1.5, bpm: 164 }
    ];

    function facingVec(facing) {
        if (facing === 'left') return { x: -1, y: 0 };
        if (facing === 'right') return { x: 1, y: 0 };
        if (facing === 'up') return { x: 0, y: -1 };
        return { x: 0, y: 1 };
    }

    function facingAngle(facing) {
        if (facing === 'left') return Math.PI;
        if (facing === 'up') return -Math.PI / 2;
        if (facing === 'down') return Math.PI / 2;
        return 0;
    }

    /** 円×円。中心 (px,py) 半径 pr と敵中心 (ex,ey) 半径 er */
    function circleHitsCircle(px, py, pr, ex, ey, er) {
        return Math.hypot(ex - px, ey - py) <= er + pr;
    }

    /** 円 × 軸平行矩形（見た目スプライト） */
    function circleHitsRect(px, py, pr, rect) {
        const cx = Math.max(rect.x, Math.min(px, rect.x + rect.w));
        const cy = Math.max(rect.y, Math.min(py, rect.y + rect.h));
        return Math.hypot(px - cx, py - cy) <= pr;
    }

    /** 向き付きビーム（手元から前向き）× 円 */
    function beamHitsCircle(p, ex, ey, er) {
        const len = p.beamLen || 56;
        const halfW = (p.beamWidth != null ? p.beamWidth : 32) / 2;
        const ang = facingAngle(p.facing);
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        const dx = ex - p.x;
        const dy = ey - p.y;
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;
        if (localX < -er || localX > len + er) return false;
        return Math.abs(localY) <= halfW + er;
    }

    /** ビーム矩形 × スプライト矩形。角をビーム座標へ回して重なりを見る */
    function beamHitsRect(p, rect) {
        const len = p.beamLen || 56;
        const halfW = (p.beamWidth != null ? p.beamWidth : 32) / 2;
        const ang = facingAngle(p.facing);
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        const corners = [
            [rect.x, rect.y],
            [rect.x + rect.w, rect.y],
            [rect.x, rect.y + rect.h],
            [rect.x + rect.w, rect.y + rect.h]
        ];
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < 4; i++) {
            const dx = corners[i][0] - p.x;
            const dy = corners[i][1] - p.y;
            const lx = dx * cos + dy * sin;
            const ly = -dx * sin + dy * cos;
            if (lx < minX) minX = lx;
            if (lx > maxX) maxX = lx;
            if (ly < minY) minY = ly;
            if (ly > maxY) maxY = ly;
        }
        if (maxX < 0 || minX > len) return false;
        return !(maxY < -halfW || minY > halfW);
    }

    /**
     * 見た目のスプライト箱。足元原点、上方向へ hurtH、左右 hurtW。
     * 弾・斬撃がこの箱に重なったらダメージ（絵で当たったら判定）。
     */
    function spriteBox(entity) {
        const w = entity.hurtW || Math.max(48, (entity.radius || 20) * 2.2);
        const h = entity.hurtH || Math.max(72, (entity.radius || 20) * 3.2);
        return { x: entity.x - w / 2, y: entity.y - h, w, h };
    }

    function enemyHurtbox(enemy) {
        const box = spriteBox(enemy);
        return {
            x: box.x + box.w / 2,
            y: box.y + box.h / 2,
            radius: Math.max(box.w, box.h) / 2,
            box
        };
    }

    function projectileHitsRect(p, rect) {
        if (p.kind === 'saber' || p.hitShape === 'beam') return beamHitsRect(p, rect);
        return circleHitsRect(p.x, p.y, p.radius || 10, rect);
    }

    function projectileHitsEnemy(p, enemy) {
        return projectileHitsRect(p, spriteBox(enemy));
    }

    function projectileHitsPlayer(p, player) {
        return projectileHitsRect(p, spriteBox(player));
    }

    function rectsOverlap(a, b) {
        return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    }

    function bodiesOverlap(a, b, pad) {
        pad = pad || 0;
        const A = spriteBox(a);
        const B = spriteBox(b);
        A.x -= pad;
        A.y -= pad;
        A.w += pad * 2;
        A.h += pad * 2;
        B.x -= pad;
        B.y -= pad;
        B.w += pad * 2;
        B.h += pad * 2;
        return rectsOverlap(A, B);
    }

    /**
     * 武器ごとの当たり判定定義（表示・コードの正本）。
     * 座標はすべてワールド px。被弾は見た目スプライト箱 spriteBox（足元原点・hurtW×hurtH）。
     */
    const HIT_PROFILES = {
        yoyo: {
            normal: {
                shape: 'circle',
                radius: 14,
                origin: 'muzzle(yoyo) + 20px 向き方向',
                motion: 'out: 9px/frame → life45%で return → 手元へ 11px/frame',
                multiHit: '1投射体あたり敵1体1回（hitIds）。往路・復路は別投射体',
                onHit: 'ダメージ＋ノックバック。phase=out なら即 return'
            },
            skill: {
                shape: 'circle',
                radius: 18,
                origin: '手元 muzzle(yoyo)',
                motion: '半径78pxの円周を28F回転',
                multiHit: '8Fごとに hitIds リセット（同一敵に複数ヒット可）',
                pull: true
            }
        },
        flute: {
            normal: {
                shape: 'circle',
                radiusByCombo: [11, 13, 15],
                origin: 'muzzle(flute)+28px（口元+11px下）',
                motion: '7+combo px/frame 直進、life 42F',
                multiHit: '1音符あたり敵1体1回。命中で消滅',
                onHit: 'ダメージ＋弾の進行方向へノックバック'
            },
            skill: {
                shape: 'circle',
                radius: 12,
                count: 8,
                origin: '口元 muzzle(flute)',
                motion: '全方向 6.5px/frame、life 36F',
                multiHit: '1音符あたり敵1体1回。命中で消滅',
                onHit: 'ダメージ＋放射方向へノックバック'
            }
        },
        saber: {
            normal: {
                shape: 'beam',
                beamLenByCombo: [64, 76, 88],
                beamWidth: 32,
                origin: 'muzzle(saber)+8px。手元から前向きに伸びる',
                motion: 'その場に12F。中心基準ではなく刃先方向へ判定',
                multiHit: '1斬撃あたり敵1体1回',
                onHit: 'ダメージ＋向き方向へノックバック',
                note: '判定は手元起点の矩形ビーム。旧実装の円 radius は使わない'
            },
            skill: {
                shape: 'beam',
                beamLen: 96,
                beamWidth: 36,
                origin: 'muzzle(saber) + 12px 向き方向',
                motion: '14px/frame、life 22F。手元から前向きに伸びたまま飛ぶ',
                multiHit: '1斬撃あたり敵1体1回',
                onHit: 'ダメージ＋向き方向へノックバック'
            }
        }
    };

    // 足元原点。下向きスプライトは頭まで約74pxなので、88だと頭上になる
    // フルートは口元から、さらに約2mm（iPhone論理幅で11px）下げる
    const FLUTE_DROP = 11;

    function muzzleLift(entity, kind) {
        const down = entity.facing === 'down';
        if (kind === 'flute') return down ? 54 : 68;
        if (kind === 'saber') return down ? 46 : 56;
        return down ? 42 : 50;
    }

    function muzzle(entity, along, kind) {
        along = along || 0;
        const dir = facingVec(entity.facing);
        const lift = muzzleLift(entity, kind);
        const drop = kind === 'flute' ? FLUTE_DROP : 0;
        return {
            x: entity.x + dir.x * along,
            y: entity.y - lift + dir.y * along + drop
        };
    }

    const WEAPONS = {
        yoyo: {
            id: 'yoyo',
            name: 'ヨーヨー',
            attackFrames: 16,
            skillCost: 40,
            skillFrames: 26,
            sfx: 'yoyo',
            attackAnim: function (combo) { return combo === 2 ? 'yoyo_spin_a' : 'yoyo_throw'; },
            skillAnim: 'yoyo_spin_c'
        },
        flute: {
            id: 'flute',
            name: 'フルート',
            attackFrames: 12,
            skillCost: 35,
            skillFrames: 26,
            sfx: 'flute',
            attackAnim: function (combo) { return combo === 3 ? 'flute_shot' : 'flute_play'; },
            skillAnim: 'flute_shot'
        },
        saber: {
            id: 'saber',
            name: 'ビームサーベル',
            attackFrames: 14,
            skillCost: 30,
            skillFrames: 22,
            sfx: 'saber',
            attackAnim: function () { return 'yoyo_throw'; },
            skillAnim: 'yoyo_spin_c'
        }
    };

    function weaponOf(id) {
        return WEAPONS[id] || WEAPONS.yoyo;
    }

    function fireAttack(weaponId, player, projectiles, comboStep) {
        const w = weaponOf(weaponId);
        const dir = facingVec(player.facing);
        if (w.id === 'flute') {
            const shot = muzzle(player, 28, 'flute');
            const speed = 7 + comboStep;
            projectiles.spawn({
                x: shot.x,
                y: shot.y,
                vx: dir.x * speed,
                vy: dir.y * speed,
                life: 42,
                kind: 'note',
                radius: 9 + comboStep * 2,
                damage: Math.floor(player.atk * (0.7 + comboStep * 0.25)),
                poise: 6 + comboStep * 3,
                owner: 'player',
                note: comboStep
            });
            return w;
        }
        if (w.id === 'saber') {
            const shot = muzzle(player, 8, 'saber');
            const reach = 52 + comboStep * 12;
            projectiles.spawn({
                x: shot.x,
                y: shot.y,
                vx: 0,
                vy: 0,
                life: 12,
                kind: 'saber',
                hitShape: 'beam',
                radius: 0,
                damage: Math.floor(player.atk * (1.15 + comboStep * 0.28)),
                poise: 12 + comboStep * 5,
                owner: 'player',
                facing: player.facing,
                beamLen: reach,
                beamWidth: 32,
                kbX: dir.x,
                kbY: dir.y,
                followMuzzle: true
            });
            return w;
        }
        const yo = muzzle(player, 20, 'yoyo');
        projectiles.spawn({
            x: yo.x,
            y: yo.y,
            vx: dir.x * 9,
            vy: dir.y * 9,
            life: 34,
            kind: 'yoyo',
            phase: 'out',
            homeX: yo.x,
            homeY: yo.y,
            radius: 14,
            damage: Math.floor(player.atk * (0.85 + comboStep * 0.22)),
            poise: 10 + comboStep * 4,
            owner: 'player',
            pull: comboStep === 3
        });
        return w;
    }

    function fireSkill(weaponId, player, projectiles) {
        const w = weaponOf(weaponId);
        const origin = muzzle(player, 0, w.id);
        if (w.id === 'flute') {
            for (let i = 0; i < 8; i++) {
                const a = (Math.PI * 2 / 8) * i;
                projectiles.spawn({
                    x: origin.x,
                    y: origin.y,
                    vx: Math.cos(a) * 6.5,
                    vy: Math.sin(a) * 6.5,
                    life: 36,
                    kind: 'note',
                    radius: 12,
                    damage: Math.floor(player.atk * 1.4),
                    poise: 18,
                    owner: 'player',
                    note: i
                });
            }
            return origin;
        }
        if (w.id === 'saber') {
            const dir = facingVec(player.facing);
            projectiles.spawn({
                x: origin.x + dir.x * 12,
                y: origin.y + dir.y * 12,
                vx: dir.x * 14,
                vy: dir.y * 14,
                life: 22,
                kind: 'saber',
                hitShape: 'beam',
                radius: 0,
                damage: Math.floor(player.atk * 1.85),
                poise: 26,
                owner: 'player',
                facing: player.facing,
                beamLen: 96,
                beamWidth: 36,
                kbX: dir.x,
                kbY: dir.y
            });
            return origin;
        }
        projectiles.spawn({
            x: origin.x + 70,
            y: origin.y,
            vx: 0,
            vy: 0,
            life: 28,
            kind: 'yoyo',
            homeX: origin.x,
            homeY: origin.y,
            radius: 18,
            damage: Math.floor(player.atk * 1.6),
            poise: 28,
            owner: 'player',
            spin: true,
            pull: true
        });
        return origin;
    }

    function rankOf(combo) {
        let r = RANKS[0];
        for (let i = 0; i < RANKS.length; i++) {
            if (combo >= RANKS[i].need) r = RANKS[i];
        }
        return r;
    }

    class CombatFeel {
        constructor() {
            this.hitStop = 0;
            this.slowMo = 0;
            this.slowScale = 0.32;
            this.flash = 0;
            this.vignette = 0;
            this.acc = 0;
        }

        requestHitStop(frames) {
            this.hitStop = Math.max(this.hitStop, frames | 0);
        }

        requestSlowMo(frames, scale) {
            this.slowMo = Math.max(this.slowMo, frames | 0);
            this.slowScale = scale || 0.32;
        }

        requestFlash(n) {
            this.flash = Math.max(this.flash, n || 6);
        }

        requestVignette(n) {
            this.vignette = Math.max(this.vignette, n || 20);
        }

        get timeScale() {
            if (this.hitStop > 0) return 0;
            if (this.slowMo > 0) return this.slowScale;
            return 1;
        }

        consumeStep() {
            if (this.hitStop > 0) {
                this.hitStop--;
                if (this.flash > 0) this.flash--;
                if (this.vignette > 0) this.vignette--;
                return 0;
            }
            this.acc += this.timeScale;
            if (this.slowMo > 0) this.slowMo--;
            if (this.flash > 0) this.flash--;
            if (this.vignette > 0) this.vignette--;
            if (this.acc >= 1) {
                this.acc -= 1;
                return 1;
            }
            return 0;
        }

        drawOverlay(ctx, w, h) {
            if (this.flash > 0) {
                ctx.save();
                ctx.globalAlpha = Math.min(0.45, this.flash * 0.08);
                ctx.fillStyle = '#fff7ed';
                ctx.fillRect(0, 0, w, h);
                ctx.restore();
            }
            if (this.vignette > 0 || this.slowMo > 0) {
                ctx.save();
                const a = this.slowMo > 0 ? 0.28 : this.vignette * 0.012;
                const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.72);
                g.addColorStop(0, 'rgba(0,0,0,0)');
                g.addColorStop(1, `rgba(15,6,24,${a})`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.restore();
            }
        }
    }

    class ComboRank {
        constructor() {
            this.count = 0;
            this.timer = 0;
            this.maxTimer = 110;
            this.best = 0;
            this.justFlash = 0;
            this.breakFlash = 0;
        }

        get rank() {
            return rankOf(this.count);
        }

        registerHit(bonus) {
            this.count += bonus || 1;
            this.timer = this.maxTimer;
            if (this.count > this.best) this.best = this.count;
            return this.rank;
        }

        registerJust() {
            this.justFlash = 24;
            return this.registerHit(2);
        }

        registerBreak() {
            this.breakFlash = 28;
            return this.registerHit(3);
        }

        update() {
            if (this.timer > 0) {
                this.timer--;
                if (this.timer <= 0) this.count = 0;
            }
            if (this.justFlash > 0) this.justFlash--;
            if (this.breakFlash > 0) this.breakFlash--;
        }

        reset() {
            this.count = 0;
            this.timer = 0;
        }
    }

    class ProjectilePool {
        constructor(limit) {
            this.limit = limit || 48;
            this.live = [];
            this.pool = [];
        }

        spawn(data) {
            const p = this.pool.pop() || {};
            p.x = data.x;
            p.y = data.y;
            p.vx = data.vx || 0;
            p.vy = data.vy || 0;
            p.life = data.life || 40;
            p.maxLife = p.life;
            p.kind = data.kind || 'note';
            p.radius = data.radius || 10;
            p.damage = data.damage || 10;
            p.poise = data.poise || 8;
            p.owner = data.owner || 'player';
            p.phase = data.phase || 'fly';
            p.note = data.note || 0;
            p.pull = !!data.pull;
            p.spin = !!data.spin;
            p.homeX = data.homeX || 0;
            p.homeY = data.homeY || 0;
            p.facing = data.facing || 'right';
            p.beamLen = data.beamLen || 0;
            p.beamWidth = data.beamWidth || 0;
            p.hitShape = data.hitShape || '';
            p.kbX = data.kbX != null ? data.kbX : p.vx;
            p.kbY = data.kbY != null ? data.kbY : p.vy;
            p.followMuzzle = !!data.followMuzzle;
            p.hitIds = null;
            this.live.push(p);
            if (this.live.length > this.limit) {
                const old = this.live.shift();
                this.pool.push(old);
            }
            return p;
        }

        update(player, enemies, onHitEnemy, onHitPlayer, onHitWorld) {
            for (let i = this.live.length - 1; i >= 0; i--) {
                const p = this.live[i];
                const hand = muzzle(player, 0, 'yoyo');
                if (p.kind === 'yoyo') {
                    p.homeX = hand.x;
                    p.homeY = hand.y;
                }
                if (p.followMuzzle) {
                    const hold = muzzle(player, 8, p.kind === 'saber' ? 'saber' : p.kind);
                    p.x = hold.x;
                    p.y = hold.y;
                    p.facing = player.facing;
                } else if (p.kind === 'yoyo' && p.phase === 'return') {
                    const dx = hand.x - p.x;
                    const dy = hand.y - p.y;
                    const d = Math.hypot(dx, dy) || 1;
                    p.vx = (dx / d) * 11;
                    p.vy = (dy / d) * 11;
                    if (d < 22) p.life = 0;
                } else if (p.spin) {
                    const t = (p.maxLife - p.life) * 0.28;
                    p.x = hand.x + Math.cos(t) * 78;
                    p.y = hand.y + Math.sin(t) * 78;
                    if (p.life % 8 === 0) p.hitIds = null;
                } else {
                    p.x += p.vx;
                    p.y += p.vy;
                }

                if (p.kind === 'yoyo' && p.phase === 'out' && p.life < p.maxLife * 0.45) {
                    p.phase = 'return';
                }

                p.life--;

                if (p.owner === 'player') {
                    for (let e = 0; e < enemies.length; e++) {
                        const enemy = enemies[e];
                        if (!enemy.isAlive || enemy.area !== player._area) continue;
                        if (projectileHitsEnemy(p, enemy)) {
                            const key = enemy._uid || e;
                            p.hitIds = p.hitIds || Object.create(null);
                            if (!p.hitIds[key]) {
                                p.hitIds[key] = 1;
                                onHitEnemy(enemy, p);
                                if (p.kind === 'yoyo' && p.phase === 'out') p.phase = 'return';
                                if (p.kind === 'note') p.life = 0;
                            }
                        }
                    }
                } else if (onHitPlayer) {
                    if (projectileHitsPlayer(p, player)) onHitPlayer(p);
                }

                if (onHitWorld && p.owner === 'player') onHitWorld(p);

                if (p.life <= 0) {
                    this.live.splice(i, 1);
                    this.pool.push(p);
                }
            }
        }

        draw(ctx) {
            for (let i = 0; i < this.live.length; i++) {
                const p = this.live[i];
                ctx.save();
                ctx.translate(p.x | 0, p.y | 0);
                if (p.kind === 'yoyo') {
                    ctx.strokeStyle = '#fde68a';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    if (p.homeX || p.homeY) {
                        ctx.lineTo((p.homeX - p.x) | 0, (p.homeY - p.y) | 0);
                    } else {
                        ctx.lineTo((-p.vx * 3) | 0, (-p.vy * 3) | 0);
                    }
                    ctx.stroke();
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(-7, -7, 14, 14);
                    ctx.fillStyle = '#fde68a';
                    ctx.fillRect(-3, -3, 6, 6);
                } else if (p.kind === 'saber') {
                    const ang = p.facing === 'left' ? Math.PI : p.facing === 'up' ? -Math.PI / 2 : p.facing === 'down' ? Math.PI / 2 : 0;
                    const len = p.beamLen || 64;
                    const bw = p.beamWidth || 32;
                    ctx.rotate(ang);
                    ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
                    ctx.fillRect(0, ((-bw / 2) | 0), len | 0, bw | 0);
                    ctx.fillStyle = '#6ee7b7';
                    ctx.fillRect(0, -6, len | 0, 12);
                    ctx.fillStyle = '#ecfdf5';
                    ctx.fillRect(0, -2, len | 0, 4);
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(-8, -5, 12, 10);
                } else if (p.kind === 'note') {
                    ctx.fillStyle = p.note % 2 ? '#c084fc' : '#67e8f9';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 12px DotGothic16, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.note % 2 ? '♪' : '♫', 0, 1);
                } else if (p.kind === 'heavy') {
                    ctx.fillStyle = '#2b0f3a';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#f472b6';
                    ctx.lineWidth = 5;
                    ctx.stroke();
                    ctx.fillStyle = '#7f1d1d';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius * 0.62, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fde68a';
                    ctx.font = '900 22px DotGothic16, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('罰', 0, 1);
                } else {
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (global.GameState && global.GameState.debugHitboxes) {
                    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
                    ctx.lineWidth = 1.5;
                    if (p.kind === 'saber' || p.hitShape === 'beam') {
                        const len = p.beamLen || 64;
                        const bw = p.beamWidth || 32;
                        ctx.strokeRect(0, (-bw / 2) | 0, len | 0, bw | 0);
                    } else if (p.radius > 0) {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                ctx.restore();
            }
        }
    }

    class DestructibleField {
        constructor() {
            this.items = [];
        }

        seed(areaKey, list) {
            list.forEach((def) => {
                this.items.push({
                    area: areaKey,
                    x: def.x,
                    y: def.y,
                    w: def.w || 36,
                    h: def.h || 28,
                    hp: def.hp || 28,
                    maxHp: def.hp || 28,
                    type: def.type || 'crate',
                    alive: true,
                    shake: 0
                });
            });
        }

        hitByProjectile(p, onBreak) {
            let hit = false;
            for (let i = 0; i < this.items.length; i++) {
                const d = this.items[i];
                if (!d.alive || d.area !== (global.GameState && global.GameState.currentArea)) continue;
                if (!projectileHitsRect(p, { x: d.x, y: d.y, w: d.w, h: d.h })) continue;
                const key = 'b' + i;
                p.hitIds = p.hitIds || Object.create(null);
                if (p.hitIds[key]) continue;
                p.hitIds[key] = 1;
                d.hp -= p.damage || 10;
                d.shake = 8;
                hit = true;
                if (d.hp <= 0) {
                    d.alive = false;
                    if (onBreak) onBreak(d);
                }
            }
            return hit;
        }

        hitAt(x, y, radius, damage, onBreak) {
            let hit = false;
            for (let i = 0; i < this.items.length; i++) {
                const d = this.items[i];
                if (!d.alive || d.area !== (global.GameState && global.GameState.currentArea)) continue;
                const cx = d.x + d.w / 2;
                const cy = d.y + d.h / 2;
                if (Math.hypot(cx - x, cy - y) < radius + 18) {
                    d.hp -= damage;
                    d.shake = 8;
                    hit = true;
                    if (d.hp <= 0) {
                        d.alive = false;
                        if (onBreak) onBreak(d);
                    }
                }
            }
            return hit;
        }

        update() {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].shake > 0) this.items[i].shake--;
            }
        }

        draw(ctx, areaKey) {
            for (let i = 0; i < this.items.length; i++) {
                const d = this.items[i];
                if (d.area !== areaKey || !d.alive) continue;
                const ox = d.shake ? ((d.shake % 2) * 2 - 1) * 2 : 0;
                ctx.save();
                ctx.translate(ox, 0);
                if (d.type === 'sign') {
                    ctx.fillStyle = '#92400e';
                    ctx.fillRect(d.x + d.w / 2 - 3, d.y, 6, d.h);
                    ctx.fillStyle = '#f59e0b';
                    ctx.fillRect(d.x, d.y - 18, d.w, 20);
                    ctx.fillStyle = '#1e293b';
                    ctx.font = 'bold 9px sans-serif';
                    ctx.fillText('STOP', d.x + 4, d.y - 5);
                } else if (d.type === 'pot') {
                    ctx.fillStyle = '#b45309';
                    ctx.beginPath();
                    ctx.ellipse(d.x + d.w / 2, d.y + d.h / 2, d.w / 2, d.h / 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fde68a';
                    ctx.fillRect(d.x + 8, d.y + 4, d.w - 16, 6);
                } else {
                    ctx.fillStyle = '#78716c';
                    ctx.fillRect(d.x, d.y, d.w, d.h);
                    ctx.fillStyle = '#a8a29e';
                    ctx.fillRect(d.x + 3, d.y + 3, d.w - 6, 6);
                }
                ctx.restore();
            }
        }
    }

    global.CombatKit = {
        CombatFeel,
        ComboRank,
        ProjectilePool,
        DestructibleField,
        facingVec,
        muzzle,
        muzzleLift,
        rankOf,
        RANKS,
        WEAPONS,
        HIT_PROFILES,
        weaponOf,
        fireAttack,
        fireSkill,
        projectileHitsEnemy,
        projectileHitsPlayer,
        projectileHitsRect,
        enemyHurtbox,
        spriteBox,
        bodiesOverlap,
        circleHitsCircle,
        circleHitsRect,
        beamHitsCircle,
        beamHitsRect
    };
})(window);
