package models

type DeliveryZone struct {
	ID            int     `json:"id" db:"id"`
	NameRu        string  `json:"name_ru" db:"name_ru"`
	NameTm        string  `json:"name_tm" db:"name_tm"`
	NameEn        string  `json:"name_en" db:"name_en"`
	DeliveryPrice float64 `json:"delivery_price" db:"delivery_price"`
	IsActive      bool    `json:"is_active" db:"is_active"`
}

type DeliveryZoneResponse struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	DeliveryPrice float64 `json:"delivery_price"`
}

type CreateDeliveryZoneRequest struct {
	NameRu        string  `json:"name_ru" validate:"required,min=1,max=255"`
	NameTm        string  `json:"name_tm" validate:"required,min=1,max=255"`
	NameEn        string  `json:"name_en" validate:"omitempty,max=255"`
	DeliveryPrice float64 `json:"delivery_price" validate:"required,gte=0"`
	IsActive      *bool   `json:"is_active"`
}

type UpdateDeliveryZoneRequest struct {
	NameRu        *string  `json:"name_ru" validate:"omitempty,min=1,max=255"`
	NameTm        *string  `json:"name_tm" validate:"omitempty,min=1,max=255"`
	NameEn        *string  `json:"name_en" validate:"omitempty,max=255"`
	DeliveryPrice *float64 `json:"delivery_price" validate:"omitempty,gte=0"`
	IsActive      *bool    `json:"is_active"`
}

func (d *DeliveryZone) ToResponse(lang string) DeliveryZoneResponse {
	name := d.NameRu
	if lang == "tm" {
		name = d.NameTm
	} else if lang == "en" && d.NameEn != "" {
		name = d.NameEn
	}
	return DeliveryZoneResponse{
		ID:            d.ID,
		Name:          name,
		DeliveryPrice: d.DeliveryPrice,
	}
}
