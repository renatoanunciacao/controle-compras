import { Container, Typography } from "@mui/material";
import React from "react";
import SearchBar from "../components/molecules/SearchBar";
import ListProductsOrganism from "../components/organisms/ListProducts";


const HomePage: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Controle de Compras 🛒
            </Typography>
            <SearchBar />
            {/* <FormProduct /> */}
            <ListProductsOrganism />
        </Container>
    );
};

export default HomePage;
