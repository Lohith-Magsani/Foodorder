import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import { CartContext } from "../store/CartContext";

export default function MealItem({ meal }) {
  const { name, price, description, image } = meal;
  const cartCtx = useContext(CartContext);

  function handleAddMealToCart() {
    cartCtx.addItem({ ...meal, quantity: 1 }); // Add quantity explicitly if needed
  }

  return (
    <li className="meal-item">
      <article className="meal-item__content">
        <img
          src={image ? `http://localhost:3000/${image}` : "fallback-image.jpg"}
          alt={name}
          className="meal-item__image"
        />
        <div className="meal-item__details">
          <h3 className="meal-item__name">{name}</h3>
          <p className="meal-item__price">{currencyFormatter.format(price)}</p>
          <p className="meal-item__description">{description}</p>
        </div>
        <div className="meal-item__actions">
          <Button onClick={handleAddMealToCart}>Add to Cart</Button>
        </div>
      </article>
    </li>
  );
}
