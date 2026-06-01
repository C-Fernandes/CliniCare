package com.clinicare.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.clinicare.enums.PatientStatus;
import com.clinicare.model.Patient;

public interface PatientRepository extends GenericRepository<Patient>, JpaSpecificationExecutor<Patient> {

    Optional<Patient> findByCpfAndActiveTrue(String cpf);

    boolean existsByCpfAndActiveTrue(String cpf);

    Page<Patient> findAllByStatusAndActiveTrue(PatientStatus status, Pageable pageable);

    Page<Patient> findAllByNameContainingIgnoreCaseAndActiveTrue(String name, Pageable pageable);
}
