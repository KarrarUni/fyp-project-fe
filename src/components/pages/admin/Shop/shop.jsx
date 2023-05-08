import ShopTableComponent from "./shopTable";
import * as React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";

export default function AdminShopComponent() {
  const navigate = useNavigate();
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };
  const [shopItems, setShopItems] = React.useState([]);

  const fetchShopItems = async () => {
    const res = await axios.get("http://localhost:4000/api/shop", {
      headers,
    });
    if (res.status === 200) {
      setShopItems(res.data);
    }
  };

  const handleDelete = async (shopItem) => {
    const updatedShopItems = shopItems.filter((t) => t._id !== shopItem._id);
    const res = await axios.delete(
      `http://localhost:4000/api/shop/${shopItem._id}`,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("Item deleted successfully");
    } else {
      toastr.error("Unable to delete Item");
    }
    setShopItems(updatedShopItems);
  };

  const handleEdit = (item) => {
    navigate(`/admin/shop/edit/${item._id}`);
  };

  React.useEffect(() => {
    fetchShopItems();
  }, []);

  const addNewShopItem = () => {
    navigate("/admin/shop/add");
  };

  return (
    <div className="container mb-4">
      <div className="d-flex flex-column justify-content-center align-items-center ">
        <Typography
          variant="h5"
          component="h4"
          gutterBottom
          className="d-flex w-100"
        >
          Shop Items
        </Typography>
        <Button
          variant="contained"
          className="align-self-end mb-3"
          onClick={addNewShopItem}
        >
          Create New Shop Item
        </Button>
        <ShopTableComponent
          shopItems={shopItems.length ? shopItems : []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
