package com.filRouge.DrinkinMama.entity.badge;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_badge")
    private Long id;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;
}