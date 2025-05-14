'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Link from 'next/link';
import {
  Laptop,
  Play,
  RefreshCw,
  ChevronDown,
  Sun,
  Moon,
  Trash2,
  Archive,
} from 'lucide-react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';

import * as JSZip from 'jszip'; // Changed to import * as

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHtml(localStorage.getItem('sandbox-html') || defaultHtml);
    setCss(localStorage.getItem('sandbox-css') || defaultCss);
    setJs(localStorage.getItem('sandbox-js') || defaultJs);
  }, []);

  useEffect(() => { localStorage.setItem('sandbox-html', html); }, [html]);
  useEffect(() => { localStorage.setItem('sandbox-css', css); }, [css]);
  useEffect(() => { localStorage.setItem('sandbox-js', js); }, [js]);

  const aceFontSize = fontSize === 'text-sm' ? 12 : fontSize === 'text-base' ? 14 : 16;

  const runPreview = useCallback(() => {
    setConsoleLogs([]);
    setErrorLogs([]);
    const doc = `
<html>
<head>
  <style>
    body { margin:0;padding:1rem;background:#fff;color:#000;font-family:sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    const send=(type,msg)=>window.parent.postMessage({type,message:msg},'*');
    console.log=m=>send('console',m);
    console.error=e=>send('error',e.stack||e.toString());
    try{${js}}catch(e){send('error',e.stack||e.toString());}
  </script>
</body>
</html>`;
    setSrcDoc(doc);
  }, [html, css, js]);

  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(runPreview, 300);
    return () => clearTimeout(timer);
  }, [html, css, js, autoRun, runPreview]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'console') setConsoleLogs(prev => [...prev, String(e.data.message)]);
      if (e.data?.type === 'error') setErrorLogs(prev => [...prev, String(e.data.message)]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const downloadFile = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip.default();
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sandbox-files.zip'; a.click(); URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const handleReset = () => {
    if (!confirm('Reset code to defaults?')) return;
    setHtml(defaultHtml); setCss(defaultCss); setJs(defaultJs);
    localStorage.removeItem('sandbox-html'); localStorage.removeItem('sandbox-css'); localStorage.removeItem('sandbox-js');
    setConsoleLogs([]); setErrorLogs([]);
  };

  return (
    <>
      <style jsx global>{` .ace_gutter { background: transparent !important; } `}</style>
      {/* Navigation */}
      <nav className="bg-gray-800 text-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-indigo-300 hover:text-indigo-200 transition">
                Simple Sandbox
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                About
              </Link>
              <Link href="/sandbox" className="px-3 py-2 rounded-md text-sm font-medium bg-gray-700 text-white transition">
                Sandbox
              </Link>
              <Link href="/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className={`flex flex-col h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 ${theme}`}>
        <header className="flex items-center justify-end p-4 space-x-2 bg-transparent backdrop-blur-sm">
          <button onClick={runPreview} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Play className="w-5 h-5 text-indigo-400" /></button>
          <button onClick={() => setAutoRun(a => !a)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><RefreshCw className={`w-5 h-5 ${autoRun ? 'text-green-400' : 'text-gray-600'}`} /></button>
          <button onClick={handleReset} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Trash2 className="w-5 h-5 text-red-400" /></button>
          <div className="relative">
            <button onClick={() => setShowDownloadMenu(m => !m)} className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-md"><Archive className="w-5 h-5 text-indigo-400 mr-1" /><ChevronDown className="w-5 h-5 text-indigo-400" /></button>
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-20 z-10">
                <button onClick={() => downloadFile(html, 'index.html', 'text/html')} className="block w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700">HTML</button>
                <button onClick={() => downloadFile(css, 'styles.css', 'text/css')} className="block w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700">CSS</button>
                <button onClick={() => downloadFile(js, 'script.js', 'application/javascript')} className="block w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700">JS</button>
                <button onClick={downloadZip} className="block w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700">All (ZIP)</button>
              </div>
            )}
          </div>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">{theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-200" />}</button>
          <select value={fontSize} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFontSize(e.target.value as 'text-sm' | 'text-base' | 'text-lg')} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
            <option value="text-sm">A</option>
            <option value="text-base">A</option>
            <option value="text-lg">A</option>
          </select>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/2 grid grid-rows-3 gap-4 p-4">
            {[{ label: 'HTML', value: html, onChange: setHtml, mode: 'html' }, { label: 'CSS', value: css, onChange: setCss, mode: 'css' }, { label: 'JavaScript', value: js, onChange: setJs, mode: 'javascript' }].map((e, i) => (
              <div key={i} className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700">
                <div className="px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">{e.label}</div>
                <div className="flex-1">
                  <AceEditor
                    mode={e.mode}
                    theme="twilight"
                    value={e.value}
                    onChange={e.onChange}
                    name={`${e.mode}Editor`}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{ showLineNumbers: true, tabSize: 2, useWorker: false }}
                    width="100%"
                    height="100%"
                    fontSize={aceFontSize}
                    style={{ background: 'transparent' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2 flex flex-col p-4 gap-4">
            <div className="flex flex-col bg-gray-800 rounded-xl shadow-md border border-gray-700 flex-1 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-700 text-indigo-300 font-medium">Preview</div>
              <iframe srcDoc={srcDoc} sandbox="allow-scripts allow-same-origin" className="w-full h-full" />
            </div>
            <div className="flex flex-col flex-none">
              <div className="flex space-x-4 mb-2">
                <button onClick={() => setActiveTab('console')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'console' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-400'}`}>Logs</button>
                <button onClick={() => setActiveTab('errors')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'errors' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-400'}`}>Errors</button>
              </div>
              <div className="bg-gray-800 rounded-b-lg shadow-md border border-gray-700 overflow-auto p-4 font-mono text-xs text-gray-100 h-32">
                {(activeTab === 'console' ? consoleLogs : errorLogs).length === 0 ? (<div className="text-gray-500">No {activeTab} yet</div>) : (activeTab === 'console' ? consoleLogs : errorLogs).map((l, idx) => <div key={idx}>{l}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}