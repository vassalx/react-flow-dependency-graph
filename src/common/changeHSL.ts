const changeHSL = (
  hslString: string,
  { h, s, l }: { h?: number; s: number; l: number }
) => {
  const match = hslString.match(
    /hsl\(\s*([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?\s*\)/i
  );
  if (!match) return hslString;

  let [, hue, sat, light] = match.map(Number);

  // Update only provided values
  if (h !== undefined) hue = ((h % 360) + 360) % 360; // wrap-around
  if (s !== undefined) sat = Math.min(Math.max(s, 0), 100);
  if (l !== undefined) light = Math.min(Math.max(l, 0), 100);

  return `hsl(${hue}, ${sat}%, ${light}%)`;
};

export default changeHSL;
