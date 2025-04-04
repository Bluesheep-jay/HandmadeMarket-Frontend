<template>
    <q-layout view="hHh LpR fFf">
      <!-- Header -->
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
  
          <q-toolbar-title>
            <div class="row items-center">
              <q-icon name="handyman" size="md" class="q-mr-sm" />
              Handmade Market Admin
            </div>
          </q-toolbar-title>
  
          <q-space />
  
          <!-- Notifications -->
          <q-btn round flat icon="notifications">
            <q-badge color="red" floating>5</q-badge>
            <q-tooltip>Thông báo</q-tooltip>
          </q-btn>
  
          <!-- Admin Profile -->
          <q-btn round flat>
            <q-avatar size="sm">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <q-tooltip>Hồ sơ</q-tooltip>
          </q-btn>
        </q-toolbar>
      </q-header>
  
      <!-- Left Drawer / Sidebar -->
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :width="240"
        :breakpoint="500"
        class="bg-grey-1"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item-label header class="text-grey-8">QUẢN LÝ CHUNG</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'dashboard'" @click="currentPage = 'dashboard'">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>Tổng quan</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">QUẢN LÝ SẢN PHẨM</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'products'" @click="currentPage = 'products'">
              <q-item-section avatar>
                <q-icon name="inventory_2" />
              </q-item-section>
              <q-item-section>Sản phẩm</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'categories'" @click="currentPage = 'categories'">
              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>
              <q-item-section>Danh mục</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'collections'" @click="currentPage = 'collections'">
              <q-item-section avatar>
                <q-icon name="collections" />
              </q-item-section>
              <q-item-section>Bộ sưu tập</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">QUẢN LÝ NGƯỜI DÙNG</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'customers'" @click="currentPage = 'customers'">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>Khách hàng</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'sellers'" @click="currentPage = 'sellers'">
              <q-item-section avatar>
                <q-icon name="store" />
              </q-item-section>
              <q-item-section>Người bán</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">QUẢN LÝ ĐƠN HÀNG</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'orders'" @click="currentPage = 'orders'">
              <q-item-section avatar>
                <q-icon name="shopping_cart" />
              </q-item-section>
              <q-item-section>Đơn hàng</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'returns'" @click="currentPage = 'returns'">
              <q-item-section avatar>
                <q-icon name="assignment_return" />
              </q-item-section>
              <q-item-section>Trả hàng & Hoàn tiền</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">MARKETING</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'banners'" @click="currentPage = 'banners'">
              <q-item-section avatar>
                <q-icon name="view_carousel" />
              </q-item-section>
              <q-item-section>Banners</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'promotions'" @click="currentPage = 'promotions'">
              <q-item-section avatar>
                <q-icon name="local_offer" />
              </q-item-section>
              <q-item-section>Khuyến mãi</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">NỘI DUNG</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'reviews'" @click="currentPage = 'reviews'">
              <q-item-section avatar>
                <q-icon name="rate_review" />
              </q-item-section>
              <q-item-section>Đánh giá</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'reports'" @click="currentPage = 'reports'">
              <q-item-section avatar>
                <q-icon name="flag" />
              </q-item-section>
              <q-item-section>Báo cáo vi phạm</q-item-section>
            </q-item>
  
            <q-separator spaced />
            <q-item-label header class="text-grey-8">HỆ THỐNG</q-item-label>
  
            <q-item clickable v-ripple :active="currentPage === 'analytics'" @click="currentPage = 'analytics'">
              <q-item-section avatar>
                <q-icon name="insights" />
              </q-item-section>
              <q-item-section>Phân tích</q-item-section>
            </q-item>
  
            <q-item clickable v-ripple :active="currentPage === 'settings'" @click="currentPage = 'settings'">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>Cài đặt</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
  
      <!-- Main Content Area -->
      <q-page-container>
        <!-- Dashboard Overview -->
        <q-page padding v-if="currentPage === 'dashboard'">
          <div class="text-h5 q-mb-md">Tổng quan</div>
          
          <!-- Stats Cards -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ formatNumber(totalRevenue) }}</div>
                      <div class="text-subtitle2">Doanh thu</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="payments" size="md" color="primary" />
                    </div>
                  </div>
                  <div class="text-caption text-positive q-mt-sm">
                    <q-icon name="trending_up" size="xs" />
                    +15% so với tháng trước
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ totalOrders }}</div>
                      <div class="text-subtitle2">Đơn hàng</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="shopping_bag" size="md" color="orange" />
                    </div>
                  </div>
                  <div class="text-caption text-positive q-mt-sm">
                    <q-icon name="trending_up" size="xs" />
                    +8% so với tháng trước
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ totalProducts }}</div>
                      <div class="text-subtitle2">Sản phẩm</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="inventory_2" size="md" color="green" />
                    </div>
                  </div>
                  <div class="text-caption text-positive q-mt-sm">
                    <q-icon name="trending_up" size="xs" />
                    +12% so với tháng trước
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ totalUsers }}</div>
                      <div class="text-subtitle2">Người dùng</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="people" size="md" color="purple" />
                    </div>
                  </div>
                  <div class="text-caption text-positive q-mt-sm">
                    <q-icon name="trending_up" size="xs" />
                    +5% so với tháng trước
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Charts Row -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-8">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Doanh thu theo thời gian</div>
                  <div class="text-caption">7 ngày qua</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div style="height: 300px" class="revenue-chart">
                    <!-- Chart would go here - using placeholder -->
                    <div class="chart-placeholder">
                      <div class="chart-bars">
                        <div class="chart-bar" style="height: 60%"></div>
                        <div class="chart-bar" style="height: 80%"></div>
                        <div class="chart-bar" style="height: 40%"></div>
                        <div class="chart-bar" style="height: 70%"></div>
                        <div class="chart-bar" style="height: 90%"></div>
                        <div class="chart-bar" style="height: 50%"></div>
                        <div class="chart-bar" style="height: 75%"></div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-md-4">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Danh mục phổ biến</div>
                  <div class="text-caption">Theo số lượng sản phẩm</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div style="height: 300px" class="categories-chart">
                    <!-- Donut chart placeholder -->
                    <div class="donut-placeholder">
                      <div class="donut-chart"></div>
                      <div class="donut-label">Trang sức</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <q-card>
            <q-card-section>
              <div class="text-h6">Đơn hàng gần đây</div>
            </q-card-section>
            <q-separator />
            <q-table
              :rows="recentOrders"
              :columns="orderColumns"
              row-key="id"
              :pagination="{ rowsPerPage: 5 }"
              flat
              bordered
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip :color="getStatusColor(props.value)" text-color="white" dense>
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-sm">
                  <q-btn flat round dense color="primary" icon="visibility" size="sm">
                    <q-tooltip>Xem chi tiết</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="green" icon="check_circle" size="sm">
                    <q-tooltip>Xác nhận</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </q-page>
  
        <!-- Products Management -->
        <q-page padding v-else-if="currentPage === 'products'">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">Quản lý Sản phẩm</div>
            <q-btn color="primary" icon="add" label="Thêm sản phẩm" />
          </div>
          
          <!-- Filters -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="productSearch" label="Tìm kiếm sản phẩm" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="productCategory"
                :options="categoryOptions"
                label="Danh mục"
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="productStatus"
                :options="statusOptions"
                label="Trạng thái"
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-btn color="primary" flat icon="filter_list" label="Lọc nâng cao" />
            </div>
          </div>
          
          <!-- Products Table -->
          <q-table
            :rows="products"
            :columns="productColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading"
            :filter="productSearch"
            binary-state-sort
          >
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-img
                  :src="props.value"
                  spinner-color="primary"
                  style="height: 50px; width: 50px"
                  fit="cover"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip :color="props.value === 'Đã duyệt' ? 'green' : props.value === 'Chờ duyệt' ? 'orange' : 'red'" text-color="white" dense>
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn flat round dense color="primary" icon="visibility" size="sm">
                  <q-tooltip>Xem chi tiết</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="green" icon="check_circle" size="sm">
                  <q-tooltip>Duyệt sản phẩm</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="red" icon="delete" size="sm">
                  <q-tooltip>Xóa</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-page>
  
        <!-- Sellers Management -->
        <q-page padding v-else-if="currentPage === 'sellers'">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">Quản lý Người bán</div>
            <q-btn color="primary" icon="add" label="Thêm người bán" />
          </div>
          
          <!-- Filters -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-input dense outlined v-model="sellerSearch" label="Tìm kiếm người bán" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4">
              <q-select
                dense
                outlined
                v-model="sellerStatus"
                :options="['Tất cả', 'Đang hoạt động', 'Tạm khóa', 'Chờ duyệt']"
                label="Trạng thái"
                clearable
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn color="primary" flat icon="filter_list" label="Lọc nâng cao" />
            </div>
          </div>
          
          <!-- Sellers Table -->
          <q-table
            :rows="sellers"
            :columns="sellerColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading"
            :filter="sellerSearch"
            binary-state-sort
          >
            <template v-slot:body-cell-avatar="props">
              <q-td :props="props">
                <q-avatar size="40px">
                  <img :src="props.value" />
                </q-avatar>
              </q-td>
            </template>
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip 
                  :color="props.value === 'Đang hoạt động' ? 'green' : props.value === 'Chờ duyệt' ? 'orange' : 'red'" 
                  text-color="white" 
                  dense
                >
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn flat round dense color="primary" icon="visibility" size="sm">
                  <q-tooltip>Xem chi tiết</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="green" icon="check_circle" size="sm">
                  <q-tooltip>Duyệt người bán</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="orange" icon="block" size="sm">
                  <q-tooltip>Khóa tài khoản</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-page>
  
        <!-- Orders Management -->
        <q-page padding v-else-if="currentPage === 'orders'">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">Quản lý Đơn hàng</div>
          </div>
          
          <!-- Order Stats -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ pendingOrders }}</div>
                      <div class="text-subtitle2">Chờ xác nhận</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="pending" size="md" color="orange" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ processingOrders }}</div>
                      <div class="text-subtitle2">Đang xử lý</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="local_shipping" size="md" color="blue" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ completedOrders }}</div>
                      <div class="text-subtitle2">Hoàn thành</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="check_circle" size="md" color="green" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            
            <div class="col-12 col-sm-6 col-md-3">
              <q-card class="stats-card">
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-h6">{{ cancelledOrders }}</div>
                      <div class="text-subtitle2">Đã hủy</div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="cancel" size="md" color="red" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="orderSearch" label="Tìm kiếm đơn hàng" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="orderStatus"
                :options="['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy']"
                label="Trạng thái"
                clearable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="orderDateRange" label="Khoảng thời gian" mask="date-range">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="orderDateRange" range />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-btn color="primary" flat icon="filter_list" label="Lọc nâng cao" />
            </div>
          </div>
          
          <!-- Orders Table -->
          <q-table
            :rows="allOrders"
            :columns="orderColumns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :loading="loading"
            :filter="orderSearch"
            binary-state-sort
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip :color="getStatusColor(props.value)" text-color="white" dense>
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn flat round dense color="primary" icon="visibility" size="sm">
                  <q-tooltip>Xem chi tiết</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="green" icon="check_circle" size="sm" v-if="props.row.status === 'Chờ xác nhận'">
                  <q-tooltip>Xác nhận</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="red" icon="cancel" size="sm" v-if="['Chờ xác nhận', 'Đang xử lý'].includes(props.row.status)">
                  <q-tooltip>Hủy đơn</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-page>
  
        <!-- Placeholder for other pages -->
        <q-page padding v-else>
          <div class="text-h5 q-mb-md">{{ getPageTitle() }}</div>
          <q-card>
            <q-card-section>
              <div class="text-center q-pa-lg">
                <q-icon name="construction" size="100px" color="grey-5" />
                <div class="text-h6 q-mt-md">Trang đang được phát triển</div>
                <div class="text-body1 q-mt-sm">
                  Chức năng này sẽ sớm được hoàn thiện.
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // UI State
  const leftDrawerOpen = ref(false);
  const currentPage = ref('dashboard');
  const loading = ref(false);
  
  // Dashboard Data
  const totalRevenue = ref(1250000000);
  const totalOrders = ref(1856);
  const totalProducts = ref(4328);
  const totalUsers = ref(2150);
  
  // Products Management
  const productSearch = ref('');
  const productCategory = ref(null);
  const productStatus = ref(null);
  const categoryOptions = [
    'Trang sức', 'Đồ gỗ', 'Đồ gốm', 'Thủ công mỹ nghệ', 'Đồ thêu', 'Tranh vẽ', 'Đồ da', 'Nến thơm', 'Xà phòng handmade', 'Khác'
  ];
  const statusOptions = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã ẩn'];
  
  // Sellers Management
  const sellerSearch = ref('');
  const sellerStatus = ref(null);
  
  // Orders Management
  const orderSearch = ref('');
  const orderStatus = ref(null);
  const orderDateRange = ref('');
  const pendingOrders = ref(45);
  const processingOrders = ref(78);
  const completedOrders = ref(1652);
  const cancelledOrders = ref(81);
  
  // Mock Data
  const products = ref([
    {
      id: 'P001',
      image: 'https://i.etsystatic.com/10932069/r/il/5d01ee/5450878877/il_794xN.5450878877_qp6p.jpg',
      name: 'Dây chuyền vàng đính kim cương',
      category: 'Trang sức',
      price: 4800000,
      seller: 'Ngọc Bích Jewelry',
      status: 'Đã duyệt',
      date: '2023-12-15'
    },
    {
      id: 'P002',
      image: 'https://i.etsystatic.com/12751469/r/il/9ff457/4014367908/il_794xN.4014367908_30gg.jpg',
      name: 'Vòng tay vàng đính đá quý phong cách thường thượng',
      category: 'Trang sức',
      price: 1500000,
      seller: 'Ngọc Bích Jewelry',
      status: 'Đã duyệt',
      date: '2023-12-18'
    },
    {
      id: 'P003',
      image: 'https://res.cloudinary.com/dnsvndg9g/image/upload/v1742574345/nen1.3.1_h26xnu.avif',
      name: 'Nến thơm tinh dầu thiên nhiên - Thư giãn mỗi ngày',
      category: 'Nến thơm',
      price: 270000,
      seller: 'Handmade Candles',
      status: 'Chờ duyệt',
      date: '2023-12-20'
    },
    {
      id: 'P004',
      image: 'https://res.cloudinary.com/dnsvndg9g/image/upload/v1742543865/a6mwjwrebts0twogyuy9.avif',
      name: 'Monogram Heart mặt dây chuyền dây chuyền bằng GracePersonalized',
      category: 'Trang sức',
      price: 1000000,
      seller: 'Grace Jewelry',
      status: 'Đã ẩn',
      date: '2023-12-22'
    },
    {
      id: 'P005',
      image: 'https://res.cloudinary.com/dnsvndg9g/image/upload/v1742222120/dajvhpbksqhaojhwqy9y.webp',
      name: 'Áo hoodie lucky you',
      category: 'Thời trang',
      price: 340000,
      seller: 'Fashion Handmade',
      status: 'Chờ duyệt',
      date: '2023-12-25'
    }
  ]);
  
  const sellers = ref([
    {
      id: 'S001',
      avatar: 'https://i.pinimg.com/736x/7a/3a/09/7a3a09580e686b9fb4b45ac58c9ef793.jpg',
      name: 'Ngọc Bích Jewelry',
      email: 'ngocbich@example.com',
      phone: '0911234567',
      products: 5,
      rating: 4.8,
      status: 'Đang hoạt động',
      date: '2023-10-15'
    },
    {
      id: 'S002',
      avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
      name: 'Handmade Candles',
      email: 'candles@example.com',
      phone: '0921234567',
      products: 12,
      rating: 4.5,
      status: 'Đang hoạt động',
      date: '2023-11-05'
    },
    {
      id: 'S003',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      name: 'Grace Jewelry',
      email: 'grace@example.com',
      phone: '0931234567',
      products: 8,
      rating: 4.2,
      status: 'Chờ duyệt',
      date: '2023-12-10'
    },
    {
      id: 'S004',
      avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
      name: 'Fashion Handmade',
      email: 'fashion@example.com',
      phone: '0941234567',
      products: 15,
      rating: 3.9,
      status: 'Tạm khóa',
      date: '2023-09-20'
    }
  ]);
  
  const recentOrders = ref([
    {
      id: 'ORD001',
      customer: 'Nguyễn Văn A',
      date: '2023-12-28',
      total: 4800000,
      status: 'Chờ xác nhận',
      payment: 'COD'
    },
    {
      id: 'ORD002',
      customer: 'Trần Thị B',
      date: '2023-12-27',
      total: 1500000,
      status: 'Đang xử lý',
      payment: 'Banking'
    },
    {
      id: 'ORD003',
      customer: 'Lê Văn C',
      date: '2023-12-26',
      total: 270000,
      status: 'Đang giao hàng',
      payment: 'COD'
    },
    {
      id: 'ORD004',
      customer: 'Phạm Thị D',
      date: '2023-12-25',
      total: 1000000,
      status: 'Hoàn thành',
      payment: 'Banking'
    },
    {
      id: 'ORD005',
      customer: 'Hoàng Văn E',
      date: '2023-12-24',
      total: 340000,
      status: 'Đã hủy',
      payment: 'COD'
    }
  ]);
  
  const allOrders = ref([...recentOrders.value]);
  
  // Table Columns
  const productColumns = [
    { name: 'image', label: 'Hình ảnh', field: 'image', align: 'center' },
    { name: 'id', label: 'Mã SP', field: 'id', sortable: true },
    { name: 'name', label: 'Tên sản phẩm', field: 'name', sortable: true },
    { name: 'category', label: 'Danh mục', field: 'category', sortable: true },
    { name: 'price', label: 'Giá', field: 'price', sortable: true, format: val => formatNumber(val) },
    { name: 'seller', label: 'Người bán', field: 'seller', sortable: true },
    { name: 'status', label: 'Trạng thái', field: 'status', sortable: true },
    { name: 'date', label: 'Ngày tạo', field: 'date', sortable: true },
    { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
  ];
  
  const sellerColumns = [
    { name: 'avatar', label: 'Ảnh', field: 'avatar', align: 'center' },
    { name: 'id', label: 'Mã', field: 'id', sortable: true },
    { name: 'name', label: 'Tên cửa hàng', field: 'name', sortable: true },
    { name: 'email', label: 'Email', field: 'email', sortable: true },
    { name: 'phone', label: 'Số điện thoại', field: 'phone' },
    { name: 'products', label: 'Sản phẩm', field: 'products', sortable: true },
    { name: 'rating', label: 'Đánh giá', field: 'rating', sortable: true },
    { name: 'status', label: 'Trạng thái', field: 'status', sortable: true },
    { name: 'date', label: 'Ngày đăng ký', field: 'date', sortable: true },
    { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
  ];
  
  const orderColumns = [
    { name: 'id', label: 'Mã đơn', field: 'id', sortable: true },
    { name: 'customer', label: 'Khách hàng', field: 'customer', sortable: true },
    { name: 'date', label: 'Ngày đặt', field: 'date', sortable: true },
    { name: 'total', label: 'Tổng tiền', field: 'total', sortable: true, format: val => formatNumber(val) },
    { name: 'status', label: 'Trạng thái', field: 'status', sortable: true },
    { name: 'payment', label: 'Thanh toán', field: 'payment', sortable: true },
    { name: 'actions', label: 'Thao tác', field: 'actions', align: 'center' }
  ];
  
  // Helper Functions
  function formatNumber(value) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'Chờ xác nhận': return 'orange';
      case 'Đang xử lý': return 'blue';
      case 'Đang giao hàng': return 'teal';
      case 'Hoàn thành': return 'green';
      case 'Đã hủy': return 'red';
      case 'Đã duyệt': return 'green';
      case 'Chờ duyệt': return 'orange';
      case 'Đã ẩn': return 'grey';
      case 'Đang hoạt động': return 'green';
      case 'Tạm khóa': return 'red';
      default: return 'grey';
    }
  }
  
  function getPageTitle() {
    switch (currentPage.value) {
      case 'dashboard': return 'Tổng quan';
      case 'products': return 'Quản lý Sản phẩm';
      case 'categories': return 'Quản lý Danh mục';
      case 'collections': return 'Quản lý Bộ sưu tập';
      case 'customers': return 'Quản lý Khách hàng';
      case 'sellers': return 'Quản lý Người bán';
      case 'orders': return 'Quản lý Đơn hàng';
      case 'returns': return 'Quản lý Trả hàng & Hoàn tiền';
      case 'banners': return 'Quản lý Banners';
      case 'promotions': return 'Quản lý Khuyến mãi';
      case 'reviews': return 'Quản lý Đánh giá';
      case 'reports': return 'Quản lý Báo cáo vi phạm';
      case 'analytics': return 'Phân tích dữ liệu';
      case 'settings': return 'Cài đặt hệ thống';
      default: return 'Trang quản trị';
    }
  }
  </script>
  
  <style scoped>
  .stats-card {
    transition: all 0.3s ease;
  }
  
  .stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Chart Placeholders */
  .chart-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding: 20px;
  }
  
  .chart-bars {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    justify-content: space-around;
  }
  
  .chart-bar {
    width: 40px;
    background: linear-gradient(to top, #1976d2, #64b5f6);
    border-radius: 4px 4px 0 0;
  }
  
  .donut-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .donut-chart {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      #1976d2 0% 25%,
      #26a69a 25% 40%,
      #66bb6a 40% 55%,
      #ffa726 55% 70%,
      #ef5350 70% 85%,
      #ab47bc 85% 100%
    );
    position: relative;
  }
  
  .donut-chart::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 50%;
  }
  
  .donut-label {
    margin-top: 20px;
    font-weight: 500;
  }
  </style>