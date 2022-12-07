import{_ as n,o as s,c as a,a as e}from"./app.8ecd04ca.js";const t={},i=e(`<h1 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h1><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境" aria-hidden="true">#</a> 环境</h2><h3 id="golang" tabindex="-1"><a class="header-anchor" href="#golang" aria-hidden="true">#</a> Golang</h3><p>建议版本：<strong>1.17</strong>及以上</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ go version
go version go1.17 linux/amd64
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>开启Go mod，并且不把GOPATH设置为项目目录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">GO111MODULE</span><span class="token operator">=</span>on
<span class="token builtin class-name">export</span> <span class="token assign-left variable">GOPROXY</span><span class="token operator">=</span>https://goproxy.cn,direct
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="node" tabindex="-1"><a class="header-anchor" href="#node" aria-hidden="true">#</a> Node</h3><p>没有版本要求，但也不要太低</p><h2 id="中间件集群" tabindex="-1"><a class="header-anchor" href="#中间件集群" aria-hidden="true">#</a> 中间件集群</h2><blockquote><p>这里只给出单机搭建多节点伪集群示例，生产环境应独立主机部署，或请使用Docker Swarm 或 Kubernetes 管理集群</p></blockquote><h3 id="redis集群" tabindex="-1"><a class="header-anchor" href="#redis集群" aria-hidden="true">#</a> Redis集群</h3><blockquote><p>三主三从</p></blockquote><p>创建Redis集群网络</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker network create redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建六个redis配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">rm</span> <span class="token parameter variable">-rf</span> /mydata/redis
<span class="token keyword">for</span> <span class="token for-or-select variable">port</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">seq</span> <span class="token number">1</span> <span class="token number">6</span><span class="token variable">)</span></span><span class="token punctuation">;</span>
<span class="token keyword">do</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /mydata/redis/node-<span class="token variable">\${port}</span>/conf
<span class="token function">touch</span> /mydata/redis/node-<span class="token variable">\${port}</span>/conf/redis.conf
<span class="token function">cat</span> <span class="token operator">&lt;&lt;</span>EOF<span class="token operator">&gt;&gt;</span>/mydata/redis/node-<span class="token variable">\${port}</span>/conf/redis.conf
port <span class="token number">6379</span>
requirepass <span class="token operator">&lt;</span>Password<span class="token operator">&gt;</span>
masterauth <span class="token operator">&lt;</span>Password<span class="token operator">&gt;</span>
protected-mode no
cluster-enabled <span class="token function">yes</span>
cluster-config-file nodes.conf
cluster-node-timeout <span class="token number">5000</span>
cluster-announce-ip <span class="token number">172.38</span>.0.1<span class="token variable">\${port}</span>
cluster-announce-port <span class="token number">6379</span>
cluster-announce-bus-port <span class="token number">16379</span>
appendonly <span class="token function">yes</span>
EOF
<span class="token keyword">done</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动六个redis容器</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token keyword">for</span> <span class="token for-or-select variable">port</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">seq</span> <span class="token number">1</span> <span class="token number">6</span><span class="token variable">)</span></span><span class="token punctuation">;</span>
<span class="token keyword">do</span>
<span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">637</span><span class="token variable">\${port}</span>:6379 <span class="token parameter variable">-p</span> <span class="token number">1637</span><span class="token variable">\${port}</span>:16379 <span class="token parameter variable">--name</span> redis-<span class="token variable">\${port}</span> <span class="token parameter variable">-v</span> /mydata/redis/node-<span class="token variable">\${port}</span>/data:/data <span class="token parameter variable">-v</span> /mydata/redis/node-<span class="token variable">\${port}</span>/conf/redis.conf:/etc/redis/redis.conf <span class="token parameter variable">-d</span> <span class="token parameter variable">--net</span> redis <span class="token parameter variable">--ip</span> <span class="token number">172.0</span>.0.1<span class="token variable">\${port}</span> redis:6.2.6-alpine redis-server /etc/redis/redis.conf
<span class="token keyword">done</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进入某个节点，创建集群</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker exec -it redis-6371 /bin/bash
redis-cli -a &lt;Password&gt; --cluster create ip:6371 ip:6372 ip:6373 ip:6374 ip:6375 ip:6376 --cluster-replicas 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="elasticsearch集群" tabindex="-1"><a class="header-anchor" href="#elasticsearch集群" aria-hidden="true">#</a> Elasticsearch集群</h3><blockquote><p>三节点 Elasticsearch</p></blockquote><p>docker-compose.yml</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;3&#39;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>
  <span class="token key atrule">es-master</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> elasticsearch<span class="token punctuation">:</span>7.8.0
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>master
    <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> cluster.name=elasticsearch<span class="token punctuation">-</span>cluster
      <span class="token punctuation">-</span> node.name=es<span class="token punctuation">-</span>master
      <span class="token punctuation">-</span> node.master=true
      <span class="token punctuation">-</span> node.data=true
      <span class="token punctuation">-</span> bootstrap.memory_lock=true
      <span class="token comment">#- discovery.seed_hosts=es-node1,es-node2</span>
      <span class="token punctuation">-</span> http.cors.enabled=true
      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>origin=*
      <span class="token punctuation">-</span> cluster.initial_master_nodes=es<span class="token punctuation">-</span>master<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node1<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node2
      <span class="token punctuation">-</span> <span class="token string">&quot;ES_JAVA_OPTS=-Xms64m -Xmx512m&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.ping.unicast.hosts=es-master,es-node1,es-node2&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.minimum_master_nodes=2&quot;</span>
    <span class="token key atrule">ulimits</span><span class="token punctuation">:</span>
      <span class="token key atrule">memlock</span><span class="token punctuation">:</span>
        <span class="token key atrule">soft</span><span class="token punctuation">:</span> <span class="token number">-1</span>
        <span class="token key atrule">hard</span><span class="token punctuation">:</span> <span class="token number">-1</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./es/master/data<span class="token punctuation">:</span>/usr/share/elasticsearch/data
      <span class="token punctuation">-</span> ./es/master/logs<span class="token punctuation">:</span>/usr/share/elasticsearch/logs
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 9200<span class="token punctuation">:</span><span class="token number">9200</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> elastic

  <span class="token key atrule">es-node1</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> elasticsearch<span class="token punctuation">:</span>7.8.0
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>node1
    <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> cluster.name=elasticsearch<span class="token punctuation">-</span>cluster
      <span class="token punctuation">-</span> node.name=es<span class="token punctuation">-</span>node1
      <span class="token punctuation">-</span> node.master=true
      <span class="token punctuation">-</span> node.data=true
      <span class="token punctuation">-</span> bootstrap.memory_lock=true
      <span class="token comment">#- discovery.seed_hosts=es-node1,es-node2</span>
      <span class="token punctuation">-</span> http.cors.enabled=true
      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>origin=*
      <span class="token punctuation">-</span> cluster.initial_master_nodes=es<span class="token punctuation">-</span>master<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node1<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node2
      <span class="token punctuation">-</span> <span class="token string">&quot;ES_JAVA_OPTS=-Xms64m -Xmx512m&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.ping.unicast.hosts=es-master,es-node1,es-node2&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.minimum_master_nodes=2&quot;</span>
    <span class="token key atrule">ulimits</span><span class="token punctuation">:</span>
      <span class="token key atrule">memlock</span><span class="token punctuation">:</span>
        <span class="token key atrule">soft</span><span class="token punctuation">:</span> <span class="token number">-1</span>
        <span class="token key atrule">hard</span><span class="token punctuation">:</span> <span class="token number">-1</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./es/node1/data<span class="token punctuation">:</span>/usr/share/elasticsearch/data
      <span class="token punctuation">-</span> ./es/node1/logs<span class="token punctuation">:</span>/usr/share/elasticsearch/logs
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 9201<span class="token punctuation">:</span><span class="token number">9200</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> elastic
      
  <span class="token key atrule">es-node2</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> elasticsearch<span class="token punctuation">:</span>7.8.0
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> es<span class="token punctuation">-</span>node2
    <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> cluster.name=elasticsearch<span class="token punctuation">-</span>cluster
      <span class="token punctuation">-</span> node.name=es<span class="token punctuation">-</span>node2
      <span class="token punctuation">-</span> node.master=true
      <span class="token punctuation">-</span> node.data=true
      <span class="token punctuation">-</span> bootstrap.memory_lock=true
      <span class="token comment">#- discovery.seed_hosts=es-node1,es-node2</span>
      <span class="token punctuation">-</span> http.cors.enabled=true
      <span class="token punctuation">-</span> http.cors.allow<span class="token punctuation">-</span>origin=*
      <span class="token punctuation">-</span> cluster.initial_master_nodes=es<span class="token punctuation">-</span>master<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node1<span class="token punctuation">,</span>es<span class="token punctuation">-</span>node2
      <span class="token punctuation">-</span> <span class="token string">&quot;ES_JAVA_OPTS=-Xms64m -Xmx512m&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.ping.unicast.hosts=es-master,es-node1,es-node2&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;discovery.zen.minimum_master_nodes=2&quot;</span>
    <span class="token key atrule">ulimits</span><span class="token punctuation">:</span>
      <span class="token key atrule">memlock</span><span class="token punctuation">:</span>
        <span class="token key atrule">soft</span><span class="token punctuation">:</span> <span class="token number">-1</span>
        <span class="token key atrule">hard</span><span class="token punctuation">:</span> <span class="token number">-1</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./es/node2/data<span class="token punctuation">:</span>/usr/share/elasticsearch/data
      <span class="token punctuation">-</span> ./es/node2/logs<span class="token punctuation">:</span>/usr/share/elasticsearch/logs
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> 9202<span class="token punctuation">:</span><span class="token number">9200</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> elastic
      
<span class="token key atrule">networks</span><span class="token punctuation">:</span> 
   <span class="token key atrule">elastic</span><span class="token punctuation">:</span>
      <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编排服务</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span> es-master es-node1 es-node2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="mysql集群" tabindex="-1"><a class="header-anchor" href="#mysql集群" aria-hidden="true">#</a> MySQL集群</h3><blockquote><p>时间不充裕，等mysql兜底做了再补充</p></blockquote><h2 id="设置环境变量" tabindex="-1"><a class="header-anchor" href="#设置环境变量" aria-hidden="true">#</a> 设置环境变量</h2><p>参照以下格式分别export：<strong>Elasticsearch集群连接URL</strong>、<strong>Redis集群连接URL</strong>、<strong>Redis密码</strong>、<strong>MySQL集群连接URL、指定日志输出目录</strong></p><blockquote><p>其中日志目录需要在系统提前创建</p></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Elasticsearch</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">ES_SERVER</span><span class="token operator">=</span><span class="token number">127.0</span>.0.1:9200,127.0.0.1:9201,127.0.0.1:9202

<span class="token comment"># Redis</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">REDIS_CLUSTER</span><span class="token operator">=</span><span class="token number">127.0</span>.0.1:6371,127.0.0.1:6372,127.0.0.1:6373,127.0.0.1:6374,127.0.0.1:6375,127.0.0.1:6376
<span class="token builtin class-name">export</span> <span class="token assign-left variable">REDIS_PASSWORD</span><span class="token operator">=</span>XXXXXX

<span class="token comment"># MySQL</span>
<span class="token builtin class-name">export</span> 

<span class="token comment"># 日志输出目录</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">LOG_DIRECTORY</span><span class="token operator">=</span>/tmp/log/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,33),l=[i];function p(c,o){return s(),a("div",null,l)}const u=n(t,[["render",p],["__file","preparation.html.vue"]]);export{u as default};
