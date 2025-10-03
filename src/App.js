import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Globe, Activity, Database, Moon, Sun, Bell, BellOff, MessageCircle, History, ArrowUp, ArrowDown, X } from 'lucide-react';

const ThreatDashboard = () => {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [country, setCountry] = useState('All');
  const [threatType, setThreatType] = useState('All');
  const [dateRange, setDateRange] = useState('7');
  const [alerts, setAlerts] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [showWA, setShowWA] = useState(false);
  const [waOn, setWaOn] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [historical, setHistorical] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    anom: 0,
    top: 'N/A'
  });

  // Initial data load
  useEffect(() => {
    const countries = ['US','IN','CN','RU','DE','BR','FR','JP','GB','AU'];
    const types = ['Malware','Phishing','DDoS','Botnet','Ransomware'];
    const d = Array.from({length:100}, (_,i) => ({
      id:i+1,
      ip:`192.168.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`,
      country:countries[Math.floor(Math.random()*countries.length)],
      type:types[Math.floor(Math.random()*types.length)],
      conf:Math.floor(Math.random()*51)+50,
      time:new Date(Date.now()-Math.random()*7*24*60*60*1000).toISOString()
    }));
    setData(d);

    const h = [];
    for(let i=29;i>=0;i--){
      const dt=new Date();
      dt.setDate(dt.getDate()-i);
      h.push({
        date:dt.toLocaleDateString('en',{month:'short',day:'numeric'}),
        threats:Math.floor(Math.random()*50)+50,
        malware:Math.floor(Math.random()*20)+10,
        phishing:Math.floor(Math.random()*15)+8,
        ddos:Math.floor(Math.random()*10)+5,
        highRisk:Math.floor(Math.random()*20)+10,
        anomalies:Math.floor(Math.random()*8)+2
      });
    }
    setHistorical(h);
  },[]);

  // Alert notifications
  useEffect(() => {
    if(!alerts) return;
    const int = setInterval(() => {
      const n = {
        id:Date.now(),
        type:['Critical','High','Medium'][Math.floor(Math.random()*3)],
        msg:['New Ransomware from Russia','DDoS spike detected','Phishing campaign found','Botnet activity increased'][Math.floor(Math.random()*4)],
        time:new Date().toLocaleTimeString()
      };
      setNotifs(p=>[n,...p].slice(0,5));
      if(waOn && whatsapp){
        const txt=`🚨 ALERT\n${n.type}: ${n.msg}\nTime: ${n.time}`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(txt)}`,'_blank');
      }
    },8000);
    return ()=>clearInterval(int);
  },[alerts,waOn,whatsapp]);

  // Calculate stats
  useEffect(() => {
    if(data.length === 0) return;

    let filtered = [...data];
    if(country!=='All') filtered=filtered.filter(d=>d.country===country);
    if(threatType!=='All') filtered=filtered.filter(d=>d.type===threatType);
    const thresh=new Date();
    thresh.setDate(thresh.getDate()-parseInt(dateRange));
    filtered=filtered.filter(d=>new Date(d.time)>=thresh);

    const anomalies = filtered.filter(d=>d.conf<60||d.conf>95);
    const topCountry = country!=='All'?country:(filtered.length>0?filtered[0].country:'US');

    setStats({
      total:filtered.length,
      high:filtered.filter(d=>d.conf>85).length,
      anom:anomalies.length,
      top:topCountry
    });
  }, [data, country, threatType, dateRange]);

  const getFilteredData = () => {
    let filtered = [...data];
    if(country!=='All') filtered=filtered.filter(d=>d.country===country);
    if(threatType!=='All') filtered=filtered.filter(d=>d.type===threatType);
    const thresh=new Date();
    thresh.setDate(thresh.getDate()-parseInt(dateRange));
    filtered=filtered.filter(d=>new Date(d.time)>=thresh);
    return filtered;
  };

  const filtered = getFilteredData();

  const typeData = filtered.reduce((a,c)=>{
    const e=a.find(i=>i.name===c.type);
    if(e)e.value+=1;
    else a.push({name:c.type,value:1});
    return a;
  },[]);

  const countryData = filtered.reduce((a,c)=>{
    const e=a.find(i=>i.name===c.country);
    if(e)e.value+=1;
    else a.push({name:c.country,value:1});
    return a;
  },[]).sort((a,b)=>b.value-a.value).slice(0,5);

  const COLORS=['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'];
  const glass=darkMode?'backdrop-blur-xl bg-white/5 border border-white/10':'backdrop-blur-xl bg-white/40 border border-white/30';
  const txt1=darkMode?'text-white':'text-gray-900';
  const txt2=darkMode?'text-slate-300':'text-gray-700';

  const getAvg=(k)=>historical.length?Math.floor(historical.reduce((a,d)=>a+d[k],0)/historical.length):0;
  const getTrend=(cur,avg)=>{
    if(avg === 0) return {val:0,up:false,pct:0};
    const ch=((cur-avg)/avg*100).toFixed(1);
    return {val:Math.abs(ch),up:ch>0,pct:ch};
  };
  const trendT=getTrend(stats.total,getAvg('threats'));
  const trendH=getTrend(stats.high,getAvg('highRisk'));
  const trendA=getTrend(stats.anom,getAvg('anomalies'));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10" style={{background:darkMode?'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)':'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 50%,#dbeafe 100%)'}}/>
      
      <div className="relative z-10 p-6">
        <div className="mb-6 flex justify-between items-start flex-wrap gap-4">
          <div className={`${glass} rounded-2xl p-6 shadow-2xl`}>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10 text-blue-400 animate-pulse"/>
              <h1 className={`text-4xl font-bold ${txt1}`}>Threat Intelligence Dashboard</h1>
            </div>
            <p className={txt2}>Real-time Cyber Threat Monitoring & Analysis</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button onClick={()=>setShowHist(true)} className={`${glass} px-5 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-2`}>
              <History className="w-5 h-5 text-purple-400"/>
              <span className={`${txt1} font-semibold`}>Historical</span>
            </button>
            
            <button onClick={()=>setShowWA(true)} className={`${glass} px-5 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-2`}>
              <MessageCircle className={`w-5 h-5 ${waOn?'text-green-400':'text-emerald-400'}`}/>
              <span className={`${txt1} font-semibold`}>{waOn?'WhatsApp ON':'WhatsApp'}</span>
            </button>
            
            <button onClick={()=>setAlerts(!alerts)} className={`${glass} px-5 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-2`}>
              {alerts?<BellOff className="w-5 h-5 text-red-400"/>:<Bell className="w-5 h-5 text-blue-400"/>}
              <span className={`${txt1} font-semibold`}>{alerts?'Disable':'Enable'} Alerts</span>
            </button>
            
            <select value={dateRange} onChange={(e)=>setDateRange(e.target.value)} className={`${glass} px-4 py-4 ${txt1} rounded-2xl outline-none cursor-pointer font-semibold`}>
              <option value="1" style={{background:darkMode?'#1e293b':'#fff'}}>📅 24 Hours</option>
              <option value="7" style={{background:darkMode?'#1e293b':'#fff'}}>📅 7 Days</option>
              <option value="30" style={{background:darkMode?'#1e293b':'#fff'}}>📅 30 Days</option>
            </select>
            
            <select value={threatType} onChange={(e)=>setThreatType(e.target.value)} className={`${glass} px-4 py-4 ${txt1} rounded-2xl outline-none cursor-pointer font-semibold`}>
              <option value="All" style={{background:darkMode?'#1e293b':'#fff'}}>🔒 All Threats</option>
              {['Malware','Phishing','DDoS','Botnet','Ransomware'].map(t=><option key={t} value={t} style={{background:darkMode?'#1e293b':'#fff'}}>🔒 {t}</option>)}
            </select>
            
            <select value={country} onChange={(e)=>setCountry(e.target.value)} className={`${glass} px-4 py-4 ${txt1} rounded-2xl outline-none cursor-pointer font-semibold`}>
              <option value="All" style={{background:darkMode?'#1e293b':'#fff'}}>🌍 All Countries</option>
              {['US','IN','CN','RU','DE','BR','FR','JP','GB','AU'].map(c=><option key={c} value={c} style={{background:darkMode?'#1e293b':'#fff'}}>🌍 {c}</option>)}
            </select>
            
            <button onClick={()=>setDarkMode(!darkMode)} className={`${glass} p-4 rounded-2xl shadow-2xl hover:scale-110 transition-all`}>
              {darkMode?<Sun className="w-6 h-6 text-yellow-400"/>:<Moon className="w-6 h-6 text-slate-700"/>}
            </button>
          </div>
        </div>

        {alerts&&notifs.length>0&&(
          <div className="fixed top-20 right-6 z-50 space-y-3 max-w-md">
            {notifs.map(n=>(
              <div key={n.id} className={`${glass} rounded-2xl p-4 shadow-2xl ${n.type==='Critical'?'border-2 border-red-500/50':'border border-orange-500/50'}`}>
                <div className="flex justify-between gap-3">
                  <div className="flex gap-3 flex-1">
                    <AlertTriangle className={`w-5 h-5 ${n.type==='Critical'?'text-red-400':'text-yellow-400'}`}/>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${n.type==='Critical'?'bg-red-500/30 text-red-300':'bg-yellow-500/30 text-yellow-300'}`}>{n.type}</span>
                        <span className={`text-xs ${txt2}`}>{n.time}</span>
                      </div>
                      <p className={`text-sm ${txt1}`}>{n.msg}</p>
                    </div>
                  </div>
                  <button onClick={()=>setNotifs(p=>p.filter(x=>x.id!==n.id))} className="hover:bg-white/10 p-1 rounded">
                    <X className={`w-4 h-4 ${txt2}`}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            {label:'Total Threats',val:stats.total,icon:Database,color:'blue',trend:trendT},
            {label:'High Risk',val:stats.high,icon:AlertTriangle,color:'red',trend:trendH},
            {label:'Anomalies',val:stats.anom,icon:Activity,color:'yellow',trend:trendA},
            {label:'Top Country',val:stats.top,icon:Globe,color:'green'}
          ].map((s,i)=>(
            <div key={i} className={`${glass} rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all`}>
              <div className="flex justify-between">
                <div>
                  <p className={`${txt2} text-sm mb-1`}>{s.label}</p>
                  <p className={`text-4xl font-bold text-${s.color}-400`}>{s.val}</p>
                  {s.trend&&s.trend.val>0&&(
                    <div className="flex items-center gap-1 mt-2">
                      {s.trend.up?<ArrowUp className="w-4 h-4 text-red-400"/>:<ArrowDown className="w-4 h-4 text-green-400"/>}
                      <span className={`text-xs font-semibold ${s.trend.up?'text-red-400':'text-green-400'}`}>{s.trend.val}% vs avg</span>
                    </div>
                  )}
                </div>
                <s.icon className={`w-14 h-14 text-${s.color}-400 opacity-90`}/>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className={`${glass} rounded-2xl p-6 shadow-2xl`}>
            <h2 className={`text-xl font-bold ${txt1} mb-4 flex items-center gap-2`}>
              <Activity className="w-5 h-5 text-blue-400"/>
              Threat Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                  {typeData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor:darkMode?'#1e293b':'#fff',border:'1px solid #3b82f6',borderRadius:'8px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={`${glass} rounded-2xl p-6 shadow-2xl`}>
            <h2 className={`text-xl font-bold ${txt1} mb-4 flex items-center gap-2`}>
              <Globe className="w-5 h-5 text-green-400"/>
              Top 5 Countries
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#334155':'#cbd5e1'} opacity={0.3}/>
                <XAxis dataKey="name" stroke={darkMode?'#94a3b8':'#64748b'}/>
                <YAxis stroke={darkMode?'#94a3b8':'#64748b'}/>
                <Tooltip contentStyle={{backgroundColor:darkMode?'#1e293b':'#fff',border:'1px solid #3b82f6',borderRadius:'8px'}}/>
                <Bar dataKey="value" fill="#3b82f6" radius={[8,8,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {showWA&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.7)'}}>
            <div className={`${glass} rounded-3xl p-8 shadow-2xl max-w-md w-full`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-green-400"/>
                  <h2 className={`text-2xl font-bold ${txt1}`}>WhatsApp Setup</h2>
                </div>
                <button onClick={()=>setShowWA(false)} className="hover:bg-white/10 p-2 rounded-lg">
                  <X className={`w-6 h-6 ${txt2}`}/>
                </button>
              </div>
              <p className={`${txt2} mb-4 text-sm`}>Enter your WhatsApp number with country code (e.g., 919876543210)</p>
              <input 
                type="tel" 
                placeholder="919876543210" 
                value={whatsapp} 
                onChange={(e)=>setWhatsapp(e.target.value.replace(/\D/g,''))} 
                className={`w-full px-4 py-3 rounded-xl ${darkMode?'bg-slate-700/50 text-white border-slate-600':'bg-gray-100 text-gray-900 border-gray-300'} border outline-none focus:ring-2 focus:ring-green-500 mb-4`}
              />
              <button 
                onClick={()=>{
                  if(whatsapp.length>=10){
                    setWaOn(true);
                    setShowWA(false);
                    alert('✅ WhatsApp alerts activated!');
                  } else {
                    alert('❌ Please enter a valid phone number (10+ digits)');
                  }
                }} 
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
              >
                Activate WhatsApp Alerts
              </button>
            </div>
          </div>
        )}

        {showHist&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{backgroundColor:'rgba(0,0,0,0.8)'}}>
            <div className={`${glass} rounded-3xl p-8 shadow-2xl w-full max-w-6xl my-8`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <History className="w-8 h-8 text-purple-400"/>
                  <h2 className={`text-3xl font-bold ${txt1}`}>Historical Data Analysis</h2>
                </div>
                <button onClick={()=>setShowHist(false)} className="hover:bg-white/10 p-2 rounded-lg">
                  <X className={`w-6 h-6 ${txt2}`}/>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className={`${darkMode?'bg-slate-700/30':'bg-white/50'} rounded-xl p-6 border ${darkMode?'border-slate-600/50':'border-gray-300/50'}`}>
                  <h3 className={`text-lg font-bold ${txt1} mb-4`}>30-Day Threat Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historical}>
                      <defs>
                        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#334155':'#cbd5e1'} opacity={0.3}/>
                      <XAxis dataKey="date" stroke={darkMode?'#94a3b8':'#64748b'}/>
                      <YAxis stroke={darkMode?'#94a3b8':'#64748b'}/>
                      <Tooltip contentStyle={{backgroundColor:darkMode?'#1e293b':'#fff',border:'1px solid #3b82f6',borderRadius:'8px'}}/>
                      <Area type="monotone" dataKey="threats" stroke="#3b82f6" fillOpacity={1} fill="url(#colorThreats)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className={`${darkMode?'bg-slate-700/30':'bg-white/50'} rounded-xl p-6 border ${darkMode?'border-slate-600/50':'border-gray-300/50'}`}>
                  <h3 className={`text-lg font-bold ${txt1} mb-4`}>Threat Types Over Time</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={historical}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#334155':'#cbd5e1'} opacity={0.3}/>
                      <XAxis dataKey="date" stroke={darkMode?'#94a3b8':'#64748b'}/>
                      <YAxis stroke={darkMode?'#94a3b8':'#64748b'}/>
                      <Tooltip contentStyle={{backgroundColor:darkMode?'#1e293b':'#fff',border:'1px solid #3b82f6',borderRadius:'8px'}}/>
                      <Legend/>
                      <Line type="monotone" dataKey="malware" stroke="#ef4444" strokeWidth={2} dot={false}/>
                      <Line type="monotone" dataKey="phishing" stroke="#f97316" strokeWidth={2} dot={false}/>
                      <Line type="monotone" dataKey="ddos" stroke="#eab308" strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatDashboard;