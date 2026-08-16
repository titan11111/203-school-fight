/* 敵クラス階層 — 種類ごとの振る舞いを継承で分ける */
(function (global) {
    class Enemy {
        constructor(x, y, area) {
            this.x = x;
            this.y = y;
            this.area = area;
            this.type = 'enemy';
            this.artKey = 'delinquent';
            this.name = '敵';
            this.isAlive = true;
            this.state = 'IDLE';
            this.stateTimer = 0;
            this.inJustWindow = false;
            this.poise = 40;
            this.maxPoise = 40;
            this.broken = 0;
            this.telegraphR = 70;
            this._uid = (x * 1000 + y) | 0;
            this.homeX = x;
            this.homeY = y;
            this.patrolRadius = 85;
            this.patrolTargetX = x;
            this.patrolTargetY = y;
            this.patrolPause = 20 + Math.random() * 40;
            this.animTimer = Math.random() * 100;
            this.isMoving = false;
            this.facing = 'down';
            this.radius = 20;
            this.hp = 40;
            this.maxHp = 40;
            this.atk = 10;
            this.speed = 2;
            this.expYield = 15;
            this.moneyYield = 10;
            this.sprite = '?';
            this.drawScale = 1;
            this.flipArt = false;
            this.bobScale = 2.8;
            this.isBoss = false;
        }

        pickPatrolTarget() {
            const angle = Math.random() * Math.PI * 2;
            const dist = 25 + Math.random() * this.patrolRadius;
            this.patrolTargetX = this.homeX + Math.cos(angle) * dist;
            this.patrolTargetY = this.homeY + Math.sin(angle) * dist;
        }

        updateFacingFrom(dx, dy) {
            if (Math.abs(dx) > Math.abs(dy) * 0.5) {
                this.facing = dx < 0 ? 'left' : 'right';
            } else if (Math.abs(dy) > 0.5) {
                this.facing = dy < 0 ? 'up' : 'down';
            }
        }

        getAnim() {
            const bob = this.isMoving
                ? Math.sin(this.animTimer * 0.42) * this.bobScale
                : Math.sin(this.animTimer * 0.1) * 1.2;
            const squash = this.isMoving ? 1 + Math.sin(this.animTimer * 0.42) * 0.05 : 1;
            return { bob, squash, scale: this.drawScale };
        }

        getPatrolSpeed() {
            return 1.15;
        }

        getAggroRange() {
            return 280;
        }

        getLoseAggroRange() {
            return 380;
        }

        getWindupRange() {
            return this.radius + 78;
        }

        getWindupFrames() {
            return 26;
        }

        getAttackFrames() {
            return 8;
        }

        getCooldownFrames() {
            return 45;
        }

        getHitStop() {
            return 4;
        }

        getBreakDuration() {
            return 90;
        }

        getBreakMessage() {
            return 'STAGGER BREAK!';
        }

        updateIdlePatrol() {
            this.animTimer++;
            if (this.patrolPause > 0) {
                this.patrolPause--;
                this.isMoving = false;
                return;
            }
            const dx = this.patrolTargetX - this.x;
            const dy = this.patrolTargetY - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 4) {
                this.isMoving = false;
                this.patrolPause = 25 + Math.random() * 55;
                this.pickPatrolTarget();
                return;
            }
            this.x += (dx / dist) * this.getPatrolSpeed();
            this.y += (dy / dist) * this.getPatrolSpeed();
            this.isMoving = true;
            this.updateFacingFrom(dx, dy);
            applyMapCollision(this, GameState.currentArea);
        }

        startWindup(player, dist) {
            this.state = 'WINDUP';
            this.stateTimer = this.getWindupFrames();
        }

        onWindupEnd(player) {
            this.state = 'ATTACK';
            this.stateTimer = this.getAttackFrames();
        }

        onAttackFrame(player, dist) {
            if (dist < this.radius + player.radius + 28) player.takeDamage(this.atk);
            camera.shake(8);
        }

        afterUpdate(player) {}

        onDefeated() {}

        update(player) {
            if (!this.isAlive || this.area !== GameState.currentArea) return;

            const dist = Math.hypot(player.x - this.x, player.y - this.y);
            this.isMoving = false;
            this.inJustWindow = false;

            if (this.broken > 0) {
                this.broken--;
                this.animTimer++;
                return;
            }

            switch (this.state) {
                case 'IDLE':
                    if (dist < this.getAggroRange()) this.state = 'CHASE';
                    else this.updateIdlePatrol();
                    break;
                case 'CHASE':
                    this.animTimer++;
                    if (dist > this.getLoseAggroRange()) {
                        this.state = 'IDLE';
                        this.patrolPause = 10;
                    } else if (dist < this.getWindupRange()) {
                        this.startWindup(player, dist);
                    } else {
                        const angle = Math.atan2(player.y - this.y, player.x - this.x);
                        this.x += Math.cos(angle) * this.speed;
                        this.y += Math.sin(angle) * this.speed;
                        this.isMoving = true;
                        this.updateFacingFrom(Math.cos(angle), Math.sin(angle));
                        applyMapCollision(this, GameState.currentArea);
                    }
                    break;
                case 'WINDUP':
                    this.animTimer++;
                    this.facing = facingToward(this.x, player.x);
                    this.stateTimer--;
                    this.inJustWindow = this.stateTimer <= 12;
                    if (this.stateTimer <= 0) this.onWindupEnd(player);
                    break;
                case 'CHARGE':
                    this.updateCharge(player, dist);
                    break;
                case 'ATTACK':
                    this.animTimer++;
                    this.inJustWindow = this.stateTimer > 2;
                    this.facing = facingToward(this.x, player.x);
                    if (this.stateTimer === this.getAttackFrames()) this.onAttackFrame(player, dist);
                    this.stateTimer--;
                    if (this.stateTimer <= 0) {
                        this.state = 'COOLDOWN';
                        this.stateTimer = this.getCooldownFrames();
                    }
                    break;
                case 'COOLDOWN':
                    this.animTimer++;
                    this.stateTimer--;
                    if (this.stateTimer <= 0) this.state = 'CHASE';
                    break;
            }

            this.afterUpdate(player);
        }

        updateCharge() {}

        takeDamage(amount, fromX, fromY, opts) {
            opts = opts || {};
            const rank = comboRank.rank;
            const brokenBonus = this.broken > 0 ? 1.5 : 1;
            const final = Math.max(1, Math.floor(amount * rank.mult * brokenBonus));
            this.hp -= final;
            this.poise -= opts.poise || 10;
            vfxManager.addDamageText(this.x, this.y - 20, `-${final}`, this.broken > 0 ? '#f472b6' : '#facc15');
            combatFeel.requestHitStop(this.getHitStop());
            camera.shake(6 + (rank.name === 'S' ? 6 : 0));
            player.gainSp(3);
            comboRank.registerHit(1);

            if (this.poise <= 0 && this.broken <= 0) {
                this.broken = this.getBreakDuration();
                this.poise = this.maxPoise;
                this.state = 'COOLDOWN';
                this.stateTimer = this.broken;
                comboRank.registerBreak();
                combatFeel.requestFlash(10);
                camera.zoomTo(1.2, 16);
                audio.playBreak();
                vfxManager.addDamageText(this.x, this.y - 48, 'BREAK!', '#f472b6');
                player.gainSp(15);
                showNotification(this.getBreakMessage());
            }

            const angle = Math.atan2(this.y - fromY, this.x - fromX);
            const kb = opts.pull ? -28 : 20;
            this.x += Math.cos(angle) * kb;
            this.y += Math.sin(angle) * kb;
            applyMapCollision(this, GameState.currentArea);

            breakables.hitAt(this.x, this.y, 40, 8, (d) => {
                vfxManager.addExplosion(d.x, d.y);
                GameState.money += 5;
            });

            if (this.hp <= 0) {
                this.isAlive = false;
                vfxManager.addExplosion(this.x, this.y);
                player.gainExp(this.expYield);
                GameState.money += this.moneyYield;
                updateHUD();
                this.onDefeated();
            }
        }

        draw(ctx) {
            if (!this.isAlive || this.area !== GameState.currentArea) return;

            if (this.state === 'WINDUP') {
                ctx.save();
                ctx.strokeStyle = this.inJustWindow ? '#f87171' : '#fbbf24';
                ctx.lineWidth = this.inJustWindow ? 4 : 2;
                ctx.globalAlpha = 0.55 + Math.sin(this.animTimer * 0.4) * 0.2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.telegraphR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            const anim = this.getAnim();
            if (this.broken > 0) anim.squash = 0.82;
            if (this.teleportFlash > 0) ctx.globalAlpha = this.teleportFlash % 2 ? 0.25 : 0.9;
            const h = this.drawBody(ctx, anim);
            ctx.globalAlpha = 1;

            ctx.save();
            const barWidth = Math.max(40, (h * 0.55) | 0);
            const barY = (this.y - h - 8) | 0;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect((this.x - barWidth / 2) | 0, barY, barWidth, 6);
            ctx.fillStyle = this.broken > 0 ? '#f472b6' : '#ef4444';
            ctx.fillRect((this.x - barWidth / 2) | 0, barY, (barWidth * (this.hp / this.maxHp)) | 0, 6);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect((this.x - barWidth / 2) | 0, barY + 6, (barWidth * (this.poise / this.maxPoise)) | 0, 3);
            ctx.restore();
        }

        drawBody(ctx, anim) {
            return drawCharArt(ctx, this.artKey, this.x, this.y, this.facing, this.flipArt ? true : null, anim);
        }
    }

    class Delinquent extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'delinquent';
            this.artKey = 'delinquent';
            this.name = '不良生徒';
            this.radius = 22;
            this.hp = this.maxHp = 60;
            this.atk = 12;
            this.speed = 2.2;
            this.expYield = 25;
            this.moneyYield = 30;
            this.sprite = '😼';
            this.poise = this.maxPoise = 46;
            this.telegraphR = 78;
        }
    }

    class StrayDog extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'stray_dog';
            this.artKey = 'stray_dog';
            this.name = '暴走野良犬';
            this.radius = 18;
            this.hp = this.maxHp = 40;
            this.atk = 16;
            this.speed = 3.2;
            this.expYield = 20;
            this.moneyYield = 15;
            this.sprite = '🐕';
            this.poise = this.maxPoise = 32;
            this.telegraphR = 64;
            this.flipArt = true;
            this.bobScale = 4.2;
        }
    }

    class Chicken extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'chicken';
            this.artKey = 'chicken';
            this.name = '飼育小屋の鶏';
            this.radius = 16;
            this.hp = this.maxHp = 28;
            this.atk = 10;
            this.speed = 3.6;
            this.expYield = 12;
            this.moneyYield = 8;
            this.sprite = '🐔';
            this.poise = this.maxPoise = 18;
            this.telegraphR = 52;
            this.patrolRadius = 110;
            this.bobScale = 4.2;
        }
    }

    class Rabbit extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'rabbit';
            this.artKey = 'rabbit';
            this.name = '飼育小屋のウサギ';
            this.radius = 16;
            this.hp = this.maxHp = 34;
            this.atk = 11;
            this.speed = 3.4;
            this.expYield = 14;
            this.moneyYield = 10;
            this.sprite = '🐰';
            this.poise = this.maxPoise = 20;
            this.telegraphR = 54;
            this.patrolRadius = 95;
            this.bobScale = 4.2;
        }
    }

    class BikeKid extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'bike_kid';
            this.artKey = 'bike_kid';
            this.name = '自転車小僧';
            this.radius = 22;
            this.hp = this.maxHp = 48;
            this.atk = 17;
            this.speed = 2.8;
            this.expYield = 22;
            this.moneyYield = 18;
            this.sprite = '🚲';
            this.poise = this.maxPoise = 36;
            this.telegraphR = 96;
            this.patrolRadius = 160;
            this.chargeVx = 0;
            this.chargeVy = 0;
        }

        getWindupRange() {
            return 240;
        }

        getWindupFrames() {
            return 20;
        }

        onWindupEnd(player) {
            const ang = Math.atan2(player.y - this.y, player.x - this.x);
            this.chargeVx = Math.cos(ang) * 9.2;
            this.chargeVy = Math.sin(ang) * 9.2;
            this.state = 'CHARGE';
            this.stateTimer = 18;
        }

        updateCharge(player, dist) {
            this.animTimer++;
            this.inJustWindow = this.stateTimer > 12;
            this.x += this.chargeVx;
            this.y += this.chargeVy;
            this.isMoving = true;
            this.updateFacingFrom(this.chargeVx, this.chargeVy);
            applyMapCollision(this, GameState.currentArea);
            if (dist < this.radius + player.radius + 8) {
                player.takeDamage(this.atk);
                camera.shake(14);
                this.state = 'COOLDOWN';
                this.stateTimer = 40;
                return;
            }
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                this.state = 'COOLDOWN';
                this.stateTimer = 36;
            }
        }
    }

    class Kinjiro extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'kinjiro';
            this.artKey = 'kinjiro';
            this.name = '動く二宮金次郎';
            this.radius = 26;
            this.hp = this.maxHp = 95;
            this.atk = 18;
            this.speed = 1.35;
            this.expYield = 35;
            this.moneyYield = 40;
            this.sprite = '📖';
            this.poise = this.maxPoise = 72;
            this.telegraphR = 86;
            this.drawScale = 1.25;
            this.patrolRadius = 70;
        }

        getAnim() {
            return { bob: 0, squash: 1, scale: this.drawScale };
        }

        drawBody(ctx, anim) {
            if (typeof ParkVectors !== 'undefined' && ParkVectors.drawKinjiro) {
                return ParkVectors.drawKinjiro(ctx, this, anim);
            }
            return super.drawBody(ctx, anim);
        }
    }

    class DarkPrincipal extends Enemy {
        constructor(x, y, area) {
            super(x, y, area);
            this.type = 'boss';
            this.artKey = 'boss';
            this.name = '暗黒校長先生';
            this.radius = 96;
            this.hp = this.maxHp = 600;
            this.atk = 24;
            this.speed = 1.8;
            this.expYield = 300;
            this.moneyYield = 500;
            this.sprite = '👺';
            this.phase = 1;
            this.poise = this.maxPoise = 120;
            this.telegraphR = 170;
            this.drawScale = 1.85;
            this.teleportTimer = 160;
            this.teleportFlash = 0;
            this.heavyTimer = 70;
            this.patrolRadius = 130;
            this.isBoss = true;
        }

        getPatrolSpeed() {
            return 0.9;
        }

        getWindupFrames() {
            return 36;
        }

        getCooldownFrames() {
            return 38;
        }

        getHitStop() {
            return 7;
        }

        getBreakDuration() {
            return 70;
        }

        getBreakMessage() {
            return '校長の姿勢が崩れた！';
        }

        getAnim() {
            return { bob: 0, squash: 1, scale: this.drawScale };
        }

        drawBody(ctx, anim) {
            if (typeof ParkVectors !== 'undefined' && ParkVectors.drawPrincipal) {
                return ParkVectors.drawPrincipal(ctx, this, anim);
            }
            return super.drawBody(ctx, anim);
        }

        onAttackFrame(player, dist) {
            if (this.phase >= 2) this.fireBossVolley();
            if (dist < this.radius + player.radius + 28) player.takeDamage(this.atk);
            camera.shake(18);
        }

        afterUpdate(player) {
            this.updateBossSpecial(player);
            const nextPhase = this.hp < this.maxHp * 0.4 ? 3 : (this.hp < this.maxHp * 0.7 ? 2 : 1);
            if (nextPhase === this.phase) return;
            this.phase = nextPhase;
            GameState.bossPhase = nextPhase;
            this.speed = 1.8 + nextPhase * 0.45;
            this.teleportTimer = Math.min(this.teleportTimer, 40);
            combatFeel.requestFlash(12);
            combatFeel.requestVignette(40);
            camera.zoomTo(1.28, 24);
            camera.shake(22);
            audio.playBreak();
            if (nextPhase === 2) showNotification("暗黒校長「朝の朝礼攻撃！全校生徒傾聴！！」");
            if (nextPhase === 3) showNotification("暗黒校長「放課後補習は終わらない…！！」");
        }

        updateBossSpecial(player) {
            if (this.teleportFlash > 0) this.teleportFlash--;
            this.teleportTimer--;
            this.heavyTimer--;
            if (this.teleportTimer <= 0) {
                this.doTeleport(player);
                this.teleportTimer = this.phase >= 3 ? 100 : 160;
                this.heavyTimer = 18;
            }
            if (this.heavyTimer <= 0) {
                this.fireHeavyShot(player);
                this.heavyTimer = this.phase >= 2 ? 55 : 80;
            }
        }

        doTeleport(player) {
            vfxManager.addExplosion(this.x, this.y);
            combatFeel.requestFlash(7);
            camera.shake(14);
            const angle = Math.random() * Math.PI * 2;
            const dist = 220 + Math.random() * 180;
            let nx = player.x + Math.cos(angle) * dist;
            let ny = player.y + Math.sin(angle) * dist;
            nx = Math.max(140, Math.min(WORLD_WIDTH - 140, nx));
            ny = Math.max(220, Math.min(WORLD_HEIGHT - 120, ny));
            this.x = nx;
            this.y = ny;
            applyMapCollision(this, GameState.currentArea);
            this.teleportFlash = 16;
            this.facing = facingToward(this.x, player.x);
            this.fireHeavyShot(player);
            if (this.phase >= 3) this.fireHeavyShot(player, 0.35);
            audio.playBreak();
        }

        fireHeavyShot(player, spread) {
            const a = Math.atan2(player.y - this.y, player.x - this.x) + (spread || 0);
            const speed = 3.4 + this.phase * 0.35;
            projectiles.spawn({
                x: this.x,
                y: this.y - 40,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                life: 90,
                kind: 'heavy',
                radius: 34,
                damage: this.atk + 8,
                owner: 'boss'
            });
            camera.shake(10);
        }

        fireBossVolley() {
            const n = this.phase === 3 ? 10 : 6;
            for (let i = 0; i < n; i++) {
                const a = (Math.PI * 2 / n) * i + this.animTimer * 0.05;
                projectiles.spawn({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(a) * (3.2 + this.phase * 0.4),
                    vy: Math.sin(a) * (3.2 + this.phase * 0.4),
                    life: 50,
                    kind: 'note',
                    radius: 11,
                    damage: this.atk,
                    owner: 'boss',
                    note: i
                });
            }
        }

        onDefeated() {
            showDialog('暗黒校長', ['グハッ…正気に戻ったぞ…！', '見事だ若きヒーローよ！放課後の平和は守られた！'], () => {
                showNotification("🎉 ゲームクリア！おめでとうございます！");
            });
        }
    }

    const FACTORY = {
        delinquent: Delinquent,
        stray_dog: StrayDog,
        chicken: Chicken,
        rabbit: Rabbit,
        bike_kid: BikeKid,
        kinjiro: Kinjiro,
        boss: DarkPrincipal
    };

    function spawn(type, x, y, area) {
        const Ctor = FACTORY[type] || Enemy;
        return new Ctor(x, y, area);
    }

    global.EnemyKit = {
        Enemy,
        Delinquent,
        StrayDog,
        Chicken,
        Rabbit,
        BikeKid,
        Kinjiro,
        DarkPrincipal,
        spawn
    };
})(window);
