import { ICON_COLORS, PIXEL_ICONS, type PixelIconName } from '@/lib/pixel-icons';

/** A 16 x 16 pixel-art icon from the archivo.exe set, drawn as crisp rects. */
export function PixelIcon({ name, size = 16 }: { name: PixelIconName; size?: number }) {
  return (
    <svg className="px-icon" width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      {PIXEL_ICONS[name].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={ICON_COLORS[c]} />)}
    </svg>
  );
}
