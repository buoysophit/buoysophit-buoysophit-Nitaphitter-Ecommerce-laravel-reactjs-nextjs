import Button from '@components/ui/button';
import { Form } from '@components/ui/forms/form';
import Input from '@components/ui/input';
import { useUpdateEmail } from '@framework/auth';
import type { UpdateEmailUserInput, User } from '@type/index';
import pick from 'lodash/pick';
import { useTranslation } from 'next-i18next';

const ProfileUpdateEmail = ({ user }: { user: User }) => {
  const { t } = useTranslation('common');
  const { mutate: updateEmail, isLoading } = useUpdateEmail();

  function onSubmit(values: UpdateEmailUserInput) {
    if (!user) {
      return;
    }
    updateEmail({
      email: values?.email,
    });
  }

  return (
    <Form<UpdateEmailUserInput>
      onSubmit={onSubmit}
      useFormProps={{
        ...(user && {
          defaultValues: pick(user, ['email']),
        }),
      }}
    >
      {({ register }) => (
        <>
          <div className="mb-6">
            <Input
              className="flex-1"
              labelKey={t('text-email')}
              inputClassName="h-12"
              {...register('email')}
              variant="outline"
              disabled={!!isLoading}
            />
          </div>

          <div className="flex">
            <Button
              className="ltr:ml-auto rtl:mr-auto"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('text-save')}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default ProfileUpdateEmail;
