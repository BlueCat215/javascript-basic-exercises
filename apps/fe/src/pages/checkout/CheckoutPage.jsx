import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useActiveCart } from "../cart/hooks/useCartQueries";
import { useCheckout } from "./hooks/useCheckout";
import { checkoutSchema } from "../../schemas/checkoutSchema";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ShippingInfoForm } from "./components/ShippingInfoForm";
import { OrderSummary } from "./components/OrderSummary";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const voucher = location.state?.voucher || null;

  const { data: cart } = useActiveCart();
  const { mutate: checkout, isPending } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "VN", paymentMethod: "cod" },
  });

  const items = cart?.products || [];
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0,
  );
  const discount = voucher ? (subtotal * voucher.discountPercent) / 100 : 0;
  const total = subtotal - discount;

  const onSubmit = (formData) => {
    checkout(
      {
        shippingInfo: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          company: formData.company || undefined,
          country: formData.country,
          street: formData.street,
          streetOptional: formData.streetOptional || undefined,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
          email: formData.email,
          notes: formData.orderNotes || undefined,
        },
        paymentMethod: formData.paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success("Đặt hàng thành công!");
          navigate("/account/orders");
        },
        onError: () => toast.error("Đặt hàng thất bại, vui lòng thử lại"),
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-4">
        <p className="text-ink/60 font-medium">
          Giỏ hàng trống, không thể thanh toán.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="btn-primary uppercase text-xs tracking-wider font-bold px-8 py-3 rounded"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <Breadcrumb
        items={[{ to: "/cart", label: "Giỏ hàng" }, { label: "Thanh toán" }]}
      />
      <div className="bg-white rounded border border-line/80 shadow-sm p-6 sm:p-10">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wider mb-8 pb-4 border-b border-line">
          Thanh toán đơn hàng
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <ShippingInfoForm register={register} errors={errors} />
          <OrderSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            total={total}
            voucher={voucher}
            register={register}
            errors={errors}
            isPending={isPending}
          />
        </form>
      </div>
    </div>
  );
}
