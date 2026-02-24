'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { useCartStore } from '@/store/cart';
import { useTr } from '@/i18n';
import { useDeliveryZones } from '@/hooks/queries/use-delivery-zones';
import { useTimeSlots } from '@/hooks/queries/use-time-slots';
import { useCreateOrder } from '@/hooks/queries/use-orders';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Chip } from '@/components/ui/chip';
import { CartSummary } from '@/components/cart/cart-summary';
import type { OrderType } from '@/types';

export default function CheckoutPage() {
  const t = useTr();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { data: zonesResp } = useDeliveryZones();
  const { data: slotsResp } = useTimeSlots();
  const createOrder = useCreateOrder();

  const [mounted, setMounted] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for localStorage state
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) { router.push('/cart'); return null; }

  const zones = zonesResp?.data ?? [];
  const slots = slotsResp?.data ?? [];
  const deliveryFee = orderType === 'delivery' && selectedZone ? zones.find(z => z.id === selectedZone)?.delivery_price ?? 0 : 0;
  const dates = Array.from({ length: 7 }, (_, i) => dayjs().add(i, 'day'));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = t('field_required');
    if (!form.phone.trim()) e.phone = t('field_required');
    if (orderType === 'delivery' && !form.address.trim()) e.address = t('field_required');
    if (!selectedSlot) e.slot = t('field_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createOrder.mutate({
      type: orderType,
      full_name: form.full_name,
      phone: form.phone,
      address: orderType === 'delivery' ? form.address : undefined,
      note: form.note || undefined,
      delivery_zone_id: orderType === 'delivery' ? selectedZone ?? undefined : undefined,
      delivery_date: selectedDate,
      time_slot: selectedSlot,
      items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
    }, {
      onSuccess: () => {
        clearCart();
        toast.success(t('order_success'));
        router.push('/orders');
      },
      onError: () => {
        toast.error(t('error_generic'));
      },
    });
  };

  return (
    <div>
      <button onClick={() => router.back()} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={18} strokeWidth={1.5} /> {t('order_checkout')}
      </button>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          {/* Order type */}
          <div>
            <label className="mb-2 block text-sm font-medium">{t('order_type')}</label>
            <div className="flex gap-2">
              <Chip active={orderType === 'delivery'} onClick={() => setOrderType('delivery')}>
                <Truck size={16} strokeWidth={1.5} className="mr-1" />{t('delivery')}
              </Chip>
              <Chip active={orderType === 'pickup'} onClick={() => setOrderType('pickup')}>
                <MapPin size={16} strokeWidth={1.5} className="mr-1" />{t('pickup')}
              </Chip>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium">{t('delivery_date')}</label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {dates.map((d) => (
                <Chip key={d.format('YYYY-MM-DD')} active={selectedDate === d.format('YYYY-MM-DD')} onClick={() => setSelectedDate(d.format('YYYY-MM-DD'))}>
                  {d.format('DD.MM')}
                </Chip>
              ))}
            </div>
          </div>

          {/* Time slot */}
          <div>
            <label className="mb-2 block text-sm font-medium">{t('time_slot')}</label>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <Chip key={s.id} active={selectedSlot === s.label} onClick={() => setSelectedSlot(s.label)}>{s.label}</Chip>
              ))}
            </div>
            {errors.slot && <span className="mt-1 text-xs text-destructive">{errors.slot}</span>}
          </div>

          {/* Delivery zone */}
          {orderType === 'delivery' && zones.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium">{t('delivery_zone')}</label>
              <div className="flex flex-col gap-2">
                {zones.map((z) => (
                  <Chip key={z.id} active={selectedZone === z.id} onClick={() => setSelectedZone(z.id)}>
                    {z.name} — {formatPrice(z.delivery_price)}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t('full_name')} *</label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={errors.full_name ? 'border-destructive' : ''} />
              {errors.full_name && <span className="text-xs text-destructive">{errors.full_name}</span>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t('phone')} *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+993..." className={errors.phone ? 'border-destructive' : ''} />
              {errors.phone && <span className="text-xs text-destructive">{errors.phone}</span>}
            </div>
            {orderType === 'delivery' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{t('address')} *</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={errors.address ? 'border-destructive' : ''} />
                {errors.address && <span className="text-xs text-destructive">{errors.address}</span>}
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{t('note')}</label>
              <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="min-h-[80px]" />
            </div>
          </div>

          {/* Mobile submit */}
          <div className="md:hidden">
            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={createOrder.isPending}>
              {t('place_order')}
            </Button>
          </div>
        </div>

        <CartSummary
          subtotal={totalPrice()}
          deliveryFee={deliveryFee}
          actionLabel={t('place_order')}
          onAction={handleSubmit}
          disabled={createOrder.isPending}
        />
      </div>
    </div>
  );
}
