'use client';

import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import {
  Play,
  RefreshCw,
  ChevronDown,
  Sun,
  Moon,
  Trash2,
  Archive,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-twilight';
import * as JSZip from 'jszip';

export default function CodeSandboxPage() {
  const defaultHtml = '<h1>Hello, world!</h1>';
  const defaultCss  = 'body { font-family: sans-serif; }';
  const defaultJs   = 'console.log("Hello, Sandbox!");';

  const [html, setHtml] = useState(defaultHtml);
  const [css,  setCss]  = useState(defaultCss);
  const [js,   setJs]   = useState(defaultJs);
  const [srcUrl, setSrcUrl] = useState<string>('');
  const [autoRun, setAutoRun] = useState(true);
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [fontSize, setFontSize] = useState<'text-sm'|'text-base'|'text-lg'>('text-sm');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [errorLogs,   setErrorLogs]   = useState<string[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [activeTab, setActiveTab]     = useState<'console'|'errors'>('console');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved code
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setHtml(localStorage.getItem('sandbox-html') || defaultHtml);
    setCss(localStorage.getItem('sandbox-css')   || defaultCss);
    setJs(localStorage.getItem('sandbox-js')     || defaultJs);
  }, []);

  // Persist on edits
  useEffect(() => { localStorage.setItem('sandbox-html', html); }, [html]);
  useEffect(() => { localStorage.setItem('sandbox-css', css);   }, [css]);
  useEffect(() => { localStorage.setItem('sandbox-js', js);     }, [js]);

  const aceFontSize = fontSize === 'text-sm' ? 12 : fontSize === 'text-base' ? 14 : 16;

  // Build data URL preview
  const runPreview = useCallback(() => {
    setConsoleLogs([]);
    setErrorLogs([]);

    const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin:0;padding:1rem;background:#fff;color:#000;font-family:sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script type="module">
    const send=(t,m)=>window.parent.postMessage({type:t,message:m},'*');
    console.log  = m => send('console', m);
    console.error= e => send('error', e.stack||e.toString());
  </script>
  <script type="module">
${js}
  </script>
</body>
</html>`;
    setSrcUrl('data:text/html;charset=utf-8,' + encodeURIComponent(doc));
  }, [html, css, js]);

  // Auto-run
  useEffect(() => {
    if (!autoRun) return;
    const id = setTimeout(runPreview, 300);
    return () => clearTimeout(id);
  }, [html, css, js, autoRun, runPreview]);

  // Listen console messages
 useEffect(() => {
  // Tell TS our message event carries { type: string; message: any }
  const handler = (e: MessageEvent<{ type: string; message: unknown }>) => {
    if (e.data.type === 'console') {
      setConsoleLogs(logs => [...logs, String(e.data.message)]);
    }
    if (e.data.type === 'error') {
      setErrorLogs(errs => [...errs, String(e.data.message)]);
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!previewRef.current) return;
    if (!isFullscreen) {
      previewRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Download helpers
  const downloadFile = (c: string, n: string, t: string) => {
    const b = new Blob([c], { type: t });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = n; a.click();
    URL.revokeObjectURL(u);
    setShowDownloadMenu(false);
  };
  const downloadZip = async () => {
    const zip = new JSZip.default();
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sandbox-files.zip'; a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  // Reset defaults
  const handleReset = () => {
    if (!confirm('Reset code to defaults?')) return;
    setHtml(defaultHtml);
    setCss(defaultCss);
    setJs(defaultJs);
    localStorage.removeItem('sandbox-html');
    localStorage.removeItem('sandbox-css');
    localStorage.removeItem('sandbox-js');
    setConsoleLogs([]);
    setErrorLogs([]);
  };

  return (
    <>
      <style jsx global>{`.ace_gutter{background:transparent!important}`}</style>

      {/* Navbar */}
      <nav className="bg-gray-800 text-gray-200 shadow">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-indigo-300">Sandbox</Link>
          <div className="flex space-x-4">
            <Link href="/" className="px-3 py-2 hover:bg-gray-700 rounded">Home</Link>
            <Link href="/sandbox" className="px-3 py-2 bg-gray-700 rounded text-white">Sandbox</Link>
            <Link href="/settings" className="px-3 py-2 hover:bg-gray-700 rounded">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-900 text-gray-200">
        {/* Toolbar */}
        <header className="flex items-center justify-end p-4 space-x-2 bg-gray-800/50 backdrop-blur-sm">
          <button onClick={runPreview} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><Play className="w-5 h-5 text-indigo-400"/></button>
          <button onClick={() => setAutoRun(a => !a)} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><RefreshCw className={`w-5 h-5 ${autoRun ? 'text-green-400':'text-gray-600'}`}/></button>
          <button onClick={handleReset} className="p-2 bg-gray-800 rounded hover:bg-gray-700"><Trash2 className="w-5 h-5 text-red-400"/></button>
          <div className="relative">
            <button onClick={() => setShowDownloadMenu(m => !m)} className="flex items-center p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Archive className="w-5 h-5 text-indigo-400 mr-1"/><ChevronDown className="w-5 h-5 text-indigo-400"/>
            </button>
            {showDownloadMenu && (
              <div className="absolute right-0 bg-gray-800 rounded shadow mt-2 ring-1 ring-black ring-opacity-20">
                <button onClick={() => downloadFile(html,'index.html','text/html')} className="block px-4 py-2 hover:bg-gray-700">HTML</button>
                <button onClick={() => downloadFile(css,'styles.css','text/css')} className="block px-4 py-2 hover:bg-gray-700">CSS</button>
                <button onClick={() => downloadFile(js,'script.js','application/javascript')} className="block px-4 py-2 hover:bg-gray-700">JS</button>
                <button onClick={downloadZip} className="block px-4 py-2 hover:bg-gray-700">ZIP</button>
              </div>
            )}
          </div>
          <button onClick={() => setTheme(t => t==='dark'?'light':'dark')} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
            {theme==='dark'?<Sun className="w-5 h-5 text-yellow-400"/>:<Moon className="w-5 h-5 text-blue-200"/>}
          </button>
          <select value={fontSize} onChange={e => setFontSize(e.target.value as 'text-sm'|'text-base'|'text-lg')} className="p-2 bg-gray-800 rounded hover:bg-gray-700">
            <option value="text-sm">A</option>
            <option value="text-base">A</option>
            <option value="text-lg">A</option>
          </select>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Editors */}
          <div className="w-1/2 grid grid-rows-3 gap-4 p-4">
            {[
              { label:'HTML', value:html, onChange:setHtml, mode:'html' as const },
              { label:'CSS',  value:css,  onChange:setCss,  mode:'css' as const },
              { label:'JS',   value:js,   onChange:setJs,   mode:'javascript' as const },
            ].map((e,i)=>(
              <div key={i} className="flex flex-col bg-gray-800 rounded border border-gray-700 shadow">
                <div className="px-4 py-2 border-b border-gray-700 text-indigo-300">{e.label}</div>
                <AceEditor
                  mode={e.mode}
                  theme="twilight"
                  value={e.value}
                  onChange={e.onChange}
                  name={`${e.mode}Editor`}
                  editorProps={{ $blockScrolling:true }}
                  setOptions={{ showLineNumbers:true, tabSize:2, useWorker:false }}
                  width="100%"
                  height="100%"
                  fontSize={aceFontSize}
                  style={{ background:'transparent' }}
                />
              </div>
            ))}
          </div>

          {/* Preview + Logs */}
          <div className="w-1/2 p-4 flex flex-col gap-4">
            <div ref={previewRef} className="relative flex-1 bg-gray-800 rounded border border-gray-700 shadow overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-700 text-indigo-300">Preview</div>
              {srcUrl
                ? <iframe src={srcUrl} sandbox="allow-scripts" className="w-full h-full"/>
                : <div className="w-full h-full flex items-center justify-center text-gray-500">Waiting for preview…</div>
              }
              <button onClick={toggleFullscreen} className="absolute bottom-2 right-2 p-2 bg-gray-800 rounded-full shadow hover:bg-gray-700" title={isFullscreen?'Exit Fullscreen':'Enter Fullscreen'}>
                {isFullscreen? <Minimize2 className="w-5 h-5 text-indigo-400"/> : <Maximize2 className="w-5 h-5 text-indigo-400"/>}
              </button>
            </div>

            <div className="flex-none">
              <div className="flex space-x-4 mb-2">
                <button onClick={()=>setActiveTab('console')} className={`px-4 py-2 rounded-t-lg ${activeTab==='console'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Logs</button>
                <button onClick={()=>setActiveTab('errors')}  className={`px-4 py-2 rounded-t-lg ${activeTab==='errors'?'bg-gray-800 text-white':'bg-gray-700 text-gray-400'}`}>Errors</button>
              </div>
              <div className="bg-gray-800 rounded-b-lg border border-gray-700 shadow overflow-auto p-4 font-mono text-xs text-gray-100 h-32">
                {(activeTab==='console' ? consoleLogs : errorLogs).length === 0
                  ? <div className="text-gray-500">No {activeTab} yet</div>
                  : (activeTab==='console' ? consoleLogs : errorLogs).map((l,idx)=><div key={idx}>{l}</div>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
