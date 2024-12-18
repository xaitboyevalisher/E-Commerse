import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LockType } from "./FilterPage"; // Agar typelar bo'lsa import qiling
import { fetchProductsByFilters } from './api'; // Fetch functionni import qilish

const FilterResultsPage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<LockType[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const priceRange = queryParams.get("priceRange")?.split("-");
    const a = parseInt(queryParams.get("lockSize[a]") || "0");
    const b = parseInt(queryParams.get("lockSize[b]") || "0");
    const c = parseInt(queryParams.get("lockSize[c]") || "0");

    const filters = {
      priceRange: priceRange ? [parseInt(priceRange[0]), parseInt(priceRange[1])] : [100000, 250000],
      lockSize: { a, b, c },
    };

    fetchProductsByFilters(filters).then((data) => {
      setFilteredProducts(data);
      setLoading(false);
    });
  }, [location.search]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <div>
          <h2>Filtered Products</h2>
          <ul>
            {filteredProducts.map((product) => (
              <li key={product.id}>
                {product.name} - {product.newPrice} ₽
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterResultsPage;
