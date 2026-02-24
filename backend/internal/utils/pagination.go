package utils

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
)

func GetPagination(c *gin.Context) (int, int) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	return page, limit
}

func NewPagination(page, limit, total int) models.Pagination {
	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	return models.Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}
}

func QueryInt(c *gin.Context, key string) *int {
	val := c.Query(key)
	if val == "" {
		return nil
	}
	i, err := strconv.Atoi(val)
	if err != nil {
		return nil
	}
	return &i
}

func QueryBool(c *gin.Context, key string) *bool {
	val := c.Query(key)
	if val == "" {
		return nil
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return nil
	}
	return &b
}
