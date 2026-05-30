export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type NotificationType =
    | 'CLINICAL_EVOLUTION_CREATED'
    | 'HIGH_ATTENTION_EVOLUTION'
    | 'PATIENT_WITHOUT_RECENT_EVOLUTION';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    readStatus: boolean;
    patientId: number | null;
    patientName: string | null;
    recipientId: number | null;
    recipientName: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
}
