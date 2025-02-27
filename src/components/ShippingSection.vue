<template>
    <div class="shipping-section">
      <h2 class="section-title">Vận chuyển</h2>
      <p class="section-description">
        Thiết lập vận chuyển đơn hàng
      </p>
  
      <div class="form-group">
        <label for="weight">Cân nặng</label>
        <div class="input-with-unit">
          <input
            id="weight"
            v-model="weight"
            type="number"
            min="0"
            step="0.1"
            class="form-input"
            placeholder="0.0"
          />
          <span class="unit">kg</span>
        </div>
      </div>
  
      <div class="form-group">
        <label>Kích thước</label>
        <div class="dimensions-group">
          <div class="input-with-unit">
            <input
              v-model="length"
              type="number"
              min="0"
              step="0.1"
              class="form-input"
              placeholder="Chiều dài"
            />
            <span class="unit">cm</span>
          </div>
          <div class="input-with-unit">
            <input
              v-model="width"
              type="number"
              min="0"
              step="0.1"
              class="form-input"
              placeholder="Chiều rộng"
            />
            <span class="unit">cm</span>
          </div>
          <div class="input-with-unit">
            <input
              v-model="height"
              type="number"
              min="0"
              step="0.1"
              class="form-input"
              placeholder="Chiều cao"
            />
            <span class="unit">cm</span>
          </div>
        </div>
      </div>
  
      <div class="form-group">
        <div class="shipping-options">
          <div class="switch-container">
            <label for="fast-shipping">Vận chuyển nhanh</label>
            <label class="switch">
              <input
                id="fast-shipping"
                v-model="fastShipping"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>
          <div class="switch-container">
            <label for="heavy-shipping">Hàng cồng kềnh</label>
            <label class="switch">
              <input
                id="heavy-shipping"
                v-model="heavyShipping"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const weight = ref('')
  const length = ref('')
  const width = ref('')
  const height = ref('')
  const fastShipping = ref(false)
  const heavyShipping = ref(false)
  </script>
  
  <style scoped>
  .shipping-section {
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
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    font-size: 16px;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #222;
  }
  
  .input-with-unit {
    position: relative;
    max-width: 200px;
  }
  
  .unit {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #595959;
  }
  
  .input-with-unit .form-input {
    padding-right: 40px;
  }
  
  .dimensions-group {
    display: flex;
    gap: 1rem;
  }
  
  .dimensions-group .input-with-unit {
    flex: 1;
  }
  
  .shipping-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: #222;
  }
  
  input:checked + .slider:before {
    transform: translateX(24px);
  }
  
  @media (max-width: 600px) {
    .dimensions-group {
      flex-direction: column;
    }
  }
  </style>