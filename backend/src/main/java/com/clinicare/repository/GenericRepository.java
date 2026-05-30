package com.clinicare.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import com.clinicare.model.BaseEntity;

import java.util.Optional;

@NoRepositoryBean
public interface GenericRepository<T extends BaseEntity> extends JpaRepository<T, Long> {

    Page<T> findAllByActiveTrue(Pageable pageable);

    Optional<T> findByIdAndActiveTrue(Long id);

    default Optional<T> findByIdIncludingInactive(Long id) {
        return findById(id);
    }

    @Override
    @Transactional
    default void deleteById(Long id) {
        findById(id).ifPresent(entity -> {
            entity.setActive(false);
            save(entity);
        });
    }

    @Override
    @Transactional
    default void delete(T entity) {
        entity.setActive(false);
        save(entity);
    }

    @Override
    @Transactional
    default void deleteAll(Iterable<? extends T> entities) {
        entities.forEach(this::delete);
    }
}
