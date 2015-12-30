define(["utils/doT","utils/utils"],function(e,t){var n={data:"",container:null,headings:[],init:function(e){return t.extend(this,e),this.headings.length||this.getHeadings(),this.render(),this},render:function(){var e;return e=this.translateTemplate(),this.container.innerHTML=e,this},getHeadings:function(){var e,t,n,r,i,s;s=this.headings,e=this.container.getElementsByTagName("span");for(t=0,n=e.length;t<n;t++)r=e[t].getAttribute("colId"),i=e[t].innerHTML,s.push({colId:r,colName:i});return s},getData:function(){var e,n,r,i,s,o,u,a;return e=this.headings,s=e[0].colId,r=[],n={array:r},t.each(this.data,function(t,n){o={},i=n[s];for(var f=1,l=e.length;f<l;f++)u=e[f].colId,a=e[f].colName,o[a]=n[u]||"";r.push({title:i,data:o})}),n},translateTemplate:function(){var t,n,r;return n=this.template.node,r=this.getData(),t=e.template(n)(r),t}};return n.template={},n.template.container='<div class="flow-container">${_data}</div>',n.template.node='{{~it.array:value:index}}<div class="flow-node {{? index === 0 }}flow-node-start {{?}}{{? index % 3 === 2 && index !== it.array.length - 1 }}flow-corner {{?}}{{? index === it.array.length - 1 }}flow-node-end {{?}}{{? index % 6 === 3 || index % 6 === 4 || index % 6 === 5  }}flow-node-left {{?}}">    <div class="line"><b class="line-anchor"></b><b class="line-anchor-end"></b> </div>    <div class="desc mod">        <b class="left-top"></b> <b class="right-top"></b> <b class="left-bottom"></b> <b class="right-bottom"></b>        <div class="desc-body">            <h3 class="desc-heading">{{= value.title }}</h3>            <div class="desc-cont">            <table>            {{ for(var prop in value.data ) { }}            <tr> <td><b>：</b>{{= prop }}</td> <td>{{= value.data[prop] }}</td> </tr>            {{ } }}            </table>            </div>        </div>    </div></div>{{~}}<div class="clear"></div>    ',n});