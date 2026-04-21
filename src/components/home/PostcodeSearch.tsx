import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getIcbFromGpOds,
  lookupICBPolicyByIcbCode,
  PostcodeLookupError,
  searchGpPracticesByPostcode
} from '@/services/postcodeService';
import { GpPracticeSummary, ICBPolicy } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

export function PostcodeSearch() {
  const [postcode, setPostcode] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [gpPractices, setGpPractices] = useState<GpPracticeSummary[] | null>(null);
  const [selectedGP, setSelectedGP] = useState<GpPracticeSummary | null>(null);
  const [icbCode, setIcbCode] = useState<string | null>(null);
  const [result, setResult] = useState<ICBPolicy | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setLoadingSearch(true);
    setError('');
    setResult(null);
    setGpPractices(null);
    setSelectedGP(null);
    setIcbCode(null);

    try {
      const gps = await searchGpPracticesByPostcode(postcode);
      if (gps.length > 0) {
        setGpPractices(gps);
      } else {
        setGpPractices([]);
        setError("We couldn't find any active GP practices for that postcode.");
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[PostcodeSearch] gp search failed', err);
      }

      if (err instanceof PostcodeLookupError) {
        if (err.kind === 'timeout') {
          setError('That search took too long. Please try again.');
        } else if (err.kind === 'network') {
          setError('Network error. Check your connection and try again.');
        } else if (err.kind === 'server') {
          setError('The service is temporarily unavailable. Please try again shortly.');
        } else if (err.kind === 'misconfigured') {
          setError('The app is misconfigured. Please contact support.');
        } else {
          setError('An unexpected response was received. Please try again.');
        }
      } else {
        setError('An error occurred while searching. Please try again.');
      }
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectGp = async (gp: GpPracticeSummary) => {
    setSelectedGP(gp);
    setLoadingSelect(true);
    setError('');
    setResult(null);
    setIcbCode(null);

    try {
      const resolvedIcbCode = await getIcbFromGpOds(gp.odsCode);
      if (!resolvedIcbCode) {
        setError("We couldn't determine an ICB for that GP practice.");
        return;
      }

      setIcbCode(resolvedIcbCode);
      const policy = await lookupICBPolicyByIcbCode(resolvedIcbCode);
      if (!policy) {
        setError("We couldn't find an ICB policy for that GP practice.");
        return;
      }

      setResult(policy);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[PostcodeSearch] gp selection failed', err);
      }

      if (err instanceof PostcodeLookupError) {
        if (err.kind === 'timeout') {
          setError('That lookup took too long. Please try again.');
        } else if (err.kind === 'network') {
          setError('Network error. Check your connection and try again.');
        } else if (err.kind === 'server') {
          setError('The service is temporarily unavailable. Please try again shortly.');
        } else if (err.kind === 'misconfigured') {
          setError('The app is misconfigured. Please contact support.');
        } else {
          setError('An unexpected response was received. Please try again.');
        }
      } else {
        setError('An error occurred while searching. Please try again.');
      }
    } finally {
      setLoadingSelect(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <form onSubmit={handleSearch} className="relative flex items-center max-w-md group">
        <div className="relative flex-1">
          <Input 
            placeholder="Enter your postcode (e.g. SE26 5EN)..." 
            className="w-full px-6 py-4 h-14 text-lg font-medium border-2 border-emerald-100 focus-visible:border-emerald-500 focus-visible:ring-0 rounded-xl bg-white shadow-lg transition-all"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loadingSearch || loadingSelect}
          className="absolute right-2 px-6 h-10 bg-emerald-solid hover:bg-emerald-deep text-white font-bold rounded-lg shadow-md transition-all active:scale-95"
        >
          {loadingSearch ? <Loader2 className="w-5 h-5 animate-spin" /> : "Find GP"}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100"
          >
            {error}
          </motion.div>
        )}

        {gpPractices && gpPractices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <Card className="border-none shadow-md overflow-hidden rounded-xl bg-white p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <CardTitle className="text-gray-800 font-bold">Select your GP practice</CardTitle>
                </div>
                {loadingSelect && (
                  <Badge className="bg-emerald-light text-emerald-deep hover:bg-emerald-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading
                    </span>
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {gpPractices.map((gp) => {
                  const isSelected = selectedGP?.odsCode === gp.odsCode;
                  return (
                    <Button
                      key={gp.odsCode}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      disabled={loadingSelect}
                      className="w-full justify-between rounded-lg"
                      onClick={() => handleSelectGp(gp)}
                    >
                      <span className="text-left">
                        <span className="block font-bold">{gp.name}</span>
                        <span className="block text-xs opacity-75">{gp.odsCode}</span>
                      </span>
                      {isSelected && icbCode && (
                        <span className="text-xs opacity-90">ICB {icbCode}</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className="border-none border-l-4 border-l-emerald-500 shadow-md overflow-hidden rounded-xl bg-white p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <CardTitle className="text-gray-800 font-bold">
                    {selectedGP ? selectedGP.name : 'Eligibility Result'}
                  </CardTitle>
                  <div className="text-xs opacity-70 mt-1">
                    {postcode ? `Postcode ${postcode.toUpperCase()}` : null}
                    {icbCode ? ` · ICB ${icbCode}` : null}
                  </div>
                </div>
                <Badge className="bg-emerald-light text-emerald-deep hover:bg-emerald-light text-[0.75rem] font-bold px-2 py-0.5 rounded-full ring-0 border-none">
                  {result.icb_name}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-sage rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Cycles Offered</div>
                  <div className="text-2xl font-black text-sage-text leading-tight">
                    {result.cycles_offered} Full <span className="text-sm font-normal">Cycles</span>
                  </div>
                </div>

                <div className="p-3 bg-sage rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 opacity-70 mb-1">Age Limit</div>
                  <div className="text-2xl font-black text-sage-text leading-tight">
                    Up to {result.max_age}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 border border-dashed border-emerald-300 rounded-lg text-sm text-emerald-900 bg-emerald-50/30 space-y-1">
                <div>
                  <strong>Policy Note:</strong> {result.living_children_rule || 'No policy note recorded'}.
                </div>
                <div>
                  <strong>BMI:</strong>{' '}
                  {result.bmi_min != null || result.bmi_max != null
                    ? `${result.bmi_min ?? '–'} to ${result.bmi_max ?? '–'}`
                    : 'Not specified'}
                </div>
                <div>
                  <strong>IUI rounds required:</strong> {result.iui_rounds_required}
                </div>
                <div>
                  <strong>Wait time (months):</strong>{' '}
                  {result.wait_time_months != null ? result.wait_time_months : 'Unknown'}
                </div>
                <div>
                  <strong>Endometriosis priority:</strong>{' '}
                  {result.endometriosis_priority_access ? 'Yes' : 'No'}
                </div>
                <div className="opacity-75">
                  Updated {new Date(result.updated_at).toLocaleDateString()}
                </div>
              </div>
            </Card>
            
            <div className="flex justify-start">
              <Button variant="link" className="text-emerald-700 font-bold hover:text-emerald-900 p-0 h-auto text-sm">
                View All {42} Resources →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
