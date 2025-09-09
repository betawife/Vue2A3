// low-carbon-theme.js
export const lowCarbonTheme = {
  // 基础配色方案 - 蓝色系代表清洁能源和低碳
  color: [
    '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6',
    '#42a5f5', '#2196f3', '#1e88e5', '#1976d2'
  ],
  
  // 背景色
  backgroundColor: 'transparent',
  
  // 文本样式
  textStyle: {
    color: '#0d47a1',
    fontSize: 12
  },
  
  // 标题样式
  title: {
    textStyle: {
      color: '#1565c0',
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#42a5f5',
      fontSize: 13
    }
  },
  
  // 图例样式
  legend: {
    textStyle: {
      color: '#0d47a1'
    }
  },
  
  // 提示框样式
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#42a5f5',
    borderWidth: 1,
    textStyle: {
      color: '#0d47a1',
      fontSize: 14
    }
  },
  
  // 区域缩放样式
  dataZoom: {
    textStyle: {
      color: '#0d47a1'
    }
  },
  
  // 视觉映射组件样式
  visualMap: {
    textStyle: {
      color: '#0d47a1'
    }
  },
  
  // 工具栏样式
  toolbox: {
    iconStyle: {
      borderColor: '#42a5f5'
    }
  },
  
  // 坐标轴样式
  axis: {
    axisLine: {
      lineStyle: {
        color: '#90caf9'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#90caf9'
      }
    },
    axisLabel: {
      color: '#2196f3'
    },
    splitLine: {
      lineStyle: {
        color: '#e3f2fd',
        type: 'dashed'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(227,242,253,0.3)', 'rgba(187,222,251,0.3)']
      }
    }
  },
  
  // 极坐标样式 - 适用于雷达图
  polar: {
    axisLine: {
      lineStyle: {
        color: '#90caf9'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#90caf9'
      }
    },
    axisLabel: {
      color: '#2196f3'
    },
    splitLine: {
      lineStyle: {
        color: '#e3f2fd',
        type: 'dashed'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(227,242,253,0.3)', 'rgba(187,222,251,0.3)']
      }
    }
  },
  
  // 雷达图指示器样式
  radar: {
    name: {
      textStyle: {
        color: '#0d47a1'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#e3f2fd'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(187,222,251,0.3)', 'rgba(144,202,249,0.3)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#90caf9'
      }
    }
  },
  
  // 饼图/旭日图样式
  pie: {
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    label: {
      color: '#0d47a1'
    },
    labelLine: {
      lineStyle: {
        color: '#90caf9'
      }
    }
  },
  
  // 旭日图样式
  sunburst: {
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 1
    },
    label: {
      color: '#0d47a1'
    }
  },
  
  // 折线图样式
  line: {
    itemStyle: {
      borderWidth: 2
    },
    lineStyle: {
      width: 3
    },
    symbolSize: 8,
    symbol: 'emptyCircle'
  },
  
  // 散点图样式
  scatter: {
    itemStyle: {
      shadowBlur: 8,
      shadowColor: 'rgba(33,150,243,0.3)'
    }
  },
  
  // 地图样式
  map: {
    itemStyle: {
      borderColor: '#90caf9',
      borderWidth: 1,
      areaColor: '#e3f2fd'
    },
    label: {
      color: '#2196f3',
      fontSize: 11
    },
    emphasis: {
      itemStyle: {
        areaColor: '#ffd54f', // 使用黄色高亮强调
        borderColor: '#2196f3'
      },
      label: {
        color: '#0d47a1',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  },
  
  // 自定义主题属性
  themeName: 'low-carbon',
  themeDescription: '低碳环保主题，以蓝色系为主色调，代表清洁能源和可持续发展'
};