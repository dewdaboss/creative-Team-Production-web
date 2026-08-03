/**
 * Backdrop — calm, static atmosphere (no animation): soft lime glows,
 * faint grid, vignette. Replaces the old animated 3D gear background.
 */
export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* soft lime glow top */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_620px_at_50%_-10%,rgba(180,248,50,0.13),transparent_65%)]" />
      {/* deep olive glow bottom-right */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_85%_110%,rgba(127,191,26,0.09),transparent_60%)]" />
      {/* faint grid */}
      <div className="absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,5,3,0.85)_100%)]" />
    </div>
  );
}
