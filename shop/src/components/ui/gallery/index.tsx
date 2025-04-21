import Container from '@components/ui/container';
import { Attachment } from '@type/index';
import { useUI } from '@contexts/ui.context';
import { ChevronForward } from '@components/icons/chevron-forward';
import { useState } from 'react';
import ImageGallerySlider from '@components/ui/gallery/image-gallery-slider';
import Image from 'next/image';

const GalleryModal = ({ data }: { data: Attachment[] }) => {
  const { closeModal } = useUI();

  const [sliderOpen, setSliderOpen] = useState<boolean>(false);
  const [initialSlide, setInitialSlide] = useState<number>(0);

  const handleClick = (index: number) => {
    setSliderOpen(true);
    setInitialSlide(index);
  };

  return (
    <>
      <div className="bg-white h-full">
        <div className="h-screen w-screen overflow-y-auto bg-gray-50 pb-20">
          <div className="sticky top-0 left-0 z-10 border-b-[1px] border-b-gray-200 bg-white py-8">
            <Container>
              <div className="flex items-center justify-between text-black">
                <button onClick={() => closeModal()}>
                  <ChevronForward className="h-4 w-4 rotate-180" />
                </button>
                <h3 className="text-xl font-semibold">Product Gallery</h3>
                <span></span>
              </div>
            </Container>
          </div>
          <div>
            <Container className="!max-w-5xl pt-16">
              <div className="md:columns-2 columns-1 gap-x-2 lg:gap-x-3">
                {data?.map((img: Attachment, index: number) => (
                  <div
                    key={`gallery-img-${img?.id}`}
                    onClick={() => handleClick(index)}
                    className="group relative mb-2 flex cursor-pointer items-center justify-center  overflow-hidden rounded-md bg-white shadow-sm transition-all duration-300 md:rounded-[10px] lg:mb-3"
                  >
                    <Image
                      src={img?.original as string}
                      width={500}
                      height={300}
                      sizes="100vw"
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      alt="product-image"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </div>
      <ImageGallerySlider
        images={data}
        sliderOpen={sliderOpen}
        setSliderOpen={setSliderOpen}
        initialSlide={initialSlide}
        setInitialSlide={setInitialSlide}
      />
    </>
  );
};

export default GalleryModal;
