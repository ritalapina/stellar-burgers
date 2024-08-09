import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed, selectLoading } from '../../slices/feedSlice';
import { Preloader } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders.filter((item) => item.status === status).map((item) => item.number).slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders } = useSelector(selectFeed);
  const loading = useSelector(selectLoading);

  if (loading) return <Preloader />;

  return (
    <FeedInfoUI
      readyOrders={getOrders(orders, 'done')}
      pendingOrders={getOrders(orders, 'pending')}
      feed={useSelector(selectFeed)}
    />
  );
};