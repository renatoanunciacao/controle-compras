import React, { useState } from "react";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { RootState } from "../../store";

import toast from "react-hot-toast";
import { clearCart, removeFromCart } from "../../store/productsSlice";
import AdBanner from "../atoms/AdBanner";

const ListProductsOrganism: React.FC = () => {
  const dispatch = useDispatch();
  const productsCart = useSelector((state: RootState) => state.products.cart);
  const [copied, setCopied] = useState(false);

  const total = productsCart.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const handleCopyList = () => {
    const now = new Date();
    const dateTime = now.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const cartText = productsCart
      .map(
        (item) => `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}`
      )
      .join("\n");

    const fullText = `📋 Lista de Compras\n\n${cartText}\n\n💰 Total: R$ ${total.toFixed(
      2
    )}\n\n📅 ${dateTime}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      toast.success("Lista copiada!", { icon: "📋" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (productsCart.length === 0)
    return (
      <>
        <Typography mt={4} align="center" color="text.secondary">
          Nenhum produto adicionado ainda.
        </Typography>
        {/* Anúncio quando carrinho vazio */}
        <AdBanner adSlot="1234567890" adFormat="rectangle" />
      </>
    );

  return (
    <Box mt={4}>
      {/* Anúncio antes da lista */}
      <AdBanner adSlot="1234567890" adFormat="horizontal" />

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 2,
          background: "#fafafa",
        }}
      >
        {productsCart.map((p, i) => (
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
                    dispatch(removeFromCart(p.id));
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

          <Box display="flex" gap={1}>
            <Tooltip title="Copiar lista de compras">
              <Button
                onClick={handleCopyList}
                startIcon={
                  copied ? <CheckCircleIcon /> : <ContentCopyIcon />
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: copied ? "#4caf50" : "#6c63ff",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: copied
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(108, 99, 255, 0.1)",
                  },
                }}
              >
                {copied ? "Copiado!" : "Copiar Lista"}
              </Button>
            </Tooltip>

            <Tooltip title="Limpar todos os produtos">
              <Button
                onClick={() => {
                  dispatch(clearCart());
                  toast.success("Lista limpa com sucesso!", { icon: "🧹" });
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
        </Box>
      </Paper>

      {/* Anúncio depois da lista */}
      <AdBanner adSlot="0987654321" adFormat="horizontal" />
    </Box>
  );
};

export default ListProductsOrganism;
