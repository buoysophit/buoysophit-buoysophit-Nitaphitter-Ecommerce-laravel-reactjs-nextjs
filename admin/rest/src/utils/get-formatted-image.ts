import { IImage } from '@/types';

export function getFormattedImage(image: IImage) {
  if (!image) return null;
  const { __typename, ...rest } = image;
  return { ...rest };
}
