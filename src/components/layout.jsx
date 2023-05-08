import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../core/protected-routes";
import LoginComponent from "./auth/login";
import LogoutComponent from "./auth/logout";
import RegisterComponent from "./auth/register";
import Header from "./header";
import AdminLayout from "./pages/admin/admin";
import AdminDashboardCards from "./pages/admin/adminDashboardCards";
import AdminViewBookings from "./pages/admin/bookings/bookings";
import AddShopFormComponent from "./pages/admin/Shop/addShopItem";
import AdminShopComponent from "./pages/admin/Shop/shop";
import AddTicketFormComponent from "./pages/admin/tickets/addTickets";
import AdminTicketsComponent from "./pages/admin/tickets/tickets";
import AdminViewUsersComponent from "./pages/admin/users/users";
import HomeComponent from "./pages/HomeComponent";
import NewsComponent from "./pages/news/news";
import ProfileComponent from "./pages/profile/profile";
import StripePayments from "./pages/stripe";
import ViewBookingComponent from "./pages/users/bookings/booking";
import CartComponent from "./pages/users/cart/cart";
import Checkout from "./pages/users/checkout/checkout";
import ShopComponent from "./pages/users/shop/shop";
import ShopItemDetailsComponent from "./pages/users/shop/shopItemDetails";
import TicketCardDerailsComponent from "./pages/users/tickets/ticketCardDetails";
import TicketsComponent from "./pages/users/tickets/tickets";

const LayoutComponent = () => {
  const [userRole, setRole] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [updateCart, setUpdateCart] = useState(false);

  function handleRoleChange(role) {
    setRole(role);
  }

  function handleOpenCart(cart) {
    setShowCart(cart);
  }

  function handleAddToCart(cart) {
    setUpdateCart(cart);
  }

  const MemoizedHeader = React.memo(Header);

  return (
    <div className="layout">
      <div>
        <MemoizedHeader data={userRole} onOpenCart={handleOpenCart} />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile/:id" element={<ProfileComponent />} />
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="tickets" element={<AdminTicketsComponent />} />
                    <Route
                      path="tickets/add"
                      element={<AddTicketFormComponent />}
                    />
                    <Route
                      path="tickets/edit/:id"
                      element={<AddTicketFormComponent />}
                    />
                    <Route path="bookings" element={<AdminViewBookings />} />
                    <Route path="users" element={<AdminViewUsersComponent />} />
                    <Route path="shop/add" element={<AddShopFormComponent />} />
                    <Route path="shop" element={<AdminShopComponent />} />
                    <Route
                      path="shop/edit/:id"
                      element={<AddShopFormComponent />}
                    />
                    <Route path="profile/:id" element={<ProfileComponent />} />
                    <Route path="news" element={<NewsComponent />} />
                    <Route path="/" element={<AdminDashboardCards />} />
                  </Routes>
                </AdminLayout>
              }
            />

            <Route path="/book" element={<StripePayments />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/bookings" element={<ViewBookingComponent />} />
          </Route>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/join" element={<RegisterComponent />} />
          <Route
            path="/login"
            element={<LoginComponent onDataUpdate={handleRoleChange} />}
          />
          <Route path="/news" element={<NewsComponent />} />
          <Route
            path="/logout"
            element={<LogoutComponent onDataUpdate={handleRoleChange} />}
          />

          <Route
            path="/tickets"
            element={<TicketsComponent onAddToCart={handleAddToCart} />}
          />
          <Route path="/ticket/:id" element={<TicketCardDerailsComponent />} />

          <Route
            path="/shop"
            element={<ShopComponent onAddToCart={handleAddToCart} />}
          />
          <Route path="/shop/:id" element={<ShopItemDetailsComponent />} />
        </Routes>
      </div>
      {showCart && (
        <div className="cartComponent animate animate__bounceInRight">
          <CartComponent onCloseCart={handleOpenCart} updateCart={updateCart} />
        </div>
      )}
    </div>
  );
};

export default LayoutComponent;
