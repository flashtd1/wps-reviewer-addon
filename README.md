# wps-文字审校插件

## WPS配置
如果是发布的话，需要提前在客户机的wps中配置oem.ini，将插件下载地址配置在里面
找到WPS的安装目录，在目录中找oem.ini
文件内容做修改如下
```ini
[Support]
JsApiPlugin=true
JsApiShowWebDebugger=true

[Server]
JSPluginsServer=wps-reviewer-addon.flashtd1.com
```
* Support部分，JsApiPlugin是允许使用插件
* Support部分，JsApiShowWebDebugger是开启插件的调试窗口，如果是发布就不要配置这个了
* Server部分，JSPluginsServer是配置插件的下载地址，jsplugins.xml文件要上传到这个地址中，本案例是wps-reviewer-addon.flashtd1.com
其他部分不变，如果有多个jSPluginsServer，暂时不知道怎么办，咨询官方
## 开发
基于vue模板

## 调试
```bash
npx wpsjs debug
```

## 构建
```bash
npx wpsjs build
```

## 发布
默认将wps-addon-build目录发布到配置的oss上，包含jsplugins.xml内容
```bash
node deploy
```
