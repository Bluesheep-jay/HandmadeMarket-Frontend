<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Quản lý người dùng</div>
      <div>
        <q-btn
          color="orange-8"
          icon="add"
          label="Add User"
          class="q-mr-sm"
          @click="openUserDialog()"
        />
        <q-btn
          color="black"
          icon="filter_alt"
          label="Filters"
          @click="filterDialog = true"
        />
      </div>
    </div>

    <q-card class="bg-white">
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filter"
              dense
              outlined
              placeholder="Search users..."
              clearable
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="roleFilter"
              :options="roleOptions"
              dense
              outlined
              label="Role"
              emit-value
              map-options
              clearable
            />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              v-model="shopFilter"
              :options="shopOptions"
              dense
              outlined
              label="Shop"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :loading="loading"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body-cell-avatarUrl="props">
            <q-td :props="props">
              <q-avatar size="40px">
                <q-img
                  :src="
                    isValidImageUrl(props.value)
                      ? props.value
                      : 'https://cdn.quasar.dev/img/boy-avatar.png'
                  "
                  spinner-color="orange-8"
                />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-enumRole="props">
            <q-td :props="props">
              <q-badge :color="props.value === 'ADMIN' ? 'orange-8' : 'black'">
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="visibility"
                color="orange-8"
                @click="viewUser(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="blue"
                @click="editUser(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="confirmDeleteUser(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- User Dialog -->
    <q-dialog v-model="userDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editMode ? "Edit User" : "Add User" }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="userForm.username"
            label="Username"
            dense
            outlined
            :rules="[(val) => !!val || 'Username is required']"
            class="q-mb-md"
          />

          <q-input
            v-model="userForm.email"
            label="Email"
            dense
            outlined
            type="email"
            class="q-mb-md"
            :rules="[(val) => !!val || 'Email is required']"
          />

          <q-input
            v-model="userForm.phoneNumber"
            label="Phone Number"
            dense
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="userForm.enumRole"
            :options="roleOptions"
            label="Role"
            dense
            outlined
            emit-value
            map-options
            class="q-mb-md"
            :rules="[(val) => !!val || 'Role is required']"
          />

          <q-input
            v-model="userForm.avatarUrl"
            label="Avatar URL"
            dense
            outlined
            class="q-mb-md"
          />

          <q-input
            v-if="!editMode"
            v-model="userForm.password"
            label="Password"
            dense
            outlined
            type="password"
            :rules="[(val) => !!val || 'Password is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            flat
            label="Save"
            color="orange-8"
            @click="saveUser"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteUserDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete this user?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteUser"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- User Details Dialog -->
    <q-dialog v-model="userDetailsDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">User Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedUser">
          <div class="row items-center q-mb-md">
            <q-avatar size="80px" class="q-mr-md">
              <q-img
                :src="
                  isValidImageUrl(selectedUser.avatarUrl)
                    ? selectedUser.avatarUrl
                    : 'https://cdn.quasar.dev/img/boy-avatar.png'
                "
                spinner-color="orange-8"
              />
            </q-avatar>
            <div>
              <div class="text-h6">
                {{ selectedUser.username || "No Username" }}
              </div>
              <div class="text-subtitle2">{{ selectedUser.email }}</div>
              <q-badge
                :color="
                  selectedUser.enumRole === 'ADMIN' ? 'orange-8' : 'black'
                "
              >
                {{ selectedUser.enumRole }}
              </q-badge>
            </div>
          </div>

          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Phone Number</q-item-label>
                <q-item-label>{{
                  selectedUser.phoneNumber || "Not provided"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedUser.shopId">
              <q-item-section>
                <q-item-label caption>Shop</q-item-label>
                <q-item-label>{{
                  getShopName(selectedUser.shopId)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Wishlist Items</q-item-label>
                <q-item-label>{{
                  selectedUser.wishList ? selectedUser.wishList.length : 0
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Addresses</q-item-label>
                <q-item-label>{{
                  selectedUser.addressIdList
                    ? selectedUser.addressIdList.length
                    : 0
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-md">
            <q-btn
              color="orange-8"
              label="Edit User"
              icon="edit"
              @click="editUser(selectedUser)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter Users</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="roleFilter"
            :options="roleOptions"
            label="Role"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="shopFilter"
            :options="shopOptions"
            label="Shop"
            outlined
            emit-value
            map-options
            clearable
            class="q-mb-md"
          />

          <q-toggle
            v-model="hasWishlistFilter"
            label="Has Wishlist Items"
            color="orange-8"
            class="q-mb-md"
          />

          <q-toggle
            v-model="hasAddressFilter"
            label="Has Addresses"
            color="orange-8"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Reset" color="grey" @click="resetFilters" />
          <q-btn flat label="Apply" color="orange-8" @click="applyFilters" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
// Import your user service here
import userService from "../../services/users.service";

const users = ref([]);

const shops = ref([
  {
    id: "67bbe11cf85878403fd343fa",
    shopName: "Blue",
  },
  {
    id: "67c20766eceae36f6d75220b",
    shopName: "Ngọc Bích Jewelry",
  },
]);

const columns = [
  { name: "avatarUrl", label: "Avatar", field: "avatarUrl", align: "center" },
  {
    name: "username",
    label: "Username",
    field: "username",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
    sortable: true,
  },
  { name: "phoneNumber", label: "Phone", field: "phoneNumber", align: "left" },
  {
    name: "enumRole",
    label: "Role",
    field: "enumRole",
    align: "center",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions", align: "center" },
];

const roleOptions = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const shopOptions = computed(() => {
  return shops.value.map((shop) => ({
    label: shop.shopName,
    value: shop.id,
  }));
});

const filter = ref("");
const roleFilter = ref(null);
const shopFilter = ref(null);
const hasWishlistFilter = ref(false);
const hasAddressFilter = ref(false);
const loading = ref(false);
const pagination = ref({
  sortBy: "username",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
const userDialog = ref(false);
const editMode = ref(false);
const userForm = ref({
  id: null,
  username: "",
  email: "",
  phoneNumber: "",
  enumRole: "USER",
  avatarUrl: "",
  password: "",
});
const saving = ref(false);
const deleteUserDialog = ref(false);
const userToDelete = ref(null);
const userDetailsDialog = ref(false);
const selectedUser = ref(null);
const filterDialog = ref(false);

const filteredUsers = computed(() => {
  let result = [...users.value];

  if (filter.value) {
    const searchTerm = filter.value.toLowerCase();
    result = result.filter(
      (user) =>
        (user.username && user.username.toLowerCase().includes(searchTerm)) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.phoneNumber && user.phoneNumber.includes(searchTerm))
    );
  }

  if (roleFilter.value) {
    result = result.filter((user) => user.enumRole === roleFilter.value);
  }

  if (shopFilter.value) {
    result = result.filter((user) => user.shopId === shopFilter.value);
  }

  if (hasWishlistFilter.value) {
    result = result.filter((user) => user.wishList && user.wishList.length > 0);
  }

  if (hasAddressFilter.value) {
    result = result.filter(
      (user) => user.addressIdList && user.addressIdList.length > 0
    );
  }

  return result;
});

const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith("http") || url.startsWith("data:image");
};

const getShopName = (shopId) => {
  const shop = shops.value.find((s) => s.id === shopId);
  return shop ? shop.shopName : "Unknown Shop";
};

const refreshData = async () => {
  loading.value = true;
  try {
    users.value = await userService.getAllUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  // In a real app, fetch data from API with pagination params
  refreshData();
};

const openUserDialog = (user = null) => {
  if (user) {
    userForm.value = { ...user, password: "" };
    editMode.value = true;
  } else {
    userForm.value = {
      id: null,
      username: "",
      email: "",
      phoneNumber: "",
      enumRole: "USER",
      avatarUrl: "",
      password: "",
    };
    editMode.value = false;
  }
  userDialog.value = true;
};

const editUser = (user) => {
  openUserDialog(user);
};

const viewUser = (user) => {
  selectedUser.value = user;
  userDetailsDialog.value = true;
};

const saveUser = async () => {
  saving.value = true;

  // Validate form
  if (!userForm.value.email || (!editMode.value && !userForm.value.password)) {
    saving.value = false;
    return;
  }

  // In a real app, call API to save user
  // try {
  //   if (editMode.value) {
  //     await userService.updateUser(userForm.value);
  //   } else {
  //     await userService.createUser(userForm.value);
  //   }
  // } catch (error) {
  //   console.error('Error saving user:', error);
  //   saving.value = false;
  //   return;
  // }

  setTimeout(() => {
    if (editMode.value) {
      const index = users.value.findIndex((u) => u.id === userForm.value.id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userForm.value };
      }
    } else {
      // Generate a fake ID for demo purposes
      const newId = "new-" + Date.now();
      users.value.push({
        ...userForm.value,
        id: newId,
        wishList: [],
        addressIdList: [],
      });
    }

    saving.value = false;
    userDialog.value = false;
  }, 500);
};

const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  deleteUserDialog.value = true;
};

const deleteUser = async () => {
  // In a real app, call API to delete user
  // try {
  //   await userService.deleteUser(userToDelete.value.id);
  // } catch (error) {
  //   console.error('Error deleting user:', error);
  //   return;
  // }

  users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
  userToDelete.value = null;
};

const resetFilters = () => {
  roleFilter.value = null;
  shopFilter.value = null;
  hasWishlistFilter.value = false;
  hasAddressFilter.value = false;
};

const applyFilters = () => {
  filterDialog.value = false;
  // The computed filteredUsers will automatically update
};

onMounted(() => {
  refreshData();
});
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
