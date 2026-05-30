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

const recentEvolutions = [
    {
        patient: 'Maria Silva',
        date: '28/05/2026',
        professional: 'Dra. Ana Costa',
        summary: 'Melhora parcial dos sintomas ansiosos.',
        attention: 'Médio',
    },
    {
        patient: 'João Pereira',
        date: '25/05/2026',
        professional: 'Dr. Pedro Henrique',
        summary: 'Piora do quadro depressivo com ideação passiva.',
        attention: 'Alto',
    },
    {
        patient: 'Clara Nogueira',
        date: '20/05/2026',
        professional: 'Dra. Mariana Lopes',
        summary: 'Início de acompanhamento por estresse ocupacional.',
        attention: 'Baixo',
    },
    {
        patient: 'Maria Silva',
        date: '14/05/2026',
        professional: 'Dra. Ana Costa',
        summary: 'Boa adesão ao tratamento.',
        attention: 'Baixo',
    },
];

const recentNotifications = [
    {
        title: 'Nova evolução clínica registrada',
        patient: 'Maria Silva',
        date: '28/05/2026, 07:30',
        priority: 'Média',
    },
    {
        title: 'Evolução de alta prioridade',
        patient: 'João Pereira',
        date: '25/05/2026, 12:00',
        priority: 'Alta',
    },
    {
        title: 'Paciente sem evolução recente',
        patient: 'Roberto Souza',
        date: '22/05/2026, 06:00',
        priority: 'Baixa',
    },
    {
        title: 'Nova evolução clínica registrada',
        patient: 'Clara Nogueira',
        date: '20/05/2026, 11:00',
        priority: 'Baixa',
    },
];

export function Dashboard() {
    return (
        <div className="dashboard">
            <section className="dashboard__cards">
                <StatCard icon={<UsersRound size={22} />} label="Total de pacientes" tone="blue" value="5" />
                <StatCard icon={<UserCheck size={22} />} label="Pacientes ativos" tone="green" value="3" />
                <StatCard icon={<ClipboardList size={22} />} label="Evoluções no mês" tone="cyan" value="4" />
                <StatCard icon={<Bell size={22} />} label="Notificações não lidas" tone="red" value="3" />
            </section>

            <section className="dashboard__content">
                <DashboardPanel title="Últimas evoluções clínicas">
                    <div className="evolution-list">
                        {recentEvolutions.map((evolution, index) => (
                            <EvolutionItem key={`${evolution.patient}-${index}`} {...evolution} />
                        ))}
                    </div>
                </DashboardPanel>

                <DashboardPanel title="Notificações recentes">
                    <div className="notification-list">
                        {recentNotifications.map((notification, index) => (
                            <NotificationItem key={`${notification.title}-${index}`} {...notification} />
                        ))}
                    </div>
                </DashboardPanel>
            </section>
        </div>
    );
}
