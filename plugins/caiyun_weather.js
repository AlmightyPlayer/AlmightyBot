// 彩云天气
// 获取GPS地址：https://api.map.baidu.com/lbsapi/getpoint/index.html
// 请先在secrets中设置caiyun_key 和caiyun_gps
// 多个gps坐标，请使用|分隔开，比如11.11,22.22|33.33,44.44
//加载机器人模块
const Bot = require('../modules/bot');
//加载后端交互axios库
const axios = require('axios').default;
//加载进程环境
const process = require('process');
//建立配置天气插件类继承机器人模块
class Plugin extends Bot {
  constructor () {
    super();
    const { caiyun_key, caiyun_gps } = process.env;
    if (!caiyun_key || !caiyun_gps) {
      console.error('! 请先配置secrets:caiyun_gps,caiyun_key');
      return this.exit();
    }
    this.API_KEY = caiyun_key;
    this.GPS = caiyun_gps;
  }
  async run () {
    // 判断是否是多gps
    const _gps = this.GPS.split('|');
    _gps.map(async gps => {
      const tmp = gps.split('@');
      //对接weatherAPI接口
      const api = `https://api.caiyunapp.com/v2.6/${this.API_KEY}/${tmp[0]}/weather.json?alert=true`;
      //获取weather.json内的API信息写入data中
      await axios.get(api).then(async res => {
        const { data } = res;
        await this._sendData(data, tmp[1]);
      })
    });
  }
  //向企业微信发送消息主题
  async _sendData (data, addr = '') {
    // 预警信息
    let alert_md = '';
    if (data.result.alert.content.length > 0) {
      alert_md += '⏰ 实时天气预报 ⏰ \n';
      data.result.alert.content.map(a => {
        alert_md += `**${a.title}**\n> <font color="comment">${a.description}</font>\n\n`;
      });
    }
    await this.sendMarkdown(`
    **🌞源哥来报道！！**
    > <font color="info">预报地点：${addr || ''}</font>**
    > <font color="info">气温：${data.result.realtime.temperature.trim()}</font>**
    > <font color="info">体感温度：${data.result.realtime.apparent_temperature.trim()}</font>**
    > <font color="info">气压：${data.result.realtime.pressure.trim()}</font>**
    > <font color="info">空气质量（PM25）：${data.result.realtime.air_quality.pm25.trim()}</font>**
    > <font color="info">空气质量（PM10）：${data.result.realtime.air_quality.pm10.trim()}</font>**
    > <font color="info">相对湿度：${data.result.realtime.humidity.trim()}&&'%'</font>**
    > <font color="info">风向：${data.result.realtime.wind.direction.trim()}</font>**
    > <font color="info">风速：${data.result.realtime.wind.speed.trim()}</font>
    **🌝实时刷新天气预报**
    > <font color="warning">分钟级预报：${data.result.minutely.description.trim()}</font>**
    > <font color="warning">降雨概率：${data.result.minutely.probability.trim()}*100&&'%'</font>
    **🌝小时级别天气预报**
    > <font color="info">${data.result.hourly.description.trim()}</font>
    ${alert_md}`);
  }
}

new Plugin().run()
