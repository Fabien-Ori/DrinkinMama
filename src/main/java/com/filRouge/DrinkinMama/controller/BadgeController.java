package com.filRouge.DrinkinMama.controller;

import com.filRouge.DrinkinMama.entity.badge.Badge;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.UserBadge;
import com.filRouge.DrinkinMama.repository.UserRepository;
import com.filRouge.DrinkinMama.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/badges")
public class BadgeController {

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<List<Badge>> getMyBadges(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<UserBadge> userBadges = userBadgeRepository.findByUser(user);

        List<Badge> badges = userBadges.stream()
                .map(UserBadge::getBadge)
                .collect(Collectors.toList());

        return ResponseEntity.ok(badges);
    }
}