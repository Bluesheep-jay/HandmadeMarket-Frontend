<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <!-- Main Cart Content -->
      <div class="col-12 col-md-8">
        <div class="text-h4 q-mb-md">Giỏ hàng của bạn</div>

        <div
          class="protection-banner q-pa-md q-mb-lg bg-grey-1 rounded-borders"
        >
          <div class="row items-center">
            <q-icon name="security" size="md" color="primary" class="q-mr-md" />
            <div>
              <span class="text-weight-medium">Mua cùng Hmm:</span> chương trình
              bảo vệ mua hàng của Etsy cho người mua, được hoàn lại tiền đầy đủ
              trong trường hợp hiếm hoi mà mặt hàng của bạn không đến, đến bị hư
              hỏng hoặc không như được mô tả. Xem đủ điều kiện.
              <q-btn
                flat
                dense
                color="primary"
                label="See eligibility"
                class="q-px-none"
              />
            </div>
          </div>
        </div>

        <div
          v-for="(shop, shopIndex) in groupedCartList"
          :key="shop.shopId"
          class="q-mb-xl"
        >
          <!-- Shop Header -->
          <div class="row items-center q-mb-md">
            <q-avatar size="32px" class="q-mr-sm">
              <img :src="shop.shopAvatarUrl" />
            </q-avatar>
            <div class="text-subtitle1">{{ shop.shopName }}</div>
            <q-space />
            <q-btn flat color="primary" label="..." />
          </div>

          <!-- Product List for Each Shop -->
          <div class="grouped-shop-container bg-grey-3 rounded-borders">
            <div v-for="(item, itemIndex) in shop.items" :key="item.productId">
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <!-- Product Image -->
                    <div class="col-4 col-sm-3">
                      <q-img
                        :src="item.productImage"
                        :ratio="1"
                        class="rounded-borders"
                      />
                    </div>

                    <!-- Product Details -->
                    <div class="col-8 col-sm-9">
                      <div class="text-h6">{{ item.productTitle }}</div>

                      <div class="option-quantity-container">
                        <div v-if="item.variationList" class="row">
                          <div
                            v-for="(value, key) in item.selectedOptions"
                            :key="key"
                            class="option-container q-mr-sm"
                          >
                            <div class="text-subtitle2">{{ key }} *</div>
                            <q-select
                              v-model="item.selectedOptions[key]"
                              :options="getAttributeOptions(item, key)"
                              outlined
                              dense
                              class="q-mt-sm"
                              @update:model-value="
                                updateSelectedVariation(item)
                              "
                            />
                          </div>

                          <div class="q-mb-md">
                            <div class="text-subtitle2">Số lượng *</div>
                            <q-select
                              v-model="item.quantity"
                              :options="getStockOptions(item)"
                              outlined
                              dense
                              class="q-mt-sm"
                              @update:model-value="
                                changeShopTotalPrice(shopIndex)
                              "
                            />
                          </div>
                        </div>
                        <div
                          class="q-mb-md"
                          v-if="item.personalizationRequired"
                        >
                          <div class="text-subtitle2">Tính cá nhân hóa *</div>

                          <q-input
                            class="personal-input q-mt-sm"
                            dense
                            outlined
                            hide-bottom-space
                            v-model="item.personalizationOfClient"
                            autogrow
                            :error="personalError"
                            :error-message="personalErrorMessage"
                          />
                          <div
                            class="personalizationDescriptionOfProduct text-grey-8"
                          >
                            {{ item.personalizationDescriptionOfProduct }}
                          </div>
                        </div>
                      </div>

                      <div class="text-h6 text-primary">
                        {{ formatPrice(item.subPrice) }}
                      </div>

                      <div>
                        <q-btn
                          flat
                          label="Remove"
                          color="negative"
                          @click="removeItem(item)"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="right-bar-item-1">
          <q-card-section>
            <div class="text-h6 q-mb-md">Địa chỉ giao hàng</div>

            <div v-if="userAddress.length > 0" class="q-mb-md">
              <q-item v-for="(address, index) in userAddress" :key="index">
                <div class="address-container">
                  <q-radio
                    :class="{
                      'selected-radio': selectedAddress === address.id,
                    }"
                    @click="testCalculateFee()"
                    class="address-1"
                    v-model="selectedAddress"
                    :val="address.id"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    :label="
                      address.recipientName +
                      ' - ' +
                      address.specificAddress +
                      ', ' +
                      address.wardName +
                      ', ' +
                      address.districtName +
                      ', ' +
                      address.provinceName
                    "
                  />
                  <div class="address-btn-container">
                    <q-btn
                      unelevated
                      fab-mini
                      class="address-btn"
                      @click="removeAddress(address.id)"
                      icon="location_off"
                    >
                    </q-btn>
                  </div>
                </div>
              </q-item>
            </div>

            <q-btn
              label="Thêm địa chỉ"
              class="full-width q-mb-md add-address-btn"
              @click="showAddressDialog = true"
              icon="add"
            />
          </q-card-section>
        </q-card>

        <!-- ====== Duoi =======-->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">Phương thức thanh toán</div>
            <div class="row q-col-gutter-sm q-mb-lg">
              <q-list class="payment-container">
                <q-item
                  v-for="(payment, index) in paymentMethodList"
                  :key="index"
                  :class="{
                    'selected-radio': selectedPayment === payment.id,
                  }"
                >
                  <div class="address-container">
                    <q-radio
                      class="address-1"
                      v-model="selectedPayment"
                      :val="payment.id"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      :label="payment.methodName"
                    />
                  </div>
                </q-item>
              </q-list>
            </div>

            <!-- Order Summ ary -->
            <div class="row justify-between q-mb-sm">
              <div>Tổng giá</div>
              <div>{{ formatPrice(orderSummary.itemsTotal) }}</div>
            </div>
            <div class="row justify-between q-mb-sm">
              <div>Khuyến mãi</div>
              <div class="text-negative">-{{ formatPrice(discount) }}</div>
            </div>

            <div class="row justify-between q-mb-sm">
              <div>Phí vận chuyển</div>
              <div>{{ formatPrice(totalShippingFee) }}</div>
            </div>

            <q-separator />

            <div class="row justify-between q-py-md text-h6">
              <div>Số lượng ({{ groupedCartList.length }} đơn)</div>
              <div>{{ formatPrice(totalAmount) }}</div>
            </div>

            <q-separator />

            <!-- Checkout Button -->
            <q-btn
              color="black"
              label="Thanh toán "
              class="full-width q-mb-md"
              size="lg"
              @click="orderHandler"
            />

            <!-- Coupon Code -->
            <q-expansion-item
              icon="local_offer"
              label="Áp mã giảm giá"
              header-class="text-primary"
            >
              <q-card>
                <q-card-section>
                  <q-input
                    v-model="couponCode"
                    label="Enter code"
                    outlined
                    dense
                  >
                    <template v-slot:append>
                      <q-btn color="primary" label="Apply" flat />
                    </template>
                  </q-input>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </div>
      <q-dialog v-model="showAddressDialog">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <div class="text-h6">Thêm địa chỉ</div>
          </q-card-section>

          <q-card-section class="dialog-section2-container">
            <div class="label">Họ và tên người nhận</div>
            <q-input
              class="input-1"
              dense
              v-model="addressForm.recipientName"
              outlined
            />

            <div class="label">Địa chỉ</div>
            <div class="select-address-container">
              <q-select
                dense
                outlined
                v-model="selectedProvince"
                :options="provinces"
                label="Tỉnh/ Thành phố"
                class="select-all"
                @update:model-value="fetchDistricts"
              />
              <q-select
                dense
                outlined
                v-model="selectedDistrict"
                :options="districts"
                label="Quận/ Huyện"
                class="select-all"
                @update:model-value="fetchWards"
              />
              <q-select
                dense
                outlined
                v-model="selectedWard"
                :options="wards"
                label="Xã/  Phường/ Thị trấn"
                class="select-all"
              />
            </div>
            <div class="label">Địa chỉ chi tiết</div>
            <q-input
              type="textarea"
              v-model="addressForm.specificAddress"
              label="Hãy nhập chi tiết địa chỉ để thuận tiện hơn trong việc lấy hàng"
              outlined
              class="q-mt-sm"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Save"
              color="primary"
              @click="saveAddress"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import usersService from "../../services/users.service";
