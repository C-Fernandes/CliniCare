BEGIN;

TRUNCATE TABLE password_reset_tokens, notifications, clinical_evolutions, patients, users RESTART IDENTITY CASCADE;

INSERT INTO users (id, active, created_at, updated_at, name, email, password, role, approval_status) VALUES
    (1, true, CURRENT_TIMESTAMP - INTERVAL '120 days', NULL, 'Administrador CliniCare', 'admin@clinicare.local', '$2a$10$HSgXo.goiLqMB7gqYp444uBnJQkAkvUy6n04rE5mv2BxetE.g65oW', 'ADMIN', 'APPROVED'),
    (2, true, CURRENT_TIMESTAMP - INTERVAL '95 days', NULL, 'Dra. Marina Costa', 'profissional@clinicare.local', '$2a$10$gtUz/qrPvGKD4GN0cEcVvOUwrNIJ8WFK73HyyNx3T3xaJHi/altHG', 'PROFESSIONAL', 'APPROVED'),
    (3, true, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, 'Dra. Mariana Lopes', 'mariana.lopes@clinicare.local', '$2a$10$gtUz/qrPvGKD4GN0cEcVvOUwrNIJ8WFK73HyyNx3T3xaJHi/altHG', 'PROFESSIONAL', 'PENDING');

INSERT INTO patients (id, active, created_at, updated_at, name, cpf, birth_date, phone, email, status, notes) VALUES
    (1, true, CURRENT_TIMESTAMP - INTERVAL '92 days', NULL, 'Ana Beatriz Lima', '111.222.333-01', DATE '1986-03-14', '(85) 99911-2201', 'ana.lima@example.com', 'IN_FOLLOW_UP', 'Acompanhamento periódico. Manter registro de pressão arterial.'),
    (2, true, CURRENT_TIMESTAMP - INTERVAL '88 days', NULL, 'Carlos Eduardo Mendes', '111.222.333-02', DATE '1971-11-08', '(85) 99911-2202', 'carlos.mendes@example.com', 'URGENT', 'Paciente sinalizado para retorno prioritário.'),
    (3, true, CURRENT_TIMESTAMP - INTERVAL '80 days', NULL, 'Fernanda Rocha Alves', '111.222.333-03', DATE '1993-06-21', '(85) 99911-2203', 'fernanda.alves@example.com', 'IN_FOLLOW_UP', 'Evolução favorável após ajuste de rotina.'),
    (4, true, CURRENT_TIMESTAMP - INTERVAL '76 days', NULL, 'João Pedro Nascimento', '111.222.333-04', DATE '1965-09-30', '(85) 99911-2204', 'joao.nascimento@example.com', 'IN_FOLLOW_UP', 'Acompanhamento contínuo com atenção aos sintomas relatados.'),
    (5, true, CURRENT_TIMESTAMP - INTERVAL '67 days', NULL, 'Larissa Gomes Freitas', '111.222.333-05', DATE '2001-02-12', '(85) 99911-2205', 'larissa.freitas@example.com', 'DISCHARGED', 'Alta registrada após melhora sustentada.'),
    (6, true, CURRENT_TIMESTAMP - INTERVAL '61 days', NULL, 'Marcos Vinícius Souza', '111.222.333-06', DATE '1980-08-17', '(85) 99911-2206', 'marcos.souza@example.com', 'PAUSED', 'Acompanhamento pausado a pedido do paciente.'),
    (7, true, CURRENT_TIMESTAMP - INTERVAL '55 days', NULL, 'Patrícia Oliveira Reis', '111.222.333-07', DATE '1978-12-04', '(85) 99911-2207', 'patricia.reis@example.com', 'IN_FOLLOW_UP', 'Manter retornos mensais.'),
    (8, true, CURRENT_TIMESTAMP - INTERVAL '43 days', NULL, 'Rafael Martins Duarte', '111.222.333-08', DATE '1989-04-25', '(85) 99911-2208', 'rafael.duarte@example.com', 'URGENT', 'Necessita reavaliação clínica em curto prazo.'),
    (9, true, CURRENT_TIMESTAMP - INTERVAL '38 days', NULL, 'Sofia Carvalho Ribeiro', '111.222.333-09', DATE '1997-07-16', '(85) 99911-2209', 'sofia.ribeiro@example.com', 'IN_FOLLOW_UP', 'Sem intercorrências recentes.'),
    (10, true, CURRENT_TIMESTAMP - INTERVAL '31 days', NULL, 'Tiago Araújo Barbosa', '111.222.333-10', DATE '1959-01-28', '(85) 99911-2210', 'tiago.barbosa@example.com', 'IN_FOLLOW_UP', 'Acompanhar adesão às orientações.'),
    (11, true, CURRENT_TIMESTAMP - INTERVAL '24 days', NULL, 'Vanessa Moreira Campos', '111.222.333-11', DATE '1983-10-10', '(85) 99911-2211', 'vanessa.campos@example.com', 'PAUSED', 'Retorno suspenso temporariamente por viagem.'),
    (12, true, CURRENT_TIMESTAMP - INTERVAL '18 days', NULL, 'William Castro Pereira', '111.222.333-12', DATE '1974-05-05', '(85) 99911-2212', 'william.pereira@example.com', 'DISCHARGED', 'Alta após conclusão do acompanhamento.');

