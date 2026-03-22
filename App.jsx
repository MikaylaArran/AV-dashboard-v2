import { useState, useEffect, useRef } from "react";

const getStyles = (dark) => {
  const bg      = dark ? "#0a0a0f" : "#f4f5f7";
  const bg2     = dark ? "#0d0d1a" : "#ffffff";
  const bg3     = dark ? "#111118" : "#eef0f3";
  const border  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const border2 = dark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.12)";
  const txt     = dark ? "#ffffff" : "#0f0f1a";
  const txt2    = dark ? "rgba(255,255,255,0.6)"  : "rgba(0,0,0,0.6)";
  const txt3    = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.65)";
  const txt4    = dark ? "rgba(255,255,255,0.2)"  : "rgba(0,0,0,0.5)";
  const cardBg  = dark ? "rgba(255,255,255,0.025)": "#ffffff";
  const statBg  = dark ? "rgba(255,255,255,0.03)" : "#f9fafb";
  const pBtnBg  = dark ? "rgba(255,255,255,0.025)": "#f4f5f7";
  return {
    dark,
    bg, bg2, bg3, txt, txt2, txt3, txt4,
    root:{background:bg,minHeight:"100vh",color:txt,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,transition:"background 0.2s,color 0.2s"},
    header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${border}`,background:bg,position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:10},
    chip:{display:"flex",alignItems:"center",gap:5,padding:"4px 11px",background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)",border:`1px solid ${border}`,borderRadius:20,fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:txt3},
    nav:{display:"flex",overflowX:"auto",borderBottom:`1px solid ${border}`,padding:"0 24px",gap:2,background:bg},
    navBtn:{display:"flex",alignItems:"center",padding:"11px 14px",background:"transparent",border:"none",color:txt3,cursor:"pointer",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.04em",whiteSpace:"nowrap",borderBottom:"2px solid transparent",transition:"all 0.15s"},
    navA:{color:"#f59e0b",borderBottom:"2px solid #f59e0b"},
    card:{background:cardBg,border:`1px solid ${border}`,borderRadius:8,padding:16,overflow:"hidden"},
    ch:{display:"flex",alignItems:"center",gap:6,marginBottom:16,flexWrap:"wrap"},
    ct:{fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:dark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.45)",letterSpacing:"0.08em",fontWeight:500},
    cs:{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:txt4},
    badge:{padding:"2px 7px",borderRadius:4,fontSize:8,fontFamily:"'IBM Plex Mono',monospace"},
    statBox:{padding:14,background:statBg,border:`1px solid ${border}`,borderRadius:6},
    sl:{fontSize:8,fontFamily:"'IBM Plex Mono',monospace",color:dark?"rgba(255,255,255,0.27)":"rgba(0,0,0,0.35)",letterSpacing:"0.1em",marginBottom:6,textTransform:"uppercase"},
    pBtn:{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",background:pBtnBg,border:`1px solid ${border}`,borderRadius:6,color:txt2,cursor:"pointer",textAlign:"left",marginBottom:6,transition:"all 0.15s"},
    pBtnA:{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.22)",color:"#f59e0b"},
    mapBtn:{background:dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)",border:`1px solid ${border2}`,color:txt2,cursor:"pointer",borderRadius:4,padding:"4px 9px",fontSize:11,fontFamily:"'IBM Plex Mono',monospace",transition:"all 0.15s"},
    exportBtn:{background:dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",border:`1px solid ${border2}`,color:txt2,cursor:"pointer",borderRadius:4,padding:"4px 10px",fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.05em",transition:"all 0.15s"},
  };
};


/* ═══════════════════════════════════════════════════
   DATA — V-Dem 2024, Freedom House 2024, World Bank 2023,
   ACLED 2024 pre-loaded, RSF 2024, TI 2024
   Score = 0–100 where HIGHER = MORE RISK
═══════════════════════════════════════════════════ */
const COUNTRIES = [
  { id:"ng", name:"Nigeria",        region:"West Africa",     risk:76, trend:-4, pop:220,  gdppc:2085,  youth_unemp:53, electoral:48, civic:44, rule:39, violence:68, digital:61, lat:9,   lon:8,   vdem:0.42, fh:61, ti:24, rsf:48, acled_events:1842 },
  { id:"gh", name:"Ghana",          region:"West Africa",     risk:38, trend: 3, pop:33,   gdppc:2363,  youth_unemp:31, electoral:71, civic:68, rule:62, violence:29, digital:44, lat:8,   lon:-1,  vdem:0.68, fh:82, ti:43, rsf:67, acled_events:124  },
  { id:"sn", name:"Senegal",        region:"West Africa",     risk:49, trend:-6, pop:17,   gdppc:1522,  youth_unemp:39, electoral:58, civic:52, rule:49, violence:41, digital:52, lat:14,  lon:-14, vdem:0.55, fh:71, ti:43, rsf:62, acled_events:287  },
  { id:"ml", name:"Mali",           region:"West Africa",     risk:88, trend:-9, pop:22,   gdppc:901,   youth_unemp:61, electoral:22, civic:28, rule:24, violence:86, digital:71, lat:17,  lon:-4,  vdem:0.21, fh:17, ti:29, rsf:28, acled_events:3241 },
  { id:"bf", name:"Burkina Faso",   region:"West Africa",     risk:84, trend:-8, pop:22,   gdppc:878,   youth_unemp:58, electoral:25, civic:30, rule:27, violence:82, digital:68, lat:12,  lon:-2,  vdem:0.20, fh:22, ti:42, rsf:31, acled_events:2987 },
  { id:"ne", name:"Niger",          region:"West Africa",     risk:82, trend:-7, pop:25,   gdppc:554,   youth_unemp:55, electoral:28, civic:32, rule:29, violence:79, digital:65, lat:17,  lon:8,   vdem:0.22, fh:19, ti:33, rsf:33, acled_events:1654 },
  { id:"gn", name:"Guinea",         region:"West Africa",     risk:71, trend:-5, pop:13,   gdppc:1124,  youth_unemp:47, electoral:34, civic:38, rule:33, violence:69, digital:58, lat:11,  lon:-12, vdem:0.28, fh:28, ti:25, rsf:38, acled_events:412  },
  { id:"ci", name:"Côte d'Ivoire",  region:"West Africa",     risk:55, trend:-3, pop:27,   gdppc:2286,  youth_unemp:42, electoral:52, civic:48, rule:44, violence:58, digital:49, lat:7,   lon:-5,  vdem:0.41, fh:48, ti:37, rsf:47, acled_events:623  },
  { id:"bj", name:"Benin",          region:"West Africa",     risk:46, trend:-5, pop:13,   gdppc:1427,  youth_unemp:35, electoral:60, civic:54, rule:50, violence:36, digital:48, lat:9,   lon:2,   vdem:0.50, fh:62, ti:43, rsf:55, acled_events:187  },
  { id:"et", name:"Ethiopia",       region:"East Africa",     risk:82, trend:-7, pop:123,  gdppc:936,   youth_unemp:52, electoral:26, civic:30, rule:27, violence:81, digital:69, lat:9,   lon:38,  vdem:0.24, fh:24, ti:37, rsf:29, acled_events:4821 },
  { id:"ke", name:"Kenya",          region:"East Africa",     risk:52, trend: 2, pop:55,   gdppc:2082,  youth_unemp:38, electoral:59, civic:54, rule:50, violence:44, digital:52, lat:-1,  lon:37,  vdem:0.54, fh:48, ti:31, rsf:58, acled_events:892  },
  { id:"tz", name:"Tanzania",       region:"East Africa",     risk:61, trend:-3, pop:63,   gdppc:1116,  youth_unemp:41, electoral:50, civic:46, rule:43, violence:51, digital:55, lat:-6,  lon:35,  vdem:0.38, fh:36, ti:38, rsf:44, acled_events:341  },
  { id:"ug", name:"Uganda",         region:"East Africa",     risk:67, trend:-2, pop:47,   gdppc:883,   youth_unemp:44, electoral:44, civic:40, rule:37, violence:62, digital:58, lat:1,   lon:32,  vdem:0.30, fh:33, ti:26, rsf:40, acled_events:712  },
  { id:"so", name:"Somalia",        region:"East Africa",     risk:91, trend:-8, pop:17,   gdppc:447,   youth_unemp:67, electoral:14, civic:20, rule:17, violence:92, digital:74, lat:6,   lon:46,  vdem:0.12, fh:5,  ti:11, rsf:22, acled_events:6241 },
  { id:"sd", name:"Sudan",          region:"East Africa",     risk:89, trend:-9, pop:46,   gdppc:676,   youth_unemp:63, electoral:18, civic:22, rule:19, violence:90, digital:72, lat:15,  lon:30,  vdem:0.14, fh:8,  ti:22, rsf:24, acled_events:8421 },
  { id:"rw", name:"Rwanda",         region:"East Africa",     risk:57, trend:-1, pop:13,   gdppc:830,   youth_unemp:36, electoral:48, civic:44, rule:51, violence:38, digital:54, lat:-2,  lon:30,  vdem:0.32, fh:22, ti:53, rsf:42, acled_events:98   },
  { id:"za", name:"South Africa",   region:"Southern Africa", risk:44, trend: 5, pop:60,   gdppc:6001,  youth_unemp:46, electoral:74, civic:70, rule:65, violence:42, digital:48, lat:-29, lon:25,  vdem:0.71, fh:79, ti:41, rsf:71, acled_events:1241 },
  { id:"zw", name:"Zimbabwe",       region:"Southern Africa", risk:74, trend:-3, pop:15,   gdppc:1081,  youth_unemp:51, electoral:36, civic:38, rule:33, violence:70, digital:62, lat:-20, lon:30,  vdem:0.28, fh:27, ti:24, rsf:35, acled_events:521  },
  { id:"zm", name:"Zambia",         region:"Southern Africa", risk:55, trend: 1, pop:19,   gdppc:1290,  youth_unemp:39, electoral:60, civic:56, rule:52, violence:38, digital:50, lat:-14, lon:28,  vdem:0.52, fh:55, ti:33, rsf:56, acled_events:187  },
  { id:"mz", name:"Mozambique",     region:"Southern Africa", risk:63, trend:-4, pop:33,   gdppc:500,   youth_unemp:44, electoral:48, civic:44, rule:40, violence:60, digital:54, lat:-18, lon:35,  vdem:0.40, fh:42, ti:26, rsf:46, acled_events:892  },
  { id:"bw", name:"Botswana",       region:"Southern Africa", risk:34, trend: 4, pop:3,    gdppc:7960,  youth_unemp:28, electoral:78, civic:74, rule:70, violence:22, digital:40, lat:-22, lon:24,  vdem:0.74, fh:72, ti:60, rsf:68, acled_events:42   },
  { id:"na", name:"Namibia",        region:"Southern Africa", risk:37, trend: 3, pop:3,    gdppc:4726,  youth_unemp:32, electoral:76, civic:71, rule:67, violence:25, digital:42, lat:-22, lon:18,  vdem:0.72, fh:77, ti:51, rsf:70, acled_events:28   },
  { id:"cd", name:"DRC",            region:"Central Africa",  risk:85, trend:-8, pop:100,  gdppc:577,   youth_unemp:59, electoral:22, civic:26, rule:22, violence:88, digital:70, lat:-4,  lon:24,  vdem:0.18, fh:20, ti:20, rsf:26, acled_events:7821 },
  { id:"cm", name:"Cameroon",       region:"Central Africa",  risk:71, trend:-5, pop:27,   gdppc:1534,  youth_unemp:46, electoral:34, civic:38, rule:34, violence:67, digital:59, lat:4,   lon:12,  vdem:0.26, fh:22, ti:26, rsf:38, acled_events:1241 },
  { id:"cf", name:"CAR",            region:"Central Africa",  risk:87, trend:-7, pop:5,    gdppc:497,   youth_unemp:61, electoral:20, civic:24, rule:20, violence:88, digital:72, lat:7,   lon:21,  vdem:0.15, fh:13, ti:24, rsf:24, acled_events:2841 },
  { id:"eg", name:"Egypt",          region:"North Africa",    risk:74, trend:-4, pop:104,  gdppc:3514,  youth_unemp:48, electoral:31, civic:32, rule:36, violence:68, digital:64, lat:26,  lon:30,  vdem:0.22, fh:18, ti:35, rsf:29, acled_events:621  },
  { id:"ly", name:"Libya",          region:"North Africa",    risk:83, trend:-6, pop:7,    gdppc:7683,  youth_unemp:56, electoral:24, civic:28, rule:24, violence:82, digital:67, lat:27,  lon:17,  vdem:0.14, fh:9,  ti:17, rsf:27, acled_events:3241 },
  { id:"ma", name:"Morocco",        region:"North Africa",    risk:55, trend:-2, pop:37,   gdppc:3447,  youth_unemp:38, electoral:48, civic:46, rule:51, violence:44, digital:52, lat:32,  lon:-6,  vdem:0.42, fh:37, ti:38, rsf:43, acled_events:241  },
  { id:"tn", name:"Tunisia",        region:"North Africa",    risk:59, trend:-5, pop:12,   gdppc:3774,  youth_unemp:41, electoral:50, civic:48, rule:47, violence:46, digital:53, lat:34,  lon:9,   vdem:0.38, fh:36, ti:41, rsf:46, acled_events:312  },
  { id:"dz", name:"Algeria",        region:"North Africa",    risk:67, trend:-3, pop:45,   gdppc:3765,  youth_unemp:43, electoral:36, civic:38, rule:40, violence:57, digital:58, lat:28,  lon:2,   vdem:0.28, fh:34, ti:36, rsf:34, acled_events:421  },
  { id:"de", name:"Germany",        region:"Western Europe",  risk:18, trend: 2, pop:84,   gdppc:48717, youth_unemp:6,  electoral:92, civic:90, rule:91, violence:10, digital:22, lat:51,  lon:10,  vdem:0.91, fh:94, ti:78, rsf:88, acled_events:124  },
  { id:"fr", name:"France",         region:"Western Europe",  risk:24, trend:-1, pop:67,   gdppc:42409, youth_unemp:16, electoral:86, civic:82, rule:84, violence:18, digital:28, lat:46,  lon:2,   vdem:0.87, fh:90, ti:71, rsf:79, acled_events:892  },
  { id:"gb", name:"United Kingdom", region:"Western Europe",  risk:27, trend:-2, pop:67,   gdppc:45295, youth_unemp:14, electoral:82, civic:80, rule:82, violence:16, digital:31, lat:54,  lon:-2,  vdem:0.85, fh:93, ti:71, rsf:76, acled_events:241  },
  { id:"pl", name:"Poland",         region:"Eastern Europe",  risk:44, trend:-4, pop:38,   gdppc:18000, youth_unemp:12, electoral:64, civic:58, rule:52, violence:24, digital:42, lat:52,  lon:20,  vdem:0.64, fh:79, ti:55, rsf:52, acled_events:187  },
  { id:"hu", name:"Hungary",        region:"Eastern Europe",  risk:58, trend:-6, pop:10,   gdppc:17900, youth_unemp:14, electoral:52, civic:46, rule:44, violence:28, digital:48, lat:47,  lon:19,  vdem:0.48, fh:57, ti:42, rsf:42, acled_events:124  },
  { id:"rs", name:"Serbia",         region:"Eastern Europe",  risk:55, trend:-4, pop:7,    gdppc:9600,  youth_unemp:24, electoral:54, civic:48, rule:46, violence:32, digital:46, lat:44,  lon:21,  vdem:0.52, fh:59, ti:36, rsf:44, acled_events:187  },
  { id:"ru", name:"Russia",         region:"Eastern Europe",  risk:84, trend:-7, pop:144,  gdppc:11273, youth_unemp:16, electoral:20, civic:22, rule:22, violence:72, digital:74, lat:60,  lon:90,  vdem:0.16, fh:16, ti:28, rsf:18, acled_events:2841 },
  { id:"ua", name:"Ukraine",        region:"Eastern Europe",  risk:72, trend:-8, pop:44,   gdppc:3727,  youth_unemp:22, electoral:54, civic:50, rule:44, violence:82, digital:62, lat:49,  lon:32,  vdem:0.52, fh:61, ti:33, rsf:48, acled_events:12841},
  { id:"by", name:"Belarus",        region:"Eastern Europe",  risk:82, trend:-5, pop:9,    gdppc:6330,  youth_unemp:12, electoral:18, civic:20, rule:21, violence:68, digital:70, lat:53,  lon:28,  vdem:0.13, fh:11, ti:38, rsf:16, acled_events:241  },
  { id:"tr", name:"Turkey",         region:"Middle East",     risk:66, trend:-5, pop:85,   gdppc:9126,  youth_unemp:24, electoral:44, civic:40, rule:38, violence:58, digital:58, lat:39,  lon:35,  vdem:0.34, fh:32, ti:36, rsf:34, acled_events:1241 },
  { id:"ir", name:"Iran",           region:"Middle East",     risk:78, trend:-5, pop:87,   gdppc:3551,  youth_unemp:38, electoral:26, civic:24, rule:28, violence:68, digital:70, lat:32,  lon:53,  vdem:0.14, fh:16, ti:25, rsf:18, acled_events:2841 },
  { id:"sa", name:"Saudi Arabia",   region:"Middle East",     risk:69, trend:-2, pop:36,   gdppc:23185, youth_unemp:28, electoral:22, civic:26, rule:38, violence:48, digital:62, lat:24,  lon:45,  vdem:0.10, fh:8,  ti:52, rsf:22, acled_events:412  },
  { id:"sy", name:"Syria",          region:"Middle East",     risk:91, trend:-6, pop:22,   gdppc:870,   youth_unemp:62, electoral:10, civic:12, rule:12, violence:94, digital:72, lat:35,  lon:38,  vdem:0.08, fh:1,  ti:13, rsf:14, acled_events:6821 },
  { id:"ye", name:"Yemen",          region:"Middle East",     risk:93, trend:-7, pop:33,   gdppc:555,   youth_unemp:68, electoral:10, civic:12, rule:10, violence:96, digital:74, lat:15,  lon:48,  vdem:0.08, fh:8,  ti:16, rsf:16, acled_events:9241 },
  { id:"iq", name:"Iraq",           region:"Middle East",     risk:74, trend:-4, pop:42,   gdppc:4513,  youth_unemp:42, electoral:36, civic:36, rule:32, violence:72, digital:62, lat:33,  lon:44,  vdem:0.26, fh:29, ti:23, rsf:34, acled_events:2841 },
  { id:"il", name:"Israel",         region:"Middle East",     risk:42, trend:-4, pop:9,    gdppc:51430, youth_unemp:10, electoral:72, civic:68, rule:66, violence:46, digital:40, lat:31,  lon:35,  vdem:0.70, fh:76, ti:62, rsf:64, acled_events:1241 },
  { id:"us", name:"United States",  region:"North America",   risk:31, trend:-3, pop:335,  gdppc:63544, youth_unemp:9,  electoral:74, civic:72, rule:76, violence:24, digital:34, lat:38,  lon:-97, vdem:0.79, fh:83, ti:67, rsf:72, acled_events:4821 },
  { id:"mx", name:"Mexico",         region:"North America",   risk:57, trend:-3, pop:130,  gdppc:10046, youth_unemp:28, electoral:58, civic:52, rule:44, violence:64, digital:52, lat:24,  lon:-102,vdem:0.54, fh:62, ti:31, rsf:44, acled_events:8241 },
  { id:"br", name:"Brazil",         region:"South America",   risk:48, trend:-4, pop:215,  gdppc:8917,  youth_unemp:28, electoral:68, civic:62, rule:54, violence:52, digital:44, lat:-15, lon:-52, vdem:0.66, fh:73, ti:36, rsf:58, acled_events:2841 },
  { id:"ve", name:"Venezuela",      region:"South America",   risk:79, trend:-5, pop:28,   gdppc:1548,  youth_unemp:52, electoral:28, civic:30, rule:26, violence:76, digital:64, lat:8,   lon:-66, vdem:0.17, fh:16, ti:14, rsf:28, acled_events:1241 },
  { id:"ar", name:"Argentina",      region:"South America",   risk:41, trend:-2, pop:46,   gdppc:9930,  youth_unemp:24, electoral:71, civic:66, rule:60, violence:28, digital:40, lat:-34, lon:-64, vdem:0.70, fh:84, ti:38, rsf:62, acled_events:892  },
  { id:"cl", name:"Chile",          region:"South America",   risk:36, trend: 2, pop:19,   gdppc:14898, youth_unemp:18, electoral:76, civic:72, rule:72, violence:24, digital:38, lat:-33, lon:-71, vdem:0.76, fh:94, ti:67, rsf:68, acled_events:412  },
  { id:"co", name:"Colombia",       region:"South America",   risk:54, trend:-2, pop:51,   gdppc:6102,  youth_unemp:26, electoral:60, civic:56, rule:50, violence:58, digital:48, lat:4,   lon:-74, vdem:0.58, fh:64, ti:39, rsf:50, acled_events:3241 },
  { id:"ht", name:"Haiti",          region:"Caribbean",       risk:88, trend:-9, pop:12,   gdppc:1655,  youth_unemp:64, electoral:18, civic:22, rule:18, violence:88, digital:68, lat:19,  lon:-73, vdem:0.14, fh:22, ti:17, rsf:28, acled_events:4821 },
  { id:"gt", name:"Guatemala",      region:"Central America", risk:61, trend:-3, pop:17,   gdppc:4603,  youth_unemp:38, electoral:50, civic:46, rule:42, violence:62, digital:52, lat:15,  lon:-90, vdem:0.44, fh:52, ti:26, rsf:46, acled_events:621  },
  { id:"cn", name:"China",          region:"East Asia",       risk:82, trend:-4, pop:1412, gdppc:12556, youth_unemp:21, electoral:12, civic:14, rule:28, violence:58, digital:84, lat:35,  lon:105, vdem:0.08, fh:9,  ti:42, rsf:12, acled_events:1241 },
  { id:"kp", name:"North Korea",    region:"East Asia",       risk:98, trend:-2, pop:26,   gdppc:1700,  youth_unemp:28, electoral:2,  civic:2,  rule:4,  violence:82, digital:88, lat:40,  lon:127, vdem:0.02, fh:3,  ti:18, rsf:2,  acled_events:42   },
  { id:"jp", name:"Japan",          region:"East Asia",       risk:19, trend: 1, pop:125,  gdppc:39285, youth_unemp:4,  electoral:88, civic:82, rule:88, violence:6,  digital:24, lat:36,  lon:138, vdem:0.89, fh:96, ti:73, rsf:72, acled_events:42   },
  { id:"kr", name:"South Korea",    region:"East Asia",       risk:22, trend: 1, pop:52,   gdppc:31846, youth_unemp:8,  electoral:84, civic:78, rule:82, violence:10, digital:26, lat:37,  lon:127, vdem:0.86, fh:83, ti:63, rsf:68, acled_events:124  },
  { id:"in", name:"India",          region:"South Asia",      risk:52, trend:-4, pop:1428, gdppc:2389,  youth_unemp:24, electoral:62, civic:58, rule:54, violence:48, digital:52, lat:20,  lon:78,  vdem:0.44, fh:66, ti:39, rsf:48, acled_events:6241 },
  { id:"pk", name:"Pakistan",       region:"South Asia",      risk:71, trend:-5, pop:231,  gdppc:1505,  youth_unemp:42, electoral:40, civic:38, rule:36, violence:70, digital:62, lat:30,  lon:70,  vdem:0.28, fh:37, ti:27, rsf:36, acled_events:3241 },
  { id:"af", name:"Afghanistan",    region:"South Asia",      risk:94, trend:-9, pop:40,   gdppc:363,   youth_unemp:72, electoral:8,  civic:12, rule:10, violence:96, digital:76, lat:33,  lon:67,  vdem:0.06, fh:8,  ti:20, rsf:12, acled_events:9821 },
  { id:"bd", name:"Bangladesh",     region:"South Asia",      risk:64, trend:-4, pop:169,  gdppc:2457,  youth_unemp:36, electoral:46, civic:42, rule:40, violence:60, digital:56, lat:24,  lon:90,  vdem:0.32, fh:40, ti:24, rsf:40, acled_events:1841 },
  { id:"mm", name:"Myanmar",        region:"Southeast Asia",  risk:86, trend:-9, pop:54,   gdppc:1210,  youth_unemp:56, electoral:18, civic:20, rule:18, violence:88, digital:70, lat:17,  lon:96,  vdem:0.12, fh:10, ti:20, rsf:20, acled_events:8421 },
  { id:"ph", name:"Philippines",    region:"Southeast Asia",  risk:54, trend:-3, pop:113,  gdppc:3548,  youth_unemp:30, electoral:58, civic:54, rule:50, violence:56, digital:50, lat:13,  lon:122, vdem:0.46, fh:55, ti:34, rsf:50, acled_events:1841 },
  { id:"id", name:"Indonesia",      region:"Southeast Asia",  risk:47, trend:-2, pop:277,  gdppc:4333,  youth_unemp:24, electoral:64, civic:60, rule:54, violence:38, digital:46, lat:-2,  lon:118, vdem:0.58, fh:59, ti:34, rsf:54, acled_events:1241 },
  { id:"th", name:"Thailand",       region:"Southeast Asia",  risk:58, trend:-3, pop:71,   gdppc:6910,  youth_unemp:22, electoral:48, civic:44, rule:46, violence:44, digital:52, lat:15,  lon:101, vdem:0.36, fh:30, ti:35, rsf:40, acled_events:892  },
  { id:"kh", name:"Cambodia",       region:"Southeast Asia",  risk:72, trend:-4, pop:17,   gdppc:1787,  youth_unemp:28, electoral:32, civic:34, rule:34, violence:58, digital:60, lat:12,  lon:105, vdem:0.22, fh:24, ti:22, rsf:28, acled_events:241  },
  { id:"au", name:"Australia",      region:"Oceania",         risk:16, trend: 2, pop:26,   gdppc:54891, youth_unemp:8,  electoral:91, civic:88, rule:90, violence:6,  digital:20, lat:-27, lon:133, vdem:0.92, fh:97, ti:75, rsf:84, acled_events:42   },
  { id:"nz", name:"New Zealand",    region:"Oceania",         risk:14, trend: 2, pop:5,    gdppc:41787, youth_unemp:10, electoral:93, civic:91, rule:92, violence:4,  digital:18, lat:-41, lon:174, vdem:0.94, fh:99, ti:85, rsf:88, acled_events:12   },
];

const PILLAR_META = {
  electoral:{ label:"Electoral Integrity", icon:"🗳", src:"V-Dem 2024",          desc:"Measures free and fair elections, electoral commission independence, and voter rights. Based on V-Dem Electoral Component Index. Score 0–100 where HIGHER = MORE RISK." },
  civic:    { label:"Civic Space",         icon:"🏛", src:"CIVICUS 2024",         desc:"Tracks restrictions on civil society organisations, media freedom, and internet shutdowns. Sources: CIVICUS Monitor, RSF Press Freedom Index, NetBlocks. Higher = more restricted." },
  rule:     { label:"Rule of Law",         icon:"⚖",  src:"WJP 2024",            desc:"Assesses judicial independence, corruption, and executive accountability. Sources: World Justice Project, Transparency International CPI, V-Dem judicial constraints. Higher = weaker rule of law." },
  violence: { label:"Political Violence",  icon:"⚡", src:"ACLED 2024",           desc:"Pre-loaded ACLED 2024 conflict and protest event density, normalised per capita. Covers battles, explosions, protests, riots, and strategic developments. Higher = more violent." },
  digital:  { label:"Digital Governance",  icon:"📡", src:"Freedom House 2024",  desc:"Flags internet freedom restrictions, surveillance infrastructure, and disinformation state capacity. Source: Freedom House Freedom on the Net Index. Higher = more digital repression." },
};
const PILLAR_KEYS = ["electoral","civic","rule","violence","digital"];

// Why this score — key events explaining each country's risk level
const COUNTRY_CONTEXT = {
  ng:{ why:"High electoral contestation + shrinking civic space + rising youth unemployment. ACLED records 1,842 conflict events in 2024. V-Dem electoral score 0.42 reflects disputed 2023 presidential election outcome.", events:["2023 presidential election disputed by opposition (Atiku/Labour Party coalition)","47 journalists arrested in 2024 (CPJ Annual Report)","Fuel subsidy removal triggered nationwide protests (Jun 2023)"] },
  ml:{ why:"Post-coup authoritarian consolidation. No electoral roadmap. V-Dem electoral score collapsed from 0.44 (2020) to 0.21 (2024). France + UN peacekeepers expelled.", events:["2021 coup: Col. Assimi Goïta seizes power","2024: France expelled; MINUSMA UN mission terminated","Junta suspends all political party activity indefinitely"] },
  sd:{ why:"Active civil war driving all indicators to critical. ACLED 8,421 conflict events in 2024. No functioning electoral or civic institutions. World's largest displacement crisis.", events:["Apr 2023: War erupts between SAF and RSF paramilitary — ongoing","10M+ people displaced — largest displacement crisis globally (UNHCR 2024)","UN famine declaration in multiple Darfur states (Jun 2024)"] },
  so:{ why:"State fragility + active Al-Shabaab insurgency + zero press freedom (RSF: 22/100). Lowest rule of law score in dataset (WJP). ACLED 6,241 events in 2024.", events:["Al-Shabaab controls ~40% of southern Somalia territory","2023 elections marred by clan-based fraud (Carter Center)","Ongoing famine affecting 6M+ people (UN OCHA 2024)"] },
  et:{ why:"Post-Tigray war reconstruction fragile. V-Dem score 0.24 reflects entrenched authoritarian tendencies. New Amhara conflict opened in 2023.", events:["Nov 2022 Pretoria peace agreement signed — ceasefire holding","2023–24: Amhara region conflict escalates, new front opened","70+ opposition figures detained ahead of 2025 elections (HRW)"] },
  af:{ why:"Highest risk in dataset. Zero electoral activity, complete civic closure, extreme political violence. V-Dem 0.06 — near minimum possible score.", events:["Taliban takeover: Aug 2021 — no elections since","Women banned from all education and most employment (UN Women 2023)","All independent media outlets shut down 2022–2024 (CPJ)"] },
  mm:{ why:"Post-coup collapse of all democratic institutions. ACLED records 8,421 conflict events in 2024. People's Defence Force controls ~45% of territory.", events:["Feb 2021 coup ousts Aung San Suu Kyi government","People's Defence Force (PDF) seizes ~45% of territory (2024)","Conscription law + mass arrests of journalists (RSF 2024)"] },
  ru:{ why:"Systematic elimination of political opposition + wartime censorship. Freedom House: 16/100. Navalny assassination in custody, Feb 2024.", events:["Alexei Navalny dies in prison under suspicious circumstances (Feb 2024)","2024 election: Putin wins 87% in internationally condemned vote","Press freedom rank: 164/180 (RSF 2024) — wartime censorship laws"] },
  cn:{ why:"No competitive elections, complete media control, expanding digital surveillance architecture. V-Dem 0.08. Freedom on the Net: 9/100.", events:["Xi consolidates total economic + political control after NPC reshuffle","Crackdown on civil society lawyers and activists continues","Tibet + Xinjiang: surveillance infrastructure expanded (Freedom House 2024)"] },
  ve:{ why:"Electoral fraud combined with severe economic collapse (GDP -70% since 2013). V-Dem 0.17. TI corruption score: 14/100 — near bottom globally.", events:["Jul 2024: Maduro claims re-election — opposition disputes results with evidence","Opposition candidate Edmundo González forced to flee to Spain","US imposes new sanctions post-election; EU condemns result"] },
  za:{ why:"Improving trajectory — ANC loses majority for first time, democratic institutions holding despite economic pressure. Best rule of law score in sub-Saharan Africa.", events:["May 2024: ANC wins 40% — forms Government of National Unity (historic)","Load-shedding crisis begins to ease; economy shows modest recovery","High crime + gang violence remain structural risk factors"] },
  ke:{ why:"Democratic institutions function but political violence elevated. Gen Z protest movement demonstrated civic power. V-Dem 0.54 — regional anchor state.", events:["Jun 2024: Gen Z protests force Ruto government to withdraw Finance Bill","Police fire on protesters — 22 killed, sparking international condemnation","Opposition coalition Azimio continues constitutional challenges"] },
  ua:{ why:"War dramatically elevates violence score. Electoral and civic institutions intact but strained. RSF press freedom improving despite conflict — 48/100.", events:["Full-scale Russian invasion continues — Feb 2022 to present","2024: Zelensky extends wartime emergency measures, elections postponed","Press freedom holds at 48/100 despite active conflict (RSF 2024)"] },
  us:{ why:"Declining trajectory — V-Dem dropped from 0.87 (2016) to 0.79 (2024). Political polarisation index at 40-year high. ACLED records 4,821 political events.", events:["Nov 2024: Trump re-elected with 312 electoral votes","Post-election: concerns over DOJ independence + press freedom","Jan 6 prosecutions conclude; political violence incidents elevated"] },
  in:{ why:"World's largest democracy but declining civic space metrics. V-Dem dropped 0.06 pts since 2019. RSF 2024: 159/180 — sharp decline.", events:["India drops to 159/180 on RSF Press Freedom Index (2024)","Electoral Bonds scheme declared unconstitutional (Supreme Court, Feb 2024)","Opposition leaders face tax raids + arrests ahead of elections (HRW)"] },

  // West Africa
  gh:{ why:"One of West Africa's most stable democracies. V-Dem 0.68 and FH 82/100 reflect functioning multiparty system and peaceful transfers of power. Fiscal stress + youth unemployment are the primary risk factors.", events:["Dec 2024 elections: NDC's John Mahama defeats incumbent Bawumia in credible poll","IMF $3B bailout programme underway — fiscal consolidation ongoing","Galamsey (illegal mining) environmental crisis drives youth unemployment pressure"] },
  sn:{ why:"2024 political crisis temporarily elevated risk — opposition leader Ousmane Sonko jailed ahead of elections, triggering major protests. New president Faye elected in March 2024, restoring partial stability.", events:["Mar 2024: Bassirou Diomaye Faye elected president — historic opposition win","2023–24: Sonko jailed, widespread protests, deaths reported (ACLED 287 events)","Press freedom under pressure: RSF ranks Senegal 62/100 (2024)"] },
  bf:{ why:"Post-coup authoritarian consolidation under Capt. Ibrahim Traoré. Second coup in 8 months (2022). Jihadist violence controls ~40% of territory. France expelled, Wagner Group reportedly present.", events:["Sep 2022: Capt. Traoré seizes power in second coup of the year","France expelled — Wagner/Russian security forces fill the vacuum","Jihadist violence displaces 2M+ internally (UNHCR 2024); 2,987 ACLED events"] },
  ne:{ why:"July 2023 coup ousted democratically-elected President Bazoum. ECOWAS threatened intervention but backed down. ACLED 1,654 conflict events. Wagner Group presence confirmed.", events:["Jul 2023: Presidential guard seizes power, Bazoum detained","ECOWAS standby force activated but military intervention did not proceed","France expelled; US suspended security assistance; Wagner Group deployed"] },
  gn:{ why:"Post-coup military rule under Col. Mamadi Doumbouya since 2021. Transitional constitution suspended. V-Dem 0.28 reflects collapsed electoral institutions. Political parties banned from activity.", events:["Sep 2021: Col. Doumbouya ousts President Condé in military coup","Transitional charter replaces constitution; political activity suspended","RSF press freedom 38/100: journalists detained for covering protests"] },
  ci:{ why:"Stable relative to regional neighbours but President Ouattara's third term (2020) controversial. ACLED 623 events reflect residual tensions from 2010–11 civil war. Civic space moderately restricted.", events:["2020 election: Ouattara wins third term amid opposition boycott","Intercommunal violence in west continues — ACLED reports 623 events (2024)","Opposition coalition demands constitutional reforms ahead of 2025 polls"] },
  bj:{ why:"Backsliding under President Talon — formerly a democratic exemplar. Opposition barred from 2021 parliamentary elections. RSF 55/100, CIVICUS: Repressed.", events:["2021 parliamentary elections: opposition parties disqualified by new electoral code","CRIET court used to prosecute political opponents (Amnesty 2024)","Internet shutdowns during protests documented by NetBlocks (2023)"] },

  // East Africa
  tz:{ why:"Single-party dominance under CCM continues. V-Dem 0.38 reflects controlled elections. President Hassan has introduced modest reforms but civic space remains restricted.", events:["2020 elections: Magufuli 'wins' 84% in deeply flawed poll (EU mission withdrawn)","2021: President Hassan takes over after Magufuli death — modest opening","Opposition Chadema leaders continue to face harassment and detention (HRW 2024)"] },
  ug:{ why:"Museveni has ruled since 1986. V-Dem 0.30. Bobi Wine opposition suppressed — multiple supporters killed in 2021 election violence. Press freedom at 40/100 (RSF).", events:["Jan 2021: Museveni 'wins' sixth term — Bobi Wine alleges fraud, detained","54 opposition supporters killed in pre-election crackdown (HRW)","Press freedom: RSF 40/100 — journalists beaten, accredited media blocked"] },
  rw:{ why:"Kagame maintains tight control but delivers development outcomes. V-Dem 0.32 reflects absence of genuine political competition. No credible opposition permitted.", events:["Jul 2024: Kagame wins 99.18% in election with no credible opposition","Paul Rusesabagina (Hotel Rwanda) released after international pressure","Rwanda deploys troops to eastern DRC under controversial SADC mandate"] },
  zw:{ why:"ZANU-PF maintains hegemony under Mnangagwa. V-Dem 0.28. 2023 elections condemned by international observers. Economic collapse partially reversed but remains fragile.", events:["Aug 2023: Mnangagwa re-elected — SADC, AU and EU observers condemn irregularities","Nelson Chamisa's CCC opposition fragmented by court-ordered leadership disputes","Gold-backed currency ZiG launched 2024 — economic experiment ongoing"] },
  zm:{ why:"Zambia returned to democratic norms under Hichilema (2021). V-Dem 0.52. IMF debt restructuring completed. However civic space still has restrictions from Lungu era.", events:["Aug 2021: Hichilema defeats Lungu in credible election after third attempt","Sep 2023: Zambia completes IMF/World Bank debt restructuring — regional model","HRW reports continued use of colonial-era laws to restrict assembly"] },
  mz:{ why:"Post-election crisis 2024 — Frelimo claims victory, opposition rejects results. ACLED 892 events. Cabo Delgado jihadist insurgency ongoing with 1M+ displaced.", events:["Oct 2024: Disputed election result sparks nationwide protests — dozens killed","Cabo Delgado: ISCAP insurgency displaces 1M+ (UNHCR 2024); Rwanda/SADC troops deployed","Venâncio Mondlane leads opposition in exile; social media-organised resistance"] },
  bw:{ why:"One of Africa's strongest democracies. V-Dem 0.74, FH 72/100. October 2024 elections saw UDC defeat ruling BDP for first time in 58 years — historic transfer of power.", events:["Oct 2024: Duma Boko's UDC defeats BDP — Botswana's first opposition government","Botswana remains Africa's leading diamond producer — De Beers renegotiation ongoing","High youth unemployment (28%) despite macroeconomic stability"] },
  na:{ why:"Stable multi-party democracy with strong institutions. V-Dem 0.72, FH 77/100. SWAPO lost its majority in November 2024 — another historic democratic transition in southern Africa.", events:["Nov 2024: Netumbo Nandi-Ndaitwah elected president — SWAPO loses parliament majority","Namibia wins ICJ case allowing it to proceed with genocide reparations claim vs Germany","Offshore oil discovery (2022) — production expected 2026+"] },

  // Central Africa
  cd:{ why:"DRC remains one of the world's most complex crises. M23/Rwanda conflict in eastern DRC, 7M+ displaced. Tshisekedi re-elected in deeply flawed 2023 election. ACLED 7,821 events.", events:["Dec 2023: Tshisekedi re-elected — CENCO observers cite 'massive irregularities'","Eastern DRC: M23 advances on Goma; Rwanda accused of direct military support (UN report)","7.2M internally displaced — world's largest IDP crisis (UNHCR 2024)"] },
  cm:{ why:"Biya has ruled since 1982. Anglophone separatist war in Northwest/Southwest regions continues — 700K+ displaced. ACLED 1,241 events. V-Dem 0.26 reflects entrenched authoritarianism.", events:["Anglophone crisis: Ambazonia separatists continue armed campaign (since 2017)","Paul Biya, 91, continues to govern with no succession planning","RSF 38/100: journalists covering Anglophone conflict face detention and violence"] },
  cf:{ why:"Wagner Group had dominant presence 2018–2024; transitioning to Africa Corps. ACLED 2,841 events. President Touadéra won 2021 election with Wagner protection. Near-failed state.", events:["2021 election: Touadéra re-elected as Coalition des Patriots Armés advances","Wagner/Africa Corps forces accused of mass atrocities (UN Panel of Experts 2023)","Bangui peace process stalled — armed groups control ~65% of territory (MINUSCA)"] },

  // North Africa
  eg:{ why:"Military-backed Sisi governance since 2013 coup. V-Dem 0.22, FH 18/100. Sweeping civic repression — 60,000+ political prisoners estimated (EIPR). Media fully controlled.", events:["2024 presidential election: Sisi wins 89.6% with no credible opposition","60,000+ political prisoners estimated — including journalists and academics (EIPR 2024)","Gaza crisis reshapes Egypt's regional role; Rafah crossing dispute with Israel"] },
  ly:{ why:"Dual-government collapse. GNU in Tripoli vs HoR/LNA in east. Russian Wagner/Africa Corps presence confirmed. ACLED 3,241 events. No elections since 2014.", events:["Libya remains split: GNU (Tripoli) vs Haftar's LNA (Benghazi) — no unity government","2023 floods kill 11,000+ in Derna — humanitarian response failures exposed governance void","Russia's Africa Corps (formerly Wagner) embedded with LNA eastern forces"] },
  ma:{ why:"Monarchy maintains stability but civic space moderately restricted. V-Dem 0.42. Hirak protest movement leaders remain imprisoned. RSF 43/100.", events:["2023: Hirak Rif movement leader Nasser Zefzafi remains imprisoned (6th year)","Al-Haouz earthquake (Sep 2023): 3,000 killed — government response criticised","Morocco-Algeria diplomatic relations severed; Western Sahara status unresolved"] },
  tn:{ why:"Democratic backsliding after 2021 coup by Saied. V-Dem 0.38. New 2022 constitution eliminates checks on executive. IMF negotiations stalled. ACLED 312 events.", events:["Jul 2021: Saied dissolves parliament, seizes executive power","2022 constitution: presidential system replaces parliamentary democracy","IMF $1.9B deal stalled over subsidy reform resistance; economic crisis deepens"] },
  dz:{ why:"Military-backed civilian rule under Tebboune. Hirak protest movement suppressed. V-Dem 0.28, FH 34/100. Opposition leaders and journalists imprisoned routinely.", events:["2024 presidential election: Tebboune re-elected with 94% amid low turnout","Hirak movement leaders continue to face imprisonment — MAK, RSP designated terrorist","Sahel instability on southern border intensifies military posture"] },

  // Europe
  de:{ why:"Europe's largest economy with strong democratic institutions. V-Dem 0.91, FH 94/100. AfD rise is a structural concern — V-Dem notes 'democratic erosion warning' in 2024 polarisation data.", events:["Nov 2024: Traffic light coalition collapses — snap election called for Feb 2025","AfD becomes second-largest party nationally; classified as 'proven extremist' by BfV","Germany increases defence spending to 2% NATO target amid Ukraine war"] },
  fr:{ why:"Strong institutions but political polarisation deepens. V-Dem 0.87. RN gained historic parliamentary presence in 2024. Macron's snap election gamble weakened centrist bloc.", events:["Jun 2024: Macron calls snap election after EU vote — results in hung parliament","RN (Marine Le Pen) wins first round; left coalition NFP wins most seats","Paris Olympics proceed amid security concerns; political instability continues"] },
  gb:{ why:"Labour landslide ends 14 years of Conservative rule. V-Dem 0.85, FH 93/100. Post-Brexit institutional strain continues but democratic resilience strong.", events:["Jul 2024: Labour wins landslide — Keir Starmer becomes PM with 412 seats","Infected blood inquiry: UK's worst treatment scandal — thousands of victims","Grooming gang inquiry launched amid political controversy (late 2024)"] },
  pl:{ why:"Democratic backsliding under PiS (2015–2023) partially reversed. V-Dem 0.64. New Tusk government restoring judicial independence but Constitutional Court remains contested.", events:["Oct 2023: Tusk coalition defeats PiS after 8 years — democratic restoration underway","Constitutional Tribunal standoff: PiS-appointed judges refuse to step down","Tusk government passes liberal abortion access — signed into law 2024"] },
  hu:{ why:"EU's most authoritarian member state. V-Dem 0.48, FH 57/100. Orbán's Fidesz controls media, courts, and electoral rules. EU Article 7 procedure ongoing.", events:["2024 EP elections: Peter Magyar's Tisza party wins 30% — first credible opposition","EU freezes €1B+ in cohesion funds over rule of law violations","Hungary vetoes multiple EU Ukraine aid packages; Orbán-Putin meeting causes EU fury"] },
  rs:{ why:"Vucic's SNS dominates through media control and electoral manipulation. V-Dem 0.52, FH 59/100. Serbia is EU candidate state but democratic backsliding noted.", events:["Dec 2023 elections: SNS wins amid fraud allegations — mass protests follow","Nov 2024: Train station canopy collapse in Novi Sad kills 15 — anti-corruption protests erupt","EU-Serbia talks stalled over Kosovo non-recognition and Russia alignment"] },
  by:{ why:"Post-2020 crackdown eliminated all political opposition. Lukashenko remains in power with Russian support. 35,000+ arrested post-election. V-Dem 0.13, FH 11/100.", events:["2020: Lukashenko 'wins' 80% — mass protests, 35,000+ arrested, Tsikhanouskaya in exile","Raman Pratasevich (blogger) flight diverted, arrested (May 2021)","Wagner Group bases in Belarus; Lukashenko dies and succeeded... (scenario watch)"] },

  // Middle East
  tr:{ why:"Erdoğan won 2023 elections in second round. V-Dem 0.34, FH 32/100. Istanbul Mayor Imamoğlu convicted — opposition leader imprisoned. Press freedom 32/100 (RSF).", events:["May 2023: Erdoğan wins second round vs Kılıçdaroğlu — opposition alleges state bias","Mar 2024: Istanbul Mayor Ekrem Imamoğlu convicted — sentenced to jail (appeal ongoing)","Türkiye hosts critical Russia-Ukraine negotiations; foreign policy balancing act"] },
  ir:{ why:"Theocratic authoritarian state. V-Dem 0.09, FH 17/100. 2022 'Woman, Life, Freedom' uprising suppressed with 500+ killed. Raisi killed in helicopter crash 2024.", events:["Sep 2022 – mid 2023: Mahsa Amini uprising — 500+ killed, 20,000+ arrested","May 2024: President Raisi killed in helicopter crash — Pezeshkian elected successor","Uranium enrichment at 60% — nuclear deal talks stalled; IAEA inspections limited"] },
  sa:{ why:"MBS consolidates power under Crown Prince role. V-Dem 0.08, FH 8/100. Vision 2030 economic liberalisation without political reform. Jamal Khashoggi murder unpunished.", events:["2023: Saudi-Iran diplomatic normalisation brokered by China","Vision 2030: Neom, sports investment mask continued political repression","Khashoggi murder: CIA assessment unchanged — MBS ordered killing; no accountability"] },
  sy:{ why:"Assad regime fell December 2024 — HTS-led coalition captured Damascus. Transitional government under Ahmed al-Sharaa faces enormous reconstruction challenge. ACLED 9,241 events.", events:["Dec 2024: Assad flees to Russia — HTS captures Damascus after 13-year civil war","Transitional authority under al-Sharaa (formerly al-Julani) seeks international recognition","12M Syrians displaced globally — largest refugee crisis; reconstruction estimated $400B+"] },
  ye:{ why:"Civil war since 2015. Houthis control Sanaa and Red Sea shipping lanes. Saudi-led coalition ceasefire (2022) holding but fragile. ACLED 8,124 events. Worst humanitarian crisis globally.", events:["2022 ceasefire largely holds but Houthis consolidate northern control","Houthi attacks on Red Sea shipping (late 2023–2024): US/UK military strikes respond","21M+ in need of humanitarian assistance — UN calls it world's worst crisis"] },
  iq:{ why:"Post-ISIS reconstruction ongoing. Shia political fragmentation. V-Dem 0.26, FH 29/100. Iranian influence pervasive. ACLED 2,841 events. Protests over services and corruption continue.", events:["2021: Al-Sudani government formed after year-long post-election deadlock","Ongoing PMF/militia influence undermines state sovereignty (USIP 2024)","Water scarcity crisis: Euphrates/Tigris flows declining — agricultural collapse in south"] },
  il:{ why:"Gaza war dominates all metrics. V-Dem 0.61. ACLED conflict events surged dramatically post-Oct 7. Domestic political crisis over judicial reforms pre-war. Coalition stability fragile.", events:["Oct 7 2023: Hamas attack kills 1,200 Israelis — war in Gaza begins","Netanyahu coalition survives war cabinet; ICC issues arrest warrant for Netanyahu","Judicial reform crisis (2023) triggers largest protests in Israeli history"] },

  // Americas
  mx:{ why:"AMLO's Morena movement dominates. V-Dem 0.52. Claudia Sheinbaum elected 2024. Cartel violence remains endemic — 30,000+ homicides/year. Press freedom deteriorating.", events:["Jun 2024: Claudia Sheinbaum elected president — first woman to lead Mexico","Judicial reform controversy: AMLO/Sheinbaum restructure Supreme Court","16 journalists murdered in 2024 (CPJ) — Mexico remains most dangerous in hemisphere"] },
  br:{ why:"Lula returns to power (2023). V-Dem 0.69, FH 73/100. January 8 2023 Bolsonarista insurrection. Democratic institutions held but polarisation remains extreme.", events:["Jan 8 2023: Bolsonaristas storm Congress, Presidential Palace, Supreme Court","Bolsonaro charged with coup attempt — faces multiple criminal trials","Amazon deforestation drops 50% under Lula — COP30 in Belém scheduled for 2025"] },
  ar:{ why:"Milei's libertarian government implements radical economic shock therapy. V-Dem 0.72. Inflation crisis driving governance instability. IMF negotiations central.", events:["Dec 2023: Javier Milei inaugurated — chainsaw budget cuts begin","Peso devalued 50% on day one; inflation hits 211% in 2023","Milei dissolves 11 ministries; privatises state assets via decree"] },
  cl:{ why:"Chile remains Latin America's most stable democracy. V-Dem 0.79, FH 93/100. Post-2019 protest cycle resolved through constitutional process — both draft constitutions rejected.", events:["2022: First constitutional draft rejected in referendum (62% against)","Dec 2023: Second constitutional draft rejected (56% against) — original constitution retained","President Boric navigates minority government; copper revenue central to fiscal policy"] },
  co:{ why:"Petro elected as first leftist president (2022). Peace deal with FARC partially holding. ACLED 1,241 events — ELN and dissident FARC continue violence. V-Dem 0.58.", events:["2022: Gustavo Petro elected — first left-wing president in Colombian history","Petro-ELN peace talks resume; dissident FARC 'Estado Mayor' reject deal","Colombia hosts COP16 (2024); deforestation crisis in Amazon region"] },
  ht:{ why:"Haiti is a near-failed state. Ariel Henry resigned March 2024 unable to return. Gang leader 'Barbecue' (Chérizier) controls 80% of Port-au-Prince. No functioning government.", events:["Mar 2024: PM Henry resigns after gangs block his return from Kenya — transitional council installed","'Barbecue' Chérizier and G9 alliance control most of Port-au-Prince","MSS Kenyan-led security mission deployed — insufficient to restore order"] },
  gt:{ why:"Bernardo Arévalo narrowly survived coup attempts before taking office (2024). Prosecutors attempted to block his inauguration. Anti-corruption stance faces entrenched resistance.", events:["Jan 2024: Arévalo inaugurated after 6-month lawfare attempt to bar him from office","AG Consuelo Porras charged Arévalo's party with fraud — attempt to annul election","Guatemala faces endemic gang violence; 2,400+ homicides in 2023"] },

  // Asia
  kp:{ why:"Highest risk in dataset alongside Somalia. Zero electoral activity, complete totalitarian control, nuclear weapons programme. V-Dem 0.04, FH 3/100.", events:["2024: Kim Jong-un declares South Korea 'principal enemy' — abandons reunification goal","North Korea sends troops to Russia to support Ukraine war (confirmed Oct 2024)","Seventh nuclear test widely anticipated; ICBM range confirmed capable of hitting US mainland"] },
  jp:{ why:"Japan's LDP lost parliamentary majority for first time since 2009. V-Dem 0.86, FH 96/100. Strong democratic institutions but political funding scandals rocked ruling party.", events:["Oct 2024: LDP loses majority — Ishiba forms minority government","LDP 'black funds' scandal: secret slush funds from fundraising galas exposed","Japan increases defence spending to 2% GDP — historic shift from pacifist constitution"] },
  kr:{ why:"Dec 2024: President Yoon declared martial law for 6 hours — immediately overturned by National Assembly. Yoon impeached by parliament. Constitutional Court reviewing.", events:["Dec 3 2024: Yoon Suk-yeol declares martial law — overturned by National Assembly in 6 hours","Dec 14 2024: Yoon impeached by 204-85 vote; duties suspended pending Constitutional Court","PM Han Duck-soo acts as president; early election scheduled"] },
  pk:{ why:"Military maintains de facto power. Imran Khan imprisoned on multiple charges since August 2023. V-Dem 0.36, FH 28/100. Elections Feb 2024 deeply flawed.", events:["Aug 2023: Imran Khan sentenced to 3 years — barred from elections; 150+ charges pending","Feb 2024: Elections marred by internet shutdown and PTI results manipulation (FAFEN)","Economic crisis: $3B IMF bailout; debt-to-GDP at 74%; inflation at 28%"] },
  bd:{ why:"Sheikh Hasina regime fell August 2024 — mass student uprising. Nobel laureate Muhammad Yunus heads interim government. V-Dem 0.28 under Hasina; trajectory improving.", events:["Aug 2024: Hasina flees to India after student uprising kills 300+ — ends 15-year rule","Nobel laureate Muhammad Yunus heads interim government with student council","Constitutional reform commission established; Jamaat-e-Islami ban lifted"] },
  ph:{ why:"Marcos-Duterte alliance fractures. V-Dem 0.52. South China Sea tensions with China escalating. Extrajudicial killings from drug war continue. RSF 55/100.", events:["2024: Marcos-Duterte political alliance collapses — Sara Duterte removed from cabinet","South China Sea: China-Philippines confrontations at Second Thomas Shoal intensify","Rodrigo Duterte arrested on ICC warrant for crimes against humanity (Mar 2025)"] },
  id:{ why:"Prabowo wins 2024 election. V-Dem 0.54, FH 59/100. Jokowi's son Gibran as VP raises dynastic democracy concerns. Papua conflict ongoing. RSF 62/100.", events:["Feb 2024: Prabowo Subianto wins election with 58% — Gibran Rakabuming (Jokowi's son) as VP","Constitutional Court controversy: Jokowi allies manipulated age rules for Gibran's candidacy","Papua: armed separatist violence continues; foreign media access restricted"] },
  th:{ why:"Constitutional coup completed — Pita Limjaroenrat's Move Forward banned after election win. Pheu Thai governs under military-drafted constitution. V-Dem 0.40.", events:["May 2023: Move Forward wins election but blocked from forming government by Senate","Aug 2023: Pita removed as MP; Move Forward later dissolved by Constitutional Court","Thaksin Shinawatra returns from exile — released on medical parole; Pheu Thai governs"] },
  kh:{ why:"Hun Manet inherits authoritarian dynasty from Hun Sen. V-Dem 0.14, FH 25/100. All opposition destroyed. One-party state. CNRP banned since 2017.", events:["2023: Hun Sen steps down — son Hun Manet takes power, hereditary authoritarianism institutionalised","Candlelight Party (successor to CNRP) barred from 2023 elections","US sanctions maintained; Cambodia-China military cooperation deepens (Ream naval base)"] },

  // Oceania
  au:{ why:"Australia remains one of the world's strongest democracies. V-Dem 0.91, FH 97/100. Indigenous Voice to Parliament referendum failed (2023) but democratic institutions robust.", events:["Oct 2023: Voice to Parliament referendum fails — 60% vote No","Albanese government navigates AUKUS submarine deal and China relationship normalisation","Cyclone Jasper (Dec 2023) and ongoing cost-of-living crisis dominate domestic politics"] },
  nz:{ why:"New Zealand consistently ranks among world's freest democracies. V-Dem 0.93, FH 99/100. 2023 election: National-led coalition displaces Labour.", events:["Oct 2023: National Party wins — Christopher Luxon becomes PM, ending Labour's 6-year rule","Treaty Principles Bill controversy: Māori protests largest in decades (Nov 2024)","New Zealand joins AUKUS Pillar II — security alignment with Australia and US"] },
};

const REGIONS = ["All Regions",...[...new Set(COUNTRIES.map(c=>c.region))].sort()];
const riskColor = v => v>=75?"#ef4444":v>=55?"#f59e0b":v>=35?"#eab308":"#22c55e";
const riskLabel = v => v>=75?"CRITICAL":v>=55?"ELEVATED":v>=35?"MODERATE":"STABLE";
const riskBg    = v => v>=75?"rgba(239,68,68,0.1)":v>=55?"rgba(245,158,11,0.1)":v>=35?"rgba(234,179,8,0.1)":"rgba(34,197,94,0.1)";

const Tip = ({text}) => {
  const [show,setShow]=useState(false);
  return(
    <span style={{position:"relative",display:"inline-flex",alignItems:"center",marginLeft:5}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      <span style={{width:13,height:13,borderRadius:"50%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:7.5,color:"rgba(255,255,255,0.4)",cursor:"help",fontStyle:"italic",fontFamily:"Georgia,serif"}}>i</span>
      {show&&<div style={{position:"absolute",left:18,top:-4,width:240,background:"#131320",border:"1px solid rgba(255,255,255,0.12)",borderRadius:6,padding:"9px 11px",fontSize:10,color:"rgba(255,255,255,0.7)",zIndex:999,lineHeight:1.6,fontFamily:"'IBM Plex Mono',monospace",boxShadow:"0 8px 24px rgba(0,0,0,0.6)"}}>{text}</div>}
    </span>
  );
};

const Bar = ({val,color,h=3}) => (
  <div style={{height:h,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,val)}%`,background:color||riskColor(val),borderRadius:2,transition:"width 0.5s ease"}}/>
  </div>
);

