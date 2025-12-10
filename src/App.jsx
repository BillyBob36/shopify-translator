import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, Download, Play, Square, Settings, FileText, AlertCircle, CheckCircle, Key, Languages, Sliders, ChevronDown, Clock } from 'lucide-react';
import { BatchProcessor, LANGUAGES, analyzeCSVTokens, getPromptForLanguage } from './services';

const SOURCE_COLUMN_INDEX = 6;
const DEST_COLUMN_INDEX = 7;

function App() {
  const [csvData, setCsvData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const [sourceColumnName, setSourceColumnName] = useState('');
  const [destColumnName, setDestColumnName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [startRow, setStartRow] = useState(2);
  const [rowLimit, setRowLimit] = useState(0);
  const [temperature, setTemperature] = useState(0.3);
  const [maxRPM, setMaxRPM] = useState(4900);
  const [maxTPM, setMaxTPM] = useState(3500000);
  const [saveEveryNRows, setSaveEveryNRows] = useState(500);
  const [partialResult, setPartialResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [costEstimate, setCostEstimate] = useState(null);
  const processorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setResult(null);
    setCostEstimate(null);
    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Erreur lors de la lecture du fichier CSV');
          return;
        }
        setCsvData(results.data);
        const cols = results.meta.fields || [];
        setColumns(cols);
        if (cols.length > SOURCE_COLUMN_INDEX) setSourceColumnName(cols[SOURCE_COLUMN_INDEX]);
        if (cols.length > DEST_COLUMN_INDEX) setDestColumnName(cols[DEST_COLUMN_INDEX]);
      },
      error: (err) => setError('Erreur: ' + err.message)
    });
  };

  const calculateEstimate = () => {
    if (!csvData || !sourceColumnName) return;
    const promptTemplate = getPromptForLanguage(targetLanguage);
    const analysis = analyzeCSVTokens(csvData, sourceColumnName, promptTemplate, targetLanguage, startRow, rowLimit);
    const inputCost = (analysis.totalInputTokens / 1000000) * 0.40;
    const outputCost = (analysis.totalOutputTokens / 1000000) * 1.60;
    setCostEstimate({ ...analysis, estimatedCost: (inputCost + outputCost).toFixed(4) });
  };

  const startProcessing = async () => {
    if (!apiKey) { setError('Veuillez entrer votre cle API OpenAI'); return; }
    if (!csvData || !sourceColumnName) { setError('Veuillez charger un fichier CSV valide'); return; }
    setError('');
    setIsProcessing(true);
    setProgress(null);
    setResult(null);
    setPartialResult(null);

    const config = {
      startRow, rowLimit, temperature, maxRPM, maxTPM, saveEveryNRows,
      targetLangCode: targetLanguage,
      sourceColumn: sourceColumnName,
      destColumn: destColumnName
    };

    processorRef.current = new BatchProcessor(apiKey, config);

    try {
      const translatedData = await processorRef.current.processCSV(
        csvData,
        (progressInfo) => setProgress(progressInfo),
        (data, count) => setPartialResult({ data, completedOps: count, timestamp: Date.now() })
      );
      setResult(translatedData);
      setPartialResult(null);
      setProgress(prev => ({ ...prev, percentage: 100, completed: true }));
    } catch (err) {
      if (err.message !== 'Traitement annule') setError('Erreur: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopProcessing = () => {
    if (processorRef.current) processorRef.current.abort();
    setIsProcessing(false);
  };

  const downloadResult = (data, suffix) => {
    const d = data || result;
    const s = suffix || '_translated';
    if (!d) return;
    const csv = Papa.unparse(d);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.csv', s + '.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPartial = () => {
    if (!partialResult) return;
    downloadResult(partialResult.data, '_partial');
  };

  const getTargetLanguageName = () => LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Languages className="w-10 h-10 text-blue-400" />
            Shopify Translator
          </h1>
          <p className="text-slate-400">Traduction Shopify par IA (GPT-4.1-mini) - HTTP/2 Parallel</p>
        </div>

        {isProcessing && (
          <div className="bg-blue-900/50 rounded-xl p-6 mb-6 border border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Traduction en cours vers {getTargetLanguageName()}</p>
                  <p className="text-blue-300 text-sm">{fileName}</p>
                </div>
              </div>
              <button onClick={stopProcessing} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                <Square className="w-4 h-4" />
                Interrompre
              </button>
            </div>
          </div>
        )}

        {!isProcessing && (
          <>
            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Cle API OpenAI</h2>
              </div>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition" />
            </div>

            <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white">Fichier CSV</h2>
              </div>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">{fileName || 'Cliquez pour selectionner un fichier CSV'}</p>
                {csvData && <p className="text-sm text-slate-500 mt-2">{csvData.length} lignes - Colonne G vers Colonne H</p>}
              </div>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </div>

            {csvData && (
              <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Langue cible</h2>
                </div>
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
                <p className="text-sm text-slate-500 mt-3">{sourceColumnName} (G) vers {destColumnName} (H)</p>
              </div>
            )}

            <div className="bg-slate-800 rounded-xl mb-6 border border-slate-700 overflow-hidden">
              <button onClick={() => setShowSettings(!showSettings)} className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold text-white">Parametres avances</h2>
                </div>
                <ChevronDown className={'w-5 h-5 text-slate-400 transition-transform ' + (showSettings ? 'rotate-180' : '')} />
              </button>
              {showSettings && (
                <div className="p-6 pt-0 border-t border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Ligne de depart</label>
                      <input type="number" min="1" value={startRow} onChange={(e) => setStartRow(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Limite lignes (0=toutes)</label>
                      <input type="number" min="0" value={rowLimit} onChange={(e) => setRowLimit(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Temperature: {temperature}</label>
                      <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Sauvegarde auto: {saveEveryNRows}</label>
                      <input type="range" min="100" max="2000" step="100" value={saveEveryNRows} onChange={(e) => setSaveEveryNRows(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Max RPM: {maxRPM}</label>
                      <input type="number" min="100" max="5000" value={maxRPM} onChange={(e) => setMaxRPM(parseInt(e.target.value) || 4900)} className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Max TPM: {(maxTPM/1000000).toFixed(1)}M</label>
                      <input type="number" min="100000" max="4000000" step="100000" value={maxTPM} onChange={(e) => setMaxTPM(parseInt(e.target.value) || 3500000)} className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {csvData && (
              <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-white">Estimation (tokens exacts)</h2>
                  </div>
                  <button onClick={calculateEstimate} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition">Calculer</button>
                </div>
                {costEstimate && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Cellules</p>
                      <p className="text-xl font-bold text-white">{costEstimate.totalCells?.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Uniques</p>
                      <p className="text-xl font-bold text-white">{costEstimate.uniqueTexts?.toLocaleString()}</p>
                      {costEstimate.duplicatesCount > 0 && <p className="text-xs text-green-400">-{costEstimate.savingsPercent}%</p>}
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Tokens</p>
                      <p className="text-xl font-bold text-white">{(costEstimate.totalTokens/1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Cout / Temps</p>
                      <p className="text-xl font-bold text-green-400"></p>
                      <p className="text-xs text-slate-500">~{costEstimate.estimatedMinutes} min</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {progress && (
          <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Progression</h2>
              <span className="text-2xl font-bold text-blue-400">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-300" style={{ width: progress.percentage + '%' }} />
            </div>
            
            {progress.phase === 'waiting' && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-400 text-sm">Attente {progress.waitingSeconds}s avant prochain batch (limite RPM/TPM)</p>
              </div>
            )}
            
            {progress.duplicatesSaved > 0 && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 mb-4">
                <p className="text-green-400 text-sm">{progress.duplicatesSaved} doublons = {progress.savingsPercent}% economie</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Traduits</p>
                <p className="text-white font-medium">{progress.totalProcessed || 0} / {progress.totalUnique || 0}</p>
              </div>
              <div>
                <p className="text-slate-500">Cellules</p>
                <p className="text-white font-medium">{progress.totalCells || 0}</p>
              </div>
              {progress.rateLimitStats && (
                <>
                  <div>
                    <p className="text-slate-500">RPM</p>
                    <p className="text-white font-medium">{progress.rateLimitStats.requestsThisMinute} / {progress.rateLimitStats.maxRPM}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Minute</p>
                    <p className="text-white font-medium">{progress.rateLimitStats.currentMinute} ({progress.rateLimitStats.secondsRemaining}s)</p>
                  </div>
                </>
              )}
            </div>
            
            {progress.completed && (
              <div className="mt-4 flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Termine!</span>
              </div>
            )}
            
            {partialResult && isProcessing && (
              <button onClick={downloadPartial} className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition">
                <Download className="w-4 h-4" />
                Sauvegarde ({partialResult.completedOps} traduits)
              </button>
            )}
          </div>
        )}

        {!isProcessing && (
          <div className="flex gap-4">
            <button onClick={startProcessing} disabled={!csvData || !apiKey} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition">
              <Play className="w-5 h-5" />
              Lancer la traduction
            </button>
            {result && (
              <button onClick={() => downloadResult()} className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition">
                <Download className="w-5 h-5" />
                Telecharger
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
