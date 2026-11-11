const globalRoot = null;
'use strict';
const VERSION='0.10.1', PREFIX='tsd:snapshot:';
const PANEL_CSS = `:host{all:initial}
*{box-sizing:border-box}
:host,section{
--bg:rgba(252,253,255,.95);--fg:#1b2534;--muted:#65758c;--line:#e2e8f3;
--field:#f4f7fd;--field-hover:#e8effc;--field-line:#dce4f1;--btn-fg:#3b5473;--strong-btn:#eef4fd;
--accent:#5b7fd6;--accent-soft:rgba(91,127,214,.16);--track:#dde5f2;
--code-bg:#f7f9fd;--code-line:#e8eef7;--error:#dc2626;
--shadow:0 24px 64px rgba(22,38,72,.18),0 2px 6px rgba(22,38,72,.06);
}
section{
position:fixed;right:16px;left:auto;top:16px;width:372px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);
overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--field-line) transparent;
z-index:2147483600;background:var(--bg);backdrop-filter:blur(16px) saturate(1.12);color:var(--fg);scroll-padding-top:58px;
border:1px solid var(--line);border-top:3px solid var(--accent);border-radius:14px;box-shadow:var(--shadow);
padding:0 16px 0;font:12px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color-scheme:light}
@media (prefers-color-scheme: dark){:host,section{
--bg:rgba(21,30,42,.95);--fg:#e8eef6;--muted:#9bb0c8;--line:#31435a;
--field:#1b2735;--field-hover:#26374c;--field-line:#3a4e66;--btn-fg:#c6d6e8;--strong-btn:#233345;
--accent:#82a3ea;--accent-soft:rgba(130,163,234,.2);--track:#2c3d53;
--code-bg:#16212d;--code-line:#2b3d51;--error:#f3a3a3;--shadow:0 24px 64px rgba(0,0,0,.5),0 2px 6px rgba(0,0,0,.3);color-scheme:dark}}
@media (prefers-color-scheme: dark){.tsd-tab.on,.tsd-modes button.on{color:#0d1724}.tsd-tab.on:hover{filter:brightness(1.04)}}
section::-webkit-scrollbar{width:10px;height:10px}
section::-webkit-scrollbar-thumb{background:var(--field-line);border:3px solid transparent;background-clip:content-box;border-radius:10px;min-height:36px}
section::-webkit-scrollbar-thumb:hover{background:var(--muted);border:2px solid transparent;background-clip:content-box}
section::-webkit-scrollbar-track{background:transparent;margin:6px 0}
.tsd-launcher{position:fixed;left:16px;top:16px;margin:0;z-index:2147483647;display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border:1px solid #b3202b;border-radius:11px;background:linear-gradient(135deg,#f0453f 0%,#dc2626 52%,#b91c1c 100%);color:#fff;font:700 12.5px/1.15 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;letter-spacing:.03em;cursor:pointer;box-shadow:0 10px 26px rgba(220,38,38,.42),inset 0 1px 0 rgba(255,255,255,.3);text-shadow:0 1px 1px rgba(120,0,0,.4);transition:transform .12s,filter .12s,box-shadow .12s}
.tsd-launcher::before{content:"";width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.26);flex:0 0 auto}
.tsd-launcher:hover{filter:brightness(1.07);transform:translateY(-1px);box-shadow:0 14px 32px rgba(220,38,38,.5),inset 0 1px 0 rgba(255,255,255,.34)}
.tsd-launcher:active{transform:translateY(0) scale(.985)}
.tsd-launcher:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(255,255,255,.85),0 10px 26px rgba(220,38,38,.42)}
.tsd-resize{position:fixed;width:11px;border-radius:6px;cursor:ew-resize;touch-action:none;z-index:2147483601;background:transparent;transition:background .15s}
.tsd-resize::after{content:"";position:absolute;left:4px;top:50%;width:3px;height:44px;margin-top:-22px;border-radius:3px;background:var(--field-line);transition:background .15s,height .15s,margin-top .15s}
.tsd-resize:hover{background:var(--accent-soft)}
.tsd-resize:hover::after{background:var(--accent);height:72px;margin-top:-36px}
.tsd-resize.dragging{background:var(--accent-soft)}
.tsd-resize.dragging::after{background:var(--accent);height:80%;margin-top:-40%}
.tsd-head{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 -16px 8px;padding:13px 16px 10px;background:var(--bg);backdrop-filter:blur(12px);border-bottom:1px solid var(--line);box-shadow:0 8px 18px -14px rgba(22,38,72,.5);cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none}
.tsd-head.dragging{cursor:grabbing}
.tsd-head>strong{font-size:13px;font-weight:700;letter-spacing:.02em;color:var(--fg);padding-left:9px;border-left:3px solid var(--accent);white-space:nowrap}
.tsd-logo{width:15px;height:15px;flex:0 0 auto;border-radius:4px;background:linear-gradient(135deg,#8fb2ff 0%,#4c72d4 60%,#2f4fa8 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 1px 3px rgba(30,60,130,.35)}
.tsd-ver{font-size:10px;font-weight:500;color:var(--muted);letter-spacing:.04em;padding:1px 5px;border:1px solid var(--field-line);border-radius:5px;background:var(--field)}
.tsd-head-actions{margin-left:auto;display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}
.tsd-head-actions button{margin:0;padding:2px 8px;font-size:10.5px;border-radius:7px}
section>div{margin-top:8px}
button,input,select,textarea{font:inherit;color:var(--fg);background:var(--field);border:1px solid var(--field-line);border-radius:8px;padding:5px 9px;max-width:100%;outline:none;transition:background .15s,border-color .15s,box-shadow .15s}
button{cursor:pointer;margin:3px 5px 3px 0;font-size:11.5px;color:var(--btn-fg);box-shadow:0 1px 0 rgba(22,38,72,.03)}
section button:hover{background:var(--field-hover);border-color:var(--accent)}
section button:active{filter:brightness(.97)}
section button:focus-visible,section input:focus-visible,section select:focus-visible,section textarea:focus-visible{box-shadow:0 0 0 2px var(--accent-soft);border-color:var(--accent)}
section>button{background:var(--strong-btn);color:var(--btn-fg)}
input,select,textarea{width:58%;max-width:280px}
textarea{max-width:none}
input[type=number]{-moz-appearance:textfield}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
textarea{width:100%;min-height:68px;background:var(--code-bg);font:10.5px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical}
input[type=color]{width:52px;height:26px;padding:2px;cursor:pointer}
input[type=checkbox]{width:15px;height:15px;accent-color:var(--accent);cursor:pointer}
label{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin:5px 0;font-size:11.5px}
label>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}
label textarea{flex:1 1 100%}
pre{white-space:pre-wrap;overflow-wrap:anywhere;font:10.5px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);background:var(--code-bg);border:1px solid var(--code-line);border-radius:8px;padding:8px 10px;max-height:150px;overflow:auto;margin:6px 0}
pre.error{background:transparent;border:0;padding:0;color:var(--error);margin:0}
h3{margin:14px 0 6px;padding-bottom:5px;border-bottom:1px solid var(--code-line);font-size:11.5px;font-weight:650;color:var(--fg)}
.tsd-pick{color:var(--muted);font-weight:500;margin-right:2px}
.tsd-tabs{display:flex;gap:6px;margin:2px 0 4px}
.tsd-tab{flex:1;margin:0;padding:5px 8px;font-size:11px;font-weight:600;border-radius:9px;background:var(--field);border:1px solid var(--field-line);color:var(--muted);box-shadow:none}
.tsd-tab:hover{background:var(--field-hover);border-color:var(--field-line)}
.tsd-tab.on{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 2px 8px rgba(60,100,190,.35)}
.tsd-tab.on:hover{background:var(--accent);filter:brightness(1.05)}
.tsd-tab:disabled{opacity:.42;cursor:not-allowed}
.tsd-tab.on:disabled{opacity:.6}
.tsd-pane[hidden]{display:none}
.tsd-tools{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:6px -2px 9px;padding:4px 6px;border:1px solid var(--code-line);border-radius:9px;background:var(--code-bg)}
.tsd-tools button{margin:0;padding:3px 8px;font-size:10.5px;border-radius:7px;background:var(--field);border-color:var(--field-line);color:var(--btn-fg);box-shadow:none}
.tsd-tools .tsd-sp{flex:1 1 auto}
.tsd-tools small{font-size:10px;color:var(--muted);white-space:nowrap}
.tsd-mat-all{margin-top:10px;border:1px solid var(--code-line);border-radius:9px;padding:4px 8px 8px;background:var(--code-bg)}
.tsd-mat-all>summary{margin-bottom:4px;background:transparent;padding:4px 0;font-weight:600}
details{margin:6px 0;border:1px solid var(--code-line);border-radius:10px;background:var(--code-bg);overflow:hidden}
details>summary{display:flex;align-items:center;gap:7px;cursor:pointer;padding:7px 10px;background:var(--field);color:var(--fg);font-size:11.5px;font-weight:600;border-radius:0;list-style:none;transition:background .15s}
details>summary::-webkit-details-marker{display:none}
details>summary::before{content:"";width:5px;height:5px;flex:0 0 auto;border-right:1.7px solid var(--muted);border-bottom:1.7px solid var(--muted);transform:rotate(-45deg);transition:transform .18s ease}
details[open]>summary::before{transform:rotate(45deg)}
details[open]>summary{border-bottom:1px solid var(--code-line)}
details>summary:hover{background:var(--field-hover)}
details>div{padding:2px 9px 8px}
details>pre{margin:8px 9px}
summary{cursor:pointer;overflow-wrap:anywhere;color:var(--fg);font-size:11.5px}
summary::marker{color:var(--muted)}
small{color:var(--muted)}
.tsd-node{display:block;width:100%;text-align:left;background:transparent;border:0;border-radius:0;padding:3px 8px;margin:0;color:var(--fg);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:none}
.tsd-node:hover{background:var(--field-hover);border-color:transparent}
.tsd-node.on{background:var(--accent-soft);box-shadow:inset 2px 0 0 var(--accent)}
.tsd-leaf{padding-left:22px}
label output{width:46px;text-align:right;font:10.5px/1 ui-monospace,Menlo,monospace;color:var(--muted)}
.tsd-slider{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:8px;row-gap:1px;margin:8px 0;padding:1px 0;font-size:11.5px;justify-content:initial}
.tsd-slider>span{grid-column:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tsd-slider>.tsd-num{grid-column:2;width:64px;flex:none;padding:2px 5px;text-align:right;font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--field);border:1px solid var(--field-line);border-radius:6px;color:var(--fg)}
.tsd-slider>.tsd-num:focus{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent-soft)}
.tsd-mat-switch{display:flex;flex-wrap:wrap;gap:2px 14px;margin:2px 0 4px}
.tsd-mat-switch label{margin:0;gap:6px;flex:0 0 auto}
.tsd-mat-switch label>span{flex:0 0 auto;white-space:nowrap;color:var(--muted)}
.tsd-mat-switch input[type=checkbox]{width:14px;height:14px}
.tsd-type-row select{flex:1 1 100%;max-width:none;padding:3px 8px;font-family:ui-monospace,Menlo,monospace;font-size:11px}
.tsd-slider>input[type=range]{grid-column:1/-1;width:100%;margin:1px 0 0;flex:none;min-width:0}
input[type=range]{-webkit-appearance:none;appearance:none;height:17px;padding:0;border:0;background:transparent;cursor:pointer;accent-color:var(--accent)}
input[type=range]:focus{outline:none}
input[type=range]::-webkit-slider-runnable-track{height:5px;border-radius:99px;background:linear-gradient(to right,var(--accent) 0 var(--p,50%),var(--track) var(--p,50%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;margin-top:-4.5px;border-radius:50%;background:#fff;border:2px solid var(--accent);box-shadow:0 1px 3px rgba(20,40,80,.32);transition:transform .12s ease,box-shadow .12s ease}
input[type=range]:hover::-webkit-slider-thumb{transform:scale(1.12)}
input[type=range]:active::-webkit-slider-thumb{transform:scale(1.18);box-shadow:0 0 0 6px var(--accent-soft)}
input[type=range]:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 4px var(--accent-soft)}
input[type=range]::-moz-range-track{height:5px;border-radius:99px;background:var(--track)}
input[type=range]::-moz-range-progress{height:5px;border-radius:99px;background:var(--accent)}
input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid var(--accent);box-shadow:0 1px 3px rgba(20,40,80,.32)}
.tsd-group{margin:8px 0;border:1px solid var(--code-line);border-radius:9px;overflow:hidden;background:var(--code-bg)}
.tsd-group-head{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--field);border-bottom:1px solid var(--code-line);flex-wrap:wrap}
.tsd-group-head strong{font-size:11.5px}
.tsd-group-head small{color:var(--muted);font-size:10.5px}
.tsd-group-head button{margin:0 0 0 auto;padding:2px 7px;font-size:10.5px}
.tsd-row{display:flex;align-items:center;gap:7px;padding:5px 8px;border-top:1px solid var(--code-line);font-size:11px;cursor:copy;flex-wrap:wrap}
.tsd-row:first-of-type{border-top:0}
.tsd-row:hover{background:var(--field-hover)}
.tsd-row.off{opacity:.45;text-decoration:line-through}
.tsd-row.superseded{opacity:.68}
.tsd-row.superseded span{color:var(--muted)}
.tsd-sup{flex:none;font-size:9.5px;line-height:1.65;padding:0 4px;border:1px solid var(--code-line);border-radius:5px;background:var(--field);color:var(--muted)}
.tsd-tip{display:block;font-size:10.5px;line-height:1.5;margin:2px 0 6px}
/* 面板底部固定栏：sticky 吸底，滚动时始终可见；大按钮复制修改提示词 */
.tsd-copybar{position:sticky;bottom:0;z-index:7;margin:14px -16px 0;padding:12px 16px 14px;
 background:var(--bg);border-top:1px solid var(--line);border-radius:0 0 13px 13px;
 box-shadow:0 -6px 14px rgba(22,38,72,.06)}
button.tsd-copyall{display:block;width:100%;padding:12px 16px;font-size:13.5px;font-weight:700;letter-spacing:.4px;
 border:0;border-radius:10px;cursor:pointer;color:#fff;
 background:linear-gradient(135deg,#5b7fd6 0%,#3f6ac4 100%);
 box-shadow:0 4px 14px rgba(63,106,196,.32);transition:transform .12s,box-shadow .12s}
button.tsd-copyall:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(63,106,196,.42)}
button.tsd-copyall:active{transform:translateY(0)}
button.tsd-copyall.tsd-copy-ok{background:linear-gradient(135deg,#3aa76c 0%,#2c8f57 100%);box-shadow:0 4px 14px rgba(44,143,87,.35)}
button.tsd-copyall.tsd-copy-fail{background:linear-gradient(135deg,#c65b54 0%,#ad413b 100%);box-shadow:0 4px 14px rgba(173,65,59,.35)}
button.tsd-copyall:disabled{background:var(--field);color:var(--muted);border:1px solid var(--field-line);
 box-shadow:none;cursor:not-allowed;transform:none}
/* 命令区「AI 提示词」：紫色高亮，复用复制成功/失败闪变 */
button.tsd-aiprompt{font-weight:700;color:#fff;border-color:transparent;
 background:linear-gradient(135deg,#7a5cd6 0%,#5f46bb 100%);box-shadow:0 2px 8px rgba(95,70,187,.28)}
button.tsd-aiprompt:hover{filter:brightness(1.08)}
button.tsd-aiprompt.tsd-copy-ok{background:linear-gradient(135deg,#3aa76c 0%,#2c8f57 100%);color:#fff}
button.tsd-aiprompt.tsd-copy-fail{background:linear-gradient(135deg,#c65b54 0%,#ad413b 100%);color:#fff}
.tsd-row code{font:10.5px/1.4 ui-monospace,Menlo,monospace;color:var(--accent);background:transparent;padding:0;border:0}
.tsd-row span{flex:1;min-width:0;overflow-wrap:anywhere;color:var(--fg)}
.tsd-row button{margin:0;padding:1px 6px;font-size:10px}
.tsd-hint{color:var(--muted);font-size:10.5px;margin:4px 0 0}
.tsd-sub{display:block;font-size:11px;font-weight:650;margin:9px 0 1px;color:var(--fg)}
.tsd-actions{display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 6px}
.tsd-actions button{margin:0;padding:3px 10px;font-size:10.5px;border-radius:7px;background:var(--strong-btn)}
.tsd-asset-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:5px 0 8px}
.tsd-asset{position:relative;margin:0;padding:0;height:56px;overflow:hidden;border-radius:8px;border:1px solid var(--field-line);background:var(--field);color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.85);transition:transform .12s,filter .12s,border-color .12s}
.tsd-asset .tsd-thumb{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.tsd-asset>span{position:absolute;left:0;right:0;bottom:0;padding:2px 5px;font-size:9.5px;line-height:1.4;background:linear-gradient(transparent,rgba(0,0,0,.78));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
.tsd-asset.no-thumb{display:flex;align-items:center;justify-content:center}
.tsd-asset.no-thumb>span{position:static;background:none;color:var(--muted);text-shadow:none;padding:0 4px;white-space:normal;text-align:center}
.tsd-asset:hover{border-color:var(--accent);filter:brightness(1.06);transform:translateY(-1px)}
.tsd-mini{width:36px;height:36px;object-fit:cover;border-radius:6px;border:1px solid var(--field-line);flex:0 0 auto}
.tsd-pf-group{margin:7px 0;padding:5px 8px 7px;border:1px solid var(--code-line);border-radius:9px;background:var(--code-bg)}
.tsd-pf-group>strong{display:block;font-size:11px;font-weight:650;margin:1px 0 2px;color:var(--fg)}
.tsd-pf-status{margin:5px 0 3px;padding:5px 8px;border-radius:8px;border:1px solid var(--code-line);background:var(--code-bg);color:var(--fg);font-size:10.5px;line-height:1.45}
.tsd-pf-status.tsd-pf-warn{border-color:#7a5a2a;color:#f0c07a}
.tsd-texbox{margin:4px 0 2px;padding:2px 8px 6px;border:1px solid var(--code-line);border-radius:9px;background:var(--code-bg)}
.tsd-texbox h3{margin:8px 0 4px}
.tsd-modes{display:flex;gap:4px;margin:0 0 6px;padding:3px;border:1px solid var(--code-line);border-radius:9px;background:var(--code-bg)}
.tsd-modes button{flex:1;margin:0;padding:4px 6px;font-size:10.5px;border-radius:6px;background:var(--field);border-color:transparent;box-shadow:none;color:var(--btn-fg)}
.tsd-modes button:hover{background:var(--field-hover);border-color:var(--field-line)}
.tsd-modes button.on{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 2px 6px rgba(60,100,190,.32)}
.tsd-filter{width:100%;margin:2px 0 7px;padding:4px 9px;font-size:11px;border-radius:8px;background:var(--code-bg)}
label[hidden]{display:none}
label>span.tsd-scrub{cursor:ew-resize;user-select:none;-webkit-user-select:none;touch-action:none}
label>span.tsd-scrub:hover,label>span.tsd-scrub.dragging{color:var(--accent)}
label>span.tsd-scrub.dragging{font-weight:600}
.tsd-tex-head{display:flex;align-items:center;gap:8px}
.tsd-tex-head h3{flex:1;margin:8px 0 4px}
.tsd-tex-head button{flex:0 0 auto;margin:0;padding:2px 9px;font-size:10.5px;border-radius:7px}
.tsd-tex-row{display:flex;align-items:center;gap:7px;margin:5px 0}
.tsd-tex-name{flex:0 0 74px;font:10.5px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tsd-tex-btn{flex:1;display:flex;align-items:center;gap:7px;min-width:0;margin:0;padding:3px 7px;font-size:11px;border-radius:8px;background:var(--field);border:1px solid var(--field-line);color:var(--fg);text-align:left;box-shadow:none}
.tsd-tex-btn .tsd-mini{width:26px;height:26px;border-radius:5px}
.tsd-tex-btn>span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.tsd-tex-btn .tsd-tex-go{flex:0 0 auto;font-size:10px;color:var(--accent);border-left:1px solid var(--field-line);padding-left:7px}
.tsd-tex-btn.no-thumb{background:transparent;border-style:dashed}
.tsd-lib{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:18px;font:12px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:var(--fg)}
.tsd-lib[hidden]{display:none}
.tsd-lib-back{position:absolute;inset:0;background:rgba(10,18,32,.44);backdrop-filter:blur(3px)}
.tsd-lib-card{position:relative;display:flex;flex-direction:column;width:min(560px,100%);max-height:min(84vh,760px);background:var(--bg);border:1px solid var(--line);border-radius:16px;box-shadow:0 30px 90px rgba(8,18,38,.5);overflow:hidden;animation:tsd-lib-in .16s ease-out}
@keyframes tsd-lib-in{from{opacity:0;transform:translateY(10px) scale(.99)}to{opacity:1;transform:none}}
.tsd-lib-head{display:flex;align-items:center;gap:8px;padding:12px 14px 10px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,var(--field),transparent)}
.tsd-lib-head>strong{font-size:13px;font-weight:700;letter-spacing:.02em;white-space:nowrap}
.tsd-lib-sub{flex:1;min-width:0;color:var(--muted);font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tsd-lib-x{flex:0 0 auto;margin:0;padding:0;width:24px;height:24px;line-height:1;border-radius:7px;font-size:13px;background:var(--field);border:1px solid var(--field-line);color:var(--muted);box-shadow:none}
.tsd-lib-tabs{display:flex;gap:6px;padding:10px 14px 0}
.tsd-lib-tab{flex:1;margin:0;padding:5px 6px;font-size:11px;font-weight:600;border-radius:9px;background:var(--field);border:1px solid var(--field-line);color:var(--muted);box-shadow:none}
.tsd-lib-tab.on{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 2px 8px rgba(60,100,190,.35)}
.tsd-lib-body{flex:1;overflow:auto;padding:2px 14px 10px;scrollbar-width:thin}
.tsd-lib-sec{margin:10px 0 4px}
.tsd-lib-sec>strong{display:block;font-size:10.5px;font-weight:650;color:var(--muted);margin:0 0 6px}
.tsd-lib-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:7px}
.tsd-lib-grid>.tsd-lib-empty{grid-column:1/-1}
.tsd-lib-tile{position:relative;margin:0;padding:0;aspect-ratio:1/1;border-radius:10px;overflow:hidden;border:1px solid var(--field-line);background:var(--field);color:#fff;box-shadow:none;transition:transform .12s,border-color .12s}
.tsd-lib-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.tsd-lib-tile:hover{border-color:var(--accent);transform:translateY(-1px)}
.tsd-lib-tile:active{transform:none}
.tsd-lib-tile:disabled{opacity:.45;cursor:not-allowed;transform:none}
.tsd-lib-cap{position:absolute;left:0;right:0;bottom:0;padding:10px 5px 3px;font-size:10px;line-height:1.3;text-align:left;background:linear-gradient(transparent,rgba(3,8,16,.88));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 3px rgba(0,0,0,.9)}
.tsd-lib-kind{position:absolute;right:4px;top:4px;padding:0 4px;font-size:9px;line-height:14px;border-radius:5px;background:rgba(4,10,20,.62);color:#eaf2ff;border:1px solid rgba(255,255,255,.2);letter-spacing:.02em}
.tsd-lib-chips{display:flex;flex-wrap:wrap;gap:5px}
.tsd-lib-chip{margin:0;padding:3px 8px;font-size:10.5px;border-radius:999px;background:var(--field);border:1px solid var(--field-line);color:var(--btn-fg);box-shadow:none}
.tsd-lib-empty{color:var(--muted);font-size:10.5px}
.tsd-lib-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:9px 14px;border-top:1px solid var(--line);background:var(--code-bg)}
.tsd-lib-note{flex:1 1 100%;color:var(--muted);font-size:10.5px;margin:0}
.tsd-lib-field{display:flex;align-items:center;gap:6px;margin:0;font-size:10.5px;color:var(--muted);justify-content:flex-start}
.tsd-lib-field>span{flex:0 0 auto}
.tsd-lib-field input,.tsd-lib-field select{width:auto;min-width:62px;padding:2px 6px;font-size:10.5px;border-radius:6px}
@media (prefers-color-scheme: dark){.tsd-lib-tab.on{color:#0d1724}.tsd-lib-tile{color:#fff}}
@media (max-width:480px){.tsd-lib{padding:8px}.tsd-lib-grid{grid-template-columns:repeat(auto-fill,minmax(76px,1fr))}}
@media (max-width:560px){section{top:64px;max-height:calc(100vh - 80px)}.tsd-tools small{display:none}}
`;
let liveInstances=0;
const publicApi={};
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const parts=p=>{if(typeof p!=='string'||!p||p.split('.').some(k=>!/^\w+$/.test(k)||['__proto__','prototype','constructor'].includes(k)))throw Error('Unsafe propertyPath');return p.split('.');};
const get=(o,p)=>parts(p).reduce((v,k)=>v==null?undefined:v[k],o);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function plain(v,seen=new Set()){
 if(v===null||typeof v==='string'||typeof v==='boolean')return v;
 if(typeof v==='number'){if(!Number.isFinite(v))throw Error('Non-finite number');return v;}
 if(typeof v!=='object')throw Error('Non-JSON value');
 const proto=Object.getPrototypeOf(v);if(!Array.isArray(v)&&proto!==null&&proto?.constructor?.name!=='Object')throw Error('Non-plain JSON object: '+(proto?.constructor?.name||'unknown'));
 if(seen.has(v))throw Error('Cyclic value');seen.add(v);
 const out=Array.isArray(v)?[]:{};
 for(const k of Object.keys(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe JSON key');out[k]=plain(v[k],seen);}
 seen.delete(v);return out;
}
function pack(v){
 if(typeof v==='number'&&!Number.isFinite(v)){if(Number.isNaN(v))throw Error('NaN cannot be tracked');return {$type:'Number',value:v>0?'Infinity':'-Infinity'};}
 if(v&&v.isTexture)return {$type:'Texture',uuid:v.uuid};
 if(v&&v.isMaterial)return {$type:'Material',uuid:v.uuid};
 if(v&&v.isColor)return {$type:'Color',rgb:[v.r,v.g,v.b]};
 if(v&&(v.isVector2||v.isVector3||v.isVector4||v.isEuler||v.isQuaternion))return {$type:v.isEuler?'Euler':v.isQuaternion?'Quaternion':v.isVector2?'Vector2':v.isVector4?'Vector4':'Vector3',value:v.toArray()};
 if(v&&(v.isFog||v.isFogExp2))return {$type:v.isFog?'Fog':'FogExp2',color:pack(v.color),near:v.near===undefined?null:v.near,far:v.far===undefined?null:v.far,density:v.density===undefined?null:v.density};
 return plain(v);
}
function SceneDiscovery(options){
 const w=typeof window!=='undefined'?window:{};
 this.scene=options.scene||w.scene;this.camera=options.camera||w.camera;this.renderer=options.renderer||w.renderer;
 this.controls=options.controls||w.controls||null;this.THREE=options.THREE||w.THREE||null;
 if(!this.scene||!this.scene.isScene||!this.camera||!this.camera.isCamera||!this.renderer)throw Error('Provide { scene, camera, renderer }; global discovery is only a fallback');
}
class SceneTreeBuilder{
 constructor(d){this.d=d;this.nodes=[];this.names=new Map();}
 build(){this.nodes=[];this.names.clear();const walk=o=>{if(o.userData&&o.userData.tsdIgnore)return;this.nodes.push(o);if(o.name)this.names.set(o.name,(this.names.get(o.name)||0)+1);for(const c of o.children)walk(c);};walk(this.d.scene);return this.nodes;}
 expression(o){if(o===this.d.scene)return 'scene';if(o===this.d.camera&&!this.nodes.includes(o))return 'camera';return o.name&&this.names.get(o.name)===1?'scene.getObjectByName('+JSON.stringify(o.name)+')':'scene.getObjectByProperty("uuid", '+JSON.stringify(o.uuid)+') /* empty/duplicate name: UUID fallback */';}
 clear(){this.nodes=[];this.names.clear();this.d=null;}
}
const objectFields='visible castShadow receiveShadow renderOrder frustumCulled matrixAutoUpdate';
const materialFields='color roughness metalness emissive emissiveIntensity opacity transparent side wireframe flatShading depthTest depthWrite alphaTest alphaHash blending vertexColors dithering premultipliedAlpha toneMapped envMapIntensity reflectivity refractionRatio shininess specular specularIntensity specularColor clearcoat clearcoatRoughness transmission thickness ior attenuationDistance attenuationColor sheen sheenColor sheenRoughness anisotropy anisotropyRotation dispersion normalScale bumpScale displacementScale displacementBias lightMapIntensity aoMapIntensity polygonOffset polygonOffsetFactor polygonOffsetUnits wireframeLinewidth';
const textureFields='wrapS wrapT rotation magFilter minFilter anisotropy generateMipmaps flipY colorSpace channel matrixAutoUpdate';
class PropertyInspector{
 constructor(d){this.d=d;this.targets=new Map();this.byObject=new Map();this.resources=new Map();this.extras=[];}
 add(object,id,label,expr,locator){if(!object)return null;if(this.byObject.has(object))return this.byObject.get(object);const t={object,id,label,expr,locator,fields:new Map()};this.targets.set(id,t);this.byObject.set(object,t);if(object.uuid)this.resources.set(object.uuid,object);return t;}
 field(t,p,kind){let v;try{v=get(t.object,p);}catch{return;}if(v===undefined)return;if(!kind)kind=typeof v==='number'?'number':typeof v==='boolean'?'boolean':v&&v.isColor?'color':typeof v==='string'?'string':null;if(kind)t.fields.set(p,{kind});}
 vector(t,p,axes='xyz'){for(const a of axes)this.field(t,p+'.'+a);}
 object(o,expr){const t=this.add(o,'object:'+o.uuid,(o.name||o.type)+' · '+o.uuid,expr,{kind:o===this.d.scene?'scene':o===this.d.camera?'camera':'object',uuid:o.uuid,name:o.name});if(!t)return;this.vector(t,'position');t.fields.set('position',{kind:'vector'});this.vector(t,'rotation');this.field(t,'rotation.order');t.fields.set('rotation',{kind:'euler'});this.vector(t,'scale');t.fields.set('scale',{kind:'vector'});for(const p of objectFields.split(' '))this.field(t,p);this.field(t,'userData','json');
 if(o.isCamera){for(const p of 'fov near far aspect zoom left right top bottom focus filmGauge filmOffset'.split(' '))this.field(t,p);}
 if(o.isLight){for(const p of 'color intensity distance decay angle penumbra width height power'.split(' '))this.field(t,p);if(o.shadow){for(const p of 'bias normalBias radius blurSamples autoUpdate'.split(' '))this.field(t,'shadow.'+p);for(const a of 'xy')this.field(t,'shadow.mapSize.'+a);for(const p of 'near far left right top bottom fov aspect zoom'.split(' '))this.field(t,'shadow.camera.'+p);}}
 if(o.isScene){this.field(t,'background','background');this.field(t,'environment','resource');this.field(t,'fog','fog');if(o.fog){this.field(t,'fog.color','color');for(const k of o.fog.isFog?['near','far']:['density'])this.field(t,'fog.'+k);}for(const p of 'backgroundBlurriness backgroundIntensity environmentIntensity'.split(' '))this.field(t,p);this.vector(t,'backgroundRotation');this.vector(t,'environmentRotation');}
 const mats=Array.isArray(o.material)?o.material:o.material?[o.material]:[];
 mats.forEach((m,i)=>this.material(m,expr+'.material'+(Array.isArray(o.material)?'['+i+']':''),{kind:'material',owner:o.uuid,ownerName:o.name,index:Array.isArray(o.material)?i:null}));
 }
 material(m,expr,loc){const t=this.add(m,'material:'+m.uuid,(m.name||m.type)+' · '+m.uuid,expr,loc);for(const p of materialFields.split(' '))this.field(t,p);this.vector(t,'normalScale','xy');for(const p of Object.keys(m)){if(!p.startsWith('_')&&!p.startsWith('is')&&!['id','version','uuid','name','type','userData'].includes(p)){const v=m[p];if(typeof v==='number'&&Number.isFinite(v)||typeof v==='boolean'||v?.isColor)this.field(t,p);if(v?.isVector2||v?.isVector3||v?.isVector4)this.vector(t,p,v.isVector2?'xy':v.isVector4?'xyzw':'xyz');}if(/^\w+$/.test(p)&&!['constructor','prototype','__proto__'].includes(p)&&/Map$|^map$|^matcap$|^gradientMap$/.test(p)&&(m[p]===null||m[p]?.isTexture)){this.field(t,p,'resource');if(m[p])this.texture(m[p],expr+'.'+p,{kind:'texture',parent:t.id,parentLocator:t.locator,path:p});}}}
 texture(tex,expr,loc){const existed=this.byObject.has(tex);const t=this.add(tex,'texture:'+tex.uuid,(tex.name||'Texture')+' · '+tex.uuid,expr,loc);if(existed)return;for(const p of textureFields.split(' '))this.field(t,p);this.vector(t,'repeat','xy');this.vector(t,'offset','xy');this.vector(t,'center','xy');}
 rebuild(){// Preserve detached resource references for undo/snapshots, but rebuild current target locators.
 this.targets.clear();this.byObject.clear();for(const o of this.d.tree.nodes)this.object(o,this.d.tree.expression(o));if(!this.byObject.has(this.d.camera))this.object(this.d.camera,'camera');
 const s=this.byObject.get(this.d.scene);for(const p of ['background','environment'])if(this.d.scene[p]?.isTexture)this.texture(this.d.scene[p],'scene.'+p,{kind:'texture',parent:s.id,parentLocator:s.locator,path:p});
 const r=this.add(this.d.renderer,'renderer','Renderer','renderer',{kind:'renderer'});for(const p of ['toneMapping','toneMappingExposure','outputColorSpace','shadowMap.enabled','shadowMap.type','shadowMap.autoUpdate'])this.field(r,p);r.fields.set('pixelRatio',{kind:'number'});
 if(this.d.controls){const c=this.add(this.d.controls,'controls','OrbitControls','controls',{kind:'controls'});for(const p of 'enabled enableDamping dampingFactor minDistance maxDistance minZoom maxZoom minPolarAngle maxPolarAngle minAzimuthAngle maxAzimuthAngle enableZoom enableRotate enablePan autoRotate autoRotateSpeed zoomSpeed rotateSpeed panSpeed screenSpacePanning'.split(' '))this.field(c,p);this.vector(c,'target');}
 for(const e of this.extras){const t=this.add(e.object,e.id,e.label,e.expr,e.locator);this.generic(t,e.object,'',0);}
 }
 generic(t,o,p,depth){for(const k of Object.keys(o)){if(k.startsWith('_')||['constructor','prototype','__proto__'].includes(k))continue;const path=p?p+'.'+k:k,v=o[k];if(typeof v==='number'&&Number.isFinite(v)||typeof v==='boolean'||v?.isColor)this.field(t,path);else if(v&&(v.isVector2||v.isVector3||v.isVector4))this.vector(t,path,v.isVector2?'xy':v.isVector4?'xyzw':'xyz');else if(depth<3&&v&&typeof v==='object'&&!v.isObject3D&&!v.isTexture&&(k==='uniforms'||p==='uniforms'||p.startsWith('uniforms.')))this.generic(t,v,path,depth+1);}}
 resolve(ref){if(!ref||typeof ref!=='object')return ref;if(ref.$type==='Number'){if(!['Infinity','-Infinity'].includes(ref.value))throw Error('Invalid Number tag');return ref.value==='Infinity'?Infinity:-Infinity;}if(ref.$type==='Texture'||ref.$type==='Material'){const v=this.resources.get(ref.uuid);if(!v)throw Error('Unresolved resource UUID: '+ref.uuid+' (registerResource first)');if(ref.$type==='Texture'&&!v.isTexture||ref.$type==='Material'&&!v.isMaterial)throw Error('Resource type mismatch');return v;}
 const T=this.d.THREE;if(ref.$type){plain(ref);if(ref.$type==='Color'&&(!Array.isArray(ref.rgb)||ref.rgb.length!==3||!ref.rgb.every(Number.isFinite)))throw Error('Invalid Color');if(['Vector2','Vector3','Vector4','Euler','Quaternion'].includes(ref.$type)){const n=ref.$type==='Vector2'?2:ref.$type==='Vector3'?3:4;if(!Array.isArray(ref.value)||ref.value.length!==n||!ref.value.slice(0,ref.$type==='Euler'?3:n).every(Number.isFinite)||ref.$type==='Euler'&&!['XYZ','YZX','ZXY','XZY','YXZ','ZYX'].includes(ref.value[3]))throw Error('Invalid vector/Euler');}if(['Fog','FogExp2'].includes(ref.$type)&&!(ref.$type==='Fog'?[ref.near,ref.far].every(Number.isFinite):Number.isFinite(ref.density)))throw Error('Invalid fog');if(!T)throw Error('THREE namespace required for typed restoration');if(ref.$type==='Color')return new T.Color().setRGB(...ref.rgb);if(['Vector2','Vector3','Vector4','Euler','Quaternion'].includes(ref.$type))return new T[ref.$type]().fromArray(ref.value);if(ref.$type==='Fog')return new T.Fog(this.resolve(ref.color),ref.near,ref.far);if(ref.$type==='FogExp2')return new T.FogExp2(this.resolve(ref.color),ref.density);throw Error('Unknown $type');}return plain(ref);}
 encode(t,p,value){return t.fields.get(p)?.kind==='json'?plain(value):pack(value);}
 read(t,p){return p==='pixelRatio'&&t.id==='renderer'?t.object.getPixelRatio():get(t.object,p);}
 validate(t,p,value){parts(p);const f=t.fields.get(p);if(!f)throw Error('Property not inspectable: '+p);if(f.kind==='number'&&(typeof value!=='number'||!Number.isFinite(value)&&!(/^(maxDistance|maxZoom|minAzimuthAngle|maxAzimuthAngle|repetitions|attenuationDistance)$/.test(p)&&!Number.isNaN(value))))throw Error('Expected finite number');if(f.kind==='boolean'&&typeof value!=='boolean')throw Error('Expected boolean');if(f.kind==='string'&&typeof value!=='string')throw Error('Expected string');if(f.kind==='resource'&&value!==null&&!value?.isTexture)throw Error('Expected Texture or null');if(f.kind==='background'&&value!==null&&!value?.isTexture&&!value?.isColor)throw Error('Expected Color, Texture or null');if(f.kind==='fog'&&value!==null&&!value?.isFog&&!value?.isFogExp2)throw Error('Expected Fog/FogExp2 or null');if(f.kind==='vector'&&!value?.isVector3)throw Error('Expected Vector3');if(f.kind==='json')plain(value);if(f.kind==='euler'&&!value?.isEuler)throw Error('Expected Euler');if(p==='rotation.order'&&!['XYZ','YZX','ZXY','XZY','YXZ','ZYX'].includes(value))throw Error('Invalid Euler order');if(f.kind==='color'&&!value?.isColor&&typeof value!=='string'&&typeof value!=='number')throw Error('Expected Color');if(p==='pixelRatio'&&value<=0)throw Error('pixelRatio must be positive');if(/shadow.mapSize.[xy]$/.test(p)&&(!Number.isInteger(value)||value<1))throw Error('mapSize must be a positive integer');}
 write(t,p,value){this.validate(t,p,value);const o=t.object;
 if(p==='pixelRatio'&&t.id==='renderer')o.setPixelRatio(Math.min(value,this.d.pixelRatioCap));
 else{const a=parts(p),k=a.pop(),parent=a.reduce((v,x)=>v[x],o),old=parent[k];if(t.fields.get(p)?.kind==='json')parent[k]=value;else if(old?.isColor&&(value?.isColor||typeof value==='string'||typeof value==='number')){if(value?.isColor)old.copy(value);else old.set(value);}else if(old?.copy&&value&&old.constructor===value.constructor&&!value.isTexture&&!value.isMaterial)old.copy(value);else parent[k]=value;}
 if(o.isTexture){o.needsUpdate=true;if(o.matrixAutoUpdate)o.updateMatrix();}
 if(o.isMaterial)o.needsUpdate=true;if(t.fields.get(p)?.kind!=='json'&&value?.isTexture){value.needsUpdate=true;this.resources.set(value.uuid,value);}
 if(o.isCamera)o.updateProjectionMatrix();
 if(o.isObject3D){if(o.matrixAutoUpdate||/^(position|rotation|scale)(\.|$)/.test(p))o.updateMatrix();o.matrixWorldNeedsUpdate=true;}
 if(p.startsWith('shadow.camera.'))o.shadow.camera.updateProjectionMatrix();if(o.shadow)o.shadow.needsUpdate=true;if(o.isObject3D&&this.d.renderer.shadowMap)this.d.renderer.shadowMap.needsUpdate=true;
 if(p.startsWith('shadow.mapSize.')&&o.shadow){o.shadow.needsUpdate=true;if(o.shadow.map)this.d.warnings.add('Shadow mapSize changed: r187 resizes targets on next render; older versions may require explicit owner-managed target invalidation. Debugger never disposes user targets.');}
 if(p.startsWith('shadowMap.'))for(const n of this.d.tree.nodes)if(n.shadow)n.shadow.needsUpdate=true;
 if(p.startsWith('shadow.')||p.startsWith('shadowMap.')){if(this.d.renderer.shadowMap)this.d.renderer.shadowMap.needsUpdate=true;}
 if(t.id==='controls'&&o.update)o.update();
 }
 clear(){this.targets.clear();this.byObject.clear();this.resources.clear();this.extras=[];this.d=null;}
}
class ChangeTracker{
 constructor(d){this.d=d;this.records=[];this.sequence=0;this.baselines=new Map();}
 set(t,p,v,oldPacked){
  const root=parts(p)[0],bk=t.id+'|'+root;
  if(t.fields.has(root)&&!this.baselines.has(bk))this.baselines.set(bk,this.d.inspector.encode(t,root,root==='pixelRatio'&&t.id==='renderer'?t.object.getPixelRatio():get(t.object,root)));
  const old=this.d.inspector.read(t,p);
  const oldValue=oldPacked===undefined?this.d.inspector.encode(t,p,old):oldPacked;
  const oldRef=oldPacked!==undefined?null:(t.fields.get(p)?.kind!=='json'&&(old?.isTexture||old?.isMaterial)?old:null);
  this.d.inspector.write(t,p,v);
  const newValue=this.d.inspector.encode(t,p,this.d.inspector.read(t,p));
  if(equal(oldValue,newValue))return null;
  return this.push(t,p,oldValue,newValue,oldRef);
 }
 push(t,p,oldValue,newValue,oldRef){
  const r={id:++this.sequence,objectUuid:t.object.uuid||t.id,objectName:t.object.name||t.label,ownerName:t.locator?.ownerName||null,propertyPath:p,oldValue,newValue,timestamp:new Date().toISOString(),target:t.id,active:true};
  Object.defineProperties(r,{_target:{value:t},_oldRef:{value:oldRef||null}});
  this.records.push(r);
  this.d.logChange([r]);
  return r;
 }
 recordTransform(o,before){
  const t=this.d.inspector.byObject.get(o);
  if(!t)return [];
  const after={position:[o.position.x,o.position.y,o.position.z],rotation:[o.rotation.x,o.rotation.y,o.rotation.z,o.rotation.order],scale:[o.scale.x,o.scale.y,o.scale.z]};
  const out=[];
  for(const key of ['position','rotation','scale']){
   const a=before[key],b=after[key];
   if(!Array.isArray(a)||sameVector(a,b,1e-6))continue;
   const type=key==='rotation'?'Euler':'Vector3';
   out.push(this.push(t,key,{$type:type,value:a.slice()},{$type:type,value:b.slice()},null));
  }
  return out;
 }
 recordCustom(entry){
  const r={id:++this.sequence,objectUuid:entry.target,objectName:entry.name||entry.target,ownerName:entry.ownerName||null,propertyPath:entry.path,oldValue:null,newValue:null,timestamp:new Date().toISOString(),target:entry.target,active:true};
  r.oldText=entry.oldText;
  r.newText=entry.newText;
  if(entry.api)r.api=entry.api;
  if(entry.expr)r.expr=entry.expr;
  if(entry.texPreset)r.texPreset=entry.texPreset;
  if(entry.texAsset)r.texAsset=entry.texAsset;
  Object.defineProperties(r,{_target:{value:null},_oldRef:{value:null},_undo:{value:entry.undo||null}});
  this.records.push(r);
  this.d.logChange([r]);
  return r;
 }
 undo(id){const r=this.records.find(r=>r.id===id&&r.active);if(!r)throw Error('Unknown or inactive change');if(r._undo){r._undo();r.active=false;return;}const later=this.records.some(x=>x.active&&x.id>id&&x.target===r.target&&(x.propertyPath===r.propertyPath||x.propertyPath.startsWith(r.propertyPath+'.')||r.propertyPath.startsWith(x.propertyPath+'.')));if(later)throw Error('Undo conflict: undo newer overlapping edits first');const current=this.d.inspector.encode(r._target,r.propertyPath,this.d.inspector.read(r._target,r.propertyPath));if(!equal(current,r.newValue))throw Error('Undo conflict: value changed externally');this.d.inspector.write(r._target,r.propertyPath,r._oldRef||(r._target.fields.get(r.propertyPath)?.kind==='json'?plain(r.oldValue):this.d.inspector.resolve(r.oldValue)));r.active=false;}
 snapshot(){const groups=new Map();for(const r of this.records.filter(r=>r.active&&r._target)){const key=r.target+'|'+r.propertyPath;if(!groups.has(key))groups.set(key,{target:r.target,locator:r._target.locator,propertyPath:r.propertyPath,oldValue:r.oldValue,newValue:r.newValue,_t:r._target});else groups.get(key).newValue=r.newValue;}
 const all=[...groups.values()],roots=all.filter(c=>!all.some(a=>a.target===c.target&&c.propertyPath.startsWith(a.propertyPath+'.')));
 for(const r of roots){if(!r.propertyPath.includes('.')&&this.baselines.has(r.target+'|'+r.propertyPath))r.oldValue=this.baselines.get(r.target+'|'+r.propertyPath);if(all.some(c=>c.target===r.target&&c.propertyPath.startsWith(r.propertyPath+'.')))r.newValue=this.d.inspector.encode(r._t,r.propertyPath,this.d.inspector.read(r._t,r.propertyPath));}
 return {format:'three-scene-debugger',version:1,changes:roots.filter(r=>!equal(r.oldValue,r.newValue)).map(({oldValue,_t,...r})=>r)};}

 /* 合并同一对象同一属性的多次改动：只留首条旧值与末条新值，供复制/导出输出最终状态。
    records 本身保持逐步原样，撤销仍是单步；首尾相等（改了又改回来）的条目视为无改动丢弃。 */
 collapse(records=this.records){
  const out=[],index=new Map();
  for(const r of records){
   if(!r.active)continue;
   const key=(r.target||'custom')+'|'+r.propertyPath,hit=index.get(key);
   if(!hit){
    const c={id:r.id,objectUuid:r.objectUuid,objectName:r.objectName,ownerName:r.ownerName,propertyPath:r.propertyPath,oldValue:r.oldValue,newValue:r.newValue,timestamp:r.timestamp,target:r.target,active:true,steps:1};
    if(r.oldText!==undefined)c.oldText=r.oldText;
    if(r.newText!==undefined)c.newText=r.newText;
    /* 换材质/编辑器动作要带着可执行信息一起合并，否则复制出去只剩一句注释 */
    if(r.materialSwap)c.materialSwap=r.materialSwap;
    if(r.api)c.api=r.api;
    if(r.expr)c.expr=r.expr;
    if(r.texPreset)c.texPreset=r.texPreset;
    if(r.texAsset)c.texAsset=r.texAsset;
    Object.defineProperties(c,{_target:{value:r._target||null},_oldRef:{value:r._oldRef||null}});
    index.set(key,c);out.push(c);
   }else{
    hit.newValue=r.newValue;hit.id=r.id;hit.timestamp=r.timestamp;hit.steps++;
    if(r.newText!==undefined)hit.newText=r.newText;else delete hit.newText;
    if(r.materialSwap)hit.materialSwap=r.materialSwap;
    if(r.expr)hit.expr=r.expr;
    if(r.texPreset){hit.texPreset=r.texPreset;delete hit.texAsset;}
    if(r.texAsset){hit.texAsset=r.texAsset;delete hit.texPreset;}
   }
  }
  return out.filter(r=>r.newText!==undefined?r.oldText!==r.newText:!equal(r.oldValue,r.newValue));
 }

 clear(){this.records=[];this.baselines.clear();}
}
class PerformanceMonitor{
 constructor(d){this.d=d;this.samples=[];this.fps=null;this.raf=null;}
 tick(time){time=time===undefined?performance.now():time;if(this.samples.length&&time<=this.samples[this.samples.length-1]){this.samples=[];this.fps=null;}this.samples.push(time);while(this.samples.length>120)this.samples.shift();if(this.samples.length>1)this.fps=1000*(this.samples.length-1)/(time-this.samples[0]);}
 sample(){const info=this.d.renderer.info||{},geoms=new Set(),textures=new Set();for(const o of this.d.tree.nodes)if(o.geometry)geoms.add(o.geometry);for(const r of this.d.inspector.resources.values())if(r.isTexture)textures.add(r);let geometryBytes=0,textureBytes=0;const buffers=new Set();for(const g of geoms){for(const a of [...Object.values(g.attributes||{}),g.index].filter(Boolean)){const arr=a.array||a.data?.array;if(arr&&!buffers.has(arr.buffer)){geometryBytes+=arr.byteLength;buffers.add(arr.buffer);}}}for(const t of textures){const i=t.image;if(i?.data?.byteLength)textureBytes+=i.data.byteLength;else if(i?.width&&i?.height)textureBytes+=i.width*i.height*4;}
 return {fps:this.fps,calls:info.render?.calls||0,triangles:info.render?.triangles||0,geometries:info.memory?.geometries||0,textures:info.memory?.textures||0,geometryBytesLowerBound:geometryBytes,textureBaseBytesEstimate:textureBytes};}
 start(){if(typeof requestAnimationFrame!=='function')return;let last=0;const frame=now=>{if(this.d.destroyed)return;if(now-last>500){if(this.d.ui.opened)this.d.ui.performance();last=now;}this.raf=requestAnimationFrame(frame);};this.raf=requestAnimationFrame(frame);}
 stop(){if(this.raf!==null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(this.raf);this.raf=null;this.samples=[];this.d=null;}
}
class UILayer{
 constructor(d,container){
  this.d=d;this.opened=false;this.listeners=[];
  const doc=container?.ownerDocument||(typeof document!=='undefined'?document:null);if(!doc)throw Error('DOM required');
  this.doc=doc;this.host=doc.createElement('div');this.host.dataset.threeSceneDebugger='';(container||doc.body).appendChild(this.host);this.root=this.host.attachShadow?this.host.attachShadow({mode:'open'}):this.host;
 const style=this.el('style');style.textContent=PANEL_CSS;this.root.appendChild(style);
 /* 常驻入口：固定左上角、最高层级、红底；点击开关参数面板 */
 this.launcher=this.el('button',this.root,'3D场景调试大师');this.launcher.type='button';this.launcher.className='tsd-launcher';this.launcher.setAttribute('aria-controls','tsd-panel');
 this.on(this.launcher,'click',()=>this.setOpen(!this.opened));
 this.panel=this.el('section',this.root);this.panel.id='tsd-panel';
 const head=this.el('div',this.panel);head.className='tsd-head';
 this.el('span',head).className='tsd-logo';
 this.el('strong',head,'3D场景调试大师');this.el('span',head,'v'+VERSION).className='tsd-ver';
 const actions=this.el('div',head);actions.className='tsd-head-actions';
 this.button('收起',actions,()=>this.setOpen(false));
 this.button('卸载',actions,()=>this.d.destroy());
 this.logBtn=this.button('改动 0',actions,()=>{if(this.log&&this.log.scrollIntoView)this.log.scrollIntoView({block:'start'});});
 this.makeDraggable(head,this.panel);
 /* 快捷工具条：批量展开折叠 + 布局复位 */
 this.tools=this.el('div',this.panel);this.tools.className='tsd-tools';
 this.button('展开全部',this.tools,()=>this.setAllGroups(true));
 this.button('收起全部',this.tools,()=>this.setAllGroups(false));
 this.button('复位布局',this.tools,()=>this.resetLayout());
 this.el('span',this.tools).className='tsd-sp';
 this.el('small',this.tools,'← 拖左边缘调宽');
 this.body=this.el('div',this.panel);
 this.message=this.el('pre',this.body);this.message.className='error';this.sceneUI();this.postFXUI();this.assetsUI();const perfBox=this.el('details',this.body);perfBox.className='tsd-perf';this.el('summary',perfBox,'性能信息');this.perf=this.el('pre',perfBox);this.button('刷新场景树',this.body,()=>this.d.refresh());this.search=this.el('input',this.body);this.search.placeholder='名称搜索';this.on(this.search,'input',()=>this.tree());this.filter=this.el('select',this.body);this.option(this.filter,'','所有类型');this.on(this.filter,'change',()=>this.tree());this.treeRoot=this.el('div',this.body);
 this.targets=this.el('select',this.body);this.targets.style.width='100%';this.on(this.targets,'change',()=>this.inspect());
 /* 属性 / 材质 两个页签：变换等对象参数与材质参数分栏，互不干扰 */
 this.tab='props';this.matIndex=0;this._matOwner=null;
 /* 贴图库抽屉状态：目标材质 / 目标槽位 / 通道 / 平铺 / 生成尺寸 */
 this.lib=null;this.libOwner=null;this.libSlot='map';this.libKind='diff';this.libRepeat=1;this.libSize=TEX_SIZE_DEFAULT;
 this.tabs=this.el('div',this.body);this.tabs.className='tsd-tabs';this.tabs.setAttribute('role','tablist');
 this.tabProps=this.button('属性',this.tabs,()=>this.setTab('props'));this.tabProps.className='tsd-tab';this.tabProps.setAttribute('role','tab');
 this.tabMat=this.button('材质',this.tabs,()=>this.setTab('material'));this.tabMat.className='tsd-tab';this.tabMat.setAttribute('role','tab');
 this.props=this.el('div',this.body);this.props.className='tsd-pane';
 this.matBar=this.el('div',this.body);this.matBar.className='tsd-pane';
 this.syncTabs();
 const commands=this.el('div',this.body);this.aiPromptBtn=this.button('AI 提示词',commands,()=>{const text=this.d.aiPrompt();this.output.value=text;this.copy(text,this.aiPromptBtn);});this.aiPromptBtn.className='tsd-aiprompt';this.aiPromptBtn.title='生成当前场景与选中对象状态的 AI 提示词：自动复制，并填入下方输出框供查看/编辑';this.button('JSON 快照',commands,()=>this.output.value=JSON.stringify(this.d.exportSnapshot(),null,2));this.button('赋值代码',commands,()=>this.output.value=this.d.exportCode());this.button('完整场景 JSON（存档）',commands,()=>this.output.value=JSON.stringify(this.d.exportFullSceneJSON(),null,2));this.button('恢复输入快照',commands,()=>{const report=this.d.loadSnapshot(this.output.value);this.output.value=JSON.stringify(report,null,2);this.inspect();});this.button('复制输出',commands,()=>this.copy(this.output.value));this.button('保存本地（显式）',commands,()=>this.d.saveSnapshot('manual'));this.button('读取本地',commands,()=>this.d.loadSavedSnapshot('manual'));this.button('清空改动记录',commands,()=>{this.d.clearChanges();this.changes();});this.output=this.el('textarea',this.body);this.output.setAttribute('aria-label','导出或导入内容');this.log=this.el('div',this.body);
 /* 底部固定的大按钮：复制可直接发给 agent 的修改提示词 */
 this.copyBar=this.el('div',this.body);this.copyBar.className='tsd-copybar';
 this.copyPromptBtn=this.button('复制修改提示词',this.copyBar,()=>this.copy(this.d.exportPrompt(),this.copyPromptBtn));
 this.copyPromptBtn.className='tsd-copyall';
 this.makeResizable();
 this.setOpen(false);
 }

 /* 面板开关：关闭时只留左上角入口；选中/拖拽也随面板关闭而停用 */
 setOpen(open){
  const next=!!open,changed=next!==this.opened;
  if(!next)this.closeTextureLibrary();
  this.opened=next;
  if(this.panel)this.panel.hidden=!next;
  if(next&&changed&&this.panel)this.panel.scrollTop=0;
  if(this.launcher){this.launcher.setAttribute('aria-expanded',String(next));this.launcher.dataset.open=String(next);}
  if(!next&&this.d&&!this.d.destroyed&&this.d.selection)this.d.clearSelection();
  if(changed&&this.d&&!this.d.destroyed)this.d.emit('toggle',next);
  if(next&&changed&&this.d&&!this.d.destroyed)this.d.refresh();
  if(this.syncResizer)this.syncResizer();
  return this;
 }

 /* 标题栏拖拽面板；双击标题栏回到默认位置 */
 makeDraggable(handle,panel){
  const view=this.doc.defaultView||globalThis;
  let drag=null;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  this.on(handle,'pointerdown',e=>{
   if(e.button!==undefined&&e.button!==0)return;
   if(e.target?.closest?.('button,input,select,textarea,a'))return;
   const r=panel.getBoundingClientRect();
   panel.style.left=r.left+'px';panel.style.top=r.top+'px';panel.style.right='auto';
   drag={dx:clamp(e.clientX-r.left,0,r.width),dy:clamp(e.clientY-r.top,0,r.height)};
   handle.classList.add('dragging');
   try{handle.setPointerCapture(e.pointerId);}catch(err){}
   e.preventDefault();
  });
  this.on(handle,'pointermove',e=>{
   if(!drag)return;
   const w=panel.offsetWidth;
   const vw=view.innerWidth||this.doc.documentElement.clientWidth||0;
   const vh=view.innerHeight||this.doc.documentElement.clientHeight||0;
   const left=clamp(e.clientX-drag.dx,8,Math.max(8,vw-w-8));
   const top=clamp(e.clientY-drag.dy,8,Math.max(8,vh-56));  // 始终保留标题栏可见
   panel.style.left=left+'px';panel.style.top=top+'px';
   panel.style.maxHeight=Math.max(120,vh-top-8)+'px';       // 往下拖时自动收短，避免内容被挤出视口
   if(this.syncResizer)this.syncResizer();
  });
  const end=e=>{if(!drag)return;drag=null;handle.classList.remove('dragging');try{handle.releasePointerCapture(e.pointerId);}catch(err){}};
  this.on(handle,'pointerup',end);this.on(handle,'pointercancel',end);
  this.on(handle,'dblclick',()=>{panel.style.left='';panel.style.top='';panel.style.right='';panel.style.maxHeight='';if(this.syncResizer)this.syncResizer();});
 }

 sceneUI(){
  const d=this.d,T=d.THREE||{},renderer=d.renderer,scene=d.scene;
  const box=this.el('details',this.body);
  this.el('summary',box,'场景与画面');
  const body=this.el('div',box);

  const modes=[['NoToneMapping','None'],['LinearToneMapping','Linear'],['ReinhardToneMapping','Reinhard'],['CineonToneMapping','Cineon'],['ACESFilmicToneMapping','ACES Filmic'],['AgXToneMapping','AgX'],['NeutralToneMapping','Neutral']].filter(m=>typeof T[m[0]]==='number');
  if(modes.length){
   const row=this.el('label',body);this.el('span',row,'色调映射 toneMapping');
   const sel=this.el('select',row);
   for(const [k,label] of modes){const o=this.el('option',sel,label);o.value=k;}
   const current=modes.find(m=>T[m[0]]===renderer.toneMapping);
   sel.value=current?current[0]:'NoToneMapping';
   this.on(sel,'change',()=>{this.d.set('renderer','toneMapping',T[sel.value]);this.inspect();});
  }

  this.slider(body,'明暗 exposure',renderer.toneMappingExposure,0.1,4,0.01,
   v=>this.d.preview('renderer','toneMappingExposure',v),
   v=>{this.d.commitPreview('renderer','toneMappingExposure',v);this.changes();});

  const envRow=this.el('label',body);this.el('span',envRow,'环境贴图');
  this.envSel=this.el('select',envRow);
  this.on(this.envSel,'change',()=>{this.d.setEnvironment(this.envSel.value);});
  this.envNote=this.el('small',body);this.envNote.className='tsd-hint';
  this.envChanged();

  if('environmentIntensity' in scene)this.slider(body,'环境强度',scene.environmentIntensity,0,3,0.01,
   v=>this.d.preview('scene','environmentIntensity',v),
   v=>{this.d.commitPreview('scene','environmentIntensity',v);this.changes();});
  if('backgroundIntensity' in scene)this.slider(body,'背景亮度',scene.backgroundIntensity,0,3,0.01,
   v=>this.d.preview('scene','backgroundIntensity',v),
   v=>{this.d.commitPreview('scene','backgroundIntensity',v);this.changes();});
  if('backgroundBlurriness' in scene)this.slider(body,'背景虚化',scene.backgroundBlurriness,0,1,0.01,
   v=>this.d.preview('scene','backgroundBlurriness',v),
   v=>{this.d.commitPreview('scene','backgroundBlurriness',v);this.changes();});

  this.checkbox(body,'环境贴图作为背景',!!d._envUseAsBackground,v=>this.d.setEnvBackground(v));

  this.pfInputs=this.pfInputs||new Map();
  const viewSel=this.selectRow(body,'调试视图',POSTFX_VIEWS,d.postfx.state.view,v=>{this.d.setViewMode(v);this.changes();});
  this.pfInputs.set('view',viewSel);

  this.checkbox(body,'阴影 shadowMap',!!renderer.shadowMap.enabled,v=>{this.d.set('renderer','shadowMap.enabled',v);});
  const types=[['BasicShadowMap','Basic'],['PCFShadowMap','PCF'],['PCFSoftShadowMap','PCF Soft'],['VSMShadowMap','VSM']].filter(m=>typeof T[m[0]]==='number');
  if(types.length){
   const current=types.find(m=>T[m[0]]===renderer.shadowMap.type);
   this.selectRow(body,'阴影类型',types,current?current[0]:'PCFSoftShadowMap',v=>{this.d.set('renderer','shadowMap.type',T[v]);});
  }

  this.checkbox(body,'网格地面',!!d.helpers.gridOn,v=>this.d.setGridHelper(v));
  this.checkbox(body,'坐标轴',!!d.helpers.axesOn,v=>this.d.setAxesHelper(v));

  const bar=this.el('div',body);
  this.button('保存截图 PNG',bar,()=>this.d.downloadScreenshot());
  this.button('刷新统计',bar,()=>this.performance());
  this.button('刷新场景树',bar,()=>this.d.refresh());
 }

 /* ---------- 面板宽度拖拽（左侧竖条）+ 宽度记忆 ---------- */
 makeResizable(){
  const view=this.doc.defaultView||globalThis;
  const KEY='tsd:panel:width';
  this.resizer=this.el('div',this.root);this.resizer.className='tsd-resize';
  this.resizer.title='拖动调整面板宽度（双击复位）';this.resizer.setAttribute('role','separator');
  this.resizer.setAttribute('aria-orientation','vertical');this.resizer.setAttribute('aria-label','面板宽度');
  const bounds=()=>{
   const vw=view.innerWidth||this.doc.documentElement.clientWidth||0;
   return {min:300,max:Math.max(320,Math.min(820,vw-24))};
  };
  const apply=w=>{
   if(!this.panel)return;
   const b=bounds(),width=Math.round(Math.max(b.min,Math.min(b.max,w)));
   const vw=view.innerWidth||this.doc.documentElement.clientWidth||0;
   const manual=!!this.panel.style.left;
   const before=this.panel.getBoundingClientRect();
   this.panel.style.width=width+'px';
   if(manual&&vw){                                  // 手动定位过：保持左边界，越界则整体左移
    const left=Math.max(8,Math.min(before.left,vw-width-8));
    this.panel.style.left=left+'px';this.panel.style.right='auto';
   }
   try{globalThis.localStorage&&globalThis.localStorage.setItem(KEY,String(width));}catch(err){}
   this.syncResizer();
  };
  let drag=null;
  this.on(this.resizer,'pointerdown',e=>{
   if(e.button!==undefined&&e.button!==0)return;
   const r=this.panel.getBoundingClientRect();
   drag={x:e.clientX,w:r.width};
   this.resizer.classList.add('dragging');
   try{this.resizer.setPointerCapture(e.pointerId);}catch(err){}
   e.preventDefault();
  });
  this.on(this.resizer,'pointermove',e=>{if(drag)apply(drag.w+(drag.x-e.clientX));});
  const end=e=>{if(!drag)return;drag=null;this.resizer.classList.remove('dragging');try{this.resizer.releasePointerCapture(e.pointerId);}catch(err){}};
  this.on(this.resizer,'pointerup',end);this.on(this.resizer,'pointercancel',end);
  this.on(this.resizer,'dblclick',()=>{if(this.panel){this.panel.style.width='';}try{globalThis.localStorage&&globalThis.localStorage.removeItem(KEY);}catch(err){}this.syncResizer();});
  this.on(view,'resize',()=>this.syncResizer());
  try{
   const saved=globalThis.localStorage&&Number(globalThis.localStorage.getItem(KEY));
   if(saved&&Number.isFinite(saved)){const b=bounds();this.panel.style.width=Math.round(Math.max(b.min,Math.min(b.max,saved)))+'px';}
  }catch(err){}
  this.syncResizer();
 }

 /* 把把手贴到面板左边缘（面板 fixed 定位，滚动不影响） */
 syncResizer(){
  const p=this.panel,r=this.resizer;
  if(!p||!r)return this;
  if(p.hidden){r.style.display='none';return this;}
  const b=p.getBoundingClientRect();
  if(!b.width){r.style.display='none';return this;}
  r.style.display='block';
  r.style.left=(b.left-5)+'px';r.style.top=(b.top+3)+'px';r.style.height=Math.max(24,b.height-6)+'px';
  return this;
 }

 /* 批量展开 / 收起（跳过性能分组） */
 setAllGroups(open){
  if(!this.panel)return this;
  for(const d of this.panel.querySelectorAll('details')){
   if(d.classList&&d.classList.contains('tsd-perf'))continue;
   d.open=!!open;
  }
  return this;
 }

 /* 复位：位置 / 宽度 / 最大高度一起还原 */
 resetLayout(){
  const p=this.panel;if(!p)return this;
  p.style.left='';p.style.top='';p.style.right='';p.style.width='';p.style.maxHeight='';
  try{globalThis.localStorage&&globalThis.localStorage.removeItem('tsd:panel:width');}catch(err){}
  this.syncResizer();
  return this;
 }

 /* 数值输入框：最多 4 位小数，避免 1.0555429404422666 这种长串 */
 fmtDigits(v,n){const k=Math.pow(10,n||4);const x=Math.round(Number(v)*k)/k;return String(Object.is(x,-0)?0:x);}

 /* 数值显示：去掉浮点尾巴 */
 fmt(v){const n=Number(Number(v).toFixed(3));return String(Number.isFinite(n)?n:0);}

 /* 滑块填充进度（WebKit 用渐变轨道，Firefox 用 range-progress） */
 paintRange(input,v,min,max){
  const lo=Number(min),hi=Number(max);
  const p=hi>lo?Math.max(0,Math.min(100,((Number(v)-lo)/(hi-lo))*100)):0;
  if(input&&input.style)input.style.setProperty('--p',p.toFixed(2)+'%');
  return input;
 }

 /* 滑块行骨架：第一行「标签 + 数值框」，第二行整宽滑轨，拖起来行程更长 */
 sliderRow(parent,label,value,min,max,step,digits){
  const row=this.el('label',parent);row.className='tsd-slider';
  this.el('span',row,label);
  const num=this.el('input',row);num.type='number';num.className='tsd-num';
  num.min=min;num.max=max;num.step=step;num.value=digits?this.fmtDigits(value,digits):this.fmt(value);
  num.setAttribute('aria-label',label);
  const input=this.el('input',row);input.type='range';input.min=min;input.max=max;input.step=step;
  input.value=Number(value);input.setAttribute('aria-label',label);
  this.paintRange(input,Number(value),min,max);
  return {row:row,input:input,num:num};
 }


 slider(parent,label,value,min,max,step,onInput,onCommit,digits){
  const c=this.sliderRow(parent,label,value,min,max,step,digits);
  const input=c.input,num=c.num,lo=Number(min),hi=Number(max);
  const show=v=>digits?this.fmtDigits(v,digits):this.fmt(v);
  const clamp=v=>Math.min(hi,Math.max(lo,v));
  this.on(input,'input',()=>{
   const v=Number(input.value);num.value=show(v);this.paintRange(input,v,min,max);onInput(v);
  });
  this.on(input,'change',()=>{
   const v=Number(input.value);num.value=show(v);this.paintRange(input,v,min,max);onCommit(v);
  });
  /* 数值框可直接键入精确值：先夹到范围内，再按一次完整改动提交 */
  this.on(num,'change',()=>{
   let v=Number(num.value);
   if(!Number.isFinite(v)){num.value=this.fmt(input.value);return;}
   v=clamp(v);num.value=this.fmt(v);input.value=v;this.paintRange(input,v,min,max);
   onInput(v);onCommit(v);
  });
  return input;
 }

 checkbox(parent,label,checked,fn){
  const row=this.el('label',parent);this.el('span',row,label);
  const cb=this.el('input',row);cb.type='checkbox';cb.checked=!!checked;
  this.on(cb,'change',()=>fn(cb.checked));
  return cb;
 }
 selectRow(parent,label,options,value,fn){
  const row=this.el('label',parent);this.el('span',row,label);
  const sel=this.el('select',row);
  for(const [k,text] of options){const o=this.el('option',sel,text);o.value=k;}
  sel.value=value;
  this.on(sel,'change',()=>fn(sel.value));
  return sel;
 }
 pfSlider(parent,label,path,min,max,step,digits){
  const value=this.d.getPostFX(path);
  const c=this.sliderRow(parent,label,value,min,max,step,digits);
  const input=c.input,num=c.num,lo=Number(min),hi=Number(max);
  const show=v=>digits?this.fmtDigits(v,digits):this.fmt(v);
  const clamp=v=>Math.min(hi,Math.max(lo,v));
  let pre=null;
  const preview=v=>{if(!pre)pre={path:path,old:this.d.getPostFX(path)};this.d.previewPostFX(path,v);};
  const commit=v=>{this.d.setPostFX(path,v,pre&&pre.path===path?pre.old:undefined);pre=null;this.changes();};
  this.on(input,'input',()=>{
   const v=Number(input.value);num.value=show(v);this.paintRange(input,v,min,max);preview(v);
  });
  this.on(input,'change',()=>{
   const v=Number(input.value);num.value=show(v);this.paintRange(input,v,min,max);commit(v);
  });
  this.on(num,'change',()=>{
   let v=Number(num.value);
   if(!Number.isFinite(v)){num.value=show(input.value);return;}
   v=clamp(v);num.value=show(v);input.value=v;this.paintRange(input,v,min,max);
   preview(v);commit(v);
  });
  this.pfInputs.set(path,input);
  return input;
 }
 postFXUI(){
  const d=this.d;
  const box=this.el('details',this.body);
  this.el('summary',box,'后期处理（Bloom / 调色 / 暗角 / 色差 / 颗粒）');
  const body=this.el('div',box);
  this.pfInputs=this.pfInputs||new Map();

  this.pfStatusEl=this.el('div',body);this.pfStatusEl.className='tsd-pf-status';
  const master=this.checkbox(body,'启用后期处理',d.postfx.state.enabled,v=>{d.setPostFX('enabled',v);this.changes();});
  this.pfInputs.set('enabled',master);
  this.pfMasterRow=master.parentElement||null;
  this.pfMasterText=this.pfMasterRow?this.pfMasterRow.querySelector('span'):null;
  this.pfHint=this.el('small',body);this.pfHint.className='tsd-hint';

  const group=title=>{const g=this.el('div',body);g.className='tsd-pf-group';this.el('strong',g,title);return g;};

  const bloom=group('Bloom');
  const bloomOn=this.checkbox(bloom,'Bloom 开关',d.postfx.state.bloom.enabled,v=>d.setPostFX('bloom.enabled',v));
  this.pfInputs.set('bloom.enabled',bloomOn);
  this.pfSlider(bloom,'强度 strength','bloom.strength',0,3,0.01);
  this.pfSlider(bloom,'半径 radius','bloom.radius',0,1,0.01);
  this.pfSlider(bloom,'阈值 threshold','bloom.threshold',0,2,0.01);

  const bokeh=group('虚化 · BokehPass 景深');
  const bokehOn=this.checkbox(bokeh,'启用虚化（BokehPass，默认关）',d.postfx.state.bokeh.enabled,v=>d.setPostFX('bokeh.enabled',v));
  this.pfInputs.set('bokeh.enabled',bokehOn);
  this.pfSlider(bokeh,'焦点 focus（世界单位）','bokeh.focus',0,100,0.05);
  this.pfSlider(bokeh,'光圈 aperture（越大景深越浅）','bokeh.aperture',0,0.05,0.0001,4);
  this.pfSlider(bokeh,'最大模糊 maxblur','bokeh.maxblur',0,0.2,0.001);
  const bokehBar=this.el('div',bokeh);
  this.button('对焦到观察中心 / 选中物体',bokehBar,()=>{d.focusBokeh();});
  this.bokehNote=this.el('small',bokeh);this.bokehNote.className='tsd-hint';

  const grade=group('色彩校正');
  this.pfSlider(grade,'亮度 brightness','grade.brightness',-1,1,0.01);
  this.pfSlider(grade,'对比度 contrast','grade.contrast',0,2,0.01);
  this.pfSlider(grade,'饱和度 saturation','grade.saturation',0,2,0.01);
  this.pfSlider(grade,'色温 temperature','grade.temperature',-1,1,0.01);
  this.pfSlider(grade,'色调 tint','grade.tint',-1,1,0.01);

  const vignette=group('暗角');
  this.pfSlider(vignette,'强度 amount','vignette.amount',0,1,0.01);
  this.pfSlider(vignette,'范围 softness','vignette.softness',0.05,1.5,0.01);

  const extras=group('镜头与风格');
  this.pfSlider(extras,'色差 aberration','aberration',0,8,0.05);
  this.pfSlider(extras,'颗粒 grain','grain',0,1,0.01);
  this.pfSlider(extras,'锐化 sharpen','sharpen',0,1,0.01);
  this.pfSlider(extras,'描边 outline','outline',0,1,0.01);
  this.pfSlider(extras,'像素化 pixelate','pixelate',1,24,1);

  const bar=this.el('div',body);
  this.button('重置后期',bar,()=>d.resetPostFX());
  this.button('复制后期参数',bar,()=>this.copy(this.d.exportPostFXMarkdown()));
  this.postfxStatus();
 }
 assetsUI(){
  const d=this.d;
  const box=this.el('details',this.body);
  this.el('summary',box,'素材库（HDR 天空盒 / PBR 贴图）');
  const body=this.el('div',box);
  this.assetNote=this.el('small',body);this.assetNote.className='tsd-hint';
  this.el('strong',body,'HDR 环境 / 天空盒').className='tsd-sub';
  this.assetEnvGrid=this.el('div',body);this.assetEnvGrid.className='tsd-asset-grid';
  this.el('strong',body,'材质贴图 → 当前选中材质').className='tsd-sub';
  const slotRow=this.el('label',body);this.el('span',slotRow,'赋给槽位');
  this.assetSlot=this.el('select',slotRow);
  for(const slot of Object.keys(ASSET_SLOT_KIND)){const o=this.el('option',this.assetSlot,slot+' · '+(ASSET_KIND_LABEL[ASSET_SLOT_KIND[slot]]||''));o.value=slot;}
  this.assetSlot.value='map';
  this.assetGrid=this.el('div',body);this.assetGrid.className='tsd-asset-grid';
  const bar=this.el('div',body);
  this.button('重新加载素材',bar,()=>{const a=d.assets;if(!a||!a.enabled)throw Error('未配置 assets 路径');a.status='loading';a.ready=a.load();this.assetsChanged();});
  this.assetsChanged();
 }
 tile(parent,thumb,label,title,fn){
  const b=this.el('button',parent);b.type='button';b.className='tsd-asset';b.title=title;
  if(thumb){const img=this.el('img',b);img.className='tsd-thumb';img.src=thumb;img.alt='';img.loading='lazy';}
  else b.classList.add('no-thumb');
  this.el('span',b,label);
  this.on(b,'click',fn);
  return b;
 }
 assetsChanged(){
  if(!this.assetEnvGrid||!this.assetGrid)return;
  this.empty(this.assetEnvGrid);this.empty(this.assetGrid);
  const a=this.d.assets;
  if(!a||!a.enabled){this.assetNote.textContent='未配置 assets 路径：传入 { assets: "./assets/" } 后可用 HDR 与贴图素材。';return;}
  if(a.status==='loading'){this.assetNote.textContent='素材清单加载中…';return;}
  if(a.status==='error'){this.assetNote.textContent='素材清单加载失败：'+a.error+'（仍可使用程序化环境）';return;}
  this.assetNote.textContent='已就绪：'+a.hdrItems.length+' 个 HDR 环境、'+a.texItems.length+' 套 PBR 贴图（CC0）。';
  for(const h of a.hdrItems)this.tile(this.assetEnvGrid,h.thumb,h.label,'应用 HDR 环境：'+h.label,()=>{this.d.setEnvironment('hdr:'+h.id);this.envChanged();});
  for(const t of a.texItems)this.tile(this.assetGrid,t.thumb,t.label,'赋给 '+this.assetSlot.value,async()=>{
   const sel=this.d.getSelected();
   if(!sel){this.message.textContent='先在画布中选中一个带材质的物体，再点贴图';return;}
   if(!sel.material){this.message.textContent='该对象没有材质';return;}
   const slot=this.assetSlot.value,kind=ASSET_SLOT_KIND[slot]||'diff';
   await this.d.applyAssetTexture('object:'+sel.uuid,slot,t.id,kind);
   this.message.textContent='已赋予 '+t.label+' → '+slot;
   this.inspect();this.changes();
  });
 }
 envChanged(){
  if(!this.envSel)return;
  this.envSel.replaceChildren();
  for(const p of this.d.envLib.presets())this.option(this.envSel,p.id,p.label);
  this.envSel.value=this.d.envLib.current;
  if(this.envNote){
   const a=this.d.assets,lib=this.d.envLib;
   this.envNote.textContent=lib.loading?'正在加载 '+lib.loading+' …':(a&&a.enabled?(a.status==='ready'?'HDR 环境 '+a.hdrItems.length+' 个，可直接切换。':(a.status==='error'?'素材库不可用：'+a.error:'素材库加载中…')):'未配置素材库（仅程序化环境）。');
  }
 }
 /* 后期页签的实时状态：接管了哪个 pass、附加 pass 在哪一位、当前是「交还宿主」还是「tsd 接管」 */
 postfxStatus(){
  const el=this.pfStatusEl;
  if(!el||!this.d||!this.d.postfx)return;
  const fx=this.d.postfx,st=fx.state;
  const name=p=>p&&p.constructor&&p.constructor.name||'?';
  let text='',warn=false;
  if(fx.composerMode==='off'){
   text='未注册 EffectComposer：走内置离屏链路（离屏 HDR → Bloom → 合成），关闭时直通、零开销。';
   if(this.pfMasterText)this.pfMasterText.textContent='启用后期处理';
  }else if(fx.composerMode==='attach'){
   const i=fx.composer?fx.composer.passes.indexOf(fx.hostBloom):-1;
   text='已接管宿主后期：'+name(fx.hostBloom)+'（passes['+i+']）的 strength / radius / threshold 直连面板，'
    +'Bloom 开关就是它的 enabled；调色 / 暗角 / 色差由附加 pass 处理（passes['+fx.composerIndex+']，'
    +(st.enabled&&fx.extrasActive()?'已启用':'无调色改动，暂不参与渲染')+'）。';
   if(this.pfMasterText)this.pfMasterText.textContent='接管后期处理（关闭即完全交还宿主）';
  }else{
   text='宿主 composer 里没有 Bloom：勾选「启用后期处理」会往 passes['+fx.composerIndex+'] 插入一条后期 pass（'
    +(fx.composerLinear?'输出线性值，编码交给宿主收尾':'在链末自己完成色调映射与编码')+'）。'
    +'若觉得光晕太弱，继续把阈值降到 0.15–0.3：它是线性 HDR 亮度，1.0 只让白点以上的像素发光。';
   warn=!st.enabled;
   if(this.pfMasterText)this.pfMasterText.textContent='启用后期处理（插入 composer pass）';
  }
  if(el.textContent!==text)el.textContent=text;
  el.classList.toggle('tsd-pf-warn',warn);
  if(this.pfHint){
   const off=!st.enabled;
   const hint=off
    ?'当前未启用：参数不会作用到画面。直接拖任意滑块会自动打开（也可以勾上面的开关）。'
    :(fx.composerMode==='off'
     ?'处理链路：离屏 HDR 渲染 → Bloom 阈值/多级模糊 → 合成（色调映射 + 调色）。关闭时直通，零开销。'
     :'画面由宿主 composer 输出：关闭「接管」会把宿主 Bloom 的开关与参数原样还回去，便于 A/B 对比。');
   if(this.pfHint.textContent!==hint)this.pfHint.textContent=hint;
  }
  if(this.bokehStatus)this.bokehStatus();
 }
 /* 虚化分组的状态行：可用性 / 插在第几位 / 宿主是否已有景深 pass */
 bokehStatus(){
  const el=this.bokehNote,fx=this.d&&this.d.postfx;
  if(!el||!fx)return;
  const b=fx.state.bokeh,info=fx.bokehInfo();
  if(!info.available){
   el.textContent='未注入 BokehPass：创建调试器时传 { bokehPass: BokehPass }（import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js"）。面板不自行打包第二份 three。';
   el.classList.add('tsd-pf-warn');
   return;
  }
  el.classList.remove('tsd-pf-warn');
  let text;
  if(!b.enabled){
   text='默认关闭。开启后'+(info.mode==='composer'?'在编码 pass 之前插一条 BokehPass':'走自带离屏链路插一趟虚化')
    +'；关闭会把整条 pass 从链上摘掉，画面与没开过完全一致。';
  }else if(b.enabled&&!info.active){
   /* 勾着但没出画面：链上找不到 / 被 enabled=false 跳过 —— 说清楚，别让用户对着没变化的画面猜 */
   text='虚化已勾选，但通道当前未生效（未插入 composer 或 pass 处于禁用态）。点一下「启用虚化」重插一次。';
   el.classList.add('tsd-pf-warn');
  }else{
   text='已插入 BokehPass'+(info.index>=0?'（passes['+info.index+']）':'（离屏链路）')+'：每帧会用 MeshDepthMaterial 把整个场景再渲一遍取深度。'
    +'焦点 '+this.fmt(b.focus)+' / 光圈 '+this.fmtDigits(b.aperture,4)+' / 最大模糊 '+this.fmt(b.maxblur)
    +'（光圈已按场景尺度自适应，想让背景更糊就整体调大，反之调小）。';
  }
  if(info.hostDof)text+=' 注意：宿主 composer 里已有 '+info.hostDof+'，两层景深会互相糊，建议先关掉它。';
  if(el.textContent!==text)el.textContent=text;
 }
 syncPostFX(){
  const st=this.d.postfx.state;
  if(this.pfInputs)for(const [k,input] of this.pfInputs){
   if(k==='enabled')input.checked=!!st.enabled;
   else if(k==='bokeh.enabled')input.checked=!!st.bokeh.enabled;
   else if(k==='view')input.value=st.view;
   else{
    const v=this.d.getPostFX(k);input.value=v;this.paintRange(input,v,input.min,input.max);
    const num=input.parentElement&&input.parentElement.querySelector('.tsd-num');
    const dig=Number(input.step)<0.001?4:0;
    if(num)num.value=dig?this.fmtDigits(v,dig):this.fmt(v);
   }
  }
  this.postfxStatus();
 }
 textureControl(t,p,host){
  const v=this.d.inspector.read(t,p);
  const row=this.el('div',host);row.className='tsd-tex-row';
  this.el('span',row,p).className='tsd-tex-name';
  const btn=this.el('button',row);btn.type='button';btn.className='tsd-tex-btn';
  const preset=v&&v.userData?v.userData.tsdPreset:null;
  const asset=v&&v.userData?v.userData.tsdAsset:null;
  const thumb=preset?this.d.textures.thumb(preset.id,preset.kind,72):(asset?asset.thumb:null);
  if(thumb){const img=this.el('img',btn);img.src=thumb;img.alt='';img.className='tsd-mini';}
  else btn.classList.add('no-thumb');
  const label=v?(preset?preset.label+' · '+(TEX_KIND_LABEL[preset.kind]||preset.kind):(asset?asset.label+' · '+(ASSET_KIND_LABEL[asset.kind]||asset.kind):(v.name||('Texture '+String(v.uuid).slice(0,6))))):'未设置';
  this.el('span',btn,label);
  const go=this.el('span',btn,'选择…');go.className='tsd-tex-go';
  btn.title='打开贴图库，为 '+p+' 选择贴图';
  this.on(btn,'click',()=>this.openTextureLibrary(t.id,p,{map:'diff',normalMap:'nor',roughnessMap:'rough',bumpMap:'nor',aoMap:'rough',metalnessMap:'rough'}[p]||'diff'));
  btn.setAttribute('aria-label',t.id+' '+p+' 选择贴图');
  return row;
 }

 /* ---------- 贴图库抽屉：自制程序化贴图 + 素材包 + 场景贴图 ---------- */
 buildTextureLibrary(){
  if(this.lib)return this.lib;
  const lib=this.el('div',this.root);lib.className='tsd-lib';lib.hidden=true;
  lib.setAttribute('role','dialog');lib.setAttribute('aria-label','贴图库');
  const back=this.el('div',lib);back.className='tsd-lib-back';
  this.on(back,'click',()=>this.closeTextureLibrary());
  const card=this.el('div',lib);card.className='tsd-lib-card';
  const head=this.el('div',card);head.className='tsd-lib-head';
  this.el('strong',head,'贴图库');
  this.libTarget=this.el('small',head,'—');this.libTarget.className='tsd-lib-sub';
  const x=this.el('button',head,'✕');x.type='button';x.className='tsd-lib-x';x.setAttribute('aria-label','关闭贴图库');
  this.on(x,'click',()=>this.closeTextureLibrary());
  const tabs=this.el('div',card);tabs.className='tsd-lib-tabs';
  this.libTabs={};
  for(const kind of ['diff','nor','rough','set']){
   const label=kind==='set'?'整套':TEX_KIND_LABEL[kind];
   const b=this.el('button',tabs,label);b.type='button';b.className='tsd-lib-tab';
   this.on(b,'click',()=>{
    this.libKind=kind;
    /* 切通道时把目标槽位跟着切到该材质真实存在的槽，避免「选了法线却写进 map」 */
    if(kind!=='set'&&this.libOwner){
     const want={diff:'map',nor:'normalMap',rough:'roughnessMap'}[kind];
     const t=this.safeTarget(this.libOwner);
     if(want&&t&&t.fields&&t.fields.has(want))this.libSlot=want;
    }
    this.syncTextureLibrary();
   });
   this.libTabs[kind]=b;
  }
  const body=this.el('div',card);body.className='tsd-lib-body';
  const s1=this.el('div',body);s1.className='tsd-lib-sec';
  this.libSecTitle=this.el('strong',s1,'自制贴图库 · 现场生成，不依赖素材文件');this.libSecTitle.className='tsd-sub';
  this.libGrid=this.el('div',s1);this.libGrid.className='tsd-lib-grid';
  const s2=this.el('div',body);s2.className='tsd-lib-sec';
  this.el('strong',s2,'素材包 · 下载素材（需配置 assets）').className='tsd-sub';
  this.libAssetGrid=this.el('div',s2);this.libAssetGrid.className='tsd-lib-grid';
  const s3=this.el('div',body);s3.className='tsd-lib-sec';
  this.el('strong',s3,'场景已有贴图 / 清除').className='tsd-sub';
  this.libScene=this.el('div',s3);this.libScene.className='tsd-lib-chips';
  const foot=this.el('div',card);foot.className='tsd-lib-foot';
  this.libNote=this.el('small',foot,'点击缩略图立即应用');this.libNote.className='tsd-lib-note';
  const rep=this.el('label',foot);rep.className='tsd-lib-field';
  this.el('span',rep,'平铺');
  const repIn=this.el('input',rep);repIn.type='number';repIn.min='1';repIn.max='8';repIn.step='1';repIn.value=String(this.libRepeat||1);
  this.on(repIn,'change',()=>{this.libRepeat=Math.max(1,Math.min(8,Math.round(Number(repIn.value)||1)));repIn.value=String(this.libRepeat);});
  const sz=this.el('label',foot);sz.className='tsd-lib-field';
  this.el('span',sz,'尺寸');
  const szSel=this.el('select',sz);
  for(const s of [128,256,512,1024])this.option(szSel,String(s),s+' px');
  szSel.value=String(this.libSize||TEX_SIZE_DEFAULT);
  this.on(szSel,'change',()=>{this.libSize=Number(szSel.value)||TEX_SIZE_DEFAULT;});
  this.lib=lib;
  this.on(this.doc,'keydown',e=>{if(this.lib&&!this.lib.hidden&&(e.key==='Escape'||e.keyCode===27))this.closeTextureLibrary();});
  return lib;
 }
 safeTarget(id){
  try{return this.d.target(id);}catch(e){return null;}
 }
 openTextureLibrary(targetId,slot,kind){
  this.buildTextureLibrary();
  this.libOwner=targetId||null;
  this.libSlot=slot||'map';
  this.libKind=kind||({map:'diff',normalMap:'nor',roughnessMap:'rough'}[this.libSlot])||'diff';
  this.lib.hidden=false;
  this.syncTextureLibrary();
 }
 closeTextureLibrary(){
  if(this.lib)this.lib.hidden=true;
 }
 syncTextureLibrary(){
  const lib=this.lib;if(!lib||lib.hidden)return;
  const kind=this.libKind||'diff';
  for(const k of Object.keys(this.libTabs))this.libTabs[k].classList.toggle('on',k===kind);
  const slot=this.libSlot||'map';
  const owner=this.libOwner?this.safeTarget(this.libOwner):null;
  const ownerName=owner?((owner.locator&&owner.locator.ownerName)||(owner.object&&owner.object.name)||owner.label||'未命名'):'未选中';
  const applyTo=kind==='set'?'map + normalMap + roughnessMap':(slot+'（'+(TEX_SLOT_HINT[slot]||'基础色')+'）');
  this.libTarget.textContent=ownerName+' → '+applyTo;
  this.libNote.textContent=owner?'点击缩略图写入 '+applyTo:'先选中一个带材质的物体';
  const studio=this.d.textures;
  const thumbKind=kind==='set'?'diff':kind;
  if(this.libSecTitle)this.libSecTitle.textContent='自制贴图库 · 12 套 · 当前'+(kind==='set'?'整套写入':'只写'+(TEX_KIND_LABEL[kind]||''));
  /* 自制贴图 */
  this.empty(this.libGrid);
  for(const p of studio.presets()){
   const b=this.el('button',this.libGrid);b.type='button';b.className='tsd-lib-tile';
   b.title=p.label+' · '+p.hint+' · '+TEX_KIND_LABEL[thumbKind];
   const src=studio.thumb(p.id,thumbKind,96);
   if(src){const img=this.el('img',b);img.src=src;img.alt='';img.loading='lazy';}
   const cap=this.el('span',b,p.label);cap.className='tsd-lib-cap';
   this.on(b,'click',()=>this.libraryApply(p.id));
  }
  /* 素材包 */
  this.empty(this.libAssetGrid);
  const a=this.d.assets;
  if(!a||!a.enabled||!a.texItems.length){
   const tip=this.el('small',this.libAssetGrid,(a&&a.enabled)?'素材清单加载中…':'未配置 assets 路径，自制贴图库照常可用');
   tip.className='tsd-lib-empty';
  }else{
   for(const item of a.texItems){
    const b=this.el('button',this.libAssetGrid);b.type='button';b.className='tsd-lib-tile';
    if(item.thumb){const img=this.el('img',b);img.src=item.thumb;img.alt='';img.loading='lazy';}
    const cap=this.el('span',b,item.label);cap.className='tsd-lib-cap';
    const has=kind==='set'?(item.files&&(item.files.diff||item.files.nor)):!!(item.files&&item.files[thumbKind]);
    if(!has){
     const badge=this.el('span',b,'缺此通道');badge.className='tsd-lib-kind';
     b.disabled=true;
    }
    this.on(b,'click',()=>this.libraryApplyAsset(item));
   }
  }
  /* 场景贴图 + 清除 */
  this.empty(this.libScene);
  const none=this.el('button',this.libScene,'无（清除该槽）');none.type='button';none.className='tsd-lib-chip';
  this.on(none,'click',()=>this.libraryClear());
  let count=0;
  for(const [uuid,r] of this.d.inspector.resources){
   if(!r.isTexture)continue;
   count++;
   const chip=this.el('button',this.libScene,r.name||('Texture '+String(uuid).slice(0,6)));chip.type='button';chip.className='tsd-lib-chip';
   chip.title=uuid;
   this.on(chip,'click',()=>this.libraryUseSceneTexture(r));
  }
  if(!count){const tip=this.el('small',this.libScene,'场景里还没有贴图');tip.className='tsd-lib-empty';}
 }
 async libraryApply(presetId){
  const owner=this.libOwner;
  if(!owner)throw Error('先在画布或场景树里选中一个带材质的物体');
  const kind=this.libKind||'diff';
  const slots=kind==='set'?['map','normalMap','roughnessMap']:[this.libSlot];
  await this.d.applyTexturePreset(owner,presetId,{slots:slots,kind:kind==='set'?null:kind,repeat:this.libRepeat,size:this.libSize});
  const p=this.d.textures.preset(presetId);
  this.message.className='';
  this.message.textContent='已应用 '+(p?p.label:presetId)+' → '+slots.join(' / ')+(this.libRepeat>1?'（平铺 '+this.libRepeat+'）':'');
  this.closeTextureLibrary();
  this.inspect();this.changes();
 }
 async libraryApplyAsset(item){
  const owner=this.libOwner;
  if(!owner)throw Error('先在画布或场景树里选中一个带材质的物体');
  const kind=this.libKind||'diff';
  const pairs=kind==='set'?[['map','diff'],['normalMap','nor'],['roughnessMap','rough']]:[[this.libSlot,kind]];
  const usable=pairs.filter(([slot,k])=>item.files&&item.files[k]);
  if(!usable.length)throw Error(item.label+' 缺少'+(kind==='set'?'可用':'该')+'通道贴图');
  for(const [slot,k] of usable)await this.d.applyAssetTexture(owner,slot,item.id,k,{index:this.matIndex||0});
  this.message.className='';
  this.message.textContent='已应用素材 '+item.label+' → '+usable.map(p=>p[0]).join(' / ');
  this.closeTextureLibrary();
  this.inspect();this.changes();
 }
 libraryUseSceneTexture(tex){
  const owner=this.libOwner;
  if(!owner)throw Error('先在画布或场景树里选中一个带材质的物体');
  const kind=this.libKind||'diff';
  const slots=kind==='set'?['map','normalMap','roughnessMap']:[this.libSlot];
  let done=0;
  for(const slot of slots){
   const t=this.d.materialTarget(owner,slot,this.matIndex||0);
   if(!t||!t.fields.has(slot))continue;
   this.d.set(t.id,slot,tex);done++;
  }
  if(!done)throw Error('该材质没有可写入的贴图槽位');
  this.closeTextureLibrary();
  this.inspect();this.changes();
 }
 libraryClear(){
  const owner=this.libOwner;
  if(!owner)throw Error('先在画布或场景树里选中一个带材质的物体');
  const kind=this.libKind||'diff';
  const slots=kind==='set'?['map','normalMap','roughnessMap']:[this.libSlot];
  let done=0;
  for(const slot of slots){
   const t=this.d.materialTarget(owner,slot,this.matIndex||0);
   if(!t||!t.fields.has(slot))continue;
   this.d.set(t.id,slot,null);done++;
  }
  if(!done)throw Error('该材质没有可清除的贴图槽位');
  this.closeTextureLibrary();
  this.inspect();this.changes();
 }
 /* 材质类型切换控件：object 目标与「直接选中的材质」共用同一套。
    ownerTid 是承载材质的 Object3D 目标 id，slotIndex 是材质数组下标。 */
 materialTypeRows(host,ownerTid,slotIndex,m){
  const ownerT=this.d.target(ownerTid),o=ownerT.object;
  const types=this.d.getMaterialTypes(ownerTid);
  const typeRow=this.el('label',host);typeRow.className='tsd-type-row';
  this.el('span',typeRow,'材质类型');
  const typeSel=this.el('select',typeRow);
  for(const name of types)this.option(typeSel,name,name+(MATERIAL_LABELS[name]?' · '+MATERIAL_LABELS[name]:''));
  if(types.indexOf(m.type)<0)this.option(typeSel,m.type,m.type+'（当前，不可换）');
  typeSel.value=m.type;
  typeSel.title='换材质会新建一个材质实例，旧材质不会被销毁（可能仍被其他对象使用）';
  typeSel.setAttribute('aria-label','材质类型');
  const switchers=this.el('div',host);switchers.className='tsd-mat-switch';
  const keepLabel=this.el('label',switchers);
  const keep=this.el('input',keepLabel);keep.type='checkbox';keep.checked=true;
  keep.title='把旧材质的颜色、贴图、透明度、双面等搬到新材质上';
  this.el('span',keepLabel,'保留参数与贴图');
  const others=this.d.materialUsers(m).filter(x=>x!==o);
  let spread=null;
  if(others.length){
   const spLabel=this.el('label',switchers);spread=this.el('input',spLabel);spread.type='checkbox';
   spread.title='这些对象共用同一个材质实例，勾选后一起换成新材质';
   this.el('span',spLabel,'同步共用该材质的 '+(others.length+1)+' 个对象');
  }
  this.on(typeSel,'change',()=>{
   const before=m.type,next=typeSel.value;
   if(next===before)return;
   try{
    this.d.setMaterial(ownerTid,next,{slot:slotIndex,copy:keep.checked,spread:!!(spread&&spread.checked)});
    this.message.className='';this.message.textContent='材质已切换：'+before+' → '+next+(spread&&spread.checked?'（已同步共用对象）':'');
   }catch(e){
    typeSel.value=before;this.message.className='error';this.message.textContent='切换失败：'+e.message;
   }
   this.changes();
  });
 }
 materialBar(t){
  this.empty(this.matBar);
  const o=t.object;
  if(!o||!o.isObject3D)return;
  const slots=this.materialSlots(t);
  if(!slots.length){this.el('small',this.matBar,'该对象没有材质。');return;}
  if(this._matOwner!==o.uuid){this._matOwner=o.uuid;this.matIndex=0;}
  let slot=slots.find(s=>s.index===this.matIndex);
  if(!slot){this.matIndex=slots[0].index;slot=slots[0];}
  const mt=slot.target,m=slot.object;
  if(slots.length>1){
   const pickRow=this.el('label',this.matBar);this.el('span',pickRow,'材质槽位');
   const pick=this.el('select',pickRow);
   for(const s of slots)this.option(pick,String(s.index),'#'+(s.index+1)+' '+(s.object.type||'Material'));
   pick.value=String(slot.index);
   this.on(pick,'change',()=>{this.matIndex=Number(pick.value);this.materialBar(t);});
  }
  /* 材质类型：换的是材质本身（新实例 + 搬运参数/贴图），不是改某个参数 */
  this.materialTypeRows(this.matBar,t.id,slot.index,m);
  this.el('h3',this.matBar,'材质 '+(m.type||'Material')+(slots.length>1?'（第 '+(slot.index+1)+' / '+slots.length+' 个）':''));
  const colorRow=this.el('label',this.matBar);this.el('span',colorRow,'基础色');
  const colorIn=this.el('input',colorRow);colorIn.type='color';colorIn.value='#'+m.color.getHexString();
  this.on(colorIn,'change',()=>{this.d.set(mt.id,'color',colorIn.value);});
  const num=(label,path,min,max,step)=>{
   if(m[path]===undefined)return;
   this.slider(this.matBar,label,m[path],min,max,step,
    v=>this.d.preview(mt.id,path,v),
    v=>{this.d.commitPreview(mt.id,path,v);this.changes();});
  };
  num('粗糙度 roughness','roughness',0,1,0.01);
  num('金属度 metalness','metalness',0,1,0.01);
  num('不透明度 opacity','opacity',0,1,0.01);
  num('发光强度 emissiveIntensity','emissiveIntensity',0,4,0.01);
  num('环境反射 envMapIntensity','envMapIntensity',0,3,0.01);
  if(m.emissive){
   const eRow=this.el('label',this.matBar);this.el('span',eRow,'自发光颜色');
   const eIn=this.el('input',eRow);eIn.type='color';eIn.value='#'+m.emissive.getHexString();
   this.on(eIn,'change',()=>{this.d.set(mt.id,'emissive',eIn.value);});
  }
  for(const [k,label] of [['transparent','透明'],['wireframe','线框'],['flatShading','平面着色'],['depthTest','深度测试'],['castShadow','投射阴影']]){
   const host=k==='castShadow'?o:m;
   if(host[k]===undefined)continue;
   const row=this.el('label',this.matBar);this.el('span',row,label);
   const cb=this.el('input',row);cb.type='checkbox';cb.checked=!!host[k];
   this.on(cb,'change',()=>{this.d.set(k==='castShadow'?t.id:mt.id,k,cb.checked);});
  }
  if(mt.fields.has('map')||mt.fields.has('normalMap')||mt.fields.has('roughnessMap')){
   const texBox=this.el('div',this.matBar);texBox.className='tsd-texbox';
   const texHead=this.el('div',texBox);texHead.className='tsd-tex-head';
   this.el('h3',texHead,'贴图');
   this.button('贴图库…',texHead,()=>this.openTextureLibrary(mt.id,'map','set'));
   for(const p of ['map','normalMap','roughnessMap'])if(mt.fields.has(p))this.textureControl(mt,p,texBox);
  }
  /* 全部材质字段：原先要点「打开完整材质属性」跳到材质目标，现在就地展开 */
  const all=this.el('details',this.matBar);all.className='tsd-mat-all';
  this.el('summary',all,'全部材质参数（'+mt.fields.size+' 项）');
  for(const [p,f] of mt.fields)this.control(mt,p,f,all);
 }

 copy(text,btn){
  const n=text.length;
  const ok=()=>{this.message.className='';this.message.textContent='已复制到剪贴板（'+n+' 字符）';this.flashCopy(btn,'ok',n);};
  const manual=()=>{
   this.output.value=text;
   this.output.hidden=false;
   try{this.output.focus();this.output.select();this.output.setSelectionRange(0,n);}catch(err){}
   try{this.output.scrollIntoView({block:'center'});}catch(err){}
   this.message.className='';this.message.textContent='浏览器拦截了自动复制：内容已填入并全选下方「导出或导入内容」输出框，直接按 Ctrl+C（Mac 为 ⌘C）即可复制。';
   this.flashCopy(btn,'fail',n);
  };
  /* 1) 同步 execCommand：仍在用户手势内，覆盖无 Clipboard API 的环境（http 非安全上下文、部分内嵌 iframe） */
  let synced=false;
  try{
   const ta=this.doc.createElement('textarea');
   ta.value=text;ta.setAttribute('readonly','');
   ta.style.cssText='position:fixed;top:0;left:-9999px;width:8px;height:8px;opacity:0';
   (this.doc.body||this.body).appendChild(ta);
   ta.focus();ta.select();ta.setSelectionRange(0,n);
   synced=!!this.doc.execCommand('copy');
   ta.blur();ta.remove();
  }catch(err){synced=false;}
  if(synced){ok();return;}
  /* 2) 异步 Clipboard API：标准安全上下文下的首选 */
  const clip=(globalThis.navigator&&globalThis.navigator.clipboard&&globalThis.navigator.clipboard.writeText)?globalThis.navigator.clipboard:null;
  if(clip){clip.writeText(text).then(()=>ok()).catch(()=>manual());return;}
  /* 3) 全部被拦：进入手动复制兜底 */
  manual();
 }
 flashCopy(btn,state,n){
  if(!btn)return;
  if(!this._copyBtns)this._copyBtns=[];
  if(this._copyT)clearTimeout(this._copyT);
  if(!btn.dataset.tsdLabel)btn.dataset.tsdLabel=btn.textContent;
  if(!this._copyBtns.includes(btn))this._copyBtns.push(btn);
  btn.classList.remove('tsd-copy-ok','tsd-copy-fail');
  btn.classList.add(state==='ok'?'tsd-copy-ok':'tsd-copy-fail');
  btn.textContent=state==='ok'?('✓ 已复制 '+n+' 字符'):'⚠ 自动复制被拦截，请按 Ctrl+C 复制';
  this._copyT=setTimeout(()=>{
   for(const b of this._copyBtns){
    b.classList.remove('tsd-copy-ok','tsd-copy-fail');
    if(b!==this.copyPromptBtn)b.textContent=b.dataset.tsdLabel||'复制';
    b.removeAttribute('data-tsd-label');
   }
   this._copyBtns=[];
   this.changes();
  },2600);
 }
 el(tag,parent,text){const e=this.doc.createElement(tag);if(text!==undefined)e.textContent=text;if(parent)parent.appendChild(e);return e;}
 on(e,type,fn){const safe=async ev=>{if(!this.d||this.d.destroyed)return;try{await fn(ev);}catch(err){this.error(err);}};e.addEventListener(type,safe);this.listeners.push([e,type,safe]);}
 button(text,parent,fn){const b=this.el('button',parent,text);b.type='button';this.on(b,'click',fn);return b;}
 option(e,value,label){const o=this.el('option',e,label);o.value=value;}
 error(e){if(this.message)this.message.textContent=String(e.message||e);}
 removeListenersWithin(node){this.listeners=this.listeners.filter(([e,t,fn])=>{const inside=e===node||!!(e&&e.nodeType&&node&&node.contains&&node.contains(e));if(inside){e.removeEventListener(t,fn);return false;}return true;});}
 empty(node){this.removeListenersWithin(node);node.replaceChildren();}
 /* 只同步目标下拉，不动场景树——换材质这类「结构没变、资源变了」的操作用它 */
 syncTargets(){const old=this.targets.value;this.targets.replaceChildren();for(const t of this.d.inspector.targets.values())this.option(this.targets,t.id,t.label);if(this.d.inspector.targets.has(old))this.targets.value=old;else if(!this.targets.value){const first=this.d.inspector.targets.values().next();if(!first.done)this.targets.value=first.value.id;}}
 refresh(){this.syncTargets();const types=[...new Set(this.d.tree.nodes.map(o=>o.type))].sort(),f=this.filter.value;this.filter.replaceChildren();this.option(this.filter,'','所有类型');types.forEach(t=>this.option(this.filter,t,t));this.filter.value=f;this.tree();this.inspect();this.performance();}
 tree(){this.nodeRows=new Map();this._markedUuid=null;this.empty(this.treeRoot);const q=this.search.value.toLowerCase(),type=this.filter.value,matched=o=>(!q||(o.name||'').toLowerCase().includes(q))&&(!type||o.type===type),nodes=this.d.tree.nodes,set=new Set(nodes),matches=new Set(nodes.filter(matched)),visible=new Set(matches);for(const o of matches){let p=o.parent;while(p&&set.has(p)){visible.add(p);p=p.parent;}}
 /* 点场景树：先选中（gizmo / 包围盒 / 属性面板一起跟上），再让相机飞向该对象。
    选中走 selectObject，它会通过 selectTarget 刷新面板；只有在选择层不可用时才手工刷。 */
 const select=(o)=>{
  this.targets.value='object:'+o.uuid;
  if(o===this.d.scene){this.inspect();return;}
  let selected=false;
  /* 选中链路里 selectTarget 会把面板滚到目标下拉；场景树在下方，滚动会让人「点一下跳一下」，
     这里临时压住 revealProps，属性面板照常刷新。 */
  this.holdScroll=true;
  try{this.d.selectObject(o);selected=true;}catch(e){}finally{this.holdScroll=false;}
  if(!selected)this.inspect();
  if(this.d.focusOnSelect!==false){try{this.d.focusObject('object:'+o.uuid);}catch(e){}}
 };
 const label=o=>(o===this.d.scene?'scene':(o.name||'\u65e0\u540d\u79f0'))+' / '+o.type+' / '+String(o.uuid).slice(0,8);
 const draw=(o,parent)=>{
  if(!visible.has(o))return;
  const kids=o.children.filter(c=>set.has(c)&&visible.has(c));
  let host=parent;
  if(kids.length){
   const details=this.el('details',parent);
   details.open=!!q||!!type||o===this.d.scene;
   const summary=this.el('summary',details);
   const nodeBtn=this.button(label(o),summary,()=>select(o));
   nodeBtn.className='tsd-node';this.nodeRows.set(o.uuid,nodeBtn);
   host=details;
  }else{
   const nodeBtn=this.button(label(o),parent,()=>select(o));
   nodeBtn.className='tsd-node tsd-leaf';this.nodeRows.set(o.uuid,nodeBtn);
  }
  for(const c of kids)draw(c,host);
 };
 draw(this.d.scene,this.treeRoot);}
 /* 高亮选中行。选中来源可能是画布点选、目标下拉或场景树，统一在这里对齐。 */
 markNode(){
  if(!this.nodeRows)return;
  const sel=this.d.selection&&this.d.selection.selected;
  const uuid=sel&&sel.uuid?sel.uuid:'';
  if(uuid===this._markedUuid)return;
  this._markedUuid=uuid;
  for(const [id,btn] of this.nodeRows)btn.classList.toggle('on',!!uuid&&id===uuid);
 }
 targetHeader(t,host){
  const title=this.el('h3',host);
  const isObj=t.object&&t.object.isObject3D&&t.object!==this.d.scene;
  if(isObj)this.el('span',title,'当前选中的是：').className='tsd-pick';
  title.appendChild(this.doc.createTextNode(isObj?(t.object.name?t.object.name+' · '+t.object.type:t.object.type)+' · '+String(t.object.uuid).slice(0,8):t.label));
  if(isObj)title.title=t.object.uuid;
  return title;
 }
 /* 目标自身的材质槽位（支持材质数组），返回 [{index,object,target}] */
 materialSlots(t){
  const o=t&&t.object;
  if(!o||!o.isObject3D||!o.material)return [];
  const mats=Array.isArray(o.material)?o.material:[o.material];
  return mats.map((m,i)=>({index:i,object:m,target:m?this.d.inspector.byObject.get(m):null})).filter(s=>s.object&&s.target);
 }
 setTab(next){
  if(next==='material'&&this.tabMat.disabled)return;
  if(next==='props'&&this.tabProps.disabled)return;
  if(next===this.tab)return;
  this.tab=next;this.syncTabs();
  /* 材质页按需构建，避免每次选对象都渲染几十个材质字段 */
  if(next==='material'&&this.matBar&&!this.matBar.childNodes.length){const t=this.d.inspector.targets.get(this.targets.value);if(t&&t.object&&t.object.isObject3D)this.materialBar(t);}
 }
 syncTabs(){
  const t=this.d.inspector.targets.get(this.targets.value);
  const kind=t?.locator?.kind,materialOnly=!!t&&(kind==='material'||kind==='texture');
  const hasMat=!!t&&(materialOnly||this.materialSlots(t).length>0);
  this.tabProps.disabled=!t||materialOnly;this.tabMat.disabled=!hasMat;
  this.tabProps.classList.toggle('on',this.tab==='props');
  this.tabMat.classList.toggle('on',this.tab==='material');
  this.tabProps.setAttribute('aria-selected',String(this.tab==='props'));
  this.tabMat.setAttribute('aria-selected',String(this.tab==='material'));
  this.tabMat.title=hasMat?'选中对象的材质参数':'该对象没有材质';
  this.props.hidden=this.tab!=='props';
  this.matBar.hidden=this.tab!=='material';
 }
 inspect(){
  this.markNode();
  if(this.lib&&!this.lib.hidden)this.closeTextureLibrary();
  const t=this.d.inspector.targets.get(this.targets.value);
  const kind=t?.locator?.kind,materialOnly=!!t&&(kind==='material'||kind==='texture');
  const hasMat=!!t&&(materialOnly||this.materialSlots(t).length>0);
  this.empty(this.props);this.empty(this.matBar);
  if(materialOnly)this.tab='material';
  else if(this.tab==='material'&&!hasMat)this.tab='props';
  this.syncTabs();
  if(!t)return;
  const host=materialOnly?this.matBar:this.props;
  this.targetHeader(t,host);
  /* 直接选中材质（targets 下拉里的 material:xxx）时也给出类型切换 */
  if(materialOnly&&kind==='material'&&t.locator&&t.locator.owner&&t.object&&t.object.isMaterial){
   const ownerT=this.d.inspector.targets.get('object:'+t.locator.owner);
   if(ownerT&&ownerT.object&&ownerT.object.material)this.materialTypeRows(this.matBar,'object:'+t.locator.owner,t.locator.index,t.object);
  }
  if(!materialOnly&&t.object&&t.object.isObject3D&&t.object!==this.d.scene){
   /* 变换手柄模式：与快捷键 W/E/R 等价，按钮高亮当前模式 */
   const modes=this.el('div',this.props);modes.className='tsd-actions tsd-modes';
   this.modeBtns={};
   for(const pair of [['translate','移动 W'],['rotate','旋转 E'],['scale','缩放 R']]){
    const btn=this.button(pair[1],modes,()=>{this.d.setTransformMode(pair[0]);this.syncModeButtons();});
    btn.className='tsd-mode';btn.title='拖拽手柄：'+pair[1].slice(0,2)+'（快捷键 '+pair[1].slice(-1)+'）';
    this.modeBtns[pair[0]]=btn;
   }
   this.syncModeButtons();
   const bar=this.el('div',this.props);bar.className='tsd-actions';
   this.button('聚焦',bar,()=>this.d.focusObject(t.id));
   this.button('克隆',bar,()=>{const c=this.d.cloneObject(t.id);this.message.textContent='已克隆 '+c.name;});
   this.button('删除',bar,()=>{const name=t.object.name||t.object.type;this.d.removeObject(t.id);this.message.textContent='已删除 '+name;});
   /* 字段多的时候直接筛：位置 / 旋转 / 材质参数都能过滤 */
   const q=this.el('input',this.props);q.className='tsd-filter';q.type='search';
   q.placeholder='筛选属性（如 position / rotation / color）';q.value=this.fieldQuery||'';
   q.setAttribute('aria-label','筛选属性');
   this.on(q,'input',()=>{this.fieldQuery=q.value;this.applyFieldFilter();});
   this.applyFieldFilter();
  }
  for(const [p,f] of t.fields)this.control(t,p,f,host);
  if(!materialOnly&&t.object.isCamera){
   const input=this.el('input',this.props);input.placeholder='lookAt: x,y,z';input.value='0,0,0';
   this.button('应用 lookAt',this.props,()=>{const v=input.value.split(',').map(Number);if(v.length!==3||v.some(n=>!Number.isFinite(n)))throw Error('lookAt needs x,y,z');this.d.lookAt(t.id,...v);this.inspect();this.changes();});
  }
  if(!materialOnly&&this.tab==='material')this.materialBar(t);
  this.changes();
 }
 /* 定位到参数区：把目标下拉与页签栏一起滚到顶部，选中后立刻能切页签 */
 revealProps(){if(this.holdScroll)return;const anchor=this.targets||this.tabs;if(anchor&&anchor.scrollIntoView){anchor.scrollIntoView({block:'start'});return;}const host=this.tab==='material'?this.matBar:this.props;const el=host.querySelector('[aria-label]')||host.querySelector('input,select,textarea');if(el&&el.scrollIntoView)el.scrollIntoView({block:'center'});}
 control(t,p,f,host){
 if(f.kind==='euler'||f.kind==='vector')return;
 if(f.kind==='resource'){this.textureControl(t,p,host||this.props);return;}
 const row=this.el('label',host||this.props);const lab=this.el('span',row,p);row.dataset.field=p;const v=this.d.inspector.read(t,p);let input;
 if(f.kind==='background'||f.kind==='fog'){
 input=this.el('select',row);this.option(input,'null','null');if(f.kind==='background')this.option(input,'color','Color…');if(f.kind==='fog'){this.option(input,'Fog','Fog');this.option(input,'FogExp2','FogExp2');}
 input.value=v===null?'null':v?.isColor?'color':v?.isFog?'Fog':v?.isFogExp2?'FogExp2':v?.uuid||'null';this.on(input,'change',()=>{let value=null;if(input.value==='color')value=this.d.inspector.resolve({$type:'Color',rgb:[0.05,0.05,0.05]});else if(input.value==='Fog'||input.value==='FogExp2')value=this.d.inspector.resolve({$type:input.value,color:{$type:'Color',rgb:[1,1,1]},near:1,far:100,density:0.01});else if(input.value!=='null')value=this.d.inspector.resources.get(input.value);this.d.set(t.id,p,value);this.inspect();});
 if(v?.isColor)this.nestedColor(t,p,v,host);if(v?.isFog||v?.isFogExp2){this.nestedColor(t,p+'.color',v.color,host);for(const k of v.isFog?['near','far']:['density']){t.fields.set(p+'.'+k,{kind:'number'});this.control(t,p+'.'+k,{kind:'number'},host);}}
 return;
 }
 if(f.kind==='json'){input=this.el('textarea',row);try{input.value=JSON.stringify(plain(v),null,2);}catch(e){input.placeholder='不可序列化 userData: '+e.message;}this.on(input,'change',()=>this.apply(t,p,JSON.parse(input.value)));}
 else if(f.kind==='color'){input=this.el('input',row);input.type='color';input.value='#'+v.getHexString();this.on(input,'change',()=>this.apply(t,p,input.value));}
 else{input=this.el('input',row);input.type=f.kind==='boolean'?'checkbox':f.kind==='number'?'number':'text';if(f.kind==='number')input.step='any';if(f.kind==='boolean')input.checked=v;else input.value=f.kind==='number'?this.fmtDigits(v):String(v);this.on(input,'change',()=>this.apply(t,p,f.kind==='number'?Number(input.value):f.kind==='boolean'?input.checked:input.value));if(f.kind==='number')this.scrubNumber(lab,input,t,p);}
 input.setAttribute('aria-label',t.id+' '+p);
 }
 /* 按住字段名左右拖动改值：单击仍是正常输入，拖动才进入 scrub。
    拖动过程只写值不记日志，松手用 commitPreview 记一条（旧值 = 拖动前）。 */
 scrubNumber(handle,input,t,p){
  if(!handle||!input||!handle.classList)return;
  handle.classList.add('tsd-scrub');handle.title='左右拖动改值（Shift ×10，Alt ×0.1），单击可直接输入';
  const view=this.doc.defaultView||globalThis;
  let scrub=null,raf=0,pending=null;
  const flush=()=>{raf=0;if(pending===null)return;const v=pending;pending=null;this.d.preview(t.id,p,v);};
  const schedule=v=>{pending=v;if(!raf&&view.requestAnimationFrame)raf=view.requestAnimationFrame(flush);else if(!raf)flush();};
  this.on(handle,'pointerdown',e=>{
   if(e.button!==undefined&&e.button!==0)return;
   const v=Number(input.value);if(!Number.isFinite(v))return;
   scrub={x:e.clientX,v:v,on:false};
   try{handle.setPointerCapture(e.pointerId);}catch(err){}
   e.preventDefault();
  });
  this.on(handle,'pointermove',e=>{
   if(!scrub)return;
   const dx=e.clientX-scrub.x;
   if(!scrub.on){if(Math.abs(dx)<3)return;scrub.on=true;handle.classList.add('dragging');}
   const k=e.altKey?0.001:(e.shiftKey?0.1:0.01);
   const v=Number((scrub.v+dx*k).toFixed(4));
   input.value=String(v);schedule(v);
  });
  const end=e=>{
   if(!scrub)return;
   const moved=scrub.on;scrub=null;handle.classList.remove('dragging');
   try{handle.releasePointerCapture(e.pointerId);}catch(err){}
   if(raf&&view.cancelAnimationFrame){view.cancelAnimationFrame(raf);raf=0;}
   if(pending!==null){const v=pending;pending=null;this.d.commitPreview(t.id,p,v);}
   else if(moved)this.d.commitPreview(t.id,p,Number(input.value));
  };
  this.on(handle,'pointerup',end);this.on(handle,'pointercancel',end);
 }
 /* 属性筛选：按 data-field 匹配，空查询显示全部 */
 applyFieldFilter(){
  if(!this.props)return;
  const q=String(this.fieldQuery||'').trim().toLowerCase();
  for(const row of this.props.querySelectorAll('label')){
   const key=(row.dataset&&row.dataset.field)||'';
   if(!key)continue;
   row.hidden=!!q&&key.toLowerCase().indexOf(q)<0;
  }
 }
 syncModeButtons(){
  if(!this.modeBtns)return;
  const cur=(this.d&&this.d.selection&&this.d.selection.mode)||'translate';
  for(const m of Object.keys(this.modeBtns))this.modeBtns[m].classList.toggle('on',m===cur);
 }
 nestedColor(t,p,v,host){if(p.includes('.'))t.fields.set(p,{kind:'color'});this.control(t,p,{kind:'color'},host);}
 apply(t,p,value){if(t.fields.get(p)?.kind==='background'&&typeof value==='string'&&get(t.object,p)?.isColor)value=get(t.object,p).clone().set(value);this.d.set(t.id,p,value);this.changes();}
 changes(){
  this.empty(this.log);
  const all=this.d.tracker.records;
  const active=all.filter(r=>r.active);
  /* 面板按步列出（每步可撤销），复制/导出按处合并成最终状态 */
  const merged=this.d.tracker.collapse(all);
  const mergedByKey=new Map(merged.map(r=>[(r.target||'custom')+'|'+r.propertyPath,r]));
  const lastStep=new Map();
  for(const r of active)lastStep.set((r.target||'custom')+'|'+r.propertyPath,r.id);
  if(this.logBtn)this.logBtn.textContent='改动 '+merged.length;
 if(this.copyPromptBtn){this.copyPromptBtn.disabled=!merged.length;this.copyPromptBtn.textContent='复制修改提示词'+(merged.length?'（'+merged.length+' 处）':'');this.copyPromptBtn.title=merged.length?'复制可直接发给 AI 的修改提示词（含改动清单与可执行代码）':'改动参数后可用';}
  this.el('h3',this.log,'改动 '+merged.length+' 处');
  if(!all.length){
   this.el('small',this.log,'\u6539\u53d8\u4efb\u610f\u53c2\u6570\u540e\uff0c\u8fd9\u91cc\u4f1a\u5217\u51fa\u300c\u5bf9\u8c61 \u00b7 \u53c2\u6570 \u00b7 \u65e7\u503c \u2192 \u65b0\u503c\u300d\uff0c\u53ef\u4e00\u952e\u590d\u5236\u7ed9 agent\u3002');
   return;
  }
  if(active.length>merged.length){const tip=this.el('small',this.log,'共 '+active.length+' 步；同一属性只复制「首次旧值 → 最终值」，逐步撤销仍可用。');tip.className='tsd-tip';}
  const bar=this.el('div',this.log);
  
  this.button('\u590d\u5236\u5168\u90e8\u4ee3\u7801',bar,()=>this.copy(this.d.exportCode()));
  this.button('\u6e05\u7a7a',bar,()=>{this.d.clearChanges();});
  const groups=new Map();
  for(const r of all){const k=r.target||'custom';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}
  for(const [k,items] of groups){
   const g=this.el('div',this.log);g.className='tsd-group';
   const head=this.el('div',g);head.className='tsd-group-head';
   const first=items[0];
   this.el('strong',head,first.objectName||k);
   if(first.ownerName)this.el('small',head,' \u00b7 '+first.ownerName);
   this.button('\u590d\u5236\u7ec4',head,()=>this.copy(this.d.tracker.collapse(items).map(r=>this.d.changeLine(r,true)).join('\n')));
   for(const r of items){
    const key=(r.target||'custom')+'|'+r.propertyPath;
    const superseded=r.active&&lastStep.get(key)!==r.id;
    const row=this.el('div',g);row.className='tsd-row'+(r.active?(superseded?' superseded':''):' off');
    this.el('code',row,r.propertyPath);
    this.el('span',row,this.d.changeText(r));
    if(superseded){const tag=this.el('small',row,'已被覆盖');tag.className='tsd-sup';tag.title='复制这个属性时只给「首次旧值 → 最终值」；这一步仍可单独撤销';}
    this.on(row,'click',()=>this.copy(this.d.changeLine(mergedByKey.get(key)||r,true)));
    if(r.active)this.button('\u64a4\u9500',row,()=>{this.d.undo(r.id);this.inspect();});
   }
  }
 }
 performance(){this.perf.textContent=JSON.stringify(this.d.performance.sample(),null,2)+'\nFPS: tick() 真实帧率；未 tick 则为 null。内存仅已缓存资源下界/基础纹理估算。\n'+[...this.d.warnings].join('\n');}
 destroy(){for(const [e,t,f]of this.listeners)e.removeEventListener(t,f);this.listeners=[];this.host.remove();for(const k of Object.keys(this))if(k!=='listeners')this[k]=null;}
}
/* ======================= editor helpers ======================= */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const trimNumber = v => { const n = Math.round(v * 1000) / 1000; return String(Object.is(n, -0) ? 0 : n); };
const linearToSRGB = c => c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
const rgbToHex = rgb => rgb.map(c => { const n = Math.round(clamp(linearToSRGB(c), 0, 1) * 255); return n.toString(16).padStart(2, '0'); }).join('');
function fmtValue(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return trimNumber(v);
  if (typeof v === 'boolean') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (v.$type) {
    switch (v.$type) {
      case 'Color': return '#' + rgbToHex(v.rgb);
      case 'Vector2': case 'Vector3': case 'Vector4': return '(' + v.value.map(trimNumber).join(', ') + ')';
      case 'Euler': return '(' + v.value.slice(0, 3).map(trimNumber).join(', ') + ')';
      case 'Quaternion': return 'quat(' + v.value.map(trimNumber).join(', ') + ')';
      case 'Texture': return '<texture ' + String(v.uuid).slice(0, 8) + '>';
      case 'Material': return '<material ' + String(v.uuid).slice(0, 8) + '>';
      case 'Number': return String(v.value);
      case 'Fog': case 'FogExp2': return v.$type + ' ' + fmtValue(v.color);
    }
  }
  let s; try { s = JSON.stringify(v); } catch (e) { s = '[object]'; }
  return s && s.length > 72 ? s.slice(0, 69) + '\u2026' : s;
}
const sameVector = (a, b, eps) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => typeof v === 'string' ? v === b[i] : Math.abs(v - b[i]) <= (eps || 1e-6));
const disposeHelper = h => {
  if (!h) return;
  if (h.parent) h.parent.remove(h);
  try { h.geometry && h.geometry.dispose(); } catch (e) { }
  try { if (h.material) { if (Array.isArray(h.material)) h.material.forEach(m => m.dispose && m.dispose()); else h.material.dispose && h.material.dispose(); } } catch (e) { }
  try { h.dispose && h.dispose(); } catch (e) { }
};


/* ======================= HDR（Radiance RGBE）解析，零 addon 依赖 ======================= */
function parseHDR(buffer, T) {
  const bytes = new Uint8Array(buffer);
  let pos = 0;
  const line = () => {
    let s = '';
    while (pos < bytes.length) {
      const c = bytes[pos++];
      if (c === 10) break;
      if (c !== 13) s += String.fromCharCode(c);
    }
    return s;
  };
  if (!/^#\?(RADIANCE|RGBE)/.test(line())) throw Error('不是 Radiance HDR 文件');
  for (let guard = 0; guard < 512; guard++) { if (line() === '') break; if (pos >= bytes.length) throw Error('HDR 头部不完整'); }
  const res = line().trim();
  const m = /^-Y\s+(\d+)\s+\+X\s+(\d+)$/.exec(res);
  if (!m) throw Error('暂不支持该 HDR 扫描方向：' + res);
  const height = Number(m[1]), width = Number(m[2]);
  if (!width || !height) throw Error('HDR 尺寸无效');
  const half = T.DataUtils && T.DataUtils.toHalfFloat ? T.DataUtils.toHalfFloat : (v => Math.min(65504, Math.max(0, v)));
  const out = new Uint16Array(width * height * 4);
  // Radiance 的 new-style RLE 每个扫描行是「4 个通道各自一条流」，每流长度 = width，
  // run 只带 1 字节样本，literal 带 code 字节；按像素交错解析会整体错位。
  const chan = new Uint8Array(width * 4);
  const need = () => { if (pos >= bytes.length) throw Error('HDR 像素数据不完整'); };
  for (let y = 0; y < height; y++) {
    const rle = width >= 8 && width < 32768 && bytes[pos] === 2 && bytes[pos + 1] === 2 && ((bytes[pos + 2] << 8) | bytes[pos + 3]) === width;
    if (rle) {
      pos += 4;
      for (let c = 0; c < 4; c++) {
        const base = c * width;
        let x = 0;
        while (x < width) {
          need();
          const code = bytes[pos++];
          if (code > 128) {
            const run = Math.min(code - 128, width - x);
            need();
            const v = bytes[pos++];
            for (let i = 0; i < run; i++) chan[base + x + i] = v;
            x += run;
          } else if (code === 0) {
            let run = 0, shift = 0, b;
            do { need(); b = bytes[pos++]; run += b * Math.pow(256, shift); shift++; } while (b === 0 && shift < 4);
            need();
            const v = bytes[pos++];
            const n = Math.min(run, width - x);
            for (let i = 0; i < n; i++) chan[base + x + i] = v;
            x += Math.max(1, n);
          } else {
            const n = Math.min(code, width - x);
            need();
            for (let i = 0; i < n; i++) chan[base + x + i] = bytes[pos + i];
            pos += code;
            x += n;
          }
        }
      }
      for (let x = 0; x < width; x++) {
        const e = chan[3 * width + x], dst = ((height - 1 - y) * width + x) * 4;
        if (!e) { out[dst + 3] = half(0); continue; }
        const f = Math.pow(2, e - 136);
        out[dst] = half(chan[x] * f);
        out[dst + 1] = half(chan[width + x] * f);
        out[dst + 2] = half(chan[2 * width + x] * f);
        out[dst + 3] = half(1);
      }
    } else {
      if (pos + width * 4 > bytes.length) throw Error('HDR 像素数据不完整');
      for (let x = 0; x < width; x++) {
        const o = pos + x * 4, e = bytes[o + 3], dst = ((height - 1 - y) * width + x) * 4;
        if (!e) { out[dst + 3] = half(0); continue; }
        const f = Math.pow(2, e - 136);
        out[dst] = half(bytes[o] * f);
        out[dst + 1] = half(bytes[o + 1] * f);
        out[dst + 2] = half(bytes[o + 2] * f);
        out[dst + 3] = half(1);
      }
      pos += width * 4;
    }
  }
  const tex = new T.DataTexture(out, width, height, T.RGBAFormat, T.HalfFloatType);
  tex.mapping = T.EquirectangularReflectionMapping;
  tex.colorSpace = T.LinearSRGBColorSpace || T.NoColorSpace;
  tex.minFilter = T.LinearFilter;
  tex.magFilter = T.LinearFilter;
  tex.generateMipmaps = false;
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}

/* ======================= 素材库（HDR 天空盒 / PBR 贴图） ======================= */
const ASSET_KIND_LABEL = { diff: '基础色', nor: '法线', rough: '粗糙度', arm: 'AO/粗糙/金属', emit: '自发光' };
const ASSET_SLOT_KIND = { map: 'diff', emissiveMap: 'diff', normalMap: 'nor', bumpMap: 'nor', roughnessMap: 'rough', metalnessMap: 'arm', aoMap: 'arm', alphaMap: 'diff', displacementMap: 'diff', clearcoatMap: 'diff', clearcoatNormalMap: 'nor', clearcoatRoughnessMap: 'rough', sheenColorMap: 'diff', sheenRoughnessMap: 'rough', transmissionMap: 'diff', thicknessMap: 'diff' };
class AssetLibrary {
  constructor(d, options) {
    options = options || {};
    this.d = d;
    this.base = options.assets ? String(options.assets) : null;
    this.enabled = !!this.base;
    this.status = this.enabled ? 'loading' : 'disabled';
    this.error = null;
    this.hdrItems = [];
    this.texItems = [];
    this.textureCache = new Map();
    this.envCache = new Map();
    this.pmrem = null;
    this.ready = this.enabled ? this.load() : Promise.resolve(this);
  }
  url(rel) { const base = this.d.doc && this.d.doc.baseURI || (typeof location !== 'undefined' ? location.href : 'http://localhost/'); return new URL(rel, new URL(this.base, base)).href; }
  async load() {
    try {
      const res = await fetch(this.url('manifest.json'), { cache: 'no-cache' });
      if (!res.ok) throw Error('manifest HTTP ' + res.status);
      const data = await res.json();
      this.hdrItems = (data.hdr || []).map(h => Object.assign({}, h, { thumb: h.thumb ? this.url(h.thumb) : null }));
      this.texItems = (data.textures || []).map(t => Object.assign({}, t, { thumb: t.thumb ? this.url(t.thumb) : null }));
      this.status = 'ready';
    } catch (e) {
      this.status = 'error';
      this.error = e && e.message ? e.message : String(e);
    }
    if (this.d && !this.d.destroyed && this.d.ui && this.d.ui.assetsChanged) this.d.ui.assetsChanged();
    if (this.d && !this.d.destroyed && this.d.ui && this.d.ui.envChanged) this.d.ui.envChanged();
    return this;
  }
  texItem(id) { return this.texItems.find(t => t.id === id) || null; }
  hdrItem(id) { return this.hdrItems.find(h => h.id === id) || null; }
  async texture(id, kind) {
    if (this.status === 'loading') await this.ready;
    const item = this.texItem(id);
    if (!item) throw Error('未知素材贴图：' + id);
    const rel = item.files && item.files[kind];
    if (!rel) throw Error(item.label + ' 没有 ' + (ASSET_KIND_LABEL[kind] || kind) + ' 通道');
    const key = id + ':' + kind;
    if (this.textureCache.has(key)) return this.textureCache.get(key);
    const T = this.d.THREE;
    const loader = new T.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const tex = await loader.loadAsync(this.url(rel));
    tex.colorSpace = (kind === 'diff' || kind === 'emit') ? (T.SRGBColorSpace || tex.colorSpace) : (T.LinearSRGBColorSpace || T.NoColorSpace);
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    if (this.d.renderer.capabilities && this.d.renderer.capabilities.getMaxAnisotropy) tex.anisotropy = Math.min(8, this.d.renderer.capabilities.getMaxAnisotropy());
    tex.userData.tsdAsset = { id: id, kind: kind, label: item.label, thumb: item.thumb };
    tex.needsUpdate = true;
    this.textureCache.set(key, tex);
    return tex;
  }
  async env(id) {
    if (this.status === 'loading') await this.ready;
    if (this.envCache.has(id)) return this.envCache.get(id);
    const item = this.hdrItem(id);
    if (!item) throw Error('未知环境贴图：' + id);
    const T = this.d.THREE;
    let source;
    if (item.format === 'ldr') {
      const loader = new T.TextureLoader();
      loader.setCrossOrigin('anonymous');
      source = await loader.loadAsync(this.url(item.file));
      source.mapping = T.EquirectangularReflectionMapping;
      source.colorSpace = T.SRGBColorSpace || source.colorSpace;
    } else {
      const res = await fetch(this.url(item.file));
      if (!res.ok) throw Error('HDR HTTP ' + res.status);
      source = parseHDR(await res.arrayBuffer(), T);
    }
    if (!this.pmrem) {
      this.pmrem = new T.PMREMGenerator(this.d.renderer);
      if (this.pmrem.compileEquirectangularShader) this.pmrem.compileEquirectangularShader();
    }
    const target = this.pmrem.fromEquirectangular(source);
    const entry = { env: target.texture, bg: source, target: target, item: item };
    this.envCache.set(id, entry);
    return entry;
  }
  dispose() {
    for (const e of this.envCache.values()) { try { e.target.dispose(); } catch (err) { } try { e.bg.dispose && e.bg.dispose(); } catch (err) { } }
    this.envCache.clear();
    try { this.pmrem && this.pmrem.dispose(); } catch (e) { }
    this.pmrem = null;
    this.textureCache.clear();
    this.d = null;
  }
}

/* ======================= 自制贴图库（程序化生成：基础色 / 法线 / 粗糙度） ======================= */
/* 全部贴图在浏览器里按「整数周期噪声」现场生成，所以天生无缝平铺，不依赖任何外部图片。
   每个预设输出三张图：diff（sRGB 基础色）、nor（切线空间法线，OpenGL +Y）、rough（线性灰度）。
   法线由 3x3 sobel 从高度场求梯度得到，强度按分辨率归一化，换尺寸观感一致。 */
const TEX_SIZE_DEFAULT = 256;
const TEX_KIND_LABEL = { diff: '基础色', nor: '法线', rough: '粗糙度' };
const TEX_SLOT_HINT = { map: '基础色', normalMap: '法线', roughnessMap: '粗糙度', bumpMap: '法线', aoMap: '粗糙度', metalnessMap: '粗糙度' };

/* 自制贴图库只有 基础色/法线/粗糙度 三种通道，不能沿用素材库的 arm 映射：
   arm 是素材包里打在一起的 AO/Rough/Metal，自制贴图库没有这一路。
   少一个映射的后果不是报错，而是静默写进一张彩色图（TextureStudio 对未知 kind 回落 diff）。 */
const TEX_SLOT_KIND = {
  map: 'diff', normalMap: 'nor', bumpMap: 'nor', roughnessMap: 'rough',
  aoMap: 'rough', metalnessMap: 'rough'
};

const sat = v => v < 0 ? 0 : v > 1 ? 1 : v;
const mixf = (a, b, t) => a + (b - a) * t;
const sstep = (e0, e1, x) => { const t = sat((x - e0) / (e1 - e0 || 1e-6)); return t * t * (3 - 2 * t); };

/* 整数格点哈希：同一 (x,y,seed) 永远得到同一个 0..1 值，负坐标也稳定 */
function hash2(x, y, seed) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/* 可分别指定 x/y 周期的 value noise：px、py 为整数即保证在 [0,1) 上首尾相接 */
function vnoise2(x, y, px, py, seed) {
  const ix = Math.floor(x * px), iy = Math.floor(y * py);
  const fx = x * px - ix, fy = y * py - iy;
  const tx = fx * fx * (3 - 2 * fx), ty = fy * fy * (3 - 2 * fy);
  const x0 = ((ix % px) + px) % px, x1 = (x0 + 1) % px;
  const y0 = ((iy % py) + py) % py, y1 = (y0 + 1) % py;
  const a = hash2(x0, y0, seed), b = hash2(x1, y0, seed);
  const c = hash2(x0, y1, seed), d = hash2(x1, y1, seed);
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

function fbm2(x, y, px, py, oct, seed, gain) {
  let sum = 0, amp = 1, norm = 0, ax = px | 0, ay = py | 0;
  const g = gain === undefined ? 0.5 : gain;
  for (let i = 0; i < oct; i++) {
    sum += vnoise2(x, y, Math.max(1, ax), Math.max(1, ay), seed + i * 131) * amp;
    norm += amp; amp *= g; ax *= 2; ay *= 2;
  }
  return sum / norm;
}

/* 周期 Worley：返回最近/次近特征点距离与格子随机值，用于石板、皮革、水磨石 */
const _wo = { f1: 0, f2: 0, id: 0 };
function worley(u, v, cells, seed, out) {
  const o = out || _wo;
  const gx = u * cells, gy = v * cells;
  const ix = Math.floor(gx), iy = Math.floor(gy);
  let f1 = 9, f2 = 9, id = 0;
  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      const ci = ix + ox, cj = iy + oy;
      const wx = ((ci % cells) + cells) % cells, wy = ((cj % cells) + cells) % cells;
      const px = ci + 0.5 + (hash2(wx, wy, seed) - 0.5) * 0.86;
      const py = cj + 0.5 + (hash2(wx, wy, seed + 71) - 0.5) * 0.86;
      const dx = gx - px, dy = gy - py, d = Math.sqrt(dx * dx + dy * dy);
      if (d < f1) { f2 = f1; f1 = d; id = hash2(wx, wy, seed + 143); }
      else if (d < f2) f2 = d;
    }
  }
  o.f1 = f1; o.f2 = f2; o.id = id;
  return o;
}

/* ---------- 12 种材质 ---------- */
function texOak(n, H, A, R) {
  const rows = 4;
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n, row = v * rows, ri = Math.floor(row), rf = row - ri;
    const tone = 0.86 + 0.24 * hash2(ri, 3, 17);
    /* 板缝：板边界向内 2px 的深凹槽，平铺时正好落在贴图上下边界，接起来仍是一条缝 */
    const seam = 1 - sstep(0.004, 0.016, Math.min(rf, 1 - rf));
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const fiber = fbm2(u, v, 2, 128, 2, 23);        // 顺纹细线（沿 u 拉长）
      const band = fbm2(u, v, 2, 8, 3, 11);           // 宽窄不一的纹理带
      const streak = fiber * 0.55 + band * 0.45;
      const shade = tone * (0.7 + 0.44 * streak) * (1 - 0.72 * seam);
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(0.62 * shade); A[i3 + 1] = sat(0.42 * shade); A[i3 + 2] = sat(0.24 * shade);
      H[i] = sat(0.56 + 0.1 * (band - 0.5) - 0.45 * seam + 0.05 * (fiber - 0.5));
      R[i] = sat(0.48 + 0.18 * (1 - streak) + 0.08 * (1 - tone));
    }
  }
}

