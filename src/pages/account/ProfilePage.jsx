import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { useProfileQuery, useUpdateProfile } from "./hooks/useProfileQueries";
import { profileSchema } from "../../schemas/profileSchema";
import { LoadingState } from "../../components/StatusState";

export default function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useProfileQuery(authUser?.id);
  const { mutate: updateProfile, isPending } = useUpdateProfile(authUser?.id);

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

  if (isLoading || !profile) return <LoadingState />;

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-display font-bold text-ink mb-6">
        Tài khoản của tôi
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("name.firstname")}
              placeholder="Họ"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.name?.firstname && (
              <p className="text-rust text-xs mt-1">
                {errors.name.firstname.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("name.lastname")}
              placeholder="Tên"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.name?.lastname && (
              <p className="text-rust text-xs mt-1">
                {errors.name.lastname.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border border-line rounded-tag px-4 py-2.5"
          />
          {errors.email && (
            <p className="text-rust text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <input
          {...register("phone")}
          placeholder="Số điện thoại"
          className="w-full border border-line rounded-tag px-4 py-2.5"
        />
        <input
          {...register("address.city")}
          placeholder="Thành phố"
          className="w-full border border-line rounded-tag px-4 py-2.5"
        />
        <input
          {...register("address.street")}
          placeholder="Địa chỉ"
          className="w-full border border-line rounded-tag px-4 py-2.5"
        />

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