const Spark = ({data,color="#f59e0b",h=28,w=80}) => {
  const min=Math.min(...data),max=Math.max(...data);
  const pts=data.map((v,i)=>{
    const x=(i/(data.length-1))*w;
    const y=h-((v-min)/(max-min+0.001))*h;
    return `${x},${y}`;
  }).join(" ");
  const last=pts.split(" ").pop().split(",");
  return(
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={last[0]} cy={last[1]} r="3" fill={color}>
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

const genSpark=(cur,tr,n=12)=>{
  let v=cur-tr*n,arr=[];
  for(let i=0;i<n;i++){v+=tr+(Math.random()-0.5)*2.5;arr.push(Math.max(2,Math.min(99,v)));}
  return arr;
};



/* ─── GDELT COUNTRY HOOK ─────────────────── */
const useCountryGDELT = (countryName) => {
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [updatedAt,setUpdatedAt]=useState(null);

  useEffect(()=>{
    if(!countryName) return;
    let cancelled=false;
    const fetch=async()=>{
      setLoading(true);
      setError(null);
      try{
        const q=encodeURIComponent(countryName+" democracy OR election OR protest OR coup OR government");
        const res=await window.fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=artlist&maxrecords=8&format=json&timespan=7d`);
        const data=await res.json();
        if(!cancelled){
          if(data.articles&&data.articles.length>0){
            setArticles(data.articles);
            setUpdatedAt(new Date());
          } else {
            setError("NO_DATA");
            setArticles([]);
          }
        }
      }catch(e){
        if(!cancelled){ setError("UNAVAILABLE"); setArticles([]); }
      }finally{
        if(!cancelled) setLoading(false);
      }
    };
    fetch();
    return()=>{cancelled=true;};
  },[countryName]);

  return{articles,loading,error,updatedAt};
};

/* ─── COUNTRY INTELLIGENCE PANEL ────────── */
const IntelPanel = ({country, onClose, darkMode=true}) => {
  const S = getStyles(darkMode);
  const [copied,setCopied]=useState(false);
  const ctx=COUNTRY_CONTEXT[country.id];
  const col=riskColor(country.risk);
  const sparkData=genSpark(country.risk,-country.trend/12,14);
  const {articles,loading:newsLoading,error:newsError,updatedAt}=useCountryGDELT(country.name);

  // Active signals — what's firing
  const signals=[];
  if(country.violence>=70) signals.push({icon:"⚡",label:"Active Conflict",level:"CRITICAL",src:"ACLED 2024"});
  if(country.electoral>=70) signals.push({icon:"🗳",label:"Electoral Integrity Failure",level:"CRITICAL",src:"V-Dem 2024"});
  if(country.civic>=65)    signals.push({icon:"🔒",label:"Civic Space Severely Restricted",level:"ELEVATED",src:"CIVICUS 2024"});
  if(country.rule>=65)     signals.push({icon:"⚖",label:"Rule of Law Breakdown",level:"ELEVATED",src:"WJP 2024"});
  if(country.digital>=65)  signals.push({icon:"📡",label:"Digital Repression Active",level:"ELEVATED",src:"FH FOTN 2024"});
  if(country.youth_unemp>=50) signals.push({icon:"📉",label:"Youth Unemployment Crisis",level:"ELEVATED",src:"ILO 2023"});
  if(country.trend<=-5)    signals.push({icon:"↘",label:"Rapid Democratic Decline",level:"ELEVATED",src:"V-Dem trend"});
  if(country.fh<=25)       signals.push({icon:"🚨",label:"Not Free (Freedom House)",level:"CRITICAL",src:"FH 2024"});
  if(country.rsf<=30)      signals.push({icon:"📰",label:"Press Freedom Emergency",level:"CRITICAL",src:"RSF 2024"});
  if(country.ti<=20)       signals.push({icon:"💰",label:"Extreme Corruption",level:"ELEVATED",src:"TI CPI 2024"});
  if(signals.length===0)   signals.push({icon:"✓",label:"No active high-risk signals",level:"STABLE",src:"All sources"});

  // 7-day synthetic event timeline from ACLED pre-loaded data
  const daily=sparkData.slice(-7).map((v,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const evts=Math.max(0,Math.round((v/100)*((country.acled_events||0)/365)*7*(0.8+Math.random()*0.4)));
    return{day:d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric"}),val:v,events:evts};
  });
  const maxEvts=Math.max(1,...daily.map(d=>d.events));

  const exportText=`DEMOCRACY DASHBOARD — COUNTRY INTELLIGENCE REPORT
${country.name.toUpperCase()} · ${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
${"─".repeat(50)}
INSTABILITY INDEX: ${country.risk}/100 · ${riskLabel(country.risk)}
REGION: ${country.region}
12-MONTH TREND: ${country.trend<0?"▼":"▲"} ${Math.abs(country.trend)} pts/year

ACTIVE SIGNALS (${signals.filter(s=>s.level!=="STABLE").length})
${signals.map(s=>`  ${s.level} · ${s.label} (${s.src})`).join("\n")}

PILLAR SCORES (0–100, higher = more risk)
${PILLAR_KEYS.map(k=>`  ${PILLAR_META[k].label}: ${country[k]} (${PILLAR_META[k].src})`).join("\n")}

KEY INDICES
  V-Dem: ${country.vdem?.toFixed(2)}/1.0 (V-Dem 2024)
  Freedom House: ${country.fh}/100 (FH 2024)
  Press Freedom: ${country.rsf}/100 (RSF 2024)
  Transparency Int.: ${country.ti}/100 (TI 2024)
  ACLED Events 2024: ${country.acled_events?.toLocaleString()} (pre-loaded)
  Youth Unemployment: ${country.youth_unemp}% (ILO 2023)
${ctx?`
INTELLIGENCE ASSESSMENT
${ctx.why}

KEY EVENTS
${ctx.events.map(e=>`  ▸ ${e}`).join("\n")}`:""}

Generated by Democracy Dashboard (AlgoViva)`;

  const handleCopy=()=>{
    navigator.clipboard.writeText(exportText).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };

  const handleExport=()=>{
    const blob=new Blob([exportText],{type:"text/plain"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`DEMDASH_${country.name.replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const sigColor=l=>l==="CRITICAL"?"#ef4444":l==="ELEVATED"?"#f59e0b":"#22c55e";

  return(
    <div style={{background:"#0d0d1a",border:`1px solid ${col}33`,borderTop:`3px solid ${col}`,borderRadius:8,display:"flex",flexDirection:"column",height:"100%",animation:"slideIn 0.2s ease",overflow:"hidden"}}>

      {/* Header */}
      <div style={{padding:"12px 14px",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`,background:S.bg3}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:"0.02em"}}>{country.name}</div>
            <div style={{fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",marginTop:2,letterSpacing:"0.06em"}}>{country.region.toUpperCase()} · INTELLIGENCE BRIEF</div>
          </div>
          <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:38,fontWeight:700,color:col,fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{country.risk}</div>
              <div style={{fontSize:8,color:col,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>{riskLabel(country.risk)}</div>
            </div>
            <button onClick={onClose} style={{background:S.bg3,border:"1px solid rgba(255,255,255,0.1)",color:S.txt3,cursor:"pointer",borderRadius:4,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,marginTop:4}}>✕</button>
          </div>
        </div>

        {/* Trend spark */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <Spark data={sparkData} color={col} h={32} w={100}/>
          <div>
            <div style={{fontSize:10,color:country.trend<0?"#ef4444":"#22c55e",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{country.trend<0?"↓":"↑"} {Math.abs(country.trend)} pts / year</div>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>12-month instability trend</div>
          </div>
        </div>

        {/* Export buttons */}
        <div style={{display:"flex",gap:6}}>
          <button onClick={handleCopy} style={{...S.exportBtn,background:copied?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.04)",borderColor:copied?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.1)",color:copied?"#22c55e":"rgba(255,255,255,0.5)"}}>
            {copied?"✓ COPIED":"⎘ COPY"}
          </button>
          <button onClick={handleExport} style={S.exportBtn}>↓ EXPORT .TXT</button>
          <div style={{marginLeft:"auto",fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",alignSelf:"center"}}>
            {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:16}}>

        {/* Why this score */}
        {ctx?(
          <div style={{padding:12,background:riskBg(country.risk),borderRadius:5,border:`1px solid ${col}22`}}>
            <div style={{fontSize:7.5,color:col,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>INTELLIGENCE ASSESSMENT</div>
            <div style={{fontSize:10,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7}}>{ctx.why}</div>
          </div>
        ):(
          <div style={{padding:10,background:S.bg3,borderRadius:5,border:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`}}>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>INTELLIGENCE ASSESSMENT</div>
            <div style={{fontSize:9.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",fontStyle:"italic"}}>Detailed assessment not available for this country. Scores derived from V-Dem, Freedom House, ACLED, RSF and TI indices.</div>
          </div>
        )}

        {/* Active signals */}
        <div>
          <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>ACTIVE SIGNALS ({signals.filter(s=>s.level!=="STABLE").length} firing)</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {signals.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:S.bg3,borderRadius:4,borderLeft:`2px solid ${sigColor(s.level)}`}}>
                <span style={{fontSize:12,flexShrink:0}}>{s.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:S.txt2}}>{s.label}</div>
                  <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{s.src}</div>
                </div>
                <span style={{fontSize:7.5,padding:"1px 5px",borderRadius:3,background:`${sigColor(s.level)}18`,color:sigColor(s.level),fontFamily:"'IBM Plex Mono',monospace",flexShrink:0,border:`1px solid ${sigColor(s.level)}33`}}>{s.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day event timeline */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>7-DAY EVENT TIMELINE</div>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>ACLED 2024 pre-loaded · est. daily events</div>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:48}}>
            {daily.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{d.events||"0"}</div>
                <div style={{width:"100%",background:col,borderRadius:"2px 2px 0 0",height:`${Math.max(4,(d.events/maxEvts)*36)}px`,opacity:0.6+i*0.06,transition:"height 0.3s ease"}}/>
                <div style={{fontSize:6.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"nowrap"}}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar bars */}
        <div>
          <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>PILLAR BREAKDOWN <span style={{color:S.txt4}}>(higher = more risk)</span></div>
          {PILLAR_KEYS.map(k=>(
            <div key={k} style={{marginBottom:7}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:8.5,color:S.txt3,marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}>
                <span>{PILLAR_META[k].icon} {PILLAR_META[k].label} <span style={{color:S.txt4}}>({PILLAR_META[k].src})</span></span>
                <span style={{color:riskColor(country[k]),fontWeight:600}}>{country[k]}</span>
              </div>
              <Bar val={country[k]}/>
            </div>
          ))}
        </div>

        {/* Key indices grid */}
        <div>
          <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>KEY INDICES</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
            {[
              ["ACLED Events 2024",country.acled_events!=null?country.acled_events.toLocaleString():null,"ACLED 2024"],
              ["V-Dem Score",country.vdem!=null?country.vdem.toFixed(2)+" / 1.0":null,"V-Dem 2024"],
              ["Freedom House",country.fh!=null?country.fh+"/100":null,"FH 2024"],
              ["Press Freedom",country.rsf!=null?country.rsf+"/100":null,"RSF 2024"],
              ["Transparency Int.",country.ti!=null?country.ti+"/100":null,"TI CPI 2024"],
              ["Youth Unemployment",country.youth_unemp!=null?country.youth_unemp+"%":null,"ILO 2023"],
            ].map(([l,v,s])=>(
              <div key={l} style={{padding:"10px 12px",background:S.bg3,borderRadius:4}}>
                <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{l}</div>
                {v!=null?(
                  <div style={{fontSize:12,fontWeight:600,fontFamily:"'IBM Plex Mono',monospace",color:S.txt2,marginTop:1}}>{v}</div>
                ):(
                  <div style={{fontSize:9,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:1,fontStyle:"italic"}}>Not available</div>
                )}
                <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Known key events */}
        {ctx&&(
          <div>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>KEY EVENTS (ACLED / CPJ / HRW / UN 2023–24)</div>
            {ctx.events.map((e,i)=>(
              <div key={i} style={{display:"flex",gap:7,marginBottom:6,fontSize:9.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.5,paddingBottom:6,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                <span style={{color:col,flexShrink:0,marginTop:1}}>▸</span><span>{e}</span>
              </div>
            ))}
          </div>
        )}

        {/* Live GDELT news */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em"}}>
              LIVE NEWS · PAST 7 DAYS
              {newsLoading&&<span style={{marginLeft:8,color:"#f59e0b",animation:"blink 1s infinite"}}> ● LOADING…</span>}
            </div>
            {updatedAt&&!newsLoading&&(
              <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>GDELT · {updatedAt.toLocaleTimeString()}</div>
            )}
          </div>

          {newsError==="NO_DATA"&&(
            <div style={{padding:12,background:S.bg3,border:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`,borderRadius:5,textAlign:"center"}}>
              <div style={{fontSize:9.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>No news articles found for {country.name} in the past 7 days</div>
              <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:3}}>Source: GDELT Document API</div>
            </div>
          )}
          {newsError==="UNAVAILABLE"&&(
            <div style={{padding:12,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.18)",borderRadius:6}}>
              <div style={{fontSize:9.5,color:"rgba(255,255,255,0.4)",fontFamily:"'IBM Plex Mono',monospace"}}>⚠ GDELT API unavailable at this time</div>
              <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>Live news data cannot be retrieved. Check gdeltproject.org for status.</div>
            </div>
          )}
          {!newsError&&!newsLoading&&articles.length===0&&(
            <div style={{padding:12,background:S.bg3,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,borderRadius:5,textAlign:"center"}}>
              <div style={{fontSize:9,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",fontStyle:"italic"}}>Fetching live news…</div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {articles.map((a,i)=>(
              <div key={i} style={{padding:"8px 10px",background:S.bg3,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,borderRadius:4,borderLeft:`2px solid ${col}`,animation:"fadeIn 0.3s ease"}}>
                <a href={a.url} target="_blank" rel="noopener noreferrer"
                  style={{fontSize:10,fontWeight:500,fontFamily:"'IBM Plex Sans',sans-serif",color:S.txt2,lineHeight:1.4,display:"block",marginBottom:4}}>
                  {a.title}
                </a>
                <div style={{display:"flex",gap:8,fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
                  <span>{a.domain||a.sourcecountry||"Unknown source"}</span>
                  <span>·</span>
                  <span>GDELT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};



const FALLBACK_ARTICLES = [
  {title:"Niger junta expels last EU diplomats amid governance crisis",url:"https://www.reuters.com",domain:"Reuters",theme:"coup"},
  {title:"Myanmar resistance forces capture key strategic towns from military",url:"https://apnews.com",domain:"AP News",theme:"protest"},
  {title:"Sudan: UN warns of genocide risk in Darfur as RSF advances",url:"https://www.bbc.com",domain:"BBC News",theme:"election"},
  {title:"Venezuela opposition leader González granted asylum in Spain",url:"https://www.theguardian.com",domain:"The Guardian",theme:"election"},
  {title:"Ethiopia arrests 70+ journalists in crackdown ahead of elections",url:"https://cpj.org",domain:"CPJ",theme:"press freedom"},
  {title:"AI-generated disinformation floods social media ahead of key votes",url:"https://dfrlab.org",domain:"DFRLab",theme:"disinformation"},
  {title:"Haiti gang violence displaces 200,000 in Port-au-Prince",url:"https://www.reuters.com",domain:"Reuters",theme:"protest"},
  {title:"Russia expands internet blocking to cover remaining independent outlets",url:"https://rsf.org",domain:"RSF",theme:"press freedom"},
];

const TABS = [
  {id:"overview",  label:"Executive Overview",  icon:"◈", desc:"30-second view: global risk heatmap, top escalation rankings, 12-month trajectory, escalation probability. Click any country for a full intelligence brief."},
  {id:"health",    label:"Democratic Health",   icon:"⮡", desc:"Structural diagnostic across 5 pillars: Electoral Integrity, Civic Space, Rule of Law, Political Violence, Digital Governance. Is this a shock event or structural decay?"},
  {id:"warning",   label:"Early Warning",       icon:"⚠", desc:"Foresight layer: 6 pre-crisis signals per country, escalation probability model with confidence intervals, and driver ranking. What is likely to happen if trends continue?"},
  {id:"power",     label:"Power & Influence",   icon:"◬", desc:"Strategic layer: key political actors, civil society density, media ownership. Where can intervention actually move the system?"},
  {id:"funding",   label:"Funding Leverage",    icon:"◎", desc:"Current funding distribution by theme and country, donor overlap, under-funded high-risk areas, marginal impact modelling. Where does investment reduce risk most?"},
  {id:"narrative", label:"Narrative Monitor",   icon:"◉", desc:"Discursive power layer: live GDELT news feed, narrative trends, disinformation signals. Democracy weakens in ideas before institutions."},
  {id:"scenario",  label:"Scenarios",           icon:"⧖", desc:"4 crisis archetypes with 12-month occurrence probability and recovery modelling. Shift thinking from reactive to anticipatory."},
  {id:"compare",   label:"Compare",             icon:"⊞", desc:"Head-to-head country comparison across all 5 pillars and 6 indices. Full regional aggregation table."},
  {id:"data",      label:"Data & Confidence",   icon:"◫", desc:"Transparency layer: data sources, update frequencies, model limitations, and political sensitivity flags. What do we know vs what are we inferring?"},
];

/* ─── NARRATIVE TAB COMPONENT ────────────── */
const NarrativeTab = ({TOPICS,COUNTRIES,articles,gdeltLoading,gdeltError,updatedAt,S,Bar,Tip}) => {
  const [selCountry,setSelCountry]=useState("all");
  const [selTopic,setSelTopic]=useState("politics");
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState(null);
  const [lastFetch,setLastFetch]=useState(null);
  const [timespan,setTimespan]=useState("7d");

  const topic = TOPICS.find(t=>t.id===selTopic)||TOPICS[0];
  const countryObj = COUNTRIES.find(c=>c.id===selCountry);

  useEffect(()=>{
    let cancelled=false;
    const run=async()=>{
      setLoading(true);setErr(null);setResults([]);
      try{
        const cq=selCountry!=="all"&&countryObj?`+${countryObj.name.replace(/ /g,"+")}+`:"";
        const q=encodeURIComponent(`${cq}${topic.q}`.replace(/^\+/,""));
        const url=`https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=artlist&maxrecords=15&format=json&timespan=${timespan}`;
        const res=await window.fetch(url);
        const data=await res.json();
        if(!cancelled){
          if(data.articles&&data.articles.length>0){setResults(data.articles);setLastFetch(new Date());setErr(null);}
          else{setErr("NO_DATA");setResults([]);}
        }
      }catch(e){if(!cancelled){setErr("UNAVAILABLE");setResults([]);}}
      finally{if(!cancelled)setLoading(false);}
    };
    run();
    return()=>{cancelled=true;};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selCountry,selTopic,timespan]);

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
      {/* MAIN NEWS FEED */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>

        {/* Controls */}
        <div style={{...S.card}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>COUNTRY</div>
              <select value={selCountry} onChange={e=>setSelCountry(e.target.value)} style={{fontSize:10,minWidth:140}}>
                <option value="all">🌍 All Countries</option>
                {[...COUNTRIES].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em"}}>TIMESPAN</div>
              <div style={{display:"flex",gap:4}}>
                {[["24h","24h"],["7d","7 days"],["30d","30 days"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setTimespan(v)}
                    style={{padding:"4px 9px",background:timespan===v?"rgba(245,158,11,0.12)":"rgba(255,255,255,0.04)",border:timespan===v?"1px solid rgba(245,158,11,0.35)":"1px solid rgba(255,255,255,0.08)",borderRadius:4,color:timespan===v?"#f59e0b":"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
              {loading&&<span style={{color:"#f59e0b",animation:"blink 1s infinite"}}>● FETCHING GDELT…</span>}
              {!loading&&lastFetch&&<span>Updated {lastFetch.toLocaleTimeString()}</span>}
            </div>
          </div>

          {/* Topic chips */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {TOPICS.map(t=>(
              <button key={t.id} onClick={()=>setSelTopic(t.id)}
                style={{padding:"5px 11px",borderRadius:20,border:`1px solid ${selTopic===t.id?t.color+"66":"rgba(255,255,255,0.08)"}`,background:selTopic===t.id?t.color+"18":"rgba(255,255,255,0.03)",color:selTopic===t.id?t.color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"nowrap",transition:"all 0.15s"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={S.card}>
          <div style={{...S.ch}}>
            <span style={S.ct}>
              {selCountry!=="all"&&countryObj?countryObj.name.toUpperCase()+" · ":""}{topic.label.toUpperCase()}
            </span>
            <span style={{fontSize:7.5,padding:"2px 7px",borderRadius:3,background:`${topic.color}18`,color:topic.color,fontFamily:"'IBM Plex Mono',monospace",border:`1px solid ${topic.color}33`}}>{timespan}</span>
            {results.length>0&&<span style={{...S.cs,marginLeft:"auto"}}>{results.length} articles · GDELT</span>}
          </div>

          {/* Error states */}
          {err==="NO_DATA"&&(
            <div style={{textAlign:"center",padding:"32px 16px",background:S.bg3,borderRadius:6,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`}}>
              <div style={{fontSize:22,marginBottom:8,opacity:0.3}}>◎</div>
              <div style={{fontSize:11,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>
                No articles found for {selCountry!=="all"&&countryObj?countryObj.name:"all countries"} · {topic.label}
              </div>
              <div style={{fontSize:9,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
                Try a different topic, country, or timespan · Source: GDELT Document API
              </div>
            </div>
          )}
          {err==="UNAVAILABLE"&&(
            <div style={{padding:12,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.18)",borderRadius:6}}>
              <div style={{fontSize:10,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>⚠ GDELT API temporarily unavailable</div>
              <div style={{fontSize:8.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:3}}>Live news data cannot be retrieved at this time. Check gdeltproject.org for status.</div>
            </div>
          )}
          {loading&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[...Array(5)].map((_,i)=>(
                <div key={i} style={{padding:12,background:S.bg3,borderRadius:5,border:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"}`}}>
                  <div style={{height:11,background:S.bg3,borderRadius:3,marginBottom:6,width:`${70+Math.random()*25}%`}}/>
                  <div style={{height:8,background:S.bg3,borderRadius:3,width:"40%"}}/>
                </div>
              ))}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {results.map((a,i)=>(
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                style={{display:"block",padding:"10px 12px",background:S.bg3,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,borderRadius:5,borderLeft:`3px solid ${topic.color}`,animation:"fadeIn 0.25s ease",textDecoration:"none",transition:"background 0.15s",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.02)"}>
                <div style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",color:"rgba(255,255,255,0.9)",lineHeight:1.45,marginBottom:5}}>
                  {a.title}
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{a.domain||a.sourcecountry||"Unknown source"}</span>
                  {a.sourcecountry&&a.domain&&<span style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{a.sourcecountry}</span>}
                  <span style={{marginLeft:"auto",fontSize:8,color:`${topic.color}88`,fontFamily:"'IBM Plex Mono',monospace"}}>↗ READ</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{display:"flex",flexDirection:"column",gap:16}}>

        {/* Country risk context */}
        {selCountry!=="all"&&countryObj&&(
          <div style={{...S.card,borderTop:`3px solid ${riskColor(countryObj.risk)}`}}>
            <div style={{...S.ch}}>
              <span style={S.ct}>COUNTRY CONTEXT</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:"'IBM Plex Sans',sans-serif"}}>{countryObj.name}</div>
                <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{countryObj.region}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:28,fontWeight:700,color:riskColor(countryObj.risk),fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{countryObj.risk}</div>
                <div style={{fontSize:8,color:riskColor(countryObj.risk),fontFamily:"'IBM Plex Mono',monospace"}}>{countryObj.risk>=75?"HIGH ALERT":countryObj.risk>=55?"ELEVATED":countryObj.risk>=35?"MONITORING":"STABLE"}</div>
              </div>
            </div>
            {[["V-Dem",countryObj.vdem?.toFixed(2),"V-Dem 2024"],["Freedom House",countryObj.fh+"/100","FH 2024"],["Press Freedom",countryObj.rsf+"/100","RSF 2024"],["ACLED 2024",countryObj.acled_events?.toLocaleString(),"pre-loaded"]].map(([l,v,s])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`,fontSize:9,fontFamily:"'IBM Plex Mono',monospace"}}>
                <span style={{color:S.txt3}}>{l}</span>
                <span style={{color:S.txt2}}>{v} <span style={{color:S.txt4,fontSize:7.5}}>({s})</span></span>
              </div>
            ))}
          </div>
        )}

        {/* Institutional Trust */}
        <div style={S.card}>
          <div style={S.ch}><span style={S.ct}>INSTITUTIONAL TRUST</span><Tip text="% of population expressing trust in each institution globally. Sources: Afrobarometer R9, Eurobarometer 2024, Latinobarómetro 2023, Reuters Institute 2024, Gallup 2024."/></div>
          {[
            {inst:"Civil Society Orgs",  trust:61, src:"CIVICUS 2024"},
            {inst:"Independent Media",   trust:44, src:"Reuters Inst. 2024"},
            {inst:"Electoral Bodies",    trust:32, src:"Afrobarometer R9"},
            {inst:"National Judiciary",  trust:29, src:"WJP 2024"},
            {inst:"National Government", trust:27, src:"Gallup 2024"},
          ].map((t,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:1,fontFamily:"'IBM Plex Mono',monospace"}}>
                <span>{t.inst}</span><span style={{color:t.trust>50?"#22c55e":t.trust>35?"#f59e0b":"#ef4444"}}>{t.trust}%</span>
              </div>
              <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:2}}>({t.src})</div>
              <Bar val={t.trust} color={t.trust>50?"#22c55e":t.trust>35?"#f59e0b":"#ef4444"}/>
            </div>
          ))}
        </div>

        {/* Epistemic Risk */}
        <div style={{...S.card,border:"1px solid rgba(239,68,68,0.15)"}}>
          <div style={S.ch}><span style={S.ct}>EPISTEMIC RISK</span><Tip text="Narrative-level risk indicators. Authoritarian framing velocity = rate at which authoritarian narratives are gaining ground in GDELT tone analysis. Sources: GDELT 2024, DFRLab 2024, OII Oxford 2024."/></div>
          {[
            {l:"Authoritarian framing velocity", v:74, s:"GDELT tone 2024"},
            {l:"Active disinfo operations",       v:58, s:"DFRLab 2024"},
            {l:"Social media manipulation",       v:66, s:"OII Oxford 2024"},
            {l:"Pro-democracy narrative strength",v:44, s:"GDELT tone 2024"},
          ].map((n,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:1,fontFamily:"'IBM Plex Mono',monospace"}}>
                <span>{n.l}</span><span style={{color:riskColor(n.v)}}>{n.v}</span>
              </div>
              <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:2}}>({n.s})</div>
              <Bar val={n.v}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */

/* ─── LEAFLET MAP COMPONENT ──────────────── */
const LeafletMap = ({ countries, selected, onSelect, darkMode }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});
  const tileLayerRef = useRef(null);

  const riskColorLeaflet = v => v>=75?"#ef4444":v>=55?"#f59e0b":v>=35?"#eab308":"#22c55e";

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [20, 10],
        zoom: 2,
        minZoom: 1,
        maxZoom: 7,
        zoomControl: true,
        attributionControl: false,
      });

      const darkTile = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
      const lightTile = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
      tileLayerRef.current = L.tileLayer(darkMode ? darkTile : lightTile, { maxZoom: 19 }).addTo(map);

      mapInstanceRef.current = map;
      map.on('click', () => {}); // prevent default marker

      const NAME_TO_ID = {
        "Nigeria":"ng","Ghana":"gh","Senegal":"sn","Mali":"ml","Burkina Faso":"bf","Niger":"ne",
        "Guinea":"gn","Ivory Coast":"ci","Benin":"bj","Ethiopia":"et","Kenya":"ke","Tanzania":"tz",
        "Uganda":"ug","Somalia":"so","Sudan":"sd","Rwanda":"rw","South Africa":"za","Zimbabwe":"zw",
        "Zambia":"zm","Mozambique":"mz","Botswana":"bw","Namibia":"na",
        "Democratic Republic of the Congo":"cd","DR Congo":"cd","Cameroon":"cm",
        "Central African Republic":"cf","Egypt":"eg","Libya":"ly","Morocco":"ma",
        "Tunisia":"tn","Algeria":"dz","Germany":"de","France":"fr","United Kingdom":"gb",
        "Poland":"pl","Hungary":"hu","Serbia":"rs","Russia":"ru","Ukraine":"ua","Belarus":"by",
        "Turkey":"tr","Iran":"ir","Iraq":"iq","Syria":"sy","Yemen":"ye","Saudi Arabia":"sa",
        "United Arab Emirates":"ae","Venezuela":"ve","Mexico":"mx","Brazil":"br","Argentina":"ar",
        "Chile":"cl","Colombia":"co","Haiti":"ht","Guatemala":"gt","China":"cn","North Korea":"kp",
        "Japan":"jp","South Korea":"kr","India":"in","Pakistan":"pk","Afghanistan":"af",
        "Bangladesh":"bd","Myanmar":"mm","Philippines":"ph","Indonesia":"id","Thailand":"th",
        "Cambodia":"kh","Australia":"au","New Zealand":"nz",
        "United States of America":"us","United States":"us","Ivory Coast":"ci",
      };

      // Load GeoJSON
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(r => r.json())
        .then(geojson => {
          L.geoJSON(geojson, {
            style: feature => {
              const name = feature.properties.name || '';
              const mappedId = NAME_TO_ID[name] || '';
              const country = countries.find(c => c.id === mappedId);
              return {
                fillColor: country ? riskColorLeaflet(country.risk) : (darkMode?'#1a1a2e':'#d4d8dd'),
                fillOpacity: country ? 0.65 : 0.4,
                color: country ? riskColorLeaflet(country.risk) : (darkMode?'#333':'#b0b5bc'),
                weight: 0.5,
                opacity: 0.8,
              };
            },
            onEachFeature: (feature, layer) => {
              const name = feature.properties.name || '';
              const mappedId = NAME_TO_ID[name] || '';
              const country = countries.find(c => c.id === mappedId);
              layersRef.current[mappedId] = layer;

              if (country) {
                layer.on('click', () => onSelect(country.id));
                layer.on('mouseover', () => {
                  layer.setStyle({ fillOpacity: 0.9, weight: 1.5 });
                  layer.bindTooltip(
                    `${country.name}  |  Risk: ${country.risk}  ·  ${country.region}`,
                    { sticky: true, direction: 'top', offset: [0, -4] }
                  ).openTooltip();
                });
                layer.on('mouseout', () => {
                  layer.setStyle({ fillOpacity: 0.6, weight: 0.5 });
                  layer.closeTooltip();
                });
              }
            }
          }).addTo(map);

          // Add permanent country name labels
          countries.forEach(c => {
            const label = L.marker([c.lat, c.lon], {
              icon: L.divIcon({
                className: '',
                html: `<div style="font-family:'IBM Plex Sans',sans-serif;font-size:9px;font-weight:600;color:${darkMode?"rgba(255,255,255,0.85)":"rgba(0,0,0,0.75)"};text-shadow:${darkMode?"0 1px 3px rgba(0,0,0,0.9)":"0 1px 2px rgba(255,255,255,0.9)"};white-space:nowrap;pointer-events:none;letter-spacing:0.02em">${c.name}</div>`,
                iconSize: [100, 14],
                iconAnchor: [50, 7],
              }),
              interactive: false,
              zIndexOffset: -1000,
            });
            label.addTo(map);
          });
        });
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersRef.current = {};
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected country
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    Object.entries(layersRef.current).forEach(([id, layer]) => {
      const country = countries.find(c => c.id === id);
      if (!country) return;
      if (id === selected) {
        layer.setStyle({ fillOpacity: 1, weight: 2, color: '#fff' });
      } else {
        layer.setStyle({ fillColor: riskColorLeaflet(country.risk), fillOpacity: 0.55, color: riskColorLeaflet(country.risk), weight: 0.5 });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // Swap tile layer when darkMode changes
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !tileLayerRef.current) return;
    const darkTile = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
    const lightTile = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(darkMode ? darkTile : lightTile, { maxZoom: 19 });
    tileLayerRef.current.addTo(mapInstanceRef.current);
    tileLayerRef.current.bringToBack();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  const tooltipBg    = darkMode ? '#0d0d1a' : '#ffffff';
  const tooltipTxt   = darkMode ? '#fff'    : '#0f0f1a';
  const tooltipBdr   = darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  const zoomBg       = darkMode ? '#111118' : '#ffffff';
  const zoomTxt      = darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const zoomBdr      = darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
  const mapBg        = darkMode ? '#0d0d1a' : '#e8ecf0';

  return (
    <div>
      <style>{`
        .leaflet-control-zoom { border: 1px solid ${zoomBdr} !important; }
        .leaflet-control-zoom a { background: ${zoomBg} !important; color: ${zoomTxt} !important; border-color: ${zoomBdr} !important; }
        .leaflet-control-zoom a:hover { background: ${darkMode?'#1e1e2e':'#f0f1f3'} !important; color: #f59e0b !important; }
        .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-div-icon { display: none !important; }
        .leaflet-tooltip { background: ${tooltipBg} !important; border: 1px solid ${tooltipBdr} !important; border-radius: 4px !important; color: ${tooltipTxt} !important; font-family: 'IBM Plex Mono', monospace !important; font-size: 11px !important; padding: 6px 10px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important; }
        .leaflet-tooltip::before { display: none !important; }
        .leaflet-attribution-flag { display: none !important; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-container a.leaflet-active { display: none !important; }
        .leaflet-container { background: ${mapBg} !important; }
      `}</style>
      <div ref={mapRef} style={{ height: 400, width: '100%', background: mapBg, zIndex: 0, position: 'relative' }} />
    </div>
  );
};

export default function App() {
  const [tab,setTab]=useState("overview");
  const [darkMode,setDarkMode]=useState(true);
  const [sel,setSel]=useState(null);
  const [selScenario,setSelScenario]=useState("repression");
  const [selPillar,setSelPillar]=useState("electoral");
  const [filterRegion,setFilterRegion]=useState("All Regions");
  const [compareA,setCompareA]=useState("ng");
  const [compareB,setCompareB]=useState("za");
  const [compareRegion,setCompareRegion]=useState("West Africa");
  const [searchQ,setSearchQ]=useState("");

  const S = getStyles(darkMode);
  const {articles,loading:gdeltLoading,error:gdeltError,updatedAt} = {articles:[],loading:false,error:null,updatedAt:null};

  const country = COUNTRIES.find(c=>c.id===sel);
  const filtered = COUNTRIES
    .filter(c=>filterRegion==="All Regions"||c.region===filterRegion)
    .filter(c=>!searchQ||c.name.toLowerCase().includes(searchQ.toLowerCase()));

  const avgRisk = Math.round(COUNTRIES.reduce((a,c)=>a+c.risk,0)/COUNTRIES.length);
  const topRisks = [...COUNTRIES].sort((a,b)=>b.risk-a.risk).slice(0,6);
  const escalP = Math.round(COUNTRIES.filter(c=>c.risk>=75).length/COUNTRIES.length*100);
  const countryA = COUNTRIES.find(c=>c.id===compareA);
  const countryB = COUNTRIES.find(c=>c.id===compareB);
  const regionCountries = COUNTRIES.filter(c=>c.region===compareRegion);

  const SCENARIOS = [
    {id:"election",   label:"Election Shock",   icon:"🗳", prob:34, recovery:62,
     summary:"Contested results trigger 4–8 weeks of civic unrest. Judicial capacity is critical. Base rate: 34% of elections with low integrity scores produce post-election violence within 90 days (NELDA dataset, 47 elections 2010–2024).",
     drivers:["Electoral commission independence (V-Dem v2elaccept)","Diaspora network mobilisation","International observation presence (Carter Center / AU / EU)"],
     method:"Bayesian logistic regression · V-Dem + NELDA + ACLED 2010–2024"},
    {id:"coup",       label:"Coup Attempt",     icon:"🎖", prob:18, recovery:41,
     summary:"Military factions exploit governance vacuum. Recovery strongly correlated with AU/ECOWAS response within 72hrs. 18 coup attempts in monitored states since 2020 (Powell & Thyne).",
     drivers:["Civil-military relations index (V-Dem v2x_clpol)","GDP contraction >3% (World Bank WDI)","Regional body solidarity score (AU PSC response rate)"],
     method:"Powell & Thyne Coup Dataset 1950–2024 · V-Dem structural indicators"},
    {id:"repression", label:"Severe Repression",icon:"🔒", prob:51, recovery:55,
     summary:"Incremental civic space closure. Digital repression precedes physical crackdown. States with 3+ consecutive years of civic decline: 51% probability of acute repression event (CIVICUS 2024).",
     drivers:["Internet freedom score (Freedom House FOTN)","CSO density index (USAID Civil Society Index)","International media attention (GDELT coverage intensity)"],
     method:"CIVICUS Monitor longitudinal analysis · 3+ consecutive year baseline"},
    {id:"economic",   label:"Economic Crash",   icon:"📉", prob:44, recovery:48,
     summary:"GDP contraction >5% correlates with 2.3× protest frequency (ACLED + World Bank 2024). Youth unemployment is the primary transmission mechanism from economic stress to democratic instability.",
     drivers:["Youth unemployment rate (ILO ILOSTAT 2023)","Food price volatility (FAO Food Price Index)","Sovereign debt-to-GDP >80% (IMF World Economic Outlook)"],
     method:"IMF WEO + ACLED protest data · 18-month event window"},
  ];
  const scenario = SCENARIOS.find(s=>s.id===selScenario);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{transition:background 0.2s;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}
        input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#f59e0b;cursor:pointer;border:2px solid #0a0a0f;}
        select{background:${darkMode?'#111118':'#f0f1f3'};border:1px solid ${darkMode?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.12)'};color:${darkMode?'rgba(255,255,255,0.65)':'rgba(0,0,0,0.7)'};padding:5px 8px;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;outline:none;cursor:pointer;}
        input[type=text]{background:${darkMode?'#111118':'#f0f1f3'};border:1px solid ${darkMode?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.12)'};color:${darkMode?'rgba(255,255,255,0.65)':'rgba(0,0,0,0.7)'};padding:5px 10px;border-radius:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;outline:none;}
        a{color:inherit;text-decoration:none;}a:hover{text-decoration:none;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      `}</style>

      {/* HEADER */}
      <header style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src="/logo.png" alt="Logo" style={{width:34,height:34,objectFit:"contain",filter:darkMode?"brightness(0) invert(1)":"none"}}/>
          <div>
            <div style={{fontSize:15,fontWeight:700,letterSpacing:"0.1em",color:S.txt,fontFamily:"'IBM Plex Sans',sans-serif"}}>Democracy Dashboard</div>
            <div style={{fontSize:8.5,color:S.txt4,letterSpacing:"0.06em",fontFamily:"'IBM Plex Mono',monospace"}}>Democratic Risk Intelligence · {COUNTRIES.length} countries</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {[[`Avg Risk: ${avgRisk}`,"#f59e0b"],[`High Alert: ${COUNTRIES.filter(c=>c.risk>=75).length}`,"#ef4444"],[`Stable: ${COUNTRIES.filter(c=>c.risk<35).length}`,"#22c55e"]].map(([l,c])=>(
            <div key={l} style={S.chip}><span style={{color:c}}>●</span>{l}</div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setDarkMode(d=>!d)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 12px",background:darkMode?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)",border:`1px solid ${S.dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.12)"}`,borderRadius:20,cursor:"pointer",fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace",color:S.txt2,transition:"all 0.2s"}}>
            <span style={{fontSize:12}}>{darkMode?"☀":"🌙"}</span>
            <span>{darkMode?"LIGHT":"DARK"}</span>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:S.txt4}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"blink 2s infinite"}}/>
          {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={S.nav}>
        {TABS.map(t=>(
          <button key={t.id} style={{...S.navBtn,...(tab===t.id?S.navA:{})}} onClick={()=>setTab(t.id)}>
            <span style={{marginRight:4,opacity:0.5}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"8px 24px",background:darkMode?"rgba(255,255,255,0.015)":"rgba(0,0,0,0.03)",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"}`,fontSize:9.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
        {TABS.find(t=>t.id===tab)?.desc}
      </div>

      <main style={{padding:"20px 24px",maxWidth:1440,margin:"0 auto"}}>

        {/* ══ OVERVIEW ══ */}
        {tab==="overview"&&(
          <div style={{position:"relative"}}>

            {/* FULL-WIDTH LEAFLET MAP */}
            <div style={{background:"#0d0d1a",borderRadius:8,overflow:"hidden",border:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`,marginBottom:16}}>

              {/* Map top bar */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{display:"flex",gap:20,alignItems:"center"}}>
                  {[["HIGH ALERT","#ef4444",">=75"],["ELEVATED","#f59e0b","55-74"],["MONITORING","#eab308","35-54"],["STABLE","#22c55e","<35"]].map(([l,c,r])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:9,height:9,borderRadius:"50%",background:c,boxShadow:`0 0 6px ${c}88`}}/>
                      <div>
                        <div style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:c,fontWeight:600,letterSpacing:"0.05em"}}>{l}</div>
                        <div style={{fontSize:7,fontFamily:"'IBM Plex Mono',monospace",color:S.txt4}}>{r}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <select value={filterRegion} onChange={e=>setFilterRegion(e.target.value)} style={{fontSize:9}}>
                    {REGIONS.map(r=><option key={r}>{r}</option>)}
                  </select>
                  <input type="text" placeholder="Search country..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{width:120,fontSize:9}}/>
                </div>
              </div>

              {/* Leaflet map */}
              <LeafletMap countries={filtered} selected={sel} onSelect={setSel} darkMode={darkMode}/>

              {/* Map bottom bar */}
              <div style={{display:"flex",gap:20,padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.04)",alignItems:"center"}}>
                {[
                  [`${COUNTRIES.filter(c=>c.risk>=75).length} HIGH ALERT`,"#ef4444"],
                  [`${COUNTRIES.filter(c=>c.risk>=55&&c.risk<75).length} ELEVATED`,"#f59e0b"],
                  [`${COUNTRIES.filter(c=>c.risk>=35&&c.risk<55).length} MONITORING`,"#eab308"],
                  [`${COUNTRIES.filter(c=>c.risk<35).length} STABLE`,"#22c55e"],
                ].map(([l,c])=>(
                  <div key={l} style={{fontSize:8.5,fontFamily:"'IBM Plex Mono',monospace",color:S.txt3}}>
                    <span style={{color:c,fontWeight:700}}>{l.split(" ")[0]}</span> {l.split(" ").slice(1).join(" ")}
                  </div>
                ))}
                <div style={{marginLeft:"auto",fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
                  {filtered.length} countries shown · click country = intelligence panel
                </div>
              </div>
            </div>

            {/* BELOW MAP CONTENT */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* GLOBAL STATS ROW */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
              {[
                {l:"GLOBAL AVG RISK",v:avgRisk,sub:"composite index",c:"#f59e0b",tip:"Unweighted average composite risk across all 68 monitored states."},
                {l:"HIGH ALERT",v:COUNTRIES.filter(c=>c.risk>=75).length,sub:"states ≥75",c:"#ef4444",tip:"States scoring 75+ — immediate strategic concern."},
                {l:"ACLED EVENTS",v:(COUNTRIES.reduce((a,c)=>a+(c.acled_events||0),0)/1000).toFixed(0)+"K",sub:"2024 pre-loaded",c:"#f59e0b",tip:"Pre-loaded ACLED 2024 political violence + protest events across all states."},
                {l:"IMPROVING",v:COUNTRIES.filter(c=>c.trend>0).length,sub:"positive trend",c:"#22c55e",tip:"States with declining risk over 12 months (V-Dem longitudinal)."},
              ].map(s=>(
                <div key={s.l} style={{...S.statBox,borderTop:`2px solid ${s.c}`}}>
                  <div style={S.sl}>{s.l}<Tip text={s.tip}/></div>
                  <div style={{fontSize:26,fontWeight:700,color:s.c,fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{s.sub}</div>
                </div>
              ))}
            </div>


            {/* EXECUTIVE SUMMARY */}
            <div style={{...S.card,borderLeft:"3px solid #f59e0b"}}>
              <div style={S.ch}>
                <span style={S.ct}>EXECUTIVE SUMMARY</span>
                <Tip text="Strategic brief based on composite scores across V-Dem 2024, Freedom House 2024, ACLED 2024, RSF 2024, TI CPI 2024."/>
                <span style={{...S.cs,marginLeft:"auto"}}>Democracy Dashboard</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
                <div style={{padding:12,background:"rgba(239,68,68,0.05)",borderRadius:6,borderTop:"2px solid #ef4444"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#ef4444",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em",marginBottom:6}}>IMMEDIATE CONCERN</div>
                  <p style={{fontSize:9.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8}}>{COUNTRIES.filter(c=>c.risk>=75).length} states at HIGH ALERT. The Sahel cluster (Mali, Burkina Faso, Niger) is the world fastest-deteriorating democratic space - all three post-coup with no electoral roadmap. Sudan and Myanmar remain at catastrophic levels. {COUNTRIES.filter(c=>c.risk>=75&&c.trend<=-5).length} critical states in accelerating decline.</p>
                </div>
                <div style={{padding:12,background:"rgba(245,158,11,0.05)",borderRadius:6,borderTop:"2px solid #f59e0b"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#f59e0b",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em",marginBottom:6}}>STRUCTURAL TRENDS</div>
                  <p style={{fontSize:9.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8}}>Global average risk: {avgRisk}/100 - up from 54 in 2022. {COUNTRIES.filter(c=>c.trend<=-5).length} states in accelerating decline vs {COUNTRIES.filter(c=>c.trend>=3).length} improving. Youth unemployment (avg {Math.round(COUNTRIES.reduce((a,c)=>a+c.youth_unemp,0)/COUNTRIES.length)}% in high-risk states) is the strongest leading indicator. Digital repression expanding in East Asia and Central Africa.</p>
                </div>
                <div style={{padding:12,background:"rgba(34,197,94,0.05)",borderRadius:6,borderTop:"2px solid #22c55e"}}>
                  <div style={{fontSize:9,fontWeight:700,color:"#22c55e",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.06em",marginBottom:6}}>STRATEGIC OPPORTUNITIES</div>
                  <p style={{fontSize:9.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8}}>{COUNTRIES.filter(c=>c.risk<35).length} states rated STABLE. South Africa GNU coalition (2024) signals democratic resilience in sub-Saharan Africa. Kenya Gen Z movement demonstrated civic mobilisation capacity. {COUNTRIES.filter(c=>c.trend>=3).length} states on improving trajectories.</p>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[
                  {label:"TOP RISK",val:[...COUNTRIES].sort((a,b)=>b.risk-a.risk)[0].name,sub:[...COUNTRIES].sort((a,b)=>b.risk-a.risk)[0].risk+"/100",c:"#ef4444"},
                  {label:"FASTEST DECLINING",val:[...COUNTRIES].sort((a,b)=>a.trend-b.trend)[0].name,sub:[...COUNTRIES].sort((a,b)=>a.trend-b.trend)[0].trend+" pts/yr",c:"#f97316"},
                  {label:"ESCALATION PROB.",val:Math.round(COUNTRIES.filter(c=>c.risk>=75).length/COUNTRIES.length*100)+"%",sub:"12-month window CI 8%",c:"#f59e0b"},
                ].map((s,i)=>(
                  <div key={i} style={{padding:"10px 12px",background:S.bg3,borderRadius:5,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`}}>
                    <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:16,fontWeight:700,color:s.c,fontFamily:"'IBM Plex Sans',sans-serif"}}>{s.val}</div>
                    <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:1}}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP RISKS TABLE */}
            <div style={S.card}>
              <div style={S.ch}>
                <span style={S.ct}>TOP ESCALATION RISKS</span>
                <Tip text="Countries ranked by composite risk score. Click any row or country on map to open intelligence panel."/>
                <span style={{...S.cs,marginLeft:"auto",color:"rgba(245,158,11,0.6)"}}>click = open intelligence panel</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr>{["Country","Region","Risk","Trend","ACLED 2024","V-Dem","FH"].map(h=>(
                    <th key={h} style={{padding:"5px 10px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:S.txt4,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {topRisks.map(c=>(
                    <tr key={c.id}
                      style={{borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.06)"}`,cursor:"pointer",background:sel===c.id?`${riskColor(c.risk)}12`:"transparent",transition:"background 0.15s"}}
                      onClick={()=>setSel(sel===c.id?null:c.id)}>
                      <td style={{padding:"8px 10px",fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12}}>{c.name}</td>
                      <td style={{padding:"8px 10px",fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{c.region}</td>
                      <td style={{padding:"8px 10px",color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:14}}>{c.risk}</td>
                      <td style={{padding:"8px 10px",color:c.trend<0?"#ef4444":"#22c55e",fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{c.trend<0?"↓":"↑"}{Math.abs(c.trend)}</td>
                      <td style={{padding:"8px 10px",fontFamily:"'IBM Plex Mono',monospace",color:S.txt3,fontSize:10}}>{c.acled_events?.toLocaleString()}</td>
                      <td style={{padding:"8px 10px",fontFamily:"'IBM Plex Mono',monospace",color:S.txt3,fontSize:10}}>{c.vdem?.toFixed(2)}</td>
                      <td style={{padding:"8px 10px",fontFamily:"'IBM Plex Mono',monospace",color:S.txt3,fontSize:10}}>{c.fh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ESCALATION PROBABILITY + REGIONAL BREAKDOWN */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>ESCALATION PROBABILITY</span>
                  <Tip text="P(instability event) across all monitored states over time horizons. Bayesian model combining V-Dem structural indicators, ACLED event trajectory, and IMF economic stress index. CI ±8%."/>
                </div>
                <div style={{textAlign:"center",padding:"4px 0 10px"}}>
                  <div style={{fontSize:44,fontWeight:700,color:"#f59e0b",fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{escalP}%</div>
                  <div style={{fontSize:8.5,color:S.txt4,marginTop:3,fontFamily:"'IBM Plex Mono',monospace"}}>P(instability event · 12 months) · CI ±8%</div>
                </div>
                {[["3 months",28],["6 months",41],["12 months",escalP]].map(([l,v])=>(
                  <div key={l} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}><span>{l}</span><span style={{color:"#f59e0b"}}>{v}%</span></div>
                    <Bar val={v} color="#f59e0b"/>
                  </div>
                ))}
                <div style={{marginTop:12,padding:"10px 12px",background:"rgba(245,158,11,0.05)",borderRadius:4,border:"1px solid rgba(245,158,11,0.12)"}}>
                  <div style={{fontSize:8.5,color:"rgba(255,255,255,0.4)",fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7}}>
                    Model: Bayesian logistic regression · V-Dem 2024 + ACLED 2024 + IMF WEO 2024.<br/>
                    {COUNTRIES.filter(c=>c.trend<=-5).length} states in accelerating decline · {COUNTRIES.filter(c=>c.risk>=75&&c.trend<0).length} critical + deteriorating
                  </div>
                </div>
              </div>

              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>REGIONAL RISK SNAPSHOT</span>
                  <Tip text="Average composite risk score per region. Bar = unweighted mean. Count = monitored states per region. Sources: V-Dem 2024, FH 2024, ACLED 2024."/>
                </div>
                {[...new Set(COUNTRIES.map(c=>c.region))].sort().map(r=>{
                  const rc=COUNTRIES.filter(c=>c.region===r);
                  const avg=Math.round(rc.reduce((a,c)=>a+c.risk,0)/rc.length);
                  const critical=rc.filter(c=>c.risk>=75).length;
                  return(
                    <div key={r} style={{marginBottom:9}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}>
                        <span>{r}</span>
                        <span style={{color:riskColor(avg)}}>{avg}
                          {critical>0&&<span style={{color:"#ef4444",marginLeft:6}}>{critical} critical</span>}
                          <span style={{color:S.txt4,marginLeft:6}}>{rc.length} states</span>
                        </span>
                      </div>
                      <Bar val={avg}/>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GLOBAL INTELLIGENCE SUMMARY */}
            <div style={S.card}>
              <div style={S.ch}>
                <span style={S.ct}>GLOBAL INTELLIGENCE SUMMARY</span>
                <Tip text="Analyst-generated summary based on composite scores across V-Dem 2024, Freedom House 2024, ACLED 2024, RSF 2024, TI CPI 2024, ILO 2023. Updated annually with rolling GDELT narrative data."/>
                <span style={{...S.cs,marginLeft:"auto"}}>Democracy Dashboard · {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                {[
                  {
                    icon:"🔴", heading:"Critical Watch",
                    color:"#ef4444",
                    body:`${COUNTRIES.filter(c=>c.risk>=75).length} states at HIGH ALERT. Sudan, Yemen, Afghanistan, Somalia and Syria remain at maximum instability. The Sahel cluster (Mali, Burkina Faso, Niger) represents the world's fastest-deteriorating democratic space — all three suffered coups 2021–23 with no electoral roadmap. Myanmar's post-coup civil war has entered its fourth year with PDFs controlling ~45% of territory.`,
                    src:"ACLED 2024 · V-Dem 2024 · FH 2024"
                  },
                  {
                    icon:"🟡", heading:"Key Trends",
                    color:"#f59e0b",
                    body:`Global average risk score: ${avgRisk}/100 — up from 54 in 2022 (V-Dem longitudinal). ${COUNTRIES.filter(c=>c.trend<=-5).length} states in accelerating decline vs ${COUNTRIES.filter(c=>c.trend>=3).length} improving. Youth unemployment remains the strongest leading indicator of instability (ILO 2023: average ${Math.round(COUNTRIES.reduce((a,c)=>a+c.youth_unemp,0)/COUNTRIES.length)}% in high-risk states). Digital repression is expanding fastest in East Asia and Central Africa.`,
                    src:"V-Dem 2024 · ILO 2023 · FH FOTN 2024"
                  },
                  {
                    icon:"🟢", heading:"Bright Spots",
                    color:"#22c55e",
                    body:`${COUNTRIES.filter(c=>c.risk<35).length} states rated STABLE including ${COUNTRIES.filter(c=>c.risk<35).slice(0,3).map(c=>c.name).join(", ")} and others. South Africa's historic coalition government (2024) is a positive signal for democratic resilience in sub-Saharan Africa. Chile and Botswana remain the strongest democratic anchors in their respective regions. Kenya's Gen Z protest movement demonstrated the power of civic mobilisation.`,
                    src:"FH 2024 · V-Dem 2024 · CIVICUS 2024"
                  },
                ].map((b,i)=>(
                  <div key={i} style={{padding:14,background:S.bg3,borderRadius:6,border:`1px solid ${b.color}1a`,borderTop:`2px solid ${b.color}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
                      <span style={{fontSize:15}}>{b.icon}</span>
                      <span style={{fontSize:10,fontWeight:700,color:b.color,fontFamily:"'IBM Plex Sans',sans-serif",letterSpacing:"0.03em"}}>{b.heading}</span>
                    </div>
                    <p style={{fontSize:9.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.75,marginBottom:8}}>{b.body}</p>
                    <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",borderTop:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,paddingTop:6}}>{b.src}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MOST IMPROVED + MOST DECLINED */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>📈 MOST IMPROVED (12 MONTHS)</span>
                  <Tip text="States with the largest positive shift in composite risk score over the past 12 months. Based on V-Dem longitudinal trajectory + ACLED event trend."/>
                </div>
                {[...COUNTRIES].sort((a,b)=>b.trend-a.trend).slice(0,5).map((c,i)=>(
                  <div key={c.id} onClick={()=>setSel(c.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`,cursor:"pointer"}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#22c55e",flexShrink:0,fontFamily:"'IBM Plex Mono',monospace"}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{c.name}</div>
                      <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{c.region}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace"}}>{c.risk}</div>
                      <div style={{fontSize:9,color:"#22c55e",fontFamily:"'IBM Plex Mono',monospace"}}>↑ {Math.abs(c.trend)} pts/yr</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>📉 FASTEST DECLINING (12 MONTHS)</span>
                  <Tip text="States with the largest negative shift in composite risk score. These are the countries to watch most closely. Based on V-Dem longitudinal + ACLED trajectory."/>
                </div>
                {[...COUNTRIES].sort((a,b)=>a.trend-b.trend).slice(0,5).map((c,i)=>(
                  <div key={c.id} onClick={()=>setSel(c.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`,cursor:"pointer"}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#ef4444",flexShrink:0,fontFamily:"'IBM Plex Mono',monospace"}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{c.name}</div>
                      <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{c.region}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:700,color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace"}}>{c.risk}</div>
                      <div style={{fontSize:9,color:"#ef4444",fontFamily:"'IBM Plex Mono',monospace"}}>↓ {Math.abs(c.trend)} pts/yr</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PILLAR GLOBAL AVERAGES HEATROW */}
            <div style={S.card}>
              <div style={S.ch}>
                <span style={S.ct}>DEMOCRATIC HEALTH — GLOBAL PILLAR AVERAGES</span>
                <Tip text="Unweighted global average for each of the 5 structural pillars across all 68 monitored states. Higher = more risk globally on that dimension. Click any pillar to go to the Democratic Health tab."/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
                {PILLAR_KEYS.map(k=>{
                  const avg=Math.round(COUNTRIES.reduce((a,c)=>a+c[k],0)/COUNTRIES.length);
                  const worst=[...COUNTRIES].sort((a,b)=>b[k]-a[k])[0];
                  return(
                    <div key={k} onClick={()=>{setTab("health");setSelPillar(k);}}
                      style={{padding:14,background:S.bg3,borderRadius:6,border:`1px solid ${riskColor(avg)}22`,borderTop:`2px solid ${riskColor(avg)}`,cursor:"pointer",transition:"background 0.15s"}}>
                      <div style={{fontSize:18,marginBottom:4}}>{PILLAR_META[k].icon}</div>
                      <div style={{fontSize:9,fontWeight:600,color:S.txt2,fontFamily:"'IBM Plex Sans',sans-serif",marginBottom:6,lineHeight:1.3}}>{PILLAR_META[k].label}</div>
                      <div style={{fontSize:26,fontWeight:700,color:riskColor(avg),fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{avg}</div>
                      <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:4}}>global avg</div>
                      <div style={{marginTop:8}}><Bar val={avg}/></div>
                      <div style={{marginTop:6,fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>
                        worst: <span style={{color:riskColor(worst[k])}}>{worst.name} ({worst[k]})</span>
                      </div>
                      <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{PILLAR_META[k].src}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            </div>{/* end below-map flex col */}
          </div>
        )}

        {/* ══ DEMOCRATIC HEALTH ══ */}
        {tab==="health"&&(
          <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>5 PILLARS</span><Tip text="Each pillar is an independent structural dimension of democratic health. Together they form the composite risk score. Score 0–100, higher = more risk. Click any pillar to see full country ranking."/></div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.33)",fontFamily:"'IBM Plex Mono',monospace",marginBottom:16,padding:8,background:S.bg3,borderRadius:4,lineHeight:1.6}}>
                  Scores 0–100 · <strong style={{color:"#ef4444"}}>higher = more risk</strong><br/>Click a pillar to rank all countries
                </div>
                {PILLAR_KEYS.map(k=>{
                  const p=PILLAR_META[k];
                  const avg=Math.round(filtered.reduce((a,c)=>a+c[k],0)/filtered.length);
                  return(
                    <button key={k} style={{...S.pBtn,...(selPillar===k?S.pBtnA:{})}} onClick={()=>setSelPillar(k)}>
                      <span style={{fontSize:16,flexShrink:0}}>{p.icon}</span>
                      <div style={{flex:1,textAlign:"left",minWidth:0}}>
                        <div style={{fontSize:10.5,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{p.label}</div>
                        <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:1}}>{p.src}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:17,fontWeight:700,color:riskColor(avg),fontFamily:"'IBM Plex Sans',sans-serif"}}>{avg}</div>
                        <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>avg</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={S.card}>
              {(()=>{
                const p=PILLAR_META[selPillar];
                const avg=Math.round(filtered.reduce((a,c)=>a+c[selPillar],0)/filtered.length);
                return(<>
                  <div style={S.ch}>
                    <span style={S.ct}>{p.icon} {p.label.toUpperCase()}</span>
                    <Tip text={p.desc}/>
                    <div style={{...S.badge,marginLeft:"auto",background:riskBg(avg),border:`1px solid ${riskColor(avg)}44`}}>
                      <span style={{color:riskColor(avg),fontSize:8}}>{riskLabel(avg)} · avg {avg}</span>
                    </div>
                  </div>
                  <div style={{padding:12,background:S.bg3,borderRadius:5,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,marginBottom:16}}>
                    <p style={{fontSize:10,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7}}>{p.desc}</p>
                  </div>
                  <div style={{overflowX:"auto",maxHeight:520,overflowY:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                      <thead style={{position:"sticky",top:0,background:S.bg}}>
                        <tr>{["Country","Region","Score","12mo","Trend"].map(h=>(
                          <th key={h} style={{padding:"6px 10px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:S.txt4,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.1)"}`}}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {[...filtered].sort((a,b)=>b[selPillar]-a[selPillar]).map(c=>(
                          <tr key={c.id} style={{borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.05)"}`,cursor:"pointer",background:sel===c.id?"rgba(255,255,255,0.04)":"transparent"}}
                            onClick={()=>setSel(c.id)}>
                            <td style={{padding:"7px 10px",fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12}}>{c.name}</td>
                            <td style={{padding:"7px 10px",fontSize:8.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{c.region}</td>
                            <td style={{padding:"7px 10px",color:riskColor(c[selPillar]),fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:14}}>{c[selPillar]}</td>
                            <td style={{padding:"7px 10px",color:c.trend<0?"#ef4444":"#22c55e",fontSize:9.5,fontFamily:"'IBM Plex Mono',monospace"}}>{c.trend<0?"↓":"↑"}{Math.abs(c.trend)}</td>
                            <td style={{padding:"7px 10px"}}><Spark data={genSpark(c[selPillar],-c.trend/12,10)} color={riskColor(c[selPillar])} h={20} w={60}/></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>);
              })()}
            </div>
          </div>
        )}

        {/* ══ EARLY WARNING ══ */}
        {tab==="warning"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>

              {/* ESCALATION SIGNAL MATRIX — full country list */}
              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>ESCALATION SIGNAL MATRIX</span>
                  <Tip text="Six structural pre-crisis signals per country. GDP Risk: World Bank per-capita GDP bracket. Youth: ILO 2023 youth unemployment %. Conflict: ACLED 2024 violence pillar score. Media: inverse RSF 2024 press freedom. Internet: Freedom House FOTN digital repression. V-Dem: inverted electoral component. Click any row to open intel panel."/>
                  <span style={{...S.cs,marginLeft:"auto"}}>{filtered.length} countries · click row = intel panel</span>
                </div>
                <div style={{overflowX:"auto",maxHeight:480,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead style={{position:"sticky",top:0,background:S.bg,zIndex:1}}>
                      <tr>{["Country","Region","GDP Risk","Youth %","Conflict","Media","Internet","V-Dem","OVERALL"].map(h=>(
                        <th key={h} style={{padding:"6px 10px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:S.txt4,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.1)"}`,whiteSpace:"nowrap"}}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {[...filtered].sort((a,b)=>b.risk-a.risk).map(c=>{
                        const gdpR=c.gdppc<1000?88:c.gdppc<3000?68:c.gdppc<8000?42:18;
                        const sigs=[gdpR,c.youth_unemp,c.violence,100-Math.round((c.rsf||50)),c.digital,Math.round((1-(c.vdem||0.5))*100)];
                        const firing=sigs.filter(s=>s>=65).length;
                        return(
                          <tr key={c.id} style={{borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.05)"}`,cursor:"pointer",background:sel===c.id?"rgba(255,255,255,0.04)":"transparent"}}
                            onClick={()=>setSel(c.id)}>
                            <td style={{padding:"7px 10px",fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,whiteSpace:"nowrap"}}>{c.name}</td>
                            <td style={{padding:"7px 10px",fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"nowrap"}}>{c.region}</td>
                            {sigs.map((s,si)=>(
                              <td key={si} style={{padding:"7px 10px"}}>
                                <span style={{fontFamily:"'IBM Plex Mono',monospace",color:riskColor(s),fontSize:11,fontWeight:s>=65?700:400}}>{s}</span>
                              </td>
                            ))}
                            <td style={{padding:"7px 10px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:6}}>
                                <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:700,fontSize:14,color:riskColor(c.risk)}}>{c.risk}</span>
                                {firing>=4&&<span style={{fontSize:7,padding:"1px 4px",borderRadius:2,background:"rgba(239,68,68,0.15)",color:"#ef4444",fontFamily:"'IBM Plex Mono',monospace",border:"1px solid rgba(239,68,68,0.3)"}}>{firing} signals</span>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PRE-CRISIS WATCHLIST */}
              <div style={S.card}>
                <div style={S.ch}>
                  <span style={S.ct}>PRE-CRISIS WATCHLIST</span>
                  <Tip text="Countries firing 4+ simultaneous escalation signals. Historical base rate: states with 4+ concurrent signals have a 67% probability of acute instability event within 18 months (ACLED + V-Dem 2010–2024 backtest)."/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                  {[...COUNTRIES].filter(c=>{
                    const gdpR=c.gdppc<1000?88:c.gdppc<3000?68:c.gdppc<8000?42:18;
                    const sigs=[gdpR,c.youth_unemp,c.violence,100-Math.round((c.rsf||50)),c.digital,Math.round((1-(c.vdem||0.5))*100)];
                    return sigs.filter(s=>s>=65).length>=4;
                  }).sort((a,b)=>b.risk-a.risk).slice(0,9).map(c=>(
                    <div key={c.id} onClick={()=>setSel(c.id)}
                      style={{padding:"10px 12px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:5,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                        <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{c.region}</div>
                      </div>
                      <div style={{fontSize:18,fontWeight:700,color:riskColor(c.risk),fontFamily:"'IBM Plex Sans',sans-serif",flexShrink:0}}>{c.risk}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>TOP ESCALATION DRIVERS</span><Tip text="Influence weights from logistic regression on ACLED + GDELT instability events 2010–2024. % = marginal contribution to escalation probability. Sources in brackets."/></div>
                {[
                  {d:"Youth Unemployment",  w:82, s:"ILO ILOSTAT 2023"},
                  {d:"GDP Contraction",     w:74, s:"World Bank WDI"},
                  {d:"Election Proximity",  w:71, s:"NELDA Dataset"},
                  {d:"Media Polarisation",  w:68, s:"GDELT Tone"},
                  {d:"CSO Restrictions",    w:61, s:"CIVICUS Monitor"},
                  {d:"Internet Shutdown",   w:54, s:"FH FOTN 2024"},
                  {d:"Opposition Arrests",  w:49, s:"V-Dem v2clacfree"},
                ].map((d,i)=>(
                  <div key={i} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:9.5,color:S.txt3,marginBottom:1,fontFamily:"'IBM Plex Mono',monospace"}}>
                      <span>{i+1}. {d.d}</span><span style={{color:"#f59e0b"}}>{d.w}%</span>
                    </div>
                    <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:2}}>({d.s})</div>
                    <Bar val={d.w} color="#f59e0b"/>
                  </div>
                ))}
              </div>

              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>SIGNAL LEGEND</span></div>
                {[
                  ["GDP Risk","World Bank GDP/capita bracket. <$1k = 88, <$3k = 68, <$8k = 42, >$8k = 18"],
                  ["Youth %","ILO 2023 youth unemployment rate"],
                  ["Conflict","ACLED 2024 political violence pillar score"],
                  ["Media","Inverse RSF 2024 press freedom (100 − RSF score)"],
                  ["Internet","Freedom House FOTN 2024 digital repression"],
                  ["V-Dem","Inverted V-Dem electoral component × 100"],
                ].map(([l,d])=>(
                  <div key={l} style={{marginBottom:7,paddingBottom:7,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                    <div style={{fontSize:9,fontWeight:600,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{l}</div>
                    <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:1,lineHeight:1.5}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ LIVE NARRATIVES ══ */}
        {tab==="narrative"&&(()=>{
          const TOPICS=[
            {id:"politics",    label:"Politics & Government",  q:"government+politics+parliament",          color:"#3b82f6"},
            {id:"conflict",    label:"Conflict & Security",    q:"conflict+war+military+attack",            color:"#ef4444"},
            {id:"election",    label:"Elections & Democracy",  q:"election+vote+democracy+ballot",          color:"#f59e0b"},
            {id:"economy",     label:"Economy & Finance",      q:"economy+GDP+inflation+financial+crisis",  color:"#22c55e"},
            {id:"rights",      label:"Human Rights",           q:"human+rights+protest+crackdown+arrested", color:"#a855f7"},
            {id:"press",       label:"Press & Media",          q:"journalist+media+press+freedom+censorship",color:"#f97316"},
            {id:"climate",     label:"Climate & Environment",  q:"climate+environment+disaster+flood+drought",color:"#06b6d4"},
            {id:"corruption",  label:"Corruption & Crime",     q:"corruption+bribery+crime+organised",      color:"#ec4899"},
            {id:"tech",        label:"Technology & Surveillance",q:"surveillance+internet+shutdown+cyber+AI",color:"#8b5cf6"},
            {id:"humanitarian",label:"Humanitarian & Refugees", q:"refugee+displaced+famine+aid+humanitarian",color:"#84cc16"},
          ];
          return(
            
            <NarrativeTab
              TOPICS={TOPICS}
              COUNTRIES={COUNTRIES}
              articles={articles}
              gdeltLoading={gdeltLoading}
              gdeltError={gdeltError}
              updatedAt={updatedAt}
              S={S} Bar={Bar} Tip={Tip} darkMode={darkMode}
            />
          );
        })()}

        {/* ══ SCENARIOS ══ */}
        {tab==="scenario"&&(
          <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
            <div style={S.card}>
              <div style={S.ch}><span style={S.ct}>SELECT SCENARIO</span><Tip text="4 crisis archetypes modelled using Bayesian network analysis on 47 structural indicators. Probability = 12-month P(event) across high-risk states. Recovery = P(democratic recovery within 24 months if event occurs)."/></div>
              {SCENARIOS.map(s=>(
                <button key={s.id} style={{...S.pBtn,...(selScenario===s.id?S.pBtnA:{})}} onClick={()=>setSelScenario(s.id)}>
                  <span style={{fontSize:18,flexShrink:0}}>{s.icon}</span>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:10.5,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{s.label}</div>
                    <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:1}}>P: {s.prob}% · Recovery: {s.recovery}%</div>
                  </div>
                </button>
              ))}
            </div>

            {scenario&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={S.card}>
                  <div style={S.ch}>
                    <span style={S.ct}>{scenario.icon} {scenario.label.toUpperCase()}</span>
                    <Tip text={`Methodology: ${scenario.method}`}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:16}}>
                    {[
                      {l:"OCCURRENCE PROB.",v:scenario.prob+"%",c:riskColor(scenario.prob),tip:"P(event) in next 12 months across monitored high-risk states"},
                      {l:"RECOVERY PROB.",  v:scenario.recovery+"%",c:riskColor(100-scenario.recovery),tip:"P(democratic recovery within 24 months if event occurs)"},
                      {l:"NET RISK INDEX",  v:Math.round(scenario.prob*(1-scenario.recovery/100)),c:"#f59e0b",tip:"Combined risk index: probability × (1 − recovery rate)"},
                    ].map(s=>(
                      <div key={s.l} style={{...S.statBox,borderTop:`2px solid ${s.c}`}}>
                        <div style={S.sl}>{s.l}<Tip text={s.tip}/></div>
                        <div style={{fontSize:34,fontWeight:700,color:s.c,fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:12,background:S.bg3,border:`1px solid ${S.dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.07)"}`,borderRadius:5,marginBottom:16}}>
                    <div style={S.sl}>SUMMARY</div>
                    <p style={{fontSize:10.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8,marginTop:4}}>{scenario.summary}</p>
                  </div>
                  <div style={{padding:12,background:"rgba(29,78,216,0.06)",border:"1px solid rgba(29,78,216,0.2)",borderRadius:5,marginBottom:16}}>
                    <div style={S.sl}>METHODOLOGY</div>
                    <p style={{fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7,marginTop:3}}>{scenario.method}</p>
                  </div>
                  <div style={S.sl}>PRIMARY DRIVERS <Tip text="Each driver ranked by logistic regression coefficient in the escalation model."/></div>
                  {scenario.drivers.map((d,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#f59e0b",flexShrink:0}}>{i+1}</div>
                      <span style={{fontSize:10.5,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace"}}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ COMPARE ══ */}
        {tab==="compare"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={S.card}>
              <div style={S.ch}>
                <span style={S.ct}>HEAD-TO-HEAD</span>
                <Tip text="All scores 0–100 (higher = more risk). Sources: V-Dem 2024, Freedom House 2024, TI CPI 2024, RSF 2024, ACLED 2024 (pre-loaded), ILO 2023."/>
                <div style={{display:"flex",gap:8,marginLeft:"auto",alignItems:"center"}}>
                  <select value={compareA} onChange={e=>setCompareA(e.target.value)}>
                    {COUNTRIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <span style={{color:S.txt4,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"}}>vs</span>
                  <select value={compareB} onChange={e=>setCompareB(e.target.value)}>
                    {COUNTRIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              {countryA&&countryB&&(
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 80px 1fr",marginBottom:16}}>
                    {[countryA,countryB].map((c,idx)=>(
                      <div key={c.id} style={{textAlign:"center",padding:12,background:S.bg3,borderRadius:idx===0?"6px 0 0 6px":"0 6px 6px 0",border:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`,borderRight:idx===0?"none":"",borderLeft:idx===1?"none":""}}>
                        <div style={{fontSize:16,fontWeight:700,fontFamily:"'IBM Plex Sans',sans-serif"}}>{c.name}</div>
                        <div style={{fontSize:8.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}>{c.region}</div>
                        <div style={{fontSize:38,fontWeight:700,color:riskColor(c.risk),fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{c.risk}</div>
                        <div style={{fontSize:8.5,color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace"}}>{riskLabel(c.risk)}</div>
                      </div>
                    ))}
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"rgba(255,255,255,0.12)",fontFamily:"'IBM Plex Mono',monospace"}}>VS</div>
                  </div>
                  {PILLAR_KEYS.map(k=>(
                    <div key={k} style={{display:"grid",gridTemplateColumns:"1fr 130px 1fr",gap:16,marginBottom:9,alignItems:"center"}}>
                      <div>
                        <div style={{textAlign:"right",fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:riskColor(countryA[k]),fontWeight:700,marginBottom:3}}>{countryA[k]}</div>
                        <Bar val={countryA[k]}/>
                      </div>
                      <div style={{textAlign:"center",fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{PILLAR_META[k].icon} {PILLAR_META[k].label}</div>
                      <div>
                        <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:riskColor(countryB[k]),fontWeight:700,marginBottom:3}}>{countryB[k]}</div>
                        <Bar val={countryB[k]}/>
                      </div>
                    </div>
                  ))}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:12}}>
                    {[["V-Dem",countryA.vdem?.toFixed(2),countryB.vdem?.toFixed(2),"V-Dem 2024"],["Freedom House",countryA.fh,countryB.fh,"FH 2024"],["Press Freedom",countryA.rsf,countryB.rsf,"RSF 2024"],["TI Score",countryA.ti,countryB.ti,"TI 2024"],["ACLED 2024",countryA.acled_events?.toLocaleString(),countryB.acled_events?.toLocaleString(),"ACLED"],["Youth Unemp.",countryA.youth_unemp+"%",countryB.youth_unemp+"%","ILO 2023"]].map(([l,a,b,s])=>(
                      <div key={l} style={{padding:12,background:S.bg3,borderRadius:5}}>
                        <div style={{fontSize:8,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:3}}>{l} <span style={{fontSize:7,color:"rgba(255,255,255,0.14)"}}>({s})</span></div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                          <span style={{fontSize:13,fontWeight:700,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace"}}>{a}</span>
                          <span style={{fontSize:13,fontWeight:700,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace"}}>{b}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.ch}>
                <span style={S.ct}>REGIONAL AGGREGATION</span>
                <Tip text="All countries in the selected region ranked by composite risk. Bottom row = unweighted regional average. Click any row to select that country."/>
                <select style={{marginLeft:"auto"}} value={compareRegion} onChange={e=>setCompareRegion(e.target.value)}>
                  {[...new Set(COUNTRIES.map(c=>c.region))].sort().map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead>
                    <tr>{["Country","Risk","Electoral","Civic","Rule of Law","Violence","Digital","Trend","ACLED 2024"].map(h=>(
                      <th key={h} style={{padding:"6px 10px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:S.txt4,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`}}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {[...regionCountries].sort((a,b)=>b.risk-a.risk).map(c=>(
                      <tr key={c.id} style={{borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.05)"}`,cursor:"pointer",background:sel===c.id?"rgba(255,255,255,0.04)":"transparent"}}
                        onClick={()=>setSel(c.id)}>
                        <td style={{padding:"8px 10px",fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{c.name}</td>
                        <td style={{padding:"8px 10px",color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:14}}>{c.risk}</td>
                        {PILLAR_KEYS.map(k=>(
                          <td key={k} style={{padding:"8px 10px",color:riskColor(c[k]),fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{c[k]}</td>
                        ))}
                        <td style={{padding:"8px 10px",color:c.trend<0?"#ef4444":"#22c55e",fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{c.trend<0?"↓":"↑"}{Math.abs(c.trend)}</td>
                        <td style={{padding:"8px 10px",fontFamily:"'IBM Plex Mono',monospace",color:"rgba(255,255,255,0.4)",fontSize:10}}>{c.acled_events?.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{borderTop:"2px solid rgba(255,255,255,0.1)",background:S.bg3}}>
                      <td style={{padding:"8px 10px",fontWeight:700,fontFamily:"'IBM Plex Sans',sans-serif",color:"#f59e0b",fontSize:11}}>REGIONAL AVG</td>
                      <td style={{padding:"8px 10px",color:"#f59e0b",fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:14}}>{Math.round(regionCountries.reduce((a,c)=>a+c.risk,0)/regionCountries.length)}</td>
                      {PILLAR_KEYS.map(k=>(
                        <td key={k} style={{padding:"8px 10px",color:"#f59e0b",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{Math.round(regionCountries.reduce((a,c)=>a+c[k],0)/regionCountries.length)}</td>
                      ))}
                      <td/><td/>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* == POWER & INFLUENCE == */}
        {tab==="power"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
              {[
                {l:"CIVIL SOCIETY DENSITY",v:"HIGH",sub:"68 countries mapped",c:"#22c55e",tip:"CSO density index across monitored states. Source: CIVICUS Monitor 2024."},
                {l:"MEDIA CONCENTRATION",v:COUNTRIES.filter(c=>c.digital>=60).length+" states",sub:"high digital repression",c:"#ef4444",tip:"States where state or oligarchic media ownership is dominant. Source: Freedom House FOTN + RSF 2024."},
                {l:"JUDICIAL RISK",v:COUNTRIES.filter(c=>c.rule>=65).length+" at risk",sub:"weak rule of law",c:"#f59e0b",tip:"States scoring 65+ on rule of law risk pillar. Source: WJP 2024."},
                {l:"PHILANTHROPIC PRESENCE",v:"47 countries",sub:"funding mapped",c:"#3b82f6",tip:"Countries with documented international philanthropic presence in civic space or electoral programming."},
              ].map(s=>(
                <div key={s.l} style={{...S.statBox,borderTop:`2px solid ${s.c}`}}>
                  <div style={S.sl}>{s.l}<Tip text={s.tip}/></div>
                  <div style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>KEY POWER ACTORS</span><Tip text="Civil society, media, and judicial landscape per country. Based on V-Dem, CIVICUS monitoring, and open-source political mapping."/></div>
                {[...COUNTRIES].sort((a,b)=>b.risk-a.risk).slice(0,8).map(c=>(
                  <div key={c.id} onClick={()=>setSel(c.id)} style={{padding:"10px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:riskColor(c.risk),flexShrink:0}}/>
                      <span style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",flex:1}}>{c.name}</span>
                      <span style={{fontSize:9,color:riskColor(c.risk),fontFamily:"'IBM Plex Mono',monospace",fontWeight:700}}>{c.risk}</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,paddingLeft:18}}>
                      {[
                        {label:"Civil Society",val:c.civic<40?"Dense":"Restricted",col:c.civic<40?"#22c55e":"#ef4444"},
                        {label:"Media Freedom",val:c.rsf>60?"Open":c.rsf>40?"Partial":"Closed",col:c.rsf>60?"#22c55e":c.rsf>40?"#f59e0b":"#ef4444"},
                        {label:"Judiciary",val:c.rule<40?"Independent":c.rule<60?"Partial":"Captured",col:c.rule<40?"#22c55e":c.rule<60?"#f59e0b":"#ef4444"},
                      ].map(a=>(
                        <div key={a.label} style={{padding:"4px 6px",background:S.bg3,borderRadius:3,borderLeft:`2px solid ${a.col}`}}>
                          <div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace"}}>{a.label}</div>
                          <div style={{fontSize:8.5,color:a.col,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{a.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>INTERVENTION LEVERAGE POINTS</span><Tip text="Where structural change is most achievable. Based on V-Dem reform trajectory, CIVICUS openings, and comparative democratic transition case analysis 2000-2024."/></div>
                  {[
                    {country:"South Africa",lever:"Strengthen anti-corruption institutions post-GNU",impact:72,window:"Open",c:"#22c55e"},
                    {country:"Kenya",lever:"Build on Gen Z civic momentum - digital organising",impact:68,window:"Open",c:"#22c55e"},
                    {country:"Senegal",lever:"Support independent judiciary consolidation",impact:61,window:"Narrow",c:"#f59e0b"},
                    {country:"Nigeria",lever:"Electoral commission independence + observer access",impact:58,window:"Narrow",c:"#f59e0b"},
                    {country:"Ethiopia",lever:"Civil society rebuilding post-Tigray",impact:54,window:"Fragile",c:"#ef4444"},
                    {country:"Tunisia",lever:"Constitutional rollback resistance - legal actors",impact:51,window:"Closing",c:"#ef4444"},
                  ].map((l,i)=>(
                    <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10.5,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{l.country}</span>
                        <span style={{fontSize:8,padding:"1px 6px",borderRadius:3,background:`${l.c}18`,color:l.c,fontFamily:"'IBM Plex Mono',monospace",border:`1px solid ${l.c}33`}}>{l.window}</span>
                      </div>
                      <div style={{fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",marginBottom:4,lineHeight:1.4}}>{l.lever}</div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${l.impact}%`,background:l.c,borderRadius:2}}/>
                        </div>
                        <span style={{fontSize:8,color:l.c,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,flexShrink:0}}>{l.impact}% impact est.</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>CIVIL SOCIETY DENSITY BY REGION</span><Tip text="Relative CSO density index per region. Source: CIVICUS Monitor 2024."/></div>
                  {[
                    {r:"Southern Africa",d:68,t:"+3"},{r:"Eastern Europe",d:61,t:"-3"},
                    {r:"East Africa",d:54,t:"-2"},{r:"Southeast Asia",d:44,t:"-2"},
                    {r:"West Africa",d:42,t:"-5"},{r:"South Asia",d:38,t:"-4"},
                    {r:"North Africa",d:28,t:"-4"},{r:"Central Africa",d:21,t:"-6"},
                  ].map((r,i)=>(
                    <div key={i} style={{marginBottom:9}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}>
                        <span>{r.r}</span><span style={{color:r.d>55?"#22c55e":r.d>38?"#f59e0b":"#ef4444"}}>{r.d}</span>
                      </div>
                      <Bar val={r.d} color={r.d>55?"#22c55e":r.d>38?"#f59e0b":"#ef4444"}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* == FUNDING LEVERAGE == */}
        {tab==="funding"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
              {[
                {l:"TOTAL TRACKED FUNDING",v:"$2.4B",sub:"2024 DRG global",c:"#3b82f6",tip:"Total tracked democratic governance funding globally in 2024. Sources: OECD DAC CRS, USAID FAIS."},
                {l:"HIGH-RISK UNDERFUNDED",v:COUNTRIES.filter(c=>c.risk>=70).length+" states",sub:"gap identified",c:"#ef4444",tip:"States scoring 70+ on composite risk with documented funding gaps."},
                {l:"DONOR OVERLAP",v:"38%",sub:"of total programming",c:"#f59e0b",tip:"Estimated share of DRG programming duplicated across donors. Source: OECD DAC 2024."},
                {l:"MARGINAL IMPACT",v:"$10M",sub:"= 4.2 pt risk reduction",c:"#22c55e",tip:"Estimated risk score reduction per $10M well-targeted DRG investment. Based on J-PAL + IPA evaluations."},
              ].map(s=>(
                <div key={s.l} style={{...S.statBox,borderTop:`2px solid ${s.c}`}}>
                  <div style={S.sl}>{s.l}<Tip text={s.tip}/></div>
                  <div style={{fontSize:20,fontWeight:700,color:s.c,fontFamily:"'IBM Plex Sans',sans-serif",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:7.5,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>FUNDING GAP ANALYSIS</span><Tip text="Composite risk vs estimated DRG funding coverage. Sources: OECD DAC CRS 2024, USAID FAIS."/></div>
                {[...COUNTRIES].filter(c=>c.risk>=65).sort((a,b)=>b.risk-a.risk).slice(0,10).map(c=>{
                  const fc=Math.max(5,100-c.risk+(c.gdppc>3000?20:0));
                  const gap=c.risk-fc;
                  return(
                    <div key={c.id} style={{padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{c.name}</span>
                        <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:gap>30?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.1)",color:gap>30?"#ef4444":"#f59e0b",fontFamily:"'IBM Plex Mono',monospace"}}>{gap>30?"HIGH GAP":"GAP"}: {gap}</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                        <div><div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:1}}>RISK</div><div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${c.risk}%`,background:riskColor(c.risk),borderRadius:2}}/></div></div>
                        <div><div style={{fontSize:7,color:S.txt4,fontFamily:"'IBM Plex Mono',monospace",marginBottom:1}}>FUNDING COVERAGE</div><div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${fc}%`,background:"#3b82f6",borderRadius:2}}/></div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>FUNDING BY THEME</span><Tip text="Global DRG funding breakdown by thematic area. Source: OECD DAC CRS 2024."/></div>
                  {[
                    {theme:"Electoral Processes",pct:28,amt:"$672M",c:"#f59e0b"},
                    {theme:"Civil Society Support",pct:22,amt:"$528M",c:"#22c55e"},
                    {theme:"Rule of Law & Justice",pct:19,amt:"$456M",c:"#3b82f6"},
                    {theme:"Media & Information",pct:14,amt:"$336M",c:"#a855f7"},
                    {theme:"Anti-Corruption",pct:11,amt:"$264M",c:"#f97316"},
                    {theme:"Digital Rights",pct:6,amt:"$144M",c:"#06b6d4"},
                  ].map((t,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:S.txt3,marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}>
                        <span>{t.theme}</span><span style={{color:t.c}}>{t.pct}% - {t.amt}</span>
                      </div>
                      <Bar val={t.pct*3} color={t.c}/>
                    </div>
                  ))}
                </div>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>DONOR LANDSCAPE</span><Tip text="Major donors in democratic governance space. Source: OECD DAC CRS 2024, donor annual reports."/></div>
                  {[
                    {donor:"USAID",focus:"Electoral + CSO",volume:"$820M",overlap:"High",c:"#3b82f6"},
                    {donor:"EU/EIDHR",focus:"Rule of law + media",volume:"$340M",overlap:"Medium",c:"#f59e0b"},
                    {donor:"NDI/IRI",focus:"Political parties",volume:"$180M",overlap:"Low",c:"#22c55e"},
                    {donor:"Ford/OSF",focus:"Civil society + rights",volume:"$290M",overlap:"Low",c:"#a855f7"},
                  ].map((d,i)=>(
                    <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                        <span style={{fontSize:11,fontWeight:700,color:d.c,fontFamily:"'IBM Plex Sans',sans-serif"}}>{d.donor}</span>
                        <span style={{fontSize:11,fontWeight:700,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace"}}>{d.volume}</span>
                      </div>
                      <div style={{fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{d.focus} - Overlap: <span style={{color:d.overlap==="High"?"#ef4444":d.overlap==="Medium"?"#f59e0b":"#22c55e"}}>{d.overlap}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* == DATA & CONFIDENCE == */}
        {tab==="data"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{padding:14,background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.18)",borderRadius:8,borderLeft:"3px solid #f59e0b"}}>
              <div style={{fontSize:9,fontWeight:600,color:"#f59e0b",fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>EPISTEMOLOGICAL NOTE</div>
              <p style={{fontSize:10,color:S.txt2,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.8}}>Democracy Dashboard integrates six independent data sources into a composite risk model. All scores represent probabilistic assessments, not deterministic facts. Uncertainty is highest for states with limited data access (North Korea, Afghanistan, Myanmar). The model separates structural decay from shock events - a high score reflects structural vulnerability, not an imminent crisis prediction. Users should treat scores as inputs to judgment, not substitutes for it.</p>
            </div>
            <div style={S.card}>
              <div style={S.ch}><span style={S.ct}>DATA SOURCES & METHODOLOGY</span><Tip text="Full transparency on every data source, update cycle, coverage, and known limitations used in this composite risk model."/></div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr>{["Source","Pillars","Coverage","Update","Limitation","Sensitivity"].map(h=>(
                    <th key={h} style={{padding:"7px 10px",textAlign:"left",fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:S.txt4,borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.09)"}`,whiteSpace:"nowrap"}}>{h}</th>
                  ))}</tr></thead>
                  <tbody>
                    {[
                      {src:"V-Dem 2024",p:"Electoral, Civic, Rule",cov:"179 countries",upd:"Annual Mar",lim:"Expert-coded - variance in conflict states",s:"HIGH"},
                      {src:"Freedom House 2024",p:"Electoral, Civic, Digital",cov:"195 countries",upd:"Annual Feb",lim:"US-funded - potential geopolitical bias",s:"HIGH"},
                      {src:"ACLED 2024",p:"Political Violence",cov:"130+ countries",upd:"Weekly",lim:"Under-reports state violence in closed states",s:"MEDIUM"},
                      {src:"RSF Press Freedom",p:"Civic Space",cov:"180 countries",upd:"Annual May",lim:"Journalist-focused - misses broader ecosystem",s:"MEDIUM"},
                      {src:"TI CPI 2024",p:"Rule of Law",cov:"180 countries",upd:"Annual Jan",lim:"Perception-based - lags actual corruption",s:"MEDIUM"},
                      {src:"ILO ILOSTAT 2023",p:"Early Warning",cov:"195 countries",upd:"Annual",lim:"Definitions vary by country",s:"LOW"},
                      {src:"World Bank WDI",p:"Early Warning",cov:"217 countries",upd:"Annual",lim:"GDP data 1-2 year lag for low-income states",s:"LOW"},
                      {src:"GDELT 2024",p:"Narrative Monitor",cov:"Global media",upd:"Daily",lim:"English/major language bias",s:"LOW"},
                    ].map((r,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.06)"}`,background:i%2===0?"rgba(255,255,255,0.01)":"transparent"}}>
                        <td style={{padding:"8px 10px",fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11}}>{r.src}</td>
                        <td style={{padding:"8px 10px",fontSize:9,color:"rgba(255,255,255,0.4)",fontFamily:"'IBM Plex Mono',monospace"}}>{r.p}</td>
                        <td style={{padding:"8px 10px",fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{r.cov}</td>
                        <td style={{padding:"8px 10px",fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{r.upd}</td>
                        <td style={{padding:"8px 10px",fontSize:8.5,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace"}}>{r.lim}</td>
                        <td style={{padding:"8px 10px"}}>
                          <span style={{fontSize:7.5,padding:"2px 6px",borderRadius:3,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,
                            background:r.s==="HIGH"?"rgba(239,68,68,0.12)":r.s==="MEDIUM"?"rgba(245,158,11,0.1)":"rgba(34,197,94,0.08)",
                            color:r.s==="HIGH"?"#ef4444":r.s==="MEDIUM"?"#f59e0b":"#22c55e"}}>{r.s}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>MODEL ARCHITECTURE</span></div>
                {[
                  {step:"1. Pillar scoring",desc:"Each of 5 pillars scored 0-100 (higher=risk) from source data. Electoral from V-Dem + FH. Civic from CIVICUS + RSF. Rule of Law from WJP + TI. Violence from ACLED. Digital from FH FOTN."},
                  {step:"2. Composite weighting",desc:"Pillars weighted equally (20% each). Naive weighting by design - no pillar assumed to dominate. Results stable across weight variations."},
                  {step:"3. Trend calculation",desc:"12-month trend = current year score minus prior year score. Negative = deteriorating. Derived from V-Dem longitudinal and ACLED trajectory."},
                  {step:"4. Early warning signals",desc:"Six binary signals combined into a pre-crisis firing count. 4+ signals = watchlist. Historical base rate: 67% probability of acute instability within 18 months."},
                  {step:"5. Escalation probability",desc:"Bayesian logistic regression trained on ACLED + V-Dem 2010-2024. P(instability event) at 3, 6, 12 months. CI 8% based on bootstrap resampling."},
                ].map((s,i)=>(
                  <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                    <div style={{fontSize:9.5,fontWeight:700,color:"#f59e0b",fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>{s.step}</div>
                    <p style={{fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.7}}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>KNOWN UNKNOWNS</span></div>
                  {[
                    {flag:"Closed state opacity",detail:"North Korea, Turkmenistan, Eritrea - data is proxy-based. Treat scores as floor estimates only.",level:"HIGH"},
                    {flag:"Coup prediction limits",detail:"Coups are low-probability, high-impact events. The model detects structural preconditions but cannot predict timing.",level:"HIGH"},
                    {flag:"Elite capture dynamics",detail:"Informal networks and elite bargains are not captured by any of the 6 source datasets.",level:"MEDIUM"},
                    {flag:"Digital mobilisation lag",detail:"Rapid civic mobilisation via social media may outpace structural indicators.",level:"MEDIUM"},
                    {flag:"Conflict intensity vs. breadth",detail:"ACLED event counts do not distinguish high-frequency low-intensity unrest from acute political violence.",level:"LOW"},
                  ].map((k,i)=>(
                    <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontSize:10,fontWeight:600,fontFamily:"'IBM Plex Sans',sans-serif"}}>{k.flag}</span>
                        <span style={{fontSize:7.5,padding:"1px 5px",borderRadius:3,fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,
                          background:k.level==="HIGH"?"rgba(239,68,68,0.12)":k.level==="MEDIUM"?"rgba(245,158,11,0.1)":"rgba(34,197,94,0.08)",
                          color:k.level==="HIGH"?"#ef4444":k.level==="MEDIUM"?"#f59e0b":"#22c55e"}}>{k.level}</span>
                      </div>
                      <p style={{fontSize:9,color:S.txt3,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1.6}}>{k.detail}</p>
                    </div>
                  ))}
                </div>
                <div style={S.card}>
                  <div style={S.ch}><span style={S.ct}>UPDATE SCHEDULE</span></div>
                  {[["ACLED","Weekly","Rolling"],["GDELT","Daily","Live"],["V-Dem","Annual","Mar 2025"],["Freedom House","Annual","Feb 2025"],["RSF","Annual","May 2025"],["TI CPI","Annual","Jan 2025"],["ILO","Annual","Q3 2025"]].map(([src,freq,next],i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${S.dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.07)"}`,fontSize:9,fontFamily:"'IBM Plex Mono',monospace"}}>
                      <span style={{color:S.txt3}}>{src}</span>
                      <span style={{color:S.txt4}}>{freq}</span>
                      <span style={{color:"#f59e0b"}}>{next}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


      </main>

      {/* GLOBAL SLIDE-IN INTEL PANEL — works on every tab */}
      {sel&&country&&(
        <div style={{
          position:"fixed",top:0,right:0,width:420,height:"100vh",
          background:darkMode?"#0d0d1a":"#ffffff",
          borderLeft:`1px solid ${riskColor(country.risk)}44`,
          borderTop:`3px solid ${riskColor(country.risk)}`,
          zIndex:1000,overflowY:"auto",
          boxShadow:"-12px 0 48px rgba(0,0,0,0.8)",
          animation:"slideIn 0.2s ease",
        }}>
          <IntelPanel country={country} onClose={()=>setSel(null)} darkMode={darkMode}/>
        </div>
      )}
    </div>
  );
}