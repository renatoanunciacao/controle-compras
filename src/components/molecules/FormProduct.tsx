import { Button, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../atoms/Input";
import { useDispatch } from "react-redux";
// ajuste o caminho conforme sua estrutura
import toast from "react-hot-toast";

const FormProduct: React.FC = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number | string>("");
    const [quantity, setQuantity] = useState<number | string>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || price === "" || quantity === "") return;

        const parsedPrice = parseFloat(price.toString().replace(',', '.'));
        const parsedQuantity = parseInt(quantity.toString(), 10);


        if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
            toast.error("Preço ou quantidade inválidos!");
            return;
        }

        // dispatch(
        //     addProduct({
        //         name,
        //         price: parseFloat(parsedPrice.toFixed(2)),
        //         quantity: parsedQuantity,
        //     })
        // );
        toast.success(`Produto "${name}" adicionado!`);
        setName("");
        setPrice("");
        setQuantity(1);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Input label="Nome do produto" value={name} onChange={setName} />
                <Input label="Preço" type="number" value={price} onChange={(v) => setPrice(v.replace(',', '.'))} />
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
