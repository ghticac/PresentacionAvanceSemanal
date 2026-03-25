"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { CardData, PresentationData } from "../types";
import CardDetail from "./CardDetail";
import { BeamsBackground } from "./CardDetail";
import { useSpotlight } from "../hooks/useSpotlight";

/* ─── Date helper ─── */
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
function getFormattedDate() {
  const d = new Date();
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/* ─── Card component ─── */
function Card({
  cardData,
  onClick,
}: {
  cardData: CardData;
  onClick: () => void;
}) {
  return (
    <div
      className={`card ${cardData.colorClass} card--expandable`}
      data-card-id={cardData.id}
      onClick={onClick}
    >
      <div className="card-border" />
      <div className="card-inner">
        <div className="card-spotlight" />
        <div className="card-header">
          <div className="icon-box">
            <svg
              viewBox={cardData.icon.viewBox}
              fill="none"
              stroke={cardData.strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {cardData.icon.paths?.map((d, i) => (
                <path key={i} d={d} />
              ))}
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
          <div className="card-title">{cardData.title}</div>
        </div>

        <div className="items">
          {cardData.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="item">
                <span className="num">{idx + 1}.</span>
                <span>{item.text}</span>
              </div>
              {item.subitems?.map((sub, si) => (
                <div key={si} className="item subitem">
                  <span className="bullet">•</span>
                  <span>{sub}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <button className="card-expand-btn" aria-label={`Ver detalle: ${cardData.title}`}>
          Ver todo ↗
        </button>
      </div>
    </div>
  );
}

/* ─── Main Presentation ─── */
export default function Presentation({ data }: { data: PresentationData }) {
  const [isDark, setIsDark] = useState(true);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [dateLabel, setDateLabel] = useState("");

  // Apply spotlight effect after render
  useSpotlight();

  useEffect(() => {
    setDateLabel(getFormattedDate());
    const saved = localStorage.getItem("theme") ?? "dark";
    setIsDark(saved === "dark");
  }, []);

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Keyboard navigation
  const CARD_ORDER = ["primary", "tertiary", "info", "amber"];
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeCard) {
        setActiveCard(null);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!activeCard) {
          setActiveCard(data.cards.find((c) => c.id === CARD_ORDER[0]) ?? null);
        } else {
          const idx = CARD_ORDER.indexOf(activeCard.id);
          const next = CARD_ORDER[(idx + 1) % CARD_ORDER.length];
          setActiveCard(data.cards.find((c) => c.id === next) ?? null);
        }
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!activeCard) {
          const last = CARD_ORDER[CARD_ORDER.length - 1];
          setActiveCard(data.cards.find((c) => c.id === last) ?? null);
        } else {
          const idx = CARD_ORDER.indexOf(activeCard.id);
          const prev = CARD_ORDER[(idx - 1 + CARD_ORDER.length) % CARD_ORDER.length];
          setActiveCard(data.cards.find((c) => c.id === prev) ?? null);
        }
      }
    },
    [activeCard, data.cards]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="slide">
      {/* Background Effects */}
      <div className="glow-1" />
      <div className="glow-2" />
      <div className="glow-3" />
      <div className="glow-4" />

      <BeamsBackground className="bg-beams" />

      {/* Main Content */}
      <div className="content">
        <header className="header">
          <div className="header-left">
            <div className="logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/LOGO-CAC-BLANCO.png" alt="CAC" className="header-logo" />
            </div>
            <div className="header-divider" aria-hidden="true" />
            <div>
              <div className="title">{data.metadata.title}</div>
            </div>
          </div>

          <div className="header-right">
            <button
              className="theme-toggle"
              id="theme-toggle"
              title="Cambiar modo"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? (
                /* Moon icon — shown when dark, click → light */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                /* Sun icon — shown when light, click → dark */
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2"  x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="2"  y1="12" x2="5"  y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>

            <div className="badge" aria-label={`Fecha: ${dateLabel}`}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>{dateLabel}</span>
            </div>
          </div>
        </header>

        {/* Cards Grid */}
        <main className="grid" aria-label="Avances por área">
          {data.cards.map((card) => (
            <Card key={card.id} cardData={card} onClick={() => setActiveCard(card)} />
          ))}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="footer-bar" aria-hidden="true">
        <div className="bar-1" />
        <div className="bar-2" />
        <div className="bar-3" />
      </footer>

      {/* Card Detail Overlay */}
      {activeCard && (
        <CardDetail
          cardData={activeCard}
          metadata={data.metadata}
          onClose={() => setActiveCard(null)}
        />
      )}
    </div>
  );
}
