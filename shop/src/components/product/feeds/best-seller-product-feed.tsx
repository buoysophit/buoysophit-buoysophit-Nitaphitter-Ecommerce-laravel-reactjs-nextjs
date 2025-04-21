import ProductsBlock from "@containers/products-block";
import { useTranslation } from "next-i18next";
import isEmpty from "lodash/isEmpty";
import NotFoundItem from "@components/404/not-found-item";
import { usePopularProducts } from "@framework/products";
import Spinner from "@components/ui/loaders/spinner/spinner";

export default function BestSellerProductFeed() {
  const { t } = useTranslation();
  const { data: products, isLoading: loading, error }: any = usePopularProducts({
    limit: 10
  })

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center">
        <Spinner showText={false} />
      </div>
  }

  if (!loading && isEmpty(products)) {
    return (
      <NotFoundItem text={t("text-no-best-selling-products-found")} />
    )
  }
	return (
		<ProductsBlock
			sectionHeading="text-best-sellers"
			products={products}
			loading={loading}
			error={error?.message}
			uniqueKey="best-sellers"
		/>
	);
}
