import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "~/lib/nav-items";
import { cva } from "class-variance-authority";

const linkClasses = cva("flex flex-col items-center p-2", {
  variants: {
    active: {
      true: "text-blue-400",
      false: "hover:text-blue-400",
    },
  },
});

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 bg-neutral-900 text-white">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClasses({ active: pathname === item.href })}
          >
            <item.icon className="h-6 w-6" />
            <span className="mt-1 text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
