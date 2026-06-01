package com.clinicare.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.authentication.BadCredentialsException;

import com.clinicare.dto.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiResponseDTO<Object>> handleResourceNotFound(ResourceNotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                new ApiResponseDTO<>(
                                                false,
                                                "Registro não encontrado.",
                                                null,
                                                ex.getMessage()));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponseDTO<Object>> handleValidation(MethodArgumentNotValidException ex) {
                String error = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .findFirst()
                                .map(fieldError -> fieldError.getDefaultMessage())
                                .orElse("Erro de validação.");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                new ApiResponseDTO<>(
                                                false,
                                                "Erro de validação.",
                                                null,
                                                error));
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiResponseDTO<Object>> handleBadCredentials(BadCredentialsException ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                                new ApiResponseDTO<>(
                                                false,
                                                "Não foi possível autenticar.",
                                                null,
                                                ex.getMessage()));
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiResponseDTO<Object>> handleIllegalArgument(IllegalArgumentException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                                new ApiResponseDTO<>(
                                                false,
                                                "Não foi possível processar a solicitação.",
                                                null,
                                                ex.getMessage()));
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponseDTO<Object>> handleGenericException(Exception ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                                new ApiResponseDTO<>(
                                                false,
                                                "Erro interno no servidor.",
                                                null,
                                                ex.getMessage()));
        }
}
