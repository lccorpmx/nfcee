import type { CardVariant } from "./shmo-card";

/**
 * Real product photography for each card face.
 *
 * Set an entry to null to fall back to the built-in CSS/SVG recreation.
 * The artwork is square (2000×2000, transparent outside the rounded corners),
 * so <ShmoCard> switches its shell to a 1:1 box and drops its own white
 * background whenever an image is present — otherwise the shell would crop
 * the sides off and show white behind the transparent corners.
 */
export const CARD_ART: Partial<Record<CardVariant, string>> = {
  "google-click": "/cards/1.png",   // Google, blue
  "google-thanks": "/cards/2.png",  // Google, black
  instagram: "/cards/3.png",
  facebook: "/cards/4.png",
};
