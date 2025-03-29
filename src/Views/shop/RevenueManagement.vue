<template>
  <q-page padding>
    <div class="text-h4 q-mb-lg">Quản lý doanh thu</div>

    <!-- Filter Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-select
          v-model="selectedYear"
          :options="yearOptions"
          label="Năm"
          outlined
          dense
          @update:model-value="fetchData"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="selectedMonth"
          :options="monthOptions"
          label="Tháng"
          outlined
          dense
          @update:model-value="fetchData"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-orange-7 text-white">
          <q-card-section>
            <div class="text-subtitle2">
              Tổng doanh thu năm {{ selectedYear }}
            </div>
            <div class="text-h4">{{ formatPrice(totalYearRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-subtitle2">
              Doanh thu tháng {{ selectedMonth }}/{{ selectedYear }}
            </div>
            <div class="text-h4">{{ formatPrice(totalMonthRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-orange-7 text-white">
          <q-card-section>
            <div class="text-subtitle2">Doanh thu trung bình/ngày</div>
            <div class="text-h4">{{ formatPrice(averageDailyRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-subtitle2">Doanh thu trung bình/tháng</div>
            <div class="text-h4">{{ formatPrice(averageMonthlyRevenue) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Monthly Revenue Chart -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Doanh thu theo tháng ({{ selectedYear }})</div>
        <div class="chart-container" style="position: relative; height: 300px">
          <canvas ref="monthlyChartRef"></canvas>
        </div>
      </q-card-section>
    </q-card>

    <!-- Daily Revenue Chart -->
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Doanh thu theo ngày (Tháng {{ selectedMonth }}/{{ selectedYear }})
        </div>
        <div class="chart-container" style="position: relative; height: 300px">
          <canvas ref="dailyChartRef"></canvas>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="loading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount, watch } from "vue";
import Chart from "chart.js/auto";
import orderService from "../../services/order.service";

// Data
const dailyRevenueForMonth = ref([]);

const monthlyRevenueForYear = ref([
  { month: "2025-01", totalRevenue: 8500000 },
  { month: "2025-02", totalRevenue: 7800000 },
  { month: "2025-03", totalRevenue: 6000000 },
  { month: "2025-04", totalRevenue: 1500000 },
]);

// Chart references
const dailyChartRef = ref(null);
const monthlyChartRef = ref(null);
let dailyChart = null;
let monthlyChart = null;

// State
const loading = ref(false);
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const shopId = ref(localStorage.getItem("shopId"));

// Options for selects

const yearOptions = ref([]);

const monthOptions = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

onBeforeMount(async () => {
  fetchData();

  for (let year = new Date().getFullYear(); year >= 2020; year--) {
    yearOptions.value.push(year);
  }
});

// Computed properties
const totalYearRevenue = computed(() => {
  return monthlyRevenueForYear.value.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
});

const totalMonthRevenue = computed(() => {
  return dailyRevenueForMonth.value.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
});

const averageDailyRevenue = computed(() => {
  if (dailyRevenueForMonth.value.length === 0) return 0;
  return totalMonthRevenue.value / dailyRevenueForMonth.value.length;
});

const averageMonthlyRevenue = computed(() => {
  if (monthlyRevenueForYear.value.length === 0) return 0;
  return totalYearRevenue.value / monthlyRevenueForYear.value.length;
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDay = (dateString) => {
  const date = new Date(dateString);
  return date.getDate();
};

const formatMonth = (monthString) => {
  // Extract month from "YYYY-MM" format
  return monthString.split("-")[1];
};

function createFullMonthData(rawDailyRevenue) {
  const daysInMonth = new Date(
    selectedYear.value,
    selectedMonth.value,
    0
  ).getDate();

  const fullMonthData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = `${selectedYear.value}-${selectedMonth.value
      .toString()
      .padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}`;
    return { day, totalRevenue: 0 };
  });

  rawDailyRevenue.forEach((data) => {
    const index = fullMonthData.findIndex((d) => d.day === data.day);
    if (index !== -1) {
      fullMonthData[index].totalRevenue = data.totalRevenue;
    }
  });

  dailyRevenueForMonth.value = fullMonthData;
}

function createFullYearData(rawMonthlyRevenue) {
  const monthsInYear = 12;
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const month = `${selectedYear.value}-${(i + 1)
      .toString()
      .padStart(2, "0")}`;
    return { month, totalRevenue: 0 };
  });

  rawMonthlyRevenue.forEach((data) => {
    const index = fullYearData.findIndex((m) => m.month === data.month);
    if (index !== -1) {
      fullYearData[index].totalRevenue = data.totalRevenue;
    }
  });

  monthlyRevenueForYear.value = fullYearData;
}

const fetchData = async () => {
  loading.value = true;
  try {
    const rawDailyRevenue = await orderService.getDailyRevenueForMonth(
      shopId.value,
      selectedYear.value,
      selectedMonth.value
    );
    createFullMonthData(rawDailyRevenue);

    const rawMonthlyRevenue = await orderService.getMonthlyRevenueForYear(
      shopId.value,
      selectedYear.value
    );

    createFullYearData(rawMonthlyRevenue);

    updateDailyChart();
    updateMonthlyChart();
  } catch (error) {
    console.error("Error fetching revenue data:", error);
  } finally {
    loading.value = false;
  }
};

const initCharts = () => {
  // Initialize daily revenue chart
  const dailyCtx = dailyChartRef.value.getContext("2d");
  dailyChart = new Chart(dailyCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Doanh thu theo ngày",
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return formatPrice(context.parsed.y);
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatPrice(value).replace("₫", "");
            },
          },
        },
      },
    },
  });

  // Initialize monthly revenue chart
  const monthlyCtx = monthlyChartRef.value.getContext("2d");
  monthlyChart = new Chart(monthlyCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Doanh thu theo tháng",
          data: [],
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return formatPrice(context.parsed.y);
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatPrice(value).replace("₫", "");
            },
          },
        },
      },
    },
  });

  // Update charts with initial data
  updateDailyChart();
  updateMonthlyChart();
};

const updateDailyChart = () => {
  if (!dailyChart) return;

  // Sort data by day
  const sortedData = [...dailyRevenueForMonth.value].sort(
    (a, b) => new Date(a.day) - new Date(b.day)
  );

  // Update chart data
  dailyChart.data.labels = sortedData.map((item) => formatDay(item.day));
  dailyChart.data.datasets[0].data = sortedData.map(
    (item) => item.totalRevenue
  );
  dailyChart.update();
};

const updateMonthlyChart = () => {
  if (!monthlyChart) return;

  // Sort data by month
  const sortedData = [...monthlyRevenueForYear.value].sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // Update chart data
  monthlyChart.data.labels = sortedData.map(
    (item) => `Tháng ${formatMonth(item.month)}`
  );
  monthlyChart.data.datasets[0].data = sortedData.map(
    (item) => item.totalRevenue
  );
  monthlyChart.update();
};

// Lifecycle hooks
onMounted(() => {
  initCharts();
});

// Watch for changes in data
watch([dailyRevenueForMonth, monthlyRevenueForYear], () => {
  updateDailyChart();
  updateMonthlyChart();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
