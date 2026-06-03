import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    ClipboardList,
    UserCheck,
    UsersRound,
} from 'lucide-react';

import './Dashboard.scss';
import { DashboardPanel } from '../../components/Dashboard/DashboardPanel/DashboardPanel';
import { EvolutionItem } from '../../components/Dashboard/EvolutionItem/EvolutionItem';
import { NotificationItem } from '../../components/Dashboard/NotificationItem/NotificationItem';
import { StatCard } from '../../components/Dashboard/StatCard/StatCard';
import { getClinicalEvolutions } from '../../services/clinicalEvolutions';
import { getNotifications } from '../../services/notifications';
import { getPatients } from '../../services/patients';
import { useToast } from '../../hooks/useToast';
import type { ClinicalEvolution } from '../../types/clinicalEvolution';
import type { Notification } from '../../types/notification';
import type { Patient } from '../../types/patient';
import { formatDateTime } from '../../utils/formatters';
import { usePreferences } from '../../hooks/usePreferences';
import { getNotificationText } from '../../utils/notificationText';

const attentionTones = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
} as const;

const priorityTones = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
} as const;

export function Dashboard() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { showToast } = useToast();
    const { t } = usePreferences();

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [patientsResponse, evolutionsResponse, notificationsResponse] = await Promise.all([
                    getPatients(),
                    getClinicalEvolutions(),
                    getNotifications(),
                ]);

                setPatients(patientsResponse.content);
                setEvolutions(evolutionsResponse.content);
                setNotifications(notificationsResponse.content);
            } catch {
                showToast({ message: t('dashboard.loadError'), type: 'error' });
            }
        }

        loadDashboard();
    }, [showToast, t]);

    const activePatients = useMemo(
        () => patients.filter((patient) => patient.active && patient.status === 'IN_FOLLOW_UP').length,
        [patients]
    );

    const unreadNotifications = useMemo(
        () => notifications.filter((notification) => !notification.readStatus).length,
        [notifications]
    );

    return (
        <div className="dashboard">
            <section className="dashboard__cards">
                <StatCard icon={<UsersRound size={22} />} label={t('dashboard.totalPatients')} tone="blue" value={String(patients.length)} />
                <StatCard icon={<UserCheck size={22} />} label={t('dashboard.activePatients')} tone="green" value={String(activePatients)} />
                <StatCard icon={<ClipboardList size={22} />} label={t('dashboard.evolutionsThisMonth')} tone="cyan" value={String(evolutions.length)} />
                <StatCard icon={<Bell size={22} />} label={t('dashboard.unreadNotifications')} tone="red" value={String(unreadNotifications)} />
            </section>

            <section className="dashboard__content">
                <DashboardPanel title={t('dashboard.recentEvolutions')}>
                    <div className="evolution-list">
                        {evolutions.slice(0, 4).map((evolution) => (
                            <EvolutionItem
                                attention={t(`priority.${evolution.attentionLevel}`)}
                                attentionLabel={t('evolution.attention')}
                                attentionTone={attentionTones[evolution.attentionLevel]}
                                date={formatDateTime(evolution.evolutionDate)}
                                key={evolution.id}
                                onClick={() => navigate(`/patients/${evolution.patientId}`)}
                                patient={evolution.patientName}
                                professional={evolution.professionalName ?? t('common.noProfessional')}
                                summary={evolution.summary || evolution.description}
                            />
                        ))}
                    </div>
                </DashboardPanel>

                <DashboardPanel title={t('dashboard.recentNotifications')}>
                    <div className="notification-list">
                        {notifications.slice(0, 4).map((notification) => {
                            const notificationText = getNotificationText(notification, t);

                            return (
                                <NotificationItem
                                    date={formatDateTime(notification.createdAt)}
                                    key={notification.id}
                                    onClick={() => navigate(notification.patientId ? `/patients/${notification.patientId}` : '/notifications')}
                                    patient={notification.patientName ?? t('common.noPatient')}
                                    priority={t(`priority.${notification.priority}`)}
                                    priorityTone={priorityTones[notification.priority]}
                                    title={notificationText.title}
                                />
                            );
                        })}
                    </div>
                </DashboardPanel>
            </section>
        </div>
    );
}
