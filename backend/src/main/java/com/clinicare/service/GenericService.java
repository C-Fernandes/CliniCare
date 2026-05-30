package com.clinicare.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.clinicare.dto.RequestDTO;
import com.clinicare.dto.ResponseDTO;
import com.clinicare.exception.ResourceNotFoundException;
import com.clinicare.mappers.GenericMapper;
import com.clinicare.model.BaseEntity;
import com.clinicare.repository.GenericRepository;

public interface GenericService<E extends BaseEntity, REQ extends RequestDTO, RES extends ResponseDTO> {

    GenericRepository<E> getRepository();

    GenericMapper<E, REQ, RES> getMapper();

    default Page<RES> findAll(Pageable pageable) {
        return getRepository()
                .findAllByActiveTrue(pageable)
                .map(getMapper()::toResponse);
    }

    default RES findById(Long id) {
        E entity = findEntityById(id);
        return getMapper().toResponse(entity);
    }

    default E findEntityById(Long id) {
        return getRepository()
                .findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro não encontrado com id: " + id));
    }

    default RES create(REQ request) {
        E entity = getMapper().toEntity(request);
        entity.setActive(true);

        E savedEntity = getRepository().save(entity);

        return getMapper().toResponse(savedEntity);
    }

    default RES update(Long id, REQ request) {
        E entity = findEntityById(id);

        getMapper().updateEntityFromRequest(request, entity);

        E updatedEntity = getRepository().save(entity);

        return getMapper().toResponse(updatedEntity);
    }

    default void deleteById(Long id) {
        E entity = findEntityById(id);

        entity.setActive(false);

        getRepository().save(entity);
    }
}