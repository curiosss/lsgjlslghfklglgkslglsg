package models

type TimeSlot struct {
	ID        int    `json:"id" db:"id"`
	StartTime string `json:"start_time" db:"start_time"`
	EndTime   string `json:"end_time" db:"end_time"`
	Label     string `json:"label" db:"label"`
	IsActive  bool   `json:"is_active" db:"is_active"`
}

type TimeSlotResponse struct {
	ID        int    `json:"id"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	Label     string `json:"label"`
}

type CreateTimeSlotRequest struct {
	StartTime string `json:"start_time" validate:"required"`
	EndTime   string `json:"end_time" validate:"required"`
	Label     string `json:"label" validate:"required"`
	IsActive  *bool  `json:"is_active"`
}

type UpdateTimeSlotRequest struct {
	StartTime *string `json:"start_time"`
	EndTime   *string `json:"end_time"`
	Label     *string `json:"label"`
	IsActive  *bool   `json:"is_active"`
}

func (t *TimeSlot) ToResponse() TimeSlotResponse {
	return TimeSlotResponse{
		ID:        t.ID,
		StartTime: t.StartTime,
		EndTime:   t.EndTime,
		Label:     t.Label,
	}
}
