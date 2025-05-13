'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Play,
  RefreshCw,
  ChevronDown,
  Sun,
  Moon,
  Trash2,
  Type,
  Archive,
} from 'lucide-react';
// @ts-ignore: JSZip may not have type declarations
const JSZip = require('jszip');

export default function CodeSandboxPage() {
  const defaultHtml = '<h1>Hello, world!</h1>';
  const defaultCss = 'body { font-family: sans-serif; }';
  const defaultJs = 'console.log("Hello, Sandbox!");';

  const [html, setHtml] = useState<string>(defaultHtml);
  const [css, setCss] = useState<string>(defaultCss);
  const [js, setJs] = useState<string>(defaultJs);
  const [srcDoc, setSrcDoc] = useState<string>('');
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg'>('text-sm');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'console' | 'errors'>('console');

  // Load saved code
  useEffect(() => {
    if (!window) return;
    const h = localStorage.getItem('sandbox-html');
    const c = localStorage.getItem('sandbox-css');
    const j = localStorage.getItem('sandbox-js');
    if (h) setHtml(h);
    if (c) setCss(c);
    if (j) setJs(j);
  }, []);

  // Persist code
  useEffect(() => { localStorage.setItem('sandbox-html', html); }, [html]);
  useEffect(() => { localStorage.setItem('sandbox-css', css); }, [css]);
  useEffect(() => { localStorage.setItem('sandbox-js', js); }, [js]);

  // Generate preview, send errors to errorLogs
  const runPreview = useCallback(() => {
    setConsoleLogs([]);
    setErrorLogs([]);
    const doc = `
<html>
<head>
  <style>
    body { margin:0; padding:1rem; background:#fff; color:#000; font-family:sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    const send = (type, msg) => window.parent.postMessage({ type, message: msg }, '*');
    console.log = m => send('console', m);
    console.error = e => send('error', e.stack || e.toString());
    try {
      ${js}
    } catch (e) {
      send('error', e.stack || e.toString());
    }
  </script>
</body>
</html>`;
    setSrcDoc(doc);
  }, [html, css, js]);

  // Auto-run
  useEffect(() => {
    if (autoRun) {
      const t = setTimeout(runPreview, 300);
      return () => clearTimeout(t);
    }
  }, [html, css, js, autoRun, runPreview]);

  // Listen for logs and errors
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'console') setConsoleLogs(prev => [...prev, e.data.message]);
      if (e.data?.type === 'error') setErrorLogs(prev => [...prev, e.data.message]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // File downloads
  const downloadFile = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sandbox-files.zip';
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  // Handlers
  const handleReset = () => {
    if (confirm('Reset code to defaults?')) {
      setHtml(defaultHtml);
      setCss(defaultCss);
      setJs(defaultJs);
      localStorage.removeItem('sandbox-html');
      localStorage.removeItem('sandbox-css');
      localStorage.removeItem('sandbox-js');
      setConsoleLogs([]);
      setErrorLogs([]);
    }
  };
  const clearConsole = () => setConsoleLogs([]);
  const clearErrors = () => setErrorLogs([]);
  const copyText = async (text: string) => await navigator.clipboard.writeText(text);

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 ${theme}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-indigo-300">💻 Code Sandbox</h1>
        <div className="flex items-center space-x-2">
          <button onClick={runPreview} title="Run Preview" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Play className="w-5 h-5 text-indigo-400" /></button>
          <button onClick={() => setAutoRun(p => !p)} title="Toggle Auto-Run" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><RefreshCw className={`w-5 h-5 ${autoRun?'text-green-400':'text-gray-600'}`} /></button>
          <button onClick={handleReset} title="Reset Code" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Trash2 className="w-5 h-5 text-red-400" /></button>
          <div className="relative">
            <button onClick={() => setShowDownloadMenu(p => !p)} title="Download Options" className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Archive className="w-5 h-5 text-indigo-400 mr-1" /><ChevronDown className="w-5 h-5 text-indigo-400" /></button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-20 z-10">
                <button onClick={() => downloadFile(html,'index.html','text/html')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">HTML</button>
                <button onClick={() => downloadFile(css,'styles.css','text/css')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">CSS</button>
                <button onClick={() => downloadFile(js,'script.js','application/javascript')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">JS</button>
                <button onClick={() => downloadZip()} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">All (ZIP)</button>
              </div>
            )}
          </div>
          <button onClick={() => setTheme(p => p==='dark'?'light':'dark')} title="Toggle Theme" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">{theme==='dark'?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 text-blue-200"/>}</button>
          <select value={fontSize} onChange={(e)=>setFontSize(e.target.value as any)} title="Font Size" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><option value="text-sm">A</option><option value="text-base">A</option><option value="text-lg">A</option></select>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editors */}
        <div className="w-1/2 grid grid-rows-3 gap-6 p-6">
          {(['HTML','CSS','JavaScript'] as const).map((lang,i)=>(
            <div key={lang} className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">{lang}<button onClick={()=>copyText(i===0?html:i===1?css:js)} title={`Copy ${lang}`} className="p-1 bg-gray-700 hover:bg-gray-600 rounded-md"><Type className="w-4 h-4 text-gray-200"/></button></div>
              <textarea value={i===0?html:i===1?css:js} onChange={(e)=>i===0?setHtml(e.target.value):i===1?setCss(e.target.value):setJs(e.target.value)} placeholder={`Write your ${lang} here...`} className={`flex-1 p-4 bg-gray-900 text-gray-100 font-mono ${fontSize} rounded-b-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}/>
            </div>
          ))}
        </div>

        {/* Preview & Console/Errors */}
        <div className="w-1/2 flex flex-col p-6 gap-6">
          {/* Preview */}
          <div className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700 flex-1 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">Preview</div>
            <iframe srcDoc={srcDoc} title="Sandbox Preview" sandbox="allow-scripts allow-same-origin" frameBorder="0" className="flex-1 bg-white rounded-b-xl" />
          </div>
          {/* Logs/Errors Tabs */}
          <div className="flex flex-col">
            <div className="flex space-x-4 mb-2"><button onClick={()=>setActiveTab('console')} className={`px-4 py-2 rounded-t-lg ${activeTab==='console'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Logs</button><button onClick={()=>setActiveTab('errors')} className={`px-4 py-2 rounded-t-lg ${activeTab==='errors'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Errors</button></div>
            <div className="bg-gray-800 rounded-b-lg shadow-md border border-gray-700 overflow-auto p-4 font-mono text-xs text-gray-100 h-48">
              {activeTab==='console'?consoleLogs.length?consoleLogs.map((m,i)=><div key={i}>{m}</div>):<div className="text-gray-500">No logs yet</div>:errorLogs.length?errorLogs.map((e,i)=><div key={i}>{e}</div>):<div className="text-gray-500">No errors</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
