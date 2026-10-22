package com.bachuong.hotel.repository;

import com.bachuong.hotel.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByUsername(String username);
    Optional<Account> findByUsernameOrEmail(String username, String email);
    List<Account> findByRoleInOrderByCreatedAtDesc(List<Account.Role> roles);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
