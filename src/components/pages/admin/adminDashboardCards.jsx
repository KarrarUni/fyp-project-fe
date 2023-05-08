import React from "react";
import axios from "axios";
import { Card, CardContent, Typography, Paper } from "@mui/material";

export default function AdminDashboardCards() {
  const [users, setUsers] = React.useState({});
  const [revenue, setRevenue] = React.useState({});

  const fetchUserStats = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/stats/users");
    if (res.status === 200) {
      setUsers(res.data);
    }
  };

  const fetchRevenue = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/stats/revenue");
    if (res.status === 200) {
      setRevenue(res.data);
      console.log("res.data: ", res.data);
    }
  };

  React.useEffect(() => {
    fetchUserStats();
    fetchRevenue();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: 2,
        }}
      >
        <Typography component="h4" variant="h4" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        <div className="row">
          <div className="col-md-6">
            <Card>
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{users.total}</Typography>
                <Typography color="textSecondary">
                  Last 7 days: {users.weeklyUsers}
                </Typography>
                <Typography color="textSecondary">
                  Last 30 days: {users.monthlyUsers}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-6">
            {revenue?.revenue && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">
                    {revenue?.revenue[0]?.total}
                  </Typography>
                  <Typography color="textSecondary">
                    Last 7 days: {revenue?.weeklyRevenue[0]?.total}
                  </Typography>
                  <Typography color="textSecondary">
                    Last 30 days: {revenue?.monthlyRevenue[0]?.total}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Paper>
    </>
  );
}
