import{m as N,f as c,bU as g,h as F,n as y,dr as b,r as h,q as n,s as o,j as t,x as V,R as v,T as s,t as m,aE as _,aM as j,aN as T,aO as O,ds as q,B as M,z as U,aQ as W,dt as G,ci as Q,cc as X,u as J,du as K,aX as Y,dv as Z,dw as ee,dx as te,W as ae,dy as re}from"./index.7dbc0443.js";import{F as oe,a as ie}from"./formik.esm.234da5ff.js";import{d as ne,I as x,F as le,a as se,B as E}from"./BottomToolbar.bfb33ce5.js";import{p as P}from"./ProviderUtils.bb7ae9a5.js";import{a as D}from"./providerHelpers.5b5f7e8f.js";import{S as ce}from"./StarRating.975d97ef.js";import{A as pe}from"./AcceptRating.b9c38b19.js";import{P as de,A as ue,S as me,C,v as R}from"./validateCurrencyInput.3f52639a.js";import{L}from"./Loader.0a538e2e.js";import{b as he}from"./timeHelpers.676cc127.js";import"./CancelButton.eb23fad0.js";import"./InputAdornment.5cdc5874.js";const f=N(e=>({wrapper:{backgroundColor:e.palette.common.white},avatarWrapper:{borderLeft:`1px solid ${e.palette.primary.light}`},name:{fontSize:c.size.semiLarge,fontWeight:c.weight.extraBold,textAlign:"center",marginBottom:"16px",lineHeight:"24px"},paragraph:{color:e.palette.secondary.light,textAlign:"center",marginBottom:"14px"},chartsWrapper:{borderBottom:`1px solid ${e.palette.primary.light}`},icon:{height:"16px",width:"16px"},ratings:{fontFamily:e.typography.fontFamily,fontWeight:c.weight.bold,border:0},payoutsWrapper:{display:"flex",borderBottom:g,padding:`0 ${e.spacing(4)}px ${e.spacing(2)}px ${e.spacing(4)}px`},approval:{flexGrow:1,color:e.palette.primary.main,fontStyle:"italic"},balance:{color:e.palette.primary.main,fontWeight:c.weight.semiBold,marginLeft:e.spacing(4)},payoutItem:{display:"flex",flexBasis:1,padding:`${e.spacing(2)}px ${e.spacing(4)}px`}})),fe=({provider:e})=>{const a=f(),r=F(),i=y(b),l=h.exports.useMemo(()=>P.find(p=>(i==null?void 0:i.type)===p.name),[e]);return n(o,{pt:"52px",pl:3,pb:"20",display:"flex",alignItems:"center",className:a.wrapper,children:[t(V,{"aria-label":"go back",style:{marginLeft:"-12px"},onClick:()=>r.push(v.PROVIDERS),children:t(ne,{color:"primary",style:{border:"2px solid #00CC66",borderRadius:"100%"}})}),n(o,{display:"flex",px:1,className:a.avatarWrapper,alignItems:"center",children:[t(o,{mx:1,children:t(s,{variant:"h5",style:{fontWeight:c.weight.bold},children:D(e)})}),t(o,{borderLeft:`1px solid ${m.palette.primary.light}`,pl:1,ml:1,children:t(_,{label:l==null?void 0:l.name,style:{fontSize:c.size.regular,height:"20px",background:l==null?void 0:l.color}})})]})]})},ge=e=>t(o,{p:3,children:e.children});var I={},ye=T.exports,xe=O.exports;Object.defineProperty(I,"__esModule",{value:!0});var A=I.default=void 0,ve=xe(h.exports),be=ye(j()),Pe=(0,be.default)(ve.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");A=I.default=Pe;const Ie=e=>t(o,{display:"flex",justifyContent:"center",py:2,px:2,borderBottom:g,borderTop:g,children:e.children}),w=e=>t(o,{px:2,borderRight:`1px solid ${m.palette.primary.light}`,display:"flex",alignItems:"center",justifyContent:"space-between",style:e.style,className:e.className,children:e.children}),Be=({isBlocked:e,withLabel:a})=>n(o,{display:"flex",alignItems:"center",children:[t(q,{style:{color:e?m.palette.primary.light:m.palette.primary.main}}),a&&t(s,{variant:"overline",style:{marginLeft:m.spacing(1),fontWeight:c.weight.extraBold,fontSize:c.size.regular,lineHeight:"16px"},children:e?"unapproved":"approved"})]}),H=({title:e,text:a,icon:r,href:i,buttonText:l})=>{const p=$e();return n(o,{p:2,pb:"14px",display:"flex",justifyContent:"space-between",borderBottom:g,children:[n(o,{children:[t(s,{variant:"caption",component:"p",className:p.title,children:e}),t(s,{variant:"subtitle2",component:"p",className:p.text,children:a})]}),l&&i&&t(U,{variant:"outlined",size:"large",className:p.button,startIcon:r&&r,href:i,target:"_blank",children:t(s,{variant:"button",component:"span",className:p.buttonText,children:l})})]})},$e=N(e=>({button:{border:`2px solid ${e.palette.primary.light}`,borderRadius:M,padding:0,width:"103px",height:"40px",alignSelf:"flex-end"},buttonText:{fontWeight:c.weight.bold,lineHeight:"16px"},title:{paddingBottom:e.spacing(1),color:e.palette.secondary.light,lineHeight:"16px"},text:{minWidth:"50%",fontWeight:c.weight.semiBold,lineHeight:"20px"}})),Se=({setIsEditing:e})=>{const a=f(),r=y(b);return n(x,{title:"information",setIsEditing:e,icon:t(A,{className:a.icon}),children:[t(s,{variant:"h6",component:"h6",className:a.name,children:r.firstname?D(r):t(L,{})}),n(Ie,{children:[t(w,{children:t(Be,{isBlocked:r.blocked,withLabel:!0})}),n(w,{className:a.ratings,children:[t(ce,{value:parseFloat(r.rating)}),t(pe,{value:r.acceptedRate})]})]}),t(H,{icon:t(de,{}),text:r.phone,buttonText:"CALL",title:"Phone number",href:`callto:${r.phone}`}),t(H,{text:r.companyName,title:"Company"})]})},Ce=({provider:e})=>{const a=f({});return n(x,{title:"Payouts",icon:t(ue,{}),style:{flexGrow:1,marginLeft:m.spacing(2)},children:[t(Re,{provider:e}),t(o,{overflow:"auto",children:e.payouts.length?e.payouts.map(r=>t(we,{payout:r},r.id)):t(o,{className:a.payoutItem,children:t(s,{variant:"body1",children:"No payouts"})})})]})},Re=({provider:e})=>{const a=f({});return n(o,{className:a.payoutsWrapper,children:[t(s,{variant:"body1",className:a.approval,children:e.payoutsApproved?"Provider approved for payouts.":"Provider not approved for payouts."}),t(s,{variant:"body1",children:"Balance"}),t(s,{variant:"body1",className:a.balance,children:W(e.balance)})]})},we=({payout:e})=>{const a=f({});return n(o,{className:a.payoutItem,children:[t(s,{style:{flex:1},children:he(e.dateTime)}),t(s,{style:{flex:1,textAlign:"center"},children:e.status}),t(s,{style:{flex:1,textAlign:"end"},children:W(e.amount)})]})},He=({values:e,handleFieldValues:a})=>t(x,{title:"Provider",icon:t(G,{}),children:t(o,{px:2,children:t(me,{label:"Provider type",value:e.type,source:"type",choices:P,onChange:r=>a("type",r.target.value)})})}),Ne=({values:e,handleFieldValues:a})=>t(x,{title:"Base pay",icon:t(Q,{}),children:n(o,{px:2,children:[t(C,{source:"values.perHour",label:"Per hour",value:e.perHour,onChange:r=>{const i=r.target.value;R({previousValue:e.perHour,newValue:i,fieldLabel:"perHour",setFieldValue:a})},handleBlur:()=>{a("perHour",`${parseFloat(`${e.perHour}`)}${`${parseFloat(`${e.perHour}`)}`.split(".")[1]?`${parseFloat(`${e.perHour}`)}`.split(".")[1].length===1?"0":"":".00"}`)}}),t(C,{source:"values.callout",label:"Travel (callout)",value:e.callout,onChange:r=>{const i=r.target.value;R({previousValue:e.callout,newValue:i,fieldLabel:"callout",setFieldValue:a})},handleBlur:()=>{a("callout",`${parseFloat(`${e.callout}`)}${`${parseFloat(`${e.callout}`)}`.split(".")[1]?`${parseFloat(`${e.callout}`)}`.split(".")[1].length===1?"0":"":".00"}`)}})]})}),Fe=({values:e,setIsEditing:a,handleFieldValues:r})=>t(ge,{children:n(o,{display:"flex",children:[n(o,{display:"flex",flexDirection:"column",children:[t(Se,{setIsEditing:a}),t(He,{values:e,handleFieldValues:r}),t(Ne,{values:e,handleFieldValues:r})]}),t(Ce,{provider:e})]})}),We=({values:e,setIsProfileEditView:a,handleSubmit:r,handleFieldValues:i,resetForm:l})=>(h.exports.useEffect(()=>()=>{l()},[]),n(o,{style:{display:"flex",flexDirection:"column",minHeight:"100vh",justifyContent:"space-between"},children:[n(o,{display:"flex",flexDirection:"column",children:[t(le,{title:"Edit profile Information",buttonText:"Back to provider's profile",onClick:()=>a(!1)}),t(se,{values:e,setFieldValue:i})]}),t(E,{onCancel:()=>a(!1),onSave:()=>r(),isSaveDisabled:!1})]})),Me=()=>{var $;const{id:e}=X(),a=F(),r=J(),i=y(b),l=y(K),[p,B]=Y.useState(!1),k=async u=>{r(re({id:e,params:u}))};return h.exports.useEffect(()=>(r(Z(e)),()=>{r(ee())}),[r]),h.exports.useEffect(()=>{if(l)return a.push(v.PROVIDERS),()=>{r(te())}},[l]),i?t(oe,{enableReinitialize:!0,onSubmit:k,initialValues:{...i,approved:!i.blocked,type:($=P.find(u=>u.name===i.type))==null?void 0:$.value},children:({handleSubmit:u,values:d,setFieldValue:S,resetForm:z})=>t(ie,{children:p?t(We,{values:d,setIsProfileEditView:B,handleSubmit:u,handleFieldValues:S,resetForm:z}):n(ae,{children:[t(fe,{provider:d}),t(Fe,{values:d,setIsEditing:B,handleFieldValues:S}),t(E,{onSave:u,onCancel:()=>a.push(v.PROVIDERS),isSaveDisabled:!(+d.perHour&&+d.perHour>0&&+d.callout&&+d.callout>0)})]})})}):t(L,{})};export{Me as default};