import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { useMutation, useQuery } from 'react-query';
import { SettingsResponse } from '@type/index';
import client from '@framework/utils/index';
import { useRouter } from 'next/router';
import { SettingsQueryOptions } from '@type/index';
import { useState } from 'react';
import { getPreviewImage } from '@lib/get-preview-image';
import { FileWithPath } from 'react-dropzone';

export const useSettings = () => {
  const { locale } = useRouter();

  return useQuery<SettingsResponse, Error>(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) =>
      client.settings.findAll(queryKey[1] as SettingsQueryOptions)
  );
};

export const useUploads = ({ onChange, defaultFiles }: any) => {
  const [files, setFiles] = useState<FileWithPath[]>(
    getPreviewImage(defaultFiles)
  );

  const { mutate: upload, isLoading } = useMutation(client.settings.upload, {
    onSuccess: (data) => {
      if (onChange) {
        const dataAfterRemoveTypename = data?.map(
          ({ __typename, ...rest }: any) => rest
        );
        onChange(dataAfterRemoveTypename);
        setFiles(getPreviewImage(dataAfterRemoveTypename));
      }
    },
  });

  function handleSubmit(data: File[]) {
    upload(data);
  }

  return { mutate: handleSubmit, isLoading, files };
};