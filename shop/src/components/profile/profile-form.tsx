import Button from '@components/ui/button';
import FileInput from '@components/ui/file-input';
import { Form } from '@components/ui/forms/form';
import Input from '@components/ui/input';
import TextArea from '@components/ui/text-area';
import { useUpdateUser } from '@framework/auth';
import type { UpdateUserInput, User } from '@type/index';
import pick from 'lodash/pick';
import { useTranslation } from 'next-i18next';

const ProfileForm = ({ user }: { user: User }) => {
  const { t } = useTranslation('common');
  const { mutate: updateProfile, isLoading } = useUpdateUser();

  function onSubmit(values: UpdateUserInput) {
    if (!user) {
      return false;
    }
    updateProfile({
      id: user.id,
      name: values.name,
      profile: {
        id: user?.profile?.id,
        bio: values?.profile?.bio ?? '',
        //@ts-ignore
        avatar: values?.profile?.avatar?.[0],
      },
    });
  }

  return (
    <Form<UpdateUserInput>
      onSubmit={onSubmit}
      useFormProps={{
        ...(user && {
          defaultValues: pick(user, ['name', 'profile.bio', 'profile.avatar']),
        }),
      }}
    >
      {({ register, control }) => (
        <>
          <div className="mb-8">
            <FileInput control={control} name="profile.avatar" />
          </div>

          <div className="mb-6 flex flex-row">
            <Input
              className="flex-1"
              labelKey={t('text-name')}
              {...register('name')}
              variant="outline"
              inputClassName="h-12"
            />
          </div>

          <TextArea
            labelKey={t('text-bio')}
            //@ts-ignore
            {...register('profile.bio')}
            variant="outline"
            className="mb-6"
          />

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

export default ProfileForm;