import cartService from "../../services/cart.service";
import ghnService from "../../services/ghn.service";
import addressService from "../../services/address.service";
import paymentMethodService from "../../services/paymentMethod.service";
import vnpayService from "../../services/vnpay.service";
import orderService from "../../services/order.service";

const PROCESSING_STATUS = "67ca8c309504452e420327c0";
const VNPAY_METHOD = "67ca83dce899cd4bd9882dfd";
const userEmail = localStorage.getItem("userEmail");
const userData = ref(null);
const userAddress = ref([]);
const cartData = ref([]);
const cartItemList = ref([]);
const paymentMethodList = ref([]);

const showAddressDialog = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const groupedCartList = ref([]);

const selectedAddress = ref(null);
const selectedPayment = ref(null);
const selectedWard = ref(null);
const selectedDistrict = ref(null);
const selectedProvince = ref(null);
const discount = ref(0);
const totalShippingFee = ref(0);
const totalAmount = ref(0);
const personalError = ref(false);
const personalErrorMessage = ref("");

const addressForm = ref({
  recipientName: "",
  provinceId: 0,
  districtId: 0,
  wardId: 0,
  provinceName: "",
  districtName: "",
  wardName: "",
  specificAddress: "",
  addressOfUserId: "",
});

const shippingReqData = ref({
  from_district_id: 0,
  from_ward_code: 0,
  service_id: 53320,
  service_type_id: null,
  to_district_id: 0,
  to_ward_code: 21012,
  height: 10,
  length: 10,
  weight: 300,
  width: 10,
  insurance_value: 10000,
  cod_failed_amount: 2000,
  coupon: null,
});

