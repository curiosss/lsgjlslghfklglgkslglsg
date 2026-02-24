package service

import (
	"context"
	"errors"

	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
)

type TimeSlotService struct {
	repo *repository.TimeSlotRepo
}

func NewTimeSlotService(repo *repository.TimeSlotRepo) *TimeSlotService {
	return &TimeSlotService{repo: repo}
}

func (s *TimeSlotService) GetAll(ctx context.Context) ([]models.TimeSlotResponse, error) {
	slots, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	responses := make([]models.TimeSlotResponse, len(slots))
	for i, sl := range slots {
		responses[i] = sl.ToResponse()
	}
	return responses, nil
}

func (s *TimeSlotService) AdminGetAll(ctx context.Context) ([]models.TimeSlot, error) {
	return s.repo.AdminGetAll(ctx)
}

func (s *TimeSlotService) Create(ctx context.Context, req models.CreateTimeSlotRequest) (*models.TimeSlot, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}
	slot := &models.TimeSlot{
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Label:     req.Label,
		IsActive:  isActive,
	}
	if err := s.repo.Create(ctx, slot); err != nil {
		return nil, err
	}
	return slot, nil
}

func (s *TimeSlotService) Update(ctx context.Context, id int, req models.UpdateTimeSlotRequest) (*models.TimeSlot, error) {
	slot, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("time slot not found")
	}
	if req.StartTime != nil {
		slot.StartTime = *req.StartTime
	}
	if req.EndTime != nil {
		slot.EndTime = *req.EndTime
	}
	if req.Label != nil {
		slot.Label = *req.Label
	}
	if req.IsActive != nil {
		slot.IsActive = *req.IsActive
	}
	if err := s.repo.Update(ctx, slot); err != nil {
		return nil, err
	}
	return slot, nil
}

func (s *TimeSlotService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
