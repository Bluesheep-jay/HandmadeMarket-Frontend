<template>
  <footer>
    <!-- Sección superior con fondo crema -->
    <div class="upper-footer">
      <div class="container q-py-md">
        <div class="text-center q-mb-sm">
          <div class="text-h5 q-mb-xs">Handmade Market là gì?</div>
          <q-btn
            flat
            dense
            color="primary"
            label="Đọc câu chuyện của chúng tôi"
            no-caps
          />
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <!-- Columna 1 -->
          <div class="col-12 col-md-4 q-mb-sm">
            <div class="text-subtitle1 q-mb-xs">
              Cộng đồng tạo nên điều tốt đẹp
            </div>
            <p class="text-body2 q-mb-xs">
              Handmade Market là sàn thương mại điện tử, nơi mọi người cùng nhau
              tạo ra, bán và mua những món đồ độc đáo.
            </p>
          </div>

          <!-- Columna 2 -->
          <div class="col-12 col-md-4 q-mb-sm">
            <div class="text-subtitle1 q-mb-xs">
              Hỗ trợ người sáng tạo độc lập
            </div>
            <p class="text-body2 q-mb-xs">
              Chúng tôi kết nối bạn trực tiếp với các nhà sáng tạo để tìm thấy
              những sản phẩm đặc biệt.
            </p>
          </div>

          <!-- Columna 3 -->
          <div class="col-12 col-md-4 q-mb-sm">
            <div class="text-subtitle1 q-mb-xs">Sự an tâm</div>
            <p class="text-body2 q-mb-xs">
              Quyền riêng tư của bạn là ưu tiên hàng đầu của đội ngũ chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Franja azul -->
    <div class="eco-banner q-py-xs text-center text-white">
      <q-icon name="eco" size="xs" class="q-mr-xs" />
      Handmade Market được vận hành bằng 60% năng lượng tái tạo.
    </div>

    <!-- Sección inferior con fondo azul oscuro -->
    <div class="lower-footer text-white">
      <div class="container q-py-md">
        <div class="row q-col-gutter-md">
          <!-- Logo y redes sociales -->
          <div class="col-12 col-md-3 q-mb-md">
            <div class="logo-container">
              <q-avatar
                size="55px"
                color="orange"
                text-color="white"
                class="q-mb-sm"
              >
                <span class="text-h6">HMM</span>
              </q-avatar>
              <div class="social-icons q-mt-sm">
                <q-btn flat round dense color="white" icon="fab fa-facebook" />
                <q-btn flat round dense color="white" icon="fab fa-instagram" />
                <q-btn flat round dense color="white" icon="fab fa-pinterest" />
                <q-btn flat round dense color="white" icon="fab fa-youtube" />
                <q-btn flat round dense color="white" icon="fab fa-twitter" />
                <q-btn flat round dense color="white" icon="fab fa-tiktok" />
                <q-btn flat round dense color="white" icon="fab fa-linkedin" />
              </div>
            </div>
          </div>

          <!-- Enlaces -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-subtitle2 q-mb-xs">Mua sắm</div>
            <div class="link-list">
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Thẻ quà tặng"
                class="q-px-none"
              />
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Danh mục sản phẩm"
                class="q-px-none"
              />
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-subtitle2 q-mb-xs">Bán hàng</div>
            <div class="link-list">
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Hướng dẫn người bán"
                class="q-px-none"
              />
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Mở cửa hàng"
                class="q-px-none"
              />
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <div class="text-subtitle2 q-mb-xs">Về chúng tôi</div>
            <div class="link-list">
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Chính sách"
                class="q-px-none"
              />
              <q-btn
                flat
                no-caps
                dense
                color="white"
                label="Tuyển dụng"
                class="q-px-none"
              />
            </div>
          </div>
        </div>

        <div class="text-center q-mt-sm text-caption">
          © 2025 Handmade Market, Inc.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No se requiere lógica adicional
</script>

<style scoped>
.upper-footer {
  margin-top: 20px;
  background-color: #fff8e1;
  padding: 10px 0;
}

.eco-banner {
  background-color: #4a6de5;
}

.lower-footer {
  background-color: #1a237e;
  padding: 10px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.link-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.link-list .q-btn {
  margin-bottom: 4px;
  justify-content: flex-start;
  min-height: 24px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

p {
  margin: 0;
  line-height: 1.3;
}
</style>