onBeforeMount(async () => {
  userData.value = await usersService.getUserByEmail(userEmail);
  cartData.value = await cartService.getById(userData.value.cartId);
  paymentMethodList.value = await paymentMethodService.getAll();
  console.log(cartData.value);
  groupCartItemsByShop();

  console.log(groupedCartList.value);
  cartItemList.value = cartData.value.cartItems;

  fetchUserAddress();
  fetchProvinces();
});

const removeAddress = async (addressId) => {
  try {
    await addressService.delete(addressId);
    await fetchUserAddress();
  } catch (error) {
    console.log(error);
  }
};

async function orderHandler() {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 7);

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 3);
    expectedDate.setHours(expectedDate.getHours() + 7);

    const orders = groupedCartList.value.map((shop) => ({
      orderDate: now.toISOString(),
      expectedDeliveryDate: expectedDate.toISOString(),
      orderPaymentMethodId: selectedPayment.value,
      orderUserId: userData.value.id,
      orderShopId: shop.shopId,
      orderDeliveryAddressId: selectedAddress.value,

      totalPrice: shop.shopTotalPrice + shop.shopShippingFee,
      orderStatusId: PROCESSING_STATUS,
      orderDetails: shop.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.subPrice,
        selectedOptions: item.selectedOptions,
        personalizationOfClient: item.personalizationOfClient,
        personalizationRequired: item.personalizationRequired,
      })),
    }));

    if (selectedPayment.value === VNPAY_METHOD) {
      const res = await vnpayService.preparePayment(orders);

      window.location.href = res.vnpayUrl;
    } else {
      const res = await orderService.create(orders);
      groupedCartList.value = [];
    }

    cartService.clearCart(userData.value.cartId);
  } catch (error) {
    console.error(error);
  }
}

function changeShopTotalPrice(shopIndex) {
  groupedCartList.value[shopIndex].shopTotalPrice = groupedCartList.value[
    shopIndex
  ].items.reduce((total, item) => {
    return total + item.subPrice * item.quantity;
  }, 0);
}
function groupCartItemsByShop() {
  groupedCartList.value = Object.values(
    cartData.value.cartItems.reduce((acc, item) => {
      const shopId = item.shopId;

      if (!acc[shopId]) {
        ``;
        acc[shopId] = {
          shopId: shopId,
          shopName: item.shopName,
          shopAvatarUrl: item.shopAvatarUrl,
          shopProvinceId: item.provinceId,
          shopDistrictId: item.districtId,
          shopWardId: item.wardId,
          shopTotalPrice: 0,
          shopShippingFee: 0,
          items: [],
        };
      }

      acc[shopId].shopTotalPrice += item.subPrice * item.quantity;

      acc[shopId].items.push(item);
      return acc;
    }, {})
  );
}

//// ===== Thanh toán =====================//
const saveAddress = async () => {
  try {
    addressForm.value.provinceId = selectedProvince.value.value;
    addressForm.value.districtId = selectedDistrict.value.value;
    addressForm.value.wardId = selectedWard.value.value;
    addressForm.value.provinceName = selectedProvince.value.label;
    addressForm.value.districtName = selectedDistrict.value.label;
    addressForm.value.wardName = selectedWard.value.label;
    addressForm.value.addressOfUserId = userData.value.id;

    const res = await addressService.create(addressForm.value);
    await fetchUserAddress();
  } catch (error) {
    console.log(error);
  }
};
async function fetchUserAddress() {
  userAddress.value = await addressService.getAddressListByUserId(
    userData.value.id
  );
}

const testCalculateFee = async () => {
  totalShippingFee.value = 0;
  const selectedAddressInfo = userAddress.value.find(
    (address) => address.id === selectedAddress.value
  );

  var tempShippingFee = 0;
  for (const shop of groupedCartList.value) {
    shippingReqData.value.to_district_id = Number(
      selectedAddressInfo.districtId
    );
    shippingReqData.value.to_ward_code = selectedAddressInfo.wardId;
    shippingReqData.value.from_district_id = shop.shopDistrictId;
    shippingReqData.value.from_ward_code = shop.shopWardId;

    const reqServiceData = {
      shop_id: 5648020,
      from_district: shippingReqData.value.from_district_id,
      to_district: shippingReqData.value.to_district_id,
    };
    const serviceList = await ghnService.getService(reqServiceData);
    shippingReqData.value.service_id = serviceList.data[0].service_id;

    const res = await ghnService.calculateFee(shippingReqData.value);
    tempShippingFee += Math.ceil(res.data.total / 1000) * 1000;
    shop.shopShippingFee = Math.ceil(res.data.total / 1000) * 1000;
  }
  totalShippingFee.value += tempShippingFee;
};

