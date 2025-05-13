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
    if (typeof window === 'undefined') return;
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

  // Generate preview
  const runPreview = useCallback((): void => {
    setConsoleLogs([]);
    setErrorLogs([]);
    const doc = `
<html>
<head>
  <style>
    body { background: #fff; color: #000; padding: 1rem; margin: 0; font-family: sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    const send = (type, msg) => window.parent.postMessage({ type, message: msg }, '*');
    console.log = m => send('console', m);
    console.error = e => send('error', e.stack || e.toString());
    try { ${js} } catch (e) { send('error', e.stack || e.toString()); }
  </script>
</body>
</html>`;
    setSrcDoc(doc);
  }, [html, css, js]);

  // Auto-run
  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(runPreview, 300);
      return () => clearTimeout(timer);
    }
  }, [html, css, js, autoRun, runPreview]);

  // Listen for messages
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'console') setConsoleLogs(prev => [...prev, String(e.data.message)]);
      if (e.data?.type === 'error') setErrorLogs(prev => [...prev, String(e.data.message)]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Downloads
  const downloadFile = (content: string, name: string, type: string): void => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadZip = async (): Promise<void> => {
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
  const handleReset = (): void => {
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
  const handleClearConsole = (): void => setConsoleLogs([]);
  const handleClearErrors = (): void => setErrorLogs([]);
  const handleCopy = async (text: string): Promise<void> => { await navigator.clipboard.writeText(text); };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 ${theme}`}>
      {/* Header with controls */}
      <header className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-indigo-300">💻 Code Sandbox</h1>
        <div className="flex items-center space-x-2">
          <button title="Run Preview" onClick={runPreview} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            <Play className="w-5 h-5 text-indigo-400" />
          </button>
          <button title="Toggle Auto-Run" onClick={() => setAutoRun(p => !p)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            <RefreshCw className={`w-5 h-5 ${autoRun ? 'text-green-400' : 'text-gray-600'}`} />
          </button>
          <button title="Reset Code" onClick={handleReset} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            <Trash2 className="w-5 h-5 text-red-400" />
          </button>
          <div className="relative">
            <button title="Download Options" onClick={() => setShowDownloadMenu(p => !p)} className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
              <Archive className="w-5 h-5 text-indigo-400 mr-1" />
              <ChevronDown className="w-5 h-5 text-indigo-400" />
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-20 z-10">
                <button title="Download HTML" onClick={() => downloadFile(html, 'index.html', 'text/html')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">HTML</button>
                <button title="Download CSS" onClick={() => downloadFile(css, 'styles.css', 'text/css')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">CSS</button>
                <button title="Download JS" onClick={() => downloadFile(js, 'script.js', 'application/javascript')} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">JS</button>
                <button title="Download All as ZIP" onClick={() => void downloadZip()} className="w-full px-4 py-2 text-left text-sm text-gray-100 hover:bg-gray-700">All (ZIP)</button>
              </div>
            )}
          </div>
          <button title="Toggle Theme" onClick={() => setTheme(p => (p === 'dark' ? 'light' : 'dark'))} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-200" />}
          </button>
          <select title="Font Size" value={fontSize} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFontSize(e.target.value as any)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            <option value="text-sm">A</option>
            <option value="text-base">A</option>
            <option value="text-lg">A</option>
          </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Editors */}
        <div className="w-1/2 grid grid-rows-3 gap-6 p-6">
          {(['HTML','CSS','JavaScript'] as const).map((lang,idx)=>(
            <div key={lang} className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">
                {lang}
                <button title={`Copy ${lang}`} onClick={()=>handleCopy(idx===0?html:idx===1?css:js)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded-md">
                  <Type className="w-4 h-4 text-gray-200" />
                </button>
              </div>
              <textarea
                value={idx===0?html:idx===1?css:js}
                onChange={(e)=> idx===0?setHtml(e.target.value): idx===1?setCss(e.target.value):setJs(e.target.value)}
                placeholder={`Write your ${lang} here...`}
                className={`flex-1 p-4 bg-gray-900 text-gray-100 font-mono ${fontSize} rounded-b-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          ))}
        </div>
        {/* Preview + Logs/Errors */}
        <div className="w-1/2 flex flex-col p-6 gap-6">
          <div className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700 flex-1 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">Preview</div>
            <iframe srcDoc={srcDoc} title="Sandbox Preview" sandbox="allow-scripts allow-same-origin" frameBorder="0" className="flex-1 bg-white rounded-b-xl" />
          </div>
          <div className="flex flex-col">
            <div className="flex space-x-4 mb-2">
              <button onClick={()=>setActiveTab('console')} className={`px-4 py-2 rounded-t-lg ${activeTab==='console'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Logs</button>
              <button onClick={()=>setActiveTab('errors')} className={`px-4 py-2 rounded-t-lg ${activeTab==='errors'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Errors</button>
            </div>
            <div className="bg-gray-800 rounded-b-lg shadow-md border border-gray-700 overflow-auto p-4 font-mono text-xs text-gray-100 h-48">
              {activeTab==='console'? (
                consoleLogs.length===0? <div className="text-gray-500">No logs yet</div> : consoleLogs.map((m,i)=><div key={i}>{m}</div>)
              ):(
                errorLogs.length===0? <div className="text-gray-500">No errors</div> : errorLogs.map((e,i)=><div key={i}>{e}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