function texBrick(n, H, A, R) {
  const rows = 8, cols = 4, mortar = 0.012;
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n, row = v * rows, ri = Math.floor(row), rf = row - ri;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const ux = (u + (ri % 2) * 0.5 / cols) % 1;
      const cx = Math.floor(ux * cols), fx = ux * cols - cx;
      const edge = Math.min(Math.min(fx, 1 - fx) / cols, Math.min(rf, 1 - rf) / rows);
      const m = 1 - sstep(mortar * 0.35, mortar * 1.7, edge);
      const hb = hash2(cx, ri, 7), hb2 = hash2(cx, ri, 29);
      const grit = fbm2(u, v, 64, 64, 2, 41);
      const tint = 0.8 + 0.42 * hb;
      const rr = sat((0.42 + 0.17 * hb2) * tint + (grit - 0.5) * 0.2);
      const gg = sat((0.16 + 0.075 * hb2) * tint + (grit - 0.5) * 0.11);
      const bb = sat((0.13 + 0.055 * hb2) * tint + (grit - 0.5) * 0.1);
      const gc = 0.56 + 0.1 * grit;
      const i = y * n + x, i3 = i * 3;
      A[i3] = mixf(rr, gc, m); A[i3 + 1] = mixf(gg, gc * 0.99, m); A[i3 + 2] = mixf(bb, gc * 0.93, m);
      H[i] = sat(0.74 - 0.62 * m + (grit - 0.5) * 0.07);
      R[i] = sat(0.8 + 0.12 * m - 0.1 * hb);
    }
  }
}

