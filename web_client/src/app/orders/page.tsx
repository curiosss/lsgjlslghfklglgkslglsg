'use client';

import { useState } from 'react';
import { ClipboardList, Search } from 'lucide-react';
import { useTr } from '@/i18n';
import { useOrdersByPhone } from '@/hooks/queries/use-orders';
import { formatPrice, formatDateTime } from '@/lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';

export default function OrderHistoryPage() {
  const t = useTr();
  const [phone, setPhone] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('order-phone') || '' : ''
  );
  const [searchPhone, setSearchPhone] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useOrdersByPhone(searchPhone);
  const orders = data?.data ?? [];
  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;
  const statuses = ['', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const handleSearch = () => {
    if (!phone.trim()) return;
    if (typeof window !== 'undefined') localStorage.setItem('order-phone', phone);
    setSearchPhone(phone.trim());
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">{t('order_history')}</h1>

      <div className="mb-5 flex gap-2">
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('enter_phone')}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading} size="icon">
          <Search size={18} strokeWidth={1.5} />
        </Button>
      </div>

      {searchPhone && (
        <>
          <div className="mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
            {statuses.map((s) => (
              <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s ? (ORDER_STATUS_LABELS[s] || s) : t('all')}
              </Chip>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<ClipboardList size={48} strokeWidth={1} />} title={t('no_orders')} />
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">#{order.order_number}</span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: ORDER_STATUS_COLORS[order.status] || '#999' }}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatDateTime(order.created_at)}</span>
                    <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
