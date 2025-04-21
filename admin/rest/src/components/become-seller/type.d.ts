import { BecomeSellerInput } from '@/types';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

export interface BecomeSellerFormProps {
  register: UseFormRegister<BecomeSellerInput>;
  control: Control<BecomeSellerInput, any>;
  errors: FieldErrors<BecomeSellerInput>;
  max_fileSize?: number;
  watch?: UseFormWatch<BecomeSellerInput>;
  isMultiCommissionRate?: boolean;
  commissions?: BecomeSellerInput['commissions'];
}
