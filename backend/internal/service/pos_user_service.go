package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type POSUserService struct {
	repo *repository.POSUserRepo
}

func NewPOSUserService(repo *repository.POSUserRepo) *POSUserService {
	return &POSUserService{repo: repo}
}

func (s *POSUserService) GetAll(ctx context.Context) ([]models.POSUserResponse, error) {
	users, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	responses := make([]models.POSUserResponse, len(users))
	for i, u := range users {
		responses[i] = u.ToResponse()
	}
	return responses, nil
}

func (s *POSUserService) Create(ctx context.Context, req models.CreatePOSUserRequest) (*models.POSUserResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	user := &models.POSUser{
		Username:     req.Username,
		PasswordHash: string(hash),
		IsActive:     isActive,
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, err
	}

	resp := user.ToResponse()
	return &resp, nil
}

func (s *POSUserService) Update(ctx context.Context, id int, req models.UpdatePOSUserRequest) (*models.POSUserResponse, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("pos user not found")
	}

	if req.Username != nil {
		user.Username = *req.Username
	}
	if req.Password != nil {
		hash, err := bcrypt.GenerateFromPassword([]byte(*req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		user.PasswordHash = string(hash)
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	resp := user.ToResponse()
	return &resp, nil
}

func (s *POSUserService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
