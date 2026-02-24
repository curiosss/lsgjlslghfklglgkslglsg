package config

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Upload   UploadConfig
}

type ServerConfig struct {
	Port string
	Mode string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type JWTConfig struct {
	Secret        string
	Expiry        time.Duration
	RefreshExpiry time.Duration
}

type UploadConfig struct {
	Dir     string
	MaxSize int64
	BaseURL string
}

func Load() (*Config, error) {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		// .env is optional, env vars can be set directly
		_ = err
	}

	expiry, err := time.ParseDuration(viper.GetString("JWT_EXPIRY"))
	if err != nil {
		expiry = 24 * time.Hour
	}

	refreshExpiry, err := time.ParseDuration(viper.GetString("JWT_REFRESH_EXPIRY"))
	if err != nil {
		refreshExpiry = 168 * time.Hour
	}

	cfg := &Config{
		Server: ServerConfig{
			Port: viper.GetString("SERVER_PORT"),
			Mode: viper.GetString("SERVER_MODE"),
		},
		Database: DatabaseConfig{
			Host:     viper.GetString("DB_HOST"),
			Port:     viper.GetString("DB_PORT"),
			User:     viper.GetString("DB_USER"),
			Password: viper.GetString("DB_PASSWORD"),
			DBName:   viper.GetString("DB_NAME"),
			SSLMode:  viper.GetString("DB_SSLMODE"),
		},
		JWT: JWTConfig{
			Secret:        viper.GetString("JWT_SECRET"),
			Expiry:        expiry,
			RefreshExpiry: refreshExpiry,
		},
		Upload: UploadConfig{
			Dir:     viper.GetString("UPLOAD_DIR"),
			MaxSize: viper.GetInt64("UPLOAD_MAX_SIZE"),
			BaseURL: viper.GetString("BASE_URL"),
		},
	}

	if cfg.Server.Port == "" {
		cfg.Server.Port = "8080"
	}
	if cfg.Upload.Dir == "" {
		cfg.Upload.Dir = "./uploads"
	}
	if cfg.Upload.MaxSize == 0 {
		cfg.Upload.MaxSize = 10 << 20 // 10MB
	}

	return cfg, nil
}
