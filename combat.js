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
            const shot = muzzle(player, 22, 'saber');
            const reach = 46 + comboStep * 10;
            projectiles.spawn({
                x: shot.x + dir.x * reach * 0.45,
                y: shot.y + dir.y * reach * 0.45,
                vx: dir.x * 3,
                vy: dir.y * 3,
                life: 11,
                kind: 'saber',
                radius: 22 + comboStep * 3,
                damage: Math.floor(player.atk * (1.15 + comboStep * 0.28)),
                poise: 12 + comboStep * 5,
                owner: 'player',
                facing: player.facing,
                beamLen: reach
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
                x: origin.x + dir.x * 36,
                y: origin.y + dir.y * 36,
                vx: dir.x * 14,
                vy: dir.y * 14,
                life: 22,
                kind: 'saber',
                radius: 20,
                damage: Math.floor(player.atk * 1.85),
                poise: 26,
                owner: 'player',
                facing: player.facing,
                beamLen: 92
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
            p.hitIds = null;
            this.live.push(p);
            if (this.live.length > this.limit) {
                const old = this.live.shift();
                this.pool.push(old);
            }
            return p;
        }

        update(player, enemies, onHitEnemy, onHitPlayer) {
            for (let i = this.live.length - 1; i >= 0; i--) {
                const p = this.live[i];
                const hand = muzzle(player, 0, 'yoyo');
                if (p.kind === 'yoyo') {
                    p.homeX = hand.x;
                    p.homeY = hand.y;
                }
                if (p.kind === 'yoyo' && p.phase === 'return') {
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
                        const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
                        if (dist < enemy.radius + p.radius) {
                            const key = enemy._uid || e;
                            p.hitIds = p.hitIds || Object.create(null);
                            if (!p.hitIds[key]) {
                                p.hitIds[key] = 1;
                                onHitEnemy(enemy, p);
                                if (p.kind === 'yoyo' && p.phase === 'out') p.phase = 'return';
                            }
                        }
                    }
                } else if (onHitPlayer) {
                    const dist = Math.hypot(player.x - p.x, player.y - p.y);
                    if (dist < player.radius + p.radius) onHitPlayer(p);
                }

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
                    const len = p.beamLen || 56;
                    ctx.rotate(ang);
                    ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
                    ctx.fillRect(((-len / 2) | 0), -10, len | 0, 20);
                    ctx.fillStyle = '#6ee7b7';
                    ctx.fillRect(((-len / 2) | 0), -5, len | 0, 10);
                    ctx.fillStyle = '#ecfdf5';
                    ctx.fillRect(((-len / 2) | 0), -2, len | 0, 4);
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(((-len / 2) | 0) - 6, -4, 10, 8);
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
        weaponOf,
        fireAttack,
        fireSkill
    };
})(window);
