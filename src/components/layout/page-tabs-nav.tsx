"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getActivePageTabHref,
  type PageTab,
} from "@/config/page-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PageTabsNavProps = {
  tabs: PageTab[];
  className?: string;
};

export function PageTabsNav({ tabs, className }: PageTabsNavProps) {
  const pathname = usePathname();
  const activeHref = getActivePageTabHref(pathname, tabs);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={cn("border-b border-border", className)}>
      <Tabs value={activeHref}>
        <TabsList variant="line" className="h-10 w-full justify-start rounded-none bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className="h-10 rounded-none px-4"
              render={<Link href={tab.href} aria-current={tab.href === activeHref ? "page" : undefined} />}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
