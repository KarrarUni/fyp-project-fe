import React from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { CardMedia, Grid, Typography } from "@mui/material";
const TestimonialQuotes = () => {
  return (
    <div
      className="container-fluid mx-0"
      style={{
        backgroundColor: "#1565c0",
      }}
    >
      <div className="container d-flex justify-content-center">
          <Grid
            item
            sx={{
              color: "#fff",
            }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                margin: '50px 0'
              }}
              image="https://firebasestorage.googleapis.com/v0/b/kayrarr-14eac.appspot.com/o/uploads%2FBecktonFC.png?alt=media&token=f24d8efa-847a-4c3c-a322-9b5371c28434"
            />
          </Grid>
          {/* <Grid
            item
            xs={12}
            md={6}
            container
            justify="center"
            alignItems="center"
          >
            <FormatQuoteIcon
              style={{
                fontSize: "100px",
                transform: "rotate(180deg)",
                color: "white",
              }}
            />
            <Typography
              variant="body1"
              textAlign={"center"}
              color={"white"}
              component="body1"
            >
              The vision of a champion is someone who is bent over, drenched in
              sweat, at the point of exhaustion when no one else is watching. -
              Anson Dorrance, former U.S. Women's National Team coach and
              University of North Carolina women's soccer coach.
            </Typography>
            <FormatQuoteIcon
              style={{
                fontSize: "100px",
                position: "relative",
                left: "78%",
                color: "#fff",
              }}
            />
          </Grid> */}
      </div>
    </div>
  );
};

export default TestimonialQuotes;
