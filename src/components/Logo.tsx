export function Logo({ size, inline = false }: { size: number; inline?: boolean }) {
  return (
    <div className={`logo${inline ? ' inline' : ''}`} style={{ fontSize: size }} aria-label="Myth or Fact">
      <span className="logo-myth">MYTH</span>
      <span className="logo-or">OR</span>
      <span className="logo-fact">FACT</span>
    </div>
  );
}
