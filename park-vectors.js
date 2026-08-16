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

    function drawNurseVector(ctx, npc, anim) {
        const scale = (anim && anim.scale) || (npc.def && npc.def.scale) || 1.2;
        const squash = (anim && anim.squash) || 1;
        const bob = (anim && anim.bob) || 0;
        const t = (npc.animTimer || 0);
        const breath = Math.sin(t * 0.06) * 1.4;
        const hairSway = Math.sin(t * 0.045) * 3.2;
        const blink = ((t / 90) | 0) % 8 === 7;
        const footY = 76;
        const visualH = (178 * scale) | 0;

        ctx.save();
        ctx.translate(npc.x | 0, (npc.y + bob) | 0);
        if (npc.facing === 'left') ctx.scale(-1, 1);
        ctx.scale(scale, scale * squash);
        ctx.translate(0, -footY);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.beginPath();
        ctx.ellipse(0, 74, 26, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1c120c';
        ctx.beginPath();
        ctx.moveTo(-22, -58);
        ctx.quadraticCurveTo(-38, -20, -30 + hairSway, 28);
        ctx.quadraticCurveTo(-26, 48, -18, 52);
        ctx.quadraticCurveTo(-10, 20, -8, -8);
        ctx.quadraticCurveTo(-16, -40, -10, -70);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(18, -58);
        ctx.quadraticCurveTo(36, -18, 28 + hairSway * 0.6, 36);
        ctx.quadraticCurveTo(24, 56, 14, 58);
        ctx.quadraticCurveTo(10, 22, 8, -6);
        ctx.quadraticCurveTo(18, -42, 12, -70);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3d2316';
        ctx.beginPath();
        ctx.moveTo(-18, -50);
        ctx.quadraticCurveTo(-28, 8, -22 + hairSway * 0.5, 40);
        ctx.lineTo(-16, 38);
        ctx.quadraticCurveTo(-20, 0, -8, -46);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4c2e22';
        ctx.beginPath();
        roundRectPath(ctx, -8, 18, 7, 42, 3);
        ctx.fill();
        ctx.beginPath();
        roundRectPath(ctx, 3, 18, 7, 42, 3);
        ctx.fill();

        ctx.fillStyle = '#2a1812';
        ctx.beginPath();
        ctx.ellipse(-5, 62, 8, 4, -0.15, 0, Math.PI * 2);
        ctx.ellipse(7, 62, 8, 4, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.ellipse(-7, 61, 3, 1.2, -0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e3a5f';
        ctx.beginPath();
        ctx.moveTo(-18, 8);
        ctx.lineTo(-22, 34);
        ctx.quadraticCurveTo(0, 42, 22, 34);
        ctx.lineTo(18, 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#16304f';
        ctx.fillRect(-16, 8, 32, 5);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-20, -18 + breath);
        ctx.quadraticCurveTo(0, -28 + breath, 20, -18 + breath);
        ctx.lineTo(22, 12);
        ctx.quadraticCurveTo(0, 18, -22, 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.moveTo(-8, -16 + breath);
        ctx.lineTo(8, -16 + breath);
        ctx.lineTo(6, 8);
        ctx.lineTo(-6, 8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-6, -14);
        ctx.lineTo(0, 2);
        ctx.lineTo(6, -14);
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(-18, -16);
        ctx.lineTo(-6, -18);
        ctx.lineTo(-4, 6);
        ctx.lineTo(-16, 8);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(18, -16);
        ctx.lineTo(6, -18);
        ctx.lineTo(4, 6);
        ctx.lineTo(16, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fecaca';
        ctx.beginPath();
        roundRectPath(ctx, -16, 2, 12, 10, 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-12, 5, 4, 4);
        ctx.fillRect(-13.5, 6.5, 7, 1.4);

        ctx.save();
        ctx.translate(-18, -12);
        ctx.rotate(-0.35);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        roundRectPath(ctx, -6, 0, 12, 28, 5);
        ctx.fill();
        ctx.fillStyle = '#f3c4a4';
        ctx.beginPath();
        ctx.ellipse(0, 30, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(18, -10);
        ctx.rotate(0.18 + Math.sin(t * 0.05) * 0.04);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        roundRectPath(ctx, -5, 0, 11, 22, 5);
        ctx.fill();
        ctx.fillStyle = '#f3c4a4';
        ctx.beginPath();
        ctx.ellipse(1, 24, 6, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef2f2';
        ctx.beginPath();
        roundRectPath(ctx, -8, 20, 18, 14, 3);
        ctx.fill();
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-1, 24, 3, 8);
        ctx.fillRect(-4, 27, 9, 2.4);
        ctx.restore();

        ctx.fillStyle = '#1c120c';
        ctx.beginPath();
        ctx.moveTo(6, -48);
        ctx.quadraticCurveTo(20, -8, 14 + hairSway * 0.35, 22);
        ctx.quadraticCurveTo(10, 10, 4, -28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1c120c';
        ctx.beginPath();
        ctx.ellipse(0, -62, 26, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f3c4a4';
        ctx.beginPath();
        ctx.ellipse(0, -52, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e8a090';
        ctx.beginPath();
        ctx.ellipse(-11, -46, 5, 3.2, -0.2, 0, Math.PI * 2);
        ctx.ellipse(11, -46, 5, 3.2, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1c120c';
        ctx.beginPath();
        ctx.moveTo(-18, -68);
        ctx.quadraticCurveTo(0, -78, 18, -68);
        ctx.quadraticCurveTo(20, -52, 8, -48);
        ctx.quadraticCurveTo(0, -58, -8, -48);
        ctx.quadraticCurveTo(-20, -52, -18, -68);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3d2316';
        ctx.beginPath();
        ctx.moveTo(-16, -70);
        ctx.quadraticCurveTo(0, -74, 6, -66);
        ctx.quadraticCurveTo(-2, -62, -12, -64);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#3d2316';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-12, -62);
        ctx.quadraticCurveTo(-8, -56, -4, -62);
        ctx.moveTo(4, -62);
        ctx.quadraticCurveTo(8, -56, 12, -62);
        ctx.stroke();

        if (blink) {
            ctx.strokeStyle = '#1c120c';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(-10, -54);
            ctx.quadraticCurveTo(-6, -52, -2, -54);
            ctx.moveTo(2, -54);
            ctx.quadraticCurveTo(6, -52, 10, -54);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.ellipse(-6, -54, 4.2, 3.4, 0, 0, Math.PI * 2);
            ctx.ellipse(6, -54, 4.2, 3.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#3f2a1e';
            ctx.beginPath();
            ctx.arc(-5.5, -54, 2.1, 0, Math.PI * 2);
            ctx.arc(6.5, -54, 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(-6.4, -54.8, 0.7, 0, Math.PI * 2);
            ctx.arc(5.6, -54.8, 0.7, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = '#c08478';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-4, -44);
        ctx.quadraticCurveTo(0, -41, 4, -44);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, -74, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-15, -74, 30, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-15, -67, 30, 2);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-1.5, -78, 3, 9);
        ctx.fillRect(-4.5, -75, 9, 3);

        ctx.restore();
        return visualH;
    }

    global.ParkVectors = {
        drawPrincipal: drawPrincipalVector,
        drawKinjiro: drawKinjiroVector,
        drawNurse: drawNurseVector
    };
})(typeof window !== 'undefined' ? window : this);
