import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useActiveCart } from "../cart/hooks/useCartQueries";
import { useCheckout } from "./hooks/useCheckout";
import { checkoutSchema } from "../../schemas/checkoutSchema";

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
  } = useForm({ resolver: zodResolver(checkoutSchema) });

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
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
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
    return <div>Giỏ hàng trống, không thể thanh toán.</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Thông tin giao hàng</h1>
        <div>
          <input {...register("fullName")} placeholder="Họ và tên" />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>
        <div>
          <input {...register("phone")} placeholder="Số điện thoại" />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>
        <div>
          <textarea
            {...register("address")}
            placeholder="Địa chỉ nhận hàng"
            rows={3}
          />
          {errors.address && <p>{errors.address.message}</p>}
        </div>
        <div>
          <label>
            <input type="radio" value="cod" {...register("paymentMethod")} />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label>
            <input
              type="radio"
              value="bank_transfer"
              {...register("paymentMethod")}
            />
            Chuyển khoản ngân hàng
          </label>
          {errors.paymentMethod && <p>{errors.paymentMethod.message}</p>}
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>
      </form>

      <div>
        <h2>Đơn hàng của bạn</h2>
        {items.map((i) => (
          <div key={i.productId}>
            <span>
              {i.product?.title} × {i.quantity}
            </span>
            <span>${(i.product?.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div>
          <div>
            <span>Tạm tính</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {voucher && (
            <div>
              <span>Giảm giá</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div>
            <span>Tổng cộng</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
