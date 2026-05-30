package com.clinicare.mappers;

import java.util.List;

import com.clinicare.dto.RequestDTO;
import com.clinicare.dto.ResponseDTO;
import com.clinicare.model.BaseEntity;

public interface GenericMapper<E extends BaseEntity, REQ extends RequestDTO, RES extends ResponseDTO> {

    E toEntity(REQ request);

    RES toResponse(E entity);

    void updateEntityFromRequest(REQ request, E entity);

    default List<RES> toResponseList(List<E> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}