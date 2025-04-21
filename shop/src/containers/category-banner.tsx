import Image from "next/image";
import { useRouter } from "next/router";
import { useCategory } from "@framework/categories";
import {categoryBannerPlaceholder} from "@lib/placeholders";
import Spinner from "@components/ui/loaders/spinner/spinner";
interface CategoryBannerProps {
	className?: string;
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({
	className = "mb-7",
}) => {
	const {
		query: { slug },
	} = useRouter();

  const { data, isLoading } = useCategory(slug as string);

	if (isLoading) {
		return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner showText={false} />
      </div>
    );
	}

	return (
		<div
			className={`bg-gray-200 rounded-md relative flex flex-row ${className}`}
		>
			<div className="hidden md:flex">
				<Image
					// @ts-ignore
					src={data?.banner_image?.original || categoryBannerPlaceholder}
					alt="Category Banner"
					width={1800}
					height={270}
					className="rounded-md"
				/>
			</div>
			<div className="relative md:absolute top-0 ltr:left-0 rtl:right-0 h-auto md:h-full w-full md:w-2/5 flex items-center py-2 sm:py-3.5">
				<h2 className="capitalize text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-heading p-7 text-center w-full">
					{/* @ts-ignore */}
					#{data?.name}
				</h2>
			</div>
		</div>
	);
};

export default CategoryBanner;
