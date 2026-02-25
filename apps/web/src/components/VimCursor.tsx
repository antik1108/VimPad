export default function VimCursor({
  color = "primary",
  variant = "block",
}: {
  color?: "primary" | "green";
  variant?: "block" | "bar";
}) {
  const bg = color === "green" ? "bg-syntax-green" : "bg-primary";
  const shape = variant === "bar" ? "w-[2px] h-[1.05em]" : "w-2 h-[1.2em]";

  return <span className={`inline-block ${shape} ${bg} align-middle cursor-blink`} />;
}
