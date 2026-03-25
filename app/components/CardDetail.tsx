"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { CardData, PresentationData } from "../types";

/* ─── Lucide icon markup map ─── */
const ITEM_ICONS: Record<string, string> = {
  clipboard:
    '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  monitor:
    '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  wrench:
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  server:
    '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  "bar-chart":
    '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  "file-edit":
    '<path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 0 0-3 3L12 21l4.5-1.5Z"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
};

function getHeroIndex(items: CardData["items"]): number {
  let maxScore = 0;
  let heroIdx = 0;
  items.forEach((item, idx) => {
    const text = item.text ?? "";
    const subCount = item.subitems?.length ?? 0;
    const score = text.length + subCount * 100;
    if (score > maxScore) {
      maxScore = score;
      heroIdx = idx;
    }
  });
  return heroIdx;
}

interface CardDetailProps {
  cardData: CardData;
  metadata: PresentationData["metadata"];
  onClose: () => void;
}

export default function CardDetail({ cardData, metadata, onClose }: CardDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.querySelector<HTMLButtonElement>(".card-detail-close")?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const items = cardData.items;
  const heroIdx = items.length === 3 ? getHeroIndex(items) : -1;

  type OrderedItem = { data: CardData["items"][number]; origIdx: number; isHero: boolean };
  const ordered: OrderedItem[] = [];
  if (heroIdx >= 0) {
    ordered.push({ data: items[heroIdx], origIdx: heroIdx, isHero: true });
    items.forEach((item, i) => {
      if (i !== heroIdx) ordered.push({ data: item, origIdx: i, isHero: false });
    });
  } else {
    items.forEach((item, i) => ordered.push({ data: item, origIdx: i, isHero: false }));
  }

  const gridStyle: React.CSSProperties =
    heroIdx < 0
      ? {
          gridTemplateColumns: `repeat(${items.length <= 2 ? items.length : items.length === 4 ? 2 : 3}, 1fr)`,
          gridTemplateRows: "1fr",
        }
      : {};

  return (
    <div
      className="card-detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={cardData.title}
    >
      <div className="card-detail-backdrop" onClick={onClose} />
      <div ref={panelRef} className={`card-detail-panel ${cardData.colorClass}`}>
        {/* Animated background beams (cloned) */}
        <BeamsBackground className="cd-bg-beams" />
        {/* Glow elements */}
        {(["glow-1", "glow-2", "glow-3", "glow-4"] as const).map((g) => (
          <div key={g} className={`cd-bg-glow ${g}`} />
        ))}

        <div className="cd-accent-bar" />

        <div className="cd-header">
          <div className="cd-header-left">
            <div className={`icon-box cd-icon ${cardData.colorClass}`}>
              <svg
                viewBox={cardData.icon.viewBox}
                fill="none"
                stroke={cardData.strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {cardData.icon.paths?.map((d, i) => <path key={i} d={d} />)}
                {cardData.icon.ellipse && (
                  <ellipse
                    cx={cardData.icon.ellipse.cx}
                    cy={cardData.icon.ellipse.cy}
                    rx={cardData.icon.ellipse.rx}
                    ry={cardData.icon.ellipse.ry}
                  />
                )}
              </svg>
            </div>
            <div className="cd-title-group">
              <div className="cd-title">{cardData.title}</div>
              <div className="cd-week">{metadata.subtitle}</div>
            </div>
          </div>
        </div>

        <div className="cd-items-grid" style={gridStyle}>
          {ordered.map(({ data: itemData, origIdx, isHero }) => {
            const iconMarkup = itemData.itemIcon ? ITEM_ICONS[itemData.itemIcon] : null;
            return (
              <div
                key={origIdx}
                className={`cd-item-card${isHero ? " cd-hero" : ""}`}
              >
                <div className="cd-item-badge">
                  {String(origIdx + 1).padStart(2, "0")}
                </div>
                <div className="cd-item-body">
                  {iconMarkup && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="cd-item-icon-lg"
                      dangerouslySetInnerHTML={{ __html: iconMarkup }}
                    />
                  )}
                  <div className="cd-item-title">
                    {itemData.title ?? itemData.text}
                  </div>
                  {itemData.title && (
                    <div className="cd-item-desc">{itemData.text}</div>
                  )}
                  {itemData.subitems && itemData.subitems.length > 0 && (
                    <ul className="cd-subitems">
                      {itemData.subitems.map((sub, si) => (
                        <li key={si}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="cd-footer-bar">
          <div className="cd-bar-1" />
          <div className="cd-bar-2" />
          <div className="cd-bar-3" />
        </div>

        <button
          className="card-detail-close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* Inline beams SVG so it can be reused in both slide and detail panel */
export function BeamsBackground({ className = "bg-beams" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 696 316"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875 M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859 M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843 M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827 M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811 M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795 M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779 M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763 M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747 M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731 M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715 M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699 M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683 M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667 M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651 M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635 M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619 M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603 M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587 M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571 M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555 M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539 M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523 M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507 M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483"
        stroke="url(#beams-radial)"
        strokeOpacity="0.13"
        strokeWidth="0.8"
        fill="none"
      />
      <path className="beam" d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875" stroke="#4a6cf7" strokeOpacity="0.55" strokeWidth="1.2" fill="none" style={{ "--dur": "10s", "--del": "0s" } as React.CSSProperties} />
      <path className="beam" d="M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859" stroke="#6ABF4B" strokeOpacity="0.4" strokeWidth="0.8" fill="none" style={{ "--dur": "12s", "--del": "7s" } as React.CSSProperties} />
      <path className="beam" d="M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843" stroke="#C4297D" strokeOpacity="0.5" strokeWidth="1.0" fill="none" style={{ "--dur": "9s", "--del": "3s" } as React.CSSProperties} />
      <path className="beam" d="M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827" stroke="#4a6cf7" strokeOpacity="0.35" strokeWidth="0.7" fill="none" style={{ "--dur": "14s", "--del": "18s" } as React.CSSProperties} />
      <path className="beam" d="M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811" stroke="#6ABF4B" strokeOpacity="0.5" strokeWidth="1.0" fill="none" style={{ "--dur": "11s", "--del": "5s" } as React.CSSProperties} />
      <path className="beam" d="M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795" stroke="#C4297D" strokeOpacity="0.35" strokeWidth="0.7" fill="none" style={{ "--dur": "8s", "--del": "12s" } as React.CSSProperties} />
      <path className="beam" d="M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779" stroke="#4a6cf7" strokeOpacity="0.45" strokeWidth="0.9" fill="none" style={{ "--dur": "13s", "--del": "9s" } as React.CSSProperties} />
      <path className="beam" d="M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755" stroke="#6ABF4B" strokeOpacity="0.4" strokeWidth="0.8" fill="none" style={{ "--dur": "10s", "--del": "20s" } as React.CSSProperties} />
      <path className="beam" d="M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731" stroke="#C4297D" strokeOpacity="0.5" strokeWidth="1.0" fill="none" style={{ "--dur": "9s", "--del": "1s" } as React.CSSProperties} />
      <path className="beam" d="M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707" stroke="#4a6cf7" strokeOpacity="0.35" strokeWidth="0.7" fill="none" style={{ "--dur": "12s", "--del": "15s" } as React.CSSProperties} />
      <path className="beam" d="M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683" stroke="#6ABF4B" strokeOpacity="0.45" strokeWidth="0.9" fill="none" style={{ "--dur": "14s", "--del": "6s" } as React.CSSProperties} />
      <path className="beam" d="M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659" stroke="#C4297D" strokeOpacity="0.35" strokeWidth="0.7" fill="none" style={{ "--dur": "8s", "--del": "22s" } as React.CSSProperties} />
      <path className="beam" d="M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635" stroke="#4a6cf7" strokeOpacity="0.5" strokeWidth="1.0" fill="none" style={{ "--dur": "11s", "--del": "10s" } as React.CSSProperties} />
      <path className="beam" d="M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611" stroke="#6ABF4B" strokeOpacity="0.4" strokeWidth="0.8" fill="none" style={{ "--dur": "13s", "--del": "16s" } as React.CSSProperties} />
      <path className="beam" d="M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587" stroke="#C4297D" strokeOpacity="0.45" strokeWidth="0.9" fill="none" style={{ "--dur": "10s", "--del": "4s" } as React.CSSProperties} />
      <path className="beam" d="M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563" stroke="#4a6cf7" strokeOpacity="0.35" strokeWidth="0.7" fill="none" style={{ "--dur": "9s", "--del": "19s" } as React.CSSProperties} />
      <path className="beam" d="M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539" stroke="#6ABF4B" strokeOpacity="0.45" strokeWidth="0.9" fill="none" style={{ "--dur": "12s", "--del": "8s" } as React.CSSProperties} />
      <path className="beam" d="M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515" stroke="#C4297D" strokeOpacity="0.4" strokeWidth="0.8" fill="none" style={{ "--dur": "14s", "--del": "13s" } as React.CSSProperties} />
      <path className="beam" d="M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491" stroke="#4a6cf7" strokeOpacity="0.4" strokeWidth="0.8" fill="none" style={{ "--dur": "8s", "--del": "24s" } as React.CSSProperties} />
      <path className="beam" d="M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483" stroke="#6ABF4B" strokeOpacity="0.5" strokeWidth="1.2" fill="none" style={{ "--dur": "11s", "--del": "2s" } as React.CSSProperties} />
      <defs>
        <radialGradient id="beams-radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(352 34) rotate(90) scale(555 1560)">
          <stop offset="0.067" stopColor="rgba(200,210,255,0.4)" />
          <stop offset="0.243" stopColor="rgba(200,210,255,0.3)" />
          <stop offset="0.436" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
