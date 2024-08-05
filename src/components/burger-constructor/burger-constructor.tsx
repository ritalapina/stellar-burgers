import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { selectCartItems, selectLoading } from '../../slices/burgerSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { sendOrder } from '../../slices/burgerSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const loading = useSelector(selectLoading);
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const { bun, ingredients } = useMemo(() => {
    const foundBun = cartItems.find((item) => item.type === 'bun');
    const otherIngredients = cartItems.filter((item) => item.type !== 'bun');
    return {
      bun: foundBun ? { ...foundBun, id: foundBun._id } : null,
      ingredients: otherIngredients
    };
  }, [cartItems]);

  const onOrderClick = () => {
    if (!bun || !ingredients.length) return;
    if (!user) return navigate('/login');

    const ingredientIds = [bun.id, ...ingredients.map((item) => item._id)];
    dispatch(sendOrder(ingredientIds))
      .unwrap()
      .then((response) => setOrderModalData(response.order))
      .catch((err) => console.error('Ошибка при оформлении заказа:', err));
  };

  const closeOrderModal = () => setOrderModalData(null);

  const price = useMemo(
    () => (bun ? bun.price * 2 : 0) + ingredients.reduce((total, { price }) => total + price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={loading}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};