<template>
  <div class="user-favorites-view q-pa-md">
    <!-- Header Section -->
    <div class="header-section q-mb-lg" v-if="userInfo">
      <div class="row items-center justify-between">
        <div class="user-info-container row items-center">
          <q-avatar size="64px" class="user-avatar">
            <img
              :src="
                userInfo.avatarUrl || 'https://cdn.quasar.dev/img/avatar.png'
              "
              alt=""
            />
          </q-avatar>
          <div class="user-details q-ml-md">
            <h1 class="text-h5 q-my-none">
              {{ userInfo.username || userInfo.email }}
            </h1>
            <div class="user-links q-mt-sm">
              <q-btn
                flat
                dense
                padding="xs"
                label="Thông tin cá nhân"
                color="grey-8"
                no-caps
                to="/customer/profile-editing"
              />
              <q-separator vertical inset color="grey-5" />
              <q-btn
                flat
                dense
                padding="xs"
                label="Thêm Địa chỉ"
                color="grey-8"
                no-caps
                @click="showAddressDialog = true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container row">
      <!-- Sidebar Navigation -->
      <div class="sidebar-container col-12 col-sm-3 col-md-2">
        <q-list padding class="navigation-list">
          <q-item
            clickable
            v-ripple
            active-class="active-nav-item"
            :active="currentTab === 'wishList'"
            @click="currentTab = 'wishList'"
            class="nav-item"
          >
            <q-item-section avatar>
              <q-icon name="inventory_2" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sản phẩm yêu thích</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            active-class="active-nav-item"
            :active="currentTab === 'shop'"
            @click="currentTab = 'shop'"
            class="nav-item"
          >
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cửa hàng yêu thích</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Main Content -->
      <div class="main-content col-12 col-sm-8 col-md-9">
        <div v-if="currentTab === 'wishList'">
          <!-- Wishlist Products Grid -->
          <div class="products-grid row">
            <div
              v-for="(item, index) in wishList"
              :key="item.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <q-card class="product-card">
                <div @click="navigateToProduct(item)">
                  <div class="image-container">
                    <q-img
                      :src="item.imageList[0]"
                      class="product-image"
                      :ratio="1"
                    />

                    <div class="rating-badge">
                      <q-icon name="star" size="xs" />
                      {{ item.rating }}
                    </div>
                  </div>
                </div>
                <q-card-section class="product-details q-pa-md">
                  <div class="product-title text-subtitle1 ellipsis-2-lines">
                    {{ item.productTitle }}
                  </div>
                  <div class="price-container q-mt-sm">
                    <span class="current-price text-weight-bold">
                      {{ formatPrice(item.basePrice) }}
                    </span>
                    <!-- <span
                      class="original-price text-grey-6 text-line-through q-ml-sm"
                      v-if="item.basePrice"
                    >
                      {{ formatPrice(item.basePrice * 1.2) }}
                    </span>
                    <span class="discount-badge q-ml-sm" v-if="item.basePrice">
                      20% off
                    </span> -->
                  </div>

                  <q-btn
                    outline
                    color="grey-10"
                    label="Thêm vào giỏ hàng"
                    class="options-btn q-mt-sm"
                    no-caps
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'shop'">
          <!-- Favorite Shops Grid -->
          <div class="shops-grid row q-col-gutter-md">
            <div
              v-for="(shop, index) in favoriteShops"
              :key="shop.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <q-card class="shop-card">
                <q-img
                  src="https://cdn.quasar.dev/img/parallax2.jpg"
                  class="shop-banner"
                  height="120px"
                />
                <q-card-section>
                  <div class="shop-name text-weight-bold">{{ shop.name }}</div>
                  <div class="shop-description text-grey-7 q-mt-sm">
                    {{ shop.description }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Dialog -->
    <q-dialog v-model="showAddressDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Thêm địa chỉ</div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Tên người nhận hàng</div>
            <q-input dense v-model="addressForm.recipientName" outlined />
          </div>

          <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Địa chỉ</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-4">
                <q-select
                  dense
                  outlined
                  v-model="tempProvince"
                  :options="provinceList"
                  label="Tỉnh/ Thành phố"
                  @update:model-value="fetchDistricts"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  dense
                  outlined
                  v-model="tempDistrict"
                  :options="districtList"
                  label="Quận/ Huyện"
                  @update:model-value="fetchWards"
                />
              </div>
              <div class="col-12 col-sm-4">
                <q-select
                  dense
                  outlined
                  v-model="tempWard"
                  :options="wardList"
                  label="Xã/ Phường/ Thị trấn"
                />
              </div>
            </div>
          </div>

          <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Địa chỉ chi tiết</div>
            <q-input
              type="textarea"
              v-model="addressForm.specificAddress"
              outlined
              placeholder="Hãy nhập chi tiết địa chỉ để thuận tiện hơn trong việc lấy hàng"
              rows="3"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="grey-7" v-close-popup />
          <q-btn
            flat
            label="Lưu"
            color="primary"
            @click="saveAddress"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
import usersService from "../../services/users.service";
import ghnService from "../../services/ghn.service";
import addressService from "../../services/address.service";

const router = useRouter();
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);

