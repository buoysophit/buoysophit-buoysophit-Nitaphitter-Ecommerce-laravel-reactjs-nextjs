import { useRouter } from "next/router";
import { useOrder } from "@framework/orders";
import Spinner from "@components/ui/loaders/spinner/spinner";
import OrderView from "@components/orders/order-view";
import Divider from "@components/ui/divider";
import Subscription from "@components/common/subscription";
import Container from "@components/ui/container";

export default function OldOrder() {
  const { query } = useRouter();
  const { data, isLoading } = useOrder({
    tracking_number: query.tracking_number as string,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner showText={false} />
      </div>
    );
  }

  return (
    <>
      <Divider />
      <Container>
        <OrderView order={data} loadingStatus={isLoading} />
        <Subscription />
      </Container>
    </>
  );
}
