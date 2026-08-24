"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

/**
 * next/image plus a shimmer placeholder that holds the box until the bitmap
 * lands, so the card row fades up instead of popping in one file at a time.
 * The skeleton is absolutely positioned, so it reserves no space of its own
 * and adds nothing to CLS — the parent already fixes the aspect ratio.
 */
export function SmartImage({ className = "", alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  /* A cached image can finish before React attaches onLoad, which would leave
     the shimmer sitting on top forever — catch that on the ref instead. */
  const onRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <>
      <span aria-hidden="true" className={`img-skeleton${loaded ? " is-loaded" : ""}`} />
      <Image
        {...props}
        alt={alt}
        ref={onRef}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`img-fade${loaded ? " is-loaded" : ""} ${className}`}
      />
    </>
  );
}
