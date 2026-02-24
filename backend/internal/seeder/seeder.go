package seeder

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/meransoft/commerce-backend/internal/models"
	"github.com/meransoft/commerce-backend/internal/repository"
	"github.com/rs/zerolog/log"
)

type Seeder struct {
	db           *sqlx.DB
	brandRepo    *repository.BrandRepo
	categoryRepo *repository.CategoryRepo
	productRepo  *repository.ProductRepo
	bannerRepo   *repository.BannerRepo
	dzRepo       *repository.DeliveryZoneRepo
	tsRepo       *repository.TimeSlotRepo
}

func New(db *sqlx.DB) *Seeder {
	return &Seeder{
		db:           db,
		brandRepo:    repository.NewBrandRepo(db),
		categoryRepo: repository.NewCategoryRepo(db),
		productRepo:  repository.NewProductRepo(db),
		bannerRepo:   repository.NewBannerRepo(db),
		dzRepo:       repository.NewDeliveryZoneRepo(db),
		tsRepo:       repository.NewTimeSlotRepo(db),
	}
}

func (s *Seeder) Run(ctx context.Context) {
	if s.hasData(ctx) {
		log.Info().Msg("seed data already exists, skipping")
		return
	}

	log.Info().Msg("seeding test data...")

	brandIDs := s.seedBrands(ctx)
	categoryIDs, subCategoryIDs := s.seedCategories(ctx)
	s.seedProducts(ctx, brandIDs, categoryIDs, subCategoryIDs)
	s.seedBanners(ctx)
	s.seedDeliveryZones(ctx)
	s.seedTimeSlots(ctx)

	log.Info().Msg("test data seeded successfully")
}

func (s *Seeder) hasData(ctx context.Context) bool {
	var count int
	if err := s.db.GetContext(ctx, &count, "SELECT COUNT(*) FROM brands"); err != nil {
		return false
	}
	return count > 0
}

// ── Brands ──

func (s *Seeder) seedBrands(ctx context.Context) []int {
	brands := []models.Brand{
		{Name: "Ariel", SortOrder: 1, IsActive: true},
		{Name: "Tide", SortOrder: 2, IsActive: true},
		{Name: "Fairy", SortOrder: 3, IsActive: true},
		{Name: "Domestos", SortOrder: 4, IsActive: true},
		{Name: "Dove", SortOrder: 5, IsActive: true},
		{Name: "Head & Shoulders", SortOrder: 6, IsActive: true},
		{Name: "Colgate", SortOrder: 7, IsActive: true},
		{Name: "Pampers", SortOrder: 8, IsActive: true},
		{Name: "Nivea", SortOrder: 9, IsActive: true},
		{Name: "Persil", SortOrder: 10, IsActive: true},
	}

	ids := make([]int, 0, len(brands))
	for i := range brands {
		if err := s.brandRepo.Create(ctx, &brands[i]); err != nil {
			log.Error().Err(err).Str("brand", brands[i].Name).Msg("failed to seed brand")
			continue
		}
		ids = append(ids, brands[i].ID)
	}
	log.Info().Int("count", len(ids)).Msg("seeded brands")
	return ids
}

// ── Categories & SubCategories ──

type catDef struct {
	nameRu string
	nameTm string
	subs   []subDef
}

type subDef struct {
	nameRu string
	nameTm string
}

