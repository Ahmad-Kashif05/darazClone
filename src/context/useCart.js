
import { useContext } from "react";
import { CartContext } from "./CartContextOnly";

export function useCart() {
  return useContext(CartContext);
}
