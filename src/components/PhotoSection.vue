<template>
  <div class="photos-section">
    <h2 class="section-title">Hình ảnh và video</h2>
    <p class="section-description">
      Thêm tối đa 10 hình ảnh và 1 video cho sản phẩm của bạn
    </p>

    <div class="photo-grid">
      <div
        v-for="(photo, index) in previewPhotoList"
        :key="index"
        class="photo-item"
        :class="{ 'is-empty': !photo }"
      >
        <template v-if="photo">
          <img :src="photo" :alt="`Product photo ${index + 1}`" />
          <button class="delete-btn" @click="removePhoto(index)">
            <span class="icon">🗑️</span>
          </button>
        </template>
        <div v-else class="upload-placeholder" @click="triggerFileInput">
          <q-icon size="40px" name="image" />
          <span>Add a photo</span>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileUpload"
    />
    <button @click="test">test</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import cloudinaryService from "../services/cloudinary.service";

const props = defineProps({ productData: Object });

const previewPhotoList = ref(Array(10).fill(null));
const fileInput = ref(null);
const fileListToUpload = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);

  files.forEach((file, index) => {
    if (fileListToUpload.value.length < 10) {
      fileListToUpload.value.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const firstEmptyIndex = previewPhotoList.value.findIndex(
          (photo) => photo === null
        );
        if (firstEmptyIndex !== -1) {
          previewPhotoList.value[firstEmptyIndex] = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  });
};

const removePhoto = (index) => {
  previewPhotoList.value[index] = null;
  fileListToUpload.value.splice(index, 1);
};

async function test() {
  await uploadImage();
}
async function uploadImage() {
  if (fileListToUpload.value.length === 0) {
    console.log("ko có ảnh");
    return;
  }
  try {
    for (const file of fileListToUpload.value) {
      const imgUrl = await cloudinaryService.uploadImage(file);
      props.productData.imageList.push(imgUrl);
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.photos-section {
  max-width: 800px;
}

.section-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #595959;
  margin-bottom: 2rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.photo-item {
  aspect-ratio: 1;
  border: 2px dashed #e1e1e1;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: #595959;
}

.upload-placeholder i {
  font-size: 24px;
  margin-bottom: 0.5rem;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.hidden {
  display: none;
}
</style>
