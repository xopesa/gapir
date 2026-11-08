import { Brand } from "./brand";
import { DesktopNavigation } from "./navigation";
import type { AppDictionary, AppUser } from "@/src/types/app";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";

export function DesktopSidebar({ dictionary, user, aiFlags }: { dictionary: AppDictionary; user: AppUser; aiFlags: PublicAiFlags }) {
  return (
    <aside className="desktop-sidebar">
      <Brand />
      <DesktopNavigation dictionary={dictionary} user={user} aiFlags={aiFlags} />
      <div className="sidebar-quote">
        <span>{dictionary.learning.lesson}</span>
        <strong>Bugun</strong>
        <p>сегодня</p>
      </div>
    </aside>
  );
}
