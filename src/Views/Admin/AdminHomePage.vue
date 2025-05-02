<template>
  <div class="admin-dashboard">
    <!-- Sidebar Navigation -->
    <div class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 v-if="!sidebarCollapsed">Admin Panel</h2>
        <button @click="toggleSidebar" class="toggle-btn">
          <MenuIcon v-if="sidebarCollapsed" />
          <XIcon v-else />
        </button>
      </div>
      <div class="sidebar-menu">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item"
          :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id"
        >
          <component :is="item.icon" class="menu-icon" />
          <span v-if="!sidebarCollapsed" class="menu-text">{{
            item.name
          }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1>{{ getActiveTabName() }}</h1>
        <div class="user-info">
          <div class="user-name">Admin</div>
          <div class="user-avatar">A</div>
        </div>
      </div>

      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'dashboard'" class="dashboard-content">
        <div class="stats-cards">
          <div class="stat-card">
            <UsersIcon class="stat-icon" />
            <div class="stat-info">
              <h3>Tổng người dùng</h3>
              <p class="stat-value">{{ users.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <ShoppingBagIcon class="stat-icon" />
            <div class="stat-info">
              <h3>Tổng đơn hàng</h3>
              <p class="stat-value">{{ orders.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <StoreIcon class="stat-icon" />
            <div class="stat-info">
              <h3>Tổng cửa hàng</h3>
              <p class="stat-value">{{ shops.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <PackageIcon class="stat-icon" />
            <div class="stat-info">
              <h3>Tổng sản phẩm</h3>
              <p class="stat-value">{{ products.length }}</p>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="chart-container">
            <h2>Doanh thu theo tháng (2025)</h2>
            <MonthlyRevenueChart :chartData="monthlyRevenue" />
          </div>
          <div class="top-categories">
            <h2>Top 5 danh mục bán chạy</h2>
            <div
              v-for="(category, index) in topSellingCategories"
              :key="index"
              class="category-item"
            >
              <div class="category-rank">{{ index + 1 }}</div>
              <div class="category-info">
                <h3>{{ category.categoryName }}</h3>
                <p>Đã bán: {{ category.totalQuantitySold }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-orders">
          <h2>Đơn hàng gần đây</h2>
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>Cửa hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.orderId">
                <td>{{ order.orderNo || order.orderId.substring(0, 8) }}</td>
                <td>{{ formatDate(order.orderDate) }}</td>
                <td>{{ order.userName }}</td>
                <td>{{ order.shopName }}</td>
                <td>{{ formatCurrency(order.totalPrice) }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="getStatusClass(order.orderStatus)"
                  >
                    {{ order.orderStatus }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="tab-content">
        <div class="filters">
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              type="text"
              v-model="orderSearch"
              placeholder="Tìm kiếm đơn hàng..."
            />
          </div>
          <div class="filter-group">
            <select v-model="orderStatusFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="Đang chờ xử lý">Đang chờ xử lý</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Cửa hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.orderId">
              <td>{{ order.orderNo || order.orderId.substring(0, 8) }}</td>
              <td>{{ formatDate(order.orderDate) }}</td>
              <td>{{ order.userName }}</td>
              <td>{{ order.shopName }}</td>
              <td>{{ formatCurrency(order.totalPrice) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="getStatusClass(order.orderStatus)"
                >
                  {{ order.orderStatus }}
                </span>
              </td>
              <td>
                <button class="action-btn">
                  <EyeIcon class="btn-icon" />
                </button>
                <button class="action-btn">
                  <EditIcon class="btn-icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentOrderPage === 1"
            @click="currentOrderPage--"
          >
            <ChevronLeftIcon />
          </button>
          <span>Trang {{ currentOrderPage }} / {{ totalOrderPages }}</span>
          <button
            class="pagination-btn"
            :disabled="currentOrderPage === totalOrderPages"
            @click="currentOrderPage++"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div class="filters">
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              type="text"
              v-model="userSearch"
              placeholder="Tìm kiếm người dùng..."
            />
          </div>
          <div class="filter-group">
            <select v-model="userRoleFilter">
              <option value="">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Cửa hàng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id.substring(0, 8) }}</td>
              <td>{{ user.username || "Chưa đặt tên" }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span
                  class="role-badge"
                  :class="{ 'admin-role': user.enumRole === 'ADMIN' }"
                >
                  {{ user.enumRole }}
                </span>
              </td>
              <td>{{ user.shopId ? "Có" : "Không" }}</td>
              <td>
                <button class="action-btn">
                  <EyeIcon class="btn-icon" />
                </button>
                <button class="action-btn">
                  <EditIcon class="btn-icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentUserPage === 1"
            @click="currentUserPage--"
          >
            <ChevronLeftIcon />
          </button>
          <span>Trang {{ currentUserPage }} / {{ totalUserPages }}</span>
          <button
            class="pagination-btn"
            :disabled="currentUserPage === totalUserPages"
            @click="currentUserPage++"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <!-- Shops Tab -->
      <div v-if="activeTab === 'shops'" class="tab-content">
        <div class="filters">
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              type="text"
              v-model="shopSearch"
              placeholder="Tìm kiếm cửa hàng..."
            />
          </div>
          <div class="filter-group">
            <select v-model="shopStatusFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang mở</option>
              <option value="false">Đang đóng</option>
            </select>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên cửa hàng</th>
              <th>Chủ cửa hàng</th>
              <th>Số điện thoại</th>
              <th>Đánh giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shop in filteredShops" :key="shop.id">
              <td>{{ shop.id.substring(0, 8) }}</td>
              <td class="shop-name">
                <div v-if="shop.shopAvatarUrl" class="shop-avatar">
                  <img :src="shop.shopAvatarUrl" alt="Shop avatar" />
                </div>
                <span>{{ shop.shopName || "Chưa đặt tên" }}</span>
              </td>
              <td>{{ shop.fullName }}</td>
              <td>{{ shop.phoneNumber }}</td>
              <td>
                {{
                  shop.shopRating > 0 ? shop.shopRating.toFixed(1) : "Chưa có"
                }}
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="{
                    'status-success': shop.shopIsOpen,
                    'status-pending': !shop.shopIsOpen,
                  }"
                >
                  {{ shop.shopIsOpen ? "Đang mở" : "Đang đóng" }}
                </span>
              </td>
              <td>
                <button class="action-btn">
                  <EyeIcon class="btn-icon" />
                </button>
                <button class="action-btn">
                  <EditIcon class="btn-icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentShopPage === 1"
            @click="currentShopPage--"
          >
            <ChevronLeftIcon />
          </button>
          <span>Trang {{ currentShopPage }} / {{ totalShopPages }}</span>
          <button
            class="pagination-btn"
            :disabled="currentShopPage === totalShopPages"
            @click="currentShopPage++"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <div class="filters">
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              type="text"
              v-model="productSearch"
              placeholder="Tìm kiếm sản phẩm..."
            />
          </div>
          <div class="filter-group">
            <select v-model="productApprovalFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đã duyệt</option>
              <option value="false">Chưa duyệt</option>
            </select>
          </div>
        </div>

        <div class="products-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.imageList[0]" alt="Product image" />
              <div
                class="product-approval"
                :class="{ approved: product.approved }"
              >
                {{ product.approved ? "Đã duyệt" : "Chưa duyệt" }}
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ product.productTitle }}</h3>
              <p class="product-shop">{{ getShopName(product.shopId) }}</p>
              <p class="product-price">
                {{ formatCurrency(getProductPrice(product)) }}
              </p>
              <div class="product-actions">
                <button class="action-btn">
                  <EyeIcon class="btn-icon" />
                </button>
                <button
                  class="action-btn"
                  @click="toggleProductApproval(product)"
                >
                  <CheckIcon v-if="!product.approved" class="btn-icon" />
                  <XIcon v-else class="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button
            class="pagination-btn"
            :disabled="currentProductPage === 1"
            @click="currentProductPage--"
          >
            <ChevronLeftIcon />
          </button>
          <span>Trang {{ currentProductPage }} / {{ totalProductPages }}</span>
          <button
            class="pagination-btn"
            :disabled="currentProductPage === totalProductPages"
            @click="currentProductPage++"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-if="activeTab === 'transactions'" class="tab-content">
        <div class="filters">
          <div class="search-box">
            <SearchIcon class="search-icon" />
            <input
              type="text"
              v-model="transactionSearch"
              placeholder="Tìm kiếm giao dịch..."
            />
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Ngày giao dịch</th>
              <th>Người dùng</th>
              <th>Cửa hàng</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Mã đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
            >
              <td>{{ transaction.transactionNo }}</td>
              <td>{{ formatDate(transaction.transactionCreatedAt) }}</td>
              <td>{{ getUserName(transaction.transactionUserId) }}</td>
              <td>{{ getShopName(transaction.transactionShopId) }}</td>
              <td>{{ formatCurrency(transaction.transactionAmount) }}</td>
              <td>{{ transaction.cardType }}</td>
              <td>{{ transaction.orderId.substring(0, 8) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vouchers Tab -->
      <div v-if="activeTab === 'vouchers'" class="tab-content">
        <div class="action-header">
          <button class="primary-btn">
            <PlusIcon class="btn-icon" />
            Thêm voucher mới
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Mã voucher</th>
              <th>Giá trị</th>
              <th>Giá trị tối thiểu</th>
              <th>Giới hạn sử dụng</th>
              <th>Đã sử dụng</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="voucher in vouchers" :key="voucher.id">
              <td>{{ voucher.code }}</td>
              <td>{{ formatCurrency(voucher.discountValue) }}</td>
              <td>{{ formatCurrency(voucher.minOrderValue) }}</td>
              <td>{{ voucher.usageLimit }}</td>
              <td>{{ voucher.usedCount }}</td>
              <td>{{ formatDate(voucher.startDate) }}</td>
              <td>{{ formatDate(voucher.endDate) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="getVoucherStatusClass(voucher.status)"
                >
                  {{ voucher.status }}
                </span>
              </td>
              <td>
                <button class="action-btn">
                  <EditIcon class="btn-icon" />
                </button>
                <button class="action-btn">
                  <TrashIcon class="btn-icon" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Commission Rates Tab -->
      <div v-if="activeTab === 'commission'" class="tab-content">
        <div class="commission-header">
          <h2>Tỷ lệ hoa hồng năm 2025</h2>
          <button class="primary-btn">
            <EditIcon class="btn-icon" />
            Chỉnh sửa
          </button>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Giá trị đơn hàng từ</th>
              <th>Giá trị đơn hàng đến</th>
              <th>Tỷ lệ hoa hồng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rate, index) in commissionRates" :key="index">
              <td>{{ formatCurrency(rate.minPrice) }}</td>
              <td>{{ formatCurrency(rate.maxPrice) }}</td>
              <td>{{ (rate.commissionRate * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  MenuIcon,
  XIcon,
  UsersIcon,
  ShoppingBagIcon,
  StoreIcon,
  PackageIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  BarChartIcon,
  CreditCardIcon,
  TagIcon,
  PercentIcon,
  HomeIcon,
} from "lucide-vue-next";
import usersService from "../../services/users.service";
import shopService from "../../services/shop.service";
import orderService from "../../services/order.service";
import productService from "../../services/product.service";
import transactionService from "../../services/transaction.service";
import voucherService from "../../services/voucher.service";
import adminService from "../../services/admin.service";
import categoryService from "../../services/category.service";

// Data from API
const orders = ref([]);
const users = ref([]);
const shops = ref([]);
const products = ref([]);
const transactions = ref([]);
const vouchers = ref([]);
const monthlyRevenue = ref({});
const topSellingCategories = ref([]);
const commissionRates = ref([]);

// UI state
const sidebarCollapsed = ref(false);
const activeTab = ref("dashboard");

// Pagination
const itemsPerPage = 10;
const currentOrderPage = ref(1);
const currentUserPage = ref(1);
const currentShopPage = ref(1);
const currentProductPage = ref(1);

// Filters
const orderSearch = ref("");
const orderStatusFilter = ref("");
const userSearch = ref("");
const userRoleFilter = ref("");
const shopSearch = ref("");
const shopStatusFilter = ref("");
const productSearch = ref("");
const productApprovalFilter = ref("");
const transactionSearch = ref("");

// Menu items
const menuItems = [
  { id: "dashboard", name: "Tổng quan", icon: HomeIcon },
  { id: "orders", name: "Đơn hàng", icon: ShoppingBagIcon },
  { id: "users", name: "Người dùng", icon: UsersIcon },
  { id: "shops", name: "Cửa hàng", icon: StoreIcon },
  { id: "products", name: "Sản phẩm", icon: PackageIcon },
  { id: "transactions", name: "Giao dịch", icon: CreditCardIcon },
  { id: "vouchers", name: "Vouchers", icon: TagIcon },
  { id: "commission", name: "Hoa hồng", icon: PercentIcon },
  { id: "statistics", name: "Thống kê", icon: BarChartIcon },
];

onMounted(() => {
  loadOrders();
  loadUsers();
  loadShops();
  loadProducts();
  loadTransactions();
  loadVouchers();
  loadMonthlyRevenue();
  loadTopSellingCategories();
  loadCommissionRates();
});

async function loadOrders() {
  try {
    orders.value = await orderService.getAllOrdersWithDetail();
  } catch (error) {
    console.error(error);
  }
}

async function loadUsers() {
  try {
    users.value = await usersService.getAllUsers();
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

async function loadShops() {
  try {
    shops.value = await shopService.getAll();
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

async function loadProducts() {
  try {
    products.value = await productService.getAll();
  } catch (error) {
    console.error(error);
  }
}

async function loadTransactions() {
  try {
    transactions.value = await transactionService.getAll();
  } catch (error) {
    console.error(error);
  }
}

async function loadVouchers() {
  try {
    vouchers.value = await voucherService.getVouchersByPlatform();
  } catch (error) {
    console.error("Error loading vouchers:", error);
  }
}

async function loadMonthlyRevenue() {
  try{
    //need year param
    monthlyRevenue.value = await adminService.getMonthlyRevenueForYear(2025)
  }catch(error){
    console.error(error)
  }
}

async function loadTopSellingCategories() {
  try{
    
    topSellingCategories.value = await categoryService.getTop5(3,2025)
  } catch(error) {
    console.error("Error loading top selling categories:", error);
  }
}

function loadCommissionRates() {
  commissionRates.value = [
    {
      minPrice: 0,
      maxPrice: 20000000,
      commissionRate: 0.08,
    },
    {
      minPrice: 20000000,
      maxPrice: 35000000,
      commissionRate: 0.09,
    },
    {
      minPrice: 35000000,
      maxPrice: 50000000,
      commissionRate: 0.1,
    },
  ];
}

// Computed properties
const recentOrders = computed(() => {
  return [...orders.value]
    .sort((a, b) => b.orderDate - a.orderDate)
    .slice(0, 5);
});

const filteredOrders = computed(() => {
  let result = [...orders.value];

  if (orderSearch.value) {
    const searchTerm = orderSearch.value.toLowerCase();
    result = result.filter(
      (order) =>
        (order.orderNo && order.orderNo.toLowerCase().includes(searchTerm)) ||
        order.orderId.toLowerCase().includes(searchTerm) ||
        order.userName.toLowerCase().includes(searchTerm) ||
        order.shopName.toLowerCase().includes(searchTerm)
    );
  }

  if (orderStatusFilter.value) {
    result = result.filter(
      (order) => order.orderStatus === orderStatusFilter.value
    );
  }

  // Sort by date (newest first)
  result = result.sort((a, b) => b.orderDate - a.orderDate);

  // Pagination
  const startIndex = (currentOrderPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalOrderPages = computed(() => {
  const filteredCount = orders.value.filter((order) => {
    if (
      orderStatusFilter.value &&
      order.orderStatus !== orderStatusFilter.value
    ) {
      return false;
    }
    if (orderSearch.value) {
      const searchTerm = orderSearch.value.toLowerCase();
      return (
        (order.orderNo && order.orderNo.toLowerCase().includes(searchTerm)) ||
        order.orderId.toLowerCase().includes(searchTerm) ||
        order.userName.toLowerCase().includes(searchTerm) ||
        order.shopName.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  }).length;

  return Math.ceil(filteredCount / itemsPerPage);
});

const filteredUsers = computed(() => {
  let result = [...users.value];

  if (userSearch.value) {
    const searchTerm = userSearch.value.toLowerCase();
    result = result.filter(
      (user) =>
        (user.username && user.username.toLowerCase().includes(searchTerm)) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
    );
  }

  if (userRoleFilter.value) {
    result = result.filter((user) => user.enumRole === userRoleFilter.value);
  }

  // Pagination
  const startIndex = (currentUserPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalUserPages = computed(() => {
  const filteredCount = users.value.filter((user) => {
    if (userRoleFilter.value && user.enumRole !== userRoleFilter.value) {
      return false;
    }
    if (userSearch.value) {
      const searchTerm = userSearch.value.toLowerCase();
      return (
        (user.username && user.username.toLowerCase().includes(searchTerm)) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  }).length;

  return Math.ceil(filteredCount / itemsPerPage);
});

const filteredShops = computed(() => {
  let result = [...shops.value];

  if (shopSearch.value) {
    const searchTerm = shopSearch.value.toLowerCase();
    result = result.filter(
      (shop) =>
        (shop.shopName && shop.shopName.toLowerCase().includes(searchTerm)) ||
        (shop.fullName && shop.fullName.toLowerCase().includes(searchTerm)) ||
        shop.id.toLowerCase().includes(searchTerm)
    );
  }

  if (shopStatusFilter.value !== "") {
    const isOpen = shopStatusFilter.value === "true";
    result = result.filter((shop) => shop.shopIsOpen === isOpen);
  }

  // Pagination
  const startIndex = (currentShopPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalShopPages = computed(() => {
  const filteredCount = shops.value.filter((shop) => {
    if (
      shopStatusFilter.value !== "" &&
      shop.shopIsOpen !== (shopStatusFilter.value === "true")
    ) {
      return false;
    }
    if (shopSearch.value) {
      const searchTerm = shopSearch.value.toLowerCase();
      return (
        (shop.shopName && shop.shopName.toLowerCase().includes(searchTerm)) ||
        (shop.fullName && shop.fullName.toLowerCase().includes(searchTerm)) ||
        shop.id.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  }).length;

  return Math.ceil(filteredCount / itemsPerPage);
});

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (productSearch.value) {
    const searchTerm = productSearch.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.productTitle.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm)
    );
  }

  if (productApprovalFilter.value !== "") {
    const isApproved = productApprovalFilter.value === "true";
    result = result.filter((product) => product.approved === isApproved);
  }

  // Pagination
  const startIndex = (currentProductPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return result.slice(startIndex, endIndex);
});

const totalProductPages = computed(() => {
  const filteredCount = products.value.filter((product) => {
    if (
      productApprovalFilter.value !== "" &&
      product.approved !== (productApprovalFilter.value === "true")
    ) {
      return false;
    }
    if (productSearch.value) {
      const searchTerm = productSearch.value.toLowerCase();
      return (
        product.productTitle.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  }).length;

  return Math.ceil(filteredCount / itemsPerPage);
});

const filteredTransactions = computed(() => {
  let result = [...transactions.value];

  if (transactionSearch.value) {
    const searchTerm = transactionSearch.value.toLowerCase();
    result = result.filter(
      (transaction) =>
        transaction.transactionNo.toLowerCase().includes(searchTerm) ||
        transaction.orderId.toLowerCase().includes(searchTerm) ||
        transaction.id.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// Helper functions
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getStatusClass(status) {
  switch (status) {
    case "Đang chờ xử lý":
      return "status-pending";
    case "Hoàn thành":
      return "status-success";
    default:
      return "";
  }
}

function getVoucherStatusClass(status) {
  switch (status) {
    case "ACTIVE":
      return "status-success";
    case "EXPIRED":
      return "status-expired";
    default:
      return "";
  }
}

function getShopName(shopId) {
  const shop = shops.value.find((s) => s.id === shopId);
  return shop ? shop.shopName : "Không xác định";
}

function getUserName(userId) {
  const user = users.value.find((u) => u.id === userId);
  return user ? user.username || user.email : "Không xác định";
}

function getProductPrice(product) {
  if (product.basePrice > 0) {
    return product.basePrice;
  }

  if (product.variationList && product.variationList.length > 0) {
    return product.variationList[0].price;
  }

  return 0;
}

function toggleProductApproval(product) {
  product.approved = !product.approved;
  // In a real application, this would make an API call to update the product
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

function getActiveTabName() {
  const activeMenuItem = menuItems.find((item) => item.id === activeTab.value);
  return activeMenuItem ? activeMenuItem.name : "";
}
</script>

<script>
// MonthlyRevenueChart component
export default {
  components: {
    MonthlyRevenueChart: {
      props: {
        chartData: {
          type: Object,
          required: true,
        },
      },
      template: `
        <div class="chart">
          <div class="chart-bars">
            <div 
              v-for="(value, month) in chartData" 
              :key="month" 
              class="chart-bar"
              :style="{ height: getBarHeight(value) }"
              :class="{ 'has-value': value > 0 }"
            >
              <div class="bar-value" v-if="value > 0">{{ formatValue(value) }}</div>
            </div>
          </div>
          <div class="chart-labels">
            <div v-for="month in 12" :key="month" class="chart-label">
              {{ month }}
            </div>
          </div>
        </div>
      `,
      methods: {
        getBarHeight(value) {
          const maxValue = Math.max(...Object.values(this.chartData));
          if (maxValue === 0) return "0%";
          return `${(value / maxValue) * 100}%`;
        },
        formatValue(value) {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            notation: "compact",
            minimumFractionDigits: 0,
          }).format(value);
        },
      },
    },
  },
};
</script>

<style scoped>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

body {
  background-color: #f5f5f5;
  color: #333;
}

/* Admin dashboard layout */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styles */
.sidebar {
  width: 250px;
  background-color: #1a1a1a;
  color: #fff;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #333;
}

.toggle-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-menu {
  padding: 20px 0;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #333;
}

.menu-item.active {
  background-color: #0070f3;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.sidebar-collapsed .menu-text {
  display: none;
}

/* Main content styles */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 10px;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #0070f3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Dashboard content styles */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 40px;
  height: 40px;
  color: #0070f3;
  margin-right: 15px;
}

.stat-info h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-container h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.chart {
  height: 250px;
  position: relative;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
}

.chart-bar {
  width: 7%;
  background-color: #e6e6e6;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease;
}

.chart-bar.has-value {
  background-color: #0070f3;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.chart-label {
  width: 7%;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.top-categories {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.top-categories h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.category-item:last-child {
  border-bottom: none;
}

.category-rank {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
}

.category-info h3 {
  font-size: 16px;
  margin-bottom: 5px;
}

.category-info p {
  font-size: 14px;
  color: #666;
}

.recent-orders {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.recent-orders h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

/* Table styles */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  font-weight: 600;
  color: #666;
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff8e6;
  color: #ffa500;
}

.status-success {
  background-color: #e6f7ee;
  color: #00a854;
}

.status-expired {
  background-color: #f5f5f5;
  color: #999;
}

.role-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e6f7ff;
  color: #0070f3;
}

.admin-role {
  background-color: #fff1f0;
  color: #ff4d4f;
}

/* Tab content styles */
.tab-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
}

.filter-group select {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  background-color: white;
}

.data-table {
  margin-bottom: 20px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  margin-right: 5px;
}

.action-btn:hover {
  color: #0070f3;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-approval {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: #fff8e6;
  color: #ffa500;
}

.product-approval.approved {
  background-color: #e6f7ee;
  color: #00a854;
}

.product-info {
  padding: 15px;
}

.product-title {
  font-size: 16px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-shop {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
}

/* Shop name with avatar */
.shop-name {
  display: flex;
  align-items: center;
}

.shop-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.shop-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Action header */
.action-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.primary-btn {
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.primary-btn .btn-icon {
  margin-right: 5px;
}

/* Commission header */
.commission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.commission-header h2 {
  font-size: 18px;
}
</style>
