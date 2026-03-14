"use client";


import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FilterListIcon from "@mui/icons-material/FilterList";
import DiamondIcon from "@mui/icons-material/Diamond";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { motion } from "motion/react";

// ─── Static data ─────────────────────────────────────────────────────────────

const RECENT_SEARCHES = ["Naoris Protocol", "BTC", "ETH"];

const TRENDING_COINS = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    color: "#F7931A",
    mcap: "$1.43T",
    futuresVol: "$73.47B",
    spotVol: "$7.14B",
    price: "$71,733.64",
    change: +2.96,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    color: "#627EEA",
    mcap: "$253.28B",
    futuresVol: "$58.52B",
    spotVol: "$3.68B",
    price: "$2,100.63",
    change: +2.9,
  },
  {
    symbol: "SOL",
    name: "Solana",
    color: "#9945FF",
    mcap: "$50.89B",
    futuresVol: "$15.29B",
    spotVol: "$942.59M",
    price: "$89.09",
    change: +4.08,
  },
  {
    symbol: "XRP",
    name: "XRP",
    color: "#00AAE4",
    mcap: "$87.65B",
    futuresVol: "$3.93B",
    spotVol: "$846.63M",
    price: "$1.4315",
    change: +4.0,
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    color: "#C2A633",
    mcap: "$14.95B",
    futuresVol: "$3.29B",
    spotVol: "$339.63M",
    price: "$0.09759",
    change: +5.53,
  },
];

const NANSEN_COMMANDS = [
  { label: "Nansen Profiler", desc: "Analyse any wallet address", shortcut: "Select Command" },
  { label: "Token God Mode", chains: "26 Chains", shortcut: "Select Command" },
  { label: "Wallet Profiler for Token", chains: "25 Chains", shortcut: "Select Command" },
  { label: "Smart Money Flows", desc: "Follow whale activity" },
  { label: "Token Screener", desc: "Filter tokens by metrics" },
];

