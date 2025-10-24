import React from "react";
import FormProduct from "../components/molecules/FormProduct";
import ListProducts from "../components/organisms/ListProducts";
import { Container, Typography } from "@mui/material";


const HomePage: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Controle de Compras 🛒
            </Typography>
            <FormProduct />
            <ListProducts />
        </Container>
    );
};

export default HomePage;
