import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../../actions/menusActions";
import '../Showresturant/ShowRestaurant.css'
const ShowMenus = () => {
  const dispatch = useDispatch();
  const { selectedRestaurantId, restaurants } = useSelector(
    (state) => state.restaurants
  );
  const { menus, loading, error } = useSelector((state) => state.menus);

  const restaurantId = selectedRestaurantId;
  const selectedRestaurant = restaurants.find((r) => r.id === restaurantId);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchMenus(restaurantId));
      console.log("Menus updated:", menus);
    }
  }, [restaurantId, dispatch, menus]);

  if (loading) return <div>Loading menus...</div>;
  if (error) return <div>Error: {error.message || "Something went wrong"}</div>;

  return (
    <div>
      <h1>Menus for: {selectedRestaurant?.name || "Restaurant"}</h1>

      {menus.length > 0 ? (
        menus.map((menu) => (
          <div
            key={menu.id}
            style={{
              marginBottom: "20px",
              border: "1px solid gray",
              padding: "10px",
            }}
          >
            <h2>{menu.name}</h2>
            <p>{menu.description}</p>

            {menu.menu_items?.length > 0 ? (
              <ul>
                {menu.menu_items.map((item) => (
                  <li key={item.id}>
                    {item.name} - ${item.price}
                    <br />
                    <small>{item.description}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in this menu.</p>
            )}
          </div>
        ))
      ) : (
        <p>No menus found.</p>
      )}
    </div>
  );
};

export default ShowMenus;