function texConcrete(n, H, A, R) {
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const big = fbm2(u, v, 3, 3, 5, 3), mid = fbm2(u, v, 10, 10, 4, 9);
      const fine = fbm2(u, v, 160, 160, 2, 17);
      const pore = sstep(0.76, 0.88, fbm2(u, v, 42, 42, 2, 31));
      /* 细裂缝：等值线式的窄缝，压一点点明度就够，压多会变成等高线 */
      const crack = (1 - sstep(0, 0.014, Math.abs(fbm2(u, v, 5, 5, 3, 47) - 0.5))) * 0.32;
      const i = y * n + x, i3 = i * 3;
      const base = 0.6 + 0.09 * big + 0.035 * (mid - 0.5) - 0.16 * pore + 0.035 * (fine - 0.5) - crack * 0.22;
      A[i3] = sat(base); A[i3 + 1] = sat(base * 1.005); A[i3 + 2] = sat(base * 0.975);
      H[i] = sat(0.52 + 0.26 * (mid - 0.5) - 0.26 * pore + 0.06 * (fine - 0.5) - crack * 0.2);
      R[i] = sat(0.74 + 0.14 * (mid - 0.5) + 0.12 * pore + crack * 0.2);
    }
  }
}

function texMarble(n, H, A, R) {
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const t1 = fbm2(u, v, 2, 2, 4, 5), t2 = fbm2(u, v, 5, 5, 3, 13), t3 = fbm2(u, v, 3, 3, 2, 71);
      /* 两族脉：主脉被低频湍流推着走、局部淡出；副脉更细更密，边缘都用 sstep 软化 */
      const w = (t1 - 0.5) * 1.1;
      const d1 = Math.abs(((u * 2 + v + w * 1.7) % 1 + 1) % 1 * 2 - 1);
      const fade = 0.3 + 0.7 * sstep(0.22, 0.62, t3);
      const vein1 = (1 - sstep(0.0, 0.13, d1)) * fade;
      const d2 = Math.abs(((u * 3 - v * 2 + t2 * 1.6) % 1 + 1) % 1 * 2 - 1);
      const vein2 = (1 - sstep(0.0, 0.05, d2)) * 0.55;
      const vein = sat(vein1 * 0.9 + vein2 * 0.42);
      const base = 0.9 + 0.06 * t1;
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(base - 0.34 * vein); A[i3 + 1] = sat(base - 0.36 * vein); A[i3 + 2] = sat(base - 0.3 * vein);
      H[i] = sat(0.52 + 0.05 * t1 - 0.05 * vein);
      R[i] = sat(0.1 + 0.3 * vein + 0.04 * t2);
    }
  }
}

