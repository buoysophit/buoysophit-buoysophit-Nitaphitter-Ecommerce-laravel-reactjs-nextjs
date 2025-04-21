import React from "react";
import { useProductsInfinite } from "@framework/products";
import ProductInfiniteGrid from "@components/product/product-infinite-grid";
import CollectionTopBar from "@components/collection/collection-top-bar";

type Props = {
  classname?: string;
  tagSlug: string;
};

const CollectionProductsBlock: React.FC<Props> = ({ classname = "", tagSlug }) => {
  const {
    isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsInfinite({
    tags: tagSlug && tagSlug,
  });

  const collectionTitle = tagSlug?.toString().split("-").join(" ");

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <CollectionTopBar
        collectionTitle={collectionTitle}
        searchResultCount={data?.pages?.[0]?.total}
      />
      <ProductInfiniteGrid
        className={classname}
        loading={isLoading}
        data={data}
        hasNextPage={hasNextPage}
        loadingMore={loadingMore}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default CollectionProductsBlock;
