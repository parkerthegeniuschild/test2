import{w as f,r as y,_ as u,a0 as P,j as o,H as x,c as E,T}from"./index.7dbc0443.js";var I={root:{display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap"},filled:{"&$positionStart:not($hiddenLabel)":{marginTop:16}},positionStart:{marginRight:8},positionEnd:{marginLeft:8},disablePointerEvents:{pointerEvents:"none"},hiddenLabel:{},marginDense:{}},S=y.exports.forwardRef(function(e,m){var t=e.children,n=e.classes,c=e.className,r=e.component,p=r===void 0?"div":r,s=e.disablePointerEvents,v=s===void 0?!1:s,l=e.disableTypography,h=l===void 0?!1:l,g=e.position,d=e.variant,b=u(e,["children","classes","className","component","disablePointerEvents","disableTypography","position","variant"]),i=P()||{},a=d;return d&&i.variant,i&&!a&&(a=i.variant),o(x.Provider,{value:null,children:o(p,{className:E(n.root,c,g==="end"?n.positionEnd:n.positionStart,v&&n.disablePointerEvents,i.hiddenLabel&&n.hiddenLabel,a==="filled"&&n.filled,i.margin==="dense"&&n.marginDense),ref:m,...b,children:typeof t=="string"&&!h?o(T,{color:"textSecondary",children:t}):t})})});const C=f(I,{name:"MuiInputAdornment"})(S);export{C as I};
