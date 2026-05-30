package com.clinicare.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.clinicare.enums.AttentionLevel;
import com.clinicare.model.ClinicalEvolution;

public interface ClinicalEvolutionRepository extends GenericRepository<ClinicalEvolution> {

    Page<ClinicalEvolution> findAllByPatient_IdAndActiveTrue(Long patientId, Pageable pageable);

    Page<ClinicalEvolution> findAllByProfessional_IdAndActiveTrue(Long professionalId, Pageable pageable);

    Page<ClinicalEvolution> findAllByAttentionLevelAndActiveTrue(
            AttentionLevel attentionLevel,
            Pageable pageable);
}
