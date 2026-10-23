// Left menu shared by both dashboards. Clicking an item shows that section.
export default function Sidebar({ title, items, active, onChange }) {
  return (
    <aside className="w-full shrink-0 rounded-2xl bg-white p-3 shadow-sm lg:w-56">
      <p className="px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">{title}</p>
      <nav className="mt-1 flex gap-1 overflow-x-auto lg:flex-col">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-lg px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition ${
              active === item.id
                ? 'bg-[#2F6FED] text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