const orderSummary = computed(() => {
  const itemsTotal = cartItemList.value.reduce(
    (sum, item) => sum + (item.subPrice * item.quantity || 0),
    0
  );
  totalAmount.value = itemsTotal + totalShippingFee.value;

  return { itemsTotal };
});

async function fetchProvinces() {
  const data = await ghnService.getProvince();
  provinces.value = data.data.map((province) => ({
    label: province.ProvinceName,
    value: province.ProvinceID,
  }));
}

async function fetchDistricts(province) {
  const data = await ghnService.getDistrict(province.value);

  districts.value = data.data.map((district) => ({
    label: district.DistrictName,
    value: district.DistrictID,
  }));
}

const fetchWards = async (district) => {
  const data = await ghnService.getWard(district.value);
  wards.value = data.data.map((ward) => ({
    label: ward.WardName,
    value: ward.WardCode,
  }));
};

watch(
  () => addressForm.value.province,
  (newProvince) => {
    districts.value = [];
    wards.value = [];
    if (newProvince) {
      fetchDistricts(newProvince);
    }
  }
);

watch(
  () => addressForm.value.district,
  (newDistrict) => {
    wards.value = [];
    if (newDistrict) {
      fetchWards(newDistrict);
    }
  }
);

const getAttributeOptions = (item, attribute) => {
  return item.variationList
    .map((variation) => variation.attributes[attribute])
    .filter((value, index, self) => self.indexOf(value) === index);
};

const updateSelectedVariation = (item) => {
  const selectedValues = item.selectedOptions;
  const matchedVariation = item.variationList.find((variation) =>
    Object.keys(selectedValues).every(
      (attr) => variation.attributes[attr] === selectedValues[attr]
    )
  );

  if (matchedVariation) {
    item.subPrice = matchedVariation.price;
    item.stock = matchedVariation.stock;
    if (item.quantity > item.stock) item.quantity = item.stock;
  }
};

const getStockOptions = (item) => {
  updateSelectedVariation(item);
  return Array.from({ length: item.stock }, (_, i) => i + 1);
};

// const removeItem = (item) => {
//   const index = cartItemList.value.indexOf(item);
//   if (index !== -1) {
//     const cartToRemove = cartItemList.value.splice(index, 1);
//     cartService.removeItem(cartData.value.id, cartToRemove[0].productId);
//   }
// };

const removeItem = async (item) => {
  try {
    await cartService.removeItem(cartData.value.id, item.productId);

    groupedCartList.value = groupedCartList.value
      .map((shop) => {
        return {
          ...shop,
          items: shop.items.filter((i) => i.productId !== item.productId),
        };
      })
      .filter((shop) => shop.items.length > 0);
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
};

const couponCode = ref("");

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
</script>

<style scoped>
.payment-icon {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.option-quantity-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.selected-radio {
  background-color: #e0f7fa;
  border-radius: 8px;
  padding: 5px 0 5px 10px;
  transition: background-color 0.3s;
}
.right-bar-item-1 {
  margin-bottom: 10px;
}
.address-container {
  display: flex;
  gap: 5px;

  .address-btn-container {
    display: flex;
    align-items: center;
    .address-btn {
      color: black;
      padding: auto;
    }
    .address-btn:hover {
      cursor: pointer;
      background: rgba(255, 0, 0, 0.514);
      font-size: 15px;
    }
  }
}
.add-address-btn {
  background: var(--icon);
  color: white;
}

.dialog-section2-container {
  padding: 20px 40px;
  .label {
    margin-right: 20px;
    font-size: 16px;
    color: rgb(75, 75, 75);
  }

  .input-1 {
    width: 300px;
    margin-bottom: 20px;
  }
  .select-address-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    .select-all {
      flex: 1;
    }
  }
}

.grouped-shop-container {
  padding: 5px;
  padding-bottom: 0px;
  background: rgb(211, 211, 211);
  border: none;
  border: 1px solid white;
}
.payment-container {
  padding-right: 20px;
}
.personal-input {
  width: 240px;
}
.personalizationDescriptionOfProduct {
  width: 240px;
  font-size: 13px;
  word-wrap: normal;
  margin-left: 10px;
  text-decoration: underline;
}
</style>
