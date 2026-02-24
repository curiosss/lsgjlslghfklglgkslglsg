package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/meransoft/commerce-backend/internal/config"
	"github.com/meransoft/commerce-backend/internal/middleware"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

type AdminService struct {
	repo   *repository.AdminRepo
	jwtCfg config.JWTConfig
}

func NewAdminService(repo *repository.AdminRepo, jwtCfg config.JWTConfig) *AdminService {
	return &AdminService{repo: repo, jwtCfg: jwtCfg}
}

func (s *AdminService) Login(ctx context.Context, req models.LoginRequest) (*models.LoginResponse, error) {
	admin, err := s.repo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	accessToken, err := s.generateToken(admin, s.jwtCfg.Expiry)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateToken(admin, s.jwtCfg.RefreshExpiry)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(s.jwtCfg.Expiry.Seconds()),
		Admin:        admin.ToResponse(),
	}, nil
}

func (s *AdminService) RefreshTokenDirect(ctx context.Context, refreshToken string) (*models.LoginResponse, error) {
	token, err := jwt.ParseWithClaims(refreshToken, &middleware.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.jwtCfg.Secret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid refresh token")
	}

	claims, ok := token.Claims.(*middleware.Claims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	admin, err := s.repo.GetByID(ctx, claims.AdminID)
	if err != nil || !admin.IsActive {
		return nil, errors.New("admin not found or inactive")
	}

	accessToken, err := s.generateToken(admin, s.jwtCfg.Expiry)
	if err != nil {
		return nil, err
	}

	newRefreshToken, err := s.generateToken(admin, s.jwtCfg.RefreshExpiry)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    int64(s.jwtCfg.Expiry.Seconds()),
		Admin:        admin.ToResponse(),
	}, nil
}

func (s *AdminService) GetByID(ctx context.Context, id int) (*models.Admin, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *AdminService) GetAll(ctx context.Context) ([]models.AdminResponse, error) {
	admins, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	responses := make([]models.AdminResponse, len(admins))
	for i, a := range admins {
		responses[i] = a.ToResponse()
	}
	return responses, nil
}

func (s *AdminService) Create(ctx context.Context, req models.CreateAdminRequest) (*models.AdminResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	admin := &models.Admin{
		Username:     req.Username,
		PasswordHash: string(hash),
		FullName:     req.FullName,
		Role:         req.Role,
		IsActive:     true,
	}

	if err := s.repo.Create(ctx, admin); err != nil {
		return nil, err
	}

	resp := admin.ToResponse()
	return &resp, nil
}

func (s *AdminService) Update(ctx context.Context, id int, req models.UpdateAdminRequest) (*models.AdminResponse, error) {
	admin, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("admin not found")
	}

	if req.Username != nil {
		admin.Username = *req.Username
	}
	if req.Password != nil {
		hash, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		admin.PasswordHash = string(hash)
	}
	if req.FullName != nil {
		admin.FullName = req.FullName
	}
	if req.Role != nil {
		admin.Role = *req.Role
	}
	if req.IsActive != nil {
		admin.IsActive = *req.IsActive
	}

	if err := s.repo.Update(ctx, admin); err != nil {
		return nil, err
	}

	resp := admin.ToResponse()
	return &resp, nil
}

func (s *AdminService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

func (s *AdminService) SeedSuperAdmin(ctx context.Context) {
	count, err := s.repo.Count(ctx)
	if err != nil {
		log.Error().Err(err).Msg("failed to count admins")
		return
	}
	if count > 0 {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Error().Err(err).Msg("failed to hash password")
		return
	}

	fullName := "Super Admin"
	admin := &models.Admin{
		Username:     "admin",
		PasswordHash: string(hash),
		FullName:     &fullName,
		Role:         models.RoleSuperAdmin,
		IsActive:     true,
	}

	if err := s.repo.Create(ctx, admin); err != nil {
		log.Error().Err(err).Msg("failed to seed superadmin")
		return
	}

	log.Info().Msg("seeded default superadmin (admin / admin123)")
}

func (s *AdminService) generateToken(admin *models.Admin, expiry time.Duration) (string, error) {
	claims := middleware.Claims{
		AdminID:  admin.ID,
		Username: admin.Username,
		Role:     admin.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtCfg.Secret))
}
