import { Button, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../atoms/Input";
import { useDispatch } from "react-redux";
import { addProduct } from "../../store/productsSlice"; // ajuste o caminho conforme sua estrutura

const FormProduct: React.FC = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === "" || quantity === "") return;

    dispatch(
      addProduct({
        name,
        price: Number(price),
        quantity: Number(quantity),
      })
    );

    setName("");
    setPrice("");
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Input label="Nome do produto" value={name} onChange={setName} />
        <Input label="Preço" type="number" value={price} onChange={setPrice} />
        <Input
          label="Quantidade"
          type="number"
          value={quantity}
          onChange={setQuantity}
        />
        <Button type="submit" variant="contained">
          Adicionar
        </Button>
      </Stack>
    </form>
  );
};

export default FormProduct;
