import{b3 as n}from"./index.7dbc0443.js";const i="MM/DD/YYYY hh:mm A";function m(t,e=new Date){return n(t).from(e)}function u(t){const e=Math.floor(t/3600),o=Math.floor(t%3600/60),r=e?`${e} hr `:"",a=`${o||0} min`;return`${r}${a}`}function c(t){let e=t;return e instanceof Date||(e=new Date(e._seconds*1e3+e._nanoseconds/1e6)),n(e).isSame(n(),"day")?"Today":s(e)}function D(t){return new Date(t)}function d(t){return new Date(t)}function s(t){return n(t).format("MMM D, YYYY")}function M(t){return n(t).format("MMMM D, YYYY")}function h(t){const e=new Date().getTimezoneOffset();return n(t).subtract(e,"m").format("hh:mm A")}function Y(t,e){return n.duration(n(e).diff(n(t))).asSeconds()}export{i as D,h as a,s as b,u as c,Y as d,d as e,c as f,D as g,M as h,m as t};