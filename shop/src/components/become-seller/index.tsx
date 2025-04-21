import { Banner } from '@components/become-seller/templates/banner/banner';
import BusinessPurpose from '@components/become-seller/templates/business-purpose/business-purpose';
import Contact from '@components/become-seller/templates/contact/contact';
import DashboardShowcase from '@components/become-seller/templates/dashboard-showcase/dashboard-showcase';
import FaqSection from '@components/become-seller/templates/faq/faq-section';
import FeeAndCommission from '@components/become-seller/templates/fee-and-commission/fee-and-commission';
import Guideline from '@components/become-seller/templates/guideline/guideline';
import SellerOpportunity from '@components/become-seller/templates/seller-opportunity/seller-opportunity';
import StartSelling from '@components/become-seller/templates/start-selling/start-selling';
import CustomerStories from '@components/become-seller/templates/user-story/customer-stories';
import Alert from '@components/ui/alert';
// import { useSettings } from '@framework/settings';
import { cn } from '@lib/cn';
import {
  AlertProps,
  BecomeSeller as BecomeSellerData,
  BecomeSellerPageOptions,
  Commission,
  SettingsType,
} from '@type/index';

interface BecomeSellerProps {
  data: BecomeSellerData & {
    commissions: Commission[];
    settings: {
      isMultiCommissionRate: SettingsType['options']['isMultiCommissionRate'];
    };
  };
}

export const NotFoundAlert = ({
  message,
  className,
}: Pick<AlertProps, 'message' | 'className'>) => {
  return (
    <div className={cn('container mx-auto py-10', className)}>
      <Alert message={message} />
    </div>
  );
};

const BecomeSeller = ({ data }: BecomeSellerProps) => {
  // const settings = useSettings();
  const page_options = data?.page_options?.page_options;
  const commissions = data?.commissions;
  return (
    <>
      {page_options?.banner ? (
        <Banner
          banner={page_options?.banner as BecomeSellerPageOptions['banner']}
        />
      ) : (
        <NotFoundAlert message="Banner not found 🥹!" />
      )}
      {page_options?.sellingStepsItem && !!page_options?.sellingStepsItem ? (
        <StartSelling
          sellingStepsTitle={page_options?.sellingStepsTitle}
          sellingStepsDescription={page_options.sellingStepsDescription}
          sellingStepsItem={page_options?.sellingStepsItem}
        />
      ) : (
        <NotFoundAlert message="Selling steps not found 🥹!" />
      )}

      {page_options?.userStories && !!page_options?.userStories.length ? (
        <CustomerStories
          userStoryTitle={page_options?.userStoryTitle}
          userStoryDescription={page_options?.userStoryDescription}
          userStories={page_options?.userStories}
        />
      ) : null}

      {page_options?.purposeItems && !!page_options?.purposeItems?.length ? (
        <BusinessPurpose
          purposeTitle={page_options?.purposeTitle}
          purposeDescription={page_options?.purposeDescription}
          purposeItems={page_options?.purposeItems}
        />
      ) : (
        <NotFoundAlert message="Business purpose not found 🥹!" />
      )}

      {commissions || page_options?.defaultCommissionDetails ? (
        <FeeAndCommission
          commissionTitle={page_options?.commissionTitle}
          commissionDescription={page_options?.commissionDescription}
          isMultiCommissionRate={data?.settings?.isMultiCommissionRate}
          commissions={commissions}
          defaultCommissionDetails={page_options?.defaultCommissionDetails}
          defaultCommissionRate={page_options?.defaultCommissionRate}
        />
      ) : (
        <NotFoundAlert message="Commissions information not found 🥹!" />
      )}

      {page_options?.dashboard?.title && page_options?.dashboard?.image ? (
        <DashboardShowcase dashboard={page_options?.dashboard} />
      ) : (
        <NotFoundAlert message="Dashboard showcase not found 🥹!" />
      )}

      {page_options?.guidelineItems &&
      !!page_options?.guidelineItems?.length ? (
        <Guideline
          guidelineTitle={page_options?.guidelineTitle}
          guidelineDescription={page_options?.guidelineDescription}
          guidelineItems={page_options?.guidelineItems}
        />
      ) : (
        <NotFoundAlert message="Guidelines not found 🥹!" />
      )}

      {page_options?.faqItems && !!page_options?.faqItems?.length ? (
        <FaqSection
          faqTitle={page_options?.faqTitle}
          faqDescription={page_options?.faqDescription}
          faqItems={page_options?.faqItems}
        />
      ) : (
        <NotFoundAlert message="Faq not found 🥹!" />
      )}

      <Contact data={page_options?.contact} />

      {page_options?.sellerOpportunity ? (
        <SellerOpportunity dashboard={page_options?.sellerOpportunity} />
      ) : (
        <NotFoundAlert message="Seller opportunity not found 🥹!" />
      )}
    </>
  );
};

export { BecomeSeller };
