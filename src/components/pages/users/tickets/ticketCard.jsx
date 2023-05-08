import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import moment from "moment";

export default function TicketCard({
  ticket,
  handleOnView,
  addToCart,
  handleOnBook,
}) {
  const [soldOut, setSoldOut] = React.useState(false);

  React.useEffect(() => {
    if (ticket.total - ticket.sold === 0) {
      setSoldOut(true);
    }
  }, [ticket]);

  return (
    <Card sx={{ maxWidth: 345, padding: 1 }}>
      <CardActionArea onClick={() => handleOnView(ticket)}>
        <CardMedia
          component="img"
          height="140"
          image={ticket.image_url}
          alt={ticket.match}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5" component="div" className="one-line-ellipsis">
                {ticket.match}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={7}>
              <Typography variant="body2" color="text.secondary">
                Date: {moment(ticket.date).format("MM-DD-YYYY")} - {ticket.time}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Typography variant="body2" color="text.secondary">
                Type: {ticket.seat.toUpperCase()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Price: {ticket.price} $
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              {ticket.total - ticket.sold === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sold Out
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Remaining: {ticket.total - ticket.sold}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          disabled={soldOut}
          onClick={() => addToCart(ticket)}
        >
          Add to Cart
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={soldOut}
          onClick={() => handleOnBook(ticket)}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
