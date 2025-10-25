import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import type { RootState } from "../../store";
import { clearProducts, removeProduct } from "../../store/productsSlice";
import toast from "react-hot-toast";

const ListProductsOrganism: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);

  const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  if (products.length === 0)
    return (
      <Typography mt={4} align="center" color="text.secondary">
        Nenhum produto adicionado ainda.
      </Typography>
    );

  return (
    <Box mt={4}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 2,
          background: "#fafafa",
        }}
      >
        {products.map((p, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1.2}
            px={1}
            sx={{
              transition: "background 0.2s",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Box>
              <Typography fontWeight={600}>{p.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {p.quantity} x R${p.price.toFixed(2)}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontWeight={600}>
                R${(p.price * p.quantity).toFixed(2)}
              </Typography>

              <Tooltip title="Remover produto">
                <IconButton
                  color="error"
                  onClick={() => {
                    dispatch(removeProduct(p.name));
                    toast.success(`${p.name} removido`);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255,0,0,0.08)",
                    },
                  }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
        >
          <Typography variant="h6" fontWeight={700}>
            Total: R$ {total.toFixed(2)}
          </Typography>

          <Tooltip title="Limpar todos os produtos">
            <Button
              onClick={() =>  { 
                dispatch(clearProducts());
                toast.success("Lista limpa com sucesso!", { icon: "🧹" })
              }}
              startIcon={<DeleteSweepIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "#6c63ff",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(108, 99, 255, 0.1)",
                },
              }}
            >
              Limpar tudo
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default ListProductsOrganism;
