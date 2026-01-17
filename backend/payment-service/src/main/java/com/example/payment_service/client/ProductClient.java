package com.example.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

// url phải khớp với cổng của catalog-service (thường là 8085 theo ảnh bạn gửi)
@FeignClient(name = "catalog-service", url = "http://localhost:8085/api/products")
public interface ProductClient {

    @PutMapping("/{id}/add-stock")
    void addStock(@PathVariable("id") Long id, @RequestParam("quantity") int quantity);
}