// organisms/CreateProductModal.tsx

import React, { useEffect, useState } from "react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Lottie from "lottie-react";
import { addProductAndAddToCart, type Product } from "../../store/productsSlice";
import { motion } from "framer-motion";
import successAnimation from "../../assets/success.json";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";

interface Props {
    isOpen: boolean;
    defaultName: string;
    onClose: () => void;
    onCreated?: () => void;
    existingProduct?: Product;
    isEditMode?: boolean;
}

const CreateProductModal: React.FC<Props> = ({ 
    isOpen, 
    defaultName, 
    onClose, 
    onCreated,
    existingProduct,
    isEditMode = false 
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    // Reseta o modal quando fecha
    useEffect(() => {
        if (!isOpen) {
            setIsSuccess(false);
            setName("");
            setCategory("");
            setPrice(0);
            setQuantity(1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (existingProduct && isEditMode) {
                // Preenche com dados do produto existente
                setName(existingProduct.name);
                setCategory(existingProduct.category || "");
                setPrice(existingProduct.price);
                setQuantity(1);
            } else {
                setName(defaultName);
                setCategory("");
                setPrice(0);
                setQuantity(1);
            }
        }
    }, [isOpen, defaultName, existingProduct, isEditMode]);

    const handleConfirm = () => {
        dispatch(addProductAndAddToCart({ 
            name, 
            category, 
            price, 
            quantity 
        }));
        
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
                zIndex: 1
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
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        padding: "20px 0"
                    }}>
                        <div style={{ width: "150px", height: "150px" }}>
                            <Lottie animationData={successAnimation} loop={false} />
                        </div>
                    </div>
                ) : (
                    <>
                        <h2>{isEditMode ? 'Editar e Adicionar ao Carrinho' : 'Criar Produto'}</h2>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <Input label="Nome" value={name} onChange={setName} />
                            <Input label="Categoria" value={category} onChange={setCategory} />
                            <Input label="Preço" type="number" value={price.toString()} onChange={(v) => setPrice(Number(v))} />
                            <Input label="Quantidade" type="number" value={quantity.toString()} onChange={(v) => setQuantity(Number(v))} />
                            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                                <Button onClick={handleConfirm} variant="contained">Confirmar</Button>
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