func (s *Seeder) seedCategories(ctx context.Context) (categoryIDs []int, subCategoryIDs []int) {
	categories := []catDef{
		{
			nameRu: "Стиральные средства",
			nameTm: "Ýuwujy serişdeler",
			subs: []subDef{
				{nameRu: "Стиральные порошки", nameTm: "Kir ýuwujy serişdeler"},
				{nameRu: "Гели для стирки", nameTm: "Kir ýuwmak üçin geller"},
				{nameRu: "Кондиционеры для белья", nameTm: "Egin-eşik kondisionerleri"},
			},
		},
		{
			nameRu: "Чистящие средства",
			nameTm: "Arassalaýjy serişdeler",
			subs: []subDef{
				{nameRu: "Для ванной и туалета", nameTm: "Hammam we hajathana üçin"},
				{nameRu: "Для кухни", nameTm: "Aşhana üçin"},
				{nameRu: "Для полов", nameTm: "Pol üçin"},
			},
		},
		{
			nameRu: "Средства для посуды",
			nameTm: "Gap-gaç ýuwujy serişdeler",
			subs: []subDef{
				{nameRu: "Жидкие средства", nameTm: "Suwuk serişdeler"},
				{nameRu: "Таблетки для ПММ", nameTm: "Gap-gaç ýuwýan maşyn üçin tabletler"},
			},
		},
		{
			nameRu: "Уход за телом",
			nameTm: "Beden idegi",
			subs: []subDef{
				{nameRu: "Гели для душа", nameTm: "Duş üçin geller"},
				{nameRu: "Мыло", nameTm: "Sabyn"},
				{nameRu: "Кремы", nameTm: "Kremler"},
			},
		},
		{
			nameRu: "Уход за волосами",
			nameTm: "Saç idegi",
			subs: []subDef{
				{nameRu: "Шампуни", nameTm: "Şampunlar"},
				{nameRu: "Бальзамы и маски", nameTm: "Balzamlar we maskalar"},
			},
		},
		{
			nameRu: "Гигиена полости рта",
			nameTm: "Agyz boşlugynyň gigiýenasy",
			subs: []subDef{
				{nameRu: "Зубные пасты", nameTm: "Diş pastalary"},
				{nameRu: "Зубные щётки", nameTm: "Diş çotgalary"},
			},
		},
		{
			nameRu: "Детские товары",
			nameTm: "Çaga harytlary",
			subs: []subDef{
				{nameRu: "Подгузники", nameTm: "Çaga arlyklary"},
				{nameRu: "Детская гигиена", nameTm: "Çaga gigiýenasy"},
			},
		},
		{
			nameRu: "Бумажные изделия",
			nameTm: "Kagyz önümleri",
			subs: []subDef{
				{nameRu: "Туалетная бумага", nameTm: "Hajathana kagyzy"},
				{nameRu: "Бумажные полотенца", nameTm: "Kagyz süpürgiçler"},
				{nameRu: "Салфетки", nameTm: "Salfetka"},
			},
		},
	}

	for i, cat := range categories {
		c := &models.Category{
			NameRu:    cat.nameRu,
			NameTm:    cat.nameTm,
			SortOrder: i + 1,
			IsActive:  true,
		}
		if err := s.categoryRepo.Create(ctx, c); err != nil {
			log.Error().Err(err).Str("category", cat.nameRu).Msg("failed to seed category")
			continue
		}
		categoryIDs = append(categoryIDs, c.ID)

		for j, sub := range cat.subs {
			sc := &models.SubCategory{
				ParentID:  c.ID,
				NameRu:    sub.nameRu,
				NameTm:    sub.nameTm,
				SortOrder: j + 1,
				IsActive:  true,
			}
			if err := s.categoryRepo.CreateSubCategory(ctx, sc); err != nil {
				log.Error().Err(err).Str("subcategory", sub.nameRu).Msg("failed to seed subcategory")
				continue
			}
			subCategoryIDs = append(subCategoryIDs, sc.ID)
		}

		// Update has_subcategories flag
		if len(cat.subs) > 0 {
			_ = s.categoryRepo.UpdateHasSubCategories(ctx, c.ID)
		}
	}

	log.Info().Int("categories", len(categoryIDs)).Int("subcategories", len(subCategoryIDs)).Msg("seeded categories")
	return
}

// ── Products ──

type productDef struct {
	nameRu      string
	nameTm      string
	descRu      string
	descTm      string
	price       float64
	oldPrice    float64
	discount    int
	brandIdx    int // index into brandIDs, -1 = no brand
	catIdx      int // index into categoryIDs
	subCatIdx   int // index into subCategoryIDs, -1 = no subcat
	isNew       bool
	isDiscount  bool
}

