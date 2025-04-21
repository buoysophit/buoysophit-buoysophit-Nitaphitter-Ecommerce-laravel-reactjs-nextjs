import {
  BecomeSeller,
  BecomeSellerInput,
  BecomeSellerOptionsInput,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { crudFactory } from '@/data/client/curd-factory';
import { HttpClient } from '@/data/client/http-client';

export const becomeSellerClient = {
  ...crudFactory<BecomeSeller, any, BecomeSellerOptionsInput>(
    API_ENDPOINTS.BECAME_SELLER,
  ),
  all({ language }: { language: string }) {
    return HttpClient.get<BecomeSeller>(API_ENDPOINTS.BECAME_SELLER, {
      language,
    });
  },
  update: ({ ...data }: BecomeSellerInput) => {
    return HttpClient.post<BecomeSeller>(API_ENDPOINTS.BECAME_SELLER, {
      ...data,
    });
  },
};
