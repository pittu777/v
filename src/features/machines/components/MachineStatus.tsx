type MachineStatusProps = { status: string };

export function MachineStatus({ status }: MachineStatusProps) {
  const isActive = status === "ACTIVE";
  const label = status.replaceAll("_", " ").toLowerCase();

  return (
    <span
      className={
        isActive
          ? "inline-flex w-fit items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium capitalize text-success"
          : "inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground"
      }
    >
      <span
        aria-hidden="true"
        className={isActive ? "size-1.5 rounded-full bg-success" : "size-1.5 rounded-full bg-muted-foreground/60"}
      />
      {label}
    </span>
  );
}
