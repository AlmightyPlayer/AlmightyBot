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
	
	// 判断是否是多gps、获取api、缓存api数据
	async run () {
		// 判断是否是多gps
		const _gps = this.GPS.split('|');
		_gps.map(async gps => {
			const tmp = gps.split('@');
			//对接weatherAPI接口
			const api = `https://api.caiyunapp.com/v2.5/${this.API_KEY}/${tmp[0]}/weather.json?alert=true`;
			//获取weather.json内的API信息写入data中
			await axios.get(api).then(async res => {
				const { data } = res;
				await this._sendData(data, tmp[1]);
			})
		});

		//预警信息+风力判断+风向判断
		async _sendData (data, addr = '') {
			// 预警信息
			let alert_md = '';
			if (data.result.alert.content.length > 0) {
				alert_md += '⏰ 预警信息 ⏰ \n';
				data.result.alert.content.map(a => {
					alert_md += `**${a.title}**\n> <font color="comment">${a.description}</font>\n\n`;
				});
			};
			// 风力判断
			var wind_power = '';
			if (data.result.realtime.wind.speed <= 1) {
				wind_power = '0 级无风 \n';
			}else if(data.result.realtime.wind.speed > 1 and $data.result.realtime.wind.speed <= 5){
				wind_power = '1 级微风徐徐 \n';
			}else if(data.result.realtime.wind.speed > 5 and data.result.realtime.wind.speed <= 11){
				wind_power = '2 级清风 \n';
			}else if(data.result.realtime.wind.speed > 11 and data.result.realtime.wind.speed <= 19){
				wind_power = '3 级树叶摇摆 \n';
			}else if(data.result.realtime.wind.speed > 19 and data.result.realtime.wind.speed <= 28){
				wind_power = '4 级树枝摇动 \n';
			}else if(data.result.realtime.wind.speed > 28 and data.result.realtime.wind.speed <= 38){
				wind_power = '5 级风力强劲 \n';
			}else if(data.result.realtime.wind.speed > 38 and data.result.realtime.wind.speed <= 49){
				wind_power = '6 级风力强劲 \n';
			}else if(data.result.realtime.wind.speed > 49 and data.result.realtime.wind.speed <= 61){
				wind_power = '7 级风力超强 \n';
			}else if(data.result.realtime.wind.speed > 61 and data.result.realtime.wind.speed <= 74){
				wind_power = '8 级狂风大作 \n';
			}else if(data.result.realtime.wind.speed > 74 and data.result.realtime.wind.speed <= 88){
				wind_power = '9 级狂风呼啸 \n';
			}else if(data.result.realtime.wind.speed > 88 and data.result.realtime.wind.speed <= 102){
				wind_power = '10 级暴风毁树 \n';
			}else if(data.result.realtime.wind.speed > 102 and data.result.realtime.wind.speed <= 117){
				wind_power = '11 级暴风毁树 \n';
			}else if(data.result.realtime.wind.speed > 117 and data.result.realtime.wind.speed <= 133){
				wind_power += '12 级飓风 \n';
			}else if(data.result.realtime.wind.speed > 133 and data.result.realtime.wind.speed <= 149){
				wind_power = '13 级台风 \n';
			}else if(data.result.realtime.wind.speed > 149 and data.result.realtime.wind.speed <= 166){
				wind_power = '14 级强台风 \n';
			}else if(data.result.realtime.wind.speed > 166 and data.result.realtime.wind.speed <= 183){
				wind_power = '15 级强台风 \n';
			}else if(data.result.realtime.wind.speed > 183 and data.result.realtime.wind.speed <= 201){
				wind_power = '16 级超强台风 \n';
			}else if(data.result.realtime.wind.speed > 201 and data.result.realtime.wind.speed <= 220){
				wind_power = '17 级超强台风 \n';
			}else{
				wind_power = '这个风力已经超出了源哥的认知- -！ \n';
			};
			// 风向判断
			var wind_direction = '';
			if (data.result.realtime.wind.direction >= 348.76 or data.result.realtime.wind.direction <= 11.25){
				wind_direction = '北风 \n';
			}else if(data.result.realtime.wind.direction > 11.25 and data.result.realtime.wind.direction <= 33.75){
				wind_direction = '北东北 \n';
			}else if(data.result.realtime.wind.direction > 33.75 and data.result.realtime.wind.direction <= 56.25){
				wind_direction = '东北 \n';
			}else if(data.result.realtime.wind.direction > 56.25 and data.result.realtime.wind.direction <= 78.75){
				wind_direction = '东东北 \n';
			}else if(data.result.realtime.wind.direction > 78.75 and data.result.realtime.wind.direction <= 101.25){
				wind_direction = '东 \n';
			}else if(data.result.realtime.wind.direction > 101.25 and data.result.realtime.wind.direction <= 123.75){
				wind_direction = '东东南 \n';
			}else if(data.result.realtime.wind.direction > 123.75 and data.result.realtime.wind.direction <= 146.25){
				wind_direction = '东南 \n';
			}else if(data.result.realtime.wind.direction > 146.25 and data.result.realtime.wind.direction <= 168.75){
				wind_direction = '南东南 \n';
			}else if(data.result.realtime.wind.direction > 168.75 and data.result.realtime.wind.direction <= 191.25){
				wind_direction = '南 \n';
			}else if(data.result.realtime.wind.direction > 191.25 and data.result.realtime.wind.direction <= 213.75){
				wind_direction = '南西南 \n';
			}else if(data.result.realtime.wind.direction > 213.75 and data.result.realtime.wind.direction <= 236.25){
				wind_direction = '西南 \n';
			}else if(data.result.realtime.wind.direction > 236.25 and data.result.realtime.wind.direction <= 258.75){
				wind_direction = '西西南 \n';
			}else if(data.result.realtime.wind.direction > 258.75 and data.result.realtime.wind.direction <= 281.25){
				wind_direction = '西 \n';
			}else if(data.result.realtime.wind.direction > 281.25 and data.result.realtime.wind.direction <= 303.75){
				wind_direction = '西西北 \n';
			}else if(data.result.realtime.wind.direction > 303.75 and data.result.realtime.wind.direction <= 328.25){
				wind_direction = '西北 \n';
			}else if(data.result.realtime.wind.direction > 326.25 and data.result.realtime.wind.direction <= 348.75){
				wind_direction = '北西北 \n';
			}else{
				wind_direction = '这个风向已经超出了源哥的认知- -！ \n';
			};
		};
	
		await this.sendMarkdown(`
		**🌞源哥来报道！！**
		> 预报地点：<font color="info">${addr || ''}</font>
		> 气温：<font color="info">${data.result.realtime.temperature}</font>℃
		> 体感温度：<font color="info">${data.result.realtime.apparent_temperature}</font>℃
		> 气压：<font color="info">${data.result.realtime.pressure}/100</font>hPa
		> 空气质量（PM2.5）：<font color="info">${data.result.realtime.air_quality.pm25}</font>
		> (PM2.5是指大气中直径小于或等于2.5微米的颗粒物，也称为可入肺颗粒物。被吸入人体后会直接进入支气管，干扰肺部的气体交换，引发包括哮喘、支气管炎和心血管病等方面的疾病。)
		> 空气质量（PM10）：<font color="info">${data.result.realtime.air_quality.pm10}</font>
		> (PM10是直径小于等于10微米的可吸入颗粒物，能够进入上呼吸道，但部分可通过痰液等排出体外，另外也会被鼻腔内部的绒毛阻挡，对人体健康危害相对较小。)
		> 相对湿度：<font color="info">${data.result.realtime.humidity}*100</font>%
		> 风向：<font color="info">${wind_direction}</font>
		> 风速：<font color="info">${wind_power}</font>
	
		**降雨提醒：**
		> <font color="warning">${data.result.minutely.description.trim()}</font>
	
		**天气预报：**
		> <font color="info">${data.result.hourly.description.trim()}</font>
	
		${alert_md}`);
	};
};

new Plugin().run()
