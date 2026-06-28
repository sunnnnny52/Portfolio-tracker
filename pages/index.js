import { useState, useEffect } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("trades") || "[]");
    setTrades(data);
  }, []);

  const save = (data) => {
    setTrades(data);
    localStorage.setItem("trades", JSON.stringify(data));
  };

  const addTrade = () => {
    if (!symbol || !qty || !price) return;

    const newTrade = {
      symbol: symbol.toUpperCase(),
      qty: Number(qty),
      price: Number(price),
    };

    const newList = [...trades, newTrade];
    save(newList);

    setSymbol("");
    setQty("");
    setPrice("");
  };

  const getPositions = () => {
    const map = {};

    trades.forEach((t) => {
      if (!map[t.symbol]) map[t.symbol] = { qty: 0, cost: 0 };

      map[t.symbol].qty += t.qty;
      map[t.symbol].cost += t.qty * t.price;
    });

    return Object.keys(map).map((s) => ({
      symbol: s,
      qty: map[s].qty,
      avg: map[s].cost / map[s].qty,
    }));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📊 Portfolio Tracker</h1>

      <input placeholder="Symbol (NVDA)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      <input placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

      <button onClick={addTrade}>Add Trade</button>

      <h2>Trades</h2>
      {trades.map((t, i) => (
        <div key={i}>
          {t.symbol} | {t.qty} @ {t.price}
        </div>
      ))}

      <h2>Positions</h2>
      {getPositions().map((p, i) => (
        <div key={i}>
          {p.symbol} | Qty: {p.qty} | Avg: {p.avg.toFixed(2)}
        </div>
      ))}
    </div>
  );
}