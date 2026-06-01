package com.clinicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;

import com.clinicare.dto.request.PatientRequestDTO;
import com.clinicare.dto.response.PatientResponseDTO;
import com.clinicare.enums.PatientStatus;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.mappers.GenericMapper;
import com.clinicare.mappers.PatientMapper;
import com.clinicare.model.Patient;
import com.clinicare.repository.GenericRepository;
import com.clinicare.repository.PatientRepository;

@Service
public class PatientService implements GenericService<Patient, PatientRequestDTO, PatientResponseDTO> {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientService(PatientRepository patientRepository, PatientMapper patientMapper) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
    }

    @Override
    public GenericRepository<Patient> getRepository() {
        return patientRepository;
    }

    @Override
    public GenericMapper<Patient, PatientRequestDTO, PatientResponseDTO> getMapper() {
        return patientMapper;
    }

    @Override
    public PatientResponseDTO create(PatientRequestDTO request) {
        if (patientRepository.existsByCpfAndActiveTrue(request.cpf())) {
            throw new IllegalArgumentException("Já existe um paciente ativo cadastrado com este CPF.");
        }

        Patient patient = patientMapper.toEntity(request);
        patient.setActive(true);

        Patient savedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(savedPatient);
    }

    @Override
    public PatientResponseDTO update(Long id, PatientRequestDTO request) {
        Patient patient = patientRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + id));

        patientRepository.findByCpfAndActiveTrue(request.cpf())
                .ifPresent(existingPatient -> {
                    if (!existingPatient.getId().equals(id)) {
                        throw new IllegalArgumentException("Já existe outro paciente ativo cadastrado com este CPF.");
                    }
                });

        patientMapper.updateEntityFromRequest(request, patient);

        Patient updatedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(updatedPatient);
    }

    public Page<PatientResponseDTO> findByStatus(PatientStatus status, Pageable pageable) {
        return patientRepository
                .findAllByStatusAndActiveTrue(status, pageable)
                .map(patientMapper::toResponse);
    }

    public Page<PatientResponseDTO> findByName(String name, Pageable pageable) {
        return patientRepository
                .findAllByNameContainingIgnoreCaseAndActiveTrue(name, pageable)
                .map(patientMapper::toResponse);
    }

    public Page<PatientResponseDTO> search(String name, PatientStatus status, Pageable pageable) {
        Specification<Patient> specification = (root, query, builder) -> builder.isTrue(root.get("active"));

        if (name != null && !name.isBlank()) {
            specification = specification.and((root, query, builder) ->
                    builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (status != null) {
            specification = specification.and((root, query, builder) -> builder.equal(root.get("status"), status));
        }

        return patientRepository.findAll(specification, pageable).map(patientMapper::toResponse);
    }
}
