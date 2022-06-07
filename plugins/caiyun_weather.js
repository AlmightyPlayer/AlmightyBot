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

//定义插件类继承机器人模块
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
    //获取weather.json、realtime.json、minutely.json、hourly.json、daily.json、realtime_with_alert.json
      const weatherapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/weather.json?alert=true`;
      const realtimeapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/realtime.json?alert=true`;
      const minutelyapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/minutelyapi.json?alert=true`;
      const hourlyapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/hourlyapi.json?alert=true`;
      const dailyapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/dailyapi.json?alert=true`;
      const realtime_with_alertapi = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/realtime_with_alertapi.json?alert=true`;
      await axios.get(weatherapi).then(async res => {
        const { weatherapidata } = res;
        await this._sendData(weatherapidata, tmp[1]);
      })
    });
  }

  async _sendData (weatherapidata, addr = '') {
    // 预警信息
    let alert_md = '';
    if (weatherapidata.result.alert.content.length > 0) {
      alert_md += '⏰ 实时天气预报 ⏰ \n';
      weatherapidata.result.alert.content.map(a => {
        alert_md += `**${a.title}**\n> <font color="comment">${a.description}</font>\n\n`;
      });
    }
    await this.sendMarkdown(`
🌞 源哥天气预报 🌞**
> <font color="info">预报地点：${addr || ''}</font>

🌡 体感温度提醒 🌡**
> <font color="info">${weatherapidata.result.hourly.description.trim()}</font>

**🌧降雨提醒🌧**
> <font color="warning">${weatherapidata.result.minutely.description.trim()}</font>

**🌝 预报信息 🌝**
> <font color="info">${weatherapidata.result.hourly.description.trim()}</font>

${alert_md}`);
  }
}

new Plugin().run()
