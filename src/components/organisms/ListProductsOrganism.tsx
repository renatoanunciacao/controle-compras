import React, { useState } from "react";

import type { RootState } from "../../store";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const ListProductsOrganism: React.FC = () => {
    const cart = useSelector((state: RootState) => state.products.cart);
    const products = useSelector((state: RootState) => state.products.items);
    const [copied, setCopied] = useState(false);

    const getProductDetails = (productId: string) => {
        return products.find(p => p.id === productId);
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            const product = getProductDetails(item.id);
            return sum + (item.quantity * (product?.price || 0));
        }, 0);
    };

    const handleCopyList = () => {
        const now = new Date();
        const dateTime = now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const cartText = cart
            .map(item => {
                const product = getProductDetails(item.id);
                return `${item.quantity}x ${product?.name} - R$ ${(product?.price || 0).toFixed(2)}`;
            })
            .join('\n');

        const total = calculateTotal();
        const fullText = `📋 Lista de Compras\n\n${cartText}\n\n💰 Total: R$ ${total.toFixed(2)}\n\n📅 ${dateTime}`;

        navigator.clipboard.writeText(fullText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div style={{
            padding: "24px",
            maxWidth: "600px",
            margin: "0 auto"
        }}>
            {/* Header sem botão */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#333"
                }}>
                    🛒 Carrinho ({cart.length})
                </h2>
            </div>

            {/* Empty State */}
            {cart.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    border: "2px dashed #ddd"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
                    <p style={{
                        color: "#999",
                        fontSize: "16px",
                        margin: 0
                    }}>
                        Seu carrinho está vazio
                    </p>
                    <p style={{
                        color: "#ccc",
                        fontSize: "14px",
                        margin: "8px 0 0 0"
                    }}>
                        Adicione produtos para começar
                    </p>
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginBottom: "24px"
                    }}>
                        {cart.map((item, index) => {
                            const product = getProductDetails(item.id);
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        padding: "16px",
                                        backgroundColor: "#fff",
                                        borderRadius: "12px",
                                        border: "1px solid #e0e0e0",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontWeight: "600",
                                                fontSize: "16px",
                                                color: "#333",
                                                marginBottom: "4px"
                                            }}>
                                                {product?.name}
                                            </div>
                                            <div style={{
                                                fontSize: "12px",
                                                color: "#999"
                                            }}>
                                                {product?.category}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px"
                                        }}>
                                            <div style={{
                                                textAlign: "center",
                                                padding: "4px 12px",
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: "6px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                color: "#666"
                                            }}>
                                                {item.quantity}x
                                            </div>

                                            <div style={{ textAlign: "right" }}>
                                                <div style={{
                                                    fontSize: "12px",
                                                    color: "#999",
                                                    marginBottom: "2px"
                                                }}>
                                                    R$ {(product?.price || 0).toFixed(2)}
                                                </div>
                                                <div style={{
                                                    fontWeight: "700",
                                                    fontSize: "16px",
                                                    color: "#007bff"
                                                }}>
                                                    R$ {(item.quantity * (product?.price || 0)).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Total */}
                    <div style={{
                        padding: "20px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "12px",
                        border: "2px solid #007bff",
                        marginBottom: "16px"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#333"
                            }}>
                                Total
                            </span>
                            <span style={{
                                fontSize: "24px",
                                fontWeight: "700",
                                color: "#007bff"
                            }}>
                                R$ {calculateTotal().toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Botão Copiar Lista */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopyList}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            border: copied ? "2px solid #4caf50" : "2px solid #007bff",
                            backgroundColor: copied ? "#4caf50" : "#007bff",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.3s",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        {copied ? (
                            <>
                                <span style={{ fontSize: "20px" }}>✓</span>
                                <span>Copiado!</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: "20px" }}>📋</span>
                                <span>Copiar Lista de Compras</span>
                            </>
                        )}
                    </motion.button>
                </>
            )}
        </div>
    );
};

export default ListProductsOrganism;
