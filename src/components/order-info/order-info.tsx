import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { selectOrders, fetchOrders } from '../../slices/ordersSlice';
import { fetchFeed, selectFeed, selectLoading } from '../../slices/feedSlice';

export const OrderInfo: FC = () => {
const dispatch = useDispatch();
const { number } = useParams<{ number: string }>();
const ingredients = useSelector(selectIngredients);
const feed = useSelector(selectFeed);
const orders = useSelector(selectOrders);
const loading = useSelector(selectLoading);
const location = useLocation();

const comesFromProfile = location.pathname.startsWith('/profile');
const comesFromFeed = location.pathname.startsWith('/feed');

// Выполняем запрос на получение заказов или ленты в зависимости от источника
useEffect(() => {

if (comesFromFeed) {
dispatch(fetchFeed()); // Получаем ленту, если пришли из страницы ленты

} else if (comesFromProfile) {
dispatch(fetchOrders()); // Получаем заказы, если пришли из профиля

}
}, [dispatch, comesFromFeed, comesFromProfile]);

// Находим заказ по номеру, который получаем из параметров URL
const order = (comesFromFeed ? feed.orders : orders).find(i => i.number === Number(number));

const orderData = order ? { ...order } : null;

// Подготавливаем данные для отображения
const orderInfo = useMemo(() => {
if (!orderData || !ingredients.length) return null;

const date = new Date(orderData.createdAt);
const ingredientsInfo = orderData.ingredients.reduce((acc: Record<string, TIngredient & { count: number }>, item) => {
const ingredient = ingredients.find(ing => ing._id === item);
if (ingredient) {
acc[item] = (acc[item] || { ...ingredient, count: 0 });
acc[item].count += 1;
}
return acc;
}, {});

const total = Object.values(ingredientsInfo).reduce((acc, { price, count }) => acc + price * count, 0);

return { ...orderData, ingredientsInfo, date, total };
}, [orderData, ingredients]);

// Если данные загружаются, показываем прелоадер
if (loading) return <Preloader />;
// Если информации о заказе нет, возвращаем null
if (!orderInfo) return null;

// Возвращаем компонент с подготовленной информацией о заказе
return <OrderInfoUI orderInfo={orderInfo} />;
};