<template>
    <div class="not-found">
      <h1>404 - Trang không tồn tại</h1>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <router-link to="/customer">Quay về trang chủ</router-link>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
  }
  h1 {
    font-size: 2rem;
    color: red;
  }
  </style>
  