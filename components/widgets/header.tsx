import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { useTranslations } from "next-intl";

export const Header = () => {
  const t = useTranslations("header");
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/home" className="text-xl font-bold">
          {t("brand")}
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link
                href="/"
                className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                {t("home")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/create-tasks"
                className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                {t("createTasks")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/parent-tasks"
                className="hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                {t("parentTasks")}
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
