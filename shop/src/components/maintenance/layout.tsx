import MaintenanceMode from '@components/maintenance';
import ErrorMessage from '@components/ui/error-message';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useSettings } from '@framework/settings';
import { adminOnly, getAuthCredentials, hasAccess } from '@lib/auth-utils';
import {
  NEWSLETTER_POPUP_MODAL_KEY,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
} from '@lib/constants';
import { eachDayOfInterval, isTomorrow } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useUI } from '@contexts/ui.context';

type MaintenanceProps = {
  children: React.ReactNode;
};

export const isInArray = (array: Date[], value: Date) => {
  return !!array?.find((item) => {
    return item?.getDate() == value?.getDate();
  });
};

const Maintenance = ({ children }: MaintenanceProps) => {
  const { data: settings, isLoading: settingLoading, error } = useSettings();
  const { openModal, setModalView, setModalData } = useUI();
  const [_, setUnderMaintenanceIsComing] = useAtom(
    checkIsMaintenanceModeComing,
  );
  const [underMaintenanceStart, setUnderMaintenanceStart] = useAtom(
    checkIsMaintenanceModeStart,
  );

  const { permissions } = getAuthCredentials();
  const AccessAdminRoles = hasAccess(adminOnly, permissions);

  // Use useMemo to avoid recomputing the date interval on every render
  const dateInterVal = useMemo(() => {
    if (
      settings?.options?.maintenance?.start &&
      settings?.options?.maintenance?.until
    ) {
      return eachDayOfInterval({
        start: new Date(settings?.options?.maintenance?.start),
        end: new Date(settings?.options?.maintenance?.until),
      });
    }
    return [];
  }, [
    settings?.options?.maintenance?.start,
    settings?.options?.maintenance?.until,
  ]);

  // Use useCallback to avoid creating new functions on every render
  const handleMaintenanceCheck = useCallback(() => {
    if (dateInterVal.length > 0) {
      const beforeDay = isTomorrow(
        new Date(settings?.options?.maintenance?.start as string),
      );
      setUnderMaintenanceStart(
        isInArray(dateInterVal, new Date()) &&
          settings?.options?.isUnderMaintenance,
      );
      setUnderMaintenanceIsComing(
        beforeDay && settings?.options?.isUnderMaintenance,
      );
    }
  }, [
    dateInterVal,
    settings?.options?.isUnderMaintenance,
    settings?.options?.maintenance?.start,
  ]);

  // Use useEffect to run the maintenance check only once
  useEffect(() => {
    handleMaintenanceCheck();
  }, [handleMaintenanceCheck]);

  let seenPopup = Cookies.get(NEWSLETTER_POPUP_MODAL_KEY);

  // Use useCallback to avoid creating new functions on every render
  const handlePromoPopup = useCallback(() => {
    if (
      Boolean(settings?.options?.isPromoPopUp) &&
      !underMaintenanceStart &&
      !AccessAdminRoles &&
      !Boolean(seenPopup)
    ) {
      let timer = setTimeout(
        () => {
          setModalData({
            isLoading: settingLoading,
            popupData: settings?.options?.promoPopup,
          });
          setModalView('PROMO_POPUP_MODAL');
          return openModal();
        },
        Number(settings?.options?.promoPopup?.popUpDelay),
      );
      return () => clearTimeout(timer);
    }
  }, [
    settings?.options?.isPromoPopUp,
    settings?.options?.promoPopup?.popUpDelay,
    underMaintenanceStart,
    AccessAdminRoles,
    settingLoading,
    seenPopup,
  ]);

  // Use useEffect to run the promo popup only once
  useEffect(() => {
    handlePromoPopup();
  }, [handlePromoPopup]);

  if (settingLoading) {
    return <Spinner />;
  }

  if (error) return <ErrorMessage message={error.message} />;

  if (underMaintenanceStart && !AccessAdminRoles) {
    return <MaintenanceMode />;
  }

  return children;
};

export default Maintenance;
