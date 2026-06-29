export function DeliveryTicker() {
  return (
    <div className="overflow-hidden bg-[#ef4444] py-3">
      <div className="mx-auto flex max-w-[690px] gap-6 whitespace-nowrap px-8 text-[11px] font-semibold text-white max-sm:px-4">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index}>Fresh fast delivered</span>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#18181b] text-white">
      <div className="mx-auto grid max-w-[690px] grid-cols-[1.2fr_1fr_1fr_1fr] gap-8 px-8 py-10 max-sm:grid-cols-2 max-sm:px-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG logo from public assets. */}
            <img src="/nomnom-logo.svg" alt="NomNom" className="h-[26px] w-[32px]" />
            <div>
              <p className="text-[11px] font-bold">NomNom</p>
              <p className="text-[8px] text-white/50">Swift delivery</p>
            </div>
          </div>
        </div>
        <FooterColumn title="NomNom" items={["Home", "Contact us", "Delivery zone"]} />
        <FooterColumn title="Menu" items={["Appetizers", "Salads", "Pizzas", "Lunch"]} />
        <SocialColumn />
      </div>
      <div className="mx-auto max-w-[690px] border-t border-white/10 px-8 py-5 text-[8px] text-white/35 max-sm:px-4">
        Copy right 2026 Nomnom LLC. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[9px] font-semibold uppercase text-white/45">{title}</h3>
      <ul className="space-y-1.5 text-[9px] font-medium text-white/80">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SocialColumn() {
  return (
    <div>
      <h3 className="mb-3 text-[9px] font-semibold uppercase text-white/45">Follow us</h3>
      <div className="flex items-center gap-3">
        <a href="#" aria-label="Facebook" className="grid size-6 place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG social icon from public assets. */}
          <img src="/facebook-icon.svg" alt="" className="size-5" />
        </a>
        <a href="#" aria-label="Instagram" className="grid size-6 place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- Static SVG social icon from public assets. */}
          <img src="/instagram-icon.svg" alt="" className="size-6" />
        </a>
      </div>
    </div>
  );
}
