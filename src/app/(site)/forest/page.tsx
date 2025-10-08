'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { forestCreators } from '@/data/forestCreators';

type Creator = { id: string; name: string };

type TreeMarker = {
  creator: Creator;
  top: number; 
  left: number; 
  scale: number;
  rotation: number;
  image: string;
  width: number;
  totalHeight: number;
};

type ForestLayout = { markers: TreeMarker[]; containerHeight: number };

const treeImages = [
  '/tree1.png','/tree2.png','/tree3.png','/tree4.png',
  '/tree5.png','/tree6.png','/tree7.png','/tree8.png',
];

const sampleCreators: Creator[] = forestCreators.map((creator) => ({
  id: creator.id,
  name: creator.name,
}));

// ------------------- 노이즈 유틸 -------------------
function hash2D(ix: number, iy: number) {
  let h = ix * 374761393 + iy * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }

function valueNoise2D(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const tx = smoothstep(x - xi), ty = smoothstep(y - yi);
  const v00 = hash2D(xi, yi);
  const v10 = hash2D(xi + 1, yi);
  const v01 = hash2D(xi, yi + 1);
  const v11 = hash2D(xi + 1, yi + 1);
  const vx0 = lerp(v00, v10, tx);
  const vx1 = lerp(v01, v11, tx);
  return lerp(vx0, vx1, ty);
}
// ---------------------------------------------------

function hashStringToSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function createRng(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed += 0x6d2b79f5;
    seed = Math.imul(seed ^ (seed >>> 15), seed | 1);
    seed ^= seed + Math.imul(seed ^ (seed >>> 7), seed | 61);
    return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
  };
}

