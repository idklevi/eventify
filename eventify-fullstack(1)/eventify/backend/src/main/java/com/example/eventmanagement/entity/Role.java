package com.example.eventmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;

    public enum RoleName {
        ROLE_USER,
        ROLE_ORGANISER,
        ROLE_ADMIN
    }
}
