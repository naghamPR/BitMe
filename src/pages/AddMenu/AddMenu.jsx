import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../../actions/menusActions";
import { addMenuItem } from "../../actions/menusActions";
import { useNavigate } from "react-router-dom";

const AddMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { menus } = useSelector((state) => state.menus);
  console.log("Menus loaded:", menus);
  const { restaurants } = useSelector((state) => state.restaurants);

  const [restaurantId, setRestaurantId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "food",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchMenus(restaurantId));
    }
  }, [restaurantId, dispatch]);

  useEffect(() => {
    if (menus.length > 0) {
      setMenuId("");
    }
  }, [menus]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuId) return alert("Please select a menu");

    await dispatch(addMenuItem({ ...form, menu_id: menuId }));
    alert("Item added!");
    navigate("");
  };

  return (
    <div>
      <h2>Add Item to Menu</h2>

      <label>Restaurant:</label>
      <select
        onChange={(e) => setRestaurantId(e.target.value)}
        value={restaurantId}
      >
        <option value="">Select</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      {menus.length > 0 && (
        <>
          <label>Menu:</label>
          <select value={menuId} onChange={(e) => setMenuId(e.target.value)}>
            <option value="">Select Menu</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="dessert">Dessert</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddMenu;
