type ContactInfoBlockProps = {
  children: React.ReactNode;
  title: string;
  data: string;
};

const ContactInfoItem: React.FC<ContactInfoBlockProps> = ({
  children,
  title,
  data,
}) => {
  return (
    <div className="flex pb-7">
      <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
        {children}
      </div>
      <div className="flex flex-col ltr:pl-3 ltr:2xl:pl-4 rtl:pr-3 rtl:2xl:pr-4 text-sm md:text-base">
        <h5 className="text-sm font-bold text-heading">{title}</h5>
        {data}
      </div>
    </div>
  );
};

export default ContactInfoItem;
