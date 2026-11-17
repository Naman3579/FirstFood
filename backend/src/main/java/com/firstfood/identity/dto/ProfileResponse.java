package com.firstfood.identity.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProfileResponse(
        UUID accountId,
        String phone,
        String email,
        boolean emailVerified,
        String fullName,
        String status,
        List<String> portals,
        Instant createdAt) {
}
