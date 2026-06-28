package com.hrplatform.hr_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
@EnableScheduling
public class HrPlatformApplication {
	public static void main(String[] args) {
		SpringApplication.run(HrPlatformApplication.class, args);
	}
}