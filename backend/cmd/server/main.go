package main

import (
	"context"
	"os"
	"time"

	"github.com/meransoft/commerce-backend/internal/config"
	"github.com/meransoft/commerce-backend/internal/database"
	"github.com/meransoft/commerce-backend/internal/repository"
	"github.com/meransoft/commerce-backend/internal/router"
	"github.com/meransoft/commerce-backend/internal/seeder"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// @title          Commerce Backend API
// @version        1.0
// @description    E-commerce backend API for household chemicals, cosmetics, and home goods.
// @host           localhost:8080
// @BasePath       /api/v1
// @schemes        http https

// @securityDefinitions.apikey BearerAuth
// @in   header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token

func main() {
	// Logger setup
	zerolog.TimeFieldFormat = time.RFC3339
	log.Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()

	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to load config")
	}

	// Connect to database
	db, err := database.Connect(cfg.Database)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer db.Close()

	// Run migrations
	if err := database.RunMigrations(db); err != nil {
		log.Fatal().Err(err).Msg("failed to run migrations")
	}

	// Seed superadmin
	adminRepo := repository.NewAdminRepo(db)
	adminService := service.NewAdminService(adminRepo, cfg.JWT)
	adminService.SeedSuperAdmin(context.Background())

	// Seed test data (brands, categories, products, etc.)
	seeder.New(db).Run(context.Background())

	// Setup router
	r := router.Setup(cfg, db)

	// Start server
	addr := ":" + cfg.Server.Port
	log.Info().Str("addr", addr).Msg("starting server")
	if err := r.Run(addr); err != nil {
		log.Fatal().Err(err).Msg("failed to start server")
	}
}
