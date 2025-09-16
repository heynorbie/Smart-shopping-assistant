import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import MNIST from "./pages/MNIST";
import ShoppingChat from "./pages/ShoppingChat";
import NotFound from "./pages/NotFound";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    page: <Index />,
  },
  {
    title: "Shopping Chat", 
    to: "/shopping-chat",
    page: <ShoppingChat />,
  },
  {
    title: "Analytics",
    to: "/analytics", 
    page: <Analytics />,
  },
  {
    title: "MNIST",
    to: "/mnist",
    page: <MNIST />,
  },
  {
    title: "Not Found",
    to: "*",
    page: <NotFound />,
  },
];