const FEATURES = [
  { icon: WaterDropIcon, label: "Hyperliquid Whale Tracker" },
  { icon: TrendingUpIcon, label: "Funding Rate" },
  { icon: BoltIcon, label: "Bull Market Peak Indicators" },
  { icon: FilterListIcon, label: "Liquidation" },
  { icon: DiamondIcon, label: "GEMs Filter" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CoinAvatar({ symbol, color }: { symbol: string; color: string }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: `${color}22`,
        border: `1.5px solid ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color, lineHeight: 1 }}>
        {symbol.slice(0, 3)}
      </Typography>
    </Box>
  );
}

function KbdKey({ children }: { children: React.ReactNode }) {
  return <span className="kbd">{children}</span>;
}

// ─── Search Dialog ────────────────────────────────────────────────────────────

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [mode, setMode] = useState<"coinglass" | "nansen">("coinglass");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery("");
      setActiveIdx(-1);
    }
  }, [open]);

  // Keyboard navigation inside dialog
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((p) => p + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((p) => Math.max(-1, p - 1));
      }
    },
    [onClose]
  );

  if (!open) return null;

  const filteredCoins = query
    ? TRENDING_COINS.filter(
        (c) =>
          c.symbol.toLowerCase().includes(query.toLowerCase()) ||
          c.name.toLowerCase().includes(query.toLowerCase())
      )
    : TRENDING_COINS;

  const filteredCommands = query
    ? NANSEN_COMMANDS.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : NANSEN_COMMANDS;

  return (
    <>
      {/* Backdrop */}
      <Box
        className="search-backdrop-enter"
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1300,
        }}
      />

      {/* Dialog */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.98, x: "-50%", y: "-48%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.98, x: "-50%", y: "-48%" }}
        transition={{ duration: 0.2, ease: "easeOut" }}

        className="search-dialog-enter"
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: { xs: "95vw", sm: "90vw", md: "680px" },
          maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
          zIndex: 1301,
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "#0D1117",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onKeyDown={handleKeyDown}
      >
        {/* ── Mode tabs (Coinglass / Nansen) ── */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            px: 1.5,
            pt: 1.25,
            pb: 0,
            flexShrink: 0,
          }}
        >
          {(["coinglass", "nansen"] as const).map((m) => (
            <Box
              key={m}
              onClick={() => setMode(m)}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                fontSize: "0.72rem",
                fontWeight: 600,
                textTransform: "capitalize",
                color: mode === m ? "#E8EDF5" : "#6B7A99",
                backgroundColor: mode === m ? "rgba(255,255,255,0.06)" : "transparent",
                borderBottom: mode === m ? "2px solid #00D99C" : "2px solid transparent",
                transition: "all 0.14s",
                "&:hover": { color: "#C4CDD9" },
              }}
            >
              {m === "coinglass" ? "🔍 Coinglass" : "✦ Nansen"}
            </Box>
          ))}
        </Box>

        {/* ── Search input ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 1.25,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}
        >
          <SearchIcon sx={{ fontSize: 20, color: "#6B7A99", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "coinglass"
                ? "Search coins, metrics, contract addresses"
                : "Search for anything on Nansen"
            }
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#E8EDF5",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />

          {/* Nansen mode: filter button */}
          {mode === "nansen" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
              }}
            >
              <Box sx={{ width: 14, height: 14, borderRadius: "3px", border: "1px solid #6B7A99", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "1px", backgroundColor: "#6B7A99" }} />
              </Box>
              <Typography sx={{ fontSize: "0.74rem", color: "#9CA8BF" }}>All</Typography>
              <Typography sx={{ fontSize: "0.6rem", color: "#4B5A72" }}>▾</Typography>
            </Box>
          )}

          {query && (
            <Box
              onClick={() => setQuery("")}
              sx={{ cursor: "pointer", color: "#6B7A99", "&:hover": { color: "#E8EDF5" }, display: "flex" }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </Box>
          )}

          {!query && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <KbdKey>ESC</KbdKey>
            </Box>
          )}
        </Box>

        {/* ── Scrollable body ── */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>

          {/* ══ COINGLASS MODE ══ */}
          {mode === "coinglass" && (
            <>
              {/* Recent searches */}
              {!query && RECENT_SEARCHES.length > 0 && (
                <Box sx={{ px: 2, mb: 1.5 }}>
                  <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99", fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 0.75 }}>
                    <AccessTimeIcon sx={{ fontSize: 13 }} />
                    Recent Searches
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {RECENT_SEARCHES.map((s) => (
                      <Box
                        key={s}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1.25,
                          py: 0.5,
                          borderRadius: "20px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          backgroundColor: "rgba(255,255,255,0.04)",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.18)" },
                        }}
                        onClick={() => setQuery(s)}
                      >
                        <Box sx={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "rgba(0,217,156,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#00D99C" }} />
                        </Box>
                        <Typography sx={{ fontSize: "0.78rem", color: "#C4CDD9", fontWeight: 500 }}>{s}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Trending */}
              <Box sx={{ px: 2, mb: 0.5 }}>
                <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99", fontWeight: 600, mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 13 }} />
                  Trending Crypto 🔥
                </Typography>
              </Box>

              {filteredCoins.map((coin, i) => (
                <Box
                  key={coin.symbol}
                  className="search-item"
                  data-active={activeIdx === i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.25,
                    cursor: "pointer",
                    borderLeft: activeIdx === i ? "2px solid #00D99C" : "2px solid transparent",
                    backgroundColor: activeIdx === i ? "rgba(0,217,156,0.05)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.035)" },
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <CoinAvatar symbol={coin.symbol} color={coin.color} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#E8EDF5" }}>
                        {coin.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#6B7A99", backgroundColor: "rgba(255,255,255,0.05)", px: 0.75, borderRadius: "4px" }}>
                        {coin.symbol}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99" }}>
                        Mcap: {coin.mcap}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 2 }, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99" }}>
                        Futures Vol:{" "}
                        <span style={{ color: "#9CA8BF" }}>{coin.futuresVol}</span>
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99" }}>
                        Spot Vol:{" "}
                        <span style={{ color: "#9CA8BF" }}>{coin.spotVol}</span>
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#E8EDF5", fontFamily: '"IBM Plex Mono", monospace' }}>
                      {coin.price}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: coin.change >= 0 ? "#00D99C" : "#FF4D6A", fontFamily: '"IBM Plex Mono", monospace' }}>
                      {coin.change >= 0 ? "+" : ""}{coin.change}%
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Features */}
              {!query && (
                <>
                  <Divider sx={{ my: 1.5, mx: 2, borderColor: "rgba(255,255,255,0.05)" }} />
                  <Box sx={{ px: 2, mb: 0.75 }}>
                    <Typography sx={{ fontSize: "0.7rem", color: "#6B7A99", fontWeight: 600, mb: 1 }}>
                      Features
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {FEATURES.map((f) => (
                        <Box
                          key={f.label}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 1.25,
                            py: 0.6,
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.09)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" },
                          }}
                        >
                          <f.icon sx={{ fontSize: 13, color: "#6B7A99" }} />
                          <Typography sx={{ fontSize: "0.75rem", color: "#9CA8BF" }}>{f.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </>
          )}

          {/* ══ NANSEN MODE ══ */}
          {mode === "nansen" && (
            <>
              {/* Command list */}
              {filteredCommands.map((cmd, i) => (
                <Box
                  key={cmd.label}
                  className="search-item"
                  data-active={activeIdx === i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 2,
                    py: 1.1,
                    cursor: "pointer",
                    backgroundColor: activeIdx === i ? "rgba(0,217,156,0.05)" : "transparent",
                    borderLeft: activeIdx === i ? "2px solid #00D99C" : "2px solid transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.035)" },
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 500, color: "#E8EDF5" }}>
                      {cmd.label}
                    </Typography>
                    {cmd.chains && (
                      <Chip
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccountTreeIcon sx={{ fontSize: 10 }} />
                            {cmd.chains}
                          </Box>
                        }
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.68rem",
                          color: "#9CA8BF",
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          "& .MuiChip-label": { px: 0.75 },
                        }}
                      />
                    )}
                    {cmd.desc && (
                      <Typography sx={{ fontSize: "0.73rem", color: "#4B5A72" }}>{cmd.desc}</Typography>
                    )}
                  </Box>
                  <Typography sx={{ fontSize: "0.7rem", color: "#3D4F6B", whiteSpace: "nowrap" }}>
                    Select Command
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Box>

        {/* ── Footer: keyboard shortcuts ── */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.1,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {[
            { keys: ["⌘", "K"], label: "Open Search" },
            { keys: ["⌘", "E"], label: "Open AI Agent" },
            { keys: ["↑", "↓"], label: "Navigate" },
            { keys: ["↵"], label: "Select" },
            { keys: ["ESC"], label: "Close" },
          ].map((s) => (
            <Box key={s.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {s.keys.map((k) => (
                <KbdKey key={k}>{k}</KbdKey>
              ))}
              <Typography sx={{ fontSize: "0.68rem", color: "#4B5A72", ml: 0.25 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}