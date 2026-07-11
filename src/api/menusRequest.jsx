import axiosClient from "../../axios-client";
export const getMenusForRestaurant = (restaurantId) =>
  axiosClient.get(`/menus/restaurant/${restaurantId}`);
