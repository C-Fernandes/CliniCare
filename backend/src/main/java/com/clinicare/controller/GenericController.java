package com.clinicare.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.clinicare.dto.ApiResponseDTO;
import com.clinicare.dto.RequestDTO;
import com.clinicare.dto.ResponseDTO;
import com.clinicare.model.BaseEntity;
import com.clinicare.service.GenericService;

@Validated
public abstract class GenericController<E extends BaseEntity, REQ extends RequestDTO, RES extends ResponseDTO, S extends GenericService<E, REQ, RES>> {

        protected final S service;

        protected GenericController(S service) {
                this.service = service;
        }

        @GetMapping
        public ResponseEntity<ApiResponseDTO<Page<RES>>> getAll(Pageable pageable) {
                Page<RES> response = service.findAll(pageable);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Registros encontrados com sucesso.",
                                                response,
                                                null));
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponseDTO<RES>> getById(@PathVariable Long id) {
                RES response = service.findById(id);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Registro encontrado com sucesso.",
                                                response,
                                                null));
        }

        @PostMapping
        public ResponseEntity<ApiResponseDTO<RES>> create(@Valid @RequestBody REQ request) {
                RES response = service.create(request);

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                new ApiResponseDTO<>(
                                                true,
                                                "Registro criado com sucesso.",
                                                response,
                                                null));
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponseDTO<RES>> update(
                        @PathVariable Long id,
                        @Valid @RequestBody REQ request) {
                RES response = service.update(id, request);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Registro atualizado com sucesso.",
                                                response,
                                                null));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponseDTO<Void>> delete(@PathVariable Long id) {
                service.deleteById(id);

                return ResponseEntity.ok(
                                new ApiResponseDTO<>(
                                                true,
                                                "Registro removido com sucesso.",
                                                null,
                                                null));
        }
}