'use client';

import Image from 'next/image';
import { useMemo } from 'react';

type Creator = {
  id: string;
  name: string;
};

type TreeMarker = {
  creator: Creator;
  top: number; // px from top (button bottom aligns via translate-y)
  left: number; // px from left (button center aligns via translate-x)
  scale: number;
  rotation: number;
  image: string;
  width: number;
  height: number;
};

type ForestLayout = {
  markers: TreeMarker[];
  containerHeight: number;
};

const treeImages = [
  '/tree1.png',
  '/tree2.png',
  '/tree3.png',
  '/tree4.png',
  '/tree5.png',
  '/tree6.png',
  '/tree7.png',
  '/tree8.png',
];

const sampleCreators: Creator[] = [
  { id: 'creator-1', name: '작가1' },
  { id: 'creator-2', name: '작가2' },
  { id: 'creator-3', name: '작가3' },
  { id: 'creator-4', name: '작가4' },
  { id: 'creator-5', name: '작가5' },
  { id: 'creator-6', name: '작가6' },
  { id: 'creator-7', name: '작가7' },
  { id: 'creator-8', name: '작가8' },
  { id: 'creator-9', name: '작가9' },
  { id: 'creator-10', name: '작가10' },
  { id: 'creator-11', name: '작가11' },
  { id: 'creator-12', name: '작가12' },
];

function hashStringToSeed(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0; // 32비트 정수로 변환
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
  const markers: TreeMarker[] = [];

  const baseTreeWidth = 220;
  const baseTreeHeight = 260;
  const horizontalMargin = 80;
  const verticalMargin = 120;
  const padding = 50; // tree 간 기본 간격(px)
  const maxAttempts = 120;

  const estimatedCols = Math.max(3, Math.ceil(Math.sqrt(creators.length * 1.1)));
  const estimatedRows = Math.max(1, Math.ceil(creators.length / estimatedCols));

  const virtualWidth = Math.max(
    1200,
    horizontalMargin * 2 + estimatedCols * (baseTreeWidth + padding),
  );
  const virtualHeight = Math.max(
    900,
    verticalMargin * 2 + estimatedRows * (baseTreeHeight + padding),
  );

  creators.forEach((creator, index) => {
    const rng = createRng(hashStringToSeed(`${creator.id}-${index}`));
    const scale = 0.85 + rng() * 0.4;
    const rotation = (rng() - 0.5) * 6;
    const image = treeImages[Math.floor(rng() * treeImages.length)];

    const treeWidth = baseTreeWidth * scale;
    const treeHeight = baseTreeHeight * scale;

    const minX = horizontalMargin + treeWidth / 2;
    const maxX = virtualWidth - horizontalMargin - treeWidth / 2;
    const minY = verticalMargin + treeHeight;
    const maxY = virtualHeight - verticalMargin;

    let attempts = 0;
    let chosenX = (minX + maxX) / 2;
    let chosenY = (minY + maxY) / 2;
    let placed = false;

    const overlaps = (x: number, y: number) =>
      markers.some((marker) => {
        const markerWidth = marker.width;
        const markerHeight = marker.height;

        const rectA = {
          left: x - treeWidth / 2,
          right: x + treeWidth / 2,
          top: y - treeHeight,
          bottom: y,
        };

        const rectB = {
          left: marker.left - markerWidth / 2,
          right: marker.left + markerWidth / 2,
          top: marker.top - markerHeight,
          bottom: marker.top,
        };

        return !(
          rectA.right + padding < rectB.left ||
          rectA.left > rectB.right + padding ||
          rectA.bottom + padding < rectB.top ||
          rectA.top > rectB.bottom + padding
        );
      });

    while (attempts < maxAttempts) {
      attempts += 1;
      const candidateX = minX + rng() * Math.max(20, maxX - minX);
      const candidateY = minY + rng() * Math.max(20, maxY - minY);

      if (!overlaps(candidateX, candidateY)) {
        chosenX = candidateX;
        chosenY = candidateY;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const cellWidth = baseTreeWidth + padding;
      const cellHeight = baseTreeHeight + padding;

      const gridCols = Math.max(
        estimatedCols + 2,
        Math.ceil((virtualWidth - horizontalMargin * 2) / cellWidth),
      );
      const gridRows = Math.max(
        estimatedRows + 2,
        Math.ceil((virtualHeight - verticalMargin * 2) / cellHeight),
      );

      outer: for (let row = 0; row < gridRows; row += 1) {
        for (let col = 0; col < gridCols; col += 1) {
          const gridX =
            horizontalMargin + col * cellWidth + cellWidth / 2 + (rng() - 0.5) * 20;
          const gridY =
            verticalMargin + (row + 1) * cellHeight + (rng() - 0.5) * 20;

          if (
            gridX < minX ||
            gridX > maxX ||
            gridY < minY ||
            gridY > maxY
          ) {
            continue;
          }

          if (!overlaps(gridX, gridY)) {
            chosenX = gridX;
            chosenY = gridY;
            placed = true;
            break outer;
          }
        }
      }

      if (!placed) {
        const fallbackX = Math.min(
          maxX,
          Math.max(minX, horizontalMargin + ((index % gridCols) + 0.5) * cellWidth),
        );
        const fallbackY = Math.min(
          maxY,
          Math.max(minY, verticalMargin + ((Math.floor(index / gridCols) + 1) * cellHeight)),
        );
        chosenX = fallbackX;
        chosenY = fallbackY;
      }
    }

    markers.push({
      creator,
      top: chosenY,
      left: chosenX,
      scale,
      rotation,
      image,
      width: treeWidth,
      height: treeHeight,
    });
  });

  return { markers, containerHeight: virtualHeight };
}

export default function ForestPage() {
  const { markers: treeMarkers, containerHeight } = useMemo(
    () => createForestLayout(sampleCreators),
    [],
  );

  return (
    <main className="relative flex-1 overflow-hidden bg-[#f5f5f5]">
      <div
        className="relative mx-auto flex w-full flex-col overflow-hidden bg-center shadow-[0_12px_45px_-20px_rgba(99,139,86,0.5)]"
        style={{
          minHeight: `${containerHeight}px`,
          backgroundImage: 'url(/forest_full.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '640px 640px',
        }}
      >
        <div className="relative flex-1">
          {treeMarkers.map((marker) => (
            <button
              key={marker.creator.id}
              type="button"
              className="group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-2 text-center"
              style={{
                top: `${marker.top}px`,
                left: `${marker.left}px`,
              }}
            >
              <div
                className="pointer-events-none origin-bottom transition-transform duration-300 group-hover:scale-105"
                style={{
                  transform: `scale(${marker.scale}) rotate(${marker.rotation}deg)`,
                }}
              >
                <Image
                  src={marker.image}
                  alt={`${marker.creator.name}의 숲 나무`}
                  width={220}
                  height={260}
                  priority
                />
              </div>
              <span className="rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-[var(--color-gray-800)] shadow-sm transition-colors group-hover:bg-white">
                {marker.creator.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
