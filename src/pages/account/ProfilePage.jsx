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
  "w-full text-xs text-ink rounded border border-line focus:border-green focus:ring-1 focus:ring-green px-3.5 py-3 outline-none";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-2">
            Họ <span className="text-rust">*</span>
          </label>
          <input {...register("name.firstname")} className={inputClass} />
          {errors.name?.firstname && (
            <p className="text-rust text-xs mt-1">
              {errors.name.firstname.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink/70 mb-2">
            Tên <span className="text-rust">*</span>
          </label>
          <input {...register("name.lastname")} className={inputClass} />
          {errors.name?.lastname && (
            <p className="text-rust text-xs mt-1">
              {errors.name.lastname.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Email <span className="text-rust">*</span>
        </label>
        <input {...register("email")} className={inputClass} />
        {errors.email && (
          <p className="text-rust text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Số điện thoại{" "}
          <span className="text-ink/40 font-normal">(Không bắt buộc)</span>
        </label>
        <input {...register("phone")} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary px-9 disabled:opacity-50"
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
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Thành phố <span className="text-rust">*</span>
        </label>
        <input {...register("city")} className={inputClass} />
        {errors.city && (
          <p className="text-rust text-xs mt-1">{errors.city.message}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Địa chỉ <span className="text-rust">*</span>
        </label>
        <input {...register("street")} className={inputClass} />
        {errors.street && (
          <p className="text-rust text-xs mt-1">{errors.street.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary px-9 disabled:opacity-50"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-sm">
      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Mật khẩu hiện tại <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("currentPassword")}
          className={inputClass}
        />
        {errors.currentPassword && (
          <p className="text-rust text-xs mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Mật khẩu mới <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("newPassword")}
          className={inputClass}
        />
        {errors.newPassword && (
          <p className="text-rust text-xs mt-1">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink/70 mb-2">
          Nhập lại mật khẩu mới <span className="text-rust">*</span>
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className={inputClass}
        />
        {errors.confirmPassword && (
          <p className="text-rust text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary px-9 disabled:opacity-50"
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
    <div className="max-w-6xl mx-auto px-6 py-6">
      <Breadcrumb items={[{ label: "Tài khoản" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 bg-white rounded-lg border border-line p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-paper border border-line flex items-center justify-center mb-4">
              <UserIcon size={36} className="text-ink/30" />
            </div>
            <h2 className="text-lg font-display font-bold text-ink">
              {profile.name?.firstname} {profile.name?.lastname}
            </h2>
            <p className="text-xs text-ink/40 mt-1">{profile.email}</p>
          </div>

          <nav className="space-y-2.5 text-xs font-medium">
            {TABS.map((tab) =>
              tab.isLink ? (
                <Link
                  key={tab.key}
                  to={tab.to}
                  className="flex items-center justify-between px-4 py-3.5 rounded border border-line text-ink/70 hover:border-green hover:text-green transition"
                >
                  <span>{tab.label}</span>
                  <ChevronRightIcon size={14} className="text-ink/30" />
                </Link>
              ) : (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded transition ${
                    activeTab === tab.key
                      ? "bg-green text-white font-semibold shadow-sm"
                      : "border border-line text-ink/70 hover:border-green hover:text-green"
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronRightIcon
                    size={14}
                    className={
                      activeTab === tab.key ? "text-white/70" : "text-ink/30"
                    }
                  />
                </button>
              ),
            )}
          </nav>
        </aside>
        <section className="lg:col-span-8 bg-white rounded-lg border border-line p-8">
          <h1 className="text-2xl font-display font-bold text-ink mb-8">
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
