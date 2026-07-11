import { createBrowserRouter } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "./components";
import {
  Home,
  Login,
  Register,
  Error,
  Resturants,
  ResturantsDetails,
  Addresturant,
  Editeresturant,
  Deleteresturant,
  Reservation,
  Viewreservation,
  Managerhom,
  Stafhom,
  Favorite,
  Profile,
  Order,
  CalculateBill,
  SplitBill,
  AddOrder,
  EditOrder,
  DeleteOrder,
  AddOffer,
  EditOffer,
  DeleteOffer,
  AddMenu,
  EditMenu,
  DeleteMenu,
  Logout,
  Showresturant,
  ShowMenus,
  AddResMenu,
  AddTable,
} from "./pages";
import OfferList from "./components/OfferList/OfferList";
import OfferDetails from "./components/OfferDetails/OfferDetails";
import MyOrdersPage from "./components/MyOrdersPage/MyOrdersPage";
import RestaurantOrdersPage from "./components/RestaurantOrdersPage/RestaurantOrdersPage";
import AddReview from "./components/AddReview/AddReview";
import MyRatedRestaurantsPage from "./components/MyRatedRestaurantsPage/MyRatedRestaurantsPage";
import ManageRestaurantMenus from "./components/ManageRestaurantMenus/ManageRestaurantMenus";
import ReservationModal from "./components/ReservationModal/ReservationModal";
import UserReservations from "./components/UserReservations/UserReservations";
import RestaurantReservations from "./components/RestaurantReservations/RestaurantReservations";
import MyWaitlist from "./components/MyWaitlist/MyWaitlist";
import TopUpWallet from "./components/TopUpWallet/TopUpWallet";
import MyEventBookingsPage from "./components/MyEventBookingsPage/MyEventBookingsPage";
import RestaurantEvents from "./components/RestaurantEvents/RestaurantEvents";
import RestaurantProfile from "./components/RestaurantProfile/RestaurantProfile";
import RestaurantTables from "./components/RestaurantTables/RestaurantTables";
const ProtectedRoute = ({ user, children }) => {
  const isLoggedIn = true;
  return children;
};

const UnauthenticatedRoute = ({ user, children }) => {
  return children;
};

