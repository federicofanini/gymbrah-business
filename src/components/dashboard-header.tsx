"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: `/${segment}`,
    }));

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => (
              <BreadcrumbItem key={`${segment.href}-${index}`}>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={segment.href}>
                      {segment.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
