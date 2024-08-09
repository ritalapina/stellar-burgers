import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeCartItem,
  moveCartItemUp,
  moveCartItemDown
} from '../../slices/burgerSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={() => dispatch(moveCartItemUp(ingredient.id))}
        handleMoveDown={() => dispatch(moveCartItemDown(ingredient.id))}
        handleClose={() => dispatch(removeCartItem(ingredient.id))}
      />
    );
  }
);