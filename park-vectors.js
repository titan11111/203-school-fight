/* 公園の校長・二宮 — audio/ のキャンバスベクターをARPG用に移植 */
(function (global) {
    const KINJIRO_BRONZE = {
        main: '#785e3a',
        dark: '#4d3b23',
        light: '#a38352',
        highlight: '#cbb087',
        book: '#5c1d11'
    };

    function roundRectPath(ctx, x, y, w, h, r) {
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, w, h, r);
            return;
        }
        ctx.rect(x, y, w, h);
    }

    function drawPrincipalVector(ctx, enemy, anim) {
        const scale = (anim && anim.scale) || enemy.drawScale || 1.6;
        const squash = (anim && anim.squash) || 1;
        const bob = (anim && anim.bob) || 0;
        const frameCount = enemy.animTimer | 0;
        const mouthOpen = (enemy.state === 'WINDUP' || enemy.state === 'ATTACK') ? 1 : 0.35;
        const furyEyes = enemy.state === 'WINDUP' || enemy.state === 'ATTACK' || (frameCount % 36 < 8);
        const footY = 123;
        const visualH = (226 * scale) | 0;

        ctx.save();
        ctx.translate(enemy.x | 0, (enemy.y + bob) | 0);
        if (enemy.facing === 'left') ctx.scale(-1, 1);
        ctx.scale(scale, scale * squash);
        ctx.translate(0, -footY);

        const floatY = Math.sin(frameCount * 0.05) * 10;
        const bodyTilt = Math.sin(frameCount * 0.03) * 0.05;
        const legWalk = Math.sin(frameCount * 0.1) * 5;

        const gradient = ctx.createRadialGradient(0, 0, 30, 0, 0, 140);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, floatY, 140 + Math.sin(frameCount * 0.1) * 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(0, 120);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.beginPath();
        ctx.ellipse(0, 5, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        roundRectPath(ctx, -45, -5, 90, 20, 4);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 5, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.translate(0, floatY);
        ctx.rotate(bodyTilt);

        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;

        ctx.beginPath();
        roundRectPath(ctx, -24, 60, 20, 55 + legWalk, 4);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        roundRectPath(ctx, 4, 60, 20, 55 - legWalk, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        roundRectPath(ctx, -30, 108 + legWalk, 24, 15, [6, 2, 4, 8]);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        roundRectPath(ctx, 6, 108 - legWalk, 24, 15, [2, 6, 8, 4]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(-20, 112 + legWalk, 5, 2, -0.2, 0, Math.PI * 2);
        ctx.ellipse(16, 112 - legWalk, 5, 2, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.moveTo(-50, -5);
        ctx.quadraticCurveTo(0, -15, 50, -5);
        ctx.lineTo(55, 65);
        ctx.lineTo(-55, 65);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-18, -10);
        ctx.lineTo(18, -10);
        ctx.lineTo(10, 55);
        ctx.lineTo(-10, 55);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-7, -8);
        ctx.lineTo(7, -8);
        ctx.lineTo(10, 48);
        ctx.lineTo(0, 60);
        ctx.lineTo(-10, 48);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-45, -5); ctx.lineTo(-16, -10); ctx.lineTo(-8, 40); ctx.lineTo(-32, 30);
        ctx.closePath(); ctx.fill();

        ctx.beginPath();
        ctx.moveTo(45, -5); ctx.lineTo(16, -10); ctx.lineTo(8, 40); ctx.lineTo(32, 30);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(-26, 10, 5, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.moveTo(-48, 0);
        ctx.quadraticCurveTo(-70, 25, -50, 50);
        ctx.lineTo(-40, 45);
        ctx.quadraticCurveTo(-55, 25, -42, 5);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(-50, 50, 8, 0, Math.PI * 2);
        ctx.fill();

        const armAngle = Math.sin(frameCount * 0.08) * 0.15;
        ctx.save();
        ctx.translate(45, 0);
        ctx.rotate(armAngle);

        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        roundRectPath(ctx, -6, 0, 16, 45, 6);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(2, 48, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(2, 48);
        ctx.rotate(-0.5);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, -10, 6, 20);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-2, -70, 4, 60);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, -73, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.restore();

        ctx.fillStyle = '#15803d';
        ctx.fillRect(-12, -28, 24, 20);

        const headGrad = ctx.createLinearGradient(0, -100, 0, -20);
        headGrad.addColorStop(0, '#86efac');
        headGrad.addColorStop(0.6, '#22c55e');
        headGrad.addColorStop(1, '#166534');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.ellipse(0, -55, 42, 48, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(-42, -60, 10, 20, 0.2, 0, Math.PI * 2);
        ctx.ellipse(42, -60, 10, 20, -0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-25, -96); ctx.quadraticCurveTo(0, -102, 20, -98);
        ctx.moveTo(-20, -92); ctx.quadraticCurveTo(0, -98, 25, -94);
        ctx.moveTo(-15, -88); ctx.quadraticCurveTo(5, -94, 22, -90);
        ctx.stroke();

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(-32, -72); ctx.lineTo(-8, -62);
        ctx.moveTo(32, -72); ctx.lineTo(8, -62);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(-18, -60, 10, 7, 0, 0, Math.PI * 2);
        ctx.ellipse(18, -60, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-16 + Math.sin(frameCount * 0.1) * 2, -60, 4, 0, Math.PI * 2);
        ctx.arc(16 + Math.sin(frameCount * 0.1) * 2, -60, 4, 0, Math.PI * 2);
        ctx.fill();

        if (furyEyes) {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(-16, -60, 7, 0, Math.PI * 2);
            ctx.arc(16, -60, 7, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';

        ctx.beginPath();
        roundRectPath(ctx, -30, -68, 22, 16, 3);
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        roundRectPath(ctx, 8, -68, 22, 16, 3);
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-8, -60); ctx.lineTo(8, -60);
        ctx.moveTo(-30, -62); ctx.lineTo(-42, -65);
        ctx.moveTo(30, -62); ctx.lineTo(42, -65);
        ctx.stroke();

        ctx.fillStyle = '#450a0a';
        const openAmount = Math.abs(Math.sin(frameCount * 0.2)) * mouthOpen * 14;
        ctx.beginPath();
        ctx.ellipse(0, -38, 14, 6 + openAmount, 0, 0, Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.fillRect(-6, -44, 4, 4);

        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, -50); ctx.quadraticCurveTo(-26, -38, -18, -30);
        ctx.moveTo(22, -50); ctx.quadraticCurveTo(26, -38, 18, -30);
        ctx.stroke();

        ctx.restore();
        return visualH;
    }

    function kinjiroPose(enemy) {
        if (enemy.broken > 0) return 'DAZED';
        if (enemy.state === 'WINDUP') return 'CHARGE';
        if (enemy.state === 'ATTACK') return 'ROLLING';
        if (enemy.isMoving) return 'WALK';
        return 'IDLE';
    }

    function drawKinjiroVector(ctx, enemy, anim) {
        const scale = (anim && anim.scale) || enemy.drawScale || 1.25;
        const squash = (anim && anim.squash) || 1;
        const bob = (anim && anim.bob) || 0;
        const state = kinjiroPose(enemy);
        const frameStep = (enemy.animTimer / 10) | 0;
        const angle = (enemy.animTimer * 0.35) % (Math.PI * 2);
        const c = KINJIRO_BRONZE;
        const footY = state === 'ROLLING' ? 42 : 58;
        const visualH = (118 * scale) | 0;

        ctx.save();
        ctx.translate(enemy.x | 0, (enemy.y + bob) | 0);
        if (enemy.facing === 'left') ctx.scale(-1, 1);
        ctx.scale(scale, scale * squash);
        ctx.translate(0, -footY);

        if (state === 'ROLLING') {
            ctx.rotate(angle);

            ctx.fillStyle = c.dark;
            ctx.beginPath();
            ctx.arc(0, 0, 42, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.fillStyle = (i % 2 === 0) ? c.main : c.light;
                ctx.fillRect(-35, -12, 70, 24);
                ctx.fillStyle = c.highlight;
                ctx.beginPath();
                ctx.arc(30, 0, 7, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = c.book;
            ctx.fillRect(-14, -12, 28, 24);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-10, -10, 20, 20);

            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(-5, 0, 4, 0, Math.PI * 2);
            ctx.arc(5, 0, 4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const choppyY = (state === 'WALK') ? ((frameStep % 2 === 0) ? -5 : 5) : 0;
            const legAngle = (state === 'WALK') ? ((frameStep % 2 === 0) ? 0.25 : -0.25) : 0;
            const dazedTilt = (state === 'DAZED') ? Math.sin(enemy.animTimer * 0.12) * 0.2 : 0;

            ctx.rotate(dazedTilt);

            ctx.fillStyle = '#334155';
            ctx.fillRect(-30, 38, 60, 12);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-35, 50, 70, 8);

            if (state === 'WALK' && frameStep % 2 === 0) {
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(-20 + ((frameStep * 17) % 40), 48, 4, 4);
            }

            ctx.save();
            ctx.translate(-12, -8 + choppyY);
            ctx.fillStyle = c.dark;
            ctx.fillRect(-10, -48, 8, 55);

            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = (i % 2 === 0) ? c.main : c.light;
                ctx.fillRect(-22, -48 + (i * 9), 32, 7);
                ctx.fillStyle = c.dark;
                ctx.fillRect(-12, -48 + (i * 9), 3, 7);
            }
            ctx.restore();

            ctx.save();
            ctx.translate(0, 12);

            ctx.fillStyle = c.dark;
            ctx.fillRect(-14, 0, 10, 26);
            ctx.fillStyle = c.main;
            ctx.fillRect(-16, 26, 14, 8);

            ctx.save();
            ctx.rotate(legAngle);
            ctx.fillStyle = c.dark;
            ctx.fillRect(4, 0, 10, 26);
            ctx.fillStyle = c.main;
            ctx.fillRect(2, 26, 14, 8);
            ctx.restore();
            ctx.restore();

            ctx.fillStyle = c.main;
            ctx.beginPath();
            ctx.moveTo(-22, 14 + choppyY);
            ctx.lineTo(-16, -28 + choppyY);
            ctx.lineTo(16, -28 + choppyY);
            ctx.lineTo(22, 14 + choppyY);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = c.dark;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-16, -28 + choppyY);
            ctx.lineTo(0, -10 + choppyY);
            ctx.lineTo(16, -28 + choppyY);
            ctx.stroke();

            ctx.fillStyle = c.dark;
            ctx.fillRect(-20, -5 + choppyY, 40, 8);

            ctx.save();
            ctx.translate(0, -38 + choppyY);
            if (state === 'CHARGE') ctx.translate(4, 4);

            ctx.fillStyle = c.light;
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = c.dark;
            ctx.beginPath();
            ctx.arc(0, -14, 6, 0, Math.PI * 2);
            ctx.fill();

            if (state === 'CHARGE') {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.fillRect(3, -3, 8, 4);
                ctx.fill();
            } else if (state === 'DAZED') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(6, -2, 5, 0, Math.PI * 1.5);
                ctx.stroke();
            } else {
                ctx.fillStyle = c.dark;
                ctx.fillRect(4, -3, 6, 4);
            }
            ctx.restore();

            ctx.save();
            ctx.translate(8, -18 + choppyY);
            ctx.fillStyle = c.main;
            ctx.fillRect(0, -4, 18, 8);
            ctx.translate(14, -4);
            if (state === 'CHARGE') ctx.rotate(-0.5);
            ctx.fillStyle = c.book;
            ctx.fillRect(0, -12, 14, 20);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(3, -10, 10, 16);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(5, -6, 6, 2);
            ctx.fillRect(5, -2, 6, 2);
            ctx.fillRect(5, 2, 6, 2);
            ctx.restore();

            if (state === 'HURT') {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
                ctx.beginPath();
                ctx.arc(0, 0, 50, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
        return visualH;
    }

    function fillP(ctx, d, color) {
        ctx.fillStyle = color;
        ctx.fill(new Path2D(d));
    }

    function strokeP(ctx, d, color, w) {
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(new Path2D(d));
    }

    function drawNurseVector(ctx, npc, anim) {
        const unit = (anim && anim.scale) || (npc.def && npc.def.scale) || 1.2;
        const scale = unit * 0.25;
        const squash = (anim && anim.squash) || 1;
        const bob = (anim && anim.bob) || 0;
        const t = npc.animTimer || 0;
        const breath = Math.sin(t * 0.055) * 8;
        const hairRot = Math.sin(t * 0.04) * 0.04;
        const coatL = Math.sin(t * 0.048) * 0.035;
        const coatR = Math.sin(t * 0.042 + 0.8) * 0.035;
        const blink = ((t / 92) | 0) % 8 === 7;
        const wink = !blink && ((t / 170) | 0) % 13 === 4;
        const walk = npc.isMoving ? Math.sin(t * 0.22) * 7 : 0;
        const visualH = (658 * scale) | 0;

        ctx.save();
        ctx.translate(npc.x | 0, (npc.y + bob) | 0);
        if (npc.facing === 'left') ctx.scale(-1, 1);
        ctx.scale(scale, scale * squash);
        ctx.translate(-200, -738);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
        ctx.beginPath();
        ctx.ellipse(200, 745, 78, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(0, breath);

        ctx.save();
        ctx.translate(210, 140);
        ctx.rotate(hairRot);
        ctx.translate(-210, -140);
        fillP(ctx, 'M140,160 Q120,250 145,350 Q170,360 180,310 Z', '#542e22');
        fillP(ctx, 'M260,160 Q280,250 255,350 Q230,360 220,310 Z', '#542e22');
        ctx.restore();

        fillP(ctx, 'M145,400 Q135,530 130,590 Q200,600 270,590 Q265,530 255,400 Z', '#dbe3ee');

        ctx.save();
        ctx.translate(0, walk);
        fillP(ctx, 'M172,500 L168,660 Q167,710 165,725 L188,725 Q188,700 190,660 L192,500 Z', '#e8c4a8');
        ctx.restore();
        ctx.save();
        ctx.translate(0, -walk);
        fillP(ctx, 'M208,500 L210,660 Q212,700 212,725 L235,725 Q233,710 232,660 L228,500 Z', '#e8c4a8');
        ctx.restore();

        fillP(ctx, 'M152,725 C152,718 165,715 178,715 C190,715 192,722 192,728 C192,735 180,738 162,738 C153,738 152,732 152,725 Z', '#f8fafc');
        strokeP(ctx, 'M152,725 C155,720 170,720 185,723', '#be123c', 2);
        fillP(ctx, 'M208,728 C208,722 210,715 222,715 C235,715 248,718 248,725 C248,732 247,738 238,738 C220,738 208,735 208,728 Z', '#f8fafc');
        strokeP(ctx, 'M215,723 C230,720 245,720 248,725', '#be123c', 2);

        fillP(ctx, 'M160,380 L140,510 Q200,530 260,510 L240,380 Z', '#1e3a8a');
        strokeP(ctx, 'M180,385 L175,516 M200,385 L200,520 M220,385 L225,516', '#1e40af', 1.5);

        fillP(ctx, 'M165,270 L235,270 L240,385 L160,385 Z', '#e11d48');
        fillP(ctx, 'M185,270 L200,295 L215,270 Z', '#f8fafc');

        ctx.save();
        ctx.translate(140, 300);
        ctx.rotate(coatL);
        ctx.translate(-140, -300);
        fillP(ctx, 'M160,265 L125,420 L132,580 Q170,575 185,565 L175,380 L180,270 Z', '#f1f5f9');
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        roundRectPath(ctx, 140, 440, 30, 35, 4);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(145, 433);
        ctx.lineTo(145, 445);
        ctx.stroke();
        ctx.strokeStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(152, 430);
        ctx.lineTo(152, 445);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(260, 300);
        ctx.rotate(coatR);
        ctx.translate(-260, -300);
        fillP(ctx, 'M240,265 L275,420 L268,580 Q230,575 215,565 L225,380 L220,270 Z', '#f1f5f9');
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        roundRectPath(ctx, 230, 440, 30, 35, 4);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        fillP(ctx, 'M165,265 L140,310 L175,325 L182,270 Z', '#ffffff');
        fillP(ctx, 'M235,265 L260,310 L225,325 L218,270 Z', '#ffffff');
        strokeP(ctx, 'M165,265 L140,310 L175,325 L182,270 Z', '#cbd5e1', 1);
        strokeP(ctx, 'M235,265 L260,310 L225,325 L218,270 Z', '#cbd5e1', 1);

        strokeP(ctx, 'M175,270 Q165,310 180,360 Q200,390 210,360 Q225,310 225,270', '#fb7185', 4);
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(180, 360, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(180, 360, 6, 0, Math.PI * 2);
        ctx.fill();
        strokeP(ctx, 'M173,268 L170,255 M227,268 L230,255', '#64748b', 3);

        fillP(ctx, 'M188,235 L212,235 L215,275 L185,275 Z', '#f3c4a4');

        fillP(ctx, 'M160,270 L130,360 L165,390 L178,350 L165,280 Z', '#f8fafc');
        fillP(ctx, 'M240,270 L270,360 L235,390 L222,350 L235,280 Z', '#f8fafc');
        ctx.fillStyle = '#f3c4a4';
        ctx.beginPath();
        ctx.arc(172, 392, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(228, 392, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        roundRectPath(ctx, 170, 340, 60, 75, 5);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        roundRectPath(ctx, 175, 350, 50, 60, 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(188, 336, 24, 8);
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(180, 360);
        ctx.lineTo(215, 360);
        ctx.stroke();
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(180, 370);
        ctx.lineTo(218, 370);
        ctx.moveTo(180, 380);
        ctx.lineTo(210, 380);
        ctx.moveTo(180, 390);
        ctx.lineTo(215, 390);
        ctx.stroke();
        strokeP(ctx, 'M210,398 L214,402 L220,394', '#059669', 2);

        fillP(ctx, 'M150,150 C150,225 170,245 200,245 C230,245 250,225 250,150 C250,110 230,100 200,100 C170,100 150,110 150,150 Z', '#f3c4a4');
        ctx.fillStyle = '#e8b496';
        ctx.beginPath();
        ctx.ellipse(148, 165, 7, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(252, 165, 7, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.arc(148, 173, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(252, 173, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(251, 113, 133, 0.28)';
        ctx.beginPath();
        ctx.ellipse(168, 182, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(232, 182, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        strokeP(ctx, 'M198,172 Q200,176 202,172', '#c08478', 2);
        strokeP(ctx, 'M162,148 Q175,142 186,146', '#542e22', 2.5);
        strokeP(ctx, 'M214,146 Q225,142 238,148', '#542e22', 2.5);

        if (blink) {
            strokeP(ctx, 'M164,165 Q175,158 186,165 M214,165 Q225,158 236,165', '#1f2937', 3);
        } else if (wink) {
            strokeP(ctx, 'M164,165 Q175,150 186,165', '#1f2937', 3.5);
            ctx.fillStyle = '#332211';
            ctx.beginPath();
            ctx.ellipse(225, 162, 9, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6f4233';
            ctx.beginPath();
            ctx.ellipse(225, 164, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(222, 158, 3.5, 0, Math.PI * 2);
            ctx.fill();
            strokeP(ctx, 'M214,156 Q225,150 236,158', '#1f2937', 2.5);
        } else {
            ctx.fillStyle = '#332211';
            ctx.beginPath();
            ctx.ellipse(175, 162, 9, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(225, 162, 9, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6f4233';
            ctx.beginPath();
            ctx.ellipse(175, 164, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(225, 164, 7, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(172, 158, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(177, 167, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(222, 158, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(227, 167, 1.8, 0, Math.PI * 2);
            ctx.fill();
            strokeP(ctx, 'M164,158 Q175,150 186,156', '#1f2937', 2.5);
            strokeP(ctx, 'M214,156 Q225,150 236,158', '#1f2937', 2.5);
        }

        fillP(ctx, 'M188,195 Q200,210 212,195 Z', '#e11d48');

        fillP(ctx, 'M148,145 Q170,120 195,148 Q210,120 252,145 C255,110 235,80 200,80 C165,80 145,110 148,145 Z', '#6f4233');
        strokeP(ctx, 'M170,100 Q190,135 182,152', '#6f4233', 12);
        strokeP(ctx, 'M225,100 Q205,135 212,154', '#6f4233', 12);
        strokeP(ctx, 'M195,95 L198,138', '#6f4233', 8);
        strokeP(ctx, 'M162,110 Q200,98 238,110', 'rgba(184, 131, 115, 0.45)', 4);

        ctx.save();
        ctx.translate(148, 140);
        ctx.rotate(-hairRot);
        ctx.translate(-148, -140);
        fillP(ctx, 'M148,140 Q135,180 142,220 Q150,225 153,190 Z', '#542e22');
        ctx.restore();
        ctx.save();
        ctx.translate(252, 140);
        ctx.rotate(hairRot);
        ctx.translate(-252, -140);
        fillP(ctx, 'M252,140 Q265,180 258,220 Q250,225 247,190 Z', '#542e22');
        ctx.restore();

        ctx.save();
        ctx.translate(232, 118);
        ctx.rotate(0.26);
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(-8, -4, 16, 8);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore();
        ctx.restore();
        return visualH;
    }

    global.ParkVectors = {
        drawPrincipal: drawPrincipalVector,
        drawKinjiro: drawKinjiroVector,
        drawNurse: drawNurseVector
    };
})(typeof window !== 'undefined' ? window : this);
