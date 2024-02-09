import{m as f,r as c,j as a,a1 as y,q as d,s as p,t as b,a2 as w,a3 as P,a4 as C,a5 as W,a6 as J,a7 as M,a8 as B,a9 as A,aa as T,ab as N,ac as D,ad as R,ae as v,af as _,ag as H,ah as O,ai as F,aj as E,ak as G,a as $,T as x,al as j,u as q,n as I,am as z,an as U,ao as K,W as Q,ap as V,aq as X,ar as Y,as as Z,at as L,au as ee}from"./index.7dbc0443.js";import{r as ae,g as oe,a as te,b as ne,u as se,c as ie}from"./useSocket.cdc27e0e.js";import{L as re}from"./Loader.0a538e2e.js";import{F as ce}from"./FullNameField.cece0c7a.js";import{S as le}from"./StarRating.975d97ef.js";import{A as de}from"./AcceptRating.b9c38b19.js";import{g as pe}from"./providerHelpers.5b5f7e8f.js";import{p as me}from"./ProviderUtils.bb7ae9a5.js";import{J as ue}from"./JobStatusChip.517f8023.js";const ge=({provider:e})=>{const t=fe(),o=c.exports.useMemo(()=>({lat:e.lastProviderLocation.latitude,lng:e.lastProviderLocation.longitude}),[e.lastProviderLocation.latitude,e.lastProviderLocation.longitude]);return a(y,{position:o,children:d(p,{display:"flex",alignItems:"center",children:[a(ce,{providerFullName:e.name,providerStatus:pe(e.online,e.onJob)}),a(le,{className:t.stats,value:e.rating}),a(de,{className:t.stats,value:e.acceptedRate})]})})},fe=f(()=>({stats:{padding:`0 ${b.spacing(.5)}px`}})),he="/assets/whiteCarIcon.8eb3889a.png",xe=({provider:e,onClick:t})=>{const o=r=>r===me[0].name?he:oe,s=e.online?o(e.type):ae,i=c.exports.useMemo(()=>({lat:e.lastProviderLocation.latitude,lng:e.lastProviderLocation.longitude}),[e.lastProviderLocation.longitude,e.lastProviderLocation.latitude]);return a(w,{position:i,icon:{url:s,anchor:new google.maps.Point(22,22),scaledSize:new google.maps.Size(45,45)},onClick:t})},Ie=[{id:0,name:"Battery replacement",icon:P},{id:1,name:"Belt replace",icon:C},{id:2,name:"Brake air line",icon:W},{id:3,name:"Brake chamber",icon:J},{id:4,name:"Dot inspection",icon:M},{id:5,name:"Engine failure",icon:B},{id:6,name:"Generic",icon:A},{id:7,name:"Jumpstart",icon:T},{id:8,name:"Lockout",icon:N},{id:9,name:"Oil leak",icon:D},{id:10,name:"Out of DEF",icon:R},{id:11,name:"Out of fuel",icon:v},{id:12,name:"Refrigeration",icon:_},{id:13,name:"Tire replace - has tire",icon:H},{id:14,name:"Tire replace - needs tire",icon:O},{id:15,name:"Towing",icon:F},{id:16,name:"Trailer failure",icon:E},{id:17,name:"Unknown",icon:G}],Le=({job:e,onClick:t,selectedJob:o})=>{var i;const s=new google.maps.LatLng(e.locationLatitude,e.locationLongitude);return a(y,{position:s,children:d(p,{display:"flex",maxHeight:"30px",overflow:"hidden",alignItems:"center",onClick:t,children:[Ie[(i=e.service)==null?void 0:i.name]||a(v,{}),o&&o.id===e.id?a(ye,{job:e}):a(be,{job:e})]})})},ye=({job:e})=>{const t=k();return d(p,{display:"flex",alignItems:"center",ml:1.5,children:[a(ue,{status:e.status}),d(p,{ml:1.5,display:"flex",flexDirection:"column",alignItems:"flex-start",children:[a(x,{variant:"subtitle2",style:{lineHeight:"inherit"},children:e.serviceName}),a(x,{variant:"caption",className:t.jobAddress,children:e.locationAddress})]})]})},be=({job:e})=>{const t=k(),o=j.find(s=>s.id===e.status);return a("span",{className:t.dot,style:{background:o==null?void 0:o.color}})},k=f({dot:{height:"12px",width:"12px",borderRadius:"100%",border:`3px solid ${$.catskillWhite}`,display:"inline-block",marginLeft:b.spacing(1),alignSelf:"center"},jobAddress:{overflow:"hidden",height:"14px",maxWidth:"200px"}}),ve={flexGrow:1},ke=({zoom:e,center:t})=>{const o=q(),s=I(te),i=I(ne);c.exports.useEffect(()=>{o(z()),o(U())},[]),se({subcsribtions:{"/notifications/providers/update":n=>{o(X(JSON.parse(n.body)))},"/notifications/jobs/update":n=>{o(Y(JSON.parse(n.body)))}}});const{isLoaded:r,loadError:m}=K(),[l,u]=c.exports.useState(null),[g,h]=c.exports.useState(null),S=c.exports.useMemo(()=>({zoom:e,center:t,scaleControl:!0}),[e,t]);return m?a(Q,{children:"An error occured when loading maps"}):r?d(V,{mapContainerStyle:ve,options:S,onClick:()=>{u(null),h(null)},children:[s.map(n=>a(xe,{provider:n,onClick:()=>u(n)},n.id)),i.map(n=>a(Le,{job:n,onClick:()=>h(n),selectedJob:g},n.id)),l&&a(ge,{provider:l})]}):a(re,{text:"Loading maps..."})},Se="_locationsWrapper_kx1xj_1",we="_locationsHeaderWrapper_kx1xj_6",Pe="_locationsMainWrapper_kx1xj_20",Ce={locationsWrapper:Se,locationsHeaderWrapper:we,locationsMainWrapper:Pe},We=f(({spacing:e,palette:t})=>({pageWrapper:{display:"flex",flexDirection:"column",height:"100vh"},formControl:{width:250},icon:{right:15},pageHeader:{display:"flex",justifyContent:"space-between",paddingTop:e(6),paddingBottom:e(3),paddingLeft:e(3),paddingRight:e(3),borderBottom:Z,background:t.common.white},pageContent:{display:"flex",height:"100%",overflow:"scroll","& div.gm-style-iw":{border:L},"& button.gm-ui-hover-effect":{display:"none !important"},"& .gm-style-iw-t::after":{border:L,background:t.common.white,borderTop:0,borderRight:0}},select:{minWidth:"266px",marginRight:e(3),"& svg":{color:t.primary.main}}}));function He(){const[e,t]=c.exports.useState(null),[o,s]=c.exports.useState(null),{serviceAreas:i}=ie(),r=i.find(g=>g.id===e);let m=5;r?m=9:o&&(m=15);let l={lat:37.0902,lng:-95.7129};r?l={lat:r.latitude,lng:r.longitude}:o&&(l=o);const u=We();return d("div",{className:Ce.locationsWrapper,children:[a(p,{className:u.pageHeader,children:a(ee,{children:"Map"})}),a(p,{className:u.pageContent,children:a(ke,{zoom:m,center:l})})]})}export{He as default};
