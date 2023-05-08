import { Typography } from "@mui/material";
import AdminShowBookingsComponent from "./shop-bookings";

export default function AdminViewBookings() {

    return (
        <div className="container mb-4">
            <Typography variant="h5" component="h4" gutterBottom>
                Bookings
            </Typography>
            <AdminShowBookingsComponent/>
        </div>
    )

}
