package service

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/meransoft/commerce-backend/internal/config"
)

type UploadService struct {
	config config.UploadConfig
}

func NewUploadService(cfg config.UploadConfig) *UploadService {
	return &UploadService{config: cfg}
}

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".gif":  true,
	".webp": true,
	".svg":  true,
}

func (s *UploadService) Upload(file *multipart.FileHeader) (string, error) {
	if file.Size > s.config.MaxSize {
		return "", fmt.Errorf("file size exceeds maximum allowed size")
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedExtensions[ext] {
		return "", fmt.Errorf("file type not allowed")
	}

	// Ensure upload directory exists
	if err := os.MkdirAll(s.config.Dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create upload directory")
	}

	filename := uuid.New().String() + ext
	dst := filepath.Join(s.config.Dir, filename)

	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file")
	}
	defer src.Close()

	out, err := os.Create(dst)
	if err != nil {
		return "", fmt.Errorf("failed to save file")
	}
	defer out.Close()

	buf := make([]byte, 1024*64)
	for {
		n, readErr := src.Read(buf)
		if n > 0 {
			if _, writeErr := out.Write(buf[:n]); writeErr != nil {
				return "", fmt.Errorf("failed to write file")
			}
		}
		if readErr != nil {
			break
		}
	}

	url := fmt.Sprintf("/uploads/%s", filename)
	return url, nil
}

func (s *UploadService) Delete(fileURL string) error {
	filename := filepath.Base(fileURL)
	path := filepath.Join(s.config.Dir, filename)
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete file")
	}
	return nil
}