export const createRoutes = (user) =>
  createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        { path: "Resturants", element: <Resturants /> },
        { path: "restaurants/:id", element: <ResturantsDetails /> },
        // { path: "menu", element: <Menu /> },
        {
          path: "addresturant",
          element: (
            <ProtectedRoute user={user}>
              <Addresturant />
            </ProtectedRoute>
          ),
        },
        {
          path: "editeresturant",
          element: (
            <ProtectedRoute user={user}>
              <Editeresturant />
            </ProtectedRoute>
          ),
        },
        {
          path: "addreview",
          element: (
            <ProtectedRoute user={user}>
              <AddReview />
            </ProtectedRoute>
          ),
        },
        {
          path: "deleteresturant",
          element: (
            <ProtectedRoute user={user}>
              <Deleteresturant />
            </ProtectedRoute>
          ),
        },
        {
          path: "reservation",
          element: (
            <ProtectedRoute user={user}>
              <Reservation />
            </ProtectedRoute>
          ),
        },
        {
          path: "my-ratings",
          element: (
            <ProtectedRoute user={user}>
              <MyRatedRestaurantsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "viewreservation",
          element: (
            <ProtectedRoute user={user}>
              <Viewreservation />
            </ProtectedRoute>
          ),
        },
        {
          path: "Managerhom",
          element: (
            <ProtectedRoute user={user}>
              <Managerhom />
            </ProtectedRoute>
          ),
        },
        {
          path: "MyWaitlist",
          element: (
            <ProtectedRoute user={user}>
              <MyWaitlist />
            </ProtectedRoute>
          ),
        },
        {
          path: "TopUpWallet",
          element: (
            <ProtectedRoute user={user}>
              <TopUpWallet />
            </ProtectedRoute>
          ),
        },
        {
          path: "RestaurantProfile",
          element: (
            <ProtectedRoute user={user}>
              <RestaurantProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "RestaurantTables",
          element: (
            <ProtectedRoute user={user}>
              <RestaurantTables />
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-orders",
          element: (
            <ProtectedRoute user={user}>
              <MyOrdersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/RestaurantEvents",
          element: (
            <ProtectedRoute user={user}>
              <RestaurantEvents />
            </ProtectedRoute>
          ),
        },
        {
          path: "/MyEventBookings",
          element: (
            <ProtectedRoute user={user}>
              <MyEventBookingsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/restaurant-orders",
          element: (
            <ProtectedRoute user={user}>
              <RestaurantOrdersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "Stafhom",
          element: (
            <ProtectedRoute user={user}>
              <Stafhom />
            </ProtectedRoute>
          ),
        },
        {
          path: "offers",
          element: (
            <ProtectedRoute user={user}>
              <OfferList />
            </ProtectedRoute>
          ),
        },
        {
          path: "/manager-menus",
          element: (
            <ProtectedRoute user={user}>
              <ManageRestaurantMenus />
            </ProtectedRoute>
          ),
        },
        {
          path: "/offers/add",
          element: (
            <ProtectedRoute user={user}>
              <AddOffer />
            </ProtectedRoute>
          ),
        },
        {
          path: "/offers/:id",
          element: (
            <ProtectedRoute user={user}>
              <OfferDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "show",
          element: (
            <ProtectedRoute user={user}>
              <Showresturant />
            </ProtectedRoute>
          ),
        },
        {
          path: "addres",
          element: (
            <ProtectedRoute user={user}>
              <AddResMenu />
            </ProtectedRoute>
          ),
        },
        {
          path: "addtabel",
          element: (
            <ProtectedRoute user={user}>
              <AddTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "UserReservations",
          element: (
            <ProtectedRoute user={user}>
              <UserReservations />
            </ProtectedRoute>
          ),
        },
        {
          path: "RestaurantReservations",
          element: (
            <ProtectedRoute user={user}>
              <RestaurantReservations />
            </ProtectedRoute>
          ),
        },
        {
          path: "show-menus",
          element: (
            <ProtectedRoute user={user}>
              <ShowMenus />
            </ProtectedRoute>
          ),
        },
        {
          path: "favorite",
          element: (
            <ProtectedRoute user={user}>
              <Favorite />
            </ProtectedRoute>
          ),
        },
        { path: "profile", element: <Profile /> }, // Profile might handle its own auth
        {
          path: "order",
          element: (
            <ProtectedRoute user={user}>
              <Order />
            </ProtectedRoute>
          ),
        },
        {
          path: "calculate-bill",
          element: (
            <ProtectedRoute user={user}>
              <CalculateBill />
            </ProtectedRoute>
          ),
        },
        {
          path: "split-bill",
          element: (
            <ProtectedRoute user={user}>
              <SplitBill />
            </ProtectedRoute>
          ),
        },

        {
          path: "add-order",
          element: (
            <ProtectedRoute user={user}>
              <AddOrder />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-order/:orderId",
          element: (
            <ProtectedRoute user={user}>
              <EditOrder />
            </ProtectedRoute>
          ),
        },
        {
          path: "delete-order/:orderId",
          element: (
            <ProtectedRoute user={user}>
              <DeleteOrder />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-offer",
          element: (
            <ProtectedRoute user={user}>
              <AddOffer />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-offer/:offerId",
          element: (
            <ProtectedRoute user={user}>
              <EditOffer />
            </ProtectedRoute>
          ),
        },
        {
          path: "delete-offer/:offerId",
          element: (
            <ProtectedRoute user={user}>
              <DeleteOffer />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-menu",
          element: (
            <ProtectedRoute user={user}>
              <AddMenu />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-menu/:itemId",
          element: (
            <ProtectedRoute user={user}>
              <EditMenu />
            </ProtectedRoute>
          ),
        },
        {
          path: "delete-menu/:itemId",
          element: (
            <ProtectedRoute user={user}>
              <DeleteMenu />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <UnauthenticatedRoute user={user}>
          <Login />
        </UnauthenticatedRoute>
      ),
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/register",
      element: (
        <UnauthenticatedRoute user={user}>
          <Register />
        </UnauthenticatedRoute>
      ),
    },
  ]);
