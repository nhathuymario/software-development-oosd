package com.example.content_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/content/admin/uploads")
public class UploadController {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestPart("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) throw new RuntimeException("File rỗng");

        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        String filename = UUID.randomUUID() + ext;

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        File dest = new File(dir, filename);
        file.transferTo(dest);

        // URL public để FE dùng (đi qua gateway)
        String url = "/uploads/" + filename;

        return Map.of("url", url);
    }
}