func (s *Seeder) seedProducts(ctx context.Context, brandIDs, categoryIDs, subCategoryIDs []int) {
	// Helper to get a pointer
	intPtr := func(v int) *int { return &v }
	floatPtr := func(v float64) *float64 { return &v }
	strPtr := func(v string) *string { return &v }

	products := []productDef{
		// ── Category 0: Стиральные средства (subs 0,1,2) ──
		{nameRu: "Ariel Горный Родник 3кг", nameTm: "Ariel Dag çeşmesi 3kg", descRu: "Стиральный порошок Ariel с ароматом горного родника. Эффективно удаляет пятна при любой температуре.", descTm: "Ariel kir ýuwujy serişde, dag çeşmesiniň ysy bilen. Islendik temperaturada tegmilleri aýyrýar.", price: 189.90, oldPrice: 219.90, discount: 14, brandIdx: 0, catIdx: 0, subCatIdx: 0, isDiscount: true},
		{nameRu: "Ariel Color 4кг", nameTm: "Ariel Reňkli 4kg", descRu: "Стиральный порошок для цветного белья. Сохраняет яркость цветов.", descTm: "Reňkli egin-eşik üçin kir ýuwujy serişde. Reňkleriň ýagtylygyny saklaýar.", price: 249.90, brandIdx: 0, catIdx: 0, subCatIdx: 0, isNew: true},
		{nameRu: "Tide Автомат 3кг", nameTm: "Tide Awtomat 3kg", descRu: "Стиральный порошок Tide для автоматических стиральных машин.", descTm: "Tide awtomatik kir ýuwujy maşynlar üçin kir ýuwujy serişde.", price: 169.90, brandIdx: 1, catIdx: 0, subCatIdx: 0},
		{nameRu: "Persil Гель 1.3л", nameTm: "Persil Gel 1.3l", descRu: "Концентрированный гель для стирки Persil. Легко выполаскивается.", descTm: "Persil kir ýuwmak üçin konsentrlenen gel. Aňsatlyk bilen ýuwulýar.", price: 199.90, brandIdx: 9, catIdx: 0, subCatIdx: 1, isNew: true},
		{nameRu: "Ariel Гель для стирки 1.5л", nameTm: "Ariel Kir ýuwmak üçin gel 1.5l", descRu: "Жидкий гель Ariel для стирки деликатных тканей.", descTm: "Näzik matalar üçin Ariel suwuk gel.", price: 229.90, oldPrice: 269.90, discount: 15, brandIdx: 0, catIdx: 0, subCatIdx: 1, isDiscount: true},
		{nameRu: "Кондиционер Dove 1л", nameTm: "Dove kondisioner 1l", descRu: "Кондиционер для белья Dove с нежным ароматом. Придаёт мягкость.", descTm: "Dove egin-eşik kondisioneri näzik ys bilen. Ýumşaklyk berýär.", price: 89.90, brandIdx: 4, catIdx: 0, subCatIdx: 2},

		// ── Category 1: Чистящие средства (subs 3,4,5) ──
		{nameRu: "Domestos Сила хлора 1л", nameTm: "Domestos Hlor güýji 1l", descRu: "Чистящее средство Domestos для ванной и туалета. Убивает 99.9% бактерий.", descTm: "Domestos hammam we hajathana üçin arassalaýjy serişde. 99.9% bakteriýalary öldürýär.", price: 79.90, brandIdx: 3, catIdx: 1, subCatIdx: 3},
		{nameRu: "Domestos Лимонная свежесть 750мл", nameTm: "Domestos Limon täzeligi 750ml", descRu: "Гель для чистки унитаза с ароматом лимона.", descTm: "Limon ysy bilen unitaz arassalaýjy gel.", price: 65.90, oldPrice: 79.90, discount: 18, brandIdx: 3, catIdx: 1, subCatIdx: 3, isDiscount: true},
		{nameRu: "Fairy Средство для кухни 500мл", nameTm: "Fairy Aşhana üçin serişde 500ml", descRu: "Универсальное чистящее средство для кухонных поверхностей.", descTm: "Aşhana ýüzleri üçin uniwersal arassalaýjy serişde.", price: 59.90, brandIdx: 2, catIdx: 1, subCatIdx: 4, isNew: true},
		{nameRu: "Средство для полов Лаванда 1л", nameTm: "Pol üçin serişde Lawanda 1l", descRu: "Моющее средство для всех типов напольных покрытий с ароматом лаванды.", descTm: "Lawanda ysy bilen ähli pol örtükleri üçin ýuwujy serişde.", price: 49.90, brandIdx: -1, catIdx: 1, subCatIdx: 5},

		// ── Category 2: Средства для посуды (subs 6,7) ──
		{nameRu: "Fairy Лимон 900мл", nameTm: "Fairy Limon 900ml", descRu: "Средство для мытья посуды Fairy с ароматом лимона. Густая формула.", descTm: "Fairy limon ysy bilen gap-gaç ýuwujy serişde. Goýy formula.", price: 69.90, brandIdx: 2, catIdx: 2, subCatIdx: 6},
		{nameRu: "Fairy Нежные руки 500мл", nameTm: "Fairy Näzik eller 500ml", descRu: "Средство для посуды Fairy с экстрактом алоэ и витамином E.", descTm: "Aloe we E witamini bilen Fairy gap-gaç ýuwujy serişde.", price: 55.90, oldPrice: 69.90, discount: 20, brandIdx: 2, catIdx: 2, subCatIdx: 6, isDiscount: true},
		{nameRu: "Fairy Таблетки для ПММ 30шт", nameTm: "Fairy Gap-gaç ýuwýan maşyn üçin tabletler 30 sany", descRu: "Таблетки для посудомоечной машины. Эффективно моют с первого раза.", descTm: "Gap-gaç ýuwýan maşyn üçin tabletler. Ilkinji gezekde netijeli ýuwýar.", price: 349.90, brandIdx: 2, catIdx: 2, subCatIdx: 7, isNew: true},

		// ── Category 3: Уход за телом (subs 8,9,10) ──
		{nameRu: "Dove Крем-гель для душа 250мл", nameTm: "Dove Duş üçin krem-gel 250ml", descRu: "Нежный крем-гель для душа Dove с увлажняющим молочком.", descTm: "Nemlendiriji süýt bilen Dove näzik duş üçin krem-gel.", price: 89.90, brandIdx: 4, catIdx: 3, subCatIdx: 8},
		{nameRu: "Nivea Гель для душа Энергия 250мл", nameTm: "Nivea Duş üçin gel Energiýa 250ml", descRu: "Бодрящий гель для душа Nivea для мужчин.", descTm: "Erkekler üçin Nivea kuwwatlandyryjy duş üçin gel.", price: 79.90, brandIdx: 8, catIdx: 3, subCatIdx: 8, isNew: true},
		{nameRu: "Dove Мыло Красота и уход 100г", nameTm: "Dove Sabyn Gözellik we ideg 100g", descRu: "Крем-мыло Dove с увлажняющим кремом. Не сушит кожу.", descTm: "Nemlendiriji krem bilen Dove krem-sabyn. Derini guratmaýar.", price: 29.90, brandIdx: 4, catIdx: 3, subCatIdx: 9},
		{nameRu: "Nivea Крем для рук 75мл", nameTm: "Nivea El üçin krem 75ml", descRu: "Увлажняющий крем для рук Nivea. Быстро впитывается.", descTm: "Nivea elleri nemlendiriji krem. Çalt siňýär.", price: 49.90, oldPrice: 59.90, discount: 17, brandIdx: 8, catIdx: 3, subCatIdx: 10, isDiscount: true},

		// ── Category 4: Уход за волосами (subs 11,12) ──
		{nameRu: "Head & Shoulders Основной уход 400мл", nameTm: "Head & Shoulders Esasy ideg 400ml", descRu: "Шампунь против перхоти Head & Shoulders. Клинически доказанная формула.", descTm: "Head & Shoulders kepegiň garşysyna şampun. Kliniki taýdan subut edilen formula.", price: 129.90, brandIdx: 5, catIdx: 4, subCatIdx: 11},
		{nameRu: "Head & Shoulders Ментол 200мл", nameTm: "Head & Shoulders Mentol 200ml", descRu: "Освежающий шампунь с ментолом.", descTm: "Mentolly täzeleniji şampun.", price: 89.90, oldPrice: 109.90, discount: 18, brandIdx: 5, catIdx: 4, subCatIdx: 11, isDiscount: true},
		{nameRu: "Dove Бальзам для волос 200мл", nameTm: "Dove Saç üçin balzam 200ml", descRu: "Восстанавливающий бальзам для повреждённых волос.", descTm: "Zeperli saçlar üçin dikeldiji balzam.", price: 99.90, brandIdx: 4, catIdx: 4, subCatIdx: 12, isNew: true},

		// ── Category 5: Гигиена полости рта (subs 13,14) ──
		{nameRu: "Colgate Максимальная защита 100мл", nameTm: "Colgate Maksimal goranyş 100ml", descRu: "Зубная паста Colgate для комплексной защиты зубов и дёсен.", descTm: "Dişleri we diş etlerini toplumlaýyn goramak üçin Colgate diş pastasy.", price: 39.90, brandIdx: 6, catIdx: 5, subCatIdx: 13},
		{nameRu: "Colgate Отбеливающая 75мл", nameTm: "Colgate Agardyjy 75ml", descRu: "Отбеливающая зубная паста Colgate с микро-гранулами.", descTm: "Mikro-granulaly Colgate agardyjy diş pastasy.", price: 45.90, brandIdx: 6, catIdx: 5, subCatIdx: 13, isNew: true},
		{nameRu: "Colgate Зубная щётка Средняя", nameTm: "Colgate Diş çotgasy Orta", descRu: "Зубная щётка средней жёсткости с удобной ручкой.", descTm: "Amatly tutawajy bolan orta gaty diş çotgasy.", price: 19.90, brandIdx: 6, catIdx: 5, subCatIdx: 14},

		// ── Category 6: Детские товары (subs 15,16) ──
		{nameRu: "Pampers Premium Care Размер 3 (60шт)", nameTm: "Pampers Premium Care Ölçeg 3 (60 sany)", descRu: "Подгузники Pampers Premium Care. Мягкие как шёлк, до 12 часов сухости.", descTm: "Pampers Premium Care çaga arlyklary. Ýüpek ýaly ýumşak, 12 sagada çenli guruklyk.", price: 449.90, brandIdx: 7, catIdx: 6, subCatIdx: 15},
		{nameRu: "Pampers Active Baby Размер 4 (46шт)", nameTm: "Pampers Active Baby Ölçeg 4 (46 sany)", descRu: "Подгузники Pampers Active Baby с тройной защитой.", descTm: "Üç taraplaýyn goragy bolan Pampers Active Baby çaga arlyklary.", price: 379.90, oldPrice: 429.90, discount: 12, brandIdx: 7, catIdx: 6, subCatIdx: 15, isDiscount: true},
		{nameRu: "Dove Baby Шампунь-пенка 400мл", nameTm: "Dove Baby Şampun-köpük 400ml", descRu: "Нежный шампунь-пенка для детей. Не щиплет глазки.", descTm: "Çagalar üçin näzik şampun-köpük. Gözleri ýakmaýar.", price: 109.90, brandIdx: 4, catIdx: 6, subCatIdx: 16, isNew: true},

		// ── Category 7: Бумажные изделия (subs 17,18,19) ──
		{nameRu: "Туалетная бумага Мягкая 12 рулонов", nameTm: "Hajathana kagyzy Ýumşak 12 rulon", descRu: "Трёхслойная туалетная бумага. Мягкая и прочная.", descTm: "Üç gatly hajathana kagyzy. Ýumşak we berk.", price: 59.90, brandIdx: -1, catIdx: 7, subCatIdx: 17},
		{nameRu: "Бумажные полотенца 2 рулона", nameTm: "Kagyz süpürgiçler 2 rulon", descRu: "Высоковпитывающие бумажные полотенца для кухни.", descTm: "Aşhana üçin ýokary siňdirýän kagyz süpürgiçler.", price: 39.90, oldPrice: 49.90, discount: 20, brandIdx: -1, catIdx: 7, subCatIdx: 18, isDiscount: true},
		{nameRu: "Салфетки универсальные 100шт", nameTm: "Uniwersal salfetka 100 sany", descRu: "Мягкие бумажные салфетки для ежедневного использования.", descTm: "Gündelik ulanmak üçin ýumşak kagyz salfetka.", price: 19.90, brandIdx: -1, catIdx: 7, subCatIdx: 19},
	}

	created := 0
	for i, pd := range products {
		p := &models.Product{
			NameRu:       pd.nameRu,
			NameTm:       pd.nameTm,
			DescriptionRu: strPtr(pd.descRu),
			DescriptionTm: strPtr(pd.descTm),
			Price:        pd.price,
			ImageUrl:     "/uploads/placeholder.svg",
			Images:       pq.StringArray{},
			IsActive:     true,
			IsNew:        pd.isNew,
			IsDiscount:   pd.isDiscount,
			SortOrder:    i + 1,
		}

		if pd.brandIdx >= 0 && pd.brandIdx < len(brandIDs) {
			p.BrandID = intPtr(brandIDs[pd.brandIdx])
		}
		if pd.catIdx >= 0 && pd.catIdx < len(categoryIDs) {
			p.CategoryID = intPtr(categoryIDs[pd.catIdx])
		}
		if pd.subCatIdx >= 0 && pd.subCatIdx < len(subCategoryIDs) {
			p.SubCategoryID = intPtr(subCategoryIDs[pd.subCatIdx])
		}
		if pd.oldPrice > 0 {
			p.OldPrice = floatPtr(pd.oldPrice)
		}
		if pd.discount > 0 {
			p.DiscountPercent = intPtr(pd.discount)
		}

		if err := s.productRepo.Create(ctx, p); err != nil {
			log.Error().Err(err).Str("product", pd.nameRu).Msg("failed to seed product")
			continue
		}
		created++
	}
	log.Info().Int("count", created).Msg("seeded products")
}

