interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-in fade-in duration-300">
      <div className="text-muted-foreground">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
