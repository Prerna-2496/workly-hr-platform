package com.hrplatform.hr_platform.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=== JWT FILTER === Auth header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();

            try {
                if (jwtUtil.isTokenValid(token)) {
                    Claims claims = jwtUtil.extractClaims(token);
                    String email = claims.getSubject();

                    // extract the actual role from the token claims
                    String role = claims.get("role", String.class);

                    System.out.println("=== JWT FILTER === Valid token for: " + email + " | Role: " + role);

                    var auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(new SimpleGrantedAuthority(role))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    Object tenantRaw = claims.get("tenantId");
                    Long tenantId = tenantRaw instanceof Integer
                            ? ((Integer) tenantRaw).longValue()
                            : (Long) tenantRaw;
                    request.setAttribute("tenantId", tenantId);
                    request.setAttribute("role", role);

                    System.out.println("=== JWT FILTER === TenantId: " + tenantId);
                } else {
                    System.out.println("=== JWT FILTER === Token INVALID");
                }
            } catch (Exception e) {
                System.out.println("=== JWT FILTER === Error: " + e.getMessage());
            }
        } else {
            System.out.println("=== JWT FILTER === No Bearer token found");
        }

        chain.doFilter(request, response);
    }
}