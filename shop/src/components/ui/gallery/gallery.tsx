import { GalleryIcon } from '@components/icons/gallery';
import { useUI } from '@contexts/ui.context';
import { Attachment } from '@type/index';
import { useCallback } from 'react';

type GalleryProps = {
  gallery: Attachment[];
};

const Gallery: React.FC<GalleryProps> = ({ gallery }) => {
  const { closeModal, openModal, setModalView, setModalData } = useUI();

  const navigateToGallery = useCallback(() => {
    closeModal();
    setTimeout(() => {
      setModalView('GALLERY_VIEW');
      setModalData(gallery);
      return openModal();
    }, 300);
  }, []);

  return (
    <div
      onClick={navigateToGallery}
      className="bg-white w-9 h-9 border-none shadow-variationButton text-black text-base rounded-full flex cursor-pointer"
    >
      <GalleryIcon className="m-auto" />
    </div>
  );
};

export default Gallery;
