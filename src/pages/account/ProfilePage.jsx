import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import {
  useProfileQuery,
  useUpdateProfile,
  useChangePassword,
} from "./hooks/useProfileQueries";
import {
  profileSchema,
  addressSchema,
  changePasswordSchema,
} from "../../schemas/profileSchema";
import { LoadingState } from "../../components/StatusState";
import { Breadcrumb } from "../../components/Breadcrumb";
import { UserIcon, ChevronRightIcon } from "../../components/icons";

const inputClass =
  "w-full text-sm text-ink rounded border border-line focus:border-ink px-4 py-3 outline-none transition-colors";

const TABS = [
  { key: "info", label: "Thông tin tài khoản" },
  { key: "order", label: "Đơn hàng", isLink: true, to: "/account/orders" },
  { key: "address", label: "Địa chỉ giao hàng" },
  { key: "password", label: "Đổi mật khẩu" },
];

function AccountInfoForm({ profile, userId }) {
  const { mutate: updateProfile, isPending } = useUpdateProfile(userId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  const onSubmit = (data) => {
    updateProfile(data, {
      onSuccess: () => toast.success("Cập nhật thành công"),
      onError: () => toast.error("Cập nhật thất bại"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
            Họ <span className="text-rust">*</span>
          </label>
          <input {...register("name.firstname")} className={inputClass} />
          {errors.name?.firstname && (
            <p className="text-rust text-xs mt-1.5">
              {errors.name.firstname.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
            Tên <span className="text-rust">*</span>
          </label>
          <input {...register("name.lastname")} className={inputClass} />
          {errors.name?.lastname && (
            <p className="text-rust text-xs mt-1.5">
              {errors.name.lastname.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Email <span className="text-rust">*</span>
        </label>
        <input {...register("email")} className={inputClass} />
        {errors.email && (
          <p className="text-rust text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Số điện thoại{" "}
          <span className="text-ink/40 font-normal normal-case">
            (Không bắt buộc)
          </span>
        </label>
        <input {...register("phone")} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full sm:w-auto px-10 rounded text-sm uppercase tracking-wider font-bold disabled:opacity-50"
      >
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}

function AddressForm({ profile, userId }) {
  const { mutate: updateProfile, isPending } = useUpdateProfile(userId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    if (profile?.address) reset(profile.address);
  }, [profile, reset]);

  const onSubmit = (data) => {
    updateProfile(
      { address: data },
      {
        onSuccess: () => toast.success("Cập nhật địa chỉ thành công"),
        onError: () => toast.error("Cập nhật thất bại"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Thành phố <span className="text-rust">*</span>
        </label>
        <input {...register("city")} className={inputClass} />
        {errors.city && (
          <p className="text-rust text-xs mt-1.5">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Địa chỉ chi tiết <span className="text-rust">*</span>
        </label>
        <input {...register("street")} className={inputClass} />
        {errors.street && (
          <p className="text-rust text-xs mt-1.5">{errors.street.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full sm:w-auto px-10 rounded text-sm uppercase tracking-wider font-bold disabled:opacity-50"
      >
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}

function ChangePasswordForm({ userId }) {
  const { mutate: changePassword, isPending } = useChangePassword(userId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (data) => {
    changePassword(data, {
      onSuccess: () => {
        toast.success("Đổi mật khẩu thành công");
        reset();
      },
      onError: (err) =>
        toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Mật khẩu hiện tại <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("currentPassword")}
          className={inputClass}
        />
        {errors.currentPassword && (
          <p className="text-rust text-xs mt-1.5">
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Mật khẩu mới <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("newPassword")}
          className={inputClass}
        />
        {errors.newPassword && (
          <p className="text-rust text-xs mt-1.5">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Nhập lại mật khẩu mới <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="text-rust text-xs mt-1.5">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full sm:w-auto px-10 rounded text-sm uppercase tracking-wider font-bold disabled:opacity-50"
      >
        {isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useProfileQuery(authUser?.id);
  const [activeTab, setActiveTab] = useState("info");

  if (isLoading || !profile) return <LoadingState />;

  const tabTitles = {
    info: "Thông tin tài khoản",
    address: "Địa chỉ giao hàng",
    password: "Đổi mật khẩu",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <Breadcrumb items={[{ label: "Tài khoản" }]} />

      {/* Thiết kế nguyên khối */}
      <div className="bg-white rounded border border-line shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-line bg-neutral-50/50 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded bg-white border border-line flex items-center justify-center mb-4">
              <UserIcon size={32} className="text-ink/50" />
            </div>
            <h2 className="text-lg font-display font-bold text-ink">
              {profile.name?.firstname} {profile.name?.lastname}
            </h2>
            <p className="text-xs text-ink/60 mt-1 truncate w-full">
              {profile.email}
            </p>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar md:space-y-1">
            {TABS.map((tab) =>
              tab.isLink ? (
                <Link
                  key={tab.key}
                  to={tab.to}
                  className="shrink-0  flex items-center justify-between px-4 py-3 rounded text-sm font-bold uppercase tracking-wider text-ink/60 hover:text-ink hover:bg-neutral-100 transition-colors"
                >
                  <span>{tab.label}</span>
                  <ChevronRightIcon
                    size={16}
                    className="hidden md:block opacity-50"
                  />
                </Link>
              ) : (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0  flex items-center justify-between px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab.key
                      ? "bg-ink text-white"
                      : "text-ink/60 hover:text-ink hover:bg-neutral-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronRightIcon
                    size={16}
                    className={`hidden md:block ${
                      activeTab === tab.key ? "opacity-100" : "opacity-50"
                    }`}
                  />
                </button>
              ),
            )}
          </nav>
        </aside>

        {/* Nội dung Form */}
        <section className="w-full md:w-2/3 lg:w-3/4 p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
          <h1 className="text-xl md:text-2xl font-display font-bold text-ink uppercase tracking-wider border-b border-line pb-4 mb-8">
            {tabTitles[activeTab]}
          </h1>
          {activeTab === "info" && (
            <AccountInfoForm profile={profile} userId={authUser?.id} />
          )}
          {activeTab === "address" && (
            <AddressForm profile={profile} userId={authUser?.id} />
          )}
          {activeTab === "password" && (
            <ChangePasswordForm userId={authUser?.id} />
          )}
        </section>
      </div>
    </div>
  );
}