function texBrushed(n, H, A, R) {
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const f1 = fbm2(u, v, 1, 160, 2, 5), f2 = fbm2(u, v, 2, 36, 2, 9);
      const band = fbm2(u, v, 1, 5, 2, 3);
      const scr = hash2(Math.floor(v * 190), 1, 55) > 0.978 ? 1 : 0;
      const base = 0.66 + 0.1 * band + 0.1 * (f1 - 0.5) + 0.06 * (f2 - 0.5) - 0.16 * scr;
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(base * 0.985); A[i3 + 1] = sat(base); A[i3 + 2] = sat(base * 1.045);
      H[i] = sat(0.5 + (f1 - 0.5) * 0.08 - 0.04 * scr);
      R[i] = sat(0.2 + 0.14 * f1 + 0.06 * (1 - band) + 0.12 * scr);
    }
  }
}

function texHex(n, H, A, R) {
  /* 六方格的平移矢量是 (√3R,0) 与 (√3R/2,1.5R)；正方形贴图要无缝，(1,0) 与 (0,1) 都必须正好是
     格矢量。取 R=1/9、x 再乘 5√3/9≈0.9623：(1,0)=5 个格矢量、(0,1)=6 行 + 3 列，正好落在格点上。 */
  const R0 = 1 / 9, SX = 5 * Math.sqrt(3) / 9, SQ3 = Math.sqrt(3);
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const q = (SQ3 / 3 * (u * SX) - v / 3) / R0, r = (2 / 3 * v) / R0;
      let rq = Math.round(q), rr = Math.round(r), rs = Math.round(-q - r);
      const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs + q + r);
      if (dq > dr && dq > ds) rq = -rr - rs; else if (dr > ds) rr = -rq - rs;
      const edge = Math.max(Math.abs(q - rq), Math.abs(r - rr), Math.abs(-q - r + rq + rr));
      const grout = sstep(0.445, 0.49, edge);
      /* 砖色按格心位置取周期噪声：相差整格的砖共享颜色，平铺时不会在接缝处跳色 */
      const cu = R0 * (SQ3 * rq + SQ3 / 2 * rr) / SX, cv = R0 * 1.5 * rr;
      const hb = fbm2(cu - Math.floor(cu), cv - Math.floor(cv), 12, 12, 2, 19);
      const hb2 = fbm2(cu - Math.floor(cu), cv - Math.floor(cv), 12, 12, 2, 37);
      const drift = fbm2(u, v, 6, 6, 2, 23);
      const i = y * n + x, i3 = i * 3;
      const tr = 0.82 + 0.12 * hb, tg = 0.835 + 0.11 * hb2, tb = 0.81 + 0.1 * hb;
      const gv = 0.38 + 0.1 * drift;
      A[i3] = mixf(tr, gv, grout); A[i3 + 1] = mixf(tg, gv, grout); A[i3 + 2] = mixf(tb, gv * 0.98, grout);
      /* 釉面中间微鼓，格边倒角 */
      H[i] = mixf(0.58 + 0.22 * (1 - edge / 0.49), 0.1, grout);
      R[i] = mixf(0.16 + 0.1 * (1 - hb), 0.74, grout);
    }
  }
}

