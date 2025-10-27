// organisms/CreateProductModal.tsx
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import successAnimation from "../../assets/success.json"; // animação exportada do LottieFiles
import { addProductAndAddToCart } from "../../store/productsSlice";
import Button from "../atoms/Button";
import Input from "../atoms/Input";


interface Props {
    isOpen: boolean;
    defaultName: string;
    onClose: () => void;
    onCreated?: () => void;
}

const CreateProductModal: React.FC<Props> = ({ isOpen, defaultName, onClose, onCreated }) => {
    const dispatch = useDispatch();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [name, setName] = useState(defaultName);
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);



    useEffect(() => {
        setName(defaultName);
    }, [defaultName]);

    const handleConfirm = () => {
        console.log('dados', name, category, price, quantity)
        dispatch(addProductAndAddToCart({ name, category, price, quantity }));
        setIsSuccess(true);
        onCreated?.();
        setTimeout(() => {
            setIsSuccess(false);
            onClose();
        }, 2000);


    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
            transition={{ duration: 0.3 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "1"
            }}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{
                    backgroundColor: "#fff",
                    padding: 24,
                    borderRadius: 8,
                    minWidth: 300,
                }}
            >
                {isSuccess ? (
                    <Lottie animationData={successAnimation} loop={false} />
                ) : (
                    <>
                        <h2>Criar Produto</h2>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <Input label="Nome" value={name} onChange={setName} />
                            <Input label="Categoria" value={category} onChange={setCategory} />
                            <Input label="Preço" type="number" value={price} onChange={(v) => setPrice(Number(v))} />
                            <Input label="Quantidade" type="number" value={quantity} onChange={(v) => setQuantity(Number(v))} />
                            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                                <Button onClick={handleConfirm} variant="contained" onCanPlay={handleConfirm}>Confirmar</Button>
                                <Button onClick={onClose} variant="outlined">Cancelar</Button>
                            </div>
                        </div>
                    </>
                )}


            </motion.div>
        </motion.div>
    );
};

export default CreateProductModal;
