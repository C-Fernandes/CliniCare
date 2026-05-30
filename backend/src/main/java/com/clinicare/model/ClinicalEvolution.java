package com.clinicare.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import com.clinicare.enums.AttentionLevel;

@Entity
@Table(name = "clinical_evolutions")
public class ClinicalEvolution extends BaseEntity {

    @Column(nullable = false)
    private LocalDateTime evolutionDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conduct;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttentionLevel attentionLevel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "professional_id")
    private User professional;

    public ClinicalEvolution() {
    }

    public ClinicalEvolution(
            LocalDateTime evolutionDate,
            String description,
            String summary,
            String conduct,
            AttentionLevel attentionLevel,
            Patient patient,
            User professional) {
        this.evolutionDate = evolutionDate;
        this.description = description;
        this.summary = summary;
        this.conduct = conduct;
        this.attentionLevel = attentionLevel;
        this.patient = patient;
        this.professional = professional;
    }

    public LocalDateTime getEvolutionDate() {
        return evolutionDate;
    }

    public void setEvolutionDate(LocalDateTime evolutionDate) {
        this.evolutionDate = evolutionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getConduct() {
        return conduct;
    }

    public void setConduct(String conduct) {
        this.conduct = conduct;
    }

    public AttentionLevel getAttentionLevel() {
        return attentionLevel;
    }

    public void setAttentionLevel(AttentionLevel attentionLevel) {
        this.attentionLevel = attentionLevel;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public User getProfessional() {
        return professional;
    }

    public void setProfessional(User professional) {
        this.professional = professional;
    }
}