package com.filRouge.DrinkinMama.entity.game;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "badge")
public class Badge {

    @Id
    @Column(name = "id_badge", nullable = false, length = 50)
    private String id;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;

    @Column(name = "earned", nullable = false)
    private boolean earned;
}
