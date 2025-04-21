import React from "react";
import { useProductsInfinite } from "@framework/products";
import ProductInfiniteGrid from "@components/product/product-infinite-grid";

type Props = {
  shopId: string;
};

const ShopProductsGrid: React.FC<Props> = ({ shopId }) => {
  const {
    isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsInfinite({
    ...(Boolean(shopId) && { shop_id: Number(shopId) }),
  });

  if (error) return <p>{error.message}</p>;

  return (
    <ProductInfiniteGrid
      loading={isLoading}
      data={data}
      hasNextPage={hasNextPage}
      loadingMore={loadingMore}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default ShopProductsGrid;