const showAddressDialog = ref(false);
const userInfo = ref(null);
const userEmail = ref(decoded.sub);
const userAddress = ref(null);
const tempProvince = ref(null);
const tempDistrict = ref(null);
const tempWard = ref(null);

const addressForm = ref({
  recipientName: "",
  provinceId: null,
  districtId: null,
  wardId: null,
  provinceName: null,
  districtName: null,
  wardName: null,
  specificAddress: "",
  addressOfUserId: "",
});
const provinceList = ref([]);
const districtList = ref([]);
const wardList = ref([]);

const wishList = ref([]);
const favoriteShops = ref([]);
const currentTab = ref("wishList");

onBeforeMount(async () => {
  userInfo.value = await usersService.getUserByEmail(userEmail.value);
  userAddress.value = await addressService.getAll();
  addressForm.value.addressOfUserId = userInfo.value.id;
  wishList.value = await usersService.getWishList(userInfo.value.id);
  console.log(wishList.value);
  // favoriteShops.value = await usersService.getFavoriteShops(userInfo.value.id);

  fetchProvinces();
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

async function saveAddress() {
  try {
    addressForm.value.provinceId = tempProvince.value.value;
    addressForm.value.districtId = tempDistrict.value.value;
    addressForm.value.wardId = tempWard.value.value;
    addressForm.value.provinceName = tempProvince.value.label;
    addressForm.value.districtName = tempDistrict.value.label;
    addressForm.value.wardName = tempWard.value.label;

    const res = await addressService.create(addressForm.value);
  } catch (error) {
    console.log(error);
  }
}

async function fetchProvinces() {
  const data = await ghnService.getProvince();
  provinceList.value = data.data.map((province) => ({
    label: province.ProvinceName,
    value: province.ProvinceID,
  }));
}

async function fetchDistricts(province) {
  const data = await ghnService.getDistrict(province.value);

  districtList.value = data.data.map((district) => ({
    label: district.DistrictName,
    value: district.DistrictID,
  }));
}

async function fetchWards(district) {
  const data = await ghnService.getWard(district.value);
  wardList.value = data.data.map((ward) => ({
    label: ward.WardName,
    value: ward.WardCode,
  }));
}

watch(
  () => addressForm.value.provinceId,
  (newProvince) => {
    addressForm.value.districtId = null;
    addressForm.value.wardId = null;
    districtList.value = [];
    wardList.value = [];
    if (newProvince) {
      fetchDistricts(newProvince);
    }
  }
);

watch(
  () => addressForm.value.districtId,
  (newDistrict) => {
    addressForm.value.wardId = null;
    wardList.value = [];
    if (newDistrict) {
      fetchWards(newDistrict);
    }
  }
);

const navigateToProduct = (item) => {
  console.log(item);
  router.push(`/customer/product-detail/${item.id}`);
};
</script>

<style scoped>
.user-favorites-view {
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.header-section {
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.user-avatar {
  border: 1px solid #e0e0e0;
}

.user-details h1 {
  font-weight: 600;
  margin: 0;
  color: #222;
}

.user-links {
  display: flex;
  align-items: center;
}

.updates-btn {
  border-radius: 24px;
  font-weight: normal;
}

.content-container {
  margin-top: 24px;
  .sidebar-container {
    margin-right: 10px;
    .navigation-list {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f9f9f9;
      .nav-item {
        border-radius: 4px;
        margin: 4px 0;
      }
      .active-nav-item {
        background-color: #f0f0f0;
        font-weight: 500;
      }
    }
  }
}

.main-content {
  padding: 0 0;
}
.products-grid {
  margin-top: 8px;
  margin: 0 0;
}

.product-card {
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.image-container {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
}

.rating-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-details {
  padding: 12px;
}

.product-title {
  font-weight: 500;
  color: #333;
  line-height: 1.3;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.6em;
}

.price-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.current-price {
  font-size: 16px;
  color: #222;
}

.original-price {
  font-size: 14px;
}

.discount-badge {
  background-color: #f8f2de;
  color: #a77e2d;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.shipping-info {
  font-size: 13px;
  line-height: 1.4;
}

.options-btn {
  font-size: 12px;
  border-radius: 16px;
}

.shop-card {
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

.shop-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.shop-name {
  font-size: 16px;
  color: #222;
}

.shop-description {
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 599px) {
  .user-details h1 {
    font-size: 18px;
  }

  .navigation-list {
    margin-bottom: 16px;
  }
}
</style>
