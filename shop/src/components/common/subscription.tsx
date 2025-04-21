import Text from "@components/ui/text";
import React from "react";
import { useTranslation } from "next-i18next";
import MailchimpForm, { subscribeAtomSuccessfully } from "@components/common/mailchimp-form";
import { getDirection } from '@utils/get-direction';
import { useRouter } from 'next/router';
import { useAtom } from "jotai";
import { useSettings } from "@framework/settings";

interface Props {
	className?: string;
	variant?: "default" | "modern";
}

const Subscription: React.FC<Props> = ({ className = "px-5 sm:px-8 md:px-16 2xl:px-24", variant = "default" }) => {
	const { t } = useTranslation();
	const { locale } = useRouter();
	const dir = getDirection(locale);
	const [successMessage] = useAtom(subscribeAtomSuccessfully)
	const { data } = useSettings();
	return (
		<div
			className={`${className} flex flex-col justify-center xl:justify-between items-center rounded-lg bg-gray-200 py-10 md:py-14 lg:py-16 ${variant === "default" ? "xl:flex-row" : ""}`}
		>
			<div className={`-mt-1.5 lg:-mt-2 xl:-mt-0.5 text-center ltr:xl:text-left rtl:xl:text-right ${variant === "default" ? "mb-7 md:mb-8 lg:mb-9 xl:mb-0" : "mb-7  z-10 relative"}`}>
				<Text
					variant="mediumHeading"
					className="mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5"
				>
					{t(`common:text-subscribe-heading`)}
				</Text>
				<p className="text-body text-xs md:text-sm leading-6 md:leading-7">
					{t(`common:text-subscribe-description`)}
				</p>
			</div>
			{successMessage ? (
				<div className="rounded border-[1px] border-green-950 bg-green-50 px-4 py-3 text-heading" role="alert">
					<div className="flex items-center justify-center ">
						<div className="py-1">
							<svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6 fill-current text-green-500" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
							</svg>
						</div>
						<div>
							<p className="font-bold">{data?.options?.mailchimpSubscribeText}</p>
						</div>
					</div>
				</div>
			) : (
				<MailchimpForm layout="subscribe" />
			)
			}
			{variant === "modern" ?
				<div
					style={{
						backgroundImage:
							dir === 'rtl'
								? 'url(/assets/images/subscription-bg-reverse.png)'
								: 'url(/assets/images/subscription-bg.png)',
					}}
					className={`hidden z-0 xl:block bg-no-repeat ${dir === 'rtl'
						? 'bg-left 2xl:-left-12 3xl:left-0'
						: 'bg-right xl:-right-24 2xl:-right-20 3xl:right-0'
						} bg-contain xl:bg-cover 3xl:bg-contain absolute h-full w-full top-0`}
				/>
				:
				""
			}
		</div>
	);
};

export default Subscription;
