// 彩云天气
// 获取GPS地址：https://api.map.baidu.com/lbsapi/getpoint/index.html
// 请先在secrets中设置caiyun_key 和caiyun_gps
// 多个gps坐标，请使用|分隔开，比如11.11,22.22|33.33,44.44

const Bot = require('../modules/bot');
const axios = require('axios').default;
const process = require('process');

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
      const api = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/weather.json?alert=true`;
      await axios.get(api).then(async res => {
        const { data } = res;
        await this._sendData(data, tmp[1]);
      })
    });
  }

  async _sendData (data, addr = '') {
    // 预警信息
    let alert_md = '';
    if (data.result.alert.content.length > 0) {
      alert_md += '天气预警 ⚠\n';
      data.result.alert.content.map(a => {
        alert_md += `**${a.title}**\n> <font color="comment">${a.description}</font>\n\n`;
      });
    }
			// 风力判断
			var wind_power = '';
			if (data.result.realtime.wind.speed <= 1) {
				wind_power = '0 级无风 \n';
			}else if(data.result.realtime.wind.speed > 1 && data.result.realtime.wind.speed <= 5){
				wind_power = '1 级微风徐徐 \n';
			}else if(data.result.realtime.wind.speed > 5 && data.result.realtime.wind.speed <= 11){
				wind_power = '2 级清风 \n';
			}else if(data.result.realtime.wind.speed > 11 && data.result.realtime.wind.speed <= 19){
				wind_power = '3 级树叶摇摆 \n';
			}else if(data.result.realtime.wind.speed > 19 && data.result.realtime.wind.speed <= 28){
				wind_power = '4 级树枝摇动 \n';
			}else if(data.result.realtime.wind.speed > 28 && data.result.realtime.wind.speed <= 38){
				wind_power = '5 级风力强劲 \n';
			}else if(data.result.realtime.wind.speed > 38 && data.result.realtime.wind.speed <= 49){
				wind_power = '6 级风力强劲 \n';
			}else if(data.result.realtime.wind.speed > 49 && data.result.realtime.wind.speed <= 61){
				wind_power = '7 级风力超强 \n';
			}else if(data.result.realtime.wind.speed > 61 && data.result.realtime.wind.speed <= 74){
				wind_power = '8 级狂风大作 \n';
			}else if(data.result.realtime.wind.speed > 74 && data.result.realtime.wind.speed <= 88){
				wind_power = '9 级狂风呼啸 \n';
			}else if(data.result.realtime.wind.speed > 88 && data.result.realtime.wind.speed <= 102){
				wind_power = '10 级暴风毁树 \n';
			}else if(data.result.realtime.wind.speed > 102 && data.result.realtime.wind.speed <= 117){
				wind_power = '11 级暴风毁树 \n';
			}else if(data.result.realtime.wind.speed > 117 && data.result.realtime.wind.speed <= 133){
				wind_power += '12 级飓风 \n';
			}else if(data.result.realtime.wind.speed > 133 && data.result.realtime.wind.speed <= 149){
				wind_power = '13 级台风 \n';
			}else if(data.result.realtime.wind.speed > 149 && data.result.realtime.wind.speed <= 166){
				wind_power = '14 级强台风 \n';
			}else if(data.result.realtime.wind.speed > 166 && data.result.realtime.wind.speed <= 183){
				wind_power = '15 级强台风 \n';
			}else if(data.result.realtime.wind.speed > 183 && data.result.realtime.wind.speed <= 201){
				wind_power = '16 级超强台风 \n';
			}else if(data.result.realtime.wind.speed > 201 && data.result.realtime.wind.speed <= 220){
				wind_power = '17 级超强台风 \n';
			}else{
				wind_power = '这个风力已经超出了源哥的认知了- -！ \n';
			}
			// 风向判断
			var wind_direction = '';
			if (data.result.realtime.wind.direction >= 348.76 || data.result.realtime.wind.direction <= 11.25){
				wind_direction = '北风';
			}else if(data.result.realtime.wind.direction > 11.25 && data.result.realtime.wind.direction <= 33.75){
				wind_direction = '北东北风';
			}else if(data.result.realtime.wind.direction > 33.75 && data.result.realtime.wind.direction <= 56.25){
				wind_direction = '东北风';
			}else if(data.result.realtime.wind.direction > 56.25 && data.result.realtime.wind.direction <= 78.75){
				wind_direction = '东东北风';
			}else if(data.result.realtime.wind.direction > 78.75 && data.result.realtime.wind.direction <= 101.25){
				wind_direction = '东风';
			}else if(data.result.realtime.wind.direction > 101.25 && data.result.realtime.wind.direction <= 123.75){
				wind_direction = '东东南风';
			}else if(data.result.realtime.wind.direction > 123.75 && data.result.realtime.wind.direction <= 146.25){
				wind_direction = '东南风';
			}else if(data.result.realtime.wind.direction > 146.25 && data.result.realtime.wind.direction <= 168.75){
				wind_direction = '南东南风';
			}else if(data.result.realtime.wind.direction > 168.75 && data.result.realtime.wind.direction <= 191.25){
				wind_direction = '南风';
			}else if(data.result.realtime.wind.direction > 191.25 && data.result.realtime.wind.direction <= 213.75){
				wind_direction = '南西南风';
			}else if(data.result.realtime.wind.direction > 213.75 && data.result.realtime.wind.direction <= 236.25){
				wind_direction = '西南风';
			}else if(data.result.realtime.wind.direction > 236.25 && data.result.realtime.wind.direction <= 258.75){
				wind_direction = '西西南风';
			}else if(data.result.realtime.wind.direction > 258.75 && data.result.realtime.wind.direction <= 281.25){
				wind_direction = '西风';
			}else if(data.result.realtime.wind.direction > 281.25 && data.result.realtime.wind.direction <= 303.75){
				wind_direction = '西西北风';
			}else if(data.result.realtime.wind.direction > 303.75 && data.result.realtime.wind.direction <= 328.25){
				wind_direction = '西北风';
			}else if(data.result.realtime.wind.direction > 326.25 && data.result.realtime.wind.direction <= 348.75){
				wind_direction = '北西北风';
			}else{
				wind_direction = '这个风向已经超出了源哥的认知了- -！ \n';
			}
	  		//空气质量PM2.5
	  		var air_AQI25 = '';
	  		if (data.result.realtime.air_quality.pm25 <= 50){
				air_AQI25 = '优';
			}else if(data.result.realtime.air_quality.pm25 > 50 && data.result.realtime.air_quality.pm25 <= 100){
				air_AQI25 = '良';
			}else if(data.result.realtime.air_quality.pm25 > 100 && data.result.realtime.air_quality.pm25 <= 150){
				air_AQI25 = '轻度污染';
			}else if(data.result.realtime.air_quality.pm25 > 150 && data.result.realtime.air_quality.pm25 <= 200){
				air_AQI25 = '中度污染';
			}else if(data.result.realtime.air_quality.pm25 > 200 && data.result.realtime.air_quality.pm25 <= 300){
				air_AQI25 = '重度污染';
			}else if(data.result.realtime.air_quality.pm25 > 300){
				air_AQI25 = '严重污染';
			}else{
				air_AQI25 = '这个空气质量已经超出了源哥的认知了- -！ \n';
			}
	  		//空气质量PM10
	  		var air_AQI10 = '';
	  		if (data.result.realtime.air_quality.pm10 <= 50){
				air_AQI10 = '优';
			}else if(data.result.realtime.air_quality.pm10 > 50 && data.result.realtime.air_quality.pm10 <= 100){
				air_AQI10 = '良';
			}else if(data.result.realtime.air_quality.pm10 > 100 && data.result.realtime.air_quality.pm10 <= 150){
				air_AQI10 = '轻度污染';
			}else if(data.result.realtime.air_quality.pm10 > 150 && data.result.realtime.air_quality.pm10 <= 200){
				air_AQI10 = '中度污染';
			}else if(data.result.realtime.air_quality.pm10 > 200 && data.result.realtime.air_quality.pm10 <= 300){
				air_AQI10 = '重度污染';
			}else if(data.result.realtime.air_quality.pm10 > 300){
				air_AQI10 = '严重污染';
			}else{
				air_AQI10 = '这个空气质量已经超出了源哥的认知了- -！ \n';
			}
    await this.sendMarkdown(`
🌞源哥来报道天气啦！！ 🌤 

**预报地点：**<font color="info">${addr || ''}</font>

> 气温：<font color="info">${data.result.realtime.temperature}</font>℃
> 体感温度：<font color="info">${data.result.realtime.apparent_temperature}</font>℃
> 气压：<font color="info">${data.result.realtime.pressure/100}</font>hPa
> 空气质量PM2.5：<font color="info">${data.result.realtime.air_quality.pm25}μg/m³ ${air_AQI25}</font>
> 空气质量PM10：<font color="info">${data.result.realtime.air_quality.pm10}μg/m³ ${air_AQI10}</font>
> 相对湿度：<font color="info">${data.result.realtime.humidity*100}</font>%
> 风向：<font color="info">${wind_direction}</font>
> 风速：<font color="info">${wind_power}</font>

**降雨提醒：**
> <font color="warning">${data.result.minutely.description.trim()}</font>

**天气预报：**
> <font color="info">${data.result.hourly.description.trim()}</font>

${alert_md}`);
  }
}

new Plugin().run()