INSERT INTO clinical_evolutions (id, active, created_at, updated_at, attention_level, conduct, description, evolution_date, summary, patient_id, professional_id) VALUES
    (1, true, CURRENT_TIMESTAMP - INTERVAL '18 days', NULL, 'LOW', 'Manter orientações e retorno em 30 dias.', 'Paciente relata melhora gradual e boa adesão às orientações.', CURRENT_TIMESTAMP - INTERVAL '18 days', 'Melhora gradual com boa adesão ao acompanhamento.', 1, 2),
    (2, true, CURRENT_TIMESTAMP - INTERVAL '3 days', NULL, 'MEDIUM', 'Solicitado monitoramento domiciliar e retorno antecipado.', 'Paciente apresentou oscilação da pressão arterial durante a última semana.', CURRENT_TIMESTAMP - INTERVAL '3 days', 'Oscilação de pressão arterial requer monitoramento próximo.', 1, 2),
    (3, true, CURRENT_TIMESTAMP - INTERVAL '12 days', NULL, 'HIGH', 'Orientado retorno prioritário e avaliação complementar.', 'Paciente relata piora dos sintomas e episódios recorrentes de desconforto.', CURRENT_TIMESTAMP - INTERVAL '12 days', 'Piora dos sintomas com necessidade de avaliação prioritária.', 2, 2),
    (4, true, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, 'HIGH', 'Mantida prioridade de atendimento e reforçadas orientações.', 'Persistência de sintomas apesar das medidas iniciais adotadas.', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Sintomas persistentes mantêm nível alto de atenção.', 2, 2),
    (5, true, CURRENT_TIMESTAMP - INTERVAL '16 days', NULL, 'LOW', 'Manter rotina atual e retorno regular.', 'Paciente sem novas queixas e com evolução satisfatória.', CURRENT_TIMESTAMP - INTERVAL '16 days', 'Evolução satisfatória sem novas queixas.', 3, 2),
    (6, true, CURRENT_TIMESTAMP - INTERVAL '7 days', NULL, 'LOW', 'Acompanhar sintomas e manter registro diário.', 'Paciente estável, relatando melhora no sono e disposição.', CURRENT_TIMESTAMP - INTERVAL '7 days', 'Paciente estável com melhora de sono e disposição.', 4, 2),
    (7, true, CURRENT_TIMESTAMP - INTERVAL '29 days', NULL, 'LOW', 'Registrada alta e orientações gerais.', 'Quadro estável e sem necessidade de novos retornos programados.', CURRENT_TIMESTAMP - INTERVAL '29 days', 'Alta registrada após estabilização do quadro.', 5, 2),
    (8, true, CURRENT_TIMESTAMP - INTERVAL '22 days', NULL, 'MEDIUM', 'Pausar acompanhamento e retomar contato em 60 dias.', 'Paciente solicitou pausa temporária no acompanhamento.', CURRENT_TIMESTAMP - INTERVAL '22 days', 'Acompanhamento pausado temporariamente.', 6, 2),
    (9, true, CURRENT_TIMESTAMP - INTERVAL '10 days', NULL, 'LOW', 'Manter acompanhamento mensal.', 'Sem intercorrências desde o último retorno.', CURRENT_TIMESTAMP - INTERVAL '10 days', 'Sem intercorrências recentes.', 7, 2),
    (10, true, CURRENT_TIMESTAMP - INTERVAL '5 days', NULL, 'MEDIUM', 'Antecipar retorno e monitorar sinais relatados.', 'Paciente relata cansaço acima do habitual nos últimos dias.', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Cansaço recente exige acompanhamento mais próximo.', 7, 2),
    (11, true, CURRENT_TIMESTAMP - INTERVAL '9 days', NULL, 'HIGH', 'Agendada reavaliação em curto prazo.', 'Paciente apresenta piora recente e necessita reavaliação.', CURRENT_TIMESTAMP - INTERVAL '9 days', 'Piora recente requer reavaliação em curto prazo.', 8, 2),
    (12, true, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, 'HIGH', 'Mantido acompanhamento prioritário.', 'Sintomas permanecem com intensidade relevante.', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Persistência dos sintomas mantém atenção alta.', 8, 2),
    (13, true, CURRENT_TIMESTAMP - INTERVAL '6 days', NULL, 'LOW', 'Manter orientações atuais.', 'Paciente relata boa adaptação e ausência de novas queixas.', CURRENT_TIMESTAMP - INTERVAL '6 days', 'Boa adaptação sem novas queixas.', 9, 2),
    (14, true, CURRENT_TIMESTAMP - INTERVAL '4 days', NULL, 'MEDIUM', 'Reforçar orientações e revisar no próximo retorno.', 'Paciente informa adesão parcial às orientações recomendadas.', CURRENT_TIMESTAMP - INTERVAL '4 days', 'Adesão parcial exige reforço das orientações.', 10, 2),
    (15, true, CURRENT_TIMESTAMP - INTERVAL '20 days', NULL, 'LOW', 'Acompanhamento pausado conforme solicitação.', 'Pausa temporária registrada sem intercorrências.', CURRENT_TIMESTAMP - INTERVAL '20 days', 'Pausa registrada sem intercorrências.', 11, 2),
    (16, true, CURRENT_TIMESTAMP - INTERVAL '15 days', NULL, 'LOW', 'Registrada alta e recomendações gerais.', 'Paciente finalizou acompanhamento com evolução positiva.', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Alta após evolução positiva.', 12, 2);

INSERT INTO notifications (id, active, created_at, updated_at, message, priority, read_status, title, type, patient_id, recipient_id) VALUES
    (1, true, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, 'Uma evolução clínica de alta prioridade foi registrada para o paciente Carlos Eduardo Mendes.', 'HIGH', false, 'Evolução clínica de alta prioridade', 'HIGH_ATTENTION_EVOLUTION', 2, 2),
    (2, true, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, 'Uma evolução clínica de alta prioridade foi registrada para o paciente Rafael Martins Duarte.', 'HIGH', false, 'Evolução clínica de alta prioridade', 'HIGH_ATTENTION_EVOLUTION', 8, 2),
    (3, true, CURRENT_TIMESTAMP - INTERVAL '3 days', NULL, 'Uma nova evolução clínica foi registrada para a paciente Ana Beatriz Lima.', 'MEDIUM', false, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 1, 2),
    (4, true, CURRENT_TIMESTAMP - INTERVAL '4 days', NULL, 'Uma nova evolução clínica foi registrada para o paciente Tiago Araújo Barbosa.', 'MEDIUM', false, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 10, 2),
    (5, true, CURRENT_TIMESTAMP - INTERVAL '5 days', NULL, 'Uma nova evolução clínica foi registrada para a paciente Patrícia Oliveira Reis.', 'MEDIUM', true, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 7, 2),
    (6, true, CURRENT_TIMESTAMP - INTERVAL '6 days', NULL, 'Uma nova evolução clínica foi registrada para a paciente Sofia Carvalho Ribeiro.', 'LOW', true, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 9, 2),
    (7, true, CURRENT_TIMESTAMP - INTERVAL '9 days', NULL, 'Uma evolução clínica de alta prioridade foi registrada para o paciente Rafael Martins Duarte.', 'HIGH', true, 'Evolução clínica de alta prioridade', 'HIGH_ATTENTION_EVOLUTION', 8, 2),
    (8, true, CURRENT_TIMESTAMP - INTERVAL '10 days', NULL, 'Uma nova evolução clínica foi registrada para a paciente Patrícia Oliveira Reis.', 'MEDIUM', true, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 7, 2),
    (9, true, CURRENT_TIMESTAMP - INTERVAL '12 days', NULL, 'Uma evolução clínica de alta prioridade foi registrada para o paciente Carlos Eduardo Mendes.', 'HIGH', true, 'Evolução clínica de alta prioridade', 'HIGH_ATTENTION_EVOLUTION', 2, 2),
    (10, true, CURRENT_TIMESTAMP - INTERVAL '14 days', NULL, 'Paciente sem evolução recente registrada. Avaliar necessidade de contato.', 'LOW', false, 'Paciente sem evolução recente', 'PATIENT_WITHOUT_RECENT_EVOLUTION', 6, 2),
    (11, true, CURRENT_TIMESTAMP - INTERVAL '15 days', NULL, 'Uma nova evolução clínica foi registrada para o paciente William Castro Pereira.', 'LOW', true, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 12, 2),
    (12, true, CURRENT_TIMESTAMP - INTERVAL '16 days', NULL, 'Uma nova evolução clínica foi registrada para a paciente Fernanda Rocha Alves.', 'LOW', true, 'Nova evolução clínica registrada', 'CLINICAL_EVOLUTION_CREATED', 3, 2);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('patients', 'id'), (SELECT MAX(id) FROM patients));
SELECT setval(pg_get_serial_sequence('clinical_evolutions', 'id'), (SELECT MAX(id) FROM clinical_evolutions));
SELECT setval(pg_get_serial_sequence('notifications', 'id'), (SELECT MAX(id) FROM notifications));

COMMIT;
