import type { AppDispatch, RootState } from "../../store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateProductModal from "../organisms/CreateProductModal";
import type { Product } from "../../store/productsSlice";
import { deleteProduct } from "../../store/productsSlice";
import { motion } from "framer-motion";

const SearchBar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [existingProduct, setExistingProduct] = useState<Product | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [defaultName, setDefaultName] = useState<string>("");
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<number>(0);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

    const products = useSelector((state: RootState) => state.products.items);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleSelectProduct = (product: Product) => {
        setExistingProduct(product);
        setIsEditMode(true);
        setDefaultName("");
        setIsModalOpen(true);
        setSearchTerm("");
        setFilteredProducts([]);
    };

    const handleCreateNew = () => {
        setExistingProduct(null);
        setIsEditMode(false);
        setDefaultName(searchTerm);
        setIsModalOpen(true);
        setSearchTerm("");
        setFilteredProducts([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            const exactMatch = products.find(
                (p) => p.name.toLowerCase() === searchTerm.toLowerCase()
            );

            if (exactMatch) {
                handleSelectProduct(exactMatch);
            } else {
                handleCreateNew();
            }
        }
    };

    const handleDragEnd = (product: Product, info: { offset: { x: number; y: number } }) => {
        const dragThreshold = -150;

        if (info.offset.x < dragThreshold) {
            setProductToDelete(product);
            setShowDeleteConfirm(true);
        }
        
        setDraggedItemId(null);
        setDragOffset(0);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            dispatch(deleteProduct(productToDelete.id));
            setFilteredProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    const getBackgroundColor = (offset: number): string => {
        if (offset === 0) return "#fff";

        const intensity = Math.min(Math.abs(offset) / 150, 1);
        const red = Math.floor(255 * intensity);
        const green = Math.floor(255 * (1 - intensity));
        const blue = Math.floor(255 * (1 - intensity));

        return `rgb(${red}, ${green}, ${blue})`;
    };

    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar produto..."
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                    }}
                />

                {filteredProducts.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginTop: "4px",
                            maxHeight: "300px",
                            overflowY: "auto",
                            zIndex: 10,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                            >
                                <motion.div
                                    drag="x"
                                    dragConstraints={{ left: -200, right: 0 }}
                                    dragElastic={0.2}
                                    onDrag={(_, info) => {
                                        setDraggedItemId(product.id);
                                        setDragOffset(info.offset.x);
                                    }}
                                    onDragEnd={(_, info) => handleDragEnd(product, info)}
                                    onClick={() => {
                                        if (Math.abs(dragOffset) < 5) {
                                            handleSelectProduct(product);
                                        }
                                    }}
                                    style={{
                                        padding: "12px",
                                        cursor:
                                            draggedItemId === product.id && dragOffset < -10
                                                ? "grabbing"
                                                : "pointer",
                                        backgroundColor:
                                            draggedItemId === product.id
                                                ? getBackgroundColor(dragOffset)
                                                : "#fff",
                                        position: "relative",
                                        transition:
                                            draggedItemId === product.id ? "none" : "background-color 0.3s",
                                        color:
                                            draggedItemId === product.id && dragOffset < -50
                                                ? "#fff"
                                                : "#000",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: "bold" }}>{product.name}</div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color:
                                                        draggedItemId === product.id && dragOffset < -50
                                                            ? "rgba(255,255,255,0.8)"
                                                            : "#666",
                                                }}
                                            >
                                                {product.category}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}>
                                            <div style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                color: draggedItemId === product.id && dragOffset < -50
                                                    ? "#fff"
                                                    : "#000"
                                            }}>
                                                R$ {product.price.toFixed(2)}
                                            </div>

                                            {draggedItemId === product.id && dragOffset < -50 && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    style={{ fontSize: "24px" }}
                                                >
                                                    {dragOffset < -150 ? "✓" : "🗑️"}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {draggedItemId === product.id && dragOffset < -100 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                        >
                                            {dragOffset < -150
                                                ? "Solte para deletar"
                                                : "Continue arrastando..."}
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        ))}

                        {searchTerm.trim() !== "" && (
                            <div
                                onClick={handleCreateNew}
                                style={{
                                    padding: "12px",
                                    cursor: "pointer",
                                    color: "#007bff",
                                    fontWeight: "bold",
                                    backgroundColor: "#fff",
                                    borderTop: "1px solid #f0f0f0"
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                            >
                                + Criar novo produto "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}

                {/* Mostrar opção de criar quando não há resultados */}
                {searchTerm.trim() !== "" && filteredProducts.length === 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginTop: "4px",
                            zIndex: 10,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            onClick={handleCreateNew}
                            style={{
                                padding: "12px",
                                cursor: "pointer",
                                color: "#007bff",
                                fontWeight: "bold",
                                backgroundColor: "#fff",
                                textAlign: "center"
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                        >
                            + Criar novo produto "{searchTerm}"
                        </div>
                    </div>
                )}
            </div>

            {showDeleteConfirm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
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
                        zIndex: 100,
                    }}
                    onClick={cancelDelete}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            padding: 24,
                            borderRadius: 12,
                            minWidth: 300,
                            maxWidth: 400,
                            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: 16 }}>
                            <div style={{ fontSize: "48px", marginBottom: 8 }}>⚠️</div>
                            <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
                                Confirmar Exclusão
                            </h3>
                        </div>

                        <p
                            style={{
                                margin: "0 0 8px 0",
                                textAlign: "center",
                                color: "#666",
                            }}
                        >
                            Tem certeza que deseja deletar:
                        </p>

                        <div
                            style={{
                                backgroundColor: "#f5f5f5",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: "bold",
                                    color: "#333",
                                    fontSize: "18px",
                                    margin: 0,
                                    textAlign: "center",
                                }}
                            >
                                {productToDelete?.name}
                            </p>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#666",
                                    margin: "4px 0 0 0",
                                    textAlign: "center",
                                }}
                            >
                                {productToDelete?.category} - R$ {productToDelete?.price.toFixed(2)}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={cancelDelete}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: 8,
                                    border: "2px solid #ddd",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                                    e.currentTarget.style.borderColor = "#999";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fff";
                                    e.currentTarget.style.borderColor = "#ddd";
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: 8,
                                    border: "none",
                                    backgroundColor: "#ff4444",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#cc0000";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#ff4444";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                🗑️ Deletar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <CreateProductModal
                isOpen={isModalOpen}
                defaultName={defaultName}
                existingProduct={existingProduct || undefined}
                isEditMode={isEditMode}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => {
                    console.log("Produto adicionado ao carrinho!");
                }}
            />
        </>
    );
};

export default SearchBar;
