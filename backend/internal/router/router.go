package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/meransoft/commerce-backend/internal/config"
	"github.com/meransoft/commerce-backend/internal/handler"
	"github.com/meransoft/commerce-backend/internal/middleware"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/meransoft/commerce-backend/docs"
)

func Setup(cfg *config.Config, db *sqlx.DB) *gin.Engine {
	if cfg.Server.Mode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	// Serve uploaded files
	r.Static("/uploads", cfg.Upload.Dir)

	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		utils.MessageResponse(c, "OK")
	})

	// ── Repositories ──
	adminRepo := repository.NewAdminRepo(db)
	brandRepo := repository.NewBrandRepo(db)
	categoryRepo := repository.NewCategoryRepo(db)
	productRepo := repository.NewProductRepo(db)
	bannerRepo := repository.NewBannerRepo(db)
	deliveryZoneRepo := repository.NewDeliveryZoneRepo(db)
	timeSlotRepo := repository.NewTimeSlotRepo(db)
	orderRepo := repository.NewOrderRepo(db)

	// ── Services ──
	adminService := service.NewAdminService(adminRepo, cfg.JWT)
	brandService := service.NewBrandService(brandRepo)
	categoryService := service.NewCategoryService(categoryRepo)
	productService := service.NewProductService(productRepo)
	bannerService := service.NewBannerService(bannerRepo)
	deliveryZoneService := service.NewDeliveryZoneService(deliveryZoneRepo)
	timeSlotService := service.NewTimeSlotService(timeSlotRepo)
	orderService := service.NewOrderService(orderRepo, productRepo, deliveryZoneRepo)
	homeService := service.NewHomeService(bannerRepo, brandRepo, categoryRepo, productRepo)
	uploadService := service.NewUploadService(cfg.Upload)

	// ── Handlers ──
	authHandler := handler.NewAuthHandler(adminService)
	adminHandler := handler.NewAdminHandler(adminService)
	brandHandler := handler.NewBrandHandler(brandService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	productHandler := handler.NewProductHandler(productService)
	bannerHandler := handler.NewBannerHandler(bannerService)
	deliveryZoneHandler := handler.NewDeliveryZoneHandler(deliveryZoneService)
	timeSlotHandler := handler.NewTimeSlotHandler(timeSlotService)
	orderHandler := handler.NewOrderHandler(orderService)
	homeHandler := handler.NewHomeHandler(homeService)
	uploadHandler := handler.NewUploadHandler(uploadService)

	// ══════════════════════════════════════
	// PUBLIC API
	// ══════════════════════════════════════
	api := r.Group("/api/v1")
	{
		api.GET("/home", homeHandler.GetHome)
		api.GET("/banners", bannerHandler.GetAll)
		api.GET("/categories", categoryHandler.GetAll)
		api.GET("/categories/:id/subcategories", categoryHandler.GetSubcategories)
		api.GET("/brands", brandHandler.GetAll)
		api.GET("/products", productHandler.GetAll)
		api.GET("/products/:id", productHandler.GetByID)
		api.GET("/products/:id/related", productHandler.GetRelated)
		api.GET("/delivery-zones", deliveryZoneHandler.GetAll)
		api.GET("/time-slots", timeSlotHandler.GetAll)
		api.POST("/orders", orderHandler.Create)
		api.GET("/orders", orderHandler.GetByPhone)
	}

	// ══════════════════════════════════════
	// ADMIN API
	// ══════════════════════════════════════
	admin := r.Group("/api/v1/admin")
	{
		// Auth (no JWT required)
		admin.POST("/auth/login", authHandler.Login)
		admin.POST("/auth/refresh", authHandler.Refresh)

		// Protected routes
		protected := admin.Group("")
		protected.Use(middleware.Auth(cfg.JWT.Secret))
		{
			protected.GET("/auth/me", authHandler.Me)

			// Products
			protected.GET("/products", productHandler.AdminGetAll)
			protected.GET("/products/:id", productHandler.AdminGetByID)
			protected.POST("/products", productHandler.Create)
			protected.PUT("/products/:id", productHandler.Update)
			protected.DELETE("/products/:id", productHandler.Delete)

			// Categories
			protected.GET("/categories", categoryHandler.AdminGetAll)
			protected.POST("/categories", categoryHandler.CreateCategory)
			protected.PUT("/categories/:id", categoryHandler.UpdateCategory)
			protected.DELETE("/categories/:id", categoryHandler.DeleteCategory)

			// SubCategories
			protected.POST("/subcategories", categoryHandler.CreateSubCategory)
			protected.PUT("/subcategories/:id", categoryHandler.UpdateSubCategory)
			protected.DELETE("/subcategories/:id", categoryHandler.DeleteSubCategory)

			// Brands
			protected.GET("/brands", brandHandler.AdminGetAll)
			protected.POST("/brands", brandHandler.Create)
			protected.PUT("/brands/:id", brandHandler.Update)
			protected.DELETE("/brands/:id", brandHandler.Delete)

			// Banners
			protected.GET("/banners", bannerHandler.AdminGetAll)
			protected.POST("/banners", bannerHandler.Create)
			protected.PUT("/banners/:id", bannerHandler.Update)
			protected.DELETE("/banners/:id", bannerHandler.Delete)

			// Orders
			protected.GET("/orders", orderHandler.AdminGetAll)
			protected.GET("/orders/:id", orderHandler.AdminGetByID)
			protected.PUT("/orders/:id/status", orderHandler.UpdateStatus)

			// Delivery Zones
			protected.GET("/delivery-zones", deliveryZoneHandler.AdminGetAll)
			protected.POST("/delivery-zones", deliveryZoneHandler.Create)
			protected.PUT("/delivery-zones/:id", deliveryZoneHandler.Update)
			protected.DELETE("/delivery-zones/:id", deliveryZoneHandler.Delete)

			// Time Slots
			protected.GET("/time-slots", timeSlotHandler.AdminGetAll)
			protected.POST("/time-slots", timeSlotHandler.Create)
			protected.PUT("/time-slots/:id", timeSlotHandler.Update)
			protected.DELETE("/time-slots/:id", timeSlotHandler.Delete)

			// Admins (superadmin only)
			admins := protected.Group("/admins")
			admins.Use(middleware.RequireRole(models.RoleSuperAdmin))
			{
				admins.GET("", adminHandler.GetAll)
				admins.POST("", adminHandler.Create)
				admins.PUT("/:id", adminHandler.Update)
				admins.DELETE("/:id", adminHandler.Delete)
			}

			// Upload
			protected.POST("/upload", uploadHandler.Upload)
			protected.DELETE("/upload", uploadHandler.Delete)
		}
	}

	return r
}
