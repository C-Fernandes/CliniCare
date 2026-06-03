import type { Notification } from '../types/notification';

type Translate = (key: string, options?: Record<string, unknown>) => string;

export function getNotificationText(notification: Notification, t: Translate) {
    const patientName = notification.patientName ?? t('common.noPatient');
    const titleKey = `notifications.types.${notification.type}.title`;
    const messageKey = `notifications.types.${notification.type}.message`;
    const options = { patientName };

    return {
        title: t(titleKey, options),
        message: t(messageKey, options),
    };
}
