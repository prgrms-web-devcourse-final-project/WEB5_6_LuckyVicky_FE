// stores/orderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  brand: string;
  name: string;
  option: string;
  price: number;
  quantity: number;
  image: string;
  isChecked: boolean;
  isRegular: boolean;
}

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  detailAddress: string;
  zipCode: string;
}

interface OrderState {
  // 장바구니 상태
  cartItems: CartItem[];

  // 배송 정보
  shippingInfo: ShippingInfo | null;

  // 결제 정보
  paymentMethod: 'card' | 'bank' | 'kakao' | null;

  // 주문 완료 정보
  orderId: string | null;

  // Actions
  updateCartItem: (id: number, updates: Partial<CartItem>) => void;
  removeCartItem: (id: number) => void;
  toggleCartItem: (id: number) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentMethod: (method: 'card' | 'bank' | 'kakao' | null) => void;
  completeOrder: (orderId: string) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      shippingInfo: null,
      paymentMethod: null,
      orderId: null,

      updateCartItem: (id, updates) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        })),

      removeCartItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      toggleCartItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, isChecked: !item.isChecked } : item,
          ),
        })),

      setShippingInfo: (info) => set({ shippingInfo: info }),
      setPaymentMethod: (method: 'card' | 'bank' | 'kakao' | null) =>
        set({ paymentMethod: method }),
      completeOrder: (orderId) => set({ orderId }),
      clearOrder: () =>
        set({
          cartItems: [],
          shippingInfo: null,
          paymentMethod: null,
          orderId: null,
        }),
    }),
    {
      name: 'order-storage', // localStorage 키
      partialize: (state) => ({
        cartItems: state.cartItems,
        shippingInfo: state.shippingInfo,
      }), // 일부만 persist
    },
  ),
);
