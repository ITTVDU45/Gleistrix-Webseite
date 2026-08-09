import type { NotificationTemplate } from "@/types/admin";

import { COLLECTIONS, repository } from "./collections";

/** Vorlagen für Kunden- und Nutzerbenachrichtigungen. */
const templates = repository<NotificationTemplate>(COLLECTIONS.notificationTemplates, {
  updatedAt: -1,
});

export const listNotificationTemplates = templates.list;
export const getNotificationTemplate = templates.get;
export const insertNotificationTemplate = templates.insert;
export const insertNotificationTemplates = templates.insertMany;
export const patchNotificationTemplate = templates.patch;
export const removeNotificationTemplate = templates.remove;
export const notificationTemplatesEmpty = templates.isEmpty;
