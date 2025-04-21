export type FormValues = {
  admin_commission_rate: number;
  isCustomCommission: boolean;
};

export type MultiCommissionProps = {
  data: {
    content: string;
    enable: boolean;
    quote: number;
  };
  onSubmit: ({ admin_commission_rate, isCustomCommission }: FormValues) => void;
  loading: boolean;
  creating: boolean;
  createAConversations: () => void;
};
