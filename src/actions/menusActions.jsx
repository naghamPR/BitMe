import axiosClient from "../../axios-client";

// export const fetchMenus = (restaurantId) => async (dispatch) => {
//   dispatch({ type: "FETCH_MENUS_START" });

//   try {
//     const menuRes = await axiosClient.get(`/menus/restaurant/${restaurantId}`);
//     const menus = menuRes.data.data;

//     const menusWithItems = await Promise.all(
//       menus.map(async (menu) => {
//         try {
//           const itemRes = await axiosClient.get(`/menuItems/menu/${menu.id}`);
//           return {
//             ...menu,
//             menu_items: itemRes.data.data || [],
//           };
//         } catch (err) {
//           console.error(`Item fetch failed for menu ${menu.id}:`, err);
//           return { ...menu, menu_items: [] };
//         }
//       })
//     );

//     dispatch({ type: "FETCH_MENUS_SUCCESS", payload: menusWithItems });
//   } catch (error) {
//     console.error("Failed to fetch menus:", error);
//     dispatch({ type: "FETCH_MENUS_FAIL", error });
//   }
// };


export const FETCH_MENUS_START = 'FETCH_MENUS_START';
export const FETCH_MENUS_SUCCESS = 'FETCH_MENUS_SUCCESS';
export const FETCH_MENUS_FAIL = 'FETCH_MENUS_FAIL';
export const ADD_MENU_SUCCESS = 'ADD_MENU_SUCCESS';
export const ADD_MENU_FAIL = 'ADD_MENU_FAIL';
export const DELETE_MENU_SUCCESS = 'DELETE_MENU_SUCCESS';
export const DELETE_MENU_FAIL = 'DELETE_MENU_FAIL';
export const UPDATE_MENU_SUCCESS = 'UPDATE_MENU_SUCCESS';
export const UPDATE_MENU_FAIL = 'UPDATE_MENU_FAIL';
export const ADD_MENU_ITEM_SUCCESS = 'ADD_MENU_ITEM_SUCCESS'; 


export const addMenus = (formData) => async (dispatch) => {
  dispatch({ type: "FETCH_MENUS_START" });

  try {
    const {data} = await axiosClient.post(`/menus`,formData);
    console.log(data.data);
    dispatch({ type: "ADD_MENU_SUCCESS",data: data.data});
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    dispatch({ type: "ADD_MENU_FAIL", error });
  }
};


export const fetchMenus = (restaurantId) => async (dispatch) => {
  dispatch({ type: "FETCH_MENUS_START" });
  try {
    const { data } = await axiosClient.get(`/menus/restaurant/${restaurantId}`);
    
    dispatch({ type: "FETCH_MENUS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "FETCH_MENUS_FAIL", error });
  }
};


export const updateMenu = (menuId, formData) => async (dispatch) => {
  dispatch({ type: "UPDATE_MENU_START" });
  try {
    const { data } = await axiosClient.post(`/menus/update/${menuId}`, formData);
    dispatch({ type: "UPDATE_MENU_SUCCESS", payload: data.data });
    return data;
  } catch (error) {
    dispatch({ type: "UPDATE_MENU_FAIL", error });
    throw error;
  }
};

export const deleteMenu = (menuId) => async (dispatch) => {
  dispatch({ type: "DELETE_MENU_START" });
  try {
    await axiosClient.post(`/menus/delete/${menuId}`);
    dispatch({ type: "DELETE_MENU_SUCCESS", payload: menuId });
  } catch (error) {
    dispatch({ type: "DELETE_MENU_FAIL", error });
  }
};

export const addMenuItem = (formData) => async (dispatch) => {
  dispatch({ type: "ADD_MENU_ITEM_START" });
  try {
    const { data } = await axiosClient.post(`/menuItems/store`, formData);
    dispatch({ type: "ADD_MENU_ITEM_SUCCESS", payload: data.data });
    return data;
  } catch (error) {
    dispatch({ type: "ADD_MENU_ITEM_FAIL", error });
    throw error;
  }
};

export const updateMenuItem = (itemId, formData) => async (dispatch) => {
  dispatch({ type: "UPDATE_MENU_ITEM_START" });
  try {
    const { data } = await axiosClient.post(
      `/menuItems/update/${itemId}`,
      formData
    );
    dispatch({ type: "UPDATE_MENU_ITEM_SUCCESS", payload: data.data });
    return data;
  } catch (error) {
    dispatch({ type: "UPDATE_MENU_ITEM_FAIL", error });
    throw error;
  }
};

export const deleteMenuItem = (itemId) => async (dispatch) => {
  dispatch({ type: "DELETE_MENU_ITEM_START" });
  try {
    await axiosClient.post(`/menuItems/delete/${itemId}`);
    dispatch({ type: "DELETE_MENU_ITEM_SUCCESS", payload: itemId });
  } catch (error) {
    dispatch({ type: "DELETE_MENU_ITEM_FAIL", error });
    throw error;
  }
};
