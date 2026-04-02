export default function PageHeader({ title, leftSlot, rightSlot }) {
  return (
    <header className="z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-10 shadow-sm">
      <div className="flex items-center gap-3">
        {leftSlot}
        <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
}
