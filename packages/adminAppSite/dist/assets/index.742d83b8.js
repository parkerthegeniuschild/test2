import{u as _,n as b,ce as w,cf as A,r as s,dg as B,cg as H,q as o,s as j,j as e,aF as V,R as D,aG as F,aH as p,aI as m,a$ as O,b0 as k,b1 as q,b2 as z,aR as G,aK as f,aL as S,aV as K,m as M,bw as U}from"./index.7dbc0443.js";import{L as W}from"./ListTableHead.a21a00e3.js";import{d as $}from"./PaginationSettings.bf52303d.js";const J={label:"Services",singular:"Service"},T=[{id:"name",label:"Name"},{id:"min_hours",label:"Minimum hours"}],Q=M(()=>U({wrapper:{display:"flex",flexDirection:"column",minHeight:"100%"},noResults:{textAlign:"center"}}));function ee(){const d=Q(),h=_(),i=b(w),x=b(A),[n,L]=s.exports.useState([]),[u,C]=s.exports.useState(0),[r,y]=s.exports.useState({order:B.ASC,orderBy:"name"}),[c,R]=s.exports.useState($),[g,E]=s.exports.useState({active:0,inactive:0}),I=t=>{C(t),v(t)},v=t=>{const a=i.filter(l=>{const P=!t;return l.is_active===P});L(a)},N=()=>{const t=i.filter(l=>l.is_active).length,a=i.length-t;E({active:t,inactive:a})};return s.exports.useEffect(()=>{h(H({...c,sort:r.orderBy,order:r.order}))},[h,c,r]),s.exports.useEffect(()=>{v(u),N()},[i]),o(j,{className:d.wrapper,children:[e(V,{options:J,basePath:D.SERVICES,children:o(F,{value:u,onChange:(t,a)=>I(a),children:[e(p,{label:e(m,{text:"Active",total:g.active}),value:0}),e(p,{label:e(m,{text:"Inactive",total:g.inactive}),value:1})]})}),e(O,{children:x?e(k,{}):e(q,{children:o(z,{children:[e(W,{sortSettings:r,onSortSettingsChange:y,headCells:T}),e(G,{children:n.length?n.map(t=>o(f,{className:"table-row",children:[e(S,{children:t.name}),e(S,{children:t.min_hours})]},t.id)):e(f,{children:e(S,{className:d.noResults,colSpan:T.length,children:"No results"})})})]})})}),n.length>c.size&&e(K,{count:n.length,paginationSettings:c,onPaginationSettingsChange:R})]})}export{ee as default};
