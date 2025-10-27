import { useDispatch, useSelector } from "react-redux";
import Input from "../atoms/Input";
import type { RootState } from "../../store";
import { setSearchTerm } from "../../store/productsSlice";
import Button from "../atoms/Button";
import { useState } from "react";
import CreateProductModal from "../organisms/CreateProductModal";

const SearchBar = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector(
        (state: RootState) => state.products.searchTerm
    );
    const filteredItems = useSelector(
        (state: RootState) => state.products.filteredItems
    );
    const [modalOpen, setModalOpen] = useState(false);

    const handleChange = (value: string) => {
        dispatch(setSearchTerm(value));
    };

    // Função que destaca o termo digitado
    const highlightMatch = (name: string) => {
        if (!searchTerm) return name;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = name.split(regex);
        return parts.map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <strong key={i} style={{ color: "#1976d2" }}>
                    {part}
                </strong>
            ) : (
                part
            )
        );
    };

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto" }}>
            <Input
                value={searchTerm}
                onChange={handleChange}
                placeholder="Buscar produto"
                label="Buscar produto"
            />

            {/* Exibe a lista apenas se o modal estiver fechado */}
            {searchTerm && !modalOpen && (
                <ul
                    style={{
                        position: "absolute",
                        top: "60px",
                        width: "100%",
                        maxHeight: "250px",
                        overflowY: "auto",
                        background: "#fff",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        borderRadius: "10px",
                        padding: "8px 0",
                        margin: 0,
                        listStyle: "none",
                        zIndex: 1000,
                        animation: "fadeIn 0.15s ease-in-out",
                    }}
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    transition: "background 0.2s",
                                }}
                                onClick={() => console.log("Selecionou:", item.name)}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#f1f5ff")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = "#fff")
                                }
                            >
                                <span>{highlightMatch(item.name)}</span>
                                <span
                                    style={{
                                        fontSize: "0.85em",
                                        color: "#777",
                                        fontWeight: 500,
                                    }}
                                >
                                    {item.category || "Sem categoria"}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: "8px 16px" }}>
                            <Button
                                style={{
                                    width: "100%",
                                    padding: "10px 16px",
                                    borderRadius: "6px",
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    transition: "background 0.2s",
                                }}
                                onClick={() => setModalOpen(true)}
                            >
                                Criar Produto "{searchTerm}"
                            </Button>
                        </li>
                    )}
                </ul>
            )}

            <CreateProductModal
                isOpen={modalOpen}
                defaultName={searchTerm}
                onClose={() => setModalOpen(false)}
                onCreated={() => dispatch(setSearchTerm(""))}
            />

            {/* Animação simples de aparição */}
            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
            </style>
        </div>
    );
};

export default SearchBar;
