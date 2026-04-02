export default function PageHeader({ title, rightSlot }) {
  return (
    <header className="z-10 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-10 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
}