function texCobble(n, H, A, R) {
  const w = { f1: 0, f2: 0, id: 0 };
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      worley(u, v, 4, 17, w);
      const stone = sstep(0.03, 0.16, w.f2 - w.f1);
      const dome = Math.sqrt(sat(1 - w.f1 * w.f1 * 3.4));
      const shade = 0.3 + 0.24 * w.id + 0.16 * dome;
      const grit = fbm2(u, v, 64, 64, 2, 61);
      const i = y * n + x, i3 = i * 3;
      const sv = shade + (grit - 0.5) * 0.1;
      A[i3] = sat(sv * 1.06); A[i3 + 1] = sat(sv); A[i3 + 2] = sat(sv * 0.9);
      H[i] = sat(0.1 + 0.72 * stone * (0.42 + 0.58 * dome) + (grit - 0.5) * 0.05);
      R[i] = sat(0.64 + 0.2 * (1 - stone) - 0.1 * w.id);
    }
  }
}

function texLeather(n, H, A, R) {
  const w1 = { f1: 0, f2: 0, id: 0 }, w2 = { f1: 0, f2: 0, id: 0 };
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      worley(u, v, 12, 31, w1); worley(u, v, 28, 57, w2);
      const p1 = 1 - sstep(0, 0.58, w1.f1), p2 = 1 - sstep(0, 0.52, w2.f1);
      const grain = sat(0.56 * p1 + 0.24 * p2 + 0.2 * fbm2(u, v, 24, 24, 2, 7));
      const base = 0.29 + 0.3 * grain;
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(base * 1.3); A[i3 + 1] = sat(base * 0.9); A[i3 + 2] = sat(base * 0.7);
      H[i] = sat(0.3 + 0.58 * grain);
      R[i] = sat(0.4 + 0.28 * (1 - grain));
    }
  }
}

function texLinen(n, H, A, R) {
  const N = 44;
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n, ty = v * N, iy = Math.floor(ty), fy = ty - iy;
    const weft = Math.sin(Math.PI * fy);
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n, tx = u * N, ix = Math.floor(tx), fx = tx - ix;
      const warp = Math.sin(Math.PI * fx);
      const over = ((ix + iy) & 1) === 0;
      const thread = 0.16 + 0.84 * (over ? warp : weft);
      /* 每根线的粗细/深浅略有差异，避免像印刷网点 */
      const slub = fbm2(u, v, 4, 4, 2, 5), th = 0.86 + 0.24 * hash2(ix, iy, 9);
      const base = (0.5 + 0.44 * thread) * th + 0.1 * (slub - 0.5);
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(base); A[i3 + 1] = sat(base * 0.95); A[i3 + 2] = sat(base * 0.83);
      H[i] = sat(0.12 + 0.78 * thread + 0.12 * (slub - 0.5));
      R[i] = sat(0.82 + 0.06 * (1 - thread));
    }
  }
}

function texSand(n, H, A, R) {
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const warp = fbm2(u, v, 4, 4, 3, 3);
      /* 风纹：把正弦压出不对称的脊，再叠颗粒噪声，否则会像丝绸 */
      const wave = 0.5 + 0.5 * Math.sin((u * 4 + v * 3 + warp * 2.4) * Math.PI * 2);
      const ripple = Math.pow(wave, 1.7);
      const grain = fbm2(u, v, 120, 120, 2, 9);
      const speck = fbm2(u, v, 64, 64, 2, 51);
      const base = 0.58 + 0.12 * ripple + 0.16 * (grain - 0.5) + 0.05 * (speck - 0.5);
      const i = y * n + x, i3 = i * 3;
      A[i3] = sat(base * 1.3); A[i3 + 1] = sat(base * 1.05); A[i3 + 2] = sat(base * 0.74);
      H[i] = sat(0.3 + 0.3 * ripple + 0.28 * (grain - 0.5));
      R[i] = sat(0.9);
    }
  }
}

function texRust(n, H, A, R) {
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      const patch = fbm2(u, v, 4, 4, 5, 13), patch2 = fbm2(u, v, 9, 9, 3, 83);
      const rust = sstep(0.34, 0.78, patch * 0.7 + patch2 * 0.3);
      const metal = 0.47 + 0.07 * fbm2(u, v, 2, 72, 2, 7);
      const flake = sstep(0.58, 0.9, fbm2(u, v, 36, 36, 3, 27));
      /* 锈层里再分深浅：内层暗褐、外层橙红，边缘有起皮 */
      const deep = sstep(0.55, 0.85, patch2);
      const rr = sat(mixf(0.5, 0.66, deep) + 0.12 * (patch - 0.5));
      const rg = sat(mixf(0.24, 0.32, deep) + 0.06 * (patch - 0.5));
      const rb = sat(0.09 + 0.05 * deep);
      const i = y * n + x, i3 = i * 3;
      A[i3] = mixf(metal * 0.97, rr, rust); A[i3 + 1] = mixf(metal, rg, rust); A[i3 + 2] = mixf(metal * 1.03, rb, rust);
      H[i] = sat(0.56 + 0.14 * rust - 0.1 * flake * rust - 0.08 * flake * (1 - rust) + 0.04 * (patch - 0.5));
      R[i] = sat(0.3 + 0.48 * rust + 0.08 * flake);
    }
  }
}

function texTerrazzo(n, H, A, R) {
  const PAPER = [[0.16, 0.17, 0.19], [0.58, 0.31, 0.22], [0.3, 0.34, 0.39], [0.64, 0.58, 0.47], [0.24, 0.4, 0.35], [0.74, 0.68, 0.57]];
  const w1 = { f1: 0, f2: 0, id: 0 }, w2 = { f1: 0, f2: 0, id: 0 }, w3 = { f1: 0, f2: 0, id: 0 };
  for (let y = 0; y < n; y++) {
    const v = (y + 0.5) / n;
    for (let x = 0; x < n; x++) {
      const u = (x + 0.5) / n;
      worley(u, v, 6, 29, w1); worley(u, v, 16, 41, w2); worley(u, v, 40, 53, w3);
      const chip = w1.f1 < 0.16 + 0.2 * w1.id ? 1 : (w2.f1 < 0.09 + 0.15 * w2.id ? 0.82 : (w3.f1 < 0.05 + 0.1 * w3.id ? 0.55 : 0));
      const pc = PAPER[Math.floor(w1.id * PAPER.length) % PAPER.length];
      const base = 0.82 + 0.03 * fbm2(u, v, 8, 8, 2, 5);
      const i = y * n + x, i3 = i * 3;
      A[i3] = mixf(base, pc[0], chip); A[i3 + 1] = mixf(base * 0.99, pc[1], chip); A[i3 + 2] = mixf(base * 0.96, pc[2], chip);
      H[i] = sat(0.5 + 0.05 * chip);
      R[i] = sat(0.14 + 0.2 * chip);
    }
  }
}

const TEXTURE_PRESETS = [
  { id: 'oak', label: '橡木地板', hint: '木材 · 室内', bump: 2.0, make: texOak },
  { id: 'brick', label: '红砖墙', hint: '砌体 · 建筑', bump: 2.6, make: texBrick },
  { id: 'concrete', label: '清水混凝土', hint: '水泥 · 建筑', bump: 1.3, make: texConcrete },
  { id: 'marble', label: '大理石', hint: '石材 · 抛光', bump: 1.0, make: texMarble },
  { id: 'brushed', label: '拉丝金属', hint: '金属 · 工业', bump: 0.7, make: texBrushed },
  { id: 'hex', label: '六角釉砖', hint: '瓷砖 · 卫浴', bump: 2.2, make: texHex },
  { id: 'cobble', label: '石板路', hint: '石材 · 户外', bump: 2.8, make: texCobble },
  { id: 'leather', label: '荔枝纹皮革', hint: '皮革 · 软装', bump: 1.9, make: texLeather },
  { id: 'linen', label: '亚麻布', hint: '织物 · 软装', bump: 2.4, make: texLinen },
  { id: 'sand', label: '沙地波纹', hint: '自然 · 地形', bump: 1.9, make: texSand },
  { id: 'rust', label: '锈蚀铁板', hint: '金属 · 做旧', bump: 2.0, make: texRust },
  { id: 'terrazzo', label: '水磨石', hint: '石材 · 地面', bump: 1.0, make: texTerrazzo }
];

class TextureStudio {
  constructor(d) {
    this.d = d;
    this.layers = new Map();   // `${id}|${size}` → {diff,nor,rough,size}
    this.textures = new Map(); // `${id}|${kind}|${size}` → THREE.DataTexture
    this.thumbs = new Map();   // `${id}|${kind}|${size}` → dataURL
  }
  presets() { return TEXTURE_PRESETS; }
  preset(id) { for (const p of TEXTURE_PRESETS) if (p.id === id) return p; return null; }
  clampSize(size) { return Math.max(64, Math.min(1024, Math.round(Number(size) || TEX_SIZE_DEFAULT))); }

  /* 一次生成三通道；同一 id + 尺寸只算一次 */
  bake(id, size) {
    const p = this.preset(id);
    if (!p) throw Error('未知贴图预设：' + id);
    const n = this.clampSize(size), key = id + '|' + n;
    const hit = this.layers.get(key);
    if (hit) return hit;
    const px = n * n;
    const H = new Float32Array(px), A = new Float32Array(px * 3), R = new Float32Array(px);
    p.make(n, H, A, R);
    const diff = new Uint8Array(px * 4), nor = new Uint8Array(px * 4), rough = new Uint8Array(px * 4);
    const k = (p.bump || 1.5) * (n / 256);
    for (let y = 0; y < n; y++) {
      const ym = (y - 1 + n) % n, yp = (y + 1) % n;
      for (let x = 0; x < n; x++) {
        const i = y * n + x, o = i * 4, i3 = i * 3;
        const xm = (x - 1 + n) % n, xp = (x + 1) % n;
        diff[o] = A[i3] * 255; diff[o + 1] = A[i3 + 1] * 255; diff[o + 2] = A[i3 + 2] * 255; diff[o + 3] = 255;
        const g = R[i] * 255; rough[o] = g; rough[o + 1] = g; rough[o + 2] = g; rough[o + 3] = 255;
        const hL = H[y * n + xm], hR = H[y * n + xp], hT = H[ym * n + x], hB = H[yp * n + x];
        const gx = (H[ym * n + xp] + 2 * hR + H[yp * n + xp]) - (H[ym * n + xm] + 2 * hL + H[yp * n + xm]);
        const gy = (H[yp * n + xm] + 2 * hB + H[yp * n + xp]) - (H[ym * n + xm] + 2 * hT + H[ym * n + xp]);
        /* N = (-dh/du, -dh/dv, 1)；DataTexture 的 flipY=false，v 随行号增大，所以 ny 取负号。
           用真实渲染核对过：光从上方来时凸起上半坡更亮，反之说明绿通道反了。 */
        const nx = -gx * 0.125 * k, ny = -gy * 0.125 * k;
        const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
        nor[o] = (nx * inv * 0.5 + 0.5) * 255;
        nor[o + 1] = (ny * inv * 0.5 + 0.5) * 255;
        nor[o + 2] = (inv * 0.5 + 0.5) * 255;
        nor[o + 3] = 255;
      }
    }
    const out = { diff: diff, nor: nor, rough: rough, size: n };
    this.layers.set(key, out);
    return out;
  }

  /* 生成/复用 THREE.DataTexture；kind = diff | nor | rough */
  texture(id, kind, size) {
    kind = kind || 'diff';
    const n = this.clampSize(size), key = id + '|' + kind + '|' + n;
    const hit = this.textures.get(key);
    if (hit) return hit;
    const L = this.bake(id, n);
    const T = this.d.THREE;
    const data = kind === 'nor' ? L.nor : kind === 'rough' ? L.rough : L.diff;
    const tex = new T.DataTexture(data, n, n, T.RGBAFormat, T.UnsignedByteType);
    tex.colorSpace = kind === 'diff' ? (T.SRGBColorSpace || T.NoColorSpace) : (T.LinearSRGBColorSpace || T.NoColorSpace);
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.magFilter = T.LinearFilter;
    tex.minFilter = T.LinearMipmapLinearFilter || T.LinearFilter;
    tex.generateMipmaps = true;
    const caps = this.d.renderer && this.d.renderer.capabilities;
    tex.anisotropy = Math.min(8, caps && caps.getMaxAnisotropy ? caps.getMaxAnisotropy() : 1);
    tex.needsUpdate = true;
    tex.name = 'preset:' + id + ':' + kind;
    tex.userData.tsdPreset = { id: id, kind: kind, label: this.preset(id).label };
    this.textures.set(key, tex);
    return tex;
  }

  /* 贴图库缩略图：直接拿同一套生成器在小尺寸上重算，观感与大图一致 */
  thumb(id, kind, size) {
    kind = kind || 'diff';
    const n = Math.max(48, Math.min(192, Math.round(size || 96)));
    const key = id + '|' + kind + '|' + n;
    const hit = this.thumbs.get(key);
    if (hit) return hit;
    const L = this.bake(id, n);
    const data = kind === 'nor' ? L.nor : kind === 'rough' ? L.rough : L.diff;
    const doc = this.d.doc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return null;
    const cv = doc.createElement('canvas');
    cv.width = cv.height = n;
    const ctx = cv.getContext('2d');
    const img = ctx.createImageData(n, n);
    img.data.set(data);
    ctx.putImageData(img, 0, 0);
    const url = cv.toDataURL('image/jpeg', 0.86);
    this.thumbs.set(key, url);
    return url;
  }

  dispose() {
    for (const t of this.textures.values()) { try { t.dispose(); } catch (e) { } }
    this.textures.clear(); this.layers.clear(); this.thumbs.clear();
  }
}

/* ======================= 环境贴图（程序化 + HDR 素材） ======================= */
const ENV_PRESETS = [
  { id: 'none', label: '\u65e0\uff08\u4e0d\u6539\u53d8\uff09' },
  { id: 'studio', label: '\u5de5\u4f5c\u5ba4\u67d4\u5149' },
  { id: 'sunset', label: '\u9ec4\u660f' },
  { id: 'night', label: '\u591c\u7a7a' },
  { id: 'white', label: '\u7eaf\u767d' },
  { id: 'gray', label: '\u4e2d\u6027\u7070' }
];
const ENV_RAMPS = {
  studio: [[0, [250, 251, 255]], [0.40, [231, 237, 247]], [0.50, [196, 204, 216]], [0.58, [126, 132, 144]], [1, [74, 78, 86]]],
  sunset: [[0, [24, 32, 76]], [0.34, [92, 62, 122]], [0.46, [226, 114, 74]], [0.52, [255, 176, 104]], [0.60, [86, 56, 58]], [1, [26, 20, 22]]],
  night: [[0, [5, 8, 18]], [0.42, [11, 17, 36]], [0.50, [26, 36, 60]], [0.56, [10, 14, 26]], [1, [3, 4, 9]]],
  white: [[0, [255, 255, 255]], [1, [255, 255, 255]]],
  gray: [[0, [146, 148, 152]], [1, [146, 148, 152]]]
};
const lerp = (a, b, t) => a + (b - a) * t;
function rampAt(stops, t) {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const p0 = stops[i - 1][0], c0 = stops[i - 1][1], p1 = stops[i][0], c1 = stops[i][1];
    if (t <= p1) { const k = (t - p0) / (p1 - p0 || 1); return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)]; }
  }
  return stops[stops.length - 1][1];
}
class EnvironmentLibrary {
  constructor(d) { this.d = d; this.entries = new Map(); this.pmrem = null; this.current = 'none'; this.token = 0; this.loading = null; }
  presets() {
    const out = ENV_PRESETS.slice();
    const a = this.d.assets;
    if (a && a.hdrItems.length) for (const h of a.hdrItems) out.push({ id: 'hdr:' + h.id, label: h.label + '（HDR）', thumb: h.thumb });
    return out;
  }
  paint(id, w, h) {
    const T = this.d.THREE;
    const stops = ENV_RAMPS[id] || ENV_RAMPS.gray;
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1);
        let c = rampAt(stops, v).slice();
        if (id === 'studio' && v < 0.20) {
          const d1 = Math.abs(u - 0.30), d2 = Math.abs(u - 0.74);
          if (d1 < 0.075 || d2 < 0.055) { const k = 1 - Math.min(d1 < 0.075 ? d1 : d2, 0.075) / 0.075; c = c.map(n => lerp(n, 255, 0.85 * k)); }
        }
        if (id === 'night' && v < 0.5) {
          const hs = ((x * 73856093) ^ (y * 19349663)) >>> 0;
          if (hs % 1500 === 0) c = [255, 255, 255];
        }
        const i = ((h - 1 - y) * w + x) * 4;
        data[i] = clamp(Math.round(c[0]), 0, 255);
        data[i + 1] = clamp(Math.round(c[1]), 0, 255);
        data[i + 2] = clamp(Math.round(c[2]), 0, 255);
        data[i + 3] = 255;
      }
    }
    const tex = new T.DataTexture(data, w, h, T.RGBAFormat);
    tex.mapping = T.EquirectangularReflectionMapping;
    if (T.SRGBColorSpace) tex.colorSpace = T.SRGBColorSpace;
    tex.flipY = false;
    tex.needsUpdate = true;
    return tex;
  }
  entry(id) {
    if (this.entries.has(id)) return this.entries.get(id);
    const T = this.d.THREE;
    if (!T || !T.PMREMGenerator) throw Error('THREE.PMREMGenerator unavailable');
    const source = this.paint(id, 512, 256);
    if (!this.pmrem) this.pmrem = new T.PMREMGenerator(this.d.renderer);
    const target = this.pmrem.fromEquirectangular(source);
    const entry = { env: target.texture, bg: source, target: target };
    this.entries.set(id, entry);
    return entry;
  }
  capture() {
    const d = this.d;
    if (d._envCaptured) return;
    d._envCaptured = true;
    d._envOriginal = d.scene.environment || null;
    d._envBackground = d.scene.background || null;
    d._envBgBlur = 'backgroundBlurriness' in d.scene ? d.scene.backgroundBlurriness : 0;
  }
  restoreNone() {
    const d = this.d;
    d.scene.environment = d._envOriginal || null;
    d.scene.background = d._envBackground || null;
    if ('backgroundBlurriness' in d.scene) d.scene.backgroundBlurriness = d._envBgBlur == null ? 0 : d._envBgBlur;
  }
  applyEntry(e) {
    const d = this.d;
    d.scene.environment = e.env;
    if (d._envUseAsBackground) {
      d.scene.background = e.bg;
      if ('backgroundBlurriness' in d.scene) d.scene.backgroundBlurriness = d._envBgBlur;
    }
  }
  status() {
    if (this.d && !this.d.destroyed && this.d.ui && this.d.ui.envChanged) this.d.ui.envChanged();
  }
  apply(id) {
    const d = this.d;
    if (!d || d.destroyed) return this;
    if (!this.presets().some(p => p.id === id)) throw Error('Unknown environment preset: ' + id);
    this.current = id;
    if (id === 'none') { this.token++; this.loading = null; this.restoreNone(); this.status(); return this; }
    this.capture();
    if (id.startsWith('hdr:')) {
      const token = ++this.token;
      this.loading = id;
      this.status();
      if (!d.assets) { d.warnings.add('未配置 assets，无法加载 HDR 环境贴图'); this.loading = null; this.status(); return this; }
      d.assets.env(id.slice(4)).then(e => {
        if (token !== this.token || d.destroyed) return;
        this.applyEntry(e);
        this.loading = null;
        this.status();
        d.emit('env', id);
      }).catch(err => {
        if (token !== this.token || d.destroyed) return;
        this.loading = null;
        this.status();
        d.warnings.add('HDR 环境贴图加载失败：' + (err.message || err));
        if (d.ui && d.ui.message) d.ui.message.textContent = 'HDR 加载失败：' + (err.message || err);
      });
      return this;
    }
    this.loading = null;
    this.applyEntry(this.entry(id));
    this.status();
    return this;
  }
  setUseAsBackground(on) {
    const d = this.d;
    d._envUseAsBackground = !!on;
    if (this.current === 'none') return this;
    if (on) {
      this.apply(this.current);
    } else {
      d.scene.background = d._envBackground || null;
      if ('backgroundBlurriness' in d.scene) d.scene.backgroundBlurriness = d._envBgBlur == null ? 0 : d._envBgBlur;
    }
    return this;
  }
  destroy() {
    const d = this.d;
    if (d && d.scene) {
      try { this.restoreNone(); } catch (e) { }
      if (d.scene.environment && d._envOriginal) d.scene.environment = d._envOriginal;
    }
    for (const e of this.entries.values()) {
      try { e.target && e.target.dispose && e.target.dispose(); } catch (err) { }
      try { e.bg && e.bg.dispose && e.bg.dispose(); } catch (err) { }
    }
    this.entries.clear();
    try { this.pmrem && this.pmrem.dispose && this.pmrem.dispose(); } catch (err) { }
    this.pmrem = null;
    this.d = null;
  }
}

