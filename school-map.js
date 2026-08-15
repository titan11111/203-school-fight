/* 校舎・グラウンド描画（日本の中学校らしい配置） */
(function (global) {
    const GROUND = {
        school_plaza: 1,
        school_field: 1
    };

    function isGround(type) {
        return !!GROUND[type];
    }

    const PROPS = {
        school_building: 1,
        school_gym: 1,
        school_shed: 1,
        school_flag: 1,
        school_stand: 1,
        school_bars: 1,
        school_backstop: 1,
        school_gate: 1,
        school_fence: 1,
        flower_bed: 1,
        goal_net: 1
    };

    function isProp(type) {
        return !!PROPS[type];
    }

    function fillRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
    }

    function drawYard(ctx, w, h) {
        fillRect(ctx, 0, 0, w, h, '#3d6b34');
        ctx.fillStyle = '#4a7d3d';
        for (let y = 0; y < h; y += 28) {
            for (let x = 0; x < w; x += 28) {
                if (((x + y * 3) / 28 | 0) % 3 === 0) ctx.fillRect(x, y, 16, 16);
            }
        }
        ctx.fillStyle = '#2f5829';
        for (let y = 8; y < h; y += 44) {
            for (let x = 12; x < w; x += 44) {
                if (((x * 5 + y) / 44 | 0) % 2 === 0) ctx.fillRect(x, y, 10, 10);
            }
        }
    }

    function drawPlaza(ctx, dec) {
        const { x, y, w, h } = dec;
        fillRect(ctx, x, y, w, h, '#c8ccd1');
        ctx.fillStyle = '#b4b8be';
        for (let ty = y; ty < y + h; ty += 36) {
            ctx.fillRect(x, ty, w, 2);
        }
        for (let tx = x; tx < x + w; tx += 48) {
            ctx.fillRect(tx, y, 2, h);
        }
        fillRect(ctx, x, y + h - 8, w, 8, '#9aa0a8');
    }

    function drawField(ctx, dec) {
        const { x, y, w, h } = dec;
        fillRect(ctx, x - 36, y - 24, w + 72, h + 48, '#a35a32');
        fillRect(ctx, x, y, w, h, '#c47840');
        ctx.fillStyle = '#b86a36';
        for (let ty = y; ty < y + h; ty += 18) {
            for (let tx = x; tx < x + w; tx += 18) {
                if (((tx * 11 + ty * 7) / 18 | 0) % 4 === 0) ctx.fillRect(tx, ty, 8, 8);
            }
        }
        ctx.fillStyle = '#d08952';
        for (let ty = y + 6; ty < y + h; ty += 26) {
            for (let tx = x + 10; tx < x + w; tx += 26) {
                if (((tx + ty) / 26 | 0) % 5 === 0) ctx.fillRect(tx, ty, 5, 5);
            }
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.88)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 18, y + 18, w - 36, h - 36);

        const midX = x + w / 2;
        const midY = y + h / 2;
        ctx.beginPath();
        ctx.moveTo(midX, y + 18);
        ctx.lineTo(midX, y + h - 18);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(midX, midY, 70, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(midX, midY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        const boxW = 130;
        const boxH = 220;
        ctx.strokeRect(x + 18, midY - boxH / 2, boxW, boxH);
        ctx.strokeRect(x + w - 18 - boxW, midY - boxH / 2, boxW, boxH);
        ctx.strokeRect(x + 18, midY - 70, 48, 140);
        ctx.strokeRect(x + w - 66, midY - 70, 48, 140);

        const homeX = x + 210;
        const homeY = y + h - 70;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(homeX, homeY);
        ctx.lineTo(homeX + 110, homeY - 110);
        ctx.lineTo(homeX, homeY - 220);
        ctx.lineTo(homeX - 110, homeY - 110);
        ctx.closePath();
        ctx.stroke();
        fillRect(ctx, homeX - 10, homeY - 8, 20, 16, '#f8fafc');
        fillRect(ctx, homeX + 96, homeY - 118, 14, 14, '#f8fafc');
        fillRect(ctx, homeX - 110, homeY - 118, 14, 14, '#f8fafc');
        fillRect(ctx, homeX - 7, homeY - 228, 14, 14, '#f8fafc');
        ctx.fillStyle = '#a35a32';
        ctx.beginPath();
        ctx.arc(homeX, homeY - 110, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawBuilding(ctx, dec) {
        const { x, y, w, h } = dec;
        const depth = 40;
        const wallTop = y + depth;
        const wallH = h - depth;

        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.moveTo(x, wallTop);
        ctx.lineTo(x + depth, y);
        ctx.lineTo(x + w + depth, y);
        ctx.lineTo(x + w, wallTop);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.moveTo(x + w, wallTop);
        ctx.lineTo(x + w + depth, y);
        ctx.lineTo(x + w + depth, y + wallH);
        ctx.lineTo(x + w, wallTop + wallH);
        ctx.closePath();
        ctx.fill();

        fillRect(ctx, x, wallTop, w, wallH, '#efe2c6');
        fillRect(ctx, x, wallTop + wallH - 28, w, 28, '#d6c4a2');
        fillRect(ctx, x, wallTop, w, 10, '#3f6f7a');

        ctx.fillStyle = '#cbd5e1';
        for (let fx = x + 16; fx < x + w - 8; fx += 28) {
            ctx.fillRect(fx, y + 8, 18, 4);
        }
        fillRect(ctx, x + 8, y + 4, w - 8, 6, '#9ca3af');

        const floors = 3;
        const cols = 12;
        const winW = 54;
        const winH = 28;
        const gapX = (w - 80 - cols * winW) / (cols - 1);
        const doorCol0 = 5;
        const doorCol1 = 6;
        for (let floor = 0; floor < floors; floor++) {
            const fy = wallTop + 22 + floor * 52;
            fillRect(ctx, x + 16, fy + winH + 6, w - 32, 4, '#d4c4a4');
            for (let col = 0; col < cols; col++) {
                if ((floor === 0 || floor === 2) && col >= doorCol0 && col <= doorCol1) continue;
                const wx = x + 40 + col * (winW + gapX);
                fillRect(ctx, wx - 3, fy - 3, winW + 6, winH + 6, '#1f6f7c');
                fillRect(ctx, wx, fy, winW, winH, '#7dd3fc');
                fillRect(ctx, wx, fy, winW, 8, '#bae6fd');
                ctx.fillStyle = 'rgba(15,23,42,0.18)';
                ctx.fillRect(wx + (winW / 2 | 0) - 1, fy, 2, winH);
                ctx.fillRect(wx, fy + (winH / 2 | 0), winW, 2);
            }
        }

        const stairX = x + w - 70;
        fillRect(ctx, stairX, wallTop + 16, 46, wallH - 20, '#94a3b8');
        ctx.fillStyle = '#64748b';
        for (let sy = wallTop + 20; sy < wallTop + wallH - 16; sy += 10) {
            ctx.fillRect(stairX + 4, sy, 38, 4);
        }
        fillRect(ctx, stairX - 4, wallTop + 12, 54, 6, '#cbd5e1');

        fillRect(ctx, x + 18, wallTop + 20, 8, wallH - 24, '#64748b');
        fillRect(ctx, x + w - 86, wallTop + 20, 8, wallH - 24, '#64748b');

        const doorW = 128;
        const doorX = x + w / 2 - doorW / 2;
        const doorY = wallTop + wallH - 92;
        fillRect(ctx, doorX - 18, doorY - 22, doorW + 36, 18, '#334155');
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(doorX - 28, doorY - 4);
        ctx.lineTo(doorX + doorW + 28, doorY - 4);
        ctx.lineTo(doorX + doorW + 16, doorY - 22);
        ctx.lineTo(doorX - 16, doorY - 22);
        ctx.closePath();
        ctx.fill();

        fillRect(ctx, doorX, doorY, doorW, 92, '#1f4d56');
        fillRect(ctx, doorX + 8, doorY + 10, 50, 74, '#67e8f9');
        fillRect(ctx, doorX + 70, doorY + 10, 50, 74, '#67e8f9');
        fillRect(ctx, doorX + 8, doorY + 10, 50, 16, '#a5f3fc');
        fillRect(ctx, doorX + 70, doorY + 10, 50, 16, '#a5f3fc');
        fillRect(ctx, doorX + 52, doorY + 44, 8, 8, '#f8fafc');

        ctx.fillStyle = '#cbd5e1';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(doorX - 8 + i * 4, doorY + 92 + i * 5, doorW + 16 - i * 8, 5);
        }

        const clockX = x + w / 2;
        const clockY = wallTop + 38;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(clockX, clockY, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(clockX, clockY, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX, clockY - 10);
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX + 8, clockY + 4);
        ctx.stroke();

        fillRect(ctx, x + w / 2 - 150, wallTop + 62, 300, 28, '#1e293b');
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + w / 2 - 150, wallTop + 62, 300, 28);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 18px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('桜ヶ丘中学校', x + w / 2, wallTop + 76);
    }

    function drawGym(ctx, dec) {
        const { x, y, w, h } = dec;
        fillRect(ctx, x + 12, y, w, 18, '#78716c');
        fillRect(ctx, x, y + 16, w, h - 16, '#d6c4a2');
        fillRect(ctx, x, y + 16, w, 14, '#b45309');
        fillRect(ctx, x + 10, y + 40, w - 20, 10, '#1f6f7c');
        for (let i = 0; i < 5; i++) {
            fillRect(ctx, x + 18 + i * 32, y + 44, 22, 36, '#7dd3fc');
        }
        fillRect(ctx, x + w / 2 - 28, y + h - 58, 56, 48, '#44403c');
        fillRect(ctx, x + w / 2 - 22, y + h - 52, 20, 36, '#67e8f9');
        fillRect(ctx, x + w / 2 + 2, y + h - 52, 20, 36, '#67e8f9');
        fillRect(ctx, x + 16, y + 22, w - 32, 20, '#1e293b');
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 13px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('体育館', x + w / 2, y + 32);
    }

    function drawShed(ctx, dec) {
        const { x, y, w, h } = dec;
        fillRect(ctx, x + 8, y, w - 8, 14, '#57534e');
        fillRect(ctx, x, y + 12, w, h - 12, '#a8a29e');
        ctx.fillStyle = '#78716c';
        for (let i = 0; i < 6; i++) ctx.fillRect(x + 8 + i * 22, y + 20, 14, h - 36);
        fillRect(ctx, x + w / 2 - 22, y + h - 40, 44, 32, '#44403c');
        fillRect(ctx, x + 10, y + 16, w - 20, 16, '#1e293b');
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('体育倉庫', x + w / 2, y + 24);
    }

    function drawFlag(ctx, dec) {
        fillRect(ctx, dec.x - 3, dec.y - 120, 6, 120, '#94a3b8');
        fillRect(ctx, dec.x - 10, dec.y - 4, 20, 10, '#57534e');
        fillRect(ctx, dec.x + 3, dec.y - 118, 54, 34, '#f8fafc');
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(dec.x + 30, dec.y - 101, 9, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawStand(ctx, dec) {
        fillRect(ctx, dec.x - 54, dec.y - 8, 108, 28, '#78716c');
        fillRect(ctx, dec.x - 48, dec.y - 36, 96, 28, '#a8a29e');
        fillRect(ctx, dec.x - 48, dec.y - 52, 96, 8, '#44403c');
        ctx.fillStyle = '#cbd5e1';
        for (let i = 0; i < 3; i++) ctx.fillRect(dec.x - 20 + i * 4, dec.y + 10 + i * 5, 40 - i * 8, 5);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('朝礼台', dec.x, dec.y - 22);
    }

    function drawBars(ctx, dec) {
        fillRect(ctx, dec.x, dec.y - 52, 8, 56, '#94a3b8');
        fillRect(ctx, dec.x + 86, dec.y - 52, 8, 56, '#94a3b8');
        fillRect(ctx, dec.x, dec.y - 48, 94, 5, '#cbd5e1');
        fillRect(ctx, dec.x + 8, dec.y - 32, 78, 4, '#e2e8f0');
        fillRect(ctx, dec.x + 16, dec.y - 16, 62, 4, '#e2e8f0');
    }

    function drawBackstop(ctx, dec) {
        const { x, y, w, h } = dec;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x + w - 20, y);
        ctx.lineTo(x + w, y + h);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(226,232,240,0.45)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            ctx.beginPath();
            ctx.moveTo(x + 20 + (w - 40) * t, y);
            ctx.lineTo(x + w * t, y + h);
            ctx.stroke();
        }
    }

    function drawGate(ctx, dec) {
        const { x, y, w, h } = dec;
        fillRect(ctx, x, y - 30, 32, h + 30, '#78716c');
        fillRect(ctx, x + w - 32, y - 30, 32, h + 30, '#78716c');
        fillRect(ctx, x - 6, y - 42, 44, 16, '#57534e');
        fillRect(ctx, x + w - 38, y - 42, 44, 16, '#57534e');
        fillRect(ctx, x + 32, y - 56, w - 64, 18, '#1e293b');
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px DotGothic16, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('桜ヶ丘中学校', x + w / 2, y - 47);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 32, y + 8);
        ctx.lineTo(x + 70, y + h - 8);
        ctx.moveTo(x + w - 32, y + 8);
        ctx.lineTo(x + w - 70, y + h - 8);
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(x + 36 + i * 8, y + 12 + i * 10, 4, 28);
            ctx.fillRect(x + w - 40 - i * 8, y + 12 + i * 10, 4, 28);
        }
    }

    function drawFence(ctx, dec) {
        fillRect(ctx, dec.x, dec.y, dec.w, 6, '#94a3b8');
        ctx.fillStyle = '#64748b';
        for (let px = dec.x; px < dec.x + dec.w; px += 16) {
            ctx.fillRect(px, dec.y - 18, 4, 24);
        }
        ctx.strokeStyle = 'rgba(203,213,225,0.5)';
        ctx.lineWidth = 1;
        for (let ly = dec.y - 14; ly < dec.y + 4; ly += 6) {
            ctx.beginPath();
            ctx.moveTo(dec.x, ly);
            ctx.lineTo(dec.x + dec.w, ly);
            ctx.stroke();
        }
    }

    function drawFlowerBed(ctx, dec) {
        fillRect(ctx, dec.x, dec.y, dec.w, dec.h, '#78716c');
        fillRect(ctx, dec.x + 4, dec.y + 4, dec.w - 8, dec.h - 8, '#7c4a1e');
        const colors = ['#f472b6', '#facc15', '#fb7185', '#4ade80'];
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(dec.x + 16 + i * ((dec.w - 28) / 7), dec.y + dec.h / 2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawGoal(ctx, dec) {
        const tall = dec.h > dec.w;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 4;
        ctx.strokeRect(dec.x, dec.y, dec.w, dec.h);
        ctx.strokeStyle = 'rgba(248,250,252,0.35)';
        ctx.lineWidth = 1;
        if (tall) {
            for (let gy = dec.y; gy <= dec.y + dec.h; gy += 10) {
                ctx.beginPath();
                ctx.moveTo(dec.x, gy);
                ctx.lineTo(dec.x + dec.w, gy);
                ctx.stroke();
            }
        } else {
            for (let gx = dec.x; gx <= dec.x + dec.w; gx += 10) {
                ctx.beginPath();
                ctx.moveTo(gx, dec.y);
                ctx.lineTo(gx, dec.y + dec.h);
                ctx.stroke();
            }
        }
        fillRect(ctx, dec.x - 3, dec.y - 3, 8, 8, '#e2e8f0');
        fillRect(ctx, dec.x + dec.w - 5, dec.y - 3, 8, 8, '#e2e8f0');
        fillRect(ctx, dec.x - 3, dec.y + dec.h - 5, 8, 8, '#e2e8f0');
        fillRect(ctx, dec.x + dec.w - 5, dec.y + dec.h - 5, 8, 8, '#e2e8f0');
    }

    function draw(ctx, dec) {
        switch (dec.type) {
            case 'school_plaza': return drawPlaza(ctx, dec);
            case 'school_field': return drawField(ctx, dec);
            case 'school_building': return drawBuilding(ctx, dec);
            case 'school_gym': return drawGym(ctx, dec);
            case 'school_shed': return drawShed(ctx, dec);
            case 'school_flag': return drawFlag(ctx, dec);
            case 'school_stand': return drawStand(ctx, dec);
            case 'school_bars': return drawBars(ctx, dec);
            case 'school_backstop': return drawBackstop(ctx, dec);
            case 'school_gate': return drawGate(ctx, dec);
            case 'school_fence': return drawFence(ctx, dec);
            case 'flower_bed': return drawFlowerBed(ctx, dec);
            case 'goal_net': return drawGoal(ctx, dec);
            default: return;
        }
    }

    function collider(dec) {
        if (!dec || !dec.type) return null;
        switch (dec.type) {
            case 'school_building': {
                const doorW = 120;
                const doorX = dec.x + dec.w / 2 - doorW / 2;
                const wallTop = dec.y + 36;
                const wallH = dec.h + 48;
                return [
                    { x: dec.x, y: wallTop, w: doorX - dec.x, h: wallH },
                    { x: doorX + doorW, y: wallTop, w: dec.x + dec.w - doorX - doorW, h: wallH },
                    { x: dec.x + 24, y: dec.y, w: dec.w - 48, h: 36 }
                ];
            }
            case 'school_gym':
            case 'school_shed':
                return [{ x: dec.x, y: dec.y + 16, w: dec.w, h: dec.h - 16 }];
            case 'school_flag':
                return [{ x: dec.x - 8, y: dec.y - 10, w: 16, h: 18 }];
            case 'school_stand':
                return [{ x: dec.x - 50, y: dec.y - 18, w: 100, h: 40 }];
            case 'school_bars':
                return [
                    { x: dec.x - 4, y: dec.y - 8, w: 16, h: 18 },
                    { x: dec.x + 82, y: dec.y - 8, w: 16, h: 18 }
                ];
            case 'school_backstop':
                return [{ x: dec.x + 8, y: dec.y, w: dec.w - 16, h: 14 }];
            case 'school_gate':
                return [
                    { x: dec.x, y: dec.y - 20, w: 32, h: dec.h + 20 },
                    { x: dec.x + dec.w - 32, y: dec.y - 20, w: 32, h: dec.h + 20 }
                ];
            case 'school_fence':
                return [{ x: dec.x, y: dec.y - 8, w: dec.w, h: 16 }];
            case 'flower_bed':
                return [{ x: dec.x, y: dec.y, w: dec.w, h: dec.h }];
            case 'goal_net':
                return [{ x: dec.x, y: dec.y, w: dec.w, h: dec.h }];
            default:
                return null;
        }
    }

    global.SchoolMap = {
        drawYard,
        draw,
        isGround,
        isProp,
        collider
    };
})(window);
