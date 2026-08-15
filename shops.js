/* 店内マップ描画 + くじ引き + インベーダー */
(function (global) {
    const LOTTERY_COST = 20;

    const LOTTERY_TABLE = [
        { w: 38, title: 'はずれ…', text: 'また今度チャレンジしてね。', give: null },
        { w: 28, title: '当たり！', text: 'ラムネを1個もらった。HPが少し戻った。', give: { hp: 15 } },
        { w: 18, title: '当たり！', text: '焼きそばパンを1個ゲット！', give: { item: 'yakisoba_pan' } },
        { w: 11, title: '当たり！', text: 'スポーツドリンクを1個ゲット！', give: { item: 'pocari' } },
        { w: 5, title: '大当たり！！', text: '100円が当たった！', give: { money: 100 } }
    ];

    function pickLottery() {
        const total = LOTTERY_TABLE.reduce((s, r) => s + r.w, 0);
        let roll = Math.random() * total;
        for (let i = 0; i < LOTTERY_TABLE.length; i++) {
            roll -= LOTTERY_TABLE[i].w;
            if (roll <= 0) return LOTTERY_TABLE[i];
        }
        return LOTTERY_TABLE[0];
    }

    function drawBakeryInterior(ctx, W, H) {
        ctx.fillStyle = '#f3d7a4';
        ctx.fillRect(260, 140, 1080, 940);
        ctx.fillStyle = '#e8c48a';
        for (let y = 160; y < 1060; y += 40) {
            ctx.fillRect(280, y, 1040, 2);
        }
        ctx.fillStyle = '#7c4a1e';
        ctx.fillRect(260, 140, 1080, 28);
        ctx.fillRect(260, 1052, 1080, 28);
        ctx.fillRect(260, 140, 28, 940);
        ctx.fillRect(1312, 140, 28, 940);

        ctx.fillStyle = '#b45309';
        ctx.fillRect(420, 200, 760, 70);
        ctx.fillStyle = '#fff7ed';
        ctx.font = 'bold 28px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('小麦亭  BAKERY', 800, 246);

        const breads = ['🍞', '🥖', '🥐', '🥨'];
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = '#92400e';
            ctx.fillRect(300 + i * 120, 300, 100, 90);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(308 + i * 120, 308, 84, 50);
            ctx.fillStyle = '#78350f';
            ctx.font = '28px sans-serif';
            ctx.fillText(breads[i % 4], 350 + i * 120, 348);
        }

        ctx.fillStyle = '#44403c';
        ctx.fillRect(1180, 420, 110, 160);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(1192, 432, 86, 70);
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(1200, 520, 70, 48);
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('窯', 1235, 548);

        ctx.fillStyle = '#d97706';
        ctx.fillRect(480, 520, 640, 70);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(500, 534, 600, 42);
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('本日の焼きそばパン  50円', 800, 560);

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(740, 1052, 120, 28);
        ctx.fillStyle = '#9a3412';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('出口', 800, 1072);
    }

    function drawDagashiInterior(ctx, W, H) {
        ctx.fillStyle = '#3f2a22';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(240, 130, 1120, 960);
        ctx.fillStyle = '#fbbf24';
        for (let y = 150; y < 1070; y += 28) {
            for (let x = 260; x < 1340; x += 28) {
                if (((x + y) / 28 | 0) % 2 === 0) ctx.fillRect(x, y, 28, 28);
            }
        }
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(240, 130, 1120, 36);
        ctx.fillRect(240, 1054, 1120, 36);
        ctx.fillRect(240, 130, 36, 960);
        ctx.fillRect(1324, 130, 36, 960);

        ctx.fillStyle = '#fff7ed';
        ctx.font = 'bold 26px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('だがしや  うさぎや', 800, 156);

        const jars = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#f97316'];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 10; col++) {
                const x = 300 + col * 100;
                const y = 220 + row * 110;
                ctx.fillStyle = '#78716c';
                ctx.fillRect(x, y + 70, 70, 14);
                ctx.fillStyle = jars[(row + col) % jars.length];
                ctx.beginPath();
                ctx.ellipse(x + 35, y + 40, 22, 28, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.beginPath();
                ctx.ellipse(x + 28, y + 28, 8, 10, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(620, 620, 360, 220);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(640, 640, 320, 80);
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 28px DotGothic16, sans-serif';
        ctx.fillText('くじ引き 20円', 800, 690);
        ctx.fillStyle = '#fff7ed';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('[E] で1回引く', 800, 720);

        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = i % 2 ? '#ef4444' : '#f8fafc';
            ctx.fillRect(660 + i * 48, 740, 40, 70);
        }

        ctx.fillStyle = '#fde68a';
        ctx.fillRect(740, 1054, 120, 36);
        ctx.fillStyle = '#7f1d1d';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('出口', 800, 1078);
    }

    function drawArcadeInterior(ctx, W, H) {
        ctx.fillStyle = '#0b0614';
        ctx.fillRect(0, 0, W, H);
        const t = performance.now() / 400;
        ctx.fillStyle = '#1a1030';
        ctx.fillRect(220, 120, 1160, 980);
        ctx.fillStyle = '#111827';
        for (let y = 200; y < 1080; y += 48) ctx.fillRect(240, y, 1120, 2);

        ctx.fillStyle = '#f472b6';
        ctx.globalAlpha = 0.35 + Math.sin(t) * 0.15;
        ctx.fillRect(220, 120, 1160, 18);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(220, 1082, 1160, 18);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#67e8f9';
        ctx.font = 'bold 26px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME CENTER  放課後BOX', 800, 160);

        const cabs = [
            { x: 320, y: 280, c: '#22c55e', n: 'FROG' },
            { x: 520, y: 280, c: '#eab308', n: 'PAC' },
            { x: 920, y: 280, c: '#38bdf8', n: 'RACE' },
            { x: 1120, y: 280, c: '#a855f7', n: 'PUNCH' }
        ];
        cabs.forEach((c) => {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(c.x, c.y, 140, 200);
            ctx.fillStyle = c.c;
            ctx.fillRect(c.x + 12, c.y + 16, 116, 80);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(c.x + 20, c.y + 24, 100, 64);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(c.n, c.x + 70, c.y + 120);
            ctx.fillStyle = '#334155';
            ctx.fillRect(c.x + 30, c.y + 150, 80, 18);
        });

        ctx.fillStyle = '#111827';
        ctx.fillRect(680, 520, 240, 280);
        ctx.fillStyle = '#14532d';
        ctx.fillRect(700, 540, 200, 140);
        ctx.fillStyle = '#4ade80';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(720 + i * 32, 560, 20, 12);
            ctx.fillRect(720 + i * 32, 584, 20, 12);
        }
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(784, 650, 32, 12);
        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 16px DotGothic16, sans-serif';
        ctx.fillText('INVADER', 800, 700);
        ctx.fillStyle = '#67e8f9';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('[E] でプレイ', 800, 724);

        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(740, 1082, 120, 18);
        ctx.fillStyle = '#082f49';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('出口', 800, 1096);
    }

    function drawInterior(ctx, areaKey, W, H) {
        if (areaKey === 'BAKERY') drawBakeryInterior(ctx, W, H);
        else if (areaKey === 'DAGASHI') drawDagashiInterior(ctx, W, H);
        else if (areaKey === 'ARCADE') drawArcadeInterior(ctx, W, H);
    }

    class InvaderGame {
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
            this.shipX = 200;
            this.cool = 0;
            this.dir = 1;
            this.stepY = 0;
            this.bullets = [];
            this.bombs = [];
            this.aliens = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 8; c++) {
                    this.aliens.push({ x: 40 + c * 42, y: 36 + r * 28, alive: true });
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

        shoot() {
            if (!this.active || this.over || this.cool > 0) return;
            this.cool = 12;
            this.bullets.push({ x: this.shipX, y: 250, vy: -6 });
        }

        update(keys) {
            if (!this.active || this.over) return;
            this.tick++;
            if (this.cool > 0) this.cool--;
            if (keys['ArrowLeft'] || keys['KeyA']) this.shipX -= 4;
            if (keys['ArrowRight'] || keys['KeyD']) this.shipX += 4;
            this.shipX = Math.max(16, Math.min(384, this.shipX));
            if (keys['KeyJ'] || keys['Space'] || keys['KeyZ']) this.shoot();

            this.bullets.forEach((b) => { b.y += b.vy; });
            this.bullets = this.bullets.filter((b) => b.y > 0);
            this.bombs.forEach((b) => { b.y += b.vy; });
            this.bombs = this.bombs.filter((b) => b.y < 280);

            const live = this.aliens.filter((a) => a.alive);
            if (live.length === 0) {
                this.won = true;
                this.over = true;
                return;
            }
            if (this.tick % 18 === 0) {
                let bounce = false;
                live.forEach((a) => {
                    a.x += this.dir * 6;
                    if (a.x < 16 || a.x > 384) bounce = true;
                });
                if (bounce) {
                    this.dir *= -1;
                    live.forEach((a) => { a.y += 12; });
                }
            }
            if (this.tick % 40 === 0 && live.length) {
                const a = live[(Math.random() * live.length) | 0];
                this.bombs.push({ x: a.x, y: a.y + 8, vy: 3.2 });
            }

            this.bullets.forEach((b) => {
                live.forEach((a) => {
                    if (a.alive && Math.abs(a.x - b.x) < 12 && Math.abs(a.y - b.y) < 10) {
                        a.alive = false;
                        b.y = -20;
                        this.score += 10;
                    }
                });
            });
            this.bombs.forEach((b) => {
                if (Math.abs(b.x - this.shipX) < 14 && b.y > 248 && b.y < 268) {
                    b.y = 400;
                    this.lives--;
                    if (this.lives <= 0) this.over = true;
                }
            });
            if (live.some((a) => a.y > 230)) this.over = true;
        }

        draw(ctx, w, h) {
            if (!this.active) return;
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
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 3;
            ctx.strokeRect(-8, -28, gw + 16, gh + 56);
            ctx.fillStyle = '#67e8f9';
            ctx.font = 'bold 14px DotGothic16, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('INVADER  SCORE ' + this.score + '  LIFE ' + this.lives, 8, -8);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, gw, gh);

            this.aliens.forEach((a) => {
                if (!a.alive) return;
                ctx.fillStyle = '#4ade80';
                ctx.fillRect(a.x - 10, a.y - 7, 20, 14);
                ctx.fillStyle = '#14532d';
                ctx.fillRect(a.x - 6, a.y - 3, 4, 4);
                ctx.fillRect(a.x + 2, a.y - 3, 4, 4);
            });
            ctx.fillStyle = '#f8fafc';
            this.bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y, 2, 8));
            ctx.fillStyle = '#f87171';
            this.bombs.forEach((b) => ctx.fillRect(b.x - 2, b.y, 4, 8));
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(this.shipX, 252);
            ctx.lineTo(this.shipX - 12, 268);
            ctx.lineTo(this.shipX + 12, 268);
            ctx.closePath();
            ctx.fill();

            if (this.over) {
                ctx.fillStyle = 'rgba(0,0,0,0.55)';
                ctx.fillRect(40, 90, 320, 90);
                ctx.fillStyle = '#fde68a';
                ctx.font = 'bold 22px DotGothic16, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(this.won ? 'STAGE CLEAR' : 'GAME OVER', 200, 128);
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '12px sans-serif';
                ctx.fillText('[E] で景品を受け取る', 200, 156);
            } else {
                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('← → 移動  /  J 発射  /  E やめる', 200, 294);
            }
            ctx.restore();
        }
    }

    global.ShopKit = {
        LOTTERY_COST,
        pickLottery,
        drawInterior,
        InvaderGame
    };
})(window);
