import TextArea from '@components/ui/text-area';
import { orderNoteAtom } from '@store/checkout';
import { useAtom } from 'jotai';

interface OrderNoteProps {
  count: number;
  label: string;
  className: string;
}

function OrderNote({ count, label, className }: OrderNoteProps) {
  const [note, setNote] = useAtom(orderNoteAtom);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5 lg:mb-6 xl:mb-7 -mt-1 xl:-mt-2">
        <div className="flex items-center gap-3 md:gap-4 text-lg lg:text-xl text-heading capitalize font-medium">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-heading text-base text-white lg:text-xl">
              {count}
            </span>
          )}
          {label}
        </div>
      </div>
      <div className="block">
        <TextArea
          //@ts-ignore
          value={note}
          name="orderNote"
          onChange={(e) => setNote(e.target.value)}
          variant="outline"
        />
      </div>
    </div>
  );
}

export default OrderNote;
