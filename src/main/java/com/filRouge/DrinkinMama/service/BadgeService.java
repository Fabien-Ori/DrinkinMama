package com.filRouge.DrinkinMama.service;

import com.filRouge.DrinkinMama.entity.badge.Badge;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.UserBadge;
import com.filRouge.DrinkinMama.repository.BadgeRepository;
import com.filRouge.DrinkinMama.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BadgeService {
    @Autowired
    private UserBadgeRepository userBadgeRepository;
    @Autowired private BadgeRepository badgeRepository;

    public void checkAndGrantBadges(User user, int totalCocktails, int totalScore) {
        if (totalCocktails >= 10) {
            grantBadgeIfNotExists(user, "10 cocktails");
        }
        if (totalScore >= 10000) {
            grantBadgeIfNotExists(user, "Rang Top 10");
        }
    }

    private void grantBadgeIfNotExists(User user, String badgeLabel) {
        Badge badge = badgeRepository.findByLabel(badgeLabel);
        if (badge != null && !userBadgeRepository.existsByUserAndBadge(user, badge)) {
            UserBadge ub = new UserBadge();
            ub.setUser(user);
            ub.setBadge(badge);
            userBadgeRepository.save(ub);
        }
    }
}