function createForestLayout(creators: Creator[]): ForestLayout {
  if (creators.length === 0) {
    return { markers: [], containerHeight: 900 };
  }

  const orderedCreators = [...creators].sort(
    (a, b) => hashStringToSeed(a.id) - hashStringToSeed(b.id),
  );

  const baseTreeWidth = 220;
  const baseTreeHeight = 260;
  const labelHeight = 40;
  const maxScale = 1.25;

  const maxTreeWidth = baseTreeWidth * maxScale;
  const maxTotalHeight = baseTreeHeight * maxScale + labelHeight;

  const horizontalMargin = 60;
  const verticalMargin = 60;
  const baseSeparation = 60;

  const approxCols = Math.max(3, Math.ceil(Math.sqrt(creators.length)));
  const approxRows = Math.max(1, Math.ceil(creators.length / approxCols));

  let areaWidth = Math.max(
    1920,
    horizontalMargin * 2 + approxCols * (maxTreeWidth + baseSeparation),
  );
  let areaHeight = Math.max(
    600,
    verticalMargin * 2 + approxRows * (maxTotalHeight + baseSeparation),
  );

  const noiseScale = 1 / 300; // 1/300 ~ 1/600
  const mulMin = 0.8;
  const mulMax = 1.0;

  type DetailedMarker = TreeMarker & {
    centerX: number;
    centerY: number;
    radius: number;
    localMul: number;
  };

  const detailedMarkers: DetailedMarker[] = [];

  orderedCreators.forEach((creator, index) => {
    const rng = createRng(hashStringToSeed(`${creator.id}-${index}`));

    const scale = 1;
    const rotation = (rng() - 0.5) * 6;
    const image = treeImages[Math.floor(rng() * treeImages.length)];

    const treeWidth = baseTreeWidth;
    const treeHeight = baseTreeHeight;
    const totalHeight = treeHeight + labelHeight;

    const separation = baseSeparation + rng() * baseSeparation;
    const radius = Math.sqrt((treeWidth / 2) ** 2 + (totalHeight / 2) ** 2) + separation;

    let minCenterX = horizontalMargin + treeWidth / 2;
    let maxCenterX = areaWidth - horizontalMargin - treeWidth / 2;
    let minCenterY = verticalMargin + totalHeight / 2;
    let maxCenterY = areaHeight - verticalMargin - totalHeight / 2;

    let rangeX = Math.max(0, maxCenterX - minCenterX);
    let rangeY = Math.max(0, maxCenterY - minCenterY);

    let spacingFactor = 1;
    let attempts = 0;
    let placed = false;
    let centerX = (minCenterX + maxCenterX) / 2;
    let centerY = (minCenterY + maxCenterY) / 2;

    const maxAttempts = 2000;

    while (!placed && attempts < maxAttempts) {
      const candidateX = rangeX > 0 ? minCenterX + rng() * rangeX : (minCenterX + maxCenterX) / 2;
      const candidateY = rangeY > 0 ? minCenterY + rng() * rangeY : (minCenterY + maxCenterY) / 2;

      // 지역 배수 결정
      const candMul = lerp(
        mulMin,
        mulMax,
        valueNoise2D(candidateX * noiseScale, candidateY * noiseScale),
      );

      const collides = detailedMarkers.some((marker) => {
        const dx = candidateX - marker.centerX;
        const dy = candidateY - marker.centerY;
        const required = (radius * candMul + marker.radius * marker.localMul) * spacingFactor;
        return dx * dx + dy * dy < required * required;
      });

      if (!collides) {
        centerX = candidateX;
        centerY = candidateY;

        const top = centerY + totalHeight / 2;
        const left = centerX;

        detailedMarkers.push({
          creator,
          top,
          left,
          scale,
          rotation,
          image,
          width: treeWidth,
          totalHeight,
          centerX,
          centerY,
          radius,
          localMul: candMul, // 저장
        });

        placed = true;
      } else {
        attempts += 1;
        if (attempts % 160 === 0) spacingFactor = Math.max(0.4, spacingFactor * 0.85);
        if (attempts % 280 === 0) {
          const expandFactor = 1.04;
          areaWidth *= expandFactor;
          areaHeight *= expandFactor;
          maxCenterX = areaWidth - horizontalMargin - treeWidth / 2;
          maxCenterY = areaHeight - verticalMargin - totalHeight / 2;
          minCenterX = horizontalMargin + treeWidth / 2;
          minCenterY = verticalMargin + totalHeight / 2;
          rangeX = Math.max(0, maxCenterX - minCenterX);
          rangeY = Math.max(0, maxCenterY - minCenterY);
        }
      }
    }
  });

  const jitterRangeBase = baseSeparation * 0.5;
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  detailedMarkers.forEach((marker, idx) => {
    const jitterRng = createRng(hashStringToSeed(`${marker.creator.id}:jitter:${idx}`));

    const minX = horizontalMargin + marker.width / 2;
    const maxX = areaWidth - horizontalMargin - marker.width / 2;
    const minY = verticalMargin + marker.totalHeight / 2;
    const maxY = areaHeight - verticalMargin - marker.totalHeight / 2;

    const jitterRange = Math.min(
      jitterRangeBase,
      Math.min(maxX - minX, maxY - minY) * 0.5,
    );

    if (jitterRange <= 0) {
      return;
    }

    let bestX = marker.centerX;
    let bestY = marker.centerY;

    for (let attempt = 0; attempt < 16; attempt += 1) {
      const angle = jitterRng() * Math.PI * 2;
      const distance = jitterRng() * jitterRange;
      const candidateX = clamp(
        marker.centerX + Math.cos(angle) * distance,
        minX,
        maxX,
      );
      const candidateY = clamp(
        marker.centerY + Math.sin(angle) * distance,
        minY,
        maxY,
      );

      const collides = detailedMarkers.some((other) => {
        if (other === marker) return false;
        const dx = candidateX - other.centerX;
        const dy = candidateY - other.centerY;
        const required =
          (marker.radius * marker.localMul + other.radius * other.localMul) * 0.95;
        return dx * dx + dy * dy < required * required;
      });

      if (!collides) {
        bestX = candidateX;
        bestY = candidateY;
        break;
      }
    }

    marker.centerX = bestX;
    marker.centerY = bestY;
    marker.left = bestX;
    marker.top = bestY + marker.totalHeight / 2;
  });

  const containerHeight = Math.max(
    areaHeight,
    ...detailedMarkers.map((marker) => marker.top + verticalMargin),
  );

  const markers: TreeMarker[] = detailedMarkers.map(
    ({ centerX: _cx, centerY: _cy, radius: _r, localMul: _m, ...rest }) => rest,
  );

  return { markers, containerHeight };
}

export default function ForestPage() {
  const { markers: treeMarkers, containerHeight } = useMemo(
    () => createForestLayout(sampleCreators),
    [],
  );

  return (
    <main className="relative flex-1 overflow-auto bg-[#f5f5f5]">
      <div
        className="relative mx-auto flex w-full flex-col overflow-auto bg-center shadow-[0_12px_45px_-20px_rgba(99,139,86,0.5)]"
        style={{
          minHeight: `${containerHeight}px`,
          backgroundImage: 'url(/forest_full.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '640px 640px',
        }}
      >
        <div className="relative flex-1">
          {treeMarkers.map((m) => (
            <Link
              key={m.creator.id}
              href={`/forest/${m.creator.id}`}
              aria-label={`${m.creator.name} 작가 상세 보기`}
              className="group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-2 text-center"
              style={{ top: `${m.top}px`, left: `${m.left}px` }}
            >
              <div
                className="pointer-events-none origin-bottom transition-transform duration-300 group-hover:scale-105"
                style={{ width: 220, height: 260, transform: `scale(${m.scale}) rotate(${m.rotation}deg)` }}
              >
                <Image
                  src={m.image}
                  alt={`${m.creator.name}의 숲 나무`}
                  width={220}
                  height={260}
                  priority
                />
              </div>
              <span className="z-10 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-[var(--color-gray-800)] shadow-sm transition-colors group-hover:bg-white whitespace-nowrap">
                {m.creator.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
