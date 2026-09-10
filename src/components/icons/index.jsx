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
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  Gem,
  Shirt,
  Cpu,
  Watch,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const withDefaults = (LucideIcon) => {
  const Wrapped = ({ size = 20, strokeWidth = 1.75, ...props }) => (
    <LucideIcon size={size} strokeWidth={strokeWidth} {...props} />
  );
  Wrapped.displayName = `Icon(${LucideIcon.name || LucideIcon.displayName || "Component"})`;
  return Wrapped;
};

const withSocialDefaults = (ReactIcon) => {
  const Wrapped = ({ size = 20, ...props }) => (
    <ReactIcon size={size} {...props} />
  );
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
export const TruckIcon = withDefaults(Truck);
export const ShieldIcon = withDefaults(ShieldCheck);
export const ReturnIcon = withDefaults(RotateCcw);
export const SupportIcon = withDefaults(Headset);
export const GemIcon = withDefaults(Gem);
export const ShirtIcon = withDefaults(Shirt);
export const ElectronicsIcon = withDefaults(Cpu);
export const WatchIcon = withDefaults(Watch);
export const SparklesIcon = withDefaults(Sparkles);
export const FacebookIcon = withSocialDefaults(FaFacebookF);
export const InstagramIcon = withSocialDefaults(FaInstagram);
export const YoutubeIcon = withSocialDefaults(FaYoutube);
export const TwitterIcon = withSocialDefaults(FaXTwitter);

export const categoryIconMap = {
  electronics: ElectronicsIcon,
  jewelery: GemIcon,
  "men's clothing": ShirtIcon,
  "women's clothing": ShirtIcon,
};
export const getCategoryIcon = (name) => categoryIconMap[name] || SparklesIcon;

export const categoryBadgeColors = [
  "bg-emerald-50 text-green border border-emerald-100",
  "bg-amber-50 text-gold border border-amber-100",
  "bg-sky-50 text-sky-700 border border-sky-100",
  "bg-rose-50 text-rose-700 border border-rose-100",
  "bg-indigo-50 text-indigo-700 border border-indigo-100",
];
