<template>
  <q-page padding>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <div class="text-h4 q-mb-md">Giỏ hàng của bạn</div>
        <ProtectionBanner />

        <!-- Shop Groups -->
        <div
          v-for="(shop, shopIndex) in groupedCartList"
          :key="shop.shopId"
          class="q-mb-xl"
        >
          <ShopHeader :shop="shop" />
          <ShopItems
            :shop="shop"
            :shop-index="shopIndex"
            @update-variation="updateSelectedVariation"
            @update-quantity="changeShopTotalPrice(shopIndex)"
            @remove-item="removeItem"
          />
          <ShopVouchers
            :vouchers="shop.vouchers"
            :selected-shop-voucher-id="getSelectedShopVoucher(shop.shopId)"
            :shop-total-price="shop.shopTotalPrice"
            @select-shop-voucher="addShopVoucherToOrder($event, shop.shopId)"
          />
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="col-12 col-md-4">
        <DeliveryAddressCard
          :addresses="userAddress"
          :selected-address="selectedAddress"
          @select-address="selectAddress"
          @remove-address="removeAddress"
          @add-address="showAddressDialog = true"
        />

        <OrderSummaryCard
          :payment-methods="paymentMethodList"
          :selected-payment="selectedPayment"
          :order-summary="orderSummary"
          :discount="totalDiscount"
          :shipping-fee="totalShippingFee"
          :total-amount="totalAmount"
          :shop-count="groupedCartList.length"
          :vouchers="voucherList"
          :selected-voucher-id="selectedPlatformVoucherId"
          @select-payment="selectedPayment = $event"
          @select-platform-voucher="addPlatformVoucherToOrder"
          @checkout="orderHandler"
        />
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
            <q-btn flat label="Hủy" color="primary" v-close-popup />
            <q-btn
              flat
              label="Thêm địa chỉ"
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
import { ref, computed, onBeforeMount, watch } from "vue";
// change all
import { useCartStore } from "../../stores/cart";
import { useUserStore } from "../../stores/user";
import { useAddressStore } from "../../stores/address";
import { useVoucherStore } from "../../stores/voucher";
import { useShippingStore } from "../../stores/shipping";
import { usePaymentStore } from "../../stores/payment";
import { useOrderStore } from "../../stores/order";
import { formatPrice } from "../../utils/formatters";

// change all
import ProtectionBanner from "../../components/cart/ProtectionBanner.vue";
import ShopHeader from "../../components/cart/ShopHeader.vue";
import ShopItems from "../../components/cart/ShopItems.vue";
import ShopVouchers from "../../components/cart/ShopVouchers.vue";
import DeliveryAddressCard from "../../components/cart/DeliveryAddressCard.vue";
import OrderSummaryCard from "../../components/cart/OrderSummaryCard.vue";
import AddressDialog from "../../components/cart/AddressDialog.vue";
import TestDialog from "../../components/cart/TestDialog.vue";

// Constants
const PROCESSING_STATUS = "67ca8c309504452e420327c0";
const VNPAY_METHOD = "67ca83dce899cd4bd9882dfd";

// Stores
const cartStore = useCartStore();
const userStore = useUserStore();
const addressStore = useAddressStore();
const voucherStore = useVoucherStore();
const shippingStore = useShippingStore();
const paymentStore = usePaymentStore();
const orderStore = useOrderStore();

// State
const groupedCartList = ref([]);
const paymentMethodList = ref([]);
const voucherList = ref([]);
const userAddress = ref([]);
const selectedAddress = ref(null);
const selectedPayment = ref(null);
const selectedPlatformVoucherId = ref(null);
const selectedShopVouchers = ref({}); // Map of shopId -> voucherId
const platformVoucherDiscount = ref(0);
const shopVouchersDiscount = ref(0);
const totalShippingFee = ref(0);
const totalAmount = ref(0);

// Address dialog state
const showAddressDialog = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const selectedProvince = ref(null);
const selectedDistrict = ref(null);
const selectedWard = ref(null);
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
function testAdd() {
  showAddressDialog.value = true;
  console.log(showAddressDialog.value);
}

onBeforeMount(async () => {
  await userStore.fetchCurrentUser();
  await cartStore.fetchCart(userStore.userData.cartId);
  paymentMethodList.value = await paymentStore.fetchPaymentMethods();
  voucherList.value = await voucherStore.fetchPlatformVouchers();
  await groupCartItemsByShop();
  await fetchUserAddress();
  await shippingStore.fetchProvinces();
  provinces.value = shippingStore.provinces;
});

const orderSummary = computed(() => {
  const itemsTotal = cartStore.getTotalAmount();
  totalAmount.value = itemsTotal + totalShippingFee.value - totalDiscount.value;
  return { itemsTotal };
});

const totalDiscount = computed(() => {
  return platformVoucherDiscount.value + shopVouchersDiscount.value;
});

