<script setup>
import { computed, onMounted, nextTick  } from 'vue';

import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
  type: { type: String, required: true },
  series: { type: [Array, Object], required: true },
  categories: { type: Array, default: () => [] },

  // Basic Info
  title: String,
  subtitle: String,
  colors: { type: Array, default: () => ['#1E88E5', '#D32F2F', '#7CB342'] },
  loading: Boolean,
  noDataText: { type: String, default: 'Data tidak tersedia' },

  // Formatters
  tooltipFormatter: Function,
  labelFormatter: Function,
  yAxisFormatter: Function,

  // Drilldown
  drilldownSeries: Array,
});

const emit = defineEmits(['data-clicked']);

const currentSeries = computed(() => {
  return props.drilldownSeries?.length ? props.drilldownSeries : props.series;
});

// Helper untuk label aman
function getLabel(w, dataPointIndex) {
  return (
    w?.config?.labels?.[dataPointIndex] ||
    w?.globals?.labels?.[dataPointIndex] ||
    props.categories?.[dataPointIndex] ||
    `Data ${dataPointIndex + 1}`
  );
}

const chartOptions = computed(() => {
  const chartType = props.type === 'column' ? 'bar' : props.type;

  const baseOptions = {
    chart: {
      type: chartType,
      height: 350,
      toolbar: {
        show: true,
      },
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex, seriesIndex }) => {
          if (!props.series || !props.series[seriesIndex]) return;

          const seriesData = props.series[seriesIndex];
          const value = seriesData.data[dataPointIndex];
          const label = props.categories?.[dataPointIndex] || '';

          if (props.tooltipFormatter) {
            alert(props.tooltipFormatter(value, label));
          }

          emit('data-clicked', { value, label, seriesIndex, dataPointIndex });
        }
      }
    },
    title: {
      text: props.title,
      align: 'left',
    },
    subtitle: {
      text: props.subtitle,
      align: 'left',
    },
    colors: props.colors,
    legend: {
      show: true,
      position: 'bottom',
    },
    xaxis: {
      categories: props.categories,
      labels: {
        formatter: val => props.labelFormatter ? props.labelFormatter(val) : val
      }
    },
    yaxis: {
      labels: {
        formatter: val => props.yAxisFormatter ? props.yAxisFormatter(val) : val
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let value, label;

        // Untuk pie/donut/polarArea/radialBar
        if (['pie', 'donut', 'polarArea', 'radialBar'].includes(props.type)) {
          value = series[seriesIndex]; // langsung ambil dari series
          label = w.globals.labels?.[seriesIndex] ?? `Data ${seriesIndex + 1}`;
        } else {
          // Untuk chart lain
          value = series?.[seriesIndex]?.[dataPointIndex];
          label = w.globals.labels?.[dataPointIndex] ?? `Data ${dataPointIndex + 1}`;
        }

        if (props.tooltipFormatter) {
          return `<div class="px-2 py-1 text-sm">${props.tooltipFormatter(value, label, seriesIndex)}</div>`;
        }

        return `<div class="px-2 py-1 text-sm"><strong>${label}</strong><br/>${value}</div>`;
      }
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
    stroke: {
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    noData: {
      text: props.noDataText,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#999',
        fontSize: '14px',
      }
    },
  };

  const t = props.type;

  // Special configs
  if (['pie', 'donut', 'polarArea'].includes(t)) {
    return {
      ...baseOptions,
      labels: props.categories,
    };
  }

  if (t === 'radialBar') {
    return {
      ...baseOptions,
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '16px' },
            value: { fontSize: '14px' },
          }
        }
      },
      labels: props.categories,
    };
  }

  if (t === 'heatmap') {
    return {
      ...baseOptions,
      xaxis: { categories: props.categories }
    };
  }

  if (t === 'bubble') {
    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        zoom: { enabled: true },
      },
      xaxis: {
        tickAmount: 10,
        type: 'numeric'
      },
      yaxis: {
        max: 100,
      },
      fill: {
        type: 'gradient',
      },
      plotOptions: {
        bubble: {
          minBubbleRadius: 3,
          maxBubbleRadius: 20,
        },
      },
    };
  }

  if (t === 'candlestick') {
    return {
      ...baseOptions,
      xaxis: { type: 'datetime' }
    };
  }

  if (t === 'radar') {
    return {
      ...baseOptions,
      xaxis: { categories: props.categories }
    };
  }

  if (['bar', 'column'].includes(t)) {
    return {
      ...baseOptions,
      plotOptions: {
        bar: {
          horizontal: t === 'bar',
        }
      }
    };
  }

  return baseOptions;
});

onMounted(() => {
  nextTick(() => {
    // Tunggu Vue selesai render, lalu cari dan sembunyikan item CSV
    setTimeout(() => {
      const menuItems = document.querySelectorAll('.apexcharts-menu-item');
      menuItems.forEach(item => {
        const text = item?.textContent?.trim();
        if (text?.toLowerCase().includes('csv')) {
          item.style.display = 'none';
        }
      });
    }, 100); // delay sedikit agar ApexChart sudah render
  });
});
</script>
<template>
  <div class="relative min-h-[350px]">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
      <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>

    <VueApexCharts width="100%" height="350" :options="chartOptions" :series="currentSeries" />
  </div>
</template>