// ── Banners ──

func (s *Seeder) seedBanners(ctx context.Context) {
	catType := "category"
	banners := []models.Banner{
		{ImageUrl: "/uploads/placeholder.svg", LinkType: &catType, LinkValue: strPtr("1"), SortOrder: 1, IsActive: true},
		{ImageUrl: "/uploads/placeholder.svg", LinkType: &catType, LinkValue: strPtr("2"), SortOrder: 2, IsActive: true},
		{ImageUrl: "/uploads/placeholder.svg", LinkType: &catType, LinkValue: strPtr("3"), SortOrder: 3, IsActive: true},
	}

	for i := range banners {
		if err := s.bannerRepo.Create(ctx, &banners[i]); err != nil {
			log.Error().Err(err).Msg("failed to seed banner")
		}
	}
	log.Info().Int("count", len(banners)).Msg("seeded banners")
}

// ── Delivery Zones ──

func (s *Seeder) seedDeliveryZones(ctx context.Context) {
	zones := []models.DeliveryZone{
		{NameRu: "Центр города", NameTm: "Şäheriň merkezi", DeliveryPrice: 15.00, IsActive: true},
		{NameRu: "Спальные районы", NameTm: "Ýaşaýyş jaý toplumlary", DeliveryPrice: 25.00, IsActive: true},
		{NameRu: "Пригород", NameTm: "Şäherýaka", DeliveryPrice: 40.00, IsActive: true},
	}

	for i := range zones {
		if err := s.dzRepo.Create(ctx, &zones[i]); err != nil {
			log.Error().Err(err).Msg("failed to seed delivery zone")
		}
	}
	log.Info().Int("count", len(zones)).Msg("seeded delivery zones")
}

// ── Time Slots ──

func (s *Seeder) seedTimeSlots(ctx context.Context) {
	slots := []models.TimeSlot{
		{StartTime: "09:00", EndTime: "12:00", Label: "09:00 - 12:00", IsActive: true},
		{StartTime: "12:00", EndTime: "15:00", Label: "12:00 - 15:00", IsActive: true},
		{StartTime: "15:00", EndTime: "18:00", Label: "15:00 - 18:00", IsActive: true},
		{StartTime: "18:00", EndTime: "21:00", Label: "18:00 - 21:00", IsActive: true},
	}

	for i := range slots {
		if err := s.tsRepo.Create(ctx, &slots[i]); err != nil {
			log.Error().Err(err).Msg("failed to seed time slot")
		}
	}
	log.Info().Int("count", len(slots)).Msg("seeded time slots")
}

func strPtr(s string) *string {
	return &s
}