async function groupCartItemsByShop() {
  const groupedItems = {};

  for (const item of cartStore.cartData.cartItems) {
    const shopId = item.shopId;

    if (!groupedItems[shopId]) {
      groupedItems[shopId] = {
        shopId: shopId,
        shopName: item.shopName,
        shopAvatarUrl: item.shopAvatarUrl,
        shopProvinceId: item.provinceId,
        shopDistrictId: item.districtId,
        shopWardId: item.wardId,
        shopTotalPrice: 0,
        shopShippingFee: 0,
        items: [],
        vouchers: [],
      };
    }

    groupedItems[shopId].shopTotalPrice += item.subPrice * item.quantity;
    groupedItems[shopId].items.push(item);
  }

  // Fetch vouchers for each shop
  const shopIds = Object.keys(groupedItems);
  const promises = shopIds.map(async (shopId) => {
    const vouchers = await voucherStore.fetchShopVouchers(shopId);
    groupedItems[shopId].vouchers = vouchers;
  });

  await Promise.all(promises);
  groupedCartList.value = Object.values(groupedItems);
}

function changeShopTotalPrice(shopIndex) {
  groupedCartList.value[shopIndex].shopTotalPrice = groupedCartList.value[
    shopIndex
  ].items.reduce((total, item) => total + item.subPrice * item.quantity, 0);

  // Recalculate shop voucher discount if a voucher is selected for this shop
  const shopId = groupedCartList.value[shopIndex].shopId;
  if (selectedShopVouchers.value[shopId]) {
    const voucher = groupedCartList.value[shopIndex].vouchers.find(
      (v) => v.id === selectedShopVouchers.value[shopId]
    );
    if (
      voucher &&
      voucher.minOrderValue <= groupedCartList.value[shopIndex].shopTotalPrice
    ) {
      // Voucher is still valid
    } else {
      // Remove voucher as it's no longer valid
      delete selectedShopVouchers.value[shopId];
      recalculateShopVouchersDiscount();
    }
  }
}

async function fetchUserAddress() {
  userAddress.value = await addressStore.fetchUserAddresses(
    userStore.userData.id
  );
}

function selectAddress(addressId) {
  selectedAddress.value = addressId;
  calculateShippingFee();
}

async function calculateShippingFee() {
  if (!selectedAddress.value) return;

  totalShippingFee.value = 0;
  const selectedAddressInfo = userAddress.value.find(
    (address) => address.id === selectedAddress.value
  );

  if (!selectedAddressInfo) return;

  let tempShippingFee = 0;
  for (const shop of groupedCartList.value) {
    const fee = await shippingStore.calculateFee({
      fromDistrictId: shop.shopDistrictId,
      fromWardCode: shop.shopWardId,
      toDistrictId: selectedAddressInfo.districtId,
      toWardCode: selectedAddressInfo.wardId,
      weight: 300, // Default weight
    });

    tempShippingFee += fee;
    shop.shopShippingFee = fee;
  }

  totalShippingFee.value = tempShippingFee;
}

async function saveAddress() {
  try {
    console.log(selectedProvince.value);
    addressForm.value.provinceId = selectedProvince.value.value;
    addressForm.value.districtId = selectedDistrict.value.value;
    addressForm.value.wardId = selectedWard.value.value;
    addressForm.value.provinceName = selectedProvince.value.label;
    addressForm.value.districtName = selectedDistrict.value.label;
    addressForm.value.wardName = selectedWard.value.label;
    addressForm.value.addressOfUserId = userStore.userData.id;

    console.log(addressForm.value);
    await addressStore.createAddress(addressForm.value);
    await fetchUserAddress();
  } catch (error) {
    console.error("Error saving address:", error);
  }
}

async function removeAddress(addressId) {
  try {
    await addressStore.deleteAddress(addressId);
    await fetchUserAddress();
  } catch (error) {
    console.error("Error removing address:", error);
  }
}

function addPlatformVoucherToOrder(voucher) {
  selectedPlatformVoucherId.value = voucher.id;
  platformVoucherDiscount.value = voucher.discountValue;
}

function addShopVoucherToOrder(voucher, shopId) {
  selectedShopVouchers.value[shopId] = voucher.id;
  recalculateShopVouchersDiscount();
}

function recalculateShopVouchersDiscount() {
  let totalDiscount = 0;

  for (const shop of groupedCartList.value) {
    const voucherId = selectedShopVouchers.value[shop.shopId];
    if (voucherId) {
      const voucher = shop.vouchers.find((v) => v.id === voucherId);
      if (voucher) {
        totalDiscount += voucher.discountValue;
      }
    }
  }

  shopVouchersDiscount.value = totalDiscount;
}

function getSelectedShopVoucher(shopId) {
  return selectedShopVouchers.value[shopId] || null;
}

async function fetchDistricts(province) {
  districts.value = await shippingStore.fetchDistricts(province.value);
  selectedDistrict.value = null;
  wards.value = [];
}

async function fetchWards(district) {
  wards.value = await shippingStore.fetchWards(district.value);
  selectedWard.value = null;
}

function updateSelectedVariation(item) {
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
}

