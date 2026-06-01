package com.clinicare.model;

import java.util.ArrayList;
import java.util.List;

import com.clinicare.enums.UserRole;
import com.clinicare.enums.UserApprovalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserApprovalStatus approvalStatus = UserApprovalStatus.APPROVED;

    @OneToMany(mappedBy = "professional")
    private List<ClinicalEvolution> clinicalEvolutions = new ArrayList<>();

    @OneToMany(mappedBy = "recipient")
    private List<Notification> notifications = new ArrayList<>();

    public User() {
    }

    public User(String name, String email, String password, UserRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserApprovalStatus getApprovalStatus() {
        return approvalStatus == null ? UserApprovalStatus.APPROVED : approvalStatus;
    }

    public void setApprovalStatus(UserApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public boolean isApproved() {
        return getApprovalStatus() == UserApprovalStatus.APPROVED;
    }

    public List<ClinicalEvolution> getClinicalEvolutions() {
        return clinicalEvolutions;
    }

    public void setClinicalEvolutions(List<ClinicalEvolution> clinicalEvolutions) {
        this.clinicalEvolutions = clinicalEvolutions;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
}
