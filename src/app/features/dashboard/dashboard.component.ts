import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

interface Investment {
  id: number;
  assetType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  title = "Dashboard";

  // Mock portfolio investments
  investments: Investment[] = [];

  // Derived/aggregated data
  portfolioValue = 0;
  dailyPerformance: { date: string; value: number }[] = [];
  allocationGroups: { key: string; total: number; percent: number }[] = [];

  // Form
  investmentForm: FormGroup;
  review: Investment | null = null;

  constructor(private fb: FormBuilder) {
    this.investmentForm = this.fb.group({
      assetType: ["", [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.0001)]],
      purchasePrice: [null, [Validators.required, Validators.min(0.0001)]],
      purchaseDate: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Seed with mock data
    this.seedMockData();
    this.recompute();
    console.log("Dashboard loaded - investments:", this.investments.length);
  }

  seedMockData() {
    this.investments = [
      {
        id: 1,
        assetType: "Stock",
        quantity: 10,
        purchasePrice: 150,
        purchaseDate: "2024-01-15",
      },
      {
        id: 2,
        assetType: "ETF",
        quantity: 25,
        purchasePrice: 40,
        purchaseDate: "2025-02-10",
      },
      {
        id: 3,
        assetType: "Bond",
        quantity: 5,
        purchasePrice: 1000,
        purchaseDate: "2023-06-01",
      },
    ];

    // Sample daily performance (last 7 days)
    const now = new Date();
    this.dailyPerformance = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      this.dailyPerformance.push({
        date: d.toISOString().slice(0, 10),
        value: 1000 + Math.round(Math.random() * 200 - 100) + i * 2,
      });
    }
  }

  recompute() {
    // Simple portfolio value computation: sum(quantity * purchasePrice)
    this.portfolioValue = this.investments.reduce(
      (sum, inv) => sum + inv.quantity * inv.purchasePrice,
      0
    );
    this.computeAllocation();
  }

  computeAllocation() {
    const map = new Map<string, number>();
    let grandTotal = 0;
    this.investments.forEach((inv) => {
      const v = (inv.quantity || 0) * (inv.purchasePrice || 0);
      grandTotal += v;
      const k = inv.assetType || "Other";
      map.set(k, (map.get(k) || 0) + v);
    });
    this.allocationGroups = Array.from(map.entries()).map(([key, total]) => ({
      key,
      total,
      percent: grandTotal ? Math.round((total / grandTotal) * 100) : 0,
    }));
  }

  addInvestment() {
    if (this.investmentForm.invalid) {
      this.investmentForm.markAllAsTouched();
      return;
    }

    const value: Investment = {
      id: Date.now(),
      assetType: this.investmentForm.value.assetType,
      quantity: +this.investmentForm.value.quantity,
      purchasePrice: +this.investmentForm.value.purchasePrice,
      purchaseDate: this.investmentForm.value.purchaseDate,
    };

    // show review first
    this.review = value;
  }

  confirmAdd() {
    if (!this.review) return;
    this.investments.push(this.review);
    this.review = null;
    this.investmentForm.reset();
    this.recompute();
  }

  cancelReview() {
    this.review = null;
  }

  // Simple SVG path generator for the dailyPerformance (linear scaled)
  getSparklinePath(): string {
    if (!this.dailyPerformance || this.dailyPerformance.length === 0) return "";
    const w = 300;
    const h = 70;
    const pad = 4;
    const vals = this.dailyPerformance.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    return vals
      .map((v, i) => {
        const x = pad + (i * (w - pad * 2)) / (vals.length - 1);
        const y = h - pad - ((v - min) * (h - pad * 2)) / range;
        return (i === 0 ? "M" : "L") + x + " " + y;
      })
      .join(" ");
  }
}
