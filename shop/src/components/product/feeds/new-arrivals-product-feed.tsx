import ProductsBlock from "@containers/products-block";
import { useProducts } from "@framework/products";
import { useTranslation } from "next-i18next";
import isEmpty from "lodash/isEmpty";
import NotFoundItem from "@components/404/not-found-item";

export default function NewArrivalsProductFeed() {
  const { t } = useTranslation();
  const { data: products, isLoading: loading, error }: any = useProducts({
    limit: 10,
    orderBy: "created_at",
    sortedBy: "DESC",
  })

  if (!loading && isEmpty(products)) {
    return (
      <NotFoundItem text={t("text-no-products-found")} />
    )
  }

	return (
    <ProductsBlock
      sectionHeading="text-new-arrivals"
      products={products}
      loading={loading}
      error={error?.message}
      uniqueKey="new-arrivals"
    />
	);
}
