// green-ecology-theme.js
export const greenEcologyTheme = {
  // 基础配色方案
  color: [
    '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', 
    '#4caf50', '#388e3c', '#2e7d32', '#1b5e20'
  ],
  
  // 背景色
  backgroundColor: 'transparent',
  
  // 文本样式
  textStyle: {
    color: '#1b5e20',
    fontSize: 12
  },
  
  // 标题样式
  title: {
    textStyle: {
      color: '#2e7d32',
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#689f38',
      fontSize: 13
    }
  },
  
  // 图例样式
  legend: {
    textStyle: {
      color: '#1b5e20'
    }
  },
  
  // 提示框样式
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#4caf50',
    borderWidth: 1,
    textStyle: {
      color: '#1b5e20',
      fontSize: 14
    }
  },
  
  // 区域缩放样式
  dataZoom: {
    textStyle: {
      color: '#1b5e20'
    }
  },
  
  // 视觉映射组件样式
  visualMap: {
    textStyle: {
      color: '#1b5e20'
    }
  },
  
  // 工具栏样式
  toolbox: {
    iconStyle: {
      borderColor: '#4caf50'
    }
  },
  
  // 坐标轴样式 - 适用于折线图等
  axis: {
    axisLine: {
      lineStyle: {
        color: '#81c784'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#81c784'
      }
    },
    axisLabel: {
      color: '#388e3c'
    },
    splitLine: {
      lineStyle: {
        color: '#e8f5e9',
        type: 'dashed'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(232,245,233,0.3)', 'rgba(200,230,201,0.3)']
      }
    }
  },
  
  // 极坐标样式 - 适用于雷达图
  polar: {
    axisLine: {
      lineStyle: {
        color: '#81c784'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#81c784'
      }
    },
    axisLabel: {
      color: '#388e3c'
    },
    splitLine: {
      lineStyle: {
        color: '#e8f5e9',
        type: 'dashed'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(232,245,233,0.3)', 'rgba(200,230,201,0.3)']
      }
    }
  },
  
  // 雷达图指示器样式
  radar: {
    name: {
      textStyle: {
        color: '#1b5e20'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#e8f5e9'
      }
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(200,230,201,0.3)', 'rgba(165,214,167,0.3)']
      }
    },
    axisLine: {
      lineStyle: {
        color: '#81c784'
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
      color: '#1b5e20'
    },
    labelLine: {
      lineStyle: {
        color: '#81c784'
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
      position:'inside',
      color: '#1b5e20'
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
      shadowColor: 'rgba(0, 150, 136, 0.3)'
    }
  },
  
  // 地图样式
  map: {
    itemStyle: {
      borderColor: '#81c784',
      borderWidth: 1,
      areaColor: '#e8f5e9'
    },
    label: {
      color: '#388e3c',
      fontSize: 11
    },
    emphasis: {
      itemStyle: {
        areaColor: '#ffd54f',
        borderColor: '#388e3c'
      },
      label: {
        color: '#1b5e20',
        fontSize: 12,
        fontWeight: 'bold'
      }
    }
  }
};