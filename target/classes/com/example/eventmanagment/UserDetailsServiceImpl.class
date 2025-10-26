// Source code is decompiled from a .class file using FernFlower decompiler (from Intellij IDEA).
package com.example.eventmanagement;

import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
   private final UserRepository userRepository;

   public UserDetailsServiceImpl(UserRepository userRepository) {
      this.userRepository = userRepository;
   }

   public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
      User user = (User)this.userRepository.findByEmail(email).orElseThrow(() -> {
         return new UsernameNotFoundException("User not found with email: " + email);
      });
      Set<GrantedAuthority> authorities = (Set)user.getRoles().stream().map((role) -> {
         return new SimpleGrantedAuthority(role.getName());
      }).collect(Collectors.toSet());
      return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
   }
}
