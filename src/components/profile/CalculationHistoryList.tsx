'use client';

import Link from 'next/link';
import type { PostgrestError } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { roundLot } from '@/lib/calc';
import { useSupabase } from '@/lib/supabase/client';

type HistoryRow = {
  id: string;
  created_at: string;
  instrument_symbol: string;
  pair_category: string;
  direction: string;
  calculation_ok: boolean;
  lot_size: number | null;
  risk_usd: number;
  risk_reward_ratio: number | null;
};

function formatRiskReward(rr: number | null): string {
  if (rr == null || !Number.isFinite(rr) || rr <= 0) return '—';
  return `1:${rr.toFixed(2)}`;
}

export function CalculationHistoryList() {
  const supabase = useSupabase();
  const [rows, setRows] = useState<HistoryRow[] | null>(null);
  const [err, setErr] = useState<PostgrestError | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('calculation_history')
        .select(
          'id, created_at, instrument_symbol, pair_category, direction, calculation_ok, lot_size, risk_usd, risk_reward_ratio',
        )
        .order('created_at', { ascending: false })
        .limit(25);

      if (cancelled) return;
      if (error) {
        setErr(error);
        setRows([]);
      } else {
        setErr(null);
        setRows((data ?? []) as HistoryRow[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  if (err) {
    return (
      <p className="font-mono text-[12px] text-rose-600 leading-relaxed">
        Could not load history ({err.code}). Check Supabase migration and Clerk JWT template.
      </p>
    );
  }

  if (rows === null) {
    return <p className="font-mono text-[12px] text-zinc-500 italic">Loading…</p>;
  }

  if (rows.length === 0) {
    return (
      <p className="font-mono text-[12px] text-zinc-500 italic">
        No calculations yet. Head over to the{' '}
        <Link href="/app" className="underline underline-offset-2 hover:text-zinc-900">
          Analyzer
        </Link>{' '}
        to size your first trade.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white">
      {rows.map((row) => {
        const lot =
          row.lot_size != null && Number.isFinite(row.lot_size) ? roundLot(row.lot_size).toFixed(2) : '—';
        const dateStr = row.created_at
          ? new Date(row.created_at).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—';
        return (
          <li key={row.id} className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <span className="font-mono text-[11px] text-zinc-500 tabular-nums">{dateStr}</span>
              <div className="text-[13px] text-zinc-900 font-medium">
                {row.instrument_symbol}{' '}
                <span className="text-zinc-500 font-normal text-[12px]">· {row.direction}</span>
                {!row.calculation_ok ? (
                  <span className="ml-1.5 text-[11px] text-rose-600 font-mono">invalid setup</span>
                ) : null}
              </div>
            </div>
            <div className="flex gap-4 font-mono text-[12px] tabular-nums text-zinc-700">
              <span>
                Lot <span className="text-zinc-950">{lot}</span>
              </span>
              <span>
                Risk <span className="text-zinc-950">${row.risk_usd.toFixed(2)}</span>
              </span>
              <span>
                R:R <span className="text-zinc-950">{formatRiskReward(row.risk_reward_ratio)}</span>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
