type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps) {
  return <hr className={`w-full border-0 border-t border-border ${className ?? ""}`} aria-hidden="true" />;
}
