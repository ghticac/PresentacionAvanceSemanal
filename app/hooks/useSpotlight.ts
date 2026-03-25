"use client";

import { useEffect } from "react";

export function useSpotlight() {
  useEffect(() => {
    const spotlightColors: Record<string, string> = {
      "c-primary": "rgba(74, 108, 247, 0.08)",
      "c-tertiary": "rgba(106, 191, 75, 0.08)",
      "c-info": "rgba(196, 41, 125, 0.08)",
      "c-amber": "rgba(245, 166, 35, 0.08)",
    };

    function getColorClass(el: Element): string {
      return (
        Array.from(el.classList).find((c) => c.startsWith("c-")) || "c-primary"
      );
    }

    function attachSpotlights() {
      document.querySelectorAll(".card").forEach((card) => {
        const colorKey = getColorClass(card);
        const color = spotlightColors[colorKey] || "rgba(255,255,255,0.06)";
        const spotlight = card.querySelector<HTMLElement>(".card-spotlight");
        if (!spotlight) return;

        const onMove = (e: Event) => {
          const me = e as MouseEvent;
          const rect = card.getBoundingClientRect();
          const x = me.clientX - rect.left;
          const y = me.clientY - rect.top;
          spotlight.style.background = `radial-gradient(circle 130px at ${x}px ${y}px, ${color} 0%, transparent 70%)`;
        };
        const onLeave = () => {
          spotlight.style.background = "none";
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    }

    attachSpotlights();
  }, []);
}
