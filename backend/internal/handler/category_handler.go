package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/service"
	"github.com/meransoft/commerce-backend/internal/utils"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// ── Public ──

// GetAll godoc
// @Summary      List categories
// @Description  Get all active categories with subcategories (public)
// @Tags         Categories
// @Produce      json
// @Param        lang  query     string  false  "Language (ru, tm, or en)"  default(ru)
// @Success      200   {object}  models.ApiResponse{data=[]models.CategoryResponse}
// @Failure      500   {object}  models.ApiResponse
// @Router       /categories [get]
func (h *CategoryHandler) GetAll(c *gin.Context) {
	lang := utils.GetLang(c)
	categories, err := h.service.GetAll(c.Request.Context(), lang)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, categories, nil)
}

// GetSubcategories godoc
// @Summary      List subcategories
// @Description  Get subcategories by category ID (public)
// @Tags         Categories
// @Produce      json
// @Param        id    path      int     true   "Category ID"
// @Param        lang  query     string  false  "Language (ru, tm, or en)"  default(ru)
// @Success      200   {object}  models.ApiResponse{data=[]models.SubCategoryResponse}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /categories/{id}/subcategories [get]
func (h *CategoryHandler) GetSubcategories(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	lang := utils.GetLang(c)
	subs, err := h.service.GetSubcategories(c.Request.Context(), id, lang)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, subs, nil)
}

// ── Admin Categories ──

// AdminGetAll godoc
// @Summary      List all categories (admin)
// @Description  Get all categories including inactive (admin)
// @Tags         Categories
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  models.ApiResponse{data=[]models.Category}
// @Failure      500  {object}  models.ApiResponse
// @Router       /admin/categories [get]
func (h *CategoryHandler) AdminGetAll(c *gin.Context) {
	categories, err := h.service.AdminGetAll(c.Request.Context())
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, categories, nil)
}

// CreateCategory godoc
// @Summary      Create category
// @Description  Create a new category (admin)
// @Tags         Categories
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateCategoryRequest  true  "Category data"
// @Success      201   {object}  models.ApiResponse{data=models.Category}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/categories [post]
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req models.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	cat, err := h.service.CreateCategory(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, cat)
}

// UpdateCategory godoc
// @Summary      Update category
// @Description  Update an existing category (admin)
// @Tags         Categories
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                           true  "Category ID"
// @Param        body  body      models.UpdateCategoryRequest  true  "Category data"
// @Success      200   {object}  models.ApiResponse{data=models.Category}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	cat, err := h.service.UpdateCategory(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, cat, nil)
}

// DeleteCategory godoc
// @Summary      Delete category
// @Description  Delete a category (admin)
// @Tags         Categories
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Category ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.DeleteCategory(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Category deleted")
}

// ── Admin SubCategories ──

// CreateSubCategory godoc
// @Summary      Create subcategory
// @Description  Create a new subcategory (admin)
// @Tags         SubCategories
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        body  body      models.CreateSubCategoryRequest  true  "Subcategory data"
// @Success      201   {object}  models.ApiResponse{data=models.SubCategory}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/subcategories [post]
func (h *CategoryHandler) CreateSubCategory(c *gin.Context) {
	var req models.CreateSubCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	sub, err := h.service.CreateSubCategory(c.Request.Context(), req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.CreatedResponse(c, sub)
}

// UpdateSubCategory godoc
// @Summary      Update subcategory
// @Description  Update an existing subcategory (admin)
// @Tags         SubCategories
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id    path      int                              true  "Subcategory ID"
// @Param        body  body      models.UpdateSubCategoryRequest  true  "Subcategory data"
// @Success      200   {object}  models.ApiResponse{data=models.SubCategory}
// @Failure      400   {object}  models.ApiResponse
// @Failure      500   {object}  models.ApiResponse
// @Router       /admin/subcategories/{id} [put]
func (h *CategoryHandler) UpdateSubCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	var req models.UpdateSubCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid request body")
		return
	}
	sub, err := h.service.UpdateSubCategory(c.Request.Context(), id, req)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.SuccessResponse(c, sub, nil)
}

// DeleteSubCategory godoc
// @Summary      Delete subcategory
// @Description  Delete a subcategory (admin)
// @Tags         SubCategories
// @Produce      json
// @Security     BearerAuth
// @Param        id  path      int  true  "Subcategory ID"
// @Success      200 {object}  models.ApiResponse
// @Failure      400 {object}  models.ApiResponse
// @Failure      500 {object}  models.ApiResponse
// @Router       /admin/subcategories/{id} [delete]
func (h *CategoryHandler) DeleteSubCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid ID")
		return
	}
	if err := h.service.DeleteSubCategory(c.Request.Context(), id); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	utils.MessageResponse(c, "Subcategory deleted")
}