async function removeItem(item) {
  try {
    await cartStore.removeItem(item.productId);

    // Update local state
    groupedCartList.value = groupedCartList.value
      .map((shop) => ({
        ...shop,
        items: shop.items.filter((i) => i.productId !== item.productId),
      }))
      .filter((shop) => shop.items.length > 0);

    // If a shop is removed, also remove its voucher
    if (
      selectedShopVouchers.value[item.shopId] &&
      !groupedCartList.value.some((shop) => shop.shopId === item.shopId)
    ) {
      delete selectedShopVouchers.value[item.shopId];
      recalculateShopVouchersDiscount();
    }
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

async function orderHandler() {
  try {
    if (!selectedAddress.value || !selectedPayment.value) {
      return;
    }

    const now = new Date();
    now.setHours(now.getHours() );

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() );
    expectedDate.setHours(expectedDate.getHours());

    // Create orders
    let checkAppliedPlatformvoucher = false;
    let remainingPlatformDiscount = 0;
    const selectedVoucher = voucherList.value.find(
      (v) => v.id === selectedPlatformVoucherId.value
    );
    if (selectedVoucher) {
      remainingPlatformDiscount = selectedVoucher.discountValue;
      checkAppliedPlatformvoucher = true;
    }
    const orders = groupedCartList.value.map((shop) => ({
      orderDate: now.toISOString(),
      expectedDeliveryDate: expectedDate.toISOString(),
      orderPaymentMethodId: selectedPayment.value,
      orderUserId: userStore.userData.id,
      orderShopId: shop.shopId,
      orderDeliveryAddressId: selectedAddress.value,
      totalPrice:
        shop.shopTotalPrice +
        shop.shopShippingFee -
        getShopVoucherDiscount(shop.shopId),
      shippingFee: shop.shopShippingFee,
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

    if (checkAppliedPlatformvoucher) {
      for (const order of orders) {
        if (remainingPlatformDiscount <= 0) break;

        const originalPrice = order.totalPrice;
        const discountToApply = Math.min(
          remainingPlatformDiscount,
          originalPrice
        );
        order.totalPrice = originalPrice - discountToApply;
        remainingPlatformDiscount -= discountToApply;
      }
    }

    const voucherUsages = [];

    if (selectedPlatformVoucherId.value) {
      for (const order of orders) {
        voucherUsages.push({
          voucherId: selectedPlatformVoucherId.value,
          userId: userStore.userData.id,
          orderId: null, // Will be filled after order creation
          usedAt: now.toISOString(),
        });
      }
    }

    // Shop vouchers
    for (const shopId in selectedShopVouchers.value) {
      const order = orders.find((o) => o.orderShopId === shopId);
      if (order) {
        voucherUsages.push({
          voucherId: selectedShopVouchers.value[shopId],
          userId: userStore.userData.id,
          orderId: null, // Will be filled after order creation
          usedAt: now.toISOString(),
        });
      }
    }

    // Process payment and create orders
    if (selectedPayment.value === VNPAY_METHOD) {
      const res = await orderStore.prepareVnPayment(orders);

      // Store voucher usages in session storage to be used after payment
      if (voucherUsages.length > 0) {
        sessionStorage.setItem(
          "pendingVoucherUsages",
          JSON.stringify(voucherUsages)
        );
      }

      window.location.href = res.vnpayUrl;
    } else {
      const createdOrders = await orderStore.createOrder(orders);

      console.log("Created Orders:");
      console.log(createdOrders);
      // Register voucher usages with order IDs
      if (
        voucherUsages.length > 0 &&
        createdOrders &&
        createdOrders.length > 0
      ) {
        for (let i = 0; i < voucherUsages.length; i++) {
          const usage = voucherUsages[i];

          // For platform vouchers, assign to each order
          if (
            usage.voucherId === selectedPlatformVoucherId.value &&
            i < createdOrders.length
          ) {
            usage.orderId = createdOrders[i].id;
          }
          // For shop vouchers, find the matching order
          else {
            const shopId = Object.keys(selectedShopVouchers.value).find(
              (key) => selectedShopVouchers.value[key] === usage.voucherId
            );
            if (shopId) {
              const order = createdOrders.find((o) => o.orderShopId === shopId);
              if (order) {
                usage.orderId = order.id;
              }
            }
          }

          // Register voucher usage
          if (usage.orderId) {
            await voucherStore.createVoucherUsage(usage);
          }
        }
      }

      // Clear cart and reset state
      groupedCartList.value = [];
      await cartStore.clearCart();
      totalAmount.value = 0;
      totalShippingFee.value = 0;
    }
  } catch (error) {
    console.error("Error creating order:", error);
  }
}

function getShopVoucherDiscount(shopId) {
  if (!selectedShopVouchers.value[shopId]) return 0;

  const shop = groupedCartList.value.find((s) => s.shopId === shopId);
  if (!shop) return 0;

  const voucher = shop.vouchers.find(
    (v) => v.id === selectedShopVouchers.value[shopId]
  );
  return voucher ? voucher.discountValue : 0;
}

// Watchers
watch([selectedProvince], () => {
  districts.value = [];
  wards.value = [];
});

watch([selectedDistrict], () => {
  wards.value = [];
});
</script>

<style scoped>

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
</style>
