"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Settings({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems = [
    { name: "General", href: "/settings" },
    { name: "API Keys", href: "/settings/apikeys" },
    { name: "Integrations", href: "/settings/integrations" },
    { name: "Support", href: "/settings/support" },
    { name: "Organizations", href: "/settings/organizations" },
    { name: "Advanced", href: "/settings/advanced" },
  ];

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
}
