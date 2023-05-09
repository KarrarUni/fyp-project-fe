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
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import axios from "axios";
import toastr from "toastr";

export default function AdminViewUsersComponent() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [users, setUsers] = React.useState([]);
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const fetchOrderDetails = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/user/", {
      headers,
    });
    if (res.status === 200) {
      setUsers(res.data);
    }
  };

  const deleteUser = async (user) => {
    const res = await axios.delete(
      "https://fyp-project-be.onrender.com/api/user/" + user._id,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("User deleted successfully");
      fetchOrderDetails();
    } else {
      toastr.error("Something went wrong");
    }
  };

  React.useEffect(() => {
    fetchOrderDetails();
  }, []);

  const displayedUsers =
    rowsPerPage > 0
      ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : users;

  return (
    <div className="container ">
      <Typography variant="h5" component="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
        <Table sx={{ minWidth: 450 }} aria-label="ticket table">
          <TableHead>
            <TableRow>
              <TableCell>User #</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Joined On</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user, i) => (
              <TableRow key={user._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  {user?.first_name} {user?.last_name}
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.phone}</TableCell>
                <TableCell>
                  {moment(user.createdAt).format("MM/DD/YYYY hh:mm a")}
                </TableCell>
                <TableCell>{user?.date_of_birth?.slice(0,10) ?? ''}</TableCell>
                <TableCell>{user?.gender}</TableCell>
                <TableCell>
                  <Tooltip title="Delete user" placement="top">
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteUser(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}
