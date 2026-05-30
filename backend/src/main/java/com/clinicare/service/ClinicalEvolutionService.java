package com.clinicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.clinicare.dto.request.ClinicalEvolutionRequestDTO;
import com.clinicare.dto.response.ClinicalEvolutionResponseDTO;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.mappers.ClinicalEvolutionMapper;
import com.clinicare.mappers.GenericMapper;
import com.clinicare.model.ClinicalEvolution;
import com.clinicare.model.Patient;
import com.clinicare.model.User;
import com.clinicare.repository.ClinicalEvolutionRepository;
import com.clinicare.repository.GenericRepository;
import com.clinicare.repository.PatientRepository;
import com.clinicare.repository.UserRepository;

@Service
public class ClinicalEvolutionService
        implements GenericService<ClinicalEvolution, ClinicalEvolutionRequestDTO, ClinicalEvolutionResponseDTO> {

    private final ClinicalEvolutionRepository clinicalEvolutionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ClinicalEvolutionMapper clinicalEvolutionMapper;
    private final NotificationService notificationService;

    public ClinicalEvolutionService(
            ClinicalEvolutionRepository clinicalEvolutionRepository,
            PatientRepository patientRepository,
            UserRepository userRepository,
            ClinicalEvolutionMapper clinicalEvolutionMapper,
            NotificationService notificationService) {
        this.clinicalEvolutionRepository = clinicalEvolutionRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.clinicalEvolutionMapper = clinicalEvolutionMapper;
        this.notificationService = notificationService;
    }

    @Override
    public GenericRepository<ClinicalEvolution> getRepository() {
        return clinicalEvolutionRepository;
    }

    @Override
    public GenericMapper<ClinicalEvolution, ClinicalEvolutionRequestDTO, ClinicalEvolutionResponseDTO> getMapper() {
        return clinicalEvolutionMapper;
    }

    @Override
    public ClinicalEvolutionResponseDTO create(ClinicalEvolutionRequestDTO request) {
        Patient patient = patientRepository.findByIdAndActiveTrue(request.patientId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Paciente não encontrado com id: " + request.patientId()));

        User professional = null;

        if (request.professionalId() != null) {
            professional = userRepository.findByIdAndActiveTrue(request.professionalId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Profissional não encontrado com id: " + request.professionalId()));
        }

        ClinicalEvolution evolution = clinicalEvolutionMapper.toEntity(request);
        evolution.setPatient(patient);
        evolution.setProfessional(professional);
        evolution.setActive(true);

        ClinicalEvolution savedEvolution = clinicalEvolutionRepository.save(evolution);

        notificationService.createFromClinicalEvolution(savedEvolution);

        return clinicalEvolutionMapper.toResponse(savedEvolution);
    }

    @Override
    public ClinicalEvolutionResponseDTO update(Long id, ClinicalEvolutionRequestDTO request) {
        ClinicalEvolution evolution = clinicalEvolutionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evolução clínica não encontrada com id: " + id));

        Patient patient = patientRepository.findByIdAndActiveTrue(request.patientId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Paciente não encontrado com id: " + request.patientId()));

        User professional = null;

        if (request.professionalId() != null) {
            professional = userRepository.findByIdAndActiveTrue(request.professionalId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Profissional não encontrado com id: " + request.professionalId()));
        }

        clinicalEvolutionMapper.updateEntityFromRequest(request, evolution);
        evolution.setPatient(patient);
        evolution.setProfessional(professional);

        ClinicalEvolution updatedEvolution = clinicalEvolutionRepository.save(evolution);

        return clinicalEvolutionMapper.toResponse(updatedEvolution);
    }

    public Page<ClinicalEvolutionResponseDTO> findByPatient(Long patientId, Pageable pageable) {
        return clinicalEvolutionRepository
                .findAllByPatient_IdAndActiveTrue(patientId, pageable)
                .map(clinicalEvolutionMapper::toResponse);
    }

    public Page<ClinicalEvolutionResponseDTO> findByProfessional(Long professionalId, Pageable pageable) {
        return clinicalEvolutionRepository
                .findAllByProfessional_IdAndActiveTrue(professionalId, pageable)
                .map(clinicalEvolutionMapper::toResponse);
    }
}