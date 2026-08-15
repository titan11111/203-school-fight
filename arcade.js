/* ゲームセンター筐体ミニゲーム — FROG / PAC / RACE / PUNCH */
(function (global) {
    function openFrame(ctx, w, h, title, color) {
        const gw = 400;
        const gh = 280;
        const x = (w - gw) / 2;
        const y = (h - gh) / 2 - 20;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.62)';
        ctx.fillRect(0, 0, w, h);
        ctx.translate(x, y);
        ctx.fillStyle = '#020617';
        ctx.fillRect(-8, -28, gw + 16, gh + 56);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(-8, -28, gw + 16, gh + 56);
        ctx.fillStyle = color;
        ctx.font = 'bold 14px DotGothic16, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(title, 8, -8);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, gw, gh);
        return { gw, gh };
    }

    function closeFrame(ctx, over, won, hint) {
        if (over) {
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(40, 90, 320, 90);
            ctx.fillStyle = '#fde68a';
            ctx.font = 'bold 22px DotGothic16, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(won ? 'STAGE CLEAR' : 'GAME OVER', 200, 128);
        }
        ctx.restore();
    }

    class FrogGame {
        constructor() {
            this.active = false;
            this.reset();
        }

        reset() {
            this.score = 0;
            this.lives = 3;
            this.over = false;
            this.won = false;
            this.tick = 0;
            this.cool = 0;
            this.fx = 200;
            this.fy = 252;
            this.cars = [];
            for (let lane = 0; lane < 6; lane++) {
                const y = 36 + lane * 32;
                const dir = lane % 2 ? 1 : -1;
                const speed = 1.4 + lane * 0.25;
                for (let i = 0; i < 3; i++) {
                    this.cars.push({
                        x: i * 150 + (lane * 30),
                        y,
                        w: 36,
                        h: 16,
                        vx: dir * speed
                    });
                }
            }
        }

        start() {
            this.reset();
            this.active = true;
        }

        quit() {
            this.active = false;
            return this.score;
        }

        hop(dx, dy) {
            if (!this.active || this.over || this.cool > 0) return;
            this.fx = Math.max(16, Math.min(384, this.fx + dx));
            this.fy = Math.max(16, Math.min(260, this.fy + dy));
            this.cool = 8;
            if (this.fy <= 22) {
                this.score += 100;
                this.fx = 200;
                this.fy = 252;
                if (this.score >= 300) {
                    this.won = true;
                    this.over = true;
                }
            }
        }

        update(keys) {
            if (!this.active || this.over) return;
            this.tick++;
            if (this.cool > 0) this.cool--;
            if (this.cool <= 0) {
                if (keys['ArrowLeft'] || keys['KeyA']) this.hop(-28, 0);
                else if (keys['ArrowRight'] || keys['KeyD']) this.hop(28, 0);
                else if (keys['ArrowUp'] || keys['KeyW']) this.hop(0, -28);
                else if (keys['ArrowDown'] || keys['KeyS']) this.hop(0, 28);
            }
            this.cars.forEach((c) => {
                c.x += c.vx;
                if (c.x > 430) c.x = -40;
                if (c.x < -40) c.x = 430;
                if (Math.abs(c.x - this.fx) < (c.w / 2 + 8) && Math.abs(c.y - this.fy) < 14) {
                    this.lives--;
                    this.fx = 200;
                    this.fy = 252;
                    if (this.lives <= 0) this.over = true;
                }
            });
        }

        draw(ctx, w, h) {
            if (!this.active) return;
            openFrame(ctx, w, h, 'FROG  SCORE ' + this.score + '  LIFE ' + this.lives, '#4ade80');
            ctx.fillStyle = '#14532d';
            ctx.fillRect(0, 0, 400, 28);
            ctx.fillRect(0, 244, 400, 36);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 28, 400, 216);
            ctx.fillStyle = '#334155';
            for (let y = 36; y < 240; y += 32) ctx.fillRect(0, y + 14, 400, 2);
            this.cars.forEach((c) => {
                ctx.fillStyle = '#f97316';
                ctx.fillRect(c.x - c.w / 2, c.y - 8, c.w, 16);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(c.x - 8, c.y - 4, 6, 6);
            });
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(this.fx, this.fy, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#14532d';
            ctx.fillRect(this.fx - 3, this.fy - 3, 3, 3);
            ctx.fillRect(this.fx + 1, this.fy - 3, 3, 3);
            closeFrame(ctx, this.over, this.won, '十字キーで渡れ  /  E やめる');
        }
    }

    class PacGame {
        constructor() {
            this.active = false;
            this.reset();
        }

        reset() {
            this.score = 0;
            this.over = false;
            this.won = false;
            this.tick = 0;
            this.cool = 0;
            this.map = [
                '###########',
                '#.........#',
                '#.##.#.##.#',
                '#.........#',
                '#.#.###.#.#',
                '#.........#',
                '#.##.#.##.#',
                '#....@....#',
                '###########'
            ];
            this.dots = [];
            this.walls = {};
            for (let r = 0; r < this.map.length; r++) {
                for (let c = 0; c < this.map[r].length; c++) {
                    const ch = this.map[r][c];
                    if (ch === '#') this.walls[r + ',' + c] = 1;
                    if (ch === '.' || ch === '@') this.dots.push({ c, r, eat: false });
                    if (ch === '@') {
                        this.pc = c;
                        this.pr = r;
                    }
                }
            }
            this.ghosts = [
                { c: 1, r: 1, dc: 1, dr: 0 },
                { c: 9, r: 1, dc: -1, dr: 0 }
            ];
        }

        start() {
            this.reset();
            this.active = true;
        }

        quit() {
            this.active = false;
            return this.score;
        }

        blocked(c, r) {
            return !!this.walls[r + ',' + c];
        }

        tryMove(dc, dr) {
            if (this.cool > 0) return;
            const nc = this.pc + dc;
            const nr = this.pr + dr;
            if (this.blocked(nc, nr)) return;
            this.pc = nc;
            this.pr = nr;
            this.cool = 7;
            this.dots.forEach((d) => {
                if (!d.eat && d.c === this.pc && d.r === this.pr) {
                    d.eat = true;
                    this.score += 10;
                }
            });
            if (this.dots.every((d) => d.eat)) {
                this.won = true;
                this.over = true;
            }
        }

        update(keys) {
            if (!this.active || this.over) return;
            this.tick++;
            if (this.cool > 0) this.cool--;
            if (keys['ArrowLeft'] || keys['KeyA']) this.tryMove(-1, 0);
            else if (keys['ArrowRight'] || keys['KeyD']) this.tryMove(1, 0);
            else if (keys['ArrowUp'] || keys['KeyW']) this.tryMove(0, -1);
            else if (keys['ArrowDown'] || keys['KeyS']) this.tryMove(0, 1);

            if (this.tick % 14 === 0) {
                this.ghosts.forEach((g) => {
                    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter((v) => !this.blocked(g.c + v[0], g.r + v[1]));
                    if (!opts.length) return;
                    let pick = opts[0];
                    let best = 999;
                    opts.forEach((v) => {
                        const d = Math.abs(g.c + v[0] - this.pc) + Math.abs(g.r + v[1] - this.pr);
                        if (d < best) {
                            best = d;
                            pick = v;
                        }
                    });
                    if (Math.random() < 0.25) pick = opts[(Math.random() * opts.length) | 0];
                    g.c += pick[0];
                    g.r += pick[1];
                });
            }
            if (this.ghosts.some((g) => g.c === this.pc && g.r === this.pr)) this.over = true;
        }

        draw(ctx, w, h) {
            if (!this.active) return;
            openFrame(ctx, w, h, 'PAC  SCORE ' + this.score, '#eab308');
            const cell = 26;
            const ox = 52;
            const oy = 18;
            for (let r = 0; r < this.map.length; r++) {
                for (let c = 0; c < this.map[r].length; c++) {
                    const x = ox + c * cell;
                    const y = oy + r * cell;
                    if (this.blocked(c, r)) {
                        ctx.fillStyle = '#1d4ed8';
                        ctx.fillRect(x, y, cell - 2, cell - 2);
                    }
                }
            }
            this.dots.forEach((d) => {
                if (d.eat) return;
                ctx.fillStyle = '#fde68a';
                ctx.beginPath();
                ctx.arc(ox + d.c * cell + 12, oy + d.r * cell + 12, 3, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(ox + this.pc * cell + 12, oy + this.pr * cell + 12, 9, 0.2, Math.PI * 1.8);
            ctx.lineTo(ox + this.pc * cell + 12, oy + this.pr * cell + 12);
            ctx.fill();
            this.ghosts.forEach((g, i) => {
                ctx.fillStyle = i ? '#f472b6' : '#22d3ee';
                ctx.fillRect(ox + g.c * cell + 4, oy + g.r * cell + 4, 18, 18);
            });
            closeFrame(ctx, this.over, this.won, '十字キーでドットを食べろ  /  E やめる');
        }
    }

    class RaceGame {
        constructor() {
            this.active = false;
            this.reset();
        }

        reset() {
            this.score = 0;
            this.over = false;
            this.won = false;
            this.tick = 0;
            this.px = 200;
            this.cars = [];
            this.speed = 3.2;
        }

        start() {
            this.reset();
            this.active = true;
        }

        quit() {
            this.active = false;
            return this.score;
        }

        update(keys) {
            if (!this.active || this.over) return;
            this.tick++;
            if (keys['ArrowLeft'] || keys['KeyA']) this.px -= 5;
            if (keys['ArrowRight'] || keys['KeyD']) this.px += 5;
            this.px = Math.max(70, Math.min(330, this.px));
            this.speed = 3.2 + this.tick * 0.004;
            if (this.tick % 26 === 0) {
                const lane = 90 + ((Math.random() * 3) | 0) * 90;
                this.cars.push({ x: lane, y: -30, w: 34, h: 48 });
            }
            this.cars.forEach((c) => { c.y += this.speed; });
            this.cars = this.cars.filter((c) => c.y < 300);
            this.score = (this.tick / 4) | 0;
            if (this.score >= 250) {
                this.won = true;
                this.over = true;
            }
            this.cars.forEach((c) => {
                if (Math.abs(c.x - this.px) < 28 && c.y > 196 && c.y < 260) this.over = true;
            });
        }

        draw(ctx, w, h) {
            if (!this.active) return;
            openFrame(ctx, w, h, 'RACE  SCORE ' + this.score, '#38bdf8');
            ctx.fillStyle = '#334155';
            ctx.fillRect(60, 0, 280, 280);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, 60, 280);
            ctx.fillRect(340, 0, 60, 280);
            ctx.fillStyle = '#f8fafc';
            const scroll = (this.tick * 8) % 28;
            for (let y = -20 + scroll; y < 280; y += 28) ctx.fillRect(198, y, 4, 14);
            this.cars.forEach((c) => {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(c.x - 17, c.y, 34, 48);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(c.x - 10, c.y + 8, 20, 12);
            });
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(this.px - 16, 220, 32, 46);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(this.px - 10, 228, 20, 12);
            closeFrame(ctx, this.over, this.won, '← → で避けろ  /  E やめる');
        }
    }

    class PunchGame {
        constructor() {
            this.active = false;
            this.reset();
        }

        reset() {
            this.score = 0;
            this.best = 0;
            this.over = false;
            this.won = false;
            this.tick = 0;
            this.meter = 0;
            this.dir = 4;
            this.swings = 0;
            this.flash = 0;
            this.last = 0;
            this.locked = false;
            this.held = false;
        }

        start() {
            this.reset();
            this.active = true;
        }

        quit() {
            this.active = false;
            return this.best;
        }

        swing() {
            if (!this.active || this.over || this.locked) return;
            this.locked = true;
            this.last = Math.max(0, Math.min(100, this.meter | 0));
            this.best = Math.max(this.best, this.last);
            this.score = this.best;
            this.flash = 16;
            this.swings++;
            if (this.swings >= 3) {
                this.over = true;
                this.won = this.best >= 80;
            }
        }

        update(keys) {
            if (!this.active || this.over) return;
            this.tick++;
            if (this.flash > 0) this.flash--;
            const press = !!(keys && (keys['KeyJ'] || keys['Space'] || keys['KeyZ']));
            if (press && !this.held) this.swing();
            this.held = press;
            if (this.locked) {
                if (this.flash <= 0) {
                    this.locked = false;
                    this.meter = 8;
                    this.dir = 4;
                }
                return;
            }
            this.meter += this.dir;
            if (this.meter >= 100 || this.meter <= 0) this.dir *= -1;
        }

        draw(ctx, w, h) {
            if (!this.active) return;
            openFrame(ctx, w, h, 'PUNCH  BEST ' + this.best + '  TRY ' + this.swings + '/3', '#c084fc');
            ctx.fillStyle = '#581c87';
            ctx.fillRect(150, 30, 100, 120);
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.arc(200, 40, 36, 0, Math.PI * 2);
            ctx.fill();
            if (this.flash > 0) {
                ctx.fillStyle = '#fde68a';
                ctx.fillRect(170, 20, 60, 20);
            }
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(40, 180, 320, 28);
            const t = Math.max(0, Math.min(1, this.meter / 100));
            ctx.fillStyle = t > 0.8 ? '#facc15' : (t > 0.5 ? '#fb7185' : '#67e8f9');
            ctx.fillRect(42, 182, 316 * t, 24);
            ctx.strokeStyle = '#fde68a';
            ctx.strokeRect(40 + 256, 180, 64, 28);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 16px DotGothic16, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(this.locked ? ('POWER ' + this.last) : 'タイミングで殴れ', 200, 230);
            closeFrame(ctx, this.over, this.won, 'J / 攻撃でパンチ  /  E やめる');
        }
    }

    global.ArcadeKit = {
        FrogGame,
        PacGame,
        RaceGame,
        PunchGame
    };
})(window);
