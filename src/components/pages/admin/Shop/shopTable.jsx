import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import "./shop.css";

export default function ShopTableComponent({ shopItems, onDelete, onEdit }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
      <Table sx={{ minWidth: 450 }} aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Added At</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Total Quantity</TableCell>
            <TableCell>Image URL</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 && shopItems.length
            ? shopItems.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : shopItems
          ).map((shopItem) => (
            <TableRow key={shopItem._id}>
              <TableCell component="th" scope="row">
                {shopItem.item}
              </TableCell>
              <TableCell>{shopItem.description}</TableCell>
              <TableCell>
                {moment(shopItem.date).format("MM/DD/YYYY hh:mm a")}
              </TableCell>
              <TableCell>{shopItem.category}</TableCell>
              <TableCell>{shopItem.price}</TableCell>
              <TableCell>{shopItem.sold }</TableCell>
              <TableCell>{shopItem.quantity}</TableCell>
              <TableCell>
                <img src={shopItem.image_url} alt="404" width={50} />
              </TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(shopItem)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(shopItem)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={shopItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
