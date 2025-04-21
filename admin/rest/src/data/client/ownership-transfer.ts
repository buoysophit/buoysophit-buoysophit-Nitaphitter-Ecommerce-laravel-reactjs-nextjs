import {
  OwnershipTransfer,
  OwnershipTransferInput,
  OwnershipTransferPaginator,
  OwnershipTransferQueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const ownershipTransferClient = {
  ...crudFactory<OwnershipTransfer, any, OwnershipTransferInput>(
    API_ENDPOINTS.OWNERSHIP_TRANSFER,
  ),
  all: ({
    transaction_identifier,
    shop_id,
    ...params
  }: Partial<OwnershipTransferQueryOptions> = {}) =>
    HttpClient.get<OwnershipTransferPaginator>(
      API_ENDPOINTS.OWNERSHIP_TRANSFER,
      {
        searchJoin: 'and',
        shop_id: shop_id,
        ...params,
      },
    ),
  get({
    transaction_identifier,
    language,
    shop_id,
    request_view_type,
  }: {
    transaction_identifier: string;
    language: string;
    shop_id?: string;
    request_view_type?: string;
  }) {
    return HttpClient.get<OwnershipTransfer>(
      `${API_ENDPOINTS.OWNERSHIP_TRANSFER}/${transaction_identifier}`,
      {
        language,
        shop_id,
        transaction_identifier,
        request_view_type,
      },
    );
  },
  paginated: ({
    transaction_identifier,
    shop_id,
    ...params
  }: Partial<OwnershipTransferQueryOptions>) => {
    return HttpClient.get<OwnershipTransferPaginator>(
      API_ENDPOINTS.OWNERSHIP_TRANSFER,
      {
        searchJoin: 'and',
        shop_id: shop_id,
        ...params,
        search: HttpClient.formatSearchParams({ transaction_identifier }),
      },
    );
  },
  approve: (variables: { variables: string }) => {
    return HttpClient.post<any>(API_ENDPOINTS.OWNERSHIP_TRANSFER, variables);
  },
  disapprove: (variables: { variables: string }) => {
    return HttpClient.post<{ id: string }>(
      API_ENDPOINTS.OWNERSHIP_TRANSFER,
      variables,
    );
  },
};
