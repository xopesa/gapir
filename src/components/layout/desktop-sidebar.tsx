import { Brand } from "./brand";
import { DesktopNavigation } from "./navigation";

export function DesktopSidebar() {
  return (
    <aside className="desktop-sidebar">
      <Brand />
      <DesktopNavigation />
      <div className="sidebar-quote">
        <span>Слово дня</span>
        <strong>Bugun</strong>
        <p>сегодня</p>
      </div>
    </aside>
  );
}
