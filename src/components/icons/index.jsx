import {
  Heart,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Star,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  Phone,
} from "lucide-react";

const withDefaults = (LucideIcon) => {
  const Wrapped = ({ size = 20, strokeWidth = 1.75, ...props }) => (
    <LucideIcon size={size} strokeWidth={strokeWidth} {...props} />
  );
  Wrapped.displayName = `Icon(${LucideIcon.name || LucideIcon.displayName || "Component"})`;
  return Wrapped;
};

export const HeartIcon = withDefaults(Heart);
export const CartIcon = withDefaults(ShoppingCart);
export const SearchIcon = withDefaults(Search);
export const UserIcon = withDefaults(User);
export const LogOutIcon = withDefaults(LogOut);
export const MenuIcon = withDefaults(Menu);
export const CloseIcon = withDefaults(X);
export const StarIcon = withDefaults(Star);
export const PlusIcon = withDefaults(Plus);
export const MinusIcon = withDefaults(Minus);
export const ChevronLeftIcon = withDefaults(ChevronLeft);
export const ChevronRightIcon = withDefaults(ChevronRight);
export const TrashIcon = withDefaults(Trash2);
export const EditIcon = withDefaults(Pencil);
export const DashboardIcon = withDefaults(LayoutDashboard);
export const PackageIcon = withDefaults(Package);
export const UsersIcon = withDefaults(Users);
export const MapPinIcon = withDefaults(MapPin);
export const PhoneIcon = withDefaults(Phone);
