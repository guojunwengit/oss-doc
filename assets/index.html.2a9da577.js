import{_ as e,o as r,c as o,a}from"./app.ddc13804.js";const c={},d=a('<h1 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h1><h2 id="为什么中间件要使用集群" tabindex="-1"><a class="header-anchor" href="#为什么中间件要使用集群" aria-hidden="true">#</a> 为什么中间件要使用集群？</h2><p>随着业务量的变大，虽然对象存储服务端通过一系列手段让其实现了高可用和可扩展性，但其使用的中间件，如MQ、Redis、ES、MongoDB等发生单点故障，依旧会影响到整个系统的高可用性，因此需要使用集群的方式。</p><h2 id="对象存储服务为什么采用源码编译的方式而不使用docker" tabindex="-1"><a class="header-anchor" href="#对象存储服务为什么采用源码编译的方式而不使用docker" aria-hidden="true">#</a> 对象存储服务为什么采用源码编译的方式而不使用Docker？</h2><p>Docker 有很多优点。它作为轻量级、便携和自给自足的容器化工具打包、发布和运行应用程序。Docker 非常适合各种规模的企业。当你在一个小团队中处理一段代码时，它消除了“但它在我的机器上工作”的问题。同时，企业可以使用 Docker 构建敏捷软件交付管道，以更快、更安全地发布新功能。</p><p>Docker 改变了游戏规则。但这不是一个万能的解决方案，</p><p>凭借其内置的容器化系统，Docker 是一款出色的云计算工具。反过来，Docker Swarm 推进了集群化和去中心化设计。但仍然有几种情况不使用 Docker，其中一点为：</p><p><strong><code>如果您有大量有价值的数据要存储，请不要使用 Docker</code></strong></p><p>按照设计，所有 Docker 文件都在容器内创建并存储在可写容器层上。如果不同的进程需要数据，可能很难从容器中检索数据。此外，容器的可写层连接到运行容器的主机。如果您需要将数据移动到其他地方，这将无法轻松完成。不仅如此，一旦容器关闭，存储在容器内的所有数据都将永远丢失。所以必须首先考虑将数据保存在其他地方的方法。为了保证 Docker 中的数据安全，需要使用一个额外的工具——Docker Data Volumes。然而，这个解决方案仍然很笨拙，需要改进。</p>',9),t=[d];function n(s,h){return r(),o("div",null,t)}const k=e(c,[["render",n],["__file","index.html.vue"]]);export{k as default};