package models

type SubCategory struct {
	ID        int     `json:"id" db:"id"`
	ParentID  int     `json:"parent_id" db:"parent_id"`
	NameRu    string  `json:"name_ru" db:"name_ru"`
	NameTm    string  `json:"name_tm" db:"name_tm"`
	ImageUrl  *string `json:"image_url" db:"image_url"`
	SortOrder int     `json:"sort_order" db:"sort_order"`
	IsActive  bool    `json:"is_active" db:"is_active"`
}

type SubCategoryResponse struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	ImageUrl *string `json:"image_url,omitempty"`
	ParentID int     `json:"parent_id"`
}

type CreateSubCategoryRequest struct {
	ParentID  int     `json:"parent_id" validate:"required"`
	NameRu    string  `json:"name_ru" validate:"required,min=1,max=255"`
	NameTm    string  `json:"name_tm" validate:"required,min=1,max=255"`
	ImageUrl  *string `json:"image_url"`
	SortOrder int     `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

type UpdateSubCategoryRequest struct {
	NameRu    *string `json:"name_ru" validate:"omitempty,min=1,max=255"`
	NameTm    *string `json:"name_tm" validate:"omitempty,min=1,max=255"`
	ImageUrl  *string `json:"image_url"`
	SortOrder *int    `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

func (s *SubCategory) ToResponse(lang string) SubCategoryResponse {
	name := s.NameRu
	if lang == "tm" {
		name = s.NameTm
	}
	return SubCategoryResponse{
		ID:       s.ID,
		Name:     name,
		ImageUrl: s.ImageUrl,
		ParentID: s.ParentID,
	}
}
