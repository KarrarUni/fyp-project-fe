import { Button } from "@mui/material";
import React from "react";

export default function ShopItemCard({
  shopItem,
  handleOnView,
  addToCart,
  handleOnBook,
}) {
  const [soldOut, isSoldOut] = React.useState(false);

  React.useEffect(() => {
    shopItem.quantity - shopItem.sold <= 0 ? isSoldOut(true) : isSoldOut(false);
  }, []);
  return (
    <div className="card product_card" style={{ width: "18rem" }}>
      <div className="product_card_img_wrapper">
        <div
          onClick={() => handleOnView(shopItem)}
          className="product_card_img"
          style={{ backgroundImage: `url(${shopItem.image_url})` }}
        ></div>
      </div>
      <div className="card-body">
        <div>
          <div className="font-lg fw-bold">{shopItem.item}</div>
          <h4 className="fw-boldest pm-blue mt-1">£ {shopItem.price}</h4>
        </div>
        <div className="d-flex justify-content-end align-items-start">
          <Button
            variant="contained"
            disabled={soldOut}
            onClick={() => addToCart(shopItem)}
          >
            {soldOut ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// import {
//   Button,
//   CardContent,
//   CardMedia,
//   Container,
//   Grid,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

// export default function ShopItemCard({
//   shopItem,
//   handleOnView,
//   addToCart,
//   handleOnBook,
// }) {
//   const [soldOut, isSoldOut] = React.useState(false);

//   React.useEffect(() => {
//     shopItem.quantity - shopItem.sold <= 0 ? isSoldOut(true) : isSoldOut(false);
//   }, []);

//   return (
//     <>
//       <Container sx={{ py: 8 }}>
//         <Grid container spacing={3}>
//             <Grid item key={shopItem._id} xs={12} sm={6} md={4} >
//               {/* <CardMedia
//                 onClick={() => handleOnView(shopItem)}
//                 component="img"
//                 alt="green iguana"
//                 width="100%"
//                 height="100%"
//                 image={shopItem.image_url}
//               /> */}
//               <CardContent>
//                 <Typography
//                   sx={{ marginTop: "14px" }}
//                   variant="body2"
//                   color="text.secondary"
//                   textAlign={"center"}
//                 >
//                   {shopItem.item}
//                 </Typography>
//               </CardContent>
//               <Container maxWidth="sm">
//                 <Grid
//                   container
//                   spacing={2}
//                   justify="center"
//                   marginBottom={"12px"}
//                 >
//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       variant="contained"
//                       fullWidth
//                       startIcon={<ShoppingCartCheckoutIcon />}
//                     >
//                       cart
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Button variant="outlined" fullWidth>
//                      $ {shopItem.price}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Container>
//             </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// }