/* ======================= 后期处理（自包含 Bloom / 调色 / 暗角 / 色差 / 颗粒） ======================= */
const POSTFX_DEFAULTS = {
  enabled: false,
  view: 'final',
  bloom: { enabled: true, strength: 0.8, radius: 0.6, threshold: 1.0 },
  grade: { brightness: 0, contrast: 1, saturation: 1, temperature: 0, tint: 0 },
  vignette: { amount: 0.35, softness: 0.6 },
  aberration: 0, grain: 0, sharpen: 0, outline: 0, pixelate: 1,
  /* 虚化（BokehPass 景深）：独立于总开关，默认关闭。focus 是**世界单位**的对焦距离，
     默认值会在接管 composer 时改成「相机到观察中心」，不同页面尺度差很多（本项目整场景 2 单位）。 */
  bokeh: { enabled: false, focus: 10, aperture: 0.025, maxblur: 0.02 }
};
const POSTFX_LIMITS = {
  'bloom.strength': [0, 5, 0.01], 'bloom.radius': [0, 1, 0.01], 'bloom.threshold': [0, 2, 0.01],
  'grade.brightness': [-1, 1, 0.01], 'grade.contrast': [0, 2, 0.01], 'grade.saturation': [0, 2, 0.01],
  'grade.temperature': [-1, 1, 0.01], 'grade.tint': [-1, 1, 0.01],
  'vignette.amount': [0, 1, 0.01], 'vignette.softness': [0.05, 1.5, 0.01],
  aberration: [0, 8, 0.05], grain: [0, 1, 0.01], sharpen: [0, 1, 0.01], outline: [0, 1, 0.01], pixelate: [1, 32, 1],
  'bokeh.focus': [0, 500, 0.05], 'bokeh.aperture': [0, 0.05, 0.0001], 'bokeh.maxblur': [0, 0.2, 0.001]
};
const POSTFX_VIEWS = [['final', '最终画面'], ['wireframe', '线框'], ['normal', '法线'], ['flat', '无光照剪影']];
const ENUM_GROUPS = {
 toneMapping: ['NoToneMapping','LinearToneMapping','ReinhardToneMapping','CineonToneMapping','ACESFilmicToneMapping','AgXToneMapping','NeutralToneMapping','CustomToneMapping'],
 side: ['FrontSide','BackSide','DoubleSide'],
 blending: ['NoBlending','NormalBlending','AdditiveBlending','SubtractiveBlending','MultiplyBlending','CustomBlending'],
 wrap: ['RepeatWrapping','ClampToEdgeWrapping','MirroredRepeatWrapping'],
 magFilter: ['NearestFilter','LinearFilter'],
 minFilter: ['NearestFilter','NearestMipmapNearestFilter','NearestMipmapLinearFilter','LinearFilter','LinearMipmapNearestFilter','LinearMipmapLinearFilter'],
 depthFunc: ['NeverDepth','AlwaysDepth','LessDepth','LessEqualDepth','EqualDepth','GreaterEqualDepth','GreaterDepth','NotEqualDepth'],
 shadowMapType: ['BasicShadowMap','PCFShadowMap','PCFSoftShadowMap','VSMShadowMap'],
 colorSpace: ['NoColorSpace','SRGBColorSpace','LinearSRGBColorSpace','DisplayP3ColorSpace']
};
const POSTFX_VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
const POSTFX_FRAG = {
  threshold: 'uniform sampler2D tDiffuse; uniform float uThreshold; uniform float uKnee; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); float l = max(c.r, max(c.g, c.b)); float s = clamp((l - uThreshold) / max(uKnee, 0.0001), 0.0, 1.0); gl_FragColor = vec4(c.rgb * s, 1.0); }',
  blur: 'uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform vec2 uDir; varying vec2 vUv; void main(){ vec2 d = uDir * uTexel; vec3 c = texture2D(tDiffuse, vUv).rgb * 0.2270270270; c += texture2D(tDiffuse, vUv + d * 1.3846153846).rgb * 0.3162162162; c += texture2D(tDiffuse, vUv - d * 1.3846153846).rgb * 0.3162162162; c += texture2D(tDiffuse, vUv + d * 3.2307692308).rgb * 0.0702702703; c += texture2D(tDiffuse, vUv - d * 3.2307692308).rgb * 0.0702702703; gl_FragColor = vec4(c, 1.0); }',
  composite: [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D tScene, tB0, tB1, tB2, tB3;',
    'uniform vec2 uResolution;',
    'uniform float uBloom, uBloomStrength, uW0, uW1, uW2, uW3, uBrightness, uContrast, uSaturation, uTemperature, uTint;',
    'uniform float uVignette, uVignetteSoft, uAberration, uGrain, uSharpen, uOutline, uPixelate, uTime;',
    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }',
    'vec3 tone(vec3 c){',
    '#if defined( TONE_MAPPING )',
    '  return toneMapping(c);',
    '#else',
    '  return c;',
    '#endif',
    '}',
    'vec3 sceneAt(vec2 uv){ return texture2D(tScene, uv).rgb; }',
    'void main(){',
    '  vec2 res = max(uResolution, vec2(1.0));',
    '  vec2 uv = vUv;',
    '  if(uPixelate > 1.0){ uv = (floor(uv * res / uPixelate) + 0.5) * uPixelate / res; }',
    '  vec2 dir = uv - vec2(0.5);',
    '  float dist = length(dir);',
    '  vec3 hdr;',
    '  if(uAberration > 0.0001){',
    '    vec2 off = dir * uAberration / res * 2.0;',
    '    hdr = vec3(sceneAt(uv + off).r, sceneAt(uv).g, sceneAt(uv - off).b);',
    '  } else { hdr = sceneAt(uv); }',
    '  if(uBloom > 0.5){',
    '    vec3 b = texture2D(tB0, uv).rgb * uW0 + texture2D(tB1, uv).rgb * uW1 + texture2D(tB2, uv).rgb * uW2 + texture2D(tB3, uv).rgb * uW3;',
    '    hdr += b * uBloomStrength;',
    '  }',
    '  vec3 col = tone(hdr);',
    '  if(uSharpen > 0.0001){',
    '    vec2 px = 1.0 / res;',
    '    vec3 avg = (tone(sceneAt(uv + vec2(px.x, 0.0))) + tone(sceneAt(uv - vec2(px.x, 0.0))) + tone(sceneAt(uv + vec2(0.0, px.y))) + tone(sceneAt(uv - vec2(0.0, px.y)))) * 0.25;',
    '    col = clamp(col + (col - avg) * uSharpen * 1.6, 0.0, 4.0);',
    '  }',
    '  if(uOutline > 0.0001){',
    '    vec2 px = 1.0 / res;',
    '    float l0 = luma(col);',
    '    float l1 = luma(tone(sceneAt(uv + vec2(px.x, 0.0))));',
    '    float l2 = luma(tone(sceneAt(uv - vec2(px.x, 0.0))));',
    '    float l3 = luma(tone(sceneAt(uv + vec2(0.0, px.y))));',
    '    float l4 = luma(tone(sceneAt(uv - vec2(0.0, px.y))));',
    '    float edge = clamp((abs(l1 - l0) + abs(l2 - l0) + abs(l3 - l0) + abs(l4 - l0)) * 2.5, 0.0, 1.0);',
    '    col = mix(col, vec3(0.25, 0.95, 1.0), edge * uOutline);',
    '  }',
    '  col += uBrightness;',
    '  col = (col - 0.5) * uContrast + 0.5;',
    '  float gray = luma(col);',
    '  col = mix(vec3(gray), col, uSaturation);',
    '  col.r += uTemperature * 0.12; col.b -= uTemperature * 0.12;',
    '  col.g += uTint * 0.10; col.r -= uTint * 0.05; col.b -= uTint * 0.05;',
    '  if(uVignette > 0.0001){ float v = smoothstep(uVignetteSoft, 1.25, dist * 1.35) * uVignette; col *= 1.0 - v; }',
    '  if(uGrain > 0.0001){ float n = hash(uv * res + fract(uTime) * 97.0) - 0.5; col += n * uGrain * 0.16; }',
    '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);',
    '  #include <colorspace_fragment>',
    '}'
  ].join('\n')
};
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
function mergeDeep(base, patch) {
  for (const k of Object.keys(patch || {})) {
    const v = patch[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') mergeDeep(base[k], v);
    else if (v !== undefined) base[k] = v;
  }
  return base;
}
function setPath(o, path, value) {
  const a = parts(path), k = a.pop();
  let p = o;
  for (const x of a) p = p[x];
  p[k] = value;
}
class PostFX {
  constructor(d, options) {
    options = options || {};
    this.d = d;
    this.canvas = d.renderer.domElement;
    this.state = deepClone(POSTFX_DEFAULTS);
    if (options.postfx) mergeDeep(this.state, options.postfx);
    this.destroyed = false;
    this.width = 0;
    this.height = 0;
    this.levels = [];
    this.bright = null;
    this.rt = null;
    this.inside = false;
    this.sceneInfo = null;
    this.materials = {};
    /* ---- 宿主 EffectComposer 接管状态 ----
       off    : 没注册 composer，走自带的离屏链路（patch renderer.render）
       attach : composer 里已经有 Bloom pass，面板参数直连它，另插一条「调色附加 pass」
       inject : composer 里没有 Bloom，启用后自己往 composer 里插一条完整后期 pass
       两种 composer 模式都不再去 patch 输出：画面由宿主的 pass 链产生。 */
    this.composer = null;
    this.composerMode = 'off';
    this.hostBloom = null;
    this.hostBaseline = null;
    this.composerPass = null;
    this.composerIndex = -1;
    this.composerLinear = true;
    this.composerDefaults = null;
    /* BokehPass 由宿主注入：技能内不 import addon，避免打包第二份 three */
    this.bokehCtor = options.bokehPass || options.BokehPass || null;
    this.bokehPass = null;
    this.bokehRT = null;
    this._bokehTouched = false;   // 用户是否手动调过虚化参数（调过就不再自动覆盖）
    this._bokehWasOn = false;
    this.buildQuad();
    this.hook();
  }
  buildQuad() {
    const T = this.d.THREE;
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    g.setAttribute('uv', new T.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    this.geometry = g;
    this.quadScene = new T.Scene();
    this.quadCamera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new T.Mesh(g, this.material('composite'));
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }
  material(kind) {
    if (this.materials[kind]) return this.materials[kind];
    const T = this.d.THREE;
    /* compositeLinear：给「输出到宿主 composer 的中间 RT」用的变体。
       中间目标里存的必须是线性值，颜色编码（sRGB）与 tone mapping 要留给宿主链条末尾
       的 OutputPass / GammaCorrectionShader 去做。否则会被编码两次：暗部压死、
       只剩自发光亮部——看起来像「后期一开画面就黑」。 */
    const linear = kind === 'compositeLinear';
    const base = linear ? 'composite' : kind;
    let uniforms = {};
    if (base === 'threshold') uniforms = { tDiffuse: { value: null }, uThreshold: { value: 1.0 }, uKnee: { value: 0.5 } };
    else if (base === 'blur') uniforms = { tDiffuse: { value: null }, uTexel: { value: new T.Vector2(1, 1) }, uDir: { value: new T.Vector2(1, 0) } };
    else uniforms = {
      tScene: { value: null }, tB0: { value: null }, tB1: { value: null }, tB2: { value: null }, tB3: { value: null },
      uResolution: { value: new T.Vector2(1, 1) }, uBloom: { value: 1 }, uBloomStrength: { value: 0.8 },
      uW0: { value: 0.4 }, uW1: { value: 0.28 }, uW2: { value: 0.2 }, uW3: { value: 0.12 },
      uBrightness: { value: 0 }, uContrast: { value: 1 }, uSaturation: { value: 1 }, uTemperature: { value: 0 }, uTint: { value: 0 },
      uVignette: { value: 0.35 }, uVignetteSoft: { value: 0.6 }, uAberration: { value: 0 }, uGrain: { value: 0 }, uSharpen: { value: 0 },
      uOutline: { value: 0 }, uPixelate: { value: 1 }, uTime: { value: 0 }
    };
    let fragSrc = POSTFX_FRAG[base];
    if (linear) fragSrc = fragSrc.replace(/\s*#include <colorspace_fragment>/, '');
    // 合成通道上屏时交给 three 做色彩编码（colorspace_fragment），因此 toneMapped 为 true；
    // 阈值/模糊通道与 composer 内联变体工作在渲染目标的线性空间，保持 false。
    const m = new T.ShaderMaterial({
      uniforms: uniforms, vertexShader: POSTFX_VERT, fragmentShader: fragSrc,
      depthTest: false, depthWrite: false, toneMapped: base === 'composite' && !linear
    });
    m.name = 'TsdPostFX_' + kind;
    this.materials[kind] = m;
    return m;
  }
  hook() {
    const renderer = this.d.renderer;
    this.original = renderer.render.bind(renderer);
    this.patched = (scene, camera) => {
      if (this.destroyed) return this.original(scene, camera);
      /* EffectComposer 的 RenderPass 会先把目标切到 writeBuffer 再调用 renderer.render。
         这种「已经绑着 RT」的调用必须整趟让路：
           - 0.8.4 试过在 composer 链路里内联合成（渲进自己的 rt → 写回调用前的目标），
             MSAA + HalfFloat 的中间目标上实测画面会塌（暗部全黑、只剩自发光），
             因为多采样目标未 resolve 就被下游采样。
           - composer 场景要让画面变，正确入口是面板目标下拉里的 `pass:<index>`
             （先 registerPostProcessing(composer)），改 bloomPass.strength 这类参数，
             下一帧就生效，而且不碰宿主管线。 */
      if (this.inside || renderer.getRenderTarget() !== null) return this.original(scene, camera);
      /* composer 的最后一个 pass 会用全屏四边形把结果画到屏幕，那也是 renderer.render
         调用、RT 为 null。three 的 Pass.FullScreenQuad 直接 `renderer.render(mesh, camera)`，
         有些自定义 pass 传的是「只有一个 Mesh 的 scene」，两种都要认。不排除的话调试器
         会把已经后期过的画面当场景再套一层（亮度/暗角二次叠加）。 */
      const quad = scene && scene.isMesh
        ? scene
        : (scene && scene.children && scene.children.length === 1 ? scene.children[0] : null);
      if (quad && quad.isMesh && quad.geometry && camera && camera.isOrthographicCamera) return this.original(scene, camera);
      const s = this.state, view = s.view !== 'final';
      if (!s.enabled && !view) return this.original(scene, camera);
      const prevOv = view ? scene.overrideMaterial : null;
      if (view) scene.overrideMaterial = this.viewMaterial(s.view);
      if (!s.enabled) {
        try { return this.original(scene, camera); } finally { if (view) scene.overrideMaterial = prevOv; }
      }
      const w = this.canvas.width | 0, h = this.canvas.height | 0;
      if (w < 4 || h < 4) {
        if (view) scene.overrideMaterial = prevOv;
        return this.original(scene, camera);
      }
      this.ensureTargets(w, h);
      this.inside = true;
      try {
        renderer.setRenderTarget(this.rt);
        this.original(scene, camera);
        const ri = renderer.info && renderer.info.render;
        if (ri) this.sceneInfo = { calls: ri.calls, triangles: ri.triangles };
        renderer.setRenderTarget(null);
        this.compose();
      } finally {
        this.inside = false;
        renderer.setRenderTarget(null);
        if (view) scene.overrideMaterial = prevOv;
      }
    };
    renderer.render = this.patched;
  }
  viewMaterial(mode) {
    if (!this._views) this._views = {};
    if (this._views[mode]) return this._views[mode];
    const T = this.d.THREE;
    let m = null;
    if (mode === 'wireframe') m = new T.MeshBasicMaterial({ wireframe: true, color: 0x67e8f9 });
    else if (mode === 'normal') m = new T.MeshNormalMaterial();
    else if (mode === 'flat') m = new T.MeshBasicMaterial({ color: 0x9aa8bd });
    if (m) m.name = 'TsdView_' + mode;
    this._views[mode] = m;
    return m;
  }
  ensureTargets(w, h) {
    if (this.rt && this.width === w && this.height === h) return;
    if (this.rt) { this.rt.dispose(); this.rt = null; }
    const T = this.d.THREE, renderer = this.d.renderer, caps = renderer.capabilities || {};
    const ext = renderer.extensions;
    const half = !!(caps.isWebGL2 && ext && (ext.has('EXT_color_buffer_float') || ext.has('EXT_color_buffer_half_float')));
    const type = half ? T.HalfFloatType : T.UnsignedByteType;
    const base = { type: type, minFilter: T.LinearFilter, magFilter: T.LinearFilter, depthBuffer: false, stencilBuffer: false };
    this.hdr = half;
    this._base = base;
    // 场景目标：带深度 + MSAA，保证遮罩正确且抗锯齿不丢
    this.rt = new T.WebGLRenderTarget(w, h, Object.assign({ depthBuffer: true, samples: caps.isWebGL2 ? 4 : 0 }, base));
    this.rt.texture.name = 'TsdSceneTarget';
    this.ensureBloomTargets(w, h);
  }
  /* composer 模式下没有自制场景 RT，这里只维护 bloom 的降采样链 */
  ensureBloomTargets(w, h) {
    if (this.width === w && this.height === h && this.levels.length) return;
    this.dropBloomTargets();
    const T = this.d.THREE;
    const base = this._base || { type: T.HalfFloatType, minFilter: T.LinearFilter, magFilter: T.LinearFilter, depthBuffer: false, stencilBuffer: false };
    let cw = Math.max(1, w >> 1), ch = Math.max(1, h >> 1);
    this.bright = new T.WebGLRenderTarget(cw, ch, base);
    this.levels = [];
    for (let i = 0; i < 4; i++) {
      this.levels.push({ w: cw, h: ch, a: new T.WebGLRenderTarget(cw, ch, base), b: new T.WebGLRenderTarget(cw, ch, base) });
      cw = Math.max(1, cw >> 1);
      ch = Math.max(1, ch >> 1);
    }
    this.width = w;
    this.height = h;
  }
  dropBloomTargets() {
    if (this.bright) { this.bright.dispose(); this.bright = null; }
    for (const lv of this.levels) { lv.a.dispose(); lv.b.dispose(); }
    this.levels = [];
    this.width = 0;
    this.height = 0;
  }
  draw(material, target, uniforms) {
    for (const k of Object.keys(uniforms)) { const u = material.uniforms[k]; if (u) u.value = uniforms[k]; }
    this.quad.material = material;
    const renderer = this.d.renderer;
    renderer.setRenderTarget(target);
    renderer.render(this.quadScene, this.quadCamera);
  }
  /* radius 从「只有权重」变成了真正参与合成：越小越贴紧亮部，越大越铺成柔光 */
  bloomWeights(radius) {
    const r = clamp(Number(radius) || 0, 0, 1), k = 0.35 + r * 1.3;
    const raw = [0.40, 0.28 * k, 0.20 * k * k, 0.12 * k * k * k];
    const sum = raw.reduce((a, b) => a + b, 0) || 1;
    return raw.map(v => v / sum);
  }
  /* 把一张「场景颜色贴图」过完整条后期链，产物写进 target（null = 屏幕）。
     linear=true 时不做 tone mapping / sRGB 编码——留给宿主 composer 的 OutputPass。 */
  renderInto(renderer, sceneTexture, target, w, h, allowBloom, linear) {
    const T = this.d.THREE, s = this.state;
    this.ensureBloomTargets(w, h);
    const bloom = !!allowBloom && s.bloom.enabled && s.bloom.strength > 0;
    if (bloom) {
      const th = s.bloom.threshold, knee = Math.max(0.02, th * 0.5);
      this.draw(this.material('threshold'), this.bright, { tDiffuse: sceneTexture, uThreshold: th, uKnee: knee });
      let input = this.bright.texture;
      for (const lv of this.levels) {
        this.draw(this.material('blur'), lv.a, { tDiffuse: input, uTexel: new T.Vector2(1 / lv.w, 1 / lv.h), uDir: new T.Vector2(1, 0) });
        this.draw(this.material('blur'), lv.b, { tDiffuse: lv.a.texture, uTexel: new T.Vector2(1 / lv.w, 1 / lv.h), uDir: new T.Vector2(0, 1) });
        input = lv.b.texture;
      }
    }
    const b0 = this.levels[0] ? this.levels[0].b.texture : null;
    const b1 = this.levels[1] ? this.levels[1].b.texture : null;
    const b2 = this.levels[2] ? this.levels[2].b.texture : null;
    const b3 = this.levels[3] ? this.levels[3].b.texture : null;
    const wts = this.bloomWeights(s.bloom.radius);
    this.draw(this.material(linear ? 'compositeLinear' : 'composite'), target, {
      tScene: sceneTexture, tB0: b0, tB1: b1, tB2: b2, tB3: b3,
      uW0: wts[0], uW1: wts[1], uW2: wts[2], uW3: wts[3],
      uResolution: new T.Vector2(w, h), uBloom: bloom ? 1 : 0, uBloomStrength: s.bloom.strength,
      uBrightness: s.grade.brightness, uContrast: s.grade.contrast, uSaturation: s.grade.saturation, uTemperature: s.grade.temperature, uTint: s.grade.tint,
      uVignette: s.vignette.amount, uVignetteSoft: s.vignette.softness, uAberration: s.aberration, uGrain: s.grain, uSharpen: s.sharpen,
      uOutline: s.outline, uPixelate: s.pixelate, uTime: (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000
    });
    renderer.setRenderTarget(target);
  }
  compose(target = null) {
    if (!this.rt) return;
    const renderer = this.d.renderer, w = this.width, h = this.height;
    /* 无 composer 时虚化插不进 pass 链，就在「场景已渲完」与「bloom / 合成」之间自己做一趟 */
    const tex = (this.bokehPass && this.state.bokeh.enabled && !this.composer)
      ? this.runBokehOff(renderer, w, h)
      : this.rt.texture;
    this.renderInto(renderer, tex, target, w, h, true, !!target);
  }
  /* ================= 宿主 composer 接管 ================= */

  /* 认出「能当 Bloom 用」的 pass：既认 isUnrealBloomPass，也认自定义包装（有这三个数值字段） */
  static isBloomPass(p) {
    if (!p || typeof p !== 'object') return false;
    if (p.isUnrealBloomPass) return true;
    const name = (p.constructor && p.constructor.name) || '';
    if (/bloom/i.test(name)) return true;
    return typeof p.strength === 'number' && typeof p.radius === 'number' && typeof p.threshold === 'number';
  }
  /* 接管：把宿主现值读进 state（画面不跳），再把面板参数直连过去。
     调用时机是 registerPostProcessing()，此时 enabled 仍是 false —— 也就是「只挂上去，不动画面」。 */
  attachComposer(composer) {
    if (!composer || !Array.isArray(composer.passes)) throw Error('Expected composer.passes');
    this.releaseComposer();
    this.composer = composer;
    const bloom = composer.passes.find(p => PostFX.isBloomPass(p)) || null;
    this.hostBloom = bloom;
    if (bloom) {
      const b = {
        enabled: bloom.enabled !== false,
        strength: Number(bloom.strength),
        radius: Number(bloom.radius),
        threshold: Number(bloom.threshold)
      };
      this.hostBaseline = b;
      this.state.bloom.enabled = b.enabled;
      if (Number.isFinite(b.strength)) this.state.bloom.strength = b.strength;
      if (Number.isFinite(b.radius)) this.state.bloom.radius = b.radius;
      if (Number.isFinite(b.threshold)) this.state.bloom.threshold = b.threshold;
      this.composerMode = 'attach';
    } else {
      this.composerMode = 'inject';
      /* 宿主没有后期：默认值要「一勾就能看见」。阈值是线性 HDR 亮度，1.0 表示只有白点以上
         的像素才发光——暗场景（室内、夜景）开起来会像没开，所以这里给 0.5。 */
      this.state.bloom.enabled = true;
      this.state.bloom.strength = 1.2;
      this.state.bloom.threshold = 0.35;
    }
    /* 注册 composer 就等于接管：直接把总开关置为 true。
       0.9.1 及之前这里留的是 false（想「只挂上去、不动画面」），但参数其实是从宿主读来的，
       开与不开画面完全一样——代价却是「镜头与风格 / 色彩校正 / 暗角」全被这层开关挡住，
       拖滑块只改数字、画面纹丝不动，看着像坏了。Bloom 三项因为直写宿主 pass 还能生效，
       于是又显得「半好半坏」。现在：attach 挂上即接管，取消勾选才是真正交还宿主；
       inject（宿主本来没有后期）保持关闭，否则页面一加载就被套上一层泛光，基线被改掉。 */
    this.state.enabled = this.composerMode === 'attach';
    /* 接管时默认不加暗角：打开接管后画面应与宿主原样一致，需要时自己往上调 */
    setPath(this.state, 'vignette.amount', 0);
    /* 虚化的对焦距离 / 光圈先按当时机位给一组，真正勾开时还会再算一次（见 syncBokeh） */
    this.resetBokehDistance();
    this.composerDefaults = deepClone(this.state);
    this.ensureComposerPass();
    this.applyComposer();
    /* 面板可能早在注册 composer 之前就建好了，这里要把从宿主读到的值刷回滑块，
       否则出现「state 是 0.5、滑块停在 0.8」的错位——用户会以为接管没生效。 */
    if (this.d && this.d.ui && this.d.ui.syncPostFX) this.d.ui.syncPostFX();
    return this;
  }
  /* 调色 / 暗角这些「宿主没有的」效果，用一条插进 composer 的 pass 实现。
     不再去 patch renderer.render —— 那条内联路线在宿主 MSAA + HalfFloat 目标上会塌成黑屏。 */
  ensureComposerPass() {
    if (!this.composer || this.composerPass) return;
    const passes = this.composer.passes;
    const isOut = p => {
      const n = (p && p.constructor && p.constructor.name) || '';
      if (/Output|GammaCorrection/i.test(n)) return true;
      /* GammaCorrectionShader 被包进 ShaderPass 后构造函数名只剩 "ShaderPass"，只能看片元里
         有没有色彩编码的 include；认错位置的代价是「已经编码过再编一次」，画面会整体发灰发白。 */
      const fs = p && p.material && p.material.fragmentShader;
      return typeof fs === 'string' && /colorspace_fragment|sRGBTransferOETF|LinearTosRGB|GammaCorrection/i.test(fs);
    };
    const outAt = passes.findIndex(isOut);
    this.composerLinear = outAt >= 0;
    /* 有 OutputPass / GammaCorrection 就插在它前面：pass 输出线性值，编码交给宿主收尾。
       没有编码 pass 就插在末尾，自己完成 tone mapping + sRGB。 */
    this.composerIndex = outAt >= 0 ? outAt : passes.length;
    const pass = new TsdPostFXPass(this);
    this.composerPass = pass;
    passes.splice(this.composerIndex, 0, pass);
  }
  releaseComposer() {
    const c = this.composer;
    if (c && this.composerPass) {
      const i = c.passes.indexOf(this.composerPass);
      if (i >= 0) c.passes.splice(i, 1);
    }
    if (this.composerPass) { try { this.composerPass.dispose(); } catch (e) { } }
    this.composerPass = null;
    this.composerIndex = -1;
    /* 换 composer / 销毁时虚化必须整条摘掉，否则会挂到旧链上继续渲 */
    this.detachBokehPass();
    /* 把宿主的 Bloom 还原成接管前的样子，避免调试器销毁后泛光莫名其妙变了 */
    if (this.hostBloom && this.hostBaseline) {
      const b = this.hostBaseline;
      if (Number.isFinite(b.strength)) this.hostBloom.strength = b.strength;
      if (Number.isFinite(b.radius)) this.hostBloom.radius = b.radius;
      if (Number.isFinite(b.threshold)) this.hostBloom.threshold = b.threshold;
      this.hostBloom.enabled = b.enabled;
    }
    this.hostBloom = null;
    this.hostBaseline = null;
    this.composer = null;
    this.composerMode = 'off';
    this.composerDefaults = null;
  }
  /* ================= 虚化通道（BokehPass 景深） =================
     为什么不自己写一遍 bokeh shader：宿主注入的是官方 BokehPass，面板里看到的就是
     工程里接入后得到的效果，导出提示词也不会出现「面板一套、代码另一套」。
     三种模式：
       attach / inject（有 composer）：pass 插在附加调色 pass（或编码 pass）之前，
         关闭时从 passes 里整条摘掉，宿主链恢复原样，不留任何中间目标。
       无 composer：走自带离屏链路，场景 RT → BokehPass → bloom/合成。
     虚化**独立于后期总开关**：它是自己的一条 pass，不看 state.enabled
     （无 composer 的离屏链路除外——那条路必须先启用后期才有画面可虚化）。 */
  bokehAvailable() { return !!this.bokehCtor; }
  bokehParams() {
    const b = this.state.bokeh;
    return { focus: Number(b.focus), aperture: Number(b.aperture), maxblur: Number(b.maxblur) };
  }
  /* 对焦距离：优先观察中心（controls.target），其次选中对象包围球中心，最后沿视线取 10 单位 */
  focusDistance() {
    const d = this.d, cam = d && d.camera, T = d && d.THREE;
    if (!cam || !cam.position || !T) return 10;
    let p = null;
    const ctr = d.controls && d.controls.target;
    if (ctr && Number.isFinite(ctr.x)) p = ctr;
    if (!p) {
      try {
        const sel = d.getSelected && d.getSelected();
        if (sel) { const box = new T.Box3().setFromObject(sel); if (!box.isEmpty()) p = box.getBoundingSphere(new T.Sphere()).center; }
      } catch (e) { p = null; }
    }
    if (!p) p = cam.getWorldDirection(new T.Vector3()).multiplyScalar(10).add(cam.position);
    return Math.max(0.05, cam.position.distanceTo(p));
  }
  ensureBokehPass() {
    if (this.bokehPass) return this.bokehPass;
    if (!this.bokehCtor) throw Error('未注入 BokehPass：创建调试器时传 { bokehPass: BokehPass }');
    const pass = new this.bokehCtor(this.d.scene, this.d.camera, this.bokehParams());
    pass.name = 'TsdBokehPass';
    this.bokehPass = pass;
    return pass;
  }
  /* BokehPass 没有 strength 这类字段，参数全在 uniforms 上 */
  syncBokehUniforms(pass) {
    const u = pass && pass.uniforms;
    if (!u) return;
    const p = this.bokehParams();
    if (u.focus) u.focus.value = p.focus;
    if (u.aperture) u.aperture.value = p.aperture;
    if (u.maxblur) u.maxblur.value = p.maxblur;
    if (u.aspect && this.d.camera && this.d.camera.aspect) u.aspect.value = this.d.camera.aspect;
  }
  /* 插在附加调色 pass 之前（它已经在编码 pass 之前），没有附加 pass 就按 composerIndex */
  bokehInsertIndex() {
    const passes = this.composer.passes;
    if (this.composerPass) { const i = passes.indexOf(this.composerPass); if (i >= 0) return i; }
    const i = Number(this.composerIndex);
    return i >= 0 && i <= passes.length ? i : passes.length;
  }
  attachBokehPass() {
    const pass = this.ensureBokehPass();
    this.syncBokehUniforms(pass);
    /* 摘除时会把 enabled 置 false（EffectComposer 靠它跳过 pass），再插回来必须显式打开，
       否则实例还在链上、enabled 仍是 false，画面纹丝不动——第二次开启就「没效果」了。 */
    pass.enabled = true;
    if (!this.composer) return pass;
    const passes = this.composer.passes;
    if (passes.indexOf(pass) < 0) passes.splice(this.bokehInsertIndex(), 0, pass);
    /* 尺寸：composer.setSize 只在窗口尺寸变化时才会调 pass.setSize，晚插进来的 pass
       必须自己补一次，否则深度 RT 停在 1x1，整屏会被当成「全在焦外」糊成一片。 */
    const rt = this.composer.renderTarget1;
    if (rt && rt.width > 0 && rt.height > 0) pass.setSize(rt.width, rt.height);
    return pass;
  }
  detachBokehPass() {
    const c = this.composer, pass = this.bokehPass;
    if (c && pass) { const i = c.passes.indexOf(pass); if (i >= 0) c.passes.splice(i, 1); }
    if (this.bokehRT) { this.bokehRT.dispose(); this.bokehRT = null; }
    if (pass) pass.enabled = false;
  }
  /* 按当前机位给一组「能看见但不过火」的默认值：
     focus = 相机到观察中心；aperture = maxblur / (0.5 * focus)，即 1.5 倍对焦距离处糊到上限。
     aperture 乘的是**世界单位深度差**，所以不能用场景包围盒半径来归一：
     地面 / 天空球会把半径撑到几十（本项目实测 28.6），算出来的光圈小到肉眼看不见。 */
  resetBokehDistance() {
    const f = Math.round(this.focusDistance() * 100) / 100;
    this.state.bokeh.focus = f;
    const ref = Math.max(0.5, f * 0.5);
    const a = Math.min(0.05, Math.max(0.0001, this.state.bokeh.maxblur / ref));
    this.state.bokeh.aperture = Math.round(a * 10000) / 10000;
    if (this.d && this.d.ui && this.d.ui.syncPostFX) this.d.ui.syncPostFX('bokeh.focus');
  }
  /* 每次改参数都过这里：开→确保在链上并同步参数；关→整条摘掉 */
  syncBokeh() {
    const b = this.state.bokeh;
    const want = !!b.enabled && this.bokehAvailable();
    /* 刚被勾开、且用户没手动调过 → 按当前机位重算一次。composer 注册得早，
       那会儿相机可能还在初始位（/detail 实测 focus=1），沿用旧值会一开就全糊。 */
    if (want && !this._bokehWasOn && !this._bokehTouched) this.resetBokehDistance();
    this._bokehWasOn = want;
    if (!want) { this.detachBokehPass(); return; }
    if (!this.composer && !this.state.enabled) {
      /* 无 composer 时虚化只能挂在自己的离屏链路上，链路由总开关启用 */
      this.state.enabled = true;
      const cb = this.d && this.d.ui && this.d.ui.pfInputs && this.d.ui.pfInputs.get('enabled');
      if (cb) cb.checked = true;
    }
    this.attachBokehPass();
  }
  /* 无 composer：把场景 RT 过一趟 BokehPass，产物当后面的「场景颜色」用 */
  runBokehOff(renderer, w, h) {
    const pass = this.bokehPass, T = this.d.THREE;
    if (!this.bokehRT || this.bokehRT.width !== w || this.bokehRT.height !== h) {
      if (this.bokehRT) this.bokehRT.dispose();
      this.bokehRT = new T.WebGLRenderTarget(w, h, Object.assign({ depthBuffer: false, stencilBuffer: false }, this._base || {}));
      this.bokehRT.texture.name = 'TsdBokehTarget';
    }
    pass.setSize(w, h);
    this.syncBokehUniforms(pass);
    const inside = this.inside;
    /* BokehPass 内部会自己 renderer.render 一次场景取深度，必须让它绕过本调试器的 patch */
    this.inside = true;
    try { pass.render(renderer, this.bokehRT, this.rt); }
    finally { this.inside = inside; renderer.setRenderTarget(null); }
    return this.bokehRT.texture;
  }
  bokehInfo() {
    const c = this.composer, pass = this.bokehPass;
    const host = c ? (c.passes.find(p => p !== pass && /depth|dof|bokeh|focus|blur/i.test((p && p.constructor && p.constructor.name) || '')) || null) : null;
    const index = c && pass ? c.passes.indexOf(pass) : -1;
    /* active = 此刻真的在出画面：总开关勾着、pass 在链上、且没有被 enabled=false 跳过 */
    const active = !!pass && pass.enabled !== false && (c ? index >= 0 : !!this.state.bokeh.enabled);
    return {
      available: this.bokehAvailable(),
      enabled: !!this.state.bokeh.enabled,
      active: active,
      params: this.bokehParams(),
      index: index,
      hostDof: host ? ((host.constructor && host.constructor.name) || '?') : null,
      mode: c ? 'composer' : 'offscreen'
    };
  }
  /* 除 Bloom 之外是否还有非中性参数（全中性时附加 pass 直接 enabled=false，零开销、零画面变化） */
  extrasActive() {
    const s = this.state, g = s.grade;
    return g.brightness !== 0 || g.contrast !== 1 || g.saturation !== 1 || g.temperature !== 0 || g.tint !== 0
      || s.vignette.amount > 0 || s.aberration > 0 || s.grain > 0 || s.sharpen > 0 || s.outline > 0 || s.pixelate > 1;
  }
  /* composer 模式下「只改 state 不会让画面变」——每次改参数都要同步到宿主 pass 上 */
  applyComposer() {
    /* 虚化独立于总开关与附加 pass，任何一次改参数都要先把它对齐（插 / 摘 / 同步参数） */
    this.syncBokeh();
    if (!this.composer) {
      if (this.d && this.d.ui && this.d.ui.postfxStatus) this.d.ui.postfxStatus();
      return;
    }
    const s = this.state;
    if (this.hostBloom) {
      const on = !!s.enabled, b = this.hostBaseline;
      if (on) {
        this.hostBloom.strength = s.bloom.strength;
        this.hostBloom.radius = s.bloom.radius;
        this.hostBloom.threshold = s.bloom.threshold;
        this.hostBloom.enabled = !!s.bloom.enabled;
      } else {
        /* 关闭接管 = 完全交还宿主。强度也要还原：只还 enabled 的话，
           「关掉」看到的是「宿主开关 + 面板强度」的混合体，A/B 对比不成立。 */
        if (b) {
          if (Number.isFinite(b.strength)) this.hostBloom.strength = b.strength;
          if (Number.isFinite(b.radius)) this.hostBloom.radius = b.radius;
          if (Number.isFinite(b.threshold)) this.hostBloom.threshold = b.threshold;
          this.hostBloom.enabled = !!b.enabled;
        } else this.hostBloom.enabled = true;
      }
    }
    if (this.composerPass) {
      // attach：Bloom 归宿主 pass，本 pass 只负责有值的调色项；inject：整条链路都归它
      this.composerPass.enabled = this.composerMode === 'attach'
        ? (!!s.enabled && this.extrasActive())
        : !!s.enabled;
    }
    if (this.d && this.d.ui && this.d.ui.postfxStatus) this.d.ui.postfxStatus();
  }
  defaults() {
    return this.composerDefaults || POSTFX_DEFAULTS;
  }
  composerInfo() {
    const passes = this.composer ? this.composer.passes : [];
    const cls = p => (p && p.constructor && p.constructor.name) || '?';
    return {
      mode: this.composerMode,
      hasComposer: !!this.composer,
      passCount: passes.length,
      bloomPass: this.hostBloom ? cls(this.hostBloom) : null,
      bloomIndex: this.hostBloom ? passes.indexOf(this.hostBloom) : -1,
      helperPass: this.composerPass ? cls(this.composerPass) : null,
      helperIndex: this.composerPass ? passes.indexOf(this.composerPass) : -1,
      linearOutput: this.composerLinear,
      enabled: !!this.state.enabled,
      bokeh: this.bokehInfo()
    };
  }
  get(path) { return parts(path).reduce((v, k) => (v == null ? undefined : v[k]), this.state); }
  /* 拖任意后期参数时，若总开关还关着就先打开它。
     用户拖滑块的意思就是「我要看到这个效果」，此时让参数默默失效是最糟的反馈：
     数字在动、画面不变、也不报错。enabled / view 本身不触发（那是显式开关）。 */
  ensureActive(path) {
    if (!path || path === 'enabled' || path === 'view') return false;
    /* 虚化是独立通道，有自己的开关，不该顺手把整套后期拉起来 */
    if (path.indexOf('bokeh.') === 0) return false;
    if (this.state.enabled) return false;
    this.state.enabled = true;
    /* 只翻转总开关那个勾选框，不能调 syncPostFX()：它会把所有滑块按 state 重写一遍，
       而此刻正要写入的那个滑块还停在旧值上，会被刷回原值——用户拖到一半就被拽回去。 */
    const ui = this.d && this.d.ui;
    const cb = ui && ui.pfInputs && ui.pfInputs.get('enabled');
    if (cb) cb.checked = true;
    return true;
  }
  preview(path, value) {
    if (path && path.indexOf('bokeh.') === 0 && path !== 'bokeh.enabled') this._bokehTouched = true;
    const cur = this.get(path);
    if (typeof cur === 'number') { value = Number(value); if (!Number.isFinite(value)) throw Error('后期参数需要有限数字：' + path); }
    if (path === 'view' && !POSTFX_VIEWS.some(v => v[0] === value)) throw Error('未知调试视图：' + value);
    this.ensureActive(path);
    setPath(this.state, path, value);
    this.applyComposer();
  }
  set(path, value, oldValue) {
    const cur = this.get(path);
    if (cur === undefined) throw Error('未知后期参数：' + path);
    if (typeof cur === 'boolean' && typeof value !== 'boolean') throw Error('后期参数需要布尔值：' + path);
    if (path === 'view' && !POSTFX_VIEWS.some(v => v[0] === value)) throw Error('未知调试视图：' + value);
    if (typeof cur === 'number') {
      value = Number(value);
      if (!Number.isFinite(value)) throw Error('后期参数需要有限数字：' + path);
      const lim = POSTFX_LIMITS[path];
      if (lim) value = clamp(value, lim[0], lim[1]);
    }
    this.ensureActive(path);
    if (path.indexOf('bokeh.') === 0 && path !== 'bokeh.enabled') this._bokehTouched = true;
    const prev = oldValue === undefined ? cur : oldValue;
    setPath(this.state, path, value);
    if (oldValue === undefined && equal(prev, value)) return null;
    const rec = this.d.tracker.recordCustom({
      target: 'editor:postfx', name: '后期处理', ownerName: '画面', path: path,
      oldText: String(prev), newText: String(value), api: 'tsd.setPostFX',
      undo: () => { setPath(this.state, path, prev); this.applyComposer(); if (this.d.ui && this.d.ui.syncPostFX) this.d.ui.syncPostFX(path); }
    });
    this.applyComposer();
    if (this.d.ui && this.d.ui.syncPostFX) this.d.ui.syncPostFX(path);
    if (this.d.ui) this.d.ui.changes();
    return rec;
  }
  disposeTargets() {
    if (this.rt) { this.rt.dispose(); this.rt = null; }
    if (this.bright) { this.bright.dispose(); this.bright = null; }
    for (const lv of this.levels) { lv.a.dispose(); lv.b.dispose(); }
    this.levels = [];
    this.width = 0;
    this.height = 0;
  }
  destroy() {
    if (this.destroyed) return;
    this.releaseComposer();
    this.destroyed = true;
    if (this.d && this.d.renderer && this.d.renderer.render === this.patched) this.d.renderer.render = this.original;
    this.disposeTargets();
    if (this.bokehPass) { try { this.bokehPass.dispose(); } catch (e) { } this.bokehPass = null; }
    for (const m of Object.values(this.materials)) m.dispose();
    for (const m of Object.values(this._views || {})) m.dispose();
    if (this.geometry) this.geometry.dispose();
    this.quadScene = null;
    this.quad = null;
    this.d = null;
  }
}

/* 插进宿主 EffectComposer 的后期 pass（0.9.0）。
   为什么是 pass 而不是继续 patch renderer.render：EffectComposer 的 RenderPass 会先把目标
   切到 writeBuffer，patch 只在「已绑定 RT」时让路，等于在 composer 场景里永不生效；而 pass
   本来就在链上，能直接拿到 readBuffer，也不需要改宿主渲染循环。
   不 import Postprocessing/Pass.js：复用自带的 quadScene，避免带进第二份 three。 */
class TsdPostFXPass {
  constructor(fx) {
    this.fx = fx;
    this.enabled = false;      // 由 PostFX.applyComposer 控制
    this.needsSwap = true;
    this.clear = false;
    this.renderToScreen = false;
    this.name = 'TsdPostFXPass';
  }
  render(renderer, writeBuffer, readBuffer) {
    const fx = this.fx;
    if (!fx || fx.destroyed || !readBuffer || !writeBuffer) return;
    const w = readBuffer.width | 0, h = readBuffer.height | 0;
    if (w < 4 || h < 4) return;
    /* attach 模式下 Bloom 归宿主的 UnrealBloomPass，这里只做调色，否则叠两次泛光 */
    fx.renderInto(renderer, readBuffer.texture, writeBuffer, w, h, fx.composerMode !== 'attach', fx.composerLinear);
  }
  setSize() {
    const fx = this.fx;
    if (fx && !fx.destroyed) fx.dropBloomTargets();
  }
  dispose() { this.fx = null; }
}

/* ======================= 光源辅助 ======================= */
class LightHelperLayer {
  constructor(d, options) {
    options = options || {};
    this.d = d;
    this.enabled = options.lightHelpers !== false;
    this.shadowEnabled = !!options.shadowHelpers;
    this.helpers = new Map();
    this.shadows = new Map();
    this.lastTick = 0;
  }
  lights() {
    const out = [];
    const walk = o => { if (o.userData && o.userData.tsdIgnore) return; if (o.isLight) out.push(o); for (const c of o.children) walk(c); };
    if (this.d && this.d.scene) walk(this.d.scene);
    return out;
  }
  create(l) {
    const T = this.d.THREE;
    let h = null;
    try {
      if (l.isDirectionalLight && T.DirectionalLightHelper) h = new T.DirectionalLightHelper(l, 1.1);
      else if (l.isPointLight && T.PointLightHelper) h = new T.PointLightHelper(l, 0.35);
      else if (l.isSpotLight && T.SpotLightHelper) h = new T.SpotLightHelper(l);
      else if (l.isHemisphereLight && T.HemisphereLightHelper) h = new T.HemisphereLightHelper(l, 1.0);
      else if (l.isRectAreaLight && T.RectAreaLightHelper) h = new T.RectAreaLightHelper(l);
    } catch (e) { h = null; }
    if (!h) return null;
    h.userData.tsdIgnore = true;
    h.userData.tsdTarget = l.uuid;
    h.visible = this.enabled;
    h.renderOrder = 5;
    this.d.scene.add(h);
    return h;
  }
  createShadow(l) {
    const T = this.d.THREE;
    if (!l.shadow || !l.shadow.camera || !T.CameraHelper) return null;
    let h;
    try { h = new T.CameraHelper(l.shadow.camera); } catch (e) { return null; }
    h.userData.tsdIgnore = true;
    h.userData.tsdTarget = l.uuid;
    h.visible = this.shadowEnabled;
    this.d.scene.add(h);
    return h;
  }
  rebuild() {
    if (!this.d || !this.d.scene) return this;
    const lights = this.lights();
    const alive = new Set(lights.map(l => l.uuid));
    for (const [uuid, h] of [...this.helpers]) if (!alive.has(uuid)) { disposeHelper(h); this.helpers.delete(uuid); }
    for (const [uuid, h] of [...this.shadows]) if (!alive.has(uuid)) { disposeHelper(h); this.shadows.delete(uuid); }
    for (const l of lights) {
      if (!this.helpers.has(l.uuid) && (l.isDirectionalLight || l.isPointLight || l.isSpotLight || l.isHemisphereLight || l.isRectAreaLight)) {
        const h = this.create(l);
        if (h) this.helpers.set(l.uuid, h);
      }
      if (this.shadowEnabled && !this.shadows.has(l.uuid)) {
        const h = this.createShadow(l);
        if (h) this.shadows.set(l.uuid, h);
      }
    }
    this.update(true);
    return this;
  }
  update(force) {
    const now = Date.now();
    if (!force && now - this.lastTick < 40) return this;
    this.lastTick = now;
    for (const h of this.helpers.values()) { try { h.update && h.update(); } catch (e) { } }
    for (const h of this.shadows.values()) { try { h.update && h.update(); } catch (e) { } }
    return this;
  }
  setEnabled(on) {
    this.enabled = !!on;
    for (const h of this.helpers.values()) h.visible = this.enabled;
    return this;
  }
  setShadowEnabled(on) {
    this.shadowEnabled = !!on;
    if (this.shadowEnabled) this.rebuild();
    for (const h of this.shadows.values()) h.visible = this.shadowEnabled;
    return this;
  }
  targetOf(hit) {
    let o = hit;
    for (let i = 0; o && i < 4; i++, o = o.parent) {
      const id = o.userData && o.userData.tsdTarget;
      if (id) return this.byUuid(id);
    }
    return null;
  }
  byUuid(uuid) { return this.d && this.d.scene ? this.d.scene.getObjectByProperty('uuid', uuid) : null; }
  destroy() {
    for (const h of this.helpers.values()) disposeHelper(h);
    for (const h of this.shadows.values()) disposeHelper(h);
    this.helpers.clear();
    this.shadows.clear();
    this.d = null;
  }
}

/* ======================= 选中 / 高亮 / 拖拽 ======================= */
class SelectionLayer {
  constructor(d, options) {
    options = options || {};
    this.d = d;
    this.options = options;
    this.enabled = options.picking !== false;
    this.TC = options.transformControls || options.TransformControls || (d.THREE && d.THREE.TransformControls) || null;
    this.mode = options.transformMode || 'translate';
    this.selected = null;
    this.gizmo = null;
    this.gizmoHelper = null;   // r169+ 的可视 Object3D（旧版与 this.gizmo 是同一个对象）
    this.box = null;
    this.before = null;
    this.down = null;
    this.releasedAt = -1e9;
    this.listeners = [];
    this.canvas = d.renderer && d.renderer.domElement ? d.renderer.domElement : null;
    const T = d.THREE;
    if (T && T.BoxHelper) {
      this.box = new T.BoxHelper(new T.Object3D(), 0x2563eb);
      this.box.name = 'TsdSelectionBox';
      this.box.userData.tsdIgnore = true;
      this.box.material.depthTest = false;
      this.box.material.transparent = true;
      this.box.material.opacity = 0.95;
      this.box.renderOrder = 999;
      this.box.visible = false;
      d.scene.add(this.box);
    }
    this.bind();
  }
  bind() {
    if (!this.enabled || !this.canvas || !this.canvas.addEventListener) return;
    this.raycaster = new this.d.THREE.Raycaster();
    if (this.raycaster.params && this.raycaster.params.Line) this.raycaster.params.Line.threshold = 0.25;
    this.pointer = new this.d.THREE.Vector2();
    const add = (node, type, fn) => { node.addEventListener(type, fn); this.listeners.push([node, type, fn]); };
    add(this.canvas, 'pointerdown', e => { if (e.button === 0) this.down = { x: e.clientX, y: e.clientY }; if (this.d._focusRaf != null) this.d._stopFocus(); });
    add(this.canvas, 'pointerup', e => { this.pick(e); });
    add(globalThis, 'keydown', e => this.onKey(e));
  }
  pick(e) {
    if (!this.enabled) return;
    if (!this.d.ui || !this.d.ui.opened) return;   // 只有面板打开时才允许拾取/拖拽
    const down = this.down;
    this.down = null;
    if (!down || e.button !== 0) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    if (this.gizmo && (this.gizmo.dragging || this.gizmo.axis)) return;
    if (Date.now() - this.releasedAt < 220) return;
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.d.camera);
    const list = [];
    const walk = o => {
      /* Raycaster 不检查 visible：被设为不可见的对象（例如关掉的光源 Helper）
         照样会命中射线，导致点到看不见的东西。可见性判断必须自己做。 */
      if (o.visible === false) return;
      const ignore = !!(o.userData && o.userData.tsdIgnore);
      const pickable = !!(o.userData && o.userData.tsdTarget);
      if (ignore && !pickable) return;   // 光源 helper 不进场景树，但要可拾取
      if (o.isMesh || o.isPoints || o.isLine) list.push(o);
      for (const c of o.children) walk(c);
    };
    walk(this.d.scene);
    const hits = this.raycaster.intersectObjects(list, false);
    if (!hits.length) return this.clear();
    /* 两趟拾取：光源线框 / 阴影相机框这些代理 Mesh 是半透明的辅助物，经常正好挡在
       几何体前面（例如半球光的大球心在原点，会吞掉地板中央的每一次点击）。
       所以先在「真实场景几何」里取最近命中，只有在整条射线都没打到实物时才允许选中代理。 */
    const proxyOf = h => (this.d.lightHelpers && this.d.lightHelpers.targetOf(h.object)) || null;
    let hit = null;
    for (const h of hits) { if (!proxyOf(h)) { hit = h.object; break; } }
    if (!hit) hit = hits[0].object;
    this.select(proxyOf(hits.find(h => h.object === hit)) || hit);
  }
  select(target) {
    if (!target) return this.clear();
    this.selected = target;
    if (this.box) {
      if (target.isLight) this.box.visible = false;
      else { this.box.setFromObject(target); this.box.visible = true; }
    }
    const g = this.ensureGizmo();
    if (g) { g.attach(target); if (this.gizmoHelper) this.gizmoHelper.visible = true; }
    this.d.emit('select', target);
    if (target.uuid) { try { this.d.selectTarget('object:' + target.uuid); } catch (e) { } }
    return this;
  }
  clear() {
    if (!this.selected) { if (this.box) this.box.visible = false; return this; }
    this.selected = null;
    if (this.box) this.box.visible = false;
    if (this.gizmo) this.gizmo.detach();
    if (this.gizmoHelper) this.gizmoHelper.visible = false;
    this.d.emit('deselect');
    return this;
  }
  ensureGizmo() {
    if (this.gizmo) return this.gizmo;
    if (!this.TC) return null;
    const g = new this.TC(this.d.camera, this.canvas);
    /* Three r169+ 把 TransformControls 从 Object3D 改成了 Controls：
       它自己不能加进场景、也没有 userData / visible，真正的可视图元由 getHelper() 返回。
       旧版本没有 getHelper()，它本身就是 Object3D，两条路径共用下面的 helper。 */
    const helper = (typeof g.getHelper === 'function') ? g.getHelper() : g;
    helper.name = 'TransformGizmo';
    helper.userData.tsdIgnore = true;
    if (helper !== g) g.name = 'TransformControls';
    if (g.setMode) g.setMode(this.mode);
    if (g.setSpace) g.setSpace('world');
    if ('size' in g) g.size = 0.9;
    helper.visible = false;
    g.addEventListener('dragging-changed', e => {
      if (this.d.controls) this.d.controls.enabled = !e.value;
      const o = g.object;
      if (e.value) {
        this.before = o ? this.snapshot(o) : null;
        if (o) this.d.emit('transformStart', o);
      } else {
        this.releasedAt = Date.now();
        this.commit(g);
      }
    });
    g.addEventListener('objectChange', () => {
      if (this.box && this.box.visible) this.box.update();
      this.d.emit('transform', g.object);
    });
    this.d.scene.add(helper);
    this.gizmo = g;
    this.gizmoHelper = helper;
    return g;
  }
  snapshot(o) {
    return {
      position: [o.position.x, o.position.y, o.position.z],
      rotation: [o.rotation.x, o.rotation.y, o.rotation.z, o.rotation.order],
      scale: [o.scale.x, o.scale.y, o.scale.z]
    };
  }
  commit(g) {
    const o = g && g.object;
    const before = this.before;
    this.before = null;
    if (!o || !before) return;
    const created = this.d.tracker.recordTransform(o, before);
    if (created && created.length) {
      this.d.ui.changes();
      this.d.ui.inspect();
    }
    this.d.emit('transformEnd', o);
  }
  setMode(mode) {
    if (['translate', 'rotate', 'scale'].indexOf(mode) < 0) throw Error('Invalid gizmo mode: ' + mode);
    this.mode = mode;
    if (this.gizmo && this.gizmo.setMode) this.gizmo.setMode(mode);
    this.d.emit('mode', mode);
    if (this.d.ui && this.d.ui.syncModeButtons) this.d.ui.syncModeButtons();
    return this;
  }
  onKey(e) {
    if (!this.selected) return;
    if (!this.d.ui || !this.d.ui.opened) return;
    const src = (e.composedPath && e.composedPath()[0]) || e.target;
    if (src && /^(INPUT|TEXTAREA|SELECT)$/.test(src.tagName || '')) return;
    if (e.key === 'Escape') { e.preventDefault(); this.clear(); return; }
    const mode = { w: 'translate', e: 'rotate', r: 'scale' }[(e.key || '').toLowerCase()];
    if (mode) { e.preventDefault(); this.setMode(mode); }
  }
  tick() {
    if (this.selected && this.box && this.box.visible) { try { this.box.update(); } catch (e) { } }
  }
  destroy() {
    for (const [node, type, fn] of this.listeners) node.removeEventListener(type, fn);
    this.listeners = [];
    if (this.gizmo) {
      try { this.gizmo.detach && this.gizmo.detach(); } catch (e) { }
      if (this.gizmoHelper && this.gizmoHelper.parent) this.gizmoHelper.parent.remove(this.gizmoHelper);
      try { this.gizmo.dispose && this.gizmo.dispose(); } catch (e) { }
      this.gizmo = null;
      this.gizmoHelper = null;
    }
    if (this.box) { disposeHelper(this.box); this.box = null; }
    this.selected = null;
    this.canvas = null;
    this.d = null;
  }
}
/* ============================ 材质切换 ============================
   选中物体后可以把它的材质换成另一种 Three 材质（Standard/Physical/Phong/...）。
   只列「换上去能正常渲染」的构造器：ShaderMaterial / RawShaderMaterial 需要有效
   着色器源码，换过去就是一堆编译错误，因此不提供。
   Mesh 与 Line/Points/Sprite 的材质不能互换——绘制模式由对象决定，材质只负责着色。 */
const MATERIAL_TYPES = {
  mesh: ['MeshStandardMaterial', 'MeshPhysicalMaterial', 'MeshPhongMaterial', 'MeshLambertMaterial',
         'MeshBasicMaterial', 'MeshToonMaterial', 'MeshNormalMaterial', 'MeshMatcapMaterial',
         'MeshDepthMaterial', 'ShadowMaterial'],
  line: ['LineBasicMaterial', 'LineDashedMaterial'],
  points: ['PointsMaterial'],
  sprite: ['SpriteMaterial']
};
const MATERIAL_LABELS = {
  MeshStandardMaterial: 'PBR 标准', MeshPhysicalMaterial: 'PBR 物理', MeshPhongMaterial: '高光 Phong',
  MeshLambertMaterial: '漫反射 Lambert', MeshBasicMaterial: '无光照 Basic', MeshToonMaterial: '卡通 Toon',
  MeshNormalMaterial: '法线 Normal', MeshMatcapMaterial: '材质球 Matcap', MeshDepthMaterial: '深度 Depth',
  ShadowMaterial: '仅阴影 Shadow', LineBasicMaterial: '线条 Line', LineDashedMaterial: '虚线 LineDashed',
  PointsMaterial: '点 Points', SpriteMaterial: '精灵 Sprite'
};
/* 换材质时搬运的属性：颜色/数值/布尔直接赋值，Color 与 Vector 复制值（不共用实例），
   贴图共用同一张贴图对象（复制会多占一份显存）。新材质没有的槽位自动跳过。 */
const MATERIAL_COPY_PROPS = ('name opacity transparent alphaTest alphaHash side shadowSide depthTest depthWrite ' +
  'depthFunc blending premultipliedAlpha toneMapped vertexColors fog visible colorWrite dithering ' +
  'polygonOffset polygonOffsetFactor polygonOffsetUnits wireframe wireframeLinewidth flatShading ' +
  'color emissive emissiveIntensity roughness metalness reflectivity ior transmission thickness ' +
  'clearcoat clearcoatRoughness sheen sheenColor sheenRoughness iridescence anisotropy anisotropyRotation ' +
  'specularIntensity specularColor dispersion attenuationDistance attenuationColor envMapIntensity ' +
  'lightMapIntensity aoMapIntensity bumpScale displacementScale displacementBias normalScale ' +
  'clearcoatNormalScale size sizeAttenuation map normalMap bumpMap alphaMap aoMap emissiveMap ' +
  'roughnessMap metalnessMap displacementMap envMap lightMap specularMap gradientMap matcap ' +
  'clearcoatMap clearcoatNormalMap clearcoatRoughnessMap sheenColorMap sheenRoughnessMap ' +
  'transmissionMap thicknessMap iridescenceMap iridescenceThicknessMap anisotropyMap ' +
  'specularIntensityMap specularColorMap').split(' ');

class SceneDebugger{
 constructor(options={}){const discovered=new SceneDiscovery(options);Object.assign(this,discovered);this.pixelRatioCap=options.pixelRatioCap??2;if(!Number.isFinite(this.pixelRatioCap)||this.pixelRatioCap<=0)throw Error('Invalid pixelRatioCap');this.destroyed=false;this.warnings=new Set();this.tree=new SceneTreeBuilder(this);this.inspector=new PropertyInspector(this);this.tracker=new ChangeTracker(this);this.performance=new PerformanceMonitor(this);this.assets=new AssetLibrary(this,options);this.textures=new TextureStudio(this);this.storage=options.storage||(typeof window!=='undefined'?(()=>{try{return window.localStorage;}catch{return null;}})():null);this.tree.build();this.inspector.rebuild();
this.logChanges=options.logChanges!==false;
/* 场景树点一下就选中并让相机飞过去取景；focusDuration=0 表示瞬移 */
this.focusOnSelect=options.focusOnSelect!==false;
this._focusRaf=null;
/* autoNear：目标比相机 near 还小时，临时压低 near 才贴得上去（默认不动宿主相机） */
this.autoNear=options.autoNear===true;
this.handlers={select:options.onSelect||null,deselect:options.onDeselect||null,transformStart:options.onTransformStart||null,transform:options.onTransform||null,transformEnd:options.onTransformEnd||null,mode:options.onMode||null,toggle:options.onToggle||null};
this.envLib=new EnvironmentLibrary(this);
this._envUseAsBackground=!!options.envAsBackground;
this._envCaptured=true;
this._envOriginal=this.scene.environment||null;
this._envBackground=this.scene.background||null;
this._envBgBlur='backgroundBlurriness' in this.scene?this.scene.backgroundBlurriness:0;
this._envPrev='none';
this.lightHelpers=new LightHelperLayer(this,options).rebuild();
this.postfx=new PostFX(this,options);
{const comp=options.composer||SceneDebugger.findComposer();if(comp)this.postfx.attachComposer(comp);}
this.helpers={grid:null,axes:null,gridOn:false,axesOn:false};
this.ui=new UILayer(this,options.container);this.ui.refresh();
this.selection=new SelectionLayer(this,options);
this.performance.start();liveInstances++;}
 assert(){if(this.destroyed)throw Error('Debugger destroyed');}
 /* 没显式传 composer 时，从几个常见全局名兜底探测：形状对得上（有 passes 数组 + render 函数）才认 */
 static findComposer(){
  if(typeof window==='undefined')return null;
  for(const k of ['composer','finalComposer','effectComposer','__composer']){
   let c=null;try{c=window[k];}catch(e){c=null;}
   if(c&&Array.isArray(c.passes)&&typeof c.render==='function')return c;
  }
  return null;
 }
 refresh(){this.assert();this.tree.build();this.inspector.rebuild();if(this.lightHelpers)this.lightHelpers.rebuild();this.ui.refresh();return this;}
 selectTarget(id){this.assert();const t=this.target(id);this.ui.setOpen(true);this.ui.targets.value=t.id;this.ui.inspect();this.ui.revealProps();return this;}
 open(){this.assert();this.ui.setOpen(true);return this;}
 close(){this.assert();this.ui.setOpen(false);return this;}
 isOpen(){return !!(this.ui&&this.ui.opened);}
 target(id){const t=typeof id==='string'?this.inspector.targets.get(id)||this.inspector.targets.get('object:'+id):this.inspector.byObject.get(id);if(!t)throw Error('Unknown target (refresh scene or register extension)');return t;}
 set(id,path,value){this.assert();const t=this.target(id);if(value&&value.$type&&t.fields.get(path)?.kind!=='json')value=this.inspector.resolve(value);const r=this.tracker.set(t,path,value);if(t.object.isScene&&path==='fog'){for(const key of [...t.fields.keys()])if(key.startsWith('fog.'))t.fields.delete(key);if(t.object.fog){this.inspector.field(t,'fog.color','color');for(const k of t.object.fog.isFog?['near','far']:['density'])this.inspector.field(t,'fog.'+k);}}this.ui.changes();return r;}
 lookAt(id,x,y,z){this.assert();const t=this.target(id),o=t.object;if(!o.isCamera)throw Error('lookAt requires camera');if(![x,y,z].every(Number.isFinite))throw Error('Invalid lookAt');const old=o.quaternion.clone();o.lookAt(x,y,z);const next=o.rotation.clone();o.quaternion.copy(old);return this.set(t.id,'rotation',next);}
 /* tick 由宿主渲染循环每帧调用。销毁后必须静默返回而不是抛错：宿主循环通常写成
   dbg.tick(now)（或 debug?.tick()），一旦抛错整帧中断，业务自己的相机动画也一起挂掉。
   写操作（set/undo/...）仍然走 assert 抛错，避免误用已销毁实例。 */
tick(time){if(this.destroyed)return;if(this._nearSaved&&this._focusRaf==null)this._restoreNear(false);if(time!==undefined&&!Number.isFinite(time))throw Error('tick timestamp must be finite milliseconds');this.performance.tick(time);if(this.lightHelpers)this.lightHelpers.update();if(this.selection)this.selection.tick();}

 /* -------- 预览与提交（滑块拖动中不刷日志，松手只记一条） -------- */
 preview(id,path,value){
  this.assert();
  const t=this.target(id);
  const key=t.id+'|'+path;
  if(!this._preview||this._preview.key!==key)this._preview={key:key,old:this.inspector.encode(t,path,this.inspector.read(t,path))};
  this.inspector.write(t,path,value);
 }
 commitPreview(id,path,value){
  this.assert();
  const t=this.target(id);
  const old=this._preview&&this._preview.key===t.id+'|'+path?this._preview.old:undefined;
  this._preview=null;
  const r=this.tracker.set(t,path,value,old);
  this.ui.changes();
  return r;
 }


 /* -------- 环境与光源 -------- */
 setEnvironment(id){
  this.assert();
  /* manifest 是异步加载的：插件刚初始化就切 HDR 时等待一次，不要直接报“未知预设”。 */
  if(String(id).indexOf('hdr:')===0&&this.assets&&this.assets.status==='loading'){
   this.assets.ready.then(()=>{if(this.destroyed)return;try{this.setEnvironment(id);}catch(e){if(this.warnings)this.warnings.add(e.message);}});
   return this;
  }
  const prev=this.envLib.current;
  this.envLib.apply(id);
  this._envPrev=id;
  if(prev!==id)this.tracker.recordCustom({target:'editor:env',name:'环境贴图',path:'environment',oldText:prev,newText:id,undo:()=>this.envLib.apply(prev)});
  this.ui.changes();
  return this;
 }
 getEnvironment(){return this.envLib?this.envLib.current:null;}
 setEnvBackground(on){
  this.assert();
  const prev=!!this._envUseAsBackground;
  this.envLib.setUseAsBackground(!!on);
  if(prev!==!!on)this.tracker.recordCustom({target:'editor:env',name:'环境贴图',path:'asBackground',oldText:String(prev),newText:String(!!on),undo:()=>this.envLib.setUseAsBackground(prev)});
  this.ui.changes();
  return this;
 }
 setLightHelpers(on){
  this.assert();
  const prev=this.lightHelpers.enabled;
  this.lightHelpers.setEnabled(!!on);
  if(prev!==!!on)this.tracker.recordCustom({target:'editor:lights',name:'光源辅助',path:'helpers',oldText:String(prev),newText:String(!!on),undo:()=>this.lightHelpers.setEnabled(prev)});
  this.ui.changes();
  return this;
 }
 setShadowHelpers(on){
  this.assert();
  const prev=this.lightHelpers.shadowEnabled;
  this.lightHelpers.setShadowEnabled(!!on);
  if(prev!==!!on)this.tracker.recordCustom({target:'editor:lights',name:'光源辅助',path:'shadowCameras',oldText:String(prev),newText:String(!!on),undo:()=>this.lightHelpers.setShadowEnabled(prev)});
  this.ui.changes();
  return this;
 }

 /* -------- 后期处理 / 调试视图 / 截图 -------- */
setPostFX(path,value,oldValue){this.assert();return this.postfx.set(path,value,oldValue);}
/* 把虚化对焦距离拉到「观察中心 / 选中物体」，面板上的按钮走这里；返回设置后的距离 */
focusBokeh(){this.assert();const v=this.postfx.focusDistance();this.setPostFX('bokeh.focus',Math.round(v*1000)/1000);return v;}
bokehInfo(){this.assert();return this.postfx.bokehInfo();}
getPostFX(path){this.assert();return path?this.postfx.get(path):deepClone(this.postfx.state);}
previewPostFX(path,value){this.assert();this.postfx.preview(path,value);return this;}
setViewMode(mode){this.assert();return this.postfx.set('view',mode);}
composerInfo(){this.assert();return this.postfx.composerInfo();}
screenshot(){
 this.assert();
 this.renderer.render(this.scene,this.camera);
 return this.renderer.domElement.toDataURL('image/png');
}
getStats(){
 this.assert();
 const info=this.renderer.info||{},nodes=this.tree.nodes,mats=new Set();
 let meshes=0,lights=0,points=0,lines=0;
 for(const o of nodes){if(o.isMesh)meshes++;else if(o.isLight)lights++;else if(o.isPoints)points++;else if(o.isLine)lines++;const m=Array.isArray(o.material)?o.material:[o.material];for(const x of m)if(x)mats.add(x);}
  const si=this.postfx&&this.postfx.sceneInfo;
  return {
  fps:this.performance.fps==null?null:Math.round(this.performance.fps*10)/10,
  calls:si?si.calls:info.render&&info.render.calls||0,triangles:si?si.triangles:info.render&&info.render.triangles||0,
  geometries:info.memory&&info.memory.geometries||0,textures:info.memory&&info.memory.textures||0,
  programs:info.programs?info.programs.length:0,
  objects:nodes.length,meshes:meshes,lights:lights,points:points,lines:lines,materials:mats.size,
  webgl:this.renderer.capabilities&&this.renderer.capabilities.isWebGL2?'WebGL2':'WebGL1',
  pixelRatio:this.renderer.getPixelRatio(),drawingBuffer:[this.renderer.domElement.width,this.renderer.domElement.height],
  threeRevision:this.THREE&&this.THREE.REVISION||null
 };
}

setGridHelper(on){
 this.assert();
 const T=this.THREE;
 if(!this.helpers.grid){
  const g=new T.GridHelper(20,20,0x64748b,0x334155);
  g.name='TsdGrid';g.userData.tsdIgnore=true;g.position.y=-0.001;
  this.helpers.grid=g;this.scene.add(g);
 }
 this.helpers.gridOn=!!on;this.helpers.grid.visible=!!on;
 return this;
}
setAxesHelper(on){
 this.assert();
 const T=this.THREE;
 if(!this.helpers.axes){
  const a=new T.AxesHelper(3);
  a.name='TsdAxes';a.userData.tsdIgnore=true;
  this.helpers.axes=a;this.scene.add(a);
 }
 this.helpers.axesOn=!!on;this.helpers.axes.visible=!!on;
 return this;
}
downloadScreenshot(){
 this.assert();
 const url=this.screenshot();
 const doc=this.ui&&this.ui.doc||(typeof document!=='undefined'?document:null);
 if(doc){const a=doc.createElement('a');a.href=url;a.download='three-scene-'+Date.now()+'.png';a.click();}
 return url;
}
resetPostFX(){
 this.assert();
 const prev=deepClone(this.postfx.state);
 this.postfx._bokehTouched=false;
 this.postfx.state=deepClone(this.postfx.defaults());
 this.postfx.applyComposer();
 this.tracker.recordCustom({target:'editor:postfx',name:'后期处理',ownerName:'画面',path:'reset',oldText:'自定义',newText:'默认',api:'tsd.resetPostFX',undo:()=>{this.postfx.state=deepClone(prev);this.postfx.applyComposer();this.ui.syncPostFX();}});
 this.ui.syncPostFX();this.ui.changes();
 return this;
}
exportPostFXMarkdown(){
 this.assert();
 const st=this.postfx.state,lines=['# 后期处理参数',''];
 lines.push('```js');
 lines.push('tsd.setPostFX("enabled", '+st.enabled+');');
 lines.push('tsd.setPostFX("bokeh.enabled", '+!!st.bokeh.enabled+');');
 for(const path of Object.keys(POSTFX_LIMITS)){const v=this.postfx.get(path);const txt=typeof v!=='number'?JSON.stringify(v):(path==='bokeh.aperture'?String(Number(v.toFixed(4))):trimNumber(v));lines.push('tsd.setPostFX("'+path+'", '+txt+');');}
 lines.push('tsd.setViewMode('+JSON.stringify(st.view)+');');
 lines.push('```','');
 lines.push('> Bloom 走「离屏 HDR 渲染 → 阈值 → 4 级高斯模糊 → 合成」；其余为合成着色器内的单遍效果，色调映射沿用三次渲染器设置。');
 const plan=this.exportComposerPlan();
 if(plan)lines.push('',plan);
 const bokeh=this.exportBokehPlan();
 if(bokeh)lines.push('',bokeh);
 return lines.join('\n');
}
/* 后期参数如何落到源码：接管了哪个 pass、附加 pass 插在第几位、编码由谁收尾 */
exportComposerPlan(){
 const fx=this.postfx;
 if(!fx||fx.composerMode==='off'||!fx.composer)return '';
 const st=fx.state,n=v=>trimNumber(v),cls=p=>p&&p.constructor&&p.constructor.name||'?';
 const passes=fx.composer.passes;
 const lines=['## 后期链路（EffectComposer）',''];
 lines.push('- composer.passes：'+passes.map((p,i)=>i+': '+cls(p)).join(' / '));
 lines.push('- 共 '+passes.length+' 个 pass，'+(fx.composerLinear?'末尾有编码 pass（OutputPass / GammaCorrection）':'末尾没有编码 pass'));
 if(fx.composerMode==='attach'){
  lines.push('- 已接管 `'+cls(fx.hostBloom)+'`（`composer.passes['+passes.indexOf(fx.hostBloom)+']`）：Bloom 开关 = 该 pass 的 `enabled`，strength / radius / threshold 直接写它的同名字段。');
  if(fx.composerPass&&passes.indexOf(fx.composerPass)>=0)lines.push('- 调色 / 暗角 / 色差 / 锐化 / 描边由 `'+cls(fx.composerPass)+'`（`composer.passes['+passes.indexOf(fx.composerPass)+']`）负责，它必须在编码 pass 之前。');
 }else{
  lines.push('- 宿主没有 Bloom：`'+cls(fx.composerPass)+'` 应插在 `composer.passes['+fx.composerIndex+']`（'+(fx.composerLinear?'编码 / OutputPass 之前':'链末')+'），Bloom 链路由它一次画完。');
 }
 const params=['strength='+n(st.bloom.strength),'radius='+n(st.bloom.radius),'threshold='+n(st.bloom.threshold),'bloomEnabled='+(!!(st.enabled&&st.bloom.enabled))];
 const g=st.grade;
 if(fx.extrasActive())params.push('brightness='+n(g.brightness),'contrast='+n(g.contrast),'saturation='+n(g.saturation),'temperature='+n(g.temperature),'tint='+n(g.tint),'vignette='+n(st.vignette.amount),'vignetteSoft='+n(st.vignette.softness),'aberration='+n(st.aberration),'grain='+n(st.grain),'sharpen='+n(st.sharpen),'outline='+n(st.outline),'pixelate='+n(st.pixelate));
 const bi=fx.bokehPass?passes.indexOf(fx.bokehPass):-1;
 if(bi>=0)lines.push('- `TsdBokehPass` 在 `composer.passes['+bi+']`（官方 BokehPass 实例），关闭虚化时从链上摘除并把 `enabled` 置 false（实例保留，再次开启直接插回，不复建深度 RT）。');
 lines.push('- 目标参数：`'+params.join('`, `')+'`');
 lines.push('','> 插进 composer 的 pass 必须输出**线性**值（不做 tone mapping / sRGB 编码），编码交给链末的 OutputPass / GammaCorrectionShader；否则会暗部压死、只剩自发光。');
 return lines.join('\n');
}
/* 虚化通道怎么落到源码：装什么包、import 哪条路径、插在第几位、参数是多少、怎么关 */
exportBokehPlan(){
 const fx=this.postfx;
 if(!fx||!fx.state.bokeh.enabled)return '';
 const info=fx.bokehInfo(),p=fx.bokehParams(),n=v=>trimNumber(v);
 const rev=this.THREE&&this.THREE.REVISION?'r'+this.THREE.REVISION:'';
 const at=info.index>=0?info.index:null;
 const lines=['## 虚化通道（BokehPass 景深）',''];
 lines.push('面板已开启虚化，下面是可直接落地的写法，参数就是面板里当前这组值。','');
 lines.push('1) 安装：`BokehPass` 随 three 的 `examples/jsm` 分发，**不是独立 npm 包**，装 three 即可：`npm i three`'
  +(rev?'（当前项目 '+rev+'，注意 three 0.16x 与 older 的 uniforms 名称不同）':'')+'。');
 lines.push('2) 引入：');
 lines.push('```js');
 lines.push("import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';");
 lines.push('```');
 lines.push('3) 插到 '+(at!==null?'`composer.passes['+at+']`（编码 pass 之前、调色 pass 之前）':'编码 pass 之前')+'：');
 lines.push('```js');
 lines.push('const bokehPass = new BokehPass(scene, camera, {');
 lines.push('  focus: '+n(p.focus)+',      // 世界单位：对焦距离 = 相机到主体的距离');
 lines.push('  aperture: '+Number(p.aperture.toFixed(4))+',  // 光圈：与「世界单位深度差」相乘的系数，越大景深越浅；本场景按 maxblur/focus 自适应到该值');
 lines.push('  maxblur: '+n(p.maxblur)+'    // 模糊上限（UV 比例）：0.01 轻微，0.05 明显');
 lines.push('});');
 lines.push('composer.addPass(bokehPass);'+(at!==null?'   // 需要精确位置就 composer.insertPass(bokehPass, '+at+')':'')); 
 lines.push('```');
 lines.push('4) 关闭 / 对比（两条路都必须完全回到「没有虚化」的画面）：');
 lines.push('```js');
 lines.push('// A. 临时对比：留实例、只跳过渲染，可随时切回');
 lines.push('bokehPass.enabled = false;');
 lines.push('// B. 彻底移除：从链上摘掉并释放深度 RT / 材质');
 lines.push('const i = composer.passes.indexOf(bokehPass);');
 lines.push('if (i >= 0) composer.passes.splice(i, 1);');
 lines.push('bokehPass.dispose();');
 lines.push('```');
 lines.push('5) 注意：');
 lines.push('- 每帧成本 = 一次全场景 `MeshDepthMaterial` 深度渲染（draw call 基本翻倍），移动端慎用。');
 lines.push('- `focus` 是世界单位；相机 `near/far` 参与深度解码，改完要 `camera.updateProjectionMatrix()`。');
 lines.push('- 只把 `focus` 调得很大**不等于关闭**：深度 pass 照常跑，开销不变、只是找不到合焦点。');
 lines.push('- 透明度靠 `alphaTest`/`transparent` 的物体在深度 pass 里不会被正确剔除，树、玻璃这类场景要单独验。');
 if(info.hostDof)lines.push('- 宿主 composer 里已有 `'+info.hostDof+'`：两层 DOF 叠加会互相糊，接入前先把它 `enabled = false` 或按需二选一。');
 return lines.join('\n');
}

/* -------- 自制贴图库 -------- */
listTexturePresets(){
 this.assert();
 return this.textures.presets().map(p=>({id:p.id,label:p.label,hint:p.hint,kinds:['diff','nor','rough']}));
}
presetTexture(id,kind,size){
 this.assert();
 return this.textures.texture(id,kind,size);
}
/* 找到真正承载贴图槽位的目标：传 object 时自动落到它的材质目标上 */
materialTarget(id,slot,index){
 let t=null;
 if(id&&id.fields)t=id;
 else{try{t=this.target(id);}catch(e){t=null;}}
 if(!t)return null;
 if(!slot||t.fields.has(slot))return t;
 const o=t.object;
 const mat=o&&o.material?(Array.isArray(o.material)?o.material[index||0]:o.material):null;
 const mt=mat&&this.inspector.byObject.get(mat);
 if(!mt)return t;
 return mt.fields.has(slot)?mt:t;
}
shortTexture(tex){
 if(!tex)return 'null';
 const u=tex.userData||{};
 if(u.tsdPreset)return u.tsdPreset.label+'·'+(TEX_KIND_LABEL[u.tsdPreset.kind]||u.tsdPreset.kind);
 if(u.tsdAsset)return u.tsdAsset.label+'·'+(ASSET_KIND_LABEL[u.tsdAsset.kind]||u.tsdAsset.kind);
 return '<texture '+(tex.name||String(tex.uuid).slice(0,8))+'>';
}
/* 一次把预设贴图写进一个或多个槽位；撤销回到原实例，导出成一行可执行 API */
applyTexturePreset(targetId,presetId,opts){
 this.assert();
 opts=opts||{};
 const preset=this.textures.preset(presetId);
 if(!preset)throw Error('未知贴图预设：'+presetId);
 const want=(Array.isArray(opts.slots)&&opts.slots.length?opts.slots:['map','normalMap','roughnessMap']).filter(s=>typeof s==='string');
 const size=this.textures.clampSize(opts.size);
 const repeat=Math.max(1,Math.min(16,Math.round(Number(opts.repeat)||1)));
 const picked=[],targets=[];
 for(const slot of want){
  const t=this.materialTarget(targetId,slot,opts.index);
  if(t&&t.fields.has(slot)){targets.push(t);picked.push(slot);}
 }
 if(!picked.length)throw Error('该材质没有 '+want.join(' / ')+' 槽位，无法应用贴图');
 const snaps=[];
 for(let i=0;i<picked.length;i++){
  const slot=picked[i],t=targets[i];
  const kind=opts.kind||TEX_SLOT_KIND[slot]||'diff';
  let tex=this.textures.texture(presetId,kind,size);
  if(repeat!==1){
   /* 平铺是 Texture 自己的属性；共用缓存纹理会串味儿，所以按需 clone 一份 */
   tex=tex.clone();
   tex.name=tex.name+'@'+repeat;
   tex.repeat.set(repeat,repeat);
   tex.needsUpdate=true;
  }
  snaps.push({t:t,slot:slot,old:this.inspector.read(t,slot)});
  this.inspector.write(t,slot,tex);
 }
 const host=targets[0];
 const kindLabel=picked.length>1?'整套 '+picked.length+' 通道':(TEX_KIND_LABEL[opts.kind||TEX_SLOT_KIND[picked[0]]||'diff']||'基础色');
 const rec=this.tracker.recordCustom({
  target:host.id,name:(host.locator&&host.locator.ownerName)||(host.object&&host.object.name)||host.label,
  path:picked.join(' + '),
  oldText:snaps.map(x=>this.shortTexture(x.old)).join(' / '),
  newText:preset.label+' · '+kindLabel+(repeat>1?' · 平铺 '+repeat:'')+' · '+size+'px',
  api:'tsd.applyTexturePreset',expr:host.expr,
  texPreset:{id:presetId,slots:picked.slice(),kind:opts.kind||null,size:size,repeat:repeat},
  undo:()=>{for(const x of snaps)this.inspector.write(x.t,x.slot,x.old||null);}
 });
 if(this.ui&&!this.destroyed)this.ui.changes();
 return rec;
}

/* -------- 素材贴图赋值 -------- */
applyAssetTexture(targetId,path,assetId,kind,opts){
 this.assert();
 let t=this.target(targetId);
 if(path.indexOf('material.')===0)path=path.slice(9);
 let field=t.fields.get(path);
 // 传 object 目标时自动落到它的材质目标上（贴图槽位挂在材质上）
 if(!field&&t.object&&t.object.material){
  const mat=Array.isArray(t.object.material)?t.object.material[(opts&&opts.index)||0]:t.object.material;
  const mt=mat&&this.inspector.byObject.get(mat);
  if(mt&&mt.fields.get(path)){t=mt;field=mt.fields.get(path);}
 }
 if(!field||field.kind!=='resource')throw Error('该属性不是贴图槽位：'+path);
 const old=this.inspector.read(t,path);
 return this.assets.texture(assetId,kind).then(tex=>{
  if(kind==='arm'){
   if(path==='aoMap')tex.channel=0;
   else if(path==='roughnessMap')tex.channel=1;
   else if(path==='metalnessMap')tex.channel=2;
  }
  this.inspector.write(t,path,tex);
  const label=tex.userData&&tex.userData.tsdAsset?tex.userData.tsdAsset.label:assetId;
  const oldLabel=old?('<texture '+(old.userData&&old.userData.tsdAsset?old.userData.tsdAsset.label:String(old.uuid).slice(0,8))+'>'):'null';
  const rec=this.tracker.recordCustom({
   target:t.id,name:t.object.name||t.label,path:path,oldText:oldLabel,newText:label+' · '+(ASSET_KIND_LABEL[kind]||kind),
   api:'tsd.applyAssetTexture',expr:t.expr,texAsset:{slot:path,id:assetId,kind:kind},undo:()=>{this.inspector.write(t,path,old||null);}
  });
  this.ui.changes();
  return rec;
 });
}

 /* -------- 材质切换 -------- */
 /* 某个对象能换成哪些材质类型（按对象种类区分，Mesh 不能换 PointsMaterial） */
 materialTypesFor(o){
  const T = this.THREE;
  const key = o && o.isLine ? 'line' : o && o.isPoints ? 'points' : o && o.isSprite ? 'sprite' : 'mesh';
  return (MATERIAL_TYPES[key] || MATERIAL_TYPES.mesh).filter(n => typeof T[n] === 'function');
 }
 getMaterialTypes(id){
  this.assert();
  const o = id === undefined ? null : this.target(id).object;
  return o && o.isObject3D ? this.materialTypesFor(o) : MATERIAL_TYPES.mesh.slice();
 }
 /* 场景里还有谁在用这个材质（用于「同步替换共用对象」） */
 materialUsers(mat){
  const out = [];
  if (!mat) return out;
  this.scene.traverse(o => {
   const m = o.material;
   if (!m) return;
   if (Array.isArray(m) ? m.indexOf(mat) >= 0 : m === mat) out.push(o);
  });
  return out;
 }
 copyMaterialProps(from, to){
  for (const k of MATERIAL_COPY_PROPS) {
   if (!(k in to) || from[k] === undefined) continue;
   const v = from[k], cur = to[k];
   if (v && v.isTexture) { to[k] = v; continue; }               // 贴图共用，不复制显存
   if (v && v.isColor && cur && cur.isColor) { cur.copy(v); continue; }
   if (v && (v.isVector2 || v.isVector3 || v.isVector4) && cur && cur.copy) { cur.copy(v); continue; }
   if (cur && (cur.isTexture || cur.isColor || cur.isVector2)) continue;   // 目标槽位类型不同，保留默认值
   to[k] = Array.isArray(v) ? v.slice() : v;
  }
  return to;
 }
 /* 把选中物体（或其中一个槽位）的材质换成另一种类型。
    opts.copy=false 不要旧参数；opts.spread=true 同时替换共用该材质的其他对象；
    opts.slot 指定材质数组里的下标；opts.name 给新材质改名。 */
 setMaterial(id, type, opts){
  this.assert();
  opts = opts || {};
  const t = this.target(id), o = t.object;
  if (!o || !o.isObject3D) throw Error('setMaterial 需要 Object3D 目标');
  if (!o.material) throw Error('该对象没有材质');
  const T = this.THREE;
  if (typeof type !== 'string' || typeof T[type] !== 'function') throw Error('未知材质类型：' + type);
  if (this.materialTypesFor(o).indexOf(type) < 0) throw Error(type + ' 不能用在 ' + (o.type || 'Object3D') + ' 上');
  const isArray = Array.isArray(o.material);
  const slot = opts.slot == null ? (isArray ? 0 : null) : Number(opts.slot);
  if (isArray && !(Number.isInteger(slot) && slot >= 0 && slot < o.material.length)) throw Error('材质槽位越界：' + opts.slot);
  const old = isArray ? o.material[slot] : o.material;
  if (!old) throw Error('该材质槽位为空');
  if (old.type === type && !opts.force) return old;
  const targets = opts.spread ? this.materialUsers(old) : [o];
  const next = new T[type]();
  if (opts.copy !== false) this.copyMaterialProps(old, next);
  if (opts.name !== undefined) next.name = opts.name;
  else if (old.name) next.name = old.name;
  if (next.needsUpdate !== undefined) next.needsUpdate = true;
  const swap = (obj, from, to) => {
   if (Array.isArray(obj.material)) {
    let hit = false;
    obj.material = obj.material.map(m => { if (m === from) { hit = true; return to; } return m; });
    return hit;
   }
   if (obj.material === from) { obj.material = to; return true; }
   return false;
  };
  for (const obj of targets) swap(obj, old, next);
  this.resyncAfterMaterial(o);
  const owners = targets.length > 1 ? '（同步 ' + targets.length + ' 个对象）' : '';
  const rec = this.tracker.recordCustom({
   target: t.id, name: o.name || o.type, path: 'material' + (isArray ? '[' + slot + ']' : ''),
   oldText: old.type, newText: type + owners, api: 'tsd.setMaterial',
   undo: () => { for (const obj of targets) swap(obj, next, old); this.resyncAfterMaterial(o); }
  });
  if (rec) {
   rec.materialSwap = { type: type, slot: isArray ? slot : null, copy: opts.copy !== false, spread: !!opts.spread };
   rec.expr = t.expr;
  }
  this.ui.changes();
  return next;
 }
 /* 换材质只重建 inspector 目标（场景树结构没变），不整棵 UI 重建，避免树被折叠复位 */
 resyncAfterMaterial(o){
  this.inspector.rebuild();
  const ui = this.ui;
  if (ui && ui.syncTargets) {
   const keep = ui.targets.value;
   ui.syncTargets();
   ui.targets.value = this.inspector.targets.has(keep) ? keep : 'object:' + o.uuid;
   ui.inspect();
  }
  return this;
 }

/* -------- 编辑器动作：加光源 / 克隆 / 删除 / 聚焦 -------- */
addLight(type,opts){
 this.assert();
 opts=opts||{};
 const T=this.THREE,map={ambient:T.AmbientLight,hemisphere:T.HemisphereLight,directional:T.DirectionalLight,point:T.PointLight,spot:T.SpotLight};
 const C=map[type];
 if(!C)throw Error('Unsupported light type: '+type);
 const intensity=opts.intensity!=null?opts.intensity:type==='ambient'?0.5:type==='hemisphere'?0.8:type==='directional'?2:type==='spot'?20:8;
 const light=new C(opts.color!=null?opts.color:0xffffff,intensity);
 const count=this.tree.nodes.filter(o=>o.isLight).length+1;
 light.name=opts.name||('Light_'+type+'_'+count);
 if(type==='directional'||type==='spot'){
  const p=opts.position||[4,6,3];
  light.position.set(p[0],p[1],p[2]);
  if(type==='spot'){light.angle=opts.angle||0.5;light.penumbra=opts.penumbra||0.35;}
  if(opts.castShadow!==false)light.castShadow=true;
 }else if(type==='point'){
  const p=opts.position||[2,3,2];
  light.position.set(p[0],p[1],p[2]);
  if(opts.castShadow)light.castShadow=true;
 }
 this.scene.add(light);
 this.tracker.recordCustom({target:'editor:scene',name:'场景',ownerName:'编辑器',path:'添加光源',oldText:'-',newText:light.name+' · '+type,api:'tsd.addLight',undo:()=>{light.removeFromParent();this.refresh();}});
 this.refresh();
 this.ui.changes();
 return light;
}
cloneObject(id){
 this.assert();
 const t=this.target(id),o=t.object;
 if(!o||!o.isObject3D||o===this.scene)throw Error('只有场景内的 Object3D 可以克隆');
 const parent=o.parent||this.scene;
 const copy=o.clone();
 copy.name=(o.name||o.type)+'_copy';
 if(copy.userData){copy.userData=Object.assign({},copy.userData);delete copy.userData.tsdTarget;delete copy.userData.tsdIgnore;}
 parent.add(copy);
 this.tracker.recordCustom({target:'editor:scene',name:'场景',ownerName:'编辑器',path:'克隆对象',oldText:o.name||o.type,newText:copy.name,api:'tsd.cloneObject',undo:()=>{copy.removeFromParent();this.refresh();}});
 this.refresh();
 this.ui.changes();
 return copy;
}
removeObject(id){
 this.assert();
 const t=this.target(id),o=t.object;
 if(!o||!o.isObject3D||o===this.scene)throw Error('场景根节点不能删除');
 const parent=o.parent;
 if(!parent)throw Error('对象没有父节点');
 const index=parent.children.indexOf(o);
 if(this.selection&&this.selection.selected===o)this.clearSelection();
 const name=o.name||o.type;
 parent.remove(o);
 this.tracker.recordCustom({target:'editor:scene',name:'场景',ownerName:'编辑器',path:'删除对象',oldText:name,newText:'(已删除)',api:'tsd.removeObject',undo:()=>{parent.children.splice(index,0,o);o.parent=parent;this.refresh();}});
 this.refresh();
 this.ui.changes();
 return o;
}
focusObject(id,options){
 this.assert();
 const t=this.target(id),o=t&&t.object;
 if(!o||!o.isObject3D)throw Error('只有 Object3D 可以聚焦');
 if(o===this.scene)throw Error('场景根节点不能聚焦');
 const T=this.THREE,opts=options||{};
 const box=new T.Box3().setFromObject(o);
 const center=new T.Vector3();
 let radius;
 if(box.isEmpty()){
  /* 灯光 / 空 Object3D / 相机没有几何体，包围盒是空的：退化成「世界坐标 + 默认取景半径」。
     否则在场景树里点一个光源会直接抛错，相机一动不动。 */
  o.updateWorldMatrix(true,false);
  center.setFromMatrixPosition(o.matrixWorld);
  radius=o.isLight?3:1.5;
 }else{
  const sphere=box.getBoundingSphere(new T.Sphere());
  center.copy(sphere.center);
  radius=sphere.radius;
 }
 const fov=this.camera.isPerspectiveCamera?this.camera.fov:50;
 /* 半径 r 的包围球刚好填满竖直视野需要 d = r / sin(fov/2)，再留 20% 余量，
    免得相机贴在物体表面、近裁剪面切掉一半。 */
 const ideal=Math.max(radius/Math.max(Math.sin(fov*Math.PI/360),0.05)*1.2,1e-3);
 let dist=ideal;
 /* 相机 near 经常比「一栋楼」还大（本项目 near=1、整模型 2 单位）。贴到 0.4 会把整个取景框
    埋进近裁剪面，画面变成贴脸看地面。先按 near 夹住，保证物体不被裁；autoNear 打开时
    再临时压低 near，换回理想取景距离。 */
 const cam=this.camera;
 const canAdjustNear=!!(this.autoNear&&cam.isPerspectiveCamera&&cam.near>0);
 if(canAdjustNear&&ideal<cam.near*1.25){
  const want=Math.max(ideal*0.05,1e-4);
  if(want<cam.near){
   this._restoreNear(true);
   this._nearSaved={camera:cam,near:cam.near,center:center.clone()};
   cam.near=want;
   cam.updateProjectionMatrix();
  }
 }
 /* 兜底：near 压不下去（已经是极小值）时只能停在 near 外，至少别让物体被裁掉 */
 if(cam.isPerspectiveCamera&&cam.near>0&&dist<cam.near*1.25)dist=cam.near*1.25;
 const dir=this.camera.position.clone().sub(center);
 if(dir.lengthSq()<1e-8)dir.set(0.6,0.45,1);   /* 相机正好在中心时给个默认斜角 */
 const toPos=center.clone().add(dir.normalize().multiplyScalar(dist));
 const fromPos=this.camera.position.clone();
 const fromTarget=this.controls&&this.controls.target?this.controls.target.clone():null;
 this._stopFocus();
 const duration=Number.isFinite(opts.duration)?opts.duration:this.focusDuration;
 const canFly=opts.instant!==true&&duration>0&&typeof requestAnimationFrame==='function';
 if(!canFly){
  this._applyFocus(toPos,center);
  return this;
 }
 const t0=typeof performance!=='undefined'?performance.now():Date.now();
 const ease=x=>x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
 const step=now=>{
  if(this.destroyed){this._focusRaf=null;return;}
  const k=Math.min(1,Math.max(0,(now-t0)/duration));
  const e=ease(k);
  const pos=fromPos.clone().lerp(toPos,e);
  const look=fromTarget?fromTarget.clone().lerp(center,e):center.clone();
  this._applyFocus(pos,look);
  this._focusRaf=k<1?requestAnimationFrame(step):null;
 };
 this._focusRaf=requestAnimationFrame(step);
 return this;
}
/* 相机就位：位置 + controls.target + lookAt 必须一起写，否则 OrbitControls 下一帧会把相机拽回去 */
_applyFocus(pos,target){
 this.camera.position.copy(pos);
 if(this.controls&&this.controls.target){
  this.controls.target.copy(target);
  if(this.controls.update)this.controls.update();
 }
 this.camera.lookAt(target);
 this.camera.updateMatrixWorld();
}
_stopFocus(){
 if(this._focusRaf!=null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(this._focusRaf);
 this._focusRaf=null;
}
/* 相机离目标拉远后把 near 还回去：压低 near + 大 far 会啃深度精度，不能长期留着。 */
_restoreNear(force){
 const s=this._nearSaved;
 if(!s)return;
 const cam=this.camera;
 if(!force&&cam&&cam.position.distanceTo(s.center)<=s.near*3)return;
 if(cam&&cam.near!==s.near){cam.near=s.near;cam.updateProjectionMatrix();}
 this._nearSaved=null;
}
setAutoNear(on){this.assert();this.autoNear=!!on;return this;}
setFocusOnSelect(on){this.assert();this.focusOnSelect=!!on;return this;}
setFocusDuration(ms){this.assert();if(!Number.isFinite(ms)||ms<0)throw Error('Invalid focus duration');this.focusDuration=ms;return this;}

/* -------- 选中与拖拽 -------- */
 setPicking(on){
  this.assert();
  if(this.selection)this.selection.enabled=!!on;
  if(!on)this.clearSelection();
  return this;
 }
 getSelected(){return this.selection?this.selection.selected:null;}
 selectObject(objectOrId){
  this.assert();
  if(!this.selection)throw Error('Selection layer unavailable');
  const obj=typeof objectOrId==='string'?(this.scene.getObjectByProperty('uuid',objectOrId)||this.scene.getObjectByName(objectOrId)):objectOrId;
  if(!obj)throw Error('Object not found');
  if(!this.inspector.byObject.has(obj))this.inspector.rebuild();
  this.selection.select(obj);
  return obj;
 }
 clearSelection(){this.assert();if(this.selection)this.selection.clear();return this;}
 setTransformMode(mode){this.assert();if(this.selection)this.selection.setMode(mode);if(this.ui&&this.ui.syncModeButtons)this.ui.syncModeButtons();return this;}
 getTransformMode(){return this.selection?this.selection.mode:null;}
 getGizmo(){return this.selection?this.selection.gizmo:null;}
 emit(name){
  const fn=this.handlers&&this.handlers[name];
  if(typeof fn!=='function')return;
  const args=Array.prototype.slice.call(arguments,1);
  try{fn.apply(null,args);}catch(e){this.warnings.add('callback '+name+': '+((e&&e.message)||e));}
 }

 /* -------- 改动文本与导出 -------- */
 logChange(records){
  if(!this.logChanges)return;
  for(const r of records){
   try{console.info('%c[three-scene-debugger] '+r.objectName+'.'+r.propertyPath,'color:#5b7fd6',this.changeText(r));}catch(e){}
  }
 }
 changeText(r){
  const oldText=r.oldText!==undefined?r.oldText:this.fmtTyped(r.propertyPath,r.oldValue);
  const newText=r.newText!==undefined?r.newText:this.fmtTyped(r.propertyPath,r.newValue);
  return oldText+' → '+newText;
 }
 enumGroup(path){
  if(/toneMapping$/.test(path))return 'toneMapping';
  if(path==='side'||/\.side$/.test(path))return 'side';
  if(/blending$/.test(path))return 'blending';
  if(/(wrapS|wrapT)$/.test(path))return 'wrap';
  if(/magFilter$/.test(path))return 'magFilter';
  if(/minFilter$/.test(path))return 'minFilter';
  if(/depthFunc$/.test(path))return 'depthFunc';
  if(path==='shadowMap.type')return 'shadowMapType';
  if(/(outputColorSpace|colorSpace)$/.test(path))return 'colorSpace';
  return null;
 }
 enumName(path,value){
  if(typeof value!=='number')return null;
  const group=this.enumGroup(path);
  if(!group||!ENUM_GROUPS[group]||!this.THREE)return null;
  for(const n of ENUM_GROUPS[group])if(this.THREE[n]===value)return n;
  return null;
 }
 fmtTyped(path,v){const n=this.enumName(path,v);return n?n+' ('+v+')':fmtValue(v);}
 changeLine(r,asCode){
  const t=r._target;
  const base=t?t.expr:(r.expr||r.target);
  const lhs=base+'.'+r.propertyPath;
  if(!asCode)return (r.objectName||r.target)+'.'+r.propertyPath+' = '+(r.newText!==undefined?r.newText:fmtValue(r.newValue));
  /* 换材质导出成一次 setMaterial 调用，而不是一句注释——注释交回给 agent 等于没改 */
  if(r.materialSwap){
   const sw=r.materialSwap,opt={};
   if(sw.slot!==null)opt.slot=sw.slot;
   if(!sw.copy)opt.copy=false;
   if(sw.spread)opt.spread=true;
   return 'tsd.setMaterial('+base+', '+JSON.stringify(sw.type)+(Object.keys(opt).length?', '+JSON.stringify(opt):'')+');';
  }
  if(r.texPreset){
   const tp=r.texPreset,opt={slots:tp.slots};
   if(tp.kind)opt.kind=tp.kind;
   if(tp.size)opt.size=tp.size;
   if(tp.repeat&&tp.repeat!==1)opt.repeat=tp.repeat;
   return 'tsd.applyTexturePreset('+base+', '+JSON.stringify(tp.id)+', '+JSON.stringify(opt)+');';
  }
  if(r.texAsset)return 'tsd.applyAssetTexture('+base+', '+JSON.stringify(r.texAsset.slot)+', '+JSON.stringify(r.texAsset.id)+', '+JSON.stringify(r.texAsset.kind)+');';
  if(r.oldText!==undefined)return '// '+r.propertyPath+': '+r.oldText+' → '+r.newText;
  const v=r.newValue;
  const en=this.enumName(r.propertyPath,v);
  if(en)return lhs+' = THREE.'+en+';';
  if(v&&v.$type){
   if(v.$type==='Color')return lhs+'.setRGB('+v.rgb.join(', ')+');';
   if(v.$type==='Euler')return lhs+'.set('+v.value.slice(0,3).join(', ')+', '+JSON.stringify(v.value[3]||'XYZ')+');';
   if(v.$type==='Quaternion')return lhs+'.set('+v.value.join(', ')+');';
   if(v.$type==='Vector2'||v.$type==='Vector3'||v.$type==='Vector4')return lhs+'.set('+v.value.join(', ')+');';
   if(v.$type==='Number')return lhs+' = '+v.value+';';
   return lhs+' = '+JSON.stringify(v)+';';
  }
  return lhs+' = '+JSON.stringify(v)+';';
 }
 editorLine(r){
  const lit=v=>{const s=String(v);return (s==='true'||s==='false'||(s!==''&&String(Number(s))===s))?s:JSON.stringify(s);};
  const p=r.propertyPath, v=r.newText, tg=r.target||'';
  if(tg==='editor:postfx')return p==='reset'?'tsd.resetPostFX();':'tsd.setPostFX('+JSON.stringify(p)+', '+lit(v)+');';
  if(tg==='editor:env')return p==='environment'?'tsd.setEnvironment('+lit(v)+');':'tsd.setEnvBackground('+lit(v)+');';
  if(tg==='editor:lights')return (p==='shadowCameras'?'tsd.setShadowHelpers(':'tsd.setLightHelpers(')+lit(v)+');';
  return null;
 }
 exportChangeMarkdown(){
  this.assert();
  const recs=this.tracker.collapse();
  const header='# three-scene-debugger 改动（'+recs.length+' 处）';
  if(!recs.length){
   if(!this.tracker.records.length)return header+'\n\n暂无改动。';
   return header+(this.tracker.records.some(r=>r.active)?'\n\n所有改动已回到初始状态，无需修改。':'\n\n改动已全部撤销，无需修改。');
  }
  const lines=[header,''];
  const groups=new Map(),editor=[];
  for(const r of recs){
   const k=r.target||'custom';
   if(k.startsWith('editor:')){editor.push(r);continue;}
   if(!groups.has(k))groups.set(k,[]);
   groups.get(k).push(r);
  }
  for(const [k,items] of groups){
   const first=items[0];
   const t=this.inspector.targets.get(k);
   let title=String(first.objectName||k).split(' · ')[0];
   if(first.ownerName)title=first.ownerName+' 的材质（'+title+'）';
   lines.push('## '+title);
   for(const r of items)lines.push('- `'+r.propertyPath+'`：'+this.changeText(r));
   /* 一段代码解决一个对象：先声明 target，再用 target.xxx 赋值。
      之前是「一段只有 const target 的片段」+「一段 scene.getObjectByName(...) 内联解析」，
      两段互不相干——单独复制第一段什么都不会发生，agent 也容易只取到那段。 */
   const code=items.map(r=>this.changeLine(t?Object.assign({},r,{_target:{expr:'target'}}):r,true)).filter(line=>line&&!line.startsWith('//'));
   if(code.length){
    if(t)lines.push('','```js','const target = '+t.expr+';',...code,'```');
    else lines.push('','```js',...code,'```');
   }
   lines.push('');
  }
  if(editor.length){
   lines.push('## 编辑器操作');
   for(const r of editor)lines.push('- `'+r.propertyPath+'`：'+this.changeText(r)+(r.api?' → `'+r.api+'`':''));
   const api=editor.map(r=>this.editorLine(r)).filter(Boolean);
   if(api.length)lines.push('','```js',...api,'```');
   lines.push('');
  }
  const plan=this.exportComposerPlan();
  if(plan)lines.push(plan,'');
  const rev=this.THREE&&this.THREE.REVISION||'?';
  lines.push('---','由 three-scene-debugger '+VERSION+' 导出（Three r'+rev+'，场景 '+(this.scene.name||'Scene')+'）。代码里的 tsd 指调试器实例（window.__tsd）；代码块可直接执行，也可交给 agent 逐块应用。');
  return lines.join('\n');
 }
/* 修改提示词：把改动清单包装成可直接发给 AI 的指令（面板底部大按钮复制的就是它） */
 exportPrompt(){
  this.assert();
  const n=this.tracker.collapse().length;
  if(!n){
   const und=this.tracker.records.some(r=>r.active)?'所有改动都已回到初始状态':'没有未应用的改动';
   return '我在 Three.js 页面里挂了 three-scene-debugger 调试面板，目前'+und+'，无需修改代码。';
  }
  const head=[
   '我在 Three.js 页面里用 three-scene-debugger 调试面板改了 '+n+' 处参数，请把下面的修改应用到场景中。',
   '要求：',
   '1. 按改动清单逐项修改，同一属性只看最终值（旧值仅用于理解改动意图）；',
   '2. 每个对象下的 js 代码块可直接执行（页面需已有 scene / camera / renderer / THREE 变量），代码里的 tsd 指调试器实例（window.__tsd）；',
   '3. 如果要改的是源码而不是运行时状态，请把代码块转成场景初始化参数的等价修改。',''
  ];
  return head.join('\n')+this.exportChangeMarkdown();
 }

/* AI 提示词：当前场景 + 选中对象的运行时状态，包装成可直接发给 AI 的指令 */
 aiPrompt(targetId){
  this.assert();
  const fmt=v=>{
   if(v===undefined||v===null)return String(v);
   if(typeof v==='number')return Number.isFinite(v)?String(Number(v.toFixed(4))):String(v);
   if(typeof v==='boolean')return String(v);
   if(typeof v==='string')return JSON.stringify(v);
   if(typeof v==='function')return null;
   if(v.isColor)return '#'+v.getHexString();
   if(v.isTexture)return 'Texture('+(v.name||String(v.uuid).slice(0,8))+')';
   if(v.isVector2||v.isVector3||v.isVector4||v.isQuaternion||v.isEuler)return '['+v.toArray().map(x=>typeof x==='number'?Number(x.toFixed(4)):JSON.stringify(x)).join(', ')+']';
   if(v.isObject3D||v.isMaterial)return (v.type||'object')+'('+(v.name||String(v.uuid).slice(0,8))+')';
   if(Array.isArray(v))return '['+v.length+' 项]';
   try{const j=JSON.stringify(v);return j&&j.length<120?j:'['+(v.constructor&&v.constructor.name||'object')+']';}catch(err){return '[object]';}
  };
  const nodes=(this.tree&&this.tree.nodes)||[];
  const count=f=>nodes.reduce((n,o)=>n+(f(o)?1:0),0);
  const mats=new Set();
  for(const o of nodes){const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)if(m&&m.uuid)mats.add(m.uuid);}
  const id=targetId||(this.ui&&this.ui.targets?this.ui.targets.value:null);
  const t=id?this.inspector.targets.get(id):null;
  const rev=(this.THREE&&this.THREE.REVISION)||'?';
  const lines=[
   '# AI 提示词 · Three.js 场景状态','',
   '我在 Three.js 页面里挂了 three-scene-debugger 调试面板。下面是当前场景与选中对象的运行时状态，请据此完成任务（修改参数、复现场景或给出改造方案）。','',
   '要求：',
   '1. 先读「场景概览」，再按「当前选中对象」的字段定位目标；定位表达式可直接用于运行时代码。',
   '2. 改动请给出可直接粘贴的 js 代码块，并说明改了哪个对象、哪些参数；页面已有 scene / camera / renderer / THREE 变量。',
   '3. 若要改源码而非运行时状态，把参数转成场景初始化代码的等价写法，保持其它对象不变。',
   '4. 若附有「待应用改动」，优先把这些改动落到代码里；同一属性只看最终值。','',
   '## 场景概览',
   '- Three r'+rev+'，场景名：'+(this.scene.name||'Scene'),
   '- 场景节点 '+nodes.length+' 个：Mesh '+count(o=>o.isMesh)+' / Light '+count(o=>o.isLight)+' / Camera '+count(o=>o.isCamera)+' / Group '+count(o=>o.isGroup),
   '- 材质实例 '+mats.size+' 个；可编辑目标 '+this.inspector.targets.size+' 个',
   '- 相机：'+((this.camera&&this.camera.type)||'?')+'，位置 '+(this.camera&&this.camera.position?fmt(this.camera.position):'?'),
   '- 渲染器：toneMapping='+(this.renderer?this.renderer.toneMapping:'?')+'，outputColorSpace='+(this.renderer?this.renderer.outputColorSpace:'?')+'，阴影='+((this.renderer&&this.renderer.shadowMap)?this.renderer.shadowMap.enabled:'?'),''
  ];
  if(t){
   const o=t.object;
   lines.push('## 当前选中对象',
    '- 名称：'+(o.name||'(未命名)'),
    '- 类型：'+((o.type)||(o.constructor&&o.constructor.name)||'unknown')+'，目标类别：'+((t.locator&&t.locator.kind)||'target'),
    '- UUID：'+String(o.uuid||t.id),
    '- 定位表达式：`'+t.expr+'`','',
    '```js','const tsd = window.__tsd;','const target = '+t.expr+';','```','');
   const fields=[];
   for(const [p] of t.fields){
    if(fields.length>=140){fields.push('- … 其余字段省略（共 '+t.fields.size+' 项）');break;}
    let v;try{v=get(o,p);}catch(err){continue;}
    if(v===undefined)continue;
    const text=fmt(v);
    if(text===null)continue;
    fields.push('- `'+p+'`: '+text);
   }
   lines.push('### 当前参数（'+fields.length+' 项）',...fields,'');
   if(o.material){
    const ms=Array.isArray(o.material)?o.material:[o.material];
    lines.push('### 材质');
    ms.forEach((m,i)=>{
     if(!m)return;
     lines.push('- ['+i+'] '+(m.type||'Material')+(m.name?' · '+m.name:'')+'：color='+fmt(m.color)+'，roughness='+fmt(m.roughness)+'，metalness='+fmt(m.metalness)+'，opacity='+fmt(m.opacity));
    });
    lines.push('');
   }
  }else{
   lines.push('## 当前选中对象','（未选中对象：在面板里选一个目标后再点「AI 提示词」可带上完整参数）','');
  }
  const recs=this.tracker.collapse();
  if(recs.length){
   const md=this.exportChangeMarkdown().replace(/\n---\n由 three-scene-debugger [^\n]*$/,'');
   lines.push('## 待应用改动（'+recs.length+' 处）','',md,'');
  }
  lines.push('---','由 three-scene-debugger '+VERSION+' 生成。','');
  return lines.join('\n');
 }
 undo(id){this.assert();this.tracker.undo(id);const t=this.inspector.byObject.get(this.scene);for(const key of [...t.fields.keys()])if(key.startsWith('fog.'))t.fields.delete(key);if(this.scene.fog){this.inspector.field(t,'fog.color','color');for(const k of this.scene.fog.isFog?['near','far']:['density'])this.inspector.field(t,'fog.'+k);}this.ui.changes();}
 clearChanges(){this.assert();this.tracker.clear();this.ui.changes();}
 registerResource(resource){this.assert();if(!resource?.uuid||!resource.isTexture&&!resource.isMaterial)throw Error('Expected Texture/Material');this.inspector.resources.set(resource.uuid,resource);this.ui.inspect();return resource;}
 registerPostProcessing(composer){this.assert();if(!composer||!Array.isArray(composer.passes))throw Error('Expected composer.passes');this.postfx.attachComposer(composer);this.inspector.extras=this.inspector.extras.filter(e=>e.locator.kind!=='pass');composer.passes.forEach((p,i)=>this.inspector.extras.push({object:p,id:'pass:'+i,label:'Pass '+i+' '+p.constructor.name,expr:'composer.passes['+i+']',locator:{kind:'pass',index:i}}));this.inspector.rebuild();this.ui.refresh();if(this.ui.postfxStatus)this.ui.postfxStatus();return this;}
 registerAnimationMixer(mixer,actions){this.assert();if(!mixer)throw Error('Expected AnimationMixer');const index=this.inspector.extras.filter(e=>e.locator.kind==='mixer').length;this.inspector.extras.push({object:mixer,id:'mixer:'+index,label:'AnimationMixer '+index,expr:'mixers['+index+']',locator:{kind:'mixer',index}});const list=actions||mixer._actions||[];list.forEach((a,i)=>this.inspector.extras.push({object:a,id:'action:'+index+':'+i,label:'Action '+index+':'+i,expr:'actions['+index+']['+i+']',locator:{kind:'action',mixer:index,index:i}}));this.inspector.rebuild();this.ui.refresh();return this;}
 exportSnapshot(){this.assert();return this.tracker.snapshot();}
 locate(loc,id){let t=this.inspector.targets.get(id);if(t)return t; // UUID is stable within the same scene; named fallback only when unique.
 if(loc?.kind==='scene')t=this.inspector.byObject.get(this.scene);else if(loc?.kind==='camera')t=this.inspector.byObject.get(this.camera);else if(loc?.kind==='object'&&loc.name&&this.tree.names.get(loc.name)===1)t=[...this.inspector.targets.values()].find(t=>t.locator.kind==='object'&&t.object.name===loc.name);
 else if(loc?.kind==='material'){const owner=this.inspector.targets.get('object:'+loc.owner)?.object||(loc.ownerName&&this.tree.names.get(loc.ownerName)===1?this.tree.nodes.find(o=>o.name===loc.ownerName):null);const m=loc.index===null?owner?.material:owner?.material?.[loc.index];t=this.inspector.byObject.get(m);}else if(loc?.kind==='texture'){const parent=this.locate(loc.parentLocator,loc.parent);if(parent)t=this.inspector.byObject.get(get(parent.object,loc.path));}return t;}
 loadSnapshot(input){this.assert();if(input===undefined||input===null)throw Error('loadSnapshot 需要快照对象或 JSON 字符串');const snap=typeof input==='string'?JSON.parse(input):plain(input);if(snap.format!=='three-scene-debugger'||snap.version!==1||!Array.isArray(snap.changes))throw Error('Invalid snapshot format');const report={applied:0,errors:[]};for(let i=0;i<snap.changes.length;i++){try{const c=snap.changes[i],t=this.locate(c.locator,c.target);if(!t)throw Error('Target not found: '+c.target);this.set(t.id,c.propertyPath,t.fields.get(c.propertyPath)?.kind==='json'?plain(c.newValue):this.inspector.resolve(c.newValue));report.applied++;}catch(e){report.errors.push({index:i,message:e.message});}}this.ui.inspect();return report;}
 exportCode(){this.assert();const lines=['// Context: scene, camera, renderer, THREE; optional controls, composer, mixers[], actions[][].', '// Resources must already exist in the scene or be supplied in debugResources (UUID -> resource).', 'const tsdResource = uuid => { const supplied = typeof debugResources !== "undefined" && debugResources[uuid]; if (supplied) return supplied; let found; scene.traverse(o => { if (o.uuid === uuid) found=o; const ms=Array.isArray(o.material)?o.material:[o.material]; for(const m of ms.filter(Boolean)){if(m.uuid===uuid) found=m; for(const v of Object.values(m)) if(v && v.isTexture && v.uuid===uuid) found=v;} }); for (const v of [scene.background,scene.environment]) if(v && v.uuid===uuid) found=v; if(!found) throw new Error("Missing resource "+uuid); return found; };'];
 const code=v=>{if(v&&v.$type){if(v.$type==='Number')return v.value;if(v.$type==='Texture'||v.$type==='Material')return 'tsdResource('+JSON.stringify(v.uuid)+')';if(v.$type==='Color')return 'new THREE.Color().setRGB('+v.rgb.join(',')+')';if(['Vector2','Vector3','Vector4','Euler','Quaternion'].includes(v.$type))return 'new THREE.'+v.$type+'().fromArray('+JSON.stringify(v.value)+')';if(v.$type==='Fog')return 'new THREE.Fog('+code(v.color)+','+v.near+','+v.far+')';if(v.$type==='FogExp2')return 'new THREE.FogExp2('+code(v.color)+','+v.density+')';}return JSON.stringify(v);};
 let i=0;for(const c of this.exportSnapshot().changes){const t=this.target(c.target),x='tsdTarget'+i++;lines.push('{ const '+x+' = '+t.expr+'; if(!'+x+') throw new Error("Debugger target missing");');const lhs=x+'.'+c.propertyPath,v=c.newValue,en=this.enumName(c.propertyPath,v);if(c.propertyPath==='pixelRatio'&&t.id==='renderer')lines.push(x+'.setPixelRatio('+Math.min(v,this.pixelRatioCap)+');');else if(en)lines.push(lhs+' = THREE.'+en+';');else if(t.fields.get(c.propertyPath)?.kind==='json')lines.push(lhs+' = '+JSON.stringify(v)+';');else if(v&&['Color','Vector2','Vector3','Vector4','Euler','Quaternion'].includes(v.$type))lines.push(lhs+(c.propertyPath!=='background'?'.copy('+code(v)+');':' = '+code(v)+';'));else lines.push(lhs+' = '+code(v)+';');if(t.object.isTexture||t.object.isMaterial)lines.push(x+'.needsUpdate = true;');if(t.object.isTexture)lines.push('if('+x+'.matrixAutoUpdate) '+x+'.updateMatrix();');if(t.object.isCamera)lines.push(x+'.updateProjectionMatrix();');if(t.object.isObject3D)lines.push((/^(position|rotation|scale)(\.|$)/.test(c.propertyPath)?x+'.updateMatrix(); ':'if('+x+'.matrixAutoUpdate) '+x+'.updateMatrix(); ')+x+'.matrixWorldNeedsUpdate=true;');if(c.propertyPath.startsWith('shadow.camera.'))lines.push(x+'.shadow.camera.updateProjectionMatrix();');if(c.propertyPath.startsWith('shadow.'))lines.push(x+'.shadow.needsUpdate=true; renderer.shadowMap.needsUpdate=true;');if(c.propertyPath.startsWith('shadowMap.'))lines.push(x+'.shadowMap.needsUpdate=true;');if(t.id==='controls')lines.push('if('+x+'.update) '+x+'.update();');lines.push('}');}
 /* 自定义动作（换材质 / 贴图库）没有快照条目，用可执行 API 单独补上，否则导出会漏掉它们 */
 for(const r of this.tracker.collapse()){
  if(!r.active||!(r.materialSwap||r.texPreset||r.texAsset))continue;
  const api=this.changeLine(r,true);
  if(api&&api.indexOf('//')!==0)lines.push(api);
 }
 if(this.envLib&&this.envLib.current!=='none')lines.push('// 环境贴图：tsd.setEnvironment('+JSON.stringify(this.envLib.current)+'); // 程序化生成，与本技能实例绑定');
 return lines.join('\n');}
 exportFullSceneJSON(){this.assert();return this.scene.toJSON();}
 saveSnapshot(name='manual'){this.assert();if(!this.storage)throw Error('Storage unavailable');this.storage.setItem(PREFIX+String(name),JSON.stringify(this.exportSnapshot()));return PREFIX+String(name);}
 loadSavedSnapshot(name='manual'){this.assert();if(!this.storage)throw Error('Storage unavailable');const v=this.storage.getItem(PREFIX+String(name));if(v===null)throw Error('Saved snapshot not found');return this.loadSnapshot(v);}
 destroy(options={}){let storageError=null;try{if(options.clearStorage&&this.storage){for(let i=this.storage.length-1;i>=0;i--){const k=this.storage.key(i);if(k?.startsWith(PREFIX))this.storage.removeItem(k);}}}catch(e){storageError=e;}if(this.destroyed){if(storageError)throw storageError;return;}this.destroyed=true;liveInstances--;this._restoreNear(true);if(this._focusRaf!=null&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(this._focusRaf);this._focusRaf=null;if(liveInstances===0&&globalRoot&&globalRoot.ThreeSceneDebugger===publicApi)delete globalRoot.ThreeSceneDebugger;this.performance.stop();if(this.selection)this.selection.destroy();if(this.lightHelpers)this.lightHelpers.destroy();if(this.postfx)this.postfx.destroy();if(this.helpers){for(const k of ['grid','axes']){const h=this.helpers[k];if(h){try{this.scene&&this.scene.remove(h);}catch(e){}try{h.geometry&&h.geometry.dispose();}catch(e){}try{if(Array.isArray(h.material))h.material.forEach(m=>m.dispose());else if(h.material)h.material.dispose();}catch(e){}}}}if(this.envLib)this.envLib.destroy();if(this.assets)this.assets.dispose();if(this.textures)this.textures.dispose();this.ui.destroy();this.tree.clear();this.inspector.clear();this.tracker.clear();this.tracker.d=null;this.warnings.clear();for(const k of ['scene','camera','renderer','controls','THREE','ui','tree','inspector','tracker','performance','selection','lightHelpers','envLib','assets','textures','postfx','helpers','handlers'])this[k]=null; // storage retained solely for repeat destroy({clearStorage:true}); no scene or DOM references.
 if(storageError)throw storageError;
 }
}
function createSceneDebugger(options){return new SceneDebugger(options);}
export {createSceneDebugger,VERSION};
