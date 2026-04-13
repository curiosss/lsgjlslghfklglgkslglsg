package service

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/meransoft/commerce-backend/internal/config"
	"github.com/meransoft/commerce-backend/internal/middleware"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type POSService struct {
	userRepo *repository.POSUserRepo
	prodRepo *repository.ProductRepo // We need Create and Update but Product uses Create with passing whole product. Let's assume we create generic models.Product.
	jwtCfg   config.JWTConfig
}

func NewPOSService(userRepo *repository.POSUserRepo, prodRepo *repository.ProductRepo, jwtCfg config.JWTConfig) *POSService {
	return &POSService{userRepo: userRepo, prodRepo: prodRepo, jwtCfg: jwtCfg}
}

// 1. Auth Login (JWT generator) for POS Username/Password
func (s *POSService) Login(ctx context.Context, username, password string) (*models.LoginResponse, error) {
	user, err := s.userRepo.GetByUsername(ctx, username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}
	if !user.IsActive {
		return nil, errors.New("pos user is inactive")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate Token using RolePOS
	claims := middleware.Claims{
		AdminID:  user.ID, // Used inside context but restricted by RolePOS
		Username: user.Username,
		Role:     models.RolePOS,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.jwtCfg.Expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.jwtCfg.Secret))
	if err != nil {
		return nil, err
	}

	// For simplicity, we just return models.LoginResponse filling AccessToken and ignoring RefreshToken / Admin Details
	return &models.LoginResponse{
		AccessToken: tokenString,
		ExpiresIn:   int64(s.jwtCfg.Expiry.Seconds()),
	}, nil
}

// 2. ImportProducts Endpoint Logic
type POSImportPayload struct {
	Rows []POSProductRow `json:"rows"`
}

type POSProductRow struct {
	GoodsID       string `json:"goods_id"`
	CountGoods    string `json:"count_goods"`
	Price         string `json:"price"`
	DiscountPrice string `json:"discount_price"`
	Code          string `json:"code"`
	Name          string `json:"name"`
	GroupTitle    string `json:"group_title"`
	MeasureTitle  string `json:"measure_title"`
	Barcode       string `json:"barcode"`
	GoodsColor    string `json:"goods_color"`
	GoodsSize     string `json:"goods_size"`
	Model         string `json:"model"`
	Producer      string `json:"producer"`
}

func (s *POSService) ImportProducts(ctx context.Context, payload POSImportPayload) error {
	for _, row := range payload.Rows {
		price, _ := strconv.ParseFloat(row.Price, 64)
		// Try to parse barcode
		var barcode *string
		if row.Barcode != "" {
			barcode = &row.Barcode
		}

		status := "not_reviewed"

		// For now, assume every imported item is a new product since goods_id matching is not in DB yet. 
		// If barcode already exists, update. Without goods_id storing, we'll just Insert.
		// To match user requirements: "products created... status not reviewed... name_en and name_ru filled with pos_name"

		// Note: Usually we would look up by barcode or GoodsID. 
		// Just inserting new products for every import according to simple reqs.
		p := &models.Product{
			NameRu:   row.Name,
			NameEn:   row.Name,
			NameTm:   row.Name, // Default TM to same
			PosName:  &row.Name,
			Price:    price,
			IsActive: false, // Inactive so it doesn't show to regular users
			Status:   status,
			Barcode:  barcode,
			// Mocking default values so DB doesn't fail
			ImageUrl: "",       
		}

		if err := s.prodRepo.Create(ctx, p); err != nil {
			fmt.Printf("Error creating product from POS: %v\n", err)
			return err
		}
	}
	return nil
}
