import{_ as e,r as p,o as i,c as t,b as a,d as n,e as l,a as r}from"./app.ddc13804.js";const o={},c=r(`<h1 id="部署服务" tabindex="-1"><a class="header-anchor" href="#部署服务" aria-hidden="true">#</a> 部署服务</h1><h2 id="服务端" tabindex="-1"><a class="header-anchor" href="#服务端" aria-hidden="true">#</a> 服务端</h2><blockquote><p>务必：dataServer数据服务节点务必启动6个节点及以上</p><p>建议：apiServer接口服务节点建议启动2个节点以上并设置负载均衡</p></blockquote><p>Git克隆源码</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>进入项目根目录下，创建初始化脚本和启动项目脚本</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> oss
<span class="token function">touch</span> init.sh
<span class="token function">touch</span> start.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>init.sh初始化脚本示例如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
go build <span class="token parameter variable">-o</span> apiServer apiServer/apiServer.go
go build <span class="token parameter variable">-o</span> dataServer dataServer/dataServer.go
go build <span class="token parameter variable">-o</span> deleteOldMetadata deleteOldMetadata/deleteOldMetadata.go
go build <span class="token parameter variable">-o</span> deleteOrphanObject deleteOrphanObject/deleteOrphanObject.go
go build <span class="token parameter variable">-o</span> objectScanner objectScanner/objectScanner.go

<span class="token comment">#关闭服务</span>
<span class="token function">killall</span> apiServer
<span class="token function">killall</span> dataServer

<span class="token function">chmod</span> <span class="token number">777</span> apiServer/apiServer
<span class="token function">chmod</span> <span class="token number">777</span> dataServer/dataServer
<span class="token function">chmod</span> <span class="token number">777</span> deleteOldMetadata/deleteOldMetadata
<span class="token function">chmod</span> <span class="token number">777</span> deleteOrphanObject/deleteOrphanObject
<span class="token function">chmod</span> <span class="token number">777</span> objectScanner/objectScanner
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动项目脚本示例如下（因为数据服务最低要求为6个节点，而我这里只在一台机器上运行，所以使用使用1～6数字创建目录）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">\`</span><span class="token function">seq</span> <span class="token number">1</span> <span class="token number">6</span><span class="token variable">\`</span></span>
<span class="token keyword">do</span>
    <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /tmp/<span class="token variable">$i</span>/objects
    <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /tmp/<span class="token variable">$i</span>/temp
    <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /tmp/<span class="token variable">$i</span>/garbage
    <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /tmp/<span class="token variable">$i</span>/objects/*
    <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /tmp/<span class="token variable">$i</span>/temp/*
    <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /tmp/<span class="token variable">$i</span>/garbage/*
<span class="token keyword">done</span>

<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.1:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/1 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.2:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/2 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.3:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/3 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.4:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/4 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.5:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/5 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.1.6:12345 <span class="token assign-left variable">STORAGE_ROOT</span><span class="token operator">=</span>/tmp/6 ./<span class="token variable">$1</span>/dataServer/dataServer <span class="token operator">&amp;</span>

<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.2.1:12345 ./<span class="token variable">$1</span>/apiServer/apiServer <span class="token operator">&amp;</span>
<span class="token assign-left variable">LISTEN_ADDRESS</span><span class="token operator">=</span><span class="token number">10.29</span>.2.2:12345 ./<span class="token variable">$1</span>/apiServer/apiServer <span class="token operator">&amp;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>LISTEN_ADDRESS指定服务所在的IP，STORAGE_ROOT指定对象存储的位置，需要提前objects、temp、garbage创建目录</p></blockquote><p>Nginx <strong>负载均衡</strong>示例，值得注意的是，项目中存在HEAD请求，Nginx会将head请求以get请求的方式发送给上游服务器，以下示例前三行解决了这个问题：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>proxy_cache_convert_head off<span class="token punctuation">;</span>
proxy_cache_methods GET HEAD<span class="token punctuation">;</span>
proxy_cache_key <span class="token variable">$scheme</span><span class="token variable">$request_method</span><span class="token variable">$proxy_host</span><span class="token variable">$request_uri</span><span class="token punctuation">;</span>

upstream ossApiServer <span class="token punctuation">{</span> // apiServer接口服务地址
	<span class="token punctuation">..</span>.
	server ip:port<span class="token punctuation">;</span>
	server ip:port<span class="token punctuation">;</span>
	server ip:port<span class="token punctuation">;</span>
	<span class="token punctuation">..</span>.
<span class="token punctuation">}</span>

server <span class="token punctuation">{</span>
	<span class="token punctuation">..</span>.
	listen       port<span class="token punctuation">;</span>
	server_name  ip:port<span class="token punctuation">;</span>

	location / <span class="token punctuation">{</span>
		proxy_pass http://ossApiServer<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
	<span class="token punctuation">..</span>.
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果您追求更加高可用的策略，或可以选择其它，例如 OpenResty+Keepalived</p><h2 id="客户端" tabindex="-1"><a class="header-anchor" href="#客户端" aria-hidden="true">#</a> 客户端</h2><p>Git克隆源码</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> clone
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改项目根目录下vue.config.js中关于接口地址等信息，如果您在之前设置了负载均衡策略，请将target改为反向代理的地址</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
	<span class="token operator">...</span>
    <span class="token literal-property property">devServer</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">disableHostCheck</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token literal-property property">host</span><span class="token operator">:</span> <span class="token string">&#39;域名&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">port</span><span class="token operator">:</span> 端口<span class="token punctuation">,</span>
        <span class="token literal-property property">proxy</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&#39;/api&#39;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&#39;后端接口Base Url&#39;</span><span class="token punctuation">,</span>
                <span class="token literal-property property">secure</span><span class="token operator">:</span><span class="token boolean">false</span><span class="token punctuation">,</span>
                <span class="token literal-property property">changeOrigin</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
                <span class="token literal-property property">pathRewrite</span><span class="token operator">:</span><span class="token punctuation">{</span>
                    <span class="token string-property property">&quot;^/api&quot;</span><span class="token operator">:</span><span class="token string">&quot;&quot;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>项目根目录下执行，启动项目</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span>
<span class="token function">npm</span> run serve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>打包vue项目</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">npm</span> run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Nginx跨域配置示例，<code>location /apis/ { ... }</code>为反向代理，将<code>ApiServer_URL</code>替换为接口地址</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>server
<span class="token punctuation">{</span>
    listen <span class="token number">80</span><span class="token punctuation">;</span>
    server_name lploss.cn<span class="token punctuation">;</span>
    index index.php index.html index.htm default.php default.htm default.html<span class="token punctuation">;</span>
    root /www/wwwroot/lploss.cn<span class="token punctuation">;</span>
    
    try_files <span class="token variable">$uri</span> <span class="token variable">$uri</span>/ /index.html<span class="token punctuation">;</span>
  
    <span class="token comment"># 反向代理</span>
    location /apis/ <span class="token punctuation">{</span>
        proxy_pass ApiServer_URL<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token punctuation">..</span>.
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,26),d=a("code",null,"try_files $uri $uri/ /index.html;",-1),v={href:"https://developer-help.cn/index.php/archives/17/",target:"_blank",rel:"noopener noreferrer"};function u(b,m){const s=p("ExternalLinkIcon");return i(),t("div",null,[c,a("p",null,[n("另外上述示例中"),d,n("一行解决了vue-router中使用history模式导致刷新页面404状态码的问题，如果是您使用Tomact部署，解决此问题请移步："),a("a",v,[n("Vue项目部署服务器后刷新页面报404"),l(s)])])])}const h=e(o,[["render",u],["__file","deploy.html.vue"]]);export{h as default};
