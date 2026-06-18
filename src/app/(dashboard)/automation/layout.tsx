import { PageTabsNav } from "@/components/layout/page-tabs-nav";
import { automationTabGroup } from "@/config/page-tabs";

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageTabsNav
        tabs={automationTabGroup.tabs}
        className="-mx-4 px-4"
        equalWidth
      />
      {children}
    </div>
  );
}
