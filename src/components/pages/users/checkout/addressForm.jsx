import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function AddressForm({ onSubmit, data }) {
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  React.useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 4 }}>
        Shipping address
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="first_name"
              name="first_name"
              label="First name"
              fullWidth
              autoComplete="given-name"
              InputLabelProps={{ shrink: true }}
              value={formData.first_name ?? ""}
              onChange={handleChange}
              placeholder="First Name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="last_name"
              name="last_name"
              label="Last name"
              fullWidth
              autoComplete="family-name"
              InputLabelProps={{ shrink: true }}
              value={formData.last_name ?? ""}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address1"
              name="address1"
              label="Address line 1"
              fullWidth
              autoComplete="shipping address-line1"
              placeholder="Address Line 1"
              InputLabelProps={{ shrink: true }}
              value={formData.address1 ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address2"
              name="address2"
              label="Address line 2"
              placeholder="Address Line 2"
              fullWidth
              autoComplete="shipping address-line2"
              InputLabelProps={{ shrink: true }}
              value={formData.address2 ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              autoComplete="shipping address-level2"
              placeholder="City"
              InputLabelProps={{ shrink: true }}
              value={formData.city ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              label="State/Province/Region"
              fullWidth
              placeholder="State/Province/Region"
              InputLabelProps={{ shrink: true }}
              value={formData.state ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              name="zip"
              label="Zip / Postal code"
              fullWidth
              autoComplete="shipping postal-code"
              placeholder="Zip / Postal code"
              InputLabelProps={{ shrink: true }}
              value={formData.zip ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Country"
              fullWidth
              autoComplete="shipping country"
              placeholder="Country"
              InputLabelProps={{ shrink: true }}
              value={formData.country ?? ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
