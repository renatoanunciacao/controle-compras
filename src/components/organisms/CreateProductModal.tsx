// organisms/CreateProductModal.tsx

import React, { useEffect, useState } from "react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Lottie from "lottie-react";
import { addProductAndAddToCart, type Product } from "../../store/productsSlice";
import { motion } from "framer-motion";
import successAnimation from "../../assets/success.json";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import Select from "../atoms/Select";

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
    const categories = useSelector((state: RootState) => state.products.categories) || [];
    
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    
    // Campos para produtos pesados
    const [weight, setWeight] = useState<number>(0);
    const [weightUnit, setWeightUnit] = useState<"g" | "kg">("kg");
    const [pricePerKilo, setPricePerKilo] = useState<number>(0);

    const isWeightProduct = category === "Produto com Peso";

    // Reseta o modal quando fecha
    useEffect(() => {
        if (!isOpen) {
            setIsSuccess(false);
            setName("");
            setCategory("");
            setIsNewCategory(false);
            setNewCategoryName("");
            setPrice(0);
            setQuantity(1);
            setWeight(0);
            setWeightUnit("kg");
            setPricePerKilo(0);
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
        const finalCategory = isNewCategory ? newCategoryName : category;
        
        let finalPrice = price;
        
        if (isWeightProduct) {
            const weightInKg = weightUnit === "g" ? weight / 1000 : weight;
            finalPrice = pricePerKilo * weightInKg;
        }
        
        dispatch(addProductAndAddToCart({ 
            name, 
            category: finalCategory, 
            price: finalPrice, 
            quantity,
            ...(isWeightProduct && {
                weight,
                weightUnit,
                pricePerKilo
            })
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
                            
                            {/* Select de Categoria */}
                            <Select
                                label="Categoria"
                                value={isNewCategory ? "nova" : category}
                                onChange={(v) => {
                                    if (v === "nova") {
                                        setIsNewCategory(true);
                                        setCategory("");
                                    } else {
                                        setIsNewCategory(false);
                                        setCategory(v);
                                    }
                                }}
                                options={[
                                    { value: "", label: "Selecione uma categoria" },
                                    ...categories.map(cat => ({ value: cat, label: cat })),
                                    { value: "nova", label: "➕ Criar nova categoria" }
                                ]}
                            />

                            {isNewCategory && (
                                <Input 
                                    label="Nome da nova categoria" 
                                    value={newCategoryName} 
                                    onChange={(v) => {
                                        setNewCategoryName(v);
                                        setCategory(v);
                                    }}
                                    placeholder="Ex: Açougue, Congelados..."
                                />
                            )}

                            {/* Campos para Produto Pesado */}
                            {isWeightProduct ? (
                                <>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <div style={{ flex: 2 }}>
                                            <Input 
                                                label="Peso" 
                                                type="number" 
                                                value={weight.toString()} 
                                                onChange={(v) => setWeight(Number(v))}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <Select
                                                label="Unidade"
                                                value={weightUnit}
                                                onChange={(v) => setWeightUnit(v as "g" | "kg")}
                                                options={[
                                                    { value: "g", label: "g" },
                                                    { value: "kg", label: "kg" }
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <Input 
                                        label="Preço por Kg (R$)" 
                                        type="number" 
                                        value={pricePerKilo.toString()} 
                                        onChange={(v) => setPricePerKilo(Number(v))}
                                    />

                                    {weight > 0 && pricePerKilo > 0 && (
                                        <div style={{
                                            padding: "12px",
                                            backgroundColor: "#e3f2fd",
                                            borderRadius: "8px",
                                            border: "1px solid #90caf9"
                                        }}>
                                            <div style={{ fontSize: "12px", color: "#1565c0", marginBottom: "4px" }}>
                                                Preço calculado:
                                            </div>
                                            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0d47a1" }}>
                                                R$ {((weightUnit === "g" ? weight / 1000 : weight) * pricePerKilo).toFixed(2)}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#1565c0", marginTop: "4px" }}>
                                                {weight} {weightUnit} × R$ {pricePerKilo.toFixed(2)}/kg
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                category && (
                                    <Input 
                                        label="Preço (R$)" 
                                        type="number" 
                                        value={price.toString()} 
                                        onChange={(v) => setPrice(Number(v))}
                                    />
                                )
                            )}

                            {category && (
                                <Input 
                                    label="Quantidade" 
                                    type="number" 
                                    value={quantity.toString()} 
                                    onChange={(v) => setQuantity(Number(v))}
                                />
                            )}
                            
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