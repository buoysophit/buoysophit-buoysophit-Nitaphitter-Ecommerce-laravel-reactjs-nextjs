import ContactForm from '@components/common/form/contact-form';
import SectionHeading from '@components/ui/section-heading';
import { useContact } from '@framework/contact';
import { cn } from '@lib/cn';
import { ContactFormValues } from '@type/index';
import React from 'react';

type ContactProps = {
  className?: string;
  data?: {
    title?: string;
    description?: string;
  };
};

export default function Contact({ className, data }: ContactProps) {
  const { mutate, isLoading } = useContact();

  async function onSubmit(values: ContactFormValues) {
    await mutate(values);
  }
  return (
    <section className={cn('pb-20 bg-white', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        {data?.title ? (
          <SectionHeading title={data?.title} subtitle={data?.description} />
        ) : null}
        <div className="max-w-[1000px] mx-auto">
        <ContactForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
