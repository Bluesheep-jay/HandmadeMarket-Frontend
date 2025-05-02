<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row items-center justify-between q-mb-lg">
        <div class="text-h5">Quản lý danh mục</div>
        <q-btn
          color="orange"
          icon="add"
          label="Thêm danh mục gốc"
          @click="openAddDialog(null)"
        />
      </div>

      <!-- Loading indicator -->
      <div class="text-center q-pa-md" v-if="loading">
        <q-spinner color="orange" size="3em" />
        <div class="q-mt-sm">Đang tải dữ liệu...</div>
      </div>

      <!-- Category Tree View -->
      <div v-else class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-card class="category-tree-card">
            <q-card-section>
              <div class="text-h6">Cấu trúc danh mục</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-none">
              <q-tree
                :nodes="categoryTree"
                node-key="id"
                label-key="categoryName"
                children-key="children"
                no-connectors
                default-expand-all
              >
                <template v-slot:default-header="prop">
                  <div class="row items-center full-width">
                    <q-img
                      v-if="prop.node.categoryImageUrl"
                      :src="prop.node.categoryImageUrl"
                      width="40px"
                      height="40px"
                      class="q-mr-sm rounded-borders"
                    >
                      <template v-slot:error>
                        <div class="category-image-placeholder">
                          <q-icon name="category" size="24px" color="grey-7" />
                        </div>
                      </template>
                    </q-img>
                    <div v-else class="category-image-placeholder q-mr-sm">
                      <q-icon name="category" size="24px" color="grey-7" />
                    </div>
                    
                    <div class="text-weight-medium">{{ prop.node.categoryName }}</div>
                    
                    <q-space />
                    
                    <div class="row q-gutter-sm">
                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="add"
                        size="sm"
                        @click.stop="openAddDialog(prop.node)"
                      >
                        <q-tooltip>Thêm danh mục con</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="edit"
                        size="sm"
                        @click.stop="openEditDialog(prop.node)"
                      >
                        <q-tooltip>Chỉnh sửa</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        size="sm"
                        :disable="hasChildren(prop.node)"
                        @click.stop="confirmDelete(prop.node)"
                      >
                        <q-tooltip v-if="hasChildren(prop.node)">
                          Không thể xóa danh mục có danh mục con
                        </q-tooltip>
                        <q-tooltip v-else>Xóa</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </template>
              </q-tree>
              
              <div v-if="categoryTree.length === 0" class="text-center q-pa-lg">
                <q-icon name="category" size="4em" color="grey-5" />
                <div class="text-h6 q-mt-md">Chưa có danh mục nào</div>
                <div class="text-grey">Hãy thêm danh mục mới để bắt đầu</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card class="category-stats-card">
            <q-card-section>
              <div class="text-h6">Thống kê danh mục</div>
            </q-card-section>
            
            <q-separator />
            
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="text-h5 text-center text-orange">{{ totalCategories }}</div>
                  <div class="text-center text-grey-8">Tổng số danh mục</div>
                </div>
                <div class="col-6">
                  <div class="text-h5 text-center text-orange">{{ rootCategories.length }}</div>
                  <div class="text-center text-grey-8">Danh mục gốc</div>
                </div>
              </div>
              
              <q-list class="q-mt-md">
                <q-item v-for="category in rootCategories" :key="category.id">
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img v-if="category.categoryImageUrl" :src="category.categoryImageUrl">
                        <template v-slot:error>
                          <q-icon name="category" size="24px" color="grey-7" />
                        </template>
                      </q-img>
                      <q-icon v-else name="category" color="grey-7" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ category.categoryName }}</q-item-label>
                    <q-item-label caption>
                      {{ getChildrenCount(category.id) }} danh mục con
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      color="positive"
                      icon="add"
                      size="sm"
                      @click.stop="openAddDialog(category)"
                    >
                      <q-tooltip>Thêm danh mục con</q-tooltip>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Add/Edit Dialog -->
      <q-dialog v-model="categoryDialog" persistent>
        <q-card style="min-width: 500px">
          <q-card-section class="row items-center">
            <div class="text-h6">{{ dialogTitle }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="saveCategory" ref="categoryForm">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    filled
                    v-model="formData.categoryName"
                    label="Tên danh mục *"
                    :rules="[val => !!val || 'Vui lòng nhập tên danh mục']"
                  />
                </div>
                
                <div class="col-12">
                  <q-select
                    filled
                    v-model="formData.categoryParentId"
                    :options="parentCategoryOptions"
                    label="Danh mục cha"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    clearable
                    :disable="!!preSelectedParent"
                    :hint="preSelectedParent ? `Danh mục cha: ${preSelectedParent.categoryName}` : ''"
                  />
                </div>
                
                <div class="col-12">
                  <q-input
                    filled
                    v-model="formData.categoryImageUrl"
                    label="URL hình ảnh"
                    hint="Nhập URL hình ảnh đại diện cho danh mục"
                  >
                    <template v-slot:append>
                      <q-btn
                        round
                        flat
                        icon="cloud_upload"
                        @click="openImageUploader"
                      >
                        <q-tooltip>Tải lên hình ảnh</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </div>
                
                <div class="col-12 q-mt-sm" v-if="formData.categoryImageUrl">
                  <div class="text-caption q-mb-xs">Xem trước:</div>
                  <q-img
                    :src="formData.categoryImageUrl"
                    style="max-width: 200px; max-height: 150px"
                    class="rounded-borders"
                  >
                    <template v-slot:error>
                      <div class="text-caption text-negative">
                        Không thể tải hình ảnh. Vui lòng kiểm tra URL.
                      </div>
                    </template>
                  </q-img>
                </div>
              </div>
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="grey" v-close-popup />
            <q-btn
              flat
              label="Lưu"
              color="orange"
              @click="saveCategory"
              :loading="saving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Confirmation Dialog -->
      <q-dialog v-model="deleteDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" />
            <span class="q-ml-sm">Xác nhận xóa</span>
          </q-card-section>

          <q-card-section>
            <p>Bạn có chắc chắn muốn xóa danh mục <strong>{{ selectedCategory ? selectedCategory.categoryName : '' }}</strong> không?</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Hủy" color="grey" v-close-popup />
            <q-btn
              flat
              label="Xóa"
              color="negative"
              @click="deleteCategory"
              :loading="deleting"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import categoryService from '../../services/category.service';

const $q = useQuasar();

// Data
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const categoryDialog = ref(false);
const deleteDialog = ref(false);
const selectedCategory = ref(null);
const dialogTitle = ref('Thêm danh mục mới');
const categoryForm = ref(null);
const preSelectedParent = ref(null);

// Form data
const formData = ref({
  id: null,
  categoryName: '',
  categoryParentId: null,
  categoryImageUrl: ''
});

// Computed
const rootCategories = computed(() => {
  return categories.value.filter(category => !category.categoryParentId);
});

const totalCategories = computed(() => {
  return categories.value.length;
});

const categoryTree = computed(() => {
  // Tạo cây danh mục từ danh sách phẳng
  const buildTree = (parentId = null) => {
    return categories.value
      .filter(category => category.categoryParentId === parentId)
      .map(category => ({
        ...category,
        children: buildTree(category.id)
      }));
  };
  
  return buildTree(null);
});

const parentCategoryOptions = computed(() => {
  // Tạo danh sách options cho select danh mục cha
  // Loại bỏ danh mục hiện tại và các danh mục con của nó (nếu đang edit)
  const excludeIds = new Set();
  
  if (formData.value.id) {
    excludeIds.add(formData.value.id);
    
    // Thêm tất cả các danh mục con vào danh sách loại trừ
    const addChildrenIds = (parentId) => {
      categories.value
        .filter(c => c.categoryParentId === parentId)
        .forEach(child => {
          excludeIds.add(child.id);
          addChildrenIds(child.id);
        });
    };
    
    addChildrenIds(formData.value.id);
  }
  
  // Tạo options
  return [
    { label: 'Không có (Danh mục gốc)', value: null },
    ...categories.value
      .filter(category => !excludeIds.has(category.id))
      .map(category => ({
        label: category.categoryName,
        value: category.id
      }))
  ];
});

// Methods
const loadCategories = async () => {
  loading.value = true;
  try {
    categories.value = await categoryService.getAll();
  } catch (error) {
    console.error('Error loading categories:', error);
    $q.notify({
      color: 'negative',
      message: 'Không thể tải dữ liệu danh mục',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const openAddDialog = (parentCategory) => {
  preSelectedParent.value = parentCategory;
  
  formData.value = {
    id: null,
    categoryName: '',
    categoryParentId: parentCategory ? parentCategory.id : null,
    categoryImageUrl: ''
  };
  
  dialogTitle.value = parentCategory 
    ? `Thêm danh mục con cho "${parentCategory.categoryName}"`
    : 'Thêm danh mục gốc';
    
  categoryDialog.value = true;
};

const openEditDialog = (category) => {
  preSelectedParent.value = null;
  
  formData.value = {
    id: category.id,
    categoryName: category.categoryName,
    categoryParentId: category.categoryParentId || null,
    categoryImageUrl: category.categoryImageUrl || ''
  };
  
  dialogTitle.value = 'Chỉnh sửa danh mục';
  categoryDialog.value = true;
};

const saveCategory = async () => {
  // Validate form
  if (categoryForm.value) {
    const isValid = await categoryForm.value.validate();
    if (!isValid) return;
  }

  saving.value = true;
  try {
    if (formData.value.id) {
      // Update existing category
      await categoryService.updateCategory(formData.value.id, formData.value);
      $q.notify({
        color: 'positive',
        message: 'Danh mục đã được cập nhật thành công',
        icon: 'check_circle'
      });
    } else {
      // Create new category
      await categoryService.createCategory(formData.value);
      $q.notify({
        color: 'positive',
        message: 'Danh mục mới đã được tạo thành công',
        icon: 'check_circle'
      });
    }
    
    categoryDialog.value = false;
    preSelectedParent.value = null;
    await loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    $q.notify({
      color: 'negative',
      message: 'Không thể lưu danh mục',
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (category) => {
  // Kiểm tra xem danh mục có danh mục con không
  if (hasChildren(category)) {
    $q.notify({
      color: 'negative',
      message: 'Không thể xóa danh mục có danh mục con',
      icon: 'error'
    });
    return;
  }
  
  selectedCategory.value = category;
  deleteDialog.value = true;
};

const deleteCategory = async () => {
  if (!selectedCategory.value || !selectedCategory.value.id) {
    return;
  }
  
  // Kiểm tra lại một lần nữa để đảm bảo an toàn
  if (hasChildren(selectedCategory.value)) {
    $q.notify({
      color: 'negative',
      message: 'Không thể xóa danh mục có danh mục con',
      icon: 'error'
    });
    deleteDialog.value = false;
    return;
  }
  
  deleting.value = true;
  try {
    await categoryService.deleteCategory(selectedCategory.value.id);
    
    $q.notify({
      color: 'positive',
      message: 'Danh mục đã được xóa thành công',
      icon: 'check_circle'
    });
    
    deleteDialog.value = false;
    await loadCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    $q.notify({
      color: 'negative',
      message: 'Không thể xóa danh mục',
      icon: 'error'
    });
  } finally {
    deleting.value = false;
  }
};

const hasChildren = (category) => {
  if (!category) return false;
  return categories.value.some(c => c.categoryParentId === category.id);
};

const getChildrenCount = (categoryId) => {
  if (!categoryId) return 0;
  
  // Đếm tất cả các danh mục con (bao gồm cả các cấp con sâu hơn)
  const countChildren = (parentId) => {
    const directChildren = categories.value.filter(c => c.categoryParentId === parentId);
    return directChildren.length + directChildren.reduce((sum, child) => sum + countChildren(child.id), 0);
  };
  
  return countChildren(categoryId);
};

const openImageUploader = () => {
  // Placeholder for image upload functionality
  // In a real application, you would implement an image upload feature here
  $q.notify({
    color: 'info',
    message: 'Chức năng tải lên hình ảnh sẽ được triển khai sau',
    icon: 'info'
  });
};

// Lifecycle hooks
onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.category-tree-card,
.category-stats-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.category-image-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
}

/* Tùy chỉnh q-tree */
:deep(.q-tree__node) {
  margin-bottom: 8px;
}

:deep(.q-tree__node--parent) {
  margin-bottom: 12px;
}

:deep(.q-tree__node-header) {
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

:deep(.q-tree__node-header:hover) {
  background-color: #f5f5f5;
}

:deep(.q-tree__node--selected > .q-tree__node-header) {
  background-color: #fff8e1;
}

:deep(.q-tree__arrow) {
  font-size: 1.5em;
}
</style>