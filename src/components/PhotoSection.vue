<template>
  <div class="photos-section">
    <h2 class="section-title">Hình ảnh và video</h2>
    <p class="section-description">
      Thêm tối đa 9 hình ảnh và 1 video cho sản phẩm của bạn
    </p>

    <div class="photo-grid">
      <div
        v-for="(photo, index) in previewPhotoList"
        :key="index"
        class="photo-item"
      >
        <template v-if="photo">
          <img :src="photo" :alt="`Product photo ${index + 1}`" />
          <button class="delete-btn" @click="removePhoto(index)">🗑️</button>
        </template>
        <div v-else class="upload-placeholder" @click="triggerFileInput">
          <q-icon size="40px" name="image" />
          <span>Thêm ảnh</span>
        </div>
      </div>

      <div class="video-item" v-if="videoUrlBeforeUpload">
        <q-video :src="videoUrlBeforeUpload" />
        <button class="delete-btn" @click="removeVideo">🗑️</button>
      </div>
      <div
        v-else
        class="upload-placeholder video-placeholder"
        @click="triggerVideoInput"
      >
        <q-icon size="40px" name="videocam" />
        <span>Thêm video</span>
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
    <input
      ref="videoInput"
      type="file"
      accept="video/*"
      class="hidden"
      @change="handleVideoUpload"
    />
  </div>
</template>

<script setup>
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { ref, onMounted } from "vue";
import cloudinaryService from "../services/cloudinary.service";

const props = defineProps({ productData: Object });
defineExpose({ uploadAllFile });

const ffmpeg = new FFmpeg();
const videoUrlBeforeUpload = ref(props.productData.videoUrl || null);
const previewPhotoList = ref([
  ...props.productData.imageList,
  ...Array(9 - props.productData.imageList.length).fill(null),
]);
const imgListToUpload = ref([]);
const videoToUpload = ref(null);
const fileInput = ref(null);
const videoInput = ref(null);

const triggerFileInput = () => fileInput.value.click();
const triggerVideoInput = () => videoInput.value.click();

async function loadFFmpeg() {
  if (!ffmpeg.loaded) await ffmpeg.load();
}

async function compressVideo(file) {
  await loadFFmpeg();
  ffmpeg.writeFile("input.mp4", await fetchFile(file));
  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-b:v",
    "500k",
    "-vf",
    "scale=854:480",
    "-preset",
    "ultrafast",
    "-c:v",
    "libx264",
    "-an",
    "output.mp4",
  ]);
  const data = await ffmpeg.readFile("output.mp4");
  return new File([data], "compressed.mp4", { type: "video/mp4" });
}

async function uploadAllFile() {
  await uploadVideo();
  await uploadImage();
}

async function uploadVideo() {
  if (!videoToUpload.value) return;
  try {
    const compressedFile = await compressVideo(videoToUpload.value);
    props.productData.videoUrl = await cloudinaryService.uploadVideo(
      compressedFile
    );
  } catch (error) {
    console.error(error);
  }
}

async function uploadImage() {
  if (imgListToUpload.value.length === 0) return;
  try {
    for (const file of imgListToUpload.value) {
      const imgUrl = await cloudinaryService.uploadImage(file);
      props.productData.imageList.push(imgUrl);
    }
  } catch (error) {
    console.log(error);
  }
}

function handleVideoUpload(event) {
  try {
    const file = event.target.files[0];
    videoToUpload.value = file;
    videoUrlBeforeUpload.value = URL.createObjectURL(file);
  } catch (error) {
    console.error(error);
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    if (imgListToUpload.value.length < 9) {
      imgListToUpload.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const index = previewPhotoList.value.findIndex(
          (photo) => photo === null
        );
        if (index !== -1) previewPhotoList.value[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
};

const removePhoto = (index) => {
  previewPhotoList.value[index] = null;
  imgListToUpload.value.splice(index, 1);
};

const removeVideo = () => {
  videoUrlBeforeUpload.value = "";
};
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

.photo-item,
.video-item {
  aspect-ratio: 1;
  border: 2px dashed #e1e1e1;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.photo-item img,
.video-item video {
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

.video-placeholder {
  border: 2px dashed #007aff;
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
